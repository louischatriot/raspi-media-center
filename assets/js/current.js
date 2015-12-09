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
  var changingSlider = false;
  duration = parseInt($('#duration').html(), 10);
  position = 0;
  updatePositionText();

  // Update HUD in real time
  $('#positionSlider').on('input', function (e) {
    changingSlider = true;
    var v = parseInt($('#positionSlider').val(), 10);
    position = Math.floor(duration * v / 1000);
    updatePositionText();
  });

  // Once drag is finished, update final position and server
  $('#positionSlider').on('change', function (e) {
    setTimeout(function () {   // Prevent small glitch
      changingSlider = false;
    }, 3000);
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
      if (jqxhr.status !== 200 && jqxhr.status !== 304) {
        $('#playingSomething').css('display', 'none');
        $('#playingNothing').css('display', 'block');
        return;
      }

      if (!changingSlider) {
        duration = Math.floor(jqxhr.responseJSON.duration / 1000000);
        position = Math.floor(jqxhr.responseJSON.position / 1000000);
        $('#positionSlider').val(Math.floor(1000 * position / duration));
        updatePositionText();
      }

      if (jqxhr.responseJSON.position) {
        $('#playingSomething').css('display', 'block');
        $('#playingNothing').css('display', 'none');
      } else {
        $('#playingSomething').css('display', 'none');
        $('#playingNothing').css('display', 'block');
      }
    });
  }, 400);
});
