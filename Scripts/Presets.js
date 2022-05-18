var Swirls = (
`
    // Use the dimension ratios to prevent position distortion. Without 
    // using displayDimensionRatios, the area would be stretched over 
    // the longest dimension.
    currentPosition /= displayDimensionRatios;

    float calculationMagnificationFactor = 1000.0;

    // Scale up we dont have to deal with tiny decimals during calculations.
    currentPosition *= calculationMagnificationFactor;

    vec2 newPosition = vec2(0);

    //////////////// This is where the magic happens ////////////////
    newPosition.x = currentPosition.x + sin(currentPosition.y / 100.0);
    newPosition.y = currentPosition.y + sin(currentPosition.x / 100.0);
    /////////////////////////////////////////////////////////////////

    // Return coordinates to their original order of magnitude.
    newPosition /= calculationMagnificationFactor;

    // Calculations are done, so scale positions back up to fit on screen properly.
    newPosition *= displayDimensionRatios;

    // Using fract means particles that go offscreen teleport to the opposite side.
    return fract(newPosition);
`);

var Miniswirls = (
`
    // Use the dimension ratios to prevent position distortion. Without 
    // using displayDimensionRatios, the area would be stretched over 
    // the longest dimension.
    currentPosition /= displayDimensionRatios;

    float calculationMagnificationFactor = 1000.0;

    // Scale up we dont have to deal with tiny decimals during calculations.
    currentPosition *= calculationMagnificationFactor;

    vec2 newPosition = vec2(0);

    //////////////// This is where the magic happens ////////////////
    newPosition.x = currentPosition.x + sin(currentPosition.y / 10.0);
    newPosition.y = currentPosition.y + sin(currentPosition.x / 10.0);
    /////////////////////////////////////////////////////////////////

    // Return coordinates to their original order of magnitude.
    newPosition /= calculationMagnificationFactor;

    // Calculations are done, so scale positions back up to fit on screen properly.
    newPosition *= displayDimensionRatios;

    // Using fract means particles that go offscreen teleport to the opposite side.
    return fract(newPosition);
`);

var Milkyway = (
`
    // Use the dimension ratios to prevent position distortion. Without 
    // using displayDimensionRatios, the area would be stretched over 
    // the longest dimension.
    currentPosition /= displayDimensionRatios;

    float calculationMagnificationFactor = 1000.0;

    // Scale up we dont have to deal with tiny decimals during calculations.
    currentPosition *= calculationMagnificationFactor;

    vec2 newPosition = vec2(0);

    //////////////// This is where the magic happens ////////////////
    newPosition.x = currentPosition.x + (1.0 * currentPosition.y / 500.0);
    newPosition.y = currentPosition.y - currentPosition.x / 1000.0;
    /////////////////////////////////////////////////////////////////

    // Return coordinates to their original order of magnitude.
    newPosition /= calculationMagnificationFactor;

    // Calculations are done, so scale positions back up to fit on screen properly.
    newPosition *= displayDimensionRatios;

    // Using fract means particles that go offscreen teleport to the opposite side.
    return fract(newPosition);
`);

var Parallax = (
`
    // Use the dimension ratios to prevent position distortion. Without 
    // using displayDimensionRatios, the area would be stretched over 
    // the longest dimension.
    currentPosition /= displayDimensionRatios;

    float calculationMagnificationFactor = 1000.0;

    // Scale up we dont have to use deal tiny decimals during calculations.
    currentPosition *= calculationMagnificationFactor;

    vec2 newPosition = vec2(0);

    //////////////// This is where the magic happens ////////////////
    newPosition.x = currentPosition.x + (1.0 * currentPosition.y / 250.0);
    newPosition.y = currentPosition.y;
    /////////////////////////////////////////////////////////////////

    // Return coordinates to their original order of magnitude.
    newPosition /= calculationMagnificationFactor;

    // Calculations are done, so scale positions back up to fit on screen properly.
    newPosition *= displayDimensionRatios;

    // Using fract means particles that go offscreen teleport to the opposite side.
    return fract(newPosition);
`);

