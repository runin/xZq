
$(function () {
    /*self-S*/
    var $mainPage = $('#mainPage'),
        cardsID = getQueryString("id"),
        type = getQueryString("type"),//分享页标识
        cardsWidth = 0,//卡片背景宽度
        cardsHeight = 0,//卡片背景高度
        clipImgWidth = 205,//裁剪虚线框宽度
        clipImgHeight = 134;//裁剪虚线框高度

    var resetDom = function(cardsID){//重置贺卡模板
        switch (cardsID){
            case "cards1":
                cardsWidth = 250;
                cardsHeight = 305;
                $mainPage.css({
                    "width": cardsWidth+"px",
                    "height": cardsHeight+"px",
                    "background-image": "url(images/card/fxy1.png)",
                    "background-size": "100% auto"
                }).attr("data-id",cardsID).addClass(cardsID).find('.push_img').css({
                    "width": cardsWidth*0.84+"px",
                    "left": (cardsWidth*0.16)/2+"px",
                    "top": "10px"
                });
                break;
            case "cards2":
                cardsWidth = 256;
                cardsHeight = 306;
                $mainPage.css({
                    "width": cardsWidth+"px",
                    "height": cardsHeight+"px",
                    "background-image": "url(images/card/fxy2.png)",
                    "background-size": "100% auto"
                }).attr("data-id",cardsID).addClass(cardsID).find('.push_img').css({
                    "width": cardsWidth*0.70+"px",
                    "left": (cardsWidth*0.30)/2+"px",
                    "top": "22px"
                });
                break;
            case "cards3":
                cardsWidth = 280;
                cardsHeight = 258;
                $mainPage.css({
                    "width": cardsWidth+"px",
                    "height": cardsHeight+"px",
                    "background-image": "url(images/card/fxy3.png)",
                    "background-size": "100% auto"
                }).attr("data-id",cardsID).addClass(cardsID).find('.push_img').css({
                    "width": cardsWidth*0.50+"px",
                    "left": "46px",
                    "top": "22px"
                });
                break;
            case "cards4":
                cardsWidth = 275;
                cardsHeight = 258;
                $mainPage.css({
                    "width": cardsWidth+"px",
                    "height": cardsHeight+"px",
                    "background-image": "url(images/card/fxy4.png)",
                    "background-size": "100% auto"
                }).attr("data-id",cardsID).addClass(cardsID).find('.push_img').css({
                    "width": cardsWidth*0.50+"px",
                    "left": "5px",
                    "top": "30px"
                });
                break;
        }
    };
        if(!type){
            resetDom(cardsID);
        }
    /*self-E*/


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
            });
            return {};
        })(),
        loadData: function (param) {

            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", jsonp: "callback", showload: true }, param);
            if (p.showload) {
                W.shownewLoading();
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
                    W.hidenewLoading();
                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hidenewLoading();
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                }
            });
        },
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());

        },
        page: {
            uploadImg: function (fn) {
                window.location.hash = "uploadImg";
                N.showPage("mainPage", function () {
                    $(".btn_upload").show();
                    if (fn) {
                        fn();
                    }
                })
            },
            continueUp: function (fn) {
                window.location.hash = "continueUp";
                N.showPage("mainPage", function () {
                    $(".btn_upload_change").show();
                    $(".btn_upload").hide();
                    if (fn) {
                        fn();
                    }
                })
            }
        }
    };
    N.module("mainPage", function () {
        var imgs = ["./images/draw.png","./images/draw_m.png","images/card/fxy1.png","images/card/fxy2.png","images/card/fxy3.png","images/card/fxy4.png"];
        this.loadImg = function () {
            for (var i = 0; i < imgs.length; i++) {//图片预加载
                var img = new Image();
                img.style = "display:none";
                img.src = imgs[i];
                img.onload = function () {

                }
            }

        };
        this.initParam = function () {//初始化参数
            this.btn_upload = $(".btn_upload");
            this.tarfile = $("#tarfile");
            this.btn_upload_change = $(".btn_upload_change");
            this.tarfile_form = $("#tarfile_form"),
            this.back =$('#back,#wyzhk'),
            this.share_back =$('.share-back'),
            this.zzwc = $('#ok');
        };
        this.initEvent = function () {//初始化事件
            var that = this;
            this.btn_upload.unbind("click").click(function () {//上传图片
                that.tarfile.trigger("click");
            });
            this.tarfile.unbind("change").change(function () {
                that.uploadArea.uploadInit();
            });
            this.btn_upload_change.unbind("click").click(function () {
                that.tarfile.trigger("click");
            });
            this.back.tap(function(e){
                e.preventDefault();
                that.uploadArea.btn_animate($(this));
                toUrl("card.html");
            });
            this.share_back.tap(function(e){
                e.preventDefault();
                that.uploadArea.btn_animate($(this));
                toUrl("make.html?id="+cardsID);
            });
            this.zzwc.tap(function(e){
                e.preventDefault();
                that.uploadArea.btn_animate($(this));
                var info = $('textarea').val(),
                    imgSrc = $(".push_img").attr("src");

                if(imgSrc==" "){
                    showTips("还没上传照片哦~");
                    return
                }else if(!info){
                    showTips("还没填写新年祝福哦~");
                    return
                }
                that.uploadArea.uploadImg(function (fileurl) {
                    shownewLoading(null, '贺卡制作中...');
                    $.ajax({
                        type: 'GET',
                        async: true,
                        url: domain_url + 'api/ceremony/greetingcard/make' + dev,
                        data: {
                            oi: openid,
                            sn: $mainPage.attr("data-id"),
                            gt: encodeURIComponent(info),
                            ou: fileurl
                        },
                        dataType: "jsonp",
                        jsonpCallback: 'callbackMakeCardHandler',
                        complete: function() {
                            hidenewLoading();
                        },
                        success: function(data) {
                            if(data.result == true){
                                toUrl("share.html?cu="+ data.cu +"&id="+cardsID+"&type=share");
                            }else {
                                hidenewLoading();
                                showTips('大家太热情了！请喝杯茶后重试^_^');
                            }
                        },
                        error: function(xmlHttpRequest, error) {
                            showTips('大家太热情了！请喝杯茶后重试^_^');
                        }
                    });
                });
            });
        };
        var that = this;
        var Addthat = this;
        this.uploadArea = {
            getFile: function () {
                return that.tarfile.get(0).files[0];
            },
            createModel: function () {
                $mainPage.prepend("<div class='modal'></div>");
            },
            createrClipImg: function () {
                $mainPage.prepend("<img  src='./images/draw.png' class='clipImg' />");
            },

            initImgEvent: function () {
                var thatu = this;
                thatu.posX = 0;
                thatu.posY = 0;

                thatu.last_posX = 0;
                thatu.last_posY = 0;

                thatu.scale = 1;
                thatu.last_scale = 1;
                thatu.rotation = 0;
                thatu.last_rotation = 0;
                if (window.hammertime) {
                    window.hammertime = null;
                }
                window.hammertime = new Hammer($mainPage.get(0), {
                    preventDefault: true,
                    transformMinScale: 1,
                    dragBlockHorizontal: true,
                    dragBlockVertical: true,
                    dragMinDistance: 0
                });
                hammertime.on('touch drag transform', function (ev) {

                    switch (ev.type) {
                        case 'touch':
                            thatu.last_scale = thatu.scale;
                            thatu.last_rotation = thatu.rotation;
                            break;
                        case 'drag':
                            thatu.posX = ev.gesture.deltaX + thatu.last_posX;
                            thatu.posY = ev.gesture.deltaY + thatu.last_posY;
                            break;
                        case 'transform':
                            thatu.rotation = ev.gesture.rotation; //头像旋转角度
                            thatu.scale = Math.min(5, Math.max(thatu.last_scale * ev.gesture.scale, 0.5)); //头像缩放比例
                            break;
                    }
                    thatu.transform =
                        "translate(" + thatu.posX + "px," + thatu.posY + "px)"
                        +
                        "scale(" + thatu.scale + "," + thatu.scale + ") "
                        +
                        "rotate(" + thatu.rotation + "deg) ";
                    thatu.drawImg = thatu.fileUpImg.get(0);
                    thatu.drawImg.style.transform = thatu.transform;
                    thatu.drawImg.style.oTransform = thatu.transform;
                    thatu.drawImg.style.msTransform = thatu.transform;
                    thatu.drawImg.style.mozTransform = thatu.transform;
                    thatu.drawImg.style.webkitTransform = thatu.transform;
                });
                hammertime.on('touchend', function (ev) {

                    thatu.last_posX = thatu.posX;
                    thatu.last_posY = thatu.posY;
                });

            },
            addClipBtn: function () {
                var that = this;
                that.clipBtn = $("<div id='clipBtn' >截 图</div>");
                $("body").prepend(that.clipBtn);
                that.initClipBtn();
            },
            initClipBtn: function () {
                var that = this;
                that.clipBtn.unbind("click").click(function () {

                    that.clipImg();
                });
            },
            getNonceStr: function () {
                var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var maxPos = $chars.length;
                var noceStr = "";
                for (var i = 0; i < 32; i++) {
                    noceStr += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                oldNonceStr = noceStr;
                return noceStr;
            },
            uploadImg: function (fn) {//上传切割后图像
                var url = domain_url + 'fileupload/base64/image';
                var form = new FormData();
                var file = this.canvas.toDataURL("image/png").substring(22);
                form.append("base64String ", file);
                form.append("fileType ", "png");
                $.ajax({
                    url: url,
                    type: "POST",
                    data: form,
                    async: true,        //异步
                    processData: false,  //很重要，告诉jquery不要对form进行处理
                    contentType: false,  //很重要，指定为false才能形成正确的Content-Type
                    success: function (data) {
                        data = $.parseJSON(data);
                        if (data.code == 0) {
                            if (fn) {
                                fn(data.filePath);
                            }
                        } else {
                            //showTips("抱歉上传失败")
                        }
                    },
                    error: function () {
                        showTips("抱歉上传失败")
                    }
                });

            },
            reSetAll: function () {
                $(".modal").remove();
                $("#canvasTarget").remove();
                $(".clipImg").remove();
                $("#filePrewImg").remove();
                $("#clipBtn").remove();
                $(".success_tip").hide();
                that.tarfile_form.get(0).reset();
            },
            pushPrewImg: function () {
                var thatu = this;
                if (this.file) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        $mainPage.append("<img id='filePrewImg' />");
                        thatu.fileUpImg = $("#filePrewImg");
                        var t = this;
                        thatu.fileUpImg.attr("src", this.result);

                        thatu.fileUpImg.get(0).onload = function () {
                            W.hidenewLoading();
                            EXIF.getData(this, function () {
                                window.Orientation = EXIF.getAllTags(this).Orientation;
                            });
                        };
                        thatu.fileUpImg.width(cardsWidth);
                        setTimeout(function () {
                            thatu.offsetTop = thatu.fileUpImg.get(0).offsetTop;
                            thatu.offsetLeft = thatu.fileUpImg.get(0).offsetLeft;
                            thatu.width = thatu.fileUpImg.width();
                            thatu.height = thatu.fileUpImg.height();
                            thatu.result = t.result;
                            thatu.initImgEvent();
                            window.fileUpImgWidth = thatu.fileUpImg.width();
                            window.fileUpImgHeight = thatu.fileUpImg.height();

                        }, 100)
                    };
                    W.shownewLoading();
                    reader.readAsDataURL(this.file);
                }
            },
            clipImg: function () {
                var thatt = this;
                if (!is_android() && window.Orientation != 1) {

                    var form = new FormData();
                    form.append("file", this.file);
                    var or = 0;
                    if (window.Orientation == 6) {
                        or = -90;
                    }
                    if (window.Orientation == 8) {
                        or = 90;
                    }
                    if (window.Orientation == 3) {
                        or = 180;
                    }
                    form.append("rotate", 0);
                    form.append("fileType", "." + thatt.file.name.split('.')[thatt.file.name.split('.').length - 1]);
                    W.shownewLoading(null, '图片上传中...');
                    $.ajax({
                        url: domain_url + "fileupload/file2base64/image",
                        type: "POST",
                        data: form,
                        async: true,        //异步
                        processData: false,  //很重要，告诉jquery不要对form进行处理
                        contentType: false,  //很重要，指定为false才能形成正确的Content-Type
                        complete: function() {
                            hidenewLoading();
                        },
                        success: function (data) {

                            W.hidenewLoading();
                            data1 = $.parseJSON(data);
                            if (data1.code == 0) {
                                thatt.drawlastImage("data:image/png;base64," + data1.base64Str);
                            }
                        },
                        error: function () {}
                    });
                } else {
                    thatt.drawlastImage()
                }
            },

            drawlastImage: function (url) {
                var thatt = this;
                var width = $("#filePrewImg").width();
                var height = $("#filePrewImg").height();
                thatt.drawImage({ src: !url ? this.result : url, ox: this.offsetLeft, oy: this.offsetTop, scale: this.scale, posX: this.posX, posY: this.posY, rotation: this.rotation, width: width, height: height }, function () {
                    $(".push_img").attr("src", thatt.canvas.toDataURL("image/png")).show();
                    thatt.reSetAll();
                    N.page.continueUp();
                });
            },
            createCanvas: function () {
                this.addClipBtn(); //添加裁剪按钮
                $mainPage.prepend('<canvas id="canvasTarget" width="'+ cardsWidth +'" height="'+ cardsHeight +'"></canvas>');
                this.canvas = $("#canvasTarget").get(0);
                this.ctx = this.canvas.getContext("2d");
                var $clipImg = $(".clipImg"),
                    offsetLeft = (cardsWidth-clipImgWidth)/2,
                    offsetTop = (cardsHeight-clipImgHeight)/2;

                $clipImg.css({
                    "width": clipImgWidth,
                    "left": offsetLeft ,
                    "top": offsetTop
                });
                var url = "./images/draw_m.png";
                this.drawImage({ src: url, ox: offsetLeft, oy: offsetTop, width: clipImgWidth, height: clipImgHeight });
            },
            drawImage: function (obj, fn, beforeFn) {
                var p = $.extend({
                    src: "",
                    ox: 0,
                    oy: 0
                }, obj || {});

                var that = this;

                var img = new Image();
                img.src = p.src;

                img.onload = function () {

                    if (beforeFn) {
                        beforeFn();
                    }
                    that.ctx.save();

                    if (p.posX) {
                        that.ctx.translate(p.posX, p.posY);
                    }
                    if (p.scale) {
                        if (window.l_scale != p.scale) {
                            that.ctx.translate((p.posX + p.width * p.scale / 2), (p.posY + p.height * p.scale / 2));
                            if (is_android()) {
                                that.ctx.scale(p.scale);
                            } else {
                                //that.ctx.scale(p.scale, p.scale);
                            }
                            that.ctx.translate(-(p.posX + p.width * p.scale / 2), -(p.posY + p.height * p.scale / 2));
                            window.l_scale = p.scale;
                        }
                    }


                    if (p.rotation) {
                        if (window.l_protation != p.rotation) {
                            that.ctx.translate(((cardsWidth - p.width) / 2 + p.width / 2), ((cardsHeight - p.height) / 2 + p.height / 2));
                            that.ctx.rotate(p.rotation * Math.PI / 180);
                            that.ctx.translate(-((cardsWidth - p.width) / 2 + p.width / 2), -((cardsHeight - p.height) / 2 + p.height / 2));
                            window.l_protation = p.rotation;
                        } else {
                            that.ctx.translate(((cardsWidth - p.width) / 2 + p.width / 2), ((cardsHeight - p.height) / 2 + p.height / 2));
                            that.ctx.rotate(p.rotation * Math.PI / 180);
                            that.ctx.translate(-((cardsWidth - p.width) / 2 + p.width / 2), -((cardsHeight - p.height) / 2 + p.height / 2));
                        }
                    }
                    if (p.width && p.height) {
                        if (p.rotation) {
                            that.ctx.drawImage(img, (cardsWidth - fileUpImgWidth * p.scale) / 2, (cardsHeight - fileUpImgHeight * p.scale) / 2, fileUpImgWidth * p.scale, fileUpImgHeight * p.scale);
                        } else {
                            that.ctx.drawImage(img, p.ox, p.oy, p.width, p.height);
                        }
                    } else {
                        that.ctx.drawImage(img, p.ox, p.oy);

                    }
                    that.ctx.restore();
                    that.ctx.globalCompositeOperation = "source-in";
                    if (fn) { fn(); }
                }
            },
            btn_animate: function(str){
                str.addClass('flipInY');
                setTimeout(function(){
                    str.removeClass('flipInY');
                },200);
            },
            createPrewImg: function () {
                this.createModel(); //创建蒙层
                this.createrClipImg(); //创建截取范围图像
                this.createCanvas(); //创建canvas对象
                this.pushPrewImg(); //把图像放到容器内
            },
            uploadInit: function () {
                this.file = this.getFile(); //得到上传图片对象
                this.createPrewImg(); //生成预览图片
            }
        };

        this.isShare = function () {
            var cu = getQueryString("cu"),
            //var cu = getQueryString("cu")||"53229d2784994a81971bf94425e7608f";//测试
             title = nickname + '给您拜年啦~~~',
             sharego_img = headimgurl ? (headimgurl + '/' + yao_avatar_size) : share_img;

            var getnewUrl = function(openid,cu) {
                var href = window.location.href;
                href = add_param(href,"cu",cu,true);
                href = add_param(href.replace(/[^\/]*\.html/i, 'make.html'), 'resopenid', hex_md5(openid), true);
                href = add_param(href, 'from', 'share', true);
                href = delQueStr(href, "openid");
                href = delQueStr(href, "headimgurl");
                href = delQueStr(href, "nickname");
                href = delQueStr(href, "id");
                href = delQueStr(href, "type");
                return add_yao_prefix(href);
            };

            if (cu) {
                $.ajax({
                    type: 'GET',
                    async: true,
                    url: domain_url + 'api/ceremony/greetingcard/get' + dev,
                    data: {cu: cu},
                    dataType: "jsonp",
                    jsonpCallback: 'callbackCardInfoHandler',
                    complete: function() {},
                    success: function(data) {
                        if (data.result) {
                            if(type){
                                window['shaketv'] && shaketv.wxShare(sharego_img, title, data.gt, getnewUrl(openid, cu));
                            }else{
                                resetDom(data.sn);
                                $(".push_img").attr("src", data.ou).show();
                                $("textarea").val(data.gt).attr("disabled","disabled").addClass("cu");
                                $("#wyzhk").removeClass("none");
                            }
                        }
                    },
                    error: function(xmlHttpRequest, error) {}
                });
            }else{
                $("#ok").removeClass("none");
                $(".btn_upload").removeClass("none");
            }
        };
        this.init = function () {
            this.isShare();
            this.loadImg();
            this.initParam();
            this.initEvent();
        };
        this.init();
    })
});
