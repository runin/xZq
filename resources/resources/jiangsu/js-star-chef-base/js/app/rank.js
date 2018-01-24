(function($){
    H.rank={
        sign: getQueryString("sign"),
        repeat_load : true ,
        init: function(){
            this.event();
            this.loadImg();
            this.priseselfrank();
            this.prisetop();
            this.friend_content(this.sign);
        },
        //查询用户自己的点赞排行接口
        priseselfrank: function(){
            getResult('api/friendcircle/priseselfrank', {oi: openid, sign: H.rank.sign}, 'callbackFriendcirclePriseselfrank', true);
        },
        //查询点赞top10接口
        prisetop: function(){
            getResult('api/friendcircle/prisetop', {sign: H.rank.sign}, 'callbackFriendcirclePrisetop', true);
        },
        //查询未点赞的好友接口
        unprisefriend: function(){
            getResult('api/friendcircle/unprisefriend', {oi: openid, sign: H.rank.sign}, 'callbackFriendcircleUnprisefriend', true);
        },
        friend_content :function(uuid){
            var me = H.rank;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/friendcircle/topicslist'+dev,
                data: {
                    oi: openid,
                    sign: uuid,
                    fs:0,
                    page:1,
                    ps:5
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackFriendcircleTopicslist',
                timeout: 11000,
                complete: function() {},
                success : function(data) {
                    hidenewLoading();
                    if(data.code == 0){
                        $("#btn-sz").removeClass("none");
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.friend_content(uuid);
                            },500);
                            //接口返回false
                        }
                    }
                },
                //接口出错
                error : function(xmlHttpRequest, error) {}
            })
        },
        loadImg: function(){
            var me = H.rank;
            var imgs = [
                "rank-top.png",
                "images/food-bg.jpg"
            ];
            loadImg = function () {
                for (var i = 0; i < imgs.length; i++) {//图片预加载
                    var img = new Image();
                    img.style = "display:none";
                    img.src = imgs[i];
                    img.onload = function () {
                        me.reisize();
                    }
                }
            };
            loadImg();
        },
        reisize: function(){
            var width = $(window).width(),
                height = $(window).height(),
                headerHeight = $("header").height()+60;
            $("#rank-con").css({
                "height": height - headerHeight
            }).removeClass("none");
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        event: function(){
            $("#headimgurl img").attr("src", headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/avatar.png');
            $("#nikcName").text(nickname || "匿名用户");
            var me = H.rank;
            $("#btn-back").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("index.html");
            });
            $("#btn-sz").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));

                $("#sharego").removeClass("none");
                $("#sharego").animate({'opacity':'1'},800);

                // 一键分享
                window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, getNewUrl(openid, me.sign));
                me.unprisefriend();
            });

            $("#sharego").tap(function(e){
                e.preventDefault();
                $("#sharego").animate({'opacity':'1'},function(){
                    $("#sharego").addClass("none");
                },800);
            });

        },
        spellHtml: function(data){
            var me = H.rank, t = simpleTpl();
            $.each(data.top10,function(i,item){
                t._('<li>')
                    ._('<div class="rank-name">'+ item.nn +'</div>')
                    ._('<div class="vote-num">'+ item.pc +'票</div>')
                    ._('<div class="ranking">第'+ item.rk +'名</div>')
                ._('</li>');
            });
            $("section.rank-con ul").append(t.toString());
        },
        spellUnprisefriendHtml: function(data){
            var me = H.rank, t = simpleTpl(),len = data.upf.length;
            if(len <= 8){
                $.each(data.upf,function(i,item){
                    t._('<li>'+ item.nn +'</li>');
                });
            }else{
                for(var i = 0; i < 8; i++){
                    if(i == 7){
                        t._('<li>'+ data.upf[i].nn +'<br/> ......</li>');
                    }else{
                        t._('<li>'+ data.upf[i].nn +'</li>');
                    }
                }
            }

            $("#unprisefriend ul").html(t.toString());
        }
    };
    W.callbackFriendcirclePriseselfrank = function(data){
        var me = H.rank;
        if(data.code == 0){
            $(".self .dz-num").text("点赞数："+ data.pc);
            $(".self .rank-num").text(" 我的排名："+ data.rk);
            $(".self").removeClass("none");
        }
    };
    W.callbackFriendcirclePrisetop = function(data){
        var me = H.rank;
        if(data.code == 0){
            me.spellHtml(data);
            if(data.top10.length == 0){
                $("section.rank-con ul").html('<p class="empty">积极参与互动<br>您的大名就会出现在这里</p>');
            }
        }else{
            $("section.rank-con ul").html('<p class="empty">积极参与互动<br>您的大名就会出现在这里</p>');
        }
    };
    W.callbackFriendcircleUnprisefriend = function(data){
        var me = H.rank;
        if(data.code == 0){
            me.spellUnprisefriendHtml(data);
        }
    }
})(Zepto);
$(function(){
    H.rank.init();
});
