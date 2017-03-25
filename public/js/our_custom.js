$(document).ready(function(){

  var s = skrollr.init({forceHeight: false}); // Initialize parallax

  $('#portrait').magnificPopup({
    type: 'ajax'
  });
  $(".rush-flyer").hover(
    function() {
      $(this).find('img').attr("src", "https://c1.staticflickr.com/4/3666/33479417552_577db86e2e_k.jpg");
    },
    function() {
      $(this).find('img').attr("src", "https://c1.staticflickr.com/4/3682/33506831321_76692f19fd_k.jpg");
    });
});
