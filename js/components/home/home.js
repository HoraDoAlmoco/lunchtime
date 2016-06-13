angular.module('lunchtime').controller('HomeController', ['$scope', '$rootScope', '$state', '$cookies',
    'Usuario', 'Grupo', 'Estatisticas', 'Locais',
    function($scope, $rootScope, $state, $cookies, Usuario, Grupo, Estatisticas, Locais){
        $rootScope.bodybg = {
            background: '#db4437 url(img/core/cover2.png) no-repeat fixed center'
        };

        var angularCookieUsrObj = $cookies.getObject('ltCookieKeyUsrObj');
        if(angularCookieUsrObj) {
            $rootScope.currentUser = angularCookieUsrObj;
        }

        if($rootScope.currentUser && $rootScope.currentUser.remember) {
            $scope._email = $rootScope.currentUser.email;
            $scope._remem = $rootScope.currentUser.remember;
        }

        function assignCurrentUser (user) {
            $rootScope.currentUser = user;
            $cookies.put("ltgrupoPrincipalKey", user.grupoPrincipal);
            return user;
        }

        $scope.submit = function(email, password, rememberMe) {
            var query = {
                "email" : email,
                "password" : password,
                "lunchtime" : true
            };
            Usuario.query(query).then(function(user){
                $scope.notFound = false;
                if(user[0]){
                    var curUser = user[0];

                    curUser.remember = rememberMe;
                    assignCurrentUser(curUser);
                    if(rememberMe) {
                        $cookies.putObject('ltCookieKeyUsrObj', curUser);
                    }
                    var appQuery = {
                        "_id": {
                            "$oid" : curUser.grupoPrincipal
                        }
                    };
                    Grupo.query(appQuery).then(function(grupos){
                        if(grupos[0]){
                            $cookies.putObject("ltgrupoPrincipal", grupos[0]);
                            var dataAtual = new Date();
                            dataAtual.setHours(0,0,0,0);
                            var queryE = {
                                data: dataAtual
                            };
                            Estatisticas.query(queryE).then(function (estatistica) {
                                //tme que ver se já nao existe alguma data.
                                if(!estatistica[0]) {
                                    //nao tem a data .. entao preciso quardar a estatistica.
                                    var novaEstatistica = new Estatisticas();
                                    novaEstatistica.data = dataAtual;
                                    novaEstatistica.locais = [];
                                    Locais.all().then( function (locais) {
                                        novaEstatistica.locais = locais;
                                        novaEstatistica.$saveOrUpdate().then( function () {
                                            angular.forEach(locais, function (local, chaveLoc) {
                                                angular.forEach(local.grupos, function (grupo, chaveGrp) {
                                                    grupo.votos = [];
                                                });
                                                local.$saveOrUpdate().then(function () {});
                                            });
                                            $state.go('mapa', {"grupo" : grupos[0]._id.$oid});
                                        });
                                    });
                                } else {
                                    //ja tem entao nao preciso salvar uma nova.
                                    $state.go('mapa', {"grupo" : grupos[0]._id.$oid});
                                }
                            });

                        }
                    });
                } else {
                    $scope.notFound = true;
                }
            });
        };
    }]);