//プロパティ
var SCREEN_WIDTH	= 465;
var SCREEN_HEIGHT	= 465;
var SCREEN_CENTER_X	= SCREEN_WIDTH / 2;
var SCREEN_CENTER_Y	= SCREEN_HEIGHT / 2;
var ASSETS = {
    "player": "http://jsrun.it/assets/s/A/3/j/sA3jL.png",
    "bg": "http://jsrun.it/assets/a/G/5/Y/aG5YD.png",
};

//main
tm.main(function() {
	var app = tm.display.CanvasApp("#world");
	app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
	app.fitWindow();

	//画像を読み込む
	var loading = tm.ui.LoadingScene({
		assets: ASSETS,
		width: 1330,
		height:　SCREEN_HEIGHT,
	});

	//読み込み完了後に呼ばれるメソッド、onload
	//loadingは小文字
	loading.onload = function() {
		var scene = MainScene();
		app.replaceScene(scene);
	};

	//ローディングシーンに入れ替える
	app.replaceScene(loading);

	app.run();
});

//シーンを定義
tm.define("MainScene", {
	superClass: "tm.app.Scene",

	init: function()　{
		this.superInit();

		//assetsで指定したキーを指定することで画像を表示

		//背景,appChildではなく、addChild
		this.bg = tm.display.Sprite("bg").addChildTo(this);
		this.bg.origin.set(0, 0);

		//プレーヤー
		this.player = tm.display.Sprite("player").addChildTo(this);
		this.player.setPosition(400, 400).setScale(1, 1);
	},

	update: function(app){
		//キーボード
		var key = app.keyboard;

		//左矢印キーを押しているか判定
		if(key.getKey("left"))
		{
			this.player.x -= 8;
			this.player.scaleX = 1;
		}

		//右矢印キーを押しているか判定
		if(key.getKey("right"))
		{
			this.player.x += 8;
			this.player.scaleX = -1;
		}

		if(key.getKey("space"))
		{
			this.player.y = 200; 
		}

		if(this.player.y<400)
		{
			this.player.y += 5;
		}

		if(this.player.y>400)
		{
			this.player.y = 400;
		}
	}

});