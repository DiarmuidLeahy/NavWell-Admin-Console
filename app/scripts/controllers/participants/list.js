'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:ParticipantsCtrl
 * @description
 * # ParticipantsCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('ParticipantsCtrl', function ($scope, participantsService) {
    	$scope.participantsList = participantsService.getParticipants();

    	$scope.countAttemptedExperiments = function(participant){
            //console.info(participant);//derri
    		var count = 0;
    		if (participant){
    			for (var i = participant.experiments.length - 1; i >= 0; i--) {
    				count += participant.experiments[i].attempted ? 1 : 0;
    			}
    		}
		    return count; 
    	};
  });
