var fragShadersrc = (
`#version 300 es
precision mediump float;
out vec4 fragColor;
in vec4 v_colour;
in float v_index;


void main(){
    //vec4 colour = vec4(v_index / 17.0 ,0,0,1);

    fragColor = v_colour;
}
`);

var vertShadersrc = `#version 300 es

uniform sampler2D particles;
uniform float nParticleDimensions;

in float a_positionIndex;
out float v_index;
out vec4 v_colour;

void main() {
   
    // Fetch the pixel from the texture using the position index. As the index is a number, and the texture is basically a 2D array,
    // We have to calclate what the x and y position of the pixel in the array is based on that 1D index.
    vec4 colour = texture(particles, vec2(fract(a_positionIndex / nParticleDimensions), floor(a_positionIndex / nParticleDimensions) / nParticleDimensions));

    v_index = a_positionIndex;

    v_colour = colour;

    // Calculate the x and y positions by combining the rg and ba values for x and y respectively.
    vec2 pos = vec2(colour.r / 255.0 + colour.b, colour.g / 255.0 + colour.a);

    // color.x and color.y can only be positive, so in order to convert them into clip space we double it subtract it from 1 so that it can be anywhere on screen.
    float x = (pos.x * 2.0) - 1.0;
    float y = 1.0 - 2.0 * (pos.y);

    gl_PointSize = 20.0;
    gl_Position = vec4( x,y, 0, 1);
}
`

var gl = document.getElementById("c").getContext("webgl2", {preserveDrawingBuffer: false});
var vertShader = utils.createShader(gl, gl.VERTEX_SHADER, vertShadersrc);
var fragShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fragShadersrc);
var drawProgram = utils.createProgram(gl, vertShader, fragShader);