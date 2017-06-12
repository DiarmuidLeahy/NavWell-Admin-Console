'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:ViewenvironmentCtrl
 * @description
 * # ViewenvironmentCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('ViewenvironmentCtrl', function ($scope, $location, $routeParams, graphicsService, environmentsService) {
    
    $scope.arena_config = graphicsService.getArenaConfig();
    $scope.env_loaded = false;
    $scope.show_delete = false;
    $scope.sizes = {
        S: 'Small',
        M: 'Medium',
        L: 'Large'
    }

    $scope.clone_url = '#/environments/create?c=1'

    environmentsService.getEnvironment($routeParams.id).then(function(env){
        $scope.env = env;
        $scope.arena_config.arena_type = env.arena_type;
        $scope.arena_config.platform = env.platform;
        $scope.arena_config.cues = env.cues;
        $scope.env_loaded = true;

        //Generate the clone url
        $scope.clone_url += '&n=' + encodeURIComponent(env.name);
        $scope.clone_url += '&s=' + encodeURIComponent(env.size);
        $scope.clone_url += '&at=' + encodeURIComponent(env.arena_type);
        $scope.clone_url += '&p=' + encodeURIComponent(JSON.stringify(env.platform));
        $scope.clone_url += '&cl=' + encodeURIComponent(JSON.stringify(env.cues));
    }, 
    function(pError){
        console.log(pError);
    });

    //Simulate data from the service.
    //$scope.arena_config.arena_type = 'circle';
    //$scope.arena_config.platform = [0.5, 0.5];
    // $scope.arena_config.cues = [
    // 	graphicsService.getCue([0.85, 0], 'M', 'L', 75),
    // 	graphicsService.getCue([0, 0.85], 'S', 'C'),
    // ];

    $scope.viewCue = function(index){
      $scope.arena_config.highlight_cue = index;
    };

    $scope.deleteEnvironment = function(){
        $scope.env.customDELETE($scope.env._id).then(function(){
            $location.path('/environments');
        });
    };

    $scope.hideDelete = function(){
        $scope.show_delete = false;
    };

  });
