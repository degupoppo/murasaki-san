let _array_name_base = [
    //1-16
    "Nameplate",
    "Mr. Astar",
    "Dice",
    "Helmet",
    "Sushi",
    "Crown",
    "Ribbon",
    "Window",
    "Knit Hat",
    "Photo Frame",
    "Wall Sticker",
    "---",
    "---",
    "---",
    "---",
    "---",
    //17-32
    "Music Box",
    "Straw Hat",
    "Ms. Ether",
    "Cat Cushion",
    "Uni",
    "Fortune Statue",
    "Asnya",
    "Rug-Pull",
    "Flowerpot",
    "Photo Stand",
    "Floor Sticker",
    "---",
    "---",
    "---",
    "---",
    "---",
    //33-48
    "Tablet",
    "Score Board",
    "Mortarboard",
    "Dr. Bitco",
    "Pancake",
    "Violin",
    "Piano",
    "Light Switch",
    "Lantern",
    "Token Basket",
    "Electric Board",
    "---",
    "---",
    "---",
    "---",
    "(Test Item)",
    //49-64
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
];

let _array_name_sp = [
    //193, heart
    "Tiny Heart",
    //194, Ohana Piggy Bank
    "Ohana Bank",
    //195, Kusa Pouch
    "Kusa Pouch",
    //196, Cat Mail
    "Cat Mail",
    //197, Nui
    "Coddly Toy",
    //198
    "---",
    //199
    "---",
    //200
    "---",
    //201
    "Red Twinkle",
    //202
    "Orange Sparkle",
    //203
    "Yellow Twinkle",
    //204
    "Green Sparkle",
    //205
    "Blue Twinkle",
    //206
    "Purple Sparkle",
    //207
    "Black Twinkle",
    //208
    "Pink Sparkle",
    //209
    "White Twinkle",
    //210
    "Gold Sparkle",
    //211
    "Shilver Twinkle",
    //212
    "Skyblue Sparkle",
];

let array_item_name = ["dummy"]; //dummy, 0
array_item_name = array_item_name.concat(_array_name_base);    //common, 1-64
array_item_name = array_item_name.concat(_array_name_base);    //uncommon, 65-128
array_item_name = array_item_name.concat(_array_name_base);    //rare, 129-192
array_item_name = array_item_name.concat(_array_name_sp);      //special, 193-

/*
let array_item_name = [
    //0
    "dummy",
    //1-16
    "Nameplate",
    "Mr. Astar",
    "Dice",
    "Helmet",
    "Sushi",
    "Crown",
    "Ribbon",
    "Window",
    "Knit Hat",
    "Picture Frame",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    //17-32
    "Music Box",
    "Straw Hat",
    "Ms. Ether",
    "Cat Cushion",
    "Uni",
    "Fortune Statue",
    "Asnya",
    "Rug-Pull",
    "Flowerpot",
    "Photo Frame",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    //33-48
    "Tablet",
    "Score Board",
    "Mortarboard",
    "Dr. Bitco",
    "Pancake",
    "Violin",
    "Piano",
    "Light Switch",
    "Lanthanum",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "(Test Item)",
    //49-64
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    //65-128, uncommon
    //65-80
    "Mr. Astar",
    "Crown",
    "Fortune Statue",
    "Helmet",
    "Nameplate",
    "Ribbon",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    //81-96
    "Flowerpot",
    "Ms. Ether",
    "Straw Hat",
    "Asnya-",
    "Light Switch",
    "Choco. Bread",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    //97-112
    "Violin",
    "Music Box",
    "Dr. Bitco",
    "Dice",
    "Knit Hat",
    "Mortarboard",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "(Test Item)",
    //113-128
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    //129-192, rare
    "Mr. Astar",
    "Crown",
    "Fortune Statue",
    "Helmet",
    "Nameplate",
    "Ribbon",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    //
    "Flowerpot",
    "Ms. Ether",
    "Straw Hat",
    "Asnya-",
    "Light Switch",
    "Choco. Bread",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    //
    "Violin",
    "Music Box",
    "Dr. Bitco",
    "Dice",
    "Knit Hat",
    "Mortarboard",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "(Test Item)",
    //
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    "---",
    //193, heart
    "Tiny Heart",
    //194, Ohana Piggy Bank
    "Ohana Bank",
    //195, Kusa Pouch
    "Kusa Pouch",
    //196, Cat Mail
    "Cat Mail",
    //197, Nui
    "Coddly Toy",
    //198
    "---",
    //199
    "---",
    //200
    "---",
    //201
    "Garnet",
    //202
    "Amethyst",
    //203
    "Aquamarine",
    //204
    "Diamond",
    //205
    "Emerald",
    //206
    "Pearl",
    //207
    "Ruby",
    //208
    "Peridot",
    //209
    "Sapphire",
    //210
    "Opal",
    //211
    "Topaz",
    //212
    "Turquoise",
]
*/