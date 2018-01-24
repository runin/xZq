window.onload = function() {
		labels = document.getElementById('male').getElementsByTagName('label');
		radios = document.getElementById('male').getElementsByTagName('input');
		for (i = 0, j = labels.length; i < j; i++) {
			labels[i].onclick = function() {
				if (this.className == '') {
					for (k = 0, l = labels.length; k < l; k++) {
						labels[k].className = '';
						radios[k].checked = false;
					}
					this.className = 'checked';
					try {
						document.getElementById(this.name).checked = true;
					} catch (e) {
					}
				}
			}
		}
	}

$(function() {
	$(".passwordShow").click(function() {
		if ($(this).attr("id") == 'sex_male') {
			$(".djqr").show();
		}
	});
	$(".djqr").hide();

	$(".passwordchanneldetail").click(
			function() {
				if ($(this).attr("id") == 'sex_female') {
					window.location.href = "select2.html";
				}
			});
	$(".djqr").hide();

	$(".passwordtrendsdetail").click(function() {
		if ($(this).attr("id") == 'sex_nomale') {
			$(".djqr").show();
		}
	});
	$(".djqr").hide();
});