$('#pause').on('click', function () {
  $.ajax({ type: 'GET', url: '/api/pause' });
});
