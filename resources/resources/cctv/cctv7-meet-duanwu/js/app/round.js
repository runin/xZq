(function($) {
	H.round = {
		$main : $('#main'),
		commActUid:null,
		now_time : null,
		check: null,
		actuid: null,
		roundNum: null,
		round1uuid: null,
		round2uuid: null,
		windowHeight: $(window).height(),
		init : function(){
			var me = this;
			if (!openid) {
				window.location.href = 'main.html';
				return;
			};
			me.actuid_check();
			me.current_info();
            $(".contact-url").click(function(e){
                e.preventDefault();
                location.href = contact_url;
            });
		},
		actuid_check: function() {
			var me = this;
			me.actuid = getQueryString('actuid');
			if (me.actuid == '') {
				toUrl("main.html");
				return false;
			};
		},
		current_info: function() {
			var me = this;
			getResult('meet/info', {
				openid: openid
			}, 'meetInfoHandler');
		},
		fill_data: function(data) {
			var me = this, t = simpleTpl(),
			attrs = data.attrs || [],
			length = attrs.length;
			me.roundNum = data.vr;
            if(me.roundNum == 1){
                $('header').append('<style>header:before {background:url('+ data.vi +') no-repeat;background-size:95% auto;}</style>');
                $('.host-name').html(data.vt);
                $('.host-intro').html(data.vd);

                for (var i = 0; i < length; i ++) {
                    var current_li = '.main .guest-box ul li:eq(' + i +')';

                    $(current_li).css({
                        'background': 'url(' + attrs[i].ai + ') no-repeat center center',
                        'background-size': 'cover'
                    });
                    t._('<li data-au="'+ attrs[i].au + '" class="' + attrs[i].uv + ' type' + attrs[i].at + '" style="background:url(' + attrs[i].ai + ') no-repeat center center;background-size:cover;">')
                        ._('<div class="guest-content">')
                        ._('<p>')
                        ._('<span class="guest-name">'+ attrs[i].an +'</span>')
                        ._('</p>')
                        ._('<p class="guest-intro">' + attrs[i].ad + '</p>')
                        ._('</div>')
                        ._('<a class="lovebox" data-collect="true" data-collect-flag="cctv7-meet-box-votebtn" data-collect-desc="投票页-盒子投票按钮"></a>')
                        ._('</li>');
                };
                $('.main .guest-box ul').html(t.toString());
                $('header').css('height', Math.round(me.windowHeight*0.35));
                $('.main .guest-box ul li').css('height', Math.round(me.windowHeight*0.40));
                $("#round2").addClass("none");
                $("#round1").removeClass("none");
            }else if(me.roundNum == 2){
                $(".u-header").attr("src",data.vi);
                $(".u-name").text(data.vt);
                $(".u-desc").html(data.vd);
                for (var i = 0; i < length; i ++) {
                    if(attrs[i].at == 1){
                        $(".r-support").attr("data-au",attrs[i].au);
                    }else{
                        $(".b-support").attr("data-au",attrs[i].au);
                    }
                }
                $("#round1").addClass("none");
                $("#round2").removeClass("none");
            }

			me.event_handler();
		},
		fill_result: function(data) {
			var me = this, t = simpleTpl(),
			attrs = data.attrs || [],
			length = attrs.length,
			sumCount = 0,
			sumPercent = 0,
			incolor = ['#d4c59c','#e79fc2','#a0dbde'],
			outcolor = ['#ebdebb','#ffd2e8','#d4f2f3'],
			percentcolor = ['rgba(218,113,0,.45)','rgba(255,0,124,.45)','rgba(0,133,140,.45)'];

			$('body').addClass('result');

			$('header').append('<style>header:before {background:url('+ data.vi +') no-repeat;background-size:100% auto;}</style>');
			$('.host-name').html(data.vt);
			$('.host-intro').html(data.vd);
			for (var i = 0; i < length; i ++) {
				sumCount += attrs[i].vn;
			}

			for (var i = 0; i < length; i ++) {
				var percent = (attrs[i].vn/sumCount * 100).toFixed(0);
				if(i == length-1){
					percent = (100.00 - sumPercent).toFixed(0);
				};
				var current_li = '.resulting .guest-box ul li:eq(' + i +')';
				$(current_li).css({
					'background': 'url(' + attrs[i].ai + ') no-repeat center center',
					'background-size': 'cover'
				});

				t._('<li data-au="'+ attrs[i].au + '" class="type' + attrs[i].at + '" style="background:url(' + attrs[i].ai + ') no-repeat center center;background-size:cover;">')
					._('<div class="guest-content">')
						._('<p>')
							._('<span class="guest-name">'+ attrs[i].an +'</span>')
						._('</p>')
						._('<p class="guest-intro">' + attrs[i].ad + '</p>')
					._('</div>')
					._('<a class="lovebox"></a>')
					._('<div class="tongji">')
						._('<canvas width="85" height="85" id="tj' + i + '" data-percent="' + percent + '" data-incolor="' + incolor[i] + '" data-outcolor="' + outcolor[i] + '" data-percentcolor="' + percentcolor[i] + '"></canvas>')
						._('<p class="tongji-count"><label>' + attrs[i].vn + '</label>票</p>')
					._('</div>')
				._('</li>');
				sumPercent += percent*1;
			};
			$('.resulting .guest-box ul').html(t.toString());
			$('.resulting .guest-box ul li').css('height', Math.round(me.windowHeight*0.40));

			if (me.roundNum == 1) {
				$('body').removeClass('round2').addClass('round1');
				$('.resulting li').each(function(index, el) {
					if ($(this).attr('data-au') == H.round.round1uuid) {
						$(this).find('.lovebox').addClass('lovebox_close');
					};
				});
			}

			me.event_handler();
		},
        fill_2_result:function(data){
            var me = this, t = simpleTpl(),
                attrs = data.attrs || [],
                length = attrs.length,
                sumCount = 0,
                sumPercent = 0;
            for (var i = 0; i < length; i ++) {
                sumCount += attrs[i].vn;
            }

            for (var i = 0; i < length; i ++) {
                var percent = (attrs[i].vn/sumCount * 100).toFixed(0);
                if(i == length-1){
                    percent = (100.00 - sumPercent).toFixed(0);
                };
                sumPercent += percent*1;
                if(attrs[i].at == 1){
                    $(".r-count").attr("style","width:"+percent+"%;");
                    $(".r-count").text(percent+"%");
                    if(percent == 0){
                        $(".r-count").addClass("none");
                    }
                }else{
                    $(".b-count").attr("style","width:"+percent+"%;");
                    $(".b-count").text(percent+"%");
                    if(percent == 0){
                        $(".b-count").addClass("none");
                    }
                }
            }
            $(".count").find("p").addClass("none");
            $(".progress").removeClass("none");
            $(".round2-btn").removeClass("none");
        },
		event_handler: function() {
			var me = this;
			$('.gored-btn').click(function(e) {
				e.preventDefault();
				setTimeout(function(){
					toUrl('yaoyiyao.html?wechat_card_js=1');
				}, 50);
			});

			$('.main .lovebox').click(function(e){
				e.preventDefault();
				H.round.round1uuid = $(this).parent().attr("data-au");
				getResult('meet/vote', {
					openid: openid,
					attrUuid: H.round.round1uuid
				}, 'meetVoteHandler',true,null,false);
				e.stopPropagation();
				return false;
			});

			$('.main li').click(function(e){
				e.preventDefault();
				H.round.round1uuid = $(this).attr("data-au");
				getResult('meet/vote', {
					openid: openid,
					attrUuid: H.round.round1uuid
				}, 'meetVoteHandler',true,null,false);
				e.stopPropagation();
				return false;
			});

			$('.r-support').click(function(e){
				e.preventDefault();
                if(H.round.round2uuid == null){
                    H.round.round2uuid = $(this).attr("data-au");
                    getResult('meet/vote', {
                        openid: openid,
                        attrUuid: H.round.round2uuid
                    }, 'meetVoteHandler',true,null,false);
                    e.stopPropagation();
                }
				return false;
			});
            $('.b-support').click(function(e){
                e.preventDefault();
                if(H.round.round2uuid == null){
                    H.round.round2uuid = $(this).attr("data-au");
                    getResult('meet/vote', {
                        openid: openid,
                        attrUuid: H.round.round2uuid
                    }, 'meetVoteHandler',true,null,false);
                    e.stopPropagation();
                }
                return false;
            });
		},
		tongji_canvas: function(target) {
			var canvas = document.getElementById(target);
			var ctx = canvas.getContext("2d");
			var fixRatio = window.devicePixelRatio || 1;
			var W = canvas.width / fixRatio;
			var H = canvas.height / fixRatio;
			var me = '#' + target;
			var percent = $(me).attr('data-percent') || 0;
			var incolor = $(me).attr('data-incolor') || '#d4c59c';
			var outcolor = $(me).attr('data-outcolor') || '#ebdebb';
			var percentcolor = $(me).attr('data-percentcolor') || 'rgba(255,0,0,.45)';
			var bgcolor = $(me).attr('data-bgcolor') || '#FFF';
			var fontcolor = $(me).attr('data-fontcolor') || '#000';
			var deg=0,new_deg=0,dif=0
			var loop,re_loop,text,text_w;


			
			
			function init(){
				ctx.clearRect(0,0,W,H);

				ctx.beginPath();
				ctx.arc(W/2,H/2,W/2-5,0,Math.PI*2,false);
				ctx.fillStyle = bgcolor;//填充颜色,默认是黑色
				ctx.fill();
				
				ctx.beginPath();
				ctx.strokeStyle = incolor;
				ctx.lineWidth = 16;
				ctx.arc(W/2,H/2,34,0,Math.PI*2,false);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.strokeStyle = outcolor;
				ctx.lineWidth = 12;
				ctx.arc(W/2,H/2,29,0,Math.PI*2,false);
				ctx.stroke();
				
				var r = deg*Math.PI/180;
				
				ctx.fillStyle = fontcolor;
				ctx.font="18px Arial";
				text = percent+"%";
				text_w = ctx.measureText(text).width;
				ctx.fillText(text,W/2 - text_w/2,H/2+7);

				ctx.beginPath();
				ctx.strokeStyle = percentcolor;
				ctx.lineWidth=20;
				// ctx.globalAlpha=0.45;
				ctx.arc(W/2,H/2,32,0-90*Math.PI/180,r-90*Math.PI/180,false);
				ctx.stroke();
				
				ctx.closePath();
			}
			function draw(){
				new_deg = Math.round((percent/100) * 360);
				dif = new_deg-deg;
				loop = setInterval(circle,800/dif);
			}
			function circle(){
				if(deg == new_deg){
					clearInterval(loop);
				}
				if(deg < new_deg){
					deg++;
				} else {
					clearInterval(loop);
				}
				init();
			}
			draw();
		}
	};
	
	W.meetVoteHandler = function(data){
		if (data.code == 0) {
            if(H.round.roundNum == 1){
                H.round.fill_result(data);
                H.round.tongji_canvas('tj0');
                H.round.tongji_canvas('tj1');
                H.round.tongji_canvas('tj2');
            }else if(H.round.roundNum == 2){
                H.round.fill_2_result(data);
            }
		} else { //data.code == 1 已经投过票或已经不能投票
			setTimeout(function(){
				toUrl('main.html');
			}, 50);
		}
	};
	
	W.meetInfoHandler = function(data){
		if (data.code == 0) {
			if (data.attrs[0].uv) {
				H.round.fill_data(data);
			} else {
				toUrl('yaoyiyao.html?wechat_card_js=1');
			}
		} else {
			toUrl('main.html');
		}
	};

})(Zepto);
$(function(){
	H.round.init();
});