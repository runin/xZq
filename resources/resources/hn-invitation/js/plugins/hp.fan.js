/**
 * @author  : hahnzhu
 * @version : 0.2.2
 * @date    : 2014-09-28
 * @repository: https://github.com/hahnzhu/parallax.js
 */

if (typeof Zepto === 'undefined') { throw new Error('Parallax.js\'s script requires Zepto') }

!function($) {

//  'use strict';

    var startPos,           // ��ʼ������(X/Y����)
        endPos,             // ����������(X/Y����)
        stage,              // ���ڱ�ʶ onStart/onMove/onEnd ���̵ĵڼ��׶Σ���� onEnd �ظ�����
        offset,             // ƫ�ƾ���
        direction,			// ��ҳ����

        curPage, 			// page ��ǰҳ
        pageCount,          // page ����
        pageWidth,          // page ���
        pageHeight,         // page �߶�

        $pages,             // page �ⲿ wrapper
        $pageArr,           // page �б�
        $animateDom,		// �������� [data-animate] �Ķ���Ԫ��

        options,            // ����������

        touchDown = false,  // ��ָ�Ѱ��� (ȡ�������ƶ�ʱ transition ����)
        movePrevent = true; // ��ֹ���� (������������ָ���²�����ֹ)



    // ����ʵ������ (jQuery Object Methods)
    // ==============================

    $.fn.parallax = function(opts) {
        options = $.extend({}, $.fn.parallax.defaults, opts);

        return this.each(function() {
            $pages = $(this);
            $pageArr = $pages.find('.page');

            init();
        })
    }


    // ��������ѡ��
    // ==============================

    $.fn.parallax.defaults = {

        direction: 'vertical',  // ��������, "horizontal/vertical"
        swipeAnim: 'default',   // ����������"default/cover"
        drag: true,             // �Ƿ�����קЧ��
        loading: false,         // �Ƿ���Ҫ����ҳ
        indicator: false,       // �Ƿ�Ҫ��ָʾ����
        arrow: false,           // �Ƿ�Ҫ�м�ͷ
        onchange: function(){}, // �ص�����
        orientationchange: function(){}	// ��Ļ��ת

    };



    function init() {
    	
    	// ������ʾ����ͼ
    	if (options.loading) {
			$('.wrapper').append('<div class="parallax-loading"><i class="ui-loading ui-loading-white"></i></div>');
        } else {
        	// ����������
            movePrevent = false;
        }

		curPage 	= 0;
        isfirst_drap = true;
		direction	= 'stay';
        pageCount   = $pageArr.length;           	// ��ȡ page ����
        pageWidth   = $(window).width();         	// ��ȡ�ֻ���Ļ���
        pageHeight  = $(window).height();       	// ��ȡ�ֻ���Ļ�߶�
        $animateDom = $('[data-animation]');	 	// ��ȡ����Ԫ�ؽڵ�

        for (var i=0; i<pageCount; i++) {          // ������� data-id
            $($pageArr[i]).attr('data-id', i+1);
        }

        $pages.addClass(options.direction)		// ��� direction ��
            	.addClass(options.swipeAnim);  	// ��� swipeAnim ��

        $pageArr.css({                    		// ��ʼ�� page ���
            'width': pageWidth + 'px',
            'height': pageHeight + 'px'
        });

        options.direction === 'horizontal' ?     // ���� wrapper ���
            $pages.css('width', pageWidth * $pageArr.length) :
            $pages.css('height', pageHeight * $pageArr.length);


        if (options.swipeAnim === 'cover') {		// ���� page �Ŀ��(��Ϊ������Ч���� default ʵ�ַ�ʽ��Ȼ��ͬ)
            $pages.css({
                'width': pageWidth,
                'height': pageHeight
            });
            $pageArr[0].style.display = 'block'; // ����ͨ�� css �����壬��Ȼ�� Android �� iOS �»��� bug
        }


		if (!options.loading) {
            $($pageArr[curPage]).addClass('current');
            options.onchange(curPage, $pageArr[curPage], direction);
            animShow();
        }

        if (options.arrow) {
            $pageArr.append('<span class="parallax-arrow"></span>');
            //$($pageArr[pageCount-1]).find('.parallax-arrow').remove();
        }
    }



    // ��ָ��һ�ΰ���ʱ����
    // �ṩ�Ľӿڣ�
    //  1. ��ʼλ�� startPos
    // ==============================

    function onStart(e) {

        if (movePrevent === true) {
            event.preventDefault();
            return false;
        }
        
        touchDown = true;	// ��ָ�Ѱ���

        options.direction === 'horizontal' ? startPos = e.pageX : startPos = e.pageY;

        if (options.swipeAnim === 'default') {
            $pages.addClass('drag');    // ��ֹ����Ч��

            offset = $pages.css("-webkit-transform")
                        .replace("matrix(", "")
                        .replace(")", "")
                        .split(",");

            options.direction === 'horizontal' ?
                offset = parseInt(offset[4]) :
                offset = parseInt(offset[5]);
        }

        if ((options.swipeAnim === 'cover' && options.drag)) {
            $pageArr.addClass('drag');
        }

        stage = 1;
    }


    // �ƶ������е��ã���ָû�зſ���
    // �ṩ�Ľӿڣ�
    //  1. ʵʱ�仯�� endPos
    //  2. ��ӷ����� forward/backward
    // ==============================

    function onMove(e) {

        if(movePrevent === true || touchDown === false){
            event.preventDefault();
            return false;
        }
        event.preventDefault();
        options.direction === 'horizontal' ? endPos = e.pageX : endPos = e.pageY;

        addDirecClass();    // ��ӷ�����

        if (options.drag) { // ��קʱ����
            if(curPage === pageCount-1){
                isfirst_drap = false;
            }
            if (endPos >= startPos && curPage === 0 && isfirst_drap){
                return;
            }
            dragToMove();
        }
        stage = 2;
    }




    // ��ָ�ſ������
    // �ṩ�Ľӿڣ�
    //  1. �������������Ϣ endPos
    //
    // ִ�еĲ�����
    //  1����ҳ���λ��ǰ��һҳ����ԭλ��
    //  2��Ϊ indicator ��� current ��
    // ==============================

    function onEnd(e) {

        if (movePrevent === true || stage !== 2){
            // event.preventDefault();
            // return false;
        } else {
            touchDown = false;
            options.direction === 'horizontal' ? endPos = e.pageX : endPos = e.pageY;


            if (options.swipeAnim === 'default') {
                $pages.removeClass('drag');

                if (Math.abs(endPos-startPos) <= 50) {
                    animatePage(curPage);
                    direction = 'stay';
                }
                else if (endPos >= startPos) {
                    animatePage(curPage-1);
                    direction = 'backward';
                }
                else if (endPos < startPos) {
                    animatePage(curPage+1);
                    direction = 'forward';
                }
            }



            else if (options.swipeAnim === 'cover'){

                if (Math.abs(endPos-startPos) <= 50 && endPos >= startPos && options.drag) {
                    animatePage(curPage, 'keep-backward');
                    direction = 'stay';
                }
                else if (Math.abs(endPos-startPos) <= 50 && endPos < startPos && options.drag) {
                    animatePage(curPage, 'keep-forward');
                    direction = 'stay';
                }
                else if (Math.abs(endPos-startPos) > 50 && endPos >= startPos && options.drag) {
                    animatePage(curPage-1, 'backward');
                    direction = 'backward';
                }
                else if (Math.abs(endPos-startPos) > 50 && endPos < startPos && options.drag) {
                    animatePage(curPage+1, 'forward')
                    direction = 'forward';
                }
                else if (Math.abs(endPos-startPos) > 50 && endPos >= startPos && !options.drag) {
                    animatePage(curPage-1, 'backward');
                    direction = 'backward';
                }
                else if (Math.abs(endPos-startPos) > 50 && endPos < startPos && !options.drag) {
                    animatePage(curPage+1, 'forward')
                    direction = 'forward';
                }
            }


			if (options.indicator) {
                $($('.parallax-h-indicator ul li, .parallax-v-indicator ul li').removeClass('current').get(curPage)).addClass('current');
            }
            stage = 3;
        }
        
    }



    // ��קʱ����
    // ==============================

    function dragToMove() {

        if (options.swipeAnim === 'default') {

            var temp = offset + endPos - startPos;

            options.direction === 'horizontal' ?
                $pages.css("-webkit-transform", "matrix(1, 0, 0, 1, " + temp + ", 0)") :
                $pages.css("-webkit-transform", "matrix(1, 0, 0, 1, 0, " + temp + ")");
        }



        else if (options.swipeAnim === 'cover') {

            /*��ҳǰ����βҳ��*/
            if (endPos >= startPos && curPage === 0){
                curPage = pageCount;
            }else if(endPos <= startPos && curPage === pageCount-1){
                curPage = -1;
            }

            var temp      =  endPos - startPos,
                $prevPage = $($pageArr[curPage-1]),
                $nextPage = $($pageArr[curPage+1]);

            $($pageArr).css({'z-index': 0});

            if (options.direction === 'horizontal' && endPos >= startPos) {
                $prevPage.css({
                    'z-index': 2,
                    'display': 'block',
                    '-webkit-transform': 'translateX('+(temp-pageWidth) +'px)'
                })
            }
            else if (options.direction === 'horizontal' && endPos < startPos) {
                $nextPage.css({
                    'z-index': 2,
                    'display': 'block',
                    '-webkit-transform': 'translateX('+(pageWidth+temp) +'px)'
                })
            }
            else if (options.direction === 'vertical' && endPos >= startPos) {
                $prevPage.css({
                    'z-index': 2,
                    'display': 'block',
                    '-webkit-transform': 'translateY('+ (temp-pageHeight) +'px)'
                })
            }
            else if (options.direction === 'vertical' && endPos < startPos) {
                $nextPage.css({
                    'z-index': 2,
                    'display': 'block',
                    '-webkit-transform': 'translateY('+ (pageHeight+temp) +'px)'
                })
            }
        }
     
    }




    // ��ק���������
    // ==============================

    function animatePage(newPage, action) {

        curPage = newPage;

        if (options.swipeAnim === 'default') {

            var newOffset = 0;
            options.direction === 'horizontal' ?
                newOffset = newPage * (-pageWidth) :
                newOffset = newPage * (-pageHeight);

            options.direction === 'horizontal' ?
                $pages.css({'-webkit-transform': 'matrix(1, 0, 0, 1, ' + newOffset + ', 0)'}) :
                $pages.css({'-webkit-transform': 'matrix(1, 0, 0, 1, 0, ' + newOffset + ')'});

        }



        else if (options.swipeAnim === 'cover') {

            if (action === 'keep-backward' && options.drag) {
                $pageArr.removeClass('drag');
                options.direction === 'horizontal' ?
                $($pageArr[curPage-1]).css({'-webkit-transform': 'translateX(-100%)'}) :
                $($pageArr[curPage-1]).css({'-webkit-transform': 'translateY(-100%)'})
            }
            else if (action === 'keep-forward' && options.drag) {
                $pageArr.removeClass('drag');
                options.direction === 'horizontal' ?
                $($pageArr[curPage+1]).css({'-webkit-transform': 'translateX(100%)'}) :
                $($pageArr[curPage+1]).css({'-webkit-transform': 'translateY(100%)'})
            }
            else if (action === 'forward' && options.drag) {
                $pageArr.removeClass('drag');
                $($pageArr[curPage-1]).addClass('back'); // ����Ϊ���ڶ������������أ����漰 CSS �ж���Ķ���
                $pageArr[curPage].style.webkitTransform = 'translate(0, 0)';
            }
            else if (action === 'backward' && options.drag) {
                $pageArr.removeClass('drag');
                $($pageArr[curPage+1]).addClass('back');
                $pageArr[curPage].style.webkitTransform = 'translate(0, 0)';
            }
            else if (action === 'forward' && !options.drag) {
                $pages.addClass('animate');
                $($pageArr[curPage-1]).addClass('back');
                $($pageArr[curPage]).addClass('front').show();
            }
            else if (action === 'backward' && !options.drag) {
                $pages.addClass('animate');
                $($pageArr[curPage+1]).addClass('back');
                $($pageArr[curPage]).addClass('front').show();
            }

        }

        movePrevent = true;         // ���������в����ƶ�
        setTimeout(function() {
            movePrevent = false;
        }, 300);
    }





    // ��� forward / backward ״̬��
    // ==============================

    function addDirecClass() {
        if(options.direction === 'horizontal'){
            if (endPos >= startPos) {
                $pages.removeClass('forward').addClass('backward');
            } else if (endPos < startPos) {
                $pages.removeClass('backward').addClass('forward');
            }
        } else {
            if (endPos >= startPos) {
                $pages.removeClass('forward').addClass('backward');
            } else if (endPos < startPos) {
                $pages.removeClass('backward').addClass('forward');
            }
        }
    }





    // �ڵ�һҳ��ǰ����ĩҳǰ�󷭶�������
    // ==============================

    function isHeadOrTail() {
        if (options.direction === 'horizontal') {
            if ((endPos >= startPos && curPage === 0) ||
                (endPos <= startPos && curPage === pageCount-1)) {
                return true;
            }
        } else if ((endPos >= startPos && curPage === 0) ||
                (endPos <= startPos && curPage === pageCount-1)) {
            return true;
        }
        return false;
    }


    // ����������disabled class��ʱ�򣬽�ֹ��ҳ
	function isMoveDisabled() {
		return $pageArr.parent().hasClass('disabled');
	}


    // ��ǰҳ������ʾ
    // ==============================

    function animShow() {
        
        $animateDom.css({
        	'-webkit-animation': 'none',
        	'display': 'none'	// ������� Android ���� DOM ���Զ��ػ�� bug
        	});

        
        $('.current [data-animation]').each(function(index, element){
            var $element    = $(element),
                $animation  = $element.attr('data-animation'),
                $duration   = $element.attr('data-duration') || 500,
                $timfunc    = $element.attr('data-timing-function') || 'ease',
                $delay      = $element.attr('data-delay') ?  $element.attr('data-delay') : 0;


			if ($animation === 'followSlide') {
				
				if (options.direction === 'horizontal' && direction === 'forward') {
					$animation = 'followSlideToLeft';
				}
				else if (options.direction === 'horizontal' && direction === 'backward') {
					$animation = 'followSlideToRight';
				}
				else if (options.direction === 'vertical' && direction === 'forward') {
					$animation = 'followSlideToTop';
				}
				else if (options.direction === 'vertical' && direction === 'backward') {
					$animation = 'followSlideToBottom';
				}
				
			}

            $element.css({
//              '-webkit-animation': $animation +' '+ $duration + 'ms ' + $timfunc + ' '+ $delay + 'ms both',
				
				'display': 'block',
				
				// Ϊ�˼��ݲ�֧�ֱ��������ߵĶ�������Ҫ��д
				// �ϸ�ģʽ�²������������ͬ�����ԣ����Բ�����ȥ�� 'use strict'
				'-webkit-animation-name': $animation,
				'-webkit-animation-duration': $duration + 'ms',
				'-webkit-animation-timing-function': 'ease',
				'-webkit-animation-timing-function': $timfunc,
				'-webkit-animation-delay': $delay + 'ms',
				'-webkit-animation-fill-mode': 'both'
            })
        });
    }



    // �¼������
    // ==============================

    $(document)
        .on('touchstart', '.page', function(e) {
        	if (!isMoveDisabled()) {
        		onStart(e.changedTouches[0]);
        	}
        })
        .on('touchmove', '.page', function(e) {
        	if (!isMoveDisabled()) {
        		onMove(e.changedTouches[0]);
        	}
        })
        .on('touchend', '.page', function(e) {
        	if (!isMoveDisabled()) {
        		onEnd(e.changedTouches[0]);
        	}
        })
        .on('webkitAnimationEnd webkitTransitionEnd', '.pages', function() {

			if (direction !== 'stay') {
				setTimeout(function() {
	                $(".back").hide().removeClass("back");
	                $(".front").show().removeClass("front");
	                $pages.removeClass('forward backward animate');
	            }, 10);
	
	            $($pageArr.removeClass('current').get(curPage)).addClass('current');
	            options.onchange(curPage, $pageArr[curPage], direction);  // ִ�лص�����
	            animShow();
			}
            
        });

	
	$('.page *').on('webkitAnimationEnd', function() {
        event.stopPropagation();    // �¼������޷���ֹð�ݣ�����Ҫ��ȡ��
    })

    // ��ת��Ļ��ʾ
    // ============================== 
    
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
    	if (window.orientation === 180 || window.orientation === 0) {  
			options.orientationchange('portrait');
		}  
		if (window.orientation === 90 || window.orientation === -90 ){  
			options.orientationchange('landscape') 
		} 	
    }, false);



}(Zepto)