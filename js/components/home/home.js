lunchtime.controller('HomeController', ['$scope', '$rootScope', '$state', '$cookies',
    function($scope, $rootScope, $state, $cookies){
        $rootScope.bodybg = {
            background: '#db4437 url(img/core/cover2.png) no-repeat fixed center'
        };

        var angularCookieUsrObj = $cookies.getObject('lunchtimeCookieKeyUsrObj');
        if(angularCookieUsrObj) {
            $rootScope.currentUser = angularCookieUsrObj;
        }

        if($rootScope.currentUser && $rootScope.currentUser.remember) {
            $scope._email = $rootScope.currentUser.email;
            $scope._remem = $rootScope.currentUser.remember;
        }

        function assignCurrentUser (user) {
            $rootScope.currentUser = user;
            $cookies.put("grupoPrincipalKey", user.grupoPrincipal.id);
            return user;
        }

        $scope.submit = function(email, password, rememberMe) {
            var query = {
                "email" : email,
                "password" : password
            };
            User.query(query).then(function(user){
                $scope.notFound = false;
                if(user[0]){
                    var curUser = user[0];

                    curUser.remember = rememberMe;
                    assignCurrentUser(curUser);
                    if(rememberMe) {
                        $cookies.putObject('angularCookieKeyUsrObj', curUser);
                    }
                    var appQuery = {
                        "nome": user.grupoPrincipal
                    }
                    Grupo.query(appQuery).then(function(grupos){
                        if(grupos[0]){
                            $cookies.putObject("grupoPrincipal", grupos[0]);
                        }
                    });
                    $state.go('welcome');
                } else {
                    $scope.notFound = true;
                }
            });
        };
    }]);