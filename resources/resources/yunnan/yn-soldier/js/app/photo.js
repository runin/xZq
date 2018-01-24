(function ($) {
    H.photo = {
        from: getQueryString('from'),
        actUuid: null,
        photoUrl: "",
        currentUrl: "",
        finalUrl: "",
        headImg: null,
        $img_ctrl: $(".img-ctrl"),
        name: null,
        resuuid: null,
        uuid: getQueryString('uuid'),
        upFile: null,
        type: 1,
        init: function () {
            var me = this;
            H.photo.type = 1;
            if(getQueryString('type')&&getQueryString('type')==2){
            	H.photo.type = 2;
            }
            me.photo_act();
            me.event_handler();
        },
        event_handler: function () {
            var me = this;
            $("#btn-cor").click(function(e){
            	e.preventDefault()
            	toUrl("answer.html");
            });
            $("#btn-yao").click(function (e) {
                e.preventDefault();
                toUrl("yaoyiyao.html");
            });
            $('#btn-upload').click(function (e) {
                e.preventDefault();
                if ($(this).hasClass('requestingImg')) {
                    H.photo.tip_text($(".form-item"), "正在获取图片中", true);
                    return;
                }
                if ($(this).hasClass('requesting')) {
                    return;
                }
                $('#input-file-upload').trigger('click');
            });
            $('#btn-submit').click(function (e) {
                e.preventDefault();
                if ($("#img-ctrl .ic").length < 1) {
                    H.photo.tip_text($(".form-item"), "请先上传图片", true);
                    return;
                }
                if ($(this).hasClass('requesting')) {
                    return;
                }
                $(this).addClass('requesting');

                H.photo.photoed();
                $(".mix-photo").addClass("photoed").removeClass("none");
                H.photo.draw_first_img();
            });
            $('.photoBox').on('click', '.rephoto', function (e) {
                e.preventDefault();
                $("#img-ctrl").find(".ic").remove();
                $('#btn-upload').removeClass('none');
                $(".star-photo").removeClass("photoed");
                $(".btn-submit").addClass("none");
                $(".photo-tip").removeClass("none");
                $(this).addClass('none');
            });
            $('.photoedBox').on('click', '#btn-refresh', function (e) {
                e.preventDefault();
                H.photo.type = 2;
                H.photo.canPhoto();
                H.photo.photo_act();
                $(".final-photo").attr("src", "");
            });
            $('.back-index').click(function (e) {
                e.preventDefault();
                toUrl("index.html");
            });
            $(".close-photo").click(function (e) {
                e.preventDefault();
                H.photo.type = 2;
                H.photo.canPhoto();
                H.photo.photo_act();
                $(".final-photo").attr("src", "");
            });
        },
        tip_text: function (contain, str, hide) {
            var t = simpleTpl();
            t._('<span class="tips">' + str + '</span>');
            contain.append(t.toString());
            $(".tips").show();
            if (hide) {
                setTimeout(function () {
                    contain.find(".tips").remove();
                }, 1500);
            }
        },
        photo_act: function () {
            getResult('gzlive/photo/indexhx', { openid: openid, type: H.photo.type }, 'photoIndexHxHandler', true);
        },
        draw_first_img: function () {
            var me = this;
            var photoImg = new Image();
            var myCanvas = document.createElement('canvas');
            var context = myCanvas.getContext("2d");
            //后台配
            photoImg.src = H.photo.photoUrl;
            photoImg.onload = function () {
                var contain = $(".mix-info");
                var contain_w = contain.width();
                var contain_h = contain.height();
                myCanvas.width = window.starimg_w; //赋值
                myCanvas.height = window.starimg_h; //赋值
                window.containWidth = contain_w; //容器宽度等于canvas的宽度
                window.containHeight = contain_h; //容器高度等于canvas的高度
                context.save();
                context.drawImage(photoImg, 0, 0, 400, 400); //画第一张图片
                context.restore();
                context.globalCompositeOperation = "destination-over";
                console.log(myCanvas);
                $(".mix-info").append(myCanvas);
                  if (window.Orientation != 1 && !is_android()) {//此种情况为发生偏转
                      uploadTurnImg(function (img) {
                          H.photo.draw_last_img({ ctx: context, canvas: myCanvas, img: img, originalImgWidth: originalImgWidth, originalImgHeight: originalImgHeight, containWidth: containWidth, containHeight: containHeight, posX: posX, posY: posY, scale: scale, rotation: rotation });
                      });
                } else {
                      H.photo.draw_last_img({ ctx: context, canvas: myCanvas, img: $(".ic"), originalImgWidth: originalImgWidth, originalImgHeight: originalImgHeight, containWidth: containWidth, containHeight: containHeight, posX: posX, posY: posY, scale: scale, rotation: rotation });
                }
            };
        },
        draw_last_img: function (obj) {
            var p = $.extend({
                ctx: "", //cavas的上下文对象
                img: "", //要画到canvas上面的图片对象（jq对象）
                originalImgWidth: "", //图片的原始宽度
                originalImgHeight: "", //图片的原始高度
                imgWidth: "", //图片变换后的宽度
                imgHeight: "", //图片变换后的高度
                containWidth: 0, //canvas容器的宽度
                containHeight: 0, //canvas容器的高度
                posX: "", //x偏移量
                posY: "", //y偏移量
                scale: 4, //放大倍数
                rotation: ""//旋转角度
            }, obj || {});
            p.imgWidth = p.originalImgWidth;
            p.imgHeight = p.originalImgHeight;
            var ctx = p.ctx;
            ctx.save(); //先保全图像
            if (p.posX) {
                ctx.translate(p.posX, p.posY); //偏移距离
            }
            if (p.rotation) {
                ctx.translate(p.imgWidth / 2, p.imgHeight / 2);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.translate(-p.imgWidth / 2, -p.imgHeight / 2);

            }
            //根据高宽比例画图
            ctx.drawImage(p.img.get(0), -(p.originalImgWidth * p.scale - p.originalImgWidth) / 2, -(p.originalImgHeight * p.scale - p.originalImgHeight) / 2, p.originalImgWidth * p.scale, p.originalImgHeight * p.scale);
            ctx.restore();
            ctx.globalCompositeOperation = "destination-over";
            $(".final-photo")[0].src = p.canvas.toDataURL("image/" + uploadFile.name.split('.')[uploadFile.name.split('.').length - 1]);
            uploadFinalImg(p.canvas);
        },
        canPhoto: function () {
            $(".photoBox").removeClass("none");
            $(".photoedBox").addClass("none");
        },
        photoed: function () {
            $(".photoBox").addClass("none");
            $(".photoedBox").removeClass("none");
            $(".mix-info").addClass("photoed");
        },
        finalPic: function (data) {
            //合照状态
            H.photo.resuuid = data.luuid;
            $(".person-info label:first-child").find("img").attr("src", data.lh);
            $(".person-info label:first-child").find("span").html(data.lu);
            $("#vote").text(data.lvn);
            if (data.lf) {
                $("#vote").removeClass("voted");
            } else {
                $("#vote").addClass("voted");
            }
            $(".final-photo").attr("src", data.li).removeClass("none");
            H.photo.photoed();
            return;
        },
        initImgEvent: function (imgContain, drawImg) {
            window.posX = 0;
            window.posY = 0;
            window.last_posX = 0;
            window.last_posY = 0;
            window.scale = 4;
            window.last_scale = 0;
            window.rotation = 0;
            window.last_rotation = 0;
            if (window.hammertime) {
                window.hammertime = null;
            }
            window.hammertime = new Hammer(imgContain.get(0), {
                preventDefault: true,
                transformMinScale: 1,
                dragBlockHorizontal: true,
                dragBlockVertical: true,
                dragMinDistance: 0
            });
            hammertime.on('touch drag transform', function (ev) {
                switch (ev.type) {
                    case 'touch':
                        window.last_scale = window.scale;
                        window.last_rotation = window.rotation;
                        break;
                    case 'drag':
                        window.posX = ev.gesture.deltaX + window.last_posX;
                        window.posY = ev.gesture.deltaY + window.last_posY;
                        break;
                    case 'transform':
                        window.rotation = ev.gesture.rotation; //头像旋转角度
                        window.scale = Math.min(5, Math.max(window.last_scale * ev.gesture.scale, 0.5)); //头像缩放比
                        break;
                }
                window.transform = "translate(" + window.posX + "px," + window.posY + "px)" + "scale(" + window.scale + "," + window.scale + ") " + "rotate(" + window.rotation + "deg) ";
                drawImg.style.transform = window.transform;
                drawImg.style.oTransform = window.transform;
                drawImg.style.msTransform = window.transform;
                drawImg.style.mozTransform = window.transform;
                drawImg.style.webkitTransform = window.transform;
            });

            hammertime.on('dragend', function () {
                window.last_posX = window.posX;
                window.last_posY = window.posY;	
            });
            
        }

    };
    W.photoIndexHxHandler = function (data) {
        if (data.code == 0) {
            H.photo.type = 1;
            if (!data.luuid) {
                H.photo.actUuid = data.au;
                H.photo.photoUrl = "data:image/png;base64," + data.base64Str;
                $("#star").attr("src", data.ai);
                $("#star").get(0).onload = function () {
                    $("#btn-upload").removeClass("requesting");
                    window.starimg_w = $(this).width(); //记住合照模版图片的宽度
                    window.starimg_h = $(this).height(); //记住合照模版图片的高度
                }
                H.photo.canPhoto();
            } else {
            	$("#btn-refresh").removeClass("none");
                shareuuid = data.luuid;
                H.photo.finalPic(data)
            }
        }
    };
    W.photeRecordHxHandler = function (data) {
        if (data.code == 0) {
            H.photo.resuuid = data.resuuid;
            $('#btn-submit').removeClass("requesting");
            toUrl("result.html?uuid=" + data.resuuid+"&enter=self");
        }
    };

})(Zepto);

