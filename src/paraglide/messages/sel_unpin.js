/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sel_UnpinInputs */

const zh_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`取消固定`)
};

const zh_tw2_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`取消固定`)
};

const en_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unpin card`)
};

const ja_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`固定を解除`)
};

const ko_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`고정 해제`)
};

const fr_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Détacher la carte`)
};

const de_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karte lösen`)
};

const es_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Desfijar tarjeta`)
};

const ru_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Открепить карточку`)
};

const pt_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Desafixar cartão`)
};

const it_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sgancia scheda`)
};

const ar_sel_unpin = /** @type {(inputs: Sel_UnpinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إلغاء تثبيت البطاقة`)
};

/**
* | output |
* | --- |
* | "Unpin card" |
*
* @param {Sel_UnpinInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const sel_unpin = /** @type {((inputs?: Sel_UnpinInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sel_UnpinInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_sel_unpin(inputs)
	if (locale === "zh-TW") return zh_tw2_sel_unpin(inputs)
	if (locale === "en") return en_sel_unpin(inputs)
	if (locale === "ja") return ja_sel_unpin(inputs)
	if (locale === "ko") return ko_sel_unpin(inputs)
	if (locale === "fr") return fr_sel_unpin(inputs)
	if (locale === "de") return de_sel_unpin(inputs)
	if (locale === "es") return es_sel_unpin(inputs)
	if (locale === "ru") return ru_sel_unpin(inputs)
	if (locale === "pt") return pt_sel_unpin(inputs)
	if (locale === "it") return it_sel_unpin(inputs)
	return ar_sel_unpin(inputs)
});