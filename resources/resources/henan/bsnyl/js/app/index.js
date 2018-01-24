(function($){
    H.index = {
        myVedio:document.getElementById("video"),
        $video: $("#video"),
        $bmQp: $("#bm-qp"),
        $sjt: $("#sjt"),
        $tab: $("#tab"),
        $index: $("#index"),
        $sign: $("#sign"),
        $answer: $("#answer"),
        $sidelights: $("#sidelights"),
        $items: $(".items"),
        url: null,
        noUid: null,
        openUid: null,
        guid: null,
        init: function(){
            this.event();
            this.resize();
            this.articleInfo();
        },
        //获取当前剧集列表信息
        articleInfo: function(){
            getResult('api/article/list',{},'callbackArticledetailListHandler');
        },
        init_qqvideo: function(){
            var me = this,
                winW = $(window).width(),
                winH = $(window).height();

            var videoWidth = parseInt(winW*0.9);
            var videoHeight = parseInt(videoWidth/(379/214));
            var w = videoWidth - 15;
            var videoHtml = '<iframe frameborder="0" style="width:'+w+'px;height:'+videoHeight+'px;" width="'+w+'" height="'+videoHeight+'"  src="'+me.url+'" allowfullscreen></iframe>';
            me.$video.html(videoHtml).css({
                "width": videoWidth,
                "height": videoHeight
            });

        },
        guessCount: function(key){
            var me = this;
            getResult('api/voteguess/guessplayer',{
                yoi: openid,
                guid: me.guid,
                pluids: key
            },'callbackVoteguessGuessHandler');
        },
        event: function(){
            var me = this;
            /*$(me.myVedio).one('loadeddata', function() {
                shownewLoading();
                // 暂停，但下载还在继续
                me.myVedio.pause();

                // 启动定时器检测视频下载进度
                var timer = setInterval(function() {
                    var end = me.getEnd(me.myVedio),
                        duration = me.myVedio.duration;
                    //alert(end +'=='+duration);
                    if(end < duration) {
                        return
                    }
                    hidenewLoading();
                    var width = $(me.myVedio).parent().width();

                    // 下载完了，开始播放吧
                    $(me.myVedio).attr("width",width);
                    me.myVedio.play();
                    console.log("下载完了，开始播放吧");
                    clearInterval(timer);
                }, 1000);
            });

            $('body').delegate('#video,.play', 'click', function(e) {
                e.preventDefault();
                if (me.myVedio.paused){
                    me.myVedio.play();

                }else{
                    me.myVedio.pause();
                    $(".play").animate({opacity:1},500);
                }
            });

            $(".play").animate({opacity:0},500);
            me.videoEvent("ended");*/
            H.sign.guessInfo();
            $(".switch").tap(function(e){
                e.preventDefault();
                $(this).find("div").toggleClass("open");
                if($(this).find("div").hasClass("open")){
                    me.guessCount(me.noUid);
                }else{
                    me.guessCount(me.openUid);
                }
            });

            $("#dm").click(function(e){
                e.preventDefault();
                me.btn_animate($(this).find("img"));
                if(me.$index.hasClass("none")){
                    me.init_qqvideo();
                    me.$items.addClass("none");
                    me.$index.removeClass("none");
                }else{
                    me.$tab.animate({'opacity':'0'}, 800, function() {
                        me.$sjt.removeClass("none");
                        me.$tab.addClass("none").css({'opacity':'1'});
                    });
                }
                if(!me.$bmQp.hasClass("none")){
                    me.$bmQp.addClass("none")
                }
                $(".huaxu div").empty();
            });

            $(".sjt").tap(function(e){
                e.preventDefault();
                me.$sjt.animate({'opacity':'0'}, 800, function() {
                    me.$sjt.addClass("none").css({'opacity':'1'});
                    me.$tab.removeClass("none");
                });
            });

            var bmFlag = true;
            $("#bm-img").click(function(e){
                e.preventDefault();
                me.btn_animate($(this).find("img"));
                me.$bmQp.toggleClass("none");
                if(bmFlag){
                    H.sign.init();
                    H.sign.guessInfo();
                }
                bmFlag = false;
                $(".huaxu div").empty();
            });

            $("#wysjm").click(function(e){
                e.preventDefault();
                me.$video.html("");
                me.$items.addClass("none");
                me.$sign.removeClass("none");
                H.sign.$role.removeClass('none');
                H.sign.$succeed.addClass('none');
                if(localStorage.getItem("wysjmType-"+ H.sign.signQuuid+ "-" +openid)){
                    H.sign.voteSupport();
                }else{
                    H.sign.signInfo();
                }
                if(!me.$bmQp.hasClass("none")){
                    me.$bmQp.addClass("none")
                }
            });

            $("#bmpcy").click(function(e){
                e.preventDefault();
                me.$video.html("");
                me.$items.addClass("none");
                me.$sign.removeClass("none");
                H.sign.$role.addClass("none");
                H.sign.$succeed.addClass('none');
                if(localStorage.getItem("bmpcyType-"+ H.sign.signQuuid + "-" +openid)){
                    H.sign.$info.addClass('none');
                    H.sign.$press.addClass("none");
                    H.sign.$succeed.removeClass("none");
                }else{
                    H.sign.signInfo();
                }
                if(!me.$bmQp.hasClass("none")){
                    me.$bmQp.addClass("none")
                }
            });

            var flagDt = true;
            $("#dt").tap(function(e){
                e.preventDefault();
                me.$video.html("");
                me.btn_animate($(this).find("img"));
                me.$items.addClass("none");
                me.$answer.removeClass("none");
                if(flagDt){
                    H.answer.init();
                }
                flagDt = false;
                if(!me.$bmQp.hasClass("none")){
                    me.$bmQp.addClass("none")
                }
                 $(".huaxu div").empty();
            });

            var flagHx = true;
            $("#hx").tap(function(e){
                e.preventDefault();
                if(!me.$sidelights.hasClass("none")){
                	return;
                }
                me.$video.html("");
                me.btn_animate($(this).find("img"));
                me.$items.addClass("none");
                me.$sidelights.removeClass("none");
                if(flagHx){

                }
                flagHx = false;
                if(!me.$bmQp.hasClass("none")){
                    me.$bmQp.addClass("none")
                }
                H.huaxu.init();
            });
        },
        // 获取视频已经下载的时长
        getEnd:function(video) {
            var end = 0;
            try {
                end = video.buffered.end(0) || 0;
                end = parseInt(end * 1000 + 1) / 1000
            } catch(e) {
            }
            return end
        },
        videoEvent:function(e){
            var me = this;
            me.myVedio.addEventListener(e,function(){
                if(e == "ended"){
                    $(".play").animate({opacity:1},500);
                }
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        resize: function(){
            var me = this, winW = $(window).width(),
                winH = $(window).height();
            me.$index.css({
                "width": winW,
                "height": winH
            });
            me.$sign.css({
                "width": winW,
                "height": winH
            });
            me.$answer.css({
                "width": winW,
                "height": winH
            });
            me.$sidelights.css({
                "width": winW,
                "height": winH
            });

        }
    };
    //获取当前剧集列表信息
    W.callbackArticledetailListHandler = function(data){
        var me = H.index;
        if(data.code == 0){
            me.url = data.arts[0].gu;
            me.init_qqvideo();
            setTimeout(function() {
                H.talk.dmResize();
            },1000);
        }
    };
    W.callbackVoteguessGuessHandler = function(data){};
})(Zepto);

;(function($) {
    H.talk = {
        uid: null,
        input: $("#input_text"),
        maxid: 0,
        pageSize: 10,
        meArray: new Array(),
        isBottom:false,
        $tip:$("#mesg-tip"),
        isFirst:true,
        init: function() {
            var me = this;
            me.event();
            me.question();
            me.canBottom();
            $('.avatar-img').attr('src',headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/avatar.png');
        },
        dmResize: function(){
            var me = this, winW = $(window).width(),
                winH = $(window).height(),
                videoHeight = 0,
                tabHeight = 0,
                syHeight = 0;

            videoHeight =  winW*0.9/(580/329);
            $(".index .video-div .video").css({
                "height": videoHeight
            });

            tabHeight = $(".tab").height();
            if(!tabHeight){ tabHeight = 50;}
            syHeight = winH - (videoHeight + tabHeight + 80) ;

            $(".page-con").css({
                "height": Math.round(syHeight)
            }).removeClass("none");

            var storage = W.localStorage;
            if(!storage.getItem("pageLoadCount-"+ openid)){
                storage.setItem("pageLoadCount-"+ openid, 1);
            }else{
                storage["pageLoadCount-"+ openid] = parseInt(storage.getItem("pageLoadCount-"+ openid)) + 1;//必须格式转换
            }
            if(storage["pageLoadCount-"+ openid]< 4){
                $("#qp").animate({'opacity':'0'}, 10000, function() {
                    setTimeout(function(){
                        $("#qp").addClass("none");
                    },10000);
                });
            }else{
                $("#qp").addClass("none");
            }


        },
        event: function(){
            var me = this;
            $("#input_submit").click(function(){
                if($.trim(H.talk.input.val()).length == 0){
                    showTips("什么都没有说呢");
                    return false;
                } else if ($.trim(H.talk.input.val()).length < 3){
                    showTips("多说一点吧！至少3个字哦");
                    return false;
                } else if ($.trim(H.talk.input.val()).length > 100){
                    showTips("评论字数不能超过100个字哦");
                    return false;
                };
                if (H.talk.uid != '') {
                    getResult('api/comments/save',{
                        'co' : encodeURIComponent(H.talk.input.val()),
                        'op' : openid,
                        'nickname': nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "匿名用户",
                        'headimgurl': headimgurl ? headimgurl : "",
                        'tid': H.talk.uid,
                        'ty': 1
                    }, 'callbackCommentsSave', true, null);
                };
            });
            me.$tip.click(function(){
//                var body = document.getElementById('body');
//                body.scrollTop = $('#comment_list').height();
                H.talk.$tip.animate({
                        opacity: 0
                    }, 500,
                    'ease-out');
                $('#body').scrollToTop($('#comment_list').height());
            });
        },
        question:function(){
            getResult("api/comments/topic/round",{},"callbackCommentsTopicInfo",true);
        },
        fillAfterSubmit: function(){
            var me = this;
            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : "images/avatar.png";
            var comments = "";
            comments += '<li>'
            + '<label class="fr"><img src="' + h +'"></label>'
            + '<div class="ron ron-me">'
            + '<p class="tar">我</p>'
            + '<span class="triangle-right"></span>'
            + '<div class="article-right fr">'+me.input.val()+'</div>'
            + '</div>'
            + '</li>';
            $('#comment_list').append(comments);

            $('#body').scrollToTop($('#comment_list').height());
        },
        room: function(){
            getResult('api/comments/room', {
                'anys' : H.talk.uid,
                'maxid' : H.talk.maxid,
                'ps' : H.talk.pageSize
            }, 'callbackCommentsRoom');
        },
        isin: function(uid){
            for(var i = 0;i < H.talk.meArray.length;i++){
                if(H.talk.meArray[i] == uid){
                    return true;
                }
            }
            return false;
        },
        canBottom: function() {
            var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
            var nScrollTop = 0;   //滚动到的当前位置
            var nDivHight = $("#body").height();
            $('#body').scroll(function(){
                nScrollHight = $(this)[0].scrollHeight;
                nScrollTop = $(this)[0].scrollTop;
                if(nScrollTop + nDivHight >= nScrollHight-3){
                    H.talk.isBottom = true;
                    H.talk.$tip.animate({
                            opacity: 0
                        }, 500,
                        'ease-out');
                }else{
                    H.talk.isBottom = false;
                }
            });
            $('#body').on('touchmove',function(e){
                if($('#comment_list').height()> nDivHight){
                    e.stopPropagation();
                }
            });
        }
    };

    W.callbackCommentsTopicInfo = function(data){
        if(data.code == 0){
            var item = data.items[0];
            H.talk.uid = item.uid;
            $("#title-img").attr("src",item.av);
            $("#title-per").html(item.p);
            $("#title-que").html(item.t);
            H.talk.room();
            setInterval(function(){
                H.talk.room();
            },5000);
        }
    };
    W.callbackCommentsSave = function(data) {
        if(data.code == 0){
            H.talk.fillAfterSubmit();
            H.talk.input.blur().val('');
            H.talk.meArray.push(data.uid);
        }else{
            showTips(data.message);
        };
    };
    W.callbackCommentsRoom = function(data){
        if(data.code == 0){
            var items = data.items;
            if(items.length > 0){
                H.talk.maxid = data.maxid;
                var t = simpleTpl();
                for(var i = items.length-1;i >= 0;i--){
                    if(H.talk.isin(items[i].uid)){
                        continue;
                    }
                    var h= items[i].hu ? items[i].hu + '/' + yao_avatar_size : "images/avatar.png";
                    var n = items[i].na ? items[i].na:'匿名用户';
                    if(items[i].op == hex_md5(openid)){
                        t._('<li>')
                            ._('<label class="fr"><img src="'+h+'"></label>')
                            ._('<div class="ron ron-me">')
                            ._('<p class="tar">我</p>')
                            ._('<span class="triangle-right"></span>')
                            ._('<div class="article-right fr">'+items[i].co+'</div>')
                            ._('</div>')
                            ._("</li>");
                    }else{
                        t._('<li>')
                            ._('<label class="fl"><img src="'+h+'"></label>')
                            ._('<div class="ron">')
                            ._('<p>'+n+'</p>')
                            ._('<span class="triangle"></span>')
                            ._('<div class="article fl">'+items[i].co+'</div>')
                            ._('</div>')
                            ._("</li>");
                    }
                }
                $('#comment_list').append(t.toString());

                if(H.talk.isFirst){
                    $('#body').scrollToTop($('#comment_list').height());
                    H.talk.isFirst = false;
                    return;
                }

                if(!H.talk.isBottom){
                    if(!H.talk.isFirst){
                        /*H.talk.$tip.animate({
                                opacity: 1
                            }, 500,
                            'ease-in');*/
                    }else{
                        H.talk.isFirst = false;
                    }
                }else{
                    $('#body').scrollToTop($('#comment_list').height());
                }
            }
        }
    };


})(Zepto);

;(function($){
    H.sign = {
        periodUuid: null,
        pluids: null,
        signQuuid: null,
        $role: $(".role"),
        $info: $("#info"),
        $jcPress: $(".jc-press"),
        $zfPress: $(".zf-press"),
        $press: $(".press"),
        $succeed: $("#succeed"),
        eventFlag: true,
        init: function(){
            if(this.eventFlag){
                this.event();
            }
            this.eventFlag = false;
        },
        //获取报名活动信息
        signInfo: function(){
            getResult('api/entryinfo/info',{},'callbackActiveEntryInfoHandler');
        },
        //获取竞猜信息（最新）
        guessInfo: function(){
            getResult('api/voteguess/inforoud',{},'callbackVoteguessInfoHandler');
        },
        //获取该期所有选手累积的票数
        voteSupport: function() {
            var me =  H.sign;
            getResult('api/voteguess/allplayertickets', { periodUuid: me.periodUuid }, 'callbackVoteguessAllplayerticketsHandler');
        },
        event: function(){
            var me = H.sign;

            $(".role label").click(function(e){
                e.preventDefault();
                $(".role label").removeClass("selected");
                $(this).addClass("selected");

                me.pluids = $(this).attr("id");
            });
            $('#upload-box').upload({
                url: domain_url + 'fileupload/image', 	// 图片上传路径
                numLimit: 3,							// 上传图片个数
                formCls: 'upload-form'					// 上传form的class
            });
            $("#submit").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                //  必填信息
                var $name = $("input[name='name']"),
                    $age = $("input[name='age']"),
                    $sex = $("input[name='sex']"),
                    $phone = $("input[name='phone']"),
                    $address = $("input[name='address']");

                name = $.trim($name.val());
                age = parseInt($.trim($age.val()),10);
                sex = $.trim($sex.val());
                phone = $.trim($phone.val());
                address = $.trim($address.val());


                if(name.length < 2 || name.length > 30){
                    showTips('姓名长度为2~30个字符');
                    $name.focus();
                    return false;
                }else if(!age || age <= 0 || age > 200){
                    showTips('请填写年龄');
                    return false;
                }else if(!(sex == "男" || sex == "女")) {
                    showTips('请填写您的性别');
                    $sex.focus();
                    return false;
                }else if(!/^\d{11}$/.test(phone)){
                    showTips('这手机号，可打不通哦...');
                    $phone.focus();
                    return false;
                }else if (address.length < 8 || address.length > 80 || address.length == 0) {
                    showTips('请填写您的详细地址');
                    $address.focus();
                    return false;
                }

                if(!me.$role.hasClass("none")){
                    if (!me.pluids) {
                        showTips('请选择角色');
                        return false;
                    }
                }



                var $images = "";
                $(".img-preview").each(function(){
                    if($(this).attr('data-url')){
                        $images += $(this).attr('data-url') + ',';
                    }
                });

                if($images == ""){
                    showTips("请上传照片");
                    return false;
                }else{
                    $images = $images.substr(0,$images.length-1);
                }

                var postSign = function(type){
                    var remarkValue = "";
                    if(type){
                        remarkValue = encodeURIComponent($("#"+me.pluids).attr("data-type"));
                    }
                    getResult('api/entryinfo/asyncsave', {
                        openid : openid,
                        name : encodeURIComponent(name),
                        age: age,
                        sex: parseInt(sex == "男" ? '1' : '2'),
                        phone : phone,
                        address : encodeURIComponent(address),
                        images : $images,
                        remark: remarkValue
                    }, 'callbackActiveEntryInfoSaveHandler',true);
                };

                if(!me.$role.hasClass("none")){
                    $.ajax({
                        type: 'GET',
                        async: false,
                        url: domain_url + 'api/voteguess/guessplayer' + dev,
                        data: {
                            yoi: openid,
                            guid: me.$role.attr("data-guid"),
                            pluids: me.pluids
                        },
                        dataType: "jsonp",
                        jsonpCallback: 'callbackVoteguessGuessHandler',
                        complete: function() {},
                        success: function(data) {
                            if(data.code == 0){console.log(1);
                                postSign(true);
                            }
                        },
                        error: function(xmlHttpRequest, error) {}
                    });
                }else{
                    me.$press.addClass("none");
                    postSign(false);
                }

            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    //获取竞猜信息（最新）
    W.callbackVoteguessInfoHandler = function(data){
        var me = H.sign;
        if(data.code == 0){
            var items = data.items[0];
            me.periodUuid = data.pid;
            me.pluids = items.pitems[1].pid;
            me.$role.attr('data-guid',items.guid);
            me.$role.find("label:nth-child(2)").attr('id',items.pitems[0].pid).text(items.pitems[0].na);
            me.$role.find("label:last-child").attr('id',items.pitems[1].pid).text(items.pitems[1].na);

            $(".jc-img").attr("src", items.pitems[0].im);
            $(".zf-img").attr("src", items.pitems[1].im);
            me.$jcPress.attr("id","bar-"+items.pitems[0].pid);
            me.$zfPress.attr("id","bar-"+items.pitems[1].pid);

            H.index.openUid = data.items[1].pitems[0].pid;
            H.index.noUid = data.items[1].pitems[1].pid;
            H.index.guid = data.items[1].guid;

        }else{
            me.$role.addClass('none');
        }
    };
    //获取该期所有选手累积的票数
    W.callbackVoteguessAllplayerticketsHandler = function(data) {
        var sum = 0,me = H.sign;
        if (data.code == 0 && data.items) {
            var attrs = data.items;
            $.each(attrs, function(i,item){
                sum += attrs[i].cunt;
            });

            var max = 0,index = 0;
            for(var j = 0,length = attrs.length; j < length; j++){
                if(max < attrs[j].cunt){
                    max = attrs[j].cunt;
                    index = j;
                }
            }

            max = max + sum*(2/3);
            $.each(attrs, function(i,item){
                var percent = (item.cunt/sum * 100).toFixed(0) + '%';
                $('#bar-'+item.puid).css({
                    'height': (item.cunt/max)*145 + 'px'
                }, 350).parent().addClass('change').attr('data-content', percent);
            });

            me.$press.removeClass("none");
            me.$succeed.removeClass("none");
            me.$info.addClass('none');
        }
    };
    //获取报名活动信息
    W.callbackActiveEntryInfoHandler = function(data){
        var me = H.sign;
        if(data.code == 0){
            me.signQuuid = data.t;
            me.$info.removeClass('none');
        }else{
            $("#not-start").removeClass('none');
            me.$info.addClass('none');
            me.$succeed.addClass("none");
        }
    };
    //报名接口
    W.callbackActiveEntryInfoSaveHandler = function(data) {
        var me = H.sign;
        if (data.code == 0) {
            if(me.$role.hasClass("none")){
                me.$info.addClass('none');
                me.$succeed.removeClass("none");
                localStorage.setItem("bmpcyType-"+ me.signQuuid+ "-" +openid, true);
            }else{
                me.voteSupport();
                localStorage.setItem("wysjmType-"+ me.signQuuid+ "-" +openid, true);
            }

        } else {
            showTips("资料提交失败，请稍后重试");
        }
    };
})(Zepto);

;(function(){
    H.answer = {
        quid: null,
        checkedParams: null,
        init: function(){
            this.event();
            this.question_round();
        },
        event: function(){
            var me = H.answer;
            $(".swiper-wrapper").delegate('.radio', 'click', function(e) {
                e.preventDefault();

                if($(this).hasClass('disabled')){
                    showTips("您已经投过票了，下次再来吧");
                    return;
                }

                $(this).toggleClass("selected");
                if($(this).hasClass("selected")){
                    me.checkedParams = $(this).attr('id');
                }else{
                    me.checkedParams = null;
                }
            });
            $(".swiper-wrapper").delegate('.qd', 'click', function(e){
                e.preventDefault();
                H.sign.btn_animate($(this));
                if($(this).hasClass('disabled')){
                    showTips("您已经投过票了，下次再来吧");
                    return;
                }

                if(me.checkedParams){
                    getResult("api/question/answer",{
                        yoi: openid,
                        suid: me.quid,
                        auid: me.checkedParams
                    },'callbackQuestionAnswerHandler',true);
                }else{
                    showTips("请选择一个选项");
                }
            });
        },
        question_round: function(){
            getResult("api/question/round",{ },'callbackQuestionRoundHandler',true);
        },
        question_record: function(){
            getResult("api/question/record",{yoi: openid, quid: H.answer.quid},'callbackQuestionRecordHandler',true);
        },
        fillResult: function(data) {
            var me = this, t = simpleTpl(),
                items = data.qitems[0].aitems || [],
                length = items.length;
            me.quid = data.qitems[0].quid;
            for (var i = 0; i < length; i ++) {
                var im = items[i].aimg || "./images/reserve-default.jpg";
                t._('<section class="swiper-slide slide' + i + '">')
                    ._('<section class="image-wrapper"><p></p><img class="swiper-lazy" src="./images/reserve-default.jpg" data-src="' + im + '"></section>')
                    ._('<div class="radio" id=' + items[i].auid + ' data-collect="true" data-collect-flag="dt-radio-btn" data-collect-desc="答题页-选项按钮"> ' + items[i].at + '</div>')
                    ._('<a href="#" class="reserve qd" data-collect="true" data-collect-flag="btn-qd" data-collect-desc="答题页-确定按钮"><i></i></a>')
                ._('</section>')
            }
            $("h1.tlt").text(data.qitems[0].qt);
            $('.swiper-wrapper').html(t.toString());
            $('.swiper-control').animate({'opacity':'1'}, 500);
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 1,
                paginationClickable: true,
                keyboardControl: true,
                spaceBetween: 100,
                speed: 600,
                effect: 'coverflow',
                coverflow: {
                    rotate: -30,
                    slideShadows : false
                },
                iOSEdgeSwipeDetection : true,
                preloadImages: false,
                lazyLoading: true,
                onSlideChangeEnd: function(swiper) {
                    $('.swiper-slide').removeClass('boom');
                    $('.slide' + parseInt(swiper.activeIndex)).addClass('boom');
                }
            });
            me.swiperContainer = swiper;
            me.question_record();
        }
    };

    W.callbackQuestionRoundHandler = function(data){
        var me = H.answer;
        if(data.code == 0){
            me.fillResult(data);
        }
    };

    W.callbackQuestionRecordHandler = function(data) {
        var me = H.answer;
        if (data.code == 0) {
            if (data.anws) {
                $(".qd").addClass('disabled');
                $(".radio").addClass('disabled');
                $("#"+data.anws).addClass("selected")
            } else {
                $(".qd").removeClass('disabled');
            }
        }
    };

    W.callbackQuestionAnswerHandler = function(data){
        var me = H.answer;
        if (data.code == 0) {
            showTips("投票成功！继续看节目吧！");
            /*if(data.rs == 1){//答错题
                showTips("抱歉！答错了", 2, 2000);
            }else if(data.rs == 2){//答对题
                showTips("恭喜您答对了！", 2, 2000);
            }*/
            $(".qd").addClass('disabled');
            $(".radio").addClass('disabled');
        }
    }
})(Zepto);
;(function($) {
    H.huaxu = {
    	init : function(){
    		this.flower_video();
    	},
    	flower_video : function(){
    		$(".huaxubox").height($(window).height()-64)
        	$(".huaxu div").height($(".huaxu div").width()*0.55);
        	getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler',false);
        },
	}
     W.callbackLinesDiyInfoHandler = function(data){
		if(data.code == 0&&data.gitems[0]&&data.gitems[1]){
			var $div = $(".huaxu div");
			var url_after = data.gitems[0].info +'&width=' + $div.width() + '&height=' + $div.height(); 
			var url_interview = data.gitems[1].info+'&width=' + $div.width() + '&height=' + $div.height(); 
			$("#video-after").html('<iframe src="'+ url_after +'"></iframe>');
			$("#video-interview").html('<iframe src="'+ url_interview +'"></iframe>');
		}else{
			$(".huaxubox").addClass("none");
		}
	};
})(Zepto);
;(function($) {
    H.lottery = {
        dec: 0,
        type: 2,
        index: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        pingFlag: null,
        roundData: null,
        nextPrizeAct: null,
        canJump: true,
        safeFlag: false,
        lastRound: false,
        isTimeOver: false,
        repeat_load: true,
        crossLotteryFlag: false,    //跨天摇奖倒计时标识  true为有跨天摇奖 false为没有跨天摇奖
        crossLotteryCanCallback: false,
        $lotteryCountdown: $("#lottery-countdown"),
        init: function() {
            this.event();
            this.lotteryRound_port();
        },
        event: function() {
            var me = this;

            $("#go-lottery").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("yao.html");
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        ping: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/common/time' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'commonApiTimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.t){
                        me.safeLotteryMode('off');
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        checkPing: function() {
            var me = this, delay = Math.ceil(60000*2*Math.random() + 60000*1);
            me.pingFlag = setTimeout(function(){
                clearTimeout(me.pingFlag);
                me.ping();
                me.checkPing();
            }, delay);
        },
        lotteryRound_port: function() {
            var me = this;
            shownewLoading();
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.result == true){
                        me.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - data.sctm;
                        me.roundData = data;
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.lotteryRound_port();
                            },500);
                        }else{
                            me.change();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    me.safeLotteryMode('on');
                }
            });
        },
        safeLotteryMode: function(flag) {
            var me = this;
            if (flag == 'on') {//抽奖轮次接口出错
                me.checkPing();
                me.$lotteryCountdown.addClass('none');
                $('.fail-tips').removeClass('none');
                me.safeFlag = true;
            } else if (flag == 'off') {
                clearTimeout(me.pingFlag);
                me.pingFlag = null;
                me.lotteryRound_port();
                me.$lotteryCountdown.removeClass('none');
                $('.fail-tips').addClass('none');
                me.safeFlag = false;
            } else {
                me.safeLotteryMode('off');
            };
            hidenewLoading();
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [], day = nowTimeStr.split(" ")[0];
            // 判断是否为跨天摇奖 配置文件中crossdayLimit跨天摇奖阀值，默认2h
            var lastLotteryEtime = prizeActListAll[prizeActListAll.length - 1].pd + ' ' + prizeActListAll[prizeActListAll.length - 1].et;
            var lastLotteryNtime = prizeActListAll[prizeActListAll.length - 1].nst;
            var crossDay = timeTransform(new Date().setDate(new Date(lastLotteryEtime).getDate() + 1)).split(" ")[0];
            var minCrossDay = crossDay + ' 00:00:00';
            var maxCrossDay = timeTransform(new Date(minCrossDay).getTime() + crossdayLimit);
            if(comptime(lastLotteryNtime, minCrossDay) <= 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
                me.crossLotteryFlag = true;
            } else {
                me.crossLotteryFlag = false;
            }

            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    if (me.crossLotteryFlag) {
                        me.type = 1;
                        me.crossCountdown(prizeActList[prizeLength - 1].nst);
                    } else {
                        me.type = 3;
                        me.endType = 3;
                        me.change();
                    }
                    return;
                }
                //如果第一轮未开始
                if(comptime(prizeActList[0].pd + " " + prizeActList[0].st,nowTimeStr) < 0){
                    me.beforeCountdown(prizeActList[0]);
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) <= 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if(i < prizeActList.length - 1){
                            var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
                            if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
                                me.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                me.lastRound = false;
                                me.nextPrizeAct = prizeActList[i+1];
                            } else {
                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                me.endType = 1;
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            me.endType = 3;
                            me.lastRound = true;
                        }
                        me.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                me.safeLotteryMode('on');
                return;
            }
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$lotteryCountdown.find(".countdown-tip").html('摇奖开始');
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty().addClass("none");
            me.$lotteryCountdown.find(".countdown-tip").html("摇奖结束").addClass("none");
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            me.index++;
            me.canJump = true;
            hidenewLoading();
            $("#go-lottery").text("去摇奖");
            if(getQueryString('markJump') == "yaoClick"){
                return;
            }
            toUrl("yao.html?cb41faa22e731e9b="+cb41faa22e731e9b);
        },
        // 跨天摇奖开启倒计时
        crossCountdown: function(nextTime) {
            var me = this;
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            me.type = 1;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$lotteryCountdown.find(".countdown-tip").html('摇奖开始');
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            me.$lotteryCountdown.find('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                            if (me.crossLotteryCanCallback) {
                                if(!me.isTimeOver){
                                    var delay = Math.ceil(1000*Math.random() + 500);
                                    me.isTimeOver = true;
                                    me.crossLotteryCanCallback = false;
                                    me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                    shownewLoading(null, '请稍后...');
                                    setTimeout(function(){
                                        me.lotteryRound_port();
                                    }, delay);
                                }
                            } else {
                                if(me.type == 1){
                                    //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                    if(!me.isTimeOver){
                                        me.isTimeOver = true;
                                        me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                        shownewLoading(null,'请稍后...');
                                        setTimeout(function() {
                                            me.nowCountdown(me.pal[me.index]);
                                        }, 1000);
                                    }
                                }else if(me.type == 2){
                                    //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                    if(!me.isTimeOver){
                                        me.isTimeOver = true;
                                        if(me.index >= me.pal.length){
                                            if (me.crossLotteryFlag) {
                                                me.type = 1;
                                                me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                                shownewLoading(null,'请稍后...');
                                                setTimeout(function() {
                                                    me.crossCountdown(me.pal[me.pal.length - 1].nst);
                                                }, 1000);
                                            } else {
                                                me.type = 3;
                                                me.change();
                                            }
                                            return;
                                        }
                                        me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                        shownewLoading(null,'请稍后...');
                                        var i = me.index - 1;
                                        if(i < me.pal.length - 1){
                                            var endTimeStr = me.pal[i].pd + " " + me.pal[i].et;
                                            var nextBeginTimeStr = me.pal[i + 1].pd + " " + me.pal[i + 1].st;
                                            if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
                                                // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                                                me.endType = 2;
                                            } else {
                                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                                me.endType = 1;
                                            }
                                        }
                                        setTimeout(function(){
                                            if(me.endType == 2){
                                                me.nowCountdown(me.pal[me.index]);
                                            }else if(me.endType == 1){
                                                me.beforeCountdown(me.pal[me.index]);
                                            } else {
                                                me.change();
                                            }
                                        },1000);
                                    }
                                }
                            }
                        }else{
                            me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        change: function() {
            var me = H.lottery;
            me.$lotteryCountdown.removeClass('none').find(".countdown-tip").html('本期摇奖已结束！');
            me.$lotteryCountdown.find('.detail-countdown').html("");
            hidenewLoading();
        }
    };
})(Zepto);
$(function(){
    H.index.init();
    H.talk.init();
    H.lottery.init();
});





