const COLOR_PRIMARY = 0x4169e1;
const COLOR_LIGHT = 0x0000ff;
const COLOR_DARK = 0x4169e1;

var CreateDropDownList = function (scene, x, y, options) {
    var maxTextSize = GetMaxTextObjectSize(scene, options);

    var label = scene.rexUI.add.label({
        x: x, y: y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),

        icon: scene.rexUI.add.roundRectangle(0, 0, 6, 6, 5, COLOR_LIGHT),

        text: CreateTextObject(scene, '')
            .setFixedSize(maxTextSize.width, maxTextSize.height),

        // action:

        space: {
            left: 5,
            right: 5,
            top: 5,
            bottom: 5,
            icon: 5
        }
    })
        .setData('value', '');

    label.data.events.on('changedata-value', function (parent, value, previousValue) {
        label.text = value;
    })
    if (options[0]) {
        label.setData('value', options[0])
    }

    var menu;
    scene.rexUI.add.click(label)
        .on('click', function () {
            if (!menu) {
                var menuX = label.getElement('text').getTopLeft().x,
                    menuY = label.bottom;
                menu = CreatePopupList(scene, menuX, menuY, options, function (button) {
                    label.setData('value', button.text);
                    menu.collapse();
                    menu = undefined;
                });
            } else {
                menu.collapse();
                menu = undefined;
            }
        })
    return label;
}

var CreatePopupList = function (scene, x, y, options, onClick) {
    var items = options.map(function (option) { return { label: option } });
    var menu = scene.rexUI.add.menu({
        x: x,
        y: y,
        orientation: 'y',

        items: items,
        createButtonCallback: function (item, i, options) {
            return scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_DARK),

                text: CreateTextObject(scene, item.label),

                space: {
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 5,
                    icon: 5
                }
            })
        },

        // easeIn: 500,
        easeIn: {
            duration: 400,
            orientation: 'y'
        },

        // easeOut: 100,
        easeOut: {
            duration: 100,
            orientation: 'y'
        }

        // expandEvent: 'button.over'
    });

    menu
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        })
        .on('button.click', function (button) {
            onClick(button);
        })

    return menu;
}

var GetMaxTextObjectSize = function (scene, contentArray) {
    var textObject = CreateTextObject(scene, '');
    var width = 0, height = 0;
    for (var i = 0, cnt = contentArray.length; i < cnt; i++) {
        textObject.text = contentArray[i];
        width = Math.max(textObject.width, width);
        height = Math.max(textObject.height, height);
    }
    textObject.destroy();

    return { width: width, height: height };
}

var CreateTextObject = function (scene, text) {
    var textObject = scene.add.text(0, 0, text, {
        fontSize: '12px'
    })
    return textObject;
}
