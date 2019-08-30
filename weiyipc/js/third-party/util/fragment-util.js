function getFragments() {
	$("[fragment]").each(function() {
		var url = $(this).attr("fragment");
			//alert(url);
		$(this).load(url,function(responseText,textStatus,XMLHttpRequest){$(this).responseText});
	});
}