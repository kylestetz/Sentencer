$( function() {

  var tap = !!('ontouchstart' in window) || !!('msmaxtouchpoints' in window.navigator);
  $('body').addClass(tap ? 'tap' : 'no-tap');

  //////////////////////////////////

  var $input  = $('[data-input]');
  var $output = $('[data-output]');
  var $render = $('[data-render]');
  var $spookyRender = $('[data-spooky-render]');

  var makingRequest = false;

  //////////////////////////////////

  function renderText(template, spooky) {
    // no ajaxing if we're already ajaxing.
    if(makingRequest) {
      return;
    }
    // dim the output to indicate that we're waiting
    makingRequest = true;
    $output.toggleClass('dim', true);

    $.post(
      'http://kylestetz.com/' + (spooky ? 'spooky' : 'sentencer'),
      { template: template },
      function(data) {
        makingRequest = false;
        $output.toggleClass('dim', false);
        $output.html(data);
      }
    );
  }

  //////////////////////////////////

  $input.on('keypress', function(e) {
    if(e.which === 13) {
      e.preventDefault();
      renderText($input.html());
    }
  });

  $render.on('click', function(e) {
    renderText($input.html());
  });

  $spookyRender.on('click', function(e) {
    renderText($input.html(), true);
  });

  //////////////////////////////////

  renderText($input.html());

});