/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_DescriptionInputs */

const zh_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`独立翻译 YouTube 字幕，默认不自动开启。`)
};

const zh_tw2_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`獨立翻譯 YouTube 字幕，預設不自動開啟。`)
};

const en_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translate YouTube subtitles independently from web pages. Automatic translation is off by default.`)
};

const ja_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`YouTube の字幕をウェブページとは独立して翻訳します。自動翻訳は初期設定でオフです。`)
};

const ko_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`웹페이지와 별도로 YouTube 자막을 번역합니다. 자동 번역은 기본적으로 꺼져 있습니다.`)
};

const fr_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduisez les sous-titres YouTube indépendamment des pages web. La traduction automatique est désactivée par défaut.`)
};

const de_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`YouTube-Untertitel unabhängig von Webseiten übersetzen. Automatische Übersetzung ist standardmäßig aus.`)
};

const es_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduce subtítulos de YouTube de forma independiente. La traducción automática está desactivada por defecto.`)
};

const ru_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Переводите субтитры YouTube отдельно от веб-страниц. Автоперевод по умолчанию выключен.`)
};

const pt_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduza legendas do YouTube separadamente das páginas web. A tradução automática está desativada por predefinição.`)
};

const it_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduci i sottotitoli YouTube separatamente dalle pagine web. La traduzione automatica è disattivata per impostazione predefinita.`)
};

const ar_video_subtitles_description = /** @type {(inputs: Video_Subtitles_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجم ترجمات YouTube بشكل مستقل عن صفحات الويب. الترجمة التلقائية معطلة افتراضيًا.`)
};

/**
* | output |
* | --- |
* | "Translate YouTube subtitles independently from web pages. Automatic translation is off by default." |
*
* @param {Video_Subtitles_DescriptionInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_description = /** @type {((inputs?: Video_Subtitles_DescriptionInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_DescriptionInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_description(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_description(inputs)
	if (locale === "en") return en_video_subtitles_description(inputs)
	if (locale === "ja") return ja_video_subtitles_description(inputs)
	if (locale === "ko") return ko_video_subtitles_description(inputs)
	if (locale === "fr") return fr_video_subtitles_description(inputs)
	if (locale === "de") return de_video_subtitles_description(inputs)
	if (locale === "es") return es_video_subtitles_description(inputs)
	if (locale === "ru") return ru_video_subtitles_description(inputs)
	if (locale === "pt") return pt_video_subtitles_description(inputs)
	if (locale === "it") return it_video_subtitles_description(inputs)
	return ar_video_subtitles_description(inputs)
});