
// The interface of the Murasakisan contract deployed on the Astar EVM.
// Contract address: 0x31d69b5125ce419a2948a58b7Aa0883D57c06850

interface IMurasakisan {

    // Murasaki-san ID of the wallet
    function summoner   (address _wallet) external view returns (uint);

    // Basic informations of Murasaki-san
    function class  (address _wallet) external view returns (uint);
    function age    (address _wallet) external view returns (uint);
    function name   (address _wallet) external view returns (string memory);
    function level  (address _wallet) external view returns (uint);

    // Character of Murasaki-san
    function birthplace  (address _wallet) external view returns (string memory);
    function character   (address _wallet) external view returns (string memory);
    function weakpoint   (address _wallet) external view returns (string memory);
    function scent       (address _wallet) external view returns (string memory);
    function personality (address _wallet) external view returns (string memory);
    function flower      (address _wallet) external view returns (string memory);

    // Address of the house
    function street      (address _wallet) external view returns (string memory);
    function city        (address _wallet) external view returns (string memory);

    // Status
    function strength       (address _wallet) external view returns (uint);
    function dexterity      (address _wallet) external view returns (uint);
    function intelligence   (address _wallet) external view returns (uint);
    function luck           (address _wallet) external view returns (uint);

    // Status adjusted for item effects
    function strength_withItems      (address _wallet) external view returns (uint);
    function dexterity_withItems     (address _wallet) external view returns (uint);
    function intelligence_withItems  (address _wallet) external view returns (uint);
    function luck_withItems          (address _wallet) external view returns (uint);
    function luck_withItems_withDice (address _wallet) external view returns (uint);
    
    // Current parameters of Murasaki-san
    function satiety    (address _wallet) external view returns (uint);
    function happy      (address _wallet) external view returns (uint);
    function exp        (address _wallet) external view returns (uint);
    function coin       (address _wallet) external view returns (uint);
    function leaf       (address _wallet) external view returns (uint);
    function fluffy     (address _wallet) external view returns (uint);
    function score      (address _wallet) external view returns (uint);

    // Total counts
    function total_exp_gained       (address _wallet) external view returns (uint);
    function total_coin_mined       (address _wallet) external view returns (uint);
    function total_leaf_farmed      (address _wallet) external view returns (uint);
    function total_item_crafted     (address _wallet) external view returns (uint);
    function total_fluffy_received  (address _wallet) external view returns (uint);

    // Other parameters
    function not_petrified  (address _wallet) external view returns (uint);
    function isActive       (address _wallet) external view returns (uint);
    function inHouse        (address _wallet) external view returns (uint);
    
    // Achievements
    function countOf_achievement            (address _wallet) external view returns (uint);
    function scoreOf_achievement_onChain    (address _wallet) external view returns (uint);

    // Practice
    function clarinet_level  (address _wallet) external view returns (uint);
    function piano_level     (address _wallet) external view returns (uint);
    function violin_level    (address _wallet) external view returns (uint);
    function horn_level      (address _wallet) external view returns (uint);
    function timpani_level   (address _wallet) external view returns (uint);
    function harp_level      (address _wallet) external view returns (uint);
    
    // Stroll
    function total_strolledDistance (address _wallet) external view returns (uint);
    function total_metSummoners     (address _wallet) external view returns (uint);
    
    // Mail
    function total_mail_sent    (address _wallet) external view returns (uint);
    function total_mail_opened  (address _wallet) external view returns (uint);
    
    // Festival
    function total_voted (address _wallet) external view returns (uint);
    
    // Dice
    function critical_count (address _wallet) external view returns (uint);
    function fumble_count   (address _wallet) external view returns (uint);
    
    // Doing now
    function doing_now (address _wallet) external view returns (string memory);

    // Mimic ERC721 and ERC165 interface for compatibility with Metamask etc.
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function ownerOf(uint256 _tokenId) external view returns (address);
    function tokenURI(uint256 _tokenId) external view returns (string memory);
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
