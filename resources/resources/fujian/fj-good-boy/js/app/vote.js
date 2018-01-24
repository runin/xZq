/**
 * 加油好少年--投票页
 */
(function($) {
    H.vote = {
        $ul: $('ul'),
        $count: $('.count'),
        $count_down: $('.count-down'),
        isPass: true,
        isStar: true, 
        isEnd: false,
        puid: 0,
        $applay_btn: $('.applay-btn'),
        init: function(){
            this.event();
            this.get_port();
            this.ddtj();
        },
        get_port: function(){
            getResult('vote/index', { openid: openid }, 'voteIndexHandler', true);
        },
        event: function(){
            var me = this;
            this.$ul.delegate('li', 'click', function(e){
                e.preventDefault();
                $(this).find('section').removeClass('none');
            }).delegate('.rule-close', 'click', function(e){
                e.preventDefault();
                $('section').addClass('none');
            }).delegate('.applay-btn', 'click', function(e){
                e.preventDefault();
                var num = $(this).closest('li').attr('data-uv'),
                    attr_uuid = $(this).closest('li').attr('data-au');
                $.fn.cookie("attrUuid-"+ openid, attr_uuid,{expires:1});

                if(!me.isStar){
                    //alert('投票未开始！');
                    return;
                }
                if(me.isEnd){
                    //alert('投票已结束！');
                    return;
                }

                if(num == 0 || !me.isPass){
                    //alert('投票次数已用完！');
                    return;
                }

                showLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'vote/vote',
                    data: {
                        openid: openid,
                        actUuid: me.puid,
                        attrUuid: attr_uuid,
                        uuid: $.fn.cookie("vu-"+ openid)
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'voteHandler',
                    complete: function() {
                        hideLoading();
                    },
                    success : function(data) {
                        if(data.code == 1){//失败
                            console.log($(this).attr('data-au'));
                            $(this).closest('li').find('.applay-btn').addClass('btn-disabled');          
                            return;
                        }else{//成功
                            if($(this).find('li').hasClass('disabled')){//已经抽过奖并且投票次数已经用完
                                $(this).find('.applay-btn').addClass('btn-disabled');
                                //alert('投票次数已用完！');
                            }else{
                                H.vote.get_port();
                                alert('投票成功！下面进行抽奖!');
                                toUrl('lottery.html?puid='+ me.puid);
                            }
                        }
                    }
                });
            });

        },
        tpl: function(data){
            var me = this, t = simpleTpl(),
                attrs = data.attrs || [];
            this.puid = data.actUid;
            $.fn.cookie("puid-"+ openid, me.puid,{expires:1});
            for(var i = 0,length = attrs.length; i < length; i++){
                //uv 本次活动剩余投票次数
                //up  该选项是否有抽过奖 true 抽过 false 没有
                var vote = attrs[i].uv > 0 ? '' : 'btn-disabled';
                    disabled = attrs[i].uv == 0 && attrs[i].up ? 'disabled' : '';

                t._('<li class="'+ disabled +'" data-au="'+ attrs[i].au +'" data-uv="'+ attrs[i].uv +'">')
                    ._('<img src="'+ attrs[i].ai +'" /><div>'+ attrs[i].an +'</div>')

                    ._('<section class="rule vote none" id="vote-'+ attrs[i].au +'">')
                        ._('<div class="rule-con">')
                            ._('<a class="rule-close" data-collect="true" data-collect-flag="fj-good-boy-vote-close" data-collect-desc="关闭按钮"></a>')
                            ._(' <div class="rule-data">'+ attrs[i].ad +'</div>')
                            ._('<a class="btn applay-btn '+ vote +'" data-collect="true" data-collect-flag="fj-good-boy-vote-vote" data-collect-desc="投票">投 票</a>')
                        ._('</div>')
                    ._('</section>')
                ._('</li>')
            }
            me.$ul.html(t.toString());
            this.fill_count_down(data);

            //"vf": false已经投过票
           /* var items = {
                "tm": "2015-04-02 09:00:35",
                "vt": [
                        {
                            "vb": "2015-04-02 09:00:01",
                            "ve": "2015-04-02 09:01:02",
                            "vf": true
                        },
                        {
                            "vb": "2015-04-02 10:00:01",
                            "ve": "2015-04-02 10:01:02",
                            "vf": true
                        },
                        {
                            "vb": "2015-04-02 11:00:01",
                            "ve": "2015-04-02 11:01:02",
                            "vf": true
                        }
                      ]
                };
            this.fill_count_down(items);*/
        },
        count_down: function(count) {
            this.$count.each(function(index) {
                var curr = new Date().getTime(),
                    before = curr - 1 * 60 * 60 * 1000,
                    after = curr + count,
                    stime = '',
                    etime = '';
                switch (index) {
                    case 0:
                        stime = before;
                        etime = after;
                        break;
                    case 1:
                        stime = curr - 60 * 1000;
                        etime = curr;
                        break;
                    case 2:
                        stime = after;
                        etime = after + 60 * 1000;
                        break;
                }
                $(this).attr('data-stime', stime).attr('data-etime', etime);
            });

            this.$count.countdown({
                stpl: '0',
                etpl: '<span class="state2">%H%: %M%: %S%</span>',
                otpl: '',
                callback: function(state) {
                    if(state === 3){
                        H.vote.isPass = true;
                        if(!H.vote.isEnd){
                            H.vote.get_port();
                        }else{
                            H.vote.$count_down.find('i').text('活动已结束');
                            H.vote.$count_down.find('label').empty();
                            H.vote.$applay_btn.addClass('btn-disabled');
                            H.vote.isEnd = true;
                        }
                    }
                }
            });
        },
        /*server_time1: function(time, serverTime1){
            var nowTime = Date.parse(new Date());
            if(nowTime > serverTime1){
                time += (nowTime - serverTime1);
            }else if(nowTime < serverTime1){
                time -= (serverTime1 - nowTime);
            }
            return count = time - nowTime;
            //return count = timestamp('2015-04-02 09:01:02') - serverTime1;
        },*/
        fill_count_down: function(data){
            var items = data.vt,
                len = items.length,
                nowTimeStr = data.tm,
                $applay_btn = $('.applay-btn');

            if(comptime(nowTimeStr,items[0].vb) > 0){
                this.$count_down.find('i').text('活动未开始');
                $applay_btn.addClass('btn-disabled');
                this.isStar = false;
                return;
            }
            if(comptime(items[len-1].ve,nowTimeStr) > 0){
                this.$count_down.find('i').text('活动已结束');
                $applay_btn.addClass('btn-disabled');
                H.vote.isEnd = true;
            }

            for(var i = 0; i < len; i++){
                
                var endTimeStr = items[i].ve,
                    begTimeStr = items[i].vb;
                $.fn.cookie("vu-"+ openid, items[i].vu,{expires:1});//活动时间段uuid
                if(comptime(nowTimeStr, begTimeStr) > 0){
                    $applay_btn.addClass('btn-disabled');
                    this.isPass = false;
                    this.$count_down.find('i').text('距离下轮开始还有：');
                    //this.count_down(this.server_time1(timestamp(begTimeStr), timestamp(nowTimeStr)));
                    this.count_down(timestamp(begTimeStr) - timestamp(nowTimeStr));
                    return;
                } else if( comptime(nowTimeStr, endTimeStr) > 0 && !H.vote.isEnd){
                    if(!items[i].vf){
                        $applay_btn.addClass('btn-disabled');
                        this.isPass = false;
                    }else{
                        $applay_btn.removeClass('btn-disabled');
                        this.isPass = true;
                    }
                    this.$count_down.find('i').text('距离本轮结束还有：');
                    //this.count_down(this.server_time1(timestamp(endTimeStr), timestamp(nowTimeStr)));
                    this.count_down(timestamp(endTimeStr) - timestamp(nowTimeStr));
                    return;
                }

            }
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.voteIndexHandler =function(data){
        //code == 3----活动结束
        //code == 4----当天投票次数结束
        //code == 6----活动未开始
        if(data.code == 0 || data.code == 4 || data.code == 3 || data.code == 6){
            H.vote.tpl(data);
        }
    };

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    };
})(Zepto);
$(function(){
    H.vote.init();
});