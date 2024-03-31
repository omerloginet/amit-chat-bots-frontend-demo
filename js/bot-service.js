class BotService {
    constructor(socketService, uiService, messageService, audioService, videoService) {
        this.socketService = socketService;
        this.uiService = uiService;
        this.messageService = messageService;
        this.audioService = audioService;
        this.videoService = videoService;
    }

    async connectToBot(botId) {
        try {
            const response = await fetch(`${location.protocol}//${SERVER_URL}chats`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ botId }),
            });
            const data = await response.json();
            this.uiService.setOptions(data.bot.supportedResponseTypes);
            this.uiService.updateBotUI(data.bot);
            const chatId = data.chatId;
            this.socketService.connect(chatId);
            this.initializeSocketListeners();
        } catch (error) {
            console.error('Error connecting to bot:', error);
            this.uiService.displayErrorMessage("Sorry, The server is closed. See you later...");
        }
    }

    initializeSocketListeners() {
        this.socketService.on('text', (message) => this.messageService.appendMessage(message));
        this.socketService.on('voice', (voice) => this.audioService.appendAudioChunk(voice));
        this.socketService.on('video', (video) => this.videoService.pushVideo(video));
    }
}