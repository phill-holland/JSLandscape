
var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

function seed(i) 
{
	m_w = i;
	m_z = 987654321;
	mask = 0xffffffff;
}

function random()
{
	m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
	m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
	var result = ((m_z << 16) + m_w) & mask;
	result /= 4294967296;
	return result + 0.5;
}

function degToRad(degrees)
{
	return degrees * Math.PI / 180.0;
}

function catmull(t0, t1, t2, t3, position)
{
	var time2 = position * position;
	var time3 = position * position * position;

	var temp = (2.0 * t1) + (-t0 + t2) * position;
	temp += (2.0 * t0 - 5.0 * t1 + 4.0 * t2 - t3) * time2;
	temp += (-t0 + 3.0 * t1 - 3.0 * t2 + t3) * time3;
	temp *= 0.5;

	return temp;
}	

function computeRotationMatrix(target_x, target_y, target_z, ref_x, ref_y, ref_z, position_x, position_y, position_z)
{
	var v1x = position_x - target_x;
	var v1y = position_y - target_y;
	var v1z = position_z - target_z;
	
	var length = Math.sqrt(v1x * v1x + v1y * v1y + v1z * v1z);
	var t = 1.0 / (length + 0.001);
	v1x *= t; v1y *= t; v1z *= t;
	
	var angle = ref_x * v1x + ref_y * v1y + ref_z * v1z;

	var axis_x = v1y * ref_z - v1z * ref_y;
	var axis_y = v1z * ref_x - v1x * ref_z;
	var axis_z = v1x * ref_y - v1y * ref_x;				
	
	var s = Math.sqrt((1.0 + angle) * 2.0);
	
	axis_x = axis_x / s;
	axis_y = axis_y / s;
	axis_z = axis_z / s;
	
	angle = s / 2.0;
					
	var m = mat4.create();
	
	var xx = axis_x * axis_x;
	var yy = axis_y * axis_y;
	var zz = axis_z * axis_z;

	s = 2.0 / (xx + yy + zz + (angle * angle));
	
	m[0] = 1.0 - s * (yy + zz); m[1] = s * (axis_x * axis_y - angle * axis_z); m[2] = s * (axis_x * axis_z + angle * axis_y); m[3] = 0.0;				
	m[4] = s * (axis_x * axis_y + angle * axis_z); m[5] = 1.0 - s * (xx + zz); m[6] = s * (axis_y * axis_z - angle * axis_x); m[7] = 0.0;				
	m[8] = s * (axis_x * axis_z - angle * axis_y); m[9] = s * (axis_y * axis_z + angle * axis_x); m[10] = 1.0 - s * (xx + yy); m[11] = 0.0;				
	m[12] = 0.0; m[13] = 0.0; m[14] = 0.0; m[15] = 1.0;
	
	return m;
}

function switchPrograms(currentProgram, newProgram)
{
	var currentAttributes = gl.getProgramParameter(currentProgram, gl.ACTIVE_ATTRIBUTES);
	var newAttributes = gl.getProgramParameter(newProgram, gl.ACTIVE_ATTRIBUTES);

	if (newAttributes > currentAttributes)
	{
		for (var i = currentAttributes; i < newAttributes; i++)
		{
			gl.enableVertexAttribArray(i);
		}
	}
	else if (newAttributes < currentAttributes)
	{
		for (var i = newAttributes; i < currentAttributes; i++)
		{
			gl.disableVertexAttribArray(i);
		}
	}

	gl.useProgram(newProgram);
}

function outputMatrix(rotation)
{
	console.log('[' + rotation[0] + ',' + rotation[1] + ',' + rotation[2] + ',' + rotation[3] + ']');
	console.log('[' + rotation[4] + ',' + rotation[5] + ',' + rotation[6] + ',' + rotation[7] + ']');
	console.log('[' + rotation[8] + ',' + rotation[9] + ',' + rotation[10] + ',' + rotation[11] + ']');
	console.log('[' + rotation[12] + ',' + rotation[13] + ',' + rotation[14] + ',' + rotation[15] + ']');
}