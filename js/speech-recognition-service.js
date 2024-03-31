class SpeechRecognitionService {
    constructor(uiService) {
        this.uiService = uiService;
        this.recognition = this.initSpeechRecognition();
        this.askedPermission = false;
        this.setupRecognition();
    }

    initSpeechRecognition() {
        return new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    }

    setupRecognition() {
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 5;



        $('.speak-button').click(() => {
            if (this.askedPermission) {
                this.listenToUser();
            } else {
                this.askMicPermission();
            }
        });
    }

    listenToUser() {
        $('.speak-button').html("Listening...");
        this.recognition.start();
        const timer = setTimeout(() => {
            $('.speak-button').html("Press To Speak");
        }, 4000);

        this.recognition.onresult = (event) => {
            const msg = event.results[0][0].transcript;
            if (msg.trim().length > 0) {
                this.uiService.insertMessage(msg);
            }
            $('.speak-button').html("Press To Speak");
        };

        this.recognition.onend = () => {
            clearTimeout(timer);
            $('.speak-button').html("Press To Speak");
        };
    }

    askMicPermission() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                console.log('Microphone access granted');
                this.askedPermission = true;
                this.listenToUser();
            })
            .catch((err) => {
                console.error('Could not access the microphone:', err);
            });
    }
}
