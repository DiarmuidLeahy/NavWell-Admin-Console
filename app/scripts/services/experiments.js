'use strict';

/**
 * @ngdoc service
 * @name navwellAdminApp.experiments
 * @description
 * # experiments
 * Service in the navwellAdminApp.
 */
angular.module('navwellAdminApp')
  .service('experimentsService', function (Restangular) {
  		return {
  			getExperiments: function(){
    			 return Restangular.all('experiment').getList().$object;
    		},
        getExperimentsPromise: function(){
           return Restangular.all('experiment').getList();
        },
  			saveExperiment: function(experiment){
    			 return Restangular.all('experiment').post(experiment);
    		},
    		getExperiment: function(id){
            return Restangular.one('experiment', id).get();
       	},
        getExperimentResults: function(id){
            return Restangular.one('experiment', id).getList('results');
        }
        //Need to add saveNotes() function in here at some point            (Derri)
  		};
  });
