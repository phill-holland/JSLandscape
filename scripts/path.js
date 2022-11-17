var x_terms = [  0.0, 20.0, 40.0, 40.0, 40.0 ];
var y_terms = [  0.0,  0.0,  0.0, 20.0, 40.0 ];
var z_terms = [  2.0,  2.0,  2.0,  2.0,  2.0 ];

var looking_x_terms = [ 20.0, 40.0, 40.0, 40.0 ];
var looking_y_terms = [  0.0,  0.0, 20.0, 40.0 ];
var looking_z_terms = [  0.0,  0.0,  0.0,  0.0 ];

var termIndex = 0;
var termPosition = 0.0;
var termIncrement = 0.005;

var xt = [ 0.0, 0.0, 0.0, 0.0 ];
var yt = [ 0.0, 0.0, 0.0, 0.0 ];
var zt = [ 0.0, 0.0, 0.0, 0.0 ];

var lookingxt = [ 0.0, 0.0, 0.0, 0.0 ];
var lookingyt = [ 0.0, 0.0, 0.0, 0.0 ];
var lookingzt = [ 0.0, 0.0, 0.0, 0.0 ];

var lastX_walk = 0.0;
var lastY_walk = 0.0;

var lastX_walk_increment = 40.0;
var lastY_walk_increment = 40.0;

function generatePaths()
{
    var terms = 8;
    var i;
    
    for(i = 0; i < terms; ++i)
    {
        var x = Math.random() * lastX_walk_increment;
        var y = Math.random() * lastY_walk_increment;
        
        x_terms[i] = lastX_walk + x;
        y_terms[i] = lastY_walk + y;
        
        lastX_walk += x;
        lastY_walk += y;
    }
    
    for(i = 0; i < terms - 1; ++i)
    {
        looking_x_terms[i] = x_terms[i + 1];
        looking_y_terms[i] = y_terms[i + 1];
        
        cube_x_terms[i] = x_terms[i + 1];
    }
}

function getNextPath()
{
    var terms = 8;
    var i;
    
    for(i = 0; i < terms - 1; ++i)
    {
        x_terms[i] = x_terms[i + 1];
        y_terms[i] = y_terms[i + 1];
        
        looking_x_terms[i] = x_terms[i + 1];
        looking_y_terms[i] = y_terms[i + 1];
        
        cube_x_terms[i] = x_terms[i + 1];
    }

    var x = Math.random() * lastX_walk_increment;
    var y = Math.random() * lastY_walk_increment;
    
    var tx = lastX_walk + x;
    var ty = lastY_walk + y;
    
    x_terms[terms - 1] = tx;
    y_terms[terms - 1] = ty;
    
    looking_x_terms[terms - 1] = tx;
    looking_y_terms[terms - 1] = ty;
    
    cube_x_terms = tx;
    
    lastX_walk += x;
    lastY_walk += y;
}

function incTerm(index, data)
{
    var i = index + 1;
    if(i >= data.length) i = 0;
    
    return i;
}
                
function initTerms(data)
{			
    var result = [ data[0], data[1], data[2], data[3] ];
    
    return result;
}

function shuffleTerms(data)
{
    var result = [ data[1], data[2], data[3], 0.0 ];
    
    return result;
}

function getPosition()
{			
    termPosition += termIncrement;
    if(termPosition > 1.0)
    {
        var next_x = x_terms[4];
        var next_y = y_terms[4];
        var next_z = z_terms[4];
        
        next_x += (Math.random() * 40.0) - 20.0;
        next_y += 20.0;
        next_z = 2.0;
        
        x_terms = [ x_terms[1], x_terms[2], x_terms[3], x_terms[4], next_x ];//shuffleTerms(x_terms); // check this 
        y_terms = [ y_terms[1], y_terms[2], y_terms[3], y_terms[4], next_y ];
        z_terms = [ z_terms[1], z_terms[2], z_terms[3], z_terms[4], next_z ];
        
        looking_x_terms = [ looking_x_terms[1], looking_x_terms[2], looking_x_terms[3], next_x ];//shuffleTerms(looking_x_terms);
        looking_y_terms = [ looking_y_terms[1], looking_y_terms[2], looking_y_terms[3], next_y ];
        looking_z_terms = [ looking_z_terms[1], looking_z_terms[2], looking_z_terms[3], next_z ];
        
        termPosition = 0.0;
        termIndex = incTerm(termIndex, x_terms);
    }
    
    var x = catmull(x_terms[0], x_terms[1], x_terms[2], x_terms[3], termPosition);
    var y = catmull(y_terms[0], y_terms[1], y_terms[2], y_terms[3], termPosition);
    var z = catmull(z_terms[0], z_terms[1], z_terms[2], z_terms[3], termPosition);
    
    var lx = catmull(looking_x_terms[0], looking_x_terms[1], looking_x_terms[2], looking_z_terms[3], termPosition);
    var ly = catmull(looking_y_terms[0], looking_y_terms[1], looking_y_terms[2], looking_z_terms[3], termPosition);
    var lz = catmull(looking_z_terms[0], looking_z_terms[1], looking_z_terms[2], looking_z_terms[3], termPosition);

    var result = [ x, y, z, lx, ly, lz ];
    
    return result;
}		
