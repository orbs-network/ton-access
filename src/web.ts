import { Nodes } from './nodes';

declare global {
  interface Window {
    orbsClient: any;
  }
}

window.orbsClient = new Nodes();
