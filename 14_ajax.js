/*
 * main.js
 */
 
/*
 * macro
 */
var SCREEN_WIDTH    = 680;              // スクリーン幅
var SCREEN_HEIGHT   = 960;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分

/*
 * main
 */
tm.main(function() {
	// アプリケーションセットアップ
	var app = tm.app.CanvasApp("#world");       // 生成
	app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);    // サイズ(解像度)設定
	app.fitWindow();                            // 自動フィッティング有効
	app.background = "rgba(0, 0, 0, 1.0)";      // 背景色
 
	app.replaceScene( GameScene() );    // シーン切り替え


	tm.dom.Element("#button").event.add("click", function() {
		/* load関数に以下の引数を与えることで、Ajax通信が可能となる
		var AJAX_DEFAULT_SETTINGS = {
			type :"GET",
			async: true,
			data: null,
			contentType: 'application/x-www-form-urlencoded',
			dataType: 'text',
			responseType: '', // or 'arraybuffer'
			username: null,
			password: null,
			success : function(data){ alert("success!!\n"+data); },
			error   : function(data){ alert("error!!"); },
			beforeSend: null,
		};
		*/

		var params = {
			type: "POST",
			data: {name: "TUAS"},
			url: "14_ajax.php",
		}

		tm.util.Ajax.load(params);
	});

	// 実行
	app.run();
});
 
/*
 * ゲームシーン
 */
tm.define("GameScene", {
	superClass: "tm.app.Scene",
 
	init: function() {
		this.superInit();
	},
});