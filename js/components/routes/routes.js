angular.module('lunchtime').config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "views/home.html",
            controller: 'HomeController',
            data: {
                requiredlogin: false
            }
        })
        .state('mapa', {
            url: "/mapa/:grupo",
            templateUrl: "views/mapa/mapa.html",
            controller: 'MapaController',
            data: {
                requiredlogin: true
            }
        })
        .state('group', {
            url: "/grupos/:user/:grupo",
            data: {
                requiredlogin: true
            },
            templateUrl: "views/grupos/grupos.html",
            controller: "GroupController"
        });
});