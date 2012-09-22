jQuery( function( $ ) {
    var doc = $( document ),
        tripCalc = window.tripCalc || {};

    window.tripCalc = tripCalc;

    tripCalc.loadPage = function() {
        var itemList = $( '#item-list' ),
            itemTemplate = $( '#item-template').html(),
            ls = window.localStorage,
            i, l, item,
            newItem = '';

        for ( item in ls ) {
            if ( ls[ item ] ) {
                item = JSON.parse( ls[ item ] );
                if ( typeof( item ) === 'object' ) {
                    newItem = newItem.replace( '{value}', item.value );
                    newItem = newItem.replace( '{desc}', item.desc );
                    newItem = newItem.replace( '{id}', item.id );
                    itemList.prepend( newItem );
                } 
            }
        }
    };

    tripCalc.editDone = function( ev ) {
        if ( ev && ev.preventDefault ) {
            ev.preventDefault();
            ev.stopPropagation();
            
        }

        var li = $( this ).closest( '.calc-item' );

        $( '.calc-item .editable' ).each( function() {
            $( this ).removeAttr( 'contenteditable' );
        });

        li.addClass( 'editable' );

        tripCalc.saveItem( li );
        tripCalc.sum();
    };

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
            value = self.find( '.value' ).text(),
            desc = self.find( '.description' ).text(),
            ls = window.localStorage;

        if ( value === '' ) {
            return;
        }

        self.data( 'id', itemId );

        ls[ 'tripItems' + '|y|y|' + itemId ] = "{ \"id\": \"" + itemId + "\", \"value\" : \"" + value + "\", \"desc\" : \"" + desc + "\" }";
    };

    tripCalc.addItem = function ( ev ) {
        ev.preventDefault();
        ev.stopPropagation();

        var itemList = $( '#item-list' ),
            itemTemplate = $( '#item-template').html(),
            newItem = '';
        
        newItem = newItem.replace( '{value}', '0.00' );
        newItem = newItem.replace( '{desc}', 'description' );
        newItem = newItem.replace( '{id}', Date.now() );
        itemList.prepend( newItem );

        itemList.find( 'li' ).first().find( '.value' ).focus().trigger( 'click' );
    };

    tripCalc.sum = function () {
        var total = 0;
        $( '.calc-item' ).each( function() {
            total += parseFloat( $(this).find('.value').text(), 10 );
        });

        $('.calc-total .value').text( total );
    };


    // init
    doc.on( 'click touchDown touch', '.calc-item.editable', tripCalc.editItem );
    doc.on( 'click touchDown touch', '.item-action', tripCalc.editDone );
    doc.on( 'click touchDown touch', '.add', tripCalc.addItem );
    tripCalc.loadPage();


    $("#config-app").hide();

    $(".moedas").click(function(){
        $(".moedas").removeClass('active');
        $(this).addClass('active');
    })

    $("#bt-config").click(function(){
        $("#content-app").hide();
        $("#config-app").show();
    })

    $("#back-preview").click(function(){
        $("#config-app").hide();
        $("#content-app").show();
    })


});