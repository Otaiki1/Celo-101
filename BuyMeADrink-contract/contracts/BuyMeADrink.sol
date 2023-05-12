//SPDX-License-Identifier: Unlicense

// contracts/BuyMeADrink.sol
pragma solidity ^0.8.0;

contract BuyMeADrink {
    // Event to emit when a Note is created.
    event NewNote(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Note struct.
    struct Note {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable owner;

    // List of all Notes received from coffee purchases.
    Note[] notes;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        owner = payable(msg.sender);
    }

    /**
     * @dev fetches all stored notes
     */
    function getNotes() public view returns (Note[] memory) {
        return notes;
    }

    /**
     * @dev buy a drink for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the drinks purchaser
     * @param _message a nice message from the purchaser, might include name of drink
     */
    function buyDrink(
        string memory _name,
        string memory _message
    ) public payable {
        // Must accept more than 0 ETH for a drink .
        require(msg.value > 0, "can't buy drink for free!");

        // Add the memo to storage!
        notes.push(Note(msg.sender, block.timestamp, _name, _message));

        // Emit a NewNote event with details about the Note.
        emit NewNote(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawFunds() public {
        //ensure only owner can call function
        require(msg.sender == owner);
        require(owner.send(address(this).balance));
    }
}
