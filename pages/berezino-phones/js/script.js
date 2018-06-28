/* Author:
      burymm
*/

function show(taffyObj, foundsDiv) {
    taffyObj.each(function (record, recordNumber) {
        var li = $('<li class="found-row"></li>');
        li.html(record['lastName'] + ' ' + record['firstName'] + ' ' + record['middleName'] + ' ' + record['phone']);
        foundsDiv.append(li);
    });

}

$(function() {
    $('#findBtn').on('click', function(event) {
        //console.log('Click detected');
        var founds, foundsDiv = $('#founds'), query = $('#query');
        event.preventDefault();
        foundsDiv.html('');

        show(phones({"lastName": {"likenocase": query.val()}}), foundsDiv);
        show(phones({"phone": {"likenocase": query.val()}}), foundsDiv);
        /*founds.push(phones({"lastName": {"likenocase":"абрам"}})).push(phones({"phone": {"likenocase":"5-16"}}));
        console.log(founds.count());
        founds.each(function (record, recordNumber) {
            var div = $('<div class="found-row"></div>');
            div.html(record['lastName'] + ' ' + record['firstName'] + ' ' + record['phone']);
            foundsDiv.append(div);
        });*/
        /*for (var i = 0; i < founds.count(); i += 1){
            var div = $('<div class="found-row"></div>');
            div.html(founds[i] + ' ' + founds[i].firstName + ' ' + founds[i].phone);
            foundsDiv.append(div);
        } */
    });
})



var cvsTA = $('#cvs'),
    jsonTA = $('#json');

$('#convert').on('click', function() {
    var text = cvsTA.val(),
    arr = text.replace(/"/g,'').split(/\n|;/),
    arrLength = arr.length, outJSON = [];
    for (var ind = 0; ind + 5 < arrLength; ind+= 6) {
        outJSON.push({'lastName': arr[ind], 'firstName': arr[ind + 1],
                    'middleName': arr[ind + 2], 'locality': 'Березино',
                    'streetType': arr[ind + 3], 'street': arr[ind + 4],
                    'phone': arr[ind + 5].replace(/-/g, '')});
    }
    console.log(JSON.stringify(outJSON));
    jsonTA.val(JSON.stringify(outJSON));
});

console.log(phones({"lastName": {"likenocase":"абрам"}}).first().lastName);




