$(document).ready(function () {
  const audioCtx = new(window.AudioContext || window.webkitAudioContext)();

  const $tCon = $('#theremincontrol');
  const controlArea = {
    height: $tCon.height(),
    width: $tCon.width()
  };
  const $onButton = $('#onButton');
  const $lightPower = $('#lightPower');
  const $rootKnob = $('#rootKnob');
  const $rangeKnob = $('#rangeKnob');
  const pitchArr = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const pitchArrFull = ['C', 'Csh', 'D', 'Dsh', 'E', 'F', 'Fsh', 'G', 'Gsh', 'A', 'Ash', 'B'];
  const soundArr = ['square', 'sine', 'sawtooth']; 
  let currSound = 'sine';
  let octaveNumber = 3;
  let numOfOctaves = 1;
  let currRoot = 'C';
  
  
  const $light = [];
  const $waveBut = [];
  for (let i = 0; i< 3; i++) {
    const leftOffsetBut = `${71.9+i*4.6}%`;
    const leftOffsetLight = `${67.5+i*4.65}%`;
    $light.push($(`<img src="images/leo-light-led2.png" class="waveLights" data-sound=${soundArr[i]}>`).css('left', leftOffsetLight));
    $waveBut.push($(`<div class="waveButton" data-sound=${soundArr[i]}></div>`).css('left', leftOffsetBut));
  }
  for (let i=0; i<3; i++) {$tCon.append($light[i])};
  for (let i=0; i<3; i++) {$tCon.append($waveBut[i])};
  
  
  
  
  let rootPos = 0;
  let rangePos = 0;
  let currRootIndx = 0;
  let rootIndxNow = 0;
  let currRangeIndx = 0;
  let rangeIndxNow = 0;
  let rootKnobActive = false;
  let rangeKnobActive = false;
  
  let root;
  let halfNoteWidth = 0;
  let octaveWidth = 0;

  const pitches = {
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
  
  const keysArr = [0,1,0,1,0,0,1,0,1,0,1,0];
  
 

  function setFreqScale() {
    let numNotes = numOfOctaves*12+1;

    var noteWidth = controlArea.width / numNotes;
    var noteWidthRat = 100 / numNotes;
    halfNoteWidth = noteWidth / 2;
    octaveWidth = noteWidth * 12;
    let keysBackground = [];
    let blackOrWhite;
    let k;
    for (let i = 0; i<numOfOctaves; i++){
      for (k = 0; k<12; k++) {
        blackOrWhite = (keysArr[(k+pitchArrFull.indexOf(currRoot))%12]) ? 'black' : 'ivory';
        keysBackground.push($('<div class="key"></div>').css('background-color', blackOrWhite));
      }
    }
    blackOrWhite = (keysArr[(k+pitchArrFull.indexOf(currRoot))%12]) ? 'black' : 'ivory';
    keysBackground.push($('<div class="key"></div>').css('background-color', blackOrWhite));
    $('.container').empty();
    for (let i = 0; i<numNotes; i++) $('.container').append(keysBackground);
    
  }

  
  function setRoot(p) {
    root = pitches[p]*Math.pow(2,octaveNumber-1);
    currRoot = p;
    setFreqScale();
  }

  // set scale
                                                     
  setRoot('C');
  setFreqScale();

  // create Oscillator node
    
  const oscillator = audioCtx.createOscillator();
  const volume = audioCtx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = root; // value in hertz
  oscillator.connect(volume);
  volume.connect(audioCtx.destination);
  volume.gain.value = 0;
  oscillator.start();

  let muted = true;
  let isOscOn = false;


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
    if (rootKnobActive) {
      const rootWalk = rootPos - (e.pageY - $tCon.offset().top);
      rootIndxNow = currRootIndx + Math.floor(rootWalk/5);
      if (rootIndxNow > 6) rootIndxNow = 6;
      if (rootIndxNow < 0) rootIndxNow = 0;
      $rootKnob.css('transform', `rotate(${rootIndxNow*45}deg)`);
      setRoot(pitchArr[rootIndxNow]);
      
    }
    
    if (rangeKnobActive) {
      const rangeWalk = rangePos - (e.pageY - $tCon.offset().top);
      rangeIndxNow = currRangeIndx + Math.floor(rangeWalk/5);
      if (rangeIndxNow > 3) rangeIndxNow = 3;
      if (rangeIndxNow < 0) rangeIndxNow = 0;
      $rangeKnob.css('transform', `rotate(${rangeIndxNow*90}deg)`);
      numOfOctaves=rangeIndxNow+1;
      setFreqScale();
    }
    
    if (muted) return;

    oscillator.frequency.value = getFreq(e.pageX - $(this).offset().left);
    volume.gain.value = getVol(e.pageY - $(this).offset().top);
    console.log(oscillator.frequency.value);

  });

  //  mute
  $tCon.on("mousedown", function (e) {
    if (isOscOn) mute();
  });

  $tCon.on("mouseup", function (e) {
    if (isOscOn) {
      unmute(e.pageX - $tCon.offset().left, e.pageY - $tCon.offset().top);
    }
    currRootIndx = rootIndxNow;
    currRangeIndx = rangeIndxNow;
    rootKnobActive = false;
    rangeKnobActive = false;
  });

  //choose presets
    
  function changeSound() {
    if (!isOscOn) return;
    console.log('clicked');
    console.log(this.dataset.sound);
    const sound = this.dataset.sound;
    oscillator.type = sound;
    $('.waveLights').css('transform', 'scale(0)');
    $(`.waveLights[data-sound=${sound}]`).css('transform', 'scale(1)');
    currSound = sound; 
    
  }
  

  //  on button
    
  $onButton.click(function (e) {
    if (isOscOn) {
      $(this).css('transform', 'rotate(0deg)');
      $lightPower.css('transform', 'scale(0)');
      $('.waveLights').css('transform', 'scale(0)');
      turnOff();
    } else {
      $(this).css('transform', 'rotate(90deg)');
      $lightPower.css('transform', 'scale(1)');
      $(`.waveLights[data-sound=${currSound}]`).css('transform', 'scale(1)');
      turnOn(e.pageX - $tCon.offset().left, e.pageY - $tCon.offset().top);
    }
  });
  

  $('.waveButton').click(changeSound);
  $rootKnob.mousedown((e)=> {
    rootKnobActive = true;
    rootPos = e.pageY - $tCon.offset().top;
  });
  $rangeKnob.mousedown((e)=> {
    rangeKnobActive = true;
    rangePos = e.pageY - $tCon.offset().top;
  });



});
