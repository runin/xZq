+(function() {
    var classId = {
        $commentList: $("#comment-list"),
        $send: $("#send"),
        $commentInputText: $('#comment-input-text')
    };

    var tool = { //工具类
        setCookie: function(name, value) {
            localStorage.setItem(name, value);
        },
        getCookie: function(name) {
            return localStorage.getItem(name);
        },
        getDataStr: function() {
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            return y + (m < 10 ? ("0" + m) : m) + (d < 10 ? ("0" + d) : d);
        }
    };

    var comment = {
        $page: 1,
        $ps: 50,
        $lastuid: "",
        $maxid: 0, //最大的id
        $isLoad: false,
        $zan: "",
        init: function() {
            this.commentsList();
            this.scorllFn();
            this.sendFn();
            this.praiseFn();
        },
        commentsList: function() { //分页获取评论信息
            getResult('api/comments/list?temp=' + new Date().getTime(), { page: comment.$page, ps: comment.$ps,op:openid,dt:1}, 'callbackCommentsList');
        },
        praiseFn: function() { //点赞评论
            classId.$commentList.unbind("click").delegate(".zan-btn", "click", function(e) {
                classId.$zan = $(this).attr("data-uuid");
                if (tool.getCookie("dianzan_" + classId.$zan)) {
                    return;
                }
                var text = parseInt($(this).find("span").text());

                if (localStorage["c_id" + classId.$zan]) {
                    showTips("您已经赞过啦");
                    return false;
                } else {
                    localStorage["c_id" + classId.$zan] = true;
                }

                $(this).addClass("on").find("span").text(text + 1);

                getResult('api/comments/praise', { uid: classId.$zan, op: openid }, 'callbackCommentsPraise');
            });
        },
        sendFn: function() { //保存评论
            classId.$send.click(function(e) {
                e.preventDefault();
                var cipt = $.trim(classId.$commentInputText.val());
                if (!cipt) {
                    showTips("请填写你的看法！");
                    classId.$commentInputText.focus();
                    return;
                }

                if (openid != null) {
                    classId.$send.attr("disabled", "disabled");
                    classId.$commentInputText.attr("disabled", "disabled");
                    if (headimgurl != null && headimgurl.indexOf("./images/avatar.jpg") > 0) {
                        headimgurl = '';
                    }
                    $("#barrinput").val(cipt);

                    H.comment.$submit.trigger("click");
                    //getResult('api/comments/save', { op: openid, co: encodeURIComponent(cipt), ty: 1, pa: null, nickname: encodeURIComponent(nickname || ''), headimgurl: headimgurl || '' }, 'callbackCommentsSave');
                    window.callbackCommentsSave2({ code: 0 });
                }
            });
            $(".comment-close").click(function(data) { 
                var t = $(this);
                if (t.hasClass("comment-select")) {
                    t.removeClass("comment-select");
                    $(".danmu-box").addClass("hidebox");
                } else {
                    t.addClass("comment-select");
                    $(".danmu-box").removeClass("hidebox");
                }
            });
        },
        commentData: function(data) { 
            var items = data.items;
            var t = simpleTpl();
            var headimgurl;
            var nickname;
            var pc = 0;
            comment.$maxid = data.maxid;
            for (var i = 0, leg = items.length; i < leg; i++) {
                headimgurl = items[i].im ? items[i].im + "/64" : "images/avatar.jpg";
                nickname = items[i].na ? items[i].na : "匿名";
                if (items[i].pc) {
                    pc = items[i].pc;
                }
                t._('<li id="' + i + '">')
                t._('<div class="comment-list-con">')
                t._('<a href="javascript:void(0)" class="zan-btn" data-uuid="' + items[i].uid + '" id="zan' + i + '"><i></i><span>' + pc + '</span></a>')
                t._('<i class="my-headurl" style="background-image:url(' + headimgurl + ')"></i>')
                t._('<h2>' + nickname + '</h2>')
                t._('<p>' + items[i].co + '</p>')
                t._('</div>')
                t._('</li>')
            }
            classId.$commentList.empty().append(t.toString());
            $("[data-uuid]").each(function() {
                var uuid = $(this).attr("data-uuid");
                if(localStorage["c_id"+uuid]){
                	$(this).addClass("on");
                }

            })
            comment.$isLoad = true;
        },
        scorllFn: function() {
            var scrollH = 0;
            var bodyH = 0;
            $(window).scroll(function() {
                if (!comment.$isLoad) {
                    return;
                }
                window.scl = setTimeout(function() {
                    bodyH = $("body").height();
                    scrollH = $(window).scrollTop() + $(window).height();
                    if (scrollH >= bodyH + 50) {  
                        comment.commentsList();
                    }
                }, 2000);
            });
        }
    };

    W.callbackCommentsList = function(data) { //分页获取评论信息 
        if (data && data.code == 0) {
            comment.$page++;
            comment.$isLoad = false;
            comment.commentData(data);
        }
    };

    W.callbackCommentsSave2 = function(data) { //保存评论
        classId.$send.removeAttr("disabled");
        classId.$commentInputText.removeAttr("disabled");
        if (data && data.code == 0) {
            var headImg = null;
            if (headimgurl == null || headimgurl == '') {
                headImg = './images/avatar.jpg';
            } else {
                headImg = headimgurl + '/64';
            }
            var t = simpleTpl();
            var cipt = classId.$commentInputText.val();
            var nickname = window.nickname ? window.nickname : "匿名";
            t._('<li>')
            t._('<div class="comment-list-con">')
            t._('<a href="javascript:void(0)" class="zan-btn" data-uuid="' + data.uid + '"><i></i><span>0</span></a>')
            t._('<i class="my-headurl" style="background-image:url(' + headImg + ')"></i>')
            t._('<h2>' + nickname + '</h2>')
            t._('<p>' + cipt + '</p>')
            t._('</div>')
            t._('</li>')

            classId.$commentList.append(t.toString());
            classId.$commentInputText.val("");
        }
    };

    W.callbackCommentsPraise = function(data) { //点赞
        if (data && data.code == 0) {
			showTips("点赞成功！");
		}
    }
    comment.init();
})();
