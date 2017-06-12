'use strict';

/**
 * @ngdoc overview
 * @name navwellAdminApp
 * @description
 * # navwellAdminApp
 *
 * Main module of the application.
 */
angular
  .module('navwellAdminApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'restangular'
  ])
  .config(function ($routeProvider, RestangularProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/experiments', {
        templateUrl: 'views/experiments/list.html',
        controller: 'ExperimentsCtrl',
        controllerAs: 'experiments'
      })
      .when('/environments', {
        templateUrl: 'views/environments/list.html',
        controller: 'EnvironmentsCtrl',
        controllerAs: 'environments'
      })
      .when('/participants', {
        templateUrl: 'views/participants/list.html',
        controller: 'ParticipantsCtrl',
        controllerAs: 'participants'
      })
      .when('/participants/create', {
        templateUrl: 'views/participants/create.html',
        controller: 'CreateparticipantCtrl',
        controllerAs: 'createParticipant'
      })
      .when('/participants/:id', {
        templateUrl: 'views/participants/view.html',
        controller: 'ParticipantdetailsCtrl',
        controllerAs: 'participantDetails'
      })
      .when('/participants/:id/experiment/:exp', {
        templateUrl: 'views/participants/experiment.html',
        controller: 'ParticipantexperimentCtrl',
        controllerAs: 'participantExperiment'
      })
      .when('/environments/create', {
        templateUrl: 'views/environments/create.html',
        controller: 'CreateenvironmentCtrl',
        controllerAs: 'createEnvironment'
      })
      .when('/environments/:id', {
        templateUrl: 'views/environments/view.html',
        controller: 'ViewenvironmentCtrl',
        controllerAs: 'viewEnvironment'
      })
      .when('/experiments/create', {
        templateUrl: 'views/experiments/create.html',
        controller: 'ExperimentcreateCtrl',
        controllerAs: 'experimentCreate'
      })
      .when('/experiments/:id', {
        templateUrl: 'views/experiments/view.html',
        controller: 'ViewexperimentCtrl',
        controllerAs: 'viewExperiment'
      })
      .when('/experiments/:id/results', {
        templateUrl: 'views/experiments/results.html',
        controller: 'ExperimentresultsCtrl',
        controllerAs: 'experimentResults'
      })
      .otherwise({
        redirectTo: '/'
      });
      
      RestangularProvider.setBaseUrl(window.NavWell.Config.API);
      RestangularProvider.setDefaultHeaders({
          'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
      });
  });
