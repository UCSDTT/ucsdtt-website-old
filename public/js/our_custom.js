$(document).ready(function(){

  var s = skrollr.init({forceHeight: false}); // Initialize parallax

  $('#portrait').magnificPopup({
    type: 'ajax'
  });
  $(".rush-flyer").hover(
    function() {
      $(this).find('img').attr("src", "images/thetatau_back.jpg");
    },
    function() {
      $(this).find('img').attr("src", "images/thetatau_front.jpg");
    });
});
