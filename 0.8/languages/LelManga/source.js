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
exports.LelManga = exports.LelMangaInfo = void 0;
const types_1 = require("@paperback/types");
const LelMangaParser_1 = require("./LelMangaParser");
const version_1 = require("./version");
const BASE_URL = 'https://www.lelmanga.com';
exports.LelMangaInfo = {
    name: 'LelManga',
    author: 'Paperback Community',
    description: 'French LelManga source with catalogue filters, metadata and public reader pages.',
    contentRating: types_1.ContentRating.MATURE,
    icon: 'icon.png',
    version: version_1.BUILD_VERSION,
    websiteBaseURL: BASE_URL,
    language: 'French',
    sourceTags: [
        { text: 'French', type: types_1.BadgeColor.BLUE },
        { text: 'Manga', type: types_1.BadgeColor.GREEN },
        { text: 'Manhwa', type: types_1.BadgeColor.GREY },
        { text: 'Manhua', type: types_1.BadgeColor.YELLOW }
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS
};
class LelManga {
    constructor() {
        this.parser = new LelMangaParser_1.LelMangaParser(BASE_URL);
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
    }
    getSearchResults(query, metadata) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const parameters = this.normalizeParameters(query.parameters);
            const html = yield this.requestText(this.parser.buildCatalogueUrl(page, query.includedTags, parameters, (_b = query.title) !== null && _b !== void 0 ? _b : ''));
            return this.parser.parseMangaList(html, page);
        });
    }
    getSearchTags() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.parser.parseSearchTags(yield this.requestText(this.parser.buildCatalogueUrl(1)));
        });
    }
    getSearchFields() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                App.createSearchField({ id: 'status', name: 'Statut', placeholder: 'ongoing, completed ou hiatus' }),
                App.createSearchField({ id: 'type', name: 'Type', placeholder: 'manga, manhwa, manhua ou comic' }),
                App.createSearchField({ id: 'order', name: 'Trier par', placeholder: 'update, latest, popular, title ou titlereverse' })
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
        return __awaiter(this, void 0, void 0, function* () {
            return this.parser.parseChapters(mangaId, yield this.requestText(this.parser.buildSeriesUrl(mangaId)));
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.parser.parseChapterDetails(mangaId, chapterId, yield this.requestText(this.parser.buildChapterUrl(chapterId)));
        });
    }
    getMangaShareUrl(mangaId) { return this.parser.buildSeriesUrl(mangaId); }
    getHomePageSections(sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = [
                this.section("latest_updates" /* LelMangaHomeSectionId.LatestUpdates */, 'Dernieres mises a jour'),
                this.section("popular" /* LelMangaHomeSectionId.Popular */, 'Populaires'),
                this.section("new_series" /* LelMangaHomeSectionId.NewSeries */, 'Nouvelles series')
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
                    console.log(`LelManga homepage section failed: ${section.id} ${String(error)}`);
                }
            })));
        });
    }
    getViewMoreItems(id, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const order = id === "popular" /* LelMangaHomeSectionId.Popular */ ? 'popular'
                : id === "new_series" /* LelMangaHomeSectionId.NewSeries */ ? 'latest' : 'update';
            const html = yield this.requestText(this.parser.buildCatalogueUrl(page, [], { order }));
            return this.parser.parseMangaList(html, page);
        });
    }
    section(id, title) {
        return App.createHomeSection({ id, title, type: types_1.HomeSectionType.singleRowNormal, items: [], containsMoreItems: true });
    }
    normalizeParameters(parameters) {
        var _a, _b, _c;
        const status = ((_a = parameters.status) !== null && _a !== void 0 ? _a : '').trim().toLowerCase();
        const type = ((_b = parameters.type) !== null && _b !== void 0 ? _b : '').trim().toLowerCase();
        const order = ((_c = parameters.order) !== null && _c !== void 0 ? _c : '').trim().toLowerCase();
        return {
            status: ['ongoing', 'completed', 'hiatus'].includes(status) ? status : undefined,
            type: ['manga', 'manhwa', 'manhua', 'comic'].includes(type) ? type : undefined,
            order: ['update', 'latest', 'popular', 'title', 'titlereverse'].includes(order) ? order : undefined
        };
    }
    requestText(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield this.requestManager.schedule(App.createRequest({ url, method: 'GET', headers: this.headers(url) }), 2);
            }
            catch (error) {
                throw new Error(`LelManga network request failed for ${url}: ${String(error)}`);
            }
            if (response.status < 200 || response.status >= 300)
                throw new Error(`LelManga request failed for ${url}: HTTP ${response.status}`);
            if (typeof response.data !== 'string')
                throw new Error(`LelManga returned an empty response for ${url}`);
            return response.data;
        });
    }
    headers(url) {
        return {
            referer: `${BASE_URL}/`,
            accept: /\.(?:jpg|jpeg|png|webp|gif)(?:[?#].*)?$/i.test(url) ? 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'
        };
    }
}
exports.LelManga = LelManga;

},{"./LelMangaParser":61,"./version":62,"@paperback/types":59}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LelMangaParser = void 0;
const readerError_1 = require("../utils/readerError");
const url_1 = require("../utils/url");
const date_1 = require("../utils/date");
class LelMangaParser {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    parseMangaList(html, page) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const results = [];
        const seen = {};
        const matches = [];
        const pattern = /<a[^>]+href=["'](?:https?:\/\/[^/]+)?\/(manga|manhwa|manhua|comic)\/([^/"'?#]+)\/?[^"']*["'][^>]*title=["']([^"']+)["'][^>]*>/gi;
        let match;
        while ((match = pattern.exec(html)) !== null) {
            matches.push({ type: (_a = match[1]) !== null && _a !== void 0 ? _a : '', slug: (_b = match[2]) !== null && _b !== void 0 ? _b : '', title: (_c = match[3]) !== null && _c !== void 0 ? _c : '', index: match.index });
        }
        for (let index = 0; index < matches.length; index++) {
            const current = matches[index];
            if (!current)
                continue;
            const mangaId = `${current.type}/${this.decodeText(current.slug)}`;
            if (seen[mangaId])
                continue;
            const block = html.slice(current.index, (_e = (_d = matches[index + 1]) === null || _d === void 0 ? void 0 : _d.index) !== null && _e !== void 0 ? _e : current.index + 5000);
            const imageValue = (_g = (_f = /<img[^>]+(?:data-src|src)=["']([^"']+)["']/i.exec(block)) === null || _f === void 0 ? void 0 : _f[1]) !== null && _g !== void 0 ? _g : '';
            const subtitle = this.cleanHtml((_j = (_h = /<div[^>]+class=["'][^"']*epxs[^"']*["'][^>]*>([\s\S]*?)<\/div>/i.exec(block)) === null || _h === void 0 ? void 0 : _h[1]) !== null && _j !== void 0 ? _j : '');
            seen[mangaId] = true;
            results.push(App.createPartialSourceManga({
                mangaId,
                title: this.cleanText(current.title),
                image: this.normalizeUrl(imageValue),
                subtitle: subtitle || undefined
            }));
        }
        return App.createPagedResults({
            results,
            metadata: this.hasNextPage(html, page) ? { page: page + 1 } : undefined
        });
    }
    parseSearchTags(html) {
        var _a, _b;
        const tags = [];
        const seen = {};
        const pattern = /<input[^>]+name=["']genre\[\]["'][^>]+value=["'](\d+)["'][^>]*>[\s\S]*?<label[^>]*>([\s\S]*?)<\/label>/gi;
        let match;
        while ((match = pattern.exec(html)) !== null) {
            const id = (_a = match[1]) !== null && _a !== void 0 ? _a : '';
            const label = this.cleanHtml((_b = match[2]) !== null && _b !== void 0 ? _b : '');
            if (!id || !label || seen[id])
                continue;
            seen[id] = true;
            tags.push(App.createTag({ id, label }));
        }
        return [App.createTagSection({ id: 'genres', label: 'Genres', tags })];
    }
    parseMangaDetails(mangaId, html) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const title = this.cleanHtml((_b = (_a = /<h1[^>]+class=["'][^"']*entry-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i.exec(html)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '') || this.titleFromId(mangaId);
        const coverValue = (_d = (_c = /<div[^>]+class=["'][^"']*thumb[^"']*["'][^>]*>[\s\S]*?<img[^>]+(?:data-src|src)=["']([^"']+)["']/i.exec(html)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : this.metaContent(html, 'og:image');
        const cover = this.normalizeUrl(coverValue);
        const description = this.cleanHtml((_f = (_e = /<div[^>]+class=["'][^"']*entry-content-single[^"']*["'][^>]*>([\s\S]*?)<\/div>/i.exec(html)) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : '');
        const status = this.infoValue(html, 'Statut') || 'Unknown';
        const type = this.infoValue(html, 'Type');
        const genres = this.parseGenres(html);
        const rating = Number((_g = /itemprop=["']ratingValue["'][^>]+content=["'](\d+(?:\.\d+)?)["']/i.exec(html)) === null || _g === void 0 ? void 0 : _g[1]);
        const followers = (_h = /class=["'][^"']*bmc[^"']*["'][^>]*>[\s\S]*?(\d[\d\s.,]*)\s+(?:people|personnes)/i.exec(html)) === null || _h === void 0 ? void 0 : _h[1];
        const alternative = this.cleanHtml((_k = (_j = /<div[^>]+class=["'][^"']*alter[^"']*["'][^>]*>([\s\S]*?)<\/div>/i.exec(html)) === null || _j === void 0 ? void 0 : _j[1]) !== null && _k !== void 0 ? _k : '');
        const titles = [title, ...alternative.split(/[;,|]/).map(value => value.trim()).filter(Boolean)];
        const additionalInfo = {};
        if (type)
            additionalInfo.Type = type;
        if (followers)
            additionalInfo.Followers = followers.trim();
        return App.createMangaInfo({
            image: cover,
            titles: Array.from(new Set(titles)),
            desc: description,
            status,
            hentai: false,
            rating: Number.isFinite(rating) ? rating : undefined,
            tags: genres.length > 0 ? [App.createTagSection({
                    id: 'genres',
                    label: 'Genres',
                    tags: genres.map(genre => App.createTag({ id: this.tagId(genre), label: genre }))
                })] : [],
            covers: cover ? [cover] : [],
            additionalInfo
        });
    }
    parseChapters(mangaId, html) {
        var _a, _b, _c, _d, _e, _f;
        const list = (_b = (_a = /<div[^>]+class=["'][^"']*eplister[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i.exec(html)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
        const chapters = [];
        const pattern = /<li[^>]+data-num=["']([^"']+)["'][^>]*>[\s\S]*?<a[^>]+href=["'](?:https?:\/\/[^/]+)?\/([^/"'?#]+)\/?["'][^>]*>[\s\S]*?<span[^>]+class=["'][^"']*chapternum[^"']*["'][^>]*>([\s\S]*?)<\/span>[\s\S]*?<span[^>]+class=["'][^"']*chapterdate[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi;
        let match;
        while ((match = pattern.exec(list)) !== null) {
            const chapNum = this.chapterNumber((_c = match[1]) !== null && _c !== void 0 ? _c : '');
            const time = this.parseDate(this.cleanHtml((_d = match[4]) !== null && _d !== void 0 ? _d : ''));
            chapters.push(App.createChapter(Object.assign(Object.assign({ id: this.decodeText((_e = match[2]) !== null && _e !== void 0 ? _e : ''), chapNum, name: this.cleanHtml((_f = match[3]) !== null && _f !== void 0 ? _f : '') || `Chapitre ${match[1]}`, langCode: 'fr', group: 'LelManga' }, (time ? { time } : {})), { sortingIndex: chapNum })));
        }
        return chapters.sort((left, right) => left.chapNum - right.chapNum);
    }
    parseChapterDetails(mangaId, chapterId, html) {
        var _a, _b, _c;
        const reader = (_b = (_a = /<div[^>]+id=["']readerarea["'][^>]*>([\s\S]*?)<\/div>\s*(?:<div|<script|<\/)/i.exec(html)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : html;
        const pages = [];
        const seen = {};
        const pattern = /(?:data-src|src)=["']([^"']+)["']/gi;
        let match;
        while ((match = pattern.exec(reader)) !== null) {
            const url = this.normalizeUrl((_c = match[1]) !== null && _c !== void 0 ? _c : '');
            if (!/\/wp-content\/uploads\//i.test(url) || seen[url])
                continue;
            seen[url] = true;
            pages.push(url);
        }
        if (pages.length === 0)
            throw (0, readerError_1.createReaderError)('LelManga', mangaId, chapterId, html);
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }
    buildCatalogueUrl(page, tags = [], parameters = {}, title = '') {
        const query = [];
        if (title.trim())
            query.push(['s', title.trim()]);
        for (const tag of tags)
            query.push(['genre[]', tag.id]);
        if (parameters.status)
            query.push(['status', parameters.status]);
        if (parameters.type)
            query.push(['type', parameters.type]);
        if (parameters.order)
            query.push(['order', parameters.order]);
        if (page > 1)
            query.push(['page', String(page)]);
        const encoded = query.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
        return `${this.baseUrl}/manga${encoded ? `?${encoded}` : ''}`;
    }
    buildSeriesUrl(mangaId) {
        return `${this.baseUrl}/${mangaId.split('/').map(encodeURIComponent).join('/')}`;
    }
    buildChapterUrl(chapterId) {
        return `${this.baseUrl}/${encodeURIComponent(chapterId)}`;
    }
    normalizeUrl(value) {
        return (0, url_1.normalizeHttpUrl)(this.decodeText(value).trim(), this.baseUrl);
    }
    parseGenres(html) {
        var _a, _b;
        const block = (_b = (_a = /<span[^>]+class=["'][^"']*mgen[^"']*["'][^>]*>([\s\S]*?)<\/span>/i.exec(html)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
        return Array.from(block.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi), match => { var _a; return this.cleanHtml((_a = match[1]) !== null && _a !== void 0 ? _a : ''); }).filter(Boolean);
    }
    infoValue(html, label) {
        var _a, _b;
        const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const value = (_b = (_a = new RegExp(`<div[^>]+class=["'][^"']*imptdt[^"']*["'][^>]*>\\s*${escaped}\\s*([\\s\\S]*?)<\\/div>`, 'i').exec(html)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
        return this.cleanHtml(value);
    }
    metaContent(html, property) {
        var _a, _b;
        const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return this.decodeText((_b = (_a = new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i').exec(html)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '');
    }
    hasNextPage(html, page) {
        return new RegExp(`[?&]page=${page + 1}(?:["'&]|$)`, 'i').test(html);
    }
    chapterNumber(value) {
        const number = Number(value.replace(',', '.'));
        return Number.isFinite(number) ? number : 0;
    }
    parseDate(value) {
        return (0, date_1.parseDateOrUndefined)(value);
    }
    cleanHtml(value) {
        return this.cleanText(value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''));
    }
    cleanText(value) {
        return this.decodeText(value).replace(/\s+/g, ' ').trim();
    }
    decodeText(value) {
        return value
            .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCharCode(parseInt(code, 16)))
            .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(parseInt(code, 10)))
            .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;|&#8217;|&rsquo;/g, "'")
            .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }
    tagId(label) {
        return label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    titleFromId(mangaId) {
        var _a, _b;
        return (_b = (_a = mangaId.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')) !== null && _b !== void 0 ? _b : mangaId;
    }
}
exports.LelMangaParser = LelMangaParser;

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
