const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { WebSocketServer } = require('ws');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// The service port
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Create HTTP server
const server = app.listen(port, () => {
  console.log(`ThriftConnect server listening on port ${port}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  // Handle incoming messages
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      
      // Broadcast message to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Third-party API integration - Affirmations
apiRouter.get('/daily-affirmation', async (req, res) => {
  try {
    const response = await fetch('https://www.affirmations.dev/');
    if (!response.ok) {
      throw new Error('Failed to fetch affirmation');
    }
    const data = await response.json();
    res.json({
      message: data.affirmation,
      timestamp: new Date(),
      source: 'affirmations.dev'
    });
  } catch (error) {
    console.error('Affirmation fetch error:', error);
    res.status(500).json({ 
      message: 'Failed to get daily affirmation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// CreateAuth - create a new user account
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = {
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      token: uuid.v4(),
    };

    await DB.addUser(user);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// GetAuth - authenticate existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth - delete the authentication token
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    user.token = null;
    await DB.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetItems - return all items
apiRouter.get('/items', async (req, res) => {
  const items = await DB.getItems();
  res.send(items);
});

// GetUserItems - return items for authenticated user
apiRouter.get('/items/user', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }
  const items = await DB.getItemsByUser(user._id);
  res.send(items);
});

// CreateItem - create a new item listing
apiRouter.post('/items', async (req, res) => {
  try {
    const user = await DB.getUserByToken(req.cookies[authCookieName]);
    if (!user) {
      res.status(401).send({ msg: 'Unauthorized' });
      return;
    }

    const item = {
      sellerId: user._id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      images: req.body.images || [],
      createdAt: new Date(),
    };

    const createdItem = await DB.addItem(item);
    res.status(201).json(createdItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ msg: 'Failed to create item', error: error.message });
  }
});

// DeleteItem - delete an item
apiRouter.delete('/items/:id', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const deleted = await DB.deleteItem(req.params.id, user._id);
  if (!deleted) {
    res.status(404).send({ msg: 'Item not found or unauthorized' });
    return;
  }

  res.send({ msg: 'Item deleted' });
});

// Auth middleware
const verifyAuth = async (req, res, next) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    req.user = user; // Attach user to request
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Chat endpoints
apiRouter.post('/chat/start', verifyAuth, async (req, res) => {
  const item = await DB.getItem(req.body.itemId);
  if (!item) {
    return res.status(404).send({ msg: 'Item not found' });
  }

  const conversation = {
    id: uuid.v4(),
    itemId: item.id,
    buyerId: req.user.id,
    sellerId: item.sellerId,
    messages: [],
    createdAt: new Date()
  };
  
  await DB.addConversation(conversation);
  res.send(conversation);
});

apiRouter.get('/chat/conversations', verifyAuth, async (req, res) => {
  const userConversations = await DB.getConversations(req.user.id);
  res.send(userConversations);
});

apiRouter.post('/chat/messages', verifyAuth, async (req, res) => {
  const conversation = await DB.getConversation(req.body.conversationId);
  if (!conversation) {
    return res.status(404).send({ msg: 'Conversation not found' });
  }

  if (conversation.buyerId !== req.user.id && conversation.sellerId !== req.user.id) {
    return res.status(403).send({ msg: 'Not authorized to send messages in this conversation' });
  }

  const message = {
    id: uuid.v4(),
    senderId: req.user.id,
    content: req.body.content,
    createdAt: new Date()
  };

  await DB.addMessage(conversation.id, message);
  res.send(message);
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send({ type: err.name, message: err.message });
});

// Default route
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}
