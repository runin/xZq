(function($){
    H.index = {
        name: null,
        cpid: getQueryString('cpid'),
        init: function () {
            this.event();
            this.detail();
        },
        detail: function () {
            var me = H.index;
            getResult('mobile/competition/detail', {cpid: me.cpid}, 'callbackCompetitionDetailHandler',true);
        },
        event: function(){
            var me = H.index;
            $(".index-main #btn-desc").bind('touchstart', function (e) {
                e.preventDefault();
                toUrl('event-details.html?detailimg='+$(this).attr('data-detailimg'));
            })
        },
        fill: function (data) {
            $(".index-main .logo").attr('src', data.inslogo);
            $(".index-main #top-img").attr('src', data.img);
            $(".index-main #name").text(data.name);
            $(".index-main .sign").text(data.renum);
            $(".index-main #btn-desc").attr('data-detailimg', data.detailimg);
            $(".index-main .date").text(formatDate(data.restart) + '~' + formatDate(data.reend));
            $(".index-main #content").text(data.rule);
            $(".index-main #reproimg").attr('src', data.reproimg);
        }
    };

    W.callbackCompetitionDetailHandler = function (data) {
        var me = H.index;
        if(data.code == 1){
            me.name = data.name;
            saveData('eventDetailsName', me.name);
            me.fill(data);
        }
    };

    H.eventDetails = {
        detailimg: getQueryString('detailimg'),
        init: function () {
            this.event();
            this.loadImg(this.detailimg);
        },
        loadImg: function(items){
            shownewLoading();
            var imgsDeafult = [];
            var imgs = imgsDeafult.concat(items.split(','));
            loadImg = function () {
                for (var i = 0; i < imgs.length; i++) {//图片预加载
                    var img = new Image();
                    img.style = "display:none";
                    img.src = imgs[i];
                    img.onload = function () {
                        hidenewLoading();
                    }
                }
            };
            loadImg();

            this.fill(this.detailimg);
        },
        event: function(){},
        fill: function (data) {
            $(".details-page #event-details").attr("src", data)
        }
    };

    H.product = {
        init: function () {
            this.event();
        },
        event: function(){
            $(".product-page .down").bind('touchend', function (e) {
                e.preventDefault();

                /*if(check_weixin_login()){
                    alert('在浏览器打开');
                    return;
                }*/
                if(is_android()){
                    toUrl(androidDownUrl);
                }else{
                    toUrl(iosDownUrl);
                }
            });

        }
    };

    H.diploma = {
        uid: getQueryString('uid'),
        cpid: getQueryString('cpid'),
        cpname: null,
        awname: null,
        init: function () {
            this.event();
            this.rank();
        },
        rank: function () {
            var me = H.diploma;
            getResult('mobile/child/award/detail', {uid: me.uid, cpid: me.cpid}, 'callbackChildAwardDetailHandler',true);
        },
        event: function(){
            var me = this;
            $(".diploma-page .event-synopsis").bind('touchend', function (e) {
                e.preventDefault();
                toUrl('index.html?cpid='+ me.cpid);
            })

        },
        fill: function (data) {
            var me = H.diploma;
            $(".diploma-page #cpname").text(data.cpname || '');

            $(".diploma-page .vedio-con").html('<video webkit-playsinline playsinline width="100%" height="auto" controls poster="'+ data.vimg +'"><source src="'+ data.vurl +'" type="video/mp4"></source></video>');

            shapeType($(".diploma-page #avatar"), data.avatar || 'images/avatar.png');
            $(".diploma-page #wname").text(data.wname || '');
            $(".diploma-page #username").text(data.username || '');
            $(".diploma-page #tname").text(data.tname || '');

            $(".diploma-page #awname").text(data.awname);
            $(".diploma-page #cgname").text(data.cgname);
            $(".diploma-page #time").text(formatDate(data.time).replace('月', ' - ').replace('年', ' - '));
        }
    };
    W.callbackChildAwardDetailHandler = function (data) {
        var me = H.diploma;
        if(data.code == 1){
            me.cpname = data.cpname;
            me.awname = data.awname;
            me.fill(data);
        }
    };

    H.user = {
        type: getQueryString('type'),
        uid:  getQueryString('uid'),
        username: null,
        resume: null,
        childFirst: null,
        // startTime: '2017-01-01',
        page: 1,
        pageSize: 10,
        loadmore: true,
        loading: false,
        lastKey: null,
        institutionFirst: '',
        init: function () {
            this.event();
            this.info(this.type);
        },
        info: function (type) {
            var me = H.user;
            switch (type){
                case 'child':
                    getResult('mobile/child/personal', {uid: me.uid}, 'callbackChildPersonalHandler',true);
                    getResult('mobile/child/newdynamics', {uid: me.uid, pg: 1, ps: me.pageSize}, 'callbackChildNewDynamicsHandler',true);
                    break;
                case 'teacher':
                    getResult('mobile/teacher/personal', {uid: me.uid}, 'callbackTeacherPersonalHandler',true);
                    getResult('mobile/teacher/newdynamics', {uid: me.uid, pg: me.page, ps: me.pageSize}, 'callbackTeacherNewDynamicsHandler',true);
                    break;
                case 'organization':
                    getResult('mobile/institution/personal', {iid: me.uid}, 'callbackInstitutionPersonalHandler',true);
                    getResult('mobile/institution/dynamics', {iid: me.uid}, 'callbackInstitutionDynamicsHandler',true);
                    break;
            }

        },
        event: function(){
            var me = this,
                range = 180, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;

            $('.user-page').scroll(function(){
                var srollPos = $(this).scrollTop();
                totalheight = parseFloat($(this).height()) + parseFloat(srollPos);
                if (($('ul').height() - range) <= totalheight  && me.page < maxpage && me.loadmore && !me.loading) {
                    me.loading = true;
                    if(me.type == 'child'){
                        getResult('mobile/child/newdynamics', {uid: me.uid, pg: me.page, ps: me.pageSize}, 'callbackChildNewDynamicsHandler');
                    }else{
                        getResult('mobile/teacher/newdynamics', {uid: me.uid, pg: me.page, ps: me.pageSize}, 'callbackTeacherNewDynamicsHandler');
                    }
                }
            });
        },
        personalFill: function (data) {
            var me = H.user, value = '学生', sex = '';
            me.username = data.name;
            $('.user-page #name').text(data.name);
            shapeType($('label#headImg'), data.img || data.logo || 'images/avatar.png');
            sex = data.sex ? ' 男 ' : ' 女 ';
            if(me.type == 'teacher'){
                //0评委 1老师
                if(data.role == 1){
                    value = '老师';
                }else{
                    value = '评委';
                }

            }else if(me.type == 'organization'){
                value = '';
                sex = '艺术机构';
            }
            $('.user-page #sex').text(data.city + sex + ' '+ value);
            var dom = '';
            $.each(data.lItem, function (i, items) {
                dom += '<label>'+ items.lname +'</label>';
            });
            $(".user-page  #lItem").append(dom);
        },
        dynamicsFill: function (data, type, length, userType) {
            var me = H.user, t = simpleTpl(),
                tItemLength = 0,
                isaItem = 'none',
                istItem = 'none',
                iscItem = '',
                value = '学生',
                flag = true;

            $.each(data, function (i, items) {
                console.log(formatDate(items.time));
                if(type == 'tItem' && length){
                    tItemLength = length;
                    istItem = '';
                    iscItem = 'none';
                    isaItem = 'none';
                }else if(type == 'aItem'){
                    istItem = 'none';
                    iscItem = 'none';
                    isaItem = '';
                }

                if(me.type == 'child'){
                    value = '指导老师'
                }

                var year = formatDate(items.time).split('年')[0],
                    currentYear = new Date().getFullYear();
                var leftYer = (year == currentYear) ? '' : year+'年';
                if(flag){
                    t._('<li>')
                        ._('<div class="left">')
                            ._('<span class="date">'+ formatDate(items.time).split('年')[1].split('月')[1].slice(0,2) +'</span>')
                            ._('<label class="month">'+ formatDate(items.time).split('年')[1].split('月')[0] +'月</label>')
                            ._('<i>'+ leftYer+'</i>')
                        ._('</div>')
                        ._('<div class="cItem '+ iscItem +'">')
                            ._('<div class="img-out">')
                                 // ._('<label class="cname">'+ items.cname +'</label>')
                                 ._('<img src="'+ (items.cimg || "") +'" />')
                                 // ._('<span class="date">时间：'+ formatDate(items.cstart) + '~' + formatDate(items.cend) +'（共'+ parseInt(((items.cend*1-items.cstart*1)/1000/60/60/24)) +'天）</span>')
                                 ._('<p class="textLeft ">发布了'+ (items.cname || "") +'</p>')
                            ._('</div>')
                            /*._('<div class="vedio-out">')
                                ._('<img src="images/test-3.jpg">')
                                ._('<p class="textLeft">在作品圈发表了作品《拜厄练习曲》</p>')
                            ._('</div>')*/
                        ._('</div>')
                        ._('<div class="tItem '+ istItem +'">')
                            ._('<i class="">本月</i>')
                            ._('<p class="textLeft">新增了 <label class="count">'+ tItemLength +'</label> 位'+ value +'</p>')
                        ._('</div>')
                        ._('<div class="aItem '+ isaItem +'">')
                            ._('<div class="img">')
                                ._('<h1 class="cname">'+ items.cname +'</h1>')
                            ._('</div>')
                            ._('<p class="textLeft">我获得了<label class="aname">'+ (items.aname || "") +'</label></p>')
                        ._('</div>')
                    ._('</li>');
                    if(type == 'tItem'){
                        flag = false;
                    }
                }
            });
            $(".user-page ul").append(t.toString());

        },
        chilTeacherdynamicsFill: function (data) {
            var me = H.user, t = simpleTpl(),
                isaItem = 'none',//奖状类型
                istItem = 'none',//新增人员类型
                iscItem = 'none',//赛事类型
                valueTip = '学生',
                flag = true,
                lastFillFlag = false;

            // if(data.length < me.pageSize) me.loadmore = false;
            if(data.length < 0) me.loadmore = false;

            var rss = formatMap(data, 'time',null,'Date');

            rss.forEach(function(value, index){console.log(index);
                if(me.page != 1 && index == me.lastKey){
                    t.store = '';
                    for(var y of rss.get(index)){innerFill(y);}
                    $(".user-page ul li:last-child").append(t.toString());
                    lastFillFlag = true;
                    return;
                }

                if(lastFillFlag){t.store = ''};
                lastFillFlag = false;
                var month = parseInt(index.split('年')[1].split('月')[0].split('')[0]) ? index.split('年')[1].split('月')[0] : index.split('年')[1].split('月')[0].split('')[1];

                var year = index.split('年')[0],
                    currentYear = new Date().getFullYear();
                var leftYer = (year == currentYear) ? '' : year+'年';

                t._('<li>')
                    ._('<div class="left">')
                        ._('<span class="date">'+ index.split('年')[1].split('月')[1].split('日')[0] +'</span>')
                        ._('<label class="month">'+ month +'月</label>')
                        ._('<i>'+ leftYer+'</i>')
                    ._('</div>');
                for(var x of value){
                    if(x.cpname && flag){
                        me.childFirst = x.cpname;
                        flag = false;
                    }
                    innerFill(x);
                }
                t._('</li>');
            });
            if(!lastFillFlag)$(".user-page ul").append(t.toString());


            function innerFill(x) {
                if(me.type == 'child'){
                    valueTip = '指导老师';
                    switch(x.type){
                        case 1://参赛
                            isaItem = 'none';
                            istItem = 'none';
                            iscItem = '';
                            break;
                        case 2://获奖
                            isaItem = '';
                            istItem = 'none';
                            iscItem = 'none';
                            break;
                        case 4://每月统计数据
                            isaItem = 'none';
                            istItem = '';
                            iscItem = 'none';
                            var tItemLength = x.teachers || 0,
                                favoritesLength = x.favorites || 0,
                                praisesLength = x.praises || 0,
                                fansLength = x.fans || 0,
                                concernsLength = x.concerns || 0;
                            break;
                    }
                }else{
                    switch(x.type){
                        case 1://1学生参赛4担任评委
                            isaItem = 'none';
                            istItem = 'none';
                            iscItem = '';
                            break;
                        case 4://1学生参赛4担任评委
                            isaItem = 'none';
                            istItem = 'none';
                            iscItem = '';
                            break;
                        case 2://2学生获奖
                            isaItem = '';
                            istItem = 'none';
                            iscItem = 'none';
                            break;
                        case 5://5每月统计数据
                            isaItem = 'none';
                            istItem = '';
                            iscItem = 'none';
                            var tItemLength = x.students || 0,
                                favoritesLength = x.favorites || 0,
                                praisesLength = x.praises || 0,
                                fansLength = x.fans || 0,
                                concernsLength = x.concerns || 0;
                            break;
                    }
                }

                        t._('<div class="cItem '+ iscItem +'" data-time="'+x.time+'">')
                            ._('<div class="img-out">')
                                // ._('<label class="cname">'+ (x.cpname || "") +'</label>')
                                ._('<img src="'+ (x.cpimg || "") +'" />')
                                // ._('<span class="date">时间：'+ formatDate(x.cpstart) + '~' + formatDate(x.cplast) +'（共'+ parseInt(((x.cplast*1-x.cpstart*1)/1000/60/60/24)) +'天）</span>');
                                if(me.type == 'child'){
                                    t._('<p class="textLeft ">参加了'+ (x.cpname || "") +'</p>');
                                }else{
                                    if(x.type == 1){
                                        t._('<p class="textLeft ">我的学生@'+ (x.chname+'参加了'+(x.cpname || "")) +'</p>');
                                    }else if(x.type == 4){
                                        t._('<p class="textLeft ">担任了'+ (x.cpname || "") +'评委</p>');
                                    }

                                }
                        t._('</div>')
                        ._('</div>')
                        ._('<div class="tItem '+ istItem +'">')
                            ._('<i class="">本月</i>')
                            ._('<p class="textLeft '+(praisesLength? "": "none")+'">收到了 <label class="count">'+ praisesLength +'</label> 次点赞</p>')
                            ._('<p class="textLeft '+(favoritesLength? "": "none")+'">作品被 <label class="count">'+ favoritesLength +'</label> 位用户收藏</p>')
                            ._('<p class="textLeft '+(tItemLength? "": "none")+'">新增了 <label class="count">'+ tItemLength +'</label> 位'+ valueTip +'</p>')
                            ._('<p class="textLeft '+(fansLength? "": "none")+'">新增了 <label class="count">'+ fansLength +'</label> 位粉丝</p>')
                            ._('<p class="textLeft '+(concernsLength? "": "none")+'">关注了 <label class="count">'+ concernsLength +'</label> 位用户</p>')
                        ._('</div>')
                        ._('<div class="aItem '+ isaItem +'">')
                            ._('<div class="img">')
                                ._('<h1 class="cname">'+ (x.cpname || "") +'</h1>')
                                ._('<h2 class="awname">'+ (x.awname || (x.score ? (x.score+"分") : "")) +'</h2>')
                            ._('</div>');
                            if(me.type == 'child'){
                                t._('<p class="textLeft">我在'+ (x.cpname || "") +'比赛中得到了<label class="aname">'+ (x.awname || (x.score ? (x.score+"分") : "")) +'</label></p>');
                            }else{
                                t._('<p class="textLeft">我的学生<label class="aname">@'+ ((x.chname || "")+'获得了'+(x.cpname || "'")+(x.awname || (x.score ? ('中获得了'+x.score+"分") : ""))) +'</label></p>');
                            }
                        t._('</div>');
                        return t;
                    }
            for(var x of rss){ me.lastKey = x; }
            me.lastKey = me.lastKey[0];

            me.page++;
            me.loading = false;
        }
    };
    W.callbackChildPersonalHandler = function (data) {
        var me = H.user;
      if(data.code == 1){
          me.personalFill(data);
      }
    };
    W.callbackTeacherPersonalHandler = function (data) {
        var me = H.user;
      if(data.code == 1){
          me.resume = data.resume;
          me.personalFill(data);
      }
    };
    W.callbackInstitutionPersonalHandler = function (data) {
        var me = H.user;
      if(data.code == 1){
          me.personalFill(data);
      }
    };
    W.callbackChildNewDynamicsHandler = function (data) {
        var me = H.user;
        if(data.code == 1){
           me.chilTeacherdynamicsFill(data.item);
        }
    };
    W.callbackTeacherNewDynamicsHandler = function (data) {
        var me = H.user;
        if(data.code == 1){
            me.chilTeacherdynamicsFill(data.item);
        }
    };
    W.callbackInstitutionDynamicsHandler = function (data) {
        var me = H.user;
        if(data.code == 1){
            if(data.cItem){
                me.institutionFirst = data.cItem[0].cname;
                me.dynamicsFill(data.cItem);
            }
            if(data.ccItem){
                me.dynamicsFill(data.ccItem);
            }
            if(data.aItem){
                me.dynamicsFill(data.aItem, 'aItem');
            }
            if(data.stuItem){
                me.dynamicsFill(data.stuItem, 'tItem', data.stuItem.length, me.type);
            }
            if(data.jItem){
                me.dynamicsFill(data.jItem);
            }
        }
    };

    H.works = {
        cpid: getQueryString('cpid'),
        cpname: null,
        init: function () {
            this.event();
            this.rank();
        },
        rank: function () {
            var me = H.works;
            getResult('mobile/competition/rank', {cpid: me.cpid}, 'callbackCompetitionRankHandler',true);
        },
        event: function(){
            var me = this;
            $(".works-page .share").bind('click', function (e) {
                e.preventDefault();
                toUrl('index.html?cpid='+me.cpid);
            });
            $('body').delegate(".works-page .vedio-out", 'tap', function (e) {
                e.preventDefault();
                toUrl('works-details.html?uid='+ $(this).attr('data-uid') +'&wid=' +$(this).attr('data-wid'));
                saveData('cpname', $(this).closest('div.items').attr('data-cpname'));
                saveData('cgname', $(this).closest('div.items').attr('data-cgname'));
                saveData('awname', $(this).closest('div.items').attr('data-awname'));
            })
        },
        fill: function (data) {
            var me = H.works,
                t = simpleTpl();
            $.each(data.item, function (i, items) {
                t._('<div class="items" data-cpname="'+ data.cpname +'"  data-cgname="'+ (items.cgname || '') +'" data-awname="'+ (items.awname || '') +'">')
                    ._('<div class="vedio-out" data-uid="'+ items.uid +'" data-wid="'+ items.wid +'">')
                        ._('<div class="video">')
                            ._('<img src="'+ items.vimg +'">')
                            /*._('<video webkit-playsinline playsinline width="100%" height="auto" poster="'+ items.vimg +'">')
                                ._('<source src="'+ items.vurl +'" type="video/mp4"></source>')
                            ._('</video>')*/
                        ._('</div>')
                        ._('<p class="desc">'+ (items.cgname || '') + ' ' + (items.awname || '') +'</p>')
                    ._('</div>')
                    ._('<div class="orient-h info">')
                        ._('<p><label><img src="'+ (items.adatar || 'images/avatar.png') +'" /></label></p>')
                        ._('<div>')
                            ._('<h1 class="ellipsis">'+ (items.title || '') +'</h1>')
                            ._('<h2 class="ellipsis username">'+ (items.username || '')+'</h2>')
                            ._('<h2 class="ellipsis teaname">'+ (items.teaname || '') +'</h2>')
                        ._('</div>')
                    ._('</div>')
                ._('</div>')
            });
            $(".works-page .content").append(t.toString());
        }
    };
    W.callbackCompetitionRankHandler = function (data) {
        var me = H.works;
        if(data.code == 1){
            me.cpname = data.cpname;
            me.fill(data);
        }
    };

    H.worksDetails = {
        uid: getQueryString('uid'),
        wid: getQueryString('wid'),
        title: null,
        init: function () {
            this.event();
            this.details();
        },
        details: function () {
            var me = H.worksDetails;
            getResult('mobile/work/detail', {uid: me.uid, wid: me.wid}, 'callbackWorkDetailHandler',true);
        },
        event: function(){
            var me = this;
            $('body').delegate(".works-details-page .audio", 'tap', function (e) {
                e.preventDefault();
                var $thisPlay = $(this).find('.btn-play');
                if( $thisPlay.hasClass('play')){
                    $thisPlay.removeClass('play');
                    $thisPlay.siblings('audio').get(0).pause();
                    return;
                }
                $('.btn-play').removeClass('play');
                $thisPlay.addClass('play');
                $('audio').get(0).pause();
                $thisPlay.siblings('audio').get(0).play();
                $thisPlay.siblings('audio').on('ended', function() {
                    $thisPlay.removeClass('play');
                    $thisPlay.siblings('audio').get(0).pause();
                });
                /*$thisPlay.siblings('audio').get(0).addEventListener('ended', function () {
                    alert('over');
                }, false);*/
            });
        },
        fill: function (data) {
            var me = H.worksDetails;
            $(".works-details-page .vedio-con").html('<video webkit-playsinline playsinline width="100%" height="auto" controls poster="'+ data.vimg +'"><source src="'+ data.vurl +'" type="video/mp4"></source></video>');
            $(".works-details-page #uptime").text(formatDate(data.uptime).replace('月', '.').replace('年', '.'));
            $(".works-details-page #veidoTime").text(data.viewcount || 0);
            shapeType($(".works-details-page #avatar"), data.adatar || 'images/avatar.png');
            $(".works-details-page #title").text(data.title || '');

            var checkVlaue = function (value) {
                var data = '';
                if(value == 'undefined' || value){
                    data = ''
                }else{
                    data = value;
                }
                return data;
            };
            var desc = checkVlaue(getData('cpname')) + checkVlaue(getData('cgname')) + checkVlaue(getData('awname'));

            $(".works-details-page #desc").text(desc || data.catename);
            $(".works-details-page #username").text('@' +(data.username || '无'));
            $(".works-details-page #teaname").text('指导老师：' +(data.teaname || '无'));

            me.fillEach(data.jnItem, 'jcItem');
            me.fillEach(data.cnItem, 'ncItem');

            /*var $items = '',time = [];
            for(var i = 0; i < $("#bottom .items").size(); i++){
                $items = $("#bottom .items").eq(i);
               $items.find('audio').on('loadedmetadata', function() {
                    console.log(Math.ceil($(this).get(0).duration) + '"');
                    time.push(Math.ceil($(this).get(0).duration));
                });
            }
            setTimeout(function () {
                for(var i = 0; i < $("#bottom .items").size(); i++){
                    if(time[i]){
                        $("#bottom .items").eq(i).find('.audio-con').removeClass("none");
                        $("#bottom .items").eq(i).find('.dateu').text(time[i] + '"');
                        continue;
                    }
                }
            },3000);*/


        },
        fillEach: function (data, type) {
            var me = H.worksDetails,
                t = simpleTpl(),
                className = '',
                audioClassName = '';
            if(type == 'ncItem'){
                className = 'none';
            }


            $.each(data, function (i, items) {
                if(!items.audio){
                    audioClassName = 'none';
                }
                t._('<div class="orient-h items">')
                    ._('<p><label><img src="'+ (items.avatar || '') +'" /></label></p>')
                    ._('<div class="right">')
                        ._('<div>')
                            ._('<label class="name">'+ (items.username || '匿名用户') +'</label>')
                            ._('<span class="'+ className +'">评委</span>')
                        ._('</div>')
                        ._('<div class="inner-con">'+ (items.content || '') +'</div>')
                        ._('<section class="audio-con  '+ audioClassName +'">')
                            ._('<div class="content audio">')
                                ._('<span class="btn-play"></span><audio preload="auto" class="audio none" src="'+ items.audio +'"></audio>')
                                // ._('<span class="btn-play"></span><audio preload="auto" class="audio none" onloadedmetadata="eval(String(this.duration).split(\'.\')[0]);" src="http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/xiantvadvertise/audio/2015411/night.mp3"></audio>')
                            ._('</div><label class="dateu"></label>')
                        ._('</section>')
                        ._('<div class="date">'+ normalDate(items.time) +'</div>')
                    ._('</div>')
                ._('</div>')
            });

            $(".works-details-page #bottom").append(t.toString());
        }
    };
    W.callbackWorkDetailHandler = function (data) {
        var me = H.worksDetails;
        if(data.code == 1){
            me.title = data.title;
            me.fill(data);
        }
    };

})(Zepto);
$(function(){
    switch ($("body").attr("data-type")){
        case 'index':
            H.index.init();
            break;
        case 'event-details':
            H.eventDetails.init();
            break;
        case 'product':
            H.product.init();
            break;
        case 'diploma':
            H.diploma.init();
            break;
        case 'user':
            H.user.init();
            break;
        case 'works':
            H.works.init();
            break;
        case 'works-details':
            H.worksDetails.init();
            break;
        default:
            break;
    }
    H.jssdk.init();
});
