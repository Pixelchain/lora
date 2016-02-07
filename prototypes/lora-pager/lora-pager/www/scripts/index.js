// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";


    function SetInnerHtmlById(elementId, html) {
        var element = document.getElementById(elementId);
        element.innerHTML = html;
    }

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
    };

    // onSuccess Geolocation
    //
    function onSuccessGeolocation(position) {
        return;
        var element = document.getElementById('geolocation');
        element.innerHTML = 'LAT : ' + position.coords.latitude + '<br />' +
                            'LONG: ' + position.coords.longitude + '<br />' +
                            //'ALT: ' + position.coords.altitude + '<br />' +
                            //'ACC: ' + position.coords.accuracy + '<br />' +
                            //'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
                            //'Heading: ' + position.coords.heading + '<br />' +
                            //'Speed: ' + position.coords.speed + '<br />' +
                            'TIME: ' + NiceTimestamp(position.timestamp) + '<br />';
    }

    // onError Callback receives a PositionError object
    //
    function onErrorGeolocation(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };


    function NiceTimestamp(domTimeStamp) {

        var d = new Date(domTimeStamp);
        var hours = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            year = d.getFullYear() % 100;

        function pad(d) {
            return (d < 10 ? "0" : "") + d;
        }

        var formattedDate = pad(hours) + ":"
                          + pad(minutes) + ":"
                          + pad(seconds) + " "
                          + pad(month) + "-"
                          + pad(day) + "-"
                          + pad(year);
        return formattedDate;
    }

})();


$(document).ready(function () {
  
    var app = {
        title: "LoRa Pager",
        pageIndex: 0,
        items: [
                    {
                        title: "Chat",
                        menuIndex: 0,
                        enterFunction: "Reply",
                        items: [
                            { type: "chat", time: "22:10", sender: "Dana", message: "Comming Home", status : "" },
                            { type: "chat", time: "22:09", sender: "$me", message: "Where are you?", status: "Read" }
                        ]
                    },
                    {
                        title: "Send",
                        menuIndex: 0,
                        enterFunction : "Send",
                        items: [
                        { type: "send", message : "Where are you?"},
                        { type: "send", message: "Call me ASAP" },
                        { type: "send", message: "I'll be late"},
                        { type: "send", message: "Comming Home" }
                        ]
                    },
                    {
                        title: "Modes",
                        menuIndex: 0,
                        enterFunction: "Set",
                        items: [
                        { type: "mode", message: "Walkie Talkie" },
                        { type: "mode", message: "Gateway" },
                        { type: "mode", message: "Tracking" },
                        { type: "mode", message: "Antiteft" },
                        { type: "mode", message: "S.O.S." }
                        ]
                    },
                    {
                        title: "Settings",
                        menuIndex: 0,
                        enterFunction: "Set",
                        items: [
                        { type: "setting", message: "Time" },
                        { type: "setting", message: "Sync Time from GPS" },
                        { type: "setting", message: "Pair" }
                        ]
                    }
        ],
        nextPage: function () {
            this.pageIndex++;
            if (this.pageIndex >= this.items.length) {
                this.pageIndex = 0;
            }
        },
        prevPage: function () {
            this.pageIndex--;
            if (this.pageIndex < 0) {
                this.pageIndex = this.items.length-1;
            }
        },
        nextMenu: function () {
            this.getCurrentPage().menuIndex++;
            if (this.getCurrentPage().menuIndex >= this.getCurrentPage().items.length) {
                this.getCurrentPage().menuIndex = 0;
            }
        },
        prevMenu: function () {
            this.getCurrentPage().menuIndex--;
            if (this.getCurrentPage().menuIndex < 0 ) {
                this.getCurrentPage().menuIndex = this.getCurrentPage().items.length - 1;
            }
        },
        getCurrentPage: function () {
            return this.items[this.pageIndex];
        },
        getPageByName: function (pageName) {
            for (var item in this.items) {
                if (this.items[item].title === pageName) {
                    return this.items[item];
                }
            }
            return null;
        },
        getCurrentMenuItems: function () {
            var page = this.getCurrentPage();
            return page.items;
        },
        getCurrentPageIndex: function () {
            return this.pageIndex;
        },        
        getCurrentMenuIndex: function () {
            var page = this.getCurrentPage();
            return page.menuIndex;
        }
    };

    function GetCurrentPageMenuHtml(app) {
        var page = app.getCurrentPage();
        var menuItems = app.getCurrentMenuItems();
        var currentMenuIndexOfPage = app.getCurrentMenuIndex();
        var index = 0;
        var html = "";

        for (var item in menuItems) {
            var msg = menuItems[item];
            var status = "";
            var align = "";
            var senderName = "";
            var message = "";

            if (msg.type === "chat") {
                if (msg.sender === "$me") {
                    align = "me";
                    senderName = "ME";
                    status = " [" + msg.status + "]";
                } else {
                    align = "other'";
                    senderName = msg.sender;
                }
                message = "<div class='"+align+"'>" + msg.message + status + "<br>" + msg.time + " " + senderName+"</div>";
            } else {
                message = msg.message;
            }

            if (index === currentMenuIndexOfPage) {
                html += "<li class='invert'>" + message +"</li>";
            } else {
                html += "<li>" + message + "</li>";
            }
            index++;
        }

        if (index === 0) {
            html += "<li>[Empty]</li>";
        }

        return html;
    }

    function UpdateGui() {
        $("#menu").html(GetCurrentPageMenuHtml(app));
        $("#title").html(app.getCurrentPage().title);
    }    

    $("#buttons li a").click(function () {
        var direction = $(this).attr('href');
        if (direction === "#up") {
            app.prevMenu();
        }
        if (direction === "#down") {
            app.nextMenu();            
        }
        if (direction === "#left") {
            app.prevPage();
        }
        if (direction === "#right") {
            app.nextPage();
        }
        if (direction === "#enter") {
            var page = app.getCurrentPage();
            if (page.enterFunction === "Send") {
                var msg = { type: "chat", time: getDateTime(), sender: "$me", message: page.items[page.menuIndex].message, status: "Sent" };
                var chatPage = app.getPageByName("Chat");
                chatPage.items.unshift(msg);
            }

            if (page.enterFunction === "Delete") {
                if (page.menuIndex > -1) {
                    page.items.splice(page.menuIndex, 1);
                    if (page.menuIndex >= page.items.length) {
                        page.menuIndex = page.items.length-1;
                    }
                }
            }
        }
        UpdateGui()
    });

    function getDateTime() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (month.toString().length == 1) {
            var month = '0' + month;
        }
        if (day.toString().length == 1) {
            var day = '0' + day;
        }
        if (hour.toString().length == 1) {
            var hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            var minute = '0' + minute;
        }
        if (second.toString().length == 1) {
            var second = '0' + second;
        }
        var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
        return dateTime;
    }

    UpdateGui()
});
