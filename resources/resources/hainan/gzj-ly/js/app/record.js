;(function($) {
    H.record = {
        page: 1,
        pageSize: 5,
        time: 0,
        loadmore:  true,
        init: function() {
            this.event();
            this.getSleftList();
            var me = this, height = $(window).height(), width = $(window).width();
            $('body').css({
                'width': width,
                'height': height
            });
            $('.list').css({
                'height': height*0.8
            });
        },
        event: function(){
            var me = H.record;
            $('.back').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('index.html?yao=yao');
            });

            var range = 180, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;

            $(window).scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight  && me.page < maxpage && me.loadmore) {
                    me.getSleftList();
                }
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        //查询个人中奖记录
        getSleftList: function(){
            var me = H.record;
            getResult('api/lottery/record', {
                oi: openid,
                pt: '1,7',
                pn: me.page,
                ps : me.pageSize
            }, 'callbackLotteryRecordHandler', true);
            me.page ++;
        }
    };

    W.callbackLotteryRecordHandler = function(data){
        var me = H.record;
        if(data.result){
            var t = simpleTpl(),
                items = data.rl || [],
                len = items.length,
                lt = '',
                isShow = '';
            if (len < me.pageSize) {
                me.loadmore = false;
            }
            for (var i = 0; i < len; i ++) {
                t._('<li>');
                    if(items[i].pt == 7){
                        t._('<span><img src="images/kj.png"></span>');
                    }else if (items[i].pt == 1)(
                        t._('<span><img src="images/sw.png"></span>')
                    )
                    t._('<label><div>'+ items[i].pn +'</div></label>')
                ._('</li>');
            }
            $('ul').append(t.toString());
            $(".list").removeClass('none');
        }else{
            me.loadmore = false;
            if(me.time == 0){
                $('.tips').removeClass('none');
            }
        }
        me.time ++;
    };

})(Zepto);

$(function() {
    H.record.init();
});

/*var dataTest = {
    "result": true,
    "rl": [
        {
            "ru": "3890757eb5964ce49503ebf51041aacf",
            "pt": 1,
            "pn": "实物奖品",
            "su": 2,
            "pi": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/lottery/prize/images/20151216/edccf07dfd0b4cb493db7468b86f09f5.png",
            "ph": "15800158000",
            "rn": "快乐",
            "ad": "卡路里旅途了李东生咖啡",
            "ic": "",
            "rl": "",
            "pd": "小民送您红包，快打开看吧！",
            "cu": 0,
            "rp": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc5d930ea846a40e1&redirect_uri=http%3A%2F%2Fyaotv.holdfun.cn%2Fportal%2Fapi%2Flottery%2Frp%2Fcb%3Fparams%3D3890757eb5964ce49503ebf51041aacf%2Cnull%2Fyaoyiyao.html%2CojIzxt26ut_8llTKxDbnV2A8pxUU&response_type=code&scope=snsapi_base&state=123#wechat_redirect",
            "lt": "2015-12-23 17:15:52"
            },
        {
            "ru": "e5c33611cf2a46e9babf07d70645be68",
            "pt": 1,
            "pn": "实物奖品2",
            "su": 2,
            "pi": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/lottery/prize/images/20151216/edccf07dfd0b4cb493db7468b86f09f5.png",
            "ph": "15800158000",
            "rn": "快乐",
            "ad": "卡路里旅途了李东生咖啡",
            "ic": "",
            "rl": "",
            "pd": "小民送您红包，快打开看吧！",
            "cu": 0,
            "lt": "2015-12-23 17:15:41"
            },
        {
            "ru": "5dfdce268ce343eda2f07618e55cd101",
            "pt": 1,
            "pn": "实物奖品3",
            "su": 2,
            "pi": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/lottery/prize/images/20151216/edccf07dfd0b4cb493db7468b86f09f5.png",
            "ph": "15800158000",
            "rn": "快乐",
            "ad": "卡路里旅途了李东生咖啡",
            "ic": "",
            "rl": "",
            "pd": "小民送您红包，快打开看吧！",
            "cu": 0,
            "lt": "2015-12-23 17:15:34"
            },
        {
            "ru": "bf8291a3ea09491c90e2bf2a9c207bdb",
            "pt": 1,
            "pn": "iphone 6s（顺序7）",
            "su": 3,
            "pi": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/lottery/prize/images/20151015/1a2deb5cb1524a3c8af50ce511973c7e.png",
            "ph": "15800158000",
            "rn": "快乐",
            "ad": "卡路里旅途了李东生咖啡",
            "ic": "",
            "rl": "",
            "pd": "",
            "cu": 1,
            "lt": "2015-12-23 17:14:43"
            },
        {
            "ru": "1456f8bd88a4401c80c5cd849fb6909e",
            "pt": 1,
            "pn": "iphone 6s（顺序7）",
            "su": 3,
            "pi": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/lottery/prize/images/20151015/1a2deb5cb1524a3c8af50ce511973c7e.png",
            "ph": "15800158000",
            "rn": "快乐",
            "ad": "卡路里旅途了李东生咖啡",
            "ic": "",
            "rl": "",
            "pd": "",
            "cu": 1,
            "lt": "2015-12-23 17:14:37"
            },
            {
                "ru": "1456f8bd88a4401c80c5cd849fb6909e",
                "pt": 7,
                "pn": "微信卡劵",
                "su": 3,
                "pi": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/lottery/prize/images/20151015/1a2deb5cb1524a3c8af50ce511973c7e.png",
                "ph": "15800158000",
                "rn": "快乐",
                "ad": "卡路里旅途了李东生咖啡",
                "ic": "",
                "rl": "",
                "pd": "",
                "cu": 1,
                "lt": "2015-12-23 17:14:37"
            },
            {
                "ru": "1456f8bd88a4401c80c5cd849fb6909e",
                "pt": 7,
                "pn": "微信卡劵1",
                "su": 3,
                "pi": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/lottery/prize/images/20151015/1a2deb5cb1524a3c8af50ce511973c7e.png",
                "ph": "15800158000",
                "rn": "快乐",
                "ad": "卡路里旅途了李东生咖啡",
                "ic": "",
                "rl": "",
                "pd": "",
                "cu": 1,
                "lt": "2015-12-23 17:14:37"
            },
            {
                "ru": "1456f8bd88a4401c80c5cd849fb6909e",
                "pt": 7,
                "pn": "微信卡劵2",
                "su": 3,
                "pi": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/lottery/prize/images/20151015/1a2deb5cb1524a3c8af50ce511973c7e.png",
                "ph": "15800158000",
                "rn": "快乐",
                "ad": "卡路里旅途了李东生咖啡",
                "ic": "",
                "rl": "",
                "pd": "",
                "cu": 1,
                "lt": "2015-12-23 17:14:37"
            }
        ]
    };*/
