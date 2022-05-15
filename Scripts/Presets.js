var Swirls = (
`vec2 newPosition = vec2(0);

newPosition.x = currentPosition.x + sin(currentPosition.y / 100.0);

newPosition.y = currentPosition.y + sin(currentPosition.x / 100.0);

return newPosition;
`);

var Miniswirls = (
`vec2 newPosition = vec2(0);

newPosition.x = currentPosition.x + sin(currentPosition.y / 10.0);

newPosition.y = currentPosition.y + sin(currentPosition.x / 10.0);

return newPosition;
`);

var Milkyway = (
`vec2 newPosition = vec2(0);

newPosition.x = currentPosition.x + (1.0 * currentPosition.y / 500.0);

newPosition.y = currentPosition.y - currentPosition.x / 1000.0;

return newPosition;
`);

var Parallax = (
`vec2 newPosition = vec2(0);

newPosition.x = currentPosition.x + (1.0 * currentPosition.y / 250.0);

newPosition.y = currentPosition.y;

return newPosition;
`);

var Checkerboard = (
`vec2 newPosition = vec2(0);

newPosition.x = currentPosition.x + tan(currentPosition.y / 50.0) / 16.0;

newPosition.y = currentPosition.y + tan(currentPosition.x / 50.0) / 7.0;

return newPosition;`
)

var Waterfall = (
`vec2 newPosition = vec2(0);

newPosition.x = currentPosition.x;

newPosition.y = currentPosition.y + (sqrt(currentPosition.y) / 6.0);

return newPosition;`
);

var Waves = (
`vec2 newPosition = vec2(0);

newPosition.x = currentPosition.x + sin(currentPosition.y / 100.0);

newPosition.y = currentPosition.y + sin(currentPosition.y / 50.0) + currentPosition.x / 550.0;

return newPosition;
`
)

var infoText = (
`//currentPosition is passed in.
//Coordinates range from 0 to 1000. Top left is (0,0).
//All numbers must be floats (decimals)`);


function build(code)
{
    return infoText + "\n\n" + code;
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