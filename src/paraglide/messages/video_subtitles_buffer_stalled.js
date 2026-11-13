/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Buffer_StalledInputs */

const zh_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译缓冲较慢，可以继续播放或更换引擎。`)
};

const zh_tw2_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯緩衝較慢，可以繼續播放或更換引擎。`)
};

const en_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation buffering is taking longer. You can continue playing or change engines.`)
};

const ja_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳の準備に時間がかかっています。再生を続けるか、エンジンを変更できます。`)
};

const ko_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 준비가 오래 걸립니다. 계속 재생하거나 엔진을 변경할 수 있습니다.`)
};

const fr_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La préparation prend du temps. Vous pouvez reprendre la lecture ou changer de moteur.`)
};

const de_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die Vorbereitung dauert länger. Sie können weiterschauen oder die Engine wechseln.`)
};

const es_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La preparación está tardando. Puedes seguir reproduciendo o cambiar de motor.`)
};

const ru_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Подготовка перевода затягивается. Можно продолжить воспроизведение или сменить движок.`)
};

const pt_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A preparação está demorando. Você pode continuar a reprodução ou trocar o mecanismo.`)
};

const it_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La preparazione richiede più tempo. Puoi continuare la riproduzione o cambiare motore.`)
};

const ar_video_subtitles_buffer_stalled = /** @type {(inputs: Video_Subtitles_Buffer_StalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يستغرق تحضير الترجمة وقتًا أطول. يمكنك متابعة التشغيل أو تغيير المحرك.`)
};

/**
* | output |
* | --- |
* | "Translation buffering is taking longer. You can continue playing or change engines." |
*
* @param {Video_Subtitles_Buffer_StalledInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_buffer_stalled = /** @type {((inputs?: Video_Subtitles_Buffer_StalledInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Buffer_StalledInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_buffer_stalled(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_buffer_stalled(inputs)
	if (locale === "en") return en_video_subtitles_buffer_stalled(inputs)
	if (locale === "ja") return ja_video_subtitles_buffer_stalled(inputs)
	if (locale === "ko") return ko_video_subtitles_buffer_stalled(inputs)
	if (locale === "fr") return fr_video_subtitles_buffer_stalled(inputs)
	if (locale === "de") return de_video_subtitles_buffer_stalled(inputs)
	if (locale === "es") return es_video_subtitles_buffer_stalled(inputs)
	if (locale === "ru") return ru_video_subtitles_buffer_stalled(inputs)
	if (locale === "pt") return pt_video_subtitles_buffer_stalled(inputs)
	if (locale === "it") return it_video_subtitles_buffer_stalled(inputs)
	return ar_video_subtitles_buffer_stalled(inputs)
});