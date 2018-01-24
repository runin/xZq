(function($) {
	H.photo = {
		from: getQueryString('from'),
		actUuid:null,
		photoUrl:"",
		currentUrl:"",
		finalUrl:"",
		headImg :null,
		$img_ctrl : $(".img-ctrl"),
		name : null,
		resuuid :null,
		uuid: getQueryString('uuid'),
		upFile: null,
		type:1,
		init: function () {
			var me = this;
		    H.photo.type = 1;
		    me.photo_act();
			me.event_handler();
			if(!headimgurl){
				H.photo.headImg = './images/avatar.jpg';
			}else{
				H.photo.headImg = headimgurl + '/' + yao_avatar_size;
			}
			if(!nickname){
				H.photo.name = '匿名用户';
			}else{
				H.photo.name = nickname;	
			}
			$(".person-info label:first-child").find("img").attr("src",H.photo.headImg);
			$(".person-info label:first-child").find("span").html(H.photo.name);
		},
		event_handler : function() {
			var me = this;
			$('#btn-upload').click(function(e) {
				e.preventDefault();
				if ($(this).hasClass('requesting')) {
					return;
				}
				$('#input-file-upload').trigger('click');
			});
			$('#btn-submit').click(function(e) {
				e.preventDefault();
				if($("#img-ctrl .ic").length<1){
		        	 H.photo.tip_text($(".form-item"),"请先上传图片",true);
		        	return;
		        }
				if ($(this).hasClass('requesting')) {
					return;
				}
		        $(this).addClass('requesting');	
		        
		        H.photo.photoed();
				$(".mix-photo").addClass("photoed").removeClass("none");
				H.photo.draw_first_img ();
			});
			$('.form-item').on('click','.close',function(e) {
				e.preventDefault();
				$("#img-ctrl").find(".ic").remove();
				$('#btn-upload').removeClass('none');
				$(".star-photo").removeClass("photoed");
				$(this).addClass('none');
			});
			$('.photoedBox').on('click', '#btn-refresh', function(e) {
				e.preventDefault();
				H.photo.type = 2;
				H.photo.canPhoto();
				H.photo.photo_act();
				$(".final-photo").attr("src","");
			});
			$('.back-index').click(function(e) {
				e.preventDefault();
				toUrl("index.html") ;
			});
			$('#vote').click(function(e) {
				e.preventDefault();
				if($(this).hasClass("voted")){
					return;
				}
				$(this).addClass("voted");
				getResult('gzlive/photo/votehx', {openid:openid,recordUuid:H.photo.resuuid}, 'photeVoteHxHandler',true);
			});
			$(".close-photo").click(function(e) {
				e.preventDefault();
				H.photo.type = 2;
				H.photo.canPhoto();
				H.photo.photo_act();
				$(".final-photo").attr("src","");
			});
		},
		tip_text : function(contain,str,hide){
			var t = simpleTpl();
			t._('<span class="tips">'+str+'</span>');
			contain.append(t.toString());
			$(".tips").show();
			if(hide){
				setTimeout(function(){
					contain.find(".tips").remove();
				},1500);
			}
		},
		photo_act : function(){
			getResult('gzlive/photo/indexhx', {openid:openid,type:H.photo.type}, 'photoIndexHxHandler',true);
		},
		draw_first_img :function(){
			var me = this;
			var photoImg = new Image();
			var myCanvas = $("#mix-photo")[0];
			var context = myCanvas.getContext("2d");
			//后台配
				photoImg.src =H.photo.photoUrl;
				photoImg.width = 300;
				photoImg.height = 300;
			 	photoImg.onload= function(){
					context.save();
					context.drawImage(photoImg, 0, 0,300,300);
					context.restore();
					context.globalCompositeOperation="destination-over";
					H.photo.draw_last_img({canvas:myCanvas,img:$(".ic img"),originalImgWidth:originalImgWidth,originalImgHeight:originalImgHeight,containWidth:300,containHeight:300,posX:posX,posY:posY,scale:scale,rotation:rotation});
				};
		},
		draw_last_img: function (obj) {
            var p = $.extend({
                canvas: "", //cavas的上下文对象
                img: "", //要画到canvas上面的图片对象（jq对象）
                originalImgWidth: "", //图片的原始宽度
                originalImgHeight: "", //图片的原始高度
                imgWidth: this.img && this.img.width() || "", //图片变换后的宽度
                imgHeight: this.img && this.img.Height() || "", //图片变换后的高度
                containWidth: 0, //canvas容器的宽度
                containHeight: 0, //canvas容器的高度
                posX: "", //x偏移量
                posY: "", //y偏移量
                scale: "", //放大倍数
                rotation: ""//旋转角度
            }, obj || {});

            var ctx = p.canvas.getContext("2d");
            ctx.save(); //先保全图像
            if (p.posX) {
                ctx.translate(p.posX, p.posY); //偏移距离
            }
            if (p.scale) {
                if (window.l_scale != p.scale) {
                    ctx.translate((p.posX + p.imgWidth * p.scale / 2), (p.posY + p.imgHeight * p.scale / 2)); //中心点先移动到放大中心
                    if (is_android()) {
                        ctx.scale(p.scale); //实现放大
                    } else {

                    }
                    ctx.translate(-(p.posX + p.imgWidth * p.scale / 2), -(p.posY + p.imgHeight * p.scale / 2)); //中心点回位
                    window.l_scale = p.scale;
                }
            }
            if (p.rotation) {
                if (window.l_protation != p.rotation) {
                    ctx.translate(((p.containWidth - p.imgWidth) / 2 + p.imgWidth / 2), ((p.containHeight - p.imgHeight) / 2 + p.imgHeight / 2)); //中心点先移动到旋转中心
                    ctx.rotate(p.rotation * Math.PI / 180); //实现角度旋转
                    ctx.translate(-((p.containWidth - p.imgWidth) / 2 + p.imgWidth / 2), -((p.containHeight - p.imgHeight) / 2 + p.imgHeight / 2)); //中心点回位
                    window.l_protation = p.rotation;
                } else {
                    ctx.translate(((p.containWidth - p.imgWidth) / 2 + p.imgWidth / 2), ((p.containHeight - p.imgHeight) / 2 + p.imgHeight / 2));
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.translate(-((p.containWidth - p.imgWidth) / 2 + p.imgWidth / 2), -((p.containHeight - p.imgHeight) / 2 + p.imgHeight / 2));
                }
            }
            //根据高宽比例画图
            ctx.drawImage(p.img.get(0), 0, 0, p.originalImgWidth * p.scale, p.originalImgHeight * p.scale);
            ctx.restore();
            ctx.globalCompositeOperation = "destination-over";
            uploadFinalImg(p.canvas);

        },
		canPhoto : function(){
			$(".photoBox").removeClass("none");
			$(".photoedBox").addClass("none");
		},
		photoed :function(){
			$(".photoBox").addClass("none");
			$(".photoedBox").removeClass("none");
			$(".mix-info").addClass("photoed");
		},
		finalPic :function(data){
			//合照状态
				H.photo.resuuid = data.luuid
				H.photo.photoUrl = data.li;
				$(".person-info label:first-child").find("img").attr("src",data.lh);
				$(".person-info label:first-child").find("span").html(data.lu);
				$("#vote").text(data.lvn);
				if(data.lf){
					$("#vote").removeClass("voted");
				}else{
					$("#vote").addClass("voted");
				}
				$(".final-photo").attr("src",data.li).removeClass("none");
				H.photo.photoed();
				return;
		},

		initImgEvent : function (imgContain, drawImg) {
		    window.posX = 0;
		    window.posY = 0;
		    window.last_posX = 0;
		    window.last_posY = 0;
		    window.scale = 1;
		    window.last_scale = 1;
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
		                window.scale = Math.min(5, Math.max(window.last_scale * ev.gesture.scale, 0.5)); //头像缩放比例
		                break;
		        }
		        window.transform ="translate(" + window.posX + "px," + window.posY + "px)" +"scale(" + window.scale + "," + window.scale + ") "+"rotate(" + window.rotation + "deg) ";
		        drawImg.style.transform = window.transform;
		        drawImg.style.oTransform = window.transform;
		        drawImg.style.msTransform = window.transform;
		        drawImg.style.mozTransform = window.transform;
		        drawImg.style.webkitTransform = window.transform;
		    });
		    hammertime.ondragend = function(ev) { 
		    	$(this).css({"top":window.last_posX,"left":window.last_posY});
		    };
		    hammertime.on('touchend', function (ev) {
		        window.last_posX = window.posX;
		        window.last_posY = window.posY;
		    });
		}
	};
	W.photoIndexHxHandler = function(data){
		if(data.code == 0){
			H.photo.type = 1;
			if(!data.luuid){
			  	H.photo.actUuid = data.au;
				H.photo.photoUrl = "data:image/png;base64,"+data.base64Str;
				$(".star-photo").attr("data-uuid",data.au);
				$("#star").attr("src",data.ai);	
				$("#star").get(0).onload =function(){
					$("#btn-upload").removeClass("requesting");
				}
				H.photo.canPhoto();	  
			}else{
				shareuuid =data.luuid;
				H.photo.finalPic(data)
			}
		}
	};
	W.photeRecordHxHandler= function(data){
		if(data.code == 0){
			H.photo.resuuid = data.resuuid;
		    $('#btn-submit').removeClass("requesting");
		    toUrl("result.html?uuid="+data.resuuid);
		}
	};
	W.photeVoteHxHandler= function(data){
		if(data.code == 0){
			$("#vote").text(parseInt($("#vote").html())+1);
		}
	};
})(Zepto);

