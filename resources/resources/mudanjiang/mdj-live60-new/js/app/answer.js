(function(){
    H.answer = {
        $current_box: $("#current_box"),
        $surveyed: $(".surveyed"),
        $answer_container: $('.answer-container'),
        $answer: $('.answer'),
        $submitBtn: $("#submitBtn"),
        $adver: $('.adver'),
        surveyInfoUuid: '',
        user_answer_uuid: '',
        checkedParams: '',
        isSubmit: false,
        isSelect: false,
        infordata: '',
        init: function(){
            this.get_theTitle();
            this.event();
            this.get_gg();
        },
        get_gg: function(){
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler', true);
        },
        get_theTitle: function(){
            getResult("api/question/info",{yoi: openid},'callbackQuestionInfoHandler',true);
        },
        answer_jk: function(){
            var me = H.answer;
            getResult("api/question/answer",{
                yoi: openid,
                suid: me.surveyInfoUuid,
                auid: me.checkedParams
            },'callbackQuestionAnswerHandler',true);
        },
        question_support: function(){
            getResult("api/question/support/"+ H.answer.surveyInfoUuid,{},'callbackQuestionSupportHandler',true);
        },
        event: function(){
            var me = H.answer;
            $('.back-home').click(function(e){
                e.preventDefault();
                toUrl('index.html');
            });
            me.$submitBtn.click(function(e){
                e.preventDefault();
                me.submitSurvey();
            });
        },
        submitSurvey: function () {
            var me = H.answer;
            if(me.isSubmit){
                return;
            }
            me.isSubmit = true;
            me.checkedParams = me.user_answer_uuid;
            if (null == me.checkedParams || me.checkedParams.length == 0) {
                showTips("请选择您赞同的观点");
                me.isSubmit = false;
                return;
            } else {
                me.checkedParams = me.checkedParams.substring(1);
            }
            me.answer_jk();
        },
        spellCurrentHtml: function (data){
            var me = H.answer;
            var resultStr = '<div class="arrow-box"><p  class="title">'+ data.qitems[0].qt +'<label>'+ (data.qitems[0].ty==1? '（单选）':'（可多选）') +'</label></p></div>' + '<ul class="ques">';
            if(data.qitems[0].aitems){
                $.each(data.qitems[0].aitems,function(i,item){
                    resultStr += '<li class="ques-lied" id="'+item.auid+'"><i></i><label>'
                    + item.at + '</label></li>';
                });
            }
            resultStr +='</ul>';

            me.$current_box.empty().html(resultStr);
            me.$answer_container.removeClass('none');
            me.$answer.removeClass('none');
        },
        spellpercentHtml: function (data){
            var me = H.answer, resultStr = '';
            $.each(me.infordata.qitems,function(i,item){
                resultStr = '<div class="arrow-box"><p  class="title">'+ item.qt +'</p></div> <!--<p class="result">本期调查结果为：</p>-->' + '<ul class="re-ul">';
                $.each(item.aitems,function(j,jtem){
                    resultStr += '<li><p class="tlt">'
                    + jtem.at +'</p><label class="percent">-</label ><div class="progress"><div class="progress-bar""></div></div></li>';
                });
            });
            resultStr +='</ul>';
            me.$surveyed.empty().html(resultStr);
            if(data.aitems){
                var countResult = 0,
                    checkedResult = 0,
                    sum = 0;
                $.each(data.aitems,function(i,item){
                    sum += item.supc;
                });
                $.each(data.aitems,function(j,jtem){
                    if(j == (data.aitems.length - 1)){
                        checkedResult = (100 - countResult)+"%";
                    }else{
                        checkedResult = (jtem.supc/sum * 100).toFixed(0) + '%';
                        countResult += (jtem.supc/sum * 100).toFixed(0)*1;
                    }
                    $('.percent').eq(j).text(checkedResult);
                    $('.progress-bar').eq(j).animate({
                        'width': checkedResult
                    }, 350);
                });
            }
            me.$answer.addClass('none');
            me.$answer_container.removeClass('none');
            me.$surveyed.removeClass('none');
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeLength = 0,
                nowTimeStr = timeTransform(data.cut),
                prizeActList = data.qitems,
                me = H.answer;
            me.spellCurrentHtml(data);
            prizeLength = prizeActList.length;
            //如果最后一轮结束
            if(comptime(prizeActList[prizeLength-1].qet,nowTimeStr) >= 0){
                me.$submitBtn.text('活动已结束').addClass('subed');
                me.isSelect = true;
                return;
            }
            for ( var i = 0; i < prizeLength; i++) {
                var beginTimeStr = prizeActList[i].qst;
                var endTimeStr = prizeActList[i].qet;
                //在活动时间段内且可以抽奖
                if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                    me.$submitBtn.text('提 交').addClass('sub');
                    return;
                }
                if(comptime(nowTimeStr,beginTimeStr) > 0){
                    me.$submitBtn.text('活动未开始').addClass('subed');
                    me.isSelect = true;
                    return;
                }
            }
        }
    };

    W.callbackQuestionInfoHandler = function(data){
        if(data.code == 0){
            var me = H.answer;
            me.surveyInfoUuid = data.qitems[0].quid;
            me.infordata = data;
            if(data.qitems[0].anws){
                console.log('答过题');
                me.question_support();
                return;
            }
            me.spellCurrentHtml(data);
            //me.currentPrizeAct(data);
            if(data.qitems[0].ty==1){
                $("li").on('click', function(){
                    if(me.isSelect){
                        return;
                    }
                    $(this).addClass('ques-li').removeClass('ques-lied');
                    $(this).siblings().removeClass('ques-li').addClass('ques-lied');
                    me.user_answer_uuid += "," + $(this).attr('id');
                });
            }else{
                $("li").on('click',function(){
                    if(me.isSelect){
                        return;
                    }
                    $(this).toggleClass('ques-li');
                    if($(this).hasClass('ques-li')){
                        me.user_answer_uuid += "," + $(this).attr('id');
                    }else{
                        me.user_answer_uuid = me.user_answer_uuid.replace("," + $(this).attr('id'),"");
                    }
                });
            }
        }else{
            return;
        }
    };

    W.callbackQuestionAnswerHandler = function (data){
        var me = H.answer;
        if (data.code == 0) {
            showTips("谢谢您参与调查");
            me.question_support();
        } else {
            me.$submitBtn.attr('class','subed');
        }
    };

    W.callbackQuestionSupportHandler = function (data){
        var me = H.answer;
        if(data.code == 0){
            me.spellpercentHtml(data);
        }
    };
    W.callbackLinesDiyInfoHandler = function(data) {
        if(data.code == 0 && data.gitems[3] && data.gitems[3].ib){
            H.answer.$adver.removeClass('none').find('img').attr('src',data.gitems[3].ib);
        }
    };
})(Zepto);
$(function(){
   H.answer.init();
});