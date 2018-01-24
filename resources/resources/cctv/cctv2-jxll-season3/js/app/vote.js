(function($) {
	H.vote = {
        pid : null,
        inforoudRepeat: true,    //主活动信息服务接口的标识，true为可以在上次接口回调失败中再调一次接口，false为不能再调用接口
        iman:null,
        guid: '',
        voteStateList: [],
        currentIndex: 0,
        currentPid: '',
        clickRepeat: false,
		init: function () {
            var me = this;
            me.currentIndex = 0;
            me.voteStateList = [];
            me.getVoteinfo();
            me.event();
		},
		event: function() {
			var me = this;
		},
        getVoteinfo: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud' + dev,
                data: { yoi: openid },
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code != 0 || data.flow == 1){
                        if (H.vote.inforoudRepeat) {
                            H.vote.inforoudRepeat = false;
                            setTimeout(function(){
                                H.vote.getVoteinfo();
                            }, 2000);
                        } else {
                            // 数据出错，结束页
                            H.common.showOver();
                        }
                    } else {
                        if (data.items && data.items.length > 0) {
                            H.vote.fillVoteinfo(data);
                        } else {
                            // 数据出错，结束页
                            H.common.showOver();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    if (H.vote.inforoudRepeat) {
                        H.vote.inforoudRepeat = false;
                        setTimeout(function(){
                            H.vote.getVoteinfo();
                        }, 2000);
                    } else {
                        toUrl('yaoyiyao.html');
                    }
                }
            });
        },
        fillVoteinfo: function(data) {
            var me = this;
            H.vote.pid = data.pid;
            var nowTimeStemp = new Date().getTime();
            var nowTimeStr = timeTransform(nowTimeStemp - H.common.dec);
            if(comptime(data.pet,nowTimeStr) >= 0){
                // 如果本期投票结束，结束页
                H.common.showOver();
                return;
            }
            var roundItems = data.items;
            H.vote.roundList = roundItems;
            if(!roundItems || roundItems.length == 0 ){
                // 数据出错，结束页
                H.common.showOver();
                return;
            }
            if(comptime(nowTimeStr,roundItems[roundItems.length - 1].get) < 0){
                // 如果本期投票结束，摇奖页
                H.common.showLottery();
                return;
            }
            for (var i = 0; i < roundItems.length; i++) {
                var beginTimeStr = roundItems[i].gst, endTimeStr = roundItems[i].get;
                if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                    me.tplVoteInfo(roundItems[i]);
                    return;
                }
                if(comptime(nowTimeStr, beginTimeStr) > 0){
                    me.tplVoteInfo(roundItems[i]);
                    return;
                }
            }
        },
        tplVoteInfo: function(data){
            var me = this;
            var items = data.pitems;
            me.guid = data.guid;
            var t = new simpleTpl();

            t._('<ul id="stack_vote" class="stack stack--iman vote-stack">');
            for(var i = 0; i < items.length; i++){
                var item = items[i];
                t._('<li class="stack__item vote-btn" data-url="' + item.im2 + '" data-pid="' + item.pid + '" data-collect="true" data-collect-flag="vote-item-btn-'+ i +'" data-collect-desc="投票页-商品按钮'+ i +'"><img src="' + item.im + '" alt="' + item.na + '" /></li>');
                var sta = {
                    pid : item.pid,
                    state : ""
                };
                me.voteStateList.push(sta);
            }
            t._('</ul>');
            $("#mainContainer").html(t.toString());
            me.currentPid = items[0].pid;
            me.initVoteState();
        },
        swiperVote: function() {
            var me = this;
            var support = { animations : Modernizr.cssanimations },
                animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
                animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
                onEndAnimation = function( el, callback ) {
                    var onEndCallbackFn = function( ev ) {
                        if( support.animations ) {
                            if(ev.target != this) return;
                            this.removeEventListener( animEndEventName, onEndCallbackFn);
                        }
                        if(callback && typeof callback === 'function') {callback.call();}
                    };
                    if( support.animations ) {
                        el.addEventListener(animEndEventName, onEndCallbackFn);
                    }
                    else {
                        onEndCallbackFn();
                    }
                };

            [].slice.call(document.querySelectorAll('.button--sonar')).forEach(function(el) {
                el.addEventListener("click", function(ev) {
                    if( el.getAttribute('data-state') !== 'locked' ) {
                        classie.add(el, 'button--active');
                        onEndAnimation(el, function() {
                            classie.remove(el, 'button--active');
                        });
                    }
                });
            });
            me.iman = null;
            me.iman = new Stack(document.getElementById('stack_vote'), {
                stackItemsAnimation : {
                    duration: 800,
                    type: dynamics.spring
                },
                stackItemsPreAnimation : {
                    accept : {
                        elastic: true,
                        animationProperties: {translateX : 100, translateY : 10, rotateZ: 5},
                        animationSettings: {
                            duration: 100,
                            type: dynamics.easeIn
                        }
                    },
                    reject : {
                        elastic: true,
                        animationProperties: {translateX : -100, translateY : 10, rotateZ: -5},
                        animationSettings: {
                            duration: 100,
                            type: dynamics.easeIn
                        }
                    }
                }
            });
            if(!me.clickRepeat){
                $(".button--accept[data-stack = stack_iman]").unbind("click");        //解绑点击事件
                document.querySelector('.button--accept[data-stack = stack_iman]').addEventListener("click", function() {
                    if(!$(".button--accept").hasClass("voted")){
                        var st = $.fn.cookie("vote-state-"+openid);
                        if(st){
                            st += ("," + me.currentPid);
                        }else{
                            st = ("," + me.currentPid);
                        }
                        $.fn.cookie("vote-state-"+openid,st,{expires:1});
                        me.voteStateList[me.currentIndex].state = "voted";
                        $(".button--accept").addClass("voted");
                    }
                    $.ajax({
                        type : 'GET',
                        async : false,
                        url : domain_url + 'api/voteguess/guessplayer' + dev,
                        data: {
                            yoi: openid,
                            guid: me.guid,
                            pluids: me.currentPid
                        },
                        dataType : "jsonp",
                        jsonpCallback : 'callbackVoteguessGuessHandler',
                        timeout: 5000,
                        complete: function() {
                        },
                        success : function(data) {
                        },
                        error : function(xmlHttpRequest, error) {
                        }
                    });
                    me.iman.accept(me.buttonClickCallback.bind(this));
                    me.changeIndex("plus");
                });
                $(".button--reject[data-stack = stack_iman]").unbind("click");
                document.querySelector('.button--reject[data-stack = stack_iman]').addEventListener("click", function() {
                    me.iman.reject(me.buttonClickCallback.bind(this));
                    me.changeIndex("reduce");
                });
                me.toucha();
                me.clickRepeat = true;
            }
        },
        // controls the click ring effect on the button
        buttonClickCallback: function(bttn) {
            var bttn = bttn || this;
            bttn.setAttribute('data-state', 'unlocked');
        },
        toucha: function () {
            var me = this;
            var moveLength = 0,
                isLeft = false,
                deltaX = 0,
                deltaY = 0,
                constx = 0,
                consty = 0;
            var obj = document.querySelector('#stack_vote');
            obj.addEventListener("touchstart", function (ts) {
                if (ts.targetTouches.length == 1) {
                    ts.preventDefault();
                    var touch = ts.targetTouches[0];
                }
                constx = touch.pageX;
                consty = touch.pageY;
            });
            obj.addEventListener("touchmove", function (e) {
                e.preventDefault();
                e = e.changedTouches[0];
                deltaX = e.pageX - constx;
                deltaY = e.pageY - consty;
                if(deltaX > 0 && deltaX < 5) {
                    isLeft = false;
                    moveLength = 0;
                } else if (deltaX > 0 && deltaX >= 5) {
                    isLeft = false;
                    moveLength = Math.abs(deltaX);
                }else if(deltaX < 0 && deltaX > -5){
                    isLeft = true;
                    moveLength = 0;
                }else if(deltaX < 0 && deltaX <= -5){
                    isLeft = true;
                    moveLength = Math.abs(deltaX);
                }
                if (moveLength > 0) {
                    if(isLeft){
                        $('.stack__item--current').css('-webkit-transform', 'rotate(-' + (moveLength/320*5) + 'deg) translateX(-' + (moveLength/320*100) + 'px)');
                    }else{
                        $('.stack__item--current').css('-webkit-transform', 'rotate(' + (moveLength/320*5) + 'deg) translateX(' + (moveLength/320*100) + 'px)');
                    }
                }
            });
            obj.addEventListener("touchend", function () {
                if (moveLength > 0) {
                    if(isLeft){
                        me.iman.reject();
                        me.changeIndex("reduce");
                    }else{
                        me.iman.accept();
                        me.changeIndex("plus");
                    }
                    moveLength = 0;
                }else if(moveLength == 0){
                    var url = $(".stack__item--current").attr("data-url");
                    if(url && url.length > 0){
                        shownewLoading();
                        location.href = url;
                    }
                }
            });
        },
        changeIndex: function (type) {
            var me = this;
            if(type == "plus"){
                me.currentIndex++;
                if(me.currentIndex >= me.voteStateList.length){
                    me.currentIndex = 0;
                }
            }else{
                me.currentIndex--;
                if(me.currentIndex < 0){
                    me.currentIndex = me.voteStateList.length - 1;
                }
            }
            me.currentPid = me.voteStateList[me.currentIndex].pid;
            var state = me.voteStateList[me.currentIndex].state;
            if(state == "voted"){
                $(".button--accept").addClass("voted");
            }else{
                $(".button--accept").removeClass("voted");
            }
            console.log(me.currentIndex,me.currentPid,state);
        },
        initVoteState: function(){
            var me = this;
            var cookie = $.fn.cookie("vote-state-"+openid);
            if(!cookie){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/voteguess/isvote' + dev,
                    data: { yoi: openid, guid: me.guid },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackVoteguessIsvoteHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.code == 0){
                            var so = data.so;
                            if(so){
                                for(var i = 0; i < me.voteStateList.length; i++){
                                    var sta = me.voteStateList[i];
                                    if(so.indexOf(sta.pid) >= 0){
                                        me.voteStateList[i].state = "voted";
                                    }
                                }
                                $.fn.cookie("vote-state-"+openid,so,{expires:1});
                            }
                            $(".button--accept").addClass(me.voteStateList[0].state);
                            $(".controls").removeClass("none");
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            }else{
                for(var i = 0; i < me.voteStateList.length; i++){
                    var sta = me.voteStateList[i];
                    if(cookie && cookie.indexOf(sta.pid) >= 0){
                        me.voteStateList[i].state = "voted";
                    }
                }
                $(".button--accept").addClass(me.voteStateList[0].state);
                $(".controls").removeClass("none");
            }
        }
	};


})(Zepto);