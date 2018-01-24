var callbackCheckActivityHandler = function(data) {
};

$(function() {


    $('#quiz-loading').removeClass('none');
    $.ajax({
        type : "get",
        async : false,
        url : domain_url + "quiz/check/"+openid,
        dataType : "jsonp",
        jsonp : "callback",
        jsonpCallback : "callbackCheckHandler",
        success : function(data) {
            $("#jf_val").html(data.integralVal);
            var href = "<a href=\"javascript:toUrl('user.html');\" data-collect=\"true\" data-collect-flag=\"quiz-index-jf\" data-collect-desc=\"进入我的积分\"><p>我的积分：<span id=\"jf_val\">"+data.integralVal+"</span>分</p></a>";
            $('.user-info').html(href);
            if(data.code == 0){
                $("#toQuiz_btn").attr("href", "javascript:toUrl('win.html?act="+data.act+"');");
                $("#toQuiz_btn").attr('class', 'btn as-now-btn');
                $("#toQuiz_btn").html("立即抽奖");
            }else if(data.code == 3){
            	$("#toQuiz_btn").attr('class', 'btned as-now-btn');
                $("#toQuiz_btn").html("抽奖未开始");
            }else if(data.code == 2){
            	$("#toQuiz_btn").attr('class', 'btned as-now-btn');
                $("#toQuiz_btn").html("抽奖已结束");
            }else{
            	$("#toQuiz_btn").attr('class', 'btned as-now-btn');
                $("#toQuiz_btn").html("抽奖已结束");
            }
        },
        error : function() {
        }
    });



    $.ajax({
        type:"get",
        async : false,
        url:domain_url+"quiz/serviceRule",
        dataType:"jsonp",
        jsonp : "callback",
        jsonpCallback : "callbackRuleHandler",
        success:function(data){
            $('.action-rule').append(data.rule);
            $('#quiz-loading').addClass('none');
            $('.rule').removeClass('none');
            var height = $('.main').outerHeight();
            $('body').css('minHeight', height+50);
        },
        error:function(){
        }
    })


    $('#avatar').click(function(e) {
        e.preventDefault();

        var $this = $(this),
            $info_tips = $('#info-tips'),
            $tip = $info_tips.find('.tip'),
            width = $('.user-info').outerWidth();

        if ($this.hasClass('avatar-curr')) {
            $tip.addClass('none');
            $info_tips.stop().animate({width: width * 0.13}, 100, function() {
                $info_tips.addClass('none');
                $this.removeClass('avatar-curr');
            });
        } else {
            $this.addClass('avatar-curr');
            $info_tips.removeClass('none').stop().animate({width: width * 0.9}, 200, function() {
                $tip.removeClass('none');
            });
        }
    });


});



