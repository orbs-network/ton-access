"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/whatwg-fetch/dist/fetch.umd.js
  var require_fetch_umd = __commonJS({
    "node_modules/whatwg-fetch/dist/fetch.umd.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.WHATWGFetch = {});
      })(exports, function(exports2) {
        "use strict";
        var global = typeof globalThis !== "undefined" && globalThis || typeof self !== "undefined" && self || typeof global !== "undefined" && global;
        var support = {
          searchParams: "URLSearchParams" in global,
          iterable: "Symbol" in global && "iterator" in Symbol,
          blob: "FileReader" in global && "Blob" in global && function() {
            try {
              new Blob();
              return true;
            } catch (e) {
              return false;
            }
          }(),
          formData: "FormData" in global,
          arrayBuffer: "ArrayBuffer" in global
        };
        function isDataView(obj) {
          return obj && DataView.prototype.isPrototypeOf(obj);
        }
        if (support.arrayBuffer) {
          var viewClasses = [
            "[object Int8Array]",
            "[object Uint8Array]",
            "[object Uint8ClampedArray]",
            "[object Int16Array]",
            "[object Uint16Array]",
            "[object Int32Array]",
            "[object Uint32Array]",
            "[object Float32Array]",
            "[object Float64Array]"
          ];
          var isArrayBufferView = ArrayBuffer.isView || function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
          };
        }
        function normalizeName(name) {
          if (typeof name !== "string") {
            name = String(name);
          }
          if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === "") {
            throw new TypeError('Invalid character in header field name: "' + name + '"');
          }
          return name.toLowerCase();
        }
        function normalizeValue(value) {
          if (typeof value !== "string") {
            value = String(value);
          }
          return value;
        }
        function iteratorFor(items) {
          var iterator = {
            next: function() {
              var value = items.shift();
              return { done: value === void 0, value };
            }
          };
          if (support.iterable) {
            iterator[Symbol.iterator] = function() {
              return iterator;
            };
          }
          return iterator;
        }
        function Headers(headers) {
          this.map = {};
          if (headers instanceof Headers) {
            headers.forEach(function(value, name) {
              this.append(name, value);
            }, this);
          } else if (Array.isArray(headers)) {
            headers.forEach(function(header) {
              this.append(header[0], header[1]);
            }, this);
          } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function(name) {
              this.append(name, headers[name]);
            }, this);
          }
        }
        Headers.prototype.append = function(name, value) {
          name = normalizeName(name);
          value = normalizeValue(value);
          var oldValue = this.map[name];
          this.map[name] = oldValue ? oldValue + ", " + value : value;
        };
        Headers.prototype["delete"] = function(name) {
          delete this.map[normalizeName(name)];
        };
        Headers.prototype.get = function(name) {
          name = normalizeName(name);
          return this.has(name) ? this.map[name] : null;
        };
        Headers.prototype.has = function(name) {
          return this.map.hasOwnProperty(normalizeName(name));
        };
        Headers.prototype.set = function(name, value) {
          this.map[normalizeName(name)] = normalizeValue(value);
        };
        Headers.prototype.forEach = function(callback, thisArg) {
          for (var name in this.map) {
            if (this.map.hasOwnProperty(name)) {
              callback.call(thisArg, this.map[name], name, this);
            }
          }
        };
        Headers.prototype.keys = function() {
          var items = [];
          this.forEach(function(value, name) {
            items.push(name);
          });
          return iteratorFor(items);
        };
        Headers.prototype.values = function() {
          var items = [];
          this.forEach(function(value) {
            items.push(value);
          });
          return iteratorFor(items);
        };
        Headers.prototype.entries = function() {
          var items = [];
          this.forEach(function(value, name) {
            items.push([name, value]);
          });
          return iteratorFor(items);
        };
        if (support.iterable) {
          Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
        }
        function consumed(body) {
          if (body.bodyUsed) {
            return Promise.reject(new TypeError("Already read"));
          }
          body.bodyUsed = true;
        }
        function fileReaderReady(reader) {
          return new Promise(function(resolve, reject) {
            reader.onload = function() {
              resolve(reader.result);
            };
            reader.onerror = function() {
              reject(reader.error);
            };
          });
        }
        function readBlobAsArrayBuffer(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsArrayBuffer(blob);
          return promise;
        }
        function readBlobAsText(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsText(blob);
          return promise;
        }
        function readArrayBufferAsText(buf) {
          var view = new Uint8Array(buf);
          var chars = new Array(view.length);
          for (var i = 0; i < view.length; i++) {
            chars[i] = String.fromCharCode(view[i]);
          }
          return chars.join("");
        }
        function bufferClone(buf) {
          if (buf.slice) {
            return buf.slice(0);
          } else {
            var view = new Uint8Array(buf.byteLength);
            view.set(new Uint8Array(buf));
            return view.buffer;
          }
        }
        function Body() {
          this.bodyUsed = false;
          this._initBody = function(body) {
            this.bodyUsed = this.bodyUsed;
            this._bodyInit = body;
            if (!body) {
              this._bodyText = "";
            } else if (typeof body === "string") {
              this._bodyText = body;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
              this._bodyBlob = body;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
              this._bodyFormData = body;
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this._bodyText = body.toString();
            } else if (support.arrayBuffer && support.blob && isDataView(body)) {
              this._bodyArrayBuffer = bufferClone(body.buffer);
              this._bodyInit = new Blob([this._bodyArrayBuffer]);
            } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
              this._bodyArrayBuffer = bufferClone(body);
            } else {
              this._bodyText = body = Object.prototype.toString.call(body);
            }
            if (!this.headers.get("content-type")) {
              if (typeof body === "string") {
                this.headers.set("content-type", "text/plain;charset=UTF-8");
              } else if (this._bodyBlob && this._bodyBlob.type) {
                this.headers.set("content-type", this._bodyBlob.type);
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
              }
            }
          };
          if (support.blob) {
            this.blob = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return Promise.resolve(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              } else if (this._bodyFormData) {
                throw new Error("could not read FormData body as blob");
              } else {
                return Promise.resolve(new Blob([this._bodyText]));
              }
            };
            this.arrayBuffer = function() {
              if (this._bodyArrayBuffer) {
                var isConsumed = consumed(this);
                if (isConsumed) {
                  return isConsumed;
                }
                if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
                  return Promise.resolve(
                    this._bodyArrayBuffer.buffer.slice(
                      this._bodyArrayBuffer.byteOffset,
                      this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
                    )
                  );
                } else {
                  return Promise.resolve(this._bodyArrayBuffer);
                }
              } else {
                return this.blob().then(readBlobAsArrayBuffer);
              }
            };
          }
          this.text = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return readBlobAsText(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as text");
            } else {
              return Promise.resolve(this._bodyText);
            }
          };
          if (support.formData) {
            this.formData = function() {
              return this.text().then(decode);
            };
          }
          this.json = function() {
            return this.text().then(JSON.parse);
          };
          return this;
        }
        var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        function normalizeMethod(method) {
          var upcased = method.toUpperCase();
          return methods.indexOf(upcased) > -1 ? upcased : method;
        }
        function Request(input, options) {
          if (!(this instanceof Request)) {
            throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
          }
          options = options || {};
          var body = options.body;
          if (input instanceof Request) {
            if (input.bodyUsed) {
              throw new TypeError("Already read");
            }
            this.url = input.url;
            this.credentials = input.credentials;
            if (!options.headers) {
              this.headers = new Headers(input.headers);
            }
            this.method = input.method;
            this.mode = input.mode;
            this.signal = input.signal;
            if (!body && input._bodyInit != null) {
              body = input._bodyInit;
              input.bodyUsed = true;
            }
          } else {
            this.url = String(input);
          }
          this.credentials = options.credentials || this.credentials || "same-origin";
          if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers);
          }
          this.method = normalizeMethod(options.method || this.method || "GET");
          this.mode = options.mode || this.mode || null;
          this.signal = options.signal || this.signal;
          this.referrer = null;
          if ((this.method === "GET" || this.method === "HEAD") && body) {
            throw new TypeError("Body not allowed for GET or HEAD requests");
          }
          this._initBody(body);
          if (this.method === "GET" || this.method === "HEAD") {
            if (options.cache === "no-store" || options.cache === "no-cache") {
              var reParamSearch = /([?&])_=[^&]*/;
              if (reParamSearch.test(this.url)) {
                this.url = this.url.replace(reParamSearch, "$1_=" + new Date().getTime());
              } else {
                var reQueryString = /\?/;
                this.url += (reQueryString.test(this.url) ? "&" : "?") + "_=" + new Date().getTime();
              }
            }
          }
        }
        Request.prototype.clone = function() {
          return new Request(this, { body: this._bodyInit });
        };
        function decode(body) {
          var form = new FormData();
          body.trim().split("&").forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split("=");
              var name = split.shift().replace(/\+/g, " ");
              var value = split.join("=").replace(/\+/g, " ");
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
          return form;
        }
        function parseHeaders(rawHeaders) {
          var headers = new Headers();
          var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
          preProcessedHeaders.split("\r").map(function(header) {
            return header.indexOf("\n") === 0 ? header.substr(1, header.length) : header;
          }).forEach(function(line) {
            var parts = line.split(":");
            var key = parts.shift().trim();
            if (key) {
              var value = parts.join(":").trim();
              headers.append(key, value);
            }
          });
          return headers;
        }
        Body.call(Request.prototype);
        function Response(bodyInit, options) {
          if (!(this instanceof Response)) {
            throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
          }
          if (!options) {
            options = {};
          }
          this.type = "default";
          this.status = options.status === void 0 ? 200 : options.status;
          this.ok = this.status >= 200 && this.status < 300;
          this.statusText = options.statusText === void 0 ? "" : "" + options.statusText;
          this.headers = new Headers(options.headers);
          this.url = options.url || "";
          this._initBody(bodyInit);
        }
        Body.call(Response.prototype);
        Response.prototype.clone = function() {
          return new Response(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
          });
        };
        Response.error = function() {
          var response = new Response(null, { status: 0, statusText: "" });
          response.type = "error";
          return response;
        };
        var redirectStatuses = [301, 302, 303, 307, 308];
        Response.redirect = function(url, status) {
          if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError("Invalid status code");
          }
          return new Response(null, { status, headers: { location: url } });
        };
        exports2.DOMException = global.DOMException;
        try {
          new exports2.DOMException();
        } catch (err) {
          exports2.DOMException = function(message, name) {
            this.message = message;
            this.name = name;
            var error = Error(message);
            this.stack = error.stack;
          };
          exports2.DOMException.prototype = Object.create(Error.prototype);
          exports2.DOMException.prototype.constructor = exports2.DOMException;
        }
        function fetch2(input, init) {
          return new Promise(function(resolve, reject) {
            var request = new Request(input, init);
            if (request.signal && request.signal.aborted) {
              return reject(new exports2.DOMException("Aborted", "AbortError"));
            }
            var xhr = new XMLHttpRequest();
            function abortXhr() {
              xhr.abort();
            }
            xhr.onload = function() {
              var options = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(xhr.getAllResponseHeaders() || "")
              };
              options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
              var body = "response" in xhr ? xhr.response : xhr.responseText;
              setTimeout(function() {
                resolve(new Response(body, options));
              }, 0);
            };
            xhr.onerror = function() {
              setTimeout(function() {
                reject(new TypeError("Network request failed"));
              }, 0);
            };
            xhr.ontimeout = function() {
              setTimeout(function() {
                reject(new TypeError("Network request failed"));
              }, 0);
            };
            xhr.onabort = function() {
              setTimeout(function() {
                reject(new exports2.DOMException("Aborted", "AbortError"));
              }, 0);
            };
            function fixUrl(url) {
              try {
                return url === "" && global.location.href ? global.location.href : url;
              } catch (e) {
                return url;
              }
            }
            xhr.open(request.method, fixUrl(request.url), true);
            if (request.credentials === "include") {
              xhr.withCredentials = true;
            } else if (request.credentials === "omit") {
              xhr.withCredentials = false;
            }
            if ("responseType" in xhr) {
              if (support.blob) {
                xhr.responseType = "blob";
              } else if (support.arrayBuffer && request.headers.get("Content-Type") && request.headers.get("Content-Type").indexOf("application/octet-stream") !== -1) {
                xhr.responseType = "arraybuffer";
              }
            }
            if (init && typeof init.headers === "object" && !(init.headers instanceof Headers)) {
              Object.getOwnPropertyNames(init.headers).forEach(function(name) {
                xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
              });
            } else {
              request.headers.forEach(function(value, name) {
                xhr.setRequestHeader(name, value);
              });
            }
            if (request.signal) {
              request.signal.addEventListener("abort", abortXhr);
              xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                  request.signal.removeEventListener("abort", abortXhr);
                }
              };
            }
            xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
          });
        }
        fetch2.polyfill = true;
        if (!global.fetch) {
          global.fetch = fetch2;
          global.Headers = Headers;
          global.Request = Request;
          global.Response = Response;
        }
        exports2.Headers = Headers;
        exports2.Request = Request;
        exports2.Response = Response;
        exports2.fetch = fetch2;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    }
  });

  // node_modules/isomorphic-fetch/fetch-npm-browserify.js
  var require_fetch_npm_browserify = __commonJS({
    "node_modules/isomorphic-fetch/fetch-npm-browserify.js"(exports, module) {
      require_fetch_umd();
      module.exports = self.fetch.bind(self);
    }
  });

  // lib/nodes.js
  var require_nodes = __commonJS({
    "lib/nodes.js"(exports) {
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
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Nodes = void 0;
      require_fetch_npm_browserify();
      var Nodes = class {
        constructor() {
          this.nodeIndex = -1;
          this.committee = /* @__PURE__ */ new Set();
          this.topology = [];
          this.initTime = 0;
        }
        init(nodesUrl) {
          return __awaiter(this, void 0, void 0, function* () {
            this.nodeIndex = -1;
            this.committee.clear();
            this.topology = [];
            this.initTime = Date.now();
            let topology = [];
            try {
              const response = yield fetch(nodesUrl);
              const data = yield response.json();
              topology = data;
            } catch (e) {
              throw new Error(`exception in fetch(${nodesUrl}): ${e}`);
            }
            for (const node of topology) {
              if (node.Healthy === "1") {
                this.topology.push(node);
              }
            }
            if (this.topology.length === 0)
              throw new Error(`no healthy nodes in ${nodesUrl}`);
          });
        }
        getHealthyFor(protonet) {
          var _a;
          const res = [];
          for (const node of this.topology) {
            if (node.Weight > 0 && ((_a = node.Mngr) === null || _a === void 0 ? void 0 : _a.health[protonet])) {
              res.push(node);
            }
          }
          return res;
        }
      };
      exports.Nodes = Nodes;
    }
  });

  // package.json
  var require_package = __commonJS({
    "package.json"(exports, module) {
      module.exports = {
        name: "@orbs-network/ton-access",
        version: "2.3.3",
        description: "Unthrottled anonymous RPC access to TON blockchain via a robust decentralized network",
        source: "lib/index.js",
        main: "lib/index.js",
        types: "lib/index.d.ts",
        files: [
          "lib/**/*"
        ],
        scripts: {
          test: "env mocha -r ts-node/register test/**/*.ts",
          "test:v2": "env mocha -r ts-node/register test/ton-v2.ts",
          "test:v4": "env mocha -r ts-node/register test/ton-v4.ts",
          cleanup: "rimraf ./lib",
          "build:web:reg": "esbuild ./lib/web.js --bundle  --sourcemap --target=es2015 --outfile=./dist/index.js",
          "build:web:min": "esbuild ./lib/web.js --bundle  --minify    --target=es2015 --outfile=./dist/index.min.js",
          "build:web": "rimraf ./dist && npm run build:web:reg && npm run build:web:min",
          build: "npm run lint && rimraf ./lib && tsc && npm run build:web",
          format: 'prettier --write "src/**/*.ts"',
          lint: "tslint -p tsconfig.json",
          prepare: "npm run build",
          prepublishOnly: "npm test && npm run lint",
          preversion: "npm run lint",
          version: "npm run format && git add -A src",
          postversion: "git push && git push --tags"
        },
        repository: {
          type: "git",
          url: "git+https://github.com/orbs-network/ton-access.git"
        },
        author: "yuval@orbs.com",
        license: "MIT",
        bugs: {
          url: "https://github.com/orbs-network/ton-access/issues"
        },
        homepage: "https://github.com/orbs-network/ton-access#readme",
        dependencies: {
          "isomorphic-fetch": "^3.0.0"
        },
        devDependencies: {
          "@types/bn.js": "^5.1.1",
          "@types/chai": "^4.3.4",
          "@types/isomorphic-fetch": "^0.0.36",
          "@types/mocha": "^10.0.0",
          "@types/ws": "^8.5.4",
          buffer: "^6.0.3",
          chai: "^4.3.7",
          esbuild: "^0.15.14",
          mocha: "^10.1.0",
          prettier: "^2.7.1",
          rimraf: "^3.0.2",
          ton: "^12.1.3",
          "ton-lite-client": "npm:@truecarry/ton-lite-client@^1.6.1",
          tonweb: "^0.0.58",
          "ts-node": "^10.9.1",
          tslib: "^2.4.0",
          tslint: "^6.1.3",
          "tslint-config-prettier": "^1.18.0",
          ws: "^8.13.0"
        }
      };
    }
  });

  // lib/index.js
  var require_lib = __commonJS({
    "lib/index.js"(exports) {
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
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getWsV4Endpoint = exports.getHttpV4Endpoint = exports.getHttpV4Endpoints = exports.getHttpEndpoint = exports.getHttpEndpoints = exports.Access = void 0;
      var nodes_1 = require_nodes();
      var Access = class {
        constructor() {
          this.host = "ton.access.orbs.network";
          this.urlVersion = 1;
          this.nodes = new nodes_1.Nodes();
          this.package = require_package();
        }
        init() {
          return __awaiter(this, void 0, void 0, function* () {
            yield this.nodes.init(`https://${this.host}/mngr/nodes?npm_version=${this.package.version}`);
          });
        }
        makeProtonet(edgeProtocol, network) {
          let res = "";
          switch (edgeProtocol) {
            case "toncenter-api-v2":
              res += "v2-";
              break;
            case "ton-api-v4":
              res += "v4-";
              break;
          }
          res += network;
          return res;
        }
        weightedRandom(nodes) {
          let sumWeights = 0;
          for (const node of nodes) {
            sumWeights += node.Weight;
          }
          const rnd = Math.floor(Math.random() * sumWeights);
          let cur = 0;
          for (const node of nodes) {
            if (rnd >= cur && rnd < cur + node.Weight)
              return node;
            cur += node.Weight;
          }
        }
        buildUrls(scheme, network, edgeProtocol, suffix, single) {
          if (!suffix)
            suffix = "";
          if (!edgeProtocol)
            edgeProtocol = "toncenter-api-v2";
          if (!network)
            network = "mainnet";
          if (suffix.length)
            suffix = suffix.replace(/^\/+/, "");
          const res = [];
          const protonet = this.makeProtonet(edgeProtocol, network);
          let healthyNodes = this.nodes.getHealthyFor(protonet);
          if (!(healthyNodes === null || healthyNodes === void 0 ? void 0 : healthyNodes.length))
            throw new Error(`no healthy nodes for ${protonet}`);
          if (single && healthyNodes.length) {
            const chosen = this.weightedRandom(healthyNodes);
            if (chosen)
              healthyNodes = [chosen];
            else
              throw new Error("weightedRandom return empty");
          }
          for (const node of healthyNodes) {
            let url = `${scheme}://${this.host}/${node.NodeId}/${this.urlVersion}/${network}/${edgeProtocol}`;
            if (suffix.length)
              url += `/${suffix}`;
            res.push(url);
          }
          return res;
        }
      };
      exports.Access = Access;
      function getEndpoints(scheme, network, edgeProtocol, suffix, single) {
        return __awaiter(this, void 0, void 0, function* () {
          const access = new Access();
          yield access.init();
          const res = access.buildUrls(scheme, network, edgeProtocol, suffix, single);
          return res;
        });
      }
      function getHttpEndpoints(config, single) {
        return __awaiter(this, void 0, void 0, function* () {
          const network = (config === null || config === void 0 ? void 0 : config.network) ? config.network : "mainnet";
          const scheme = (config === null || config === void 0 ? void 0 : config.scheme) ? config.scheme : "https";
          let suffix = "jsonRPC";
          if ((config === null || config === void 0 ? void 0 : config.protocol) === "rest") {
            suffix = "";
          }
          return yield getEndpoints(scheme, network, "toncenter-api-v2", suffix, single);
        });
      }
      exports.getHttpEndpoints = getHttpEndpoints;
      function getHttpEndpoint(config) {
        return __awaiter(this, void 0, void 0, function* () {
          const endpoints = yield getHttpEndpoints(config, true);
          return endpoints[0];
        });
      }
      exports.getHttpEndpoint = getHttpEndpoint;
      function getHttpV4Endpoints(config, single) {
        return __awaiter(this, void 0, void 0, function* () {
          const network = (config === null || config === void 0 ? void 0 : config.network) ? config.network : "mainnet";
          const scheme = (config === null || config === void 0 ? void 0 : config.scheme) ? config.scheme : "https";
          if ((config === null || config === void 0 ? void 0 : config.protocol) === "json-rpc") {
            throw Error("config.protocol json-rpc is not supported for getTonApiV4Endpoints");
          }
          const suffix = "";
          return yield getEndpoints(scheme, network, "ton-api-v4", suffix, single);
        });
      }
      exports.getHttpV4Endpoints = getHttpV4Endpoints;
      function getHttpV4Endpoint(config) {
        return __awaiter(this, void 0, void 0, function* () {
          const endpoints = yield getHttpV4Endpoints(config, true);
          return endpoints[0];
        });
      }
      exports.getHttpV4Endpoint = getHttpV4Endpoint;
      function getWsV4Endpoint(config) {
        return __awaiter(this, void 0, void 0, function* () {
          const endpoints = yield getHttpV4Endpoints(config, true);
          return endpoints[0];
        });
      }
      exports.getWsV4Endpoint = getWsV4Endpoint;
    }
  });

  // lib/web.js
  var require_web = __commonJS({
    "lib/web.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      var index_1 = require_lib();
      window.TonAccess = {
        create: () => {
          return new index_1.Access();
        },
        getHttpEndpoint: index_1.getHttpEndpoint,
        getHttpV4Endpoint: index_1.getHttpV4Endpoint,
        getWsV4Endpoint: index_1.getWsV4Endpoint
      };
    }
  });
  require_web();
})();
//# sourceMappingURL=index.js.map
