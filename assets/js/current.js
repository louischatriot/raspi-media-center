$('#pause').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/pause' });
});


$('#stop').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/stop' });
});

$('#small-forward').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/small-forward' });
});
