
/*
var LoadGLFTAccessors = function(data) {

   $.each(data, function (key, val) {
		accessors.push(val);
	});
}

var LoadGLFTBufferViews = function(data) {

   $.each(data, function (key, val) {
		bufferviews.push(val);
	});
}
*/
/*
var OnLoadGLFTBInary(oEvent) { 
	  var arrayBuffer = oReq.response;
	  var byteArray = new Uint8Array(arrayBuffer);
	  
}

var LoadGLFTBinary = function(filename) {

	var oReq = new XMLHttpRequest();
	oReq.open("GET", filename, true);
	oReq.responseType = "arraybuffer";

	oReq = OnLoadGLFTBInary;
	oReq.onload = function(oEvent) {
	  var arrayBuffer = oReq.response;
	  var byteArray = new Uint8Array(arrayBuffer);
	};
	oReq.send();
}
*/
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
	
	//LoadGLFT('assets/AnimatedCube.gltf');
	//console.log("here")
	//for(var i= 0; i < accessors.length; ++i)
	$.each(accessors, function (index, acc)
	{
		//var acc = accessors[i];
		if((acc.componentType == 5126) && (acc.type == "VEC3"))
		{
			console.log('ACC');
			var accOffset = acc.offset;
			var accCount = acc.count;
			var bufferView = bufferviews[acc.bufferView];
			var bufOffset = bufferView.byteOffset;
			var bufLength = bufferView.byteLength;
			// target??
			if(bufferindex == bufferView.buffer)
			{
				var buffer = buffers[bufferView.buffer];
				var data = new Float32Array(buffer.data, bufOffset, bufLength);
				
				for(j = 0; j < data.length; j += 3)
				{
					console.log(data[j] + ' ' + data[j + 1] + ' ' + data[j + 2]);
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
			console.log(val.bufferView);
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
			  val.data = new Uint8Array(arrayBuffer);
			  buffers.push(val);
			  
			  GLTFOutput(accessors, bufferviews, buffers, buffers.length - 1);
			};

			oReq.send();
		});
	
		//LoadGLFTBuffers(data, buffers);
		
    });
}

// 5126 = float, ieee-754 (4 bytes)
// 5123 = unsigned short (2 bytes)