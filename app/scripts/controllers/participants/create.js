'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:CreateparticipantCtrl
 * @description
 * # CreateparticipantCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('CreateparticipantCtrl', function ($scope, $location, participantsService) {

  	$scope.validators = {
  		id: false,
  		save: false
  	}

    $scope.create = function(){
    	$scope.validators.id = false;
    	$scope.validators.save = false;
    	if (!$scope.id){
    		$scope.validators.id = true;
    	}
    	else {
    		//Create the user, redirect to main screen. 
    		var newParticipant = {
    			id: $scope.id, 
    			first_name: $scope.first_name || 'Anonymous',
    			last_name: $scope.last_name || '',
    			notes: $scope.notes || '',
    			experiments: []
    		}
    		participantsService.saveParticipant(newParticipant).then(function(){
    			$location.path('/participants');
    		}, 
    		function(pError){
    			console.log(pError);
    			$scope.validators.save = true;
    		});

    	}
    };

  });
