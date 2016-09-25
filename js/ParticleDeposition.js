var ParticleDeposition = function () {

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


    // Checking particles neighbours for stability
    // Returns X, Y
    function stabilityCheck(x, y) {
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
			return lowerPoints[index];
		}
		else {
			return {X:x, Y:y};
		}
    }

	return {

		GetHeightMap: function ( worldSize, sticky, particleMultiplier, numberOfDrops, smoothness)  {

			// Initialise the heightmap
			size = worldSize;
            max = size - 1;
            map = new Float32Array(size * size);
            for (var j = 0; j < size * size; j++) {
				map[j] = 0;
			}

			// Calculate the number of particles
            var numberOfParticles = Math.random() * particleMultiplier;
            // Initial direction to move dropper
            var direction = 1;

            // Loop through the droppers
            for (var m = 0; m < numberOfDrops; m++) {

            	var x = Math.floor(Math.random() * max);
            	var y = Math.floor(Math.random() * max);

            	// Drop particles
            	for (var i = 0; i < numberOfParticles; i ++) {

            		// If x, y goes off one edge come back on the other
            		if (x > max) x = 0;
            		if (y > max) y = 0;
            		if (x < 0) x = max;
            		if (y < 0) y = max;

            		// Particles don't roll down hills so place at x, y
            		if (sticky) {
						set(x,y, get(x,y) + offset)
						if (get(x,y) + offset > maxValue) maxValue = get(x,y) + offset;
						if (get(x,y) + offset < minValue) minValue = get(x,y) + offset;
					}
					// Particles do roll
					else {
						// Check for stability of particle
						var coordinates = stabilityCheck(x, y);
						for (var j = 0; j < smoothness; j++) {
							if (coordinates.X != x && coordinates.Y != y) {
								x = coordinates.X;
								y = coordinates.Y;
							}
							else {
								break;
							}
							coordinates = stabilityCheck(x, y);
						}

						// Place particle
						var current = get(coordinates.X, coordinates.Y);
						set(coordinates.X, coordinates.Y, current + offset);
						if (current + offset > maxValue) maxValue = current + offset;
						if (current + offset < minValue) minValue = current + offset;						
					}

					// Pick a new direction and move the dropper in that direction
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

			// Convert between 0 & 1
			for (var k = 0; k < size * size; k++) {
				map[k] = (map[k]-minValue)/(maxValue-minValue);
			}

			return map;
		}
	}
};