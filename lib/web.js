"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
window.TonGateway = {
    create: () => {
        return new index_1.Gateway();
    },
    getHttpEndpoint: index_1.getHttpEndpoint,
    getHttpV4Endpoint: index_1.getHttpV4Endpoint,
};
//# sourceMappingURL=web.js.map