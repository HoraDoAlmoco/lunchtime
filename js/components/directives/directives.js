
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
            controller : ['$scope', function($scope){
                $scope.openClose = function(){
                    $scope.openCloseClass !== "open" ? $scope.openCloseClass = "open" : $scope.openCloseClass = "";
                };
            }]
        }
    });