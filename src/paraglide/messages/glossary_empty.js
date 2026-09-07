/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_EmptyInputs */

const zh_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`暂无术语集`)
};

const zh_tw2_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`尚無術語集`)
};

const en_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No glossaries yet`)
};

const ja_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語集はまだありません`)
};

const ko_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`아직 용어집이 없습니다`)
};

const fr_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun glossaire pour le moment`)
};

const de_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Noch keine Glossare`)
};

const es_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aún no hay glosarios`)
};

const ru_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Глоссариев пока нет`)
};

const pt_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ainda não há glossários`)
};

const it_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nessun glossario ancora`)
};

const ar_glossary_empty = /** @type {(inputs: Glossary_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد مسارد بعد`)
};

/**
* | output |
* | --- |
* | "No glossaries yet" |
*
* @param {Glossary_EmptyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_empty = /** @type {((inputs?: Glossary_EmptyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_EmptyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_empty(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_empty(inputs)
	if (locale === "en") return en_glossary_empty(inputs)
	if (locale === "ja") return ja_glossary_empty(inputs)
	if (locale === "ko") return ko_glossary_empty(inputs)
	if (locale === "fr") return fr_glossary_empty(inputs)
	if (locale === "de") return de_glossary_empty(inputs)
	if (locale === "es") return es_glossary_empty(inputs)
	if (locale === "ru") return ru_glossary_empty(inputs)
	if (locale === "pt") return pt_glossary_empty(inputs)
	if (locale === "it") return it_glossary_empty(inputs)
	return ar_glossary_empty(inputs)
});