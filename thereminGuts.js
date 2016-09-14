
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
    }, 10000);
    
    
    $('#theremincontrol').on("mousemove",function(e) {
        var x = e.pageX;
        var y = e.pageY;
        
        oscillator.frequency.value = 440*Math.pow(2,x/312)-13;
        volume.gain.value = (780-y)/700;
        
        console.log(x + ', '+ y + ', ' + oscillator.frequency.value);
        
    });
    
    $('#sound-presets').change(function() {
        
        oscillator.type = ($('input[name=sound]:checked').val());
        
    });
})
