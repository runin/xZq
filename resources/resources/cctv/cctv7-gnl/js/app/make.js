(function($) {
	H.make = {
		fileupImgWidth:0,
		fileupImgHeight:0,
		clipImgWidth : 300,
		clipImgHeight : 300,
		cu:"",
		flag : false,
		info:"",
		imgSrc:"",
		cardSrc:"",
		uploadVoiceID:"",
		type:"",
		init: function() {
			this.event();
		},
		init_card : function(){
			$("#hk").attr("src","images/card/hk1.jpg");
			$(".push_img").attr("src","images/default-head.png");
			$(".zfy").val("").removeAttr("disabled");
			$(".word-wrapper").removeClass("none");
			$(".voice-wrapper").addClass("none");
			$(".voice-show").addClass("none");
			$("#wyzhk").removeClass("none").removeClass("requesting");
			$("#ok").addClass("none");
		},
		event: function() {
			$(".arrow").click(function(e){
		    	e.preventDefault();
		    	$(".card-warp").removeClass("none")
		    })
			$(".back").click(function(e){
		    	e.preventDefault();
		    	toUrl("yao.html");
		    })
		    $(".card-hk").click(function(e){
		    	e.preventDefault();
		    	$(".card-hk").removeClass("hk-select");
		    	$(this).addClass("hk-select")
		    })
		    $("#btn-crm").click(function(e){
		    	e.preventDefault();
		    	if(!$(".card-hk").hasClass("hk-select")){
		    		showTips("请选择您喜欢的拜年卡片");
		    		return;
		    	}
		    	var data_id = $(".hk-select").attr("data_id")
		    	$("#hk").attr("src",$(".hk-select img").attr("src"));
		    	$("#hk").attr("cardId",data_id);
		    	$(".card-warp").addClass("none");
		    	$(".card-hk").removeClass("hk-select");
		    });
		    $('#btn_upload').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('requestingImg')) {
                   showTips("正在获取图片中")
                    return;
                }
                if ($(this).hasClass('requesting')) {
                    return;
                }
                
                $('#input-file-upload').trigger('click');
            });
            $("#wyzhk").click(function(e){
                e.preventDefault();
                var me = H.make;
                if($(this).hasClass("requesting")){
                	return;
                }
                $(this).addClass("requesting");
                me.cardSrc = $("#hk").attr("cardId");
                if (H.index.cardDetailType == 0) {
                    // 提交文字
                    me.info = $.trim($('textarea').val());
                    me.info = me.info.replace(/<[^>]+>/g, '');
                    me.uploadVoiceID = "";
                    if (me.info.length == 0) {
                        showTips('什么祝福都没写呢~');
                        $('textarea').focus();
                        $('textarea').val('');
                        $("#wyzhk").removeClass("requesting");
                        return false;
                    }
                } else {
                    // 提交语音
                    me.info = "";
                    if (H.index.localVoiceID == ''|| H.index.localVoiceID.length == 0) {
                        H.voice.reset();
                        showTips('点击话筒录制一段祝福吧~');
                        $("#wyzhk").removeClass("requesting");
                        return false;
                    }
                    $('#btn-play').removeClass('play');
                    wx.stopVoice({
                        localId: H.index.localVoiceID
                    });
                  
               }
               var imgSrc = "";
               if(H.make.flag){
               		var base64Img = $(".push_img")[0].src ;
                	uploadFinalImg(base64Img,function ($img) {
	                	$(".push_img").attr("src",$img.attr("src"))
	                	me.imgSrc =$(".push_img").attr("src");
	                	if (H.index.cardDetailType == 0) {
	                		H.make.make_card(4);
	                	}else{
	                		shownewLoading(null, '贺卡制作中...');
	                		H.voice.uploadVoice();
	                	}
            		});
                }else{
                	 me.imgSrc = $(".push_img").attr("src");
                	 if (H.index.cardDetailType == 0) {
	                	H.make.make_card(4);
	                 }else{
	                 	shownewLoading(null, '贺卡制作中...');
	                	H.voice.uploadVoice();
	                 };
                }
                
             });
              $('#btn-play').click(function(e) {
                e.preventDefault();
                if ($('#btn-play').hasClass('play')) {
                    H.voice.stopVoice(H.index.localVoiceID);
                    $('#btn-play').removeClass('play');
                } else {
                    $('#btn-play').addClass('play');
                    H.voice.playVoice(H.index.localVoiceID);
                }
             }) 
		},
		make_card : function(type){
			var me = this;
			shownewLoading(null, '贺卡制作中...');
            $.ajax({
	            type: 'GET',
	            async: false,
	            url: domain_url + 'api/ceremony/greetingcard/make' + dev,
	            data: {
	              oi: shaketv_openid,
	              vi: me.uploadVoiceID,  //语音编号
	              gt: encodeURIComponent(me.info),
	              sn: me.cardSrc,
	              ou: me.imgSrc,
	              hi: headimgurl || "images/default-head.png",
	              nn : nickname || "匿名用户"            
	            },
	            dataType: "jsonp",
	            jsonpCallback: 'callbackMakeCardHandler',
	            complete: function() {
	            },
	            success: function(data) {
	               if(data.result == true){
	               		H.make.saveCardPort(type,data.cu)
	                }else {
	                    hidenewLoading();
	                    me.init_card();
	                    showTips('大家太热情了！请喝杯茶后重试^_^');
	                }
	             },
	             error: function(xmlHttpRequest, error) {
	             	 me.init_card();
	                 showTips('大家太热情了！请喝杯茶后重试^_^');
	             }
	           });
		},
	    saveCardPort: function(type,cu) {
	    	var me = this;
	    	shownewLoading(null, '贺卡制作中...');
            if (type == 3) {
                var baseType = me.uploadVoiceID;
                var content = me.imgSrc;
            } else {
                var baseType = me.imgSrc;
                var content = me.info;
            }
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/uploadrecord/save' + dev,
                data: {
                    openid: shaketv_openid,
                    nickname: nickname ? encodeURIComponent(nickname) : "",
                    headimgurl: headimgurl ? headimgurl : "",
                    title: me.cardSrc,
                    content: encodeURIComponent(content),
                    type: type,
                    url: baseType
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackUploadRecordSaveHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                	if(data&&data.code == 0){
	                   toUrl("card.html?type=make&cu="+cu);
	                }else {
	                    hidenewLoading();
	                    me.init_card();
	                    showTips('大家太热情了！请喝杯茶后重试^_^');
	                }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
		initImgEvent: function (imgContain, drawImg) {
            window.posX = 0;
            window.posY = 0;
            window.last_posX = 0;
            window.last_posY = 0;
            window.scale = 1;
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
            	ev.preventDefault();
            	ev.stopPropagation();
                switch (ev.type) {
                    case 'touch':
//                      window.last_scale = window.scale;
//                      window.last_rotation = window.rotation;
                        break;
                    case 'drag':
                        window.posX = ev.gesture.deltaX + window.last_posX;
                        window.posY = ev.gesture.deltaY + window.last_posY;
                        break;
                    case 'transform':
//                      window.rotation = ev.gesture.rotation; //头像旋转角度
//                      window.scale = Math.min(5, Math.max(window.last_scale * ev.gesture.scale, 0.5)); //头像缩放比
                        break;
                }
                window.transform = "translate(" + window.posX + "px," + window.posY + "px)";
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
            
       },
       setCanvas: function () {
            var me = this;
            var myCanvas = document.createElement('canvas');
            var context = myCanvas.getContext("2d");
                myCanvas.width = me.clipImgWidth; //赋值
                myCanvas.height = me.clipImgHeight; //赋值
                $(".imgContain").append(myCanvas);
                $(".imgContain").find("canvas").addClass("hidden").css({
                	"position":"absolute",
                	"top":"0",
                	"left":"0"
                });
                if (window.Orientation != 1&&!is_android()) {//此种情况为发生偏转
                    uploadTurnImg(function (img) {
                        H.make.draw_last_img({ ctx: context, canvas: myCanvas, img: img, originalImgWidth: H.make.fileupImgWidth, originalImgHeight: H.make.fileupImgHeight, containWidth: H.make.clipImgWidth, containHeight: H.make.clipImgHeight, posX: posX, posY: posY, scale: scale, rotation: rotation});
                    });
                } else {
                     H.make.draw_last_img({ ctx: context, canvas: myCanvas, img: $(".fileupImg"), originalImgWidth: H.make.fileupImgWidth, originalImgHeight: H.make.fileupImgHeight, containWidth: H.make.clipImgWidth, containHeight: H.make.clipImgHeight, posX: posX, posY: posY, scale: scale, rotation: rotation});
                }
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
                scale: 1, //放大倍数
                rotation: ""//旋转角度
            }, obj || {});
            p.imgWidth = p.originalImgWidth;
            p.imgHeight = p.originalImgHeight;
            var ctx = p.ctx;
            ctx.save(); //先保全图像
            ctx.translate(-(p.imgWidth-p.containWidth)/2,-(p.imgHeight-p.containHeight)/2);
            if (p.posX) {
                ctx.translate(p.posX, p.posY); //偏移距离
            }
//          if (p.rotation) {
//              ctx.translate(p.imgWidth / 2, p.imgHeight / 2);
//              ctx.rotate(p.rotation * Math.PI / 180);
//              ctx.translate(-p.imgWidth / 2, -p.imgHeight / 2);
//          }
            //根据高宽比例画图
            ctx.drawImage(p.img.get(0), 0, 0, p.originalImgWidth * p.scale, p.originalImgHeight * p.scale);
            ctx.restore();
            ctx.globalCompositeOperation = "destination-over";
            var base64Img = p.canvas.toDataURL("image/" + uploadFile.name.split('.')[uploadFile.name.split('.').length - 1]);
            $(".push_img")[0].src = base64Img;
        },
        setClip : function(){
			var me = this;
        	$(".imgContain").append('<img class="clipImg" src="images/draw.png" />');
             var offsetTop = (me.fileupImgHeight - me.clipImgHeight)/2;
             var offsetLeft = (me.fileupImgWidth - me.clipImgWidth)/2;
             $(".imgContain").find(".clipImg").css({
               	"width": me.clipImgWidth,
                "height": me.clipImgHeight,
                "min-width": 300,
                "min-height": 300,
                "position":"absolute",
                "top": offsetTop,
                "left": offsetLeft
             });
             this.addClipBtn();
        },
        addClipBtn: function () {
           var me = this;
           var clipBtn = $("<div id='clipBtn' >截 图</div>");
           $(".modal").prepend(clipBtn);
           clipBtn.unbind("click").click(function () {
               me.setCanvas();
            $("#mainPage").empty().addClass("none");
           });
        }   
    };
})(Zepto);

