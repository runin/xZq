/**
 * Created by Administrator on 2014/9/12.
 */
$(function(){
	H.answer = {
		isSubmit:false,
		surveyInfoUuid: getQueryString("surveyInfoUuid"),
		user_answer_uuid : '',
		isHistory : getQueryString("isHistory"),
		isHasCurrent : false,
		currentActUuid : '',
		init:function(){
			this.eventhandler();
			this.loadCurrent();
			this.currentActivity();
            this.ddtj();
		},
		eventhandler:function(){
			
		},
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
		submitSurvey:function(){
		    if(this.isSubmit){
		    	return;
		    }
		    this.isSubmit = true;
		    var checkedParams = this.user_answer_uuid;
		    if (null == checkedParams || checkedParams.length == 0) {
		        alert("请选择您赞同的观点");
		        this.isSubmit = false;
		        return;
		    } else {
		        checkedParams = checkedParams.substring(1);
		    }


		    getResult("synews/save?openid=" + openid + "&surveyInfoUuid="
		        + this.surveyInfoUuid + "&checkedParams=" + checkedParams,{},'callbackSurveySaveHander',true);
		},
		loadCurrent:function(){
		    var height = $(window).height();
		    $('.answer-main').css('minHeight', height - 40);
		    if(!this.isHasCurrent){
		        this.isHasCurrent = true;
		        getResult("synews/current/" + openid,{
		        	surveyInfoUuid : this.surveyInfoUuid,
		        	isHistory : this.isHistory,
		        	serviceNo : serviceNo
		        },'callbackSurveyCurrentHander',true);
		    }
		},
		currentActivity:function(){
			getResult("newseye/index/" + openid,{
			},'newseyeIndexHandler',true);
		},
		spellpercentHtml:function(data){
		    var resultStr = '<p class="title">本期调查结果为：</p>' + '<ul class="re-ul ques">';
		    if(data.sinfo.tlist){
		    	var countResult = 0;
		        $.each(data.sinfo.tlist,function(i,item){
		        	if(i == (data.sinfo.tlist.length - 1)){
		        		checkedResult = (100 - countResult)+"%";
		        	}else{
		                checkedResult = (item.ac/data.count * 100).toFixed(0) + '%';
		                countResult += (item.ac/data.count * 100).toFixed(0)*1;
		        	}
		            resultStr += '<li><p>'
		                + item.sv +'</p><i class="plan"><span class="plan-bg"></span></i><label class="percent">'+ checkedResult + '</label ></li>';
		        });
		    }
		    resultStr +='<div class="tip"><a class="sub" id="back-btn" data-collect="true" data-collect-flag="hlj-consume-surveyed-back-index-btn" data-collect-desc="返回首页">返回首页</a></div></ul>';
		    return resultStr;
		},
		spellCurrentHtml:function(data){
		    var resultStr = '<p  class="title">'+ data.sinfo.tt +'</p>' + '<ul class="ques">';
		    if(data.sinfo.tlist){
		        $.each(data.sinfo.tlist,function(i,item){
		            resultStr += '<li class="ques-lied" id="'+item.tuuid+'">'
		                + item.sv + '</li>';
		        });
		    }
		    resultStr +='<div class="tip none"><p id="tipword" class="tipword"></p><a  id="submitBtn" class="sub none" data-collect="true" data-collect-flag="hlj-consume-surveyed-answer-back-btn" data-collect-desc="返回首页">返回首页</a></div></ul>';
		    return resultStr;
		},
		lottery:function(surveyInfoUuid){
			getResult('api/lottery/luck', {
				oi : openid,
				sau : H.answer.currentActUuid
			}, 'callbackLotteryLuckHandler',true);
		},
		
		fill_masking : function(){
			var t = simpleTpl();

			t._('<div class="masking-box">')
				._('<img class="enter" src="images/enter-a.png"')
				._('<div class="gift">')
					._('<div class="giftBoxDiv  none step-1">')
						._('<div class="giftbox">')
							._('<div class="cover">')
								._('<div></div>')
							._('</div>')
							._('<div class="box"></div>')
						._('</div>')
						._('<div class="wer">')
                            ._('<span></span>')
                            ._('<span></span>')
                            ._('<span></span>')

                            ._('<span></span>')
                            ._('<span></span>')
                            ._('<span></span>')
						._('</div>')
					._('</div>')
				._('</div>')
			._('</div>')

			$masking_box = $(t.toString());

			$('body').append($masking_box);
		},
		to2: function(){
			if($('.giftBoxDiv').hasClass("step-1")){
                $('.giftBoxDiv').removeClass('step-1').addClass('step-2');
                $('.wer').addClass('page-a');
            }
			else{
                $('.giftBoxDiv').removeClass('step-2').addClass('step-1');
            }

		}
	};


	W.callbackSurveySaveHander = function(data){
	    if (data.result) {
	    	H.answer.lottery(H.answer.surveyInfoUuid);
	    
	        
	    } else {
	        alert(data.message);
	        $("#tipword").html(data.message);	       
	        $("#current_box").find('input').attr("disabled",'disabled');
	    }
	};
	W.callbackSurveyCurrentHander = function(data) {
	    $("#survey-loading").addClass("none");
	    H.answer.surveyInfoUuid = data.sinfo.uuid;
	    $('.answer-container').addClass('none');
	    $("#current_box").empty().html(H.answer.spellCurrentHtml(data));
	    $('.answer-container').removeClass('none');
	    if (data.code==1) {
	        $('.answer').removeClass('none');
	        if (data.sinfo.type == 1)
	        {   
	        	$("#current_box").find('input').removeAttr("disabled");
	            /*单选*/
	            $("li").on('click', function(){
	                $(this).addClass('ques-li').removeClass('ques-lied');
	                $(this).siblings().removeClass('ques-li').addClass('ques-lied');
	                H.answer.user_answer_uuid += "," + $(this).attr('id');
	                H.answer.submitSurvey();
	            });


	        }
	        else if (data.sinfo.type == 2)
	        {   
	        	$(".tip").removeClass('none');
	        	$("#submitBtn").removeClass('none');
	            $("#current_box").find('input').removeAttr("disabled");
	            /*多选*/
	            $("li").on('click',function(){
	                $(this).toggleClass('ques-li');
	                if($(this).hasClass('ques-li')){
	                	H.answer.user_answer_uuid += "," + $(this).attr('id');
	                }else{
	                	H.answer.user_answer_uuid = H.answer.user_answer_uuid.replace("," + $(this).attr('id'),"");
	                }
	            });
	            $("#submitBtn").on("click",function(){
	            	H.answer.submitSurvey();
	            });
	            $("#submitBtn").html("提交调查");
	        }

	    }else if(data.code==2){
	        $('.answer').removeClass('none');
	        $("#tipword").html(data.message);
            $("#submitBtn").on("click",function(){
            	location.href = "index.html";
            });
            $("#submitBtn").html("返回首页").removeClass('none');
	        $(".tip").removeClass('none');

	    }else if(data.code==3){
	        $('.surveyed').removeClass('none');
	        $("#tipword").html(data.message);
            $("#submitBtn").on("click",function(){
            	location.href = "index.html";
            });
            $("#submitBtn").html("返回首页").removeClass('none');
	        $(".tip").removeClass('none');

	        $('.answer-container').addClass('none');
	        $("#surveyed").empty().html(H.answer.spellpercentHtml(data));
	        $('.answer-container').removeClass('none');
			
	        var pro = $('.plan-bg');
	        pro.offsetHeight; // 强制重绘，否则没动画效果
	        $.each(data.sinfo.tlist,function(i,item){
	            checkedResult = (item.ac/data.count *100) + '%';
	            pro[i].style.width = checkedResult;
	        });

	    }else{
	        if(data.checkedSurvey){
	            $.each(data.checkedSurvey,function(i,item){
	                $("input[name='checkedParams'][value='"+item.checkuuid+"']").attr("checked", true);
	            });
	        }
	        $("#tipword").html(data.message);
            $("#submitBtn").on("click",function(){
            	location.href = "index.html";
            });
            $("#submitBtn").html("返回首页").removeClass('none');
	        $(".tip").removeClass('none');
	    }
	    
		$("#back-btn").on("click",function(e){
				e.preventDefault();
				window.location.href = "index.html";
		});
	};
	
	W.callbackLotteryLuckHandler = function(data){
			H.answer.fill_masking();
	    	setTimeout(function(){
		    	$(".masking-box").find(".enter").addClass("none");
		    	$(".masking-box").addClass("entered");
		    	$(".masking-box").find(".giftBoxDiv").removeClass("none");
		    	setTimeout(function(){
		    		H.answer.to2();
		    		setTimeout(function(){
		    			H.dialog.lottery.open();
		    			H.dialog.lottery.update(data);
		    		},2000)
	    		},1000);
		    },2000)

   
      
	};
	
	W.newseyeIndexHandler = function(data){
		if(data.code != 1 & data.code != 5){
			H.answer.currentActUuid = data.au;
		}
	};
    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    }
});
$(function(){
	H.answer.init();
});
