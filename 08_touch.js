//ステップ5まで正常動作、SE、BGMを付けるものは、Exampleでは動かない。クライアント側ならいける？
//これのステップ1は、テンプレとして使えそう

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

//ピース
var PIECE_NUM_X		= 5					//ピースの列数
var PIECE_NUM_Y     = 5;                // ピースの行数
var PIECE_NUM       = PIECE_NUM_X*PIECE_NUM_Y;  // ピース数
var PIECE_OFFSET_X  = 90;               // ピースオフセットX　
var PIECE_OFFSET_Y  = 240;              // ピースオフセットY
var PIECE_WIDTH     = 120;              // ピースの幅
var PIECE_HEIGHT    = 120;              // ピースの高さ
var PIECE_GAP_X		= 5;				//　ピースの横の隙間
var PIECE_GAP_Y		= 5;				//　ピースの縦の隙間
var PIECE_FONT_SIZE = 70;				//　ピースのフォントサイズ

//フラットデザイン用フォント
var FONT_FAMILY_FLAT= "'Helvetica-Light' 'Meiryo' sans-serif"; 

//音声取得
function getSounds()
{
    tm.sound.SoundManager.add("bgm", "resource/touch/sound.mp3");
    tm.sound.SoundManager.add("pinponSE", "resource/touch/ok.mp3");
    tm.sound.SoundManager.add("booSE", "resource/touch/ng.mp3");
    tm.sound.SoundManager.add("clearSE", "resource/touch/clear.mp3");
};

/*
 * main
 */
tm.main(function() {
    // アプリケーションセットアップ
    var app = tm.app.CanvasApp("#world");       // 生成
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);    // サイズ(解像度)設定
    app.fitWindow();                            // 自動フィッティング有効
    app.background = "rgba(250, 250, 250, 1.0)";// 背景色
 
    //音声を取得
    getSounds();

    // タイトルを開始
    app.replaceScene( TitleScene() );
 
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

        //bgm再生
        this.bgm = tm.sound.SoundManager.get("bgm");
        this.bgm.loop = true;
        this.bgm.play();

        //　thisは実行するところによって変わってしまうからselfに代入
        var self = this;

        //次に押さなければならない数
        self.currentNumber = 1;

        //ピースグループを作成
        this.pieceGroup = tm.app.CanvasElement();
        this.addChild(this.pieceGroup);

        var nums = [].range(1,PIECE_NUM+1);	//1～25の配列を生成
        nums.shuffle();						//配列をシャッフル


        for (var i = 0; i < PIECE_NUM_Y; i++)
        {
        	for (var j = 0; j < PIECE_NUM_X; j++)
        	{
        		//ピース1つに書かれる値を設定
        		var number = nums[i*PIECE_NUM_X+j];

        		//ピースを生成してピースグループに追加
        		var piece = Piece(number).addChildTo(this.pieceGroup);

        		//現在扱っているピースの座標を設定
        		piece.x = j * (PIECE_WIDTH + PIECE_GAP_X) + PIECE_OFFSET_X;
        		piece.y = i * (PIECE_HEIGHT + PIECE_GAP_Y) + PIECE_OFFSET_Y;

        		//タッチ時のイベントリスナーを登録
        		piece.onpointingstart = function()
        		{
        			//押された番号と押すべき番号が一致したとき実行
        			if(this.number === self.currentNumber)
        			{
        				//最後のピースだった時の処理
        				if (self.currentNumber === PIECE_NUM) 
        				{
                            //クリアSE再生
                            tm.sound.SoundManager.get("clearSE").play();

                            //リザルトシーンに経過時間を渡して移行
                            self.app.replaceScene(ResultScene({
                                time: self.timerLabel.text,
                            }));
        				}

                        //正解SE再生
                        tm.sound.SoundManager.get("pinponSE").play();

                        //正解ピースを押したときの動作
                        this.disable();

                        //インクリメント
                        self.currentNumber += 1;
        			}

                    //不正解SE再生
                    tm.sound.SoundManager.get("booSE").play();
        		};
        	}
        }

        //タイマーラベルの設定
        this.timerLabel = tm.app.Label("").addChildTo(this);
        this.timerLabel
            .setPosition(650, 160)
            .setFillStyle("#444")
            .setAlign("right")
            .setBaseline("bottom")
            .setFontFamily(FONT_FAMILY_FLAT)
            .setFontSize(128);

        //タイトルボタンの設定
        var titleBtn = tm.app.FlatButton({
            width: 300,
            height: 100,
            text: "TITLE",
            bgColor: "#888",
        }).addChildTo(this);
        titleBtn.position.set(180, 880);
        titleBtn.onpointingend = function()
        {
            //タイトルシーンに戻る
            self.app.replaceScene(TitleScene());
        };

        //リスタートボタンの設定
        var restartBtn = tm.app.FlatButton({
            width: 300,
            height: 100,
            text: "RESTART",
            bgColor: "#888",
        }).addChildTo(this);
        restartBtn.position.set(500, 880);
        restartBtn.onpointingend = function()
        {
            self.app.replaceScene(GameScene());
        };
    },

    //このシーンに入った時に行うメソッド
    //カウントダウンシーンを実行する。
    onenter: function(e)
    {
        e.app.pushScene(CountdownScene());
        this.onenter = null;
    },

    //タイマーカウント関数
    //updateメソッドは、1フレームごとの動作を決める
    update: function(app)
    {
        //時間計測
        var time = ((app.frame/app.fps)*1000)|0;
        var timeStr = time + "";

        //正規表現を使って小数点を表示
        this.timerLabel.text = timeStr.replace(/(\d)(?=(\d\d\d)+$)/g, "$1.");
    }
});

