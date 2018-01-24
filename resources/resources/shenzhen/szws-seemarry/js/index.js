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
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());

        },
        page: {
            mainPage: function (fn) {
                window.location.hash = "mainPage";
                N.showPage("mainPage", function () {
                    $(".btn_man").show();
                    $(".btn_lady").show();
                    $(".btn_upload_change").hide();
                    $(".send_success").hide();
                    $(".btn_upload").hide();
                    $(".success_tip").hide();
                    if (fn) {
                        fn();
                    }
                })
            },
            uploadImg: function (fn) {
                window.location.hash = "uploadImg";
                N.showPage("mainPage", function () {
                    $(".btn_man").hide();
                    $(".btn_lady").hide();
                    $(".btn_upload_change").hide();
                    $(".send_success").hide();
                    $(".success_tip").hide();
                    $(".btn_upload").show();
                    if (fn) {
                        fn();
                    }
                })
            },
            continueUp: function (fn) {
                window.location.hash = "continueUp";
                N.showPage("mainPage", function () {
                    $(".btn_man").hide();
                    $(".btn_lady").hide();
                    $(".btn_upload_change").show();
                    $(".send_success").show();
                    $(".success_tip").hide();
                    $(".btn_upload").hide();
                    if (fn) {
                        fn();
                    }
                })

            }
        }
    };
    N.module("mainPage", function () {
        var imgs = ["./images/lady.jpg", "./images/man.jpg", "./images/man_face_m.png", "./images/lady_face_m.png", "./images/man_face.png", "./images/lady_face.png"];
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
            this.manBtn = $(".btn_man");
            this.ladyBtn = $(".btn_lady");
            this.mainPage = $("#mainPage");
            this.btn_upload = $(".btn_upload");
            this.tarfile = $("#tarfile");
            this.selectSex = 0; //0,代表男，1代表女
            this.btn_upload_change = $(".btn_upload_change");
            this.send_success = $(".send_success");
            this.tarfile_form = $("#tarfile_form");
            this.success_tip = $(".success_tip");
            this.mainPage_manName = $(".mainPage_manName");
            this.mainPage_ladyName = $(".mainPage_ladyName");
        }
        this.initEvent = function () {//初始化事件
            var that = this;
            this.manBtn.unbind("click").click(function () {

                that.mainPage.css("background-image", "url('./images/man.jpg')");
                that.selectSex = 0;
                window.selectSex = 0;
                if (nickname) {
                    that.mainPage_manName.html(nickname);
                    that.mainPage_ladyName.html("王丽坤");
                } else {
                    that.mainPage_manName.html("佟大为");
                }
                $(".push_img_lady").hide();
                $(".push_img_man").hide();
                N.page.uploadImg();
            });
            this.ladyBtn.unbind("click").click(function () {
                that.mainPage.css("background-image", "url('./images/lady.jpg')");
                that.selectSex = 1;
                window.selectSex = 1;
                if (nickname) {
                    that.mainPage_ladyName.html(nickname);
                    that.mainPage_manName.html("佟大为");
                } else {
                    that.mainPage_ladyName.html("王丽坤");
                }

                $(".push_img_lady").hide();
                $(".push_img_man").hide();
                N.page.uploadImg();
            });
            this.btn_upload.unbind("click").click(function () {//上传图片
                that.tarfile.trigger("click");
            });
            this.tarfile.unbind("change").change(function () {
                that.uploadArea.uploadInit();
            });
            this.btn_upload_change.unbind("click").click(function () {
                that.tarfile.trigger("click");
            });
            this.send_success.unbind("click").click(function () {
                that.success_tip.show();
            });
        };
        var that = this;
        var Addthat = this;
        this.uploadArea = {
            getFile: function () {
                return that.tarfile.get(0).files[0];
            },
            createModel: function () {
                $("#mainPage").prepend("<div class='modal'></div>");
            },
            createrClipImg: function () {
                if (that.selectSex == 0) {//男
                    $("#mainPage").prepend("<img  src='./images/man_face.png' class='clipImg man_facef' />");

                } else {//女
                    $("#mainPage").prepend("<img src='./images/lady_face.png'  class='clipImg lady_facef' />");

                }
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
                window.hammertime = new Hammer($("#mainPage").get(0), {
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
                    //thatu.drawImage2();
                });
                hammertime.on('touchend', function (ev) {

                    thatu.last_posX = thatu.posX;
                    thatu.last_posY = thatu.posY;
                });


            },
            addClipBtn: function () {
                var that = this;
                that.clipBtn = $("<div id='clipBtn' >截图</div>");
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
                W.showLoading();
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
                            W.hideLoading();
                            //alert("抱歉上传失败")
                        }
                    },
                    error: function () {
                        W.hideLoading();
                        alert("抱歉上传失败")
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
                        $("#mainPage").append("<img id='filePrewImg' />");
                        thatu.fileUpImg = $("#filePrewImg");
                        var t = this;
                        thatu.fileUpImg.attr("src", this.result);

                        thatu.fileUpImg.get(0).onload = function () {
                            W.hideLoading();



                            EXIF.getData(this, function () {
                                window.Orientation = EXIF.getAllTags(this).Orientation;


                            });
                        }
                        thatu.fileUpImg.width(320);
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
                    }
                    W.showLoading();
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
                    W.showLoading();

                    $.ajax({
                        url: domain_url + "fileupload/file2base64/image",
                        type: "POST",
                        data: form,
                        async: true,        //异步
                        processData: false,  //很重要，告诉jquery不要对form进行处理
                        contentType: false,  //很重要，指定为false才能形成正确的Content-Type
                        success: function (data) {

                            W.hideLoading();
                            data1 = $.parseJSON(data);
                            if (data1.code == 0) {
                                thatt.drawlastImage("data:image/png;base64," + data1.base64Str)

                            } else {
                                W.hideLoading();
                            }
                        },
                        error: function () {
                            W.hideLoading();
                        }
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
                    if (that.selectSex == 0) {
                        $(".push_img_man").attr("src", thatt.canvas.toDataURL("image/png")).show();
                        $(".push_img_lady").hide();
                    } else {

                        $(".push_img_lady").attr("src", thatt.canvas.toDataURL("image/png")).show();
                        $(".push_img_man").hide();
                    }
                    $("#mainPage").css("background-image", "url('./images/two.jpg')");
                    thatt.reSetAll();
                    N.page.continueUp();
                    thatt.uploadImg(function (fileurl) {
                        var url = domain_url + "shenzhen/seemarry/upload?op=" + openid + "&nn=" + nickname + "&hi=" + headimgurl + "&t=&oi=&si=" + fileurl + "&ty=" + (that.selectSex == 0 ? 1 : 2);
                        N.loadData({ url: url, callbackSeemarryUpload: function (data) {
                            W.hideLoading();
                            if (data.code == 0) {
                                share_url = add_param(share_url, 'uuid', data.uuid, true);
                                share_url = add_param(share_url, 'resopenid', hex_md5(openid), true);
                                window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, add_yao_prefix(share_url));
                            }
                        }, showload: false
                        });
                    });
                });
            },
            clipImg2: function () {
                var thatt = this;
                var width = $("#filePrewImg").width();
                var height = $("#filePrewImg").height();
                if (that.selectSex == 0) {
                    $(".push_img_man").attr("src", thatt.canvas.toDataURL("image/png")).show();
                    $(".push_img_lady").hide();
                } else {
                    $(".push_img_lady").attr("src", thatt.canvas.toDataURL("image/png")).show();
                    $(".push_img_man").hide();
                }
                $("#mainPage").css("background-image", "url('./images/two.jpg')");
                thatt.reSetAll();
                N.page.continueUp();

            },
            createCanvas: function () {
                this.addClipBtn(); //添加裁剪按钮
                $("#mainPage").prepend('<canvas id="canvasTarget" width="320px" height="504px"  ></canvas>');
                this.canvas = $("#canvasTarget").get(0);
                this.ctx = this.canvas.getContext("2d");
                var item = $(".clipImg");
                var offsetLeft = item.get(0).x;
                var offsetTop = item.get(0).y;
                var url = that.selectSex == 0 ? "./images/man_face_m.png" : "./images/lady_face_m.png";
                this.drawImage({ src: url, ox: 85, oy: 151.5, width: 150, height: 201 });
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
                            that.ctx.translate(((320 - p.width) / 2 + p.width / 2), ((504 - p.height) / 2 + p.height / 2));
                            that.ctx.rotate(p.rotation * Math.PI / 180);
                            that.ctx.translate(-((320 - p.width) / 2 + p.width / 2), -((504 - p.height) / 2 + p.height / 2));
                            window.l_protation = p.rotation;
                        } else {
                            that.ctx.translate(((320 - p.width) / 2 + p.width / 2), ((504 - p.height) / 2 + p.height / 2));
                            that.ctx.rotate(p.rotation * Math.PI / 180);
                            that.ctx.translate(-((320 - p.width) / 2 + p.width / 2), -((504 - p.height) / 2 + p.height / 2));
                        }
                    }
                    if (p.width && p.height) {
                        if (p.rotation) {
                            that.ctx.drawImage(img, (320 - fileUpImgWidth * p.scale) / 2, (504 - fileUpImgHeight * p.scale) / 2, fileUpImgWidth * p.scale, fileUpImgHeight * p.scale);
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
            drawImage2: function () {
                var thatt = this;
                this.ctx.clearRect(0, 0, 320, 504);
                var width = $("#filePrewImg").width();
                var height = $("#filePrewImg").height();
                var url = selectSex == 0 ? "./images/man_face_m.png" : "./images/lady_face_m.png";
                this.drawImage({ src: url, ox: 85, oy: 151.5, width: 150, height: 201 });

                this.drawImage({ src: this.result, ox: this.offsetLeft, oy: this.offsetTop, scale: this.scale, posX: this.posX, posY: this.posY, rotation: this.rotation, width: width, height: height, isTwo: true });

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
            var uuid = getQueryString("uuid");
            if (uuid) {
                N.loadData({ url: domain_url + "shenzhen/seemarry/get?uuid=" + uuid, callbackSeemarryGet: function (data) {
                    if (data.ty == 1) {
                        $(".push_img_man").attr("src", data.si).show();
                        $(".mainPage_manName").html(data.nn);
                        $(".push_img_lady").hide();
                    } else {
                        $(".push_img_lady").attr("src", data.si).show();
                        $(".mainPage_ladyName").html(data.nn);
                        $(".push_img_man").hide();
                    }
                }
              , showload: false
                });

            }
        };
        this.init = function () {
            this.isShare();
            this.loadImg();
            this.initParam();
            this.initEvent();
            N.page.mainPage();


        }
        this.init();

    })

});
