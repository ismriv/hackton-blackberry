jQuery( function( $ ) {
    var doc = $( document ),
        tripCalc = window.tripCalc || {};

    window.tripCalc = tripCalc;

    tripCalc.editItem = function() {
        if ( arguments[0] && arguments[0].preventDefault ) {
            arguments[0].preventDefault();
        }

        
    };

    doc.on( 'click', '.calc-item.editable', tripCalc.editItem );
    doc.on( 'click', '.item-action', tripCalc.editDone );
});