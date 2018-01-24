(function ($) {

    H.rule = {
    	$dialogWrapper: $('#rule_dialog'),
    	$dialog: $('#rule_dialog .dialog'),
    	$list: $('#rule_dialog .rule-list'),
       
        init: function(){
        	this.resize();
        	this.bindBtns();
        },

        resize: function(){
        	var height = $(window).height();

        	var dialogHeight = height * 0.8;
        	H.rule.$dialog.css({
        		'top' : 0.1 * height,
        		'height' : dialogHeight
        	});

        	H.rule.$list.css({
        		'height' : dialogHeight - 10 - 49 
        	});

        },

        showDialog: function(){
            H.rule.$dialogWrapper.removeClass('none');
            H.rule.$dialog.addClass('transparent');
            setTimeout(function(){
                H.rule.$dialog.removeClass('transparent');
                H.rule.$dialog.addClass('fadeInUp');
            },100);
        },

        hideDialog: function(){
            H.rule.$dialog.removeClass('fadeInUp').addClass('fadeOutDown');
            setTimeout(function(){
                H.rule.$dialogWrapper.addClass('none');
                H.rule.$dialog.removeClass('fadeOutDown');
            }, 400);
        },

        bindBtns: function(){
        	var height = $(window).height();        	

        	$('#btn_rule_close').tap(function(){
        		H.rule.hideDialog();
                return false;
        	});

            $('#rule_btn').tap(function(){
                H.rule.showDialog();
                return false;
            });
        }
    };

   
    H.rule.init();

})(Zepto);