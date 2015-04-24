//
//　マクロ
//
var RESOURCE = "resource/avoid/";

var SCREEN_WIDTH = 960;
var SCREEN_HEIGHT = 640;
var PLAYER_WIDTH = 20;
var PLAYER_HEIGHT = 16;

//結果画面のパラメータ
var RESULT_PARAM = {
	score : 256,
	msg : 		"【避けゲー製作チュートリアル】"	,
	hashtags : 	["omatoro", "tmlibチュートリアル"],
	url: 		"http://omatoro.github.io/tmlib.js_tutorial_avoidgame/",
	width : 	SCREEN_WIDTH,
	height : 	SCREEN_HEIGHT,
	related : 	"tmlib.js Tutrial testcording",
};

//MainScene用ラベル、UIデータとして、フォントなどを一括設定できる。
var UI_DATA = {
    main: { 
        children: [{
            type: "Label",
            name: "timeLabel",
            x: 200,
            y: 120,
            width: SCREEN_WIDTH,
            fillStyle: "white",
            // text: "残り時間を表示する",
            text: " ",
            fontSize: 40,
            align: "left"
        }]
    }
};

//リソース
var ASSETS = {
    "backMap":  RESOURCE　+ "map.png",
    "player": 	RESOURCE + "Chicken.png",
    "playerSS": RESOURCE + "playerSS.tmss",
}

//
// メイン
//
tm.main(function() {
	var app = tm.app.CanvasApp("#world");	//キャンバス作成、キーを設定
	app.resize(SCREEN_WIDTH,SCREEN_HEIGHT);	//画面サイズ設定
	app.fitWindow();						//画面リサイズに対応
	app.background = "rgb(0, 0, 0)";		//背景色をセット

	//ロード画面も用意されている。
	//ひよこが転がる
	var loadingScene = tm.app.LoadingScene({
		assets: ASSETS,			//ロード画面でロードしたいリソース（アセット）
		nextScene: "TitleScene",//ロードが終わった後のシーンを設定できる！
		width: SCREEN_WIDTH,	//ロード画面の横幅
		height: SCREEN_HEIGHT,	//ロード画面の高さ
	});

	//loadingScene経由でTitleSceneに移る
	app.replaceScene(loadingScene);

	//tmlib実行⇒何してるの？
	app.run();
});



//
// タイトルスクリーン
//
//シーンはこのように、クラスを作るように作成する。
tm.define("TitleScene", {
	//
	//継承部
	//

	//あらかじめ用意されているタイトルシーンクラス
	superClass : "tm.app.TitleScene",



	//
	//メソッド記述部
	//

	//initという名前のメソッドは、コンストラクタになる。
	init : function() {
		//さらに、this.superInitメソッドを参照すると、継承元のコンストラクタを呼び出せる。
		//スーパークラスで定義されているメソッドをサブクラスで定義し直す⇒「オーバーライド」
		this.superInit({
			title : "避けゲー製作チュートリアル",	//画面中央に表示するタイトル
			width : SCREEN_WIDTH,		
			height : SCREEN_HEIGHT,
		});

		//画面をタッチしたとき、addEventListener関数が動く。
		//
		//この関数もオーバーライド。tm.app.TitleSceneに用意されており、継承で利用できるようになっている。
		//pointingendという文字列を渡すと、タッチを離したときにイベントが発生する。
		//thisはこのシーンそのものなので、画面全体のどこでも、タッチすると、イベントが発生する。
		this.addEventListener("pointingend", function(e){
			//eとは、おそらくイベントが発生したオブジェクト。
			//すなわちtm.main?なので、そのメソッドを使って、シーンをMainSceneに遷移させる
			e.app.replaceScene(MainScene());
		});
	},
});



//
// メインシーン
//
tm.define("MainScene", {
	//あらかじめ用意されている通常シーンクラス:
	superClass : "tm.app.Scene",

	init : function() {
		//スーパークラスのコンストラクタを使うだけ
		this.superInit();

		//Mapオブジェクト生成
		//ロードしたアセットから、連想配列のキーと、サイズを渡して選択し、このシーンが持つオブジェクトとして追加する。
		//spriteとは、図形と背景を別々に扱う技術のこと。
		//addChildされた時点で、(0,0)点に表示される。
		this.map = tm.app.Sprite("backMap", SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
		
		//マップオブジェクトの位置を中央に揃える。（やらないと左上に表示される）
		this.map.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);

		//プレーヤーは、下にある自作のクラスを使ってオブジェクトを作成する。
		this.player = Player().addChildTo(this);
		this.player.position.set(150,600);

		//設定したラベルを表示。
		//なぜJSONなのか？
		this.fromJSON(UI_DATA.main);

		//　タイトル同様、タッチしたら画面が遷移する。
    	this.addEventListener("pointingend", function(e) {
        	e.app.replaceScene(EndScene());
    	});
	},
});



//
//終了シーン
//
tm.define("EndScene", {

	//あらかじめ用意されている結果シーンクラス
	//Twitterへの投稿処理や、戻るボタンが組み込まれているらしい。
	superClass : "tm.app.ResultScene",

	init : function() {
		//パラメータをクラスにまとめたものを渡しても良い。
		this.superInit(RESULT_PARAM);
	},

	// Backボタンを押したらTitleSceneに戻る
	//こちらは、イベントリスナーではなく、メソッド。
	//targetとは？
	onnextscene: function (e) {
    	e.target.app.replaceScene(TitleScene());
	},
});



//
//プレーヤークラス
//
tm.define("Player",{
	//AnimationSpriteクラス：
	superClass: "tm.app.AnimationSprite",

	init: function(){
		this.superInit("playerSS", PLAYER_WIDTH*4, PLAYER_HEIGHT*4);
		this.gotoAndPlay("left");
	},
});