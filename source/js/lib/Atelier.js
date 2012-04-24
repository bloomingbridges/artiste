
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	// The base Class implementation (does nothing)
	this.Class = function(){};
  
	// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;
		
		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;
		
		// Copy the properties over onto the new prototype
		for (var name in prop) {
		  // Check if we're overwriting an existing function
		  prototype[name] = typeof prop[name] == "function" && 
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
			(function(name, fn){
			  return function() {
				var tmp = this._super;
				
				// Add a new ._super() method that is the same method
				// but on the super-class
				this._super = _super[name];
				
				// The method only need to be bound temporarily, so we
				// remove it when we're done executing
				var ret = fn.apply(this, arguments);        
				this._super = tmp;
				
				return ret;
			  };
			})(name, prop[name]) :
			prop[name];
		}
		
		// The dummy class constructor
		function Class() {
		  // All construction is actually done in the init method
		  if ( !initializing && this.init )
			this.init.apply(this, arguments);
		}
		
		// Populate our constructed prototype object
		Class.prototype = prototype;
		
		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;
		
		return Class;
	};
})();

/* ============================================================================================== */

var StateMachine = {
	states: {},
	currentState: null,
	registerStates: function(stateArray, autoStart) {
		StateMachine.states = stateArray;
		if(autoStart){
			var firstState = (autoStart === true) ? Object.keys(StateMachine.states).shift() : autoStart;
			StateMachine.switchTo(firstState);
		}
	},
	update: function() {
		if(StateMachine.currentState !== null){
			StateMachine.currentState.update();
		}
	},
	switchTo: function(newState) {
		console.log('Switching to: ' + newState);
		StateMachine.currentState = new StateMachine.states[newState](false);
	}
}

var State = Class.extend({

	init: function(data) {
		
		// TODO Manage subStage creation at this point

		if(data && typeof data === 'object'){
			console.log('constructing state..');		
		}
	},

	update: function() {
		// I'm an animation loop, you should override me
	},

	appear: function() {
		// I'm an animation loop, you might want to override me
	},

	disappear: function() {
		// I'm an animation loop, you might want to override me
	},

});

var IntroState = State.extend({

	init: function(){
		this._super( false );
		gir.gotoAndPlay('walk');
	},
	
	update: function(){
		if(gir.x > bounds.width / 2){
			gir.x -= 2;
		}
		else {
			StateMachine.switchTo('PLAY');
		}
	},

});

var PlayState = State.extend({

	init: function() {
		this._super(false);
		gir.gotoAndPlay('idle');
		
		// TODO Use Easel Mouse API instead?

		$('#stage').mouseover(function() {
			gir.gotoAndPlay('walk');
		});

		$('#stage').mouseleave(function() {
			gir.gotoAndStop(0);	
		});
		$('#stage').click(function() {
			StateMachine.switchTo('CREDITS');
		});
	}

});

var CreditsState = State.extend({

	init: function(){
		this._super( false );
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
					StateMachine.switchTo('INTRO');
				});
			}
		});
	},
	
	update: function(){
		if(gir.x > -180){
			gir.x -= 2;
		}
		if(credits.getStage() != null && credits.x > 0){
			credits.x -= 2;
		}
	},

});
