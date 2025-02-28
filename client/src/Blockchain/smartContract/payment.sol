// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StayspherePayments {
    address public platformOwner;
    uint256 public platformFeePercentage = 2; // 2% fee

    mapping(address => bool) public registeredHosts;

    event HostRegistered(address indexed host);
    event PaymentMade(address indexed guest, address indexed host, uint256 amount);
    event RefundIssued(address indexed guest, address indexed host, uint256 amount);

    constructor() {
        platformOwner = msg.sender;
    }

    // Register a host
    function registerHost() external {
        require(!registeredHosts[msg.sender], "Already registered");
        registeredHosts[msg.sender] = true;
        emit HostRegistered(msg.sender);
    }

    // Pay a host
    function payHost(address host) external payable {
        require(registeredHosts[host], "Host not registered");
        require(msg.value > 0, "Payment must be greater than 0");

        uint256 platformFee = (msg.value * platformFeePercentage) / 100;
        uint256 hostAmount = msg.value - platformFee;

        payable(host).transfer(hostAmount);
        payable(platformOwner).transfer(platformFee);

        emit PaymentMade(msg.sender, host, msg.value);
    }

    // Refunds (only owner can issue refunds)
    function issueRefund(address guest, address host, uint256 amount) external {
        require(msg.sender == platformOwner, "Only platform owner can refund");
        require(address(this).balance >= amount, "Insufficient funds");

        payable(guest).transfer(amount);
        emit RefundIssued(guest, host, amount);
    }

    // Function to withdraw platform earnings
    function withdrawPlatformEarnings() external {
        require(msg.sender == platformOwner, "Only owner can withdraw");
        payable(platformOwner).transfer(address(this).balance);
    }
}
