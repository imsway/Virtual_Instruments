class DrumRecorder {
    constructor() {
        this.recordedEvents = [];
        this.isRecording = false;
        this.isPaused = false;
        this.startTime = 0;
        this.pauseTime = 0;
        this.totalPauseTime = 0;
        this.isPlaying = false;

        this.drumSoundMap = {
            'crash': 'drums/crash',
            'bass': 'drums/bass',
            'snare-drum': 'drums/snare-drum',
            'snare-stick': 'drums/snare-stick',
            'floor-tom': 'drums/floor-tom',
            'tom-1': 'drums/tom1',
            'tom-2': 'drums/tom2',
            'ride': 'drums/ride',
            'hihat-foot': 'drums/hihat-foot',
            'hihat-open': 'drums/hihat-open',
            'hihat': 'drums/hihat',
        };

        this.keyMap = {
            'W': 'hihat-open',
            'R': 'hihat',
            'C': 'hihat-foot',
            'S': 'snare-drum',
            'D': 'snare-stick',
            'X': 'bass',
            'J': 'floor-tom',
            'G': 'tom-1',
            'H': 'tom-2',
            'Y': 'crash',
            'U': 'ride'
        };

        this.startBtn = document.getElementById('recordStart');
        this.stopBtn = document.getElementById('recordStop');
        this.pauseBtn = document.getElementById('recordPause');
        this.playBtn = document.getElementById('recordPlay');
        this.statusSpan = document.getElementById('recordingStatus');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startRecording());
        this.stopBtn.addEventListener('click', () => this.stopRecording());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.playBtn.addEventListener('click', () => this.playRecording());

        document.querySelectorAll('.drum-btn').forEach(button => {
            button.addEventListener('click', (e) => this.recordDrumHit(e.target.id));
        });

        
        document.addEventListener('keydown', (e) => {
            if (this.isRecording && !this.isPaused) {
                const drumId = this.keyMap[e.key.toUpperCase()];
                if (drumId) {
                    this.recordDrumHit(drumId);
                }
            }
        });
    }

    startRecording() {
        this.recordedEvents = [];
        this.isRecording = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.totalPauseTime = 0;

        this.updateUI('recording');
        this.updateButtonStates(true, false, false, true);
    }

    stopRecording() {
        this.isRecording = false;
        this.isPaused = false;
        this.updateUI('stopped');
        this.updateButtonStates(false, true, true, this.recordedEvents.length === 0);
    }

    togglePause() {
        if (this.isPaused) {
            this.isPaused = false;
            this.totalPauseTime += Date.now() - this.pauseTime;
            this.updateUI('recording');
            this.pauseBtn.textContent = '⏸️';
        } else {
            this.isPaused = true;
            this.pauseTime = Date.now();
            this.updateUI('paused');
            this.pauseBtn.textContent = '⏯️';
        }
    }

    recordDrumHit(drumId) {
        if (this.isRecording && !this.isPaused) {
            const timestamp = Date.now() - this.startTime - this.totalPauseTime;
            this.recordedEvents.push({ drumId, timestamp });
        }
    }
    

    playRecording() {
        if (this.recordedEvents.length === 0 || this.isPlaying) return;

        this.isPlaying = true;
        this.updateButtonStates(true, false, false, true);

        let currentIndex = 0;
        const startTime = performance.now();
        const sortedEvents = [...this.recordedEvents].sort((a, b) => a.timestamp - b.timestamp);

        const playNextEvent = () => {
            if (!this.isPlaying) return;

            const currentTime = performance.now() - startTime;

            while (currentIndex < sortedEvents.length &&
                sortedEvents[currentIndex].timestamp <= currentTime) {
                this.playDrumSound(sortedEvents[currentIndex].drumId);
                currentIndex++;
            }

            if (currentIndex < sortedEvents.length) {
                requestAnimationFrame(playNextEvent);
            } else {
                this.stopPlayback();
            }
        };

        requestAnimationFrame(playNextEvent);
    }

    stopPlayback() {
        this.isPlaying = false;
        this.updateButtonStates(false, true, true, false);
        this.updateUI('stopped');
    }

    playDrumSound(drumId) {
        const drum = document.getElementById(drumId);
        if (!drum) return;

       
        drum.classList.remove('pressed');
        void drum.offsetWidth; 
        drum.classList.add('pressed');
        setTimeout(() => drum.classList.remove('pressed'), 100);

        const soundFile = this.drumSoundMap[drumId];
        if (soundFile) {
            const audio = new Audio(`../sounds/${soundFile}.mp3`);
            audio.currentTime = 0;
            audio.play().catch(error => console.warn('Audio playback failed:', error));
        }
    }

    updateButtonStates(start, stop, pause, play) {
        this.startBtn.disabled = start;
        this.stopBtn.disabled = stop;
        this.pauseBtn.disabled = pause;
        this.playBtn.disabled = play;
    }

    updateUI(state) {
        this.statusSpan.className = 'recording-status';
        switch (state) {
            case 'recording':
                this.statusSpan.textContent = 'Recording...';
                this.statusSpan.classList.add('recording');
                break;
            case 'paused':
                this.statusSpan.textContent = 'Paused';
                this.statusSpan.classList.add('paused');
                break;
            case 'stopped':
                this.statusSpan.textContent = 'Not Recording';
                break;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.drumRecorder = new DrumRecorder();
}); 