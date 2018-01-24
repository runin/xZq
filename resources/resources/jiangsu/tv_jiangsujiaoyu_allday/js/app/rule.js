(function($) {
	
	H.rule = {
		isLoaded: false,
		$dialog: $('.rule-wrapper').parent(),
		
		init: function() {
			H.rule.$dialog.find('.dialog-content').html('');
			this.resize();
			this.bindBtns();
		},

		resize: function(){
			var dialogHeight = $('.rule-wrapper').css('height');
			var oldHeight = this.$dialog.find('.dialog-content').css('height');
			var bottom = this.$dialog.find('.dialog-content').css('padding-bottom');
			this.$dialog.find('.dialog-content').css({
				'height' : (parseInt(oldHeight, 10) - parseInt(bottom, 10)) / H.resize.heightRatio 
			});

			var oldHeight = this.$dialog.find('.dialog-header h2').css('line-height');
			this.$dialog.find('.dialog-header h2').css({
				'line-height' : parseInt(oldHeight, 10) / H.resize.heightRatio + 'px',
				'height' : parseInt(oldHeight, 10) / H.resize.heightRatio
			});

			
		},

		bindBtns: function(){
			$('.rule-wrapper .dialog-close').click(function(){
				H.rule.$dialog.addClass('none');
			});
		},

		fillRule: function(data){
			H.rule.$dialog.find('.dialog-content').html(data.rule);
			H.rule.isLoaded = true;
		},

		ruleError: function(){
			alert('网络错误，请稍后重试');
			H.rule.$dialog.addClass('none');
		},

		show: function(){
			$('.rule-wrapper').parent().removeClass('none');
			if(!H.rule.isLoaded){
				showLoading();
				getResult('api/common/rule',null, 'commonApiRuleHandler');
			}
		}
	};

	W.commonApiRuleHandler = function(data){
		hideLoading();
        if(data.code == 0){
            H.rule.fillRule(data);
        }else{
            H.rule.ruleError();
        }
    };

	H.rule.init();

})(Zepto);