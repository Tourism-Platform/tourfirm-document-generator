import type { IBackendAuthResponse } from "@/lib/backend/types";

export const backendAuthResponseFixture: IBackendAuthResponse = {
  id: "user-example-id",
  email: "operator@example.com",
  role: "operator",
  picture: null,
  agency_id: null,
  operator_id: "operator-example-id",
};
