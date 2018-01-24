(function ($) {
	var classId = {
		$ruleBtn: $("#rule-btn")
	};
	
    H.index = {
        init: function () {
            this.ruleFn();
        },
		ruleHtml: function() {//规则
			var t = simpleTpl();
			t._('<section class="pop-bg">')
			t._('<div class="pop-box bounce-in-sides">')
			t._('<a href="javascript:void(0)" class="pop-close"></a>')
			t._('<h2 class="rule-top"></h2>')
			t._('<div class="rule-con"></div>')
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
			this.closePop(".pop-close",".pop-box",".pop-bg");
		},
		ruleFn: function() {
			classId.$ruleBtn.click(function(e) {
				e.preventDefault();
				H.index.ruleHtml()
			    getResult('api/common/rule', {}, 'commonApiRuleHandler');
			});
		},
		closePop: function(a,b,c) {//关闭弹层
			$(a).click(function(e) {
				e.preventDefault();
				$(b).addClass("bounce-out-down");
				setTimeout(function() {
					$(c).remove();
				},800);
			});
		}
    };

    W.commonApiRuleHandler = function(data) {
		if(data && data.code==0) {
			$(".rule-con").html(data.rule);
		}
    };

    H.index.init();

})(Zepto);