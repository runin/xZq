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
            })
        },
        loadData: function (param) {
            W.showLoading();
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", jsonp: "callback" }, param);
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
                }
            });
        },
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());

        }
    };
    N.module("referContainA", function () {//提交内容页面

        this.InitParam = function () {
            this.referContain = $("#refer-contain");
            this.inputTitle = $(".input-title");
            this.inputContain = $(".input-contain");
            this.subBtn = $(".sub-btn");
            this.videoAdd = $(".video-add");
            this.fileName = "";
            this.setBgSize = function () {
                setTimeout(function () {
                    if ($("body").height() <= $(document).height() + 2) {
                        $("body").css({ height: $(document).height() });
                    } else {
                        $("body").css({ height: $(window).height() });
                    }
                }, 100);
            }
            this.setBgSize();
            var that = this;
            window.onresize = function () {
                that.setBgSize();
            }
        };
        this.InitEvent = function () {
            var that = this;

            this.videoAdd.upload({// 图片
                url: domain_url + '/fileupload/zonevideo', 	// 图片上传路径
                numLimit: 5, 						// 上传图片个数
                formCls: 'upload-form', 				// 上传form的class
                accept: 'video/*',
                limit: function (file, form) {
                    window.uploadForm = form;
                    if (file.size) {
                        if (file.size > 1024 * 1024 * limitSize) {
                            H.dialog.showWin.open("请上传" + limitSize + "m以内的视频！");
                            form[0].reset();
                            return false;
                        }
                    }
                    return true;
                },
                beforFn: function () {
                    //3分钟后可以再上传
                    if ($.fn.cookie("lastupLoadTime")) {
                        H.dialog.showWin.open("3分钟以内,仅可添加一段！");
                        return false;
                    }
                    return true;

                },
                selectFn: function () {
                    that.setBgSize();
                },
                afterFn: function (img) {
                    img.css({ "background": "url(images/vedioImg.png) center center no-repeat", "border": "0px", "background-size": "100% 100%" });
                },
                succussFn: function (data, form, imgA, fileName) {
                        window.uploadForm = form;
                        form[0].reset();
                        imgA.append("<input class='fileName' type='hidden' name='vi' value='" + data.filePath + "' />");
                        that.fileName += fileName + ",";
                        imgA.attr("href", data.filePath);

                        var datet = new Date();
                        datet.setTime(datet.getTime() + (1000 * 60 * 3));
                        var expires_in = { expires: datet };
                        $.fn.cookie("lastupLoadTime", new Date().getTime(), expires_in);
                        H.dialog.showWin.open("上传成功！");
                  
                },
                erroeFn: function (form) {
                    H.dialog.showWin.open("抱歉上传失败！");
                    window.uploadForm = form;
                    form[0].reset();
                }, closeFn: function (form) {
                    window.uploadForm = form;
                    form[0].reset();
                }
            });
            this.subBtn.click(function () {//提交记者稿件
                if (that.checkParam()) { //验证通过

                    var url = domain_url + "twoSessions/feeds/commissioner/submit?rn=" + that.jo + "&tl=" + that.tl + "&cn=" + that.cn + "&vi=" + that.vi + "&temp=" + new Date().getTime();
                    N.loadData({ url: url,
                        callbackCommissionerFeedsHandler: function (data) {
                            if (data.result) {
                                N.showPage("refer-success", function () {
                                    N.referSuccess.referName.text(decodeURIComponent(that.jobN));
                                    N.referSuccess.referVideoName.text("(" + decodeURIComponent(that.tl) + ")");
                                });
                            } else {
                                H.dialog.showWin.open("提交失败！");
                            }
                        }
                    });
                }
            });
        };
        this.checkParam = function () {//验证参数
            if (this.inputTitle.val().trim() == "") {//标题
                H.dialog.showWin.open("请填写标题！");
                return false;
            }
            if (this.inputTitle.val().length > 75) {//标题
                H.dialog.showWin.open("标题75字以内！");
                return false;
            }
            if (this.inputContain.val().length > 300) {
                H.dialog.showWin.open("内容300字以内！");
                return false;
            }
            if ($(".fileName").length == 0) {
                H.dialog.showWin.open("请上传视频！");
                return false;

            }
            this.jo = encodeURIComponent(this.jobN);
            this.tl = encodeURIComponent(this.inputTitle.val());
            this.cn = encodeURIComponent(this.inputContain.val());
            var urls = "";
            var fus = $(".fileName", this.videoAdd);
            for (var i = 0; i < fus.length; i++) {
                urls += $(fus[i]).val();
                if (i < fus.length - 1) {
                    urls += ",";
                }
            }
            this.vi = encodeURIComponent(urls);
            return true;
        };
        this.CheckIsReporter = function () {//检查是否是记者
            var that = this;
            var arr = [];
            var jName = "请填写您的姓名";


            arr.push("<section class='modal'><div class='receive'><h1 class='check-h'>" + jName + "</h1><input type='text' class='input-check' /> ");
            arr.push("<a href='javascript:void(0)' class='check-btn'>确定</a><p class='check-tip'></p></div></section>");
            H.dialog.showWin.open("", function (w) {

                $(".check-btn", w).click(function () {
                    var jobN = $(".input-check", w).val().trim();
                    if (jobN == "") {
                        $(".check-tip").text(jName);
                        return;
                    }

                    N.loadData({ url: domain_url + "twoSessions/feeds/commissioner/auth?rn=" + encodeURIComponent(jobN), callbackCommissionerAuthHandler: function (data) {
                    
                        if (data.result) {//验证成功
                            $(".check-tip").text("验证成功！");
                            that.jobN = $(".input-check", w).val().trim();
                            setTimeout(function () {
                                $(w).remove();
                            }, 500);
                        } else { //验证失败
                            $(".check-tip").text("抱歉，验证失败！");
                            return;
                        }

                    }, error: function () {//请求失败的时候
                        $(".check-tip").text("网络延迟，请稍后再试");
                    }
                    });

                });

                $(".input-check", w).focus(function () {
                    $(".check-tip", w).text("");
                });
            }, function () {//关闭回调
                N.showPage("refer-contain");
            }, function () {
                return arr.join("");

            });

        };
        this.init = function () {//页面总入口
            this.InitParam();
            this.InitEvent();
            this.CheckIsReporter();


        }
        this.init();

    });

    N.module("referSuccess", function () {//提交成功页面
        this.InitParam = function () {
            this.referName = $(".refer-name");
            this.referVideoName = $(".refer-video-name");
            this.refersContinue = $(".refers-continue");
            this.refersBack = $(".refers-back");



        };
        this.InitEvent = function () {

            this.refersContinue.click(function () {
                N.showPage("refer-contain", function () {
                    $(".input-title").val("");
                    $(".input-contain").val("");
                    $(".img-preview").remove();
                    N.referContainA.fileName = "";
                    $(".fileName").remove();
                    if (window.uploadForm) {
                        window.uploadForm[0].reset();
                    }

                });
            });


        };
        this.init = function () {
            this.InitParam();
            this.InitEvent();

        }
        this.init();

    });



})
