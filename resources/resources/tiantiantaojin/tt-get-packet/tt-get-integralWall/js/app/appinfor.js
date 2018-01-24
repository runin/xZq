(function($) {
    H.appinfor = {
            $height:$(window).height(),
            $width:$(window).width(),

            init:function()
            {
                var me = this;
                me.event();
            },
            event:function()
            {
                $('#app-download').delegate('.tag','click',function(e){
                     e.preventDefault();
                    $('#app-download').addClass("none"); 
                });
            }
        }
})(Zepto);

