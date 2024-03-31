class VideoService {
    constructor() {
        this.isPlaying = false;
        this.videoChunkQueue = [];
        this.videoTurn = true;
        this.videoElements = {
            video1: document.getElementById('botVideo1'),
            video2: document.getElementById('botVideo2'),
        };
        this.showIdle();
        this.speedControl = document.getElementById('speedControl');
        this.playbackRate = 1;
        this.initSpeedControl();
    }

    initSpeedControl() {
        this.speedControl.addEventListener('input', () => {
            const rate = this.speedControl.value;
            this.playbackRate = rate;
            this.setPlaybackRate(rate);
        });
    }

    setPlaybackRate(rate) {
        Object.values(this.videoElements).forEach(videoElement => {
            videoElement.playbackRate = rate;
        });
    }

    showIdle() {
        this.videoElements.video1.style.opacity = '0';
        this.videoElements.video2.style.opacity = '0';
    }

    pushVideo(videoObj) {
        const videoBlob = this.base64ToBlob(videoObj.video, 'video/mp4');
        if (videoBlob) {
            this.videoChunkQueue.push({ text: videoObj.text, video: videoBlob, end: videoObj.end });
            this.playVideo();
        }
    }

    playVideo() {
        if (this.videoChunkQueue.length > 0) {
            if (!this.isPlaying) {
                this.isPlaying = true;
                const { video } = this.videoChunkQueue.shift();

                const url = URL.createObjectURL(video);
                const currentVideoElement = this.videoTurn ? this.videoElements.video1 : this.videoElements.video2;
                const nextVideoElement = this.videoTurn ? this.videoElements.video2 : this.videoElements.video1;
                this.playNextVideo(currentVideoElement, nextVideoElement, url);
                this.videoTurn = !this.videoTurn;
            }
        }
        else {
            this.showIdle();
        }
    }

    playNextVideo(currentVideoElement, nextVideoElement, url) {
        nextVideoElement.src = url;
        nextVideoElement.playbackRate = this.playbackRate;
        nextVideoElement.style.opacity = '1';
        currentVideoElement.style.opacity = '0';

        nextVideoElement.onended = () => {
            this.isPlaying = false;
            this.playVideo();
            URL.revokeObjectURL(url);
        };
    }

    base64ToBlob(base64, mimeType) {
        if (!base64) return null;
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);

        return new Blob([byteArray], { type: mimeType });
    }
}
