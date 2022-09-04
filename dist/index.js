"use strict";
(function() {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = function(cb, mod) {
    return function __require() {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    };
  };

  // lib/nodes.js
  var require_nodes = __commonJS({
    "lib/nodes.js": function(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __generator = exports && exports.__generator || function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Nodes = void 0;
      var Nodes = function() {
        function Nodes2() {
          this.nodeIndex = -1;
          this.committee = /* @__PURE__ */ new Set();
          this.topology = [];
        }
        Nodes2.prototype.init = function(url) {
          return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  this.nodeIndex = -1;
                  this.committee.clear();
                  this.topology = [];
                  _a = this;
                  return [4, this.loadSeed(url)];
                case 1:
                  _a.topology = _b.sent();
                  return [2];
              }
            });
          });
        };
        Nodes2.prototype.loadSeed = function(url) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              console.log("backend url is not used in this version - hard coded instead (".concat(url, ")"));
              return [2, [
                { "Name": "2000000000000000000000000000000000000002", "Ip": "18.221.31.187" },
                { "Name": "3000000000000000000000000000000000000003", "Ip": "3.140.253.61" }
              ]];
            });
          });
        };
        Nodes2.prototype.getNextNode = function(committeeOnly) {
          if (committeeOnly === void 0) {
            committeeOnly = true;
          }
          while (true) {
            this.nodeIndex++;
            if (this.nodeIndex >= this.topology.length)
              this.nodeIndex = 0;
            return this.topology[this.nodeIndex];
          }
        };
        Nodes2.prototype.getRandomNode = function(committeeOnly) {
          if (committeeOnly === void 0) {
            committeeOnly = true;
          }
          var index = Math.floor(Math.random() * this.topology.length);
          while (true) {
            index++;
            if (index >= this.topology.length)
              index = 0;
            return this.topology[index];
          }
        };
        return Nodes2;
      }();
      exports.Nodes = Nodes;
    }
  });

  // lib/web.js
  var require_web = __commonJS({
    "lib/web.js": function(exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      var nodes_1 = require_nodes();
      window.orbsClient = new nodes_1.Nodes();
    }
  });
  require_web();
})();
//# sourceMappingURL=index.js.map