$(function () {
    H.photo.init();
});


function fileSelected() {
    var $file_upload = document.getElementById('input-file-upload'),
		count = $file_upload.files.length,
		img_id = 'img-' + new Date().getTime();
    if (count > 1) {
        return;
    }
    $("#btn-upload").addClass("requestingImg");
    W.showLoading();

    {  //载入本地上传的图片
        if ($file_upload.files && $file_upload.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#img-ctrl").append('<img class="ic" />');
                var t_img = $(".ic");
                t_img.get(0).onload = function () {
                    EXIF.getData(this, function () {//如果变量 window.Orientation 不等于1 证明是反转的
                        window.Orientation = EXIF.getAllTags(this).Orientation;
                    });
                    var imgContain = $(".star-photo"); //图片的容器
                    window.originalImgWidth = $(".ic").width();
                    window.originalImgHeight = $(".ic").height();
                    H.photo.initImgEvent(imgContain, t_img.get(0));
                    console.log("未缩放"+originalImgWidth);
                    $("#btn-upload").addClass("none");
                    $(".star-photo").addClass("photoed");
                    $(".btn-submit").removeClass("none");
                    $(".photo-tip").addClass("none");
                    $(".close").removeClass("none");
                    $("#btn-upload").removeClass("requestingImg");
                    $file_upload.outerHTML = $file_upload.outerHTML;
                };
                t_img.attr('src', e.target.result);
                W.hideLoading();

            };
          
            window.uploadFile = $file_upload.files[0];
            reader.readAsDataURL(window.uploadFile);
        }
    }
}

