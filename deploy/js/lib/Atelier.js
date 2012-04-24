
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
	currentState: {},
	nextState: {},
	transitioning: false,
	registerStates: function(stateArray, autoStart) {
		StateMachine.states = stateArray;
		if(autoStart){
			var firstState = (autoStart === true) ? Object.keys(StateMachine.states).shift() : autoStart;
			StateMachine.switchTo(firstState);
		}
	},
	update: function() {
		if(StateMachine.currentState instanceof State){
			if(StateMachine.transitioning === true){
				StateMachine.currentState.disappear();
				StateMachine.nextState.appear();
			}
			else if(StateMachine.transitioning === 'ready'){
				StateMachine.transitioning = false;
				console.log('Transition finished!');
				stage.removeChild(StateMachine.currentState.subStage);
				StateMachine.currentState = StateMachine.nextState;
			}
			StateMachine.currentState.update();
		}
	},
	switchTo: function(newState) {
		console.log('Switching to: ' + newState);
		if(StateMachine.currentState instanceof State){
			StateMachine.currentState.destroy();
		}
		StateMachine.currentState = new StateMachine.states[newState](false);
	},
	transitionTo: function(nextState) {
		console.log('Transitioning to: ' + nextState);
		StateMachine.nextState = new StateMachine.states[nextState](false);
		StateMachine.transitioning = true;
	},
	endTransition: function() {
		StateMachine.transitioning = 'ready';
	}
}

var State = Class.extend({

	subStage: {},

	init: function(data) {
		
		subStage = new Container();
		stage.addChild(subStage);

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

	destroy: function() {
		//subStage.removeAllChildren();
		stage.removeChild(subStage);
	}

});
