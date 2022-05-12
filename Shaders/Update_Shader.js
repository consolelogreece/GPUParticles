var fragShadersrc = (
`#version 300 es
precision mediump float;

uniform sampler2D particles;
uniform float randomSeed;

out vec4 fragColor;
in vec2 v_texturePosition;

// Gratefully taken from: https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(const vec2 co) {
    float t = dot(vec2(12.9898, 78.233), co);
    return fract(sin(t) * (4375.85453 + t));
}

void main(){
    // get the pixel colour at the given position
    vec4 colour = texture(particles, v_texturePosition);

    // find the x and y values from the colour. x = r + g, y = b + a.
    // positions range from 0 to 1. to recode, we will have to remultiply by 255 wherever necessary.
    vec2 pos = vec2(colour.r / 255.0 + colour.b, colour.g / 255.0 + colour.a);

    // Do whatever we want to update the position of the particle.
    pos.x -= sin(7. * pos.y) / 855.;
    pos.y += cos(7. * pos.x) / 855.;

    bool resetPosition = false;
    
    // Check if at screen boundary
    if (pos.x > 1.0) { 
        pos.x = 0.0; 
    } 
    if (pos.x < 0.0){
        pos.x = 1.0;
    }
    if (pos.y > 1.0) {
        pos.y = 0.0;
    } 
    if (pos.y < 0.0) {
         pos.y = 1.0;
    }

    if (rand(vec2(pos + v_texturePosition) * randomSeed) > 0.999)
    {
        resetPosition = true;
    }
    
    if (resetPosition)
    {
        pos.x = rand(vec2(pos.y, v_texturePosition));
        pos.y = rand(vec2(pos.x, colour.a));
    }
    
    // convert the positions back in to a colour and write them to the texture (this will be texture2, and not the default texture(canvas)).
    fragColor = vec4(fract(pos * 255.0), floor(pos * 255.0) / 255.0);
}
`);

var vertShadersrc = (
`#version 300 es
in vec2 a_xycoord;
out vec2 v_texturePosition;

void main() {
    // Texture position is from 0,0 to 1,1. This makes clip space weird as it's from -1,-1 to 1,1.
    // This essentially normalizes the clip space to match the texture coordinates.
    v_texturePosition = (1.0 + a_xycoord) / 2.0;

    gl_Position = vec4(a_xycoord, 0,1);
}
`);

var gl = document.getElementById("c").getContext("webgl2");
var vertShader = utils.createShader(gl, gl.VERTEX_SHADER, vertShadersrc);
var fragShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fragShadersrc);
var updateProgram = utils.createProgram(gl, vertShader, fragShader);