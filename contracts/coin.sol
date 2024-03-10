// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CoinFlip {

    address payable player1 = payable(0x0);
    address payable player2 = payable(0x0);
    bytes32 p1selection;
    bool p2selection;
    uint256 public bet;

    function getHash(bool choice, uint256 nonce) external pure returns (bytes32) {
        return keccak256(abi.encode(choice, nonce));
    }

    function makeBet(bytes32 hash) external payable {
        require(player1 == payable(0x0));
        require(msg.value > 0);

        player1 = payable(msg.sender);
        p1selection = hash;
        bet = msg.value;
    }

    function takeBet(bool choice) external payable {
        require(player2 == payable(0x0));
        require(player1 != payable(0x0));
        require(msg.value == bet);

        player2 = payable(msg.sender);
        p2selection = choice;
    }

    function reveal(bool choice, uint256 nonce) external {
        require(keccak256(abi.encode(choice, nonce)) == p1selection);
        require(player2 != payable(0x0));

        if (p2selection == choice) {
            player2.transfer(address(this).balance);
        }
        else {
            player1.transfer(address(this).balance);
        }

        bet = 0;
        player1 = payable(0x0);
        player2 = payable(0x0);
    }
}