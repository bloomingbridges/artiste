
var canvas, ctx, bounds, stage;
var Assets = {};
var gir, taco, credits;
var loader = new PxLoader(); 

var StateMachine = {
	states: { INTRO: -1, GIR: 0, CREDITS: 1 },
	currentState: -1,
}

StateMachine.switchTo = function(newState) {
	
	switch(newState){

		case -1:
			gir.gotoAndPlay('walk');
			break;

		case 0:
			gir.gotoAndPlay('idle');
			$('#stage').mouseover(function() {
				gir.gotoAndPlay('walk');
			});

			$('#stage').mouseleave(function() {
				gir.gotoAndStop(0);	
			});
			$('#stage').click(function() {
				StateMachine.switchTo(1);
			});
			break;

		case 1:
			$('#stage').unbind('mouseover').unbind('mouseleave').unbind('click');
			if(!credits){
				credits = new Container();

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

				credits.x = bounds.width;
				stage.addChild(credits);
			}
			else {
				credits.x = bounds.width;
				credits.y = 0;
				credits.alpha = 1.0;
			}

			$('#stage').click(function() {
				if(credits.x == 0){
					$('#stage').unbind('click');
					Tween.get(credits).to({ y: -bounds.height, alpha: 0.0 }, 1000, Ease.cubicOut).call(function() {
						gir.x = bounds.width + 180;
						StateMachine.switchTo(-1);
					});
				}
			});

			break;

	}

	StateMachine.currentState = newState;

}

StateMachine.update = function() {
	
	switch(StateMachine.currentState){

		case StateMachine.states.INTRO:
			if(gir.x > bounds.width / 2){
				gir.x -= 2;
			}
			else {
				StateMachine.switchTo(0);
			}
			break;

		case StateMachine.states.CREDITS:
			if(gir.x > -180){
				gir.x -= 2;
			}
			if(credits.getStage() != null && credits.x > 0){
				credits.x -= 2;
			}

	}

}
 
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
	gir.x = bounds.width + 90;
	gir.y = bounds.height / 2;
	gir.gotoAndStop('idle');
	gir.snapToPixel = true;
	stage.addChild(gir);

	Ticker.addListener(window);
	Ticker.useRAF = true;
	Ticker.setInterval(25);
	
	stage.update();
	StateMachine.switchTo(-1);

}

function tick() {
	StateMachine.update();
	stage.update();
}

function preloadAssets(onComplete) {	
    var completeListener = (!onComplete) ? init : onComplete;
    loader.addCompletionListener(completeListener); 
	loader.start(); 
}

Assets.girSheetImg = loader.addImage('./assets/girsheet.png');
Assets.tacoImg = loader.addImage('./assets/taco.png');
preloadAssets(false);
