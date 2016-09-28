
$(document).ready(function() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // create Oscillator node
    var oscillator = audioCtx.createOscillator();
    var volume = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // value in hertz
    oscillator.connect(volume);
    volume.connect(audioCtx.destination);
    volume.gain.value = 0;
    oscillator.start();
    
    var mute = true;
    var isOscOn = false;
    
    var controlArea = {
        height: $('#theremincontrol').height(),
        width: $('#theremincontrol').width()
    };
    
    function getVol(y) {
        return (controlArea.height-y)/controlArea.height;
    }
    
    function getFreq(x) {
        return 440*Math.pow(2,x/312)-13;
    }
    
    $('#theremincontrol').on("mousemove",function(e) {
        
        if (mute || !isOscOn) return;
        
        oscillator.frequency.value = getFreq(e.offsetX);
        volume.gain.value = getVol(e.offsetY);/*700-cntrl area height*/
        
        console.log(e.offsetX + ', '+ e.offsetY + ', ' + oscillator.frequency.value);
        
    });
    
    $('#theremincontrol').on("mousedown",function(e) {
        
        if (!isOscOn) return;
        volumeVal = volume.gain.value;
        volume.gain.value = 0;
        mute = true;
    });
    
    $('#theremincontrol').on("mouseup",function(e) {
        
        if (!isOscOn) return;
        volume.gain.value = getVol(e.offsetY);
        oscillator.frequency.value = getFreq(e.offsetX);
        mute = false;        
    });
                             
    
    $('#sound-presets').change(function() {
        
        oscillator.type = ($('input[name=sound]:checked').val());
        
    });
    
    $('#onButton').click(function(e) {
        
        if (isOscOn) {
            volume.gain.value = 0;
            mute = true;
            isOscOn = false;
        }
        else {
            volume.gain.value=getVol(e.offsetY);
            mute = false;
            isOscOn = true;
        }
    });
})
