(function($) {
    H.rank = {
        init: function(){
            this.event();
            this.rank();
        },
        rank: function(){
            getResult('api/voteguess/getplayersp/'+getQueryString('pid'),{}, 'callbackVoteguessAllSupportPlayerHandler', true);
        },
        event: function(){
            var me = this;
            $('.back-home').click(function(e){
                e.preventDefault();
                toUrl('index.html');
            });
        },
        swap: function(i, j,itema)
        {
            var temp = itema[i];
            itema[i] = itema[j];
            itema[j] = temp;
        },
        bubbleSort: function(itema)
        {
            var me = H.rank;
            for (var i = itema.length - 1; i > 0; --i)
            {
                for (var j = 0; j < i; ++j)
                {
                    if (itema[j].cunt < itema[j + 1].cunt) {
                        me.swap(j, j + 1,itema);
                    }
                }
            }
        },
        tpl: function(data){
                var me = H.rank, t = simpleTpl();
                attrs = data.items || [],
                sum = 0;
                me.bubbleSort(attrs);
                for(var i = 0,length = attrs.length; i < length; i++){
                    t._('<span class="items" data-puid="'+ attrs[i].puid +'" data-id="id-'+ i +'">')
                        ._('<div class="progress">')
                            ._('<label class="after">'+ attrs[i].cunt +'</label>')
                            ._('<div class="progress-bar" data-vn="'+ attrs[i].cunt +'" style="height:0;"></div>')
                        ._('</div>')
                        ._('<label class="name">'+ attrs[i].name +'</label>')
                    ._('</span>');
                    sum += attrs[i].cunt;
                }

                $('.box').html(t.toString());
                me.resize();

            var max = 0,index = 0;
                for(var j = 0,length = attrs.length; j < length; j++){
                    if(max < attrs[j].cunt){
                        max = attrs[j].cunt;
                        index = j;
                    }
                }
                setTimeout(function(){
                    for(var j = 0,length = attrs.length; j < length; j++){
                        if(j == index){
                            $('.progress-bar').eq(j).animate({
                                'height': '130px'
                            }, 350);
                        }else{
                            $('.progress-bar').eq(j).animate({
                                'height': attrs[j].cunt/(max/130) + 'px'
                            }, 350);
                        }
                    }
                },500);
        },
        resize: function(){
            var boxWin = $('section').width();
            $('.items').css({
                'width': Math.ceil((boxWin-9*8)/8)
            });
        }
    };

    W.callbackVoteguessAllSupportPlayerHandler = function(data){
        if(data.code == 0){
            var attr = data.items,
                alength = attr.length;
            for(var i = 0; i < alength; i++){
                for(var j = 0,length = parseInt($.fn.cookie("time-" + openid)); j < length; j++){
                    if(attr[i].puid == $.fn.cookie("ty1Uuid-" + openid + "-"+j)){
                        attr.splice(i,1);
                        i--;
                        alength --;
                        break;
                    }
                }
            }
            H.rank.tpl(data);
        }else{
            return;
        }
    }
})(Zepto);
$(function(){
    H.rank.init();
});
