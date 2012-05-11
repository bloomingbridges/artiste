var Credits = AtelierJS.Scene.extend({

	init: function(blueprint){
		this._super(blueprint);

		this.subStage.x = bounds.width;
		this.credits = Souvenirs.clone('credits');
		this.credits.alpha = 0.5;
		this.subStage.addChild(this.credits);
	},
	
	appear: function(){
		if(this.subStage.x > 0){
			this.subStage.x -= 2;
		}
		else{
			$('#stage').click(function() {
				Tween.get(Curator.currentScene.subStage)
					 .to({ y: -bounds.height, alpha: 0.0 }, 1000, Ease.cubicOut)
					 .call(function() {
						$('#stage').unbind('click');
						Curator.switchTo('INTRO');
					});
			});
			this.appeared.dispatch();
		}
	},

	update: function(){
		for(var t=0; t<=9; t++){
			var tempTaco = this.tacoArray[t];
			tempTaco.y += tempTaco.vY;
			if(tempTaco.y > bounds.height * 2){
				this.positionTaco(tempTaco);
			}
		}
	},

	positionTaco: function(taco){
		taco.x = 45 + Math.random() * (bounds.width - 120);
		taco.y = -100;
		taco.vY = 5 + Math.floor(Math.random() * 5);
		taco.rotation = Math.floor(Math.random() * 360);
	},

	disappear: function(){
		this._super();
	},

	destroy: function() {
		this._super();
	}

});