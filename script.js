document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById("bg-music");
    const navLinks = document.querySelectorAll("nav a");
    const yearSpan = document.getElementById("year");
    const musicControl = document.getElementById("music-control");
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    const nav = document.querySelector("nav");

    // Set current year
    yearSpan.textContent = new Date().getFullYear();

    // Initialize navigation
    nav.style.display = 'block';

    // Handle scroll behavior for navigation
    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when scrolling down
        if (currentScroll > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Audio management
    const AudioManager = {
        sounds: {},
        bgMusic: null,
        currentVolume: 0.1,
        effectsVolume: 0.2,
    
        init() {
            try {
                this.bgMusic = document.getElementById("bg-music");
                if (!this.bgMusic) {
                    console.error("Background music element not found");
                    return;
                }
                this.bgMusic.volume = this.currentVolume;
                this.preloadSounds();
            } catch (error) {
                console.error("Error initializing audio:", error);
            }
        },
    
        preloadSounds() {
            const soundEffects = {
                select: 'audio/select.mp3'
            };
    
            for (const [key, path] of Object.entries(soundEffects)) {
                const audio = new Audio(path);
                audio.volume = this.effectsVolume;
                this.sounds[key] = audio;
            }
        },
    
        playSound(soundKey) {
            if (this.sounds[soundKey]) {
                const sound = this.sounds[soundKey].cloneNode();
                sound.volume = this.effectsVolume;
                sound.play().catch(error => console.error("Error playing sound:", error));
            }
        }
    };

    // Initialize audio
    AudioManager.init();

    // Music controls
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
        try {
            bgMusic.play()
                .then(() => {
                    fadeVolume(0, AudioManager.currentVolume);
                    playIcon.style.display = "none";
                    pauseIcon.style.display = "inline-block";
                })
                .catch(error => {
                    console.error("Error playing music:", error);
                    // Reset icons in case of error
                    playIcon.style.display = "inline-block";
                    pauseIcon.style.display = "none";
                });
        } catch (error) {
            console.error("Error in playMusic:", error);
        }
    }

    function pauseMusic() {
        try {
            fadeVolume(AudioManager.currentVolume, 0);
            setTimeout(() => {
                bgMusic.pause();
                pauseIcon.style.display = "none";
                playIcon.style.display = "inline-block";
            }, 1000);
        } catch (error) {
            console.error("Error in pauseMusic:", error);
        }
    }

    // Add click event listener to music control button
    if (musicControl) {
        musicControl.addEventListener("click", () => {
            if (bgMusic.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });
    }

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (link.getAttribute('href').startsWith('#')) {
                event.preventDefault();
                AudioManager.playSound('select');
        
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                    const offset = window.innerWidth <= 480 ? 100 : navHeight + 40;
                    
                    window.scrollTo({
                        top: targetPosition - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Section animations
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });

    // Side Navigation Scroll Behavior
    const sideNav = document.getElementById('side-nav');
    const header = document.querySelector('header');
    let headerHeight = header.offsetHeight;

    // Update header height on window resize
    window.addEventListener('resize', () => {
        headerHeight = header.offsetHeight;
    });

    // Handle scroll behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > headerHeight) {
            sideNav.classList.add('visible');
        } else {
            sideNav.classList.remove('visible');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('#main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const targetPosition = targetSection.offsetTop - 20; // 20px offset for better positioning

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
});