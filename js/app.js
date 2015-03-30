(function () {
    'use strict';

    var data = [{
        id: 'home',
        label: 'home',
        child: [{
            id: 'desktop',
            label: 'desktop'
        }, {
            id: 'downloads',
            label: 'downloads'
        }, {
            id: 'images',
            label: 'images',
            child: [{
                id: 'wallpapers',
                label: 'wallpapers',
                child: [{
                    id: 'nature',
                    label: 'nature',
                }, {
                    id: 'sky',
                    label: 'sky'
                }]
            }, {
                id: 'photos',
                label: 'photos'
            }]
        }, {
            id: 'music',
            label: 'music'
        }, {
            id: 'public',
            label: 'public'
        }]
    }];

    var columns = new $.Columns({
        radio: false,
        container: '#render-columns',
        label: 'label',
        value: 'id',
        addLinks: function (parent) {
            if (parent !== undefined) {
                alert("Adding a child to " + parent);
            } else {
                alert("Adding a child to root");
            }
        },
        addLinksLabel: 'Add (+)',
        editLinks: false,
        attrs: {},
        data: data
    });

    var columnsCheckbox = new $.Columns({
        checkboxes: true,
        radio: false,
        container: '#render-columns-checkbox',
        label: 'label',
        value: 'id',
        addLinks: function (parent) {
            if (parent !== undefined) {
                alert("Adding a child to " + parent);
            } else {
                alert("Adding a child to root");
            }
        },
        addLinksLabel: 'Add (+)',
        editLinks: false,
        attrs: {},
        data: data
    });
}());
