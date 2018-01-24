(function($) {
    H.fight = {
        $waitCountDown: $('.wait-countDown'),
        $pkContext: $('.pk-context'),
        $lfBar: $('.lf-player-bar'),
        $rtBar: $('.rt-player-bar'),
        $selectPlayerImg: $('.select-player-img'),
        $randomPlayerImg: $('.random-player-img'),
        $selectPlayerBox: $('.select-player-box'),
        $randomPlayerBox: $('.random-player-box'),
        $selectBgImg: $('.select-bg-img'),
        $randomBgImg: $('.random-bg-img'),
        $pkBar: $('.pk-bar'),
        $lfStarBox: $('.lf-star-box'),
        $rtStarBox: $('.rt-star-box'),
        $rfRandom: $('.rf-random'),
        $lfSelect: $('.lf-select'),
        $lfPlayerName: $('.lf-player-name'),
        $rtPlayerName: $('.rt-player-name'),
        $vsImg: $('.fire-vs'),
        $vsImgLf: $('.fire-lf'),
        $vsImgRt: $('.fire-rt'),
        $fireMissLf: $('.fire-miss-lf'),
        $fireMissRt: $('.fire-miss-rt'),
        $failedWarning: $('.failed-warning'),
        $fightBtn: $('.fight'),
        mu: getQueryString("uuid"),
        mygrade: getQueryString("gd"),
        myimg: getQueryString("img"),
        oi: getQueryString("oi"),
        delayTime:1500,
        randomOk: false,
        selectData: null,
        playerRequestCount: 0,
        init: function() {
            var me = this,
                width = $(window).width(),
                height = $(window).height();
            $('body').css({
                'width': width,
                'height': height
            });
            this.initList();
            this.gameBefore();
            this.event();
            // me.playerRequestFlag = setInterval(function()
            // {
            //     me.randomRequest();
            // },1500)
            this.randomRequest();
        },

        initList: function() {
            var me = this;
            getResult('api/user/info_v2', { matk: matk }, 'callbackUserInfoHandler', true);
            me.$selectPlayerBox.find('img').attr("src", filterXSS(me.myimg));
            me.playShow(me.$selectBgImg, me.$lfStarBox, parseInt(me.mygrade))
        },
        randomRequest: function() {
            var me = this;
            if(me.oi){
                this.delayTime = 5000;
                getResult("api/fight/player/fight", { oi: openid, pu: me.mu,foi:me.oi }, "callbackFightPlayerFightHandler", false)
            }else{
                getResult("api/fight/player/fight", { oi: openid, pu: me.mu }, "callbackFightPlayerFightHandler", false)
            }
        },
        playShow: function(boxImg, starShow, play) {
            var me = this;
            switch (play) {
                case 0:
                    boxImg.attr("src", "./images/1s-bg.png")
                    break;
                case 1:
                    starShow.removeClass("none");
                    starShow.find(".icon-star1").removeClass("none");
                    boxImg.attr("src", "./images/2s-bg.png")
                    break;
                case 2:
                    starShow.removeClass("none");
                    starShow.find(".icon-star1,.icon-star2").removeClass("none");
                    boxImg.attr("src", "./images/3s-bg.png")
                    break;
                case 3:
                    starShow.removeClass("none");
                    starShow.find(".icon-star1,.icon-star2,.icon-star3").removeClass("none");
                    boxImg.attr("src", "./images/4s-bg.png")
                    break;
            };

            // resize
            if (W.screen.width === 320) {
                $(".star-box").css({
                    'left': "10%",
                });
            } else {
                $(".star-box").css({
                    'left': "15%",
                });
                $(".pk-bar").css({
                    'left': "5%",
                });
                $(".final-img").css({
                    'top': '-12px',
                })
            }
            if (W.screen.width >= 414) {
                $(".select-player-box,.random-player-box").css({
                    "padding": "8px 14% 8px 14%"
                })
            }
        },
        event: function() {
            this.$fightBtn.on("click", function() {
                toUrl("card.html");
            })
        },
        // 匹配对手
        gameBefore: function() {
            var me = this;
            var randominterval = null;
            var randomcount = 0;

            randominterval = setInterval(function() {
                var randNum = getRandomArbitrary(0, 40);
                var imgname = randNum + 'q.jpg';
                me.$rfRandom.find('img').attr("src", "./images/head/" + imgname);
                me.$rfRandom.removeClass("flash");
                randomcount++;
                if (randomcount >= 25 && me.randomOk) {
                    me.gameBegin(me.selectData);
                    clearInterval(randominterval);
                }
            }, 150);

        },
        gameBegin: function(data) {
            var me = this;
            var count = 3;
            var winnerFlag = false;

            // 正式
            winnerFlag = data.isWinner;
            me.$rfRandom.find('img').attr("src", data.opponentHi);
            me.$randomPlayerBox.find("img").attr("src", data.opponentPlayer.ulsi);
            me.$rtPlayerName.text(data.opponentNn);
            me.playShow(me.$randomBgImg, me.$rtStarBox, data.opponentPlayer.gd);
            me.$randomBgImg.removeClass("flash");

            //me.$randomPlayerBox.find("img").attr("src", "./images/random-player_man.png");
            //me.$rtPlayerName.text("孟佳瑶");
            // me.playShow(me.$randomBgImg, me.$rtStarBox, 2);
            me.$waitCountDown.removeClass("hidden").addClass("fire");

            var numCountDown = setInterval(function() {
                $("#audio-countdown").get(0).play();
                $(".num-down").text(count);
                count--;
                if (count < 0) {
                    clearInterval(numCountDown);
                    me.$vsImg.removeClass("flyin").addClass("flyout");
                    setTimeout(function() {
                        me.gameDuring(winnerFlag);
                    }, 1000)
                }
            }, 1000)

        },
        gameDuring: function(suceessflag) {
            var me = this;
            me.$waitCountDown.animate({
                "opacity": "0"
            }, function() {
                me.$pkBar.removeClass("none");
                    // 动画
                setTimeout(function() {
                    me.$waitCountDown.addClass("none");
                    positionSet();
                    me.$pkBar.find(".num-bar").css("width", "100%");
                    setTimeout(function() {
                        me.fillContent(suceessflag);
                    }, 1000)
                }, 100);
            }, 600)
        },

        fillContent: function(flag) {
            var me = this;
            var randomBlood = 0;
            var selectBlood = 0;
            var i = 0;
            var randNum = getRandomArbitrary(0, 4);
            var missFlag = false;
            if (!flag) {
                successValue = failedValue;
            }
            me.$pkContext.removeClass("none");

            function pkFill(i) {
                var html = "",randN = getRandomArbitrary(1, 15),randAni;
                var bloodValue = successValue[randNum].value[i % 10];
                if (i >= 10) {
                    clearTimeout(time);
                    $("#audio-bond").get(0).pause();
                    setTimeout(function() {
                        me.$vsImgLf.addClass("none").removeClass("bounceInLeft");
                        me.$vsImgRt.addClass("none").removeClass("bounceInRight");
                        if (flag) {
                            me.gameSuccess();
                        } else {
                            me.gameFail();
                        }
                    }, 800);
                    return;
                };
                $(".ftobj>img").attr("src",'./images/ft-lr' + randN + '.png');
                if (i % 2 == 0) {
                    if (randN<11){
                        randAni = 'bounceInLeft';
                    }else if(randN>12){
                        randAni = 'bounceLeftDown';
                    }else{
                        randAni = 'bounceBoom';
                    }
                    try{
                        $("#audio-bond").get(0).currentTime = 0;
                    }catch(e){
                    }
                    $("#audio-bond").get(0).play();
                    if (isNaN(bloodValue)) {
                        missFlag = true;
                        $(".rt-player-bar").find(".blood-num").text("");
                        html = '<p class="fadeInRight">你向对方使出了  <span style="color:' + wordColor[i % 3] + '">' + successValue[randNum].word[i % 10] + '</span>  <span style="color:#ff0000">' + bloodValue + '</span></p>';
                    } else {
                        missFlag = false;
                        randomBlood += bloodValue;
                        $(".rt-player-bar").find(".blood-num").text("-" + bloodValue);
                        html = '<p class="fadeInRight">你向对方使出了  <span style="color:' + wordColor[i % 3] + '">' + successValue[randNum].word[i % 10] + '</span>  对方受到<span style="color:#ff0000">' + bloodValue + '点伤害</span><i class="icon-weapon icon-weapon' + (i % 3 + 1) + '"></i></p>';
                    }
                    setTimeout(function() {
                        $(".rt-player-bar").find(".blood-num").text("");
                    }, 1500);
                    setTimeout(function() {
                        if (missFlag) {
                            me.$fireMissRt.addClass("LitterfadeInRight").removeClass("none");
                            me.$vsImgLf.addClass(randAni).removeClass("none");
                        } else {
                            me.$randomPlayerImg.css("-webkit-animation", "fightshake 100ms 1s ease-in-out 5");
                            me.$vsImgLf.addClass(randAni).removeClass("none");
                        }
                        $(".rt-player-bar").find(".num-bar").css("width", (100 - randomBlood) + "%");
                    }, 100);
                    me.$pkContext.prepend(html);
                    positionSet();
                    var time = setTimeout(function() {
                        me.$fireMissRt.addClass("none");
                        me.$randomPlayerImg.css("-webkit-animation", "");
                        me.$vsImgLf.removeClass(randAni).addClass("none");
                        pkFill(++i);
                    }, 1500);
                } else {
                    if (randN<11){
                        randAni = 'bounceInRight';
                    }else if(randN>12){
                        randAni = 'bounceRightDown';
                    }else{
                        randAni = 'bounceBoom';
                    }
                    try{
                        $("#audio-bond").get(0).currentTime = 0;
                    }catch(e){
                    }
                    $("#audio-bond").get(0).play();

                    if (isNaN(bloodValue)) {
                        missFlag = true;
                        $(".lf-player-bar").find(".blood-num").text("");
                        html = '<p class="fadeInRight">对方向你使出了  <span style="color:' + wordColor[i % 3] + '">' + successValue[randNum].word[i % 10] + '</span>  <span style="color:#ff0000">' + bloodValue + '</span></p>';
                    } else {
                        missFlag = false;
                        $(".lf-player-bar").find(".blood-num").text("-" + bloodValue);
                        selectBlood += bloodValue;
                        html = '<p class="fadeInRight">对方向你使出了  <span style="color:' + wordColor[i % 3] + '">' + successValue[randNum].word[i % 10] + '</span>  你受到<span style="color:#ff0000">' + bloodValue + '点伤害</span><i class="icon-weapon icon-weapon' + (i % 3 + 1) + '"></i></p>';
                    }
                    setTimeout(function() {
                        $(".lf-player-bar").find(".blood-num").text("");
                    }, 1500);
                    setTimeout(function() {
                        if (missFlag) {
                            me.$fireMissLf.addClass("fadeInLeft").removeClass("none");
                            me.$vsImgRt.addClass(randAni).removeClass("none");
                        } else {
                            me.$selectPlayerImg.css("-webkit-animation", "fightshake 100ms 1s ease-in-out 5");
                            me.$vsImgRt.addClass(randAni).removeClass("none");
                        }
                        $(".lf-player-bar").find(".num-bar").css("width", (100 - selectBlood) + "%");
                    }, 100);
                    me.$pkContext.prepend(html);
                    positionSet();
                    var time = setTimeout(function() {
                        me.$fireMissLf.addClass("none");
                        me.$selectPlayerImg.css("-webkit-animation", "");
                        me.$vsImgRt.removeClass(randAni).addClass("none");
                        pkFill(++i);
                    }, 1500);
                };
            }
            pkFill(0);

        },
        gameSuccess: function() {
            var me = this;
            me.$pkBar.addClass("none")
            me.$pkContext.addClass("flyout");
            setTimeout(function() {
                me.$pkContext.remove();
                positionSet();
                $(".left-final-img").removeClass("none");
                $(".right-final-img").removeClass("none");
                $(".right-final-img").find("img").attr("src", "./images/lose-bg.png");
                if (W.screen.width === 320) {
                    $(".headimg-wrap").empty().append("<img src='./images/cong-win.png'>").css({
                        "padding": "0px 10%",
                        "margin": "0px auto 10% auto"
                    });
                } else {
                    $(".headimg-wrap").empty().append("<img src='./images/cong-win.png'>").css({
                        "padding": "0px 10%",
                        "margin": "0px auto 15% auto"
                    });
                }
                $(".fight").removeClass("none")
                H.dialog.openGift.open();
            }, 600);
            $("#audio-success").get(0).play();
        },
        gameFail: function() {
            var me = this;
            me.$pkBar.addClass("none")
            me.$pkContext.addClass("flyout");
            setTimeout(function() {
                me.$pkContext.remove();
                positionSet();
                $(".left-final-img").removeClass("none");
                $(".right-final-img").removeClass("none");
                $(".left-final-img").find("img").attr("src", "./images/lose-bg.png");
                if (W.screen.width === 320) {
                    $(".headimg-wrap").empty().append("<img src='./images/cong-lose.png'>").css({
                        "padding": "0px 14%",
                        "margin": "0px auto 6% auto"
                    });
                } else {
                    $(".headimg-wrap").empty().append("<img src='./images/cong-lose.png'>").css({
                        "padding": "0px 10%",
                        "margin": "0px auto 15% auto"
                    });
                }
                $(".fight").removeClass("none");
                me.$failedWarning.removeClass("none");
            }, 600)
            $("#audio-failed").get(0).play();
        },
        contextScroll: function() {
            setInterval(function() {
                    var _h = $('.pk-context > p:first').height(); //取得每次滚动高度
                    $('.pk-context > p:first').animate({ marginTop: -(_h) }, 2000, function() { //通过取负margin值，隐藏第一行
                        $('.pk-context').append("<p>" + $('.pk-context > p:first').html() + "</p>");
                        $('.pk-context > p:first').remove();
                    })
                }, 3000) //滚动间隔时间取决于_interval
        },
    };
    W.callbackFightPlayerFightHandler = function(data) {
        if (data.result) {
            H.fight.randomOk = true;
            H.fight.selectData = data;
            if(H.fight.oi && data.isFriend == false){
                showTips("您的好友当前不在线，已为您匹配其他线上玩家");
            }
            var exp = new Date();
            var today = exp.getDate();
            exp.setTime(exp.getTime() + 24*60*60*1000);
            if(parseInt($.fn.cookie(openid + 'today')) !== today){
                $.fn.cookie(openid + 'today', today, {expires: exp});
                $.fn.cookie(openid + 'challenge10', '0', {expires: exp});
                $.fn.cookie(openid + '5win', '0', {expires: exp});
                $.fn.cookie(openid + 'challengefd', '0', {expires: exp});
                $.fn.cookie(openid + 'win3fd', '0', {expires: exp});
            }
            if($.fn.cookie(openid + 'challenge10')){
                if(parseInt($.fn.cookie(openid + 'challenge10')) < 10){
                    $.fn.cookie(openid + 'challenge10', parseInt($.fn.cookie(openid + 'challenge10'))+1, {expires: exp});
                }
            }else{
                $.fn.cookie(openid + 'challenge10', '1', {expires: exp});
            }
            if(data.isWinner){
                if($.fn.cookie(openid + '5win')){
                    if(parseInt($.fn.cookie(openid + '5win')) < 5){
                        $.fn.cookie(openid + '5win', parseInt($.fn.cookie(openid + '5win'))+1, {expires: exp});
                    }
                }else{
                    $.fn.cookie(openid + '5win', '1', {expires: exp});
                }
            }
            if(H.fight.oi && (data.isFriend == true)){
                if(!$.fn.cookie(openid + 'challengefd') || $.fn.cookie(openid + 'challengefd') == 0){
                    $.fn.cookie(openid + 'challengefd', '1', {expires: exp});
                }
                if(data.isWinner){
                    if($.fn.cookie(openid + 'win3fd')){
                        if(parseInt($.fn.cookie(openid + 'win3fd')) < 3){
                            if($.fn.cookie(openid + 'fdlist')){
                                if(!$.fn.cookie(openid + 'fdlist').match(data.opponentOpenid)){
                                    $.fn.cookie(openid + 'fdlist', ($.fn.cookie(openid + 'fdlist') + data.opponentOpenid), {expires: exp});
                                    $.fn.cookie(openid + 'win3fd', parseInt($.fn.cookie(openid + 'win3fd'))+1, {expires: exp});
                                }
                            }else{
                                $.fn.cookie(openid + 'fdlist', data.opponentPlayer.ud, {expires: exp});
                                $.fn.cookie(openid + 'win3fd', parseInt($.fn.cookie(openid + 'win3fd'))+1, {expires: exp});
                            }
                        }
                    }else{
                        $.fn.cookie(openid + 'win3fd', '1', {expires: exp});
                    }
                }
            }
        } else {
            H.fight.playerRequestCount++;
            if (H.fight.playerRequestCount < 4) {
                setTimeout(function() {
                    H.fight.randomRequest();
                }, H.fight.delayTime);
            } else {
                return
            }
        }
    }
    W.callbackUserInfoHandler = function(data) {
        if (data == undefined) {} else {
            H.fight.$lfPlayerName.text(data.nn ? data.nn : "匿名");
            H.fight.$lfSelect.find("img").attr("src", data.hi ? data.hi : "./images/avatar.png");
        }
    }

})(Zepto);
$(function() {
    H.fight.init();
});
window.onload = function() {
    if ($('.main').height() + $("footer").height() > $(window).height()) {
        $("footer").css("position", "relative");
    }
}

function positionSet() {
    if ($('.main').height() + $("footer").height() > $(window).height()) {
        $("footer").css("position", "relative")
    } else {
        $("footer").css("position", "absolute")
    }
}
