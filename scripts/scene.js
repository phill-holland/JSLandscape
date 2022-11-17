var gl;
			
function initGL(canvas) 
{
    try 
    {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } 
    catch (e)
    {
    }

    if (!gl) alert("Could not initialise WebGL, sorry :-(");
}

function getShader(gl, id) 
{
    var shaderScript = document.getElementById(id);
    if (!shaderScript) return null;

    var str = "";
    var k = shaderScript.firstChild;
    while (k) 
    {
        if (k.nodeType == 3) 
        {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") 
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } 
    else if (shaderScript.type == "x-shader/x-vertex") 
    {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } 
    else return null;

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
    {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

var shaderProgram;
var shaderCubeProgram;

function initShaders()
{
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
    {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    
    shaderProgram.vertexColourAttribute = gl.getAttribLocation(shaderProgram, "aVertexColour");
    gl.enableVertexAttribArray(shaderProgram.vertexColourAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");				
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

    shaderProgram.ambientColourUniform = gl.getUniformLocation(shaderProgram, "uAmbientColour");
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
    shaderProgram.directionalColourUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColour");
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() 
{
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

var triangleVertexPositionBuffer;
var triangleVertexNormalBuffer;
var triangleVertexColourBuffer;

var x_scale = 5.0;
var y_scale = 5.0;
var z_scale = 1.0;
    
function initVertices()
{
    var total_points = (width - 1) * (height - 1) * 6;

    var vertices = new Array(total_points * 3);				
    
    var y_value = -1.0;
    
    var y_increment = 2.0 / height;
    var x_increment = 2.0 / width;
                    
    var index = 0;
    
    for(y = 0; y < height - 1; ++y)
    {
        var x_value = -1.0;
        
        for(x = 0; x < width - 1; ++x)
        {
            var top_left = (y * width) + x;
            var bottom_left = ((y + 1) * width) + x;
            
            var top_right = top_left + 1;
            var bottom_right = bottom_left + 1;
            
            vertices[index++] = x_value * x_scale;
            vertices[index++] = y_value * y_scale;
            vertices[index++] = height_map[top_left] * z_scale;

            
            vertices[index++] = (x_value + x_increment) * x_scale;
            vertices[index++] = y_value * y_scale;
            vertices[index++] = height_map[top_right] * z_scale;
            
            vertices[index++] = x_value * x_scale;
            vertices[index++] = (y_value + y_increment) * y_scale;
            vertices[index++] = height_map[bottom_left] * z_scale;
                                    
            vertices[index++] = (x_value + x_increment) * x_scale;
            vertices[index++] = y_value * y_scale;
            vertices[index++] = height_map[top_right] * z_scale;
            
            vertices[index++] = (x_value + x_increment) * x_scale;
            vertices[index++] = (y_value + y_increment) * y_scale;
            vertices[index++] = height_map[bottom_right] * z_scale;
            
            vertices[index++] = x_value * x_scale;
            vertices[index++] = (y_value + y_increment) * y_scale;
            vertices[index++] = height_map[bottom_left] * z_scale;
            
            x_value += x_increment;
        }
        
        y_value += y_increment;
    }
    
    return vertices;
}

function initNormals(vertices)
{
    var total_points = (width - 1) * (height - 1) * 6;

    var normals = new Array(total_points * 3);				
                                    
    var index;
    var output = 0;
    
    for(index = 0; index < vertices.length; index += 9)
    {
        var x1 = vertices[index];
        var y1 = vertices[index + 1];
        var z1 = vertices[index + 2];
        
        var x2 = vertices[index + 3];
        var y2 = vertices[index + 4];
        var z2 = vertices[index + 5];
        
        var x3 = vertices[index + 6];
        var y3 = vertices[index + 7];
        var z3 = vertices[index + 8];
        
        var v1x = x1 - x2;
        var v1y = y1 - y2;
        var v1z = z1 - z2;
        
        var v2x = x2 - x3;
        var v2y = y2 - y3;
        var v2z = z2 - z3;
        
        var x = v2y * v1z - v2z * v1y;
        var y = v2z * v1x - v2x * v1z;
        var z = v2x * v1y - v2y * v1x;
        
        var length = 1.0 / (Math.sqrt(x * x + y * y + z * z) + 0.001);
        
        var temp_x = x * length;
        var temp_y = y * length;
        var temp_z = z * length;
        
        normals[output++] = temp_x;
        normals[output++] = temp_y;
        normals[output++] = temp_z;
        
        normals[output++] = temp_x;
        normals[output++] = temp_y;
        normals[output++] = temp_z;
        
        normals[output++] = temp_x;
        normals[output++] = temp_y;
        normals[output++] = temp_z;
        
    }
    
    return normals;
}

function initVerticesColour()
{
    var total_points = (width - 1) * (height - 1) * 6;
    
    var colours = new Array(total_points * 4); // varies depending on height
    
    var global_width = 100.0;
    var global_height = 100.0;
     
    var g = ((position_x / (global_width + width)) / 2.0) + 0.5;
    var f = ((position_y / (global_height + height)) / 2.0) + 0.5;
    
    var colour_increment = (1.0 / global_height) / 2.0;
    var colour_increment_x = (1.0 / global_width) / 2.0;
    
    var red = 0.0;
    var green = 0.0;
    var blue = 1.0;
    var alpha = 1.0;
    
    var colour_index = 0;
    
    for(y = 0; y < height - 1; ++y)
    {			
        for(x = 0; x < width - 1; ++x)
        {					
            // top left
            colours[colour_index++] = f + (y * colour_increment);//red;
            colours[colour_index++] = g + (x * colour_increment_x);
            colours[colour_index++] = blue;
            colours[colour_index++] = alpha;
            
            // top right
            colours[colour_index++] = f + (y * colour_increment);
            colours[colour_index++] = g + ((x + 1.0) * colour_increment_x);
            colours[colour_index++] = blue;
            colours[colour_index++] = alpha;
            
            // bottom left
            colours[colour_index++] = f + ((y + 1.0) * colour_increment);
            colours[colour_index++] = g + (x * colour_increment_x);
            colours[colour_index++] = blue;
            colours[colour_index++] = alpha;
            
            // ***
            
            // top right
            colours[colour_index++] = f + (y * colour_increment);
            colours[colour_index++] = g + ((x + 1.0) * colour_increment_x);
            colours[colour_index++] = blue;
            colours[colour_index++] = alpha;
            
            // bottom right
            colours[colour_index++] = f + ((y + 1.0) * colour_increment);
            colours[colour_index++] = g + ((x + 1.0) * colour_increment_x);
            colours[colour_index++] = blue;
            colours[colour_index++] = alpha;
            
            // bottom left
            colours[colour_index++] = f + ((y + 1.0) * colour_increment);
            colours[colour_index++] = g + (x * colour_increment_x);
            colours[colour_index++] = blue;
            colours[colour_index++] = alpha;						
        }
    }
    
    return colours;
}

function initBuffers()
{				
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
                    
    var total_points = (width - 1) * (height - 1) * 6;
    
    var vertices = initVertices();
    var normals = initNormals(vertices);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = total_points;
    
    // ****
    
    triangleVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    triangleVertexNormalBuffer.itemSize = 3;
    triangleVertexNormalBuffer.numItems = total_points;
    
    // ****
    
    triangleVertexColourBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColourBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initVerticesColour()), gl.STATIC_DRAW);
    triangleVertexColourBuffer.itemSize = 4;
    triangleVertexColourBuffer.numItems = total_points;
    
    // ***
            
}


var termRotationPosition = 0.0;
var termRotationIncrement = 0.001;
var termRotationIndex = 0;
            
function getRotationPosition()
{			
    termRotationPosition += termRotationIncrement;
    if(termRotationPosition > 1.0)
    {
        termRotationPosition = 0.0;
        termRotationIndex++;
        if(termRotationIndex >= total_cube_terms)
            termRotationIndex = 0;
        
        var i;
        for(i = 0; i < total_cubes; ++i)
        {
            xtrotation[i][0] = xtrotation[i][1];
            xtrotation[i][1] = xtrotation[i][2];
            xtrotation[i][2] = xtrotation[i][3];											
            xtrotation[i][3] = xrotation_terms[i][termRotationIndex];
            
            ytrotation[i][0] = ytrotation[i][1];
            ytrotation[i][1] = ytrotation[i][2];
            ytrotation[i][2] = ytrotation[i][3];											
            ytrotation[i][3] = yrotation_terms[i][termRotationIndex];
            
            ztrotation[i][0] = ztrotation[i][1];
            ztrotation[i][1] = ztrotation[i][2];
            ztrotation[i][2] = ztrotation[i][3];											
            ztrotation[i][3] = zrotation_terms[i][termRotationIndex];
        }
    }				
}
