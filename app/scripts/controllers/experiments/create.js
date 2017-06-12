'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:ExperimentcreateCtrl
 * @description
 * # ExperimentcreateCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('ExperimentcreateCtrl', function ($scope, $location, $timeout, $routeParams, graphicsService, environmentsService, experimentsService, Restangular) {

	$scope.steps_config = {	//Derri - Need to add extra step to allow for choice of cue colours
  		current_step: -1, 
  		steps_done: [false, false, false, false],
  		selected_env_name: '',
  		selected_env_index: -1,
  		selected_start: null,
  		error_rest: false,
  		error_duration: false,
  		error_trials_count: false,
  		name_error: false,
  		save_error: false,
  		selected_trial: -1
	};

	$scope.trials = [];

	$scope.new_trial = {
		duration: '',
		rest: '',
		retention: false,
		visible: false	//Derri
	};

	$scope.environmentsList = environmentsService.getEnvironments();

	$scope.showStep = function(step){
		if (step == 0 || $scope.steps_config.steps_done[step-1]) {
			$scope.steps_config.current_step = step;

			if (step == 1) {
				$scope.arena_config.input = 'place-goal';
			}
		}
	};

	$scope.selectEnvironment = function(index, name) {
		$scope.steps_config.current_step = 1;
		$scope.steps_config.steps_done[0] = true;
		$scope.steps_config.selected_env_name = name;
		$scope.steps_config.selected_env_index = index;
		$scope.steps_config.selected_start = null;

		//Simulate getting the arena from the service. 
		$scope.arena_config = graphicsService.getArenaConfig();

		$scope.env = $scope.environmentsList[index];

		$scope.arena_config.arena_type = $scope.env.arena_type;
        $scope.arena_config.platform = $scope.env.platform;
        $scope.arena_config.cues = $scope.env.cues;
    	$scope.arena_config.input = 'place-goal';
	};

	$scope.addTrial = function(){
		$scope.steps_config.selected_trial = -1;
		$scope.steps_config.error_rest = false;
		$scope.steps_config.error_duration = false;
		$scope.new_trial.retentionAndVisible = false;	//(Derri) - Don't allow retention and visible platform trial
		var duration = parseInt($scope.new_trial.duration);
		var rest = parseInt($scope.new_trial.rest);

		if (isNaN($scope.new_trial.duration) || $scope.new_trial.duration != duration || duration <= 0){
			$scope.steps_config.error_duration = true;
		}
		if (isNaN($scope.new_trial.rest) || $scope.new_trial.rest != rest || rest < 0){
			$scope.steps_config.error_rest = true;
		}
		if($scope.new_trial.retention && $scope.new_trial.visible) {	//(Derri) - Don't allow retention and visible platform trial
			$scope.new_trial.retentionAndVisible = true;
		}
		if (!($scope.steps_config.error_rest || $scope.steps_config.error_duration || $scope.new_trial.retentionAndVisible)){	//(Derri) - Don't allow retention and visible platform trial
			$scope.steps_config.error_trials_count = false;
			$scope.trials.push({
				rest: $scope.new_trial.rest,
				duration: $scope.new_trial.duration,
				retention: $scope.new_trial.retention,
				visible: $scope.new_trial.visible,
				start_position: $scope.steps_config.selected_start
			});
		} else {
			return false;
		}
	}

	$scope.removeTrial = function(index){
		$scope.steps_config.selected_trial = -1;
		if ($scope.steps_config.current_step == 2)
			$scope.trials.splice(index, 1);
	}

	$scope.setStartPositionDone = function(){
		$scope.steps_config.current_step = 2;
  		$scope.steps_config.steps_done[1] = true;
  		//$scope.arena_config.input = 'none';
  		$scope.steps_config.selected_trial = -1;
	};

	// $scope.checkOther = function(id) {				//(Derri) Attempting to ensure that both the retention and visible buttons are not clicked together
	// 	console.log(id);
	// 	// if(id ==='ret') {

	// 	// }
	// };

	$scope.addTrialsDone = function() {
		if ($scope.trials.length > 0){
			$scope.steps_config.current_step = 3;
        	$scope.steps_config.steps_done[2] = true;
        	$scope.arena_config.input = 'none';
        	$scope.arena_config.goal = null;
        	$scope.steps_config.selected_trial = -1;
		}
		else {
			$scope.steps_config.error_trials_count = true;
		}
        
    };

    $scope.saveExperiment = function() {
    	$scope.steps_config.name_error = false;
		$scope.steps_config.save_error = false;
		if(!$scope.name || $scope.name.trim() === ''){
			$scope.steps_config.name_error = true;
		}
		else {
			var experiment = {
				environment: Restangular.stripRestangular($scope.env),
				name: $scope.name,
				
				//kcor - third_dimension: true,//kcor - unnecessaary to initialize as the experiment schema has true as it as true by default
				
				trials: $scope.trials
			}
		  	experimentsService.saveExperiment(experiment).then(function(){
		     	$location.path('/experiments');
		    }, 
		    function(pError){
			      console.log(pError);
			      $scope.steps_config.save_error = true;
		    });
		}
    };

    $scope.showTrial = function(index){
    	console.log('show ', index);
    	$scope.arena_config.goal = $scope.trials[index].start_position;
    	$scope.steps_config.selected_trial = index;
    }

    $scope.placeGoalCallback = function(goal){
    	$scope.steps_config.selected_start = goal; 
    	$scope.steps_config.selected_trial = -1;
  		$scope.$apply();
    };

    $scope.getType = function(type){
  		return type.charAt(0).toUpperCase() + type.slice(1);
  	};

  	//Checks if an environment is being cloned.
    function checkClone() {
    	if (!$scope.environmentsList || $scope.environmentsList.length == 0){
    		$timeout(checkClone, 100);
    	}
    	else {
        	$scope.name = $routeParams.n + " - CLONE";
        	var env_index = -1, env_name = '';
        	//Find the environment index
        	for (var i = 0; i < $scope.environmentsList.length; i++) {
        		if ($scope.environmentsList[i]._id == $routeParams.e){
        			env_index = i;
        			env_name = $scope.environmentsList[i].name;
        			break;
        		}
        	}

        	//If the environment is still available, select it, if not, stop cloning
        	if (env_index != -1){
        		$scope.selectEnvironment(env_index, env_name);
        		$scope.arena_config.goal = eval($routeParams.sp);
        		$scope.steps_config.selected_start = $scope.arena_config.goal; 
        		$scope.setStartPositionDone();
        		$scope.trials = eval($routeParams.t);
        		$scope.addTrialsDone();
        	}

        	//$scope.selectEnvironment(index, name);
    	}
    }

    if ($routeParams.c){
    	$timeout(checkClone, 100);
    }


    ///////
    $scope.showStep(0);

  });
