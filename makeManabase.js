function makeManabase() {
  var format = document.querySelector('input[name="format"]:checked').value;
  var numLands = document.getElementsByName('numLands').item(0).value;
  createLandBag(format).then(landBag => { 
     var manaBase = {};
     for (var i = 0; i < numLands; i++) {
       var availableLands = Object.keys(landBag);
       nextLandIdx = Math.floor(Math.random() * (availableLands.length+1));
       nextLand = availableLands[nextLandIdx];
       if (nextLand in manaBase) manaBase[nextLand]++;
       else manaBase[nextLand] = 1;
       landBag[nextLand]--;
       if (landBag[nextLand] < 1) delete landBag[nextLand];
     }
     var resultsDiv = document.getElementById("results");
     resultsDiv.innerHTML = "";
     for (var land in manaBase) {
      resultsDiv.appendChild(document.createTextNode(manaBase[land]+" "+land));
      resultsDiv.appendChild(document.createElement("br"));
     }
  });

}

function createLandBag(format) {
  var queryUrl = "https://api.scryfall.com/cards/search?q=-is:transform+t:land+format:"+format;
  return queryForLands(queryUrl,{});
}

function queryForLands(queryUrl,landBag) {
  return new Promise(function(resolve, reject) {
    var newLandBag = landBag;
    fetch(queryUrl).then(response => response.json())
    .then( respJson => {
      var landMaxAmount;
      respJson.data.forEach(function (card, index) {
        if (card.type_line.includes("Basic")) landMaxAmount = 1000;
        else landMaxAmount = 4;
        newLandBag[card.name] = landMaxAmount;
      });
      if (respJson.has_more) {
        queryUrl = respJson.next_page;
        queryForLands(queryUrl,newLandBag).then(nextLandBag => resolve(nextLandBag));
      }
      resolve(newLandBag);
    });
  });
}
