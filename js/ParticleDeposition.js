var ParticleDeposition = function () {

	var size = 255;
    var max = size - 1;
    var map = new Float32Array(size * size);

    function set (x, y, val) {
        map[x + size * y] = val;
    }

    function get (x, y) {
        if (x < 0 || x > max || y < 0 || y > max) return -1;
        return map[x + size * y];
    }

	return {

		GetHeightMap: function ( worldSize, sticky, particleMultiplier, numberOfDrops)  {

			size = worldSize;
            max = size - 1;
            map = new Float32Array(size * size);
            for (var j = 0; j < size * size; j++) {
				map[j] = 0;
			}

            var offset = 100;

            var numberOfParticles = Math.random() * particleMultiplier;
            
            var direction = 1;

            var minValue = 0;
            var maxValue = 0;

            for (var m = 0; m < numberOfDrops; m++) {

            	var x = Math.floor(Math.random() * max);
            	var y = Math.floor(Math.random() * max);

            	for (var i = 0; i < numberOfParticles; i ++) {

            		if (x > max) x = 0;
            		if (y > max) y = 0;
            		if (x < 0) x = max;
            		if (y < 0) y = max;

            		if (sticky) {
						set(x,y, get(x,y) + offset)
						if (get(x,y) + offset > maxValue) maxValue = get(x,y) + offset;
						if (get(x,y) + offset < minValue) minValue = get(x,y) + offset;
					}
					else {
						var current = get(x, y);
						var lowerPoints = new Array();
						// check neighbours
						if (get(x + 1, y) < current) {
							lowerPoints.push({X:x + 1,Y:y});
						}
						if (get(x - 1, y) < current) {
							lowerPoints.push({X:x - 1,Y:y});
						}
						if (get(x, y + 1) < current) {
							lowerPoints.push({X:x,Y:y + 1});
						}
						if (get(x, y - 1) < current) {
							lowerPoints.push({X:x,Y:y - 1});
						}

						// Move to one of the lower neighbours
						if (lowerPoints.length > 0) {
							var index = Math.floor(Math.random() * lowerPoints.length);
							set(lowerPoints[index].X, lowerPoints[index].Y, current + offset);
							if (current + offset > maxValue) maxValue = current + offset;
							if (current + offset < minValue) minValue = current + offset;
						}
						else {
							set(x,y, current + offset);
							if (current + offset > maxValue) maxValue = current + offset;
							if (current + offset < minValue) minValue = current + offset;
						}
					}

					direction = Math.floor(Math.random() * 4);
					switch(direction) {
    					case 0:
        					x++;
        					break;
    					case 1:
	        				x--;
    	    				break;
        				case 2:
        					y++;
        					break;	
	        			case 3:
        					y--;
        					break;
    					default:
        					break;
					}
				}
			}

			for (var k = 0; k < size * size; k++) {
				map[k] = (map[k]-minValue)/(maxValue-minValue);
			}

			return map;
		}
	}
};