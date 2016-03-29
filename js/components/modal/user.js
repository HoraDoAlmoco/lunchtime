angular.module('lunchtime').controller('UserController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais', 'user', 'grupo',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais, user, grupo) {

        $rootScope.bodybg = {
            background: '#FFFFFF'
        };

        $scope.apassword = "";
        $scope.npassword = "";
        $scope.rpassword = "";
        $scope.valido = false;
        $scope.errorString = "";

        $scope.initFormUser = function () {
            Usuario.getById(user).then(function (usuario) {
                $scope.usuario = usuario;
                $scope.nomeOriginal = usuario.nome;
            });
        };

        $scope.salvarUser = function () {
            $scope.valido = false;
            if($scope.npassword) {
                //tentativa de mudanca de senha
                if ($scope.npassword.length > 3) {
                    if($scope.apassword === $scope.usuario.password) {
                        if($scope.npassword === $scope.rpassword) {
                            $scope.usuario.password = $scope.npassword;
                            $scope.valido = true;
                        } else {
                            $scope.errorString = "A nova senha e a repetição dela estão diferentes."
                        }
                    } else {
                        $scope.errorString = "A senha atual está inválida."
                    }
                } else {
                    $scope.errorString = "A nova senha deve ter pelo menos 4 digitos."
                }
            } else if($scope.apassword) {
                //verificar se houve mudanca no nome do usuario e nao troca de senha.
                if($scope.usuario.nome !== $scope.nomeOriginal) {
                    //houve troca de nome.
                    if($scope.apassword === $scope.usuario.password) {
                         $scope.valido = true;
                    } else {
                        $scope.errorString = "A senha está inválida."
                    }
                }
            }
            if($scope.valido) {
                $scope.usuario.$saveOrUpdate().then(function () {
                    $scope.$close(true);
                });
            }
        };

        $scope.cancelarUser = function(){
            $scope.$dismiss();
        };

        $scope.cancelarConta = function () {
            $scope.$dismiss();
        };

    }]);