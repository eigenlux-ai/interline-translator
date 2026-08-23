/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_CancelInputs */

const zh_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`取消`)
};

const zh_tw2_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`取消`)
};

const en_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancel`)
};

const ja_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`キャンセル`)
};

const ko_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`취소`)
};

const fr_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annuler`)
};

const de_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abbrechen`)
};

const es_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancelar`)
};

const ru_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отмена`)
};

const pt_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancelar`)
};

const it_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annulla`)
};

const ar_styles_cancel = /** @type {(inputs: Styles_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إلغاء`)
};

/**
* | output |
* | --- |
* | "Cancel" |
*
* @param {Styles_CancelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_cancel = /** @type {((inputs?: Styles_CancelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_CancelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_cancel(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_cancel(inputs)
	if (locale === "en") return en_styles_cancel(inputs)
	if (locale === "ja") return ja_styles_cancel(inputs)
	if (locale === "ko") return ko_styles_cancel(inputs)
	if (locale === "fr") return fr_styles_cancel(inputs)
	if (locale === "de") return de_styles_cancel(inputs)
	if (locale === "es") return es_styles_cancel(inputs)
	if (locale === "ru") return ru_styles_cancel(inputs)
	if (locale === "pt") return pt_styles_cancel(inputs)
	if (locale === "it") return it_styles_cancel(inputs)
	return ar_styles_cancel(inputs)
});