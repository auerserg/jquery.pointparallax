(function ($) {
    $.fn.pointparallax = function (so) {
        var so = so || {},
                sd = {
                    itemsSelector: '.point__item',
                    items: {
                        '.point__item_1': {
                            position: 'left-bottom',
                            path: 80,
                            point: '0-0',
                        },
                        '.point__item_2': {
                            path: 20,
                            point: '0-50',
                        },
                        '.point__item_3': {
                            position: 'right-top',
                            path: 100,
                            point: '100-100',
                        }
                    },
                    itemIncludeMargin: false,
                    position: null,
                    autoheight: false,
                    autoheightClass: 'pointparallax-autoheight',
                    stoppedClass: 'pointparallax-stopped',
                    point: 'center',
                    path: 100,
                    startfrom: 0,
                },
                s = $.extend(true, {}, sd, so),
                parse_Float = function (value) {
                    function check(value) {
                        if ('number' === typeof value)
                            return value;
                        if ('string' === typeof value)
                            try {
                                value = value.replace(/[^0-9\.-]+/g, '');
                                value = parseFloat(value);
                                if (isNaN(value)) {
                                    return 0;
                                }
                                return value;
                            } catch (err) {
                                return 0;
                            }
                        return 0;
                    }
                    if ('object' === typeof value) {
                        for (var i in value)
                            value[i] = check(value[i]);
                        return value;
                    }
                    return check(value);
                },
                parse_Position = function (position) {
                    if ('string' !== typeof position)
                        return position;
                    var _position = position.split('-', 2).map(function (value) {
                        switch (value) {
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
                        return parse_Float(value) / 100;
                    });
                    _position[1] = 'undefined' === typeof _position[1] ? _position[0] : _position[1];
                    return _position;
                };
        return $(this).each(function () {
            var $this = $(this),
                    $items = $this.find(s.itemsSelector);
            if (s.autoheight)
                $this.addClass(s.autoheightClass);
            if ($this.data('point'))
                $this.data('point', parse_Position($this.data('point')));


            $.each(s.items, function (index, value) {
                var $item = $this.find(index);
                $.each(value, function (index, value) {
                    $item.data(index, value);
                });
                if ($item.length)
                    $items = $items.not($item);
                $items = $items.add($item);
            });

            if ('relative' !== $this.css('position'))
                $this.css('position', 'relative');
            $items.each(function () {
                var $item = $(this);
                if ('absolute' != $item.css('position'))
                    $item.css('position', 'absolute');
                $item.data('position', parse_Position($item.data('position') || s.position));
            });

            $this.off('autoheight.pointparallax').on('autoheight.pointparallax', function (event, settings) {
                var settings = settings || s,
                        height_max = 0;
                $items.each(function () {
                    height_max = Math.max(height_max, $(this).outerHeight(settings.itemIncludeMargin) + (!$(this).data('position') ? $(this).position().top : 0));
                });

                $this.height(height_max);
            }).off('minsize.pointparallax').on('minsize.pointparallax', function (event, settings) {
                var settings = settings || s,
                        height_max = 0,
                        width_max = 0,
                        $this = $(this),
                        $this_padding = parse_Float($this.css(['padding-top', 'padding-right', 'padding-bottom', 'padding-left'])),
                        $this_padding = [$this_padding['padding-right'] + $this_padding['padding-left'], $this_padding['padding-top'] + $this_padding['padding-bottom']];
                $items.each(function () {
                    height_max = Math.max(height_max, $(this).outerHeight(settings.itemIncludeMargin) + $this_padding[1]);
                    width_max = Math.max(width_max, $(this).outerWidth(settings.itemIncludeMargin) + $this_padding[0]);
                });
                $this.css({
                    'min-width': width_max,
                    'min-height': height_max,
                });

            }).off('position.pointparallax').on('position.pointparallax', function (event, settings) {
                var settings = settings || s,
                        $this = $(this),
                        $this_w = $this.width(),
                        $this_h = $this.height(),
                        $this_padding = parse_Float($this.css(['padding-top', 'padding-right', 'padding-bottom', 'padding-left'])),
                        $this_w = $this_w - $this_padding['padding-right'] - $this_padding['padding-left'],
                        $this_h = $this_h - $this_padding['padding-top'] - $this_padding['padding-bottom'],
                        $this_padding = [$this_padding['padding-left'], $this_padding['padding-top']];
                $items.each(function () {
                    var $item = $(this),
                            position = $item.data('position');
                    if (!position)
                        return;
                    position = parse_Position(position);
                    $item.data('position', position);
                    var _position = [],
                            $item_w = $item.outerWidth(settings.itemIncludeMargin),
                            $item_h = $item.outerHeight(settings.itemIncludeMargin);
                    _position[0] = $this_padding[0] + ($this_w - $item_w) * position[0];
                    _position[1] = $this_padding[1] + ($this_h - $item_h) * position[1];
                    $item.css({
                        left: _position[0],
                        top: _position[1]
                    });
                });
            }).off('resize.pointparallax').on('resize.pointparallax', function (event, settings) {
                var settings = settings || s;
                if ($this.hasClass(settings.autoheightClass)) {
                    $this.trigger('autoheight.pointparallax', settings);
                }
                $this.trigger('minsize.pointparallax', settings).trigger('position.pointparallax', settings);
                //requestAnimationFrame(update);
            }).off('scroll.pointparallax').on('scroll.pointparallax', function (event, settings) {
                var settings = settings || s,
                        progress = {
                            wst: $(window).scrollTop(),
                            wh: $(window).height(),
                            tot: $this.offset().top,
                            toh: $this.outerHeight(),
                        };
                if (progress.wst + progress.wh + 20 < progress.tot || progress.tot + progress.toh + 20 < progress.wst)
                    return;
                //requestAnimationFrame(update);
                progress = (progress.wst - progress.tot + progress.wh) / (progress.wh + progress.toh);
                $this.trigger('update.pointparallax', progress, s);
            }).off('init.pointparallax').on('init.pointparallax', function (event, settings) {
                $this.trigger('resize.pointparallax', settings).trigger('inited.pointparallax', settings);
            });
            function update() {
                var progress = {
                    wst: $(window).scrollTop(),
                    wh: $(window).height(),
                    tot: $this.offset().top,
                    toh: $this.outerHeight(),
                },
                        progress = (progress.wst - progress.tot + progress.wh) / (progress.wh + progress.toh),
                        point = $this.data('point') || s.point,
                        path = $this.data('path') || s.path;
                if (0 > progress)
                    progress = 0;
                if (1 < progress)
                    progress = 1;
                $items.each(function (index) {
                    var $item = $(this);
                    if ($item.hasClass(s.stoppedClass))
                        return;
                    var $item_point = parse_Position($item.data('point') || point),
                            $item_path = ($item.data('path') || path) / 100,
                            $item_position = $item.position(),
                            $item_position = [$item_position.left, $item_position.top],
                            translate = [];
                    $item_point[0] *= $this.width();
                    $item_point[1] *= $this.height();
                    $item_position[0] += $item.outerWidth(s.itemIncludeMargin) / 2;
                    $item_position[1] += $item.outerHeight(s.itemIncludeMargin) / 2;
                    translate[0] = ($item_point[0] - $item_position[0]) * $item_path * progress;
                    translate[1] = ($item_point[1] - $item_position[1]) * $item_path * progress;
                    $item.css('transform', 'translate3d(' + translate[0] + 'px, ' + translate[1] + 'px, 0)');
                });
            }



            $(window).on('resize', function (event) {
                $this.trigger('resize.pointparallax', s);
            }).on('scroll', function (event) {
                $this.trigger('scroll.pointparallax', s);
            });
            $this.trigger('init.pointparallax', s);
        });
    };
})(jQuery);