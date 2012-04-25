
// Globals

var canvas, bounds, stage, mouseInside;
var loader = new PxLoader(); 

var init = function() { 

    canvas = document.getElementById('stage');
    $(canvas).attr('width', $('canvas').css('width'));
    $(canvas).attr('height', $('canvas').css('height'));
    $(canvas).mouseover(function() {
		mouseInside = true;
	});
	$(canvas).mouseleave(function() {
		mouseInside = false;
	});

	bounds = new Rectangle();
	bounds.width = canvas.width;
	bounds.height = canvas.height;
    stage = new Stage(canvas);

    /*  In here I manually construct ALL the 'BitmapAnimation's needed and store them in Souvenirs
	 *  Hopefully one day this process will be automated..
	 */
	assembleSprites();

	/*  StateMachine.registerStates(stateArray, autoPlay);
	 *  autoPlay can either be true (beginning), false or a key in stateArray e.g. 'CREDITS'
	 */
	StateMachine.registerStates({ 
		  'INTRO': IntroState, 
		   'PLAY': PlayState, 
		'CREDITS': CreditsState 
	}, true);

	Ticker.addListener(window);
	Ticker.useRAF = true;
	Ticker.setInterval(1000/60);

}

function tick() {
	StateMachine.update();
	stage.update();
}

function assembleSprites() {

	var gir = new BitmapAnimation(
		new SpriteSheet(
			{
				    images: [ Souvenirs.assets.girSheetImg ],
				    frames: { width: 180, height: 244, count: 9, regX: 90, regY: 122 },
				animations: { idle: [0], walk: [0,8,true,2] }
			}
		)
	);
	gir.snapToPixel = true;

	Souvenirs.register('gir', gir);

	/ * ==================================================================================== * /

	var taco = new Bitmap( Souvenirs.assets.tacoImg );
	taco.regX = 31; taco.regY = 50;

	Souvenirs.register('taco', taco);

	/ * ==================================================================================== * /

	var credits = new Container();

	var shape = new Shape();

	var g = new Graphics();
	g.beginFill(Graphics.getRGB(176,105,199));
	g.rect(0,0,bounds.width,bounds.height);
	shape.graphics = g;

	credits.addChild(shape);

	var text = new Text('Mmmmmm tacos!', 'normal 32px Helvetica', 'white');
	text.width = bounds.width;
	text.textAlign = "center";
	text.x = bounds.width / 2;
	text.y = bounds.height / 2 - 16;

	var textShadow = new Shadow(Graphics.getRGB(150,20,199), 0, 2, 1);
	text.shadow = textShadow;

	credits.addChild(text);

	var text2 = new Text('Click to restart', 'normal 16px Helvetica', 'white');
	text2.width = bounds.width;
	text2.textAlign = "center";
	text2.x = bounds.width / 2;
	text2.y = text.y + 36;
	text2.alpha = 0.9;
	credits.addChild(text2);

	Souvenirs.register('credits', credits);

}

function preloadAssets(onComplete) {	
    var completeListener = (!onComplete) ? init : onComplete;
    loader.addCompletionListener(completeListener); 
	loader.start(); 
}

Souvenirs.enqueue('girSheetImg', './assets/girsheet.png');
Souvenirs.enqueue('tacoImg', './assets/taco.png');
preloadAssets(false);
