
$(document).ready(function() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // create Oscillator node
    var oscillator = audioCtx.createOscillator();
    var volume = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // value in hertz
    oscillator.connect(volume);
    volume.connect(audioCtx.destination);
    volume.gain.value = 0.1;
    oscillator.start();
    
    var timer = setTimeout(function() {
        oscillator.stop();
    }, 10000);
    
    
    $('#theremincontrol').on("mousemove",function(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        
        
        oscillator.frequency.value = 440*Math.pow(2,x/312)-13;
        volume.gain.value = (600-y)/600;/*700-cntrl area height*/
        
        console.log(x + ', '+ y + ', ' + oscillator.frequency.value);
        
    });
    
    $('#sound-presets').change(function() {
        
        oscillator.type = ($('input[name=sound]:checked').val());
        
    });
})
