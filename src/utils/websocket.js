class WebSocketClient {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.messageHandlers = new Set();
  }

  connect() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.connected = true;
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.connected = false;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Handle ping messages from server
    this.socket.on('ping', () => {
      this.socket.pong();
    });
  }

  send(message) {
    if (this.connected && this.socket) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const webSocketClient = new WebSocketClient(); 