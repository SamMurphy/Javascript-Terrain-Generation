var DiamondSquare = function () {

    var size = 255;
    var max = size - 1;
    var map = new Float32Array(size * size);
    var roughness = 10;

    function set (x, y, val) {
        map[x + size * y] = val;
    }

    function get (x, y) {
        if (x < 0 || x > max || y < 0 || y > max) return -1;
        return map[x + size * y];
    }

    function divide(p_size) {
        var x, y, half = p_size / 2;
        var scale = roughness * p_size;
        if (half < 1) return;

        for (y = half; y < max; y += p_size) {
            for (x = half; x < max; x += p_size) {
                square(x, y, half, Math.random() * scale * 2 - scale);
            }
        }
        for (y = 0; y <= max; y += half) {
            for (x = (y + half) % p_size; x <= max; x += p_size) {
                diamond(x, y, half, Math.random() * scale * 2 - scale);
            }
        }
        divide(p_size / 2);
    }

    function average(values) {
        var valid = values.filter(function (val) {
            return val !== -1;
        });
        var total = valid.reduce(function (sum, val) {
            return sum + val;
        }, 0);
        return total / valid.length;
    }

    function square(x, y, size, offset) {
        var ave = average([
            get(x - size, y - size), // upper left
            get(x + size, y - size), // upper right
            get(x + size, y + size), // lower right
            get(x - size, y + size) // lower left
        ]);
        set(x, y, ave + offset);
    }

    function diamond(x, y, size, offset) {
        var ave = average([
            get(x, y - size), // top
            get(x + size, y), // right
            get(x, y + size), // bottom
            get(x - size, y) // left
        ]);
        set(x, y, ave + offset);
    }

    return {

        GetHeightMap: function ( worldSize, p_roughness )  {

            roughness = p_roughness;

            size = worldSize;
            max = size - 1;
            map = new Float32Array(size * size);

            set(0, 0, max);
            set(max, 0, max / 2);
            set(max, max, 0);
            set(0, max, max / 2); 

            divide(max);

            return map;
        }
    }
};