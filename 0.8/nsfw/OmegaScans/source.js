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
exports.OmegaScans = exports.OmegaScansInfo = void 0;
const types_1 = require("@paperback/types");
const OmegaScansParser_1 = require("./OmegaScansParser");
const version_1 = require("./version");
const BASE_URL = 'https://omegascans.org';
const API_URL = 'https://api.omegascans.org';
const PAGE_SIZE = 24;
exports.OmegaScansInfo = {
    name: 'Omega Scans',
    author: 'Paperback Community',
    description: 'Omega Scans source for Paperback v0.8. Supports search, details, chapters and reader pages.',
    contentRating: types_1.ContentRating.ADULT,
    icon: 'icon.png',
    version: version_1.BUILD_VERSION,
    websiteBaseURL: BASE_URL,
    language: 'English',
    sourceTags: [
        { text: 'English', type: types_1.BadgeColor.BLUE },
        { text: 'Comic', type: types_1.BadgeColor.GREEN },
        { text: 'Novel', type: types_1.BadgeColor.GREY }
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS
};
class OmegaScans {
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
            requestsPerSecond: 2,
            requestTimeout: 20000
        });
        this.parser = new OmegaScansParser_1.OmegaScansParser(BASE_URL, API_URL);
    }
    getSearchResults(query, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const params = this.searchParameters(query, page);
            const response = yield this.requestJson(this.parser.buildApiUrl('/query', params));
            if (query.excludedTags.length > 0) {
                response.data = yield this.excludeTaggedSeries(response.data, query);
            }
            return this.parser.parsePagedSeries(response);
        });
    }
    getSearchTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield this.requestJson(this.parser.buildApiUrl('/tags', { all: true }));
            return this.parser.parseSearchTags(tags);
        });
    }
    getSearchFields() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                App.createSearchField({
                    id: 'series_type',
                    name: 'Type',
                    placeholder: 'Comic, Novel or All'
                }),
                App.createSearchField({
                    id: 'status',
                    name: 'Status',
                    placeholder: 'All, Ongoing, Completed, Hiatus or Dropped'
                }),
                App.createSearchField({
                    id: 'orderBy',
                    name: 'Order by',
                    placeholder: 'updated_at, created_at, total_views, title or rating'
                }),
                App.createSearchField({
                    id: 'order',
                    name: 'Order',
                    placeholder: 'asc or desc'
                })
            ];
        });
    }
    supportsTagExclusion() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    supportsSearchOperators() {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const series = yield this.requestJson(this.parser.buildApiUrl(`/series/${encodeURIComponent(mangaId)}`));
            return App.createSourceManga({
                id: mangaId,
                mangaInfo: this.parser.parseMangaDetails(series)
            });
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const series = yield this.requestJson(this.parser.buildApiUrl(`/series/${encodeURIComponent(mangaId)}`));
            const response = yield this.requestJson(this.parser.buildApiUrl('/chapter/query', {
                page: 1,
                perPage: 10000,
                series_id: series.id
            }));
            return this.parser.parseChapters(response);
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
                App.createHomeSection({
                    id: "latest_comics" /* OmegaHomeSectionId.LatestComics */,
                    title: 'Latest Comics',
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                    containsMoreItems: true
                }),
                App.createHomeSection({
                    id: "latest_novels" /* OmegaHomeSectionId.LatestNovels */,
                    title: 'Latest Novels',
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                    containsMoreItems: true
                }),
                App.createHomeSection({
                    id: "trending_weekly" /* OmegaHomeSectionId.TrendingWeekly */,
                    title: 'Trending Weekly',
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                    containsMoreItems: false
                }),
                App.createHomeSection({
                    id: "trending_daily" /* OmegaHomeSectionId.TrendingDaily */,
                    title: 'Trending Daily',
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                    containsMoreItems: false
                }),
                App.createHomeSection({
                    id: "popular" /* OmegaHomeSectionId.Popular */,
                    title: 'Most Viewed',
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                    containsMoreItems: true
                })
            ];
            for (const section of sections) {
                sectionCallback(section);
            }
            yield Promise.all(sections.map((section) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const results = yield this.getViewMoreItems(section.id, { page: 1 });
                    section.items = results.results;
                    section.containsMoreItems = results.metadata !== undefined;
                    sectionCallback(section);
                }
                catch (error) {
                    console.log(`OmegaScans homepage section failed: ${section.id} ${String(error)}`);
                }
            })));
        });
    }
    getViewMoreItems(homepageSectionId, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            switch (homepageSectionId) {
                case "latest_comics" /* OmegaHomeSectionId.LatestComics */:
                    return this.getLatest('Comic', page);
                case "latest_novels" /* OmegaHomeSectionId.LatestNovels */:
                    return this.getLatest('Novel', page);
                case "trending_weekly" /* OmegaHomeSectionId.TrendingWeekly */:
                    return this.getTrending('weekly');
                case "trending_daily" /* OmegaHomeSectionId.TrendingDaily */:
                    return this.getTrending('daily');
                case "popular" /* OmegaHomeSectionId.Popular */:
                    return this.getPopular(page);
                default:
                    return App.createPagedResults({ results: [] });
            }
        });
    }
    getLatest(seriesType, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.requestJson(this.parser.buildApiUrl('/query', {
                series_type: seriesType,
                perPage: 24,
                adult: true,
                order: 'desc',
                orderBy: seriesType === 'Comic' ? 'latest' : 'updated_at',
                page
            }));
            return this.parser.parsePagedSeries(response);
        });
    }
    getPopular(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.requestJson(this.parser.buildApiUrl('/query', {
                series_type: 'Comic',
                perPage: 24,
                adult: true,
                order: 'desc',
                orderBy: 'total_views',
                status: 'All',
                tags_ids: '[]',
                page
            }));
            return this.parser.parsePagedSeries(response);
        });
    }
    getTrending(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const series = yield this.requestJson(this.parser.buildApiUrl('/trending', { type }));
            return App.createPagedResults({
                results: series.map(item => this.parser.toPartialSourceManga(item))
            });
        });
    }
    searchParameters(query, page) {
        var _a, _b, _c, _d, _e, _f;
        const included = this.parser.splitSearchTags(query.includedTags);
        const parameters = query.parameters;
        const title = (_b = (_a = query.title) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
        const orderBy = this.normalizeOrderBy(parameters.orderBy, title.length > 0 ? 'title' : 'updated_at');
        return {
            page,
            perPage: PAGE_SIZE,
            adult: true,
            query_string: title,
            series_type: this.normalizeSeriesType((_d = (_c = parameters.series_type) !== null && _c !== void 0 ? _c : included.type) !== null && _d !== void 0 ? _d : 'Comic'),
            status: this.normalizeStatus((_f = (_e = parameters.status) !== null && _e !== void 0 ? _e : included.status) !== null && _f !== void 0 ? _f : 'All'),
            orderBy,
            order: this.normalizeOrder(parameters.order, orderBy === 'title' ? 'asc' : 'desc'),
            tags_ids: `[${included.genreIds.join(',')}]`
        };
    }
    excludeTaggedSeries(series, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const excluded = this.parser.splitSearchTags(query.excludedTags);
            return (yield Promise.all(series.map((item) => __awaiter(this, void 0, void 0, function* () {
                if (excluded.type && item.series_type === excluded.type) {
                    return undefined;
                }
                if (excluded.status && item.status === excluded.status) {
                    return undefined;
                }
                if (excluded.genreIds.length === 0) {
                    return item;
                }
                const details = yield this.requestJson(this.parser.buildApiUrl(`/series/${encodeURIComponent(item.series_slug)}`));
                return this.parser.seriesHasAnyTag(details, excluded.genreIds) ? undefined : item;
            })))).filter((item) => item !== undefined);
        });
    }
    normalizeSeriesType(value) {
        const normalized = (value !== null && value !== void 0 ? value : 'Comic').trim().toLowerCase();
        if (normalized === 'all' || normalized === '') {
            return undefined;
        }
        if (normalized === 'novel') {
            return 'Novel';
        }
        return 'Comic';
    }
    normalizeStatus(value) {
        const normalized = (value !== null && value !== void 0 ? value : 'All').trim().toLowerCase();
        switch (normalized) {
            case 'ongoing': return 'Ongoing';
            case 'completed': return 'Completed';
            case 'hiatus': return 'Hiatus';
            case 'dropped': return 'Dropped';
            default: return 'All';
        }
    }
    normalizeOrderBy(value, fallback) {
        switch ((value !== null && value !== void 0 ? value : fallback).trim()) {
            case 'created_at':
            case 'updated_at':
            case 'total_views':
            case 'title':
            case 'rating':
                return (value !== null && value !== void 0 ? value : fallback).trim();
            case 'latest':
                return 'latest';
            default:
                return fallback;
        }
    }
    normalizeOrder(value, fallback) {
        return (value !== null && value !== void 0 ? value : fallback).trim().toLowerCase() === 'asc' ? 'asc' : 'desc';
    }
    requestJson(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = yield this.requestText(url);
            try {
                return JSON.parse(text);
            }
            catch (error) {
                throw new Error(`OmegaScans returned invalid JSON for ${url}: ${String(error)}`);
            }
        });
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
                throw new Error(`OmegaScans network request failed for ${url}: ${String(error)}`);
            }
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`OmegaScans request failed for ${url}: HTTP ${response.status}`);
            }
            if (typeof response.data !== 'string') {
                throw new Error(`OmegaScans returned an empty response for ${url}`);
            }
            return response.data;
        });
    }
    headers(url) {
        const imageRequest = /\.(?:jpg|jpeg|png|webp|gif)(?:[?#].*)?$/i.test(url);
        return {
            referer: `${BASE_URL}/`,
            origin: BASE_URL,
            accept: imageRequest ? 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' : url.startsWith(API_URL) ? 'application/json, text/plain, */*' : 'text/html,application/xhtml+xml',
            'user-agent': 'Paperback/0.8'
        };
    }
}
exports.OmegaScans = OmegaScans;

},{"./OmegaScansParser":61,"./version":62,"@paperback/types":59}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmegaScansParser = void 0;
const readerError_1 = require("../utils/readerError");
const url_1 = require("../utils/url");
const date_1 = require("../utils/date");
class OmegaScansParser {
    constructor(baseUrl, apiUrl) {
        this.baseUrl = baseUrl;
        this.apiUrl = apiUrl;
    }
    parsePagedSeries(response) {
        var _a, _b;
        return App.createPagedResults({
            results: response.data.map(series => this.toPartialSourceManga(series)),
            metadata: ((_a = response.meta) === null || _a === void 0 ? void 0 : _a.next_page_url) ? { page: ((_b = response.meta.current_page) !== null && _b !== void 0 ? _b : 1) + 1 } : undefined
        });
    }
    parseMangaDetails(series) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const titleSet = [series.title, ...((_a = series.alternative_names) !== null && _a !== void 0 ? _a : '').split('|')]
            .map(title => this.cleanText(title))
            .filter(title => title.length > 0);
        return App.createMangaInfo({
            image: this.normalizeUrl((_b = series.thumbnail) !== null && _b !== void 0 ? _b : ''),
            titles: Array.from(new Set(titleSet.length > 0 ? titleSet : [series.series_slug])),
            author: this.cleanText((_c = series.author) !== null && _c !== void 0 ? _c : 'Unknown'),
            artist: this.cleanText((_e = (_d = series.studio) !== null && _d !== void 0 ? _d : series.author) !== null && _e !== void 0 ? _e : 'Unknown'),
            desc: this.cleanHtml((_f = series.description) !== null && _f !== void 0 ? _f : ''),
            status: this.cleanText((_g = series.status) !== null && _g !== void 0 ? _g : 'Unknown'),
            hentai: true,
            rating: typeof series.rating === 'number' ? series.rating : undefined,
            tags: [this.toTagSection((_h = series.tags) !== null && _h !== void 0 ? _h : [])],
            covers: [this.normalizeUrl((_j = series.thumbnail) !== null && _j !== void 0 ? _j : '')].filter(url => url.length > 0),
            additionalInfo: this.seriesAdditionalInfo(series)
        });
    }
    parseChapters(response) {
        return response.data
            .filter(chapter => { var _a; return ((_a = chapter.price) !== null && _a !== void 0 ? _a : 0) <= 0; })
            .map(chapter => {
            const chapNum = this.chapterNumber(chapter);
            const time = this.parseDate(chapter.created_at);
            return App.createChapter(Object.assign(Object.assign({ id: chapter.chapter_slug, chapNum, name: this.chapterName(chapter), langCode: 'en', group: 'Omega Scans' }, (time ? { time } : {})), { sortingIndex: chapNum }));
        })
            .sort((left, right) => left.chapNum - right.chapNum);
    }
    parseChapterDetails(mangaId, chapterId, html) {
        const pages = this.extractReaderImages(mangaId, html);
        const resolvedPages = pages.length > 0 ? pages : this.extractNovelPages(html);
        if (resolvedPages.length === 0) {
            throw (0, readerError_1.createReaderError)('Omega Scans', mangaId, chapterId, html);
        }
        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages: resolvedPages
        });
    }
    toPartialSourceManga(series) {
        var _a;
        return App.createPartialSourceManga({
            mangaId: series.series_slug,
            title: this.cleanText(series.title),
            image: this.normalizeUrl((_a = series.thumbnail) !== null && _a !== void 0 ? _a : ''),
            subtitle: this.subtitle(series)
        });
    }
    parseSearchTags(tags) {
        return [
            App.createTagSection({
                id: 'genres',
                label: 'Genres',
                tags: tags
                    .sort((left, right) => left.name.localeCompare(right.name))
                    .map(tag => this.toSearchTag(tag))
            }),
            App.createTagSection({
                id: 'type',
                label: 'Type',
                tags: [
                    App.createTag({ id: 'type:Comic', label: 'Comic' }),
                    App.createTag({ id: 'type:Novel', label: 'Novel' })
                ]
            }),
            App.createTagSection({
                id: 'status',
                label: 'Status',
                tags: [
                    App.createTag({ id: 'status:Ongoing', label: 'Ongoing' }),
                    App.createTag({ id: 'status:Completed', label: 'Completed' }),
                    App.createTag({ id: 'status:Hiatus', label: 'Hiatus' }),
                    App.createTag({ id: 'status:Dropped', label: 'Dropped' })
                ]
            })
        ];
    }
    splitSearchTags(tags) {
        const genreIds = [];
        let type;
        let status;
        for (const tag of tags) {
            if (tag.id.startsWith('type:')) {
                type = tag.id.replace('type:', '');
            }
            else if (tag.id.startsWith('status:')) {
                status = tag.id.replace('status:', '');
            }
            else {
                genreIds.push(tag.id);
            }
        }
        return { genreIds, type, status };
    }
    seriesHasAnyTag(series, tagIds) {
        var _a;
        if (tagIds.length === 0) {
            return false;
        }
        const seriesTagIds = ((_a = series.tags) !== null && _a !== void 0 ? _a : []).map(tag => String(tag.id));
        return tagIds.some(tagId => seriesTagIds.includes(tagId));
    }
    normalizeUrl(value) {
        return (0, url_1.normalizeHttpUrl)(this.decodeText(value), this.baseUrl, { allowDataUrl: true });
    }
    buildSeriesUrl(mangaId) {
        return `${this.baseUrl}/series/${encodeURIComponent(mangaId)}`;
    }
    buildChapterUrl(mangaId, chapterId) {
        return `${this.buildSeriesUrl(mangaId)}/${encodeURIComponent(chapterId)}`;
    }
    buildApiUrl(path, params = {}) {
        const query = Object.entries(params)
            .filter((entry) => entry[1] !== undefined)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&');
        return `${this.apiUrl}${path}${query.length > 0 ? `?${query}` : ''}`;
    }
    extractReaderImages(mangaId, html) {
        var _a;
        const decoded = this.decodeText(html);
        const renderedImages = this.extractRenderedReaderImages(decoded);
        if (renderedImages.length > 0) {
            return renderedImages;
        }
        const escapedSlug = this.escapeRegExp(mangaId);
        const imagePattern = new RegExp(`https?://media\\.omegascans\\.org/file/[^"'<>,\\s]+/uploads/series/${escapedSlug}/[^"'<>,\\s]+?\\.(?:jpg|jpeg|png|webp|gif)`, 'gi');
        const seen = {};
        const pages = [];
        const matches = (_a = decoded.match(imagePattern)) !== null && _a !== void 0 ? _a : [];
        for (const match of matches) {
            const url = this.normalizeUrl(match.replace(/\\\//g, '/'));
            if (!seen[url]) {
                seen[url] = true;
                pages.push(url);
            }
        }
        return pages;
    }
    extractRenderedReaderImages(html) {
        var _a, _b, _c;
        const imageTags = (_a = html.match(/<img[^>]+>/gi)) !== null && _a !== void 0 ? _a : [];
        const seen = {};
        const pages = [];
        for (const tag of imageTags) {
            if (!/\bobject-contain\b/i.test(tag)) {
                continue;
            }
            const source = (_c = (_b = /\bsrc=["']([^"']+)["']/i.exec(tag)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : '';
            const url = this.normalizeUrl(source);
            if (!this.isOmegaMediaImage(url) || seen[url]) {
                continue;
            }
            seen[url] = true;
            pages.push(url);
        }
        return pages;
    }
    isOmegaMediaImage(url) {
        return /^https?:\/\/media\.omegascans\.org\/file\/[^"'<>,\s]+?\.(?:jpg|jpeg|png|webp|gif)(?:[?#].*)?$/i.test(url);
    }
    seriesAdditionalInfo(series) {
        var _a, _b;
        const info = {};
        if (series.series_type)
            info.Type = this.cleanText(series.series_type);
        if (typeof series.total_views === 'number')
            info.Views = String(series.total_views);
        if ((_a = series.meta) === null || _a === void 0 ? void 0 : _a.chapters_count)
            info.Chapters = this.cleanText(series.meta.chapters_count);
        if ((_b = series.meta) === null || _b === void 0 ? void 0 : _b.who_bookmarked_count)
            info.Bookmarks = this.cleanText(series.meta.who_bookmarked_count);
        return info;
    }
    extractNovelPages(html) {
        var _a;
        const content = this.extractNovelContent(html);
        const paragraphMatches = (_a = content.match(/<p[\s\S]*?<\/p>/gi)) !== null && _a !== void 0 ? _a : [];
        const paragraphs = paragraphMatches
            .map(paragraph => this.cleanHtml(paragraph))
            .map(paragraph => paragraph.replace(/\s+/g, ' ').trim())
            .filter(paragraph => paragraph.length > 0);
        if (paragraphs.length === 0) {
            return [];
        }
        const pages = [];
        const lines = this.wrapText(paragraphs.join('\n\n'), 46);
        const linesPerPage = 34;
        for (let index = 0; index < lines.length; index += linesPerPage) {
            pages.push(this.svgPage(lines.slice(index, index + linesPerPage)));
        }
        return pages;
    }
    extractNovelContent(html) {
        var _a;
        const payloads = [];
        const payloadPattern = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)<\/script>/g;
        let payloadMatch;
        while ((payloadMatch = payloadPattern.exec(html)) !== null) {
            if (payloadMatch[1]) {
                payloads.push(this.decodeText(payloadMatch[1]).replace(/\\"/g, '"'));
            }
        }
        const flightPayload = payloads.join('');
        const contentReference = /chapter_content":"\$([^"]+)"/.exec(flightPayload);
        if (!(contentReference === null || contentReference === void 0 ? void 0 : contentReference[1])) {
            return '';
        }
        const contentId = this.escapeRegExp(contentReference[1]);
        const contentMarker = new RegExp(`${contentId}:T([0-9a-f]+),`).exec(flightPayload);
        if (!(contentMarker === null || contentMarker === void 0 ? void 0 : contentMarker[1])) {
            return '';
        }
        const start = ((_a = contentMarker.index) !== null && _a !== void 0 ? _a : 0) + contentMarker[0].length;
        const length = parseInt(contentMarker[1], 16);
        return flightPayload.slice(start, start + length);
    }
    wrapText(text, maxLineLength) {
        const lines = [];
        const paragraphs = text.split(/\n{2,}/);
        for (const paragraph of paragraphs) {
            const words = paragraph.split(/\s+/).filter(word => word.length > 0);
            let currentLine = '';
            for (const word of words) {
                const nextLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;
                if (nextLine.length > maxLineLength && currentLine.length > 0) {
                    lines.push(currentLine);
                    currentLine = word;
                }
                else {
                    currentLine = nextLine;
                }
            }
            if (currentLine.length > 0) {
                lines.push(currentLine);
            }
            lines.push('');
        }
        return lines;
    }
    svgPage(lines) {
        const escapedLines = lines.map(line => this.escapeXml(line));
        const text = escapedLines
            .map((line, index) => `<text x="60" y="${80 + index * 38}">${line}</text>`)
            .join('');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1400" viewBox="0 0 900 1400"><rect width="900" height="1400" fill="#111111"/><g fill="#f4f4f5" font-family="Arial, Helvetica, sans-serif" font-size="27">${text}</g></svg>`;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
    escapeXml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    toTagSection(tags) {
        return App.createTagSection({
            id: 'genres',
            label: 'Genres',
            tags: tags.map(tag => this.toSearchTag(tag))
        });
    }
    toSearchTag(tag) {
        return App.createTag({
            id: String(tag.id),
            label: this.cleanText(tag.name)
        });
    }
    subtitle(series) {
        var _a;
        const parts = [
            series.status,
            series.series_type,
            ((_a = series.meta) === null || _a === void 0 ? void 0 : _a.chapters_count) ? `${series.meta.chapters_count} chapters` : undefined
        ].filter((part) => typeof part === 'string' && part.length > 0);
        return parts.length > 0 ? parts.join(' | ') : undefined;
    }
    chapterName(chapter) {
        var _a;
        const title = this.cleanText((_a = chapter.chapter_title) !== null && _a !== void 0 ? _a : '');
        const name = this.cleanText(chapter.chapter_name);
        return title.length > 0 ? `${name} - ${title}` : name;
    }
    chapterNumber(chapter) {
        const indexed = Number(chapter.index);
        if (!Number.isNaN(indexed)) {
            return indexed;
        }
        const normalizedSlug = chapter.chapter_slug.replace(/-/g, '.');
        const slugMatch = /(\d+(?:\.\d+)?)/.exec(normalizedSlug);
        if (slugMatch === null || slugMatch === void 0 ? void 0 : slugMatch[1]) {
            return Number(slugMatch[1]);
        }
        const nameMatch = /(\d+(?:\.\d+)?)/.exec(chapter.chapter_name);
        return (nameMatch === null || nameMatch === void 0 ? void 0 : nameMatch[1]) ? Number(nameMatch[1]) : 0;
    }
    parseDate(value) {
        return (0, date_1.parseDateOrUndefined)(value);
    }
    cleanHtml(value) {
        return this.cleanText(value
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]+>/g, ''));
    }
    cleanText(value) {
        return this.decodeText(value).replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    }
    decodeText(value) {
        return value
            .replace(/\\u002F/g, '/')
            .replace(/\\u003c/gi, '<')
            .replace(/\\u003e/gi, '>')
            .replace(/\\u0026/gi, '&')
            .replace(/\\u0022/gi, '"')
            .replace(/\\u0027/gi, "'")
            .replace(/\\n/g, '\n')
            .replace(/\\\//g, '/')
            .replace(/\\"/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&#39;/g, "'")
            .replace(/&rsquo;/g, "'")
            .replace(/&ldquo;/g, '"')
            .replace(/&rdquo;/g, '"')
            .replace(/&hellip;/g, '...')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }
    escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
exports.OmegaScansParser = OmegaScansParser;

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
