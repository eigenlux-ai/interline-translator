/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sel_PinInputs */

const zh_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`固定卡片`)
};

const zh_tw2_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`固定卡片`)
};

const en_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pin card`)
};

const ja_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`カードを固定`)
};

const ko_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`카드 고정`)
};

const fr_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Épingler la carte`)
};

const de_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karte anheften`)
};

const es_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fijar tarjeta`)
};

const ru_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Закрепить карточку`)
};

const pt_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixar cartão`)
};

const it_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fissa scheda`)
};

const ar_sel_pin = /** @type {(inputs: Sel_PinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تثبيت البطاقة`)
};

/**
* | output |
* | --- |
* | "Pin card" |
*
* @param {Sel_PinInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const sel_pin = /** @type {((inputs?: Sel_PinInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sel_PinInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_sel_pin(inputs)
	if (locale === "zh-TW") return zh_tw2_sel_pin(inputs)
	if (locale === "en") return en_sel_pin(inputs)
	if (locale === "ja") return ja_sel_pin(inputs)
	if (locale === "ko") return ko_sel_pin(inputs)
	if (locale === "fr") return fr_sel_pin(inputs)
	if (locale === "de") return de_sel_pin(inputs)
	if (locale === "es") return es_sel_pin(inputs)
	if (locale === "ru") return ru_sel_pin(inputs)
	if (locale === "pt") return pt_sel_pin(inputs)
	if (locale === "it") return it_sel_pin(inputs)
	return ar_sel_pin(inputs)
});