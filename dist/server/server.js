"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const webpack_hot_middleware_1 = __importDefault(require("webpack-hot-middleware"));
const hapi_1 = __importDefault(require("@hapi/hapi"));
const webpack_config_1 = __importStar(require("../webpack.config"));
function init(port = 8000, host = 'localhost') {
    return __awaiter(this, void 0, void 0, function* () {
        const server = hapi_1.default.server({
            port: port,
            host: host,
            routes: {
                files: {
                    relativeTo: path_1.default.join(__dirname, '../public'),
                },
            },
        });
        yield server.register([
            { plugin: require('blipp'), options: { showAuth: true } },
            require('@hapi/inert'),
        ]);
        if (webpack_config_1.mode !== 'development') {
            server.route([
                {
                    method: 'GET',
                    path: '/{file}.{ext}',
                    handler: (request, h) => {
                        const { file, ext } = request.params;
                        switch (ext) {
                            default:
                                return h.continue;
                            case 'js':
                            case 'css':
                                return h.file(file + '.' + ext);
                        }
                    },
                },
                {
                    method: '*',
                    path: '/{any*}',
                    options: {
                        files: {
                            relativeTo: path_1.default.join(__dirname, '../public'),
                        },
                    },
                    handler: (request, h) => {
                        return h.file('../public/index.html').type('text/html');
                    },
                },
            ]);
        }
        if (webpack_config_1.mode === 'development') {
            const compiler = (0, webpack_1.default)(webpack_config_1.default);
            const devMiddleware = require('webpack-dev-middleware')(compiler, {
                publicPath: webpack_config_1.default.output.publicPath,
            });
            const hotMiddleware = (0, webpack_hot_middleware_1.default)(compiler, {
                log: console.log,
                path: '/__webpack_hmr',
            });
            server.ext([
                {
                    type: 'onRequest',
                    method: (request, h) => {
                        return new Promise((resolve, reject) => {
                            devMiddleware(request.raw.req, request.raw.res, (err) => err ? reject(err) : resolve(h.continue));
                        });
                    },
                },
                {
                    type: 'onRequest',
                    method: (request, h) => {
                        return new Promise((resolve, reject) => {
                            hotMiddleware(request.raw.req, request.raw.res, (err) => err ? reject(err) : resolve(h.continue));
                        });
                    },
                },
            ]);
            server.route({
                method: '*',
                path: '/{any*}',
                handler: (request, h) => {
                    return new Promise((resolve, reject) => {
                        const filename = path_1.default.join(compiler.outputPath, 'index.html');
                        compiler.outputFileSystem.readFile(filename, (err, result) => err ? reject(err) : resolve(h.response(result).type('text/html')));
                    });
                },
            });
        }
        yield server.start().catch(console.error);
        return server.info;
    });
}
init().then((info) => console.log(`Server running on ${info.uri}...`));
//# sourceMappingURL=server.js.map