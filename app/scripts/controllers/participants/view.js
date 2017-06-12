'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:ParticipantdetailsCtrl
 * @description
 * # ParticipantdetailsCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('ParticipantdetailsCtrl', function ($scope, $routeParams, participantsService, graphicsService, experimentsService, Restangular) {

  	//Display Configuration
  	$scope.display = {
  		see_more : true,
  		add_experiment: false, 
  		experiment_summary: false,
  		selected_experiment: -1,
  		error_add_exp: false
  	};
    
	participantsService.getParticipant($routeParams.id).then(function(participant){
		$scope.participant = participant;
		console.log('participant', $scope.participant);
		if ($scope.participant.notes == '')
			$scope.participant.notes = "-";
		}, 

		function(pError){
			console.log(pError);
	});

	experimentsService.getExperimentsPromise().then(function(experiments){
		$scope.experiments = Restangular.stripRestangular(experiments);
		console.log('$scope.experiments', $scope.experiments);
	}, function(pError){	
		console.log(pError);
	});



	$scope.seeMoreNotes = function(){
		$scope.display.see_more = false;
	};

	$scope.showAddExperiment = function(){
		$scope.display.experiment_summary = false;
		$scope.display.selected_experiment = -1;
		$scope.display.add_experiment = true;
	};

	$scope.addExperiment = function(index){
		$scope.display.error_add_exp = false;
		var exp = $scope.experiments[index];
		exp.total_trials = exp.trials.length;
		exp.goal_found = 0;
		//exp.results.third_dimesion=true //kcor - experiment hasn't been run so no dimension has been explicitily chosen
		exp.date_taken = null;
		exp.attempted = false;
		$scope.participant.experiments.push(exp);
		$scope.participant.save().then(function(){
			console.log('OK');
		}, function(){
			console.log('error');
			$scope.participant.experiments.splice($scope.participant.experiments.length -1, 1);
			$scope.display.error_add_exp = true;
		});
	}

	$scope.showExperimentSummary = function(index){
		$scope.display.add_experiment = false; 
		if (index == $scope.display.selected_experiment){
			//Hide the summary
			$scope.display.experiment_summary = false;
		}
		else {
			console.log('EXPERIMENT', $scope.participant.experiments[index]);
			var exp = $scope.participant.experiments[index];
			if (exp.attempted){
				//Not attempted yet
				//show a new one
				var res = exp.results[0];
				console.log('RES', res);


				$scope.display.selected_experiment = index;
				$scope.display.experiment_summary = true;
				$scope.arena_config.display_mode = 'results-hm';
				$scope.arena_config.arena_type = exp.environment.arena_type;
				$scope.arena_config.goal = null; // No starting position since we are not seeing an specific trial. 
				$scope.arena_config.platform = exp.environment.platform;

				$scope.arena_config.paths = [];
				for (var i = exp.trials.length - 1; i >= 0; i--) {
					$scope.arena_config.paths.push(exp.trials[i].path);
				}

				//Set up quadrants views. 
				$scope.arena_config.quadrants = res.quadrants;


				//Heatmap

			}
		}

		$scope.display.selected_experiment = index;
	};

	$scope.setArenaDisplayMode = function(mode){
		$scope.arena_config.display_mode = mode;
	}


	
	$scope.arena_config = graphicsService.getArenaConfig();	

  });
