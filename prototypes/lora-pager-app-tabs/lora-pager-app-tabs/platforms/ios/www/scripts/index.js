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
        
    };

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

    // Populate the database
    //
    function populateDB(tx) {
        tx.executeSql('DROP TABLE IF EXISTS DEMO');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    }

    // Transaction error callback
    //
    function errorCB(tx, err) {
        console.log("Error processing SQL: " + err);
    }

    // Transaction success callback
    //
    function successCB() {
        console.log("success!");
    }

    angular.module('app', ['onsen']);

    angular.module('app').controller('AppController', function ($scope) {

        //$scope.db = window.openDatabase("abby.pager.app", "1.0", "Abby Pager App Database", 1000000);
        //$scope.db.transaction(populateDB, errorCB, successCB);

        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            $scope.localStorage = localStorage;
        } else {
            // Sorry! No Web Storage support..
            $scope.localStorage = null;
        }

        $scope.messages = [
            { id: "000018", sender: "me", recipient: "dana", data: "sa-mi spui cand pleci", time: "12/02/2016 18:12:12", read: false, replied: false },
            { id: "000017", sender: "dana", recipient: "me", data: "am plecat", time: "12/02/2016 18:22:31", read: false, replied: false },
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

        $scope.currentPage = localStorage.getItem("currentPage");

        $scope.currentMessage = $scope.messages[0];
        $scope.chats = {};        

        // sort messages in chats
        $scope.messages.slice().reverse().forEach(function (message) {

            var chat;
            var chatOwner;
            var myMessage = (message.sender === "me");

            if (myMessage) {
                chat = $scope.chats[message.recipient];
                chatOwner = message.recipient;
            } else {
                chat = $scope.chats[message.sender];
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
                $scope.chats[message.sender] = chat;
            } else {
                $scope.chats[message.recipient] = chat;
            }
        });        
        
        $scope.currentChat = $scope.chats[0];

        //$scope.chats = Object.keys($scope.chats).map(function (k) { return obj[k] }).slice().reverse();

        $scope.getLastMessage = function (chat) {
            //return chat.messages[chat.messages.length - 1];
            return chat.messages[0];
        }

        $scope.getMessageColor = function (message) {
            return message.sender === 'me' ? 'green' : 'gray';
        }


        $scope.isActive = function (page) {
            if (page === "home.html") {
                return "true";
            } else {
                return "false";
            }
        }

        $scope.selectPage = function (mainNavigator, page) {
            mainNavigator.pushPage(page, { animation: 'slide' });
        }

        $scope.getMessageBubbleClass = function (message) {
            if (message.sender === "me") {
                return "me";
            } else {
                return "you";
            }
        }

        $scope.sendMessage = function (chat) {
            //ons.notification.alert({ message: 'new message' });
        }

        $scope.newMessage = function () {
            ons.notification.alert({ message: 'new message' });
        };

        $scope.readMessage = function (message,navigator) {            
            $scope.currentMessage = message;
            $scope.currentMessage.navigator = navigator;
            navigator.pushPage('readmessage.html', { animation: 'slide' });
        };

        $scope.readChat = function (chat, navigator) {
            $scope.currentChat = chat;
            $scope.currentChat.navigator = navigator;
            navigator.pushPage('readchat.html', { animation: 'slide' });
        };

        $scope.markMessageAsRead = function () {
            $scope.currentMessage.read = true;
            $scope.currentMessage.navigator.popPage();
        };

        $scope.replyToMessage = function () {
            $scope.currentMessage.replied = true;
            $scope.currentMessage.navigator.popPage();
        };

        $scope.terms = function (navigator) {
            navigator.pushPage('terms.html', { animation: 'slide' });
        };

        $scope.privacy = function (navigator) {
            navigator.pushPage('privacy.html', { animation: 'slide' });
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

} )();