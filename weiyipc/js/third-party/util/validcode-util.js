function bindChangeValidCode() {
	$("#changeValidCode").click(
			function() {
				$("#validCodeImg").attr("src",
						"randomValidCodeAction!create?_=" + Math.random());
	});
}