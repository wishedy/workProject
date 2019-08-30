/**
 * 提示 助手
 */
function poshyTipHelperShow(selector, content) {
	var poshyCfg = {
		className : 'tip-yellow',
		content : "请输入价格区间",
		showOn : "none",
		alignTo : 'target',
		alignX : 'right',
		alignY : 'center',
		offsetX : 10,
		offsetY : 5
	};

	var o;
	if (typeof (selector) == "string")
		o = $(selector).eq(0);
	else {
		o = $(selector);
	}
	var elementTipCfg;
	eval("elementTipCfg = " + o.attr("tipCfg"));
	$.extend(poshyCfg, elementTipCfg);

	o.poshytip("hide");

	o.poshytip($.extend(poshyCfg, {
		"content" : content
	}));
	o.poshytip("show");
	o.parent().addClass("error");
	$("label").removeClass("error");
	$("input[type='checkbox']").removeClass(poshyCfg.className);
}

/**
 * poshyTip 提示错误的方法 作为validate的显示错误的方法
 */
function poshyTipShowErrors() {
	// alert("start...");
	var i, elements;
	 //alert(this.size());
	$("input,textarea,select").poshytip("hide");
	$(".error").removeClass("error");
	for (i = 0; this.errorList[i]; i++) {
		var error = this.errorList[i];
		if (this.settings.highlight) {
			this.settings.highlight.call(this, error.element,
					this.settings.errorClass, this.settings.validClass);
		}
		poshyTipHelperShow(error.element, error.message);
	}
	if (this.errorList.length) {
		this.toShow = this.toShow.add(this.containers);
	}
	if (this.settings.success) {
		for (i = 0; this.successList[i]; i++) {
			this.showLabel(this.successList[i]);
		}
	}
	if (this.settings.unhighlight) {
		for (i = 0, elements = this.validElements(); elements[i]; i++) {
			this.settings.unhighlight.call(this, elements[i],
					this.settings.errorClass, this.settings.validClass);
		}
	}
	this.toHide = this.toHide.not(this.toShow);
	this.hideErrors();
	this.addWrapper(this.toShow).show();
}

/**
 * poshyTip 提示错误的方法 作为validate的隐藏错误的方法
 */
function poshyTipHideErrors(element) {
	$(element).poshytip("hide");
}