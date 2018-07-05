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

    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
        });
    }
    
    function showBubble( id , messsage) {
        $('#'+id).find('.message').fadeIn(1000).html(messsage);

        setTimeout(() => {
            $('#'+id).find('.message').fadeOut(1000);
        },1000);
    }

    async  function initSocket(username) {
        const  connectionOptions = {
            reconnectionAttempts : 3,
            reconnectionDelay : 600
        };
        try {
            const   socket  = await indexFactory.connectSocket('http://localhost:3000',connectionOptions);

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
                scrollTop();
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
                scrollTop();
                $scope.$apply();
            });

            socket.on('animate', ( data ) => {
                console.log(data);
                $('#'+data.socketId).animate({ 'left' : data.x, 'top' :data.y});
                animate = false;
            });

            socket.on('newMessage', (message) => {
                $scope.messages.push(message);
                $scope.$apply();
                showBubble(message.socketId,message.text);
                scrollTop();
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

                socket.emit('newMessage',messageData);
                showBubble(socket.id, message);
                //scrool function
                scrollTop();
            };
        }catch (err) {
            console.log(err);
        }


    }
}]);