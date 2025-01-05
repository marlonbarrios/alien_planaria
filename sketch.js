/*
 * Alien Planaria
 * 
 * This sketch creates an animated creature inspired by planaria (flatworms),
 * using mathematical functions to generate organic movement and underwater atmosphere.
 * The creature is formed by thousands of points whose positions are determined by
 * trigonometric functions and parametric equations.
 */

// Global variables for animation and sound
let t = 0;                    // Time variable for animation
let osc, env, filter, noise, reverb;  // Sound components
let playing = false;          // Sound playing state
let baseFreq = 40;           // Base frequency for underwater sound (40Hz)
let breathRate = 0;          // Variable for breathing animation
let baseStrokeWeight = 2;    // Base thickness of points
let lfoDepth = 0;            // Low Frequency Oscillator depth for sound modulation
let soundEnabled = false;     // Sound state toggle
let recorder;
let chunks = [];
let isRecording = false;
let mediaStream;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize sound synthesis components
  osc = new p5.Oscillator('sine');
  filter = new p5.LowPass();
  env = new p5.Envelope();
  noise = new p5.Noise('pink');
  reverb = new p5.Reverb();
  
  // Configure envelope for louder sound
  env.setADSR(0.05, 0.3, 0.3, 0.4);
  env.setRange(0.9, 0);
  
  // Audio routing for underwater effect
  osc.disconnect();
  osc.connect(filter);
  filter.freq(400);
  
  // Initialize oscillator
  osc.start();
  osc.amp(0.8);
  
  // Configure noise for louder bubble sounds
  noise.disconnect();
  noise.connect(filter);
  noise.amp(0);
  
  // Add reverb for space simulation
  reverb.process(filter, 6, 8);
  filter.res(5);
  
  updateStrokeWeight();
  
  // UI setup
  textAlign(CENTER, CENTER);
  textSize(16);
  
  // Setup for recording
  const canvas = document.querySelector('canvas');
  mediaStream = canvas.captureStream(30);
  
  // Get audio context and connect it to the stream
  const audioContext = getAudioContext();
  const dest = audioContext.createMediaStreamDestination();
  
  // Connect all audio nodes to the destination
  osc.connect(filter);
  filter.connect(dest);
  noise.connect(filter);
  reverb.connect(dest);
  
  // Add the audio track to the media stream
  mediaStream.addTrack(dest.stream.getAudioTracks()[0]);
  
  recorder = new MediaRecorder(mediaStream, {
    mimeType: 'video/webm;codecs=h264,opus',
    videoBitsPerSecond: 8000000,
    audioBitsPerSecond: 128000
  });
  
  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alien-planaria-recording.webm';
    a.click();
    chunks = [];
    URL.revokeObjectURL(url);
  };
}

function draw() {
  background(0);
  
  // Update animation parameters
  t += PI / 60;
  breathRate = sin(t/2);
  lfoDepth = sin(t/3) * 0.7;
  
  // Make sure stroke is visible
  stroke(255, 46);
  strokeWeight(2);
  
  // Calculate modulation positions
  let x = windowWidth/2 + cos(t) * 100;
  let y = windowHeight/2 + sin(t) * 100;
  
  // Sound generation when enabled
  if (soundEnabled) {
    // Frequency modulation based on position
    let freq = baseFreq + (x / windowWidth) * 70 + sin(t/4) * 30;
    osc.freq(freq);
    
    // Filter modulation for movement simulation
    filter.freq(150 + (y / windowHeight) * 400 + sin(t/5) * 150);
    
    // Random bubble sound generation
    if (random(1) < 0.05) {
      playBubble();
    }
    
    // Rhythmic clicking sounds
    if (frameCount % floor(25 + breathRate * 10) === 0) {
      playClick();
    }
  }
  
  // Visual rendering
  translate(windowWidth/2, windowHeight/2);  // Center the creature
  
  // Scale based on window size
  let scaleVal = min(windowWidth, windowHeight) / 400;
  
  push();
  scale(scaleVal * 1.5);
  
  stroke(400, 46);  // Bright, semi-transparent stroke
  strokeWeight(baseStrokeWeight / scaleVal);
  
  // Generate points for the creature
  let pointDensity = floor(30000 * scaleVal);
  for (let i = pointDensity; i--;) {
    let x = i % 120;    // X coordinate in grid
    let y = i / 180;    // Y coordinate in grid
    drawPoint(x, y);
  }
  pop();
  
  // Draw UI elements
  push();
  translate(-windowWidth/2, -windowHeight/2);
  fill(255);
  noStroke();
  
  // Sound status text
  text(`Sound: ${soundEnabled ? 'ON' : 'OFF'} (Press SPACE or click to toggle)`, windowWidth/2, windowHeight - 60);
  
  // Recording hint text
  text(`Press 'R' to start/stop recording video with sound`, windowWidth/2, windowHeight - 30);
  
  // Sound state indicator
  fill(soundEnabled ? '#00ff00' : '#ff0000');
  circle(30, 30, 20);
  
  // Recording indicator with label
  if (isRecording) {
    fill('#ff0000');
    noStroke();
    circle(70, 30, 20);
    fill(255);
    text('REC', 100, 35);
  }
  pop();
}

/*
 * Mathematical explanation of drawPoint():
 * The function uses several trigonometric functions combined to create organic movement:
 * - mag(k, e) calculates the magnitude (distance from origin) for wave modification
 * - cos(9/k) creates ripple effects
 * - sin(o*4-t) adds time-based undulation
 * - The combination of multiple sine and cosine functions with different frequencies
 *   creates complex, organic-looking movement patterns
 */
function drawPoint(x, y, o = mag(k = x/4-12.5, e = y/9)/9) {
  let q = x + 99 + cos(9/k) + o*k*(cos(e*9)/3 + cos(y/9)/.7)*sin(o*4-t);
  let c = o*e/30 - t/8;
  point(
    0.7 * q * sin(c),                    // X position with sinusoidal movement
    y/9 * cos(c*4 - t/2) - q/2 * cos(c)  // Y position with phase-shifted movement
  );
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    osc.amp(0.8);
    playing = true;
  } else {
    osc.amp(0);
    noise.amp(0);
    playing = false;
  }
}

function playClick() {
  osc.amp(env);
  env.play();
  
  let newFreq = baseFreq * (2 + breathRate + lfoDepth + random(-0.3, 0.3));
  osc.freq(newFreq);
  
  noise.start();
  noise.amp(0.4, 0.02);
  noise.amp(0, 0.15);
}

function playBubble() {
  let bubbleFreq = random(150, 500) * (1 + lfoDepth);
  osc.freq(bubbleFreq);
  env.setADSR(0.02, 0.2, 0.2, 0.3);
  env.setRange(0.7, 0);
  env.play();
  
  noise.start();
  noise.amp(0.5, 0.04);
  noise.amp(0, 0.2);
}

function updateStrokeWeight() {
  let scaleVal = min(windowWidth, windowHeight) / 400;
  strokeWeight(baseStrokeWeight / scaleVal);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateStrokeWeight();
}

function mousePressed() {
  toggleSound();
}

function keyPressed() {
  if (key === ' ') {
    toggleSound();
  }
  if (key === 'r' || key === 'R') {
    if (!isRecording) {
      // Start recording
      chunks = [];
      recorder.start(1000); // 1 second chunks
      isRecording = true;
      console.log('Recording started');
    } else {
      // Stop recording
      recorder.stop();
      isRecording = false;
      console.log('Recording stopped');
    }
  }
}
