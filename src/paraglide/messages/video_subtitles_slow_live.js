/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Slow_LiveInputs */

const zh_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕翻译跟不上播放，建议尝试更快的翻译引擎。`)
};

const zh_tw2_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕翻譯跟不上播放，建議嘗試更快的翻譯引擎。`)
};

const en_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subtitle translation is falling behind. Try a faster translation engine.`)
};

const ja_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕の翻訳が再生に追いついていません。より速い翻訳エンジンをお試しください。`)
};

const ko_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막 번역이 재생을 따라가지 못합니다. 더 빠른 번역 엔진을 사용해 보세요.`)
};

const fr_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduction des sous-titres prend du retard. Essayez un moteur de traduction plus rapide.`)
};

const de_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die Untertitelübersetzung kommt nicht mit. Versuchen Sie eine schnellere Übersetzungsengine.`)
};

const es_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traducción de subtítulos se está retrasando. Prueba un motor de traducción más rápido.`)
};

const ru_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод субтитров отстаёт. Попробуйте более быстрый движок перевода.`)
};

const pt_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A tradução das legendas está atrasada. Experimente um motor de tradução mais rápido.`)
};

const it_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduzione dei sottotitoli è in ritardo. Prova un motore di traduzione più veloce.`)
};

const ar_video_subtitles_slow_live = /** @type {(inputs: Video_Subtitles_Slow_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تتأخر ترجمة النصوص المصاحبة عن التشغيل. جرّب محرك ترجمة أسرع.`)
};

/**
* | output |
* | --- |
* | "Subtitle translation is falling behind. Try a faster translation engine." |
*
* @param {Video_Subtitles_Slow_LiveInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_slow_live = /** @type {((inputs?: Video_Subtitles_Slow_LiveInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Slow_LiveInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_slow_live(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_slow_live(inputs)
	if (locale === "en") return en_video_subtitles_slow_live(inputs)
	if (locale === "ja") return ja_video_subtitles_slow_live(inputs)
	if (locale === "ko") return ko_video_subtitles_slow_live(inputs)
	if (locale === "fr") return fr_video_subtitles_slow_live(inputs)
	if (locale === "de") return de_video_subtitles_slow_live(inputs)
	if (locale === "es") return es_video_subtitles_slow_live(inputs)
	if (locale === "ru") return ru_video_subtitles_slow_live(inputs)
	if (locale === "pt") return pt_video_subtitles_slow_live(inputs)
	if (locale === "it") return it_video_subtitles_slow_live(inputs)
	return ar_video_subtitles_slow_live(inputs)
});