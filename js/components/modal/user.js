angular.module('lunchtime').controller('UserController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais) {

        $scope.apassword = "";
        $scope.npassword = "";
        $scope.rpassword = "";

        $scope.initFormUser = function () {
            Usuario.getById($stateParams.user).then(function (usuario) {
                $scope.usuario = usuario;
            });
        };

        $scope.salvarUser = function () {

        };

    }]);