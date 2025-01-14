document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById("bg-music");
    const navLinks = document.querySelectorAll("nav a");
    const yearSpan = document.getElementById("year");
    const introSection = document.getElementById("intro");
    const musicControl = document.getElementById("music-control");
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    const gamerTag = document.getElementById("gamer-tag");

    // Enhanced audio management
    const AudioManager = {
        sounds: {},
        bgMusic: bgMusic,
        currentVolume: 0.2,
        
        init() {
            this.bgMusic.volume = this.currentVolume;
            this.preloadSounds();
        },

        preloadSounds() {
            const soundEffects = {
                select: 'audio/select.mp3',
                hover: 'audio/hover.mp3',
                konami: 'audio/konami.mp3',
                achievement: 'audio/achievement.mp3'
            };

            for (const [key, path] of Object.entries(soundEffects)) {
                const audio = new Audio(path);
                audio.volume = 0.5;
                this.sounds[key] = audio;
            }
        },

        playSound(soundKey) {
            if (this.sounds[soundKey]) {
                const sound = this.sounds[soundKey].cloneNode();
                sound.play();
            }
        }
    };

    // Initialize audio
    AudioManager.init();

    // Enhanced music controls with fade effects
    function fadeVolume(from, to, duration = 1000) {
        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = (to - from) / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                return;
            }
            bgMusic.volume = from + (volumeStep * currentStep);
            currentStep++;
        }, stepTime);
    }

    function playMusic() {
        bgMusic.play();
        fadeVolume(0, AudioManager.currentVolume);
        playIcon.style.display = "none";
        pauseIcon.style.display = "inline-block";
    }

    function pauseMusic() {
        fadeVolume(AudioManager.currentVolume, 0);
        setTimeout(() => bgMusic.pause(), 1000);
        pauseIcon.style.display = "none";
        playIcon.style.display = "inline-block";
    }

    // Enhanced navigation with smooth transitions
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            AudioManager.playSound('select');

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Smooth section transition
            document.querySelectorAll("main > section").forEach(section => {
                section.style.opacity = "0";
                section.style.transform = "translateY(20px)";
                setTimeout(() => {
                    section.style.display = "none";
                }, 300);
            });

            setTimeout(() => {
                targetSection.style.display = "block";
                setTimeout(() => {
                    targetSection.style.opacity = "1";
                    targetSection.style.transform = "translateY(0)";
                }, 50);
            }, 300);
        });

        // Enhanced hover effects
        link.addEventListener("mouseover", () => {
            AudioManager.playSound('hover');
            link.style.transform = "scale(1.1) translateY(-2px)";
            link.style.textShadow = "0 0 10px rgba(255,255,255,0.5)";
        });

        link.addEventListener("mouseout", () => {
            link.style.transform = "scale(1) translateY(0)";
            link.style.textShadow = "none";
        });
    });

    // Enhanced Konami Code with visual feedback
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    const konamiProgress = document.createElement('div');
    konamiProgress.className = 'konami-progress';
    document.body.appendChild(konamiProgress);

    document.addEventListener('keydown', (event) => {
        const expectedKey = konamiSequence[konamiCode.length];
        if (event.key === expectedKey) {
            konamiCode.push(event.key);
            konamiProgress.style.width = `${(konamiCode.length / konamiSequence.length) * 100}%`;
            
            if (konamiCode.join('') === konamiSequence.join('')) {
                AudioManager.playSound('konami');
                document.body.classList.add('konami-active');
                setTimeout(() => {
                    document.body.classList.remove('konami-active');
                    konamiProgress.style.width = '0';
                }, 3000);
                konamiCode = [];
            }
        } else {
            konamiCode = [];
            konamiProgress.style.width = '0';
        }
    });

    // Enhanced skill icons interaction
    const skillIcons = document.querySelectorAll(".skills-list li img");
    skillIcons.forEach(icon => {
        icon.addEventListener("mouseover", () => {
            icon.style.transform = "rotate(360deg) scale(1.2)";
            icon.style.filter = "brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))";
        });

        icon.addEventListener("mouseout", () => {
            icon.style.transform = "rotate(0deg) scale(1)";
            icon.style.filter = "none";
        });

        icon.addEventListener("click", () => {
            icon.classList.add('skill-pulse');
            setTimeout(() => icon.classList.remove('skill-pulse'), 1000);
        });
    });

    // Enhanced games with better visuals and feedback
    class Game1 {
        constructor(canvas, timeSpan, targetColorSpan) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.timeSpan = timeSpan;
            this.targetColorSpan = targetColorSpan;
            this.particles = [];
            this.init();
        }

        init() {
            this.startTime = Date.now();
            this.drawTarget();
            this.animate();
        }

        drawTarget() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.dotX = Math.random() * (this.canvas.width - 20) + 10;
            this.dotY = Math.random() * (this.canvas.height - 20) + 10;
            this.dotColor = this.getRandomColor();
            
            // Glowing effect
            const gradient = this.ctx.createRadialGradient(
                this.dotX, this.dotY, 0,
                this.dotX, this.dotY, 15
            );
            gradient.addColorStop(0, this.dotColor);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.beginPath();
            this.ctx.arc(this.dotX, this.dotY, 10, 0, 2 * Math.PI);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawTarget();
            
            // Animate particles
            this.particles = this.particles.filter(particle => {
                particle.update();
                particle.draw(this.ctx);
                return particle.alpha > 0;
            });
            
            requestAnimationFrame(() => this.animate());
        }

        createExplosion(x, y) {
            for (let i = 0; i < 20; i++) {
                this.particles.push(new Particle(x, y, this.dotColor));
            }
        }

        handleClick(x, y) {
            const distance = Math.sqrt((x - this.dotX) ** 2 + (y - this.dotY) ** 2);
            if (distance <= 10) {
                this.createExplosion(this.dotX, this.dotY);
                AudioManager.playSound('select');
                const timeTaken = Date.now() - this.startTime;
                this.timeSpan.textContent = timeTaken;
                this.init();
            }
        }

        getRandomColor() {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = Math.random() * 5 + 2;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * 6 - 3;
            this.alpha = 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.02;
            this.size -= 0.1;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize enhanced games
    const game1 = new Game1(
        document.getElementById("game-1-canvas"),
        document.getElementById("game-1-time"),
        document.getElementById("target-color")
    );

    game1.canvas.addEventListener("click", (event) => {
        const rect = game1.canvas.getBoundingClientRect();
        game1.handleClick(
            event.clientX - rect.left,
            event.clientY - rect.top
        );
    });
});