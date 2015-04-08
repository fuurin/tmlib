//main
tm.main(function()　{
	var app = tm.display.CanvasApp("#world");

	app.resize(640, 960);

	app.fitWindow();

	//シーンもインスタンス
	var scene = MainScene();

	//シーンをキャンバスに適用
	app.replaceScene(scene);

	app.run();
});

//シーン定義メソッド
//名前と、関数集を渡す
tm.define("MainScene", {
	superClass: "tm.app.Scene",

	init: function() {
		//
		this.superInit();

		//
		this.star = tm.display.StarShape().addChildTo(this);

		//
		this.star.setPosition(320, 480);

		//
		this.label = tm.display.Label("touch me!").addChildTo(this);

		//
		this.label.setPosition(320, 800);
	},

	update: function(app)
	{
		this.star.rotation += 16;
		var pointing = app.pointing;
		if(pointing.getPointing())
		{
			this.star.x += (pointing.x - this.star.x) * 0.1;
			this.star.y += (pointing.y - this.star.y) * 0.1;
		}

	}
});