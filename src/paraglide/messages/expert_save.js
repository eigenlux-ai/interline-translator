/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expert_SaveInputs */

const zh_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`保存专家模板`)
};

const zh_tw2_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`儲存專家模板`)
};

const en_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save expert templates`)
};

const ja_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`テンプレートを保存`)
};

const ko_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`템플릿 저장`)
};

const fr_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer les modèles`)
};

const de_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vorlagen speichern`)
};

const es_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Guardar plantillas`)
};

const ru_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сохранить шаблоны`)
};

const pt_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Guardar modelos`)
};

const it_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Salva template`)
};

const ar_expert_save = /** @type {(inputs: Expert_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حفظ القوالب`)
};

/**
* | output |
* | --- |
* | "Save expert templates" |
*
* @param {Expert_SaveInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_save = /** @type {((inputs?: Expert_SaveInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_SaveInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_save(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_save(inputs)
	if (locale === "en") return en_expert_save(inputs)
	if (locale === "ja") return ja_expert_save(inputs)
	if (locale === "ko") return ko_expert_save(inputs)
	if (locale === "fr") return fr_expert_save(inputs)
	if (locale === "de") return de_expert_save(inputs)
	if (locale === "es") return es_expert_save(inputs)
	if (locale === "ru") return ru_expert_save(inputs)
	if (locale === "pt") return pt_expert_save(inputs)
	if (locale === "it") return it_expert_save(inputs)
	return ar_expert_save(inputs)
});