/*global jQuery*/
/*jslint browser:true*/

/*
 * Columns - jQuery Plugin
 *
 * Author :: LuQue - http://www.luque.cc/
 *
 * Version: 1.0 (2013/06/06)
 *
 */

(function ($) {
    'use strict';

    $.Columns = function Columns(options) {
        var self = {}, defaultOptions;

        defaultOptions = {
            checkboxes: false,                       // create checkboxes?
            radio: false,                            // create radio?
            activeClass: 'active',                   // witch class the active elements will receive?
            mapAttr: false,                          // use other properties of item to create 'data' based attrs?
            container: '',                           // html container element (classname or id)
            label: 'label',                          // key of element to use as label
            value: 'id',                             // key of element to use as value
            addLinks: false,                         // what to do to add items? use a callback here to define how it works
            addLinksLabel: 'New item',               // label for new item button
            editLinks: false,
            attrs: {}
        };

        // holds items to display
        self.data = [];

        self.options = $.extend(defaultOptions, options);

        // options that cannot be changed by the user
        self.privateOptions = {
            id: 'columns-' + Math.random()
        };

        // VALIDATIONS
        // checkbox or radio
        if (options.checkboxes && options.radio) {
            throw "Only checkboxes OR radio, not both";
        }

        // has container?
        self.options.container = $(self.options.container);
        if (typeof self.options.container !== 'object' || typeof self.options.container.css !== 'function') {
            throw "There's no object with this selector: '" + self.options.container + "'";
        } else if (self.options.container.size() !== 1) {
            throw "We need a single element to build the columns. No more, no less.";
        }
        self.options.container.addClass('columns-container');

        // create the li element
        function buildItem(item, currentLevel) {
            var $item,
                checkboxMarkup = '',
                radioMarkup = '',
                attrs = {},
                itemLabel,
                itemValue,
                editLink = '',
                contextMenuName = '',
                contextMenuOptions = {},
                menu = {};

            itemLabel = item[self.options.label];
            itemValue = item[self.options.value];

            attrs = $.extend(attrs, self.options.attrs);
            attrs['data-label'] = itemLabel;

            if (self.options.checkboxes === true) {
                checkboxMarkup = '<input type="checkbox" value="' + itemValue + '"';
                if (item.hasOwnProperty('checked') && item.checked === true) {
                    checkboxMarkup += ' checked ';
                }
                checkboxMarkup += '/>';
            }

            if (self.options.radio === true) {
                radioMarkup = '<input type="radio" name="' + self.privateOptions.id + '" value="' + itemValue + '"';
                if (item.hasOwnProperty('checked') && item.checked === true) {
                    radioMarkup += ' checked ';
                }
                radioMarkup += '/>';
            }

            if (self.options.mapAttr === true) {
                $.each(item, function (index, value) {
                    if (index !== self.options.value && index !== self.options.label) {
                        if (typeof index === 'string' && (typeof value === 'string' || typeof value === 'number')) {
                            attrs['data-' + index] = value;
                        }
                    }
                });
            }

            if (self.options.editLinks) {
                editLink = '<span class="columns-edit-item">edit</span>';
            }

            attrs['data-id'] = itemValue;

            $item = $('<li>' + radioMarkup + checkboxMarkup + itemLabel + editLink + '</li>');
            $item.attr(attrs);

            if (item.hasOwnProperty('child')) {
                $item.append(buildLevel(item.child, currentLevel + 1, itemValue));
            } else if (self.options.addLinks) {
                $item.append(buildLevel([], currentLevel + 1, itemValue));
            }

            return $item;
        }

        // create the ul ement
        function buildLevel(items, level, rel) {
            var $level = $('<ul class="columns-level" data-columnslevel="' + level + '"></ul>');

            if (rel !== undefined) {
                $level.attr('data-rel', rel);
            } else {
                $level.addClass(self.options.activeClass);
            }

            $.each(items, function buildAItem(index, item) {
                $level.append(buildItem(item, level));
            });

            // add button
            if (self.options.addLinks) {
                $level.append(
                    $('<li class="columns-add-item">' + self.options.addLinksLabel + '</li>')
                );
            }

            return $level;
        }

        // replace the current data for new ones
        this.loadData = function loadData(data) {
            if (typeof data !== 'object') {
                throw "data MUST be a object";
            }

            self.data = data;
        };

        // options are: keepSelection and data
        this.update = function update(options) {
            var defaultOptions = {
                keepSelection: true,
                data: null
            },
            actives = [],
            selecteds = [],
            i = 0;

            options = $.extend(defaultOptions, options);

            if (options.data !== null) {
                this.loadData(options.data);
            }

            if (options.keepSelection === true) {
                selecteds = this.getSelected();
                actives = this.getActives();
            }

            this.render();

            if (options.keepSelection === true) {
                if (selecteds.lengh) {
                    for (i = 0; i < selecteds.length; i++) {
                        self.options.container.find('[value="' + selecteds[i] + '"]').prop('checked', true);
                    }
                }

                if (actives.length) {
                    for (i = 0; i < actives.length; i++) {
                        self.options.container.find('[data-id="' + actives[i] + '"]').click();
                    }
                }
            }
        };

        // get active li's
        this.getActives = function getActives() {
            var actives = [],
                query = 'li.' + self.options.activeClass;
                
            self.options.container.find(query).each(function () {
                actives.push($(this).attr('data-id'));
            });

            return actives;
        };

        // get selecteds itens (when use checkbox or radio)
        this.getSelected = function getSelected() {
            var response = [];
            self.options.container.find(':checked').each(function eachActive() {
                response.push($(this).val());
            });
            return response;
        };

        // build uls and lis recursively
        this.render = function renderColumns() {
            var $mainLevel = buildLevel(self.data, 0);
            self.options.container.html('').append($mainLevel);
        };

        // uncheck all
        this.reset = function reset() {
            self.options.container.find('.columns-level.' + self.options.activeClass).each(function () {
                var $this = $(this),
                    rel = $this.attr('data-rel'),
                    $target = $('[data-id="' + rel + '"]');

                $this.removeClass(self.options.activeClass).find('.' + self.options.activeClass).removeClass(self.options.activeClass).end().appendTo($target);
            }).end().find(':checked').each(function () {
                $(this).prop('checked', false);
            });
        };

        // returns a copy of current data
        this.getData = function () {
            return JSON.parse(JSON.stringify(self.data));
        };

        // listerner to edit link
        self.options.container.on('click', '.columns-edit-item', function clickEdit(event) {
            event.stopPropagation();
            var item = $(this).parents('li:first'),
                item_id = item.attr('data-id'),
                item_label = item.attr('data-label');
            self.options.editLinks(item_id, item_label);
        });

        // listener to items. Change class to active and open subitems
        self.options.container.on('click', 'li', function clickLi() {
            var $level, $this, $children, currentLevel;
            $this = $(this);

            if ($this.hasClass(self.options.activeClass)) {
                return;
            }

            if ($this.hasClass('columns-add-item')) {
                var parent_id = $(this).parents('ul:first').attr('data-rel');
                self.options.addLinks(parent_id);
                return;
            }

            $level = $this.parents('ul:first');
            $children = $this.find('ul:first');
            currentLevel = parseInt($level.attr('data-columnslevel'), 10);

            self.options.container.find('.columns-level.' + self.options.activeClass).each(function () {
                var $this, thisLevel, rel, $target;
                $this = $(this);
                thisLevel = parseInt($this.attr('data-columnslevel'), 10);

                if (thisLevel > currentLevel) {
                    rel = $this.attr('data-rel');
                    $target = $('[data-id="' + rel + '"]');

                    $this.removeClass(self.options.activeClass).find('.' + self.options.activeClass).removeClass(self.options.activeClass).end()
                        .appendTo($target);
                }
            });

            if ($children.size()) {
                $children.addClass(self.options.activeClass).insertAfter($level);
            }
            $this.addClass(self.options.activeClass).siblings().removeClass(self.options.activeClass);
            $('.columns-container').animate({
                scrollLeft: 1000
            }, 100);
        });

        // autoload if has data
        if (self.options.data !== undefined) {
            this.loadData(self.options.data);
            this.render();
        }

        return this;
    };
}(jQuery));