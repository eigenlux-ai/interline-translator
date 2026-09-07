/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ball_Action_RestoreInputs */

const zh_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`还原原文`)
};

const zh_tw2_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`還原原文`)
};

const en_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restore original`)
};

const ja_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原文に戻す`)
};

const ko_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`원문 복원`)
};

const fr_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rétablir l’original`)
};

const de_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Original wiederherstellen`)
};

const es_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restaurar el original`)
};

const ru_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Вернуть оригинал`)
};

const pt_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restaurar o original`)
};

const it_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ripristina l’originale`)
};

const ar_ball_action_restore = /** @type {(inputs: Ball_Action_RestoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استعادة النص الأصلي`)
};

/**
* | output |
* | --- |
* | "Restore original" |
*
* @param {Ball_Action_RestoreInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const ball_action_restore = /** @type {((inputs?: Ball_Action_RestoreInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ball_Action_RestoreInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_ball_action_restore(inputs)
	if (locale === "zh-TW") return zh_tw2_ball_action_restore(inputs)
	if (locale === "en") return en_ball_action_restore(inputs)
	if (locale === "ja") return ja_ball_action_restore(inputs)
	if (locale === "ko") return ko_ball_action_restore(inputs)
	if (locale === "fr") return fr_ball_action_restore(inputs)
	if (locale === "de") return de_ball_action_restore(inputs)
	if (locale === "es") return es_ball_action_restore(inputs)
	if (locale === "ru") return ru_ball_action_restore(inputs)
	if (locale === "pt") return pt_ball_action_restore(inputs)
	if (locale === "it") return it_ball_action_restore(inputs)
	return ar_ball_action_restore(inputs)
});