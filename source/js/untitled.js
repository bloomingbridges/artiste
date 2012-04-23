
// Create the loader and queue images. Images will not 
// begin downloading until we tell the loader to start. 
//var loader = new PxLoader(); 
//var girSheetImg = loader.addImage('assets/girsheet.png');

var canvas, ctx, bounds, stage;
var States = { IDLE: 0, HUNTING:1, CREDITS: 2 }, state = -1, update = false;
var Assets = {};
var gir;

var loader = new PxLoader(); 
 
var init = function() { 
    canvas = document.getElementById('stage');
    ctx = canvas.getContext('2d'); 
 
    $('canvas').attr('width', $('canvas').css('width'));
    $('canvas').attr('height', $('canvas').css('height'));

    bounds = new Rectangle();
	bounds.width = canvas.width;
	bounds.height = canvas.height;

	stage = new Stage(canvas);
	
	gir = new BitmapAnimation(
		new SpriteSheet(
			{
				    images: [Assets.girSheetImg],
				    frames: {width:180, height:244, count:9, regX:90, regY:122},
				animations: { idle: [0], walk: [0,8,true,2] }
			}
		)
	);
	gir.x = bounds.width / 2;
	gir.y = bounds.height / 2;
	gir.gotoAndStop('idle');
	stage.addChild(gir);

	$('#stage').mouseover(function() {
		state = States.HUNTING;
	});

	$('#stage').mouseleave(function() {
		state = States.IDLE;				
	});

	Ticker.addListener(window);
	Ticker.useRAF = true;
	Ticker.setInterval(25);
	
	update = true;
	state = States.IDLE;
	stage.update();

}

function tick() {

	switch(true){

		case state === States.IDLE:
				if(!gir.paused){
					gir.gotoAndStop('idle');
					update = false;
				}
			break;

		case state === States.HUNTING:
			if(gir.currentAnimation !== "walk"){
				gir.gotoAndPlay('walk');
				update = true;
			}
			break;

		case state === States.CREDITS:

			break;

		default:
			update = false;

	}

	if(update){
		stage.update();
	}
}

function preloadAssets(onComplete) {	
    var completeListener = (!onComplete) ? init : onComplete;
    loader.addCompletionListener(init); 
	loader.start(); 
}

Assets.girSheetImg = loader.addImage('./assets/girsheet.png');
preloadAssets(false);
