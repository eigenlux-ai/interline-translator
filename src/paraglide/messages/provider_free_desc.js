/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Free_DescInputs */

const zh_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`免费,无需 API key。内置的兜底引擎。`)
};

const zh_tw2_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`免費,不需 API key。內建的兜底引擎。`)
};

const en_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Free, no API key needed. The built-in fallback engine.`)
};

const ja_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`無料、API key は不要。内蔵の予備エンジンです。`)
};

const ko_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`무료, API key 불필요. 기본 제공되는 대체 엔진입니다.`)
};

const fr_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gratuit, aucune clé API requise. Le moteur de secours intégré.`)
};

const de_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kostenlos, kein API key nötig. Die integrierte Ausweich-Engine.`)
};

const es_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gratis, sin clave API. El motor de reserva integrado.`)
};

const ru_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бесплатно, API key не нужен. Встроенный запасной движок.`)
};

const pt_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gratuito, sem API key. O motor de reserva integrado.`)
};

const it_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gratuito, nessuna API key necessaria. Il motore di riserva integrato.`)
};

const ar_provider_free_desc = /** @type {(inputs: Provider_Free_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مجاني، بلا حاجة إلى مفتاح API. محرّك احتياطي مدمج.`)
};

/**
* | output |
* | --- |
* | "Free, no API key needed. The built-in fallback engine." |
*
* @param {Provider_Free_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_free_desc = /** @type {((inputs?: Provider_Free_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Free_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_free_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_free_desc(inputs)
	if (locale === "en") return en_provider_free_desc(inputs)
	if (locale === "ja") return ja_provider_free_desc(inputs)
	if (locale === "ko") return ko_provider_free_desc(inputs)
	if (locale === "fr") return fr_provider_free_desc(inputs)
	if (locale === "de") return de_provider_free_desc(inputs)
	if (locale === "es") return es_provider_free_desc(inputs)
	if (locale === "ru") return ru_provider_free_desc(inputs)
	if (locale === "pt") return pt_provider_free_desc(inputs)
	if (locale === "it") return it_provider_free_desc(inputs)
	return ar_provider_free_desc(inputs)
});