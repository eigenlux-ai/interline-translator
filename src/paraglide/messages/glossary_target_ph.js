/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Target_PhInputs */

const zh_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`容器组`)
};

const zh_tw2_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`容器組`)
};

const en_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`container group`)
};

const ja_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`コンテナグループ`)
};

const ko_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`컨테이너 그룹`)
};

const fr_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`groupe de conteneurs`)
};

const de_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Containergruppe`)
};

const es_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`grupo de contenedores`)
};

const ru_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`группа контейнеров`)
};

const pt_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`grupo de contentores`)
};

const it_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`gruppo di container`)
};

const ar_glossary_target_ph = /** @type {(inputs: Glossary_Target_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مجموعة الحاويات`)
};

/**
* | output |
* | --- |
* | "container group" |
*
* @param {Glossary_Target_PhInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_target_ph = /** @type {((inputs?: Glossary_Target_PhInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Target_PhInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_target_ph(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_target_ph(inputs)
	if (locale === "en") return en_glossary_target_ph(inputs)
	if (locale === "ja") return ja_glossary_target_ph(inputs)
	if (locale === "ko") return ko_glossary_target_ph(inputs)
	if (locale === "fr") return fr_glossary_target_ph(inputs)
	if (locale === "de") return de_glossary_target_ph(inputs)
	if (locale === "es") return es_glossary_target_ph(inputs)
	if (locale === "ru") return ru_glossary_target_ph(inputs)
	if (locale === "pt") return pt_glossary_target_ph(inputs)
	if (locale === "it") return it_glossary_target_ph(inputs)
	return ar_glossary_target_ph(inputs)
});