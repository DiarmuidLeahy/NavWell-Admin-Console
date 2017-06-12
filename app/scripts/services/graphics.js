'use strict';

/**
 * @ngdoc service
 * @name navwellAdminApp.graphics
 * @description
 * # graphics
 * Service in the navwellAdminApp.
 */
angular.module('navwellAdminApp')
  .service('graphicsService', function () {
    // Service to handle graphics operations and helper functions

    //Derri start
    function getPolygonPoints(sides) {

        var theta = Math.PI/(sides/2);  //Angle of rotation in radians

        switch(sides) {

            case 4:
                var startx = -0.9;
                var starty = -0.9;
                break;

            case 8:
                var startx = Math.cos(Math.PI/8);
                var starty = Math.sin(Math.PI/8);
                break;

            default:
                var startx = 0;
                var starty = 0.9;
                break;
        }
        var x = startx;
        var y = starty;
        var coors = []; //array to store x,y coordinates of points
        var count = 1;
        do {
            coors.push([x,y]);
            var x_temp = x;
            var y_temp = y;
            x = (x_temp * Math.cos(theta)) + (y * Math.sin(theta));
            y = -(x_temp * Math.sin(theta)) + (y * Math.cos(theta));
            
            count++;
        } while (count <= sides);

        return coors;
    }    //Derri end

    var polygons = {
        rectangle: [[-0.9, -0.5],       //Not a regular Polygon so points are explicitly listed
                    [-0.9, 0.5],
                    [0.9, 0.5],
                    [0.9, -0.5]],
        //triangle: getPolygonPoints(3),  //replaced the method below (Derri)
    	triangle: [ [-0.9, -0.9],
    				[0, 0.9],
    				[0.9, -0.9]],
    	square: getPolygonPoints(4),   //replaced the method below (Derri)
        // square: [[-0.9, -0.9],
        //          [-0.9, 0.9],
        //          [0.9, 0.9],
        //          [0.9, -0.9]],
        pentagon: getPolygonPoints(5),
        hexagon: getPolygonPoints(6),
        heptagon: getPolygonPoints(7),
        octagon: getPolygonPoints(8),     //Derri
        nonagon: getPolygonPoints(9),
        decagon: getPolygonPoints(10)

        };
    //console.log(polygons);

    var circle = {
		center: [0, 0], 
		radius: 0.9,
		radius_power_2: 0.81 // Precalculated for efficiency
	};

    var BORDER_ERR = 0.075;
    var BODER_ADJ = 0.05;

    var getRectangle = function(initial_point, width){
    	var points = [];
    	points.push(initial_point);
    	points.push([initial_point[0] + width, initial_point[1]]);
    	points.push([initial_point[0] + width, initial_point[1] - width]);
    	points.push([initial_point[0], initial_point[1] - width]);
    	return points;
    };

    var checkInside = function(arena_type, x, y) {           //MAJOR CHANGES MADE HERE (Derri)

    	if (arena_type === 'circle'){
    		//Need to check the radius of the circle vs the distance between 0, 0 and the point
    		//x^2 + y ^ 2 < radius ^ 2

    		return (x * x + y * y) < circle.radius_power_2;
    	} /* Derri start */
    	else {//if (arena_type === 'square' || arena_type === 'rectangle' || arena_type === 'octagon' || arena_type === 'triangle' || arena_type === 'hundred') {

            //Implementing the ray casting algorithm for determining if a point is within a given polygon.
            //The algorithm "draws" a horizontal line from the point across the positive x-axis.
            //If the line crosses the border of the polygon an odd number of times, the point is outside the polygon.
            function isInside(point, vs) {
                console.log(vs);
            
                var x = point[0], y = point[1];
            
                var inside = false;
                for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {

                    var xi = vs[i][0], yi = vs[i][1];
                    var xj = vs[j][0], yj = vs[j][1];
                    var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

                    if(intersect) {
                         inside = !inside;  //flip every time we cross the border of the polygon
                    }
                }
            
                return inside;  //If the border has been crossed an even number of times, this will return false
            };
            return isInside([x,y],polygons[arena_type]);
    	}
    	return false;
    };

    var checkBorderPoint = function(arena_type, x, y){

        if (arena_type === 'circle'){
            //1. Check the distance between 0,0 and the point
            var distance =  Math.abs((x * x + y * y) - circle.radius_power_2);
            //2. If it is not within the margin error, reject it
            if (distance > BORDER_ERR){
                return null;
            }
            //3. If it is, get the vector for the direction
            var divisor = Math.sqrt( x * x + y * y);
            var a_unit = x / divisor;
            var b_unit = y / divisor;
            var translated;
            //4. Adjust the point so that it is exactly on the border. (translate and move a little)
            //left-down quadrant adjustment
            if (a_unit < 0 && b_unit < 0){ 
                translated = [a_unit * (circle.radius + BODER_ADJ), b_unit * (circle.radius + BODER_ADJ)];
            }
            else if (a_unit > 0 && b_unit > 0){
                translated = [a_unit * (circle.radius - BODER_ADJ), b_unit * (circle.radius - BODER_ADJ)];
            }
            else {
                translated = [a_unit * circle.radius, b_unit * circle.radius];
            }
            return translated;

        } else {    //For any regular polygon...

            function isOnBorder(point, vs) {
                console.info(vs);

                var x_i = point[0], y_i = point[1];

                for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {

                    var x_a = vs[i][0], y_a = vs[i][1];
                    var x_b = vs[j][0], y_b = vs[j][1];
                    //Tells us if the three points are aligned
                    var crossProduct = (y_i - y_a) * (x_b - x_a) - (x_i - x_a) * (y_b - y_a);

                    if(Math.abs(crossProduct) < 0.025) { //Accounting for margin of error

                        var dotProduct = (x_i - x_a) * (x_b - x_a) + (y_i - y_a) * (y_b - y_a);
                        //This, combined with the length between a and b squared, tells us if the click is between a and b
                        if(dotProduct >= 0) {                       

                            var squareLength_ba = (x_b - x_a)*(x_b - x_a) + (y_b - y_a)*(y_b - y_a);

                            if(dotProduct <= squareLength_ba) {

                                return [x_i - BODER_ADJ, y_i - BODER_ADJ];
                            }
                        }
                    }
                }
                return null;
            }
            return isOnBorder([x,y],polygons[arena_type]);

        }
        return null;
    };

    var getArenaConfig = function(){
        return {
            arena_type: 'none',
            display_mode: 'environment',
            input: 'none', // 'none', 'place-platform', 'add-cue'
            platform: false,
            goal: false,
            cues: [],
            quadrants: [],
            paths: [{
                points: [[0.5, 0.5], [0.4, 0.4], [0.4,0.3], [0.3, 0.6], [0.2, 0.7]]
            }
            ],
            highlight_cue: -1,
            err_click_border: false
        };
    };

    var getCue = function(borderPoint, size, type, colour, intensity){  //Added a colour parameter
        var res = {
        point: borderPoint,
        size: size,
        type: type,
        colour: colour
      }
      if (intensity && intensity >= 0){
        res['intensity'] = intensity;
      }
      return res;
    };

    return {
    	getPolygon: function(polygon){
    		return polygons[polygon];
    	},

    	getArenaCircle: function(){
    		return circle;
    	},

    	getRectangle : getRectangle,
    	checkInside: checkInside,
        getArenaConfig: getArenaConfig,
        checkBorderPoint: checkBorderPoint,
        getCue: getCue

    };

  });
