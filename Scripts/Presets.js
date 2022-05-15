var Swirls = (
`vec2 newPosition = vec2(0);

newPosition.x = currentPosition.x + sin(currentPosition.y / 100.0);

newPosition.y = currentPosition.y + sin(currentPosition.x / 100.0);

return newPosition;
`);

var milkyway = (
`vec2 newPosition = vec2(0);

newPosition.x = currentPosition.x + (1.0 * currentPosition.y / 500.0);

newPosition.y = currentPosition.y - currentPosition.x / 1000.0;// + 1.0;

return newPosition;
`);

var Parallax = (
`vec2 newPosition = vec2(0);

newPosition.x = currentPosition.x + (1.0 * currentPosition.y / 500.0);

newPosition.y = currentPosition.y;

return newPosition;
`);

var infoText = (
`//currentPosition is passed in.
//Coordinates range from 0 to 1000.
//All numbers must be floats (decimals)`);


function build(code)
{
    return infoText + "\n\n" + code;
}

const presets = {
    Swirls: build(Swirls),
    Milkyway: build(milkyway),
    Parallax : build(Parallax )
}