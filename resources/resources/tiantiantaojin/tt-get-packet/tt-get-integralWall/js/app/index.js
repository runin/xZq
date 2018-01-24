(function($) {
   H.index = 
   {
        init:function()
        {     
              $('#main').load('task.html',function()
                {
                    H.task.init(); 
                    H.appinfor.init();
                });
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

            $('#money-market').click(function(e)
            {
                $('#main').load('market.html',function()
                {
                        H.market.init();
                });
            });

            $('#task').click(function(e)
            {
                $('#main').load('task.html',function()
                {
                        H.task.init();
                        H.appinfor.init();
                });
            });

            $('#user').click(function(e)
            {
                $('#main').load('user.html',function()
                {
                        H.user.init();
                });
            })  
        }
   }
})(Zepto);

$(function() {
    H.index.init();
});
