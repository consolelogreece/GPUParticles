var fadeSceneTextureProgramSrc = {
vert: (
`#version 300 es
in vec2 a_xycoord;
out vec2 v_textureCoord;

void main() {
    v_textureCoord = a_xycoord;
    gl_Position = vec4(a_xycoord, 0.0, 1.0); 
}
`),
    
frag: (
`#version 300 es
precision mediump float;

uniform sampler2D sampler;
uniform float trailFadeRate; // This will be between 0 and 1, with the 0 being for the longest trail.
uniform vec3 backgroundColour;
in vec2 v_textureCoord;
out vec4 fragColor;

void main(){
    vec4 colour = texture(sampler, (1.0 + v_textureCoord) / 2.0);

    // This fades to the background colour with alpha for the trail effect.
    fragColor = mix(colour, vec4(backgroundColour / 255.0, 1.0), trailFadeRate);
}
`)};