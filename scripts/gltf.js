
var LoadGLFTBuffers = function(data, buffers) {

   $.each(data, function (key, val) {
		
		var oReq = new XMLHttpRequest();
		oReq.open("GET", 'assets/' + val.uri, true);
		oReq.responseType = "arraybuffer";

		oReq.onload = function(oEvent) {
		  var arrayBuffer = oReq.response;
		  val.data = new Uint8Array(arrayBuffer);
		};

		oReq.send();
		buffers.push(val);
	});
}

var GLTFOutput = function(accessors, bufferviews, buffers, bufferindex) {
	
	$.each(accessors, function (index, acc)
	{
		if(acc.componentType == 5126)
		{
			var elements = 0;
			if(acc.type == "VEC2") elements = 2;
			else if(acc.type == "VEC3") elements = 3;
			else if(acc.type == "VEC4") elements = 4;
			
			if(elements > 0)
			{
				console.log('ACC ' + elements + ' ' + acc.count);
				
				var accOffset = acc.offset;
				var accCount = acc.count;
				var bufferView = bufferviews[acc.bufferView];
				var bufOffset = bufferView.byteOffset;
				var bufLength = bufferView.byteLength;

				if(bufferindex == bufferView.buffer)
				{
					var buffer = buffers[bufferView.buffer];
					var data = new DataView(buffer.data);					
					
					var output = '';
					var count = 0;
					var index = 0;
					
					for(j = 0; j < bufLength; j += Float32Array.BYTES_PER_ELEMENT)
					{
						var b = data.getFloat32(j + bufOffset, true);
						output += b + ' ';
						if(++count >= elements)
						{
							output = index + ') ' + output;
							console.log(output);
							count = 0;
							index += 1;
							output = '';
						}
					}
				}
			}
		}
	});
}

var LoadGLFT = function(filename) {
	
	$.get(filename).done(function (data) {
						
		var accessors = [];
		var bufferviews = [];
		var buffers = [];
			
		$.each(data.accessors, function (key, val) {
			accessors.push(val);
		});
				
		$.each(data.bufferViews, function (key, val) {
			bufferviews.push(val);
		});

		$.each(data.buffers, function (key, val) {
		
			var oReq = new XMLHttpRequest();
			oReq.open("GET", 'assets/' + val.uri, true);
			oReq.responseType = "arraybuffer";

			oReq.onload = function(oEvent) {
			  var arrayBuffer = oReq.response;
			  val.data = arrayBuffer;
			  buffers.push(val);
			  
			  GLTFOutput(accessors, bufferviews, buffers, buffers.length - 1);
			};

			oReq.send();
		});		
    });
}

// 5126 = float, ieee-754 (4 bytes)
// 5123 = unsigned short (2 bytes)