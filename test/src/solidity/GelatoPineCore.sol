// SPDX-License-Identifier: GPL-3.0

//
// Original work by Pine.Finance
//  - https://github.com/pine-finance
//
// Authors:
//  - Ignacio Mazzara <@nachomazzara>
//  - Agustin Aguilar <@agusx1211>

// solhint-disable-next-line
pragma solidity 0.6.12;

import {PineCore, IModule, IERC20} from "./PineCore.sol";

contract GelatoPineCore is PineCore {
    // solhint-disable-next-line var-name-mixedcase
    address public immutable GELATO;

    constructor(address _gelato) public {
        GELATO = _gelato;
    }

    modifier onlyGelato {
        require(GELATO == msg.sender, "GelatoPineCore: onlyGelato");
        _;
    }

    function executeOrder(
        IModule _module,
        IERC20 _inputToken,
        address payable _owner,
        bytes calldata _data,
        bytes calldata _signature,
        bytes calldata _auxData
    ) public override onlyGelato {
        super.executeOrder(
            _module,
            _inputToken,
            _owner,
            _data,
            _signature,
            _auxData
        );
    }
}
