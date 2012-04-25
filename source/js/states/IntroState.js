var IntroState = State.extend({

	init: function(){
		this._super( false );

		this.gir = Souvenirs.clone('gir');
		this.subStage.addChild(this.gir);
		this.gir.x = bounds.width + 90;
		this.gir.y = bounds.height / 2;
		this.gir.gotoAndPlay('walk');
	},

	appear: function(){
		this._super();
	},
	
	update: function(){
		if(this.gir.x > bounds.width / 2){
			this.gir.x -= 2;
		}
		else {
			StateMachine.switchTo('PLAY');
		}
	},

	disappear: function(){
		this._super();
	},

	destroy: function() {
		this._super();
	}

});