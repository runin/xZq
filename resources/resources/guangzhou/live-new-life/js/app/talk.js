﻿$(function () {
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
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
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
            if (/test/.test(domain_url)) {
                if (!param.data) {
                    param.data = {};
                }
                param.data.dev = "jiawei";
            }
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonpCallback: cbName,
                success: function (data) {

                    W.hideLoading();
                    cbFn(data);

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
        showWin: function (obj) {

            var p = $.extend({
                html: "", //内部html
                beforeOpenFn: null, //打开之前
                afterOpenFn: null//打开之后执行的函数
            }, obj || {});
            this.winObj = $('<div class="win"><div class="win_model"></div><div class="win_contain"><div class="win_html"></div></div></div>');
            this.close = function (fn) {
                this.winObj.remove();
                if (fn) {
                    fn()
                }
                if (this.closeFn) {
                    this.closeFn();
                }
            }
            this.setWidth = function (w) {
                this.winObj.css("width", w);
            }
            this.setHeight = function (h) {
                this.winObj.css("height", h);
            }
            this.setHtml = function (html) {
                this.winObj.find(".win_html").append(html || p.html);
            }
            this.initEvent = function () {
                var that = this;
                this.winObj.find(".win_close").unbind("click").click(function () {
                    that.close();
                });
            }
            this.init = function (fn) {
                this.setHtml();
                if (p.beforeOpenFn) {
                    p.beforeOpenFn(this.winObj);
                }
                $("body").append(this.winObj);
                this.initEvent();
                this.winObj.find(".win_contain").addClass("show_slow");
                if (p.afterOpenFn) {
                    p.afterOpenFn(this.winObj, this);
                }
                if (fn) {
                    fn();
                }
            }
        },
        module: function (mName, fn, fn2) {
            !N[mName] && (N[mName] = new fn());
            if (fn2) {
                $(function () {
                    fn2();
                });
            }
        }
    };

    N.module("main", function () {

        this.initParam = function () {
            this.talk_say = $(".comment-list"); //评论容器

            //var dh = $(".talk_topic").get(0).offsetTop + $(".talk_topic").height();
            //this.talk_say.height($(window).height() - dh - 50);
            //this.go_back = $(".go_back"); //返回
            this.send_btn = $("#send"); //发送按钮
            this.send_input = $("#comments-info"); //发送对话框
            //this.talk_topic = $(".talk_topic"); //话题内容
        };
        this.initEvent = function () {
            var that = this;
            that.uids = [];
            //that.go_back.click(function () {
            //    window.history.go(-1);
            //});
            that.send_btn.click(function (e) {
                if ($("#comments-info").get(0).value == "") {
                    alert("请填写内容");
                    return;
                }
                N.loadData({ url: domain_url + "api/comments/save", callbackCommentsSave: function (data) {
                    if (data.code == 0) {
                        var uid = data.uid;
                        that.talk_item_t = that.talk_item.clone(true);
                        if (nickname) {
                            that.talk_item_t.find(".user_name").text(nickname);
                        }
                        if (headimgurl) {
                            //that.talk_item_t.find(".user_head").css({ "background": "url('" + (headimgurl + "/64") + "') no-repeat center center", "background-size": "cover" });
							that.talk_item_t.find("#user_head").attr("src",headimgurl + "/64");
                        }
                        that.talk_item_t.find(".talk_content").text(that.send_input.val());
                        that.talk_item_t.find(".user_uid").val(uid);
                        that.uids.push(uid);
                        that.talk_say.prepend(that.talk_item_t);
                        that.send_input.val("");
                    } else {
                        if (data.message) {
                            alert(data.message);
                            //that.send_input.val("");
                        } else {
                            alert("发表评论失败");
                        }
                    }
                }, data: {
                    co: encodeURIComponent(that.send_input.val()),
                    op: openid,
					tid: getQueryString("uid"),
                    ty: 1,
                    nickname: nickname ? encodeURIComponent(nickname) : "",
                    headimgurl: headimgurl ? headimgurl : ""
                }
                });
                return false;
            });

            var ts = that.talk_say;
            var tshh = ts.height();
            var pageIndex = 2;
            ts.scroll(function (e) {
                var tth = $(".talk_item").height();
                var tsh = ts.get(0).scrollHeight;
                if ((ts.get(0).scrollTop + tshh + 30) >= tsh) {
                    N.loadData({ url: domain_url + "api/comments/list?temp=" + new Date().getTime(), callbackCommentsList: function (data) {
                        if (data.code == 0) {
                            pageIndex++;
                            window.appendData(data.items, 0);
                        } else {
                        }
                    }, error: function () {

                    }, data: { 
					    ps: 10, 
						page: pageIndex,
						anys: getQueryString("uid"),
					}, showload: false
                    });
                }
            });
        };
        this.loadComment = function () {
            var arr = [];
            arr.push('<li>');
            arr.push('<img src="" id="user_head" alt="">');
            arr.push('<div class="review-text">');
            arr.push('<h3 class="user_name"></h3>');
            arr.push('<p class="all-con" id="all-con"><span class="talk_content"></span></p>');
            arr.push('</div>');
            arr.push('</li>');
			
            var that = this;
            that.talk_item = $(arr.join(""));
            that.maxid = 0;
            that.talk_say.empty();
            window.appendData = function (items, loadCount) {
                for (var i = 0, len = items.length; i < len; i++) {
                    var item = $(arr.join(""));
					/*
                    if (items[i].hu) {
                        item.find(".user_head").css({ "background": "url('" + (items[i].hu + "/64") + "') no-repeat center center;", "background-size": "cover" });
                    } else {
                        if (items[i].im){
                            item.find(".user_head").css({ "background": "url('" + (items[i].im + "/64") + "') no-repeat center center;", "background-size": "cover" });
                        } else {
                            item.find(".user_head").css({ "background": "url('" + "./images/avatar.jpg" + "') no-repeat center center;", "background-size": "cover" });
                        }
                    }
					*/
					if (items[i].hu) {
                        item.find("#user_head").attr("src",items[i].hu + "/64");
                    } else {
                        if (items[i].im){
							item.find("#user_head").attr("src",items[i].im + "/64");
                        } else {
							item.find("#user_head").attr("src","images/avatar.jpg");
                        }
                    }
                    item.find(".user_name").html(items[i].na || "匿名");
                    //item.find(".push_time").text(items[i].ats);
                    item.find(".talk_content").html(items[i].co);
                    item.find(".user_uid").val(items[i].uid);
                    if (that.uids.indexOf(items[i].uid) == -1) {
                        if (loadCount == 0) {
                            that.talk_say.append(item);
                        } else {
                            that.talk_say.prepend(item);
                        }
                    }
                };
            };
            var loadCount = 0;
            function loadFunction() {
                N.loadData({ url: domain_url + "api/comments/room?temp=" + new Date().getTime(), callbackCommentsRoom: function (data) {
                    if (data.code == 0) {
                        that.maxid = data.maxid;
                        that.items = data.items || [];
                        appendData(that.items, loadCount);
                        loadCount++;
                        setTimeout(function () {
                            loadFunction();
                        }, 5000);
                    } else {
                        setTimeout(function () {
                            loadFunction();
                        }, 5000);
                    }
                }, error: function () {
                    setTimeout(function () {
                        loadFunction();
                    }, 5000);
                }, data: {
					ps: 10, 
					anys: getQueryString("uid"),
					maxid: that.maxid 
				}, showload: false
                });
            };
            loadFunction();
        };
		/*
        this.loadToptic = function () {
            var that = this;
            N.loadData({ url: domain_url + "api/comments/topic/round?temp=" + new Date().getTime(), callbackCommentsTopicInfo: function (data) {
                if (data.code == 0) {
                    that.talk_topic.text(data.items[0].t);
                } else {
                }
            }
            });
        };
		*/
        this.init = function () {
            this.initParam();
            this.initEvent();
            this.loadComment();
            //this.loadToptic();

        };
        this.init();
    });

});