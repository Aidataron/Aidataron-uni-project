AOS.init();

$(".txtb input").on("focus",function(){
    $(this).addClass("focus");
  });

  $(".txtb input").on("blur",function(){
    if($(this).val() == "")
    $(this).removeClass("focus");
  });

 
                // $("button").click(function() { 
                //     if ($("input[type=checkbox]").prop( 
                //       "checked")) { 
                //         alert("Check box in Checked"); 
                //     } else { 
                //         alert("Check box is Unchecked"); 
                //     } 
                // });
// $(".check").click(function(){
// 	if(!$('input[type="checkbox"]').prop("checked")){
// 		$("#accept").attr("checked", "checked");
// 		$("button").removeAttr("disabled");
// 	}else if($('input[type="checkbox"]').prop("checked")){
// 		$("#accept").removeAttr("checked");
// 		alert ("You must accept the Policy Privacy");
// 	}
// })

// 		$("button").click(function(){
// 		if(! $("#accept").attr("checked")) {
		
			
// 		}else{
			
// 		}
// 		})



// (function(){
// 	var check = false;
// 	$(".check").click(function(){
// 		check = true;
// 		if(check){
// 			$("#accept").attr("checked", "checked");
// 		}
	
// })
// })

 // $(document).ready(function(){
 //        $('input[type="checkbox"]').click(function(){
 //            if($(this).prop("checked") == true){
 //                $("button").removeAttr("disabled")
 //            }
 // $("button").click(function(){
 // if($(this).prop("checked") == false){
				
 //                alert("You must check privacy policy");
 //            }
 // })
            
 //        });
 //    });





// (function() {
//   var toggled = false;
//   $(".list-toggle").click(function() {
//     toggled = !toggled;
//     $(".list-sort").attr("colspan", toggled ? 6 : null);
//   });
// })();