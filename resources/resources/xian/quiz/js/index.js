var callbackCheckActivityHandler = function(data) {
};

$(function() {


    $('#quiz-loading').removeClass('none');
    $.ajax({
        type : "get",
        async : false,
        url : domain_url + "quiz/" + openid + "/checkactivity",
        dataType : "jsonp",
        jsonp : "callback",
        jsonpCallback : "callbackCheckActivityHandler",
        success : function(data) {
            $("#jf_val").html(data.integralVal);
            $("#quizOkCount").html(data.quizOkCount);
            var url=data.url,
                href = "<a href=\"javascript:toUrl('"+url+"');\" data-collect=\"true\" data-collect-flag=\"quiz-index-jf\" data-collect-desc=\"进入我的积分\"><p>我的积分：<span id=\"jf_val\">"+data.integralVal+"</span>分</p></a>";
            $('.user-info').html(href);
            $("#toQuiz_btn").attr("href", "javascript:toUrl('answers.html');");
            $("#toQuiz_btn").attr('class', 'btn as-now-btn');
            $("#toQuiz_btn").html("立即答题");
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
            $('body').css('minHeight', height);
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



