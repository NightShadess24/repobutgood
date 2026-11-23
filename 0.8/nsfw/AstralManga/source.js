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
exports.AstralManga = exports.AstralMangaInfo = void 0;
const types_1 = require("@paperback/types");
const AstralMangaParser_1 = require("./AstralMangaParser");
const version_1 = require("./version");
const cloudflare_1 = require("../utils/cloudflare");
const BASE_URL = 'https://astral-manga.fr';
exports.AstralMangaInfo = {
    name: 'Astral Manga',
    author: 'Paperback Community',
    description: 'French Astral Manga source for its UUID-based catalogue and public chapters.',
    contentRating: types_1.ContentRating.ADULT,
    icon: 'icon.png',
    version: version_1.BUILD_VERSION,
    websiteBaseURL: BASE_URL,
    language: 'French',
    sourceTags: [
        { text: 'French', type: types_1.BadgeColor.BLUE },
        { text: 'Manga', type: types_1.BadgeColor.GREEN },
        { text: 'Manhwa', type: types_1.BadgeColor.GREY }
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS | types_1.SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
};
class AstralManga {
    constructor() {
        this.parser = new AstralMangaParser_1.AstralMangaParser(BASE_URL);
        this.interceptor = {
            interceptRequest: (request) => __awaiter(this, void 0, void 0, function* () { request.headers = Object.assign(Object.assign({}, request.headers), this.headers(request.url)); return request; }),
            interceptResponse: (response) => __awaiter(this, void 0, void 0, function* () { return response; })
        };
        this.requestManager = App.createRequestManager({ interceptor: this.interceptor, requestsPerSecond: 1, requestTimeout: 20000 });
    }
    getSearchResults(query, metadata) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const parameters = this.parameters(query.parameters);
            const html = yield this.requestText(this.parser.buildCatalogueUrl(page, (_b = query.title) !== null && _b !== void 0 ? _b : '', query.includedTags, parameters));
            return this.parser.parseMangaList(html, page);
        });
    }
    getSearchTags() {
        return __awaiter(this, void 0, void 0, function* () { return this.parser.parseSearchTags(yield this.requestText(this.parser.buildCatalogueUrl(1))); });
    }
    getSearchFields() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                App.createSearchField({ id: 'status', name: 'Statut', placeholder: 'En cours ou Termine' }),
                App.createSearchField({ id: 'type', name: 'Type', placeholder: 'Manga, Manhwa ou Manhua' }),
                App.createSearchField({ id: 'sort', name: 'Tri', placeholder: 'latest, popular ou alphabetical' })
            ];
        });
    }
    supportsTagExclusion() {
        return __awaiter(this, void 0, void 0, function* () { return false; });
    }
    supportsSearchOperators() {
        return __awaiter(this, void 0, void 0, function* () { return false; });
    }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = this.parser.parseMangaDetails(mangaId, yield this.requestText(this.parser.buildSeriesUrl(mangaId)));
            return App.createSourceManga({ id: mangaId, mangaInfo: info });
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () { return this.parser.parseChapters(mangaId, yield this.requestText(this.parser.buildSeriesUrl(mangaId))); });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () { return this.parser.parseChapterDetails(mangaId, chapterId, yield this.requestText(this.parser.buildChapterUrl(mangaId, chapterId))); });
    }
    getMangaShareUrl(mangaId) { return this.parser.buildSeriesUrl(mangaId); }
    getCloudflareBypassRequestAsync() {
        return __awaiter(this, void 0, void 0, function* () { return App.createRequest({ url: BASE_URL, method: 'GET', headers: this.headers(BASE_URL) }); });
    }
    getHomePageSections(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = [this.section("latest" /* AstralHomeSectionId.Latest */, 'Derniers ajouts'), this.section("popular" /* AstralHomeSectionId.Popular */, 'Populaires'), this.section("alphabetical" /* AstralHomeSectionId.Alphabetical */, 'Catalogue A-Z')];
            for (const section of sections)
                callback(section);
            yield Promise.all(sections.map((section) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const results = yield this.getViewMoreItems(section.id, { page: 1 });
                    section.items = results.results;
                    section.containsMoreItems = results.metadata !== undefined;
                    callback(section);
                }
                catch (error) {
                    console.log(`Astral Manga homepage section failed: ${section.id} ${String(error)}`);
                }
            })));
        });
    }
    getViewMoreItems(id, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const sort = id === "popular" /* AstralHomeSectionId.Popular */ ? 'popular' : id === "alphabetical" /* AstralHomeSectionId.Alphabetical */ ? 'alphabetical' : 'latest';
            return this.parser.parseMangaList(yield this.requestText(this.parser.buildCatalogueUrl(page, '', [], { sort })), page);
        });
    }
    section(id, title) { return App.createHomeSection({ id, title, type: types_1.HomeSectionType.singleRowNormal, items: [], containsMoreItems: true }); }
    parameters(value) {
        var _a, _b, _c;
        const status = ((_a = value.status) !== null && _a !== void 0 ? _a : '').trim();
        const type = ((_b = value.type) !== null && _b !== void 0 ? _b : '').trim();
        const sort = ((_c = value.sort) !== null && _c !== void 0 ? _c : '').trim().toLowerCase();
        return { status: status || undefined, type: type || undefined, sort: ['latest', 'popular', 'alphabetical'].includes(sort) ? sort : undefined };
    }
    requestText(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield this.requestManager.schedule(App.createRequest({ url, method: 'GET', headers: this.headers(url) }), 2);
            }
            catch (error) {
                throw new Error(`Astral Manga network request failed for ${url}: ${String(error)}`);
            }
            if (response.status < 200 || response.status >= 300)
                throw new Error(`Astral Manga request failed for ${url}: HTTP ${response.status}${response.status === 403 ? ' (Cloudflare challenge)' : ''}`);
            if (typeof response.data !== 'string')
                throw new Error(`Astral Manga returned an empty response for ${url}`);
            if ((0, cloudflare_1.isCloudflareChallenge)(response.data))
                throw new Error(`Astral Manga Cloudflare challenge was returned for ${url}`);
            return response.data;
        });
    }
    headers(url) { return { referer: `${BASE_URL}/`, accept: /\.(?:jpg|jpeg|png|webp|avif)(?:[?#].*)?$/i.test(url) ? 'image/avif,image/webp,image/*,*/*;q=0.8' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'accept-language': 'fr-FR,fr;q=0.9', 'user-agent': 'Mozilla/5.0 Paperback/0.8 AstralManga' }; }
}
exports.AstralManga = AstralManga;

},{"../utils/cloudflare":63,"./AstralMangaParser":61,"./version":62,"@paperback/types":59}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstralMangaParser = void 0;
const readerError_1 = require("../utils/readerError");
const url_1 = require("../utils/url");
class AstralMangaParser {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    parseMangaList(html, page) {
        var _a, _b, _c, _d, _e, _f;
        const matches = Array.from(this.searchable(html).matchAll(/href=["'](?:https?:\/\/[^/]+)?\/manga\/([0-9a-f-]{20,})["']/gi));
        const seen = {};
        const results = [];
        for (let index = 0; index < matches.length; index++) {
            const current = matches[index];
            const mangaId = (_a = current === null || current === void 0 ? void 0 : current[1]) !== null && _a !== void 0 ? _a : '';
            if (!mangaId || seen[mangaId])
                continue;
            const currentIndex = (_b = current === null || current === void 0 ? void 0 : current.index) !== null && _b !== void 0 ? _b : 0;
            const block = this.searchable(html).slice(currentIndex, (_d = (_c = matches[index + 1]) === null || _c === void 0 ? void 0 : _c.index) !== null && _d !== void 0 ? _d : currentIndex + 8000);
            const title = this.clean(this.value(block, ['title', 'name']) || ((_e = /<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i.exec(block)) === null || _e === void 0 ? void 0 : _e[1]) || ((_f = /alt=["']([^"']+)["']/i.exec(block)) === null || _f === void 0 ? void 0 : _f[1]) || '');
            const image = this.firstImage(block);
            seen[mangaId] = true;
            results.push(App.createPartialSourceManga({ mangaId, title: title || mangaId, image }));
        }
        return App.createPagedResults({
            results,
            metadata: this.hasNextPage(html, page) ? { page: page + 1 } : undefined
        });
    }
    parseMangaDetails(mangaId, html) {
        var _a, _b, _c, _d;
        const text = this.searchable(html);
        const title = this.clean(((_a = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(text)) === null || _a === void 0 ? void 0 : _a[1]) || this.value(text, ['title', 'name']) || mangaId);
        const cover = this.firstImage(text, true);
        const description = this.clean(this.value(text, ['description', 'synopsis']) || ((_b = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i.exec(text)) === null || _b === void 0 ? void 0 : _b[1]) || '');
        const status = this.clean(this.value(text, ['status']) || ((_d = (_c = /\b(En cours|Termine|Terminé|En pause|Abandonne|Abandonné)\b/i.exec(this.clean(text))) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 'Unknown'));
        const genres = this.values(text, 'tags').concat(this.values(text, 'genres')).filter((value, index, all) => value && all.indexOf(value) === index);
        const author = this.clean(this.value(text, ['author', 'authors']) || 'Unknown');
        const artist = this.clean(this.value(text, ['artist', 'artists']) || 'Unknown');
        const year = this.value(text, ['year', 'publicationYear']);
        const type = this.value(text, ['type']);
        const additionalInfo = {};
        if (year)
            additionalInfo.Year = year;
        if (type)
            additionalInfo.Type = type;
        return App.createMangaInfo({
            image: cover,
            titles: [title],
            author,
            artist,
            desc: description,
            status,
            hentai: false,
            tags: genres.length ? [this.tagSection(genres)] : [],
            covers: cover ? [cover] : [],
            additionalInfo
        });
    }
    parseChapters(mangaId, html) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const text = this.searchable(html);
        const pattern = new RegExp(`href=["'](?:https?:\\/\\/[^/]+)?\\/manga\\/${this.escape(mangaId)}\\/chapter\\/([0-9a-f-]{20,})["']`, 'gi');
        const matches = Array.from(text.matchAll(pattern));
        const seen = {};
        const chapters = [];
        for (let index = 0; index < matches.length; index++) {
            const current = matches[index];
            const id = (_a = current === null || current === void 0 ? void 0 : current[1]) !== null && _a !== void 0 ? _a : '';
            if (!id || seen[id])
                continue;
            const currentIndex = (_b = current === null || current === void 0 ? void 0 : current.index) !== null && _b !== void 0 ? _b : 0;
            const block = text.slice(currentIndex, (_d = (_c = matches[index + 1]) === null || _c === void 0 ? void 0 : _c.index) !== null && _d !== void 0 ? _d : currentIndex + 1500);
            const name = this.clean((_f = (_e = /Chapitre\s*\d+(?:\.\d+)?(?:\s*[-–][^<"}]*)?/i.exec(this.clean(block))) === null || _e === void 0 ? void 0 : _e[0]) !== null && _f !== void 0 ? _f : this.value(block, ['title', 'name', 'number']));
            const chapNum = Number((_h = (_g = /\d+(?:\.\d+)?/.exec(name)) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : 0);
            seen[id] = true;
            chapters.push(App.createChapter({ id, chapNum, name: name || `Chapitre ${chapNum}`, langCode: 'fr', group: 'Astral Manga', sortingIndex: chapNum }));
        }
        return chapters.sort((left, right) => left.chapNum - right.chapNum);
    }
    parseChapterDetails(mangaId, chapterId, html) {
        var _a, _b, _c;
        const candidates = this.imageCandidates(this.searchable(html)).filter(url => !/logo|favicon|avatar|cover|banner|no_image|discord/i.test(url));
        const groups = {};
        for (const url of candidates) {
            const key = url.replace(/[?#].*$/, '').replace(/\/[^/]+$/, '/');
            if (!groups[key])
                groups[key] = [];
            if (!((_a = groups[key]) === null || _a === void 0 ? void 0 : _a.includes(url)))
                (_b = groups[key]) === null || _b === void 0 ? void 0 : _b.push(url);
        }
        const pages = (_c = Object.values(groups).sort((left, right) => right.length - left.length)[0]) !== null && _c !== void 0 ? _c : [];
        if (pages.length === 0)
            throw (0, readerError_1.createReaderError)('Astral Manga', mangaId, chapterId, html);
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }
    parseSearchTags(html) {
        const text = this.searchable(html);
        const values = [...this.values(text, 'allTags'), ...this.values(text, 'tags')]
            .filter((value, index, all) => value && all.indexOf(value) === index)
            .sort((left, right) => left.localeCompare(right));
        return [this.tagSection(values)];
    }
    buildCatalogueUrl(page, title = '', tags = [], parameters = {}) {
        const query = [];
        if (title.trim())
            query.push(['search', title.trim()]);
        if (tags.length)
            query.push(['tags', tags.map(tag => tag.id).join(',')]);
        if (parameters.status)
            query.push(['status', parameters.status]);
        if (parameters.type)
            query.push(['types', parameters.type]);
        if (parameters.sort)
            query.push(['sort', parameters.sort]);
        if (page > 1)
            query.push(['page', String(page)]);
        return this.url('/catalog', query);
    }
    buildSeriesUrl(mangaId) { return `${this.baseUrl}/manga/${encodeURIComponent(mangaId)}`; }
    buildChapterUrl(mangaId, chapterId) { return `${this.buildSeriesUrl(mangaId)}/chapter/${encodeURIComponent(chapterId)}`; }
    firstImage(text, preferCover = false) {
        var _a, _b;
        const images = this.imageCandidates(text).filter(url => !/logo|favicon|avatar|discord|no_image/i.test(url));
        return (_b = (_a = (preferCover ? images.find(url => /cover|thumbnail|manga/i.test(url)) : images[0])) !== null && _a !== void 0 ? _a : images[0]) !== null && _b !== void 0 ? _b : '';
    }
    imageCandidates(text) {
        var _a;
        const values = [];
        const patterns = [/(?:src|data-src)=["']([^"']+)["']/gi, /["']((?:https?:\\?\/\\?\/|\/)[^"']+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^"']*)?)["']/gi];
        for (const pattern of patterns)
            for (const match of text.matchAll(pattern)) {
                const url = (0, url_1.normalizeHttpUrl)(this.decode((_a = match[1]) !== null && _a !== void 0 ? _a : ''), this.baseUrl);
                if (this.isSupportedImageUrl(url) && !values.includes(url))
                    values.push(url);
            }
        return values;
    }
    isSupportedImageUrl(url) { return /\.(?:jpg|jpeg|png|webp|avif)(?:[?#].*)?$/i.test(url); }
    value(text, fields) {
        var _a, _b;
        for (const field of fields) {
            const match = new RegExp(`["']${this.escape(field)}["']\\s*:\\s*(?:["']((?:\\\\.|[^"'])*)["']|(-?\\d+(?:\\.\\d+)?))`, 'i').exec(text);
            if ((match === null || match === void 0 ? void 0 : match[1]) || (match === null || match === void 0 ? void 0 : match[2]))
                return this.clean((_b = (_a = match[1]) !== null && _a !== void 0 ? _a : match[2]) !== null && _b !== void 0 ? _b : '');
        }
        return '';
    }
    values(text, field) {
        var _a, _b;
        const raw = (_b = (_a = new RegExp(`["']${this.escape(field)}["']\\s*:\\s*\\[([^\\]]*)\\]`, 'i').exec(text)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
        return Array.from(raw.matchAll(/["']([^"']+)["']/g), match => { var _a; return this.clean((_a = match[1]) !== null && _a !== void 0 ? _a : ''); }).filter(Boolean);
    }
    tagSection(labels) {
        return App.createTagSection({ id: 'genres', label: 'Genres', tags: labels.map(label => App.createTag({ id: label, label })) });
    }
    hasNextPage(html, page) { return new RegExp(`[?&]page=${page + 1}\\b|"page":${page + 1}\\b`, 'i').test(html); }
    url(path, query) { const value = query.map(([key, item]) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`).join('&'); return `${this.baseUrl}${path}${value ? `?${value}` : ''}`; }
    searchable(value) { return this.decode(value).replace(/\\"/g, '"'); }
    clean(value) { return this.decode(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
    decode(value) { return value.replace(/\\\//g, '/').replace(/\\u([0-9a-f]{4})/gi, (_match, code) => String.fromCharCode(parseInt(code, 16))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#(?:39|8217);/g, "'").replace(/&nbsp;/g, ' '); }
    escape(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
}
exports.AstralMangaParser = AstralMangaParser;

},{"../utils/readerError":64,"../utils/url":65}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILD_VERSION = void 0;
// This file is generated by scripts/generate-version.js.
exports.BUILD_VERSION = '2026.11.22.23';

},{}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCloudflareChallenge = void 0;
function isCloudflareChallenge(html) {
    return /<title[^>]*>\s*(?:just a moment|un instant|attention required|v[ée]rification de s[ée]curit[ée])/i.test(html)
        || /(?:id|class)=["'][^"']*(?:challenge-running|cf-challenge-running)/i.test(html)
        || /window\._cf_chl_opt\s*=/i.test(html)
        || /\/cdn-cgi\/challenge-platform\/[^"']*\/orchestrate\//i.test(html);
}
exports.isCloudflareChallenge = isCloudflareChallenge;

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
