import { ethers } from 'ethers';

// address obtained from deployment (user provided)
export const PROPERTY_MANAGEMENT_ADDRESS = '0x468dDe4918F2ad552B6f45c899E3c868E4a2e5a1';

// trimmed ABI copied from build artifacts; only the necessary entries are included
const PROPERTY_MANAGEMENT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "propertyId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "PropertyForSale",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "propertyId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "location", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "PropertyRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "propertyId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "PropertySold",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "propertyId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "PropertyTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "propertyCount",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "name": "properties",
    "outputs": [
      { "internalType": "uint256", "name": "propertyId", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "location", "type": "string" },
      { "internalType": "string", "name": "ipfsHash", "type": "string" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "bool", "name": "isForSale", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_location", "type": "string" },
      { "internalType": "string", "name": "_ipfsHash", "type": "string" },
      { "internalType": "uint256", "name": "_price", "type": "uint256" }
    ],
    "name": "registerProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" }
    ],
    "name": "buyProperty",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_propertyId", "type": "uint256" },
      { "internalType": "uint256", "name": "_price", "type": "uint256" }
    ],
    "name": "putPropertyForSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_propertyId", "type": "uint256" }
    ],
    "name": "cancelSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

/**
 * helper that returns an ethers.Contract instance connected to the passed
 * signer or provider.  Pass a signer when you want to send transactions;
 * pass a provider for read-only calls.
 */
export function getPropertyContract(signerOrProvider) {
  return new ethers.Contract(
    PROPERTY_MANAGEMENT_ADDRESS,
    PROPERTY_MANAGEMENT_ABI,
    signerOrProvider,
  );
}
