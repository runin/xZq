function sdialog(a){var b=$(a).attr("surl");alert(b),$.ajax({type:"POST",url:b,cache:!1,success:function(a){alert(a),$("#about_detail").append(a)}})}$(function(){var a=$(".banner"),b=$("#slide"),c=$(".slide_ul"),d=b.find("li");d.find(" a img");var f=0,g=d.length,h=$('<a href="javascript:;" class="lbtn" >\u4e0a\u4e00\u5f20</a>'),j=$('<a href="javascript:;" class="rbtn" >\u4e0b\u4e00\u5f20</a>');c.before(h).after(j);var k=$(window);b.css("height",k.width()/3.1),k.resize(function(){b.css("height",k.width()/3.1)});var l=$(".lbtn"),m=$(".rbtn"),n=$("<div id='titleBar'></div>");for(n.insertAfter(b),i=0;g>i;i++){var o=$("<span>");o.appendTo(n)}var p=$("#titleBar"),o=p.find("span");p.css("margin-left",34*-g/2);var q=function(a){d.eq(a).stop(!0,!0).show(),o.removeClass("hover").eq(a).addClass("hover")};q(0),o.mouseenter(function(){var a=o.index(this);a!=f&&(f=a,q(a))}),m.click(function(){f=f>=g-1?0:++f,q(f)}),l.click(function(){f=0>=f?g-1:--f,q(f)});var r=function(){timer=setInterval(function(){f=f>=g-1?0:++f,q(f)},5e3)};r(),a.hover(function(){clearInterval(timer)},r);var s=$(".cdv_title"),t=$('<div class="cont"></div>'),u=$('<div class="triangle"></div>');s.wrap(t);var v=$(".cont");u.insertAfter(v);for(var w=$(".cdv_slide"),x=function(a,b){$("#"+b).find(".cdv_ul").stop(!0,!0).hide().eq(a).stop(!0,!0).show(),$("#"+b).find(".cdv_page").children("span").removeAttr("class").eq(a).addClass("cdv_icon")},y=0;y<w.size();y++){$this=$(w.get(y)),$this.attr("sindex",0),$this.children("ul").addClass("cdv_ul");var z=$this.find(".cdv_ul"),A=z.length,B=$('<a href="javascript:;" class="cdv_left" sid="cdv_slide_'+y+'">\u4e0a\u4e00\u5f20</a>'),C=$('<a href="javascript:;" class="cdv_right" sid="cdv_slide_'+y+'">\u4e0b\u4e00\u5f20</a>'),D=$('<div class="cdv_page"></div>');$this.append(B).append(C).prepend(D).css("height",z.height());var E=$this.find(".cdv_page");for(i=0;A>i;i++){var F=$("<span>");F.appendTo(E)}var F=E.children("span");$this.find(".cdv_ul").stop(!0,!0).hide().eq(0).stop(!0,!0).show(),$this.find(".cdv_page").children("span").removeAttr("class").eq(0).addClass("cdv_icon"),$this.attr("id","cdv_slide_"+y),$this.find(".cdv_right").click(function(){var a=$(this).attr("sid"),b=$("#"+a),c=b.attr("sindex");$this.find(".cdv_left").show(),c>=b.find(".cdv_ul").size()-2&&($(this).hide(),++c),b.attr("sindex",c),x(c,$(this).attr("sid"))}),$this.find(".cdv_left").hide(),$this.find(".cdv_left").click(function(){var a=$(this).attr("sid"),b=$("#"+a),c=b.attr("sindex");$this.find(".cdv_right").show(),--c,0>=c&&$(this).hide(),b.attr("sindex",c),x(c,$(this).attr("sid"))})}var G=$(".serv_nav"),H=G.find("li"),I=$(".serv_cont").find(".serv_cont_num1");H.eq(0).addClass("nav_active0"),H.hover(function(){var a=H.index(this);H.eq(a).addClass("nav_active"+a).siblings().removeClass(H.eq(a).siblings().attr("sattr")),I.eq(a).show().siblings().hide()}),$(".foot_top").click(function(){$("body").animate({scrollTop:0},700)});var J=$(".new_cont"),K=$(".new_page"),L=$('<a href="javascript:;" class="page_t fl">&lt; \u4e0a\u4e00\u9875 </a>'),M=J.length;K.append(L);var N=$(".page_t");for(i=1;M>=i;i++){var O=$('<a href="javascript:;" class="page_a fl">'+i+"</a>");K.append(O)}var P=$('<a href="javascript:;" class="page_b fl"> \u4e0b\u4e00\u9875 &gt;</a>');K.append(P);var O=$(".page_a"),Q=$(".page_b"),R=function(a){J.stop(!0,!0).hide().eq(a).stop(!0,!0).show(),O.removeClass("active").eq(a).addClass("active")};R(0),Q.click(function(){f=f>=M-1?0:++f,R(f)}),N.click(function(){f=0>=f?M-1:--f,R(f)}),$(function(){var a=navigator.userAgent.toLowerCase(),b="ipad"==a.match(/ipad/i),c="iphone os"==a.match(/iphone os/i),d="midp"==a.match(/midp/i),e="rv:1.2.3.4"==a.match(/rv:1.2.3.4/i),f="ucweb"==a.match(/ucweb/i),g="android"==a.match(/android/i),h="windows ce"==a.match(/windows ce/i),i="windows mobile"==a.match(/windows mobile/i);if(b||c||d||e||f||g||h||i){}else;})});

$(function(){
		/*nav*/
		var win=$(window);
		var nav=$("#nav");
		var nav_fixed=function(){
			min_height=nav.offset().top;
			win.scroll(function(){
				var t=win.scrollTop();
				if(t>min_height){
					nav.stop().css({"position":"fixed","top":"0"});
					}else{
					nav.stop().css({"position":"static"});
				};
			});
		};
		if (($(document).height() - $(window).height()) > 100) {
			nav_fixed();
		};

		/*addVersion*/ 
		var version = '20150330181509';
		$("link").each(function(i, item) {
			var href = $(this).attr("href");
			$(this).attr("href", href + "?v=" + version);
		});
		$("script").each(function(i, item) {
			var scr = $(this).attr("src");
			$(this).attr("src", scr + "?v=" + version);
		});

		/*nav scroll*/ 
		var $navArrow = $(".nav_arrow");
		var $navUl = $(".navi_ul");
		var itemW = $navUl.find('.current').innerWidth();
		var defLeftW = $navUl.find('.current').position().left;
		$navArrow.stop().animate({
			left: defLeftW,
			width: itemW
		},300);
		$navArrow.width(itemW);
		$navUl.find('a').hover(function(){
			var index = $(this).parent().index();
			var leftW = $(this).position().left;
			var currentW = $navUl.find('a').eq(index-1).innerWidth();
			$navArrow.stop().animate({
				left: leftW,
				width: currentW
			},300);},function(){
				$navArrow.stop().animate({
					left: defLeftW,
					width: itemW
			},300);
		});
	});