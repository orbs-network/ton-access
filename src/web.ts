import { Gateway, getHttpEndpoint, getTonApiV4Endpoint } from "./index";
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
  getTonApiV4Endpoint,
};
