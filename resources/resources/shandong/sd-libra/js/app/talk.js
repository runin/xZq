(function($) {
    H.talk = {
        uid: null,
        input: $("#input_text"),
        maxid: 0,
        pageSize: 10,
        meArray: new Array(),
        isBottom:false,
        $tip:$("#mesg-tip"),
        isFirst:true,
        isinit:false,
        nn:'',
        delayPlus:0,
        init: function() {
            var me = this;
            me.event();
            me.question();
            me.canBottom();
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
                $('#body').scrollToTop($('#comment_list').height());
            });
            $(".cherry").click(function(){
               location.href = "https://shop13635631.koudaitong.com/v2/showcase/homepage?kdt_id=13443463&redirect_count=1";
            });
        },
        question:function(){
            getResult('api/user/info_v2', {matk: matk}, 'callbackUserInfoHandler');
        },
        fillAfterSubmit: function(){
            var me = this;
            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : "images/head.jpg";
            var comments = "";
            if(H.talk.delayPlus > 24){
                var data = new Date();
                comments += '<li style="text-align: center">'
                    + '<span class="DATE">' + (data.getHours()>9?data.getHours().toString():'0' + data.getHours()) +':'+ (data.getMinutes()>9?data.getMinutes().toString():'0' + data.getMinutes())
                    + "</span>"
                    + "</li>";
            }
            comments += '<li>'
                + '<img class="fr" src="' + h +'">'
                + '<div class="ron me">'
                + '<p class="tar">我</p>'
                + '<span class="triangle-right"></span>'
                + '<div class="article-right fr">'+me.input.val()+'</div>'
                + '</div>'
                + '</li>';
            H.talk.delayPlus = 0;
            $('#comment_list').append(comments);
            //$(".DATE").css({"margin-left":($('#comment_list').width() - $(".DATE").width())*0.5 +"px"});
            $('#body').scrollToTop(9999999);
        },
        room: function(){
            getResult('api/comments/room', {
                //'anys' : H.talk.uid,
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
                var nDivHight = $("#body").height();
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
        }
    };
    W.callbackUserInfoHandler = function(data){
        if(data.result == true){
            $(".handimg").attr("src",data.hi+ '/' + yao_avatar_size);
            H.talk.nn = data.nn;
        }else if(data.result == false){
            $(".handimg").attr("src","images/head.jpg");
            H.talk.nn = '匿名用户';
        }
        H.talk.room();
        setInterval(function(){
            if(H.talk.delayPlus < 26){
                H.talk.delayPlus++;
            }
            H.talk.room();
        },10000);
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
            H.talk.delayPlus=0;
            var items = data.items,DATE=false;
            if(H.talk.delayPlus > 24){
                DATE = new Date().getHours()+':'+new Date().getMinutes();
            }
            if(items.length > 0){
                H.talk.maxid = data.maxid;
                var t = simpleTpl();
                if(DATE !== false){
                    t._('<li style="text-align: center">')
                        ._('<span class="DATE">' + DATE)
                        ._("</span>")
                        ._("</li>");
                }
                for(var i = items.length-1;i >= 0;i--){
                    if(H.talk.isin(items[i].uid)){
                        continue;
                    }
                    var h= items[i].hu ? items[i].hu + '/' + yao_avatar_size : "images/head.jpg";
                    //$(".handimg").attr("src",h);
                    var n = items[i].na ? items[i].na:'匿名用户';
                    if(items[i].op == hex_md5(openid)){
                        t._('<li>')
                            ._('<img class="fr" src="'+h+'">')
                            ._('<div class="ron me">')
                            ._('<p class="tar">我</p>')
                            ._('<span class="triangle-right"></span>')
                            ._('<div class="article-right fr">'+items[i].co+'</div>')
                            ._('</div>')
                            ._("</li>");
                    }else{
                        t._('<li>')
                            ._('<img class="fl" src="'+h+'">')
                            ._('<div class="ron">')
                            ._('<p>'+n+'</p>')
                            ._('<span class="triangle"></span>')
                            ._('<div class="article fl">'+items[i].co+'</div>')
                            ._('</div>')
                            ._("</li>");
                    }
                }
                if(H.talk.isFirst){
                    t._('<li style="text-align: center">')
                        ._('<span class="welcome">欢迎' + H.talk.nn + "进入房间")
                        ._("</span>")
                        ._("</li>");
                }
                $('#comment_list').append(t.toString());
                //$(".DATE").css({"margin-left":($('#comment_list').width() - $(".DATE").width())*0.5 +"px"});
                //$(".welcome").css({"margin-left":($('#comment_list').width() - $(".welcome").width())*0.5 +"px"});
                if(H.talk.isFirst){
                    $('#body').scrollToTop(999999);
                    H.talk.isFirst = false;
                    return;
                }

                if(!H.talk.isBottom){
                    if(!H.talk.isFirst){
                        H.talk.$tip.animate({
                                opacity: 1
                            }, 500,
                            'ease-in');
                    }else{
                        H.talk.isFirst = false;
                    }
                }else{
                    $('#body').scrollToTop(999999);
                }
            }
            DATE = false;
        }
    }

})(Zepto);

$(function(){
    H.talk.init();
});