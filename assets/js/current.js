var duration, position;

$('#pause').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/pause' });
});


$('#stop').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/stop' });
});



function niceTimeFormat (s) {
  var h = Math.floor(s / 3600);
  s = s - 3600 * h;
  var m = Math.floor(s / 60);
  s = s - 60 * m;
  var msg = '';

  if (h > 0 ) { msg += h + ':'; }
  if (m > 0 ) { msg += m + ':'; }
  msg += s;
  return msg;
}


function updatePositionText () {
  var msg = niceTimeFormat(position) + ' / ' + niceTimeFormat(duration);
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

  // Poll server regularly to get updates
  setInterval(function () {
    $.ajax({ type: 'GET', url: '/api/status' }).complete(function (jqxhr) {
      console.log(jqxhr.responseJSON);
    });
  }, 800);
});
