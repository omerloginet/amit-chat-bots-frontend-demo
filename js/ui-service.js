class UIService {
    constructor(botSelectionCallback, socketService, audioService) {
        this.responseTypeElement = document.getElementById('responseType');
        this.videoContainerElement = document.querySelector('.video-container');
        this.imageElement = document.getElementById('titleBotImage');
        this.titleBotNameElement = document.getElementById('titleBotName');
        this.titleBotImageElement = document.getElementById('titleBotImage');
        this.videoElement1 = document.getElementById('botVideo1');
        this.videoElement2 = document.getElementById('botVideo2');
        this.botVideoBackground = document.getElementById('botVideoBackground');
        this.sendMessageAudio = new Audio('./audio/send.mp3');
        this.botImage = null;
        this.socketService = socketService;
        this.audioService = audioService;
        this.messagesContainer = $('.messages-content');
        this.isReceivingMessage = false;
        this.botSelectionCallback = botSelectionCallback;
        this.attachBotSelectionListener();
        this.optionMapping = {
            text: 'Text only 🧾',
            voice: 'Text and Voice 🔊',
            video: 'Video, Voice and Text 🧍🏻‍♂️',
        };
        this.init();
    }

    init() {
        $(window).on('load', () => {
            this.messagesContainer.mCustomScrollbar();
        });

        $(this.responseTypeElement).on('select2:select', (event) => {
            this.handleResponseTypeChange(event.target.value);
        });

        $('#back').click(() => {
            this.handleBackButton();
        });

        $('.message-submit').click(() => {
            this.insertMessage();
        });

        $(window).on('keydown', (e) => {
            if (e.which === 13) {
                this.insertMessage();
                return false;
            }
        });

    }

    handleBackButton() {
        disconnectBot();
        document.getElementById("choose-bot-container").style.display = "flex";
        document.getElementById("chat").classList.add("display-none");
        $('.mCSB_container').empty();
        this.handleResponseTypeChange("text")
    }

    handleResponseTypeChange(selectedValue) {
        if (selectedValue === "video") {
            this.videoContainerElement.style.display = "flex";
            this.imageElement.style.display = "none";
        } else {
            this.videoContainerElement.style.display = "none";
            this.imageElement.style.display = "flex";
        }
    }

    insertMessage(text = '') {
        let msg = text.trim() || $('.message-input').val().trim();
        if (!msg) {
            return false;
        }

        if (this.isReceivingMessage) {
            return;
        }

        this.setIsReceivingMessage(true);
        this.audioService.playAudio();

        this.socketService.emit("messages", { message: msg, responseType: this.responseTypeElement.value });
        this.sendMessageAudio.play();

        $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
        this.setDate();
        $('.message-input').val(null);
        this.updateScrollbar();
        this.addEmptyBotMessage();
    }

    addEmptyBotMessage() {
        if ($('.message-input').val() !== '') {
            return false;
        }
        $('<div class="message loading new"><figure class="avatar"><img src="' + this.botImage + '" /></figure><span></span></div>').appendTo($('.mCSB_container'));
        this.updateScrollbar();
    }

    addNewDataMessage(data) {
        $('.message.loading').remove();
        $('<div class="message new"><figure class="avatar"><img src="' + this.botImage + '" /></figure><span class="message_data">' + marked.parse(data) + '</span></div>').appendTo($('.mCSB_container')).addClass('new');
        this.setDate();
        this.updateScrollbar();
    }

    changeLastMessage(newContent) {
        const lastMessage = $('.mCSB_container .message.new').last();
        if (lastMessage.length) {
            lastMessage.find('span').html(marked.parse(newContent));
        }
        this.updateScrollbar();
    }

    setDate() {
        const now = new Date();
        $('<div class="timestamp">' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + '</div>').appendTo($('.message:last'));
    }

    updateScrollbar() {
        this.messagesContainer.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
            scrollInertia: 10,
            timeout: 0
        });
    }

    setIsReceivingMessage(isReceiving) {
        this.isReceivingMessage = isReceiving;
    }

    setOptions(options) {
        this.responseTypeElement.innerHTML = '';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = this.optionMapping[option] ?? option;
            this.responseTypeElement.appendChild(opt);
        });
    }

    updateBotUI(bot) {
        this.botImage = bot.image;
        this.videoElement1.src = bot.idleVideo;
        this.videoElement2.src = bot.idleVideo;
        this.botVideoBackground.src = bot.idleVideo;
        this.titleBotNameElement.innerHTML = bot.name;
        this.titleBotImageElement.src = bot.image;
    }

    displayErrorMessage(message) {
        addNewDataMessage(message);
    }

    attachBotSelectionListener() {
        document.querySelectorAll('.choose-bot-button').forEach(button => {
            button.addEventListener('click', () => {
                document.getElementById("choose-bot-container").style.display = "none";
                document.getElementById("chat").classList.remove("display-none");
                const botId = button.getAttribute('data-bot-id');
                this.botSelectionCallback(botId);
            });
        });
    }

}
