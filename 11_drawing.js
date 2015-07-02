var SCREEN_WIDTH    = 320;
var SCREEN_HEIGHT   = 320;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;
var COLOR_LIST = [
    "white",
    "red",
    "yellow",
    "green",
    "cyan",
    "blue",
    "purple",
    "black",
];

tm.main(function() {
    var element = tm.dom.Element("#world");
    var canvas  = tm.graphics.Canvas("#world");
    
    canvas.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    canvas.clearColor("white");
    canvas.setLineStyle(8, "round", "round", 10);
    
    var pointX = null, pointY = null;
    
    element.event.pointstart(function(e) {
        pointX = e.pointX;
        pointY = e.pointY;
    });
    
    element.event.pointmove(function(e) {
        if (pointX == null || pointY == null) return ;
        
        canvas.drawLine(pointX, pointY, e.pointX, e.pointY);
        pointX = e.pointX; pointY = e.pointY;
        e.stop();
    });
    
    element.event.pointend(function(e) {
        pointX = null;
        pointY = null;
        e.stop();
    });

    var colorPalet = tm.dom.Element("#color-palet");
    var active = null;
    
    for (var i=0,len=COLOR_LIST.length; i<len; ++i) {
        var elm = colorPalet.create("span");
        elm.attr.set("class", "piece");
        elm.backgroundColor = COLOR_LIST[i];
        elm.event.click(function() {
            canvas.strokeStyle = this.backgroundColor;
            
            active.attr.set("class", "piece");
            this.attr.set("class", "piece active");
            active = this;
        });
    }
    
    active = colorPalet.children.last;
    active.attr.set("class", "piece active");
    
    tm.dom.Element("#clear").event.click(function() {
        canvas.clearColor("white");
    });
    tm.dom.Element("#save").event.click(function() {
        canvas.saveAsImage();
    });
    tm.dom.Element("#line-width").event.add("change", function() {
        canvas.lineWidth = this.value;
    });
    
});
