var FaultAlgorithm = function () {

	var size = 255;
    var max = size - 1;
    var map = new Float32Array(size * size);

    var offset = 100;
    var minValue = 0;
    var maxValue = 0;

    function set (x, y, val) {
        map[x + size * y] = val;
    }

    function get (x, y) {
        if (x < 0 || x > max || y < 0 || y > max) return -1;
        return map[x + size * y];
    }

	return {

		GetHeightMap: function ( worldSize, iterations, useSineWave = false, sineWaveSize = 2500)  {

			// Initialise the heightmap
			size = worldSize;
            max = size - 1;
            map = new Float32Array(size * size);
            for (var j = 0; j < size * size; j++) {
				map[j] = 0;
			}

            for (var i = 0; i < iterations; i++) {
            	
            	// Points on line
				var x1 = Math.floor(Math.random() * max);
				var y1 = Math.floor(Math.random() * max);
				var x2 = Math.floor(Math.random() * max);
				var y2 = Math.floor(Math.random() * max);

				// Loop through points, offsetting each on based on which side of the line it is on
				for (var y = 0; y < max; y++) {
                    for (var x = 0; x < max; x++) {

                    	var current = get(x,y);

                    	// Get the distance from the line
                    	var dist = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);

						if (useSineWave) {
							var ease = Math.sin(((1/sineWaveSize * Math.PI)) * dist) * offset
							if (dist > sineWaveSize / 2) ease = offset;
							if (dist < -sineWaveSize / 2) ease = -offset;
						}
						else {
							if (dist > 0) ease = offset;
							else ease = -offset;
						}

                        set(x,y, current + ease);
                        if (current + ease > maxValue) maxValue = current + ease;
						if (current + ease < minValue) minValue = current + ease;	

                    }
                }

			}

			// Convert between -1 & 1
			for (var k = 0; k < size * size; k++) {
				map[k] = (map[k]-minValue)/(maxValue-minValue) * 2 - 1;
			}

			return map;
		}
	}
};