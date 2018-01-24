
/**
 * 萌宝-详情页
 */
(function($){

    H.details = {
        request_cls: 'requesting',
        init : function(){
            var me = this;
            me.event_handler();
            $.get("data.ss", detailsCallback, "json");
        },
        event_handler: function() {
            var me = this;

            $('#vote').click(function(e) {
                e.preventDefault();

                $.get("data.ss", detailsGeXinCallback, "json");
            });
        }
    },
    H.data = {
        $surplus : $('#surplus'),
        $votenum: $('#votenum'),

        fill_details : function(data){
            $('#school-title').text(data.schoolTil);
            $('#succ-deta').text('您已成功为'+ data.schoolTil + '幼儿园投票');
            H.data.$votenum.text(data.votenum +"票");
            $('#bb-img').attr('src',data.bbImg);

            $('#school-name').text(data.schoolTil);
            $('#slogan').text(data.slogan);
            $('#program-name').text(data.programName);
            $('#program-about').text(data.programAbout);

            $('#ui-audio').click(function (e) {
                e.preventDefault();

                H.music.init_audio(data.vul);
            });

        }
    }

    W.detailsCallback = function(data){
        if(data.code == 0){
            H.data.fill_details(data);
            H.data.$surplus.text("剩余"+ data.surplus +"票");




        }else if(data.code == 3){

            H.data.fill_details(data);
            H.data.$surplus.text("票数已用完，明天再来吧！")

        }else{
            alert(data.message);
        }
    };

    W.detailsGeXinCallback = function(data){
        if(data.code == 0){
            if(data.surplusAdd.length > 0 && data.surplusAdd != null){
                H.data.$votenum.text(data.votenumAdd +"票");
                H.data.$surplus.text("剩余"+ data.surplusAdd +"票");
                $('#succ-dialog').removeClass('none');
            }else{
                H.data.$surplus.text("票数已用完，明天再来吧！")
            }

        }
    };

})(Zepto);

H.details.init();