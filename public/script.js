class SimpleVoiceAssistant {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.isAISpeaking = false;
        this.currentUtterance = null;
        this.autoStopTimeout = null;
        
        this.recordBtn = document.getElementById('recordBtn');
        this.status = document.getElementById('status');
        this.response = document.getElementById('response');
        this.error = document.getElementById('error');
        this.waveAnimation = document.getElementById('waveAnimation');
        this.themeToggle = document.getElementById('themeToggle');
        
        this.initializeEventListeners();
        this.initializeTheme();
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        this.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    initializeEventListeners() {
        // Mouse events
        this.recordBtn.addEventListener('mousedown', () => this.startRecording());
        this.recordBtn.addEventListener('mouseup', () => this.stopRecording());
        this.recordBtn.addEventListener('mouseleave', () => this.stopRecording());
        
        // Touch events for mobile
        this.recordBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startRecording();
        });
        this.recordBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopRecording();
        });
    }
    
    async startRecording() {
        if (this.isRecording) return;
        
        // If AI is speaking, interrupt it (but don't auto-start recording)
        if (this.isAISpeaking) {
            this.interruptAI();
            return; // Exit here, let interrupt handle the recording
        }
        
        try {
            this.hideError();
            this.status.textContent = 'Listening...';
            this.status.classList.add('active');
            this.waveAnimation.classList.add('active');
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
                this.processRecording();
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordBtn.classList.add('recording');
            
        } catch (error) {
            this.showError('Microphone access denied. Please allow microphone access.');
            this.resetUI();
        }
    }
    
    stopRecording() {
        if (!this.isRecording) return;
        
        this.mediaRecorder.stop();
        this.isRecording = false;
        this.recordBtn.classList.remove('recording');
        this.waveAnimation.classList.remove('active');
        this.status.textContent = 'Processing...';
    }
    
    async processRecording() {
        try {
            if (this.audioChunks.length === 0) {
                this.showError('No audio recorded');
                return;
            }
            
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            const base64Audio = await this.blobToBase64(audioBlob);
            
            // Send to backend
            const response = await fetch('/api/voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioData: base64Audio })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayResponse(result.text);
                this.resetUI();
                
                // Use text-to-speech for audio response
                if ('speechSynthesis' in window) {
                    this.speakResponse(result.text);
                }
            } else {
                this.showError(result.error);
            }
            
        } catch (error) {
            this.showError('Failed to process recording: ' + error.message);
        }
    }
    
    displayResponse(text) {
        this.response.classList.remove('empty');
        this.response.innerHTML = `
            <div class="response-header">
                <span class="response-icon">🤖</span>
                <span class="response-title">AI Assistant</span>
            </div>
            <div class="response-content">${text}</div>
        `;
        this.response.classList.add('new-message');
        setTimeout(() => {
            this.response.classList.remove('new-message');
        }, 500);
        
        // Scroll to top of response
        this.response.scrollTop = 0;
    }
    
    resetUI() {
        this.status.textContent = 'Ready to listen';
        this.status.classList.remove('active');
        this.waveAnimation.classList.remove('active');
        this.recordBtn.classList.remove('ai-speaking');
        this.recordBtn.querySelector('.btn-text').textContent = 'TALK';
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
    
    showError(message) {
        this.error.textContent = message;
        this.error.style.display = 'block';
        this.resetUI();
        setTimeout(() => this.hideError(), 5000);
    }
    
    hideError() {
        this.error.style.display = 'none';
    }
    
    speakResponse(text) {
        // Stop any current speech
        if (this.currentUtterance) {
            speechSynthesis.cancel();
        }
        
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.rate = 1.1;
        this.currentUtterance.pitch = 1.0;
        
        // Track AI speaking state
        this.currentUtterance.onstart = () => {
            this.isAISpeaking = true;
            this.status.textContent = 'AI speaking... (Hold button to interrupt)';
            this.status.classList.add('active');
            this.recordBtn.classList.add('ai-speaking');
            this.recordBtn.querySelector('.btn-text').textContent = 'INTERRUPT';
        };
        
        this.currentUtterance.onend = () => {
            this.isAISpeaking = false;
            this.resetUI();
        };
        
        this.currentUtterance.onerror = () => {
            this.isAISpeaking = false;
            this.resetUI();
        };
        
        speechSynthesis.speak(this.currentUtterance);
    }
    
    async interruptAI() {
        console.log('🛑 Interrupting AI...');
        
        // Stop speech synthesis immediately
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        // Reset AI speaking state
        this.isAISpeaking = false;
        this.currentUtterance = null;
        
        // Add visual feedback for interruption
        this.response.style.opacity = '0.5';
        setTimeout(() => {
            this.response.style.opacity = '1';
        }, 300);
        
        // Start recording directly (bypass the startRecording checks)
        try {
            this.hideError();
            this.status.textContent = 'Interrupted - Now listening...';
            this.status.classList.add('active');
            this.waveAnimation.classList.add('active');
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
                this.processRecording();
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordBtn.classList.add('recording');
            this.recordBtn.classList.remove('ai-speaking');
            this.recordBtn.querySelector('.btn-text').textContent = 'TALK';
            
        } catch (error) {
            this.showError('Failed to start recording after interrupt: ' + error.message);
            this.resetUI();
        }
    }
}

// Initialize the voice assistant when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SimpleVoiceAssistant();
});