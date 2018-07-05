app.controller('indexController', [ '$scope', 'indexFactory', ($scope, indexFactory) => {
    //const socket = io.connect('');

    $scope.messages = [ ];

    $scope.players= { };

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
                      type : {
                          code : 0, //server or user message
                          message : 1 // login or logout
                      } , // info
                      username : data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.players[data.id] = data;
                    $scope.$apply();
                });

                socket.on('disUser', ( data ) => {
                    const messageData = {
                        type : {
                            code : 0,
                            message : 0
                        },
                        username : data.username
                    };
                    console.log(data);
                    $scope.messages.push(messageData);
                    delete  $scope.players[data.id] ;
                    $scope.$apply();
                } );

                socket.on('initPlayers', ( players ) => {
                    $scope.players = players;
                    $scope.$apply();
                });

                socket.on('animate', ( data ) => {
                    console.log(data);
                    $('#'+data.socketId).animate({ 'left' : data.x, 'top' :data.y});
                    animate = false;
                });


                let animate = false;
                $scope.onClickPlayer = ($event) => {
                  //console.log($event.offsetX);
                    if ( !animate) {
                        let x = $event.offsetX;
                        let y =  $event.offsetY;

                        socket.emit('animate',{ x, y });

                        animate = true;
                        $('#'+socket.id).animate({ 'left' : x, 'top' :y});
                        animate = false;
                    }

                };

                $scope.newMessage = ( ) => {
                    let message = $scope.message;

                    const messageData = {
                        type : {
                            code : 1 //server or user message
                        } ,
                        username : username,
                        text : message
                    };
                    $scope.messages.push(messageData);
                    $scope.message = "";
                };
            })
            .catch( ( err ) => {
                console.log(err);
            });
    }
}]);