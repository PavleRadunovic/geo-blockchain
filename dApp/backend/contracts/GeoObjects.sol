pragma solidity >=0.4.22 <0.9.0;

contract GeoObjects {
    string public globalId;
    address user;
    string public coords;
    string public objectNumber;
    string public parcelNumber;
    STATUSES public status;

    enum STATUSES {
        CREATED,
        COMPLETE
    }

    event Action (
        string name,
        address account,
        uint timestamp
    );

    constructor(string memory _coords, string memory _globalId, string memory _objectNumber,  string memory _parcelNumber) {
        user = msg.sender;
        status = STATUSES.CREATED;
        coords = _coords;
        globalId = _globalId;
        objectNumber = _objectNumber;
        parcelNumber = _parcelNumber;

        emit Action("CREATED", user, block.timestamp); 
    }

    function update() public {

        require(msg.sender == user);
        require(status == STATUSES.CREATED);

        status = STATUSES.COMPLETE;

        emit Action("COMPLETE", user, block.timestamp);
    }

}
