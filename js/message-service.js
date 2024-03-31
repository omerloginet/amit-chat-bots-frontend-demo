class MessageService {
  constructor(uiService) {
    this.uiService = uiService;
    this.buildMessage = null;
  }

  appendMessage(message) {
    if (this.buildMessage == null) {
      this.uiService.addNewDataMessage("");
      this.buildMessage = "";
    }

    this.buildMessage += message?.chunk;
    if (!message?.end) {
      this.uiService.changeLastMessage(this.buildMessage + " ...");
    }
    else if (message?.end) {
      this.uiService.changeLastMessage(this.buildMessage);
      this.buildMessage = null;
      this.uiService.setIsReceivingMessage(false);
    }
  }
}