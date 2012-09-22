jQuery( function( $ ) {
    var doc = $( document ),
        tripCalc = window.tripCalc || {};

    window.tripCalc = tripCalc;

    tripCalc.loadPage = function() {
        var itemList = $( '#item-list' ),
            itemTemplate = $( '#item-template'),
            ls = window.localStorage,
            i, l;


    };

    tripCalc.editDone = function( ev ) {
        if ( ev && ev.preventDefault ) {
            ev.preventDefault();
            ev.stopBubbling();
        }

        $( '.calc-item .editable' ).each( function() {
            $( this ).removeAttr( 'contenteditable' );
        });

        $( this ).addClass( 'editable' );

        tripCalc.saveItem( this );
    }

    tripCalc.editItem = function( ev ) {
        if ( ev && ev.preventDefault ) {
            ev.preventDefault();
        }

        var self = $( this ),
            editable = self.find( '.editable' );

        tripCalc.editDone();

        editable.each( function() {
            $( this ).attr( 'contenteditable', '' );
        });
    };

    tripCalc.saveItem = function( elem ) {
        if ( !elem ) {
            return;
        }

        var self = $( elem ),
            itemId = self.data( 'id' ) || Date.now(),
            qtt = self.find( '.qtt' ).text(),
            value = self.find( '.value' ).text(),
            desc = self.find( '.description' ).text(),
            ls = window.localStorage;

        self.data( 'id', itemId );

        ls['tripItems'] = ls['tripItems'] || [];

        ls['tripItems'].itemId = {
            qtt : qtt,
            value : value,
            desc : desc,
            lastUpdated : Date.now()
        };
    };

    doc.on( 'click touchDown touch', '.calc-item.editable', tripCalc.editItem );
    doc.on( 'click touchDown touch', '.item-action', tripCalc.editDone );
});