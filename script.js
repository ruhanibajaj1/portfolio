// Sound System
class SoundManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isMuted = false;
        this.init();
    }

    init() {
        document.getElementById('soundControl').addEventListener('click', () => this.toggle());
    }

    playTone(frequency, duration, type = 'sine') {
        if (this.isMuted) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playClick() {
        this.playTone(600, 0.1);
    }

    playHover() {
        this.playTone(800, 0.05);
    }

    playSuccess() {
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, 0.2), index * 100);
        });
    }

    toggle() {
        this.isMuted = !this.isMuted;
        const btn = document.getElementById('soundControl');
        btn.classList.toggle('muted');
        btn.querySelector('.sound-icon').textContent = this.isMuted ? '🔇' : '🔊';
    }
}

// Initialize Sound Manager
const soundManager = new SoundManager();

// Add sound to buttons and interactive elements
document.querySelectorAll('[data-sound]').forEach(el => {
    const soundType = el.getAttribute('data-sound');
    
    if (soundType === 'click') {
        el.addEventListener('click', () => soundManager.playClick());
    } else if (soundType === 'hover') {
        el.addEventListener('mouseenter', () => soundManager.playHover());
    }
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        soundManager.playClick();
        
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.work-item, .skill-card, .project-small').forEach(el => {
    observer.observe(el);
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const scrollY = window.scrollY;

    orbs.forEach((orb, index) => {
        const speed = 0.5 + index * 0.1;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// Mouse move effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    document.querySelectorAll('.floating-card').forEach((card, index) => {
        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;
        card.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

console.log('✨ Portfolio loaded with interactive sounds and animations!');
