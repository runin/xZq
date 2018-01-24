(function ($) {

    H.index = {
    	coverRatio: 1242 / 1784,
    	coverBtnTopRatio: 1415 / 1784,
    	coverBtnHeightRatio: 124 / 1784,
    	coverBtnRatio: 361 / 124,

        $cover: $('.index-cover'),
    	$btn: $('#cover_btn'),
        $page: $('#page_cover'),
        

        init: function () {
        	this.resize();
            this.bindBtn();
            this.initAd();
        },

        initAd: function(){
            getResult('api/ad/get', {areaNo : W.adid}, 'callbackAdGetHandler');
        },

        fillAd: function(data){
            if(data.ads.length > 0){
                var url = data.ads[0].p;
                imgReady(data.ads[0].p, function(){
                    setTimeout(function(){
                        $('#cover').attr('src', url).removeClass('transparent');    
                    }, 2000);
                    
                });
            }
        },

        bindBtn: function(){
            this.$btn.tap(function(){
                $('.pager-wrapper').removeClass('none');
                $('#page_cover').css({
                    '-webkit-transform': 'translate(0px, 40px)',
                    'transform': 'translate(0px, 40px)',
                    'opacity': '0'
                });
                setTimeout(function(){
                    $('#page_cover').addClass('none');
                    H.router.to('vote');
                }, 1000);
                
            });
        },

        resize: function(){
            var width = $(window).width();
            var height = $(window).height();

            var btnTop = width / this.coverRatio * this.coverBtnTopRatio;
            var btnHeight = width / this.coverRatio * this.coverBtnHeightRatio;
            var btnWidth = btnHeight * this.coverBtnRatio;
            var btnLeft = (width - btnWidth) / 2;
            
            this.$btn.css({
            	width: btnWidth,
            	height: btnHeight,
            	top: btnTop,
            	left: btnLeft,
            	'line-height': btnHeight + 'px'
            }).removeClass('none');

            this.$cover.css({
                height: width / this.coverRatio
            });

          

            $('.pager').css({
                width : width
            });

            $('.pager-wrapper').css({
                width : width
            });

            $('.pager-slide').css({
                width : 3 * width
            });

            $('#page_cover').css({
                height: height,
                width: width
            })
        }
    };

    W.callbackAdGetHandler = function(data){
        if(data.code == 0){
            H.index.fillAd(data);
        }else{
            
        }
    };

    $(function(){
        H.index.init();
    });

})(Zepto);