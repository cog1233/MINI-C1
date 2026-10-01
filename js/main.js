import { start as startMidi } from './input/midi.js';
import * as synth from './audio/synth.js';

const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];
const waveformNames = ['Sine', 'Square', 'Sawtooth', 'Triangle'];

function onNoteOn(note, identifier) {
    console.log(`Note On: ${note}, identifier: ${identifier}`);
    setPlaying(note, true);
    synth.noteOn(note);

}

function onNoteOff(note, identifier) {
    console.log(`Note Off: ${note}, identifier: ${identifier}`);
    setPlaying(note, false);
    synth.noteOff(note);
}

function setPlaying(note, isPlaying) {
    const key = document.querySelector(`.key[data-midi="${note}"]`);
    if (key) key.classList.toggle("playing", isPlaying);
}

document.getElementById('start').addEventListener('click', () => {
    synth.init();
    startMidi({ onNoteOn, onNoteOff });
});


[1, 2, 3].forEach(n => {
    const slider = document.getElementById(`oscillator_${n}`);
    const readout = document.getElementById(`oscillator_${n}_output`);

    slider.addEventListener('input', e => {
        const i = parseInt(e.target.value);
        synth.setOscParam(`osc${n}.waveform`, waveforms[i]);
        readout.textContent = waveformNames[i];
    });
});

[1, 2, 3].forEach(n => {
    const slider = document.getElementById(`oscillator_${n}_level`);
    const readout = document.getElementById(`oscillator_${n}_level_output`);

    slider.addEventListener('input', e => {
        const i = parseFloat(e.target.value);
        readout.textContent = i.toFixed(2);
        synth.setOscParam(`osc${n}.level`, i);
    });
});

[1, 2, 3].forEach(n => {
    const slider = document.getElementById(`oscillator_${n}_fine`);
    const readout = document.getElementById(`oscillator_${n}_fine_output`);

    slider.addEventListener('input', e => {
        const i = parseFloat(e.target.value);
        readout.textContent = i.toFixed(2);
        synth.setOscParam(`osc${n}.fine`, i);
    });
});

[1, 2, 3].forEach(n => {
    const slider = document.getElementById(`oscillator_${n}_octave`);
    const readout = document.getElementById(`oscillator_${n}_octave_output`);

    slider.addEventListener('input', e => {
        const i = parseFloat(e.target.value);
        readout.textContent = i.toFixed(2);
        synth.setOscParam(`osc${n}.octave`, i);
    });
});