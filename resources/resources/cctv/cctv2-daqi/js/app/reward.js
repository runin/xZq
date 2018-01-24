+(function() {

    var reward = {
        init: function() {
			this.topicRound();
		},
		topicRound: function() {
			getResult('api/comments/topic/round', {}, 'callbackCommentsTopicInfo');
		}
    };
	
	W.callbackCommentsTopicInfo = function(data) {//活动奖励
		if(data && data.code==0) {
			var t = simpleTpl();
			var items = data.items;
			var ul = $('<ul class="exercise-reward-list"></ul>');
			for(var i=0,leg=items.length; i<leg; i++) {
				t._('<li>')
				t._('<span class="exercise-reward-img" style="background-image:url('+items[i].im+')"></span>')
				t._('<h2><i class="icon-attrow-a"></i>'+items[i].t+'</h2>')
				t._('<p>'+items[i].c+'</p>')
				t._('</li>')
			}
			var html = ul.append(t.toString());
			$(".exercise-reward-border").empty().append(html);
		}else{
			$(".exercise-reward-border").empty().append('<p class="noting">暂时啥都没有~</p>');
		}
	}
	
    reward.init();
})();
