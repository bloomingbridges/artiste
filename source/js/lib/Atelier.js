
/* AtelierJS - State Manager (StateMachine) and Asset Library (Souvenirs) classes for CreateJS 
 * By Florian Brueckner http://bloomingbridges.co.uk/
 * MIT Licensed.
 */

(function(window) {
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
	window.Souvenirs = Souvenirs;
}(window));

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
		var state = this.states[newState].state;
		var blueprint = this.states[newState].blueprint;
		this.currentState = new state(blueprint);
	},
	transitionTo: function(nextState) {
		console.log('Transitioning to: ' + nextState);
		var state = this.states[nextState].state;
		var blueprint = this.states[nextState].blueprint;
		this.nextState = new state(blueprint);
		this.transitioning = true;
	},
	endTransition: function() {
		this.transitioning = 'ready';
	}
};

var State = Class.extend({

	init: function(blueprint) {
		
		this.subStage = new Container();
		stage.addChild(this.subStage);

		if(blueprint && typeof blueprint === 'object'){
			// layout assets according to blueprint
			console.log('Loading state blueprint..');
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

