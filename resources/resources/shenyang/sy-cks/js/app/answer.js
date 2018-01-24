/**
 * Created by Administrator on 2014/9/12.
 */



var isHasHistory = false;
var isHasCurrent = false;
var surveyInfoUuid = null;
var user_answer_uuid = '';

function spellCurrentHtml(data){
    var resultStr = '<p  class="title">'+ data.sinfo.tt +'<label>'+ (data.sinfo.type==1? '（单选）':'（可多选）') +'</label></p>' + '<ul class="ques">';
    if(data.sinfo.tlist){
        $.each(data.sinfo.tlist,function(i,item){
            resultStr += '<li class="ques-lied" id="'+item.tuuid+'"><label>'
                + item.sv + '</label></li>';
        });
    }
    resultStr +='</ul>';
    return resultStr;
}


function spellpercentHtml(data){
    var resultStr = '<p  class="title">'+ data.sinfo.tt +'</p> <p class="result">本期调查结果为：</p>' + '<ul class="re-ul">';
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
                + item.sv +'</p><p class="plan"></p> <p class="plan-bg"></p><label class="percent">'+ checkedResult + '</label ></li>';
        });
    }
    resultStr +='</ul>';
    return resultStr;

}


function loadCurrent(){
    var height = $(window).height();
    $('.answer-main').css('minHeight', height - 40);
    if(!isHasCurrent){
        isHasCurrent = true;
        getResult("synews/current",{
            oi: openid,
            isHistory: getQueryString('isHistory'),
            surveyInfoUuid: getQueryString('surveyInfoUuid'),
            serviceNo : service_no
        },'callbackSurveyCurrentHander',true);

        getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
    }
}

function callbackSurveyCurrentHander(data) {
    $("#survey-loading").addClass("none");
    surveyInfoUuid = data.sinfo.uuid;
    $('.answer-container').addClass('none');
    $("#current_box").empty().html(spellCurrentHtml(data));
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
                user_answer_uuid += "," + $(this).attr('id');
                submitSurvey();
            });


        }
        else if (data.sinfo.type == 2)
        {   $("#submitBtn").removeClass('none');
            $("#current_box").find('input').removeAttr("disabled");
            /*多选*/
            $("li").on('click',function(){
                $(this).toggleClass('ques-li');
                if($(this).hasClass('ques-li')){
                    user_answer_uuid += "," + $(this).attr('id');
                }else{
                    user_answer_uuid = user_answer_uuid.replace("," + $(this).attr('id'),"");
                }
            });
            $("#submitBtn").attr("href","javascript:submitSurvey();");
            $("#submitBtn").html("提交调查");
        }

    }else if(data.code==2){
        $('.answer').removeClass('none');
        $("#submitBtn").html(data.message);
        $("#submitBtn").attr('class','subed');

    }else if(data.code==3){
        $('.surveyed').removeClass('none');
        $("#submitBtn").html(data.message);
        $("#submitBtn").attr('class','subed');

        $('.answer-container').addClass('none');
        $("#surveyed").empty().html(spellpercentHtml(data));
        $('.answer-container').removeClass('none');

        var pro = $('.plan-bg');
        pro.offsetHeight; // 强制重绘，否则没动画效果
        $.each(data.sinfo.tlist,function(i,item){
            checkedResult = (item.ac/data.count *156) + 'px';
            pro[i].style.width = checkedResult;
        });

    }else{
        if(data.checkedSurvey){
            $.each(data.checkedSurvey,function(i,item){
                $("input[name='checkedParams'][value='"+item.checkuuid+"']").attr("checked", true);
            });
        }
        $("#submitBtn").html(data.message);
        $("#submitBtn").attr("class",'subed');
    }

}


$(function() {
    loadCurrent();
});

function commonApiPromotionHandler(data){
    if (data.code == 0 && data.desc && data.url) {
        $('.ddtj').text(data.desc || '');
        $("#ddtj").click(function(){
            showLoading();
            location.href = data.url;
        });
        $('#ddtj').removeClass("none");
    } else {
        $('#ddtj').remove();
    }
};

var isSubmit = false;
function submitSurvey() {
    if(isSubmit){
    	return;
    }
	isSubmit = true;
    var checkedParams = user_answer_uuid;
    if (null == checkedParams || checkedParams.length == 0) {
        alert("请选择您赞同的观点");
        isSubmit = false;
        return;
    } else {
        checkedParams = checkedParams.substring(1);
    }


    getResult("synews/save?openid=" + openid + "&surveyInfoUuid="
        + surveyInfoUuid + "&checkedParams=" + checkedParams,{},'callbackSurveySaveHander',true);
}

function callbackSurveySaveHander(data){
    if (data.result) {
        alert("谢谢您参与调查，下面进行抽奖");
        var url = "lottery.html?surveyInfoUuid=" + surveyInfoUuid;
        if (gefrom != null && gefrom != '') {
            url = url + "&gefrom=" + gefrom;
        }
        location.href = url;
    } else {
        alert(data.message);
        $("#submitBtn").html(data.message);
        $("#submitBtn").attr('class','subed');
        $("#current_box").find('input').attr("disabled",'disabled');
    }
}
$("#history").click(function(){
	$(".answer-main").addClass('none');
	$("#history-list").removeClass('none');
});
$("#history-back").click(function(){
	$("#history-list").addClass('none');
	$(".answer-main").removeClass('none');
});
