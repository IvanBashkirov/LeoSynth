
$(document).ready(function() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // create Oscillator node
    var oscillator = audioCtx.createOscillator();
    var volume = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 3000; // value in hertz
    oscillator.connect(volume);
    volume.connect(audioCtx.destination);
    volume.gain.value = 0.1;
    oscillator.start();
    var timer = setTimeout(function() {
        oscillator.stop();
    }, 1000);
    
    $('body').css('color', 'red');
})
