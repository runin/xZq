(function ($) {

    H.loader = {
        $loadingBar: $('#loading_bar'),

        init: function(){
         	this.resize();  
            $.html5Loader({
                stopExecution:true,
                filesToLoad:'./js/files-tmp.js',
                onUpdate: function(perc){
                    // H.loader.$loadingBar.text('加载中(' + perc + '%)');
                },
                onComplete: function(){
                    H.loader.$loadingBar.text('');
                    H.loader.finish();
                }
            });
        },

        finish: function(){
            setTimeout(function(){
                H.router.init();
            }, 2500);
        },

        resize: function(){
            var width = $(window).width();
            var height = $(window).height();

        	$('#cover .cover-top').css({
        		'width': width,
        		'height': height * 0.5,
                'background-size': width + 'px ' + height * 0.5 + 'px'
        	});

            $('#cover .cover-bottom').css({
                'width': width,
                'height': height * 0.5 + 1,
                'background-size': width + 'px ' + (height * 0.5 + 1) + 'px'
            });

            $('#page_wrapper').css({
                'width': 2 * width
            });

            $('#index').css({
                'width': width,
                'height': height,
                'background-size': width + 'px ' + height + 'px'
            });

            $('#yao').css({
                width : width,
                height : height
            });

            $('#cover').removeClass('none');

            $('.my-avatar').attr('src', headimgurl);
            $('.my-nickname').text(nickname ? nickname : '匿名');
            $('.can-tap').bind('touchstart',function(){
                $(this).addClass('taped');
            });

            $('.can-tap').bind('touchend',function(){
                $(this).removeClass('taped');
            });

             
        }
    };

    $(function(){
        H.loader.init();
    })

})(Zepto);