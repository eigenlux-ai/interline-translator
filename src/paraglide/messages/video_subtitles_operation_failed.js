/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Operation_FailedInputs */

const zh_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`操作失败，请重试。`)
};

const zh_tw2_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`操作失敗，請重試。`)
};

const en_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The operation failed. Please try again.`)
};

const ja_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`操作に失敗しました。もう一度お試しください。`)
};

const ko_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`작업에 실패했습니다. 다시 시도하세요.`)
};

const fr_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L’opération a échoué. Réessayez.`)
};

const de_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Der Vorgang ist fehlgeschlagen. Bitte erneut versuchen.`)
};

const es_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La operación ha fallado. Inténtalo de nuevo.`)
};

const ru_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось выполнить операцию. Повторите попытку.`)
};

const pt_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A operação falhou. Tente novamente.`)
};

const it_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Operazione non riuscita. Riprova.`)
};

const ar_video_subtitles_operation_failed = /** @type {(inputs: Video_Subtitles_Operation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فشلت العملية. حاول مجددًا.`)
};

/**
* | output |
* | --- |
* | "The operation failed. Please try again." |
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