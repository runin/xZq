(function($) {

    H.home = {
        $btn_join: $(".join-box"),
        $figureScanf: $(".figure-scanf"),

        init: function() {
            this.eventHander();
            this.indexLoad();
        },
        eventHander: function() {
            var that = this;
            this.$btn_join.on("touchstart", function() {
                that.$figureScanf.css("opacity", "1").animate({
                    height: "80px"
                }, "linear", function() {
                    that.$figureScanf.animate({ height: "0px" }, "linear", function() {
                        toUrl("./menu.html");
                    })
                });
            });
        },
        indexLoad:function()
        {
    
                $('.tv-theme').addClass("index-flowcenter");
                setTimeout(function()
                {
                    $('.tv-theme').removeClass("index-flowcenter");
                }, 1000);
        }   

    }
    H.home.init();
})(Zepto);
