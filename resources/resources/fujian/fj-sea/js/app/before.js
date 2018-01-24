var page = 1,
		pageSize = 5,
		time = 0,
	    loadmore = true,
	    first = true;

$(function() {
	
	getList(true);
    page ++;
    var range = 180, //距下边界长度/单位px
        maxpage = 100, //设置加载最多次数
        totalheight = 0;

    $(window).scroll(function(){
        var srollPos = $(window).scrollTop();
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if (($(document).height() - range) <= totalheight  && page < maxpage && loadmore) {
            if (!$('#mallSpinner').hasClass('none')) {
                return;
            }
            $('#mallSpinner').removeClass('none');
            getList();
            page ++;
        }
    });
    $(".intro-con").height($(window).height()-170);
    $(".intro-con .con").height($(window).height()-220)
    getResult('waitme/getsum', {}, 'waitmeSumHandler', true);
    $(".back-before").click(function(e) {
		e.preventDefault();
		$("header.top-nav").removeClass("none"); 
		$(".info-list").removeClass("none");
		$(".info-detail").addClass("none");
    });
    $(".act-btn").each(function(){
    	$(this).click(function(e) {
			e.preventDefault();
			$(".act-btn").removeClass("active");
			$(this).addClass("active");
	    });
    });
    $('.back-index').click(function(e) {
		e.preventDefault();
		window.location.href="index.html";
	}); 
    $(".act-btn:nth-child(2)").click(function(e) {
		e.preventDefault();
		$(".act-btn").removeClass("active");
		$(this).addClass("active");
		$(".introduce").removeClass("none");
		$(".listen").addClass("none");
	 });
	  $(".act-btn:nth-child(1)").click(function(e) {
			e.preventDefault();
			$(".act-btn").removeClass("active");
			$(this).addClass("active");
			$(".introduce").addClass("none");
			$(".listen").removeClass("none");
	 });
   
});

window.getList = function (showloading) {
		getResult('waitme/hishx', {page: page, pageSize: pageSize}, 'waitmeHisHandler', true);
}
window.waitmeSumHandler = function (data) {
		if(data.code == 0){
			$(".intro-con .con").html(data.ad);
		}
}
window.waitmeHisHandler = function(data) {
	//接口成功返回隐藏loading
    $('#mallSpinner').addClass('none');
          //未查到往期数据
		  if((data.code!=0||!data.activity)&&first){
		  	  $(".audio-list").html("<p class='no-record'>未查到往期数据</p>");
		  }else{
		   	  var t = simpleTpl(),
			  activity = data.activity || [],
			  len = activity.length,
			  list = null;
			if (time == 0&&len == 0) {
				return;
			} else if (len < pageSize) {
	            loadmore = false;
			}
			for (var i = 0; i < len; i ++) {
				list = activity[i].attr, m = simpleTpl();
				t._('<label data-uuid="'+activity[i].au+'">')
				._('</label>');
				$('.audio-list').append(t.toString());
				for (var j = 0; j < list.length; j ++) {
					m._('<img attr-uuid="'+list[j].atu+'" src="'+list[j].ai +'"/>');
				}
			    $('.audio-list label:nth-child('+(i+1)+')').html(m.toString());
			    m = simpleTpl();
				t = simpleTpl();;
			}
	   
			$(".audio-list label img").each(function(){
		    	$(this).click(function(e){
			    	e.preventDefault();
			    	var attr_uuid = $(this).attr("attr-uuid");
					var data_uuid = $(this).parent("label").attr("data-uuid");
			    	for(var i = 0; i < len; i ++){
			    		var list = activity[i].attr;
			    		if(data_uuid == activity[i].au){
						     for(var j = 0; j < list.length; j ++){
					    		if(attr_uuid  == list[j].atu){
								     $("#coffee-flow label img").attr("src",list[j].asi);
//								     $(".audio-icon").attr("href",list[j].am);
								     $(".audio-info label img").attr("src",list[j].ai);						
								     $(".audio-info .info-text").html(list[j].ad);
								     var w = ($(".main").width()-32)*0.2
							     	 $("#coffee-flow label").height(w);
							     	 $("#coffee-flow label img").height(w);
							     	 $("#coffee-flow").height(w);
							     	 $(".audio-icon").height(w);
							     	 $("header.top-nav").addClass("none")
								     $(".info-list").addClass("none");				
								     $(".info-detail").removeClass("none");
									 var $audio = $('#ui-audio').audio({
										auto: false,			// 是否自动播放，默认是true
										stopMode: 'stop',	// 停止模式是stop还是pause，默认stop
										audioUrl: list[j].am,
										steams:["<img src='./images/icon-musical-note.png' />", "<img src='./images/icon-musical-note.png' />"],
										steamHeight: 150,
										steamWidth: 44
									 });
									 setTimeout(function() {
										$audio.pause();
										//$audio.stop();
					    		   })
					    	    }
			    		    }
			    	      }
					  }
			    });
		    });
	   }
		first = false;
	    time ++;
};