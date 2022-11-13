"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
window.TonGateway = {
    create: () => {
        return new index_1.Gateway();
    },
    getTonCenterV2Endpoint: index_1.getTonCenterV2Endpoint,
    getTonApiV4Endpoint: index_1.getTonApiV4Endpoint,
};
//# sourceMappingURL=web.js.map