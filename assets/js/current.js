var duration, position;

$('#pause').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/pause' });
});


$('#stop').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/stop' });
});

$('#small-forward').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/small-forward' });
});

$('#small-backward').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/small-backward' });
});

$('#big-forward').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/big-forward' });
});

$('#big-backward').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/big-backward' });
});



function updatePositionText() {
  var msg = position + ' / ' + duration;
  $('#position').html(msg);
}


$(document).ready(function () {
  duration = parseInt($('#duration').html(), 10);
  position = 0;
  updatePositionText();

  // Update HUD in real time
  $('#positionSlider').on('input', function (e) {
    var v = parseInt($('#positionSlider').val(), 10);
    position = Math.floor(duration * v / 1000);
    updatePositionText();
  });

  // Once drag is finished, update final position and server
  $('#positionSlider').on('change', function (e) {
    var v = parseInt($('#positionSlider').val(), 10);
    position = Math.floor(duration * v / 1000);
    updatePositionText();
    $.ajax({ type: 'POST', url: '/api/position'
       , dataType: 'json', contentType:"application/json; charset=utf-8"
       , data: JSON.stringify({ position: position }) });
  });
});