//ピースクラス
tm.define("Piece",{
	//Shapeクラスでは、何らかの形を持ったオブジェクトをサポートする。
	superClass: "tm.app.Shape",

	init: function(number)
	{
		//オブジェクトのサイズをコンストラクタで決定
		this.superInit(PIECE_WIDTH, PIECE_HEIGHT);

		//属性に、値を追加
		this.number = number;

		//setInteractiveをtrueにしておくと、
		//pointingstart,pointingmove,pointingendイベントが発行される。
		this.setInteractive(true);

		//当たり判定領域の形を四角形にする。
		this.setBoundingType("rect");

		//0~360の乱数を獲得
		var angle = tm.util.Random.randint(0,360);

		//ピースの色を設定。clearColorで塗りつぶす。
		//直感的で、ハードウェアに依存しにくい
		//HSL(色相Hue、彩度Satuation、輝度Lightness）による設定。
		//Hueは赤⇒、┌緑、└青の角度で色味（土台となる色？）を設定する。
		//彩度は、0％に近づくほど灰色になる。
		//輝度は、100％で白になり、0％で黒になる。50％で純色
		//文字列のformatメソッドで、{}にangleの値が代入される。
		this.canvas.clearColor("hsl({0}, 80%, 70%)".format(angle));

		//ラベルを作成し、張り付ける。
		this.label = tm.app.Label(number).addChildTo(this);
		
		//ラベルの設定
		this.label
			.setFontSize(PIECE_FONT_SIZE)		//サイズ
			.setFontFamily(FONT_FAMILY_FLAT)	//フォントセット
			.setAlign("center")					//縦軸の位置
			.setBaseline("middle");				//横軸の位置
	},

    //正しいピースを押したときの関数
    disable: function() {

        //タッチ判定を無効化
        this.setInteractive(false);

        //! 何のためにやってるの？
        var self = this;

        //複雑なアニメーションをすることができるメソッド
        //このように、連続してメソッドを実行することを、チェーンメソッドという。
        this.tweener
            .clear()                                            //アニメーションタスクをクリア
            .to({scaleX:0}, 100)                                //アニメーション登録、scaleXを100msで0にする
            .call(function() {                                  //これから作成するメソッドを実行
                self.canvas.clearColor("rgb(100, 100, 100)");   //色を灰色に変える
            }.bind(this))                                       //なにこれ？
            .to({scaleX:1, alpha:0.5}, 100)                     //半透明にして100ms掛けて元のサイズに戻す

        //他にも、wait,move,fadeOutなどがある。
    } 
});


