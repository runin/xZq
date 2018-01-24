(function($) {
    H.vote = {
        $ul: $('ul'),
        uuid: '',
        init: function(){
            this.event();
            this.query_info();
            //this.ddtj();
        },
        //查询投票信息
        query_info: function(){
            getResult('api/voteguess/info', {yoi: openid}, 'callbackVoteguessInfoHandler', true);
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        event: function(){
            var me = this;
            me.$ul.delegate('li a.tp', 'click',function(e) {
                e.preventDefault();
                var me = $(this);

                if(me.parent().parent().siblings('div').find('a').hasClass('tped')){
                    return;
                }
                shownewLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/voteguess/guessplayer',
                    data: {
                        yoi : openid,
                        guid: $(this).attr('data-guid'),
                        pluids: $(this).attr('data-au')
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackVoteguessGuessHandler',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        if(data.code == 0){
                            me.removeClass('tp').addClass('tped').parent().parent().siblings('div').find('a').removeClass('tp').addClass('tped');
                            me.parent().siblings('label.label-img').addClass('zan rotate');
                        }else{
                            return;
                        }
                    },
                    error : function() {
                        return;
                    }
                });


            });
            me.$ul.delegate('li label.label-img', 'click',function(e) {
                $(this).siblings('span').find('a.tp').trigger('click');
            });
        },
        filter_info: function(data) {
            var me = this, t = simpleTpl(),
                attrs = data.items || [],
                newAttrs = [],time = 0;
            for(var i = 0,length = attrs.length; i < length; i++){
                if (attrs[i].ty == 1) {
                    newAttrs.push(attrs[i]);
                }else if(attrs[i].ty == 2){
                    $.fn.cookie("ty1Uuid-" + openid + "-"+time,attrs[i].pitems[0].pid,{expires:1});
                    time++;
                }
            };
            $.fn.cookie("time-" + openid,time,{expires:1});
            me.tpl(newAttrs);
        },
        tpl: function(data){
            var me = this, t = simpleTpl(),
                attrs = data || [],
                so = '',
                so_0 = '',
                so_1 = '',
                isVote = '';

                for(var i = 0,length = attrs.length; i < length; i++){
                isVote = typeof(attrs[i].so);
                if(isVote !='undefined'){
                    /*if(attrs[i].so == attrs[i].pitems[0].pid){
                        so_0 = 'tped';
                    }else{
                        so_0 = 'tp';
                    }

                    if(attrs[i].so == attrs[i].pitems[1].pid){
                        so_1 = 'tped';
                    }else{
                        so_1 = 'tp';
                    }*/
                    so = 'tped'
                }else{
                    so = 'tp';
                }

                so_0 = so || so_0;
                so_1 = so || so_1;
                t._('<li>')
                    ._('<div class="left">')
                        ._('<label class="label-img"><img src="'+ attrs[i].pitems[0].im +'"></label>')
                        ._('<span>')
                            ._('<label>'+ attrs[i].pitems[0].na +'</label>')
                            ._('<a class="'+ so +'" data-guid="'+ attrs[i].guid +'" data-au="'+ attrs[i].pitems[0].pid +'" data-collect="true" data-collect-flag="ldzyxcs-vote-tp" data-collect-desc="投票"></a>')
                        ._('</span>')
                    ._('</div>')
                    ._('<div class="center">')
                        ._('<img src="images/vote1.png">')
                    ._('</div>')
                    ._('<div class="right">')
                        ._('<label class="label-img"><img src="'+ attrs[i].pitems[1].im +'"></label>')
                        ._('<span>')
                            ._('<label>'+ attrs[i].pitems[1].na +'</label>')
                            ._('<a class="'+ so +'" data-guid="'+ attrs[i].guid +'" data-au="'+ attrs[i].pitems[1].pid +'"  data-collect="true" data-collect-flag="ldzyxcs-vote-tp" data-collect-desc="投票"></a>')
                        ._('</span>')
                    ._('</div>')
                ._('</li>')
            }
            me.$ul.html(t.toString());
        }
    };

    W.callbackVoteguessInfoHandler = function(data){
        var me = H.vote;
        if(data.code == 0){
            me.uuid = data.pid;
            $.fn.cookie("pid-"+openid,data.pid,7);
            me.filter_info(data);
        }else if(data.code == 1){
            return;
        }
    };
    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    };
})(Zepto);
$(function(){
    H.vote.init();
});