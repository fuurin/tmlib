	tm.main(function() {
		var app = tm.display.CanvasApp("#world");

		//リサイズメソッド
		app.resize(640, 960);

		//ウィンドウにフィットさせるメソッド
		app.fitWindow();

		//スターを生成
		var star = tm.display.StarShape().addChildTo(app.currentScene);

		//真ん中にセット
		star.setPosition(320, 480);

		//ラベル
		var label1 = tm.display.Label("Hello, world!").addChildTo(app.currentScene);
		var label2 = tm.display.Label("Touch me!").addChildTo(app.currentScene);

		//ラベル位置指定:文字列の中心位置の座標を指定
		//デフォルトで縦20、横は文字による
		label1.setPosition(320, 880);
		label2.setPosition(320, 900);

		//更新処理
		app.currentScene.update = function(app)
		{
			//ローテーションを使って回す
			star.rotation += 16;

			//キャンバスのタッチ（クリック）した位置のインスタンスを作成
			var pointing = app.pointing;

			//タッチしているかを判定するメソッド:getPointing()
			if(pointing.getPointing())
			{
				//.xや.yで、インスタンスの座標にアクセスできる。
				//0.1を外せば、ポインタについてくる。
				star.x += (pointing.x - star.x) * 0.1;
				star.y += (pointing.y - star.y) * 0.1;
			}
		};

		//実行
		app.run();
	})
