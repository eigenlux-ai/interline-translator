/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Remove_AriaInputs */

const zh_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`删除该术语`)
};

const zh_tw2_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`刪除該術語`)
};

const en_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove this term`)
};

const ja_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`この用語を削除`)
};

const ko_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 용어 삭제`)
};

const fr_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer ce terme`)
};

const de_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Diesen Begriff entfernen`)
};

const es_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Eliminar este término`)
};

const ru_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Удалить этот термин`)
};

const pt_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remover este termo`)
};

const it_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rimuovi questo termine`)
};

const ar_glossary_remove_aria = /** @type {(inputs: Glossary_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة هذا المصطلح`)
};

/**
* | output |
* | --- |
* | "Remove this term" |
*
* @param {Glossary_Remove_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_remove_aria = /** @type {((inputs?: Glossary_Remove_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Remove_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_remove_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_remove_aria(inputs)
	if (locale === "en") return en_glossary_remove_aria(inputs)
	if (locale === "ja") return ja_glossary_remove_aria(inputs)
	if (locale === "ko") return ko_glossary_remove_aria(inputs)
	if (locale === "fr") return fr_glossary_remove_aria(inputs)
	if (locale === "de") return de_glossary_remove_aria(inputs)
	if (locale === "es") return es_glossary_remove_aria(inputs)
	if (locale === "ru") return ru_glossary_remove_aria(inputs)
	if (locale === "pt") return pt_glossary_remove_aria(inputs)
	if (locale === "it") return it_glossary_remove_aria(inputs)
	return ar_glossary_remove_aria(inputs)
});