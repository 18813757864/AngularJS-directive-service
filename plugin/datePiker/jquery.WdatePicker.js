$(function(){
	
	$('body').delegate('.datepicker-date','focus', function(){
		WdatePicker({dateFmt:"yyyy-MM-dd"});
	});
	
	$('body').delegate('.datepicker-time','focus', function(){
		WdatePicker({dateFmt:"HH:mm:ss"});
	});
	
	$('body').delegate('.datepicker-datetime','focus', function(){
		WdatePicker({dateFmt:"yyyy-MM-dd HH:mm:ss"});
	});
	
});