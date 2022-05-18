var Swirls = (
`
    // We use the dimension ratios to prevent distortion and 
    // we multiply (and divide, later by 1000.0 so we dont 
    // have to calculate positions with tiny decimals
    currentPosition /= (displayDimensionRatios / 1000.0);

    vec2 newPosition = vec2(0);

    // This is where the magic happens
    newPosition.x = currentPosition.x + sin(currentPosition.y / 100.0);
    newPosition.y = currentPosition.y + sin(currentPosition.x / 100.0);

    return newPosition * (displayDimensionRatios / 1000.0);`
);

var Miniswirls = (
`
    // We use the dimension ratios to prevent distortion and 
    // we multiply (and divide, later by 1000.0 so we dont 
    // have to calculate positions with tiny decimals
    currentPosition /= (displayDimensionRatios / 1000.0);

    vec2 newPosition = vec2(0);

    // This is where the magic happens
    newPosition.x = currentPosition.x + sin(currentPosition.y / 10.0);
    newPosition.y = currentPosition.y + sin(currentPosition.x / 10.0);

    return newPosition * (displayDimensionRatios / 1000.0);`
);

var Milkyway = (
`
    // We use the dimension ratios to prevent distortion and 
    // we multiply (and divide, later by 1000.0 so we dont 
    // have to calculate positions with tiny decimals
    currentPosition /= (displayDimensionRatios / 1000.0);

    vec2 newPosition = vec2(0);

    // This is where the magic happens
    newPosition.x = currentPosition.x + (1.0 * currentPosition.y / 500.0);
    newPosition.y = currentPosition.y - currentPosition.x / 1000.0;

    return newPosition * (displayDimensionRatios / 1000.0);`
);

var Parallax = (
`
    // We use the dimension ratios to prevent distortion and 
    // we multiply (and divide, later by 1000.0 so we dont 
    // have to calculate positions with tiny decimals
    currentPosition /= (displayDimensionRatios / 1000.0);

    vec2 newPosition = vec2(0);

    // This is where the magic happens
    newPosition.x = currentPosition.x + (1.0 * currentPosition.y / 250.0);
    newPosition.y = currentPosition.y;

    return newPosition * (displayDimensionRatios / 1000.0);`
);

var Checkerboard = (
`
    // We use the dimension ratios to prevent distortion and 
    // we multiply (and divide, later by 1000.0 so we dont 
    // have to calculate positions with tiny decimals
    currentPosition /= (displayDimensionRatios / 1000.0);

    vec2 newPosition = vec2(0);

    // This is where the magic happens
    newPosition.x = currentPosition.x + tan(currentPosition.y / 50.0) / 16.0;
    newPosition.y = currentPosition.y + tan(currentPosition.x / 50.0) / 7.0;

    return newPosition * (displayDimensionRatios / 1000.0);`
)

var Waterfall = (
`
    // We use the dimension ratios to prevent distortion and 
    // we multiply (and divide, later by 1000.0 so we dont 
    // have to calculate positions with tiny decimals
    currentPosition /= (displayDimensionRatios / 1000.0);

    vec2 newPosition = vec2(0);

    // This is where the magic happens
    newPosition.x = currentPosition.x;
    newPosition.y = currentPosition.y + (sqrt(currentPosition.y) / 6.0);

    return newPosition * (displayDimensionRatios / 1000.0);`
);

var Waves = (
`
    // We use the dimension ratios to prevent distortion and 
    // we multiply (and divide, later by 1000.0 so we dont 
    // have to calculate positions with tiny decimals
    currentPosition /= (displayDimensionRatios / 1000.0);

    vec2 newPosition = vec2(0);

    // This is where the magic happens
    newPosition.x = currentPosition.x + sin(currentPosition.y / 100.0);
    newPosition.y = currentPosition.y + sin(currentPosition.y / 50.0) + currentPosition.x / 550.0;

    return newPosition * (displayDimensionRatios / 1000.0);`
)


var topText = (
`// Top left is (0,0). All numbers must be floats (decimals).
// displayDimensionRatios contains screen dimension (width/height) ratio, 
// where the shortest dimension is 1 and the longest is shortest / longest.

vec2 calculateNewPosition(vec2 currentPosition, vec2 displayDimensionRatios)
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
    Waves: build(Waves)
}