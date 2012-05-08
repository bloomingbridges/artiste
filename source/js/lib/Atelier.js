
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

		register: function(id, path) {	
			// TODO Support more data types (e.g. sounds) //////////////////////
			this.assets[id] = loader.addImage(path);
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

	// TODO Allow for instantiation via canvas/stage reference /////////////////
	// TODO Add modal scenes/overlays //////////////////////////////////////////

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
			var blueprint = this.scenes[newScene].blueprint;
			this.currentScene = new scene(blueprint);
		},

		transitionTo: function(nextScene) {
			/* sb: hide */
			console.log('Transitioning to: ' + nextScene);
			/* sb: end */
			var scene = this.scenes[nextScene].scene;
			var blueprint = this.scenes[nextScene].blueprint;
			this.nextScene = new scene(blueprint);

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
		
		this.states = { 'OFF': 0, 'ON': 1, 'IN': 2, 'OUT': 3 };
		this.currentState = 1;
		this.changed = new signals.Signal();

		this.registerStates = function(stateArray) {
			for(var s = 0; s < stateArray.length; s++){
				this.states[stateArray[s].toUpperCase()] = parseInt(s) + 4;
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

		init: function(blueprint) {
			
			this.subStage = new Container();
			stage.addChild(this.subStage);

			this.appeared    = new signals.Signal();
			this.disappeared = new signals.Signal();

			if(blueprint){
				if(typeof blueprint === 'object' && blueprint.info){
					/* sb: hide */
					console.log('Loading Scene blueprint..');
					/* sb: end */
					this.construct(blueprint);
				}
			}

		},

		construct: function(data) {
			
			for(x in data.actors) {
				
				var actor = data.actors[x];
				var tmp = {};

				if(Souvenirs.sprites[actor.sid]){
					tmp = Souvenirs.clone(actor.sid);
					/* sb: hide */
					console.log("Using cached version ");
					/* sb: end */
				}
				else {

					if(actor.type === "Bitmap"){
						tmp = new Bitmap(actor.src);
						Souvenirs.add(actor.sid, tmp);
					}
					else if(actor.type === "BitmapAnimation"){
						tmp = new BitmapAnimation(new SpriteSheet(actor.sheet));
						Souvenirs.add(actor.sid, tmp);
					}
					else {
						throw new Error("Type not (yet) recognised.");
					}

				}
					
				tmp.x = actor.x;
				tmp.y = actor.y;

				if(actor.play){
					tmp.gotoAndPlay(actor.play);
				}
				else if(actor.stop){
					tmp.gotoAndStop(actor.stop);
				}

				this[actor.id] = tmp;
				this.subStage.addChild(tmp);

			}

		},

		update: function() {
			// I'm an animation loop, you should override me
		},

		onStateChanged: function(toState, fromState) {
			console.log('State changed to: ' + toState);
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
