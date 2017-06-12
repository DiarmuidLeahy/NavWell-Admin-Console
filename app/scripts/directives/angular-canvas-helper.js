'use strict';

/**
 * @ngdoc directive
 * @name navwellAdminApp.directive:angularCanvasHelper
 * @description
 * # angularCanvasHelper
 */
angular.module('navwellAdminApp')
  .directive('angularCanvasHelper', function ($timeout, graphicsService) {

  	var size;
  	var platformSize = 0.075;
  	var context;
    var pathColors = ['red', 'blue', 'green', 'purple', 'yellow'];
    var map;
  	//TODO: Make the size configurable with the scope or an attribute.

  	//The environment, the cues and all of that are going to be described in a coordiante system from [-1 to 1] in x and y. 
  	//Being 0, 0 the origin
  	var getCanvasY = function(coordinate){
  		return (1 - (1 + coordinate) / 2) * size;
  	};

  	var getCanvasX = function(coordinate){
  		return (1 - (1 + -1*coordinate) / 2) * size;
  	};

  	var getX = function(canvasCoord) {
  		return -1 + 2 * (canvasCoord / size);
  	};

  	var getY = function(canvasCoord) {
  		return 1 - 2 * (canvasCoord / size);
  	};

  	var getCanvasSize = function(percentage){
  		return (size/2) * percentage;
  	};

  	var getFont = function() {
	    var ratio = 20 / size; // = 20 / 400;   // calc ratio 
	    var fontSize = size * ratio;   // get font size based on current width
	    return (fontSize|0) + 'px sans-serif'; // set font
	}

  	var drawAxis = function(arena){
  		//Draw the X axis
      if(arena == 'triangle') {   //Derri. This is to account for the skewed results for quadrant percentages
      	context.beginPath();
      	context.moveTo(getCanvasX(-1), getCanvasY(1 - Math.sqrt(1.62)));
      	context.lineTo(getCanvasX(1), getCanvasY(1 - Math.sqrt(1.62)));
      	context.stroke();
      } else {
        context.beginPath();
        context.moveTo(getCanvasX(-1), getCanvasY(0));
        context.lineTo(getCanvasX(1), getCanvasY(0));
        context.stroke();
      }

      	// //Draw the Y axis
      	context.beginPath();
      	context.moveTo(getCanvasX(0), getCanvasY(1));
      	context.lineTo(getCanvasX(0), getCanvasY(-1));
      	context.stroke();
  	};

  	//Draws a polygon in the canvas, given the array of points
  	var drawPolygon = function(polygon, fill) {
  		if (polygon && polygon.length > 2){
  			//Start path
  			context.beginPath();

  			//Move to the first point
  			context.moveTo(getCanvasX(polygon[0][0]), getCanvasY(polygon[0][1]));
  			for(var i = 1; i < polygon.length; i++){
  				context.lineTo(getCanvasX(polygon[i][0]), getCanvasY(polygon[i][1]));
  			}

        //Close the polygon
        context.lineTo(getCanvasX(polygon[0][0]), getCanvasY(polygon[0][1]));

        context.stroke();

  			if (fill){
  				context.fillStyle = fill;
      			context.fill();
  			}
  		}
  	};

    var drawPath = function(points, color){
        //Start path
        context.save();
        context.beginPath();

        //Move to the first point
        context.moveTo(getCanvasX(points[0][0]), getCanvasY(points[0][1]));
        for(var i = 1; i < points.length; i++){
          context.lineTo(getCanvasX(points[i][0]), getCanvasY(points[i][1]));
        }

        context.strokeStyle = color || 'red';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.stroke();
        context.restore();
    }

  	var drawCircle = function(center, size){
  		//Draw Circle
      context.beginPath();
	    context.arc(getCanvasX(center[0]), getCanvasY(center[1]), getCanvasSize(size), 0, 2 * Math.PI, false);
	    context.stroke();
  	};

  	var drawArena = function(type) {
  		if (type === 'circle'){
  			var circle = graphicsService.getArenaCircle();
  			drawCircle(circle.center, circle.radius);
  		}
  		else {
  			drawPolygon(graphicsService.getPolygon(type));
  		}
  	};

  	var drawCues = function(cues, highlighted){
      context.font = getFont();
  		for (var i = cues.length - 1; i >= 0; i--) {
        if (highlighted == i){
          context.fillStyle = 'green';
        }
        else {
          context.fillStyle = '#000000';
        }
  			context.fillText('X', getCanvasX(cues[i].point[0]), getCanvasY(cues[i].point[1]));
  		}
  	};

    var drawGoal = function(point) {
      if (point){
        var x = getCanvasX(point[0]),
            y = getCanvasY(point[1]),
            r = getCanvasSize(platformSize);
        context.save();
        context.fillStyle = "red";
        context.beginPath();
        context.translate(x, y);
        context.moveTo(0,0-r);
        for (var i = 0; i < 5; i++)
        {
          context.rotate(Math.PI / 5);
          context.lineTo(0, 0 - (r*0.5));
          context.rotate(Math.PI / 5);
          context.lineTo(0, 0 - r);
        }
        context.fill();
        context.restore();
      }
    };

    var drawPaths = function(paths){
      for (var i = paths.length - 1; i >= 0; i--) {
        var path = paths[i];
        var color = pathColors[i % pathColors.length];
        drawPath(paths[i].points, color);
        // for (var j =  0; j < path.points.length; j++) {
        //   var point = path.points[j];
        // }
      }
    }

  	//Function to redraw the arena
  	var draw = function(config){

      var mode = config.display_mode || 'environment';
  		context.clearRect(0, 0, size, size);
  		drawAxis(config.arena_type);
  		drawArena(config.arena_type);
      if (mode === 'environment'){
        drawCues(config.cues, config.highlight_cue);
      }

  		if (config.platform){
      		drawPolygon(graphicsService.getRectangle(config.platform, platformSize), '#888');

          
  		}

      if (config.goal){
          drawGoal(config.goal);
      }

      if (mode == 'results-path'){
        drawPaths(config.paths);
      }

      // now generate some random data for the heatmap
      if (map){
        var points = [];

        //console.log("-----------------------------");
        //console.log(config.paths);

        var max = 1;

        for (var i = config.paths.length - 1; i >= 0; i--) {
          var path_points = config.paths[i].points;
          for (var j = path_points.length - 1; j >= 0; j--) {

            var val = path_points[j].length > 2 ? path_points[j][2] : 1;
            var point = {
              x: Math.round( getCanvasX(path_points[j][0])),
              y: Math.round( getCanvasY(path_points[j][1])),
              value: val
            };
            max = Math.max(max, val);
            points.push(point);
          }
        }
        
        // heatmap data format
        var data = { 
          max: max, 
          data: points 
        };
        map.setData(data);
      }
  	};

    return {
      templateUrl: 'views/directives/angular-canvas-helper.html',
      replace: true,
      restrict: 'E',
      link: function postLink(scope, element, attr) {

        size = attr['canvasSize'];
        //console.log("canvas size = "+size);   //derri
        scope.canvas_size = size;

      	//var size = 400;
      	var platformSize = 0.075;

      	var canvas = element.find('canvas');
      	//canvas.css('background', '#777777');

    	  canvas[0].addEventListener('click', function(event) {
        //console.info(event);
    		//Get the location of the click
        //console.log("event.offsetX = "+event.offsetX);    //Derri bug fix
        //console.log("event.offsetY = "+event.offsetY);
        //var x = getX(event.layerX), //old way
        //    y = getY(event.layerY);
		    var x = getX(event.offsetX),  //new way
		        y = getY(event.offsetY);

            //var x = 0,y=0;

		    if (scope.arena_config.input === 'place-platform'){
		   	 	//Verify it is inside the environment
		   	 	var isInside = graphicsService.checkInside(scope.arena_config.arena_type, x, y);
          console.log(isInside);
		   	 	if (isInside){
		   	 		//Set the platform
		   	 		scope.arena_config.platform = [x - platformSize / 2, y + platformSize / 2];
		   	 		draw(scope.arena_config);
            if (scope.placePlatformCallback){
              scope.placePlatformCallback(scope.arena_config.platform);
            }
		   	 	}
		    }
        else if (scope.arena_config.input === 'place-goal'){
          //Verify it is inside the environment
          var isInside = graphicsService.checkInside(scope.arena_config.arena_type, x, y);
          if (isInside){
            //Set the platform
            scope.arena_config.goal = [x - platformSize / 2, y + platformSize / 2];
            draw(scope.arena_config);
            if (scope.placeGoalCallback){
              scope.placeGoalCallback(scope.arena_config.goal);
            }
          }
        }
        else if (scope.arena_config.input === 'add-cue'){
          scope.arena_config.err_click_border = false;
          //Verify it is inside the environment
          var borderPoint = graphicsService.checkBorderPoint(scope.arena_config.arena_type, x, y);
          if (borderPoint){
            if (scope.addCueCallback){
              scope.addCueCallback(borderPoint);
            }
            else {
                scope.arena_config.cues.push({
                  point: borderPoint,
                });
                draw(scope.arena_config);
            }
          }
          else {
            scope.arena_config.err_click_border = true;
          }
          scope.$apply();
        }
	    });

      	//Get the context of the item
      	context = canvas[0].getContext('2d');

      	draw(scope.arena_config);

      	//Watch for changes in the arena config to redraw
      	scope.$watch('arena_config', function(newConfig) {
      		draw(scope.arena_config);
      	}, true);

        //Heatmap

        scope.heatMapStyle = {
            "height": scope.canvas_size+ "px",
            "width": scope.canvas_size+ "px"
        };

        
        function initMap() {
          /*Derri start*/
          var config = {

           container: element.find('#heatmap')[0],
           radius: 15,
           minOpacity: .1,
           maxOpacity: .60
          }

          scope.heatmapInstance = h337.create(config);
          map = scope.heatmapInstance;
          draw(scope.arena_config);
        }
        /*Derri end */
        // function initMap() {
        //   scope.heatmapInstance = h337.create({
        //    container: element.find('#heatmap')[0]
        //   });
        //   map = scope.heatmapInstance;
        //   draw(scope.arena_config);
        // }

        $timeout(initMap,0);

      }
    };
  });
