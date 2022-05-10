
var fragShadersrc = `#version 300 es
precision mediump float;
out vec4 fragColor;

uniform sampler2D particles;
in vec2 v_texturePosition;

void main(){
    // get the pixel colour at the given position
    vec4 colour = texture(particles, v_texturePosition);

    // find the x and y values from the colour. x = r + g, y = b + a.
    vec2 pos = vec2(colour.r / 255.0 + colour.b,colour.g / 255.0 + colour.a);

    // Do whatever we want to update the position of the particle.
    pos.x+= 0.0013;
        
    // convert the positions back in to a colour and write them to the texture (this will be texture2, and not the default texture(canvas)).
    fragColor = vec4(fract(pos * 255.0),floor(pos * 255.0) / 255.0);
}
`


var vertShadersrc = `#version 300 es
in vec2 a_xycoord;
out vec2 v_texturePosition;

void main() {
    v_texturePosition = a_xycoord;

    // xy_coord had to be normalized from 0 to 1, to -1 to 1 in order fit properly in clip space.
    gl_Position = vec4(1.0 - 2.0 * a_xycoord, 0, 1);
}
`

var gl = document.getElementById("c").getContext("webgl2");
var vertShader = utils.createShader(gl, gl.VERTEX_SHADER, vertShadersrc);
var fragShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fragShadersrc);
var updateProgram = utils.createProgram(gl, vertShader, fragShader);