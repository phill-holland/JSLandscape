var width = 12;
var height = 12;

var height_map = new Array(width * height);

var temp_x = new Array(width * height);
var temp_y = new Array(width * height);

var position_x = 0;
var position_y = 0;

function start()
{
    for(var i = 0; i < width * height; ++i)
    {
        height_map[i] = 0;
    }
    
    position_x = 0;
    seed(position_x);
    
    for(var x = 0; x < width; ++x)
    {
        seed(x);
        init_vertical(x);
    }
}
            

function init_vertical(x_offset)
{
    var y;
    var x = x_offset;
    
    for(y = 0; y < height; ++y)
    {
        height_map[x] = random();
        x += width;
    }
}

function init_horz(y_offset)
{
    var y = y_offset * width;
    var x;
    
    for(x = 0; x < width; ++x)
    {
        height_map[y + x] = random();
    }
}

function ror()
{
    var yoffset = 0;
    for(var y = 0; y < height; ++y)
    {
        for(var x = width - 1; x >= 0; x--)
        {
            var destination = yoffset + x;
            var source = destination - 1;
            height_map[destination] = height_map[source];
        }
        yoffset += width;
    }
}

function rol()
{
    var yoffset = 0;
    for(var y = 0; y < height; ++y)
    {
        for(var x = 0; x < width - 1; ++x)
        {
            var destination = yoffset + x;
            var source = destination + 1;
            height_map[destination] = height_map[source];
        }
        yoffset += width;
    }
}

function rou()
{
    var yoffset = 0;
    for(var y = 0; y < height - 1; ++y)
    {
        for(var x = 0; x < width; ++x)
        {
            var destination = yoffset + x;
            var source = yoffset + width + x;
            height_map[destination] = height_map[source];
        }
        yoffset += width;
    }
}

function rod()
{
    var yoffset = (height - 1) * width;
    for(var y = height - 1; y >= 0; --y)
    {
        for(var x = 0; x < width; ++x)
        {
            var destination = yoffset + x;
            var source = (yoffset - width) + x;
            height_map[destination] = height_map[source];
        }
        yoffset -= width;
    }
}

function hash(a, b)
{
    return (a << 1) ^ b;
}
