(function($) {
    H.clue = {
    	dec: 0,
        isTimeOver: false,
    	uploadFlag: false,
    	repeat_load: true,
    	clueTitle: '我要爆料',
    	nowTime: timeTransform(new Date().getTime()),
        init: function () {
            this.current_time();
            this.event();
            this.refreshDec();
        },
        event: function() {
            var me = this;
            $('body').delegate('.btn-back', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('answer.html');
                }
            }).delegate('.zone-answer', 'click', function(e) {
                e.preventDefault();
                if ($('.answer').hasClass('active')) {
                	return;
                } else {
                	$('.ask').removeClass('active');
                	$('.answer').addClass('active');
                	me.clueTitle = '我要爆料';
                }
            }).delegate('.zone-ask', 'click', function(e) {
                e.preventDefault();
                if ($('.ask').hasClass('active')) {
                	return;
                } else {
                	$('.answer').removeClass('active');
                	$('.ask').addClass('active');
                	me.clueTitle = '我要提问';
                }
            }).delegate('#btn-upload', 'click', function(e) {
                e.preventDefault();
				if ($(this).hasClass('none')) {
					return;
				}
				$('#input-file-upload').trigger('click');
            }).delegate('#btn-submit', 'click', function(e) {
				e.preventDefault();
				if ($(this).hasClass('requesting')) {
					return;
				}
		        $(this).addClass('requesting');
				var $content = $('#content'), content = $.trim($content.val()), $img_ctrl = $('#img-ctrl'), imgs = [];
				if (!content) {
					$(this).removeClass('requesting');
					showTips('什么都没有写哦~');
					$content.focus();
					return;
				}
				var len = content.length;
				if (len < 1 || len > 100) {
					$(this).removeClass('requesting');
					showTips('内容长度为1-100字');
					$content.focus();
					return;
				}
				if ($('.img-preview').length <= 0) {
					$(this).removeClass('requesting');
					showTips('是不是忘记上传图片了');
					return;
				}
				$img_ctrl.find('.img-preview').each(function() {
					if ($(this).hasClass('loading')) {
						showTips('图片上传中，请稍候...');
						return false;
					}
					var url = $.trim($(this).attr('data-url'));
					url && imgs.push(url);
				});
				getResult('api/newsclue/save', {
					openid: openid,
					content: encodeURIComponent(content),
					phone: 0,
		            imgs: imgs.join(','),
		            nickname: nickname,
		            avatar: headimgurl,
		            title: encodeURIComponent(me.clueTitle)
				}, 'callbackClueSaveHandler');
            }).delegate('.img-preview', 'click', function(e) {
                e.preventDefault();
				if ($(e.target).hasClass('close')) {
					return;
				}
				me.preview($(this).find('img').attr('src'));
            }).delegate('.close', 'click', function(e) {
                e.preventDefault();
                $(this).closest('a').remove();
				$('#btn-upload').removeClass('none');
            }).delegate('.btn-back-simple', 'click', function(e) {
                e.preventDefault();
				var content = $.trim($('#content').val()),
					img_len = $('#img-ctrl').find('.img-preview').length;
				
				if (content.length > 0 || img_len > 0) {
					if (!confirm('是否放弃提交？')) {
						return;
					} else {
						location.href = 'answer.html';
					}
					return;
				}
				location.href = 'answer.html';
            }).delegate('.countdown', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('lottery.html');
                }
            });
        },
        fileSelected: function() {
			var me = this, $file_upload = document.getElementById('input-file-upload'), count = $file_upload.files.length, img_id = 'img-' + new Date().getTime();
			if ($('.img-preview').length >= 4) {
				$('#btn-upload').addClass('none');
			}
		    if ($file_upload.files && $file_upload.files[0]) {
		        var reader = new FileReader(),
		        	t = simpleTpl();
		        t._('<a href="#" id="'+ img_id +'" class="img-preview loading" data-collect="true" data-collect-flag="clue-preview-btn" data-collect-desc="预览图片按钮">')
					._('<span class="lc"><i class="uploading"></i></span>')
					._('<i class="close" data-collect="true" data-collect-flag="clue-remove-img-btn" data-collect-desc="删除上传的图片按钮" data-stoppropagation="true"></i>')
					._('<span class="ic"><img src="./images/blank.gif" /></span>')
				._('</a>');
		        $('#btn-upload').before(t.toString());
		        reader.onload = function (e) {
		        	if (e.target.result) {
		        		$('#' + img_id).find('img').attr('src', e.target.result);
						if((e.target.result).indexOf('image/') == -1){ me.uploadimg(img_id, 0, true); }
		        	}
		        }
		        reader.readAsDataURL($file_upload.files[0]);
		    }
		    me.uploadFile(img_id);
		},
		uploadFile: function(img_id) {
			var me = this, fd = new FormData(), count = document.getElementById('input-file-upload').files.length;
		    if (count == 0) {
		    	return;
		    }
		    fd.append('file', document.getElementById('input-file-upload').files[0]);
		    fd.append('serviceName', 'clueImg');
			me.uploadimg(img_id, fd);
		},
		uploadimg: function(img_id, fd, flag) {
			var me = this, xhr = new XMLHttpRequest(), $img_id = $('#' + img_id);
			me.uploadFlag = flag;
			xhr.addEventListener("load", function(evt) {
				if (evt.target && evt.target.responseText) {
					var data = null;
					try {
						data = $.parseJSON(evt.target.responseText);
					} catch(e) {}

					if (!data || data.code != 0) {
						showTips('上传图片失败')
						return;
					}
					if(me.uploadFlag){ $img_id.find('img').attr('src', data.filePath); }
					$img_id.attr('data-url', data.filePath).removeClass('loading');
				}
			}, false);
			if(fd == 0){ return; }
			xhr.addEventListener("error", function() {
				$('#' + img_id).removeClass('loading');
				showTips('上传出错')
			}, false);
			xhr.addEventListener("abort", function() {
				$('#' + img_id).removeClass('loading');
				showTips("上传已取消");
			}, false);
			xhr.open('POST', domain_url + 'fileupload/image');
			xhr.send(fd);
		},
		preview: function(src) {
			var t = simpleTpl(),
				$preview_box = $('#preview-box'),
				w = $(window).width(),
				h = $(window).height();
			
			if ($preview_box.length == 0) {
				t._('<div class="preview-box" id="preview-box">')
				   	._('<img class="none" src="./images/blank.gif" />')
				._('</div>');
				$preview_box = $(t.toString());
			} else {
				$preview_box.show();
			}
			imgReady(src, function() {
				var to_w = w - 20,
					to_h = h - 20,
					to_rotate = to_w / to_h,
					src_rotate = this.width / this.height;
				
				if (this.width > to_w || this.height > to_h) {
					if (to_rotate <= src_rotate) {
						to_h = to_w * (this.height / this.width);
					} else {
						to_w = to_h * (this.width / this.height);
					}
				} else {
					to_w = this.width;
					to_h = this.height;
				}
				
				$preview_box.find('img').attr('src', src).css({'width': to_w, 'height': to_h, 'margin-left': (w - to_w) / 2, 'margin-top': (h - to_h) / 2}).removeClass('none');
			});
			
			$('html').addClass('noscroll');
			$('body').append($preview_box).delegate('.preview-box', 'click', function(e) {
				$preview_box.hide();
				$('html').removeClass('noscroll');
			});
		},
		refreshDec: function() {
            var me = this, delay = Math.ceil(50000*5*Math.random() + 50000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time' + dev,
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 10000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            me.dec = new Date().getTime() - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            }, delay);
        },
		current_time: function() {
			var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result == true){
                        me.nowTime = timeTransform(data.sctm);
                    	var nowTime = new Date().getTime();
                        var serverTime = data.sctm;
                        me.dec = nowTime - serverTime;
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }else{
                        	me.change();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                	me.change();
                }
            });
        },
        currentPrizeAct: function(data) {
            var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [], day = nowTimeStr.split(" ")[0];
            if(prizeActListAll && prizeActListAll.length > 0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                };
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0) {
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                   	me.change();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                    	$('.countdown').addClass('shake');
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
 						me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                };
            }else{
				me.change();
				return;
            }
        },
        beforeCountdown: function(prizeActList) {
        	var me = this, beginTimeLong = timestamp(prizeActList.pd+" "+prizeActList.st);
 			beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime', beginTimeLong);
            me.count_down();
        },
        count_down : function() {
        	var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                    	if(!me.isTimeOver){
							me.isTimeOver = true;
							$('.countdown').addClass('shake');
						}
                    },
                    sdCallback :function(){ 
                        me.isTimeOver = false;             
                    }
                });
            });
        },
        initPage: function() {
        	$('textarea').val('');
        	$('.img-preview').remove();
        	$('.btn-upload').removeClass('none');
        },
        change: function() {
			$('.countdown').removeClass('shake').find(".countdown-tip").html('本期摇奖已结束');
        }
    };

    W.callbackClueSaveHandler = function(data) {
		$('#btn-submit').removeClass('requesting');
		if (data.code == 0) {
			H.clue.initPage();
			H.dialog.clueSuccess.open();
		} else {
			showTips('提交失败~<br><p style="font-size:16px;font-weight:bolder;">请稍后试试</p>');
		}
	};
})(Zepto);

$(function(){
    H.clue.init();
});