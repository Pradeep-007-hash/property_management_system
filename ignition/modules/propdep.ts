import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PropertyManagementModule = buildModule("PropertyManagementModule", (m) => {

  const propertyManagement = m.contract("PropertyManagement");

  return { propertyManagement };
});

export default PropertyManagementModule;