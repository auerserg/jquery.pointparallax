/* jquery.pointparallax
 -- version 1.0.2
 -- copyright 2018-02-28 BlackSiriuS*2018
 -- licensed under the GNU
 --
 -- https://github.com/BlackSiriuS/jquery.pointparallax
 --
 */
( function ( $ ) {
    $.fn.pointparallax = function ( so ) {
        var so = so || { },
            sd = {
                itemsSelector: '.point__item',
                items: { },
                itemIncludeMargin: false,
                position: null,
                autoheight: false,
                autoheightClass: 'pointparallax-autoheight',
                fixedClass: 'pointparallax-fixed',
                point: 'center',
                path: 100,
                easing: 'linear',
                stoponpoint: true,
            },
            s = $.extend( true, { }, sd, so ),
            parse_Float = function ( value ) {
                function check( value ) {
                    if ( 'number' === typeof value )
                        return value;
                    if ( 'string' === typeof value )
                        try {
                            value = value.replace( /[^0-9\.-]+/g, '' );
                            value = parseFloat( value );
                            if ( isNaN( value ) ) {
                                return 0;
                            }
                            return value;
                        } catch ( err ) {
                            return 0;
                        }
                    return 0;
                }
                if ( 'object' === typeof value ) {
                    for ( var i in value )
                        value[i] = check( value[i] );
                    return value;
                }
                return check( value );
            },
            parse_Position = function ( position ) {
                if ( 'string' !== typeof position )
                    return position;
                var _position = position.split( '-', 2 ).map( function ( value ) {
                    switch ( value ) {
                        case 'left':
                        case 'top':
                            return 0;
                        case 'middle':
                        case 'center':
                            return .5;
                        case 'right':
                        case 'bottom':
                            return 1;
                    }
                    return parse_Float( value ) / 100;
                } );
                _position[1] = 'undefined' === typeof _position[1] ? _position[0] : _position[1];
                return _position;
            };
        return $( this ).each( function () {
            var $this = $( this ),
                $items = $this.find( s.itemsSelector );
            if ( s.autoheight )
                $this.addClass( s.autoheightClass );
            if ( s.fullshow )
                $this.addClass( s.fullshowClass );
            if ( $this.data( 'point' ) )
                $this.data( 'point', parse_Position( $this.data( 'point' ) ) );


            $.each( s.items, function ( index, value ) {
                var $item = $this.find( index );
                $.each( value, function ( index, value ) {
                    $item.data( index, value );
                } );
                if ( $item.length )
                    $items = $items.not( $item );
                $items = $items.add( $item );
            } );

            if ( 'relative' !== $this.css( 'position' ) )
                $this.css( 'position', 'relative' );
            $items.each( function () {
                var $item = $( this );
                if ( 'absolute' != $item.css( 'position' ) )
                    $item.css( 'position', 'absolute' );
                $item.data( 'position', parse_Position( $item.data( 'position' ) || s.position ) );
            } );

            $this.off( 'autoheight.pointparallax' ).on( 'autoheight.pointparallax', function ( event, settings ) {
                var settings = settings || s,
                    max = 0;
                $items.each( function () {
                    max = Math.max( max, $( this ).outerHeight( settings.itemIncludeMargin ) + ( !$( this ).data( 'position' ) ? $( this ).position().top : 0 ) );
                } );

                $this.height( max );
            } ).off( 'minsize.pointparallax' ).on( 'minsize.pointparallax', function ( event, settings ) {
                var settings = settings || s,
                    max = [ 0, 0 ],
                    $this = $( this ),
                    $this_padding = parse_Float( $this.css( [ 'padding-top', 'padding-right', 'padding-bottom', 'padding-left' ] ) ),
                    $this_padding = [ $this_padding['padding-right'] + $this_padding['padding-left'], $this_padding['padding-top'] + $this_padding['padding-bottom'] ];
                $items.each( function () {
                    max[0] = Math.max( max[0], $( this ).outerWidth( settings.itemIncludeMargin ) + $this_padding[0] );
                    max[1] = Math.max( max[1], $( this ).outerHeight( settings.itemIncludeMargin ) + $this_padding[1] );
                } );
                $this.css( {
                    'min-width': max[0],
                    'min-height': max[1],
                } );

            } ).off( 'position.pointparallax' ).on( 'position.pointparallax', function ( event, settings ) {
                var settings = settings || s,
                    $this = $( this ),
                    $this_size = [ $this.width(), $this.height() ],
                    $this_padding = parse_Float( $this.css( [ 'padding-top', 'padding-left' ] ) ),
                    $this_padding = [ $this_padding['padding-left'], $this_padding['padding-top'] ];
                $items.each( function () {
                    var $item = $( this ),
                        position = $item.data( 'position' );
                    if ( !position )
                        return;
                    position = parse_Position( position );
                    $item.data( 'position', position );
                    var _position = [ ],
                        $item_size = [ $item.outerWidth( settings.itemIncludeMargin ), $item.outerHeight( settings.itemIncludeMargin ) ];
                    for ( var i = 0; i < 2; i++ )
                        _position[i] = $this_padding[i] + ( $this_size[i] - $item_size[i] ) * position[i];
                    $item.css( {
                        left: _position[0],
                        top: _position[1]
                    } );
                } );
            } ).off( 'resize.pointparallax' ).on( 'resize.pointparallax', function ( event, settings ) {
                var settings = settings || s;
                if ( $this.hasClass( settings.autoheightClass ) ) {
                    $this.trigger( 'autoheight.pointparallax', settings );
                }
                $this.trigger( 'minsize.pointparallax', settings ).trigger( 'position.pointparallax', settings );
                requestAnimationFrame( update );
            } ).off( 'scroll.pointparallax' ).on( 'scroll.pointparallax', function ( event, settings ) {
                var settings = settings || s,
                    progress = {
                        wst: $( window ).scrollTop(),
                        wh: $( window ).height(),
                        tot: $this.offset().top,
                        toh: $this.outerHeight(),
                    };
                if ( progress.wst + progress.wh + 20 < progress.tot || progress.tot + progress.toh + 20 < progress.wst )
                    return;
                requestAnimationFrame( update );
                progress = ( progress.wst - progress.tot + progress.wh ) / ( progress.wh + progress.toh );
                $this.trigger( 'update.pointparallax', progress, s, $items );
            } ).off( 'init.pointparallax' ).on( 'init.pointparallax', function ( event, settings ) {
                $this.trigger( 'resize.pointparallax', settings ).trigger( 'inited.pointparallax', settings );
            } );
            function update() {
                var progress = {
                    wst: $( window ).scrollTop(),
                    wh: $( window ).height(),
                    tot: $this.offset().top,
                    toh: $this.outerHeight(),
                },
                    point = $this.data( 'point' ) || s.point,
                    path = $this.data( 'path' ) || s.path,
                    easing = $this.data( 'easing' ) || s.easing,
                    stoponpoint = s.stoponpoint,
                    $this_padding = parse_Float( $this.css( [ 'padding-top', 'padding-left' ] ) ),
                    $this_padding = [ $this_padding['padding-left'], $this_padding['padding-top'] ],
                    $this_size = [ $this.width(), $this.height() ],
                    _progress;
                progress = ( progress.wst - progress.tot + progress.wh ) / ( progress.wh + progress.toh );
                if ( 0 > progress )
                    progress = 0;
                if ( 1 < progress )
                    progress = 1;
                _progress = progress;
                if ( 'function' === typeof easing ) {
                    progress = easing( progress );
                } else if ( 'string' === typeof easing ) {
                    if ( 'function' === typeof jQuery.easing[ easing ] ) {
                        progress = jQuery.easing[ easing ]( progress );
                    }
                }

                $items.each( function ( index ) {
                    var $item = $( this );
                    if ( $item.hasClass( s.fixedClass ) )
                        return;
                    var $item_point = parse_Position( $item.data( 'point' ) || point ),
                        $item_path = ( $item.data( 'path' ) || path ) / 100,
                        $item_easing = $item.data( 'easing' ),
                        $item_position = parse_Float( $item.css( [ 'left', 'top' ] ) ),
                        $item_position = [ $item_position.left, $item_position.top ],
                        $item_size = [ $item.outerWidth( s.itemIncludeMargin ), $item.outerHeight( s.itemIncludeMargin ) ],
                        translate = [ ],
                        $item_path_progress;
                    if ( 'string' === typeof $item_easing ) {
                        if ( 'function' === typeof jQuery.easing[ $item_easing ] ) {
                            progress = jQuery.easing[ $item_easing ]( _progress );
                        }
                    }
                    $item_path_progress = $item_path * progress;
                    if ( stoponpoint && 1 < $item_path_progress ) {
                        $item_path_progress = 1;
                    }

                    for ( var i = 0; i < 2; i++ ) {
                        $item_point[i] = $item_point[i] * ( $this_size[i] - $item_size[i] ) + $this_padding[i];
                        translate[i] = ( $item_point[i] - $item_position[i] ) * $item_path_progress;
                    }

                    $item.css( 'transform', 'translate3d(' + translate[0] + 'px, ' + translate[1] + 'px, 0)' );
                } );
            }

            $( window ).on( 'resize', function ( event ) {
                $this.trigger( 'resize.pointparallax', s );
            } ).on( 'scroll', function ( event ) {
                $this.trigger( 'scroll.pointparallax', s );
            } );
            $this.trigger( 'init.pointparallax', s );
        } );
    };
} )( jQuery );