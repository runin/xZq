// JavaScript Document
$(function() {
    var N = {
        showPage: function (pageName, fn, pMoudel) {
            var mps = $(".page");
            mps.addClass("none");
            mps.each(function (i, item) {
                var t = $(item);
                if (t.attr("id") == pageName) {
                    t.removeClass("none");
                    N.currentPage = t;
                    if (fn) {
                        fn(t);
                    };
                    return false;
                }
            });
        },
        loadData: function (param) {
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", jsonp: "callback", showload: true }, param);
            if (p.showload) {
                W.showLoading();
            }
            var connt = 0;
            var cbName = "";
            var cbFn = null;
            for (var i in param) {
                connt++;
                if (connt == 2) {
                    cbName = i;
                    cbFn = param[i];
                    break;
                }
            }
            if (cbName && cbFn && !W[cbName]) { W[cbName] = cbFn; }
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonp: p.jsonp, jsonpCallback: cbName,
                success: function () {
                    W.hideLoading();
                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                }
            });
        },
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());

        }
    };
	
    N.module("record", function(){
		
        var recordList = {
            $notRecord: $(".not-record"),
            $recordBox: $(".record-box"),
            $recordId: $("#record-list"),
            recordFn: function() {
                var that = this;
                var t = simpleTpl();
                N.loadData({url: domain_url+'api/lottery/record',callbackLotteryRecordHandler:function(data) {
                    var rl= data.rl;
                    if(rl && data.result == true) {
                        for(var i =0; i<rl.length; i++) {
                            t._('<li>')
                                t._('<span class="gift_boxes"></span>')
                                t._('<h2>'+rl[i].lt+'</h2>')
                                t._('<div class="record-name">')
                                    t._('<p>'+rl[i].pn+'</p>')
                                    if(rl[i].cc) {
                                        t._('<p>'+rl[i].cc+'</p>')
                                    }
                                t._('</div>')
                            t._('<li>')
                        }
                        that.$recordId.html(t.toString());
                        that.$recordBox.removeClass("none");
                    }else {
                        that.$notRecord.removeClass("none");
                    }
                    
                },data:{
                    oi: openid
                }});
            }
        };
        this.init = function() {
            recordList.recordFn();
        };
        this.init();
    });
})