$(function() {
	H.wxRegister.ready();
    H.wxRegister.init();
    H.index.init();
    H.make.init();
});


function fileSelected() {
    var $file_upload = document.getElementById('input-file-upload'),
		count = $file_upload.files.length,
		img_id = 'img-' + new Date().getTime();
		H.make.flag = true;
    if (count > 1) {
        return;
    }
    $("#btn-upload").addClass("requestingImg");
    shownewLoading();

    {  //载入本地上传的图片
        if ($file_upload.files && $file_upload.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#mainPage").append('<div class="modal"><div class="imgContain hidden"><img class="fileupImg" /></div></div>').removeClass("none");
                var fileupImg = $(".fileupImg").get(0) ;
                var imgContain = $(".imgContain"); //图片的容器
                fileupImg.onload = function () {
                    EXIF.getData(this, function () {//如果变量 window.Orientation 不等于1 证明是反转的
                        window.Orientation = EXIF.getAllTags(this).Orientation;
                    });
                    H.make.fileupImgWidth = $(".fileupImg").width();
                    H.make.fileupImgHeight = $(".fileupImg").height();
                    $(".imgContain").css({
                    	"width": H.make.fileupImgWidth,
                    	"height":H.make.fileupImgHeight,
                    	"position":"absolute",
                    	"top":"50%",
                    	"left":"50%",
                    	"margin-top":-H.make.fileupImgHeight/2,
                    	"margin-left":-H.make.fileupImgWidth/2
                    }).removeClass("hidden");
                    H.make.setClip();
                    H.make.initImgEvent(imgContain, fileupImg);
                    $("#btn-upload").removeClass("requestingImg");
                    $file_upload.outerHTML = $file_upload.outerHTML;
                };
                $(".fileupImg").attr('src', e.target.result);
               hidenewLoading();

            };
            window.uploadFile = $file_upload.files[0];
            reader.readAsDataURL(window.uploadFile);
        }
    }
}

