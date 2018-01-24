+(function() {
    var index = {
        initParam: function() {
            this.$main = $(".main");
            this.$popwin = $(".popwin");
            this.$pop_btn = $(".pop_btn");
            this.$money = $("#money"); //金额
            this.$redNum = $("#redNum"); //红包个数
            this.$question = $("#question"); //问题
            this.$correct_answer = $("#correct_answer"); //正确答案
            this.$error_answer1 = $("#error_answer1"); //错误答案
            this.$error_answer2 = $("#error_answer2"); //错误答案
            this.$error_answer3 = $("#error_answer3"); //错误答案
            this.$submitBtn = $(".submitBtn"); //按钮
            this.$popwin = $(".popwin"); //弹框
            this.$share = $(".share");
            this.$red_type = $(".red_type");
            this.$red_type.data("type", 0); //1为普通红包 0为拼手气红包
            this.$moneytext = $("#moneytext"); //金额的描述
            if (window.headimgurl) {
                $(".pop_hear").css({
                    'background-image': 'url(' + window.headimgurl + ')',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'background-size': 'contain'
                });
            }
            window.index_fromms = getQueryString("fromms");
            window.index_rid = getQueryString("rid");
            window.index_qc = getQueryString("qc");
            window.index_obj = index;

            this.$subject = $(".subject");
        },
        initEvent: function() {
            this.$submitBtn.click(function() {
                if (!$(this).hasClass("submitBtn_sure")) {
                    return false;
                }
                var m = index.$money.val();
                var n = index.$redNum.val();
                if (m < 1) {
                    showTips("金额必须大于等于1");
                    return false;
                }
                if (parseInt(m) > 200) {
                    showTips("金额必须小于等于200");
                    return false;
                }
                if (parseInt(n) > parseInt(m)) {
                    showTips("红包金额要大于等于红包个数哦");
                    index.$money.val("");
                    return false;
                };
                if (!$(this).hasClass("submitBtn_sure")) {
                    return false
                }
                var q = index.$question.val();
                window.qc = q;
                var ra = index.$correct_answer.val();
                var wa = "";
                var wa1 = index.$error_answer1.val();
                var wa2 = index.$error_answer2.val();
                if (wa1) {
                    wa = wa1;
                }
                if (wa2) {
                    wa = wa2;
                    if (wa1) {
                        wa = wa1 + "," + wa2;
                    }
                }
                var ta = index.$money.val();
                var rt = index.$red_type.data("type");
                var tn = index.$redNum.val();
                //调试
                // index.$popwin.removeClass("none");

                loadData({
                    url: domain_url + "api/redpack/submit",
                    callbackRedpackSubmitHandler: function(data) {
                        if (data && data.code == 0) {
                            var rid = data.rid; //红包id
                            window.rid = rid;
                            loadData({
                                url: domain_url + "api/redpack/pay/unifiedorder",
                                callbackUnifiedorderHandler: function(data) {
                                    if (data.code == 0) {
                                        var nonce_str = data.nonce_str;
                                        var prepay_id = data.prepay_id;
                                        var time_stamp = data.time_stamp;
                                        var sign_type = data.sign_type;
                                        var paySign = data.paySign;
                                        var appid = data.appid;
                                        WeixinJSBridge.invoke('getBrandWCPayRequest', {
                                            "appId": appid, // 公众号名称，由商户传入
                                            "timeStamp": time_stamp, // 时间戳
                                            "nonceStr": nonce_str, // 随机串
                                            "package": "prepay_id=" + prepay_id, // 扩展包
                                            "signType": sign_type, // 微信签名方式:md5
                                            "paySign": paySign // 微信签名
                                        }, function(res) {

                                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                                setTimeout(function() {
                                                    index.$popwin.removeClass("none");
                                                    setTimeout(function() {
                                                        index.$share.removeClass("none");
                                                    }, 1000)
                                                    $("body").get(0).offsetWidth;
                                                }, 500);
                                                if (window.indexShareFn) {
                                                    window.indexShareFn(rid, window.nickname, window.qc);
                                                }
                                            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {

                                            } else if (res.err_msg == "get_brand_wcpay_request:fail") {

                                            }
                                        });
                                    } else {
                                        if (data.message) {
                                            showTips(data.message);
                                        } else {
                                            showTips("支付失败code=3");
                                        }
                                    }
                                },
                                data: {
                                    rid: rid, //  红包id，必填
                                    op: openid, //  用户openid，必填
                                    cop: window.codeOpenid, // 用户codeopenid，必填
                                    ou: businessId //  运营商id，必填
                                },
                                error: function() {
                                    showTips(" 支付失败code=0");
                                }
                            });
                        } else {
                            showTips("抱歉请稍后再试code=5");
                            return;
                        }
                        if (data && data.status == 1) {
                            showTips("单个红包金额小于 一元");
                            return;
                        }
                        if (data && data.status == 2) {
                            showTips("混淆答案格式不对");
                            return;
                        }
                        if (data && data.status == 3) {
                            showTips("问题或答案存在敏感词");
                            return;
                        }
                        if (data && data.status == 4) {
                            showTips("单个红包金额大于200元");
                            return;
                        }
                    },
                    data: {
                        ou: businessId, // 运营商id，必填 
                        op: openid, // 用户openid，必填 
                        cop: window.codeOpenid, // 加密后的用户openid，必填 
                        q: encodeURIComponent(q), // 提问问题，必填 
                        ra: encodeURIComponent(ra), // 正确答案，必填 
                        wa: encodeURIComponent(wa), //错误答案，多个用,隔开，必填 
                        ta: ta * 100, // 红包总额，必填 
                        rt: rt, // 红包类型, 0为随机 1为定额，必填 
                        tn: tn // 红包个数，必填 
                    }
                });
            });
            this.$pop_btn.click(function() {
                index.$share.removeClass("none");
                $(this).addClass("pop_btn_a");
                this.addEventListener('webkitAnimationEnd', function() {
                    index.$pop_btn.removeClass("pop_btn_a");
                });
            });
            this.$share.click(function() {
                $(this).addClass("none");
                // index.$pop_btn.removeClass("pop_btn_a");
            });
            this.$red_type.click(function() {
                if ($(this).data("type") == 0) { //普通红包
                    $(this).data("type", 1);
                    $(this).html('<span>当前是普通红包,</span><span class="ping_hand">改为拼手气红包</span>');
                    index.$moneytext.html("单个金额");
                } else { //拼手气红包
                    $(this).data("type", 0);
                    $(this).html('<span>当前是拼手气红包,</span><span class="ping_hand">改为普通红包</span>');
                    index.$moneytext.html("红包总额");
                }
            });

            { //随机题库 
                var subarr = [];
                loadData({
                    url: domain_url + "api/redpack/templateQuestion",
                    callbackTemplateQuestionHandler: function(data) {


                        //调试
                       // var data = { "code": 0, "items": [{ "q": "222", "ra": "3333", "wa": "test,sdf" }, { "q": "1", "ra": "2", "wa": "3" }, { "q": "1", "ra": "2", "wa": "" }, { "q": "1", "ra": "2", "wa": "3" }, { "q": "2222", "ra": "3333", "wa": "" }, { "q": "三十三", "ra": "2222", "wa": "333,444,999" }, { "q": "222", "ra": "3333", "wa": "4444,5555" }] }
                        if (data.code == 0) {
                            for (var i = 0; i < data.items.length; i++) {
                                var item = {};
                                item.q = data.items[i].q;
                                item.ra = data.items[i].ra;
                                item.errs = [];
                                if (data.items[i].wa.split(',').length > 0) {
                                    item.errs = data.items[i].wa.split(',');
                                }
                                subarr.push(item);
                            }  
                            if(subarr.length>0){
                               setSubject();
                            }

                        } else {
                           // showTips("抱歉请稍后再试code=10");
                        }
                    },
                    data: {
                        op: openid, //用户openid，必填
                        cop: codeOpenid, //用户codeopenid，必填
                        pa: 1, //页数，默认为1
                        ps: 50
                    },
                    showload: false
                });

                index.$question.click(function() {
                    if (index.$question.data("issub")) {
                        // index.$question.val("");
                        // index.$correct_answer.val("");
                        // index.$error_answer1.val("");
                        // index.$error_answer2.val("");


                        index.$question.data("issub", false);
                    }
                });

                function setSubject() {
                    index.$question.val("");
                    index.$correct_answer.val("");
                    index.$error_answer1.val("");
                    index.$error_answer2.val("");
                    if (subarr.length == 0) {
                        showTips("抱歉暂时没有题目");
                        return;
                    }
                    var inx = parseInt(Math.random() * ((subarr.length - 1) - 0 + 1) + 0, 10);
                    index.$question.val(subarr[inx].q);
                    index.isSelectQuestion =true;
                    index.$correct_answer.val(subarr[inx].ra);
                    if (subarr[inx].errs[0]) {
                        index.$error_answer1.val(subarr[inx].errs[0]);
                    }
                    if (subarr[inx].errs[1]) {
                        index.$error_answer2.val(subarr[inx].errs[1]);
                    }
                    if (checkFinish()) {
                        index.$submitBtn.addClass("submitBtn_sure");
                    } else {
                        index.$submitBtn.removeClass("submitBtn_sure");
                    }
                }
                this.$subject.click(function() {

                    var img = $(this).find("img");
                    if (img.hasClass("turnt")) {
                        img.removeClass("turnt");
                    }
                    img.addClass("turnt");
                    setTimeout(function() {
                        index.$subject.find("img").removeClass("turnt");
                    }, 500);
                    setSubject();
                    return false;
                });
                this.$question.click(function(){ 
                    if(index.isSelectQuestion){
                        index.$question.val("");
                        index.$correct_answer.val("");
                        index.$error_answer1.val("");
                        index.$error_answer2.val("");
                        index.isSelectQuestion =false;
                    }
                });
            }
            function checkFinish() {
                var tag = true;
                var n = index.$redNum.val();
                if (!/^[1-9]\d*$/.test(n)) {
                    index.$redNum.val("");
                    tag = false;
                }
                var m = index.$money.val();
                if (isNaN(m)) {
                    index.$money.val("");
                    tag = false;
                }
                if (!$.trim(m)) {
                    tag = false;
                }
                if (!$.trim(index.$question.val())) {
                    tag = false;
                }
                if (!$.trim(index.$correct_answer.val())) {
                    tag = false;
                }
                if ($.trim(index.$error_answer1.val()) || $.trim(index.$error_answer2.val())) {

                } else {
                    tag = false;
                }
                return tag;
            }
            $("input").bind("keyup", function() {
                if (checkFinish()) {
                    index.$submitBtn.addClass("submitBtn_sure");
                } else {
                    index.$submitBtn.removeClass("submitBtn_sure");
                }
            });
        },
        init: function() {
            index.initParam();
            index.initEvent();
        }
    };
    index.init();
})(Zepto);
