
// Create the loader and queue images. Images will not 
// begin downloading until we tell the loader to start. 
//var loader = new PxLoader(); 
//var girSheetImg = loader.addImage('assets/girsheet.png');

var canvas, ctx, bounds, stage;
var States = { IDLE: 0, HUNTING: 1, CREDITS: 2 };
var gir;
 
var init = function() { 
    canvas = document.getElementById('stage');
    ctx = canvas.getContext('2d'); 
 
    $('canvas').attr('width', $('canvas').css('width'));
    $('canvas').attr('height', $('canvas').css('height'));

    console.log('ASSETS READY - INIT MOVIE');

    bounds = new Rectangle();
	bounds.width = canvas.width;
	bounds.height = canvas.height;

	stage = new Stage(canvas);

	var girSheet = new SpriteSheet({
		images: [girSheetImg],
		frames: {width:180, height:244, count:9, regX:90, regY:122},
		animations: {walk:{frames:[0,1,2,3,4,5,6,7,8]}}
	});

	gir = new BitmapAnimation(girSheet);
	gir.x = bounds.width / 2;
	gir.y = bounds.height / 2;
	gir.gotoAndPlay("walk");
	stage.addChild(gir);

	Ticker.addListener(window);
	Ticker.useRAF = true;
	Ticker.setInterval(40);

}

function tick() {
	stage.update();
}

//loader.addCompletionListener(init); 
//loader.start(); 