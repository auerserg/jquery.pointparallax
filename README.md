# jQuery.PointParallax
v. 1.0.1 

PointParallax is a jquery plugin for pleasantly displacing certain elements to certain points. It supports padding block and margin elements. It does not require the description of styles for elements. Compatible with modern browsers Chrome / Firefox / Edge / Safari, some limitations may exist.


## FEATURES

## DEPENDENCIES
>> It's a plugin for the jquery framework, you need to include jquery in your scripts.
>> it works with jQuery 1.x / 2.x / 3.x branch (slim version don't works)


* INSTALLATION
Put loading script tag after jquery script tag and loading:

<script src="jquery.pointparallax.js"></script>


* HOW TO USE
Initialize PointParallax ALWAYS in (document) ready statement.
```javascript
// 1. Simple mode, it styles document scrollbar:
$(function() {  
    $('.pointparallax').pointparallax();
});
```

## CONFIGURATION PARAMETERS
When you call "PointParallax" you can pass some parameters to custom visual aspects:
```javascript
$('.pointparallax').pointparallax({
    itemsSelector: '.point__item', // Selector for moving elements.
    items: {},  // Ability to specify elements and their attributes in an array.
    itemIncludeMargin: false, // Whether to use a magrin to count the area of elements.
    position: null, // The default item position, if they do not have a position. Does not consider positioning by styles.
    autoheight: false, // Whether to change the height of a common block relative to the dimensions and positions of the elements.
    autoheightClass: 'pointparallax-autoheight', // Selector class for change the height.
    fixedClass: 'pointparallax-fixed', // Class for blocking the movement of an element. Does not affect the positioning.
    point: 'center', // The default point to which all the elements move. Default: center.
    path: 100, // The amount of path that must pass the elements to the control point. Default: Full path.
});
```
## CONFIGURATION ATTRIBUTES
For the main element:
```html
<div
class="pointparallax"
data-point="center" <!-- The default point to which all the elements move. Default: center. -->
data-path="100" <!-- The amount of path that must pass the elements to the control point. Default: Full path. -->
>
</div>
```
For the moving elements:
```html
<div
class="point__item"
data-position="" <!-- The default item position. Does not consider positioning by styles. -->
data-point="center" <!-- The default point to which all the elements move. Default: center. -->
data-path="100" <!-- The amount of path that must pass the elements to the control point. Default: Full path. -->
>
</div>
```
## Copyright 2011-18 BlackSiriuS

###### Licensed under the GNU License, https://opensource.org/licenses/GPL-3.0