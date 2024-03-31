class SocketService {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.socket = null;
  }

  connect(chatId) {
    this.socket = io(`${this.serverUrl}?chatId=${chatId}`);

    this.socket.on('connect', () => {
      console.log('Connected to server.');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server.');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(event, handler) {
    if (this.socket) {
      this.socket.on(event, handler);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}



