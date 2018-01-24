; (function ($) {
    /**
    * 上传、预览图片
    */
    $.fn.upload = function (options) {
        // 默认参数
        $.fn.upload.defaults = {
            url: '', 		// 图片上传路径
            numLimit: 10, // 上传图片个数
            formCls: 'upload-form',		// 上传form的class
            accept: 'video/*',
            openFn:null,
            beforFn:null,
            selectFn:null,
            afterFn:null,
            succussFn:null,
            erroeFn:null,
            closeFn:null,
            limit:null,
            progressFn:null
        };

        // 初始值继承
        var opts = $.extend({}, $.fn.upload.defaults, options);
        var simpleTpl = function (tpl) {
            tpl = $.isArray(tpl) ? tpl.join('') : (tpl || '');

            return {
                store: tpl,
                _: function () {
                    var me = this;
                    $.each(arguments, function (index, value) {
                        me.store += value;
                    });
                    return this;
                },
                toString: function () {
                    return this.store;
                }
            };
        };


        return this.each(function () {

            var $uploadBox = $(this),
				$uploadBtn = $uploadBox.find('.btn-upload'),
				$uploadInput = null;

            var event = function () {
                $uploadInput = $uploadBox.find('input');
                $uploadBtn.click(function (e) {
					
                    if(opts.beforFn){
                       if(!opts.beforFn()){
                         return;
                       }
                    }
                    e.preventDefault();
                    if ($(this).hasClass('none')) {
                        return;
                    }
                 
                    $uploadInput.trigger('click');
                     
                });

                $uploadInput.on('change', function (e) {
                     if(opts.limit){
                       var $fileUpload = $uploadInput.get(0);
                        if(!opts.limit($fileUpload.files[0],$uploadBox.find('.' + opts.formCls))){
                          return;
                        }
                     }
                     fileSelected();
                     if(opts.selectFn){
                        opts.selectFn();
                     }
                });
                $uploadBox.on('click', '.img-preview', function (e) {
                   
                    e.preventDefault();
                    if ($(e.target).hasClass('close')) {
                        return;
                    }
                   

                }).on('click', '.close', function (e) {
                    if(opts.XMLHttpRequest){
                           opts.XMLHttpRequest.abort();
                    }
                
                    e.preventDefault();

                    $(this).closest('a').remove();
                    $uploadBtn.removeClass('none');
                    if(opts.closeFn){
                       opts.closeFn($uploadBox.find('.' + opts.formCls));
                    }
                });

            },

			fileSelected = function () {
			    var $fileUpload = $uploadInput.get(0),
					count = $fileUpload.files.length,
					imgId = 'img-' + new Date().getTime();
			    if ($('.img-preview').length >= opts.numLimit - 1) {
			        $uploadBtn.addClass('none');
			    }
         
			    if ($fileUpload.files && $fileUpload.files[0]) {

			       var t = simpleTpl();
            t._('<section class="popvideo" id="popVideo">')
               t._('<div class="uploadvedio">')
                 ._('<span id="progress"></span>')
               ._('</div>')
            ._('</section>')
            $("body").append(t.toString());
                 
                        
//                    try
//                    {
//                      if(FileReader){
//                       var reader = new FileReader();
//			           reader.onload = function (e) {
//			            if (e.target.result && e.target.result.indexOf('image/') !== -1) {
//			                $('#' + imgId).find('img').attr('src', e.target.result);
//			            }
//			           }
//			          reader.readAsDataURL($fileUpload.files[0]);
//                    }

//                    }catch(e){
//                    
//                    }
			    }

               setTimeout(function(){
                  uploadFile(imgId);
               },10);
			  
			},
            getNonceStr=function(){
                var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var maxPos = $chars.length;
                var noceStr = "";
                for ( var i = 0; i < 32; i++) {
	                noceStr += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                oldNonceStr = noceStr;
                return noceStr+(new Date().getTime());
            },
             is_android = function() {
              var ua = navigator.userAgent.toLowerCase();
              return ua.indexOf("android") > -1;
            },

			uploadFile = function (imgId) {

				var	$fileUpload = $uploadInput.get(0);
				var	count = $fileUpload.files.length;
                if (count == 0) {
			          return;
			    }
                var	$imgId = $('#' + imgId);
                opts.$imgId = $imgId;
                var	 file = $fileUpload.files[0];
                var  name = getNonceStr()+"."+file.name.split('.')[file.name.split('.').length-1];//file.name;  
                var  size = file.size;    
                var  succeed = 0;
                var  shardSize = 1 * 1024 * 1024;    //以5MB为一个分片
                var  shardCount = Math.ceil(size / shardSize);  //总片数
                var loadTime =0;
                if(isShowPercent){
                    $(".progress-No",opts.$imgId).show();
                }
                opts.loadCount =0;
                opts.onePic = false;
                opts.conPost =  0;
                var blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
         
                $.ajaxSettings.timeout=1000*60*60*3;
                var upload = function (){
         
                    //计算每一片的起始与结束位置
                    var start = loadTime * shardSize,
                    end = Math.min(size, start + shardSize);
                    //构造一个表单，FormData是HTML5新增的
                    var form = new FormData();
                     if(!is_android()&&blobSlice){
                       file.slice = blobSlice;
                       form.append("file", file.slice(start, end));  //slice方法用于切出文件的一部分
                    }else{
                       form.append("file", file);  //slice方法用于切出文件的一部分
                       shardCount =1;
                       opts.onePic=true;
                    
                    }
                    form.append("name", name);
                    form.append("total", shardCount);  //总片数
                    form.append("index", loadTime + 1); //当前是第几片

                    form.append("serviceNo", serviceNo);

                    // opts.url=opts.url+"?name="+name+"&total="+shardCount+"&index="+(loadTime + 1)+"&serviceNo="+serviceNo;

                    //Ajax提交
                    $.ajax({
                        url:  opts.url,
                        type: "POST",
                        data: form,
                        async: true,        //异步
                        processData: false,  //很重要，告诉jquery不要对form进行处理
                        contentType: false,  //很重要，指定为false才能形成正确的Content-Type
                        beforeSend: function(XMLHttpRequest){
                              opts.XMLHttpRequest = XMLHttpRequest;
                              opts.conPost++;
                              if(opts.conPost!=1&&opts.onePic){//防止再次提交
                                 XMLHttpRequest.abort();
                                 return;
                              }
                              XMLHttpRequest.upload.addEventListener("progress", function(e){
                                if(opts.progressFn){
                                    opts.progressFn(e);
                                }
                                if (e.lengthComputable&&isShowPercent) {
                                    opts.loadCount +=e.loaded-opts.loadCount;
                                    var c = 0;
                                    if(opts.onePic==true){
                              
                                      c = opts.loadCount * 100 / size;
                                    }else{
                                      c= (e.loaded+(succeed*shardSize)) * 100 / size;
                                    }
                                    var progress = Math.round(c) + '%';

                                    $("#progress").text(progress);
                                    
                                   // $("").text(progress)

                                }
                                }, false);
                        },
                        success: function (data) {
                            loadTime++;
                            ++succeed;
                         if(succeed==shardCount){//停止
                               data = $.parseJSON(data);
                               if (data && data.code == 0) {//成功！
                                $imgId.attr('data-url', data.filePath).removeClass('loading');
                                 //$(".progress-No",opts.$imgId).hide();
                                 $("#popVideo").remove();
                                 $(".popsuccess").addClass("show");
                                 setTimeout(function() {
                                    $(".popsuccess").removeClass("show");
                                 },3000);

                                if(opts.afterFn){
                                    opts.afterFn($imgId);
                                }
                                if(opts.succussFn){
                                    opts.succussFn(data, $uploadBox.find('.' + opts.formCls),$imgId, name,data.filePath);
                                }
                               }else{
                                    opts.$imgId.remove();
                                    if(opts.erroeFn){
                                         opts.erroeFn($uploadBox.find('.' + opts.formCls));
                                    }
                               }
                         }else{
                               if(!opts.onePic){
                                  upload();
                               }
                            
                         }
                        },
                        error:function(e,a,b,c){//error
                     
                           $imgId .removeClass('loading');
                           $(".progress-No",opts.$imgId).hide();
                           if(opts.afterFn){
                              opts.afterFn($imgId);
                           }
                          opts.$imgId.remove();
                          if(opts.erroeFn){
                              opts.erroeFn($uploadBox.find('.' + opts.formCls));
                           }
			                alert('网络延迟请稍候再试。');
                        },
                        complete:function(){
                         
                        
                        }
                    });
                   }
                   upload();
			},
			initForm = function () {
			    var $uploadForm = $uploadBox.find('.' + opts.formCls);
			    if ($uploadForm.length > 0) {
			        return;
			    }
			    var t = simpleTpl();
			    t._('<form class="' + opts.formCls + '" enctype="multipart/form-data" method="post">')
					._('<input type="file" accept="'+opts.accept+'" capture="camcorder" >')
				._('</form>');
			    $uploadForm = $(t.toString());
			    $uploadBox.append($uploadForm);
			};

            initForm();
            event();
        })
    }
})(Zepto);




