
(function($) {
	H.index = {
	    $ul : $(".cor-list"),
	    hUl : 0,
	    hLi : 0,
	    ps : 50,
	    allHeight: 0,
        myVedio:document.getElementById("video"),
	    headerHeight : $(".friend-head").height(),
	    wHeight : $(window).height(),
	    repeat_load : true ,
	    isSelfZan : false,
        init : function(){
			var me = this;
        	$('#vote-back').click(function(){
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				setTimeout(function(){
					$('#vote-back').removeClass("requesting")
				},1000);
   			    toUrl("vote.html");
			});
            this.friend_content();
            this.fill_head();
            $('body').delegate('.play', 'click', function(e) {
                e.preventDefault();
                if (me.myVedio.paused){
                    me.myVedio.play();
                    $(".play").animate({opacity:0},500);
                }else{
                    me.myVedio.pause();
                    $(".play").animate({opacity:1},500);
                }
            });
            me.myVedio.play();
            $(".play").css("opacity","0");
            me.videoEvent("ended");
        },
        videoEvent:function(e){
            var me = this;
            me.myVedio.addEventListener(e,function(){
                if(e == "ended"){
                    $(".play").animate({opacity:1},500);
                }
            });
        },
        friend_content :function(){
        	shownewLoading();
			$.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/friendcircle/topicslist'+dev,
                data: {fs:0,page:1,ps:H.index.ps},
                dataType : "jsonp",
                jsonpCallback : 'callbackFriendcircleTopicslist',
                timeout: 11000,
				complete: function() {
                },
                success : function(data) {
                	hidenewLoading();
                    if(data.code == 0){
                        H.index.fill_friend(data);
                    }else{
                        if(H.index.repeat_load){
                            H.index.repeat_load = false;
                            setTimeout(function(){
                                H.index.friend_content();
                            },500);
                         //接口返回false
                        }else{
                        	H.index.friendContentError();	
                        }
                    }
                },
                //接口出错
                error : function(xmlHttpRequest, error) {
                	H.index.friendContentError();
                }	
			})
        },
        fill_head:function(){
        	$(".personal-info").find(".nikcName").html(nickname || "匿名用户");
        	$(".personal-info").find(".headImg img").attr("src",headimgurl ? headimgurl + '/' + yao_avatar_size : "images/avatar.png");
        },
        fill_friend :function(data){
        	var friend_items = data.items;
        		friend_len = data.items.length;
        		me = this,
        		t = simpleTpl(),
        		hImg = "images/avatar.png";
        	for(var i = 0;i<friend_len;i++){
        		var zanCon = friend_items[i].tps;
        		if(zanCon&&zanCon.length > 0){
	        		for(var m = 0; m < zanCon.length;m++){
					    if(zanCon[m].oi == openid){
					    	H.index.isSelfZan = true;
					    	break;
					     }
					}	
        		}
        		t._('<div class="person-info pl" data-uid="'+friend_items[i].uid+'" data-index="'+i+'">')
			    		._('<div class="pub-info">')
			    			._('<div class="pub-hImg"><img src="'+friend_items[i].a+'" /></div>')
				    		._('<div class="pub-nick">'+friend_items[i].p+'</div>')
				    	._('</div>')
			    		._('<div class="pub-content pl content-'+friend_items[i].uid+'">')
				    		._('<div class="pub-topic">'+friend_items[i].t+'</div>')
				    		._('<div class="pub-img-fuc fuc-'+friend_items[i].uid+'">')
				    			var  hTopicImg = friend_items[i].ims.split(","),hTopicImgLen= hTopicImg.length;
					    		if(hTopicImgLen >1){
					    			t._('<div class="pubImg pub-imgs" data-uid="'+friend_items[i].uid+'">')
					    		}else{
					    			t._('<div class="pubImg pub-img" data-uid="'+friend_items[i].uid+'">')
					    		}
						    	for(var m = 0; m<hTopicImgLen ; m++){
						    		t._('<span data-index="'+m+'"><img src="'+hTopicImg[m]+'" onerror ="$(this).parents(\'.pubImg\' ).addClass(\'none\')"/></span>')
						    	}
				    		t._('</div>')
				    		if(H.index.isSelfZan){
				    			t._('<div class="pub-fuc"><div class="fuc-btn" data-key="'+friend_items[i].uid+'"><span class="fuc-zan zaned"><i></i><i class="zan-text">已赞</i></span><span class="fuc-cor"><i></i><i>评论</i><input type="text"  class="key" /></span></div></div>')
				    		}else{
				    			t._('<div class="pub-fuc"><div class="fuc-btn" data-key="'+friend_items[i].uid+'"><span class="fuc-zan"><i class="zan-love"></i><i class="zan-text">赞</i></span><span class="fuc-cor"><i></i><i>评论</i><input type="text"  class="key" /></span></div></div>')
				    		}	
				    		t._('</div>')
				    		._('<div class="pub-res">')
				    			._('<div class="pub-zan zan-'+friend_items[i].uid+'">')
				    				if(zanCon&&zanCon.length>0){
				    					for(var n = 0; n < 3;n++){
				    						if(zanCon[n]&&zanCon[n].oi == openid){
				    							zanCon[n].na = "我";
				    						}
				    					}
				    					if(zanCon.length>3){
				    						var zanPer = zanCon[0].na+','+zanCon[1].na+','+zanCon[2].na+'等';
				    					}else if(zanCon.length == 3){
				    						var zanPer = zanCon[0].na+','+zanCon[1].na+','+zanCon[2].na;
				    					}else if(zanCon.length == 2){
				    						var zanPer = zanCon[0].na+','+zanCon[1].na;
				    					}else if(zanCon.length == 1){
				    						var zanPer = zanCon[0].na;
				    					}
				    					t._('<span class="zan-num">'+zanPer+'<span class="num">'+friend_items[i].tps.length+'</span>人赞过</span>')
				    				}else{
				    					t._('<span class="zan-num"><span class="num">0</span>人赞过</span>')
				    				}	
				    			t._('</div>')
				    			._('<div class="pub-cor">')
				    				._('<ul class="cor-list list-'+friend_items[i].uid+'">')
				    				var  hTopicCor = friend_items[i].comments||"",hTopicCorLen= hTopicCor.length;
				    				for(var n = 0; n<hTopicCorLen ; n++){
					    			   t._('<li class="cor-'+hTopicCor[n].uid+'"><label>'+hTopicCor[n].na+':</label><span>'+hTopicCor[n].co+'</span></li>')
					    			}
				    				t._('</ul>')
					    			._('<span class="open none">展开评论</span>')
					    			._('<span  class="close none">收起评论</span>')
				    			t._('</div>')
			    			._('</div>')
				    	._('</div>')
			    	._('</div>') 	
        	}
        	$(".friend-content").append(t.toString());
        	$(".friend-content").removeClass("none");
        	this.init_friendCor();
        	this.event_handdle();
        },
        init_friendCor :function(){
        	var me = this;
        	$(".cor-list").each(function(){
        		var hUl = $(this).height();
	       		var hLi =me.calH(3,$(this))+me.calH(2,$(this))+me.calH(1,$(this))+me.calH(0,$(this))+1;
	       		$(this).attr("data-open",hUl);
	       		$(this).attr("data-close",hLi);
	       		if(hLi > 0&&$(this).find("li").length > 4){
		       		if( hUl > hLi){
						$(this).addClass("more").css({
							"height" :  hLi,
							"overflow" : "hidden"
		               	});
			            $(this).parent().find(".open").removeClass("none");
		                $(this).parent().find(".close").addClass("none");
		            }else{
		            	$(this).addClass("less").css({
							"height" :  hUl,
							"overflow" : "auto"
		                });
		                $(this).parent().find(".open").addClass("none");
		                $(this).parent().find(".close").addClass("none");
		            }
	       		}else{
	       			$(this).parent().find(".open").addClass("none");
		            $(this).parent().find(".close").addClass("none");
	       		}
				
       		})
            $(".pub-imgs").find("img").height($(".pub-imgs").find("img").width());
        },
        friendContentError : function() {
        	hidenewLoading();
			showTips("网络不给力，数据获取中断");
		},
        calH : function(num,me) {
			return  me.find("li:eq("+num+")").height();
		},
        cor_list :function(){
       	
        },
        imgReady : function(_srcList,fn){
		    var i = 0;
		    imgLoadComplate(_srcList[i]);
		    function imgLoadComplate(imgSrc){
		        var _img = new Image();
		        _img.src = imgSrc;
		        _img.onload = function(){ //判断是否加载到最后一个图片
		            if (i < _srcList.length-1) {
		                i++;
		                imgLoadComplate(_srcList[i]);
		            }else{
		               if(fn){
		               fn();
		               }
		            }
		        }
		    }
		},
        event_handdle : function(){
        	var me = this;
        	 $(".open").click(function(e,fn){
        	 	e.preventDefault();
        	 	$(this).addClass("none");
        	 	var $cor =  $(this).parent().find(".cor-list");
        	    $cor.css({
					"overflow" : "hidden"
                }).animate({"height":+$cor.attr("data-open")+"px"},"fast",function(){
                	fn&&fn();
                }).removeClass("more").addClass("less");
                
                $(this).parent().find(".close").removeClass("none");
        	 });
        	 
        	 $(".close").click(function(e){
        	 	e.preventDefault();
        	 	$(this).addClass("none");
        	 	var $cor =  $(this).parent().find(".cor-list");
        	     $cor.animate({"height":+$cor.attr("data-close")+1+"px"},"fast").removeClass("less").addClass("more");
        	     $(".scroll").scrollToTop( $(".scroll").scrollTop()-($cor.attr("data-open")-$cor.attr("data-close")));
                 $(this).parent().find(".open").removeClass("none");   
        	 });
        	 $(".pubImg span").click(function(e){
        	 	e.preventDefault();
        	 	e.stopPropagation();
        	 	var imgUid = $(this).parent().attr("data-uid");
        	 	$(".showImg").attr("data-imgUid",imgUid)
        	 	me.showImg($(this).attr("data-index"));
        	 });
        	 
//      	 $(".pub-fuc").click(function(e){
//      	 	e.preventDefault();
//      	 	e.stopPropagation();
//      	 	var $me = $(this);
//      	 	$(".ctrls").addClass("none");
//      	 	$(".fuc-btn ").removeClass("scaleIn")
//      	 	if(!$(this).find(".fuc-btn").hasClass("scaleIn")){
//	        	 	$(this).find(".fuc-btn").addClass("scaleIn");
//	        	 	setTimeout(function(){
//	        	 	  	$me.find(".fuc-zan").removeClass("none");
//	        	 	    $me.find(".fuc-cor").removeClass("none");
//	        	 	},200);
//      	 	}else{
//      	 		return;
//      	 	}
//      	 	
//      	 });
//      	 
//      	 $(".scroll").click(function(e){
//      	  	e.preventDefault();
//      	  	if($(".fuc-btn").hasClass("scaleIn")){
//      	  		$(".fuc-btn").removeClass("scaleIn");
//	        	 	$(".fuc-zan").addClass("none");
//	        	 	$(".fuc-cor").addClass("none");
//      	  	}else{
//      	  		return;
//      	  	}
//      	 	
//      	 });
        	 $(".showImg").click(function(e){
        	  	e.preventDefault();
        	  	e.stopPropagation();
        	  	$(".swiper-container").remove();
        	  	$(this).addClass("none");
        	 });
        	  $(".fuc-zan").click(function(e){
        	 	e.preventDefault();
        	 	e.stopPropagation();
        	 	if($(this).hasClass("zaned")){
        	 		return;
        	 	}
        	 	$(this).addClass("zaned")
        	 	var $me = $(this);
        	 	$me.find(".zan-love").addClass("scale")
        	 	var zanUid = $(this).parent().attr("data-key");
        	 	var zanNum =parseInt($(".zan-"+zanUid).find(".zan-num").html());
        	    $(this).find(".zan-text").html("已赞");
        	 	getResult('api/friendcircle/topicprise',{uuid : zanUid,oi : openid,nn : (nickname||"匿名用户"),hu : (headimgurl ? headimgurl + '/' + yao_avatar_size : "images/avatar.png" )},'callbackFriendcircleTopicprise');
        	 	var beforNum = parseInt($(".zan-"+zanUid).find(".num").html());
        	 	if(beforNum > 0){
        	 		$(".zan-"+zanUid).find(".zan-num").html("我,"+$(".zan-"+zanUid).find(".zan-num").html());
        	 	}else{
        	 		$(".zan-"+zanUid).find(".zan-num").html("我"+$(".zan-"+zanUid).find(".zan-num").html());
        	 	}
        	 	$(".zan-"+zanUid).find(".num").html(beforNum+1)
        	 	setTimeout(function(){
        	 		$me.parent().removeClass("scaleIn");
        	 		$me.find(".zan-love").removeClass("scale");
        	 	},1000)
        	 });
   
        	 $(".fuc-cor").click(function(e){
        	 	e.preventDefault();
        	 	e.stopPropagation();
        	 	var $me = $(this);
        	 	var $parent = $me.parents(".person-info");
        	 	var index = $me.parents(".person-info").attr("data-index");
        	 	var key = $parent.attr("data-uid");
        	 	var index = $me.parents(".person-info").attr("data-index");
        		$(".ctrls").removeClass("none").attr("data-uid",key);
        		$("#input-comment").focus();
        	 	 if($(".fuc-btn").hasClass("scaleIn")){
        	  		$(".fuc-btn").removeClass("scaleIn");
	        	 	$(".fuc-zan").addClass("none");
	        	 	$(".fuc-cor").addClass("none");
        	  	}
        	 	 if($parent.find(".cor-list").hasClass("more")){
					$parent.find(".open").trigger("click",function(){
						H.index.allHeight =H.index.allH(index) + H.index.headerHeight;
						$(".scroll").scrollToTop(H.index.allHeight-H.index.wHeight+20);
						if(is_android()){
							setTimeout(function(){
								$(".scroll").scrollToTop(H.index.allHeight-H.index.wHeight+320);
							},1000)
						}
					});
        	 	}else{
        	 	 	H.index.allHeight =H.index.allH(index) + H.index.headerHeight;
        	 	 	$(".scroll").scrollToTop(H.index.allHeight-H.index.wHeight+20);
        	 	 	if(is_android()){
						setTimeout(function(){
							$(".scroll").scrollToTop(H.index.allHeight-H.index.wHeight+320);
						},1000)
					}
        	 	}
        	 	
        	 	
        	 
        	 });
        	 $("#btn-send").click(function(e) {
				e.preventDefault();
				if ($(this).hasClass("request")) {
					return;
				}
				var comment = $.trim($("#input-comment").val()) || '',
					comment = comment.replace(/<[^>]+>/g, ''),
					len = comment.length;
			
				if (len < 1) {
					showTips('请先说点什么吧',4);
					$("#input-comment").focus();
					return;
				} else if (len > 100) {
					showTips('观点字数超出了100字',4);
					$("#input-comment").focus();
					return;
				}
				$(this).addClass("request");
				shownewLoading();
				var corId = $(".ctrls").attr("data-uid");
				var nick = nickname || "匿名用户";
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: corId,
                        ty: 1,
                        nickname: encodeURIComponent(nick),
                        headimgurl: headimgurl ?  headimgurl + '/' + yao_avatar_size : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                    	hidenewLoading();
                    },
                    success : function(data) {
                      $("#btn-send").removeClass("request");
                        if (data.code == 0) {
				                $(".list-"+corId).css({
				                	"height":"auto"
				                });
				                $(".list-"+corId).append('<li><label>'+nick+':</label><span>'+comment+'</span></li>');
				                $(".list-"+corId).attr("data-height", $(".list-"+corId).height()).attr("data-open", $(".list-"+corId).height());
					            $(".list-"+corId).css({
									"height" : $("list-"+corId).attr("height"),
					            });
					         
					            $(".ctrls").addClass("none");
				                $("#input-comment").val('');
                            return;
                        }
                        showTips("评论失败");
                    }
                });
			});
        },
        allH : function(index){
        	var allH = 0;
        	for(var i =0; i <= index;i++){
				allH += $($(".person-info").get(i)).height();
			}
        	return allH;
        },
        swiper: function(index) {
	         var swiper = new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        paginationClickable: true
		    });
			swiper.slideTo(index, 0, false);
		},
		showImg : function(index){
			var me = this,t = simpleTpl();
			var imgList = [];
			$(".fuc-"+$(".showImg").attr("data-imgUid")).find(".pubImg span").each(function(){
				imgList.push($(this).find("img").attr("src"))
			});
			$(".showImg").removeClass("none");
			$(".load-bg").removeClass("none");
			H.index.imgReady(imgList,function(){
				t._('<div class="swiper-container">')
		        	._('<div class="swiper-wrapper">')
					for(var i = 0 ,len = imgList.length;i<len;i++){
						t._('<div class="swiper-slide"><div class="slide-content"><img src="'+ imgList[i]+'"/></div></div>')
					}
					t._('</div>')
		        	._('<div class="swiper-pagination"></div>')
    			._('</div>')
				$(".load-bg").addClass("none");
				$(".showImg").append(t.toString());
				me.swiper(index);
				$(".slide-content").each(function(){
				    $(this).height($(this).find("img").height());
				})
				
			});	
		}
	}
W.callbackFriendcircleTopicprise = function(data){
	if(data.code == 0){
		
	}
	
};
})(Zepto);                             

$(function(){
	shownewLoading();
	H.index.init();
});