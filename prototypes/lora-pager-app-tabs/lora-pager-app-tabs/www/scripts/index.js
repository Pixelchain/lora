// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

        // Get contacts
        //navigator.contacts.find([navigator.contacts.fieldType.displayName],gotContacts,errorHandler);

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
        for (var i = 0, len = c.length; i < len; i++) {
            console.dir(c[i].displayName);
        }
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

    var myApp = angular.module('app', ['onsen']);

    myApp.messages = [
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
        { id: "000010", sender: "daria", recipient: "me", data: "da", time: "13/02/2016 18:22:56", read: false, replied: false },
        { id: "000010", sender: "me", recipient: "daria", data: "ok", time: "13/02/2016 18:23:34", read: false, replied: false }
    ];

    myApp.currentMessage = myApp.messages[0];
    myApp.chats = {};
    myApp.updateChats = function () {        
        // sort messages in chats
        myApp.chats = {};
        myApp.messages.slice().reverse().forEach(function (message) {
            var chat;
            var chatOwner;
            var myMessage = (message.sender === "me");

            if (myMessage) {
                chat = myApp.chats[message.recipient];
                chatOwner = message.recipient;
            } else {
                chat = myApp.chats[message.sender];
                chatOwner = message.sender;
            }

            if (chat === undefined) {
                chat = {};
                chat.messages = [];
                chat.myMessages = [];
            }
            chat.messages.push(message);
            chat.sender = chatOwner;
            chat.time = message.time;
            if (!myMessage) {
                myApp.chats[message.sender] = chat;
            } else {
                myApp.chats[message.recipient] = chat;
            }
        });
    };

    myApp.sendMessage = function (chat, messageText) {
        var message = { id: "000010", sender: "me", recipient: chat.sender, data: messageText, time: formatDate(new Date()), read: false, replied: false };
        myApp.messages.push(message);
        chat.messages.unshift(message);
        //myApp.updateChats();
    };

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
        
        $scope.app = myApp;                

        $scope.getLastMessage = function (chat) {
            return chat.messages[0];
        }

        $scope.getMessageColor = function (message) {
            return message.sender === 'me' ? 'green' : 'gray';
        }

        $scope.getMessageBubbleClass = function (message) {
            if (message.sender === "me") {
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
            myApp.sendMessage(chat, inputValue);
            $scope.currentInput = "";
            //$('ons-list > .ons-scroller__content').scrollTop(100);
            $("#last-item").height(50 + (inputValue.length / 44) * 18);
            $('.page__content').scrollTo("#last-item", 500);
        }
    });

} )();