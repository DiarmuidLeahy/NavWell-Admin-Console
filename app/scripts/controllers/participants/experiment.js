'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:ParticipantexperimentCtrl
 * @description
 * # ParticipantexperimentCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('ParticipantexperimentCtrl', function ($scope, $routeParams, participantsService, graphicsService) {
    $scope.setArenaDisplayMode = function(mode){
		$scope.arena_config.display_mode = mode;
	}
	
	$scope.display = {
		selected_trial: 0
	}

	$scope.td =  true ? true : false;//initial value -kcor, might be useful to pass in a variable from previous page to decide which results to load up

	$scope.total_time = 0;
	$scope.goal_found = 0;
	$scope.avg_time = 0;
	$scope.avg_path = 0;
	$scope.avg_q1 = 0;
	$scope.avg_q2 = 0;
	$scope.avg_q3 = 0;
	$scope.avg_q4 = 0;


	participantsService.getParticipant($routeParams.id).then(function(participant){
		
		$scope.participant = participant;
		console.log($scope.participant);
	
			for (var i = $scope.participant.experiments.length - 1; i >= 0; i--) {//cycles through all experiments assigned the the participant
				
				/*kcor - added an && second condition here to ensure the correct experiment is selected, because third_dimension is true by default i added a third condition confirming the experiment was attempted*/
				if($scope.participant.experiments[i]._id == $routeParams.exp && $scope.participant.experiments[i].third_dimension == $scope.td && $scope.participant.experiments[i].attempted){
					$scope.exp = $scope.participant.experiments[i];
					break;
				}
				if(i==0 && $scope.td==true)//kcor - if we have just checked the last experiment for the one we are looking for and we still have not found it, restart the search looking for the opposite dimension this way we can supply some results(notified of 2d and 3d), it may be easier to just call my change dimension method with a false parameter but this is more intuitive
				{//kcor - basically if 3d/2d has not yet bee attempted return the 2d/3d which has
					i=$scope.participant.experiments.length;//kcor -the for loop will minus one immediately after this if statement runs
					$scope.td=false;//kcor - changing the searched dimension
				}//kcor
			}
		
			$scope.notes=$scope.exp.results.notes;//kcor
			//Calculate overall variables
			var total_results = $scope.exp.results[0].trials.length;
			var total_path = 0, q1 = 0, q2 = 0, q3 = 0, q4 = 0;
			for (var i = total_results - 1; i >= 0; i--) {			/*****************REVISIT THIS: DERRI**********************/
				var trial = $scope.exp.results[0].trials[i];
				$scope.total_time += trial.duration;
				total_path += trial.path_length;
				q1 += trial.q1;
				q2 += trial.q2;
				q3 += trial.q3;
				q4 += trial.q4;
			}

			$scope.avg_time = $scope.total_time / total_results;
			$scope.avg_path = total_path / total_results;
			$scope.avg_q1 = q1 / total_results;
			$scope.avg_q2 = q2 / total_results;
			$scope.avg_q3 = q3 / total_results;
			$scope.avg_q4 = q4 / total_results;
			$scope.arena_config.display_mode = 'results-hm';
			$scope.showTrial(0);

			console.log('exp', $scope.exp);

			}, 
			function(pError){
				console.log(pError);
		});
		$scope.toNew = function()
		{
			changeDimension(false);
		}

		$scope.changeDimension = function(tru_fal){//kcor - called when we want to see alternative dimension results
			$scope.td=tru_fal;
			//reset variables
			$scope.total_time = 0;
			$scope.goal_found = 0;
			$scope.avg_time = 0;
			$scope.avg_path = 0;
			$scope.avg_q1 = 0;
			$scope.avg_q2 = 0;
			$scope.avg_q3 = 0;
			$scope.avg_q4 = 0;
			//update the participants experiment we are viewing
			for (var i = $scope.participant.experiments.length - 1; i >= 0; i--) {
				/*kcor - */
				if($scope.participant.experiments[i]._id == $routeParams.exp && $scope.participant.experiments[i].third_dimension == $scope.td && $scope.participant.experiments[i].attempted){//kcor - similar code to before just with a different dimension
					$scope.exp = $scope.participant.experiments[i];
					break;
				}
			}
			

			//Calculate overall variables
			var total_results = $scope.exp.results[0].trials.length;
			var total_path = 0, q1 = 0, q2 = 0, q3 = 0, q4 = 0;
			for (var i = total_results - 1; i >= 0; i--) {
				var trial = $scope.exp.results[0].trials[i];
				$scope.total_time += trial.duration;
				total_path += trial.path_length;
				q1 += trial.q1;
				q2 += trial.q2;
				q3 += trial.q3;
				q4 += trial.q4;
			}

			$scope.avg_time = $scope.total_time / total_results;
			$scope.avg_path = total_path / total_results;
			$scope.avg_q1 = q1 / total_results;
			$scope.avg_q2 = q2 / total_results;
			$scope.avg_q3 = q3 / total_results;
			$scope.avg_q4 = q4 / total_results;
			$scope.arena_config.display_mode = 'results-hm';
			$scope.showTrial(0);
			//$scope.third_dimension = true;//kcor - no need as it is contained within $scope.td

			console.log('exp', $scope.exp);

			}, 
			function(pError){
				console.log(pError);

		}//end kcor 

		/*$scope.saveNotes = function(){//kcor
			
			notes: $scope.notes || ''
			experimentsService.saveNotes(notes).then(function(){
		     	$location.path('/experiments');//unsureof
		},*/

		$scope.selectTrial = function(index){
			$scope.display.selected_trial = index;
			$scope.showTrial(index);
		}

		$scope.showTrial = function(index){
			$scope.arena_config.arena_type = $scope.exp.environment.arena_type;
			
			$scope.arena_config.platform = $scope.exp.environment.platform;
			$scope.arena_config.goal = $scope.exp.trials[index].start_position;
			$scope.arena_config.paths = [];
			$scope.arena_config.paths.push($scope.exp.trials[index].path);

			//Set up quadrants views. 
			$scope.arena_config.quadrants = [
				$scope.exp.results[0].trials[index].q1,
				$scope.exp.results[0].trials[index].q2,
				$scope.exp.results[0].trials[index].q3,
				$scope.exp.results[0].trials[index].q4,
			];
		}

		// Mock arena data.
		$scope.arena_config = graphicsService.getArenaConfig();
		$scope.arena_config.arena_type = 'circle';
		$scope.arena_config.platform = [0.5, 0.5];
		$scope.arena_config.goal = [-0.5, -0.5];
		$scope.arena_config.display_mode = 'results-hm';
		$scope.arena_config.quadrants = [10, 20, 30, 60];

		  });
