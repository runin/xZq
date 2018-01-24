(function($) {
	H.index = {
        recordRange: null, // 展示的中奖记录时间区间
        $comments: $('#comments'),
        isLast: false,
        recordStr: "",
		init: function() {
			var me = this, winW = $(window).width(), winH = $(window).height();
			$('body').css({
				'width': winW,
				'height': winH
			});
            $('#article').css('height', winH*0.45+"px");
            $('#comments').css('height', (winH*0.45-66)+"px");
            W['barrage'] = this.$comments.barrage();
            W['barrage'].start(1);
            me.initRound();
		},
        initRound: function(){
            var me = this;
            getResult("api/lottery/round",{},"callbackLotteryRoundHandler");
        },
        initList: function(){
            var me = this;
            getResult("api/lottery/allrecord",{ol:1},"callbackLotteryAllRecordHandler");
        }
	};
    W.callbackLotteryRoundHandler = function (data) {
        var me = H.index;
        if(data.result){
            var nowTimeStr = timeTransform(data.sctm),
                prizeActList = data.la,
                prizeLength = prizeActList.length;
            //如果最后一轮结束
            if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                //展示最后一轮中奖记录
                return;
            }
            for ( var i = 0; i < prizeActList.length; i++) {
                var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                //在活动时间段内且可以抽奖
                if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                    // 展示当前时间段内的中奖记录
                    me.recordRange = {
                        "st": beginTimeStr,
                        "et": endTimeStr
                    };
                    if(i == (prizeLength-1)){
                        H.index.isLast = true;
                    }
                    setInterval(function () {
                        me.initList();
                    },4000);
                    return;
                }
                // 据下次摇奖开始
                if(comptime(nowTimeStr,beginTimeStr) > 0){
                    me.recordRange = {
                        "st": beginTimeStr,
                        "et": endTimeStr
                    };
                    if(i == (prizeLength-1)){
                        H.index.isLast = true;
                    }
                    setInterval(function () {
                        me.initList();
                    },4000);
                    return;
                }
            }
        }
    };
    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var rl = data.rl;
            if(rl && rl.length > 0){
                for (var i = 0; i < rl.length; i ++){
                    var item = rl[i];
                    var beginTimeStr = H.index.recordRange.st, endTimeStr = H.index.recordRange.et;
                    if(comptime(item.lt,beginTimeStr) <0 && comptime(item.lt,endTimeStr) >=0){
                        if(H.index.isLast){
                            var head = item.hi ? item.hi + "/64":"images/head.jpg";
                            $("#last_head").attr("src",head);
                            $("#last_name").text(item.un);
                            $("#last_prize").text(item.pn);
                            $("#last").removeClass("none");
                            return;
                        }else{
                            // 在时间范围内
                            var hmode = "<div class='c_head_img'><img src='./images/head.jpg' class='c_head_img_img'></div>";
                            if (item.hi) {
                                hmode = "<div class='c_head_img'><img src='" + item.hi + "/64' class='c_head_img_img'></div>";
                            }else{
                                hmode = "<div class='c_head_img'><img src='./images/head.jpg' class='c_head_img_img'></div>";
                            }
                            hmode += item.un + "&nbsp;&nbsp;&nbsp;&nbsp;获得&nbsp;&nbsp;&nbsp;&nbsp;" + item.pn;
                            if(H.index.recordStr.indexOf(item.ud) < 0){
                                barrage.pushMsg(hmode);
                                H.index.recordStr += item.ud+",";
                            }
                        }
                    }
                }
            }
        }
    }
})(Zepto);

$(function() {
	H.index.init();
});