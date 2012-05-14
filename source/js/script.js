
// Globals

var canvas, bounds, stage, loader, mouseInside;

var init = function() { 

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

	/*
	 * -------------------------------------------------------------------------
	 | In here I define ALL the 'BitmapAnimation's etc. upfront and store them
	 | as Souvenirs. Hopefully one day this process will be automated..
	 * -------------------------------------------------------------------------
	 */
	assembleSprites();

	/*
	 * -------------------------------------------------------------------------
	 | Curator.registerStates(scenesArray, autoPlay);
	 | @autoPlay can either be true (first), false or a key in sceneArray 
	 * -------------------------------------------------------------------------
	 */
	Curator.registerCollection({ 
		  'INTRO': { scene: Intro },
		   'PLAY': { scene: Play },
		'CREDITS': { scene: Credits }
	}, true);

	Ticker.addListener(window);
	Ticker.useRAF = true;
	Ticker.setFPS(60);
	// Ticker.setInterval(1000/60);

}

function assembleSprites() {

	var gir = new BitmapAnimation(
		new SpriteSheet(
			{
				images: [ Souvenirs.assets.girSheetImg ],
				frames: { width: 180, height: 244, count: 9,
							regX: 90, regY: 122 },
			animations: { idle: [0], walk: [0, 8, true, 2] }
			}
		)
	);
		gir.snapToPixel = true;

	Souvenirs.add('gir', gir);

	////////////////////////////////////////////////////////////////////////////

	var taco = new Bitmap( Souvenirs.assets.tacoImg );
		taco.regX = 31; 
		taco.regY = 50;

	Souvenirs.add('taco', taco);

	////////////////////////////////////////////////////////////////////////////

	var g = new Graphics();
		g.beginFill(Graphics.getRGB(176,105,199));
		g.rect(0,0,bounds.width,bounds.height);
	var shape = new Shape();
		shape.graphics = g;

	var textShadow = new Shadow(Graphics.getRGB(150,20,199), 0, 2, 1);
	var text = new Text('Mmmmmm tacos!', 'normal 32px Helvetica', '#fff');
		text.width = bounds.width;
		text.textAlign = "center";
		text.x = bounds.width / 2;
		text.y = bounds.height / 2 - 16;
		text.shadow = textShadow;

	var text2 = new Text(
		'Click to start over', 'normal 16px Helvetica', '#fff'
	);
		text2.width = bounds.width;
		text2.textAlign = "center";
		text2.x = bounds.width / 2;
		text2.y = text.y + 36;
		text2.alpha = 0.9;

	var credits = new Container();
		credits.addChild(shape);
		credits.addChild(text);
		credits.addChild(text2);

	Souvenirs.add('credits', credits);

}

function preloadAssets(onComplete) {	
    var completeListener = (!onComplete) 
    	? init 
    	: onComplete;
    loader.addCompletionListener(completeListener); 
	loader.start(); 
}

function tick() {
	/* sb: hide */
	$('header h1').html('FPS: ' + Math.floor(Ticker.getMeasuredFPS()));
	/* sb: end */
	stage.update();
}

// Check if the canvas element is supported at all.
canvas = document.getElementById('stage');
if(canvas.getContext('2d')){
	loader = new PxLoader(); 
	Souvenirs.register('girSheetImg', loader.addImage('./assets/girsheet.png'));
	Souvenirs.register('tacoImg', loader.addImage('./assets/taco.png'));
	preloadAssets(false);
}
else {
	// Display a gnarly message or use your polyfill of choice
	$(canvas).html("Your browser doesn't support the canvas element."
		+ "You're missing out!");
}
