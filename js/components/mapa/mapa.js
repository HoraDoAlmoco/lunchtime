
lunchtime.controller('MapaController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais',
    function($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais){
        $rootScope.bodybg = {
            background: '#db4437'
        };
        $scope.openCloseCardClass = "";

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        //pequeno teste para verificar se é o mesmo que esta no cookie.
        //enconomizo tempo e busca
        var grupoPrincipal = $cookies.getObject("ltgrupoPrincipal");
        if(!$stateParams.grupo === grupoPrincipal._id.$oid) {
            //não é o mesmo que estava no cookie, deve ser tentativa de buscar por get,
            // se passou no teste do 'on' é por que o usuario esta procurando algum grupo.
        }

        var mapOptions = {
            center: new google.maps.LatLng(grupoPrincipal.latitude, grupoPrincipal.longitude),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: true,
            disableDefaultUI: true,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'lunchtimemap']
            }
        };

        var lunchtimeMapType = new google.maps.StyledMapType(Listas.lunchtimeMapType);

        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        $scope.map.mapTypes.set('lunchtimemap', lunchtimeMapType);
        $scope.map.setMapTypeId('lunchtimemap');

        service = new google.maps.places.PlacesService($scope.map);

        var primarker = new MarkerWithLabel({
            map: $scope.map,
            position: new google.maps.LatLng(grupoPrincipal.latitude, grupoPrincipal.longitude),
            labelContent: grupoPrincipal.nome,
            labelClass: "marker-labels",
            labelAnchor: new google.maps.Point((grupoPrincipal.nome.length * 3), 0),
            icon : "img/core/localprincipal.png"
        });

        $scope.markers = [];
        $scope.infowindow = new google.maps.InfoWindow();

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        };

        function criarInfoObj(localGrupo, local, distancia){

            var info = {};

            info.distancia = distancia ? distancia : 0;
            info.titulo = localGrupo.titulo;
            info.endereco = local.endereco;
            info.latitude = local.latitude;
            info.longitude = local.longitude;
            info.votos = localGrupo.votos;
            info.votado = false;
            for(var a = 0; a < localGrupo.votos.length; a++) {
                if(localGrupo.votos[a] === $rootScope.currentUser._id.$oid) {
                    info.votado = true;
                }
            }
            var infos = localGrupo.infos;
            info.infos = infos;
            info.extra = capitalizeFirstLetter(localGrupo.categoria);
            info.categoria = localGrupo.categoria;
            for (var j = 0; j < infos.length; j++){
                info.extra += ", " + infos[j];
            }
            info.valor = localGrupo.valor;
            var tamanho = 4 - info.valor.length;
            info.valorVazio = "";
            for(var b = 0;b < tamanho; b++) {
                info.valorVazio += "$";
            }
            info.localObj = local;

            return info;

        }

        $scope.markerClicado = function(marker) {
            $scope.markerSelecionado = marker;
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        };

        google.maps.event.addListener($scope.map, 'click', function (e) {
            var mapCard = $(".map-card-detail-lg");
            $(mapCard).removeClass("open-com-menu");
            $(mapCard).removeClass("open-sem-menu");
            $rootScope.openCloseCardClass = "";
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        });

        // Sets the map on all markers in the array.
        function setMapOnAll(map) {
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(map);
            }
        }

        function clearMarkers() {
            setMapOnAll(null);
        }

        $scope.votar = function(marker) {
            var mapCard = $(".map-card-detail-lg");
            $(mapCard).removeClass("open-com-menu");
            $(mapCard).removeClass("open-sem-menu");
            $rootScope.openCloseCardClass = "";
            $rootScope.openCloseClass = "";

            waitingDialog.show();

            //verificar se esse local ja possui voto do usuario atual, assim sendo uma remoção de votação.
            var retirar = false;
            var indiceRetirar = 0;
            var indiceGrupo = 0;
            //if(local.grupos[a] === grupoPrincipal._id.$oid) {

            for(var i = 0;i < marker.localObj.grupos.length; i++){
                //grupo correto
                if(marker.localObj.grupos[i].grupo === $stateParams.grupo){
                    indiceGrupo = i;
                    for(var j = 0;j < marker.localObj.grupos[i].votos.length; j++) {
                        if (marker.localObj.grupos[i].votos[j] === $rootScope.currentUser._id.$oid) {
                            retirar = true;
                            indiceRetirar = j;
                        }
                    }
                }
            }
            if(retirar) {
                //retirar voto
                marker.localObj.grupos[indiceGrupo].votos.splice(indiceRetirar, 1);
                marker.localObj.$saveOrUpdate().then(function(){
                    $scope.initMarkers();
                });
            } else {
                //votar
                //procurar se tem local votado em outro lugar
                var query = {
                    "grupos" : {
                        $elemMatch : {
                            "grupo" : grupoPrincipal._id.$oid,
                            "votos" : {
                                $eq : $rootScope.currentUser._id.$oid
                            }
                        }
                    }
                };
                Locais.query(query).then(function(locais){
                    //verificar se achou
                    if(locais.length > 0) {
                        var local = locais[0];
                        //ver se por um acaso nao estou tirando do proprio que ja coloquei.
                        if(local._id.$oid === marker.localObj._id.$oid) {
                            //se é o mesmo que marcou, refaz a lista
                            $scope.initMarkers();
                        } else {
                            //retiro o voto primeiro
                            for(var a = 0; a < local.grupos.length; a++) {
                                if(local.grupos[a].grupo === grupoPrincipal._id.$oid) {
                                    //é o grupo
                                    var retirarVoto = false;
                                    var indiceVoto = 0;
                                    for(var b = 0;b < local.grupos[a].votos.length;b++) {
                                        if($rootScope.currentUser._id.$oid === local.grupos[a].votos[b]) {
                                            retirarVoto = true;
                                            indiceVoto = b;
                                        }
                                    }
                                    if(retirarVoto) {
                                        local.grupos[a].votos.splice(indiceVoto, 1);
                                    }
                                }
                            }
                            local.$saveOrUpdate().then(function(){
                                marker.localObj.grupos[indiceGrupo].votos.push($rootScope.currentUser._id.$oid);
                                marker.localObj.$saveOrUpdate().then(function(){
                                    $scope.initMarkers();
                                });
                            });
                        }
                    } else {
                        //nao tem, esta correto
                        marker.localObj.grupos[indiceGrupo].votos.push($rootScope.currentUser._id.$oid);
                        marker.localObj.$saveOrUpdate().then(function(){
                            $scope.initMarkers();
                        });
                    }
                });
            }
        };

        $scope.initMarkers = function(foraDaPagina){

            if(!foraDaPagina) {
                waitingDialog.show();
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var lat = position.coords.latitude;
                        var lon = position.coords.longitude;
                        var userLocation = new google.maps.LatLng(lat, lon);
                        var marker = new google.maps.Marker({
                            position: userLocation,
                            map: $scope.map,
                            icon: "img/core/pegman.png"
                        });
                    });
                }
            }
            $scope.markerSelecionado = {};
            var query = {
                "grupos" : {
                    $elemMatch : {
                        "grupo" : grupoPrincipal._id.$oid
                    }
                }
            };
            clearMarkers();
            $scope.markers = [];
            Locais.query(query).then(function(locais){
                var groupLatLng = new google.maps.LatLng(grupoPrincipal.latitude, grupoPrincipal.longitude);
                locais.forEach(function(local){
                    var info = {};
                    var localLatLng = new google.maps.LatLng(local.latitude, local.longitude);

                    var localGrupo = recuperaLocalGrupo(grupoPrincipal._id.$oid, local.grupos);

                    var possuiVotos = localGrupo.votos && localGrupo.votos.length > 0;
                    if(possuiVotos) {
                        var service = new google.maps.DistanceMatrixService();
                        service.getDistanceMatrix(
                            {
                                origins: [groupLatLng],
                                destinations: [localLatLng],
                                travelMode: google.maps.TravelMode.WALKING,
                                unitSystem: google.maps.UnitSystem.METRIC,
                                avoidHighways: false,
                                avoidTolls: false,
                            }, function (response, status) {
                                info = criarInfoObj(localGrupo, local, response.rows[0].elements[0].distance.value);
                                createMarker(info);
                            });
                    } else {
                        info = criarInfoObj(localGrupo, local);
                        createMarker(info);
                    }
                });
            });
            if(!$scope.$$phase) {
                $scope.$apply();
            }
            waitingDialog.hide();
        };

        var recuperaLocalGrupo = function(idGrupoPrincipal, grupos) {
            var localGrupo = {};
            for(var i = 0;i < grupos.length; i++) {
                if(grupos[i].grupo === idGrupoPrincipal) {
                    localGrupo = grupos[i];
                    break;
                }
            }
            return localGrupo;
        };

        var createMarker = function(info) {
            var eixox = 1;
            var eixoy = 136;
            if(info.votos && Number(info.votos.length) > 1){
                eixox = (Number(info.votos.length) - 1) * 35 + 1;
            }
            if(info.votado) {
                eixoy = 92;
            }

            var icon;

            if(info.votos && Number(info.votos.length) > 0){
                icon = new google.maps.MarkerImage("/lunchtime/img/core/mappin-sprite.png", new google.maps.Size(33, 42), new google.maps.Point(eixox, eixoy));
            } else {
                icon = new google.maps.MarkerImage("/lunchtime/img/core/mappin-blank.png", new google.maps.Size(33, 42));
            }

            var xPoint = Math.ceil(info.titulo.length * 3);
            var marker = new MarkerWithLabel({
                map: $scope.map,
                position: new google.maps.LatLng(info.latitude, info.longitude),
                icon : icon,
                animation : google.maps.Animation.DROP,
                labelContent: info.titulo,
                labelClass: "marker-labels",
                labelAnchor: new google.maps.Point(xPoint, 0)
            });

            marker.titulo = info.titulo;
            marker.categoria = info.categoria;
            marker.endereco = info.endereco;
            marker.extra = info.extra;
            marker.votos = info.votos;
            marker.votado = info.votado;
            marker.quantidade = info.votos.length;
            marker.ltmarker = true;
            marker.distancia = info.distancia ? info.distancia : 0;
            marker.valor = info.valor;
            marker.valorVazio = info.valorVazio;
            marker.localObj = info.localObj;

            google.maps.event.addListener(marker, 'click', function(){
                var mapCard = $(".map-card-detail-lg");
                if($rootScope.openCloseClass === "open") {
                    if(!$(mapCard).hasClass("open-com-menu")){
                        $(mapCard).addClass("open-com-menu");
                        $rootScope.openCloseCardClass = "open-com-menu";
                    }
                } else {
                    if(!$(mapCard).hasClass("open-sem-menu")){
                        $(mapCard).addClass("open-sem-menu");
                        $rootScope.openCloseCardClass = "open-sem-menu";
                    }
                }
                $scope.markerClicado(marker);
                $scope.map.setCenter(marker.getPosition());
            });

            $scope.markers.push(marker);
        };

        $scope.addtogroup = function(nome){
            console.log(nome);
            if(resultadoBusca[0]) {
                console.log(resultadoBusca[0].name);
            }
        };
    }]);