(function($) {
    H.friend = {
        sign: getQueryString("sign"),
        friUid: getQueryString("friUid"),
        $ul: $(".cor-list"),
        hUl: 0,
        hLi: 0,
        page: 1,
        ps: 5,
        loadmore: true,
        allHeight: 0,
        headerHeight: $(".friend-head").height(),
        wHeight: $(window).height(),
        isSelfZan: false,
        $footer: $("footer"),
        localData: null,
        init: function () {
            var me = H.friend;
            this.user();
            this.event();
            if ($("body").attr("data-type") == "shareGo") {
                me.getList(me.friUid, me.sign);
            } else {
                me.getList(openid,'');
            }
        },
        event: function(){
            var me = this;
            /*进入分享页-S*/
            $("#btn-wyytz").click(function (e) {
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("index.html");
            });
            /*进入分享页-S*/

            $("#btn-back").click(function (e) {
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("index.html");
            });
        },
        user: function () {
            $("#headimgurl").attr("src", headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/avatar.png');
            $("#nikcName").text(nickname || "匿名用户");
        },
        scrollLoading: function(){
            var me = H.friend,
                range = 90, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;
            $("body").scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight  && me.page < maxpage && me.loadmore) {
                    me.getList();
                }
            });
        },
        getList: function (friUid, uuid) {
            var me = H.friend;
            getResult('api/friendcircle/topicslist', {
                oi: friUid,
                fs: 0,
                sign: uuid,
                page: me.page,
                ps: H.friend.ps
            }, 'callbackFriendcircleTopicslist', true);
            me.page++;
        },
        fill_friend: function (data) {
            var friend_items = data.items,
                friend_len = data.items.length,
                me = this,
                t = simpleTpl(),
                hImg = "images/avatar.png";

            if (friend_len < me.ps) {
                me.loadmore = false;
            }

            for (var i = 0; i < friend_len; i++) {
                var zanCon = friend_items[i].tps;
                if (zanCon && zanCon.length > 0) {
                    for (var m = 0; m < zanCon.length; m++) {
                        if (zanCon[m].oi == openid) {
                            H.friend.isSelfZan = true;
                            break;
                        }
                    }
                }

                var nameArray = [], nameString = friend_items[i].p;
                var index = nameString.lastIndexOf(',');
                nameArray[0] = nameString.substring(0, index);
                nameArray[1] = nameString.substring(index + 1, nameString.length);

                /*person-info-S*/
                t._('<div class="person-info pl" data-uid="' + friend_items[i].uid + '" data-index="' + i + '">')

                    /*头像昵称小模块-S*/
                    ._('<div class="pub-info">')
                    ._('<div class="pub-hImg"><label><img src="' + friend_items[i].a + '" /></label></div>')
                    ._('<div class="pub-nick">')
                    ._('<label>' + nameArray[0] + '</label>')
                    ._('</div>')
                    ._('</div>')
                    /*头像昵称小模块-E*/

                    ._('<div class="pub-content pl content-' + friend_items[i].uid + '">')
                    ._('<div class="pub-topic">' + friend_items[i].t + '</div>')
                    ._('<div class="pub-img-fuc fuc-' + friend_items[i].uid + '">');
                var hTopicImg = friend_items[i].ims.split(","), hTopicImgLen = hTopicImg.length;
                if (hTopicImgLen > 1) {
                    t._('<div class="pubImg pub-imgs" data-uid="' + friend_items[i].uid + '">')
                } else {
                    t._('<div class="pubImg pub-img" data-uid="' + friend_items[i].uid + '">')
                }
                for (var m = 0; m < hTopicImgLen; m++) {
                    t._('<span data-index="' + m + '"><img src="' + hTopicImg[m] + '" onerror ="$(this).parents(\'.pubImg\' ).addClass(\'none\')"/></span>')
                }
                t._('</div></div>');

                /*评论小模块-S*/
                t._('<div class="pub-fuc"><div class="fuc-btn">')
                    ._('<span class="fuc-cor"><i></i>')
                    ._('</span>');
                t._('</div></div>');
                /*评论小模块-E*/

                t._('<div class="pub-res"><div class="zan-friend">');
                if (zanCon && zanCon.length > 0) {
                    /*多少人点赞小模块-S*/
                    if (H.friend.isSelfZan) {
                        t._('<span class="fuc-zan zaned zan-' + friend_items[i].uid + '" data-key="' + friend_items[i].uid + '"><i></i>')
                            ._('<i class="zan-text">' + zanCon.length + '</i>')
                            ._('</span>')
                    } else {
                        t._('<span class="fuc-zan zan-' + friend_items[i].uid + '" data-key="' + friend_items[i].uid + '">')
                            ._('<i class="zan-love"></i>')
                            ._('<i class="zan-text">' + zanCon.length + '</i>')
                            ._('</span>')
                    }
                    /*多少人点赞小模块-E*/

                    /*我的好友点赞小模块-S*/
                    t._('<div class="pub-zan">');
                } else {

                    /*多少人点赞小模块-S*/
                    t._('<span class="fuc-zan zan-' + friend_items[i].uid + '" data-key="' + friend_items[i].uid + '">')
                        ._('<i class="zan-love"></i>')
                        ._('<i class="zan-text">0</i>')
                        ._('</span>')
                    /*多少人点赞小模块-E*/
                }
                t._('</div></div>')
                    /*我的好友点赞小模块-E*/

                    /*好友评论小模块-S*/
                    ._('<div class="pub-cor">')
                    ._('<ul class="cor-list list-' + friend_items[i].uid + '">');
                var hTopicCor = friend_items[i].comments || "", hTopicCorLen = hTopicCor.length;
                for (var n = 0; n < hTopicCorLen; n++) {
                    t._('<li class="cor-' + hTopicCor[n].uid + '"><label>' + filterXSS(hTopicCor[n].na) + ':</label><span>' + filterXSS(hTopicCor[n].co) + '</span></li>')
                }
                t._('</ul>')
                    ._('<span class="open none">展开评论</span>')
                    ._('<span  class="close none">收起评论</span>');
                t._('</div>')
                    /*好友评论小模块-E*/
                    ._('</div>')/*pub-res-E*/
                    ._('</div>')/*pub-content-E*/
                    ._('</div>')
                /*person-info-E*/
            }
            $(".friend-content").append(t.toString());
            $(".friend-content").removeClass("none");
            this.init_friendCor();
            this.event_handdle();
            this.scrollLoading();
            this.prisefriend();
        },
        //查询话题点赞的好友接口
        prisefriend: function(itemUid){
            var me = H.friend;

            var friend_items = me.localData.items,
                pfArray = [],
                time = 0;

            $.each(friend_items, function(i,item) {
                getResult('api/friendcircle/prisefriend', {
                    oi: openid,
                    uuid: item.uid
                }, 'callbackFriendcirclePrisefriend', true,true);
                W.callbackFriendcirclePrisefriend = function (data) {
                    if (data.code == 0) {
                        pfArray.push(data);
                        time ++;
                    }else{
                        time ++;
                    }
                };
            });

            var timer = setInterval(function () {
                if(time == friend_items.length){
                    clearInterval(timer);
                    me.spellZanFriendHeadimgurl(pfArray);
                }
            },1000)
        },
        spellZanFriendHeadimgurl: function(pfArray){
            for(var i = 0; i < pfArray.length; i++){

                var t = simpleTpl(),
                    zanCon = pfArray[i].pf,
                    zanConLength = pfArray[i].pf.length;
                var zanPer = "";
                if(zanConLength > 4){
                    zanPer = "<label><img src='"+ zanCon[0].hi +"/46'></label>" +
                    "<label><img src='"+ zanCon[1].hi +"/46'></label>" +
                    "<label><img src='"+ zanCon[2].hi +"/46'></label>" +
                    "<label><img src='"+ zanCon[3].hi +"/46'></label> 等";

                }else{
                    switch (zanConLength){
                        case 4:
                            zanPer = "<label><img src='"+ zanCon[0].hi +"/46'></label>" +
                            "<label><img src='"+ zanCon[1].hi +"/46'></label>" +
                            "<label><img src='"+ zanCon[2].hi +"/46'></label>" +
                            "<label><img src='"+ zanCon[3].hi +"/46'></label>";
                            break;
                        case 3:
                            zanPer = "<label><img src='"+ zanCon[0].hi +"/46'></label>" +
                            "<label><img src='"+ zanCon[1].hi +"/46'></label>"+
                            "<label><img src='"+ zanCon[2].hi +"/46'></label>";
                            break;
                        case 2:
                            zanPer = "<label><img src='"+ zanCon[0].hi +"/46'></label>" +
                            "<label><img src='"+ zanCon[1].hi +"/46'></label>";
                            break;
                        case 1:
                            zanPer = "<label><img src='"+ zanCon[0].hi +"/46'></label>";
                            break;
                    }
                }
                t._('<span class="zan-num">我的好友'+zanPer+'</span>');
                $(".content-"+ pfArray[i].uuid).find(".pub-zan").append(t.toString());
            }
        },
        init_friendCor: function () {
            var me = this;
            $(".cor-list").each(function () {
                var hUl = $(this).height();
                var hLi = me.calH(3, $(this)) + me.calH(2, $(this)) + me.calH(1, $(this)) + me.calH(0, $(this)) + 1;
                $(this).attr("data-open", hUl);
                $(this).attr("data-close", hLi);
                if (hLi > 0 && $(this).find("li").length > 4) {
                    if (hUl > hLi) {
                        $(this).addClass("more").css({
                            "height": hLi,
                            "overflow": "hidden"
                        });
                        $(this).parent().find(".open").removeClass("none");
                        $(this).parent().find(".close").addClass("none");
                    } else {
                        $(this).addClass("less").css({
                            "height": hUl,
                            "overflow": "auto"
                        });
                        $(this).parent().find(".open").addClass("none");
                        $(this).parent().find(".close").addClass("none");
                    }
                } else {
                    $(this).parent().find(".open").addClass("none");
                    $(this).parent().find(".close").addClass("none");
                }

            });
        },
        calH: function (num, me) {
            return me.find("li:eq(" + num + ")").height();
        },
        cor_list: function () {

        },
        imgReady: function (_srcList, fn) {
            var i = 0;
            imgLoadComplate(_srcList[i]);
            function imgLoadComplate(imgSrc) {
                var _img = new Image();
                _img.src = imgSrc;
                _img.onload = function () { //判断是否加载到最后一个图片
                    if (i < _srcList.length - 1) {
                        i++;
                        imgLoadComplate(_srcList[i]);
                    } else {
                        if (fn) {
                            fn();
                        }
                    }
                }
            }
        },
        event_handdle: function () {
            var me = this;
            $(".open").click(function (e, fn) {
                e.preventDefault();
                $(this).addClass("none");
                var $cor = $(this).parent().find(".cor-list");
                $cor.css({
                    "overflow": "hidden"
                }).animate({"height": +$cor.attr("data-open") + "px"}, "fast", function () {
                    fn && fn();
                }).removeClass("more").addClass("less");

                $(this).parent().find(".close").removeClass("none");
            });

            $(".close").click(function (e) {
                e.preventDefault();
                $(this).addClass("none");
                var $cor = $(this).parent().find(".cor-list");
                $cor.animate({"height": +$cor.attr("data-close") + 1 + "px"}, "fast").removeClass("less").addClass("more");
                $(".scroll").scrollToTop($(".scroll").scrollTop() - ($cor.attr("data-open") - $cor.attr("data-close")));
                $(this).parent().find(".open").removeClass("none");
            });
            $(".pubImg span").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                $(".showImg").find(".swiper-container").remove();
                var imgUid = $(this).parent().attr("data-uid");
                $(".showImg").attr("data-imgUid", imgUid);
                me.showImg($(this).attr("data-index"));
            });

            /*$(".pub-fuc").click(function(e){
             e.preventDefault();
             e.stopPropagation();
             var $me = $(this);
             $(".ctrls").addClass("none");
             $(".fuc-btn ").removeClass("scaleIn")
             if(!$(this).find(".fuc-btn").hasClass("scaleIn")){
             $(this).find(".fuc-btn").addClass("scaleIn");
             setTimeout(function(){
             $me.find(".fuc-zan").removeClass("none");
             $me.find(".fuc-cor").removeClass("none");
             },200);
             }else{
             return;
             }

             });

             $(".scroll").click(function(e){
             e.preventDefault();
             if($(".fuc-btn").hasClass("scaleIn")){
             $(".fuc-btn").removeClass("scaleIn");
             $(".fuc-zan").addClass("none");
             $(".fuc-cor").addClass("none");
             }else{
             return;
             }

             });*/
            $(".showImg").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).find(".swiper-container").remove();
                $(this).addClass("none");
            });
            $(".fuc-zan").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(this).hasClass("zaned")) {
                    return;
                }
                $(this).addClass("zaned");
                var $me = $(this);
                $me.find(".zan-love").addClass("scale");
                var zanUid = $(this).attr("data-key");
                var zanNum = parseInt($(".zan-" + zanUid).find(".zan-text").text());

                $(this).find(".zan-text").text(zanNum + 1);
                getResult('api/friendcircle/topicprise', {
                    uuid: zanUid,
                    oi: openid,
                    nn: (nickname || "匿名用户"),
                    hu: (headimgurl ? headimgurl + '/' + yao_avatar_size : "images/avatar.png" )
                }, 'callbackFriendcircleTopicprise');

                /*var beforNum = parseInt($(".zan-"+zanUid).find(".zan-text").html());
                 if(beforNum > 0){
                 $(".zan-"+zanUid).find(".zan-text").html("我,"+$(".zan-"+zanUid).find(".zan-text").html());
                 }else{
                 $(".zan-"+zanUid).find(".zan-text").html("我"+$(".zan-"+zanUid).find(".zan-text").html());
                 }
                 $(".zan-"+zanUid).find(".zan-text").html(beforNum+1);*/

                setTimeout(function () {
                    $me.parent().removeClass("scaleIn");
                    $me.find(".zan-love").removeClass("scale");
                }, 1000)
            });

            var el = document.querySelector('.friend-content');
            el.addEventListener('touchstart', function (e) {
                $(".ctrls").addClass("none").attr("data-uid", '').find("input").val("");
                me.$footer.show();
            });

            $(".fuc-cor").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $me = $(this);
                var $parent = $me.parents(".person-info");
                var index = $me.parents(".person-info").attr("data-index");
                var key = $parent.attr("data-uid");
                var index = $me.parents(".person-info").attr("data-index");
                me.$footer.hide();
                $(".ctrls").removeClass("none").attr("data-uid", key);
                $("#input-comment").focus();
                if ($(".fuc-btn").hasClass("scaleIn")) {
                    $(".fuc-btn").removeClass("scaleIn");
                    $(".fuc-zan").addClass("none");
                    $(".fuc-cor").addClass("none");
                }
                if ($parent.find(".cor-list").hasClass("more")) {
                    $parent.find(".open").trigger("click", function () {
                        H.friend.allHeight = H.friend.allH(index) + H.friend.headerHeight;
                        $(".scroll").scrollToTop(H.friend.allHeight - H.friend.wHeight + 20);
                        if (is_android()) {
                            setTimeout(function () {
                                $(".scroll").scrollToTop(H.friend.allHeight - H.friend.wHeight + 320);
                            }, 1000)
                        }
                    });
                } else {
                    H.friend.allHeight = H.friend.allH(index) + H.friend.headerHeight;
                    $(".scroll").scrollToTop(H.friend.allHeight - H.friend.wHeight + 20);
                    if (is_android()) {
                        setTimeout(function () {
                            $(".scroll").scrollToTop(H.friend.allHeight - H.friend.wHeight + 320);
                        }, 1000)
                    }
                }


            });
            $("#btn-send").click(function (e) {
                e.preventDefault();
                if ($(this).hasClass("request")) {
                    return;
                }
                var comment = $.trim($("#input-comment").val()) || '',
                    comment = comment.replace(/<[^>]+>/g, ''),
                    len = comment.length;

                if (len < 1) {
                    showTips('请先说点什么吧', 4);
                    $("#input-comment").focus();
                    return;
                } else if (len > 100) {
                    showTips('观点字数超出了100字', 4);
                    $("#input-comment").focus();
                    return;
                }
                $(this).addClass("request");
                shownewLoading();
                var corId = $(".ctrls").attr("data-uid");
                var nick = nickname || "匿名用户";
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/comments/save' + dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: corId,
                        ty: 1,
                        nickname: encodeURIComponent(nick),
                        headimgurl: headimgurl ? headimgurl + '/' + yao_avatar_size : ""
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackCommentsSave',
                    complete: function () {
                        hidenewLoading();
                    },
                    success: function (data) {
                        $("#btn-send").removeClass("request");
                        if (data.code == 0) {
                            $(".list-" + corId).css({
                                "height": "auto"
                            });
                            $(".list-" + corId).append('<li><label>' + filterXSS(nick) + ':</label><span>' + filterXSS(comment) + '</span></li>');
                            $(".list-" + corId).attr("data-height", $(".list-" + corId).height()).attr("data-open", $(".list-" + corId).height());
                            $(".list-" + corId).css({
                                "height": $("list-" + corId).attr("height"),
                            });

                            $(".ctrls").addClass("none");
                            me.$footer.show();
                            $("#input-comment").val('');
                            return;
                        }
                        showTips("评论失败");
                    }
                });
            });
        },
        allH: function (index) {
            var allH = 0;
            for (var i = 0; i <= index; i++) {
                allH += $($(".person-info").get(i)).height();
            }
            return allH;
        },
        swiper: function (index) {
            var swiper = new Swiper('.showImg .swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
            swiper.slideTo(parseInt(index), 0, false);
        },
        showImg: function (index) {
            var me = this, t = simpleTpl();
            var imgList = [];
            $(".fuc-" + $(".showImg").attr("data-imgUid")).find(".pubImg span").each(function () {
                imgList.push($(this).find("img").attr("src"))
            });
            $(".showImg").removeClass("none");
            $(".load-bg").removeClass("none");
            H.friend.imgReady(imgList, function () {
                t._('<div class="swiper-container">')
                    ._('<div class="swiper-wrapper">')
                for (var i = 0, len = imgList.length; i < len; i++) {
                    t._('<div class="swiper-slide"><div class="slide-content"><img src="' + imgList[i] + '"/></div></div>')
                }
                t._('</div>')
                    ._('<div class="swiper-pagination"></div>')
                    ._('</div>')
                $(".load-bg").addClass("none");
                $(".showImg").append(t.toString());
                me.swiper(index);
                $(".slide-content").each(function () {
                    $(this).height($(this).find("img").height());
                })

            });
        },
        btn_animate: function(str){
        str.addClass('flipInY');
        setTimeout(function(){
            str.removeClass('flipInY');
        },200);
    }
    };
    W.callbackFriendcircleTopicprise = function (data) {
        if (data.code == 0) {

        }

    };
    W.callbackFriendcircleTopicslist = function (data) {
        var me = H.friend;
        if (data.code == 0) {
            me.localData = data;
            me.fill_friend(data);
            $("#not-vs").addClass("none");
        } else {
            me.loadmore = false;
            if (me.page == 2) {
                $("#not-vs").removeClass("none");
                $(".copyright").addClass("copyright-position");
            }
        }
    };
})(Zepto);
$(function(){
    H.friend.init();
});