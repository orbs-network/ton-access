import { Gateway, getHttpEndpoint, getHttpV4Endpoint } from "./index";
declare global {
  interface Window {
    TonGateway: object;
  }
}

window.TonGateway = {
  create: () => {
    return new Gateway();
  },
  getHttpEndpoint,
  getHttpV4Endpoint,
};
