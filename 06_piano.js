//プロパティ
var SCREEN_WIDTH	= 465;
var SCREEN_HEIGHT	= 465;

var RESOURCE_PATH = "resource";

//オブジェクト連想配列、オブジェクト名：値　ここでは、値はアドレス
var IMAGE = {
	"piano": RESOURCE_PATH + "/piano/piano.jpg",
};

var PIANO_SOUND = {
    "C3": RESOURCE_PATH + "/piano/C3.wav",
    "D3": RESOURCE_PATH + "/piano/D3.wav",
    "E3": RESOURCE_PATH + "/piano/E3.wav",
    "F3": RESOURCE_PATH + "/piano/F3.wav",
    "G3": RESOURCE_PATH + "/piano/G3.wav",
    "A3": RESOURCE_PATH + "/piano/A3.wav",
    "B3": RESOURCE_PATH + "/piano/B3.wav",
    "C4": RESOURCE_PATH + "/piano/C4.wav",
};

var KEY_MAP = {
	'A': "C3",
	'S': "D3",
	'D': "E3",
	'F': "F3",
	'G': "G3",
	'H': "A3",
	'J': "B3",
	'K': "C4",
};

//サウンドをロード
//pleload関数：mainが始まる前にロードなどを行う関数
tm.preload(function(){
	//キーには"C3"が入る。これを[]に入れると、そのアドレスを参照できる。
	//tm.sound.WebAudioManager.add(サウンドの名前,アドレス)
	//tm.sound.SoundManagerとの違いは不明
	for(var key in PIANO_SOUND)
	{
		var value = PIANO_SOUND[key];
		tm.sound.SoundManager.add(key,value);
	}
});

//main関数
tm.main(function() {
	tm.sound.SoundManager.get().play();
});