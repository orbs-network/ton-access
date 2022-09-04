import { Client } from './index';


declare global {
  interface Window {
    tonGateway: any;
  }
}

window.tonGateway = Client;
