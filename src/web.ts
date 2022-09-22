import { Gateway, getHttpEndpoint, Config } from "./index";

declare global {
  interface Window {
    tonGateway: object;
    getHttpEndpoint: (config: Config) => Promise<string>;
  }
}

window.tonGateway = Gateway;
window.getHttpEndpoint = getHttpEndpoint;
