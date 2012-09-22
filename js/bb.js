jQuery( function( $ ) {
    var doc = $( document ),
        tripCalc = window.tripCalc || {};

    window.tripCalc = tripCalc;

    var Currency = {
      //Rates are USD based
      rates: null,

      init: function(cb) {
          if (Currency.rates !== null) {
            cb();
            return;
          }

          $.getJSON(
              "http://openexchangerates.org/latest.json",
              function(data) {
                  Currency.rates = data.rates;
                  if (cb !== undefined) {
                    cb();
                  }
                  tripCalc.sum();
              }
          );
      },

      getRate: function(value, currencyFrom, currencyTo) {
          var dollarValue = value / Currency.rates[currencyFrom];
          var toValue = dollarValue * Currency.rates[currencyTo];
          return toValue;
      }
    };

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
                    newItem = itemTemplate.replace( '{value}', item.value );
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
        
        newItem = itemTemplate.replace( '{value}', '0.00' );
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

        $('.calc-total .value').text( 'R$ ' + Currency.getRate( total, 'USD', 'BRL' ) );
    };

    tripCalc.keyDown = function( ev ) {
        if ( ev.keyCode === 13 ) {
            tripCalc.editDone.call( this, ev );
            return false;
        }
    };


    // init
    Currency.init();
    doc.on( 'click touchDown touch', '.calc-item.editable', tripCalc.editItem );
    doc.on( 'click touchDown touch', '.item-action', tripCalc.editDone );
    doc.on( 'click touchDown touch', '.add', tripCalc.addItem );
    doc.on( 'keydown', '.calc-item', tripCalc.keyDown );
    tripCalc.loadPage();
});