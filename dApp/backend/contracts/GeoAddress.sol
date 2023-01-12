pragma solidity >=0.4.22 <0.9.0;

contract GeoAddress {
    string public globalId;
    address user;
    string public lat;
    string public lon;
    string public houseNumber;
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

    constructor(string memory _lat, string memory _lon, string memory _globalId, string memory _house_number) {
        user = msg.sender;
        status = STATUSES.CREATED;
        lat = _lat;
        lon = _lon;
        globalId = _globalId;
        houseNumber = _house_number;

        emit Action("CREATED", user, block.timestamp); 
    }

    function update() public {

        require(msg.sender == user);
        require(status == STATUSES.CREATED);

        status = STATUSES.COMPLETE;

        emit Action("COMPLETE", user, block.timestamp);
    }

}
