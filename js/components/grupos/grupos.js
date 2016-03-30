angular.module('lunchtime').controller('GroupController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais', 'md5', '$modal', 'Invites',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais, md5, $modal, Invites) {
        $rootScope.bodybg = {
            background: '#FFFFFF',
            overflow: 'auto'
        };

        $scope.maps = [];
        $scope.nomesOriginais = [];

        $scope.iduser = $stateParams.user;
        $scope.idgrupo = $stateParams.grupo;

        $scope.selectedgroup = "";
        $scope.selectedrow = null;
        $scope.detailgroup = "detail-group-hidden";

        $scope.setselectedrow = function (index, grupo) {
            $scope.selectedrow = index;
            createMap(index, grupo);
        };

        function createMap(index, grupo) {

            var mapOptions = {
                center: new google.maps.LatLng(grupo.latitude, grupo.longitude),
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                disableDefaultUI: true
            };
            $scope.maps[index] = new google.maps.Map(document.getElementById('map-canvas-' + index), mapOptions);

            var primarker = new MarkerWithLabel({
                map: $scope.maps[index],
                position: new google.maps.LatLng(grupo.latitude, grupo.longitude),
                labelContent: grupo.nome,
                labelClass: "marker-labels",
                animation: google.maps.Animation.DROP,
                labelAnchor: new google.maps.Point((grupo.nome.length * 3), 0)
            });

            var input = document.getElementById('endereco' + index);
            var searchBox = new google.maps.places.SearchBox(input);

            google.maps.event.addListener(searchBox, 'places_changed', function () {
                var places = searchBox.getPlaces();
                var bounds = new google.maps.LatLngBounds();
                var place = places[0];
                primarker.setMap(null);
                primarker.position = place.geometry.location;
                primarker.setMap($scope.maps[index]);
                $scope.maps[index].setCenter(primarker.getPosition());

                $scope.grupos[index].latitude = place.geometry.location.lat();
                $scope.grupos[index].longitude = place.geometry.location.lng();

            });

        }

        $scope.criarGrupo = function () {
            $modal.open({
                templateUrl: 'views/modal/addgrupo.html',
                controller: 'AddGrupoController',
                resolve: {
                    ctrlScope: function () {
                        return $scope
                    },
                    grupoDB: function () {
                        return Grupo
                    },
                    usuarioDB : function () {
                        return Usuario
                    }
                }
            }).result.then(function () {
                    $state.reload();
                }, function () {});
        };

        $scope.convidar = function (grupo) {
            //vai chamar um popup que cria um link para a pessoa se cadastrar já sendo adicionada
            //caso o email ja exista nos users ela somente é adicionada ao grupo.
            //pensar na logica de expirar o pedido e criar um hash
            $modal
                .open({
                    templateUrl: 'views/modal/invite.html',
                    controller: 'InviteController',
                    resolve: {
                        ctrlScope: function () {
                            return $scope
                        },
                        grupo: function () {
                            return grupo
                        },
                        inviteDB: function () {
                            return Invites
                        },
                        usuarioDB : function () {
                            return Usuario
                        }
                    }
                }).result.then(function () {
                    $state.reload();
                }, function () {});
        };

        $scope.listaConvite = function (grupo) {

            $modal
                .open({
                    templateUrl: 'views/modal/list-invite.html',
                    controller: 'ListInviteController',
                    resolve: {
                        ctrlScope: function () {
                            return $scope
                        },
                        grupo: function () {
                            return grupo
                        },
                        inviteDB: function () {
                            return Invites
                        },
                        usuarioDB : function () {
                            return Usuario
                        }
                    }
                }).result.then(function () {

                }, function () {});
        };

        $scope.listaUsuarios = function (grupo) {
            $modal
                .open({
                    templateUrl: 'views/modal/list-users.html',
                    controller: 'ListUserController',
                    resolve: {
                        ctrlScope: function () {
                            return $scope
                        },
                        grupo: function () {
                            return grupo
                        },
                        usuarioDB : function () {
                            return Usuario
                        }
                    }
                }).result.then(function () {}, function () {});
        };

        $scope.listClick = function () {

        };

        $scope.salvar = function (grupo) {
            //salvar aterações feitas no grupo.
            if(grupo.nome && grupo.latitude && grupo.longitude) {
                grupo.$saveOrUpdate().then(function () {
                    $state.reload();
                });
            }
        };

        $scope.excluir = function (grupo) {
            //excluir o grupo, existe uma serie de verificações e pensamentos aqui.
        };

        $scope.tornarprincipal = function (grupo) {
            //tornar esse grupo o principal para este usuario.
            Usuario.getById($scope.iduser).then(function (usuario) {
                if (usuario) {
                    usuario.grupoPrincipal = grupo._id.$oid;
                    usuario.$saveOrUpdate().then(function () {
                        $cookies.put("ltgrupoPrincipalKey", usuario.grupoPrincipal);
                        $cookies.putObject("ltgrupoPrincipal", grupo);
                        $state.go("group", {user: $scope.iduser, grupo: usuario.grupoPrincipal});
                    });
                }
            });
        };

        $scope.initGrupos = function () {
            waitingDialog.show();
            Usuario.getById($stateParams.user).then(function (usuario) {

                var qin = [];
                angular.forEach(usuario.grupos, function (id) {
                    qin.push({$oid: id});
                });

                var query = {"_id": {$in: qin}};

                Grupo.query(query).then(function (grupos) {
                    $scope.grupos = grupos;
                    $scope.grupoPrincipal = usuario.grupoPrincipal;

                    angular.forEach($scope.grupos, function (grupo) {
                        $scope.nomesOriginais.push(grupo.nome);
                    });

                    waitingDialog.hide();
                })
            });

        };

        $scope.blurNome = function (index) {
            if ($scope.grupos[index].nome === "") {
                $scope.grupos[index].nome = $scope.nomesOriginais[index];
            }
        };

    }]);

