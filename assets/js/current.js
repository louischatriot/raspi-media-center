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

