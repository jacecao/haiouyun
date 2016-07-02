require.config({
    paths : {
      "jquery" : "jquery.min"
    }
    
});

require(['jquery','renderUI'],function($,renderUI){
  var render = new renderUI.renderUI();
  $(window).resize(function(){
    render.changeBar();
  });
});