angular.module('lunchtime').controller('ListUserController', function ($scope, ctrlScope, grupo, usuarioDB) {

    $scope.initLista = function () {
        var uq = {
            "grupos": grupo._id.$oid
        };
        usuarioDB.query(uq).then(function (usuarios) {
            if(usuarios) {
                $scope.usuarios = usuarios;
            }
        });
    };

    $scope.cancelarLista = function () {
        $scope.$dismiss('cancel');
    };
});


angular.module('lunchtime').controller('ListInviteController', function ($scope, ctrlScope, grupo, inviteDB, usuarioDB, $location) {

    $scope.initLista = function () {
        var uq = {
            "user" : ctrlScope.iduser,
            "grupo": grupo._id.$oid
        };
        inviteDB.query(uq).then(function (convites) {
            if(convites) {
                $scope.convites = convites;
                angular.forEach($scope.convites, function(convite, indice){
                    var diasDiff = Math.floor((new Date() - new Date(convite.data)) /(1000*60*60*24));
                    convite.expirado = diasDiff > 30;
                    convite.data = new Date(convite.data);
                    convite.link = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/lunchtime/#/invite/" + convite.hashlink;
                });
            }
        });
    };

    $scope.excluirConvite = function (convite, index) {
        $scope.convites.splice(index, 1);
        convite.$remove().then(function(){});
    };

    $scope.cancelarLista = function () {
        $scope.$dismiss('cancel');
    };
});

