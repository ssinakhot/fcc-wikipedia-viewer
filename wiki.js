var lastResultArray = ko.observableArray([]);
var lastTags = [];
function GetSearch(searchInput, showResults) {
  var myUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&redirects=return&format=json&callback=?&search=" + encodeURIComponent(searchInput);
  $.ajax({
    url: myUrl,
    dataType: 'jsonp',
    type: 'GET',
    headers: { 'Api-User-Agent': 'WikiSearchViewer/1.0 (zekikez@gmail.com)' },
    success: function(data) {
      var array = [];
      var arrayTags = [];
      for (var i=0; i < data[1].length; i++) {
        var obj = {
          name: data[1][i],
          desc: data[2][i],
          href: data[3][i]
        };
        arrayTags.push(obj.name); 
        array.push(obj);
      }
      if (showResults)
      {
        lastResultArray.removeAll();
        ko.utils.arrayPushAll(lastResultArray, array);
        if (array.length === 0)
        {
          $("#noresult label").text("No results found for '" + searchInput + "'.");
          $("#noresult").show();
          $("#result").hide();
        }
        else
        {
          $("#result").show();
          $("#noresult").hide();
        }
      }
      else {
        lastTags = arrayTags; 
      }
    }
  });
}

function SearchWiki() {
  var text = $("#searchInput").val();
  if (text !== "")
  {
    GetSearch(text, true);
    $("#searchInput").autocomplete("close");
  }
}
function Autocomplete() {
  var text = $("#searchInput").val();
  if (text.length > 1 && text !== "")
    GetSearch(text, false);
  else
  {
    $("#searchInput").autocomplete("close");
  }
}

$(document).ready(function() {
  var inputBox = $("#searchInput");
  inputBox.keyup(function(event) {
    if (!$("#title").hasClass("vertical-align"))
    {
      if (inputBox.val() === "")
      {
        $("#result").hide();
        $("#noresult").hide();
        $("#title h1").show();
        $("#title").addClass("vertical-align");
        $("#searchInput").autocomplete("close");
      }
    }
    else if (inputBox.val() !== "")
    {
      {
        $("#title h1").hide();
        $("#title").removeClass("vertical-align");
      }
    }
    var keyCode = event.keyCode || event.which;
    if(keyCode === 13)  // enter key
      SearchWiki(); 
    else
      Autocomplete();
  });
  $("button").on("click", function() {
    SearchWiki();
  });
  $("#searchInput").autocomplete({
    source: function(request, response) {
      response(lastTags);
    }
  });
  ko.applyBindings({
    data: lastResultArray
  });
});
