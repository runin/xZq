/**
 * 第一时间--答题抽奖页
 */
(function(){
    H.answer = {
        $tj: $('.tj'),
        $tm: $('.tm'),
        $paint: $('#paint'),
        $cover: $('#cover'),
        $wrapper: $('.wrapper'),
        $tc: $('#tc'),
        $gj: $('.gj'),
        $dt_error: $('.dt-error'),
        $confirm: $('.confirm'),
        $back: $('.back'),
        $close: $('.close'),
        $lottery_win: $('.lottery-win'),
        $h4: $('h4'),
        surveyInfoUuid: '',
        checkedParams: '',
        init: function(){
            this.documentSize();
            this.event();
            this.get_theTitle();
        },
        documentSize: function(){
            var win_h = $(window).height();
            $('body').css({
                'height': win_h
            });
        },
        get_theTitle: function(){
            getResult("api/question/round",{},'callbackQuestionRoundHandler',true);
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
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        event: function(){
            var me = H.answer;
            me.$tm.delegate('div.an-item span', 'click', function(e){
                e.preventDefault();
                if(me.$tj.hasClass('disabled')){
                    showTips('亲，您已经答过题了');
                    return;
                }
                me.checkedParams = $(this).attr('id');
                $(this).removeClass('select').addClass('selected').parent()
                    .siblings('div').find('.an-item span').removeClass('selected').addClass('select');
                $(this).closest('div.an-item').addClass('rotate').siblings('div').removeClass('rotate');
            });
            me.$tj.click(function(e){
                e.preventDefault();
                me.btn_animate(me.$tj);
                if($(this).hasClass('disabled')){
                    showTips('亲，您已经答过题了');
                    return;
                }
                if(me.checkedParams){
                    me.answer_jk();
                }else{
                    showTips("请选择您赞同的观点");
                }
            });
            me.$confirm.click(function(e){
                e.preventDefault();
                me.btn_animate(me.$confirm);
                var $mobile = $('.mobile'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val()),
                    $address = $('.address'),
                    address = $.trim($address.val());

                if (name.length > 20 || name.length == 0) {
                    showTips('请输入您的姓名，不要超过20字哦！');
                    $name.focus();
                    return false;
                }else if (!/^\d{11}$/.test(mobile)) {
                    showTips('这手机号，可打不通...');
                    $mobile.focus();
                    return false;
                }else if(address.length < 5 || address.length > 60) {
                    showTips('地址长度为5~60个字符');
                    return false;
                }

                getResult('api/lottery/award', {
                    oi: openid,
                    rn: encodeURIComponent(name),
                    ph: mobile,
                    ad: encodeURIComponent(address)
                }, 'callbackLotteryAwardHandler', true);

            });
            me.$back.click(function(e){
                e.preventDefault();
                me.btn_animate(me.$back, me.$tc.removeClass('slideInUp').addClass('slideOutDown'));
                setTimeout(function(){
                    me.init_page();
                },500);

            });
            me.$close.click(function(e){
                e.preventDefault();
                me.btn_animate(me.$close, me.$tc.removeClass('slideInUp').addClass('slideOutDown'));
                setTimeout(function(){
                    me.init_page();
                },500);
            });
            $('.back-home').click(function(e){
                e.preventDefault();
                toUrl('index.html');
            });
        },
        succ: function(){
            var me = H.answer;
            me.$h4.empty().text('以下是您的领奖信息');
            $('input').attr('disabled','disabled').addClass('disabled');
            me.$confirm.addClass('none');
            me.$back.removeClass('none');
        },
        init_page: function(){
            var me = H.answer;
            me.$h4.empty().text('请填写您的正确信息，以便顺利领奖');
            $('input').removeAttr('disabled').removeClass('disabled');
            me.$gj.addClass('none');
            me.$lottery_win.addClass('none');
            me.$dt_error.addClass('none');
            me.$confirm.addClass('none');
            me.$back.addClass('none');
            me.$tc.attr('class','tc animated none');
        },
        spellCurrentHtml: function(data){
            var me = H.answer,
                t = simpleTpl(),
                qitems = data.quizinfo || [],
                index = '';
            $('h1.answer-title span').text(data.qitems[0].qt);
            $.each(data.qitems[0].aitems,function(i,item){
                switch (i){
                    case 0:
                        index = 'A';
                        break;
                    case 1:
                        index = 'B';
                        break;
                    case 2:
                        index = 'C';
                        break;
                }
                t._('<div class="an-item">')
                    ._('<span class="select" id="'+item.auid+'" data-collect="true" data-collect-flag="first-time-answer-select'+ i +'" data-collect-desc="题目选项">'+ index +'</span>')
                    ._('<div class="an-con">'+ item.at + '</div>')
                ._('</div>');
            });
            me.$tm.html(t.toString())
        },
        gj: function(data){
            var me = this,
                Img = new Image(),
                win_w = $(window).width()*0.81,
                doc_h = 0;
            Img.src = 'images/paint.jpg';
            doc_h = Math.ceil(win_w/(518/229));
            this.$paint.addClass('zshow');
            this.$wrapper.css('height',doc_h);
            var lottery = new Lottery(this.$paint.get(0), 'images/paint.jpg', 'image', win_w+1, doc_h, function() {
                me.$paint.removeClass('zshow');
                setTimeout(function() {
                    me.$paint.addClass('none');
                    me.$cover.removeClass('none');
                }, 1500);
                if(!(data && data.result) || data.pt === 0){
                    me.$back.removeClass('none');
                    return;
                }
                if(data.pt === 1 || data.pt === 2){
                    me.$lottery_win.removeClass('none');
                    me.$confirm.removeClass('none');
                }
                recordUserOperate(openid, "第一时间", "first-time");
                recordUserPage(openid, "第一时间", 0);
            });

            Img.onload = function (){
                var pi = '',$lottery_win = $('.lottery-win');
                if(data && data.result){
                    pi = data.pi;
                    $lottery_win.find('.name').val(data.rn || '');
                    $lottery_win.find('.mobile').val(data.ph || '');
                    $lottery_win.find('.address').val(data.ad || '');
                }else{
                    pi = 'images/not.jpg';
                }
                lottery.init();
                setTimeout(function() {
                    me.$gj.removeClass('none').closest('section.tc').removeClass('none').addClass('slideInUp');
                    me.$cover.css({
                        "background": 'url('+ pi +') no-repeat 0 0',
                        "background-size": 'cover'
                    }).removeClass('none');
                }, 200);
            }
        },
        drawlottery:function(){
            var me = H.answer;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: {
                    oi: openid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    me.gj(data);
                },
                error : function() {
                    me.gj(null);
                }
            });
        }
    };
    W.callbackQuestionRoundHandler = function(data){
        if(data.code == 0){
            var me = H.answer;
            me.surveyInfoUuid = data.qitems[0].quid;
            me.spellCurrentHtml(data);
            me.question_record();
        }
    };
    W.callbackQuestionRecordHandler = function(data){
        if(data.code == 0){
            var me = H.answer;
            me.$tj.addClass('disabled').text('亲,您已经答过题了');
        }
    };
    W.callbackQuestionAnswerHandler = function (data){
        var me = H.answer;
        if (data.code == 0) {
            if(data.rs == 1){//答错题
                setTimeout(function() {
                    me.$dt_error.removeClass('none').closest('section.tc').removeClass('none').addClass('slideInUp');
                }, 300);
            }else if(data.rs == 2){//答对题
                me.drawlottery();
            }
            me.$tj.addClass('disabled').text('亲,您已经答过题了');
        }
    };
    W.callbackLotteryAwardHandler = function(data) {
        if (data.result) {
            H.answer.succ();
        }
    };
})(Zepto);
$(function(){
    H.answer.init();
});