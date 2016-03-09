angular.module('lunchtime').controller('GroupController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais', 'md5', '$modal',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais, md5, $modal) {
        $rootScope.bodybg = {
            background: '#FFFFFF'
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
            $modal
                .open({
                    templateUrl: 'addgrupo.html',
                    controller: 'AddGrupoController',
                    resolve: {
                        ctrlScope: function () {
                            return $scope
                        }
                    }
                }).result.then(function () {
                    $state.reload();
                }, function () {
                    $state.reload();
                });
        };

        $scope.convidar = function (grupo) {
            //vai chamar um popup que cria um link para a pessoa se cadastrar já sendo adicionada
            //caso o email ja exista nos users ela somente é adicionada ao grupo.
            //pensar na logica de expirar o pedido e criar um hash
            $modal
                .open({
                    templateUrl: 'invite.html',
                    controller: 'InviteController',
                    resolve: {
                        ctrlScope: function () {
                            return $scope
                        },
                        grupo: function () {
                            return grupo
                        }
                    }
                }).result.then(function () {
                    console.log("ok");
                }, function () {
                    console.log("cancel");
                });
        };

        $scope.salvar = function (grupo) {
            //salvar aterações feitas no grupo.
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

angular.module('lunchtime').controller('InviteController', function ($scope, ctrlScope, md5, $location, grupo) {
    $scope.linkhash = "";
    $scope.emailconvite = "";

    $scope.gerarLink = function () {
        if ($scope.emailconvite) {
            var hashmd5 = md5.createHash(ctrlScope.iduser + "/" + grupo._id.$oid + "/" + $scope.emailconvite);
            $scope.linkhash = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/invite/" + hashmd5;
        }
    };

    $scope.confirmarEnvio = function () {
        $scope.$close('ok');
    };

    $scope.cancelarEnvio = function () {
        $scope.$dismiss('cancel');
    };
});

angular.module('lunchtime').controller('AddGrupoController', function ($scope, ctrlScope, $modalInstance) {
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
            $scope.$close(true);
        }
    };

    $scope.cancelarCriacao = function () {
        $scope.$dismiss();
    };
});