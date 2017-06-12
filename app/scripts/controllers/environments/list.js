'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:EnvironmentsCtrl
 * @description
 * # EnvironmentsCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('EnvironmentsCtrl', function ($scope, environmentsService) {

  	$scope.sizes = {
  		S: 'Small',
  		M: 'Medium',
  		L: 'Large'
  	}

  	$scope.environmentsList = environmentsService.getEnvironments();

  	$scope.getType = function(type){
  		return type.charAt(0).toUpperCase() + type.slice(1);
  	};

  });
