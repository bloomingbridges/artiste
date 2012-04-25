var PlayState = State.extend({

	init: function() {
		this._super(false);

		this.gir = Souvenirs.clone('gir');
		this.gir.x = bounds.width / 2;
		this.gir.y = bounds.height / 2;
		this.subStage.addChild(this.gir);
		this.gir.gotoAndPlay('idle');
		
		// TODO Use Easel MouseEvent API instead?

		$('#stage').click(function() {
			$('#stage').removeClass('taco');
			$('#stage').unbind('click');
			StateMachine.transitionTo('CREDITS');
		});

		$('#stage').addClass('taco');
	},

	update: function() {
		if(mouseInside){
			if(this.gir.currentAnimation === 'idle'){
				this.gir.gotoAndPlay('walk');
			}
		}
		else {
			this.gir.gotoAndPlay('idle');
		}
	},

	disappear: function() {
		if(this.gir.x > -180){
			this.gir.x -= 2;
		}
	}

});