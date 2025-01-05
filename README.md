# Alien Planaria

![Alien Planaria Screenshot](screenshot.png)

An interactive audiovisual artwork that simulates an otherworldly creature inspired by planarian flatworms. The creature is rendered using mathematical functions to create organic, fluid movement patterns combined with an underwater soundscape.

**Concept and Programming by Marlon Barrios Solano**

## Description

Alien Planaria creates a mesmerizing visualization of a creature composed of thousands of points that move in complex, organic patterns. The movement is generated through a combination of trigonometric functions and parametric equations, creating an effect that mimics the undulating motion of aquatic organisms.

### Features

- **Dynamic Visualization**: The creature responds to window size and maintains proportional dimensions
- **Interactive Sound**: Toggle-able underwater soundscape with:
  - Deep ambient tones
  - Bubble effects
  - Organic clicking sounds
- **Responsive Design**: Automatically adapts to different screen sizes
- **Simple Controls**: Click anywhere or press spacebar to toggle sound

## Mathematical Approach

The visualization uses several mathematical concepts to create organic movement:

1. **Parametric Equations**: Point positions are calculated using time-dependent equations
2. **Wave Interference**: Multiple sine and cosine waves combine to create complex patterns
3. **Phase Shifting**: Different phase offsets create natural-looking motion
4. **Magnitude Scaling**: Distance-based effects create depth and dimension
5. **Harmonic Series**: Multiple frequencies create rich, organic patterns

## Technical Details

### Sound Generation
- Sine wave oscillator for base tones
- Pink noise for bubble effects
- Low-pass filter for underwater effect
- Reverb for spatial atmosphere

### Visual Generation
- Points are positioned using trigonometric functions
- Movement is time-based and continuous
- Stroke weight adapts to screen size
- Density of points scales with window size

## Running the Project

1. Clone this repository
2. Open `index.html` in a web browser
   - For best results, use a local server (e.g., Live Server in VS Code)
3. Click anywhere or press spacebar to toggle sound
4. For optimal experience, use headphones

### Requirements
- Modern web browser with WebGL support
- Audio output capability
- JavaScript enabled

## Controls
- **Click** or **Spacebar**: Toggle sound on/off
- The creature automatically animates and responds to window sizing

## Credits

Created using:
- [p5.js](https://p5js.org/) for graphics
- [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) for audio

## License

This project is licensed under the MIT License - see the LICENSE file for details. 