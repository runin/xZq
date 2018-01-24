

$(function() {
   getResult('api/linesdiy/info ', {}, 'callbackLinesDiyInfoHandler');
   
});
window.callbackLinesDiyInfoHandler = function(data){
   	if(data&&data.code ==0){
   		if(data.gitems.length > 0){
   			$(".prv-box").find("img").attr("src",data.gitems[0].ib);
   			$(".discribe").html(data.gitems[0].info || "")
   		}
    }
}