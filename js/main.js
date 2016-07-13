require.config({
    paths : {
      "jquery" : "jquery.min"
    }   
});
require(['jquery','base'],function($,Base){
  
  var base = new Base.Base();
  base.bottom_bar_hander();
  $(window).resize( function(){
    base.bottom_bar_hander();
  } );


});
