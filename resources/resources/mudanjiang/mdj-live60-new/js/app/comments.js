(function($) {
	H.comments = {
		$main : $('#main'),
		$top_back : $(".top-back"),
		actUid : null,
		page : 0,
		beforePage : 0,
		pageSize:5,
		item_index : 0,
		commActUid:null,
		loadmore : true,
		isCount : true,
		expires: {expires: 7},
		attrUuid: null,
		init : function(){
			var me = this;
			me.currentCommentsAct();
			me.event_handler();
		},
		event_handler: function() {
			var me = this;
			this.$main.delegate('.show-all', 'click', function(e) {
				e.preventDefault();
				var $class_all = $(this).parent('div').find('.all-con');

				$class_all.find('span').toggleClass('all');
				if( $class_all.find('span').hasClass('all')){
					$(this).text('^显示全部');
				}else{
					$class_all.css('height','auto');
					$(this).text('^收起');
				}
			});
			this.$top_back.click(function(e){
				e.preventDefault();
				$(window).scrollTop(0);
				$(this).addClass('none');
			});

			$(window).scroll(function(){
				var scroH = $(this).scrollTop(),
					$fix = $('.fix');
				if(scroH > 0){
					$fix.removeClass('none');
					me.$top_back.removeClass('none');
				}else if(scroH == 0){
					$fix.addClass('none');
					me.$top_back.addClass('none');
				}
			});
			
			var range = 55, //距下边界长度/单位px
			maxpage = 100, //设置加载最多次数
			totalheight = 0;
			$(window).scroll(function(){
			    var srollPos = $(window).scrollTop();
			    totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
				if (($(document).height() - range) <= totalheight  && H.comments.page < maxpage && H.comments.loadmore) {
					if (!$('#mallSpinner').hasClass('none')) {
						return;
					}
					H.comments.getList(H.comments.page);
			    }
			});
			
			$("#send").click(function(){
				if(!$.trim($("#comments-info").val())){
					showTips('请填写评论');
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
						tid:H.comments.commActUid,
						ty:1,
						pa:null,
						nickname: encodeURIComponent(nickname || ''),
						headimgurl: headimgurl || ''
						}, 'callbackCommentsSave',true);
				}
			});

			$('.back-home').click(function(e){
				e.preventDefault();
				toUrl('index.html');
			});
			
		},
		getList:function(page){
			if(page - 1  == this.beforePage){
				$('#mallSpinner').removeClass('none');
				getResult('comments/list', {page:page,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
			}
		},
		bindClick: function(){
			$("#sup").find('.support').click(function(){
				var attrUuid = $(this).attr("data-uuid");
				H.comments.attrUuid = attrUuid;
				getResult('fashion/support', {openid:openid,activityUuid:H.comments.commActUid,attrUuid:attrUuid}, 'supportHandler',true);
			});
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
				t._('<li data-uuid = "'+ item[i].uid +'">')
					._('<img src="'+ (item[i].im ? (item[i].im + '/' + yao_avatar_size) : './images/avatar.jpg')+'"/>')
					._('<div>')
						._('<label class="zan '+isZan+'" data-collect="true" data-collect-flag="mdj-live60-comments-zan" data-collect-desc="点赞" >'+ item[i].pc +'</label>')
						._('<p>'+ (item[i].na || '匿名用户') +'</p>')
						._('<p class="all-con" id="all-con'+ me.item_index +'">')
							._('<span>'+ item[i].co +'</span>')
						._('</p>')
						._('<a class="show-all none" id="show-all'+ me.item_index +'" data-collect="true" data-collect-flag="mdj-live60-comments-show" data-collect-desc="评论收缩显示" >^显示全部</a>')
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
		
		currentCommentsAct : function() {
			getResult('fashion/indexnew', {openid:openid}, 'fashionIndexNewHandler',true);
		},
		currentComments : function(commActUid) {
			getResult('api/comments/count', {anys:commActUid}, 'callbackCommentsCount',true);
			getResult('api/comments/list', {page:1,ps:this.pageSize,anys:commActUid,op:openid,dt:1,zd:1,kind:1}, 'callbackCommentsList',true);
			getResult('api/comments/list', {page:1,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
		}
	};

	W.fashionIndexNewHandler = function(data){
		if(data.code == 0){
			var com = data.tl[0];
			H.comments.commActUid = com.actUid;
			$("#comm-title").text(com.actTle);
			H.comments.currentComments(com.actUid);
			if(com.attrs != null && com.attrs.length != 0){
				var result = com.attrs;
				var sumCount = com.count;
				var sumPercent = 0;
				var t = simpleTpl(), $sx_ul = null;
				for (var i = 0, len = result.length; i < len; i++) {
					$sx_ul = $('#sup');
					if(result[i].ai != ""){
						t._('<a class="btn support" data-collect="true" data-collect-flag="tv-gznews-dayday-vote-item" data-collect-desc="投票选项" style="background:'+result[i].acl+'" data-uuid = "'+ result[i].au +'"><i class="hand" style="background: url('+result[i].ai+') no-repeat right center;background-size:17px auto"></i><label>'+result[i].av+'</label></a>');
					}else{
						t._('<a class="btn support" style="background:'+result[i].acl+'" data-uuid = "'+ result[i].au +'"><i></i><label class="chan-width">'+result[i].av+'</label></a>');
					}
				}
				$sx_ul.html(t.toString());
				$sx_ul.removeClass("none");
				H.comments.bindClick();
				return;
			}else if(com.result != null && com.result.length != 0){
				var result = com.result;
				var sumCount = com.count;
				var sumPercent = 0;
				var t = simpleTpl(),
					$sx_ul = $('#progress');
				for (var i = 0, len = result.length; i < len; i++) {
					var percent = (result[i].ac/sumCount * 100).toFixed(0);
					if(i == result.length-1){
						percent = (100.00 - sumPercent).toFixed(0);
					}
					var select = result[i].au == com.flag ? 'checked="checked"' : '';
					t._('<p>')
						._('<label>'+result[i].av+'</label>')
						._('<i class="support-pro"><span style="width:'+percent+'%;background:'+result[i].acl+'"></span></i><span class="lv" >'+percent+'%</span>')
						._('</p>');
					sumPercent += percent * 1;
				}

				$sx_ul.html(t.toString());
				$sx_ul.removeClass("none");
				return;
			}
		}
	}

	W.callbackCommentsCount = function(data){
		if(data.code == 0){
			$('.com-head').find("label").html(data.tc);
		}
	}
	
	W.callbackCommentsList = function(data){
		$('#mallSpinner').addClass('none');
		if(data.code == 0){
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
			H.comments.tpl(data);
		}else {
		}
	}
	
	W.supportHandler = function(data){
		if(data.code == 0){
			var sumCount = data.count;
			var sumPercent = 0;
			var result = data.result;
			var t = simpleTpl(), $sx_ul = $('#progress');
			for (var i = 0, len = result.length; i < len; i++) {
				var percent = (result[i].ac/sumCount * 100).toFixed(0);
				if(i == result.length-1){
					percent = (100.00 - sumPercent).toFixed(0);
				}
				t._('<p>')
					._('<label>'+ result[i].av +'</label>')
					._('<i class="support-pro"><span style="width:'+(percent-2)+'%;background:'+result[i].acl+'"></span></i>')
					._('<span class="lv">'+percent+'%</span>')
				._('</p>');
				sumPercent += percent;
			}
			
			$sx_ul.html(t.toString());
			$('#sup').addClass("none");
			$sx_ul.removeClass("none");
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
			._('<div>')
				._('<label class="zan-'+data.uid+'" class="zan" data-collect="true" data-collect-flag="mdj-live60-comments-zan" data-collect-desc="点赞" >'+ 0 +'</label>')
				._('<p>'+ (nickname || '匿名用户') +'</p>')
				._('<p class="all-con" id="all-con'+ data.uid +'">')
					._('<span>'+ $("#comments-info").val() +'</span>')
				._('</p>')
				._('<a class="show-all none" id="show-all'+ data.uid +'" data-collect="true" data-collect-flag="mdj-live60-comments-show" data-collect-desc="评论收缩显示">^显示全部</a>')
			._('</div>')
			._('</li>');

			if($nor_comment.children().length==0){
				$nor_comment.append(t.toString());
			}else{
				$nor_comment.children().first().before(t.toString());
			}
			H.comments.is_show(data.uid);
			$("#comments-info").val("");
			H.comments.bindZanClick("zan-"+data.uid);
			$('.com-head').find("label").html($('.com-head').find("label").html()*1+1);

			var navH = $("#"+data.uid).offset().top;
			$(window).scrollTop(navH);
			
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}else{
			showTips(data.message);
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
})(Zepto);
$(function(){
	H.comments.init();
});