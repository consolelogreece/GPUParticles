
function GetUpdateParticlesProgramSrc(userText)
{
    if (!userText || userText == ""){
        userText = presets.Swirls;
    }

    updateParticlesProgramSrc = {
        vert: (
        `#version 300 es
        in vec2 a_xycoord;
        out vec2 v_texturePosition;
        
        void main() {
            // Texture position is from 0,0 to 1,1. This makes clip space weird as it's from -1,-1 to 1,1.
            // This essentially normalizes the clip space to match the texture coordinates.
            v_texturePosition = (1.0 + a_xycoord) / 2.0;
        
            gl_Position = vec4(a_xycoord, 0,1);
        }
        `),
                
        frag: (
        `#version 300 es

        // All desktop GPUs will always use highp floats. Setting highp here instead of mediump is for the benefit of mobiles. 
        // It will affect mobile performance ofcourse and won't work at all on older phones, but the program will not work properly without it.
        // Read more here: https://webglfundamentals.org/webgl/lessons/webgl-qna-when-to-choose-highp--mediump--lowp-in-shaders.html
        precision highp float;
        
        uniform sampler2D particles;
        uniform float randomSeed;
        uniform float respawnPositionThreshold; // This will be between 0 and 1, the lower the threshold, the more likely a particle is to have it's position reset.

        // This will hold the ratios to multiply then divide the position by after the position has been updated so that the particles aren't warped by real screen dimensions.
        uniform vec2 displayDimensionRatios;
        
        out vec4 fragColor;
        in vec2 v_texturePosition;
        
        // Gratefully taken from: https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
        float rand(const vec2 co) {
            float t = dot(vec2(12.9898, 78.233), co);
            return fract(sin(t) * (4375.85453 + t));
        }

        ${userText} 
     
        void main(){
            // get the pixel colour at the given position
            vec4 colour = texture(particles, v_texturePosition);
        
            // find the x and y values from the colour. x = r + g, y = b + a.
            // positions range from 0 to 1. to recode, we will have to remultiply by 255 wherever necessary.
            vec2 pos = vec2(colour.r / 255.0 + colour.b, colour.g / 255.0 + colour.a);

            vec2 randomSeedVector = vec2(pos + v_texturePosition) * randomSeed;

            vec2 randomLocation = vec2(rand(vec2(pos.y, v_texturePosition) * randomSeed), rand(vec2(pos.x, colour.a) * randomSeed));

            // If this is true, and we resetW position anyway, no need to perform the other position calculations...
            if (rand(randomSeedVector) > respawnPositionThreshold)
            {
                // Reset position to a random location.
                pos = randomLocation;
            }
            else
            {    
                // Do whatever we want to update the position of the particle.
                pos = calculateNewPosition(pos, displayDimensionRatios, randomLocation);
            }
            
            // convert the positions back in to a colour and write them to the texture (this will be texture2, and not the default texture(canvas)).
            fragColor = vec4(fract(pos * 255.0), floor(pos * 255.0) / 255.0);
        }
        `)};

    return updateParticlesProgramSrc;
}