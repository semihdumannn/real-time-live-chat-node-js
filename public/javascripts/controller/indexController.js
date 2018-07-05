app.controller('indexController', [ '$scope', 'indexFactory', ($scope, indexFactory) => {
    //const socket = io.connect('');

    $scope.init = ( ) => {
        const username = prompt('Please enter username ');

        if (username)
                initSocket(username);
        else
            return false;
    };

    function initSocket(username) {
        const  connectionOptions = {
            reconnectionAttempts : 3,
            reconnectionDelay : 600
        };
        indexFactory.connectSocket('http://localhost:3000',connectionOptions)
            .then( ( socket ) => {
                socket.emit('new-user',{ username });
                //console.log('Use connected' , socket);
            })
            .catch( ( err ) => {
                console.log(err);
            });
    }
}]);