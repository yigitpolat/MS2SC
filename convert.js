$(document).ready(function(){
   $("#convert").click(function(){
	let code = editor2.getSession().getValue();
	let encoded = encodeURIComponent(code );

	$.ajax({
            type: "POST",
            url: "http://www.verysimplecpu.org/simulator_py/execute.cgi",
            data: "sourceCode="+encoded,

            success: function(html){
				let res = html.replace(/\n\s+\n/g, '\n');
				res = res.split("%%%%EndOfCode%%%%");
				editor3.getSession().setValue(res[0]);
            },
            beforeSend:function()
			{
				 editor3.getSession().setValue("Please Wait While Converting");
            },

        });
         return false;

    });
});