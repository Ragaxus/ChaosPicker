function initializeLandBag(format) {
  var landBag = {};
  var hasMore = true;
  var queryUrl = "https://api.scryfall.com/cards/search?q=t:land+format:"+format;
  while (hasMore) {
    fetch(queryUrl).then( function(response) {
      JSON.parse(response.getContentText());
      var landAmount;
      response.data.forEach(function (card, index) {
        if (card.type_line.includes("Basic")) landMaxAmount = 1000;
        else landMaxAmount = 4;
        landBag[card.name] = landMaxAmount;
      });
      hasMore = response.has_more;
      queryUrl = response.next_page;
    });
  }
  return landBag;
}