function uploadTurnImg(fn) { //上传反转的图片
        shownewLoading()
        var form = new FormData();
        var file = window.uploadFile;
        form.append("file", file);
        form.append("rotate", 0);
        form.append("fileType", "." + file.name.split('.')[file.name.split('.').length - 1]);
        $.ajax({
            url: domain_url + "api/fileupload/file2base64/image"+dev,
            type: "POST",
            data: form,
            async: true,        //异步
            processData: false,  //很重要，告诉jquery不要对form进行处理
            contentType: false,  //很重要，指定为false才能形成正确的Content-Type
            success: function (data) {
                hidenewLoading()
                data1  = $.parseJSON(data);
                if (data1.code == 0) {
                    var img = new Image();
                    img.onload = function () {
                        if (fn) {
                            fn($(img));
                        }
                    };
                    img.src = "data:image/png;base64," + data1.base64Str;

                } else {
                     hidenewLoading()
                }
            },
            error: function () {
                 hidenewLoading()
            }
        });
}
function uploadFinalImg(base64Img,fn) {//上传切割后图像
    var url = domain_url + 'api/fileupload/base64/image'+dev;
    var form = new FormData();
    var file = base64Img.substring(22);
    form.append("base64String ", file);
    form.append("fileType ", "png");
    shownewLoading(null, '贺卡制作中...');
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
                var img = new Image();
                img.onload = function () {
                    if (fn){
                      fn($(img));
                    }
                };
                img.src = data.filePath;
            } else {
                hidenewLoading();
                H.make.init_card();
                showTips("抱歉上传失败")
            }
        },
        error: function () {
            hidenewLoading();
            H.make.init_card();
            showTips("抱歉上传失败")
        }
    });
}

