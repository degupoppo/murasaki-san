
//0x0Ff72e0dEE0b814FAC4a094069b41D3F06434897

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Character {

    uint public id = 1;
    uint public ctype = 1;
    uint public strength = 5;
    uint public dexterity = 5;
    uint public vitality = 5;
    uint public intelligence = 5;
    uint public luck = 5;
    uint public birth_time = block.timestamp;
    uint public last_feeding_time = block.timestamp;
    uint public last_grooming_time = block.timestamp;
    uint public coin = 100;
    uint public material = 0;
    uint public mining_status = 0;
    uint public mining_start_time = 0;
    uint public farming_status = 0;
    uint public farming_start_time = 0;
    uint public crafting_status = 0;
    uint public crafting_start_time = 0;
    uint public exp = 0;
    uint public level = 1;
    uint public next_exp_required = 1000;
    uint delta;
    uint tmp;

    function get_coin() public view returns (uint) {
        return coin;
    }
    function get_strength() public view returns (uint) {
        return strength;
    }

    function feeding() public {
        if (mining_status == 0 && farming_status == 0 && crafting_status == 0) {
            delta = block.timestamp - last_feeding_time;
            last_feeding_time = block.timestamp;
            exp += delta;
        }
    }
    function grooming() public {
        if (mining_status == 0 && farming_status == 0 && crafting_status == 0) {
            delta = block.timestamp - last_grooming_time;
            last_grooming_time = block.timestamp;
            exp += delta;
        }
    }
    function start_mining() public {
        if (mining_status == 0 && farming_status == 0 && crafting_status == 0) {
            mining_status = 1;
            mining_start_time = block.timestamp;
        }
    }
    function stop_mining() public {
        if (mining_status == 1) {
            delta = (block.timestamp - mining_start_time) / 10;
            coin += delta;
            mining_status = 0;
        }
    }
    function level_up() public {
        if (exp >= next_exp_required) {
            exp -= next_exp_required;
            level += 1;
            //update next_exp_required
            if (level == 2) {
                next_exp_required = 3000;
            }else if (level == 3) {
                next_exp_required = 6000;
            }else if (level == 4) {
                next_exp_required = 10000;
            }else if (level == 5) {
                next_exp_required = 15000;
            }else if (level == 6) {
                next_exp_required = 2100;
            }else if (level == 7) {
                next_exp_required = 28000;
            }else if (level == 8) {
                next_exp_required = 36000;
            }else if (level == 9) {
                next_exp_required = 45000;
            }else if (level == 10) {
                next_exp_required = 55000;
            }else if (level == 11) {
                next_exp_required = 66000;
            }else if (level == 12) {
                next_exp_required = 78000;
            }else if (level == 13) {
                next_exp_required = 91000;
            }else if (level == 14) {
                next_exp_required = 105000;
            }else if (level == 15) {
                next_exp_required = 120000;
            }else if (level == 16) {
                next_exp_required = 136000;
            }else if (level == 17) {
                next_exp_required = 153000;
            }else if (level == 18) {
                next_exp_required = 171000;
            }else if (level == 19) {
                next_exp_required = 190000;
            }
        }
    }
}






