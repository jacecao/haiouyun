require.config({
    paths : {
      "jquery" : "jquery.min"
    }   
});
require(['jquery','renderUI','base'],function($,renderUI,Base){
 
  var render = new renderUI.renderUI();
  render.set_side_bar();
  var base = new Base.Base();
  base.side_bar_hander();
  $(window).resize( function(){
    render.set_side_bar();
  } );


});
