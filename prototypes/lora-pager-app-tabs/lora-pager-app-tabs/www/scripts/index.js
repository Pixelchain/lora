// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    document.contacts = [];

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        //navigator.contacts.find([navigator.contacts.fieldType.displayName], gotContacts, errorHandler);        

        // File API
        //console.log(cordova.file);

        //checkScope();
        
    };

    //function checkScope() {
    //    var element = document.querySelector(".navigator-container");
    //    var scope = angular.element(element).scope();
    //    if (scope && scope.getCurrentNavigatorItem && scope.getCurrentNavigatorItem()) {
    //        scope.pushPage("about.html");
    //    } else {
    //        setTimeout(checkScope, 100);
    //    }
    //}

    function errorHandler(e) {
        console.log("errorHandler: " + e);
    }

    function gotContacts(c) {
        console.log("gotContacts, number of results " + c.length);
        var contacts = [];
        for (var i = 0, len = c.length; i < len; i++) {
            contacts.push(c);            
        }
        document.contacts = contacts;
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    //// Populate the database
    ////
    //function populateDB(tx) {
    //    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    //    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    //    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    //    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    //}

    //// Transaction error callback
    ////
    //function errorCB(tx, err) {
    //    console.log("Error processing SQL: " + err);
    //}

    //// Transaction success callback
    ////
    //function successCB() {
    //    console.log("success!");
    //}
     
    //mqtt

    

    var myApp = angular.module('app', ['onsen']);

    myApp.topic = "/pager.abby.pixelchain.com";
    myApp.userId = "";
    myApp.userSession = generateUUID();
    
    document.contacts.push(
        { displayName: "dan", userId : "dan" },
        { displayName: "daria", userId : "daria"},
        { displayName: "dana" , userId : "dana" },
        { displayName: "bogdan", userId : "bogdan" }
        );
    console.log(myApp.userId);

    /*****************************************************************/
    // MQTT
    /*****************************************************************/
    // called when the client connects
    myApp.onConnect = function () {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");        
        myApp.client.subscribe(myApp.topic);
        var message = myApp.buildMyMessage("all", "Hello!");
        myApp.sendMQTTMessage(message, myApp.topic);
    }

    myApp.sendMQTTMessage = function (message) {
        var message = new Paho.MQTT.Message(message);
        message.destinationName = myApp.topic;
        myApp.client.send(message);
    }

    // called when the client loses its connection
    myApp.onConnectionLost = function (responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }

    // called when a message arrives
    myApp.onMessageArrived = function (message) {
        console.log("onMessageArrived:" + message.payloadString);
        myApp.receiveMessage(message.payloadString);
    }

    myApp.client = new Paho.MQTT.Client("broker.mqttdashboard.com", 8000, myApp.userSession);

    // set callback handlers
    myApp.client.onConnectionLost = myApp.onConnectionLost;
    myApp.client.onMessageArrived = myApp.onMessageArrived;

    // connect the client
    myApp.client.connect({ onSuccess: myApp.onConnect });

    /*****************************************************************/
    // MQTT
    /*****************************************************************/

    myApp.getContacts = function () {
        return document.contacts;
    }

    myApp.createNewChat = function (userId) {
        var chat = {};
        chat.messages = [];
        chat.partner = userId;
        return chat;
    }

    myApp.updateChats = function () {
        // sort messages in chats
        myApp.chats = {};
        myApp.messages.slice().reverse().forEach(function (message) {
            var chat;
            var chatOwner;
            var isMe = (message.sender === myApp.userId);
            if (isMe) {
                chat = myApp.chats[message.recipient];
                chatOwner = message.recipient;
            } else {
                chat = myApp.chats[message.sender];
                chatOwner = message.sender;
            }        

            if (chat === undefined) {
                chat = myApp.createNewChat(chatOwner);
            }            
            chat.partner = chatOwner;
            chat.time = message.time;
            chat.messages.push(message);

            if (!isMe) {
                myApp.chats[message.sender] = chat;
            } else {
                myApp.chats[message.recipient] = chat;
            }            
        });
    };

    myApp.addChat = function (chat, message) {
        var isMe = (message.sender === myApp.userId);
        if (!isMe) {
            myApp.chats[message.sender] = chat;
        } else {
            myApp.chats[message.recipient] = chat;
        }
    }


    myApp.buildMyMessage = function (recipientUserId, messageText) {
        return { id: generateUUID(), sender: myApp.userId, recipient: recipientUserId, data: messageText, time: formatDate(new Date()), read: false, replied: false };
    }

    myApp.sendMessage = function (chat, messageText) {
        //var message = { id: "000010", sender: myApp.userId, recipient: chat.partner, data: messageText, time: formatDate(new Date()), read: false, replied: false };        
        var message = myApp.buildMyMessage(chat.partner, messageText);
        myApp.messages.push(message);
        chat.messages.unshift(message);
        myApp.sendMQTTMessage(JSON.stringify(message));
        //myApp.updateChats();
    };

    myApp.getChatOfReceivedMessage = function (message) {

        for (var propertyName in myApp.chats) {
            // propertyName is what you want
            // you can get the value like this: myObject[propertyName]
            var chat = myApp.chats[propertyName];
            //if ((message.recipient === chat.partner) || (message.sender === chat.partner)) {
            if (message.sender === chat.partner) {
                return chat;
            }
        }
        return null;
    }

    myApp.receiveMessage = function (json) {
        try {
            var message = eval("("+json+")");
            myApp.messages.push(message);
            var chat = myApp.getChatOfReceivedMessage(message);
            if (chat !== null) {
                if (chat.messages[0].id !== message.id) {
                    chat.messages.unshift(message);
                } else {
                    // flag as read
                    chat.messages[0].read = true;
                }
            }
            myApp.scope.$apply();
            myApp.scrollToEnd(message.data);        
        } catch (err) {
            console.log(err);
        }
    }

    myApp.chatWith = function (contact) {
        var chat = myApp.createNewChat(contact.userId);        
        myApp.currentChat = chat;

        var message = myApp.buildMyMessage(chat.partner, "Hello!");
        myApp.messages.push(message);
        chat.messages.unshift(message);
        myApp.addChat(chat,message);                
        myApp.sendMQTTMessage(JSON.stringify(message));

        myApp.currentNavigator.pushPage('readchat.html', { animation: 'slide' });

    }

    myApp.scrollToEnd = function (lastMessage) {
        if (lastMessage === undefined) return;
        $("#last-item").height(50 + (lastMessage.length / 44) * 10);
        $('.page__content').scrollTo("#last-item", 500);        
    }

    myApp.messages = [   
    /*   
            { id: "000018", sender: "me", recipient: "dana", data: "sa-mi spui cand pleci", time: "12/02/2016 18:12:12", read: false, replied: false },
            { id: "000017", sender: "dana", recipient: "me", data: "am plecat", time: "12/02/2016 18:22:31", read: true, replied: true },
            { id: "000016", sender: "dana", recipient: "me", data: "tu cand ajungi acasa?", time: "12/02/2016 18:23:15", read: false, replied: false },
            { id: "000016", sender: "me", recipient: "dana", data: "in 10 minute", time: "12/02/2016 18:25:04", read: false, replied: false },
            { id: "000016", sender: "dana", recipient: "me", data: "sa o scoti pe pina afara", time: "12/02/2016 18:28:56", read: false, replied: false },
            { id: "000015", sender: "me", recipient: "bogdan", data: "vii la cafea?", time: "13/02/2016 16:12:45", read: false, replied: false },
            { id: "000014", sender: "bogdan", recipient: "me", data: "hai ca vin", time: "13/02/2016 16:14:33", read: false, replied: false },
            { id: "000013", sender: "bogdan", recipient: "me", data: "pun zaharul...", time: "13/02/2016 17:55:12", read: false, replied: false },
            { id: "000012", sender: "bogdan", recipient: "me", data: "de ce nu vii?", time: "13/02/2016 17:56:19", read: false, replied: false },
            { id: "000011", sender: "me", recipient: "bogdan", data: "sorry... sunt acasa deja :(", time: "13/02/2016 17:56:45", read: false, replied: false },
            { id: "000010", sender: "bogdan", recipient: "me", data: "ok, vorbim maine", time: "13/02/2016 17:58:59", read: false, replied: false },
            { id: "000010", sender: "daria", recipient: "me", data: "tata?", time: "13/02/2016 18:12:06", read: false, replied: false },
            { id: "000010", sender: "me", recipient: "daria", data: "da?", time: "13/02/2016 18:13:09", read: false, replied: false },
            { id: "000010", sender: "daria", recipient: "me", data: "esti acasa?", time: "13/02/2016 18:14:12", read: false, replied: false },
            { id: "000010", sender: "me", recipient: "daria", data: "da... tu unde esti?", time: "13/02/2016 18:15:16", read: false, replied: false },
            { id: "000010", sender: "daria", recipient: "me", data: "la Diana", time: "13/02/2016 18:16:22", read: false, replied: false },
            { id: "000010", sender: "me", recipient: "daria", data: "cand vii acasa?", time: "13/02/2016 18:17:31", read: false, replied: false },
            { id: "000010", sender: "daria", recipient: "me", data: "in 10 minute", time: "13/02/2016 18:18:33", read: false, replied: false },
            { id: "000010", sender: "me", recipient: "daria", data: "ok. te astept. ai cheie ca eu ies cu Pina", time: "13/02/2016 18:20:24", read: false, replied: false },
            { "id": "000010", "sender": "daria", "recipient": "me", "data": "da", "time": "13/02/2016 18:22:56", "read": false, "replied": false },
            { id: "000010", sender: "me", recipient: "daria", data: "ok", time: "13/02/2016 18:23:34", read: false, replied: false }
            */
        ];

    myApp.currentMessage = myApp.messages[0];
    myApp.chats = {};

    myApp.updateChats();
    myApp.currentChat = myApp.chats[0];

    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        myApp.localStorage = localStorage;
    } else {
        // Sorry! No Web Storage support..
        myApp.localStorage = null;
    }

    myApp.controller('AppController', function ($scope) {
        
        myApp.scope = $scope;
        $scope.app = myApp;

        $scope.isNotMe = function (message) {
            return (message.sender !== myApp.userId);
        }

        $scope.getLastMessage = function (chat) {
            return chat.messages[0];
        }

        $scope.getMessageColor = function (message) {
            return message.sender === 'me' ? 'green' : 'gray';
        }

        $scope.getMessageBubbleClass = function (message) {
            if (message.sender === myApp.userId) {
                return "me";
            } else {
                return "you";
            }
        }

        $scope.newMessage = function () {
            ons.notification.alert({ message: 'new message' });
        };

        $scope.setMainNavigator = function (navigator) {
            myApp.mainNavigator = navigator;
        };

        $scope.setCurrentNavigator = function (navigator) {
            myApp.currentNavigator = navigator;
        };      

        $scope.readMessage = function (message) {
            myApp.currentMessage = message;
            myApp.currentNavigator.pushPage('readmessage.html', { animation: 'slide' });
        };

        $scope.scrollToEnd = function () {
            myApp.scrollToEnd();
        }

        $scope.readChat = function (chat) {
            myApp.currentChat = chat;            
            myApp.currentNavigator.pushPage('readchat.html', { animation: 'slide' });            
        };

        $scope.markMessageAsRead = function () {
            myApp.currentMessage.read = true;
            myApp.currentNavigator.popPage();
        };

        $scope.replyToMessage = function () {
            myApp.currentMessage.replied = true;
            myApp.currentNavigator.popPage();
        };

        $scope.terms = function (navigator) {
            myApp.currentNavigator.pushPage('terms.html', { animation: 'slide' });
        };

        $scope.privacy = function (navigator) {
            myApp.currentNavigator.pushPage('privacy.html', { animation: 'slide' });
        };

        $scope.signout = function () {
            ons.notification.alert({ message: 'signout' });
        };

        $scope.signin = function () {
            ons.notification.alert({ message: 'signin' });
        };

        $scope.doSomething = function () {
            ons.notification.alert({ message: 'tapped' });
        };        

        $scope.dialogs = {};
        $scope.show = function (dlg) {
            if (!$scope.dialogs[dlg]) {
                ons.createDialog(dlg).then(function (dialog) {
                    $scope.dialogs[dlg] = dialog;                    
                    dialog.show();
                });
            } else {
                $scope.dialogs[dlg].show();
            }
        }

    });

    myApp.controller('readChatController', function ($scope) {
        $scope.sendMessage = function (chat, inputValue) {
            if (inputValue.toString().trim() === "") {
                return;
            }
            myApp.sendMessage(chat, inputValue);
            $scope.currentInput = "";            
            //$('.page__content').scrollTo("#last-item", 500);            
            myApp.scrollToEnd(inputValue);
        }
    });

    myApp.controller('userIdController', function ($scope) {
        $scope.app = myApp;
        $scope.userId = myApp.userId;        
        $scope.setUserId = function (newUserId) {
            myApp.userId = newUserId;
            myApp.messages =
                [                    
                ];
            myApp.updateChats();
        };        
        //$scope.sendMessage = function (chat, inputValue) {
        //    if (inputValue.toString().trim() === "") {
        //        return;
        //    }
        //    myApp.sendMessage(chat, inputValue);
        //    $scope.currentInput = "";
        //    //$('.page__content').scrollTo("#last-item", 500);            
        //    myApp.scrollToEnd(inputValue);
        //}
    });

} )();