$(function(){
	H.photo.init();
});

function fileSelected() {
	var $file_upload = document.getElementById('input-file-upload'),
		count = $file_upload.files.length,
		img_id = 'img-' + new Date().getTime();
		if(count>1){
			alert("a");
			return;
		}
    if ($file_upload.files && $file_upload.files[0]) {
        var reader = new FileReader(),
        	t = simpleTpl();
			t._('<span class="ic" id='+img_id+'><img src="http://yao.holdfun.cn/portal/resources/news/images/blank.gif" /></span>')
        $('#img-ctrl').append(t.toString());	
        reader.onload = function (e) {
        	if (e.target.result) {
        		$('#'+img_id).find('img').attr('src', e.target.result);
        		H.photo.currentUrl = e.target.result;
        		window.originalImgWidth = $('#'+img_id).width();
        		window.originalImgHeight = $('#'+img_id).height();
        		var imgContain = $(".star-photo");
        		var drawImg = $(".ic img").get(0);
        		H.photo.initImgEvent(imgContain,drawImg);
				$("#btn-upload").addClass("none");
				$(".star-photo").addClass("photoed");
				$(".close").removeClass("none");
        	}
        }
        reader.readAsDataURL($file_upload.files[0]);
    }
}
function uploadFinalImg(tran_canvas) {//上传切割后图像
     var url = domain_url + 'fileupload/base64/image';
     var form = new FormData();
     var file = tran_canvas.toDataURL("image/png").substring(22); 
     form.append("base64String ", file);
     form.append("fileType ", "png");
     H.photo.tip_text($(".form-item"),"生成作品中",false);
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
           	var finalImg = new Image();
           		finalImg.src = data.filePath;
           		H.photo.finalUrl=finalImg.src;
           		finalImg.onload = function(){
					document.getElementsByClassName("final-photo")[0].src = H.photo.finalUrl;
				};
           		var nickName = encodeURIComponent(H.photo.name);
				getResult('gzlive/photo/recordhx', {actUuid:H.photo.actUuid,openid:openid,photo:H.photo.finalUrl,head:H.photo.headImg,name:nickName}, 'photeRecordHxHandler',true);
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

