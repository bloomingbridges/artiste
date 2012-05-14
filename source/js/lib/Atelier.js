/*
 JS Signals <http://millermedeiros.github.com/js-signals/>
 Released under the MIT license
 Author: Miller Medeiros
 Version: 0.7.4 - Build: 252 (2012/02/24 10:30 PM)
*/
(function(h){function g(a,b,c,d,e){this._listener=b;this._isOnce=c;this.context=d;this._signal=a;this._priority=e||0}function f(a,b){if(typeof a!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b));}var e={VERSION:"0.7.4"};g.prototype={active:!0,params:null,execute:function(a){var b;this.active&&this._listener&&(a=this.params?this.params.concat(a):a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach());return b},detach:function(){return this.isBound()?
this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},getListener:function(){return this._listener},_destroy:function(){delete this._signal;delete this._listener;delete this.context},isOnce:function(){return this._isOnce},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+", isBound:"+this.isBound()+", active:"+this.active+"]"}};e.Signal=function(){this._bindings=[];this._prevParams=null};e.Signal.prototype={memorize:!1,_shouldPropagate:!0,
active:!0,_registerListener:function(a,b,c,d){var e=this._indexOfListener(a,c);if(e!==-1){if(a=this._bindings[e],a.isOnce()!==b)throw Error("You cannot add"+(b?"":"Once")+"() then add"+(!b?"":"Once")+"() the same listener without removing the relationship first.");}else a=new g(this,a,b,c,d),this._addBinding(a);this.memorize&&this._prevParams&&a.execute(this._prevParams);return a},_addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);
this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c=this._bindings.length,d;c--;)if(d=this._bindings[c],d._listener===a&&d.context===b)return c;return-1},has:function(a,b){return this._indexOfListener(a,b)!==-1},add:function(a,b,c){f(a,"add");return this._registerListener(a,!1,b,c)},addOnce:function(a,b,c){f(a,"addOnce");return this._registerListener(a,!0,b,c)},remove:function(a,b){f(a,"remove");var c=this._indexOfListener(a,b);c!==-1&&(this._bindings[c]._destroy(),this._bindings.splice(c,
1));return a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b=Array.prototype.slice.call(arguments),c=this._bindings.length,d;if(this.memorize)this._prevParams=b;if(c){d=this._bindings.slice();this._shouldPropagate=!0;do c--;while(d[c]&&this._shouldPropagate&&d[c].execute(b)!==!1)}}},forget:function(){this._prevParams=
null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};typeof define==="function"&&define.amd?define(e):typeof module!=="undefined"&&module.exports?module.exports=e:h.signals=e})(this);


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


/*
 * -----------------------------------------------------------------------------
 | AtelierJS - A scene management module for CreateJS 
 | By Florian Brueckner http://bloomingbridges.co.uk/
 | MIT Licensed.
 * -----------------------------------------------------------------------------
 */

// Declaring the AtelierJS namespace
var AtelierJS = {};

