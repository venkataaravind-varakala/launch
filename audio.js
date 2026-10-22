// ============================================================================
// MIRACLE COLLECTIONS - CLEAN PROFESSIONAL CELEBRATION AUDIO
// Authentic Firecrackers, Real Crowd Clapping, and Deep Cinematic Countdown
// ============================================================================

class LaunchAudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.applauseBuffer = null;
        this.crackerBuffer = null;
        this.isReady = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this.isReady) {
            this.buildBuffers();
            this.isReady = true;
        }
    }

    setMuted(muted) {
        this.muted = muted;
    }

    buildBuffers() {
        this.applauseBuffer = this.createApplauseBuffer(7.0);
        this.crackerBuffer = this.createCrackerBuffer(4.0);
    }

    // Authentic Crowd Applause Simulation (Hundreds of natural palm claps)
    createApplauseBuffer(duration) {
        const sr = this.ctx.sampleRate;
        const total = Math.floor(sr * duration);
        const buffer = this.ctx.createBuffer(2, total, sr);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);

        const numClaps = Math.floor(duration * 120);
        for (let c = 0; c < numClaps; c++) {
            const startT = Math.pow(Math.random(), 0.8) * (duration - 0.3);
            const startIdx = Math.floor(startT * sr);
            const clapLen = Math.floor((0.016 + Math.random() * 0.016) * sr);

            const pan = Math.random();
            const panL = Math.cos(pan * Math.PI * 0.5);
            const panR = Math.sin(pan * Math.PI * 0.5);

            let vol = 0.15 + Math.random() * 0.35;
            if (startT < 0.8) vol *= (0.4 + startT * 0.75);
            if (startT > duration - 2.0) vol *= Math.max(0.1, (duration - startT) / 2.0);

            let prev = 0;
            for (let j = 0; j < clapLen; j++) {
                const idx = startIdx + j;
                if (idx >= total) break;
                const env = Math.exp(-j / (sr * 0.0035));
                const noise = Math.random() * 2 - 1;
                const val = (noise - prev * 0.4) * env * vol;
                prev = noise;
                left[idx] += val * panL;
                right[idx] += val * panR;
            }
        }

        // Soft clip
        for (let i = 0; i < total; i++) {
            left[i] = Math.tanh(left[i] * 1.2) * 0.85;
            right[i] = Math.tanh(right[i] * 1.2) * 0.85;
        }

        return buffer;
    }

    // Authentic Firecrackers Salvo (Rapid-fire celebration crackers)
    createCrackerBuffer(duration) {
        const sr = this.ctx.sampleRate;
        const total = Math.floor(sr * duration);
        const buffer = this.ctx.createBuffer(2, total, sr);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);

        const numPops = 50;
        for (let p = 0; p < numPops; p++) {
            const t = 0.08 + (p / numPops) * (duration - 0.5) + (Math.random() - 0.5) * 0.07;
            if (t < 0 || t >= duration - 0.3) continue;
            const startIdx = Math.floor(t * sr);

            const pan = Math.random();
            const panL = Math.cos(pan * Math.PI * 0.5);
            const panR = Math.sin(pan * Math.PI * 0.5);

            const isBig = (p % 6 === 0);
            const gain = isBig ? 1.0 : (0.45 + Math.random() * 0.4);

            // 1. Supersonic Snap (< 1.5ms)
            const snapLen = Math.floor(0.006 * sr);
            for (let j = 0; j < snapLen; j++) {
                const idx = startIdx + j;
                if (idx >= total) break;
                const spike = (Math.random() * 2 - 1) * Math.exp(-j / (sr * 0.0015)) * gain;
                left[idx] += spike * panL;
                right[idx] += spike * panR;
            }

            // 2. Explosive Thump (60-120Hz)
            const thumpLen = Math.floor((isBig ? 0.3 : 0.12) * sr);
            const freq = isBig ? 65 : (85 + Math.random() * 40);
            for (let j = 0; j < thumpLen; j++) {
                const idx = startIdx + j;
                if (idx >= total) break;
                const progress = j / sr;
                const wave = Math.sin(progress * 2 * Math.PI * freq);
                const thumpEnv = Math.exp(-progress * (isBig ? 10.0 : 20.0)) * (isBig ? 0.7 : 0.35);
                left[idx] += wave * thumpEnv * panL;
                right[idx] += wave * thumpEnv * panR;
            }

            // 3. Crackle sparks
            const crackleLen = Math.floor((0.06 + Math.random() * 0.15) * sr);
            const sparkCount = Math.floor(12 + Math.random() * 20);
            for (let s = 0; s < sparkCount; s++) {
                const offset = Math.floor(Math.random() * crackleLen);
                const sparkIdx = startIdx + offset;
                const microLen = Math.floor(0.0015 * sr);
                const sparkVol = (0.15 + Math.random() * 0.2) * gain;
                for (let k = 0; k < microLen; k++) {
                    const idx = sparkIdx + k;
                    if (idx >= total) break;
                    const val = (Math.random() * 2 - 1) * Math.exp(-k / (sr * 0.0004)) * sparkVol;
                    left[idx] += val * panL;
                    right[idx] += val * panR;
                }
            }
        }

        // Soft clip
        for (let i = 0; i < total; i++) {
            left[i] = Math.tanh(left[i] * 1.1) * 0.9;
            right[i] = Math.tanh(right[i] * 1.1) * 0.9;
        }

        return buffer;
    }

    // Play Crowd Applause
    playApplause() {
        if (this.muted) return;
        this.init();
        if (!this.applauseBuffer) return;

        const source = this.ctx.createBufferSource();
        source.buffer = this.applauseBuffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.9, this.ctx.currentTime);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
    }

    // Play Firecracker Salvo
    playCrackers() {
        if (this.muted) return;
        this.init();
        if (!this.crackerBuffer) return;

        const source = this.ctx.createBufferSource();
        source.buffer = this.crackerBuffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.95, this.ctx.currentTime);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
    }

    // Single Cracker Burst for Fireworks
    playSingleCracker() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Snap
        const snapLen = Math.floor(this.ctx.sampleRate * 0.005);
        const snapBuf = this.ctx.createBuffer(1, snapLen, this.ctx.sampleRate);
        const data = snapBuf.getChannelData(0);
        for (let i = 0; i < snapLen; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (snapLen * 0.25));
        }
        const snap = this.ctx.createBufferSource();
        snap.buffer = snapBuf;
        const snapGain = this.ctx.createGain();
        snapGain.gain.setValueAtTime(0.7, now);
        snap.connect(snapGain);
        snapGain.connect(this.ctx.destination);
        snap.start(now);

        // Low boom
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.3);

        oscGain.gain.setValueAtTime(0.65, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
    }

    // Clean Button Click / Activation Sound
    playButtonClick() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
    }

    // Cinematic Countdown Tick (NO robot voice)
    playTick(count) {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Subwoofer heartbeat thump
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        const startFreq = 75 + (10 - count) * 4;
        sub.frequency.setValueAtTime(startFreq, now);
        sub.frequency.exponentialRampToValueAtTime(30, now + 0.28);

        subGain.gain.setValueAtTime(0.85, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        sub.connect(subGain);
        subGain.connect(this.ctx.destination);
        sub.start(now);
        sub.stop(now + 0.35);

        // Crisp acoustic chronometer tick
        const tick = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tick.type = 'triangle';
        tick.frequency.setValueAtTime(1200 + (10 - count) * 80, now);

        tickGain.gain.setValueAtTime(0.3, now);
        tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        tick.connect(tickGain);
        tickGain.connect(this.ctx.destination);
        tick.start(now);
        tick.stop(now + 0.04);

        // Building tension for 3, 2, 1
        if (count <= 3) {
            const timp = this.ctx.createOscillator();
            const timpGain = this.ctx.createGain();
            timp.type = 'triangle';
            timp.frequency.setValueAtTime(110 + (3 - count) * 20, now);
            timp.frequency.exponentialRampToValueAtTime(70, now + 0.4);

            timpGain.gain.setValueAtTime(0.4, now);
            timpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            timp.connect(timpGain);
            timpGain.connect(this.ctx.destination);
            timp.start(now);
            timp.stop(now + 0.4);
        }
    }

    // Grand Celebration at 0: Crackers + Clapping + Triumphant Chords
    playGrandCelebration() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // 1. Real Firecrackers Salvo immediately
        this.playCrackers();

        // 2. Real Crowd Clapping & Cheering starting at 0.25s
        setTimeout(() => {
            this.playApplause();
        }, 250);

        // 3. Triumphant Celebration Brass Chords
        const chords = [
            { delay: 0.1, freqs: [293.66, 369.99, 440.00, 587.33], dur: 0.4, vol: 0.2 },
            { delay: 0.55, freqs: [392.00, 493.88, 587.33, 783.99], dur: 0.45, vol: 0.22 },
            { delay: 1.05, freqs: [440.00, 554.37, 659.25, 880.00], dur: 0.5, vol: 0.24 },
            { delay: 1.6, freqs: [293.66, 369.99, 440.00, 587.33, 880.00, 1174.66], dur: 3.2, vol: 0.28 }
        ];

        chords.forEach(chord => {
            chord.freqs.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = freq > 600 ? 'triangle' : 'sawtooth';

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(freq * 3.0, now + chord.delay);
                filter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + chord.delay + chord.dur);

                gain.gain.setValueAtTime(0.001, now + chord.delay);
                gain.gain.linearRampToValueAtTime(chord.vol, now + chord.delay + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + chord.delay + chord.dur);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + chord.delay);
                osc.stop(now + chord.delay + chord.dur);
            });
        });

        // 4. Subwoofer impact
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(90, now);
        sub.frequency.exponentialRampToValueAtTime(25, now + 1.5);
        subGain.gain.setValueAtTime(0.9, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
        sub.connect(subGain);
        subGain.connect(this.ctx.destination);
        sub.start(now);
        sub.stop(now + 1.6);
    }
}

window.launchAudio = new LaunchAudioEngine();
