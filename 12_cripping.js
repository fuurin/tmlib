var SCREEN_WIDTH    = 640;              // スクリーン幅
var SCREEN_HEIGHT   = 960;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分


// main
tm.main(function() {
    // キャンバスアプリケーションを生成
    var app = tm.display.CanvasApp("#world");
    // リサイズ
    app.resize(640, 960);
    // ウィンドウにフィットさせる
    app.fitWindow();
    
    // シーンを生成&入れ替え
    var scene = MainScene();
    app.replaceScene(scene);
    
    // 実行
    app.run();
});

// シーンを定義
tm.define("MainScene", {
    superClass: "tm.app.Scene",
    
    init: function() {
        this.superInit();
        
        // マスク用
        this.mask = tm.display.RectangleShape(500, 500, {
            fillStyle: "white",
        }).addChildTo(this);
        // 親のOriginは、子のOriginになる！
        this.mask.setOrigin(0, 0);
        this.mask.x = 70;
        this.mask.y = 230;
        this.mask.width = 500;
        this.mask.height = 500;
        // こいつを true にすると子供が自分のサイズに合わせてクリッピングされる
        this.mask.clipping = true;
        // スクロール
        this.scrollGroup = tm.display.CanvasElement().addChildTo(this.mask);
        var self = this;
        (12).times(function(i) {
            // 四角形生成
            var sx;
            var sy;
            var rect = tm.display.RectangleShape().addChildTo(this.scrollGroup);
            rect.setSize(300, 40);
            rect.x = 250;
            rect.y = 50*i + 50;
            
            // ラベルくっつける
            tm.display.Label(i + "番目").addChildTo(rect);
            
            //rect.checkHierarchy = true;
            rect.setInteractive(true);
            //rect.setBoundingType('rect');
            
            rect.on('pointingstart', function(e){
                    var p = e.app.pointing;
                    sx = p.x; sy = p.y;
            }.bind(this));
            
            rect.on('pointingend', function(e) {
                var p = e.app.pointing;
                //マスクの外では処理を行なわない
                if(!this.mask.isHitPointRect(p.x, p.y)) {
                    return ;
                }

                // スクロール時も処理を行わない
                var ex = p.x;
                var ey = p.y;
                var len = (ex-sx)*(ex-sx)+(ey-sy)*(ey-sy);
                if (len > 16) return ;

                console.log('touch ' + i);
            }.bind(this));

        }, this);
        
        // スクロール
        this.onpointingmove = function(e) {
            var p = e.app.pointing;
            // スクロール
            this.scrollGroup.y += p.dy;
        }
    },
    
});