function uploadTurnImg(fn) { //上传反转的图片
        W.showLoading();
        var form = new FormData();
        var file = window.uploadFile;
        form.append("file", file);
        form.append("rotate", 0);
        form.append("fileType", "." + file.name.split('.')[file.name.split('.').length - 1]);
        $.ajax({
            url: domain_url + "api/fileupload/file2base64/image",
            type: "POST",
            data: form,
            async: true,        //异步
            processData: false,  //很重要，告诉jquery不要对form进行处理
            contentType: false,  //很重要，指定为false才能形成正确的Content-Type
            success: function (data) {
                W.hideLoading();
                data1 = $.parseJSON(data);
                if (data1.code == 0) {
                    var img = new Image();
                    img.onload = function () {
                        if (fn) {
                            fn($(img));
                        }
                    };
                    img.src = "data:image/png;base64," + data1.base64Str;

                } else {
                    W.hideLoading();
                }
            },
            error: function () {
                W.hideLoading();
            }
        });
}


function uploadFinalImg(tran_canvas) {//上传切割后图像
    var url = domain_url + 'api/fileupload/base64/image';
    var form = new FormData();
    var file = tran_canvas.toDataURL("image/png").substring(22);
    form.append("base64String ", file);
    form.append("fileType ", "png");
    H.photo.tip_text($(".form-item"), "生成作品中", true);
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
                W.hideLoading();
              
                var nickName = encodeURIComponent(H.photo.name);
                getResult('gzlive/photo/recordhx', { actUuid: H.photo.actUuid, openid: openid, photo: data.filePath, head: H.photo.headImg, name: nickName }, 'photeRecordHxHandler', true);
            } else {
                W.hideLoading();
                alert("抱歉上传失败")
            }
        },
        error: function () {
            W.hideLoading();
            alert("抱歉上传失败")
        }
    });
}

