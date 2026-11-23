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
exports.MangaDistrict = exports.MangaDistrictInfo = void 0;
const types_1 = require("@paperback/types");
const MangaDistrictParser_1 = require("./MangaDistrictParser");
const version_1 = require("./version");
const BASE_URL = 'https://mangadistrict.com';
exports.MangaDistrictInfo = {
    name: 'MangaDistrict',
    author: 'Paperback Community',
    description: 'MangaDistrict source for Paperback v0.8. Supports search, details, chapters and reader pages.',
    contentRating: types_1.ContentRating.ADULT,
    icon: 'icon.png',
    version: version_1.BUILD_VERSION,
    websiteBaseURL: BASE_URL,
    language: 'English',
    sourceTags: [
        { text: 'English', type: types_1.BadgeColor.BLUE },
        { text: 'Adult', type: types_1.BadgeColor.GREY },
        { text: 'Madara', type: types_1.BadgeColor.GREEN }
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS
};
class MangaDistrict {
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
        this.parser = new MangaDistrictParser_1.MangaDistrictParser(BASE_URL);
    }
    getSearchResults(query, metadata) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const orderBy = this.normalizeOrderBy(query.parameters.orderBy, ((_b = query.title) === null || _b === void 0 ? void 0 : _b.trim().length) ? 'relevance' : 'modified');
            const includedTagIds = query.includedTags.map(tag => tag.id);
            const url = ((_c = query.title) === null || _c === void 0 ? void 0 : _c.trim())
                ? this.parser.buildSearchUrl(query.title.trim(), page, orderBy, includedTagIds)
                : this.parser.buildArchiveUrl(orderBy, page, includedTagIds);
            const html = yield this.requestText(url);
            const results = this.parser.parseMangaList(html, page);
            if (query.excludedTags.length === 0) {
                return results;
            }
            return App.createPagedResults({
                results: yield this.excludeTaggedResults(results.results, query.excludedTags),
                metadata: results.metadata
            });
        });
    }
    getSearchTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.requestText(this.parser.buildArchiveUrl('modified', 1));
            return this.parser.parseSearchTags(html);
        });
    }
    getSearchFields() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                App.createSearchField({
                    id: 'orderBy',
                    name: 'Order by',
                    placeholder: 'modified, views, trending, rating, new-manga, alphabet or relevance'
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
                App.createHomeSection({
                    id: "latest" /* MangaDistrictHomeSectionId.Latest */,
                    title: 'Latest Updates',
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                    containsMoreItems: true
                }),
                App.createHomeSection({
                    id: "popular" /* MangaDistrictHomeSectionId.Popular */,
                    title: 'Most Viewed',
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                    containsMoreItems: true
                }),
                App.createHomeSection({
                    id: "trending" /* MangaDistrictHomeSectionId.Trending */,
                    title: 'Trending',
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                    containsMoreItems: true
                }),
                App.createHomeSection({
                    id: "new_series" /* MangaDistrictHomeSectionId.NewSeries */,
                    title: 'New Series',
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                    containsMoreItems: true
                }),
                App.createHomeSection({
                    id: "rating" /* MangaDistrictHomeSectionId.Rating */,
                    title: 'Highest Rated',
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
                    console.log(`MangaDistrict homepage section failed: ${section.id} ${String(error)}`);
                }
            })));
        });
    }
    getViewMoreItems(homepageSectionId, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            switch (homepageSectionId) {
                case "latest" /* MangaDistrictHomeSectionId.Latest */:
                    return this.getArchivePage('modified', page);
                case "popular" /* MangaDistrictHomeSectionId.Popular */:
                    return this.getArchivePage('views', page);
                case "trending" /* MangaDistrictHomeSectionId.Trending */:
                    return this.getArchivePage('trending', page);
                case "new_series" /* MangaDistrictHomeSectionId.NewSeries */:
                    return this.getArchivePage('new-manga', page);
                case "rating" /* MangaDistrictHomeSectionId.Rating */:
                    return this.getArchivePage('rating', page);
                default:
                    return App.createPagedResults({ results: [] });
            }
        });
    }
    getArchivePage(orderBy, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.requestText(this.parser.buildArchiveUrl(orderBy, page));
            return this.parser.parseMangaList(html, page);
        });
    }
    excludeTaggedResults(results, excludedTags) {
        return __awaiter(this, void 0, void 0, function* () {
            const excludedIds = excludedTags.map(tag => tag.id);
            return (yield Promise.all(results.map((result) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const html = yield this.requestText(this.parser.buildSeriesUrl(result.mangaId));
                    const seriesTagIds = this.parser.parseGenreIdsFromDetails(html);
                    return excludedIds.some(tagId => seriesTagIds.includes(tagId)) ? undefined : result;
                }
                catch (error) {
                    console.log(`MangaDistrict tag exclusion skipped for ${result.mangaId}: ${String(error)}`);
                    return result;
                }
            })))).filter((result) => result !== undefined);
        });
    }
    normalizeOrderBy(value, fallback) {
        const normalized = (value !== null && value !== void 0 ? value : fallback).trim();
        switch (normalized) {
            case 'modified':
            case 'views':
            case 'trending':
            case 'rating':
            case 'new-manga':
            case 'alphabet':
            case 'relevance':
                return normalized;
            default:
                return fallback;
        }
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
                throw new Error(`MangaDistrict network request failed for ${url}: ${String(error)}`);
            }
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`MangaDistrict request failed for ${url}: HTTP ${response.status}`);
            }
            if (typeof response.data !== 'string') {
                throw new Error(`MangaDistrict returned an empty response for ${url}`);
            }
            return response.data;
        });
    }
    headers(url) {
        const imageRequest = /\.(?:jpg|jpeg|png|webp|gif|avif)(?:[?#].*)?$/i.test(url);
        return {
            referer: `${BASE_URL}/`,
            origin: BASE_URL,
            accept: imageRequest ? 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'user-agent': 'Paperback/0.8 MangaDistrict'
        };
    }
}
exports.MangaDistrict = MangaDistrict;

},{"./MangaDistrictParser":61,"./version":62,"@paperback/types":59}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaDistrictParser = void 0;
const readerError_1 = require("../utils/readerError");
const url_1 = require("../utils/url");
const date_1 = require("../utils/date");
const CARD_PAGE_SIZE = 30;
class MangaDistrictParser {
    constructor(baseUrl, options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        this.baseUrl = baseUrl;
        this.options = {
            readerImageOrigins: (_a = options.readerImageOrigins) !== null && _a !== void 0 ? _a : [],
            archivePath: (_b = options.archivePath) !== null && _b !== void 0 ? _b : 'series',
            seriesPath: (_c = options.seriesPath) !== null && _c !== void 0 ? _c : 'series',
            genrePath: (_d = options.genrePath) !== null && _d !== void 0 ? _d : 'publication-genre',
            sourceName: (_e = options.sourceName) !== null && _e !== void 0 ? _e : 'MangaDistrict',
            langCode: (_f = options.langCode) !== null && _f !== void 0 ? _f : 'en',
            hentai: (_g = options.hentai) !== null && _g !== void 0 ? _g : true,
            acceptWordPressReaderImages: (_h = options.acceptWordPressReaderImages) !== null && _h !== void 0 ? _h : false,
            modernChapterContainerClass: (_j = options.modernChapterContainerClass) !== null && _j !== void 0 ? _j : '',
            modernChapterDateClass: (_k = options.modernChapterDateClass) !== null && _k !== void 0 ? _k : '',
            modernAuthorLabel: (_l = options.modernAuthorLabel) !== null && _l !== void 0 ? _l : '',
            modernArtistLabel: (_m = options.modernArtistLabel) !== null && _m !== void 0 ? _m : ''
        };
    }
    parseMangaList(html, page) {
        const results = this.parseMangaCards(html);
        return App.createPagedResults({
            results,
            metadata: this.hasNextPage(html, results.length, page) ? { page: page + 1 } : undefined
        });
    }
    parseMangaDetails(mangaId, html) {
        const title = this.extractSeriesTitle(html) || this.titleFromSlug(mangaId);
        const alternativeTitles = this.splitTitles(this.extractLabeledSummary(html, 'Alternative'));
        const cover = this.extractCover(html);
        const genres = this.parseGenresFromDetails(html);
        const status = this.extractLabeledSummary(html, 'Status') || this.extractModernInfo(html, 'Statut') || 'Unknown';
        return App.createMangaInfo({
            image: cover,
            titles: Array.from(new Set([title, ...alternativeTitles])),
            author: this.extractNamedContent(html, 'author-content')
                || this.extractConfiguredModernInfo(html, this.options.modernAuthorLabel)
                || this.extractModernAuthor(html)
                || 'Unknown',
            artist: this.extractNamedContent(html, 'artist-content')
                || this.extractConfiguredModernInfo(html, this.options.modernArtistLabel)
                || 'Unknown',
            desc: this.extractDescription(html),
            status,
            hentai: this.options.hentai,
            rating: this.extractRating(html),
            tags: [this.toTagSection(genres)],
            covers: cover.length > 0 ? [cover] : [],
            additionalInfo: this.seriesAdditionalInfo(html)
        });
    }
    parseChapters(mangaId, html) {
        var _a, _b;
        const chapters = [];
        const seen = {};
        const chapterPattern = /<li[^>]+class=["'][^"']*wp-manga-chapter[^"']*["'][\s\S]*?<\/li>/gi;
        let match;
        while ((match = chapterPattern.exec(html)) !== null) {
            const block = match[0];
            const href = this.extractAttribute(block, 'href');
            const chapterId = this.chapterIdFromUrl(href);
            if (!chapterId || seen[chapterId]) {
                continue;
            }
            seen[chapterId] = true;
            const name = this.cleanText(this.extractAnchorText(block) || this.titleFromSlug(chapterId));
            const chapNum = this.chapterNumber(chapterId, name);
            const time = this.parseChapterDate(block);
            chapters.push(App.createChapter(Object.assign(Object.assign({ id: chapterId, chapNum,
                name, langCode: this.options.langCode, group: this.options.sourceName }, (time ? { time } : {})), { sortingIndex: chapNum })));
        }
        const escapedMangaId = this.escapeRegExp(encodeURIComponent(mangaId));
        const modernChapterPattern = new RegExp(`<a[^>]+href=["']([^"']*/${this.escapeRegExp(this.options.seriesPath)}/${escapedMangaId}/([^/"'#?]+)/?)["'][^>]*>([\\s\\S]*?)<\\/a>`, 'gi');
        while ((match = modernChapterPattern.exec(html)) !== null) {
            const chapterId = this.decodeText((_a = match[2]) !== null && _a !== void 0 ? _a : '');
            if (!/^chap(?:ter|itre)-/i.test(chapterId) || seen[chapterId]) {
                continue;
            }
            seen[chapterId] = true;
            const rawName = this.cleanHtml((_b = match[3]) !== null && _b !== void 0 ? _b : '') || this.titleFromSlug(chapterId);
            const name = /^\d+(?:\.\d+)?$/.test(rawName)
                ? `${this.options.langCode === 'fr' ? 'Chapitre' : 'Chapter'} ${rawName}`
                : rawName;
            const chapNum = this.chapterNumber(chapterId, name);
            const time = this.parseModernChapterDate(html, match.index);
            chapters.push(App.createChapter(Object.assign(Object.assign({ id: chapterId, chapNum,
                name, langCode: this.options.langCode, group: this.options.sourceName }, (time ? { time } : {})), { sortingIndex: chapNum })));
        }
        return chapters.sort((left, right) => left.chapNum - right.chapNum);
    }
    parseChapterRange(mangaId, html) {
        var _a, _b;
        const visibleChapters = this.parseChapters(mangaId, html);
        const highestChapter = visibleChapters.reduce((highest, chapter) => Math.max(highest, Math.floor(chapter.chapNum)), 0);
        if (highestChapter <= 0) {
            return visibleChapters;
        }
        const prefix = (_b = (_a = visibleChapters.find(chapter => /^chap(?:ter|itre)-/i.test(chapter.id))) === null || _a === void 0 ? void 0 : _a.id.split(/\d/)[0]) !== null && _b !== void 0 ? _b : 'chapter-';
        const seen = new Set(visibleChapters.map(chapter => chapter.id));
        for (let chapterNumber = 1; chapterNumber <= highestChapter; chapterNumber += 1) {
            const chapterId = `${prefix}${chapterNumber}`;
            if (seen.has(chapterId)) {
                continue;
            }
            visibleChapters.push(App.createChapter({
                id: chapterId,
                chapNum: chapterNumber,
                name: `${this.options.langCode === 'fr' ? 'Chapitre' : 'Chapter'} ${chapterNumber}`,
                langCode: this.options.langCode,
                group: this.options.sourceName,
                sortingIndex: chapterNumber
            }));
        }
        return visibleChapters.sort((left, right) => left.chapNum - right.chapNum);
    }
    parseChapterDetails(mangaId, chapterId, html) {
        const pages = this.extractReaderImages(html);
        if (pages.length === 0) {
            throw (0, readerError_1.createReaderError)(this.options.sourceName, mangaId, chapterId, html);
        }
        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages
        });
    }
    parseSearchTags(html) {
        var _a, _b, _c, _d, _e, _f;
        const seen = {};
        const genrePath = this.escapeRegExp(this.options.genrePath);
        const tagPattern = new RegExp(`<a[^>]+href=["'][^"']*/${genrePath}/([^/"'#?]+)/?["'][^>]*>([\\s\\S]*?)<\\/a>`, 'gi');
        let match;
        while ((match = tagPattern.exec(html)) !== null) {
            const id = this.cleanText((_a = match[1]) !== null && _a !== void 0 ? _a : '');
            const label = this.cleanText(((_b = match[2]) !== null && _b !== void 0 ? _b : '').replace(/<span[\s\S]*?<\/span>/gi, ''));
            if (id.length === 0 || label.length === 0) {
                continue;
            }
            const existing = seen[id];
            if (!existing || this.isAllCaps(existing.label) && !this.isAllCaps(label)) {
                seen[id] = { id, label };
            }
        }
        const checkboxPattern = /<input[^>]+value=["']([^"']+)["'][^>]+name=["']genre\[\]["'][^>]*>\s*<label[^>]*>([\s\S]*?)<\/label>/gi;
        while ((match = checkboxPattern.exec(html)) !== null) {
            const id = this.cleanText((_c = match[1]) !== null && _c !== void 0 ? _c : '');
            const label = this.cleanHtml((_d = match[2]) !== null && _d !== void 0 ? _d : '');
            if (id && label)
                seen[id] = { id, label };
        }
        const modernTagPattern = /<label[^>]+class=["'][^"']*ori-fcheck[^"']*["'][^>]*>[\s\S]*?<input[^>]+value=["']([^"']+)["'][^>]*>[\s\S]*?<span[^>]+class=["'][^"']*ori-flabel[^"']*["'][^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/label>/gi;
        while ((match = modernTagPattern.exec(html)) !== null) {
            const id = this.cleanText((_e = match[1]) !== null && _e !== void 0 ? _e : '');
            const label = this.cleanHtml((_f = match[2]) !== null && _f !== void 0 ? _f : '');
            if (id.length > 0 && label.length > 0) {
                seen[id] = { id, label };
            }
        }
        const tags = Object.values(seen)
            .sort((left, right) => left.label.localeCompare(right.label))
            .map(genre => App.createTag({ id: genre.id, label: genre.label }));
        return [
            App.createTagSection({
                id: 'genres',
                label: 'Genres',
                tags
            })
        ];
    }
    parseGenreIdsFromDetails(html) {
        return this.parseGenresFromDetails(html).map(genre => genre.id);
    }
    buildSearchUrl(title, page, orderBy, includedTagIds) {
        const parameters = [
            ['s', title],
            ['post_type', 'wp-manga'],
            ...includedTagIds.map(tagId => ['genre[]', tagId])
        ];
        if (orderBy !== 'relevance') {
            parameters.push(['m_orderby', orderBy]);
        }
        if (page > 1) {
            parameters.push(['paged', String(page)]);
        }
        return this.buildUrl('/', parameters);
    }
    buildArchiveUrl(orderBy, page, includedTagIds = []) {
        const path = page > 1 ? `/${this.options.archivePath}/page/${page}/` : `/${this.options.archivePath}/`;
        return this.buildUrl(path, [
            ['m_orderby', orderBy],
            ...includedTagIds.map(tagId => ['genre[]', tagId])
        ]);
    }
    buildSeriesUrl(mangaId) {
        return `${this.baseUrl}/${this.options.seriesPath}/${encodeURIComponent(mangaId)}/`;
    }
    buildChapterUrl(mangaId, chapterId) {
        return `${this.buildSeriesUrl(mangaId)}${encodeURIComponent(chapterId)}/`;
    }
    buildChaptersUrl(mangaId, page = 1) {
        return `${this.buildSeriesUrl(mangaId)}ajax/chapters/?t=${page}&paperback=1`;
    }
    mangaIdFromUrl(url) {
        const path = this.escapeRegExp(this.options.seriesPath);
        const match = new RegExp(`/${path}/([^/?#]+)/?(?:[?#].*)?$`).exec(url);
        return (match === null || match === void 0 ? void 0 : match[1]) ? this.decodeText(match[1]) : undefined;
    }
    normalizeUrl(value) {
        return (0, url_1.normalizeHttpUrl)(this.decodeText(value), this.baseUrl);
    }
    parseMangaCards(html) {
        var _a, _b, _c;
        const legacyBlocks = html.split(/<div[^>]+class=["'][^"']*page-item-detail[^"']*["'][^>]*>/i).slice(1);
        const modernBlocks = (_a = html.match(/<a[^>]+class=["'][^"']*ori-cat-card[^"']*["'][^>]*>[\s\S]*?<\/a>/gi)) !== null && _a !== void 0 ? _a : [];
        const searchBlocks = html.split(/<div[^>]+class=["'][^"']*c-tabs-item__content[^"']*["'][^>]*>/i).slice(1);
        const blocks = [...legacyBlocks, ...modernBlocks, ...searchBlocks];
        const seen = {};
        const results = [];
        for (const rawBlock of blocks) {
            const block = rawBlock.slice(0, 6000);
            const href = this.extractSeriesHref(block);
            const mangaId = href ? this.mangaIdFromUrl(href) : undefined;
            if (!mangaId || seen[mangaId]) {
                continue;
            }
            seen[mangaId] = true;
            const image = this.extractCardImage(block);
            const title = this.extractCardTitle(block) || this.titleFromSlug(mangaId);
            const subtitle = this.extractCardSubtitle(block);
            results.push(App.createPartialSourceManga({
                mangaId,
                title,
                image,
                subtitle
            }));
        }
        if (results.length === 0) {
            const canonical = (_c = (_b = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i.exec(html)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : '';
            const mangaId = this.mangaIdFromUrl(this.normalizeUrl(canonical));
            if (mangaId) {
                results.push(App.createPartialSourceManga({
                    mangaId,
                    title: this.extractSeriesTitle(html) || this.titleFromSlug(mangaId),
                    image: this.extractCover(html)
                }));
            }
        }
        return results;
    }
    extractSeriesHref(block) {
        var _a;
        const path = this.escapeRegExp(this.options.seriesPath);
        const match = new RegExp("<a[^>]+href=[\"']([^\"']*/" + path + "/[^/\"'#?]+/?)[\"'][^>]*>", 'i').exec(block);
        return this.normalizeUrl((_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : '');
    }
    extractCardTitle(block) {
        var _a;
        const modernTitle = /<span[^>]+class=["'][^"']*ori-card-title[^"']*["'][^>]*>([\s\S]*?)<\/span>/i.exec(block);
        if (modernTitle === null || modernTitle === void 0 ? void 0 : modernTitle[1]) {
            return this.cleanHtml(modernTitle[1]);
        }
        const titleAnchor = /<div[^>]+class=["'][^"']*post-title[^"']*["'][\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i.exec(block);
        if (titleAnchor === null || titleAnchor === void 0 ? void 0 : titleAnchor[1]) {
            return this.cleanHtml(titleAnchor[1]);
        }
        const path = this.escapeRegExp(this.options.seriesPath);
        const titleAttr = new RegExp("<a[^>]+href=[\"'][^\"']*/" + path + "/[^\"']+[\"'][^>]*title=[\"']([^\"']+)[\"'][^>]*>", 'i').exec(block);
        if (titleAttr === null || titleAttr === void 0 ? void 0 : titleAttr[1]) {
            return this.cleanText(titleAttr[1]);
        }
        const imageAlt = /<img[^>]+alt=["']([^"']+)["'][^>]*>/i.exec(block);
        return this.cleanText((_a = imageAlt === null || imageAlt === void 0 ? void 0 : imageAlt[1]) !== null && _a !== void 0 ? _a : '');
    }
    extractCardImage(block) {
        var _a, _b;
        const imageTag = (_b = (_a = /<img[^>]+>/i.exec(block)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '';
        return this.firstImageUrl(imageTag);
    }
    extractCardSubtitle(block) {
        const modernSubtitle = /<span[^>]+class=["'][^"']*ori-card-sub[^"']*["'][^>]*>([\s\S]*?)<\/span>/i.exec(block);
        if (modernSubtitle === null || modernSubtitle === void 0 ? void 0 : modernSubtitle[1]) {
            return this.cleanHtml(modernSubtitle[1]);
        }
        const latestChapter = /<div[^>]+class=["'][^"']*chapter-item[^"']*["'][\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i.exec(block);
        const score = /<span[^>]+class=["'][^"']*total_votes[^"']*["'][^>]*>([\s\S]*?)<\/span>/i.exec(block);
        const parts = [
            (latestChapter === null || latestChapter === void 0 ? void 0 : latestChapter[1]) ? this.cleanHtml(latestChapter[1]) : undefined,
            (score === null || score === void 0 ? void 0 : score[1]) ? `Rating ${this.cleanHtml(score[1])}` : undefined
        ].filter((part) => typeof part === 'string' && part.length > 0);
        return parts.length > 0 ? parts.join(' | ') : undefined;
    }
    extractSeriesTitle(html) {
        const titleBlock = /<div[^>]+class=["'][^"']*post-title[^"']*["'][\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
        if (titleBlock === null || titleBlock === void 0 ? void 0 : titleBlock[1]) {
            return this.cleanHtml(titleBlock[1]);
        }
        const ogTitle = /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html);
        if (ogTitle === null || ogTitle === void 0 ? void 0 : ogTitle[1]) {
            return this.cleanText(ogTitle[1].replace(/\s+-\s+MANGA DISTRICT[\s\S]*$/i, ''));
        }
        return '';
    }
    extractCover(html) {
        var _a, _b, _c, _d, _e;
        const summaryImage = (_b = (_a = /<div[^>]+class=["'][^"']*summary_image[^"']*["'][\s\S]*?<\/div>/i.exec(html)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '';
        const imageTag = (_d = (_c = /<img[^>]+>/i.exec(summaryImage)) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : '';
        const image = this.firstImageUrl(imageTag);
        if (image.length > 0) {
            return image;
        }
        const ogImage = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html);
        return this.normalizeUrl((_e = ogImage === null || ogImage === void 0 ? void 0 : ogImage[1]) !== null && _e !== void 0 ? _e : '');
    }
    extractDescription(html) {
        var _a;
        const description = /<div[^>]+class=["'][^"']*description-summary[^"']*["'][\s\S]*?<div[^>]+class=["'][^"']*summary__content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i.exec(html);
        if (description === null || description === void 0 ? void 0 : description[1]) {
            return this.cleanHtml(description[1]);
        }
        const modernDescription = /<div[^>]+class=["'][^"']*ori-sr-syn-texte[^"']*["'][^>]*>([\s\S]*?)<\/div>/i.exec(html);
        if (modernDescription === null || modernDescription === void 0 ? void 0 : modernDescription[1]) {
            return this.cleanHtml(modernDescription[1]);
        }
        const metaDescription = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html);
        return this.cleanText((_a = metaDescription === null || metaDescription === void 0 ? void 0 : metaDescription[1]) !== null && _a !== void 0 ? _a : '');
    }
    parseGenresFromDetails(html) {
        var _a, _b, _c, _d, _e, _f;
        const genresBlock = (_d = (_b = (_a = /<div[^>]+class=["'][^"']*genres-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i.exec(html)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : (_c = /<div[^>]+class=["'][^"']*ori-sr-genres[^"']*["'][^>]*>([\s\S]*?)<\/div>/i.exec(html)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : '';
        const genres = [];
        const genrePath = this.escapeRegExp(this.options.genrePath);
        const genrePattern = new RegExp("<a[^>]+href=[\"'][^\"']*/" + genrePath + "/([^/\"'#?]+)/?[\"'][^>]*>([\\s\\S]*?)<\\/a>", 'gi');
        let match;
        while ((match = genrePattern.exec(genresBlock)) !== null) {
            const id = this.cleanText((_e = match[1]) !== null && _e !== void 0 ? _e : '');
            const label = this.cleanHtml((_f = match[2]) !== null && _f !== void 0 ? _f : '');
            if (id.length > 0 && label.length > 0) {
                genres.push({ id, label });
            }
        }
        return genres;
    }
    extractNamedContent(html, className) {
        var _a;
        const escaped = this.escapeRegExp(className);
        const content = new RegExp(`<div[^>]+class=["'][^"']*${escaped}[^"']*["'][^>]*>([\\s\\S]*?)<\\/div>`, 'i').exec(html);
        return this.cleanHtml((_a = content === null || content === void 0 ? void 0 : content[1]) !== null && _a !== void 0 ? _a : '');
    }
    extractLabeledSummary(html, label) {
        var _a, _b;
        const escaped = this.escapeRegExp(label);
        const pattern = new RegExp(`<h5>\\s*${escaped}\\s*<\\/h5>\\s*<\\/div>\\s*<div[^>]+class=["'][^"']*summary-content[^"']*["'][^>]*>([\\s\\S]*?)<\\/div>`, 'i');
        return this.cleanHtml((_b = (_a = pattern.exec(html)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '');
    }
    extractRating(html) {
        var _a;
        const value = (_a = /<span[^>]+class=["'][^"']*total_votes[^"']*["'][^>]*>([\s\S]*?)<\/span>/i.exec(html)) === null || _a === void 0 ? void 0 : _a[1];
        const rating = Number(this.cleanHtml(value !== null && value !== void 0 ? value : ''));
        return Number.isFinite(rating) ? rating : undefined;
    }
    extractModernAuthor(html) {
        var _a;
        const signature = /<div[^>]+class=["'][^"']*ori-sr-signature[^"']*["'][^>]*>([\s\S]*?)<\/div>/i.exec(html);
        return this.cleanHtml((_a = signature === null || signature === void 0 ? void 0 : signature[1]) !== null && _a !== void 0 ? _a : '');
    }
    extractModernInfo(html, label) {
        var _a, _b;
        const expectedLabel = this.normalizeInfoLabel(label);
        const pattern = /<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi;
        let match;
        while ((match = pattern.exec(html)) !== null) {
            if (this.normalizeInfoLabel((_a = match[1]) !== null && _a !== void 0 ? _a : '') === expectedLabel) {
                return this.cleanHtml((_b = match[2]) !== null && _b !== void 0 ? _b : '');
            }
        }
        return '';
    }
    extractConfiguredModernInfo(html, label) {
        return label.length > 0 ? this.extractModernInfo(html, label) : '';
    }
    normalizeInfoLabel(value) {
        return this.cleanHtml(value)
            .replace(/&eacute;/gi, 'e')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }
    seriesAdditionalInfo(html) {
        const info = {};
        const fields = ['Type', 'Release', 'Status'];
        for (const field of fields) {
            const modernLabel = field === 'Status' ? 'Statut' : field;
            const value = this.extractLabeledSummary(html, field) || this.extractModernInfo(html, modernLabel);
            if (value.length > 0)
                info[field] = value;
        }
        return info;
    }
    splitTitles(value) {
        return value
            .split(/[|;,]/)
            .map(title => this.cleanText(title))
            .filter(title => title.length > 0 && title.toLowerCase() !== 'n/a');
    }
    extractReaderImages(html) {
        const readerHtml = this.extractReaderHtml(html);
        const imagePattern = /<img[^>]+class=["'][^"']*wp-manga-chapter-img[^"']*["'][^>]*>/gi;
        const seen = {};
        const pages = [];
        let match;
        while ((match = imagePattern.exec(readerHtml)) !== null) {
            const url = this.firstImageUrl(match[0]);
            if (!this.isReaderPageImage(url) || seen[url]) {
                continue;
            }
            seen[url] = true;
            pages.push(url);
        }
        return pages;
    }
    extractReaderHtml(html) {
        const start = html.search(/<div[^>]+class=["'][^"']*reading-content[^"']*["'][^>]*>/i);
        if (start < 0) {
            return html;
        }
        const rest = html.slice(start);
        const end = rest.search(/<div[^>]+class=["'][^"']*(comments-area|related-manga|c-sidebar|site-footer)[^"']*["'][^>]*>/i);
        return end > 0 ? rest.slice(0, end) : rest;
    }
    firstImageUrl(imageTag) {
        const attributes = ['data-mature-static', 'data-default-src', 'data-src', 'data-lazy-src', 'src'];
        for (const attribute of attributes) {
            const value = this.extractAttribute(imageTag, attribute);
            const url = this.normalizeUrl(value);
            if (url.length > 0) {
                return url;
            }
        }
        return '';
    }
    isReaderPageImage(url) {
        if (url.length === 0) {
            return false;
        }
        const lower = url.toLowerCase();
        if (!/\.(?:jpg|jpeg|png|webp|gif|avif)(?:[?#].*)?$/.test(lower)) {
            return false;
        }
        if (lower.includes('/thumbnail/') || lower.includes('/logo') || lower.includes('/favicon') || lower.includes('/banner')) {
            return false;
        }
        if (this.options.readerImageOrigins.some(origin => lower.startsWith(`${origin.toLowerCase()}/manga_`)))
            return true;
        if (this.options.acceptWordPressReaderImages)
            return lower.includes('/wp-content/uploads/');
        if (lower.includes('/assets/publication/media/') || lower.includes('/wp-content/'))
            return false;
        return lower.includes('cdn.mangadistrict.com/publication/') && lower.includes('/chapter-');
    }
    chapterIdFromUrl(url) {
        const path = this.escapeRegExp(this.options.seriesPath);
        const match = new RegExp('/' + path + '/[^/]+/([^/?#]+)/?(?:[?#].*)?$').exec(url);
        return (match === null || match === void 0 ? void 0 : match[1]) ? this.decodeText(match[1]) : undefined;
    }
    extractAnchorText(block) {
        const anchor = /<a[^>]*>([\s\S]*?)<\/a>/i.exec(block);
        return (anchor === null || anchor === void 0 ? void 0 : anchor[1]) ? this.cleanHtml(anchor[1]) : '';
    }
    chapterNumber(chapterId, title) {
        const titleMatch = /chap(?:ter|itre)\s+(\d+(?:[.,]\d+)?)/i.exec(title);
        if (titleMatch === null || titleMatch === void 0 ? void 0 : titleMatch[1]) {
            return Number(titleMatch[1].replace(',', '.'));
        }
        const slugMatch = /chap(?:ter|itre)-(\d+(?:-\d+)?)/i.exec(chapterId);
        if (!(slugMatch === null || slugMatch === void 0 ? void 0 : slugMatch[1])) {
            return 0;
        }
        const parts = slugMatch[1].split('-');
        if (parts.length === 1) {
            return Number(parts[0]);
        }
        return Number(`${parts[0]}.${parts.slice(1).join('')}`);
    }
    parseChapterDate(block) {
        var _a, _b;
        const dateText = (_b = (_a = /<span[^>]+class=["'][^"']*timediff[^"']*["'][^>]*>[\s\S]*?<i[^>]*>([\s\S]*?)<\/i>/i.exec(block)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
        return (0, date_1.parseDateOrUndefined)(this.cleanHtml(dateText));
    }
    parseModernChapterDate(html, chapterIndex) {
        var _a;
        const containerClass = this.options.modernChapterContainerClass;
        const dateClass = this.options.modernChapterDateClass;
        if (!containerClass || !dateClass) {
            return undefined;
        }
        const containerPattern = new RegExp(`<[^>]+class=["'][^"']*\\b${this.escapeRegExp(containerClass)}\\b[^"']*["'][^>]*>`, 'gi');
        let container;
        let start = -1;
        let end = html.length;
        while ((container = containerPattern.exec(html)) !== null) {
            if (container.index > chapterIndex) {
                end = container.index;
                break;
            }
            start = container.index;
        }
        if (start < 0) {
            return undefined;
        }
        const block = html.slice(start, end);
        const datePattern = new RegExp(`<[^>]+class=["'][^"']*\\b${this.escapeRegExp(dateClass)}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/[^>]+>`, 'i');
        const dateElement = (_a = datePattern.exec(block)) === null || _a === void 0 ? void 0 : _a[0];
        if (!dateElement) {
            return undefined;
        }
        const dateValue = this.extractAttribute(dateElement, 'datetime') || this.cleanHtml(dateElement);
        return (0, date_1.parseFrenchDateOrUndefined)(dateValue);
    }
    hasNextPage(html, resultCount, page) {
        if (resultCount === 0) {
            return false;
        }
        const nextPagePattern = new RegExp(`title=["']Page\\s+${page + 1}["']|/page/${page + 1}/|[?&]paged=${page + 1}\\b`, 'i');
        return nextPagePattern.test(html) || resultCount >= CARD_PAGE_SIZE;
    }
    toTagSection(genres) {
        const tags = genres.map(genre => App.createTag({
            id: genre.id,
            label: genre.label
        }));
        return App.createTagSection({
            id: 'genres',
            label: 'Genres',
            tags
        });
    }
    buildUrl(path, parameters) {
        const query = parameters
            .filter(([, value]) => value.trim().length > 0)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        return `${this.baseUrl}${path}${query.length > 0 ? `?${query}` : ''}`;
    }
    extractAttribute(html, attribute) {
        var _a;
        const escaped = this.escapeRegExp(attribute);
        const match = new RegExp(`${escaped}\\s*=\\s*["']([^"']+)["']`, 'i').exec(html);
        return this.decodeText((_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : '');
    }
    titleFromSlug(slug) {
        return slug
            .split('-')
            .filter(part => part.length > 0)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    }
    cleanHtml(value) {
        return this.cleanText(value
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
            .replace(/\\u002F/g, '/')
            .replace(/\\u003c/gi, '<')
            .replace(/\\u003e/gi, '>')
            .replace(/\\u0026/gi, '&')
            .replace(/\\u0022/gi, '"')
            .replace(/\\u0027/gi, "'")
            .replace(/\\n/g, '\n')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&#39;/g, "'")
            .replace(/&rsquo;/g, "'")
            .replace(/&ldquo;/g, '"')
            .replace(/&rdquo;/g, '"')
            .replace(/&hellip;/g, '...')
            .replace(/&middot;/g, '\u00b7')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#8211;/g, '-')
            .replace(/&#8217;/g, "'")
            .replace(/&#8220;/g, '"')
            .replace(/&#8221;/g, '"');
    }
    isAllCaps(value) {
        const letters = value.replace(/[^A-Za-z]/g, '');
        return letters.length > 0 && letters === letters.toUpperCase();
    }
    escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
exports.MangaDistrictParser = MangaDistrictParser;

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
