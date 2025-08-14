class VoiceAssistant {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.isProcessing = false;

        this.recordBtn = document.getElementById('recordBtn');
        this.btnText = document.querySelector('.btn-text');
        this.status = document.getElementById('status');
        this.responseText = document.getElementById('responseText');
        this.responseAudio = document.getElementById('responseAudio');
        this.errorSection = document.getElementById('errorSection');
        this.errorMessage = document.getElementById('errorMessage');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.recordBtn.addEventListener('click', () => {
            if (this.isProcessing) return;

            if (this.isRecording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        });
    }

    async startRecording() {
        try {
            this.hideError();
            console.log('Requesting microphone access...');

            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Your browser does not support microphone access');
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            console.log('Microphone access granted');

            // Check supported MIME types
            let mimeType = 'audio/webm;codecs=opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'audio/webm';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'audio/mp4';
                    if (!MediaRecorder.isTypeSupported(mimeType)) {
                        mimeType = ''; // Use default
                    }
                }
            }

            console.log('Using MIME type:', mimeType || 'default');

            this.mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                console.log('Audio data received:', event.data.size, 'bytes');
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                console.log('Recording stopped, processing...');
                this.processRecording();
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start(1000); // Collect data every 1 second
            this.updateUI('recording');
            console.log('Recording started');

        } catch (error) {
            console.error('Error starting recording:', error);
            let errorMessage = 'Failed to access microphone. ';

            if (error.name === 'NotAllowedError') {
                errorMessage += 'Please allow microphone access and try again.';
            } else if (error.name === 'NotFoundError') {
                errorMessage += 'No microphone found. Please connect a microphone.';
            } else if (error.name === 'NotSupportedError') {
                errorMessage += 'Your browser does not support audio recording.';
            } else {
                errorMessage += error.message;
            }

            this.showError(errorMessage);
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.updateUI('processing');
        }
    }

    async processRecording() {
        try {
            console.log('Processing recording with', this.audioChunks.length, 'chunks');

            if (this.audioChunks.length === 0) {
                throw new Error('No audio data recorded');
            }

            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            console.log('Audio blob size:', audioBlob.size, 'bytes');

            if (audioBlob.size === 0) {
                throw new Error('Audio blob is empty');
            }

            // Convert to base64
            const base64Audio = await this.blobToBase64(audioBlob);
            console.log('Base64 audio length:', base64Audio.length);

            if (!base64Audio || base64Audio.length === 0) {
                throw new Error('Failed to convert audio to base64');
            }

            // Send to backend
            console.log('Sending audio to backend...');
            const response = await fetch('/api/voice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    audioData: base64Audio
                })
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }
            
            const result = await response.json();
            console.log('Server response:', result);

            if (result.success) {
                this.handleResponse(result);
            } else {
                this.showError(result.error || 'Failed to process audio');
            }

        } catch (error) {
            console.error('Error processing recording:', error);
            this.showError('Failed to process recording: ' + error.message);
        } finally {
            this.updateUI('ready');
        }
    }

    async convertToWav(audioBlob) {
        // For now, return the original blob
        // TODO: Add proper WAV conversion if needed
        return audioBlob;
    }

    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    handleResponse(result) {
        // Display text response if available
        if (result.text) {
            this.responseText.textContent = result.text;
        }

        // Play audio response if available
        if (result.audioData && result.mimeType) {
            const audioUrl = `data:${result.mimeType};base64,${result.audioData}`;
            this.responseAudio.src = audioUrl;
            this.responseAudio.style.display = 'block';
            this.responseAudio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        } else if (result.text) {
            // If no audio response, use text-to-speech as fallback
            this.speakText(result.text);
        }
    }

    speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    updateUI(state) {
        this.recordBtn.classList.remove('recording', 'processing');

        switch (state) {
            case 'recording':
                this.isRecording = true;
                this.isProcessing = false;
                this.recordBtn.classList.add('recording');
                this.btnText.textContent = 'Stop Recording';
                this.status.textContent = 'Recording... Click to stop';
                break;

            case 'processing':
                this.isRecording = false;
                this.isProcessing = true;
                this.recordBtn.classList.add('processing');
                this.btnText.textContent = 'Processing...';
                this.status.textContent = 'Processing your request...';
                break;

            case 'ready':
            default:
                this.isRecording = false;
                this.isProcessing = false;
                this.btnText.textContent = 'Start Recording';
                this.status.textContent = 'Ready to record';
                break;
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorSection.style.display = 'block';
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        this.errorSection.style.display = 'none';
    }
}

// Initialize the voice assistant when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const assistant = new VoiceAssistant();

    // Test microphone access on page load
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('Microphone API is supported');
    } else {
        console.error('Microphone API is not supported');
        assistant.showError('Your browser does not support microphone access');
    }
});