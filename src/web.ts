import { Gateway, getHttpEndpoint, Config } from "./index";

declare global {

  interface Window {
    tonGateway: object;
  }


}

window.tonGateway = {
  create: (config: Config) => { return new Gateway(config) },
  getHttpEndpoint
}
