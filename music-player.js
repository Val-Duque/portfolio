// Reproductor de música temático de gato 🐱🎵
class CatMusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.volume = 0.7;
        this.showPlaylist = false;
        
        // Lista de canciones de ejemplo (puedes cambiar estas por tus propias canciones)
        this.playlist = [
            {
                title: "Chill Cat Vibes",
                artist: "DJ Whiskers",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // Ejemplo
            },
            {
                title: "Purr-fect Beat", 
                artist: "Feline Groove",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // Ejemplo
            },
            {
                title: "Meow Mix Remix",
                artist: "DJ Cats Collective",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // Ejemplo
            },
            {
                title: "Catnip Dreams",
                artist: "Paw-some Beats",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // Ejemplo
            }
        ];
        
        this.init();
    }
    
    init() {
        this.createPlayer();
        this.setupEventListeners();
        this.loadSong(0);
        this.updateDisplay();
    }
    
    createPlayer() {
        const playerHTML = `
            <div class="music-player">
                <div class="playlist-container" id="playlist">
                    <div class="playlist-header">🐾 Playlist de Michis 🐱</div>
                    ${this.playlist.map((song, index) => `
                        <div class="playlist-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <div>${song.title}</div>
                            <div style="font-size: 0.8em; opacity: 0.8;">${song.artist}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="player-container">
                    <div class="song-info">
                        <div class="song-title" id="songTitle">Selecciona una canción</div>
                        <div class="song-artist" id="songArtist">Esperando música...</div>
                        <div class="dj-cats-logo">🐾 DJ Michi en la casa 🐱</div>
                    </div>
                    
                    <div class="player-controls">
                        <button class="control-btn" id="prevBtn">
                            <span class="prev-icon"></span>
                        </button>
                        
                        <button class="control-btn play-btn" id="playBtn">
                            <span class="play-icon"></span>
                        </button>
                        
                        <button class="control-btn" id="nextBtn">
                            <span class="next-icon"></span>
                        </button>
                        
                        <button class="playlist-toggle" id="playlistBtn" title="Playlist">
                            🎵
                        </button>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-bar" id="progressBar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                        <div class="time-display">
                            <span id="currentTime">0:00</span>
                            <span id="totalTime">0:00</span>
                        </div>
                    </div>
                    
                    <div class="volume-container">
                        <span class="volume-icon" id="volumeIcon">🔊</span>
                        <input type="range" class="volume-slider" id="volumeSlider" 
                               min="0" max="100" value="70">
                    </div>
                    
                    <!-- Ecualizador visual -->
                    <div class="equalizer" id="equalizer">
                        <div class="eq-bar"></div>
                        <div class="eq-bar"></div>
                        <div class="eq-bar"></div>
                        <div class="eq-bar"></div>
                        <div class="eq-bar"></div>
                    </div>
                    
                    <div class="dancing-cat" id="dancingCat">😸</div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', playerHTML);
    }
    
    setupEventListeners() {
        // Controles principales
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSong());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSong());
        document.getElementById('playlistBtn').addEventListener('click', () => this.togglePlaylist());
        
        // Barra de progreso
        document.getElementById('progressBar').addEventListener('click', (e) => this.seek(e));
        
        // Control de volumen
        document.getElementById('volumeSlider').addEventListener('input', (e) => this.setVolume(e.target.value));
        document.getElementById('volumeIcon').addEventListener('click', () => this.toggleMute());
        
        // Lista de reproducción
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.loadSong(index);
                this.play();
            });
        });
        
        // Eventos del audio
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextSong());
        this.audio.addEventListener('loadedmetadata', () => this.updateDisplay());
        
        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName !== 'INPUT') {
                switch(e.code) {
                    case 'Space':
                        e.preventDefault();
                        this.togglePlay();
                        break;
                    case 'ArrowLeft':
                        this.previousSong();
                        break;
                    case 'ArrowRight':
                        this.nextSong();
                        break;
                }
            }
        });
    }
    
    loadSong(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentSongIndex = index;
            const song = this.playlist[index];
            this.audio.src = song.src;
            this.updateDisplay();
            this.updatePlaylistActive();
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.startDancing();
        }).catch(error => {
            console.log('Error al reproducir:', error);
            // Si hay error, usar un sonido de ejemplo
            this.playExampleSound();
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
        this.stopDancing();
    }
    
    previousSong() {
        const newIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.playlist.length - 1;
        this.loadSong(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    nextSong() {
        const newIndex = this.currentSongIndex < this.playlist.length - 1 ? this.currentSongIndex + 1 : 0;
        this.loadSong(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    seek(e) {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * this.audio.duration;
        
        if (!isNaN(newTime)) {
            this.audio.currentTime = newTime;
        }
    }
    
    setVolume(value) {
        this.volume = value / 100;
        this.audio.volume = this.volume;
        this.updateVolumeIcon();
    }
    
    toggleMute() {
        if (this.audio.volume > 0) {
            this.audio.volume = 0;
            document.getElementById('volumeSlider').value = 0;
        } else {
            this.audio.volume = this.volume;
            document.getElementById('volumeSlider').value = this.volume * 100;
        }
        this.updateVolumeIcon();
    }
    
    togglePlaylist() {
        this.showPlaylist = !this.showPlaylist;
        const playlist = document.getElementById('playlist');
        playlist.classList.toggle('show', this.showPlaylist);
    }
    
    updateProgress() {
        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            document.getElementById('progressFill').style.width = percent + '%';
            
            document.getElementById('currentTime').textContent = this.formatTime(this.audio.currentTime);
            document.getElementById('totalTime').textContent = this.formatTime(this.audio.duration);
        }
    }
    
    updateDisplay() {
        const song = this.playlist[this.currentSongIndex];
        document.getElementById('songTitle').textContent = song.title;
        document.getElementById('songArtist').textContent = song.artist;
    }
    
    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        const icon = playBtn.querySelector('span');
        
        if (this.isPlaying) {
            icon.className = 'pause-icon';
        } else {
            icon.className = 'play-icon';
        }
    }
    
    updateVolumeIcon() {
        const volumeIcon = document.getElementById('volumeIcon');
        if (this.audio.volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (this.audio.volume < 0.5) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }
    
    updatePlaylistActive() {
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }
    
    startDancing() {
        document.getElementById('dancingCat').classList.add('active');
        document.getElementById('equalizer').classList.add('active');
    }
    
    stopDancing() {
        document.getElementById('dancingCat').classList.remove('active');
        document.getElementById('equalizer').classList.remove('active');
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Función para reproducir sonido de ejemplo si no hay archivos de audio
    playExampleSound() {
        // Crear un tono simple usando Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Nota A4
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
        
        this.isPlaying = true;
        this.updatePlayButton();
        this.startDancing();
        
        setTimeout(() => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.stopDancing();
        }, 500);
    }
}

// Inicializar el reproductor cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const player = new CatMusicPlayer();
    
    console.log(`
🎧 DJ Cats Music Player iniciado! 🐱
    
Controles:
- Barra espaciadora: Play/Pause
- Flecha izquierda: Canción anterior  
- Flecha derecha: Siguiente canción
- Click en la barra de progreso: Saltar a posición
- Click en 🎵: Mostrar/ocultar playlist

¡Agrega tus propias canciones editando el array 'playlist' en music-player.js!
¡Disfruta la música con estilo! 🎶
    `);
});