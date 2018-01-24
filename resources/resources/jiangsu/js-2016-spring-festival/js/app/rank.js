(function ($) {

    H.rank = {
    	$dialogWrapper: $('#rank_dialog'),
    	$dialog: $('#rank_dialog .dialog'),
    	$friendList: $('#rank_dialog .rank-friend-list'),
        $rankGlobal: $('#rank_dialog .rank-global-list'),
        $tmplMyRank: $('#tmpl_rank_mine'),
        $tmplFriendList: $('#tmpl_rank_list'),
        $tmplEmpty : $('#tmpl_rank_empty'),

        $tabs: $('#rank_dialog .tab'),
        $tabFriend: $('#rank_dialog .tab-friend'),
        $tabGlobal: $('#rank_dialog .tab-global'),

        myRank: '暂无排名',
        myCard: '0',

        init: function(){
        	this.resize();
        	this.bindBtns();
        },

        empty: function(){
            listHtml = H.rank.$tmplEmpty.tmpl();
            H.rank.$friendList.html(listHtml);
        },

        emptyGlobal: function(){
            $('.rank-global-list .rank-list-item').addClass('none');
            $('#my_card_tips').text('给好友发张拜年贺卡');
            $('#my_global_rank').text('即可看到排名哦');
        },

        fillRank: function(data){
            // 填入自己排行
            H.rank.myRank = data.rk ? data.rk : '暂无排名';
            H.rank.myCard = data.mc ? data.mc : '0';

            var listHtml = H.rank.$tmplMyRank.tmpl({
                avatar : headimgurl ? headimgurl : './images/avatar.jpg',
                name : nickname ? xssEscape(nickname) : '匿名',
                rank : H.rank.myRank,
                card : H.rank.myCard
            });

            // 填入好友排行
            if(!data.fr || data.fr.length == 0){
                listHtml += H.rank.$tmplEmpty.tmpl();
            }else{
                for(var i in data.fr){
                    listHtml += H.rank.$tmplFriendList.tmpl({
                        avatar : data.fr[i].hi ? data.fr[i].hi : './images/avatar.jpg',
                        name : data.fr[i].nn ? xssEscape(data.fr[i].nn) : '匿名好友',
                        rank : data.fr[i].rk ? data.fr[i].rk : '暂无排名',
                        card : data.fr[i].mc ? data.fr[i].mc : '0'
                    });
                }
            }

            H.rank.$friendList.html(listHtml);
        },

        fillGlobal: function(data){
            $('#my_rank').text(H.rank.myRank);
            $('#my_card').text(H.rank.myCard);
            $('#my_card_tips').text('共获得了'+H.rank.myCard+'枚卡片');
            $('#my_global_rank').text('击败了全国'+data.pc+'%的用户');
        },

        resize: function(){
        	var height = $(window).height();

        	var dialogHeight = height * 0.8;
        	H.rank.$dialog.css({
        		'top' : 0.1 * height,
        		'height' : dialogHeight
        	});

        	H.rank.$friendList.css({
        		'height' : dialogHeight - 10 - 49 - 32 - 20 - 50
        	});

            H.rank.$rankGlobal.css({
                'height' : dialogHeight - 10 - 49 - 32 - 20 - 50
            });

            var restHeight = dialogHeight - 10 - 49 - 32 - 20 - 60 - 30 - 50;
            H.rank.$rankGlobal.find('p').css({
                'height' : (restHeight / 5) + 'px',
                'line-height' : (restHeight / 10)  + 'px'
            });
            H.rank.$rankGlobal.find('p.big').css({
                'line-height' : (restHeight / 5) + 'px'
            });
        },

        showDialog: function(){
            H.rank.$dialogWrapper.removeClass('none');
            H.rank.$dialog.addClass('transparent');
            setTimeout(function(){
                H.rank.$dialog.removeClass('transparent');
                H.rank.$dialog.addClass('fadeInUp');
            },100);
        },

        hideDialog: function(){
            H.rank.$dialog.removeClass('fadeInUp').addClass('fadeOutDown');
            setTimeout(function(){
                H.rank.$dialogWrapper.addClass('none');
                H.rank.$dialog.removeClass('fadeOutDown');
            }, 400);
        },

        bindBtns: function(){
        	var height = $(window).height();

        	$('#btn_rank').tap(function(){
                H.rank.$tabFriend.trigger('tap');
                H.rank.showDialog();
                return false;
        	});

        	$('#btn_rank_close').tap(function(){
        		H.rank.hideDialog();
                return false;
        	});

            H.rank.$tabFriend.tap(function(){
                H.rank.$tabs.removeClass('active');
                $(this).addClass('active');
                H.rank.$friendList.removeClass('none');
                H.rank.$rankGlobal.addClass('none');

                getResult('api/greetingcard/material/rank4friend',{
                    oi : openid
                },'callbackGreetingcardMaterialRank4friendHandler', null, null, null, 15000, function(){
                    H.rank.empty();
                });
                return false;
            });

            H.rank.$tabGlobal.tap(function(){
                H.rank.$tabs.removeClass('active');
                $(this).addClass('active');
                H.rank.$friendList.addClass('none');
                H.rank.$rankGlobal.removeClass('none');

                getResult('api/greetingcard/material/rank4wide',{
                    oi : openid
                }, 'callbackGreetingcardMaterialRank4wideHandler', null, null, null, 15000, function(){
                    H.rank.emptyGlobal();
                });
                return false;
            });
        }
    };

    W.callbackGreetingcardMaterialRank4friendHandler = function(data){
        hideLoading();
        if(data.result == true){
            H.rank.fillRank(data);
        }else{
            H.rank.empty();
        } 
    };

    W.callbackGreetingcardMaterialRank4wideHandler = function(data){
        hideLoading();
        if(data.result == true){
            H.rank.fillGlobal(data);
        }else{
            H.rank.emptyGlobal();
        }
    }

   
    H.rank.init();

})(Zepto);