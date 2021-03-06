var Play = AtelierJS.Scene.extend({

	init: function() {
		this._super();

		this.gir = Souvenirs.clone('gir');
		this.gir.x = bounds.width / 2;
		this.gir.y = bounds.height / 2;
		this.addChild(this.gir);
		this.gir.gotoAndPlay('idle');
		
		// TODO Use Easel MouseEvent API instead?

		$('#stage').click(function() {
			$('body').removeClass('taco');
			$('#stage').unbind('click');
			Curator.transitionTo('CREDITS');
		});

		$('body').addClass('taco');

	},

	appear: function(){
		this._super();
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
	},

	destroy: function() {
		this._super();
	}

});