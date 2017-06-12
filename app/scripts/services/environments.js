'use strict';

/**
 * @ngdoc service
 * @name navwellAdminApp.environments
 * @description
 * # environments
 * Service in the navwellAdminApp.
 */
angular.module('navwellAdminApp')
  .service('environmentsService', function (Restangular) {
  		 return {
  		 	getEnvironments: function(){
    			return Restangular.all('environment').getList().$object;
    		},
  		 	saveEnvironment: function(environment){
    			return Restangular.all('environment').post(environment);
    		},
        getEnvironment: function(id){
            return Restangular.one('environment', id).get();
        }
  		 };
  });
