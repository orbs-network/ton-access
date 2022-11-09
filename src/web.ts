
import { Gateway, getTonCenterV2Endpoint, getTonApiV4Endpoint } from "./index";
declare global {
  interface Window {
    TonGateway: object;
  }
}

window.TonGateway = {
  create: () => {
    return new Gateway();
  },
  getTonCenterV2Endpoint,
  getTonApiV4Endpoint
};
