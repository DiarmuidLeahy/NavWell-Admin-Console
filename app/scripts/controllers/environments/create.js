'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:CreateenvironmentCtrl
 * @description
 * # CreateenvironmentCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('CreateenvironmentCtrl', function ($scope, $location, $routeParams, graphicsService, environmentsService) {

  	$scope.steps_config = {
  		current_step: -1, 
  		steps_done: [false, false, false, false, false],
      // selected_type: 'None',
  		selected_size: 'None',
  		selected_shape: 'None',
  		cue_size: 'M',
  		cue_type: 'L',
      cue_colour: 'yellow',
  		intensity: 50,
      name_error: false,
      save_error: false
  	};

    $scope.arena_config = graphicsService.getArenaConfig();

    $scope.isActive = false;

    // $scope.toggleActive = function() {
    //   $scope.isActive = !$scope.isActive;
    // };

  	$scope.showStep = function(step){

      
      if (step == 0 || $scope.steps_config.steps_done[step-1]) {
        $scope.steps_config.current_step = step;

        if (step == 2){
          $scope.arena_config.input = 'place-platform';
        }
        else if (step == 3){
          $scope.arena_config.input = 'add-cue';
        }
        else if(step == 4){
          $scope.arena_config.input = 'configure-cue';
        }
        else {
          $scope.arena_config.input = 'none';
        }

      }

  	};

  	$scope.selectSize = function(size) {
  		$scope.steps_config.selected_size = size;
  		$scope.steps_config.current_step = 2;
  		$scope.steps_config.steps_done[1] = true;
      $scope.arena_config.input = 'place-platform';
  	}

  	$scope.placePlatformDone = function(){
  		$scope.steps_config.current_step = 3;
  		$scope.steps_config.steps_done[2] = true;
      $scope.arena_config.input = 'add-cue';
  	}

  	$scope.saveEnvironment = function() {
      $scope.steps_config.name_error = false;
      $scope.steps_config.save_error = false;
      if(!$scope.name || $scope.name.trim() === ''){
        $scope.steps_config.name_error = true;
      }
      else {
          $scope.arena_config['size'] = $scope.steps_config.selected_size;
          $scope.arena_config['name'] = $scope.name;
          environmentsService.saveEnvironment($scope.arena_config).then(function(){
             $location.path('/environments');
            }, 
            function(pError){
              console.log(pError);
              $scope.steps_config.save_error = true;
            });
      }
  	}

  	$scope.selectShape = function(shape) {
  		$scope.steps_config.selected_shape = shape;
      $scope.arena_config.arena_type = shape;
      $scope.arena_config.platform = false;
      $scope.arena_config.cues = [];
      $scope.steps_config.steps_done[2] = false;
      $scope.steps_config.steps_done[3] = false;

      //TODO: Change color of octagon on click
      // if(shape ==='octagon') {
      //   //rethink
      //   console.info("------------octagon chosen!------------");
      // }
      console.log("current step = "+$scope.steps_config.current_step+
                  "\nselected type = "+$scope.steps_config.selected_type+
                  "\nshape - "+$scope.steps_config.selected_shape); 
  	}

  	$scope.selectShapeDone = function() {
  		if ($scope.steps_config.selected_shape != 'None'){
           $scope.steps_config.current_step =  1;
           $scope.steps_config.steps_done[0] = true;
  		}
  	}
    /*Derri start*/
    $scope.setCueColour = function(colour){
      $scope.steps_config.cue_colour = colour;
    }
    /*Derri End*/

  	$scope.setCueSize = function(size){
  		$scope.steps_config.cue_size = size;
  	}

  	$scope.setCueType = function(type) {
  		$scope.steps_config.cue_type = type;
  	}

  	$scope.adjustIntensity = function(op){
  		if (op == -1 && $scope.steps_config.intensity > 0){
  			$scope.steps_config.intensity = $scope.steps_config.intensity - 5;
  		}
  		else if (op == 1 && $scope.steps_config.intensity < 100){
  			$scope.steps_config.intensity = $scope.steps_config.intensity + 5;
  		}
  	}

    $scope.addCuesDone = function() {
        $scope.arena_config.err_click_border = false;
        $scope.steps_config.current_step = 4;
        $scope.steps_config.steps_done[3] = true;
        $scope.arena_config.input = 'none';
    }

    $scope.viewCue = function(index){
      $scope.arena_config.highlight_cue = index;
      console.log($scope.arena_config.highlight_cue);
    }

    $scope.removeCue = function(index){
      $scope.arena_config.highlight_cue = -1;
      $scope.arena_config.cues.splice(index, 1);
    }

    $scope.placePlatformCallback = function(point){
        $scope.arena_config.platform = point;
        $scope.$apply();
    }

    $scope.addCueCallback = function(borderPoint){    //Extensive changes here (Derri)
      var new_cue = graphicsService.getCue(borderPoint, $scope.steps_config.cue_size, $scope.steps_config.cue_type, $scope.steps_config.cue_colour, $scope.steps_config.intensity);
      if ($scope.steps_config.cue_type === 'L'){
        new_cue['intensity'] = $scope.steps_config.intensity;
      }
      $scope.arena_config.cues.push(new_cue);
      $scope.$apply();
      console.info($scope.arena_config.cues);
    }

    //Checks if an environment is being cloned.
    function checkClone() {
      if ($routeParams.c){
        $scope.name = $routeParams.n + " - CLONE";

        //Select Size
        $scope.showStep(0);
        $scope.selectShape($routeParams.at);
        $scope.selectShapeDone();
        $scope.selectSize($routeParams.s);
        $scope.arena_config.platform = eval($routeParams.p);
        $scope.placePlatformDone();
        $scope.arena_config.cues = eval($routeParams.cl);
      }
    }

    checkClone();

     // $scope.name = 'Environment Neue';
     // $scope.showStep(0);
     // $scope.selectShape('circle');
     // $scope.selectShapeDone();
     // $scope.selectSize('S');
     // $scope.placePlatformCallback([-0.31333333333333335, 0.2866666666666667]);
     // $scope.placePlatformDone();
     // $scope.arena_config.cues = [{"point":[-0.8190221332722455,-0.48135511341439],"size":"M","type":"L","intensity":50},{"point":[0.6103096403503016,0.5916266921763127],"size":"L","type":"C"}];
     // $scope.addCuesDone();

     // function makeSelected() {
     //    console.log("!");
     //    $(this).css({"background-color": "yellow", "font-size": "200%"});
     // }

  });
