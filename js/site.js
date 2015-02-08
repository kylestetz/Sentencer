$( function() {

  var $input  = $('[data-input]');
  var $output = $('[data-output]');
  var $render = $('[data-render]');
  var $spookyRender = $('[data-spooky-render]');

  //////////////////////////////////

  function renderText(template, spooky) {
    $.post(
      'http://kylestetz.com/' + (spooky ? 'spooky' : 'sentencer'),
      { template: template },
      function(data) {
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