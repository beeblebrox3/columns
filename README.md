# Columns

This is a jQuery plugin to display items with Miller Columns visualization.

## Usage
### Requirements

- jQuery >= 1.7

### Tutorial
Add the assets to your page:

```html

<!-- import css -->
<link rel="stylesheet" type="text/css" href="/<path-to-columns>/dist/css/columns.css" />

<!-- import jquery and columns -->
<script type="text/javascript" src="<path-to-jquery>/jquery.min.js"></script>
<script type="text/javascript" src="<path-to-columns>/dist/js/columns.js"></script>

```

Create a div to put the columns inside. Must be a single element.

```
<div id="render-columns"></div>
```

In your js code, you have to call the Columns method and pass some arguments.

```
var myColumns = $.Columns(options);
```


#### List of available options

option | default value | required | description
--- | --- | ---
container | | yes | Pass the selector to element where render columns.
checkboxes | `false` | no | If true, add a checkbox before the item label. You can use to apply batch actions
radio | `false` | no | Works similar to checkboxes. You can use only one: or checkbox or radio, not both.
activeClass | `'active'` | no | Define the class to active elements (li).
mapAttr | `false` | no | If true, all properties from items will be added to the html element (li). For exemplo, if your items have a property called `isFruit`, the li's will have an attribute `data-isFruit`.
label | `'label'` | no | Define which property from items will be used as content of li's
value | `'id'` | no | Define which property from items will be used as value of element. The most commom use is when you want to create a new item. Your callback will receive the ID from parent node.
addLinks | `false` | no | If you pass a function, all columns will have a "add" link as last item. This function will be called when user click in those links. The ID from parent node will be passed as argument.
addLinksLabel | `'New item'` | no | Label to "add" link.
attrs | `{}` | no | You can define a custom attribute to put in li's. 
data | `null` | no | The data to be displayed. If you want to pass the data later, will have to call the `render` method to display the columns.

#### Data format
You need to pass a array of objects. Look the example above:

```
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
```

Each element is a li. You can create a hierarchy with the child property. In the example, wallpapers is a child of images.

### Methods
method | arguments | description
--- | --- | ---
loadData | `array data` | If you don't pass the data in options, you can use this method
getActives | | Returns the active li's. 
getSelected | | Returns the selected items (checkbox or radio)
render | | build the ul's and li's and append to container
getData | | returns the current data 
