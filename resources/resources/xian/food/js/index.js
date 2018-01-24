/**
 * Created by Administrator on 2014/9/19.
 */

var addressUrl = null,page_var = $('.pages');
$(function() {
	var bottom_bg = $('.bottom-bg');


    isIphone(bottom_bg,true);

	$('.check-rule').on('click', function() {
		$('#tan-rule').removeClass('none');
        page_var.addClass('disabled');
	});

	$('.close').on('click', function() {
		$('.terms').addClass('none');
        page_var.removeClass('disabled');
	});
	var look = $('.look');
	var map = $('.map');
	var flag = true;
	look.on('click', function() {

		if (flag) {
            isIphone(bottom_bg,!flag);
			map.removeClass('none');
			look.text("点击关闭地址");
			var $img = $("#map").find("img");
			if ($img.attr("src") != addressUrl)
				$img.attr("src", addressUrl);
			flag = false;
		} else {
            isIphone(bottom_bg,!flag);
			look.text("点击查看地址");
			flag = true;
		}
	});

	showLoading();
	getResult('travel/enter/foodindex', {
		cuid : channelUuid,
		openid : openid,
		serviceNo : serviceNo
	}, 'callbackFoodEnterHander');


})

var items_id = [], page = 0, pageSize = 0, uuid = null, pageIndex;
window.callbackFoodEnterHander = function(data) {
	if (data.code == 0) {
		$('.dianzhao').empty().text(data.an);
		$('.logo').attr('src', data.lg);
		$('title').empty().text(data.t);
		uuid = data.id;
		var len = data.items,index = 0, sign_section = $('#sign-section');
		pageSize = len.length;
		for ( var i = 0, lens = len.length; i < lens; i++) {
			if (len[i].tp !== 3) {
				items_id.push(len[i].id);
				spellpercentHtml(index,sign_section);
				index++;
			} else {
                sign_section.removeClass("none");
			}
		}
        sign_section.addClass('sect' + (pageSize + 1));
		initParallax();
		if(pageSize != 0){
			if(len[0].tp == 3){
				bind_move();
                add_loadding(1);
				loadingSign();
			}else{
				bind_move();
                add_loadding(1);
				loading_page(0);
			}
		}
        page_var.parallax.drag = false;
		hideLoading();
	}
}

function spellpercentHtml(index,sign_section) {
	var t = simpleTpl();
	t._('<section class="bd-height page other-wrp dishes sect' + (index + 2) + '">')
		._('<div class="div-img">')
            ._('<div class="cate">')
                ._('<div class="cate-con">')
                ._('</div>')
            ._('</div>')
            ._('<footer class="u-arrow">')
                ._('<div class="upBtn none"></div>')
                ._('<div class="loading-btn"></div>')
                ._('<div class="copyright">页面由西安广播电视台提供</div>')
            ._('</footer>')
        ._('</div>')
     ._('</section>');
    sign_section.before(t.toString());
}

var pageArray = [];
function loading_page(p) {
	page = p  + 2;
	if ($.inArray(p, pageArray) == -1) {
		pageArray.push(p);
		getResult('travel/enterattr/fooddetail/' + items_id[p], {},
				'callbackFoodDetailHander');
	}
}

function callbackFoodDetailHander(data) {
	if (data.code == 0) {
		$('.sect' + page).find('.cate-con').empty().html(data.c);

		  var cateFlag =$('.sect'+page).find('.cate-con').height() >$('.cate').height() ? true : false;
        if(cateFlag){
              $('.dishes').on('touchmove',function(e){
                  unbind_move();
              });
             $('.sect'+page).find('.cate').on('touchmove',function(e){
                 bind_move();
                 e.stopPropagation();
             });
        }
		unbind_move();
		del_loadding(page-1);
	}
}

function initParallax() {

    page_var.parallax({
		direction : 'vertical', // horizontal (水平翻页)
		swipeAnim : 'default', // cover (切换效果)
		drag : true, // 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
		loading : false, // 有无加载页
		indicator : false, // 有无指示点
		arrow : false, // 有无指示箭头
		/*
		 * 翻页后立即执行 {int} index: 第几页 {DOMElement} element: 当前页节点 {String}
		 * directation: forward(前翻)、backward(后翻)、stay(保持原页)
		 */
		onchange : function(index, element, direction) {
			if (direction == 'forward') {
				if (index + 1 < pageSize) {
					loading_page(index);
				}
				if (index + 1 == pageSize) {
					loadingSign();
				}
			}
			setTimeout(function() {
				recordUserOperate(openid, "滑动切换页面", "food-section-" + index);
			}, 300);
		},
		/*
		 * 横竖屏检测 {String} orientation: landscape、protrait
		 */
		orientationchange : function(orientation) {
			// console.log(orientation);
		}
	});
}

function bind_move() {
    page_var.addClass("disabled");
}
function unbind_move() {
    page_var.removeClass("disabled");
}
function isIphone(bottom_bg,in_load){
    if(window.screen.height==480){
        if(in_load){
            bottom_bg.removeClass('bottom-zhan').addClass('bottom-shou');
        }else{
            bottom_bg.removeClass('bottom-shou').addClass('bottom-zhan');
        }

    }else if(window.screen.height==568 || (799 < window.screen.height  && window.screen.height < 961)){
        if(in_load){
            bottom_bg.removeClass('bottom-zhan').addClass('bottom-iph5');
        }else{
            bottom_bg.removeClass('bottom-iph5').addClass('bottom-zhan');
        }
    }else{
        if(in_load){
            bottom_bg.removeClass('bott-int');

        }else{
            bottom_bg.addClass('bott-int');
        }

    }
}


function del_loadding(page){
	$(".sect"+page).find(".loading-btn").hide();
    $(".sect"+page).find(".upBtn").removeClass('none');
}

function add_loadding(page) {
	if($(".sect"+page).find(".loading-btn").html() == ''){
        var t= spellLoading("small");
	    $(".sect"+page).find(".loading-btn").append(t.toString());
	}else{
		$(".sect"+page).find(".upBtn").addClass('none');
		$(".sect"+page).find(".loading-btn").show();
	}
}