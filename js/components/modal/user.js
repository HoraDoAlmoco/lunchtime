angular.module('lunchtime').controller('UserController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais) {

        $rootScope.bodybg = {
            background: '#FFFFFF'
        };

        $scope.apassword = "";
        $scope.npassword = "";
        $scope.rpassword = "";

        $scope.initFormUser = function () {
            Usuario.getById($stateParams.user).then(function (usuario) {
                $scope.usuario = usuario;
            });
        };

        $scope.salvarUser = function () {
            $scope.$close(true);
        };

        $scope.cancelarUser = function(){
            $scope.$dismiss();
        };

        $scope.cancelarConta = function () {
            $scope.$close(true);
        };

    }]);