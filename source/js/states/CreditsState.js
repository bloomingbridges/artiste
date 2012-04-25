var CreditsState = State.extend({

	init: function(){
		this._super( false );

		this.credits = Souvenirs.clone('credits');
		this.subStage.x = bounds.width;
		this.subStage.addChild(this.credits);
	},
	
	appear: function(){
		if(this.subStage.x > 0){
			this.subStage.x -= 2;
		}
		else{
			$('#stage').click(function() {
				Tween.get(StateMachine.currentState.credits).to({ y: -bounds.height, alpha: 0.0 }, 1000, Ease.cubicOut).call(function() {
					$('#stage').unbind('click');
					StateMachine.switchTo('INTRO');
				})
			});
			StateMachine.endTransition();
		}
	}

});