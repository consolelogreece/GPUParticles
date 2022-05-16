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

uniform sampler2D sceneTexture1;
uniform float trailFadeRate; // This will be between 0 and 1, with the 0 being for the longest trail.
uniform vec4 backgroundColour;
in vec2 v_textureCoord;
out vec4 fragColor;

void main(){
    vec4 colour = texture(sceneTexture1, (1.0 + v_textureCoord) / 2.0);

    fragColor =  mix(colour, backgroundColour / 255.0, trailFadeRate);
}
`)};