
/* AtelierJS - A scene management module for CreateJS 
 * By Florian Brueckner http://bloomingbridges.co.uk/
 * MIT Licensed.
 */


/* Souvenirs is a global object, responsible for preloading assets and 
 * holding reusable objects such as BitmapAnimations
 */

(function(window) {

	var Souvenirs = {

		 assets: {},
		sprites: {},

		register: function(id, path) {	
			// TODO Support more data types
			this.assets[id] = loader.addImage(path);
		},

		add: function(id, sprite) {
			this.sprites[id] = sprite;
		},

		clone: function(id) {
			if(id in this.sprites){
				return this.sprites[id].clone(true);
			}
		}

	};

	window.Souvenirs = Souvenirs;

}(window));


/* Curator is (currently) a global object, responsible for the display and management of Scenes 
 */

var Curator = {

	 		   scenes: {},
		 currentScene: {},
			nextScene: {},
		transitioning: false,
	transitionStarted: new signals.Signal(),
	  transitionEnded: new signals.Signal(),
		 sceneChanged: new signals.Signal(),

	registerCollection: function(scenesArray, autoStart) {
		this.scenes = scenesArray;
		if(autoStart){
			var firstScene = (autoStart === true) ? Object.keys(this.scenes).shift() : autoStart;
			this.switchTo(firstScene);
			Ticker.addListener(this);
		}
	},

	tick: function() {
		if(this.currentScene instanceof Scene){
			if(this.transitioning === true){
				this.currentScene.disappear();
				this.nextScene.appear();
			}
			else if(this.transitioning === 'ready'){
				this.transitioning = false;
				console.log('Transition finished!');
				stage.removeChild(Curator.currentScene.subStage);
				this.currentScene = this.nextScene;
			}
			else {
				this.currentScene.update();
			}
		}
	},

	switchTo: function(newScene) {
		console.log('Switching to: ' + newScene);
		if(this.currentScene instanceof Scene){
			this.currentScene.destroy();
		}
		var scene = this.scenes[newScene].scene;
		var blueprint = this.scenes[newScene].blueprint;
		this.currentScene = new scene(blueprint);
	},

	transitionTo: function(nextScene) {
		console.log('Transitioning to: ' + nextScene);
		var scene = this.scenes[nextScene].scene;
		var blueprint = this.scenes[nextScene].blueprint;
		this.nextScene = new scene(blueprint);
		this.transitioning = true;
	},

	endTransition: function() {
		this.transitioning = 'ready';
	}

};


/* Scene is the super class of all Scenes handled by the Curator
 */

var Scene = Class.extend({

	init: function(blueprint) {
		
		this.subStage = new Container();
		stage.addChild(this.subStage);

		if(blueprint && typeof blueprint === 'object'){
			// layout assets according to blueprint
			console.log('Loading scene blueprint..');
		}
		else {
			console.log('No blueprint supplied.');
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

