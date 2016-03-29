angular.module('lunchtime').controller('AceptInviteController', ['$scope', '$rootScope', '$state', '$stateParams', 'Invites',
    'Grupo', 'Usuario',
    function ($scope, $rootScope, $state, $stateParams, Invites, Grupo, Usuario) {
        $rootScope.bodybg = {
            background: '#db4437 url(img/core/cover2.png) no-repeat fixed center'
        };

        $scope.emailconvite = "";
        $scope.cpassword = "";

        $scope.initFnc = function () {

            $scope.convite = true;
            $scope.cadastro = false;

            var iquery = {
                hashlink: $stateParams.hashinvite
            };

            //2 tipos de tratamentos .. ja tem conta e nao tem conta.
            Invites.query(iquery).then(function (invites) {
                if (invites[0]) {
                    //tem o invite mesmo
                    $scope.invite = invites[0];
                    var diasDiff = Math.floor((new Date() - new Date(invites[0].data)) / (1000 * 60 * 60 * 24));
                    //um mes
                    if (diasDiff > 30) {
                        $scope.cadastro = false;
                        $scope.convite = false;
                        $scope.expirado = true;
                    } else {

                        Usuario.getById(invites[0].user).then(function (user) {
                            $scope.userEnvio = user;
                        });

                        Grupo.getById(invites[0].grupo).then(function (grupo) {
                            $scope.grupoConvite = grupo;
                        });

                        var uquery = {
                            email: invites[0].emailconvite,
                            lunchtime: true
                        };
                        Usuario.query(uquery).then(function (usuarios) {
                            if (usuarios[0]) {
                                //ja existe na base, deve estar sendo chamado para o grupo
                                $scope.existeLunchTime = true;
                                $scope.userLunchTime = usuarios[0];
                            } else {
                                //nao existe na base, usuario novo
                                $scope.existeLunchTime = false;
                                $scope.userLunchTime = new Usuario();
                                $scope.userLunchTime.email = invites[0].emailconvite;
                                $scope.userLunchTime.lunchtime = true;
                                $scope.userLunchTime.grupoPrincipal = invites[0].grupo;
                                $scope.userLunchTime.grupos = [invites[0].grupo];
                            }
                        });
                    }
                }
            });
        };

        $scope.aceitar = function () {
            if ($scope.existeLunchTime) {
                //ja estive é só fazer a associação e mandar para o login
                $scope.userLunchTime.grupos.push($scope.grupoConvite._id.$oid);
                $scope.userLunchTime.$saveOrUpdate().then(function () {
                    //aceitou eu excluo
                    $scope.invite.$remove().then(function () {
                        $state.go('home');
                    });
                });
            } else {
                //nao existe o usuario.. chamar tela de cadastro.
                $scope.convite = false;
                $scope.cadastro = true;
            }
        };

        $scope.cadastrar = function () {
            if ($scope.userLunchTime.nome && $scope.userLunchTime.password && $scope.cpassword) {
                if ($scope.userLunchTime.password !== $scope.cpassword) {
                    $scope.cadastroError = "A senha deve coincidir com a confirmação."
                } else {
                    if ($scope.userLunchTime.password.length < 4) {
                        $scope.cadastroError = "A senha deve ter pelo menos 4 digitos."
                    } else {
                        $scope.userLunchTime.$saveOrUpdate().then(function () {
                            $state.go('home');
                        });
                    }
                }
            } else {
                $scope.cadastroError = "Todos os campos são obrigatórios."
            }
        };
    }]);