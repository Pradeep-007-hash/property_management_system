// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PropertyManagement {

    struct Property {
        uint256 propertyId;
        address owner;
        string name;        // NEW
        string location;    // NEW
        string ipfsHash;
        uint256 price;      // price in wei
        bool isForSale;
    }

    uint256 public propertyCount;
    mapping(uint256 => Property) public properties;

    // Events
    event PropertyRegistered(
        uint256 propertyId,
        address owner,
        string name,
        string location,
        string ipfsHash,
        uint256 price
    );

    event PropertyForSale(
        uint256 propertyId,
        uint256 price
    );

    event PropertyTransferred(
        uint256 propertyId,
        address from,
        address to
    );

    event PropertySold(
        uint256 propertyId,
        address buyer,
        uint256 price
    );

    modifier onlyOwner(uint256 _propertyId) {
        require(_propertyId > 0 && _propertyId <= propertyCount, "Invalid property");
        require(properties[_propertyId].owner == msg.sender, "You are not the owner");
        _;
    }

    // 1️⃣ Register property (NO payment needed)
    function registerProperty(
        string memory _name,
        string memory _location,
        string memory _ipfsHash,
        uint256 _price
    ) external {
        require(_price > 0, "Price must be greater than zero");

        propertyCount++;

        properties[propertyCount] = Property({
            propertyId: propertyCount,
            owner: msg.sender,
            name: _name,
            location: _location,
            ipfsHash: _ipfsHash,
            price: _price,
            isForSale: false
        });

        emit PropertyRegistered(
            propertyCount,
            msg.sender,
            _name,
            _location,
            _ipfsHash,
            _price
        );
    }

    // 2️⃣ Put property for sale
    function putPropertyForSale(
        uint256 _propertyId,
        uint256 _price
    ) external onlyOwner(_propertyId) {
        require(_price > 0, "Invalid price");

        properties[_propertyId].price = _price;
        properties[_propertyId].isForSale = true;

        emit PropertyForSale(_propertyId, _price);
    }

    // cancel an existing listing
    function cancelSale(uint256 _propertyId) external onlyOwner(_propertyId) {
        properties[_propertyId].isForSale = false;
        emit PropertyForSale(_propertyId, 0);
    }

    // 3️⃣ Buy property
    function buyProperty(uint256 _id) external payable {
        require(_id > 0 && _id <= propertyCount, "Property not found");

        Property storage prop = properties[_id];

        require(prop.isForSale, "Property not for sale");
        require(msg.sender != prop.owner, "Owner cannot buy own property");
        require(msg.value == prop.price, "Incorrect ETH amount");

        address seller = prop.owner;

        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "ETH transfer failed");

        prop.owner = msg.sender;
        prop.isForSale = false;

        emit PropertySold(_id, msg.sender, msg.value);
        emit PropertyTransferred(_id, seller, msg.sender);
    }

    // 4️⃣ Get property details
    function getProperty(uint256 _propertyId)
        external
        view
        returns (
            uint256,
            address,
            string memory,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        require(_propertyId > 0 && _propertyId <= propertyCount, "Property not found");

        Property memory p = properties[_propertyId];

        return (
            p.propertyId,
            p.owner,
            p.name,
            p.location,
            p.ipfsHash,
            p.price,
            p.isForSale
        );
    }
}
