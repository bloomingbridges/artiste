
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
	 | Scene blueprint definitions as JSON. Alternatively just override init:
	 | Would somebody like to write an authoring tool? :>
	 * -------------------------------------------------------------------------
	 */
	var IntroBlueprint = {
		"info": 
		{
				  "scene": "Intro",
			"description": "A single blueprint that combines Intro and Play.",
				 "states": [ "INTRO", "PLAY" ]
		},
		"actors": 
		[
			{
				        "sid": "gir",
				         "id": "gir",
				       "type": "MovieClip",
				"spritesheet": 
				{
				 	 "images": [ Souvenirs.assets.girSheetImg ],
					 "frames":
					{ 
						 "width": 180, 
						"height": 244, 
						 "count": 9,
						  "regX": 90, 
						  "regY": 122 
					},
				 "animations": 
				 	{ 
				    	  "idle": [ 0 ], 
				    	  "walk": [ 0, 8, true, 2 ] 
				   	}
				},
				          "x": 730,
				          "y": 200,
				         "vX": 2,
				       "play": "walk",
				    "visible": true,
				       "snap": true
			}
		]
	}

	/*
	 * -------------------------------------------------------------------------
	 | Instead of duplicating 'actor' nodes AtelierJS allows you to define a
	 | group of instances via the 'id' property and the following syntax:
	 |
	 |     "id": "nameOfTheArray[amountOfInstances]"
	 |
	 | To define a list of individual x,y positions use Array literals:
	 |     
	 |     "x": [1,2,3,4,5], 
	 |     "y": [5,4,3,2,1]
	 |
	 | => Results in position pairs such as [1,5], [2,4], [3,3], etc.
	 |
	 | Alternatively you can define a 'zone' rectangle in which the instances
	 | are randomly positioned in (the 'zone' property is dominant here):
	 |
	 |     "zone": { "x": 0, "y": -150, "width": 800, "height": 150 } 
	 * -------------------------------------------------------------------------
	 */
	var CreditsBlueprint = {
		"info": 
		{
				  "scene": "Credits",
			"description": "Scene of the flying tacos"
		},
		"actors": 
		[
			{
				     "sid": "taco",
				      "id": "tacoArray[10]",
				    "type": "Sprite",
				     "img": Souvenirs.assets.tacoImg,
				    "regX": 31,
				    "regY": 50,
					   "y": 500,
					  "vY": 10,
				 	"zone": { "x": 45, "y": -200, "width": 680 },
				 "visible": true
			}
		]
	}

	/*
	 * -------------------------------------------------------------------------
	 | Curator.registerStates(scenesArray, autoPlay);
	 | @autoPlay can either be true (first), false or a key in sceneArray 
	 * -------------------------------------------------------------------------
	 */
	Curator.registerCollection({ 
		  'INTRO': { scene: Intro, blueprint: IntroBlueprint },
		   //'PLAY': { scene: Play },
		'CREDITS': { scene: Credits, blueprint: CreditsBlueprint }
	}, true);

	Ticker.addListener(window);
	Ticker.useRAF = true;
	Ticker.setFPS(60);
	// Ticker.setInterval(1000/60);

}

function assembleSprites() {

	/*
	 * -------------------------------------------------------------------------
	 | Uncomment this to have Gir NOT created by the blueprint above
	 * -------------------------------------------------------------------------
	 */
	// var gir = new BitmapAnimation(
	// 	new SpriteSheet(
	// 		{
	// 			images: [ Souvenirs.assets.girSheetImg ],
	// 			frames: { width: 180, height: 244, count: 9,
	// 						regX: 90, regY: 122 },
	// 		animations: { idle: [0], walk: [0, 8, true, 2] }
	// 		}
	// 	)
	// );
	// 	gir.snapToPixel = true;

	// Souvenirs.add('gir', gir);

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
	Souvenirs.register('girSheetImg', './assets/girsheet.png');
	Souvenirs.register('tacoImg', './assets/taco.png');
	preloadAssets(false);
}
else {
	// Display a gnarly message or use your polyfill of choice
	$(canvas).html("Your browser doesn't support the canvas element."
		+ "You're missing out!");
}
