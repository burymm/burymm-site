/**
 * Created by nikolay.bury on 29.11.13.
 */

$(document).ready(function() {


   $('#copy-clipboard-button').on('click', function() {
       alert('click');
        // work with clipboard
        var $buffer = $('#copy-clipboard-button');

        $buffer.attr('data-clipboard-text', 'hello world');

        var clip = new ZeroClipboard( document.getElementById("copy-clipboard-button"), {
            moviePath: "js/vendor/ZeroClipboard.swf"
        } );


        clip.on( "load", function(client) {
            // alert( "movie is loaded" );

            client.on( "complete", function(client, args) {
                // `this` is the element that was clicked
                //this.style.display = "none";
                //alert("Copied text to clipboard: " + args.text );
            } );
        });

        $buffer.trigger('click');
   });

    $('#copy-clipboard-button').on('click', function() {
        alert('bebeb');
    });

});
