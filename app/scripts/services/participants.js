'use strict';

/**
 * @ngdoc service
 * @name navwellAdminApp.participants
 * @description
 * # participants
 * Service in the navwellAdminApp.
 */
angular.module('navwellAdminApp')
  .service('participantsService', function (Restangular) {
    return {
    	getParticipants: function(){
    		return Restangular.all('participant').getList().$object;
    	}, 

    	saveParticipant: function(participant){
    		
    		return Restangular.all('participant').post(participant);
    	}, 

        getParticipant: function(id){
            return Restangular.one('participant', id).get();
        }
    };
  });
