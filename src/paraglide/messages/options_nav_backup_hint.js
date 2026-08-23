/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_Backup_HintInputs */

const zh_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`导出 · 导入`)
};

const zh_tw2_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`匯出 · 匯入`)
};

const en_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export · Import`)
};

const ja_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`書き出し · 読み込み`)
};

const ko_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`내보내기 · 가져오기`)
};

const fr_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export · Import`)
};

const de_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export · Import`)
};

const es_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar · Importar`)
};

const ru_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспорт · Импорт`)
};

const pt_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar · Importar`)
};

const it_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Esporta · Importa`)
};

const ar_options_nav_backup_hint = /** @type {(inputs: Options_Nav_Backup_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصدير · استيراد`)
};

/**
* | output |
* | --- |
* | "Export · Import" |
*
* @param {Options_Nav_Backup_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_backup_hint = /** @type {((inputs?: Options_Nav_Backup_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_Backup_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_backup_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_backup_hint(inputs)
	if (locale === "en") return en_options_nav_backup_hint(inputs)
	if (locale === "ja") return ja_options_nav_backup_hint(inputs)
	if (locale === "ko") return ko_options_nav_backup_hint(inputs)
	if (locale === "fr") return fr_options_nav_backup_hint(inputs)
	if (locale === "de") return de_options_nav_backup_hint(inputs)
	if (locale === "es") return es_options_nav_backup_hint(inputs)
	if (locale === "ru") return ru_options_nav_backup_hint(inputs)
	if (locale === "pt") return pt_options_nav_backup_hint(inputs)
	if (locale === "it") return it_options_nav_backup_hint(inputs)
	return ar_options_nav_backup_hint(inputs)
});