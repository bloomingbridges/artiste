
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

/* AtelierJS - State Manager (StateMachine) and Asset Library (Souvenirs) classes for CreateJS 
 * By Florian Brueckner http://bloomingbridges.co.uk/
 * MIT Licensed.
 */

var Souvenirs = {
	 assets: {},
	sprites: {},
	enqueue: function(id, path) {	
		this.assets[id] = loader.addImage(path);
		console.log(id + ' has been enqueued for preloading.');
	},
	retrieve: function(id) {
		if(id in this.assets){
			return this.assets[id];
		}
		else {
			throw "Asset doesn't exist :<";
		}
	},
	register: function(id, sprite) {
		this.sprites[id] = sprite;
		console.log('Sprite has been registered.');
	},
	clone: function(id) {
		if(id in this.sprites){
			return this.sprites[id].clone(true);
		}
	}
};

var StateMachine = {
	states: {},
	currentState: {},
	nextState: {},
	transitioning: false,
	registerStates: function(stateArray, autoStart) {
		this.states = stateArray;
		if(autoStart){
			var firstState = (autoStart === true) ? Object.keys(this.states).shift() : autoStart;
			this.switchTo(firstState);
		}
	},
	update: function() {
		if(this.currentState instanceof State){
			if(this.transitioning === true){
				this.currentState.disappear();
				this.nextState.appear();
			}
			else if(this.transitioning === 'ready'){
				this.transitioning = false;
				console.log('Transition finished!');
				stage.removeChild(StateMachine.currentState.subStage);
				this.currentState = this.nextState;
			}
			else {
				this.currentState.update();
			}
		}
	},
	switchTo: function(newState) {
		console.log('Switching to: ' + newState);
		if(this.currentState instanceof State){
			this.currentState.destroy();
		}
		this.currentState = new this.states[newState]();
	},
	transitionTo: function(nextState) {
		console.log('Transitioning to: ' + nextState);
		this.nextState = new this.states[nextState]();
		this.transitioning = true;
	},
	endTransition: function() {
		this.transitioning = 'ready';
	}
}

var State = Class.extend({

	init: function(blueprint) {
		
		this.subStage = new Container();
		this.layout = blueprint;
		stage.addChild(this.subStage);

		if(blueprint && typeof blueprint === 'object'){
			// layout assets according to blueprint
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

	destroy: function() {
		//subStage.removeAllChildren();
		stage.removeChild(this.subStage);
	}

});
