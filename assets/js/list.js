// Manage delete
$('a.delete').on('click', function (e) {
  e.preventDefault();

  if (! confirm("Are you sure you want to delete " + $(this).data('name'))) { return; }

  var id = $(this).data('id');
  $.ajax({ type: 'GET', url: '/api/delete/' + id }).complete(function () {
    document.location.reload();
  });
});

// Manage upload
$('#file').on('change', function () {
  $('#file-name').val($(this).val().replace('C:\\fakepath\\', ''));
});

$('#file-name').on('click', function () {
  $('#file').click();
  $(this).blur();
});

$('#launch-upload').on('click', function () {
  var formData = new FormData($('#upload-form').get()[0]);
  var req = new XMLHttpRequest();
  req.open('POST', '/api/upload/' + $('#current-dir-base64').html(), true);

  req.upload.onprogress = function (e) {
    var progress = 100 * e.loaded / e.total;
    $('#progress-bar').css('display', 'block');
    $('#progress-bar-inner').css('width', progress + '%');
  };

  req.onload = function () {
    document.location.reload();
  };

  req.send(formData);
});
