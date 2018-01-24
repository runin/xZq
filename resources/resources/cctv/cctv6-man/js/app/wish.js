(function($) {
	H.index = {
        activeIndex:0,
        myVedio:document.getElementById("video"),
        $inputCmt : $("#input-comment"),
        $btnCmt : $("#btn-comment"),
        REQUEST_CLS :"requesting",
        comment :"",
		init: function() {
            var me = this;
            me.event();
            me.init_wish();
           
		},
		init_wish :function(){
			 if(is_android()){
                $(".play").css({opacity:0});
            }
			$(".head_img").attr("src",headimgurl||"images/danmu-head.jpg");
		},
		event: function() {
			var me = this;
			 $("#btn-yao").click(function(e) {
				e.preventDefault();
				toUrl("yao.html");
			});
			this.$btnCmt.click(function(e) {
				e.preventDefault();
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				H.index.comment = $.trim(me.$inputCmt.val()) || '',
				H.index.comment = H.index.comment.replace(/<[^>]+>/g, ''),
				len = H.index.comment.length;
				if (len < 1) {
					showTips('请先说点什么吧');
					return;
				} else if (len > 100) {
					showTips('观点字数超出了100字');
					return;
				}
				$(this).addClass(me.REQUEST_CLS);
				H.index.$inputCmt.val(H.index.comment).attr("disabled","disabled");
				H.dialog.share.open(H.index.comment);
                $.ajax({
                    type : 'GET',
                    async : true,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(H.index.comment),
                        op: openid,
                        tid:null,
                        ty: 2,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {      
                       
                    },
                    success : function(data) {
//                      if (data.code == 0) {
//                      	showTips('发送成功');
//                          return;
//                      }
                    }
                });
				
			});
             $('body').delegate('#video,.play', 'click', function(e) {
                e.preventDefault();
	                if (me.myVedio.paused){
	                    me.myVedio.play();
	                    $(me.myVedio).one('loadeddata', function() {
	                        shownewLoading();
	                        // 暂停，但下载还在继续
	                        me.myVedio.pause();
	
	                        // 启动定时器检测视频下载进度
	                        var timer = setInterval(function() {
	                            var end = me.getEnd(me.myVedio),
	                                duration = me.myVedio.duration;
	                            //alert(end +'=='+duration);
	                            if(end < duration) {
	                                return
	                            }
	                            hidenewLoading();
	                            var width = $(me.myVedio).parent().width();
	
	                            // 下载完了，开始播放吧
	                            $(me.myVedio).attr("width",width);
	                            me.myVedio.play();
	
	                            clearInterval(timer);
	                        }, 1000);
	                    });
	                    $(".play").animate({opacity:0},500);
	                }else{
	                    me.myVedio.pause();
	                    $(".play").animate({opacity:1},500);
	                }
	            });
	            me.videoEvent("ended");
			},
	        // 获取视频已经下载的时长
	        getEnd:function(video) {
	            var end = 0
	            try {
	                end = video.buffered.end(0) || 0
	                end = parseInt(end * 1000 + 1) / 1000
	            } catch(e) {
	            }
	            return end
	        },
	        videoEvent:function(e){
	            var me = this;
	            me.myVedio.addEventListener(e,function(){
	                if(e == "ended"){
	                    $(".play").animate({opacity:1},500);
	                }
	        });
      },
	};
})(Zepto);

$(function() {
	H.index.init();
});