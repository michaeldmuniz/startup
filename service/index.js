const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

// Store data in memory (TODO: Replace with MongoDB)
let users = [];
let items = [];
let conversations = [];

// The service port
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Create a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Email already registered' });
  } else {
    const user = await createUser(req.body.email, req.body.password, req.body.username);
    setAuthCookie(res, user.token);
    res.send({ 
      email: user.email,
      username: user.username 
    });
  }
});

// Login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ 
        email: user.email,
        username: user.username 
      });
      return;
    }
  }
  res.status(401).send({ msg: 'Invalid email or password' });
});

// Logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Auth middleware
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user; // Attach user to request
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Items endpoints
apiRouter.get('/items', async (req, res) => {
  res.send(items);
});

apiRouter.post('/items', verifyAuth, async (req, res) => {
  const item = {
    id: uuid.v4(),
    sellerId: req.user.id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    images: req.body.images || [],
    createdAt: new Date(),
    status: 'available'
  };
  items.push(item);
  res.send(item);
});

apiRouter.get('/items/:id', async (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (item) {
    const seller = await findUser('id', item.sellerId);
    res.send({
      ...item,
      seller: {
        username: seller.username,
        email: seller.email
      }
    });
  } else {
    res.status(404).send({ msg: 'Item not found' });
  }
});

// Chat endpoints
apiRouter.post('/chat/start', verifyAuth, async (req, res) => {
  const item = items.find(i => i.id === req.body.itemId);
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
  
  conversations.push(conversation);
  res.send(conversation);
});

apiRouter.get('/chat/conversations', verifyAuth, async (req, res) => {
  const userConversations = conversations.filter(
    c => c.buyerId === req.user.id || c.sellerId === req.user.id
  );
  res.send(userConversations);
});

apiRouter.post('/chat/messages', verifyAuth, async (req, res) => {
  const conversation = conversations.find(c => c.id === req.body.conversationId);
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

  conversation.messages.push(message);
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

// User functions
async function createUser(email, password, username) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuid.v4(),
    email: email,
    password: passwordHash,
    username: username,
    token: uuid.v4(),
    createdAt: new Date()
  };
  users.push(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return users.find((u) => u[field] === value);
}

// Auth cookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`ThriftConnect server listening on port ${port}`);
});
