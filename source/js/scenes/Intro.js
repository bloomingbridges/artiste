var Intro = AtelierJS.Scene.extend({

	init: function(){
		this._super();

		this.gir = Souvenirs.clone('gir');
		this.addChild(this.gir);
		this.gir.x = bounds.width + 90;
		this.gir.y = bounds.height / 2;
		this.gir.vX = 2;
		this.gir.gotoAndPlay('walk');
	},

	appear: function(){
		this._super();
	},
	
	update: function(){

		if(this.gir.x > bounds.width / 2){
			this.gir.x -= this.gir.vX;
		}
		else {
			Curator.switchTo('PLAY');
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