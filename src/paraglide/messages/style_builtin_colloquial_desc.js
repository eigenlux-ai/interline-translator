/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Builtin_Colloquial_DescInputs */

const zh_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自然口语，短句节奏，拒绝生硬直译。`)
};

const zh_tw2_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自然口語，短句節奏，拒絕生硬直譯。`)
};

const en_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Natural spoken phrasing, short rhythms, no stiff literalism.`)
};

const ja_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自然な話し言葉。短いリズムで、堅い直訳を避けます。`)
};

const ko_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자연스러운 구어체와 짧은 호흡, 딱딱한 직역을 피합니다.`)
};

const fr_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tournures orales naturelles, phrases courtes, pas de littéralisme rigide.`)
};

const de_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Natürliche gesprochene Sprache, kurze Sätze, keine steife Wörtlichkeit.`)
};

const es_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Frases orales naturales, ritmo corto, nada de literalidad rígida.`)
};

const ru_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Естественная разговорная речь, короткие фразы, без скованного буквализма.`)
};

const pt_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Frases orais naturais, ritmo curto, sem literalidade rígida.`)
};

const it_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Frasi orali naturali, ritmo breve, niente rigidità letterale.`)
};

const ar_style_builtin_colloquial_desc = /** @type {(inputs: Style_Builtin_Colloquial_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صياغة محكية طبيعية وإيقاع قصير دون حرفية جامدة.`)
};

/**
* | output |
* | --- |
* | "Natural spoken phrasing, short rhythms, no stiff literalism." |
*
* @param {Style_Builtin_Colloquial_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_builtin_colloquial_desc = /** @type {((inputs?: Style_Builtin_Colloquial_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Builtin_Colloquial_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_builtin_colloquial_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_style_builtin_colloquial_desc(inputs)
	if (locale === "en") return en_style_builtin_colloquial_desc(inputs)
	if (locale === "ja") return ja_style_builtin_colloquial_desc(inputs)
	if (locale === "ko") return ko_style_builtin_colloquial_desc(inputs)
	if (locale === "fr") return fr_style_builtin_colloquial_desc(inputs)
	if (locale === "de") return de_style_builtin_colloquial_desc(inputs)
	if (locale === "es") return es_style_builtin_colloquial_desc(inputs)
	if (locale === "ru") return ru_style_builtin_colloquial_desc(inputs)
	if (locale === "pt") return pt_style_builtin_colloquial_desc(inputs)
	if (locale === "it") return it_style_builtin_colloquial_desc(inputs)
	return ar_style_builtin_colloquial_desc(inputs)
});