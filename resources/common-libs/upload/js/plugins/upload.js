;(function($){
	/**
	 * 上传、预览图片
	 */
	$.fn.upload = function(options) {
		// 默认参数
		$.fn.upload.defaults = {
			url: '', 		// 图片上传路径
			numLimit: 5,	// 上传图片个数
			formCls: 'upload-form'		// 上传form的class
		};
		
		// 初始值继承
		var opts = $.extend({}, $.fn.upload.defaults, options);
		var simpleTpl = function( tpl ) {
		    tpl = $.isArray( tpl ) ? tpl.join( '' ) : (tpl || '');

		    return {
		        store: tpl,
		        _: function() {
		            var me = this;
		            $.each( arguments, function( index, value ) {
		                me.store += value;
		            } );
		            return this;
		        },
		        toString: function() {
		            return this.store;
		        }
		    };
		};
		
		return this.each(function(){
			
			var $uploadBox = $(this),
				$uploadBtn = $uploadBox.find('.btn-upload'),
				$uploadInput = null;
				
			var event = function() {
				$uploadInput = $uploadBox.find('input');
				$uploadBtn.click(function(e) {
					e.preventDefault();
					if ($(this).hasClass('none')) {
						return;
					}
					$uploadInput.trigger('click');
				});
				
				$uploadInput.on('change', function(e) {
					if($(this).val() != ""){
                        fileSelected();    
                    }
				});
				$uploadBox.on('click', '.img-preview', function(e) {
					e.preventDefault();
					if ($(e.target).hasClass('close')) {
						return;
					}
					preview($(this).find('img').attr('src'));
					
				}).on('click', '.close', function(e) {
					e.preventDefault();

					$(this).closest('a').remove();
					$uploadBtn.removeClass('none');
					$uploadInput.val('');
				});
				
			},
			
			fileSelected = function() {
				var $fileUpload = $uploadInput.get(0),
					count = $fileUpload.files.length,
					imgId = 'img-' + new Date().getTime();
		
				if ($('.img-preview').length >= opts.numLimit - 1) {
					$uploadBtn.addClass('none');
				}
			    if ($fileUpload.files && $fileUpload.files[0]) {
			        var reader = new FileReader(),
			        	t = simpleTpl();
			        
			        t._('<a href="#" id="'+ imgId +'" class="img-preview loading" data-collect="true" data-collect-flag="news-baoliao-preview-btn" data-collect-desc="预览图片按钮">')
						._('<span class="lc"><i class="uploading"></i></span>')
						._('<i class="close"  data-collect="true" data-collect-flag="news-baoliao-remove-img-btn" data-collect-desc="删除上传的图片按钮" data-stoppropagation="true"></i>')
						._('<span class="ic"><img /></span>')
					._('</a>');
			        $uploadBtn.before(t.toString());
				
			        reader.onload = function (e) {
			        	if (e.target.result && e.target.result.indexOf('image/') !== -1) {
			        		$('#' + imgId).find('img').attr('src', e.target.result);
			        	}
			        }
			        reader.readAsDataURL($fileUpload.files[0]);
			    }
			    
			    uploadFile(imgId);
			},
		
			uploadFile = function(imgId) {
				var fd = new FormData(),
					$fileUpload = $uploadInput.get(0),
					count = $fileUpload.files.length;
				
			    if (count == 0) {
			    	return;
			    }
			    fd.append('file', $fileUpload.files[0]);
			    fd.append('serviceName', 'clueImg');
				uploadImg(imgId, fd);
			},
		
			uploadImg = function(imgId, fd){
				var me = this,
					xhr = new XMLHttpRequest(),
					$imgId = $('#' + imgId),
					$img = $imgId.find('img');
				
				xhr.addEventListener("load", function(evt) {
					if (evt.target && evt.target.responseText) {
						var data = null;
						try {
							data = $.parseJSON(evt.target.responseText);
						} catch(e) {}
		
						if (!data || data.code != 0) {
							alert('上传图片失败')
							return;
						}
						
						if (!$img.attr('src')) {
							$img.attr('src', data.filePath); 
						}
						$imgId.attr('data-url', data.filePath).removeClass('loading');
					}
				}, false);
				
				if(fd == 0){ return; }
				
				xhr.addEventListener("error", function() {
					$('#' + imgId).removeClass('loading');
					alert('上传出错')
				}, false);
				
				xhr.addEventListener("abort", function() {
					$('#' + imgId).removeClass('loading');
					alert("上传已取消");
				}, false);
				
				xhr.open('POST', opts.url);
				xhr.send(fd);
		
			},
		
			preview = function(src) {
				var t = simpleTpl(),
					$previewBox = $('.preview-box'),
					w = $(window).width(),
					h = $(window).height();
				
				if ($previewBox.length == 0) {
					t._('<div class="preview-box">')
					   	._('<img class="none" />')
					._('</div>');
					$previewBox = $(t.toString());
				} else {
					$previewBox.show();
				}
				imgReady(src, function() {
					var toW = w - 20,
						toH = h - 20,
						toRotate = toW / toH,
						srcRotate = this.width / this.height;
					
					if (this.width > toW || this.height > toH) {
						if (toRotate <= srcRotate) {
							toH = toW * (this.height / this.width);
						} else {
							toW = toH * (this.width / this.height);
						}
					} else {
						toW = this.width;
						toH = this.height;
					}
					
					$previewBox.find('img').attr('src', src).css({'width': toW, 'height': toH, 'margin-left': (w - toW) / 2, 'margin-top': (h - toH) / 2}).removeClass('none');
				});
				
				$('html').addClass('noscroll');
				$('body').append($previewBox).delegate('.preview-box', 'click', function(e) {
					$previewBox.hide();
					$('html').removeClass('noscroll');
				});
				
			},
			
			initForm = function() {
				var $uploadForm = $uploadBox.find('.' + opts.formCls);
				if ($uploadForm.length > 0) {
					return;
				}
				var t = simpleTpl();
				t._('<form class="'+ opts.formCls +'" enctype="multipart/form-data" method="post">')
					._('<input type="file" accept="image/*" capture="camera">')
				._('</form>');
				$uploadForm = $(t.toString());
				$uploadBox.append($uploadForm);
			};
			
			initForm();
			event();
		})
	}
})(Zepto);