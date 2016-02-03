
lunchtime.controller('MapaController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais',
    function($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais){
        $rootScope.bodybg = {
            background: '#db4437'
        };

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

        $scope.initMarkers = function(){
            var query = {
                "grupos" : {
                    $elemMatch : {
                        "grupo" : grupoPrincipal._id.$oid
                    }
                }
            };
            Locais.query(query).then(function(locais){
                var groupLatLng = new google.maps.LatLng(grupoPrincipal.latitude, grupoPrincipal.longitude);
                locais.forEach(function(local){
                    console.log(local);
                    var info = {};
                    var localLatLng = new google.maps.LatLng(local.latitude, local.longitude);
                    var service = new google.maps.DistanceMatrixService();
                    var distancia;
                    service.getDistanceMatrix(
                        {
                            origins: [groupLatLng],
                            destinations: [localLatLng],
                            travelMode: google.maps.TravelMode.WALKING,
                            unitSystem: google.maps.UnitSystem.METRIC,
                            avoidHighways: false,
                            avoidTolls: false,
                        }, function(response, status){
                            distancia = response.rows[0].elements[0].distance.value;
                        });

                    info.titulo = local.grupos[0].titulo;
                    info.latitude = local.latitude;
                    info.longitude = local.longitude;
                    info.votos = local.grupos[0].votos;
                    info.votado = local.grupos[0].votado;

                    createMarker(info);
                });
            });
        };

        var createMarker = function(info) {
            var eixox = 1;
            var eixoy = 136;
            if(Number(info.votos[0]) > 1){
                eixox = (Number(info.votos[0]) - 1) * 35 + 1;
            }
            if(info.votado != "") {
                eixoy = 92;
            }

            var icon;

            if(Number(info.votos[0]) > 0){
                icon = new google.maps.MarkerImage("/lunchtime/img/core/mappin-sprite.png", new google.maps.Size(33, 42), new google.maps.Point(eixox, eixoy));
            } else {
                icon = new google.maps.MarkerImage("/lunchtime/img/core/mappin-blank.png", new google.maps.Size(33, 42));
            }

            var halfPoint = Math.ceil(info.titulo.length * 3);
            var marker = new MarkerWithLabel({
                map: $scope.map,
                position: new google.maps.LatLng(info.latitude, info.longitude),
                icon : icon,
                animation : google.maps.Animation.DROP,
                labelContent: info.titulo,
                labelClass: "marker-labels",
                labelAnchor: new google.maps.Point(halfPoint, 0)
            });

            google.maps.event.addListener(marker, 'click', function(){
                console.log("abrir a telinha em baixo");
            });

            $scope.markers.push(marker);
        };

    }]);