$(document).ready(function () {
  var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

  var $tCon = $('#theremincontrol');
  var controlArea = {
    height: $tCon.height(),
    width: $tCon.width()
  };

  var octave = 4;
  var root = 440;
  var halfNoteWidth = 0;
  var octaveWidth = 0;

  var pitches = {
    C: 32.703,
    Csh: 34.648,
    D: 36.708,
    Dsh: 38.891,
    E: 41.203,
    F: 43.654,
    Fsh: 46.249,
    G: 48.999,
    Gsh: 51.913,
    A: 55,
    Ash: 58.27,
    B: 61.735
  };

  function setFreqScale() {
    var numNotes = $('#choose-range').val();
    var noteWidth = controlArea.width / numNotes;
    var noteWidthRat = 100 / numNotes;
    halfNoteWidth = noteWidth / 2;
    octaveWidth = noteWidth * 12;
    var gradient = 'repeating-linear-gradient(to right, aqua, aqua ' + noteWidthRat + '% ,cadetBlue ' + noteWidthRat + '%,cadetBlue ' + (2 * (noteWidthRat)) + '%)';
    $tCon.css({
      'background': gradient
    });
  }

  function setRoot() {
    root = pitches[$('#choose-root').val()]*Math.pow(2,($('#choose-octave').val()-1));
  }

                                                     
  setFreqScale();
  setRoot();

  // create Oscillator node
  var oscillator = audioCtx.createOscillator();
  var volume = audioCtx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = root; // value in hertz
  oscillator.connect(volume);
  volume.connect(audioCtx.destination);
  volume.gain.value = 0;
  oscillator.start();

  var muted = true;
  var isOscOn = false;


  function turnOn(offsetX, offsetY) {
    oscillator.frequency.value = getFreq(offsetX);
    volume.gain.value = getVol(offsetY);
    muted = false;
    isOscOn = true;
  }

  function turnOff() {
    volume.gain.value = 0;
    muted = true;
    isOscOn = false;
  }

  function mute() {
    volume.gain.value = 0;
    muted = true;
  }

  function unmute(offsetX, offsetY) {
    oscillator.frequency.value = getFreq(offsetX);
    volume.gain.value = getVol(offsetY);
    muted = false;
  }

  function getVol(y) {
    return (controlArea.height - y) / controlArea.height;
  }

  function getFreq(x) {
    return root * Math.pow(2, (x - halfNoteWidth) / octaveWidth);
  }

  //  play
  $tCon.on("mousemove", function (e) {
    if (muted) return;

    oscillator.frequency.value = getFreq(e.clientX - $(this).offset().left);
    volume.gain.value = getVol(e.clientY - $(this).offset().top);

    console.log(e.clientX + ', ' + e.clientY + ', ' + oscillator.frequency.value);
  });

  //  mute
  $tCon.on("mousedown", function (e) {
    if (isOscOn) mute();
  });

  $tCon.on("mouseup", function (e) {
    if (isOscOn) {
      unmute(e.clientX - $tCon.offset().left, e.clientY - $tCon.offset().top);
    }
  });

  //choose presets
  $('#sound-presets').change(function () {
    oscillator.type = ($('input[name=sound]:checked').val());
  });

  //  on button
  $('#onButton').click(function (e) {
    if (isOscOn) {
      turnOff();
    } else {
      turnOn(e.clientX - $tCon.offset().left, e.clientY - $tCon.offset().top);
    }
  });


  $('#choose-range').change(setFreqScale);
  $('#choose-root').change(setRoot);
  $('#choose-octave').change(setRoot);



});
