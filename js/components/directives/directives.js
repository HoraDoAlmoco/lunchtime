
lunchtime
    .directive(
        "mAppLoading",
        function( $animate ) {
            // Return the directive configuration.
            return({
                link: link,
                restrict: "C"
            });
            // I bind the JavaScript events to the scope.
            function link( scope, element, attributes ) {
                // Due to the way AngularJS prevents animation during the bootstrap
                // of the application, we can't animate the top-level container; but,
                // since we added "ngAnimateChildren", we can animated the inner
                // container during this phase.
                // --
                // NOTE: Am using .eq(1) so that we don't animate the Style block.
                $animate.leave( element.children().eq( 1 ) ).then(
                    function cleanupAfterAnimation() {
                        // Remove the root directive element.
                        element.remove();
                        // Clear the closed-over variable references.
                        scope = element = attributes = null;
                    }
                );
            }
        }
    )
    .directive('header', function(){
        return {
            restrict : 'A',
            replace: true,
            templateUrl: 'views/directives/header.html',
            controller : ['$scope','$rootScope', function($scope, $rootScope){
                $rootScope.openCloseClass = "";
                $rootScope.openCloseMapClass = "";
                $scope.searchtext = {"titulo" : ""};
                $scope.coresearchlist = "disable";
                $scope.openClose = function(){
                    var mapCard = $(".map-card-detail-lg");
                    $rootScope.openCloseClass !== "open" ? $rootScope.openCloseClass = "open" : $rootScope.openCloseClass = "";
                    $rootScope.openCloseClass === "open" ? $rootScope.openCloseMapClass = "open-com-menu" : $rootScope.openCloseMapClass = "";
                    if($rootScope.openCloseClass === "open" && $rootScope.openCloseCardClass === "open-sem-menu") {
                        $(mapCard).addClass("open-com-menu");
                        $(mapCard).removeClass("open-sem-menu");
                        $rootScope.openCloseCardClass = "open-com-menu";
                    } else if ($rootScope.openCloseClass === "" && $rootScope.openCloseCardClass === "open-com-menu"){
                        $(mapCard).addClass("open-sem-menu");
                        $(mapCard).removeClass("open-com-menu");
                        $rootScope.openCloseCardClass = "open-sem-menu";
                    }
                };

                $scope.changeSearch = function() {
                    if($scope.searchtext.titulo != ""){
                        $scope.coresearchlist = "enable";
                    } else {
                        $scope.coresearchlist = "disable";
                    }
                }
            }]
        }
    })
    .directive('footercard', function(){
        return {
            restrict: "E",
            templateUrl: "views/directives/footercard.html",
            controller: ['$scope', '$rootScope', function($scope, $rootScope){
                $scope.classCard = function(marker) {
                    return marker.votado ? "card-voted" : "card-unvoted";
                };
                $scope.closeFooterCard = function() {
                    var mapCard = $(".map-card-detail-lg");
                    $(mapCard).removeClass("open-com-menu");
                    $(mapCard).removeClass("open-sem-menu");
                    $rootScope.openCloseCardClass = "";
                };
                $scope.btnVotoTP = function(marker) {
                    return marker.votado ? "Retirar Voto" : "Votar";
                };

            }]
        }
    })
    .directive('listcard', function(){
        return {
            restrict: "E",
            templateUrl: "views/directives/listcard.html",
            controller: ['$scope', function($scope){
                $scope.classCard = function(marker) {
                    return marker.votado ? "card-voted" : "card-unvoted";
                };
                $scope.listMarkerClick = function(marker) {
                    google.maps.event.trigger(marker, 'click');
                };
            }]
        }
    });