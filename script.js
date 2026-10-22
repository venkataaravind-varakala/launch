// ============================================================================
// MIRACLE COLLECTIONS - OFFICIAL LAUNCH CONTROLLER
// Simple, Professional & Impressive
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const config = {
        storeUrl: "https://www.miraclecollection.co.in/",
        duration: 10,
        currentCount: 10,
        timerId: null,
        soundEnabled: true
    };

    // DOM Elements
    const launchReadyView = document.getElementById('launch-ready-view');
    const countdownView = document.getElementById('countdown-view');
    const celebrationView = document.getElementById('celebration-view');

    const launchButton = document.getElementById('launch-button');
    const countdownNumber = document.getElementById('countdown-number');
    const countdownMeter = document.getElementById('countdown-meter-bar');
    const countdownStatusText = document.getElementById('countdown-status-text');

    const enterSiteButton = document.getElementById('enter-site-button');
    const liveUrlText = document.getElementById('live-url-text');
    const copyUrlBtn = document.getElementById('copy-url-btn');

    const replayBtn = document.getElementById('replay-btn');
    const boostCrackersBtn = document.getElementById('boost-crackers-btn');

    const muteToggleBtn = document.getElementById('mute-toggle-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const settingStoreUrl = document.getElementById('setting-store-url');
    const settingDuration = document.getElementById('setting-duration');

    const ambientLight = document.getElementById('ambient-light');
    const flashOverlay = document.getElementById('flash-overlay');
    const systemStatusBadge = document.getElementById('system-status-badge');

    // Clean Corporate Launch Status Messages
    const statusMessages = [
        "Website is Officially Live!",
        "Deploying to Global Network...",
        "Final Systems Check: All Green...",
        "Syncing Wholesale & Retail Inventory...",
        "Securing Payment Gateways & 256-Bit SSL...",
        "Connecting High-Speed Edge CDN...",
        "Propagating www.miraclecollection.co.in...",
        "Linking Store Catalogs & Assets...",
        "Verifying Cloud Infrastructure...",
        "Initializing Miracle Collections Core Engine..."
    ];

    function showView(view) {
        launchReadyView.style.display = 'none';
        countdownView.style.display = 'none';
        celebrationView.style.display = 'none';
        countdownView.classList.remove('active');
        celebrationView.classList.remove('active');

        if (view === 'ready') {
            launchReadyView.style.display = 'flex';
        } else if (view === 'countdown') {
            countdownView.style.display = 'flex';
            countdownView.classList.add('active');
        } else if (view === 'celebration') {
            celebrationView.style.display = 'flex';
            celebrationView.classList.add('active');
        }
    }

    // ==========================================
    // 1. Launch Sequence Trigger
    // ==========================================
    launchButton.addEventListener('click', () => {
        window.launchAudio.playButtonClick();
        startCountdown();
    });

    function startCountdown() {
        showView('countdown');
        systemStatusBadge.className = "status-badge";
        systemStatusBadge.innerHTML = '<span class="pulse-dot"></span> COUNTDOWN IN PROGRESS';

        config.currentCount = config.duration;
        updateCountdownUI();

        const totalCircumference = 880; // 2 * PI * 140
        countdownMeter.style.strokeDashoffset = '0';

        config.timerId = setInterval(() => {
            config.currentCount--;

            if (config.currentCount > 0) {
                // Update SVG ring
                const progress = (config.duration - config.currentCount) / config.duration;
                countdownMeter.style.strokeDashoffset = (progress * totalCircumference).toString();

                updateCountdownUI();
                window.launchAudio.playTick(config.currentCount);
            } else {
                clearInterval(config.timerId);
                triggerLiveCelebration();
            }
        }, 1000);

        // First tick
        window.launchAudio.playTick(config.currentCount);
    }

    function updateCountdownUI() {
        countdownNumber.textContent = config.currentCount;
        countdownNumber.classList.remove('tick-boom');
        void countdownNumber.offsetWidth;
        countdownNumber.classList.add('tick-boom');

        const msgIdx = Math.min(config.currentCount, statusMessages.length - 1);
        countdownStatusText.textContent = statusMessages[msgIdx];
    }

    // ==========================================
    // 2. Celebration Climax
    // ==========================================
    function triggerLiveCelebration() {
        // Screen Flash
        flashOverlay.classList.add('active');
        setTimeout(() => flashOverlay.classList.remove('active'), 350);

        // Real Crackers + Real Clapping + Triumphant Chords
        window.launchAudio.playGrandCelebration();

        // Switch to Celebration View
        showView('celebration');
        ambientLight.classList.add('live');

        systemStatusBadge.className = "status-badge live";
        systemStatusBadge.innerHTML = '<span class="pulse-dot"></span> STORE IS LIVE';

        enterSiteButton.href = config.storeUrl;
        liveUrlText.textContent = config.storeUrl;

        startCelebrationVisuals();
    }

    // ==========================================
    // 3. Ambient Particle Background
    // ==========================================
    const pCanvas = document.getElementById('particles-canvas');
    const pCtx = pCanvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * pCanvas.width;
            this.y = Math.random() * pCanvas.height;
            this.radius = Math.random() * 2 + 0.8;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = -Math.random() * 0.4 - 0.15;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.4 ? '#ffd700' : '#ffffff';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y < -10 || this.x < -10 || this.x > pCanvas.width + 10) {
                this.reset();
                this.y = pCanvas.height + 10;
            }
        }
        draw() {
            pCtx.save();
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            pCtx.fillStyle = this.color;
            pCtx.globalAlpha = this.alpha;
            pCtx.fill();
            pCtx.restore();
        }
    }

    for (let i = 0; i < 70; i++) particles.push(new Particle());

    function animateParticles() {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // 4. Fireworks & Confetti
    // ==========================================
    const fwCanvas = document.getElementById('fireworks-canvas');
    const fwCtx = fwCanvas.getContext('2d');
    const cfCanvas = document.getElementById('confetti-canvas');
    const cfCtx = cfCanvas.getContext('2d');

    function resizeVfx() {
        fwCanvas.width = window.innerWidth;
        fwCanvas.height = window.innerHeight;
        cfCanvas.width = window.innerWidth;
        cfCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeVfx);
    resizeVfx();

    let fireworks = [];
    let fireworkParticles = [];
    let confettis = [];
    let celebrationActive = false;

    class Rocket {
        constructor(sx, sy, tx, ty) {
            this.x = sx;
            this.y = sy;
            this.tx = tx;
            this.ty = ty;
            this.speed = 13;
            const angle = Math.atan2(ty - sy, tx - sx);
            this.vx = Math.cos(angle) * this.speed;
            this.vy = Math.sin(angle) * this.speed;
            this.dist = Math.hypot(tx - sx, ty - sy);
            this.traveled = 0;
            this.trail = [];
        }
        update() {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 5) this.trail.shift();
            this.x += this.vx;
            this.y += this.vy;
            this.traveled += this.speed;
            if (this.traveled >= this.dist) {
                explode(this.tx, this.ty);
                return false;
            }
            return true;
        }
        draw() {
            fwCtx.save();
            fwCtx.beginPath();
            fwCtx.strokeStyle = '#ffd700';
            fwCtx.lineWidth = 2.5;
            for (let i = 0; i < this.trail.length; i++) {
                const pt = this.trail[i];
                if (i === 0) fwCtx.moveTo(pt.x, pt.y);
                else fwCtx.lineTo(pt.x, pt.y);
            }
            fwCtx.stroke();
            fwCtx.restore();
        }
    }

    class Spark {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 1.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.decay = Math.random() * 0.018 + 0.012;
        }
        update() {
            this.vx *= 0.96;
            this.vy *= 0.96;
            this.vy += 0.08;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            return this.alpha > 0;
        }
        draw() {
            fwCtx.save();
            fwCtx.beginPath();
            fwCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            fwCtx.fillStyle = this.color;
            fwCtx.globalAlpha = Math.max(0, this.alpha);
            fwCtx.shadowBlur = 6;
            fwCtx.shadowColor = this.color;
            fwCtx.fill();
            fwCtx.restore();
        }
    }

    const goldColors = ['#FFFDF0', '#FFD700', '#FFA000', '#FFFFFF', '#FFB300'];

    function explode(x, y) {
        window.launchAudio.playSingleCracker();
        const color = goldColors[Math.floor(Math.random() * goldColors.length)];
        for (let i = 0; i < 50; i++) {
            fireworkParticles.push(new Spark(x, y, color));
        }
    }

    function shootFirework() {
        const sx = Math.random() * fwCanvas.width * 0.8 + fwCanvas.width * 0.1;
        const sy = fwCanvas.height;
        const tx = sx + (Math.random() - 0.5) * 150;
        const ty = Math.random() * (fwCanvas.height * 0.45) + 60;
        fireworks.push(new Rocket(sx, sy, tx, ty));
    }

    class Confetti {
        constructor(x, y, vx, vy) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
            this.width = Math.random() * 12 + 6;
            this.height = Math.random() * 6 + 4;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 12;
            this.alpha = 1;
        }
        update() {
            this.vx *= 0.98;
            this.vy += 0.16;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotSpeed;
            this.alpha -= 0.004;
            return this.alpha > 0 && this.y < cfCanvas.height + 20;
        }
        draw() {
            cfCtx.save();
            cfCtx.translate(this.x, this.y);
            cfCtx.rotate((this.rotation * Math.PI) / 180);
            cfCtx.fillStyle = this.color;
            cfCtx.globalAlpha = Math.max(0, this.alpha);
            cfCtx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            cfCtx.restore();
        }
    }

    function fireConfetti() {
        for (let i = 0; i < 80; i++) {
            const angleL = -Math.PI / 4 + (Math.random() - 0.5) * 0.5;
            const spdL = Math.random() * 20 + 10;
            confettis.push(new Confetti(20, cfCanvas.height - 20, Math.cos(angleL) * spdL, Math.sin(angleL) * spdL));

            const angleR = (-Math.PI * 3) / 4 + (Math.random() - 0.5) * 0.5;
            const spdR = Math.random() * 20 + 10;
            confettis.push(new Confetti(cfCanvas.width - 20, cfCanvas.height - 20, Math.cos(angleR) * spdR, Math.sin(angleR) * spdR));
        }
    }

    let fwInterval = null;

    function startCelebrationVisuals() {
        celebrationActive = true;
        fireConfetti();

        for (let i = 0; i < 5; i++) {
            setTimeout(() => { if (celebrationActive) shootFirework(); }, i * 350);
        }

        if (fwInterval) clearInterval(fwInterval);
        fwInterval = setInterval(() => {
            if (!celebrationActive) return;
            shootFirework();
        }, 1200);
    }

    function stopCelebrationVisuals() {
        celebrationActive = false;
        if (fwInterval) clearInterval(fwInterval);
    }

    function animateCelebration() {
        fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
        fireworks = fireworks.filter(f => f.update() && (f.draw(), true));
        fireworkParticles = fireworkParticles.filter(p => p.update() && (p.draw(), true));

        cfCtx.clearRect(0, 0, cfCanvas.width, cfCanvas.height);
        confettis = confettis.filter(c => c.update() && (c.draw(), true));

        requestAnimationFrame(animateCelebration);
    }
    animateCelebration();

    // ==========================================
    // 5. Interactive Actions
    // ==========================================
    boostCrackersBtn.addEventListener('click', () => {
        window.launchAudio.playCrackers();
        fireConfetti();
        for (let i = 0; i < 4; i++) setTimeout(shootFirework, i * 250);
    });

    replayBtn.addEventListener('click', () => {
        stopCelebrationVisuals();
        showView('ready');
        ambientLight.classList.remove('live');
        systemStatusBadge.className = "status-badge standby";
        systemStatusBadge.innerHTML = '<span class="pulse-dot"></span> READY TO LAUNCH';
    });

    copyUrlBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(config.storeUrl).then(() => {
            copyUrlBtn.textContent = 'Copied!';
            setTimeout(() => copyUrlBtn.textContent = 'Copy', 2000);
        });
    });

    muteToggleBtn.addEventListener('click', () => {
        config.soundEnabled = !config.soundEnabled;
        window.launchAudio.setMuted(!config.soundEnabled);
        muteToggleBtn.textContent = config.soundEnabled ? '🔊' : '🔇';
    });

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen().catch(() => {});
    });

    settingsBtn.addEventListener('click', () => {
        settingStoreUrl.value = config.storeUrl;
        settingDuration.value = config.duration;
        settingsModal.classList.add('active');
    });

    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));

    saveSettingsBtn.addEventListener('click', () => {
        config.storeUrl = settingStoreUrl.value.trim() || "https://www.miraclecollection.co.in/";
        config.duration = parseInt(settingDuration.value, 10) || 10;
        enterSiteButton.href = config.storeUrl;
        liveUrlText.textContent = config.storeUrl;
        settingsModal.classList.remove('active');
    });
});
