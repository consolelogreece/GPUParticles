var fragShadersrc = (
`#version 300 es
precision mediump float;
out vec4 fragColor;

in vec2 v_textureCoord;
uniform sampler2D sampler;

void main(){
    vec4 colour = texture(sampler, (1.0 + v_textureCoord) / 2.0);

    vec3 rgb = vec3(26.0, 10.0, 0.0) / 255.0;

    // This fades to black with 50% alpha for the trail effect.
    fragColor = mix(colour, vec4(rgb.rgb, 0.3), 0.14);
}
`);
    
var vertShadersrc = (
`#version 300 es
in vec2 a_xycoord;
out vec2 v_textureCoord;

void main() {
    v_textureCoord = a_xycoord;
    gl_Position = vec4(a_xycoord, 0.0, 1.0); 
}
`);
    
var gl = document.getElementById("c").getContext("webgl2", {preserveDrawingBuffer: false});
var vertShader = utils.createShader(gl, gl.VERTEX_SHADER, vertShadersrc);
var fragShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fragShadersrc);
var fadeBackgroundProgram = utils.createProgram(gl, vertShader, fragShader);