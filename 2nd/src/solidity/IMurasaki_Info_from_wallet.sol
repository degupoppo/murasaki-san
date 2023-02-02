interface IMurasaki_Info_fromWallet {

    // Murasaki-san ID of wallet
    function summoner   (address _wallet) external view returns (uint32);

    // Basic informations
    function class  (address _wallet) external view returns (uint32);
    function age    (address _wallet) external view returns (uint32);
    function name   (address _wallet) external view returns (string memory);
    function level  (address _wallet) external view returns (uint32);

    // Character
    //  0: birthplace, 1:softness, 2:fluffiness, 3:elasticity, 4:personality
    function allStatus(address _wallet) external view returns (string[5] memory);

    // Parameters
    function strength       (address _wallet) external view returns (uint32);
    function dexterity      (address _wallet) external view returns (uint32);
    function intelligence   (address _wallet) external view returns (uint32);
    function luck           (address _wallet) external view returns (uint32);

    // Parameters with item modification
    function strength_withItems(address _wallet) external view returns (uint32);
    function dexterity_withItems(address _wallet) external view returns (uint32);
    function intelligence_withItems(address _wallet) external view returns (uint32);
    function luck_withItems(address _wallet) external view returns (uint32);
    function luck_withItems_withDice(address _wallet) external view returns (uint32);
    
    // Present status, material means leaf, precious means fluffy_score
    function satiety(address _wallet) external view returns (uint32);
    function happy(address _wallet) external view returns (uint32);
    function exp(address _wallet) external view returns (uint32);
    function coin(address _wallet) external view returns (uint32);
    function material(address _wallet) external view returns (uint32);
    function precious(address _wallet) external view returns (uint32);

    // Scores
    function score(address _wallet) external view returns (uint32);
    function total_exp_gained(address _wallet) external view returns (uint32);
    function total_coin_mined(address _wallet) external view returns (uint32);
    function total_material_farmed(address _wallet) external view returns (uint32);
    function total_item_crafted(address _wallet) external view returns (uint32);
    function total_precious_received(address _wallet) external view returns (uint32);

    // etc
    function not_petrified(address _wallet) external view returns (uint32);
    function isActive(address _wallet) external view returns (uint32);
    function inHouse(address _wallet) external view returns (uint32);
}