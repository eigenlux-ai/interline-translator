/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Operation_FailedInputs */

const zh_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`保存失败，请重试。`)
};

const zh_tw2_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`儲存失敗，請重試。`)
};

const en_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The change could not be saved. Please retry.`)
};

const ja_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`保存できませんでした。再試行してください。`)
};

const ko_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`저장하지 못했습니다. 다시 시도하세요.`)
};

const fr_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrement impossible. Réessayez.`)
};

const de_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Speichern fehlgeschlagen. Bitte erneut versuchen.`)
};

const es_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No se pudo guardar. Inténtalo de nuevo.`)
};

const ru_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось сохранить. Повторите попытку.`)
};

const pt_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Não foi possível guardar. Tente novamente.`)
};

const it_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Salvataggio non riuscito. Riprova.`)
};

const ar_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذر الحفظ. حاول مجددًا.`)
};

/**
* | output |
* | --- |
* | "The change could not be saved. Please retry." |
*
* @param {Video_Subtitles_Operation_FailedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_operation_failed = /** @type {((inputs?: Video_Subtitles_Operation_FailedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Operation_FailedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_operation_failed(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_operation_failed(inputs)
	if (locale === "en") return en_video_subtitles_operation_failed(inputs)
	if (locale === "ja") return ja_video_subtitles_operation_failed(inputs)
	if (locale === "ko") return ko_video_subtitles_operation_failed(inputs)
	if (locale === "fr") return fr_video_subtitles_operation_failed(inputs)
	if (locale === "de") return de_video_subtitles_operation_failed(inputs)
	if (locale === "es") return es_video_subtitles_operation_failed(inputs)
	if (locale === "ru") return ru_video_subtitles_operation_failed(inputs)
	if (locale === "pt") return pt_video_subtitles_operation_failed(inputs)
	if (locale === "it") return it_video_subtitles_operation_failed(inputs)
	return ar_video_subtitles_operation_failed(inputs)
});