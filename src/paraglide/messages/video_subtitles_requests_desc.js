/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Requests_DescInputs */

const zh_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`并发是同时执行的请求数，速率是每秒启动数。同页字幕优先于网页翻译。`)
};

const zh_tw2_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`並行數是同時執行的請求數，速率是每秒啟動數。同頁字幕優先於網頁翻譯。`)
};

const en_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Concurrency counts simultaneous requests; rate counts starts per second. Subtitles take priority over page translation on the same page.`)
};

const ja_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`同時数は実行中のリクエスト数、頻度は毎秒の開始数です。同じページでは字幕翻訳が優先されます。`)
};

const ko_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`동시 요청 수와 초당 시작 수를 별도로 제한합니다. 같은 페이지에서는 자막 번역을 우선합니다.`)
};

const fr_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La simultanéité limite les requêtes en cours ; le débit limite les démarrages par seconde. Les sous-titres sont prioritaires sur la même page.`)
};

const de_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Parallelität begrenzt laufende Anfragen; die Rate begrenzt Starts pro Sekunde. Untertitel haben auf derselben Seite Vorrang.`)
};

const es_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La concurrencia limita solicitudes simultáneas; la tasa limita inicios por segundo. Los subtítulos tienen prioridad en la misma página.`)
};

const ru_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Параллельность ограничивает одновременные запросы; частота — запуски в секунду. Субтитры имеют приоритет на той же странице.`)
};

const pt_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A concorrência limita pedidos simultâneos; a taxa limita inícios por segundo. As legendas têm prioridade na mesma página.`)
};

const it_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La concorrenza limita le richieste simultanee; la frequenza limita gli avvii al secondo. I sottotitoli hanno priorità nella stessa pagina.`)
};

const ar_video_subtitles_requests_desc = /** @type {(inputs: Video_Subtitles_Requests_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التزامن يحدد الطلبات الجارية؛ والمعدل يحدد مرات البدء في الثانية. لترجمة الفيديو أولوية في الصفحة نفسها.`)
};

/**
* | output |
* | --- |
* | "Concurrency counts simultaneous requests; rate counts starts per second. Subtitles take priority over page translation on the same page." |
*
* @param {Video_Subtitles_Requests_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_requests_desc = /** @type {((inputs?: Video_Subtitles_Requests_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Requests_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_requests_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_requests_desc(inputs)
	if (locale === "en") return en_video_subtitles_requests_desc(inputs)
	if (locale === "ja") return ja_video_subtitles_requests_desc(inputs)
	if (locale === "ko") return ko_video_subtitles_requests_desc(inputs)
	if (locale === "fr") return fr_video_subtitles_requests_desc(inputs)
	if (locale === "de") return de_video_subtitles_requests_desc(inputs)
	if (locale === "es") return es_video_subtitles_requests_desc(inputs)
	if (locale === "ru") return ru_video_subtitles_requests_desc(inputs)
	if (locale === "pt") return pt_video_subtitles_requests_desc(inputs)
	if (locale === "it") return it_video_subtitles_requests_desc(inputs)
	return ar_video_subtitles_requests_desc(inputs)
});