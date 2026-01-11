// CEREBRO DEL REPRODUCTOR DE MÚSICA (GATITO DJ) 

// Este archivo controla todo: reproducir, pausar, cambiar canción, etc.

class CatMusicPlayer {
    constructor() {
        // --- 1. CONFIGURACIÓN INICIAL (MEMORIA) ---
        // Aquí guardamos los datos importantes que el reproductor debe recordar.

        this.audio = new Audio();       // Crea el "motor" de audio invisible del navegador
        this.currentSongIndex = 0;      // ¿Qué número de canción estamos tocando? (Empieza en 0)
        this.isPlaying = false;         // ¿Está sonando ahora mismo? (true/false)
        this.volume = 0.7;              // Volumen inicial al 70%
        this.showPlaylist = false;      // ¿La lista está abierta o cerrada?
        this.isMinimized = false;       // ¿El reproductor está chiquito o grande?

        // --- 2. TU LISTA DE CANCIONES (PLAYLIST) ---
        // ¡Aquí es donde agregas tu propia música!
        // Copia y pega un bloque {} y cambia el título, artista y el link (src).
        this.playlist = [
            {
                title: "Vibras de Gato Relajado",
                artist: "DJ Bigotes",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // Link al archivo mp3
            },
            {
                title: "Ritmo Perfecto",
                artist: "Ritmo Felino",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
            },
            {
                title: "Mezcla de Miau Remix",
                artist: "Colectivo DJ Gatos",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
            },
            {
                title: "Sueños de Hierba Gatera",
                artist: "Ritmos Asombrosos",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
            }
        ];

        // Arrancamos el reproductor
        this.init();
    }

    // --- 3. FUNCIÓN DE ARRANQUE ---
    // Esto se ejecuta automáticamente una sola vez al cargar la página.
    init() {
        this.createPlayer();         // 1. Construye el HTML y lo pone en la página
        this.setupEventListeners();  // 2. Conecta los botones para que hagan caso a los clics
        this.loadSong(0);            // 3. Prepara la primera canción
        this.updateDisplay();        // 4. Escribe el título en la pantallita
    }

