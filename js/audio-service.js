class AudioService {
  constructor() {
    this.mediaSource = new MediaSource();
    this.audioUrl = URL.createObjectURL(this.mediaSource);
    this.audioElement = new Audio(this.audioUrl);
    this.sourceBuffer = null;
    this.audioChunkQueue = [];
    this.isAudioStarted = false;
    this.initMediaSource();
  }

  initMediaSource() {
    this.mediaSource.addEventListener('sourceopen', () => {
      this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg');
      this.sourceBuffer.addEventListener('updateend', this.appendAudioChunkFromQueue.bind(this));
      this.sourceBuffer.addEventListener('error', () => {
        console.error('SourceBuffer encountered an error');
      });
    });
  }

  appendAudioChunkFromQueue() {
    if (this.sourceBuffer && !this.sourceBuffer.updating && this.audioChunkQueue.length > 0) {
      const { voice } = this.audioChunkQueue.shift();
      this.sourceBuffer.appendBuffer(new Uint8Array(voice));
    }
  }

  appendAudioChunk(voiceObj) {
    this.audioChunkQueue.push(voiceObj);
    this.appendAudioChunkFromQueue();
  }

  setPlaybackRate(rate) {
    this.audioElement.playbackRate = rate;
  }

  playAudio() {
    if (!this.isAudioStarted) {
      this.audioElement.play();
      this.isAudioStarted = true;
    }
  }
}


speedControl.addEventListener('input', function () {
  const rate = this.value;
  audioService.setPlaybackRate(rate);
});

