(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeColor = void 0;
var BadgeColor;
(function (BadgeColor) {
    BadgeColor["BLUE"] = "default";
    BadgeColor["GREEN"] = "success";
    BadgeColor["GREY"] = "info";
    BadgeColor["YELLOW"] = "warning";
    BadgeColor["RED"] = "danger";
})(BadgeColor = exports.BadgeColor || (exports.BadgeColor = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],5:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
/**
* @deprecated Use {@link PaperbackExtensionBase}
*/
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    async getTags() {
        // @ts-ignore
        return this.getSearchTags?.();
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    let time;
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = exports.SourceIntents = void 0;
var SourceIntents;
(function (SourceIntents) {
    SourceIntents[SourceIntents["MANGA_CHAPTERS"] = 1] = "MANGA_CHAPTERS";
    SourceIntents[SourceIntents["MANGA_TRACKING"] = 2] = "MANGA_TRACKING";
    SourceIntents[SourceIntents["HOMEPAGE_SECTIONS"] = 4] = "HOMEPAGE_SECTIONS";
    SourceIntents[SourceIntents["COLLECTION_MANAGEMENT"] = 8] = "COLLECTION_MANAGEMENT";
    SourceIntents[SourceIntents["CLOUDFLARE_BYPASS_REQUIRED"] = 16] = "CLOUDFLARE_BYPASS_REQUIRED";
    SourceIntents[SourceIntents["SETTINGS_UI"] = 32] = "SETTINGS_UI";
})(SourceIntents = exports.SourceIntents || (exports.SourceIntents = {}));
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],7:[function(require,module,exports){
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./ByteArray"), exports);
__exportStar(require("./Badge"), exports);
__exportStar(require("./interfaces"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./HomeSectionType"), exports);
__exportStar(require("./PaperbackExtensionBase"), exports);

},{"./Badge":1,"./ByteArray":2,"./HomeSectionType":3,"./PaperbackExtensionBase":4,"./Source":5,"./SourceInfo":6,"./interfaces":13}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./ChapterProviding"), exports);
__exportStar(require("./Searchable"), exports);
__exportStar(require("./Requestable"), exports);
__exportStar(require("./MangaProviding"), exports);
__exportStar(require("./MangaProgressProviding"), exports);

},{"./ChapterProviding":8,"./MangaProgressProviding":9,"./MangaProviding":10,"./Requestable":11,"./Searchable":12}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],58:[function(require,module,exports){
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./DynamicUI/Exports/DUIBinding"), exports);
__exportStar(require("./DynamicUI/Exports/DUIForm"), exports);
__exportStar(require("./DynamicUI/Exports/DUIFormRow"), exports);
__exportStar(require("./DynamicUI/Exports/DUISection"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIHeader"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILink"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIMultilineLabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUINavigationButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIOAuthButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISecureInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISelect"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIStepper"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISwitch"), exports);
__exportStar(require("./Exports/ChapterDetails"), exports);
__exportStar(require("./Exports/Chapter"), exports);
__exportStar(require("./Exports/Cookie"), exports);
__exportStar(require("./Exports/HomeSection"), exports);
__exportStar(require("./Exports/IconText"), exports);
__exportStar(require("./Exports/MangaInfo"), exports);
__exportStar(require("./Exports/MangaProgress"), exports);
__exportStar(require("./Exports/PartialSourceManga"), exports);
__exportStar(require("./Exports/MangaUpdates"), exports);
__exportStar(require("./Exports/PBCanvas"), exports);
__exportStar(require("./Exports/PBImage"), exports);
__exportStar(require("./Exports/PagedResults"), exports);
__exportStar(require("./Exports/RawData"), exports);
__exportStar(require("./Exports/Request"), exports);
__exportStar(require("./Exports/SourceInterceptor"), exports);
__exportStar(require("./Exports/RequestManager"), exports);
__exportStar(require("./Exports/Response"), exports);
__exportStar(require("./Exports/SearchField"), exports);
__exportStar(require("./Exports/SearchRequest"), exports);
__exportStar(require("./Exports/SourceCookieStore"), exports);
__exportStar(require("./Exports/SourceManga"), exports);
__exportStar(require("./Exports/SecureStateManager"), exports);
__exportStar(require("./Exports/SourceStateManager"), exports);
__exportStar(require("./Exports/Tag"), exports);
__exportStar(require("./Exports/TagSection"), exports);
__exportStar(require("./Exports/TrackedMangaChapterReadAction"), exports);
__exportStar(require("./Exports/TrackerActionQueue"), exports);

},{"./DynamicUI/Exports/DUIBinding":15,"./DynamicUI/Exports/DUIForm":16,"./DynamicUI/Exports/DUIFormRow":17,"./DynamicUI/Exports/DUISection":18,"./DynamicUI/Rows/Exports/DUIButton":19,"./DynamicUI/Rows/Exports/DUIHeader":20,"./DynamicUI/Rows/Exports/DUIInputField":21,"./DynamicUI/Rows/Exports/DUILabel":22,"./DynamicUI/Rows/Exports/DUILink":23,"./DynamicUI/Rows/Exports/DUIMultilineLabel":24,"./DynamicUI/Rows/Exports/DUINavigationButton":25,"./DynamicUI/Rows/Exports/DUIOAuthButton":26,"./DynamicUI/Rows/Exports/DUISecureInputField":27,"./DynamicUI/Rows/Exports/DUISelect":28,"./DynamicUI/Rows/Exports/DUIStepper":29,"./DynamicUI/Rows/Exports/DUISwitch":30,"./Exports/Chapter":31,"./Exports/ChapterDetails":32,"./Exports/Cookie":33,"./Exports/HomeSection":34,"./Exports/IconText":35,"./Exports/MangaInfo":36,"./Exports/MangaProgress":37,"./Exports/MangaUpdates":38,"./Exports/PBCanvas":39,"./Exports/PBImage":40,"./Exports/PagedResults":41,"./Exports/PartialSourceManga":42,"./Exports/RawData":43,"./Exports/Request":44,"./Exports/RequestManager":45,"./Exports/Response":46,"./Exports/SearchField":47,"./Exports/SearchRequest":48,"./Exports/SecureStateManager":49,"./Exports/SourceCookieStore":50,"./Exports/SourceInterceptor":51,"./Exports/SourceManga":52,"./Exports/SourceStateManager":53,"./Exports/Tag":54,"./Exports/TagSection":55,"./Exports/TrackedMangaChapterReadAction":56,"./Exports/TrackerActionQueue":57}],59:[function(require,module,exports){
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./generated/_exports"), exports);
__exportStar(require("./base/index"), exports);
__exportStar(require("./compat/DyamicUI"), exports);

},{"./base/index":7,"./compat/DyamicUI":14,"./generated/_exports":58}],60:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoseidonScans = exports.PoseidonScansInfo = void 0;
const types_1 = require("@paperback/types");
const PoseidonScansParser_1 = require("./PoseidonScansParser");
const version_1 = require("./version");
const BASE_URL = 'https://poseidon-scans.net';
exports.PoseidonScansInfo = {
    name: 'Poseidon Scans',
    author: 'Paperback Community',
    description: 'Poseidon Scans source for Paperback v0.8. Supports French catalogue search, details, free chapters and reader pages.',
    contentRating: types_1.ContentRating.MATURE,
    icon: 'icon.png',
    version: version_1.BUILD_VERSION,
    websiteBaseURL: BASE_URL,
    language: 'French',
    sourceTags: [
        { text: 'French', type: types_1.BadgeColor.BLUE },
        { text: 'Manga', type: types_1.BadgeColor.GREEN },
        { text: 'Manhwa', type: types_1.BadgeColor.GREY }
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS
};
class PoseidonScans {
    constructor() {
        this.interceptor = {
            interceptRequest: (request) => __awaiter(this, void 0, void 0, function* () {
                request.headers = Object.assign(Object.assign({}, request.headers), this.headers(request.url));
                return request;
            }),
            interceptResponse: (response) => __awaiter(this, void 0, void 0, function* () { return response; })
        };
        this.requestManager = App.createRequestManager({
            interceptor: this.interceptor,
            requestsPerSecond: 1,
            requestTimeout: 20000
        });
        this.parser = new PoseidonScansParser_1.PoseidonScansParser(BASE_URL);
    }
    getSearchResults(query, metadata) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const filters = this.parser.splitSearchTags(query.includedTags);
            const parameters = this.normalizeSearchParameters(query.parameters);
            if (!filters.status && parameters.status)
                filters.status = parameters.status;
            const html = yield this.requestText(this.parser.buildSearchUrl((_b = query.title) !== null && _b !== void 0 ? _b : '', page, filters, parameters));
            return this.parser.parseMangaList(html, page);
        });
    }
    getSearchTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.requestText(this.parser.buildCatalogueUrl(1));
            return this.parser.parseSearchTags(html);
        });
    }
    getSearchFields() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                App.createSearchField({
                    id: 'status',
                    name: 'Statut',
                    placeholder: 'en cours, terminé, en pause ou annulé'
                }),
                App.createSearchField({
                    id: 'sortBy',
                    name: 'Trier par',
                    placeholder: 'latest_chapter, most_chapters, popular, alpha ou recent'
                }),
                App.createSearchField({
                    id: 'minChapters',
                    name: 'Chapitres minimum',
                    placeholder: '0'
                }),
                App.createSearchField({
                    id: 'maxChapters',
                    name: 'Chapitres maximum',
                    placeholder: '500'
                })
            ];
        });
    }
    supportsTagExclusion() {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    supportsSearchOperators() {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.requestText(this.parser.buildSeriesUrl(mangaId));
            return App.createSourceManga({
                id: mangaId,
                mangaInfo: this.parser.parseMangaDetails(mangaId, html)
            });
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.requestText(this.parser.buildSeriesUrl(mangaId));
            return this.parser.parseChapters(mangaId, html);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.requestText(this.parser.buildChapterUrl(mangaId, chapterId));
            return this.parser.parseChapterDetails(mangaId, chapterId, html);
        });
    }
    getMangaShareUrl(mangaId) {
        return this.parser.buildSeriesUrl(mangaId);
    }
    getHomePageSections(sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = [
                this.homeSection("latest_chapters" /* PoseidonHomeSectionId.LatestChapters */, 'Derniers chapitres'),
                this.homeSection("popular" /* PoseidonHomeSectionId.Popular */, 'Populaires'),
                this.homeSection("new_series" /* PoseidonHomeSectionId.NewSeries */, 'Nouvelles séries'),
                this.homeSection("catalogue" /* PoseidonHomeSectionId.Catalogue */, 'Catalogue')
            ];
            for (const section of sections)
                sectionCallback(section);
            yield Promise.all(sections.map((section) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const results = yield this.getViewMoreItems(section.id, { page: 1 });
                    section.items = results.results;
                    section.containsMoreItems = results.metadata !== undefined;
                    sectionCallback(section);
                }
                catch (error) {
                    console.log(`Poseidon Scans homepage section failed: ${section.id} ${String(error)}`);
                }
            })));
        });
    }
    getViewMoreItems(homepageSectionId, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            switch (homepageSectionId) {
                case "latest_chapters" /* PoseidonHomeSectionId.LatestChapters */:
                    return this.getCataloguePage(page, 'latest_chapter');
                case "popular" /* PoseidonHomeSectionId.Popular */:
                    return this.getCataloguePage(page, 'popular');
                case "new_series" /* PoseidonHomeSectionId.NewSeries */:
                    return this.getCataloguePage(page, 'recent');
                case "catalogue" /* PoseidonHomeSectionId.Catalogue */:
                    return this.getCataloguePage(page);
                default:
                    return App.createPagedResults({ results: [] });
            }
        });
    }
    getCataloguePage(page, sortBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.requestText(this.parser.buildCatalogueUrl(page, sortBy));
            return this.parser.parseMangaList(html, page);
        });
    }
    homeSection(id, title) {
        return App.createHomeSection({
            id,
            title,
            type: types_1.HomeSectionType.singleRowNormal,
            items: [],
            containsMoreItems: true
        });
    }
    normalizeSearchParameters(parameters) {
        var _a, _b;
        const allowedStatuses = ['en cours', 'terminé', 'en pause', 'annulé'];
        const allowedSorts = ['latest_chapter', 'most_chapters', 'popular', 'alpha', 'recent'];
        const status = ((_a = parameters.status) !== null && _a !== void 0 ? _a : '').trim().toLowerCase();
        const sortBy = ((_b = parameters.sortBy) !== null && _b !== void 0 ? _b : '').trim().toLowerCase();
        return {
            status: allowedStatuses.includes(status) ? status : undefined,
            sortBy: allowedSorts.includes(sortBy) ? sortBy : undefined,
            minChapters: this.normalizeChapterLimit(parameters.minChapters),
            maxChapters: this.normalizeChapterLimit(parameters.maxChapters)
        };
    }
    normalizeChapterLimit(value) {
        if (!(value === null || value === void 0 ? void 0 : value.trim()))
            return undefined;
        const number = Math.max(0, Math.min(500, Math.round(Number(value))));
        return Number.isFinite(number) ? String(number) : undefined;
    }
    requestText(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = App.createRequest({
                url,
                method: 'GET',
                headers: this.headers(url)
            });
            let response;
            try {
                response = yield this.requestManager.schedule(request, 2);
            }
            catch (error) {
                throw new Error(`Poseidon Scans network request failed for ${url}: ${String(error)}`);
            }
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`Poseidon Scans request failed for ${url}: HTTP ${response.status}`);
            }
            if (typeof response.data !== 'string') {
                throw new Error(`Poseidon Scans returned an empty response for ${url}`);
            }
            return response.data;
        });
    }
    headers(url) {
        const imageRequest = this.isImageRequest(url);
        return {
            referer: `${BASE_URL}/`,
            origin: BASE_URL,
            accept: imageRequest ? 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'
        };
    }
    isImageRequest(url) {
        return /\.(?:jpg|jpeg|png|webp|gif)(?:[?#].*)?$/i.test(url)
            || /\/api\/(?:chapters|covers|banners|banners-bg|banners-character|avatar)\//i.test(url)
            || /\/_next\/image\?/i.test(url);
    }
}
exports.PoseidonScans = PoseidonScans;

},{"./PoseidonScansParser":61,"./version":62,"@paperback/types":59}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoseidonScansParser = void 0;
const readerError_1 = require("../utils/readerError");
const url_1 = require("../utils/url");
const date_1 = require("../utils/date");
const CATALOGUE_PAGE_SIZE = 20;
class PoseidonScansParser {
    constructor(baseUrl, sourceName = 'Poseidon Scans') {
        this.baseUrl = baseUrl;
        this.sourceName = sourceName;
    }
    parseMangaList(html, page) {
        const text = this.searchableHtml(html);
        const results = this.parseMangaCards(text);
        return App.createPagedResults({
            results,
            metadata: this.hasNextPage(text, page) ? { page: page + 1 } : undefined
        });
    }
    parseSearchTags(html) {
        const text = this.searchableHtml(html);
        const genres = this.parseSerializedArray(text, 'allTags');
        const types = this.parseSerializedArray(text, 'allTypes');
        return [
            App.createTagSection({
                id: 'genres',
                label: 'Genres',
                tags: genres.map(label => App.createTag({ id: `genre:${label}`, label }))
            }),
            App.createTagSection({
                id: 'types',
                label: 'Types',
                tags: types.map(label => App.createTag({ id: `type:${label}`, label }))
            }),
            App.createTagSection({
                id: 'status',
                label: 'Statut',
                tags: [
                    App.createTag({ id: 'status:en cours', label: 'En cours' }),
                    App.createTag({ id: 'status:terminé', label: 'Terminé' }),
                    App.createTag({ id: 'status:en pause', label: 'En pause' }),
                    App.createTag({ id: 'status:annulé', label: 'Annulé' })
                ]
            })
        ];
    }
    splitSearchTags(tags) {
        const filters = { tags: [] };
        for (const tag of tags) {
            if (tag.id.startsWith('status:')) {
                filters.status = tag.id.slice('status:'.length);
            }
            else if (tag.id.startsWith('genre:') || tag.id.startsWith('type:')) {
                filters.tags.push(tag.id.slice(tag.id.indexOf(':') + 1));
            }
        }
        return filters;
    }
    parseMangaDetails(mangaId, html) {
        var _a, _b;
        const series = this.findJsonLd(html, 'ComicSeries');
        const title = this.cleanText((_a = series === null || series === void 0 ? void 0 : series.name) !== null && _a !== void 0 ? _a : '') || this.titleFromSlug(mangaId);
        const cover = this.normalizeUrl(this.imageValue(series === null || series === void 0 ? void 0 : series.image) || this.extractMetaContent(html, 'og:image') || `/api/covers/${mangaId}.webp`);
        const genres = this.stringArray(series === null || series === void 0 ? void 0 : series.genre);
        const alternativeTitles = this.splitTitles(this.extractSerializedString(html, 'alternativeNames'));
        return App.createMangaInfo({
            image: cover,
            titles: Array.from(new Set([title, ...alternativeTitles])),
            author: this.personName(series === null || series === void 0 ? void 0 : series.author),
            artist: this.personName(series === null || series === void 0 ? void 0 : series.artist),
            desc: this.cleanText((_b = series === null || series === void 0 ? void 0 : series.description) !== null && _b !== void 0 ? _b : this.extractMetaContent(html, 'description')),
            status: this.extractStatus(html) || 'Unknown',
            hentai: false,
            rating: this.extractRating(html),
            tags: genres.length > 0 ? [this.toTagSection(genres)] : [],
            covers: cover.length > 0 ? [cover] : [],
            banner: this.normalizeUrl(`/api/banners-mangas/${mangaId}.webp`),
            additionalInfo: this.seriesAdditionalInfo(html)
        });
    }
    parseChapters(mangaId, html) {
        var _a;
        const text = this.searchableHtml(html);
        const serializedChapters = this.parseSerializedChapters(text);
        if (serializedChapters.length > 0) {
            return serializedChapters;
        }
        const escapedMangaId = this.escapeRegExp(mangaId);
        const chapterPattern = new RegExp(`href(?:=|":)"\\/serie\\/${escapedMangaId}\\/chapter\\/([^/"?#]+)"`, 'gi');
        const matches = [];
        let match;
        while ((match = chapterPattern.exec(text)) !== null) {
            if (match[1]) {
                matches.push({ id: this.decodeText(match[1]), index: match.index });
            }
        }
        const seen = {};
        const chapters = [];
        for (let index = 0; index < matches.length; index++) {
            const current = matches[index];
            if (!current || seen[current.id]) {
                continue;
            }
            const next = matches[index + 1];
            const block = text.slice(current.index, (_a = next === null || next === void 0 ? void 0 : next.index) !== null && _a !== void 0 ? _a : current.index + 5000);
            if (this.isRestrictedChapter(block)) {
                continue;
            }
            seen[current.id] = true;
            const chapNum = this.chapterNumber(current.id, block);
            chapters.push(App.createChapter({
                id: current.id,
                chapNum,
                name: this.extractChapterName(current.id, block),
                langCode: 'fr',
                group: this.sourceName,
                sortingIndex: chapNum
            }));
        }
        return chapters.sort((left, right) => left.chapNum - right.chapNum);
    }
    parseChapterDetails(mangaId, chapterId, html) {
        const pages = this.extractReaderImages(mangaId, html);
        if (pages.length === 0) {
            throw (0, readerError_1.createReaderError)(this.sourceName, mangaId, chapterId, html);
        }
        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages
        });
    }
    buildCatalogueUrl(page, sortBy) {
        const parameters = [];
        if (sortBy)
            parameters.push(['sortBy', sortBy]);
        if (page > 1)
            parameters.push(['page', String(page)]);
        return this.buildUrl('/series', parameters);
    }
    buildSearchUrl(title, page, filters, parameters) {
        const query = [];
        if (title.trim().length > 0) {
            query.push(['search', title.trim()]);
        }
        if (filters.tags.length > 0)
            query.push(['tags', filters.tags.join(',')]);
        if (filters.status)
            query.push(['status', filters.status]);
        if (parameters.sortBy)
            query.push(['sortBy', parameters.sortBy]);
        if (parameters.minChapters)
            query.push(['minChapters', parameters.minChapters]);
        if (parameters.maxChapters)
            query.push(['maxChapters', parameters.maxChapters]);
        if (page > 1) {
            query.push(['page', String(page)]);
        }
        return this.buildUrl('/series', query);
    }
    buildSeriesUrl(mangaId) {
        return `${this.baseUrl}/serie/${encodeURIComponent(mangaId)}`;
    }
    buildChapterUrl(mangaId, chapterId) {
        return `${this.buildSeriesUrl(mangaId)}/chapter/${encodeURIComponent(chapterId)}`;
    }
    normalizeUrl(value) {
        var _a, _b;
        const cleaned = (_b = (_a = this.decodeText(value.trim()).split(',')[0]) === null || _a === void 0 ? void 0 : _a.trim().replace(/\s+\d+[wx]$/, '')) !== null && _b !== void 0 ? _b : '';
        return (0, url_1.normalizeHttpUrl)(cleaned, this.baseUrl);
    }
    parseMangaCards(text) {
        var _a;
        const cardPattern = /href(?:=|":)"\/serie\/([^/"?#]+)"/gi;
        const matches = [];
        let match;
        while ((match = cardPattern.exec(text)) !== null) {
            if (match[1]) {
                matches.push({ mangaId: this.decodeText(match[1]), index: match.index });
            }
        }
        const seen = {};
        const results = [];
        for (let index = 0; index < matches.length; index++) {
            const current = matches[index];
            if (!current || seen[current.mangaId]) {
                continue;
            }
            const next = matches[index + 1];
            const block = text.slice(current.index, (_a = next === null || next === void 0 ? void 0 : next.index) !== null && _a !== void 0 ? _a : current.index + 8000);
            const image = this.extractCardImage(block, current.mangaId);
            const title = this.extractCardTitle(block) || this.titleFromSlug(current.mangaId);
            seen[current.mangaId] = true;
            results.push(App.createPartialSourceManga({
                mangaId: current.mangaId,
                title,
                image,
                subtitle: this.extractCardSubtitle(block)
            }));
        }
        return results;
    }
    parseSerializedArray(text, field) {
        var _a;
        const escaped = this.escapeRegExp(field);
        const value = (_a = new RegExp(`"${escaped}":(\\[[^\\]]*\\])`).exec(text)) === null || _a === void 0 ? void 0 : _a[1];
        if (!value)
            return [];
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
        }
        catch (_b) {
            return [];
        }
    }
    extractCardImage(block, mangaId) {
        var _a;
        const imagePattern = /(?:src|srcSet)(?:=|":)"([^"]*(?:\/api\/covers\/|%2Fapi%2Fcovers%2F)[^"]*)"/gi;
        let match;
        while ((match = imagePattern.exec(block)) !== null) {
            const image = this.normalizeUrl((_a = match[1]) !== null && _a !== void 0 ? _a : '');
            if (image.length > 0) {
                return image;
            }
        }
        return this.normalizeUrl(`/api/covers/${mangaId}.webp`);
    }
    extractCardTitle(block) {
        var _a, _b, _c;
        const altPattern = /alt(?:=|":)"([^"]*)"/gi;
        let match;
        while ((match = altPattern.exec(block)) !== null) {
            const title = this.cleanText((_a = match[1]) !== null && _a !== void 0 ? _a : '');
            if (title.length > 0 && title !== 'OR') {
                return title;
            }
        }
        const h2 = (_c = (_b = /<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(block)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : '';
        return this.cleanHtml(h2);
    }
    extractCardSubtitle(block) {
        var _a;
        const count = (_a = /(\d+)(?:"?,\s*")?\s+chapitres/i.exec(this.cleanHtml(block))) === null || _a === void 0 ? void 0 : _a[1];
        return count ? `${count} chapitres` : undefined;
    }
    parseSerializedChapters(text) {
        var _a;
        const chapterPattern = /{"id":"[^"]+","number":(\d+(?:\.\d+)?),"title":(null|"((?:\\.|[^"])*)"),"createdAt":"\$D([^"]+)","isPremium":(true|false),"premiumUntil":(?:null|"\$D[^"]+")[\s\S]*?}/g;
        const chapters = [];
        const seen = {};
        let match;
        while ((match = chapterPattern.exec(text)) !== null) {
            const number = match[1];
            const createdAt = match[4];
            const isPremium = match[5] === 'true';
            if (!number || seen[number] || isPremium) {
                continue;
            }
            seen[number] = true;
            const chapNum = Number(number);
            const title = this.cleanText((_a = match[3]) !== null && _a !== void 0 ? _a : '');
            const time = this.parseDate(createdAt);
            chapters.push(App.createChapter(Object.assign(Object.assign({ id: number, chapNum, name: title.length > 0 ? `Chapitre ${number} - ${title}` : `Chapitre ${number}`, langCode: 'fr', group: this.sourceName }, (time ? { time } : {})), { sortingIndex: chapNum })));
        }
        return chapters.sort((left, right) => left.chapNum - right.chapNum);
    }
    extractChapterName(chapterId, block) {
        var _a;
        const h3 = (_a = /<h3[^>]*>([\s\S]*?)<\/h3>/i.exec(block)) === null || _a === void 0 ? void 0 : _a[1];
        const name = this.cleanHtml(h3 !== null && h3 !== void 0 ? h3 : '');
        return name.length > 0 ? name : `Chapitre ${chapterId}`;
    }
    extractReaderImages(mangaId, html) {
        const text = this.searchableHtml(html);
        const pages = this.extractReaderImageUrls(mangaId, text);
        const orderedPages = this.extractOrderedReaderImages(mangaId, text);
        if (orderedPages.length !== pages.length) {
            return pages;
        }
        const pageLookup = new Set(pages);
        const orders = new Set();
        for (const page of orderedPages) {
            if (!pageLookup.has(page.url) || orders.has(page.order)) {
                return pages;
            }
            orders.add(page.order);
        }
        return orderedPages
            .sort((left, right) => left.order - right.order)
            .map(page => page.url);
    }
    extractReaderImageUrls(mangaId, text) {
        var _a;
        const imagePattern = /src(?:=|":)"([^"]*\/api\/chapters\/[^"]+)"/gi;
        const seen = {};
        const pages = [];
        let match;
        while ((match = imagePattern.exec(text)) !== null) {
            const url = this.normalizeUrl((_a = match[1]) !== null && _a !== void 0 ? _a : '');
            if (!this.isReaderPageImage(url, mangaId) || seen[url]) {
                continue;
            }
            seen[url] = true;
            pages.push(url);
        }
        return pages;
    }
    extractOrderedReaderImages(mangaId, text) {
        var _a, _b, _c, _d, _e;
        const blockPattern = /(<div\b[^>]*\bclass=["'][^"']*\breader-vimg\b[^"']*["'][^>]*>)[\s\S]*?<img\b[^>]*\bsrc=["']([^"']*\/api\/chapters\/[^"']+)["'][^>]*>/gi;
        const seen = {};
        const pages = [];
        let match;
        while ((match = blockPattern.exec(text)) !== null) {
            const openingTag = (_a = match[1]) !== null && _a !== void 0 ? _a : '';
            const orderValue = (_c = (_b = /\bdata-order=["'](\d+)["']/i.exec(openingTag)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : (_d = /\bdata-sequence=["'](\d+)["']/i.exec(openingTag)) === null || _d === void 0 ? void 0 : _d[1];
            const order = Number(orderValue);
            const url = this.normalizeUrl((_e = match[2]) !== null && _e !== void 0 ? _e : '');
            if (!Number.isFinite(order) || !this.isReaderPageImage(url, mangaId) || seen[url]) {
                continue;
            }
            seen[url] = true;
            pages.push({ url, order });
        }
        return pages;
    }
    isReaderPageImage(url, mangaId) {
        const lower = url.toLowerCase();
        const normalizedMangaId = mangaId.toLowerCase();
        return lower.includes(`/api/chapters/${normalizedMangaId}/`) && !lower.includes('/previews/');
    }
    isRestrictedChapter(block) {
        const normalized = this.normalizeForComparison(this.cleanHtml(block));
        return normalized.includes('gratuit le') || normalized.includes('acces restreint') || normalized.includes('jouer l avance') || normalized.includes('abonner');
    }
    chapterNumber(chapterId, block) {
        const idMatch = /(\d+(?:[.-]\d+)?)/.exec(chapterId);
        if (idMatch === null || idMatch === void 0 ? void 0 : idMatch[1]) {
            return Number(idMatch[1].replace('-', '.'));
        }
        const blockMatch = /chapitre\s+(\d+(?:[.-]\d+)?)/i.exec(this.cleanHtml(block));
        return (blockMatch === null || blockMatch === void 0 ? void 0 : blockMatch[1]) ? Number(blockMatch[1].replace('-', '.')) : 0;
    }
    findJsonLd(html, type) {
        const blocks = this.jsonLdBlocks(html);
        return blocks.find(block => this.jsonLdHasType(block, type));
    }
    jsonLdBlocks(html) {
        var _a;
        const blocks = [];
        const pattern = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
        let match;
        while ((match = pattern.exec(html)) !== null) {
            try {
                const parsed = JSON.parse(this.decodeText((_a = match[1]) !== null && _a !== void 0 ? _a : ''));
                blocks.push(...(Array.isArray(parsed) ? parsed : [parsed]));
            }
            catch (_b) {
                continue;
            }
        }
        return blocks;
    }
    jsonLdHasType(block, type) {
        const value = block['@type'];
        return Array.isArray(value) ? value.includes(type) : value === type;
    }
    imageValue(value) {
        var _a;
        if (typeof value === 'string') {
            return value;
        }
        return (_a = value === null || value === void 0 ? void 0 : value.url) !== null && _a !== void 0 ? _a : '';
    }
    personName(value) {
        const name = typeof value === 'string' ? value : value === null || value === void 0 ? void 0 : value.name;
        const cleaned = this.cleanText(name !== null && name !== void 0 ? name : '');
        return cleaned.length > 0 && this.normalizeForComparison(cleaned) !== 'non specifie' ? cleaned : 'Unknown';
    }
    stringArray(value) {
        const values = Array.isArray(value) ? value : value ? [value] : [];
        return values.map(item => this.cleanText(item)).filter(item => item.length > 0);
    }
    extractMetaContent(html, name) {
        var _a, _b, _c, _d;
        const escaped = this.escapeRegExp(name);
        const propertyPattern = new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
        const namePattern = new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
        return this.cleanText((_d = (_b = (_a = propertyPattern.exec(html)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : (_c = namePattern.exec(html)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : '');
    }
    extractStatus(html) {
        var _a, _b;
        const description = this.extractMetaContent(html, 'description');
        const status = (_a = /Statut\s*:\s*([^.]+)/i.exec(description)) === null || _a === void 0 ? void 0 : _a[1];
        if (status) {
            return this.cleanText(status);
        }
        const text = this.searchableHtml(html);
        const visible = (_b = /Statut[\s\S]{0,500}?<span[^>]*>([\s\S]*?)<\/span>/i.exec(text)) === null || _b === void 0 ? void 0 : _b[1];
        return this.cleanHtml(visible !== null && visible !== void 0 ? visible : '');
    }
    extractRating(html) {
        var _a;
        const text = this.searchableHtml(html);
        const visible = (_a = /<span[^>]*>\s*(\d+(?:\.\d+)?)\s*<\/span>\s*<span[^>]*>\s*\/5\s*<\/span>/i.exec(text)) === null || _a === void 0 ? void 0 : _a[1];
        const rating = Number(visible);
        return Number.isFinite(rating) ? rating : undefined;
    }
    seriesAdditionalInfo(html) {
        var _a;
        const info = {};
        const type = this.extractSerializedStrings(html, 'type')
            .find(value => /^(?:MANGA|MANHWA|MANHUA|COMIC)$/i.test(value));
        const releaseYear = this.extractSerializedNumber(html, 'releaseYear');
        const views = this.extractSerializedNumber(html, 'viewCount');
        const favorites = (_a = /"favorites":(\d+)/.exec(this.searchableHtml(html))) === null || _a === void 0 ? void 0 : _a[1];
        if (type)
            info.Type = type;
        if (releaseYear)
            info.Year = releaseYear;
        if (views)
            info.Views = views;
        if (favorites)
            info.Favorites = favorites;
        return info;
    }
    extractSerializedString(html, field) {
        var _a;
        return (_a = this.extractSerializedStrings(html, field)[0]) !== null && _a !== void 0 ? _a : '';
    }
    extractSerializedStrings(html, field) {
        var _a;
        const escaped = this.escapeRegExp(field);
        const pattern = new RegExp(`"${escaped}":(?:null|"((?:\\\\.|[^"])*)")`, 'g');
        const text = this.searchableHtml(html);
        const values = [];
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const value = this.cleanText((_a = match[1]) !== null && _a !== void 0 ? _a : '');
            if (value)
                values.push(value);
        }
        return values;
    }
    extractSerializedNumber(html, field) {
        var _a, _b, _c;
        const escaped = this.escapeRegExp(field);
        return (_c = (_b = (_a = new RegExp(`"${escaped}":(null|-?\\d+(?:\\.\\d+)?)`).exec(this.searchableHtml(html))) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.replace('null', '')) !== null && _c !== void 0 ? _c : '';
    }
    splitTitles(value) {
        return value
            .split(/[|;,]/)
            .map(title => this.cleanText(title))
            .filter(title => title.length > 0);
    }
    parseDate(value) {
        return (0, date_1.parseDateOrUndefined)(value);
    }
    toTagSection(labels) {
        return App.createTagSection({
            id: 'genres',
            label: 'Genres',
            tags: labels.map(label => App.createTag({
                id: this.tagId(label),
                label
            }))
        });
    }
    tagId(label) {
        return this.normalizeForComparison(label)
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    hasNextPage(text, page) {
        const nextPagePattern = new RegExp(`[?&]page=${page + 1}\\b`, 'i');
        return nextPagePattern.test(text);
    }
    buildUrl(path, parameters) {
        const query = parameters
            .filter(([, value]) => value.trim().length > 0)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        return `${this.baseUrl}${path}${query.length > 0 ? `?${query}` : ''}`;
    }
    searchableHtml(html) {
        return this.decodeText(html)
            .replace(/\\"/g, '"')
            .replace(/<!--\s*-->/g, '');
    }
    cleanHtml(value) {
        return this.cleanText(value
            .replace(/<!--\s*-->/g, '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]+>/g, ''));
    }
    cleanText(value) {
        return this.decodeText(value)
            .replace(/\s+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/[ \t]{2,}/g, ' ')
            .trim();
    }
    decodeText(value) {
        return value
            .replace(/\\u([0-9a-fA-F]{4})/g, (_match, code) => String.fromCharCode(parseInt(code, 16)))
            .replace(/\\n/g, '\n')
            .replace(/\\\//g, '/')
            .replace(/\\"/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCharCode(parseInt(code, 16)))
            .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(parseInt(code, 10)))
            .replace(/&rsquo;/g, "'")
            .replace(/&lsquo;/g, "'")
            .replace(/&ldquo;/g, '"')
            .replace(/&rdquo;/g, '"')
            .replace(/&hellip;/g, '...')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }
    normalizeForComparison(value) {
        return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }
    titleFromSlug(slug) {
        return slug
            .split('-')
            .filter(part => part.length > 0)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    }
    escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
exports.PoseidonScansParser = PoseidonScansParser;

},{"../utils/date":63,"../utils/readerError":64,"../utils/url":65}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILD_VERSION = void 0;
// This file is generated by scripts/generate-version.js.
exports.BUILD_VERSION = '2026.11.22.23';

},{}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFrenchDateOrUndefined = exports.parseDateOrUndefined = void 0;
function parseDateOrUndefined(value) {
    const trimmed = value === null || value === void 0 ? void 0 : value.trim();
    if (!trimmed) {
        return undefined;
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
exports.parseDateOrUndefined = parseDateOrUndefined;
const FRENCH_MONTHS = {
    janvier: 0,
    fevrier: 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    aout: 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    decembre: 11
};
function parseFrenchDateOrUndefined(value) {
    const trimmed = value === null || value === void 0 ? void 0 : value.trim();
    if (!trimmed) {
        return undefined;
    }
    const numeric = /(?:^|\D)(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2}|\d{4})(?:\D|$)/.exec(trimmed);
    if ((numeric === null || numeric === void 0 ? void 0 : numeric[1]) && numeric[2] && numeric[3]) {
        const year = numeric[3].length === 2 ? 2000 + Number(numeric[3]) : Number(numeric[3]);
        return validLocalDate(year, Number(numeric[2]) - 1, Number(numeric[1]));
    }
    const normalized = trimmed
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    const textual = /(?:^|\D)(\d{1,2})(?:er)?\s+(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)\s+(\d{4})(?:\D|$)/.exec(normalized);
    if ((textual === null || textual === void 0 ? void 0 : textual[1]) && textual[2] && textual[3]) {
        const month = FRENCH_MONTHS[textual[2]];
        if (month !== undefined) {
            return validLocalDate(Number(textual[3]), month, Number(textual[1]));
        }
    }
    return parseDateOrUndefined(trimmed);
}
exports.parseFrenchDateOrUndefined = parseFrenchDateOrUndefined;
function validLocalDate(year, month, day) {
    const parsed = new Date(year, month, day);
    return parsed.getFullYear() === year && parsed.getMonth() === month && parsed.getDate() === day
        ? parsed
        : undefined;
}

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReaderError = void 0;
function createReaderError(source, mangaId, chapterId, html) {
    const normalized = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .toLowerCase();
    let reason = 'the site reader format may have changed';
    if (/access denied|just a moment|cf-chl|cloudflare/.test(normalized)) {
        reason = 'the site blocked the reader request';
    }
    else if (/404|page not found|could not be found|introuvable/.test(normalized)) {
        reason = 'the chapter page was not found';
    }
    else if (/premium|subscribe|subscriber|locked|acc[eè]s restreint|abonner|gratuit le/.test(normalized)) {
        reason = 'the chapter is premium or not public yet';
    }
    else if (html.trim().length === 0) {
        reason = 'the site returned an empty chapter page';
    }
    return new Error(`[${source}] No readable pages for ${mangaId}/${chapterId}: ${reason}`);
}
exports.createReaderError = createReaderError;

},{}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeHttpUrl = void 0;
function normalizeHttpUrl(value, baseUrl, options = {}) {
    let cleaned = value.trim().replace(/\\\//g, '/');
    if (cleaned.length === 0) {
        return '';
    }
    if (cleaned.startsWith('data:')) {
        return options.allowDataUrl ? cleaned : '';
    }
    if (options.unwrapNextImage !== false) {
        const proxied = /\/_next\/image\?url=([^&]+)/.exec(cleaned);
        if (proxied === null || proxied === void 0 ? void 0 : proxied[1]) {
            return normalizeHttpUrl(safeDecodeURIComponent(proxied[1]), baseUrl, options);
        }
    }
    if (cleaned.startsWith('//')) {
        cleaned = `https:${cleaned}`;
    }
    else if (cleaned.startsWith('/')) {
        cleaned = `${baseUrl}${cleaned}`;
    }
    return encodeURI(cleaned);
}
exports.normalizeHttpUrl = normalizeHttpUrl;
function safeDecodeURIComponent(value) {
    try {
        return decodeURIComponent(value);
    }
    catch (_a) {
        return value;
    }
}

},{}]},{},[60])(60)
});
