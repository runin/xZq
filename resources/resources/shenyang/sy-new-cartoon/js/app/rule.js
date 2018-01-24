$(function() {
	getResult('common/activtyRule/'+service_no, {}, 'callbackRuleHandler', true);
});

window.callbackRuleHandler = function(data) {
	if (data.code == 0) {
		$('#rule').html(data.rule).removeClass('none');
	}
};