    // --- 4. CONSTRUCTOR DE HTML ---
    // Esta función "dibuja" el reproductor en tu página web usando código.
    createPlayer() {
        // Aquí escribimos todo el HTML dentro de una variable de texto
        const playerHTML = `
            <div class="music-player" id="musicPlayer">
                <!-- Botón de la flechita para minimizar -->
                <button class="minimize-btn" id="minimizeBtn" title="Minimizar">▼</button>
                
                <!-- Contenedor de la lista de canciones (Playlist) -->
                <div class="playlist-container" id="playlist">
                    <div class="playlist-header">🐾 Playlist de Michis 🐱</div>
                    <!-- Aquí usamos un bucle para dibujar cada canción de la lista -->
                    ${this.playlist.map((song, index) => `
                        <div class="playlist-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <div>${song.title}</div>
                            <div style="font-size: 0.8em; opacity: 0.8;">${song.artist}</div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Caja principal con botones y texto -->
                <div class="player-container">
                    <!-- Info de texto (Izquierda) -->
                    <div class="song-info">
                        <div class="song-title" id="songTitle">Selecciona una canción</div>
                        <div class="song-artist" id="songArtist">Esperando música...</div>
                        <div class="dj-cats-logo">🐾 DJ Michi en la casa 🐱</div>
                    </div>
                    
                    <!-- Botonera central -->
                    <div class="player-controls">
                        <button class="control-btn" id="prevBtn"><span class="prev-icon"></span></button>
                        <button class="control-btn play-btn" id="playBtn"><span class="play-icon"></span></button>
                        <button class="control-btn" id="nextBtn"><span class="next-icon"></span></button>
                        <button class="playlist-toggle" id="playlistBtn" title="Playlist">🎵</button>
                    </div>
                    
                    <!-- Barra de progreso -->
                    <div class="progress-container">
                        <div class="progress-bar" id="progressBar">
                            <div class="progress-fill" id="progressFill"></div> <!-- Lo que se llena -->
                        </div>
                        <div class="time-display">
                            <span id="currentTime">0:00</span>
                            <span id="totalTime">0:00</span>
                        </div>
                    </div>
                    
                    <!-- Control de volumen (Derecha) -->
                    <div class="volume-container">
                        <span class="volume-icon" id="volumeIcon">🔊</span>
                        <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="70">
                    </div>
                    
                    <!-- Animaciones (Ecualizador y Gato) -->
                    <div class="equalizer" id="equalizer">
                        <div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div>
                    </div>
                    
                    <div class="dancing-cat" id="dancingCat">😸</div>
                </div>
            </div>
        `;

        // Inserta ese HTML al final del cuerpo (body) de tu página
        document.body.insertAdjacentHTML('beforeend', playerHTML);
    }

    // --- 5. "OÍDOS" DEL PROGRAMA (EVENTOS) ---
    // Aquí le decimos qué hacer cuando el usuario toca algo.
    setupEventListeners() {
        // CLICS EN BOTONES
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());     // Play/Pausa
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSong());   // Atras
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSong());       // Adelante
        document.getElementById('playlistBtn').addEventListener('click', () => this.togglePlaylist()); // Ver lista
        document.getElementById('minimizeBtn').addEventListener('click', () => this.toggleMinimize()); // Minimizar

        // BARRA DE PROGRESO (Saltar a un punto de la canción)
        document.getElementById('progressBar').addEventListener('click', (e) => this.seek(e));

        // VOLUMEN
        document.getElementById('volumeSlider').addEventListener('input', (e) => this.setVolume(e.target.value));
        document.getElementById('volumeIcon').addEventListener('click', () => this.toggleMute());

        // CLIC EN UNA CANCIÓN DE LA LISTA
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index); // Lee el número de la canción
                this.loadSong(index); // Carga
                this.play();          // Toca
            });
        });

        // EVENTOS AUTOMÁTICOS DEL AUDIO
        this.audio.addEventListener('timeupdate', () => this.updateProgress()); // Cada segundo que pasa, actualiza la barrita
        this.audio.addEventListener('ended', () => this.nextSong()); // Cuando se acaba la canción, pasa a la siguiente sola
        this.audio.addEventListener('loadedmetadata', () => this.updateDisplay()); // Cuando carga el archivo, muestra la duración total

        // TECLADO (Atajos rápidos)
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName !== 'INPUT') { // Solo si no estás escribiendo en un cuadro de texto
                switch (e.code) {
                    case 'Space': e.preventDefault(); this.togglePlay(); break; // Espacio = Play
                    case 'ArrowLeft': this.previousSong(); break; // Flecha Izq = Atras
                    case 'ArrowRight': this.nextSong(); break;     // Flecha Der = Adelante
                }
            }
        });
    }

    // --- 6. FUNCIONES DE CONTROL DE MÚSICA ---

    // Carga los datos de una canción pero NO le da play todavía
    loadSong(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentSongIndex = index;
            const song = this.playlist[index];
            this.audio.src = song.src; // Le dice al navegador dónde está el archivo de audio
            this.updateDisplay();      // Actualiza el texto
            this.updatePlaylistActive(); // Resalta la canción en la lista
        }
    }

    // El interruptor: Si suena, pausa. Si está pausado, suena.
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    // ¡Acción! Empieza a sonar
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton(); // Cambia el icono ▶️ por ⏸️
            this.startDancing();     // ¡Que baile el gato!
        }).catch(error => {
            // Si algo falla (ej. el link no sirve), avisa en la consola
            console.log('Error al reproducir:', error);
            this.playExampleSound(); // Usa un sonido de prueba para que no se quede mudo
        });
    }

    // Detenerse
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton(); // Cambia el icono ⏸️ por ▶️
        this.stopDancing();      // El gato deja de bailar
    }

    // Ir a la anterior (Retroceder)
    previousSong() {
        // Cálculo matemático: Si es la primera (0), salta a la última. Si no, resta 1.
        const newIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.playlist.length - 1;
        this.loadSong(newIndex);
        if (this.isPlaying) this.play(); // Si estaba sonando, que siga sonando la nueva
    }

    // Ir a la siguiente (Avanzar)
    nextSong() {
        // Cálculo: Si es la última, vuelve a la primera (0). Si no, suma 1.
        const newIndex = this.currentSongIndex < this.playlist.length - 1 ? this.currentSongIndex + 1 : 0;
        this.loadSong(newIndex);
        if (this.isPlaying) this.play();
    }

    // Saltar a un punto específico (cuando haces click en la barra)
    seek(e) {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect(); // Mide la barra
        const percent = (e.clientX - rect.left) / rect.width; // Calcula dónde hiciste click en %
        const newTime = percent * this.audio.duration; // Convierte % a segundos

        if (!isNaN(newTime)) {
            this.audio.currentTime = newTime; // Salta a ese segundo
        }
    }

    // Cambiar volumen
    setVolume(value) {
        this.volume = value / 100; // El audio usa 0.0 a 1.0, el slider usa 0 a 100
        this.audio.volume = this.volume;
        this.updateVolumeIcon();
    }

    // Silencio rápido (Mute)
    toggleMute() {
        if (this.audio.volume > 0) {
            this.audio.volume = 0; // Silencio total
            document.getElementById('volumeSlider').value = 0;
        } else {
            this.audio.volume = this.volume; // Vuelve al nivel anterior
            document.getElementById('volumeSlider').value = this.volume * 100;
        }
        this.updateVolumeIcon();
    }

    // Mostrar/Ocultar Playlist
    togglePlaylist() {
        this.showPlaylist = !this.showPlaylist;
        const playlist = document.getElementById('playlist');
        playlist.classList.toggle('show', this.showPlaylist); // CSS hace la animación
    }

    // --- 7. FUNCIÓN MINIMIZAR ---
    // Hace que el reproductor se vuelva una bolita pequeña
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const player = document.getElementById('musicPlayer');
        const btn = document.getElementById('minimizeBtn');

        // Añade la clase CSS '.minimized' que oculta casi todo y deja solo botones
        player.classList.toggle('minimized', this.isMinimized);

        // Cambia la flechita
        btn.textContent = this.isMinimized ? '▲' : '▼';
        btn.title = this.isMinimized ? 'Maximizar' : 'Minimizar';

        // Si lo haces pequeño, cierra la lista para que no estorbe
        if (this.isMinimized && this.showPlaylist) {
            this.togglePlaylist();
        }
    }

    // ESPACIO PARA INTEGRACIÓN DE API DE MÚSICA
    // Esta función es un placeholder (espacio reservado) para conectar futuras APIs
    async fetchSongsFromAPI() {
        // TODO: Implementar conexión con API de música (ej. Spotify, SoundCloud, YouTube API)
        console.log("Conectando con API de música... (Pendiente)");
    }

    // --- 8. ACTUALIZACIONES VISUALES ---
    // (Estas funciones solo cambian cositas en la pantalla, no lógica de audio)

    updateProgress() {
        if (this.audio.duration) {
            // Calcula cuánto porcentaje de la canción ha pasado
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            document.getElementById('progressFill').style.width = percent + '%'; // Estira la barra rosa

            // Actualiza los numeritos (ej. 1:45)
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
        // Cambia la clase CSS del icono
        icon.className = this.isPlaying ? 'pause-icon' : 'play-icon';
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
        // Resalta la canción actual en la lista
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }

    startDancing() {
        document.getElementById('dancingCat').classList.add('active'); // CSS inicia la animación
        document.getElementById('equalizer').classList.add('active');
    }

    stopDancing() {
        document.getElementById('dancingCat').classList.remove('active'); // CSS detiene la animación
        document.getElementById('equalizer').classList.remove('active');
    }

    // Convierte segundos (ej. 90) a texto legible (ej. "1:30")
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Sonido de prueba (Beep) si no hay canción real
    playExampleSound() {
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

// Inicializar el reproductor justo cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    const player = new CatMusicPlayer();
    console.log("Cargado reproductor de música de gatos 🐱");
});