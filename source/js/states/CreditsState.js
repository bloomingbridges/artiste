var CreditsState = State.extend({

	init: function(){
		this._super( false );

		this.credits = Souvenirs.clone('credits');
		this.subStage.x = bounds.width;
		this.subStage.addChild(this.credits);

		
		this.tacoArray = [];
		for(var t=0; t<=9; t++){
			var tempTaco;
			tempTaco = Souvenirs.clone('taco');
			tempTaco.x = 120 + (Math.random() * bounds.width - 120);
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
				Tween.get(StateMachine.currentState.credits)
					 .to({ y: -bounds.height, alpha: 0.0 }, 1000, Ease.cubicOut)
					 .call(function() {
						$('#stage').unbind('click');
						StateMachine.switchTo('INTRO');
					});
			});
			StateMachine.endTransition();
			console.log(this.tacoArray);
		}
	},

	update: function(){
		for(var t=0; t<=9; t++){
			this.tacoArray[t].y += this.tacoArray[t].vY;
		}
	},

	disappear: function(){
		this._super();
	},

	destroy: function() {
		this._super();
	}

});