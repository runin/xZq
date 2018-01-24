var uuid=getQueryString("goods_id");
(function($) {
	H.goodscalcu = {
		$submit:$(".btn-submit"),
		$sduobao_continue:$(".duobao-continue"),
		$view_record:$(".view-record"),
		init:function()
		{
			var me = this;
				me.event();
				me.calcuDateGet();
		},
		// 获取计算页的信息
		calcuDateGet:function()
		{
			getResult("indianaPeriod/seeresult",{appId:busiAppId,qid:uuid},"indianaseeResultCallBackHandler",true);
		},
		
		event:function()
		{
			$(".calcu-open").click(function(e)
			{
				$(".calcu-open").addClass("none");
				$(".calcu-close").removeClass("none");
				$(".last-user-list").removeClass("none");

			});

			$(".calcu-close").click(function(e)
			{
				$(".calcu-close").addClass("none");
			    $(".calcu-open").removeClass("none");
				$(".last-user-list").addClass("none");

			});		
		},
		calcuState:function(data)
		{   
			var me = this;
			var isOver = data.flag;
			//data.flag 为true标示已经开奖，false标示倒计时
			if(isOver)
			{
				$(".value-a").text(data.count);		
				$(".value-b").text(data.cp+"  ");
				$(".lottery-editor").text("第（"+data.cpp+"）期");	
				$(".data-result .luck-id").text(data.winnum);	
				me.lastDateRequest(data);
			}
			else
			{
				$(".value-a").text(data.count);	
				$(".value-b").text("正在等待开奖....");
				$(".data-result .luck-id").text("等待揭晓......");
				me.lastDateRequest(data);
			}
		},
		lastDateRequest:function(infor)
		{
			var t=simpleTpl();
			var length = infor.nums.length;
			var nums = infor.nums;
			for(var i=0;i<length;i++)
			{
				t._('<tr class="calcRow">')
				 ._('<td class="time">' + nums[i].time + '<i class="ico ico-arrow-transfer"></i>')
				 ._('<b class="txt-red">' + nums[i].num + '</b></td>')
				 ._('<td class="user">')
				 ._('<div class="f-breakword">')
				 ._(' <a class="goUserPage" data-uid="" href="javascript:void(0)">'+(nums[i].nk?nums[i].nk:"匿名") +'</a>')
				 ._('</div>')
				 ._('</td>')
				 ._('</tr>')
			}
			$(".last-user-list tbody").append(t.toString());
		}

	}
	W.indianaseeResultCallBackHandler=function(data)
	{
		if(data.result)
		{
			H.goodscalcu.calcuState(data);
		}
		else
		{
			showTips("啊哦，网络在开小差噢，稍后再试试吧~");
		}
	}
})(Zepto);

$(function() {
	H.goodscalcu.init();
});