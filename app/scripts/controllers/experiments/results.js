'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:ExperimentresultsCtrl
 * @description
 * # ExperimentresultsCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('ExperimentresultsCtrl', function ($scope, $routeParams, experimentsService, Restangular) {

      $scope.download_base = window.NavWell.Config.API;
      console.log('window.NavWell.Config.API', window.NavWell.Config.API);

  		experimentsService.getExperiment($routeParams.id).then(function(exp){
  			$scope.name = exp.name;
        $scope.exp_id = $routeParams.id;
  			$scope.results = Restangular.stripRestangular(exp.results);
  			console.log($scope.results);

  		}, function(error){
  			console.log('error', error);
  		});

  		$scope.compare = [];
  		$scope.selectedTrial = -1;

  		$scope.getTotalGoals = function(trials){
  			var res = 0;
  			for (var i = trials.length - 1; i >= 0; i--) {
  				res+= trials[i].goal_found ? 1 : 0;
  			}
  			return res;
  		}

  		$scope.selectRow = function(index){
  			$scope.selectedTrial = $scope.selectedTrial != index ? index : -1;
  		}

  		$scope.compareResult = function(index){
  			$scope.compare.push($scope.results[index]);
  		};

  		$scope.remove = function(index){
  			$scope.compare.splice(index, 1);
  		}
  });
