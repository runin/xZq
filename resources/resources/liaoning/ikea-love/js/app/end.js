$(function(){
	if(nickname != null && headimgurl != null){
		$("#userName").html(nickname);
		$("#userImg").attr('src',headimgurl + "/" + yao_avatar_size);
	}
});