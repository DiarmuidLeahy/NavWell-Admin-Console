'use strict';

/**
 * @ngdoc function
 * @name navwellAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the navwellAdminApp
 */
angular.module('navwellAdminApp')
  .controller('ExperimentsCtrl', function ($scope, experimentsService) {

    $scope.experimentsList = experimentsService.getExperiments();
  });
