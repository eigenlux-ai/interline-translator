/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Clear_DescInputs */

const zh_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`仅清除字幕译文，保留网页翻译缓存。`)
};

const zh_tw2_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`僅清除字幕譯文，保留網頁翻譯快取。`)
};

const en_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only subtitle translations are cleared. Web-page translations stay available.`)
};

const ja_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕翻訳のみ削除します。ウェブページの翻訳は保持されます。`)
};

const ko_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막 번역만 삭제합니다. 웹페이지 번역은 유지됩니다.`)
};

const fr_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Seules les traductions des sous-titres sont effacées. Celles des pages web sont conservées.`)
};

const de_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nur Untertitelübersetzungen werden gelöscht. Webseitenübersetzungen bleiben erhalten.`)
};

const es_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solo se borran las traducciones de subtítulos. Se conservan las traducciones web.`)
};

const ru_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Удаляются только переводы субтитров. Переводы веб-страниц сохраняются.`)
};

const pt_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apenas as traduções de legendas são eliminadas. As traduções web são mantidas.`)
};

const it_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vengono cancellate solo le traduzioni dei sottotitoli. Le traduzioni web vengono conservate.`)
};

const ar_video_subtitles_clear_desc = /** @type {(inputs: Video_Subtitles_Clear_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُمسح ترجمات الفيديو فقط. تبقى ترجمات صفحات الويب متاحة.`)
};

/**
* | output |
* | --- |
* | "Only subtitle translations are cleared. Web-page translations stay available." |
*
* @param {Video_Subtitles_Clear_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_clear_desc = /** @type {((inputs?: Video_Subtitles_Clear_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Clear_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_clear_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_clear_desc(inputs)
	if (locale === "en") return en_video_subtitles_clear_desc(inputs)
	if (locale === "ja") return ja_video_subtitles_clear_desc(inputs)
	if (locale === "ko") return ko_video_subtitles_clear_desc(inputs)
	if (locale === "fr") return fr_video_subtitles_clear_desc(inputs)
	if (locale === "de") return de_video_subtitles_clear_desc(inputs)
	if (locale === "es") return es_video_subtitles_clear_desc(inputs)
	if (locale === "ru") return ru_video_subtitles_clear_desc(inputs)
	if (locale === "pt") return pt_video_subtitles_clear_desc(inputs)
	if (locale === "it") return it_video_subtitles_clear_desc(inputs)
	return ar_video_subtitles_clear_desc(inputs)
});