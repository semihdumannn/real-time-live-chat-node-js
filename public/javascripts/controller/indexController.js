app.controller('indexController', [ '$scope', 'indexFactory', ($scope, indexFactory) => {
    //const socket = io.connect('');

    $scope.messages = [ ];

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

                socket.on('newUser', ( data ) => {
                   // console.log(data);
                    const messageData = {
                      type : 0 , // info
                      username : data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.$apply();
                });
            })
            .catch( ( err ) => {
                console.log(err);
            });
    }
}]);