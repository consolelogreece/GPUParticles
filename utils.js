function createShader(webglContext, type, src)
{
    var shader = webglContext.createShader(type);
    webglContext.shaderSource(shader, src);
    webglContext.compileShader(shader);
    if (!webglContext.getShaderParameter(shader, webglContext.COMPILE_STATUS)) console.log(gl.getShaderInfoLog(shader));

    return shader;
}

function createProgram(webglContext, vertShader, fragShader)
{
    var program = webglContext.createProgram();
    webglContext.attachShader(program, vertShader);
    webglContext.attachShader(program, fragShader);
    webglContext.linkProgram(program);
    if (!webglContext.getProgramParameter(program, webglContext.LINK_STATUS)) console.log(webglContext.getProgramInfoLog(program));

    return program;
}

function createTexture(webglContext, target, level, internalformat, width, height, border, format, type, data)
{
    var texture = webglContext.createTexture();
    webglContext.bindTexture(target, texture);
    webglContext.texImage2D(target, level, internalformat /*describes the format output by the shader*/, width, height, border, format, 
    type /*last two values describe the format of the texture data used*/, data) // think of this as the gl.bufferData equivalent for shaders
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_S, webglContext.CLAMP_TO_EDGE);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_T, webglContext.CLAMP_TO_EDGE);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MIN_FILTER, webglContext.NEAREST);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MAG_FILTER, webglContext.NEAREST);
    
    return texture;
}

function createBindArrayBuffer(webglContext, program, attribName, data, drawType)
{
    var attrib = webglContext.getAttribLocation(program, attribName);
    webglContext.enableVertexAttribArray(attrib);
    var buffer = webglContext.createBuffer();
    webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffer);
    webglContext.bufferData(webglContext.ARRAY_BUFFER, data, drawType);
    webglContext.enableVertexAttribArray(attrib);

    return {attribLocation: attrib, buffer:buffer};
}

function createProgramFromSrc(webglContext, vertSrc, fragSrc)
{
    var vertShader = utils.createShader(webglContext, webglContext.VERTEX_SHADER, vertSrc);
    var fragShader = utils.createShader(webglContext, webglContext.FRAGMENT_SHADER, fragSrc);
    return utils.createProgram(webglContext, vertShader, fragShader);
}

const utils = {
    createShader: createShader,
    createProgram: createProgram,
    createTexture: createTexture,
    createBindArrayBuffer: createBindArrayBuffer,
    createProgramFromSrc: createProgramFromSrc
}