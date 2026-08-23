/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_SaveInputs */

const zh_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`保存`)
};

const zh_tw2_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`儲存`)
};

const en_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save`)
};

const ja_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`保存`)
};

const ko_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`저장`)
};

const fr_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer`)
};

const de_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Speichern`)
};

const es_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Guardar`)
};

const ru_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сохранить`)
};

const pt_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Guardar`)
};

const it_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Salva`)
};

const ar_styles_save = /** @type {(inputs: Styles_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حفظ`)
};

/**
* | output |
* | --- |
* | "Save" |
*
* @param {Styles_SaveInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_save = /** @type {((inputs?: Styles_SaveInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_SaveInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_save(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_save(inputs)
	if (locale === "en") return en_styles_save(inputs)
	if (locale === "ja") return ja_styles_save(inputs)
	if (locale === "ko") return ko_styles_save(inputs)
	if (locale === "fr") return fr_styles_save(inputs)
	if (locale === "de") return de_styles_save(inputs)
	if (locale === "es") return es_styles_save(inputs)
	if (locale === "ru") return ru_styles_save(inputs)
	if (locale === "pt") return pt_styles_save(inputs)
	if (locale === "it") return it_styles_save(inputs)
	return ar_styles_save(inputs)
});