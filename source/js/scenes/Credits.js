var Credits = AtelierJS.Scene.extend({

	init: function(blueprint){
		this._super(blueprint);

		this.credits = Souvenirs.clone('credits');
		this.subStage.x = bounds.width;
		this.subStage.addChild(this.credits);

		this.tacoArray = [];
		for(var t=0; t<=9; t++){
			var tempTaco;
			tempTaco = Souvenirs.clone('taco');
			tempTaco.x = 45 + Math.random() * (bounds.width - 120);
			tempTaco.y = -100;
			tempTaco.vY = 5 + Math.floor(Math.random() * 5);
			tempTaco.rotation = Math.floor(Math.random() * 360);
			this.tacoArray.push(tempTaco);
			this.subStage.addChild(this.tacoArray[t]);
		}

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
				tempTaco.x = 45 + Math.random() * (bounds.width - 120);
				tempTaco.y = -100;
				tempTaco.vY = 5 + Math.floor(Math.random() * 5);
				tempTaco.rotation = Math.floor(Math.random() * 360);
			}
		}
	},

	disappear: function(){
		this._super();
	},

	destroy: function() {
		this._super();
	}

});