+(function() {
    var player = {
        initParam: function() {
            this.playerCountArr = {};
            this.voteCount = 1;
            this.players = {};
            this.playerTemp = $([
                '<li  class="people">',
                ' <div class="encourage-people"><img  class="userbg" src="images/img_01.jpg"></div>',
                '<div class="encourage-info">',
                ' <h2><label class="e-name"></label> <span class="tempcont">人气值：?</span> <span class="encourage-number none">人气值：<label class="c-red">100</label></span></h2>',
                ' <p><a href="javascript:void(0)" class="wydq-btn"><i></i>我要打气</a></p>',
                '</div>',
                '  </li>'
            ].join(""));
            this.$nav_con = $(".nav-con"); //导航
            this.$activity = $(this.$nav_con.get(0)); //活动
            this.$reward = $(this.$nav_con.get(1)); ///奖励
            this.$encourage_list = $(".encourage-list"); //选手容器
            //$(".comment-main").css({height:$(window).height()})
            // $(".comment-box").width($(window).width());
            // $("body").height($(window).height()-50);

            var is_android = function() {
                var ua = navigator.userAgent.toLowerCase();
                return ua.indexOf("android") > -1;
            };
            if (!is_android()) {
                $(".comment-box").on("focus", "input", function() {
                    $(".comment-box").addClass("pos-rel");
                }).on("focusout", "input", function() {
                    $(".comment-box").removeClass("pos-rel");
                });
            }
        },

        initEvent: function() {
            $('body').delegate(".wydq-btn", "click", function(e) { //点头投票的

                var pid = $(this).parents(".people").attr("pid");
                if (localStorage["vote_" + pid]) {
                    showTips("您已经投票过了");
                    return false;
                }
                if (window.isNoStart) {
                    showTips("投票活动还没有开始哦");
                    return false;
                }
                if (window.isComplete) {
                    showTips("投票活动已经结束咯");
                    return false;
                }

                if (!localStorage["votecount_" + player.guid]) {
                    localStorage["votecount_" + player.guid] = 0;
                }
                localStorage["votecount_" + player.guid]++;
                if (localStorage["votecount_" + player.guid] > player.voteCount) {
                    showTips("抱歉您已经超过可投票次数咯");
                    return false;
                }
                $(this).addClass("on");
                
                var num = parseInt($(this).parents(".people").find(".c-red").text());
                $(this).parents(".people").find(".c-red").html((num + 1));

                loadData({
                    url: domain_url + "api/voteguess/guessplayer",
                    callbackVoteguessGuessHandler: function(data) {
                        if (data.code == 0) {
                            localStorage["vote_" + pid] = true;
                            showTips("恭喜你投票成功");
                        } else if (data.code == 1) {
                            showTips("抱歉投票失败请稍后再试");
                        } else if (data.code == 3) {
                            showTips("抱歉投票已经结束");
                        } else if (data.code == 4) {
                            showTips("抱歉您已经投票过了");
                        } else if (data.code == 5) {
                            showTips("抱歉头票还没有开始");
                        } else {
                            showTips("抱歉投票已经结束");
                        }
                    },
                    data: { yoi: openid, guid: player.guid, pluids: pid }
                });
            });
            var $activity = $(".activity");
            var $reward = $(".reward");

            var $comment_box = $(".comment-box");
            $(".nav-con li").click(function() { //导航
                var t = $(this);
                if (t.hasClass("on")) {
                    return false;
                } else {
                    $(".nav-con li").removeClass("on");
                    t.addClass("on");
                    var index = t.index();
                    if (index == 0) {
                        $comment_box.removeClass("none");
                        $activity.removeClass("none").addClass("on");
                        $reward.removeClass("on").addClass("none");
                    } else {
                        $comment_box.addClass("none");
                        $reward.removeClass("none").addClass("on");
                        $activity.removeClass("on").addClass("none");
                    }
                }
            });
        },
        loadData: function(fn) { //拉取每期guid 
            function appendData(data) {
             player.$encourage_list.empty(); 
                if(data.items[0].pitems.length==0){
                    showTips("抱歉请稍后再试code=9");
                    return false;
                }
                for (var i = 0; i < data.items[0].pitems.length; i++) {
                    var d = data.items[0].pitems[i];

                    var item = player.playerTemp.clone();
                    item.find(".userbg").attr("src", d.im);
                    item.find(".e-name").html(d.na);
                    item.find(".c-red").html(player.playerCountArr[d.guid] || 0);
                    if (localStorage["vote_" + d.pid]) {
                        item.find(".wydq-btn").addClass("on");
                    }
                    item.attr("pid", d.pid);
                    item.data("itemData", d);
                    player.players[d.pid] = d;
                    player.$encourage_list.append(item);
                    player.players[d.pid + "_item"] = item;
                }
                if($(".people").length==0){
                    setTimeout(function(){
                       window.location.href ="index.html";
                    },1000);
                }
                $(".userbg").unbind("click").click(function() {
                    $(".bigimg").attr("src", $(this).attr("src"));
                    var shw = $(".showimg");
                    if (shw.hasClass("none")) {
                        shw.removeClass("none")
                    } else {
                        shw.addClass("none")
                    }
                });
                $(".showimg").unbind("click").click(function() {
                    var t = $(this);
                    t.addClass("none");
                });
            };
            loadData({
                url: domain_url + "api/voteguess/inforoud",
                callbackVoteguessInfoHandler: function(data) {
                    if (data.code == 0) {
                        appendData(data);
                        window.pdst = data.pst;
                        window.pdet = data.pet;
                        player.guid = data.items[0].guid;
                        fn && fn();
                    } else {
                        showTips("抱歉请稍后再试code=3");
                    }
                },
                showload: false
            });
        },
        loadUserData: function() { //加载选手投票次数 
            window.player_guid = player.guid;
            window.player = player;
            loadData({
                url: domain_url + "api/voteguess/groupplayertickets",
                callbackVoteguessGroupplayerticketsHandler: function(data) {
                    if (data.code == 0) {
                        window.playArray = [];
                        window.playArray_cunt = [];
                        for (var i = 0; i < data.items.length; i++) {
                            var m = data.items[i].puid;
                            player.players[m + "_item"].find(".c-red").html(data.items[i].cunt);
                            window.playArray.push({ index: i, cunt: data.items[i].cunt, item: player.players[m + "_item"] });
                            window.playArray_cunt.push(data.items[i].cunt);
                        }
                    } else {
                        showTips("抱歉请稍后再试code=4");
                    }
                },
                data: { groupUuid: player.guid },
                showload: false
            });
        },

        init: function() {
            this.initParam();
            this.initEvent();
            this.loadData(function() {
                player.loadUserData();
            });



        }
    };
    player.init();
})();
