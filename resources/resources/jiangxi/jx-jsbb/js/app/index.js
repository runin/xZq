$(function() {
		hideLoading();
		$('#btn-begin').click(function(e) {
			e.preventDefault();
			toUrl("comments.html");
		});
		$("#rule").click(function(e){
			e.preventDefault();
			H.dialog.rule.open();
		});	
});
