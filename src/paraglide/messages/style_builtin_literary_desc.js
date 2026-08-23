/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Builtin_Literary_DescInputs */

const zh_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`以气韵与意象优先，语序可自由，保留原作声口。`)
};

const zh_tw2_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`以氣韻與意象優先，語序可自由，保留原作聲口。`)
};

const en_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rhythm and imagery first, freer word order, the original voice preserved.`)
};

const ja_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`リズムとイメージを優先し、語順は自由に。原作の声を保ちます。`)
};

const ko_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`리듬과 심상을 우선하고 어순은 자유롭게, 원작의 목소리를 지킵니다.`)
};

const fr_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rythme et images d'abord, ordre des mots plus libre, la voix de l'original préservée.`)
};

const de_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rhythmus und Bilder zuerst, freiere Wortstellung, die Stimme des Originals bleibt.`)
};

const es_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ritmo e imágenes primero, orden más libre, la voz del original preservada.`)
};

const ru_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ритм и образность прежде всего, свободный порядок слов, голос оригинала сохранён.`)
};

const pt_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ritmo e imagens primeiro, ordem mais livre, a voz do original preservada.`)
};

const it_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prima ritmo e immagini, ordine più libero, la voce dell'originale preservata.`)
};

const ar_style_builtin_literary_desc = /** @type {(inputs: Style_Builtin_Literary_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإيقاع والصور أولاً، وترتيب أحرّ للكلمات مع صون صوت الأصل.`)
};

/**
* | output |
* | --- |
* | "Rhythm and imagery first, freer word order, the original voice preserved." |
*
* @param {Style_Builtin_Literary_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_builtin_literary_desc = /** @type {((inputs?: Style_Builtin_Literary_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Builtin_Literary_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_builtin_literary_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_style_builtin_literary_desc(inputs)
	if (locale === "en") return en_style_builtin_literary_desc(inputs)
	if (locale === "ja") return ja_style_builtin_literary_desc(inputs)
	if (locale === "ko") return ko_style_builtin_literary_desc(inputs)
	if (locale === "fr") return fr_style_builtin_literary_desc(inputs)
	if (locale === "de") return de_style_builtin_literary_desc(inputs)
	if (locale === "es") return es_style_builtin_literary_desc(inputs)
	if (locale === "ru") return ru_style_builtin_literary_desc(inputs)
	if (locale === "pt") return pt_style_builtin_literary_desc(inputs)
	if (locale === "it") return it_style_builtin_literary_desc(inputs)
	return ar_style_builtin_literary_desc(inputs)
});