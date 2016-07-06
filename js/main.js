require.config({
    paths : {
      "jquery" : "jquery.min"
    }   
});
require(['jquery','renderUI','base'],function($,renderUI,Base){
 
  var render = new renderUI.renderUI();
  render.set_bottom_bar();
  var base = new Base.Base();
  base.bottom_bar_hander();
  $(window).resize( function(){
    render.set_bottom_bar();
    base.bottom_bar_hander();
  } );


});
