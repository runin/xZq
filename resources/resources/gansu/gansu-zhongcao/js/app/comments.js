//*
 /* 评论页*/
 
(function($) {
	window.lastUserText ="";
	H.comments = {
		$main : $('#main'),
		$lottery_time : $(".lottery-time"),
		$nav : $(".nav"),
		$top_back : $(".scroll-top"),
		actUid : null,
		page : 0,
		beforePage : 0,
		item_index : 0,
		pageSize:15,
		commActUid:null,
		loadmore : true,
		isCount : true,
		now_time : null,
		expires: {expires: 7},
		init : function(){
			var me = this;
			me.event_handler();
			//setInterval(function() {
			//	getResultAsync('api/comments/count', {anys:commActUid}, 'callbackCommentsCount',true);
			//	me.newdata();
			//}, 5000)
		},
		event_handler: function() {
			var me = this;

			this.$lottery_time.click(function(e){
				e.preventDefault();
				if(H.comments.$lottery_time.attr("disabled") != 'disabled' && openid != null){
					H.lottery.lottery(H.comments.actUid,2);
					
				}
			});
			this.$top_back.click(function(e){
				e.preventDefault();
				$(".encounter").scrollTop(0);
				$(this).addClass('none');
			});

			$(".encounter").scroll(function(){
				var scroH = $(this).scrollTop();
					//$fix = $('.scroll-top');
				if(scroH > 0){
					me.$top_back.removeClass('none');
				}else if(scroH == 0){
					//$fix.addClass('none');
					me.$top_back.addClass('none');
				}
			});
			
			var range = 55, //距下边界长度/单位px
			maxpage = 100, //设置加载最多次数
			totalheight = 0;
			$(".encounter").scroll(function(){
				
			    var srollPos = $(".encounter").scrollTop();
			    totalheight = parseFloat($(".encounter").height()) + parseFloat(srollPos);
				if (($(document).height() - range) <= totalheight  && H.comments.page < maxpage && H.comments.loadmore) {

					if (!$('#mallSpinner').hasClass('none')) {
						return;
					}
					
					H.comments.getList(H.comments.page);
			    }
			});

			
			$("#send").click(function(){
				if(!$.trim($("#comments-info").val())){
					alert('请填写评论');
					$("#comments-info").focus();
					return;
				}
				if(openid != null){
					$("#send").attr("disabled","disabled");
					$("#comments-info").attr("disabled","disabled");
					if(headimgurl != null && headimgurl.indexOf("./images/avatar.jpg") > 0){
						headimgurl='';
					}
					
					getResult('api/comments/save', {
						co:encodeURIComponent($("#comments-info").val()),
						op:openid,
						tid:pid,
						ty:2,
						pa:null,
						nickname: encodeURIComponent(nickname || ''),
						headimgurl: headimgurl || ''
						}, 'callbackCommentsSave',true);
				}
			});
			
		},
		getList:function(page){
			
				$('#mallSpinner').removeClass('none');
				//W.showLoading();
				getResultAsync('api/comments/list', {page:page,ps:this.pageSize,anys:pid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
			
		},
		
		bindZanClick: function(cls){
			$("."+cls).click(function(){
				if($(this).hasClass('z-ed')){ return; }
				$(this).addClass("curZan").addClass('z-ed');
				getResult('api/comments/praise', {
					uid:$(this).parent().parent().attr("data-uuid"),
					op:openid
					}, 'callbackCommentsPraise',true);
			});
		},
		is_show: function(i){
			var $all_con = $('#all-con' + i);
			var height = $all_con.height(),
				inner_height = $all_con.find('span').height();
			if(inner_height > height){
				$all_con.find('span').addClass('all');
				$('#show-all' + i).removeClass('none');
			}
		},
		
		tpl: function(data) {
			var me = this, t = simpleTpl(), item = data.items || [], $top_comment = $('#top-comment'),$nor_comment = $('#nor-comment');
			for (var i = 0, len = item.length; i < len; i++) {
				var isZan = item[i].isp ? "z-ed":"";

				t._('<li id="'+ item[i].id +'" data-uuid = "'+ item[i].uid +'">')
					._('<img src="'+ (item[i].im ? (item[i].im + '/' + yao_avatar_size) : './images/avatar.jpg')+'"/>')
					._('<div class="review-text">')
						._('<h3>'+ (item[i].na || '匿名用户') +'</h3>')
						._('<p class="all-con" id="all-con'+ me.item_index +'">')
							._('<span>'+ item[i].co +'</span>')
						._('</p>')
					._('</div>')
					._('</li>');
				++ me.item_index;
			}

			if(data.kind == 1){
				$top_comment.append(t.toString());
			}else{
				$nor_comment.append(t.toString());
			}
			for (var i = 0, len = me.item_index; i < len; i++) { me.is_show(i); }
			H.comments.bindZanClick("zan");
		},
		
		currentComments : function(commActUid) {

			getResultAsync('api/comments/count', {anys:commActUid}, 'callbackCommentsCount',true);
            H.comments.page =2;
			//getResultAsync('api/comments/list', {page:1,ps:this.pageSize,anys:commActUid,op:openid}, 'callbackCommentsList',true);

			setInterval(function () {
                    getResultAsync('api/comments/count', {anys:commActUid}, 'callbackCommentsCount',true);
            }, 5000);
		}
	};
  

	W.callbackCommentsCount = function(data){
		if(data.code == 0){
			//var rsconut = $(".part_num").text();
			//if(rsconut<data.tc) {
				$('#personCount').html(data.tc);
			//}
		}
	}
	
	W.callbackCommentsList = function(data){
		$('#mallSpinner').addClass('none');
		W.hideLoading();
		if(data.code == 0){
			H.comments.tpl(data);
			if (data.items.length < H.comments.pageSize && data.kind == 0) {
				H.comments.loadmore = false;
			}
			if(data.items.length == H.comments.pageSize){
				if(H.comments.page == 0){
					H.comments.beforePage = 1;
					H.comments.page = 2;
				}else{
					H.comments.beforePage = H.comments.page;
					H.comments.page++ ;
				}
			}
		}else {
		}
	}	
	
	W.callbackCommentsSave = function(data){
		
		if(data.code == 0 ){
			var headImg = null;
			if(headimgurl == null || headimgurl == ''){
				headImg = './images/avatar.jpg';
			}else{
				headImg = headimgurl + '/' + yao_avatar_size;
			}
			var t = simpleTpl(),$nor_comment = $('#nor-comment');
			t._('<li id="'+ data.uid +'" data-uuid = "'+ data.uid +'">')
			._('<img src="'+ headImg +'"/>')
			._('<div class="review-text">')
			._('<h3>'+ (nickname || '匿名用户') +'</h3>')
			._('<p class="all-con" id="all-con'+ data.uid +'">')
				._('<span>'+ $("#comments-info").val() +'</span>')
			._('</p>')
			._('</div>')
			._('</li>');
			lastUserText = openid+"_"+ $("#comments-info").val();
			if($nor_comment.children().length==0){
				$nor_comment.append(t.toString());
			}else{
				$nor_comment.children().first().before(t.toString());
			}

			H.comments.is_show(data.uid);
			$("#comments-info").val("");
			H.comments.bindZanClick("zan-"+data.uid);
			$('.review-count').find("label").html($('.review-count').find("label").html()*1+1);

			var navH = $("#"+data.uid).offset().top;
			//$(window).scrollTop(navH);
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}else{
			alert(data.message);
			$("#comments-info").val("");
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}
	}
	
	W.callbackCommentsPraise = function(data){
		if(data.code == 0){
			$(".curZan").text($(".curZan").text()*1 + 1);
			$(".curZan").removeClass("curZan");
		}
	}
	
	W.callbackTimeHandler = function(data){
		H.comments.now_time = data.tm;
		//H.comments.currentPrizeAct();
	}

})(Zepto);
$(function(){
	H.comments.init();
});