(function(window) {

	/*
	 * =========================================================================
	 | Souvenirs
	 * =========================================================================
	 | is a global object, responsible for preloading assets and 
	 | holding reusable objects such as BitmapAnimations         
	 * -------------------------------------------------------------------------
	 */

	AtelierJS.Souvenirs = {

		 assets: {},
		sprites: {},
		 sounds: {},

		register: function(id, ref) {	
			this.assets[id] = ref;
		},

		add: function(id, sprite, override) {
			if(!this.sprites[id] || override){
				this.sprites[id] = sprite;
			}
			else {
				throw new Error("Souvenir '"+ id +"' already exists!");
			}
		},

		clone: function(id) {
			if(id in this.sprites){
				return this.sprites[id].clone(true);
			}
		}

	};

	window.Souvenirs = AtelierJS.Souvenirs;



	/*
	 * =========================================================================
	 | Curator 
	 * =========================================================================
	 | is a global object, responsible for the display and management of Scenes 
	 * -------------------------------------------------------------------------
	 */

	AtelierJS.Curator = {

				   scenes: {},
			 currentScene: {},
				nextScene: {},
			transitioning: false,

		registerCollection: function(scenesArray, autoStart) {
			this.scenes = scenesArray;
			if(autoStart){
				var firstScene = (autoStart === true) 
					? Object.keys(this.scenes).shift() 
					: autoStart;
				this.switchTo(firstScene);
				Ticker.addListener(this);
			}
		},

		tick: function() {
			if(this.currentScene instanceof AtelierJS.Scene){
				if(this.transitioning === true){
					this.currentScene.disappear();
					this.nextScene.appear();
				}
				else if(this.transitioning === 'ready'){
					this.transitioning = false;
					/* sb: hide */
					console.log('Transition finished!');
					/* sb: end */
					stage.removeChild(Curator.currentScene.subStage);
					this.currentScene = this.nextScene;
				}
				else {
					this.currentScene.update();
				}
			}
		},

		switchTo: function(newScene) {
			/* sb: hide */
			console.log('Switching to: ' + newScene);
			/* sb: end */
			if(this.currentScene instanceof AtelierJS.Scene){
				this.currentScene.destroy();
			}
			var scene = this.scenes[newScene].scene;
			this.currentScene = new scene();
		},

		transitionTo: function(nextScene) {
			/* sb: hide */
			console.log('Transitioning to: ' + nextScene);
			/* sb: end */
			var scene = this.scenes[nextScene].scene;
			this.nextScene = new scene();

			this.currentScene.disappeared.add(this.endTransition);
			this.nextScene.appeared.add(this.endTransition);
			this.transitioning = true;
		},

		endTransition: function() {
			/* sb: hide */
			console.log("New scene has appeared.");
			/* sb: end */
			Curator.transitioning = 'ready';
		}

	};

	window.Curator = AtelierJS.Curator;



	/*
	 * =========================================================================
	 | StateMachine (Scene extension, properties will be merged)
	 * =========================================================================
	 | Class for managing different logical states in a Scene
	 * -------------------------------------------------------------------------
	 */

	AtelierJS.StateMachine = function() {
		
		this.states = { 'OFF': 0, 'ON': 1 };
		this.currentState = 1;
		this.changed = new signals.Signal();

		this.registerStates = function(stateArray) {
			for(var s = 0; s < stateArray.length; s++){
				this.states[stateArray[s].toUpperCase()] = parseInt(s) + 2;
			}
		}

		this.setState = function(state) {
			this.changed.dispatch(state, this.currentState);
			if(this.states[state]){
				this.currentState = this.states[state];
			}
		}

	};



	/*
	 * =========================================================================
	 | Scene
	 * =========================================================================
	 | Super class of all Scenes handled by the Curator
 	 * -------------------------------------------------------------------------
 	 */

	AtelierJS.Scene = Class.extend({

		init: function() {
			
			this.subStage = new Container();
			stage.addChild(this.subStage);

			this.appeared    = new signals.Signal();
			this.disappeared = new signals.Signal();

		},

		update: function() {
			// I'm an animation loop, you should override me
		},

		addChild: function(child) {
			this.subStage.addChild(child);
		},

		onStateChanged: function(toState, fromState) {
			/* sb: hide */
			console.log('State changed to: ' + toState);
			/* sb: end */
		},

		appear: function() {
			// I'm an animation loop, you might want to override me
		},

		disappear: function() {
			// I'm an animation loop, you might want to override me
		},

		destroy: function() {
			stage.removeChild(this.subStage);
		},

		registerStates: function(stateArray) {
			if(!this.states){
				var stateMachine = new AtelierJS.StateMachine();
				this.states = stateMachine.states;
				this.currentState = stateMachine.currentState;
				this.changed = stateMachine.changed;
				this.changed.add(this.onStateChanged);
				this.registerStates = stateMachine.registerStates;
				this.setState = stateMachine.setState;
				this.registerStates(stateArray);
			}
		}

	});

}(window));
