(function($){
    H.sharego = {
        cu: getQueryString("cu"),
          init: function(){
              this.event();
              this.getCard();
          },
        getCard: function(){
            getResult("api/ceremony/greetingcard/get", {cu: H.sharego.cu}, "callbackCardInfoHandler");
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        event: function(){
            var me = H.sharego;
            $('#btn-cy').tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("index.html");

            });
            $(".check-bottom").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                $('#btn-cy').trigger('tap');
            });
            $("#btn-see").tap(function(e){
                e.preventDefault();
                $(".not-chai").addClass('bounceOutDown');

                setTimeout(function(){
                    $(".not-chai").addClass("none").removeClass("bounceOutDown");
                    $(".check").removeClass('none').addClass("bounceInUp");
                    setTimeout(function() {
                        $(".check").removeClass("bounceInUp");
                    }, 1000);
                }, 1000);
            });

            $('.triangle-right').tap(function(e) {
                e.preventDefault();
                var $tg = $(this),
                    $audio = $(this).find('audio');
                if ($tg.hasClass('scale')) {
                    $audio.get(0).pause();
                    $tg.removeClass('scale');
                    return;
                }
                $tg.addClass('scale');
                $audio.get(0).play();
                $audio.on('playing', function() {
                    console.log('playing');
                }).on('ended', function() {
                    $audio.get(0).pause();
                    $tg.removeClass('scale');
                });
            });
          },
        update: function(data){
            $('#self-img img').attr("src", data.hi ? (data.hi + '/' + yao_avatar_size): './images/avatar.png');
            $("#mywish").text(data.gt || "金猴圆梦万家欢");

            $.each(cards.gitems, function(i, item){
                $.each(item.items, function(j, jtem){
                    if(jtem.uid == data.sn){
                        $('#mx-img img').attr("src", jtem.is);
                        $('audio').attr('src', (jtem.mu || ''));
                        $('audio').on('loadedmetadata', function() {
                            $(this).siblings(".duri").text(Math.ceil($(this).get(0).duration) + "'");
                        });
                    }
                });
            });
          }
        };
    W.callbackCardInfoHandler = function(data){
        if(data.result){
            H.sharego.update(data);
        }
    }
})(Zepto);
$(function(){
    H.sharego.init();
});
