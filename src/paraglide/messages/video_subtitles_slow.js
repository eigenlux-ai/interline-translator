/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_SlowInputs */

const zh_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕翻译跟不上播放，是否暂停并缓冲译文？`)
};

const zh_tw2_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕翻譯跟不上播放，是否暫停並緩衝譯文？`)
};

const en_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subtitle translation is falling behind. Pause to prepare upcoming translations?`)
};

const ja_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕の翻訳が再生に追いついていません。一時停止して翻訳を準備しますか？`)
};

const ko_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막 번역이 재생을 따라가지 못합니다. 일시 정지하고 번역을 준비할까요?`)
};

const fr_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduction des sous-titres prend du retard. Mettre en pause pour préparer la suite ?`)
};

const de_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die Untertitelübersetzung kommt nicht mit. Pausieren, um weitere Übersetzungen vorzubereiten?`)
};

const es_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traducción de subtítulos se está retrasando. ¿Pausar para preparar las siguientes traducciones?`)
};

const ru_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод субтитров отстаёт. Приостановить видео, чтобы подготовить следующие переводы?`)
};

const pt_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A tradução das legendas está atrasada. Pausar para preparar as próximas traduções?`)
};

const it_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduzione dei sottotitoli è in ritardo. Mettere in pausa per preparare le prossime traduzioni?`)
};

const ar_video_subtitles_slow = /** @type {(inputs: Video_Subtitles_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة الترجمة النصية متأخرة عن التشغيل. هل تريد الإيقاف مؤقتًا لتحضير الترجمات التالية؟`)
};

/**
* | output |
* | --- |
* | "Subtitle translation is falling behind. Pause to prepare upcoming translations?" |
*
* @param {Video_Subtitles_SlowInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_slow = /** @type {((inputs?: Video_Subtitles_SlowInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_SlowInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_slow(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_slow(inputs)
	if (locale === "en") return en_video_subtitles_slow(inputs)
	if (locale === "ja") return ja_video_subtitles_slow(inputs)
	if (locale === "ko") return ko_video_subtitles_slow(inputs)
	if (locale === "fr") return fr_video_subtitles_slow(inputs)
	if (locale === "de") return de_video_subtitles_slow(inputs)
	if (locale === "es") return es_video_subtitles_slow(inputs)
	if (locale === "ru") return ru_video_subtitles_slow(inputs)
	if (locale === "pt") return pt_video_subtitles_slow(inputs)
	if (locale === "it") return it_video_subtitles_slow(inputs)
	return ar_video_subtitles_slow(inputs)
});