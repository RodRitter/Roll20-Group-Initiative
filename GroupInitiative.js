on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.indexOf("!CombatBegin") !== -1 || msg.content.indexOf("!cb") !== -1) {
        if(!msg.selected) {
            sendChat("", "/desc Error: No tokens are selected");
        } else {
            Campaign().set("initiativepage", true ); // Open Turn Tracker
            Campaign().set("turnorder", "");
            sendChat("", "/desc Adding Tokens to Turn Tracker");
            
            var players = [];
            
            // For Each Selected Token, Add To Turn Order
            _.each(msg.selected, function(selected) {
                var roll = Math.floor(Math.random() * 21);
                
                // add dex (blue counter) to roll
                var obj = findObjs({_id: selected._id})[0];
                var dex = obj.get("bar2_value");
                if(dex == "") {
                    dex = 0;
                }
                dex = parseInt(dex);
                
                sendChat("", "/desc "+obj.get("name")+": "+ roll +" (" + dex + ")");
                var toAdd = {
                    "id": selected._id,
                    "pr": roll+dex
                }
                
                players.push(toAdd);
            });
            
            // Order from highest to lowest PR
            players.sort(function(a, b){
                first = a.pr;
                second = b.pr;
                return second - first;
            });
            
            // Add Turn Order to Turn Tracker
            Campaign().set("turnorder", JSON.stringify(players));
        }
    } else if (msg.type == "api" && msg.content.indexOf("!CombatEnd") !== -1 || msg.content.indexOf("!ce") !== -1 ) {
        Campaign().set("turnorder", ""); // Empty Turn Tracker
        Campaign().set("initiativepage", false ); // Close Turn Tracker
    }
});
