(function($) {
   H.common = 
   {
        init:function()
        {     
            this.event();
        },
        event:function()
        {
            //底部菜单添加背景
            $(".fix-tab-div a").each(function(e)
            {   
                $(this).click(function(e)
                {
                    e.preventDefault();
                    $(".icon-bg").addClass("none");
                    $(this).find('.icon-bg').removeClass("none");
                });
            });
        }
   }
})(Zepto);

$(function() {
    H.common.init();
});
