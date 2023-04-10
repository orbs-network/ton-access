import { Access, getHttpEndpoint, getHttpV4Endpoint, getWsV4Endpoint } from "./index";
declare global {
  interface Window {
    TonAccess: object;
  }
}

window.TonAccess = {
  create: () => {
    return new Access();
  },
  getHttpEndpoint,
  getHttpV4Endpoint,
  getWsV4Endpoint,
};
