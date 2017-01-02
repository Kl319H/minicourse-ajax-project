
function loadData(event) {
  event.preventDefault();

  var $body = $('body');
  var $wikiElem = $('#wikipedia-links');
  var $nytHeaderElem = $('#nytimes-header');
  var $nytElem = $('#nytimes-articles');
  var $greeting = $('#greeting');
  // clear out old data before new request
  $wikiElem.text("");
  $nytElem.text("");
  // load streetview
  var street = event.target[0].value;
  var city = event.target[1].value;
  var streetPicURL = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + street + "," + city;
  streetPicURL = encodeURI(streetPicURL);
  var imageTag = '<img class="bgimg" src="'+streetPicURL+'">';
  $body.append(imageTag);
  $greeting.text("So you want to live at " + street + ", " + city);


  var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  url += '?' + $.param({
    'api-key': "5d4b40e239b64239a3cd0c5b9fe2c027",
    'q': city,
    'sort': 'newest'
  });
  console.log(url);
  $.getJSON(url, function(data) {
    //console.log(data);
    $nytHeaderElem.text("NY Times Articles About " + city);

    $.each(data.response.docs, function(key, article) {
      var listItem = '<li class="article">'+
      '<a href="'+article.web_url+'" target="_blank">'+article.headline.main+'</a>'+
      '<p>'+article.snippet+'</p>'+
      '</li>';
      $nytElem.append(listItem);
      //console.log(key, article);
    });
  }).fail(function(jqxhr, textStatus, error) {
    console.log(jqxhr, textStatus, error);
    var listItem = '<li class="article">'+
    '<h3>'+"Could Not Load Articles"+'</h3>'+
    '</li>';
    $nytElem.append(listItem);
  });


  var wikiUrl = "https://en.wikipedia.org/w/api.php";

  wikiUrl += '?' + $.param({
    'action': 'opensearch',
    'callback': 'wikiCallback',
    'search': city,
    'prop': 'revisions',
    'rvprop': 'content',
    'format': 'json'
  });

var wikiRequestTimeout = setTimeout(function(){
  $wikiElem.text("Could Not Load Wiki Links");
}, 8000);

  $.ajax( {
      url: wikiUrl,
      dataType: 'jsonp',

  }).done(function(data) {
    console.log(data);
    clearTimeout(wikiRequestTimeout);
    if (data.error){
      var listItem = '<li class="article">'+
      '<h3>'+"Could Not Load Wiki Links"+'</h3>'+
      '</li>';
      $wikiElem.append(listItem);      return;
    }
    var linkTexts = data[1];
    var paragraphs = data[2];
    var links = data[3];
    $.each(links, function(key, link) {
      var text = linkTexts[key];
      var paragraph = paragraphs[key];
      var listItem = '<li class="article">'+
      '<a href="'+link+'" target="_blank">'+text+'</a>'+
      '<p>'+paragraph+'</p>'+
      '</li>';
      $wikiElem.append(listItem);
      //console.log(key, article);
    });
});

  return false;
};

$('#form-container').submit(loadData);
