;
(function() {


    var getPacket = {
        showPopPage: function(showobj) {
            $(".pop-bg").addClass("none");
            if (showobj) {
                showobj.removeClass("none");
            }
        },
        initParam: function() {
            this.$answer = $("#answer");
            this.$taored = $("#taored");
            this.$taobtn = $(".taobtn");
            this.$ErrorDiv = $(".ErrorDiv")
            this.$sendRed = $(".btn-fa"); //我也要发红包
            this.$gotolookfriend = $(".gotolookfriend"); //去看看大家的手气
            this.$btnbox = $(".btn-box"); //按钮
            this.rid = getQueryString("rid"); //红包id
            this.shareOpenid = getQueryString("shareOpenid"); //分享的那个人的opendid
            if (this.shareOpenid == openid) {
                $(".seft_look").removeClass("none");
                $(".gotolook-p").addClass("none");
            }
            this.shareNickname = decodeURIComponent(getQueryString("sharenickname"));
            this.shareHeadimgurl = decodeURIComponent(getQueryString("shareheadimgurl"));
            $(".p-text").html((this.shareNickname || "你的好友") + "给你发了一个红包");
            if (this.shareHeadimgurl) {
                $(".headurl").css({
                    'background-image': 'url(' + this.shareHeadimgurl + ')',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'background-size': 'contain'
                });
            }
            this.$qrcodediv = $("#qrcodediv"); //二维码界面
        },
        initEvent: function() {
            { //加载问题的数据
                function opeaterQuestion(data) {



                    getPacket.$btnbox.removeClass("taobtn_a");
                    if (data.code == 0) {
                        if (localStorage["rid_" + getPacket.rid]) {

                            getPacket.showPopPage($("#start_hasAns")); //红包已经答过了 

                            return;
                        }
                        if (data.status == 0) {
                            getPacket.$taored.addClass("animated fadeOut");
                            setTimeout(function() {
                                getPacket.$taored.addClass("none");
                            }, 2000);
                            getPacket.$answer.removeClass("none");
                            getPacket.appendAns(data);
                        } else if (data.status == 1) { //红包不存在
                            getPacket.showPopPage($("#start_takeover"));
                        } else if (data.status == 2) { //红包已过期
                            getPacket.showPopPage($("#start_timeout"));
                        } else if (data.status == 3) { //红包已领完
                            getPacket.showPopPage($("#start_takeover"));
                        } else if (data.status == 4) { //红包已经答过了
                            getPacket.showPopPage($("#start_hasAns"));
                        }
                    } else { //已经抢完
                        getPacket.showPopPage($("#start_takeover"));
                    }
                };
                loadData({
                    url: domain_url + "api/redpack/question",
                    callbackGetQuestionHandler: function(data) {
                        getPacket.questionData = data;
                        getPacket.showPopPage($("#taored"));
                        setTimeout(function() {
                            opeaterQuestion(getPacket.questionData);
                        }, 1500);
                    },
                    error: function() {
                        getPacket.$btnbox.removeClass("taobtn_a");
                    },
                    data: {
                        rid: getPacket.rid, // 红包id，必填
                        op: openid, //   用户openid，必填
                        cop: codeOpenid, //  用户codeopenid，必填
                        ou: businessId //  运营商id，必填
                    },
                    showload: false
                });
            }

            // this.$taobtn.click(function() { //点击讨按钮
            //     getPacket.$btnbox.addClass("taobtn_a");
            //     if (getPacket.questionData) {
            //         setTimeout(function() {
            //             opeaterQuestion(getPacket.questionData);
            //         }, 1000);
            //         return false;
            //     }
            //     loadData({
            //         url: domain_url + "api/redpack/question",
            //         callbackGetQuestionHandler: function(data) {
            //             opeaterQuestion(data);
            //         },
            //         error: function() {
            //             getPacket.$btnbox.removeClass("taobtn_a");
            //         },
            //         data: {
            //             rid: getPacket.rid, // 红包id，必填
            //             op: openid, //   用户openid，必填
            //             cop: codeOpenid, //  用户codeopenid，必填
            //             ou: businessId //  运营商id，必填
            //         },
            //         showload: false
            //     });
            //});
            this.$sendRed.click(function() { //我也要发红包
                 var subscribe = $.fn.cookie("subscribe_" + openid);
                 if(subscribe){
                      window.location.href ="index.html";
                 }else{
                    getPacket.$qrcodediv.removeClass("none");
                 }
            });
            this.$gotolookfriend.click(function() { //看朋友  
                window.location.href = "lookfriend.html?rid=" + getPacket.rid + "&sharenickname=" +
                    encodeURIComponent(getPacket.shareNickname) + "&shareheadimgurl=" +
                    encodeURIComponent(getPacket.shareHeadimgurl) + "&qc=" + encodeURIComponent(getPacket.questionData.qc);
            });

            this.$qrcodediv.click(function() {
                $(this).addClass("none");
            });
        },
        appendAns: function(data) {
            $(".p-title").html(data.qc);
            $(".p-title").data("id", data.qid);
            window.qid = data.qid;
            $(".rn").html(data.rn);
            $(".tn").html(data.tn);
            var list = $(".a-list");
            list.empty();
            for (var i = 0; i < data.aitem.length; i++) {
                var d = data.aitem[i];
                var asitem = $('<a href="javascript:void(0)" class="btn-list"></a>');
                asitem.data("aid", d.aid);
                asitem.html(d.ac);
                list.append(asitem);
            }
            getPacket.initAnsClick();
        },
        initAnsClick: function() { //答题相关事件
            function showAnsPage(showobj) {
                $("#AnsDiv").addClass("none");
                $("#ErrorDiv").addClass("none");
                $("#takeover").addClass("none");
                showobj.removeClass("none");
            }
            $(".btn-list").click(function() { //答题
                $(this).addClass(" animated wiggle");
                var t = this;
                t.addEventListener('webkitAnimationEnd', function() {
                    $(this).removeClass("animated").removeClass("wiggle");
                });
                var aid = $(this).data("aid");
                loadData({
                    url: domain_url + "api/redpack/answer",
                    callbackAnswerHandler: function(data) {
                        if (data.code == 0) {
                            if (data.status == 0) { //成功
                                try {
                                    localStorage["rid_" + getPacket.rid] = true;
                                } catch (oException) {
                                    if (oException.name == 'QuotaExceededError') {
                                        localStorage.clear();
                                        localStorage["rid_" + getPacket.rid] = true;
                                    }
                                }
                                localStorage["rid_right_" + getPacket.rid] = 1;
                                window.location.href = "success.html?rid=" + getPacket.rid + "&ra=" + data.ra + "&sn=" + data.sn + "&simg=" + encodeURIComponent(data.simg) + "&qc=" + encodeURIComponent(data.qc);
                            } else if (data.status == 1) { //数据非法
                                alert("抱歉数据非法请稍候再试");
                            } else if (data.status == 2) { //回答错误
                                try {
                                    localStorage["rid_" + getPacket.rid] = true;
                                } catch (oException) {
                                    if (oException.name == 'QuotaExceededError') {
                                        localStorage.clear();
                                        localStorage["rid_" + getPacket.rid] = true;
                                    }
                                }
                                localStorage["rid_right_" + getPacket.rid] = 0;
                                showAnsPage($("#ErrorDiv"));
                            } else if (data.status == 3) { //红包已失效
                                showAnsPage($("#redpackoutime"));
                            } else if (data.status == 4) { //红包已领完
                                showAnsPage($("#takeover"));
                            } else if (data.status == 5) { //系统错误
                                alert("抱歉系统错误请稍候再试");
                            }
                        } else {
                            alert("抱歉请稍后再试code=6");
                        }
                    },
                    data: {
                        rid: getPacket.rid, //  红包id，必填
                        op: openid, //  用户openid，必填
                        cop: codeOpenid, // 用户codeopenid，必填
                        ou: businessId, //  运营商id，必填
                        qid: qid, // 问题id，必填
                        aid: aid // 答案id，必填
                    }
                });
            });
        },
        init: function() {
            getPacket.initParam();
            getPacket.initEvent();

        }
    };
    getPacket.init();
})(Zepto);
