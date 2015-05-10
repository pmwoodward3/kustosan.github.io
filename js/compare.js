// Get URL vars
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}

var pretext = "";
var text = "";

// Start everything if user is set
$(document).ready(function() {

  $.ajaxSetup({
    cache: false
  });
  var user = getUrlVars()["user"];
  var page = 1;
  if (user != undefined && user != "") {
    $('#updateBtn').html('<i class="fa fa-spinner fa-pulse"></i> Loading compatibilities...');
    $('.gprogress').html(user + "'s followed users anime taste compatibility")
    $('#btnExport').removeAttr("disabled")
    $('#exportTxt').removeAttr("disabled")

    do {
      // Get follow json
      $.jsonp({
        url: 'https://hummingbird.me/users?callback=?&followed_by=' + user + '&page=' + page, // any JSON endpoint
        jsonpSupport: true, // if URL above supports JSONP (optional)
        success: function(data) {

          // Get each follower compatibility
          jQuery.each(data.users, function(a, val) {

            $.getJSON('https://hbird-cmp-node.herokuapp.com/compatibility/anime?user1=' + user + '&user2=' + val.id + '&callback=asd', function(data) {

              $('#members').append('<tr id="ded"><td class="countTd"><b></b></td><td class="countNamu"><a style="color:#428bca;" href="https://hummingbird.me/users/' +
                val.id + '" target="_blank">' + val.id + '</a></td><td class="countPercent">' + data.percent + '</td><td>Stalked</td></tr>');
              $('th').removeAttr("data-sorted")
              $('th').removeAttr("data-sorted-direction")
              Sortable.init();
              for (var i = 0; i <= $('.countTd').length; i++) {
                $('.countTd:eq(' + i + ')').html('#' + (i + 1) + ' |');
              };
            })
          })
        }
      });
      page++
    }
    while (page != "100")
  }

  $("#btnExport").click(function() {
    $("#comp").table2excel({
      name: "Worksheet Name",
      filename: "followed" //do not include extension
    });
  });

});

// When all Ajax requests stop
$(document).ajaxStop(function() {

  $("#updateBtn").html('<i class="fa fa-check"></i> Enjoy! ^o^');
  $(".dedo").click(function() {
    for (var i = 0; i <= $('.countTd').length; i++) {
      $('.countTd:eq(' + i + ')').html('#' + (i + 1) + ' |');
    }
  })

  $("#exportTxt").click(function() {
    text = "";
    for (var i = 0; i <= $('.countTd').length; i++) {
      namu = $('.countNamu a:eq(' + i + ')').html();
      percent = $('.countPercent:eq(' + i + ')').html();
      pretext = (i + 1) + ': ' + namu + " - " + percent;
      text = text + '\n' + pretext;

      if (i == $('.countTd').length) {
        var blob = new Blob([text], {
          type: "text/plain;charset=utf-8;",
        });
        saveAs(blob, "Followed.txt");
      }
    }
  })

});
