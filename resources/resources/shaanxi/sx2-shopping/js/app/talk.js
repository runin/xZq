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
		init: function() {
            var me = this;
            me.event();
            me.question();
            me.canBottom();
            setInterval(function(){
                H.talk.account_num();
            },5000);
		},
        event: function(){
            var me = this;
            $(".r").on("click", function () {
                toUrl("qiandao.html");
            });
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
        },
        account_num: function(){
            getResult('log/serpv ', {}, 'callbackCountServicePvHander');
        },
        question:function(){
            getResult("api/comments/topic/round",{},"callbackCommentsTopicInfo",true);
            //H.talk.room();
            //setInterval(function(){
            //    H.talk.room();
            //},10000);
        },
        fillAfterSubmit: function(){
            var me = this;
            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : "images/head.jpg";
            var comments = "";
            comments += '<li>'
                + '<img class="fr" src="' + h +'">'
                + '<div class="ron">'
                + '<p class="tar">我</p>'
                + '<span class="triangle-right"></span>'
                + '<div class="article-right fr">'+me.input.val()+'</div>'
                + '</div>'
                + '</li>';
            $('#comment_list').append(comments);
            $('#body').scrollToTop(9999999);
            //$('#body').scrollToTop(999999);

            //$('#comment_list').height()
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
            //console.log(nDivHight);
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
                //else if(){
                //
                //}
            });
        }
    };
    W.callbackUserInfoHandler = function(data){
        //alert(data.hi);
        if(data.result == true){
            //alert(data.hi);
            $(".handimg").attr("src",data.hi+ '/' + yao_avatar_size);
        }else if(data.result == false){
            $(".handimg").attr("src","images/head.jpg");
        }else{

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
    W.callbackCommentsTopicInfo = function(data){
        if(data.code == 0){
            var item = data.items[0];
            H.talk.uid = item.uid;
            $(".title-img").attr("src",item.av);
            $(".title-per").html(item.p);
            $(".title-que").html(item.t);
            H.talk.room();
            setInterval(function(){
                H.talk.room();
            },5000);
        }
    };
    W.callbackCountServicePvHander = function(data) {
        if (data.code == 0) {
            $(".count").removeClass("none").html("目前人数："+data.c);
        }
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
                    var h= items[i].hu ? items[i].hu + '/' + yao_avatar_size : "images/head.jpg";
                    //$(".handimg").attr("src",h);
                    var n = items[i].na ? items[i].na:'匿名用户';
                    if(items[i].op == hex_md5(openid)){
                        t._('<li>')
                            ._('<img class="fr" src="'+h+'">')
                            ._('<div class="ron">')
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
                $('#comment_list').append(t.toString());

                if(H.talk.isFirst){
                    $('#body').scrollToTop($('#comment_list').height());
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
        }
    }

})(Zepto);

$(function(){
	H.talk.init();
});