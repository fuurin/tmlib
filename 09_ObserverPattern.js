//
// ObserverPattern.js
// Observerパターンを理解しよう！
// 小松
//

var SCREEN_WIDTH    = 680;
var SCREEN_HEIGHT   = 960;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;
var DEFAULT_LABEL_POSITION = SCREEN_CENTER_Y + 200;
 
tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    app.background = "Green";
    app.replaceScene( MainScene() );
    app.run();
});
 
tm.define("MainScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.starSubject = StarSubject();
        this.button = Button(this.starSubject).addChildTo(this);
        this.label = Label(this.starSubject).addChildTo(this);
    },
});





tm.define("Subject", {
    observerArray: [],

    addObserver: function(observer) {
    	this.observerArray.push(observer);
    },

    notify: function () {
    	// 繰り返しの度にlengthを参照すると重くなるので、値を固定しておく。
    	var observer_num = this.observerArray.length;
    	for (var i = 0; i < observer_num; i++) {
    		this.observerArray[i].observe();
    	};
    },

});

tm.define("StarSubject",{
	superClass: "Subject",

	isHigh: false,

	// 「高い」の基準はサブジェクトが知っている
	checkHeight: function (starHeight) {
		this.isHigh = starHeight <= SCREEN_CENTER_Y;
	},

	getIsHigh: function () {
		return this.isHigh;
	},

});





tm.define("Button", {
    superClass: "tm.display.StarShape",

    init: function (subject) {
        this.superInit();
        this.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.setInteractive(true);
        
        // 互いが互いを持つ
        this.subject = subject;
        subject.addObserver(this);
    },

    observe: function () {
    	// Getメソッド…直接参照するのと、どっちが良い？ もっといい方法ある？
	    if( this.subject.getIsHigh() )
        {
    		this.bigBang();        
        };
    },

    bigBang: function () {
    	this.setSize(200, 200);
    },

    onpointingstart: function () {
    	this.subject.notify();
    },

});

tm.define("Rect", {
	superClass: "tm.display.RectangleShape",

	init: function () {
		this.superInit();
		this.setPosition(SCREEN_CENTER_X, DEFAULT_LABEL_POSITION + 30);
	},
});

tm.define("Label", {
    superClass: "tm.app.Label",

    init: function  (subject) {
        this.superInit("Star");
        this.setPosition(SCREEN_CENTER_X, DEFAULT_LABEL_POSITION);

        // 互いが互いを持つ
        this.subject = subject;
        subject.addObserver(this);
    },

    observe: function () {
    	this.rise();

    	// このオブザーバは、「高い」の基準は知らない。
    	this.subject.checkHeight(this.y);
    },

    rise: function () {
        this.y -= 10;
    },

});