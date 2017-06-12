'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:ViewexperimentCtrl
 * @description
 * # ViewexperimentCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('ViewexperimentCtrl', function ($scope, $location, $routeParams, graphicsService, experimentsService) {

  	$scope.arena_config = graphicsService.getArenaConfig();

    $scope.show_delete = false;
    $scope.clone_url = '#/experiments/create?c=1'

    experimentsService.getExperiment($routeParams.id).then(function(exp){
        $scope.exp = exp;
        $scope.arena_config.arena_type = exp.environment.arena_type;
        $scope.arena_config.platform = exp.environment.platform;
        $scope.arena_config.cues = exp.environment.cues;
        $scope.env_loaded = true;
        //$scope.arena_config.goal = exp.start_position;

        $scope.retention_trials_count = 0;
        $scope.visible_trials_count = 0;
        for (var i = exp.trials.length - 1; i >= 0; i--) {
            $scope.retention_trials_count+= exp.trials[i].retention ? 1 : 0;
            $scope.visible_trials_count+= exp.trials[i].visible ? 1 : 0;
        }

        //Generate the clone url
        $scope.clone_url += '&n=' + encodeURIComponent(exp.name);
        $scope.clone_url += '&e=' + encodeURIComponent(exp.environment._id);
        $scope.clone_url += '&sp=' + encodeURIComponent(JSON.stringify(exp.start_position));
        $scope.clone_url += '&t=' + encodeURIComponent(JSON.stringify(exp.trials));
    }, 
    function(pError){
        console.log(pError);
    });

    $scope.hideDelete = function(){
      $scope.show_delete = false;
    };

    $scope.deleteExperiment = function(){
       $scope.exp.customDELETE($scope.exp._id).then(function(){
            $location.path('/experiments');
        });
    };

    $scope.showTrial = function(index){
        $scope.selected_trial = index;
        $scope.arena_config.goal = $scope.exp.trials[index].start_position;
    }

  });
