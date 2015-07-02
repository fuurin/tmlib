var SCREEN_WIDTH    = 640;              // スクリーン幅
var SCREEN_HEIGHT   = 960;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分
var ASSETS = {
    "player": "http://jsrun.it/assets/s/A/3/j/sA3jL.png",
    "bg": "http://jsrun.it/assets/a/G/5/Y/aG5YD.png",
};


tm.define("MainScene", {
    superClass: "tm.app.Scene",
    
    init: function() {
        this.superInit();
        var loader = tm.asset.Loader();
        loader.onload = this._init.bind(this);
        //　ローカルのサウンドは使えない！？
        // Chrome→Firefoxで解決,AWS上ならChromeでも大丈夫
        //loader.load({ "sample": "http://phi-jp.github.io/tmlib.simple.js/assets/touch.wav", });
        loader.load({"sample": "./resource/piano/C3.wav"})
    },
    _init: function() {
        var button = tm.ui.FlatButton().addChildTo(this);

        button.x = SCREEN_CENTER_X;
        button.y = SCREEN_CENTER_Y;

        button.onpush = function() {
            tm.sound.SoundManager.play('sample');
        };
    },
});


// main
tm.main(function() {
    // キャンバスアプリケーションを生成
    var app = tm.display.CanvasApp("#world");
    // リサイズ
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    // ウィンドウにフィットさせる
    app.fitWindow();
    
    app.replaceScene(MainScene());

    // 実行
    app.run();
});