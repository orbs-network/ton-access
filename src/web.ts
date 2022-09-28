import { Gateway, getHttpEndpoint, Config } from "./index";

declare global {

  interface Window {
    TonGateway: object;
  }


}

window.TonGateway = {
  create: (config: Config) => { return new Gateway(config) },
  getHttpEndpoint
}
