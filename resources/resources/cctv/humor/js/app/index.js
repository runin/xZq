(function ($) {
    window.last_index = 0;
    H.index = {
        $pages: $('#pages'),
        from: getQueryString('from'),
        $ctrl_wrapper: $('.ctrl-wrapper'),
        $ttips: $('.ttips'),
        $pv_tips: $('#pv-tips'),
        $pv_num: $('#pv-num'),
        $next_tips: $('#next-tips'),
        $next_num: $('#next-num'),
        $share: $('#ui-share'),
        init: function () {

            /////////////////////////
            //openid = 1;

            if (openid) {
                this.$pages.removeClass('disabled');
            } else {
                this.$pages.addClass('disabled');
                return;
            }

            var me = this;
            getResult('humor/index', {
                tsuid: stationUuid,
                yp: openid,
                serviceNo: serviceNo
            }, 'callbackHumorIndex', true);


            // 剩余抽奖次数
            getResult('humor/querylc', {
                tsuid: stationUuid,
                yp: openid
            }, 'callbackHumorQuerylc');

            // 每5s获取pv
            this.update_pv();

            setTimeout(function () {
                me.$share.removeClass('none');
            }, 1000);
        },

        update_pv: function () {
            getResult('log/servicepv/' + serviceNo, {}, 'callbackCountServicePvHander');
            setInterval(function () {
                getResult('log/servicepv/' + serviceNo, {}, 'callbackCountServicePvHander');
            }, 5000);
        },

        show_pvtip: function () {
            this.$ttips.addClass('none');
            this.$pv_tips.removeClass('none');
        },

        show_nexttip: function () {
            this.$ttips.addClass('none');
            this.$next_tips.removeClass('none');
        }
    };

    H.page = {
        parallax: null,
        puid: 0,
        $pages: $('#pages'),
        $arrows: $('#ui-arrows'),
        $top_outer: $('#ui-outer-top'),
        $top_inner: $('#ui-inner-top'),
        s_type: 0,
        TURNED_CLS: 'turned',
        STARTING_CLS: 'starting',
        ENDED_CLS: 'ended',
        timeout: true,
        time: 500,
        init: function (data) {

            var me = this;
            this.$pages.append(this.tpl(data));
            if (this.$pages.find('.page').length <= 1) {
                return;
            }

            this.parallax = me.$pages.parallax({
                direction: 'horizontal', 	// vertical (垂直翻页)
                swipeAnim: 'default', 	// cover (切换效果)
                drag: true, 	// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
                loading: false, 	// 有无加载页
                indicator: false, 	// 有无指示点
                arrow: false, 	// 有无指示箭头
                onchange: function (index, element, direction) {

                    me.update_arrow(index, element);
                    if (index > 0) {
                        var message = direction == 'forward' ? '右翻' : (direction == 'backward' ? '左翻' : '');
                        recordUserOperate(openid, message + '查看第' + index + '组幽默家庭', 'ah-pagechange-' + index);
                    }
                }
            });

            this.update_flower();

            var height = $(window).height();
            $('.xs-wrapper').css('height', height * 0.48).css('marginTop', height * 0.2).find('img').css('maxHeight', height * 0.4);
            $('.ctrl-wrapper').css('height', height * 0.32);

            me.event_handler();
            me.progress();

            // 每隔5s更新投票比率
            this.get_rate();
            setInterval(function () {
                me.get_rate();
            }, 5000);
        },

        update_arrow: function (index, element) {
            if ($(element).next('.page').length == 0) {
                this.$arrows.addClass('left');
            } else {
                this.$arrows.removeClass('left');
            }
        },


        to: function (guid) {
            if (!this.parallax || this.$pages.hasClass('disabled')) {
                return;
            }

            var width = $(window).width(),
				$pages = this.$pages.find('.page'),
				index = $pages.index('[data-guid="' + (guid || 0) + '"]');

            index = index > -1 ? index : 1;
            var $page = $('.page').eq(index);
            if (index == 0 || $page.hasClass('none')) {
                return;
            }
            $pages.removeClass('current');
            $page.addClass('current');

            this.$pages.css("-webkit-transform", "matrix(1, 0, 0, 1, -" + (index * width) + ", 0)");
            window.curPage = index;

            this.update_arrow(index, $page);

        },

        progress: function () {

            var me = this;
            $('.page-round').each(function (index) {
                var $page = $(this),
					guid = $page.attr('data-guid'),
					$prev_page = $page.prev(),
					result = $page.attr('data-rs');
                $page.jumpToCount = 0;

                $page.progress({
                    index: index,
                    oneTime: true,
                    callback: function (state) {
                        $page.jumpToCount++;
                        var $last_page = $('.page-round').not(function () {
                            return $(this).hasClass(me.ENDED_CLS);
                        }).first();

                        if (me.timeout && $last_page.length == 0) {
                            $last_page = $('.page-round').eq(0);
                        }

                        if (!$last_page.hasClass(me.TURNED_CLS)) {
                            var state_val = $last_page.attr('data-state');
                            if (!state_val) {
                                return;
                            }
                            $last_page.addClass(me.TURNED_CLS);
                            if (state_val == 3 && $last_page.next().length == 0) {
                                var $first = $('.page-round').eq(0);
                                if (me.timeout) {
                                    me.timeout = false;
                                    setTimeout(function () {
                                        if ($page.jumpToCount == 1) {
                                            me.to($first.length > 0 ? $first.attr('data-guid') : 0);
                                        }

                                    }, me.time);
                                } else {
                                    if ($page.jumpToCount == 1) {
                                        me.to($first.length > 0 ? $first.attr('data-guid') : 0);
                                    }
                                }
                            } else {
                                if (me.timeout) {
                                    me.timeout = false;
                                    setTimeout(function () {
                                        if ($page.jumpToCount == 1) {
                                            me.to($last_page.attr('data-guid'));
                                        }
                                    }, me.time);
                                } else {
                                    if ($page.jumpToCount == 1) {
                                        me.to($last_page.attr('data-guid'));
                                    }
                                }
                            }
                        }

                    },
                    stCallback: function (state) {// 即将开始
                        $page.addClass(me.STARTING_CLS).removeClass('none');
                    },
                    sdCallback: function (state) { // 正在进行
                        $page.removeClass(me.STARTING_CLS).removeClass('none');
                    },
                    otCallback: function (state) {// 表演结束
                        $page.addClass(me.ENDED_CLS)
                    }
                });
            });
        },

        get_rate: function (guid) {
            var me = this;
            if (guid) {
                getResult('humor/group/' + guid, {}, 'callbackHumorGroup');
            } else {
                $.each(W['pages_info'], function (key, value) {
                    try {
                        if (value && value['guid']) {
                            me.get_rate(value['guid']);
                        }
                    } catch (e) {

                    }


                });
            }
        },

        // 幽默家庭共得X朵鲜花
        update_rate: function (data) {

            var $num = $('#flower-' + data.guid);
            if ($num && $num.length > 0) {
                $num.text(data.pc || 0);
                $num.closest('.flower-tip').removeClass('none');
            } else {

                var f_tip = $('#soon-' + data.guid);
                if (f_tip) {
                    f_tip.removeClass('none');
                }
            }
        },

        event_handler: function () {
            var me = this;
            this.$pages.undelegate();
            this.$pages.delegate('.btn-vote', 'click', function (e) {
                e.preventDefault();

                if ($(this).find('.flower').hasClass('disabled')) {
                    alert('您的鲜花已经献完了！');
                    if (W.lc > 0) {
                        H.dialog.lottery.open();
                    }
                    return;
                }
                var $page = $(this).closest('.page'),
					guid = $page.attr('data-guid');

                getResult('humor/guess', {
                    guid: guid,
                    yp: openid,
                    rsl: 1
                }, 'callbackHumorGuess', true);
            });
        },

        get_page: function (guid) {
            return $('#page-' + guid);
        },

        update_flower: function (lt) {
            if (typeof lt !== 'undefined') {
                W['flower_lt'] = lt;
            }
            var $flower = $('.flower');
            $flower.text(W['flower_lt']);

            if (W['flower_lt'] <= 0) {
                $flower.addClass('disabled');
            }
        },

        update_server_time: function () {
            setInterval(function () {
                var curr = new Date().getTime(),
					dur = curr - W['local_time'];
                W['server_time'] = W['curr_time'] + dur;
            }, 100);
        },

        tpl: function (data) {

            var t = simpleTpl(),
				items = data.items || [];
            window.isJump = false;


            W['curr_time'] = W['server_time'] = timestamp(data.cud);
            W['local_time'] = new Date().getTime();

            this.update_server_time();

            this.puid = data.puid;
            H.dialog.puid = this.puid;
            W.puid = data.puid;
            W.flower_lt = data.lt;
            if (!data.currentTime) {
                H.index.$pv_num.text(data.pv).closest('.pv-tips').removeClass('none');
            }


            var tag = false;
            for (var i = 0, len = items.length; i < len; i++) {
                if (tag == true) {
                    break;
                }

                var over = (data.currentTime ? data.currentTime : timestamp(data.cud)) >= timestamp(items[i].sst);
                //                over = false;

                if (over == false) {
                    tag = true;
                    if (window.last_guid != items[i].guid) {
                        window.last_guid = items[i].guid;
                        window.isJump = true;

                    }

                }
                W['pages_info'] = W['pages_info'] || {};
                W['pages_info'][i] = { 'guid': items[i].guid };
                W['pages_info'].length = tag ? len : i + 1;

                t._('<div class="page page-round" id="page-' + items[i].guid + '" data-guid="' + items[i].guid + '" data-title="' + (items[i].t || '') + '" data-datestr="' + items[i].da + '" data-etime="' + timestamp(items[i].set) + '" data-stime="' + timestamp(items[i].sst) + '">');

                if (over) {//显示
                    t._('<p class="flower-tip none">幽默家庭共得<strong id="flower-' + items[i].guid + '"></strong>朵花</p>');

                } else {
                    t._('<p class="flower-tip none"  id="soon-' + items[i].guid + '">幽默家庭即将登场</p>');
                }


                t._('<div class="xs-wrapper">')
		        		._(over ? '<img src="' + items[i].pi + '" />' : '<img src="images/icon-jy.png" />')
		        	._('</div>')
		        	._('<div class="ctrl-wrapper">')
                t._('<div class="cwc-item cw-vote">')
		        			._('<div class="cw-btns ' + (over ? "" : "none") + '">')
		        				._('<a href="#" class="btn-vote btn-jinji" data-collect="true" data-collect-flag="cctv1-index-votejj" data-collect-desc="家庭幽默-献花按钮"><i></i><span>还剩<strong class="flower"></strong>朵鲜花</span></a>')
		        			._('</div>')
		        		._('</div>');

                t._('<div class="cwr-ctrl ctrl">')
	        				._('<p class="tips"><a href="javascript:void(0)" class="btn-rule" style="font-size:16px;" data-collect="true" data-collect-flag="cctv1-index-rulebtn" data-collect-desc="家庭幽默-规则弹层按钮">查看规则</a></p>')
	        			._('</div>');

                t._('</div>')
		        ._('</div>');
            }
            return t.toString();
        }
    };

    W.callbackHumorIndex = function (data) {

        if (data.code != 0) {
            return;
        }
        window.all_data = data;
        H.page.init(data);


        var pw = $(".page-round").width();
        var ph = $(".page-round").height();
        window.updata_soon = function (data) {

            var me = H.page;
            $(".page-round").remove();
            me.$pages.append(me.tpl(data));

            if (me.$pages.find('.page').length <= 1) {
                return;
            }
            this.parallax = me.$pages.parallax({
                direction: 'horizontal', 	// vertical (垂直翻页)
                swipeAnim: 'default', 	// cover (切换效果)
                drag: true, 	// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
                loading: false, 	// 有无加载页
                indicator: false, 	// 有无指示点
                arrow: false, 	// 有无指示箭头
                onchange: function (index, element, direction) {

                    me.update_arrow(index, element);
                    if (index > 0) {
                        var message = direction == 'forward' ? '右翻' : (direction == 'backward' ? '左翻' : '');
                        recordUserOperate(openid, message + '查看第' + index + '组幽默家庭', 'ah-pagechange-' + index);
                    }
                }
            });
            me.update_flower();
            var height = $(window).height();
            $('.xs-wrapper').css('height', height * 0.48).css('marginTop', height * 0.2).find('img').css('maxHeight', height * 0.4);
            $('.ctrl-wrapper').css('height', height * 0.32);
            if (!is_android()) {
              
                    $(".btn-rule").css({ "font-size": "10px" });
                    $(".btn-rule").css({ "font-family": "'Microsoft YaHei', 宋体, Tahoma, Helvetica, Arial, 宋体, sans-serif" });
                    $(".btn-rule").css({ "font-weight": "normal" });
              
             
            }



            me.event_handler();

            if (window.isJump) {
                if (window.last_guid) {
                    me.to(window.last_guid);
                }
                window.isJump = false;
            }

            me.get_rate();
        }

        setInterval(function () {

            getResult('common/time', {}, 'callbackTimeHandler', false);
            window.callbackTimeHandler = function (o) {
                var t = o.t;
                all_data.currentTime = t;
                updata_soon(all_data);
            }
        }, 5000);
    };

    W.callbackHumorGuess = function (data) {
        if (data.code != 0) {
            alert(data.message);
            return;
        }
        H.page.update_flower(data.lt);

        var $btn = H.page.get_page(data.guid).find('.btn-vote');
        $btn.addClass('animated');
        setTimeout(function () {
            $btn.removeClass('animated');
            H.dialog.lottery.open();
        }, 3000);
    };

    W.callbackCountServicePvHander = function (data) {
        if (data.c) {
            H.index.$pv_num.text(data.c);
        }
    };

    W.callbackHumorGroup = function (data) {
        H.page.update_rate(data);
    };

})(Zepto);

$(function() {
	H.index.init();
});
