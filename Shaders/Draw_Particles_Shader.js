var drawParticlesProgramSrc = {
vert: (
`#version 300 es
uniform sampler2D particleLocationsTexture;
uniform float nParticleDimensions;
uniform float particleSize;
in vec2 a_positionIndex; // This stores the xy component to find the pixel.
out vec4 v_colour;
out vec2 v_position;

void main() {
    // Fetch the pixel at the given coordinates.
    // Read about this here: https://webglfundamentals.org/webgl/lessons/webgl-qna-accessing-textures-by-pixel-coordinate-in-webgl2.html
    vec4 colour = vec4(0);
    colour += texelFetch(particleLocationsTexture, ivec2(int(a_positionIndex.x),int(a_positionIndex.y)), 0);

    v_colour = colour;

    // Calculate the x and y positions by combining the rg and ba values for x and y respectively.
    vec2 pos = vec2(colour.r / 255.0 + colour.b, colour.g / 255.0 + colour.a);

    v_position = pos;

    // Pos x any y can only be positive as it's uv space, so in order to convert them into clip space we double it and subtract 1 so that it can be anywhere on screen.
    // Read about texture coords here: https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
    // This also flips it so 0,0 is top left as opposed to bottom left.
    float x = (pos.x * 2.0) - 1.0;
    float y = 1.0 - 2.0 * (pos.y);    

    gl_PointSize = particleSize;
    gl_Position = vec4(x, y, 0, 1.0);
}`),

frag: (
`#version 300 es
precision mediump float;
uniform vec3 particleColour;
uniform sampler2D particleColourTexture;
out vec4 fragColor;
in vec4 v_colour;
in vec2 v_position;

void main(){
    fragColor = texture(particleColourTexture, v_position);
}`)};