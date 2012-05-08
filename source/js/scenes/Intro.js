var Intro = AtelierJS.Scene.extend({

	// init: function(blueprint){
	// 	this._super(blueprint);

	// 	this.gir = Souvenirs.clone('gir');
	// 	this.subStage.addChild(this.gir);
	// 	this.gir.x = bounds.width + 90;
	// 	this.gir.y = bounds.height / 2;
	// 	this.gir.gotoAndPlay('walk');
	// },

	init: function(blueprint){
		this._super(blueprint);

		this.registerStates(['INTRO', 'PLAY']);
		this.setState('INTRO');
	},

	appear: function(){
		this._super();
	},
	
	update: function(){
		switch(this.currentState){
			case this.states.INTRO:
				if(this.gir.x > bounds.width / 2){
					this.gir.x -= 2;
				}
				else {
					this.setState('PLAY');
				}
				break;
			
			case this.states.PLAY:
				if(mouseInside){
					if(this.gir.currentAnimation === 'idle'){
						this.gir.gotoAndPlay('walk');
					}
				}
				else {
					this.gir.gotoAndPlay('idle');
				}
				break;
		}
	},

	onStateChanged: function(state, fromState){
		switch(true){
			case (state === 'PLAY'):

				if(!mouseInside){
					Curator.currentScene.gir.gotoAndPlay('idle');
				}

				// TODO Use EaselJS's MouseEvent API instead? //////////////////

				$('#stage').click(function() {
					$('body').removeClass('taco');
					$('#stage').unbind('click');
					Curator.transitionTo('CREDITS');
				});

				$('body').addClass('taco');
				break;
		}
	},

	disappear: function(){
		if(this.gir.x > -180){
			this.gir.x -= 2;
		}
	},

	destroy: function() {
		this._super();
	}

});