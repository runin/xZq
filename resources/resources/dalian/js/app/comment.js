
//****//
//***评论***//
var plcolor = [
{
	id:0,
	color:"#c0ff00"
},{
	id:1,
	color:"#00deff"
},{
	id:2,
	color:"#fff600"
},{
	id:3,
	color:"#ffffff"
},{
	id:4,
	color:"#ff13f7"
},{
	id:5,
	color:"#4fe637"
}];

(function($) {
	H.conmment = {
		$dmNumber: $(".dm-number"),
		$commentList: $(".comment-list"),
		$yjgz: $("#div_subscribe_area"),
		$commentBtn: $("#comment-btn"),
		$ps:30,//每次获取实时消息的条数
		$maxid:0,//最大的id
		$uuid:[],//自己评论的uuid
		$hcud:null,
		$page:2,
		$pg:30,
		$isLoad:true,
		$lastuid:"",
		init: function() {
			this.commentsCount();
			this.nowtimtFn();
			this.commentBntFn();
		},
		nowtimtFn: function() {//查询当前系统时间
		    getResult('api/common/timestr', {}, 'commonApiTimeStrHandler');
		},
		commentsCount: function() {//评论数
			getResult('api/comments/count', {}, 'callbackCommentsCount');
		},
		htmlFn: function() {
			var t = simpleTpl();
			t._('<section class="pop-box">')
			t._('<div class="comment-box in-up">')
			t._('<div class="comment-list">')
			t._('<ul id="nor-comment">')
			t._('</ul>')
			t._('</div>')
			t._('<div class="comment-form">')
			
			t._('<a href="javascript:void(0);" class="gohome"></a>')
			t._('<input name="ipt-text" type="text" class="comment-input" id="c-input" placeholder="说说你的看法吧~" />')
			t._('<input name="ipt-btn" type="button" id="send" class="comment-btn" data-collect="true" data-collect-flag="btn-comment" data-collect-desc="说说你的看法吧" />')
			
			t._('</div>')
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
			this.roomFn();
			this.gohomeFn();
			this.sendFn();
			this.pageScroll();
		},
		gohomeFn: function() {
			$(".gohome").click(function() {
				$(".comment-box").removeClass("in-up").addClass("out-down");
				setTimeout(function() {
					$(".pop-box").addClass("none");
					$(".comment-box").removeClass("out-down");
				},500);
			});
		},
		commentBntFn: function() {
			var that = this;
			that.$commentBtn.click(function() {
				if($("body").find(".pop-box").length>0) {
					$(".pop-box").removeClass("none");
					$(".comment-box").addClass("in-up");
					var h = parseFloat($("#nor-comment").css("height")) - parseFloat($(".comment-list").css("height"));
					if(h>0) {
					    $(".comment-list").scrollTop(h);
					}
				}else {
					that.htmlFn();
				    that.heightFn();
					//window.piao = setInterval(function() {
					//	H.conmment.piaoFn();
					//},10000)
				}
				H.conmment.piaoFn();
			});
		},
		heightFn: function() {//计算高度
			var wh = $(window).height();
			$("body,.main-box,.pop-bg:before,.comment-box").css("height",wh);
		},
		sendFn: function() {//保存评论
			$("body").unbind("click").delegate("#send","click",function(e) {
				var $cipt = $("#c-input");
				var cipt = $.trim($("#c-input").val());
				if(!cipt) {
					showTips("请填写你的看法！");
					$cipt.focus();
					return;
				}
				if(openid != null) {
					$("#send").attr("disabled","disabled");
					$("#c-input").attr("disabled","disabled");
					if(headimgurl != null && headimgurl.indexOf("./images/avatar.jpg") > 0){
						headimgurl='';
					}
					getResult('api/comments/save', {op:openid, co:encodeURIComponent(cipt), ty:2, pa:null, nickname: encodeURIComponent(nickname || ''), headimgurl: headimgurl || ''}, 'Callback：callbackCommentsSave');
				}
			});
		},
		roomFn: function() {//实时获取评论信息
			getResult('api/comments/room', {ps:H.conmment.$ps, maxid:H.conmment.$maxid}, 'callbackCommentsRoom');
		},
		pageFn: function() {//分页获取评论信息
			getResult('api/comments/list?temp='+ new Date().getTime(), {page:H.conmment.$page, ps:H.conmment.$ps}, 'callbackCommentsList');
		},
		pageScroll: function() {
			$(".comment-list").scroll(function() {
				clearTimeout(window.scl);
				var scrolltop;
				if (!H.conmment.$isLoad) {
					return;
				}
				window.scl = setTimeout(function() {
					scrolltop = $(".comment-list").scrollTop();
					if(scrolltop>0) {
						return;
				    }
					H.conmment.pageFn();
				},1000);
				
			});
		},
		dataAFn: function(data) {
			var t = simpleTpl();
			 H.conmment.$isLoad = false;
			 var html = "";
			 var ay = [];
			 var ar = [];
			 var k = "";
			 var leg = 0;
			 var $nor_comment = $('#nor-comment');
			 var items = data.items;
			 var now =  parseInt(timestamp(H.conmment.$hcud));
			 H.conmment.$maxid = data.maxid;
			 for(var i=0, leg=items.length; i<leg; i++) {
				 var s = H.conmment.$uuid.some(function(item, index, array) {//如果自己的评论就不再实时获取
					return (item==items[i].uid);
				 })
				 if(s) {
					 continue;
				 }
				 var c = Math.floor((Math.random()*plcolor.length));//字体颜色
				 ay.push('<li id="'+items[i].id+'" data-uuid = "'+items[i].uid+'">');
				 ay.push('<div class="comment-bar">');
				 ay.push('<i class="i-headimg" style="background-image:url('+items[i].im+')"></i>');
				 ay.push('<p style="color:'+plcolor[c].color+'">'+items[i].co+'</p>');
				 ay.push('</div>')
				 ay.push('</li>')
			 }
			 leg = ay.length;
			 for(var i=0,leg = ay.length; i<leg; i++) {
				 k += ay[i];
				 if(i!=0 && ((i+1)%6==0)) {
					 ar.push(k);
					 k="";
				 }
			 }
			 if($nor_comment.children().length==0){
				 $nor_comment.append(ar.reverse().join(""));
			 }else{
			 	$nor_comment.children().last().after(ar.reverse().join(""));
			 }
			 var h = parseFloat($("#nor-comment").css("height")) - parseFloat($(".comment-list").css("height"));
			 if(h>0) {
				$(".comment-list").scrollTop(h);
			 }
			 H.conmment.$isLoad = true;
		},
		dataBFn: function(data) {
			var t = simpleTpl();
			 H.conmment.$isLoad = false;
			 var html = "";
			 var ay = [];
			 var ar = [];
			 var k = "";
			 var leg = 0;
			 var $nor_comment = $('#nor-comment');
			 var items = data.items;
			 var now =  parseInt(timestamp(H.conmment.$hcud));
			 H.conmment.$maxid = data.maxid;
			 for(var i=0, leg=items.length; i<leg; i++) {
				 var s = H.conmment.$uuid.some(function(item, index, array) {//如果自己的评论就不再实时获取
					return (item==items[i].uid);
				 })
				 if(s) {
					 continue;
				 }
				 var c = Math.floor((Math.random()*plcolor.length));//字体颜色
				 ay.push('<li id="'+items[i].id+'" data-uuid = "'+items[i].uid+'">');
				 ay.push('<div class="comment-bar">');
				 ay.push('<i class="i-headimg" style="background-image:url('+items[i].im+')"></i>');
				 ay.push('<p style="color:'+plcolor[c].color+'">'+items[i].co+'</p>');
				 ay.push('</div>')
				 ay.push('</li>')
			 }
			 leg = ay.length;
			 for(var i=0,leg = ay.length; i<leg; i++) {
				 k += ay[i];
				 if(i!=0 && ((i+1)%6==0)) {
					 ar.push(k);
					 k="";
				 }
			 }
			 $nor_comment.prepend(ar.reverse().join(""));
			 var h = parseFloat($("#nor-comment").css("height")) - parseFloat($(".comment-list").css("height"));
			 if(h>0) {
				$(".comment-list").scrollTop(h);
			}
			H.conmment.$isLoad = true;
		},
		piaoFn: function() {
			$("#nor-comment").find(".piao").css("-webkit-animation-delay","").removeClass("piao");
			var li = $("#nor-comment").find("li");
			var num;
			if(li.length>10) {
				num = li.length-8;
				for(var i=num,j=1; i<li.length; i++,j++) (
				    $("#nor-comment li").eq(i).css("-webkit-animation-delay",0.4*j+"s").addClass("piao")
		       )
			}
			
		}
	};
	
	W.commonApiTimeStrHandler = function(data) {//获取系统当前时间串
	    H.conmment.$hcud = data.t;
	}
	
	W.callbackCommentsSave = function(data) {//保存评论
	    if(data&&data.code == 0){
			var headImg = null;
			if(headimgurl == null || headimgurl == ''){
				headImg = './images/avatar.jpg';
			}else{  
				headImg = headimgurl + '/' + yao_avatar_size;
			}
			var t = simpleTpl();
			var $nor_comment = $('#nor-comment');
			var c = Math.floor((Math.random()*plcolor.length));//字体颜色
			H.conmment.$uuid.push(data.uid);
			t._('<li id="'+data.uid+'" data-uuid = "'+data.uid+'">')
			t._('<div class="comment-bar">')
			t._('<i class="i-headimg" style="background-image:url('+headImg+')"></i>')
			t._('<p style="color:'+plcolor[c].color+'">'+$("#c-input").val()+'</p>')
			t._('</div>')
			t._('</li>')
			
			if($nor_comment.children().length==0){
				$nor_comment.append(t.toString());
			}else{
				$nor_comment.children().last().after(t.toString());
			}
			var h = parseFloat($("#nor-comment").css("height")) - parseFloat($(".comment-list").css("height"));
			if(h>0) {
				$(".comment-list").scrollTop(h);
			}
			$("#send").removeAttr("disabled");
			$("#c-input").removeAttr("disabled").val("");
				
		}else {
			alert("提交失败，请稍候再试~");
			$("#c-input").val("");
			$("#send").removeAttr("disabled");
			$("#c-input").removeAttr("disabled");
		}
	};
	
	W.callbackCommentsRoom = function(data) {//实时获取评论信息
		 if(data&&data.code == 0){
			 H.conmment.dataAFn(data)
			 clearInterval(window.itl);
			 window.itl = setInterval(function() {
				 H.conmment.roomFn();
			 },5000);
		 }else {
			 clearInterval(window.itl);
			 window.itl = setInterval(function() {
				 H.conmment.roomFn();
			 },5000);
		 }
	};
	
	W.callbackCommentsCount = function(data) {//评论数
	    if(data&&data.code == 0){
			var tc = data.tc;
			if(tc>=100) {
				H.conmment.$dmNumber.text("+99");
			}else {
				H.conmment.$dmNumber.text("+99");
			}
		}else {
			H.conmment.$dmNumber.text("+99");
		}
	};
	
	W.callbackCommentsList = function(data) {//分页获取评论信息
	    if(data&&data.code == 0){
			if(H.conmment.$ps > data.items.length) {
				return;
			}
			if(H.conmment.$page == 2) {
				H.conmment.$lastuid = data.items[data.items.length - 1].uid;
			}else {
				if(H.conmment.$lastuid == data.items[data.items.length - 1].uid) {
					return;
				}else {
					H.conmment.$lastuid = data.items[data.items.length - 1].uid;
				}
			}
			
			H.conmment.$page++;
			H.conmment.$isLoad = false;
			H.conmment.dataBFn(data)
		}
	}
	
	H.conmment.init();
  
})(Zepto);