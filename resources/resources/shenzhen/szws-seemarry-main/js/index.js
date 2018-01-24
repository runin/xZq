$(function () {
    var N = {
        showPage: function (pageName, fn, pMoudel) {
            var mps = $(".page");
            mps.addClass("none");
            mps.each(function (i, item) {
                var t = $(item);
                if (t.attr("id") == pageName) {
                    t.removeClass("none");
                    N.currentPage = t;
                    if (fn) {
                        fn(t);
                    };
                    return false;
                }
            });
        },
        hashchange: (function () {
            $(window).bind("hashchange", function () {
                var pname = window.location.hash.slice(1);
                if (pname) {
                    N.page[pname]();
                } else {
                    pname = "firstPage";
                    N.page[pname]();
                }
                if (N[pname].goIntoFn) {
                    N[pname].goIntoFn();
                }
            });
            return {};
        })(),
        loadData: function (param) {
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", jsonp: "callback", showload: true }, param);
            if (p.showload) {
                W.showLoading();
            }
            var connt = 0;
            var cbName = "";
            var cbFn = null;
            for (var i in param) {
                connt++;
                if (connt == 2) {
                    cbName = i;
                    cbFn = param[i];
                    break;
                }
            }
            if (cbName && cbFn && !W[cbName]) { W[cbName] = cbFn; }
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonp: p.jsonp, jsonpCallback: cbName,
                success: function () {
                    W.hideLoading();
                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                }
            });
        },
        loadImg: function (img) {
            if (!this.images) {
                this.images = [];
            }
            if (img && !(img instanceof Array)) {
                img.isLoad = false;
                this.images.push(img);
            } else if ((img instanceof Array)) {
                for (var i = 0; i < img.length; i++) {
                    img[i].isLoad = false;
                    this.images.push(img[i]);
                }
            }
            for (var j = 0; j < this.images.length; j++) {
                var that = this;
                if (!this.images[j].isLoad) {
                    var im = new Image();
                    im.src = this.images[j].src;
                    this.images[j].isLoad = true;
                    im.onload = function () {

                    }
                }
            }
        },
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());

        },
        page: {
            firstPage: function (fn) {
                window.location.hash = "firstPage";
                $(".footer").show();
                $(".bottom_tip").show();
                N.showPage("firstPage", function () {

                    if (fn) {
                        fn();
                    }
                })
            },
            commentPage: function (fn) {
                window.location.hash = "commentPage";

                $(".footer").hide();
                N.showPage("commentPage", function () {

                    if (fn) {
                        fn();
                    }
                })
            },
            buyPage: function (fn) {
                window.location.hash = "buyPage";
                $(".footer").show();
                $(".bottom_tip").hide();
                N.showPage("buyPage", function () {
                    if (fn) {
                        fn();
                    }
                })
            }
        }
    };
    N.module("firstPage", function () {
        this.initParam = function () {



            if (window.location.href.indexOf('cb41faa22e731e9b') == -1) {
                $('#div_subscribe_area').css('height', '0');
            } else {
                $('#div_subscribe_area').css('height', '50px');
            };
            this.f_order = $(".f_order"); //节目预约
            this.f_rule = $(".f_rule"); //节目规则;
            this.f_getBonus = $(".f_getBonus"); //领取红包
            this.tv_same = $(".tv_same"); //电视同款
        };
        this.initEvent = function () {
            this.f_order.unbind("click").click($.proxy(firstPageEvent.f_orderFn, this));
            this.f_rule.unbind("click").click($.proxy(firstPageEvent.f_ruleFn, this));
            this.f_getBonus.unbind("click").click($.proxy(firstPageEvent.f_getBonusFn, this));
            this.tv_same.unbind("click").click($.proxy(firstPageEvent.tv_sameFn, this));

            var that = this;
            N.loadData({ url: domain_url + "program/reserve/get", callbackProgramReserveHandler: function (data) {
                if (!data.reserveId) {
                    return;
                } else {
                    that.f_order.removeClass("none");
                    window.reserveId_t = data.reserveId;
                    window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function (resp) {
                        if (resp.errorCode == 0) {

                        }
                    });
                }

            }
            });

            N.loadImg({ src: "./images/avatar.jpg", isLoad: false });


        };
        var firstPageEvent = {
            f_orderFn: function () {
                var reserveId = window.reserveId_t;
                if (!reserveId) {
                    return;
                }
                shaketv.reserve(yao_tv_id, reserveId, function (data) {

                });
            },
            f_ruleFn: function () {



            },
            tv_sameFn: function () {
                N.page.buyPage(function () {
                    if (N["buyPage"].goIntoFn) {
                        N["buyPage"].goIntoFn();
                    }
                });
                return false;

            },
            f_getBonusFn: function () {
                N.page.commentPage(function () {
                    if (N["commentPage"].goIntoFn) {
                        N["commentPage"].goIntoFn();
                    }

                });
            }
        };

        this.init = function () {

            this.initParam();
            this.initEvent();
            if (window.location.hash.slice(1) == "buyPage") {
                setTimeout(function () {
                    if (N["buyPage"].goIntoFn) {
                        N.page.buyPage(function () {
                            if (N["buyPage"].goIntoFn) {
                                N["buyPage"].goIntoFn();
                            }
                        });
                    } else {
                        N.page.firstPage();
                    }
                }, 50);
            } else if (getQueryString("rp")) {
                setTimeout(function () {
                    N.page.commentPage(function () {
                        if (N["commentPage"].goIntoFn) {
                            N["commentPage"].goIntoFn();
                            N["commentPage"].showWin("get_success2");
                        }

                    });
                }, 50);
            } else {
                N.page.firstPage();
            }
        };
        this.init();
    });


    N.module("commentPage", function () {
        var hmode = "<div class='c_head_img'><img src='./images/avatar.jpg' class='c_head_img_img' /></div>";
        var commentPageEvent = {
            c_tv_sameFn: function () {

                N.page.buyPage(function () {
                    if (N["buyPage"].goIntoFn) {
                        N["buyPage"].goIntoFn();
                    }

                });
            },
            c_grabFn: function () {//可以抽奖
                var that = this;
                if (!that.au) {
                    alert("活动已经结束");
                    return;
                }

                this.showWin("get_bonus", function () {
                    N.loadData({ url: domain_url + "knowedmarry/lottery", callbackKnowedmarryLottery: function (data) {


                        $.fn.cookie(that.au, "zhong", expires_in2);
                        if (data.code == 0) {
                            window.pru = data.pru;

                            if (data.pt == 1) {//1:实物中奖


                            } else if (data.pt == 2) {//2:积分奖品


                            } else if (data.pt == 3) {//3:滴滴打车


                            } else if (data.pt == 4) {//4:现金红包 

                                var get_money = that.showWin("get_money");
                                $(".c_money_no").html(data.iv + "<span class='c_money_unit'>元</span>");
                                $(".get_money_a").attr("href", data.redpack);


                            } else if (data.pt == 7) {//5:优惠券的兑换码
                                if (window.pru) {
                                    var get_juan = that.showWin("get_juan");
                                    if (data.Pi) {
                                        $(".juan_img").attr("src", data.Pi);
                                    }
                                } else {
                                    that.showWin("no_get_bonus2");
                                }
                            }
                        } else if (data.code == 1) {

                            // that.showWin("no_get_bonus");
                            that.showWin("no_get_bonus2");

                        } else {
                            if (data.message) {
                                alert(data.message);
                            }
                        }
                    }, data: { yoi: openid, actUid: that.au }
                    });

                });

            },
            sendFn: function () {
                var that = this;
                var sendText = encodeURIComponent(this.c_input.val());
                //                if (!window.tid) {
                //                    alert("活动已结束，暂不能发表")
                //                    return;
                //                }

                N.loadData({ url: domain_url + "api/comments/save", callbackCommentsSave: function (data) {

                    if (data.code == 0) {
                        var mode = "<div class='c_head_img'><img src='./images/avatar.jpg' class='c_head_img_img' /></div>";
                        if (headimgurl) {
                            mode = "<div class='c_head_img'><img src='" + headimgurl + "/64' class='c_head_img_img' /></div>";
                        }
                        barrage.appendMsg(mode + that.c_input.val());
                        that.c_input.val("");
                    } else {
                        if (data.message) {
                            alert(data.message);
                            that.c_input.val("");
                        } else {
                            alert("发表评论失败");
                        }
                    }
                }, data: {
                    co: sendText,
                    op: openid,
                    tid: window.tid,
                    ty: 1,
                    nickname: nickname ? encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname')) : "",
                    headimgurl: headimgurl ? headimgurl : ""
                }
                });

            },
            startBarrage: function () {
                var that = this;
                that.maxid = 0;
                window.barrage = this.comments.barrage({ fontColor: ["6FC3EF", "FFF"] });
                barrage.start(1);
                function loadComments() {
                    $.ajax({
                        type: 'GET',
                        async: true,
                        url: domain_url + "api/comments/room?temp=" + new Date().getTime(),
                        dataType: "jsonp",
                        data: { ps: 50, maxid: that.maxid },
                        jsonpCallback: 'callbackCommentsRoom',
                        success: function (data) {
                            if (data.code == 0) {
                                that.maxid = data.maxid;
                                var items = data.items || [];
                                for (var i = 0, len = items.length; i < len; i++) {
                                    var hmode = "<div class='c_head_img'><img src='./images/avatar.jpg' class='c_head_img_img' /></div>";
                                    if (items[i].hu) {
                                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
                                    }
                                    barrage.pushMsg(hmode + items[i].co);
                                }
                                setTimeout(function () {
                                    loadComments();
                                }, 5000);

                            } else {
                                setTimeout(function () {
                                    loadComments();
                                }, 5000);
                                if (data.message) {
                                    //alert(data.message);
                                }
                            }
                        }
                    });
                };
                loadComments();
            },
            usernumFn: function () {
                var that = this;

                that.loadLineNo = function () {
                    $.ajax({
                        type: 'GET',
                        async: true,
                        url: domain_url + "log/serpv?temp=" + new Date().getTime(),
                        dataType: "jsonp",
                        jsonpCallback: 'callbackCountServicePvHander',
                        success: function (data) {
                            setTimeout(function () {
                                that.loadLineNo();
                            }, 5000);
                            if (data.code == 0) {
                                that.part_in_no.text("目前" + data.c + "人正在聊天");

                            } else {
                                if (data.message) {
                                    // alert(data.message);
                                }
                            }
                        }
                    });
                };

                that.loadLineNo();
            },
            get_bonusFn: function (get_bonus) {
                var that = this;
                this.get_bonus_a = $("<a href='javascript:void(0)' class='get_bonus_a'></a>");
                get_bonus.append(this.get_bonus_a)
                this.get_bonus_a.unbind("click").click(function () {
                    if (get_bonus.fn) {
                        get_bonus.fn();
                    }

                });
            },
            close_btnFn: function (close_btn, win) {
                this.close_btn.unbind("click").click(function () {
                    win.hide();

                });

            },
            get_juanFn: function (get_juan) {
                var that = this;
                this.get_juan_a = $("<a href='javascript:void(0)' class='get_juan_a'></a>");
                this.get_juan_img = $("<img  src='./images/juan_img5.png' alt='' class='juan_img' />");
                this.get_juan_phone = $("<input class='c_phone' placeholder='请填写电话号码' />");
                get_juan.append(this.get_juan_a);
                get_juan.append(this.get_juan_img);
                get_juan.append(this.get_juan_phone);
                this.get_juan_a.unbind("click").click(function () {
                    that.juan_phone = that.get_juan_phone.val();

                    if (window.pru) {
                        if (that.get_juan_phone.val() == "") {
                            alert("请填写电话号码");
                            return;
                        }
                        $.ajax({
                            type: 'GET',
                            async: true,
                            url: "http://h5.m.koudai.com/hd/wdjx/getCoupon.do?temp=" + new Date().getTime(),
                            dataType: "jsonp",
                            data: { country: 86, phone: that.juan_phone },
                            jsonpCallback: 'getCouponCallback',
                            success: function (data) {

                                if (data.result.status == 1) {
                                    that.showWin("get_juan_success");
                                    getJuanFn();
                                } else if (data.result.status == 0) {
                                    alert(" 已经领取过，不能重复领取");
                                } else {
                                    alert("抱歉领取失败");
                                }
                            }
                        });
                    }
                });

                function getJuanFn() {
                    N.loadData({ url: domain_url + "knowedmarry/award", callbackKnowedmarryAward: function (data) {
                    }, data: { yoi: openid, ph: that.juan_phone, prUid: window.pru, un: "" }, showload: false
                    });
                }
                return get_juan;
            },
            get_moneyFn: function (get_money) {
                var that = this;
                this.get_money_a = $("<a href='javascript:void(0)' class='get_money_a'></a>");
                get_money.append(this.get_money_a);
                this.get_money_a.unbind("click").click(function () {


                });

                return get_money;
            },
            get_successFn: function (get_success) {

                var that = this;
                this.get_success_a = $("<a href='javascript:void(0)' class='get_success_a'></a>");
                this.public_no = $("<div class='public_no'></div>")
                get_success.append(this.get_success_a);
                get_success.append(this.public_no);

                this.get_success_a.unbind("click").click(function () {


                });

                this.public_no.unbind("click").click(function () {

                    that.win.append("<div class='c_modal_t'></div><img src='./images/two_code.png' alt='' class='two_code' /> <img src='./images/t_two_code.png' alt='' class='t_two_code' />");
                    $(".t_two_code").click(function () {
                        $(".c_modal_t").remove();
                        $(".two_code").remove();
                        $(".t_two_code").remove();
                    });

                });

            },
            get_successFn2: function (get_success2) {

                var that = this;
                this.get_success_a = $("<a href='javascript:void(0)' class='get_success_a'></a>");
                this.public_no = $("<div class='public_no'></div>")
                get_success2.append(this.get_success_a);
                get_success2.append(this.public_no);

                this.get_success_a.unbind("click").click(function () {
                    that.public_no.trigger("click");

                });

                this.public_no.unbind("click").click(function () {

                    that.win.append("<div class='c_modal_t'></div><img src='./images/two_code.png' alt='' class='two_code' /> <img src='./images/t_two_code.png' alt='' class='t_two_code' />");
                    $(".t_two_code").click(function () {
                        $(".c_modal_t").remove();
                        $(".two_code").remove();
                        $(".t_two_code").remove();
                    });

                });
            },
            get_juan_successFn: function (get_juan_success) {

                var that = this;
                this.public_no_juan = $("<div class='public_no_juan'></div>")
                this.get_juan_success_a = $("<a href='http://hd.koudai.com/vd20150417/index.php?plath5=true&appName=weidianbuyer&supportgesture=false&wfr=renxinggou_wechattv_shake' class=' get_juan_success_a'></a>");
                get_juan_success.append(this.get_juan_success_a);
                get_juan_success.append(this.public_no_juan);

                this.get_juan_success_a.unbind("click").click(function () { });

                this.public_no_juan.unbind("click").click(function () {

                    that.win.append("<div class='c_modal_t'></div><img src='./images/two_code.png' alt='' class='two_code' /> <img src='./images/t_two_code.png' alt='' class='t_two_code' />");
                    $(".t_two_code").click(function () {
                        $(".c_modal_t").remove();
                        $(".two_code").remove();
                        $(".t_two_code").remove();
                    });

                });

            },


            no_get_bonusFn: function (no_get_bonus) {
                var that = this;
                this.no_get_bonus_a = $("<a href='javascript:void(0)' class='no_get_bonus_a' data-collect='true' data-collect-flag='two_code' data-collect-desc='二维码按钮'></a>");
                no_get_bonus.append(this.no_get_bonus_a);
                this.no_get_bonus_a.unbind("click").click(function () {
                    N.page.buyPage();
                    that.win.hide()
                });
                this.public_no = $("<div class='public_no'></div>");
                no_get_bonus.append(this.public_no);
                this.public_no.unbind("click").click(function () {
                    that.win.append("<div class='c_modal_t'></div><img src='./images/two_code.png' alt='' class='two_code' /> <img src='./images/t_two_code.png' alt='' class='t_two_code' />");
                    $(".t_two_code").click(function () {
                        $(".c_modal_t").remove();
                        $(".two_code").remove();
                        $(".t_two_code").remove();
                    });
                });
            },
            no_get_bonusFn2: function (no_get_bonus2) {
                var that = this;
                this.no_get_bonus_a2 = $("<a href='javascript:void(0)' class='no_get_bonus_a' data-collect='true' data-collect-flag='two_code' data-collect-desc='二维码按钮'></a>");
                no_get_bonus2.append(this.no_get_bonus_a2);
                this.no_get_bonus_a2.unbind("click").click(function () {
                    that.public_no.trigger("click");

                });
                this.public_no = $("<div class='public_no none'></div>");
                no_get_bonus2.append(this.public_no);
                this.public_no.unbind("click").click(function () {
                    that.win.append("<div class='c_modal_t'></div><img src='./images/two_code.png' alt='' class='two_code' /><img src='./images/t_two_code.png' alt='' class='t_two_code' />");
                    $(".t_two_code").click(function () {
                        $(".c_modal_t").remove();
                        $(".two_code").remove();
                        $(".t_two_code").remove();

                    });
                });

            }

        };

        this.initParam = function () {
            this.c_tv_same = $(".c_tv_same");
            this.c_grab = $(".c_grab");
            this.comments = $(".comments");
            this.part_in_no = $(".part_in_no");
            this.send = $("#send");
            this.c_input = $(".c_input");
            this.win = $("<div class='win'></div>"); //弹框



        };
        this.initEvent = function () {
            this.c_tv_same.unbind("click").click($.proxy(commentPageEvent.c_tv_sameFn, this));
            this.c_grab.unbind("click").click($.proxy(commentPageEvent.c_grabFn, this));
            this.send.unbind("click").click($.proxy(commentPageEvent.sendFn, this));
            this.initWin();
            $(window).resize(function () {
                $("#comments").css({ "position": "absolute", "bottom": "60px", "height": "70%", "width": "100%" });
                $(".c_sendDiv").css({ "bottom": "0px" });
            });
            $(".c_left").removeClass("none");
        };
        this.pushCommentMas = function () {


            window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d1.jpg' class='c_head_img_img' /></div>" + "很好看！！");
            window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d2.jpg' class='c_head_img_img' /></div>" + "支持佟大为");
            window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d3.jpg' class='c_head_img_img' /></div>" + "王丽坤真漂亮");
            window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d4.jpg' class='c_head_img_img' /></div>" + "看预告片就好期待了");
            window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d5.jpg' class='c_head_img_img' /></div>" + "看得我醉了，赞赞赞，32个赞！");
        };
        this.initWin = function () {

            this.win.model = $("<div class='c_modal'></div>");
            this.win.append(this.win.model); //添加蒙成
            this.win.contain = $("<div class='c_contain'></div>");
            this.close_btn = $("<div class='c_close'></div>")
            commentPageEvent.close_btnFn.call(this, this.close_btn, this.win);

            this.get_bonus = $("<div class='get_bonus'></div>");
            commentPageEvent.get_bonusFn.call(this, this.get_bonus);

            this.get_juan = $("<div class='get_juan'></div>");
            commentPageEvent.get_juanFn.call(this, this.get_juan);


            this.get_juan_success = $("<div class='get_juan_success'></div>");
            commentPageEvent.get_juan_successFn.call(this, this.get_juan_success);





            this.get_success = $("<div class='get_success'></div>");
            commentPageEvent.get_successFn.call(this, this.get_success);

            this.get_success2 = $("<div class='get_success2'></div>");
            commentPageEvent.get_successFn2.call(this, this.get_success2);



            this.no_get_bonus = $("<div class='no_get_bonus'></div>");
            commentPageEvent.no_get_bonusFn.call(this, this.no_get_bonus);


            this.no_get_bonus2 = $("<div class='no_get_bonus2'></div>");
            commentPageEvent.no_get_bonusFn2.call(this, this.no_get_bonus2);


            this.get_money = $("<div class='get_money'><div class='c_money'><span class='c_money_no'><span></div></div>");
            commentPageEvent.get_moneyFn.call(this, this.get_money);





            this.showWin = function (type, fn) {

                this.win.show();
                this.win.contain.empty();
                this.win.contain.append(this.close_btn);

                switch (type) {
                    case "get_bonus":
                        this.get_bonus.fn = fn;
                        this.win.contain.append(this.get_bonus);

                        break;
                    case "get_juan":
                        this.win.contain.append(this.get_juan);
                        break;
                    case "get_money":
                        this.win.contain.append(this.get_money);
                        break;
                    case "get_success":
                        this.win.contain.append(this.get_success);
                        break;
                    case "get_success2":
                        this.win.contain.append(this.get_success2);
                        break;
                    case "no_get_bonus":
                        this.win.contain.append(this.no_get_bonus);
                        break;
                    case "no_get_bonus2":
                        this.win.contain.append(this.no_get_bonus2);
                        break;
                    case "get_juan_success":
                        this.win.contain.append(this.get_juan_success);
                        break;
                }
                this.win.append(this.win.contain); //添加蒙成
                $("body").append(this.win);
            }
            this.hideWin = function () {
                this.win.hide();
            }


        };

        this.toTimeSpan = function (str) {
            str = str.replace(/:/g, '/');
            return Date.parse(new Date(str));
        };

        this.down_count = function (obj) {
            var p = $.extend({
                itemObj: "", //倒计时显示的元素
                activity: [], //活动的时间段
                cTime: timestamp(this.systemTime), //当前时间
                eachShowFn: null, //每次倒计时回调
                canLotteryFn: null, //当前时间落在抽奖时间的回调
                endFn: null//结束事件
            }, obj || {});

            var that = this;
            var wTime = 500;
            var cTime = p.cTime;
            window.t_count = 0;
            var showTime = function (rT, showTpl) {
                var s_ = Math.round((rT % 60000) / wTime);
                s_ = dateNum(Math.min(Math.floor(s_ / 1000 * wTime), 59));
                var m_ = dateNum(Math.floor((rT % 3600000) / 60000));
                var h_ = dateNum(Math.floor((rT % 86400000) / 3600000));
                var d_ = dateNum(Math.floor(rT / 86400000));
                p.itemObj.text(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
            };
            var runTime = function () {
                try {

                    if ($.fn.cookie(p.activity[t_count].au) == "zhong") {//当前这期已经中奖
                        t_count++;
                    };

                    cTime += wTime;
                    if (!p.activity[t_count]) {
                        if (window.progressTimeInterval) {
                            clearInterval(window.progressTimeInterval);
                        }
                        $(".c_count_down").hide();
                        $(".c_grab").hide();
                        $(".a_end").show();
                        return;
                    }
                    var sorgT = parseInt(timestamp(p.activity[t_count].ap + " " + p.activity[t_count].ab));
                    var eorgT = parseInt(timestamp(p.activity[t_count].ap + " " + p.activity[t_count].ae));
                    var sT = isNaN(sorgT) ? 0 : sorgT - cTime;
                    var eT = isNaN(eorgT) ? 0 : eorgT - cTime;

                    if (sT > 0) {// 即将开始
                        showTime(sT, "%H%:%M%:%S%");
                        if (p.eachShowFn) {
                            p.eachShowFn(p.itemObj.text());
                        }
                    } else if (eT > 0) {//显示，可以进行抽奖
                        if (p.canLotteryFn) {
                            p.canLotteryFn(p.activity[t_count]);
                        }
                    } else {// 结束
                        t_count++;
                        if (t_count > p.activity.length) {
                            if (p.endFn) {
                                p.endFn();
                            }
                            if (window.progressTimeInterval) {
                                clearInterval(window.progressTimeInterval);
                            }
                        }
                    }
                }
                catch (e) {

                    if (window.progressTimeInterval) {
                        clearInterval(window.progressTimeInterval);
                    }
                }
            }
            runTime();
            window.progressTimeInterval = setInterval(function () {
                runTime();
            }, wTime);

        };
        this.getActivity = function () {
            var c_count_down = $(".c_count_down");
            var c_grab = $(".c_grab");
            var a_end = $(".a_end");
            c_count_down.hide();
            c_grab.hide();
            a_end.show();
            var that = this;
            that.activity = [];
            var loadactivity = function () {
                $.ajax({
                    type: 'GET',
                    async: true,
                    url: domain_url + "knowedmarry/activity",
                    dataType: "jsonp",
                    data: { yoi: openid },
                    jsonpCallback: 'callbackKnowedmarryActivity',
                    success: function (data) {
                     
                        if (data.code == 0) {
                            if (data.ai) {
                                $("#commentPage").css("background-image", "url('" + data.ai + "')");
                            }
                            that.systemTime = data.tm;
                            that.systemNowTime = that.systemNowTime;
                            that.activity = data.activity;
                            that.down_count({ itemObj: $(".c_down_no"), activity: that.activity, eachShowFn: function () {
                                c_count_down.show();
                                c_grab.hide();
                                a_end.hide();
                            }, canLotteryFn: function (o) {
                                c_count_down.hide();
                                c_grab.show();
                                a_end.hide();
                                that.au = o.au;
                                window.tid = o.au;
                                that.time_span_obj = o;

                            }, endFn: function () {
                                c_count_down.hide();
                                c_grab.hide();
                                a_end.show();
                            }
                            });

                        } else {
                            c_count_down.hide();
                            c_grab.hide();
                            a_end.show();
                            setTimeout(function () {
                                loadactivity();
                            }, 800);

                            if (data.message) {
                                //alert(data.message);

                            }
                        }

                    },error:function(){
                          setTimeout(function () {
                                loadactivity();
                           }, 800);
                    }
                });
            }
            loadactivity();




//            N.loadData({ url: domain_url + "knowedmarry/activity", callbackKnowedmarryActivity: function (data) {

//                if (data.code == 0) {
//                    if (data.ai) {
//                        $("#commentPage").css("background-image", "url('" + data.ai + "')");
//                    }
//                    that.systemTime = data.tm;
//                    that.systemNowTime = that.systemNowTime;
//                    that.activity = data.activity;
//                    that.down_count({ itemObj: $(".c_down_no"), activity: that.activity, eachShowFn: function () {
//                        c_count_down.show();
//                        c_grab.hide();
//                        a_end.hide();
//                    }, canLotteryFn: function (o) {
//                        c_count_down.hide();
//                        c_grab.show();
//                        a_end.hide();
//                        that.au = o.au;
//                        window.tid = o.au;
//                        that.time_span_obj = o;

//                    }, endFn: function () {
//                        c_count_down.hide();
//                        c_grab.hide();
//                        a_end.show();
//                    }
//                    });

//                } else {
//                    c_count_down.hide();
//                    c_grab.hide();
//                    a_end.show();
//                    if (data.message) {
//                        //alert(data.message);

//                    }
//                }
//            }, data: { yoi: openid }
//            });

        };
        this.goIntoFn = function () {//进入模块时候调用方法

            $.proxy(commentPageEvent.startBarrage, this)();
            $.proxy(commentPageEvent.usernumFn, this)();
        };
        this.init = function () {




            this.getActivity();
            this.pushCommentMas();
            this.initParam();
            this.initEvent();
            // N.page.commentPage();
            var that = this;



        };
        this.init();
    });


    N.module("buyPage", function () {
        var items_buy = [{ imgUrl: "./images/ck_r.jpg", goUrl: "http://m.koudai.com/theme_list.htm?wx_redirect=1&theme_id=2523&appid=com.koudai.weidian.buyer&wfr=vdbuyer!h5!topic&p=iphone&fr=weixinShare&from=timeline&isappinstalled=1" }, { imgUrl: "./images/ck_boy.jpg", goUrl: "http://m.koudai.com/theme_list.htm?wx_redirect=1&theme_id=2522&appid=com.koudai.weidian.buyer&wfr=vdbuyer!h5!topic&p=iphone&fr=weixinShare&from=timeline&isappinstalled=1" }, { imgUrl: "./images/ck_g.jpg", goUrl: "http://m.koudai.com/theme_list.htm?wx_redirect=1&theme_id=2520&appid=com.koudai.weidian.buyer&wfr=vdbuyer!h5!topic&p=iphone&fr=weixinShare&from=timeline&isappinstalled=1" }, { imgUrl: "./images/ck_girl.jpg", goUrl: "http://m.koudai.com/theme_list.htm?wx_redirect=1&theme_id=2521&appid=com.koudai.weidian.buyer&wfr=vdbuyer!h5!topic&p=iphone&fr=weixinShare&from=timeline&isappinstalled=1" }, { imgUrl: "./images/ck_l.jpg", goUrl: "http://m.koudai.com/theme_list.htm?wx_redirect=1&theme_id=2519&appid=com.koudai.weidian.buyer&wfr=vdbuyer!h5!topic&p=iphone&fr=weixinShare&from=timeline&isappinstalled=1"}];
        for (var i = 0; i < items_buy.length; i++) {
            var img = new Image();
            img.src = items_buy[i].imgUrl;
        }
        this.initParam = function () {
            this.b_Swiper_Con = $(".b_Swiper_Con");
        };
        this.appendItem = function () {
            for (var i = 0; i < items_buy.length; i++) {
                var m = $("<div class='swiper-slide'></div>");
                var img = $("<div class='b_swiper_bg'><a href='javascript:void(0)' class='b_img_btn' go_url='" + items_buy[i].goUrl + "' ></a><img class='b_imgItem' src='" + items_buy[i].imgUrl + "'   alt='' /></div>");
                m.append(img);
                $(".swiper-wrapper").append(m);
            }
            this.swiper = new Swiper('.swiper-container', {
                centeredSlides: true,
                slidesPerView: 2,
                grabCursor: true,
                calculateHeight: true,
                cssWidthAndHeight: false,
                initialSlide: 1
            });
            $(".swiper-wrapper").undelegate();
            $(".swiper-wrapper").delegate(".b_img_btn", "click", function () {
                window.location.href = $(this).attr("go_url");
            });
        };
        this.initEvent = function () {
        };
        this.goIntoFn = function () {

            this.appendItem();
        }
        this.init = function () {

            this.initParam();
            this.initEvent();

            // N.page.buyPage();
        };
        this.init();
    });

});
