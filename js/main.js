const SERVER_URL = `${location.host}/`; // amit-bots.com/
const socketService = new SocketService(`${location.protocol}//${SERVER_URL}`);
const audioService = new AudioService();
const uiService = new UIService(connectToBot, socketService, audioService);
const messageService = new MessageService(uiService);
const videoService = new VideoService();
const botService = new BotService(socketService, uiService, messageService, audioService, videoService);
const speechRecognitionService = new SpeechRecognitionService(uiService);


function connectToBot(botId) {
  botService.connectToBot(botId);
}

function disconnectBot() {
  socketService.disconnect();
}
