let audioCtx, gainNode, mainGainNode, mixer;
let heldNotes = [];
let glideTime = 0;

const oscillators = [
    {
        node: null,
        gain: null,
        settings: { waveform: 'sine', octave: 0, fine: 0, level: 0.3 }
    },
    {
        node: null,
        gain: null,
        settings: { waveform: 'sine', octave: 0, fine: 0, level: 0 }
    },
    {
        node: null,
        gain: null,
        settings: { waveform: 'sine', octave: 0, fine: 0, level: 0 }
    }
];


export function init() {
    if (audioCtx) return;

    audioCtx = new AudioContext();

    mixer = audioCtx.createGain();
    mixer.gain.value = 1;

    for (let i = 0; i < oscillators.length; i++) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        oscillators[i].node = osc;
        oscillators[i].gain = gain;
        applyOsc(i);
        osc.connect(gain).connect(mixer);
        osc.start();
    }
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;

    mainGainNode = audioCtx.createGain();
    mainGainNode.gain.value = 0.2;

    mixer.connect(gainNode).connect(mainGainNode).connect(audioCtx.destination);

    audioCtx.resume();
}

function applyOsc(i) {
    const { node, gain, settings } = oscillators[i];
    node.type = settings.waveform;
    node.detune.value = settings.octave * 1200 + settings.fine;
    gain.gain.value = settings.level;
    console.log(`Oscillator ${i + 1} settings applied:`, settings);
}

export function setOscParam(name, value) {
    const [oscName, key] = name.split('.');
    const i = parseInt(oscName.replace('osc', '')) - 1;
    const osc = oscillators[i];
    if (!osc || !(key in osc.settings)) return;

    osc.settings[key] = value;
    if (audioCtx) applyOsc(i);
}

export function setGlide(time) {
    glideTime = time;
}

function setPitch(frequency, glideTime) {
    const t = audioCtx.currentTime;
    oscillators.forEach(o=> {
        const f = o.node.frequency;
        f.cancelScheduledValues(t);
        f.setValueAtTime(f.value, t);
        if (glideTime > 0) {
            f.exponentialRampToValueAtTime(frequency, t + glideTime);
        } else {
            f.setValueAtTime(frequency, t);
        }
    })
}

export function noteOn(note) {
    if (!audioCtx) return;

    heldNotes = heldNotes.filter(n => n !== note);

    heldNotes.push(note);
    console.log("Held notes:", heldNotes);

    const frequency = 440 * Math.pow(2, (note - 69) / 12);

    setPitch(frequency, glideTime);

    gainNode.gain.setTargetAtTime(1, audioCtx.currentTime, 0.01);
}

export function noteOff(note) {
    if (!audioCtx) return;

    heldNotes = heldNotes.filter(n => n !== note);

    if (heldNotes.length > 0) {
        const lastNote = heldNotes[heldNotes.length - 1];
        const frequency = 440 * Math.pow(2, (lastNote - 69) / 12);
        setPitch(frequency, glideTime);
    } else {
        gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
    }
}