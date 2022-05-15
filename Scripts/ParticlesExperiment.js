class ParticlesExperiment {
    constructor(gl, nParticleDimensions, particleSize, trailFadeRate, respawnChance, particleColour, backgroundColour, img, width, height)
    {
        this.gl = gl;
        this.utils = utils;

        this.gl.canvas.width = width;
        this.gl.canvas.height = height;

        this.setState(nParticleDimensions, particleSize, trailFadeRate, respawnChance, particleColour, backgroundColour, img, width, height);
        this.setupTextures();
        this.setupFrameBuffers();
        this.setupShaderPrograms();
        
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }

    setState(nParticleDimensions, particleSize, trailFadeRate, respawnThreshold, particleColour, backgroundColour, img, width, height)
    {
        this.config = {
            particles: {
                nParticleDimensions: nParticleDimensions, // This will represent the size of the 2D particle texture. E.g., if nParticleDimensions = 100, there will be 100x100 particles.
                nParticles: nParticleDimensions * nParticleDimensions,
                particleSize: particleSize,
                trailFadeRate: trailFadeRate,
                respawnThreshold: respawnThreshold
            },
            colours: {
                particleColour: new Uint8Array(particleColour),
                backgroundColour: new Uint8Array(backgroundColour),
                particleTextureImage: img
            },
            sceneDimensions: {
                width: width,
                height: height
            }
        }
        
        // We need an array with the same number of indexes as the pixel buffer. This is basically 
        // how we get the vertex shader to run X times for each pixel of the partcile position texture. 
        // We use each one of these positions as points in the draw arrays method, and calculate the position of the particle 
        // we need in the vertex shader of the draw program.
        var positionsArray = [];
        for(var i = 0; i < this.config.particles.nParticleDimensions; i++) {
            for(var j = 0; j < this.config.particles.nParticleDimensions; j++) positionsArray.push(i, j);
        }
        var positionsFloatArray = new Float32Array(positionsArray);

        // Create an initial texture with randomized positions of starting pixels
        // Remember, the X position of the particle is the red + blue values, and the y position is the
        // blue + alpha values. This is done for accuracy purposes as we can store many more possible values between the two.
        // Each value can be up to 255, hence the random number between 0 and 255.
        var pixelRGBArray = [];
        function random255(){return Math.floor(Math.random() * 256);}
        for(var  i = 0; i < this.config.particles.nParticles * 4 /*Multiply by 4 as 1 for each RGBA*/; i++) pixelRGBArray.push(random255());
        var pixels = new Uint8Array(pixelRGBArray);

        // This is used tp draw 2 triangles to cover the whole texture. 
        // Thanks to the interpolation that happens in the shader, each pixel will therefore be covered, meaning every 
        // particle will be drawn as 1 pixel = 1 encoded particle and will thus be processed by the fragment shader.
        var triangleData = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0]); // two triangles together covering whole clip space;

        this.data = {
            positions: positionsFloatArray,
            pixels: pixels,
            clipSpaceTriangles: triangleData
        }        
    }

    setupShaderPrograms()
    {
        this.programs = {};
        this.setupDrawParticlesProgram(drawParticlesProgramSrc.vert, drawParticlesProgramSrc.frag);
        this.setupDrawSceneTextureProgram(drawSceneTextureProgramSrc.vert, drawSceneTextureProgramSrc.frag);
        this.setupFadeSceneTextureProgram(fadeSceneTextureProgramSrc.vert, fadeSceneTextureProgramSrc.frag);

        var updateParticlesProgramSrc = GetUpdateParticlesProgramSrc();
        this.setupUpdateParticlesProgram(updateParticlesProgramSrc.vert, updateParticlesProgramSrc.frag); 
    }

    setupDrawParticlesProgram(vertSrc, fragSrc)
    {
        var program = this.utils.createProgramFromSrc(this.gl, vertSrc, fragSrc);

        this.programs.drawParticles = {
            program: program,
            locations:{
                uniforms: {
                    nParticleDimensions: this.gl.getUniformLocation(program, "nParticleDimensions"),
                    particleSize: this.gl.getUniformLocation(program, "particleSize"),
                    particleColourTexture: this.gl.getUniformLocation(program, "particleColourTexture"),
                    particleLocationsTexture: this.gl.getUniformLocation(program, "particleLocationsTexture")
                } 
            },
            buffers: {
                positionIndex: this.utils.createBindArrayBuffer(this.gl, program, "a_positionIndex", this.data.positions, this.gl.STATIC_DRAW)
            },
            // Learned about texture units here: https://www.youtube.com/watch?v=0nZn5YPNf5k at around 17:20
            textureUnits: {
                particleLocationsTexture: 0,
                particleColourTexture: 1
            }
        }

        this.gl.useProgram(program);
        this.gl.uniform1f(this.programs.drawParticles.locations.uniforms.nParticleDimensions, this.config.particles.nParticleDimensions);
        this.gl.uniform1f(this.programs.drawParticles.locations.uniforms.particleSize, this.config.particles.particleSize);

        this.gl.uniform1i(this.programs.drawParticles.locations.uniforms.particleColourTexture, this.programs.drawParticles.textureUnits.particleColourTexture); 
        this.gl.uniform1i(this.programs.drawParticles.locations.uniforms.particleLocationsTexture, this.programs.drawParticles.textureUnits.particleLocationsTexture);
    }

    setupDrawSceneTextureProgram(vertSrc, fragSrc) 
    {
        var program = this.utils.createProgramFromSrc(this.gl, vertSrc, fragSrc);

        this.programs.drawSceneTexture = {
            program: program,
            buffers: {
                wholeClipSpaceTriangleBuffer: this.utils.createBindArrayBuffer(this.gl, program, "a_xycoord", this.data.clipSpaceTriangles, this.gl.STATIC_DRAW)
            }
        }
    }

    setupFadeSceneTextureProgram(vertSrc, fragSrc)
    {
        var program = this.utils.createProgramFromSrc(this.gl, vertSrc, fragSrc);

        this.programs.fadeSceneTexture = {
            program: program,
            locations: {
                uniforms: {
                    trailFadeRate:  this.gl.getUniformLocation(program, "trailFadeRate"),
                    backgroundColour: this.gl.getUniformLocation(program, "backgroundColour")  
                }
            },
            buffers: {
                wholeClipSpaceTriangleBuffer: this.utils.createBindArrayBuffer(this.gl, program, "a_xycoord", this.data.clipSpaceTriangles, this.gl.STATIC_DRAW)
            }
        }

        this.gl.useProgram(program);
        this.gl.uniform1f(this.programs.fadeSceneTexture.locations.uniforms.trailFadeRate, this.config.particles.trailFadeRate);
        this.gl.uniform3fv(this.programs.fadeSceneTexture.locations.uniforms.backgroundColour, this.config.colours.backgroundColour);
    }

    setupUpdateParticlesProgram(vertSrc, fragSrc)
    {
        var program = this.utils.createProgramFromSrc(this.gl, vertSrc, fragSrc);

        this.programs.updateParticles = {
            program: program,
            locations: {
                uniforms: {
                    randomSeed: this.gl.getUniformLocation(program, "randomSeed"),
                    respawnThreshold: this.gl.getUniformLocation(program, "respawnPositionThreshold"),
                    displayDimensionRatios: this.gl.getUniformLocation(program, "displayDimensionRatios")  
                }
            },
            buffers: {
                wholeClipSpaceTriangleBuffer: this.utils.createBindArrayBuffer(this.gl, program, "a_xycoord", this.data.clipSpaceTriangles, this.gl.STATIC_DRAW)
            }
        }

        this.gl.useProgram(program);
        this.gl.uniform1f(this.programs.updateParticles.locations.uniforms.respawnThreshold, this.config.particles.respawnThreshold);
        
        var width = this.config.sceneDimensions.width;
        var height = this.config.sceneDimensions.height;

        var widthRatio = width > height ? height / width : 1;
        var heightRatio = height > width ? width / height : 1;
        
        this.gl.uniform2f(this.programs.updateParticles.locations.uniforms.displayDimensionRatios, widthRatio, heightRatio);
    }

    setupTextures()
    {   
        var particleColourTexturePixels = [];

        for(var i = 0; i < this.config.sceneDimensions.width * this.config.sceneDimensions.height; i++)
            particleColourTexturePixels.push(...[...this.config.colours.backgroundColour, 255])
    
        this.textures = {
            // Create the textures that will store particle position information.
            pixelLocationTexture1: this.utils.createTexture(this.gl, this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.config.particles.nParticleDimensions, 
                this.config.particles.nParticleDimensions, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.data.pixels),
            pixelLocationTexture2: this.utils.createTexture(this.gl, this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.config.particles.nParticleDimensions, 
                this.config.particles.nParticleDimensions, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.data.pixels),
                
            // Create the textures that will be useful to blend the trails later
            sceneTexture1: this.utils.createTexture(this.gl, this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.config.sceneDimensions.width, this.config.sceneDimensions.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array(particleColourTexturePixels)),
            sceneTexture2: this.utils.createTexture(this.gl, this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.config.sceneDimensions.width, this.config.sceneDimensions.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array(particleColourTexturePixels))
        }
        
        if (this.config.colours.particleTextureImage == null)
        {
            var particleColourTexturePixels = [];

            for(var i = 0; i < this.config.sceneDimensions.width * this.config.sceneDimensions.height; i++)
                particleColourTexturePixels.push(...[...this.config.colours.particleColour, 255])
            
            this.textures.particleColourTexture = this.utils.createTexture(this.gl, this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.config.sceneDimensions.width, this.config.sceneDimensions.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array(particleColourTexturePixels));
        }
        else this.textures.particleColourTexture = this.utils.createTextureFromImage(this.gl, this.config.colours.particleTextureImage);
    }

    setupFrameBuffers()
    {
        this.frameBuffers = {
            calculationframebuffer: this.gl.createFramebuffer(),
            bgframebuffer: this.gl.createFramebuffer()
        }
    }

    draw()
    {  
        this.drawToScreen();
        this.updateParticlePositions();
    };

    updateParticlePositions()
    {
        // If blend is enabled, it messes up positons completely as alpha stores position location!
        this.gl.disable(this.gl.BLEND);

        // Now we must update the particle positons, so use the update shader.
        this.gl.useProgram(this.programs.updateParticles.program);
    
        // This seed is used to calculate the number to determine whether or not to reset particle position in the shader.
        var seed = Math.random() * 256;

        this.gl.uniform1f(this.programs.updateParticles.locations.uniforms.randomSeed, seed);

        // This is how we write to a texture. We use a framebuffer and write to that instead of the default framebuffer (the canvas). 
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffers.calculationframebuffer);

        // Set the viewport. There numbers are the dimensions of the texture containing the particle location info.
        this.gl.viewport(0, 0, this.config.particles.nParticleDimensions, this.config.particles.nParticleDimensions);

        // Explicity binding to the default texture unit here just to be safe. If I don't do this, and the previous call I make is the non default texture unit, like 1, 
        // It will still think the active texture unit is 1 when it tries to bind the texture, which will ofcourse fail...
        this.gl.activeTexture(this.gl.TEXTURE0);
      
        // The shader should read from texture 1 to get the particle locations that were drawn previously.
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.pixelLocationTexture1);

        // Tell the frame buffer to write to texture 2.
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textures.pixelLocationTexture2, 0);

        // Set up the triangles that cover the whole texture so that each pixel as ran in the fragment shader via interpolation.
        // Have to rebind the buffer and do the attribpointer stuff each frame. Unsure as to sure why.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programs.updateParticles.buffers.wholeClipSpaceTriangleBuffer.buffer);
        this.gl.vertexAttribPointer(this.programs.updateParticles.buffers.wholeClipSpaceTriangleBuffer.attribLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Draw the triangles to commence updating.
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        // Swap the two textures so that we can repeat the cycle with the latest particle positions.
        // Without doing this, we would essentially keep updating the same exact old position, meaning everything would stay the same basically
        var temp = this.textures.pixelLocationTexture1;
        this.textures.pixelLocationTexture1 = this.textures.pixelLocationTexture2;
        this.textures.pixelLocationTexture2 = temp;  
    }

    drawToScreen()
    {
        // This is what allows for alpha to work so we can get trails.
        this.gl.enable(this.gl.BLEND);

        this.fadeLastFrame();
        this.drawParticlesToSceneTexture();
        this.drawScreenTextureToCanvas();

        // Switch the scene textures.
        var tempbg = this.textures.sceneTexture1;
        this.textures.sceneTexture1 = this.textures.sceneTexture2;
        this.textures.sceneTexture2 = tempbg;
    }

    fadeLastFrame()
    {
        // Copy background 1 to background 2, which also applies fading in the shader.
        this.gl.useProgram(this.programs.fadeSceneTexture.program);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffers.bgframebuffer);

        // Explicity binding to the default texture unit here just to be safe. If I don't do this, and the previous call I make is the non default texture unit, like 1, 
        // It will still think the active texture unit is 1 when it tries to bind the texture, which will ofcourse fail...
        this.gl.activeTexture(this.gl.TEXTURE0);
        
        // Read from bg texture 1.
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.sceneTexture1); 

        // Write to bg texture 2.
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textures.sceneTexture2, 0);  

        // Have to set viewport, it isn't done automatically.
        this.gl.viewport(0, 0, this.config.sceneDimensions.width, this.config.sceneDimensions.height); 

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programs.fadeSceneTexture.buffers.wholeClipSpaceTriangleBuffer.buffer);
        this.gl.vertexAttribPointer(this.programs.fadeSceneTexture.buffers.wholeClipSpaceTriangleBuffer.attribLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    drawParticlesToSceneTexture()
    {
        // Draw the particles on to the background using this shader.
        this.gl.useProgram(this.programs.drawParticles.program);
        
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffers.bgframebuffer);

        // Have to set viewport, it isn't done automatically.
        this.gl.viewport(0, 0, this.config.sceneDimensions.width, this.config.sceneDimensions.height);

        // This is the texture that holds the colour value, when drawn to the scene, of the pixel based on where it's location.
        this.gl.activeTexture(this.gl.TEXTURE0 + this.programs.drawParticles.textureUnits.particleColourTexture);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.particleColourTexture);

        // This is the texture that contains particle position locations.
        this.gl.activeTexture(this.gl.TEXTURE0 + this.programs.drawParticles.textureUnits.particleLocationsTexture);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.pixelLocationTexture1); 

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textures.sceneTexture2, 0); 

        // Have to rebind the buffer and do the attribpointer stuff each frame. Unsure as to sure why.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programs.drawParticles.buffers.positionIndex.buffer); 
        this.gl.vertexAttribPointer(this.programs.drawParticles.buffers.positionIndex.attribLocation, 2, this.gl.FLOAT, false, 0,0);

        // Draw the particles
        this.gl.drawArrays(this.gl.POINTS, 0, this.config.particles.nParticles);
    }

    drawScreenTextureToCanvas()
    {
        // Draw everything to the screen. Although the background shader is almost identical to the fade shader
        // we have to use a different one, because we want the latest particle position to have no fade.
        // If we use the fade shader here, it will work, but it'll just look worse.
        this.gl.useProgram(this.programs.drawSceneTexture.program);

        // Binding the frame buffer to null means to bind to the default context, which in webgl is the canvas.
        // In other words, this is telling the shader to draw to the canvas
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        // Explicity binding to the default texture unit here just to be safe. If I don't do this, and the previous call I make is the non default texture unit, like 1, 
        // It will still think the active texture unit is 1 when it tries to bind the texture, which will ofcourse fail...
        this.gl.activeTexture(this.gl.TEXTURE0);

        // The particle positions and stuff are all now on this texture so we just have to draw it!
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.sceneTexture2);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programs.drawSceneTexture.buffers.wholeClipSpaceTriangleBuffer.buffer);
        this.gl.vertexAttribPointer(this.programs.drawSceneTexture.buffers.wholeClipSpaceTriangleBuffer.attribLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
} 