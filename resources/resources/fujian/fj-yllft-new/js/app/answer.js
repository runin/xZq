var isanswer = true;
(function(){
    H.answer = {
        $current_box: $("#current_box"),
        $surveyed: $("#surveyed"),
        $answer_container: $('.answer-container'),
        $answer: $('.answer'),
        $submitBtn: $("#submitBtn"),
        $adver: $('.adver'),
        $outer: $(".outer"),
        surveyInfoUuid: '',
        user_answer_uuid: '',
        checkedParams: '',
        isSubmit: false,
        isSelect: false,
        infordata: '',
        anws: '',
        $new: $("#new"),
        init: function(){
            this.get_theTitle();
            this.event();
            this.get_gg();
            this.jump();
            H.dialog.rule.open();
        },
        get_gg: function(){
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler', true);
        },
        get_theTitle: function(){
            getResult("api/question/round",{yoi: openid},'callbackQuestionRoundHandler',true);
        },
        question_record: function(){
            getResult("api/question/record",{yoi: openid, quid: H.answer.surveyInfoUuid},'callbackQuestionRecordHandler',true);
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
            getResult("api/question/eachsupport",{quid: H.answer.surveyInfoUuid},'callbackQuestionSupportHandler',true);
        },
        event: function(){
            var me = H.answer;
            $('.back-home').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('index.html');
            });
            me.$submitBtn.click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                me.submitSurvey();
            });
            $('.topic').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("comments.html");
            });

            $(".new").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('yao.html');
            });
            $(".out2").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                window.location.href = '';
            });
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        submitSurvey: function () {
            var me = H.answer;
            if(me.isSubmit){
                return;
            }
            me.isSubmit = true;
            me.checkedParams = me.user_answer_uuid;
            if(me.isSelect){
                return;
            }
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
            var resultStr = '<div class="tlt"><p  class="title">'+ data.qitems[0].qt +'<label>'+ (data.qitems[0].ty==1? '（单选）':'（可多选）') +'</label></p><img src="'+data.qitems[0].bi+'" /></div>' + '<ul class="ques">';
            if(data.qitems[0].aitems){
                $.each(data.qitems[0].aitems,function(i,item){
                    resultStr += '<li class="ques-lied" id="'+item.auid+'"><label>'
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
                resultStr = '<div class="tlt"><p  class="title">'+ item.qt +'</p><img src="'+item.bi+'" /></div> <!--<p class="result">本期调查结果为：</p>-->' + '<ul class="re-ul">';
                $.each(item.aitems,function(j,jtem){
                    resultStr += '<li id="'+jtem.auid+'"><div class="perce-tlt"><p class="tlt">'
                    + jtem.at +'</p><label class="percent">-</label ></div><div class="progress"><div class="progress-bar""></div></div></li>';
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
                        if((100 - countResult) < 0){
                            checkedResult = 0+"%";
                        }
                    }else{
                        checkedResult = (jtem.supc/sum * 100).toFixed(0) + '%';
                        if((jtem.supc/sum * 100).toFixed(0) < 0){
                            checkedResult = 0+"%";
                        }
                        countResult += (jtem.supc/sum * 100).toFixed(0)*1;
                    }
                    $('.percent').eq(j).text(checkedResult);
                    $('.progress-bar').eq(j).animate({
                        'width': checkedResult
                    }, 350);
                });
                var selectedAttry = "";
                if(me.anws){
                    selectedAttry = me.anws.split(",");
                }else{
                    selectedAttry = me.checkedParams.split(",");
                }
                $.each(selectedAttry,function(a,atem){
                    $.each($(".re-ul li"),function(l,ltem){
                        if(atem == $(".re-ul li").eq(l).attr("id")){
                            $(".re-ul li").eq(l).find(".progress-bar").addClass("selected-li");
                        }
                    });
                });
            }
            me.$answer.addClass('none');
            me.$answer_container.removeClass('none');
            $(".surveyed").removeClass('none');
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        audio: function(src){
            var me = H.answer;
            var $audio = $('#ui-audio').audio({
                auto: false,			// 是否自动播放，默认是true
                stopMode: 'stop',	// 停止模式是stop还是pause，默认stop
                audioUrl:  src,
                steams: ["<img src='./images/icon-musical-note.png' />", "<img src='./images/icon-musical-note.png' />"],
                steamHeight: 150,
                steamWidth: 44
            });
        }
    };

    W.commonApiPromotionHandler = function(data){
        var me = H.answer;
        if(data.code == 0){
            if(data.url && data.desc){
                var link = data.url.indexOf(';');
                var de = data.desc.indexOf(';');
                me.$outer.attr('href', data.url.substring(0,link)).removeClass('none');
                $(".outer-text").attr('href', data.url.substring(0,link)).removeClass('none').html(data.desc.substring(0,de));
            }
        }
    };

    W.callbackQuestionRecordHandler = function(data) {
        var me = H.answer;
        if (data.code == 0) {
            if (data.anws) {
                me.anws = data.anws;
                me.question_support();
                return;
            }
        }
    };

    W.callbackQuestionRoundHandler = function(data){
        if(data.code == 0){
            var me = H.answer;
            me.surveyInfoUuid = data.qitems[0].quid;
            me.infordata = data;
            me.question_record();

            var now = new Date();
            var currentYMD = now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();
            if(new Date(currentYMD).getTime() != new Date(data.pst.split(" ")[0]).getTime()){
                me.isSelect = true;
                me.$submitBtn.attr('class','subed').text("本期活动已结束");
            }
            me.spellCurrentHtml(data);

            if(data.qitems[0].ty==1){
                $("li").on('click', function(){
                    if(me.isSelect){
                        return;
                    }
                    $(this).addClass('ques-li').removeClass('ques-lied');
                    $(this).siblings().removeClass('ques-li').addClass('ques-lied');
                    //me.user_answer_uuid += "," + $(this).attr('id');
                    me.user_answer_uuid = "," + $(this).attr('id');
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
        }
    };

    W.callbackQuestionSupportHandler = function (data){
        var me = H.answer;
        if(data.code == 0){
            me.spellpercentHtml(data);
        }
    };
    W.callbackLinesDiyInfoHandler = function(data) {
        var $info = $('.info'), me = H.answer;
        if(data.code == 0){
            $info.find("label").text(data.gitems[0].t);
            $info.find("img.people").attr("src",data.gitems[0].ib);
            $info.removeClass("none");
            me.audio(data.gitems[0].mu);
        }
    };
})(Zepto);
$(function(){
   H.answer.init();
});