//カウントダウンシーン
tm.define("CountdownScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        var self = this;
 
        var filter = tm.app.Shape(SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
        filter.origin.set(0, 0);
        filter.canvas.clearColor("rgba(250, 250, 250, 1.0)");
 
        var label = tm.app.Label(3).addChildTo(this);
        label
            .setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y)
            .setFillStyle("#888")
            .setFontFamily(FONT_FAMILY_FLAT)
            .setFontSize(512)
            .setAlign("center")
            .setBaseline("middle");
 
        label.tweener
            .set({
                scaleX: 0.5,
                scaleY: 0.5,
                text: 3
            })
            .scale(1)
            .set({
                scaleX: 0.5,
                scaleY: 0.5,
                text: 2
            })
            .scale(1)
            .set({
                scaleX: 0.5,
                scaleY: 0.5,
                text: 1
            })
            .scale(1)
            .call(function() {
                self.app.frame = 0;     //フレームリセット
                self.app.popScene();    //このシーンを取り除く。
                //pushSceneでシーンを重ねることもできる。
            });
    },
});

tm.define("TitleScene", {
    superClass: "tm.app.Scene",

    init: function()
    {
        this.superInit();

        //JSON形式で自身のプロパティを生成
        this.fromJSON(
        {
            children: [
                {
                    type: "Label", name: "titleLabel",
                    text: "FlaTM Touch",
                    x: SCREEN_CENTER_X,
                    y: 200,
                    fillStyle: "#444",
                    fontsize: 60,
                    fontFamily: FONT_FAMILY_FLAT,
                    align: "center",
                    baseline: "middle",
                },

                {
                    type: "Label", name: "nextLabel",
                    text: "TOUCH START",
                    x: SCREEN_CENTER_X,
                    y: 650,
                    fillStyle: "#444",
                    fontSize: 26,
                    fontFamily: FONT_FAMILY_FLAT,
                    align: "center",
                    baseline: "middle",
                }
            ]
        });

        this.nextLabel.tweener
            .fadeOut(500)
            .fadeIn(1000)
            .setLoop(true);
    },

    onpointingstart: function()
    {
        this.app.replaceScene(GameScene());
    },

});

tm.define("ResultScene",{
    superClass: "tm.app.Scene",

    init: function(param)
    {
        this.superInit();

        this.fromJSON({
            children: [
                {
                    type: "Label", name: "timeLabel",
                    x: SCREEN_CENTER_X,
                    y: 320,
                    fillStyle: "#888",
                    fontSize: 128,
                    fontFamily: FONT_FAMILY_FLAT,
                    text: "99.999",
                    align: "center",
                },
                {
                    type: "FlatButton", name: "tweetButton",
                    init: [
                        {
                            text: "TWEET",
                            bgColor: "hsl(240, 80%, 70%)",
                        }
                    ],
                    x: SCREEN_CENTER_X-160,
                    y: 650,
                },
                {   
                    type: "FlatButton", name: "backButton",
                    init: [
                        {
                            text: "BACK",
                            bgColor: "hsl(240, 0%, 70%)",
                        }
                    ],
                    x: SCREEN_CENTER_X+160,
                    y: 650,
                },
            ]
        });

        this.timeLabel.text = param.time;

        var self = this;

        //ツイート機能がある。
        this.tweetButton.onclick = function() {
            var twitterURL = tm.social.Twitter.createURL({
                type    : "tweet",
                text    : "tmlib.js チュートリアルゲームです. Time: {time}".format(param),
                hashtags: "tmlib,javascript,game",
                url     : "http://tmlife.net/?p=9781", // or window.document.location.href
            });
            window.open(twitterURL);
        };

        this.backButton.onpointingstart = function() {
            self.app.replaceScene(TitleScene());
        };
    },
});