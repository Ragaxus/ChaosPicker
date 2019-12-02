function getPioneerChaosSetList() {
    return ["Return to Ravnica", "Gatecrash", "Dragon's Maze", "Theros", "Born of the Gods", "Journey into Nyx", "Khans of Tarkir", "Fate Reforged", "Dragons of Tarkir", "Battle for Zendikar", "Oath of the Gatewatch", "Shadows over Innistrad", "Eldritch Moon", "Kaladesh", "Aether Revolt", "Amonkhet", "Hour of Devastation", "Ixalan", "Rivals of Ixalan", "Dominaria", "Guilds of Ravnica", "Ravnica Allegiance", "War of the Spark", "Throne of Eldraine"]
}

function getPioneerChaosPackList() {
    return getPioneerChaosSetList().map(setName => {
        return {"setName":setName, "count":1}
    });
}

function populatePackSelectors() {
    var packPickerDiv = document.getElementById("packSelectors");
    getPioneerChaosSetList().map(setName => {
        var input = document.createElement("input");
        input.type = "number";
        input.setAttribute("size",2);
        input.setAttribute("maxlength",2);
        var label = document.createTextNode(setName);
        packPickerDiv.appendChild(input);
        packPickerDiv.appendChild(label);
        packPickerDiv.appendChild(document.createElement("p"));
    })
}

function addOneToAllPacks() {
    var packPickerDiv = document.getElementById("packSelectors");
    var inputs = packPickerDiv.getElementsByTagName("input");
    for (var idx=0; idx<inputs.length; idx++) {
        var input = inputs[idx];
        if(input.value === '') input.value = '1';
        else input.value ++;
    }
}

function doAssignment() {
    var packList = getPacksFromPage();
    var playerList = shuffle(document.getElementById("playerList").value.split('\n'));
    var assignments = assignPacksToPlayers(packList,playerList);
    displayAssignments(assignments);
    window.scrollTo(0,0);
}

function getPacksFromPage() {
    var setList = getPioneerChaosSetList();
    var packPickerDiv = document.getElementById("packSelectors");
    var inputs = packPickerDiv.getElementsByTagName("input");
    var packList = [];
    for (var i=0; i<inputs.length; i++) {
        var input = inputs[i];
        var pack = {};
        pack.count=parseInt(input.value);
        pack.setName=setList[i];
        if (pack.count > 0) packList.push(pack);
    }
    return packList;
}

//packList: [{setName:"name of set",count:#}]
//playerList: array of player names
//returns: [{player:"name of player", packs:[pack names]}]
function assignPacksToPlayers(packList,playerList) {
    var packDict = packList.reduce((result,thisPack) => {result[thisPack.setName]=thisPack.count; return result; },{});
    return playerList.map( player => {
        var assignation = {};
        assignation.player = player;
        assignation.packs = shuffle(Object.keys(packDict)).slice(0,3);
        assignation.packs.forEach(packName => {
            packDict[packName]--;
            if (packDict[packName] == 0) delete packDict[packName];
        });
        return assignation;
    });
}

function displayAssignments(assignments) {
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    var tr;
    var td;
    assignments.map((assignment,idx) => {
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.appendChild(document.createTextNode((idx+1) +". "+assignment.player));
        td.setAttribute('rowSpan', assignment.packs.length);
        tr.appendChild(td);
        for (var i=0; i<assignment.packs.length; (tr = document.createElement('tr')) && i++) {
            td = document.createElement('td');
            td.appendChild(document.createTextNode(assignment.packs[i]));
            tr.appendChild(td);
            tbdy.appendChild(tr);
        }
    });  
    tbl.appendChild(tbdy);
    document.getElementById("results").appendChild(tbl);
};

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }