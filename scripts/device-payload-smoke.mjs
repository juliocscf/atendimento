import assert from "node:assert/strict";

import { deviceCreateSchema } from "../lib/validation/device.ts";

const validPayload = {
  branchId: "da3b3eb7-6b5e-41ca-8337-c04148e06fcd",
  clientId: "aae96ae6-f3e0-4670-8d33-cc3c66564166",
  deviceTypeId: "57fcb233-fee9-4765-8a95-5dfbac5bd6d3",
  manufacturer: "Teste",
};

assert.equal(deviceCreateSchema.safeParse(validPayload).success, true, "valid device payload must pass");
assert.equal(
  deviceCreateSchema.safeParse({ ...validPayload, unknownField: "must be rejected" }).success,
  false,
  "unknown device payload fields must be rejected",
);

console.log("device payload smoke passed: valid payload accepted, unknown field rejected");
