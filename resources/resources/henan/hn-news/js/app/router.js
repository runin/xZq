(function ($) {

    H.router = {
    	curUrl: 'cover',
        $pagerSlide: $('.pager-slide'),

        init: function(){
            
            // FIX ME 不支持pushState的情况
			window.addEventListener("popstate", function(e) {
                H.router.load();
			});
            
			H.router.load();
            
            H.router.initNav();
            
        },

        load: function(){
        	if(window.location.hash === "#" || window.location.hash === "") {
                H.router.to('cover');
		    }else{
		    	var hash = window.location.hash;
		    	hash = hash.substr(1, hash.length);
		    	H.router.show(hash);
		    }
        },

        to: function(url){
            history.pushState({}, '', location.href.split('#')[0] + '#' + url);
            H.router.show(url);
        },

        show: function(url){
            
            H.router.curUrl = url;
            
            if(url == 'cover'){
                $('#page_cover').removeClass('none');
                setTimeout(function(){
                     $('#page_cover').css({
                        '-webkit-transform': 'translate(0px, 0px)',
                        'transform': 'translate(0px, 0px)',
                        'opacity': '1'
                    });
                    $('.pager-wrapper').addClass('none');
                }, 10);
                
            }else{
                $('#page_cover').addClass('none');
                $('.pager-wrapper').removeClass('none');

                var width = $(window).width();
                window.scroll(0,0);
                
                H.router.$pagerSlide.css({
                    '-webkit-transform' : 'translate(' + -1 * $('#page_' + url).index() * width + 'px, 0)',
                    'transform' : 'translate(' + -1 * $('#page_' + url).index() * width + 'px, 0)'
                });
                
                if(url == 'comment'){
                    $('body').css({
                        'height': $(window).height()
                    });
                }else{
                    $('body').css({
                        'height': 'auto'
                    });
                }

                H.router.updateNav();

            }

            return false;
        },

        initNav: function(){
            $('#btn_comment').tap(function(){
                H.router.to('comment');
            });

            $('#btn_vote').tap(function(){
                H.router.to('vote');
            });

            $('#btn_disclose').tap(function(){
                H.router.to('disclose');

            });

            $('#btn_back').tap(function(){
                H.router.to('cover');
            });
        },

        updateNav: function(){
            $('.nav-item').removeClass('active');
            if($('#btn_' + H.router.curUrl).length > 0){
                $('#btn_' + H.router.curUrl).addClass('active');
            }
        }
    };

    H.router.init();

})(Zepto);