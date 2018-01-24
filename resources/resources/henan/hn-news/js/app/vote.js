(function ($) {

    H.vote = {
        questionData: null,
        answerData: null,
        supportData: null,
        curAnswerId: null,
        selectedAuid: null,
        isVoted: false,

        $banner: $('#banner'),
        $topic: $('#topic'),
        $answerWrapper: $('#answer_wrapper'),
        $tmplAnswer: $('#tmpl_answer'),

        init: function () {
        	getResult('api/question/round',{}, 'callbackQuestionRoundHandler');
            this.bindBtn();
        },

        initVotes: function(){
            var qData = H.vote.questionData;
            H.vote.$banner.attr('src', qData.bi);
            H.vote.$topic.text(qData.qt);

            var avatars = H.vote.getAvatars(qData.dc);

            var answerHtml = '';
            for(var i in qData.aitems){
                answerHtml += H.vote.$tmplAnswer.tmpl({
                    avatar: (avatars && avatars[i]) ? avatars[i] : './images/avatar.jpg',
                    id: qData.aitems[i].auid,
                    content: qData.aitems[i].at
                });
            }
            H.vote.$answerWrapper.html(answerHtml);

            H.vote.updateMyVoted();
            H.vote.bindVoteEvent();
        },

        updateMyVoted: function(){
            var aData = H.vote.answerData
            if(aData && aData.anws && aData.puid == H.vote.curAnswerId){
                $('.opinion-item[auid="'+aData.anws+'"]').addClass('voted');
                H.vote.isVoted = true;
            }

            if(H.vote.isVoted != true){
                $('#topic_tips').removeClass('none');
            }
        },

        updateAfterVoted: function(){

            var auid = H.vote.selectedAuid;
            $('.opinion-item[auid="'+auid+'"]').addClass('voted');
            $('.opinion-item[auid="'+auid+'"]').find('.sum-plus').addClass('show');
            $('#topic_tips').addClass('none');
            

            var sData = H.vote.supportData;
            
            if(sData && sData.aitems){
                for(var i in sData.aitems){
                    
                    if(sData.aitems[i].auid == auid){
                        sData.aitems[i].supc += 1;
                        break;
                    }
                };
                H.vote.updateSupport(sData);
            }
            
        },

        bindVoteEvent: function(){
            $('.opinion-item').tap(function(){
                if(!$(this).hasClass('voted') && !H.vote.isVoted){
                    showLoading(null, '投票中');
                    H.vote.selectedAuid = $(this).attr('auid');
                    getResult('api/question/answer', {
                        yoi: openid,
                        suid: H.vote.curAnswerId,
                        auid: H.vote.selectedAuid
                    }, 'callbackQuestionAnswerHandler');
                }else{
                    showTips('您已经投过票了哦<br/>点击 #有话说# 参与更多讨论');
                }
            });
        },

        updateSupport: function(data){
            var total = 0;
            for(var i in data.aitems){
                total += parseInt(data.aitems[i].supc, 10);
            }
            for(var i in data.aitems){
                $('.opinion-item[auid="'+data.aitems[i].auid+'"]').find('.sum').text(data.aitems[i].supc);
                var percentNum = 0;
                if(total > 0){
                    percentNum = Math.floor(data.aitems[i].supc * 100 / total);    
                }
                $('.opinion-item[auid="'+data.aitems[i].auid+'"]').find('.per').text(percentNum);
            }
        },

        getAvatars: function(data){
            data = data.toString();
            return data.match(/http:.*?jpg/ig);
        },

        bindBtn: function(){
            $('.comment-link').tap(function(){
                H.router.to('comment');
            });
        }
    };

    W.callbackQuestionRoundHandler = function(data){
        if(data.code == 0 && data.qitems && data.qitems.length > 0){
            H.vote.questionData = data.qitems[0];
            H.vote.curAnswerId = H.vote.questionData.quid;
            getResult('api/question/record', {
                quid : H.vote.questionData.quid,
                yoi : openid
            }, 'callbackQuestionRecordHandler');
        }else{
            
        }
    };

    W.callbackQuestionRecordHandler = function(data){
        if(data.code == 0){
            H.vote.answerData = data;
        }
        H.vote.initVotes();

        getResult('api/question/eachsupport', {
            quid: H.vote.questionData.quid
        }, 'callbackQuestionSupportHandler')
    };

    W.callbackQuestionSupportHandler = function(data){
        if(data.code == 0){
            H.vote.supportData = data;
            H.vote.updateSupport(data);
        }
    };

    W.callbackQuestionAnswerHandler = function(data){
        hideLoading();
        if(data.code == 0){
            showTips('投票成功');
            H.vote.isVoted = true;
            H.vote.updateAfterVoted();
        }else{
            showTips('点击 #有话说# 参与更多讨论');
        }
    };

    $(function(){
        H.vote.init();
    });

})(Zepto);