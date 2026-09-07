/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Set_Enabled_AriaInputs */

const zh_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`启用该术语集`)
};

const zh_tw2_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`啟用該術語集`)
};

const en_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable this set`)
};

const ja_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`この用語集を有効化`)
};

const ko_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 용어집 사용`)
};

const fr_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activer ce glossaire`)
};

const de_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dieses Glossar aktivieren`)
};

const es_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activar este glosario`)
};

const ru_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Включить этот набор`)
};

const pt_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ativar este glossário`)
};

const it_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attiva questo glossario`)
};

const ar_glossary_set_enabled_aria = /** @type {(inputs: Glossary_Set_Enabled_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تفعيل هذه المجموعة`)
};

/**
* | output |
* | --- |
* | "Enable this set" |
*
* @param {Glossary_Set_Enabled_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_set_enabled_aria = /** @type {((inputs?: Glossary_Set_Enabled_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Set_Enabled_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_set_enabled_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_set_enabled_aria(inputs)
	if (locale === "en") return en_glossary_set_enabled_aria(inputs)
	if (locale === "ja") return ja_glossary_set_enabled_aria(inputs)
	if (locale === "ko") return ko_glossary_set_enabled_aria(inputs)
	if (locale === "fr") return fr_glossary_set_enabled_aria(inputs)
	if (locale === "de") return de_glossary_set_enabled_aria(inputs)
	if (locale === "es") return es_glossary_set_enabled_aria(inputs)
	if (locale === "ru") return ru_glossary_set_enabled_aria(inputs)
	if (locale === "pt") return pt_glossary_set_enabled_aria(inputs)
	if (locale === "it") return it_glossary_set_enabled_aria(inputs)
	return ar_glossary_set_enabled_aria(inputs)
});