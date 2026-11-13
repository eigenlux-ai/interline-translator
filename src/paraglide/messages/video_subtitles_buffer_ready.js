/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Buffer_ReadyInputs */

const zh_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`接下来的译文已准备好。`)
};

const zh_tw2_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`接下來的譯文已準備好。`)
};

const en_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Upcoming translations are ready.`)
};

const ja_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`次の字幕の翻訳が準備できました。`)
};

const ko_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`다음 자막 번역이 준비되었습니다.`)
};

const fr_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les prochaines traductions sont prêtes.`)
};

const de_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die nächsten Übersetzungen sind bereit.`)
};

const es_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Las siguientes traducciones están listas.`)
};

const ru_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Следующие переводы готовы.`)
};

const pt_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`As próximas traduções estão prontas.`)
};

const it_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le prossime traduzioni sono pronte.`)
};

const ar_video_subtitles_buffer_ready = /** @type {(inputs: Video_Subtitles_Buffer_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترجمات التالية جاهزة.`)
};

/**
* | output |
* | --- |
* | "Upcoming translations are ready." |
*
* @param {Video_Subtitles_Buffer_ReadyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_buffer_ready = /** @type {((inputs?: Video_Subtitles_Buffer_ReadyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Buffer_ReadyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_buffer_ready(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_buffer_ready(inputs)
	if (locale === "en") return en_video_subtitles_buffer_ready(inputs)
	if (locale === "ja") return ja_video_subtitles_buffer_ready(inputs)
	if (locale === "ko") return ko_video_subtitles_buffer_ready(inputs)
	if (locale === "fr") return fr_video_subtitles_buffer_ready(inputs)
	if (locale === "de") return de_video_subtitles_buffer_ready(inputs)
	if (locale === "es") return es_video_subtitles_buffer_ready(inputs)
	if (locale === "ru") return ru_video_subtitles_buffer_ready(inputs)
	if (locale === "pt") return pt_video_subtitles_buffer_ready(inputs)
	if (locale === "it") return it_video_subtitles_buffer_ready(inputs)
	return ar_video_subtitles_buffer_ready(inputs)
});