var Checkerboard = (
`
    // Use the dimension ratios to prevent position distortion. Without 
    // using displayDimensionRatios, the area would be stretched over 
    // the longest dimension.
    currentPosition /= displayDimensionRatios;

    float calculationMagnificationFactor = 1000.0;

    // Scale up we dont have to deal with tiny decimals during calculations.
    currentPosition *= calculationMagnificationFactor;

    vec2 newPosition = vec2(0);

    //////////////// This is where the magic happens ////////////////
    newPosition.x = currentPosition.x + tan(currentPosition.y / 50.0) / 16.0;
    newPosition.y = currentPosition.y + tan(currentPosition.x / 50.0) / 7.0;
    /////////////////////////////////////////////////////////////////

    // Return coordinates to their original order of magnitude.
    newPosition /= calculationMagnificationFactor;

    // Calculations are done, so scale positions back up to fit on screen properly.
    newPosition *= displayDimensionRatios;

    // Using fract means particles that go offscreen teleport to the opposite side.
    return fract(newPosition);
`)

var Waterfall = (
`
    // Use the dimension ratios to prevent position distortion. Without 
    // using displayDimensionRatios, the area would be stretched over 
    // the longest dimension.
    currentPosition /= displayDimensionRatios;

    float calculationMagnificationFactor = 1000.0;

    // Scale up we dont have to deal with tiny decimals during calculations.
    currentPosition *= calculationMagnificationFactor; 

    vec2 newPosition = vec2(0);

    //////////////// This is where the magic happens ////////////////
    newPosition.x = currentPosition.x;
    newPosition.y = currentPosition.y + (sqrt(currentPosition.y) / 6.0);
    /////////////////////////////////////////////////////////////////

    // Return coordinates to their original order of magnitude.
    newPosition /= calculationMagnificationFactor;

    // Calculations are done, so scale positions back up to fit on screen properly.
    newPosition *= displayDimensionRatios;

    // Using fract means particles that go offscreen teleport to the opposite side.
    return fract(newPosition);
`);

var Waves = (
`
    // Use the dimension ratios to prevent position distortion. Without 
    // using displayDimensionRatios, the area would be stretched over 
    // the longest dimension.
    currentPosition /= displayDimensionRatios;

    float calculationMagnificationFactor = 1000.0;

    // Scale up we dont have to deal with tiny decimals during calculations.
    currentPosition *= calculationMagnificationFactor;

    vec2 newPosition = vec2(0);

    //////////////// This is where the magic happens ////////////////
    newPosition.x = currentPosition.x + sin(currentPosition.y / 100.0);
    newPosition.y = currentPosition.y + sin(currentPosition.y / 50.0) + currentPosition.x / 550.0;
    /////////////////////////////////////////////////////////////////

    // Return coordinates to their original order of magnitude.
    newPosition /= calculationMagnificationFactor;

    // Calculations are done, so scale positions back up to fit on screen properly.
    newPosition *= displayDimensionRatios;

    // Using fract means particles that go offscreen teleport to the opposite side.
    return fract(newPosition);
`)

var warpSpeed = (
`
    float calculationMagnificationFactor = 1000.0;

    // Scale up we dont have to deal with tiny decimals during calculations.
    currentPosition *= calculationMagnificationFactor;

    vec2 newPosition = vec2(0);

    //////////////// This is where the magic happens ////////////////
    newPosition.x = currentPosition.x + sinh((currentPosition.x - 500.) / 500.0) * 3.12;
    newPosition.y = currentPosition.y + sin((currentPosition.y - 500.) / 500.0) * 3.12;
    /////////////////////////////////////////////////////////////////

    // Return coordinates to their original order of magnitude.
    newPosition /= calculationMagnificationFactor;

    if (distance(newPosition, fract(newPosition)) > 0.0) newPosition = randomLocation;

    return newPosition;
`
);


var topText = (
`// Top left is (0,0). All numbers must be floats (decimals).
// displayDimensionRatios contains screen dimension (width/height) ratio, 
// where the shortest dimension is 1 and the longest is shortest / longest.
// randomLocation is a random location that you can set to; this respawns the particle.

vec2 calculateNewPosition(vec2 currentPosition, 
    vec2 displayDimensionRatios, vec2 randomLocation)
{`);


function build(code)
{
    return topText + code + "}";
}

const presets = {
    Swirls: build(Swirls),
    Miniswirls: build(Miniswirls),
    Milkyway: build(Milkyway),
    Parallax : build(Parallax),
    Checkerboard: build(Checkerboard),
    Waterfall: build(Waterfall),
    Waves: build(Waves),
    "Warp Speed": build(warpSpeed)
}