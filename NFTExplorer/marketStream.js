var ssc;

$.when(
    $.getScript( "https://cdn.jsdelivr.net/npm/@hivechain/hivejs/dist/hivejs.min.js" ),
    $.getScript( "https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js" ),
    $.getScript( "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.27.0/moment.min.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
    ssc = new SSC('https://api.hive-engine.com/rpc');  
});

var currentTable = "";

var getData = function(contract, table, offSet) {
    return new Promise(function(resolve, reject) {  
        ssc.find(contract, table, {}, 1000, offSet, [], (err, result) => {          
            if (result) {
                APIDataJson = result;
                resolve(result);
            } else {
                reject(Error("Failed to get JSON data!")); 
            }
        });
    });
} 

async function loadStream() {
    if ($('#transactions').length){
        clearDiv("#transactions")
    } 
    currentTable = $("#game").val();
    table = currentTable + "tradesHistory"
    await getData('nftmarket', table, 0).then( function(result) {
        showData(result);
    });
}

function showData(data) {
    const currentTimeStamp = new Date().getTime();
    for (let i = 0; i < data.length; i++) {
        var div = jQuery('<div/>', {"class": 'tx-data'}).appendTo('#transactions');
        let buyer  = data[i].account;
        let buyerlink = "<a href='peakd.com/@'>" + buyer;
        let sellers = data[i].counterparties[0].account;
        let nfts = data[i].counterparties[0].nftIds;
        let price = parseFloat(data[i].price);
        let symbol = data[i].priceSymbol;
        let timestamp = data[i].timestamp;       
        nftList = '<a ' + 'target="_blank"' + ' href="https://okean123.github.io/NFTExplorer/lookup.html?table=' + currentTable + '&id=' + nfts[0] + '">'+ nfts[0] +'</a>' 
        for (let i = 1; i < nfts.length; i++) {
            nftList += ', <a ' + 'target="_blank"' + ' href="https://okean123.github.io/NFTExplorer/lookup.html?table=' + currentTable + '&id=' + nfts[i] + '">'+ nfts[i] +'</a>' 
        }

        $(div).append($('<p>' + '<a ' + 'target="_blank"' + ' href="https://peakd.com/@' + buyer + '">'+buyer+'</a>' + ' bought NFT(s) with ID(s) ' 
                        + nftList 
                        + ' from ' + '<a ' + 'target="_blank"' + ' href="https://peakd.com/@' + sellers + '">'+sellers+'</a>' + ' for ' + price + ' ' + symbol + ' ' + '<em>' + timeDifference(currentTimeStamp,timestamp * 1000) + '</em>' + '</p>'));
    }
}

function clearDiv(div) {
    $(div).empty();
}


function timeDifference(current, previous) {
    current = moment.utc(moment.unix(current))
    previous = moment.utc(moment.unix(previous))
    let diff = current.diff(previous, "minutes")
    if (diff >= 60) {
      return  `${current.diff(previous, "hours")} hours ago`
    }
    return `${diff} minutes ago`
     
}
