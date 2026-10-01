export function start({ onNoteOn, onNoteOff }) {
    // Enable WEBMIDI.js and trigger the onEnabled() function when ready
    WebMidi
        .enable()
        .then(onEnabled)
        .catch(err => alert(err));

    // Function triggered when WEBMIDI.js is ready

    function onEnabled() {
        const status = document.getElementById('status');

        if (WebMidi.inputs.length < 1) {
            status.textContent = "No device detected.";
            return;
        }

        status.textContent = WebMidi.inputs.map(d => d.name).join(', ');


        const mySynth = WebMidi.inputs[0];

        mySynth.addListener('noteon', e => onNoteOn(e.note.number, e.note.identifier));
        mySynth.addListener('noteoff', e => onNoteOff(e.note.number, e.note.identifier));
    }
}