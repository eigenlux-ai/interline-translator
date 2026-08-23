/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expert_SavedInputs */

const zh_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已保存`)
};

const zh_tw2_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已儲存`)
};

const en_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saved`)
};

const ja_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`保存しました`)
};

const ko_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`저장됨`)
};

const fr_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistré`)
};

const de_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gespeichert`)
};

const es_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Guardado`)
};

const ru_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сохранено`)
};

const pt_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Guardado`)
};

const it_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Salvato`)
};

const ar_expert_saved = /** @type {(inputs: Expert_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم الحفظ`)
};

/**
* | output |
* | --- |
* | "Saved" |
*
* @param {Expert_SavedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_saved = /** @type {((inputs?: Expert_SavedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_SavedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_saved(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_saved(inputs)
	if (locale === "en") return en_expert_saved(inputs)
	if (locale === "ja") return ja_expert_saved(inputs)
	if (locale === "ko") return ko_expert_saved(inputs)
	if (locale === "fr") return fr_expert_saved(inputs)
	if (locale === "de") return de_expert_saved(inputs)
	if (locale === "es") return es_expert_saved(inputs)
	if (locale === "ru") return ru_expert_saved(inputs)
	if (locale === "pt") return pt_expert_saved(inputs)
	if (locale === "it") return it_expert_saved(inputs)
	return ar_expert_saved(inputs)
});