angular.module('lunchtime').controller('InviteController', function ($scope, ctrlScope, md5, $location, grupo, inviteDB, usuarioDB) {
    $scope.linkhash = "";
    $scope.emailconvite = "";
    $scope.inviteError = "";

    $scope.gerarLink = function () {
        if ($scope.emailconvite) {
            $scope.hashmd5 = md5.createHash(ctrlScope.iduser + "/" + grupo._id.$oid + "/" + $scope.emailconvite);
            $scope.linkhash = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/lunchtime/#/invite/" + $scope.hashmd5;
        }
    };

    $scope.confirmarEnvio = function () {
        if ($scope.emailconvite && $scope.hashmd5) {
            var userq = {
                email: $scope.emailconvite,
                lunchtime: true
            };
            usuarioDB.query(userq).then(function (usuarios) {
                if(usuarios[0]) {
                    //ja existe essa pessoa no lunchtime.
                    //vamos ver se ela ja nao esta no grupo.
                    if(usuarios[0].grupos.indexOf(grupo._id.$oid) > -1) {
                        //ja esta no grupo .. retorna um erro.
                        $scope.inviteError = "Email já cadastrado e está no grupo";
                    } else {
                        //de boa para adicionar ao lunchtime
                        criarConvite();
                    }
                } else {
                    //nao esta .. entao pode fazer normal
                    criarConvite();
                }
            });
        }
    };

    function criarConvite () {
        var query = {
            hashlink : $scope.hashmd5
        };

        inviteDB.query(query).then(function (invites) {
            //ver se ja possui o invite para esse hash
            var invite = new inviteDB();
            invite.hashlink = $scope.hashmd5;
            invite.emailconvite = $scope.emailconvite;
            invite.user = ctrlScope.iduser;
            invite.grupo = grupo._id.$oid;
            invite.data = new Date();

            if(invites[0]) {
                //possui algo nesse hash.
                var diasDiff = Math.floor((new Date() - new Date(invites[0].data)) /(1000*60*60*24));
                //um mes
                if(diasDiff > 30) {
                    //renovo a data.
                    invites[0].data = new Date();
                    invites[0].$saveOrUpdate().then(function () {
                        $scope.$close('ok');
                    });
                } else {
                    //nem preciso atualizar nada.
                    $scope.$close('ok');
                }
            } else {
                //nao tem nada.
                invite.$saveOrUpdate().then(function () {
                    $scope.$close('ok');
                });
            }
        });
    }

    $scope.cancelarEnvio = function () {
        $scope.$dismiss('cancel');
    };
});

angular.module('lunchtime').controller('AddGrupoController', function ($scope, ctrlScope, grupoDB, usuarioDB) {
    $scope.newmapa = {};
    var defaultposition = new google.maps.LatLng(-22.904265, -43.174494);
    $scope.newgrupo = {
        nome: "",
        endereco: "",
        latitude: "",
        longitude: "",
        criador: ctrlScope.iduser
    };

    angular.element(this).ready(function () {
        var mapOptions = {
            center: defaultposition,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            disableDefaultUI: true
        };
        $scope.newmapa = new google.maps.Map(document.getElementById('map-canvas-new'), mapOptions);

        var primarker = new MarkerWithLabel({
            map: $scope.newmapa,
            position: defaultposition,
            labelContent: "",
            labelClass: "marker-labels",
            animation: google.maps.Animation.DROP,
            labelAnchor: new google.maps.Point(($scope.newgrupo.nome.length * 3), 0)
        });

        var input = document.getElementById('endereco');
        var searchBox = new google.maps.places.SearchBox(input);

        google.maps.event.addListener(searchBox, 'places_changed', function () {
            var places = searchBox.getPlaces();
            var bounds = new google.maps.LatLngBounds();
            var place = places[0];
            primarker.setMap(null);
            primarker.position = place.geometry.location;
            primarker.setMap($scope.newmapa);
            $scope.newmapa.setCenter(primarker.getPosition());

            $scope.newgrupo.latitude = place.geometry.location.lat();
            $scope.newgrupo.longitude = place.geometry.location.lng();

        });
    });

    $scope.confirmarCriacao = function () {
        if ($scope.newgrupo.nome && $scope.newgrupo.latitude && $scope.newgrupo.longitude) {
            //tem algo preenchido
            var grupo = new grupoDB();
            grupo.nome = $scope.newgrupo.nome;
            grupo.endereco = $scope.newgrupo.endereco;
            grupo.latitude = String($scope.newgrupo.latitude);
            grupo.longitude = String($scope.newgrupo.longitude);
            grupo.criador = $scope.newgrupo.criador;

            grupo.$saveOrUpdate().then(function (gruposalvo) {
                usuarioDB.getById(ctrlScope.iduser).then(function (usuario) {
                    usuario.grupos.push(gruposalvo._id.$oid);
                    usuario.$saveOrUpdate().then(function () {
                        $scope.$close(true);
                    });
                });
            });
        }
    };

    $scope.cancelarCriacao = function () {
        $scope.$dismiss();
    };
});