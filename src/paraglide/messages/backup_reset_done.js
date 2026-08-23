/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Reset_DoneInputs */

const zh_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已恢复默认设置。`)
};

const zh_tw2_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已還原預設值。`)
};

const en_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Defaults restored.`)
};

const ja_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`既定に戻しました。`)
};

const ko_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본값으로 되돌렸습니다.`)
};

const fr_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valeurs par défaut rétablies.`)
};

const de_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Standard wiederhergestellt.`)
};

const es_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valores predeterminados restablecidos.`)
};

const ru_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Стандартные настройки восстановлены.`)
};

const pt_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Predefinições repostas.`)
};

const it_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valori predefiniti ripristinati.`)
};

const ar_backup_reset_done = /** @type {(inputs: Backup_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمت استعادة الإعدادات الافتراضية.`)
};

/**
* | output |
* | --- |
* | "Defaults restored." |
*
* @param {Backup_Reset_DoneInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_reset_done = /** @type {((inputs?: Backup_Reset_DoneInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Reset_DoneInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_reset_done(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_reset_done(inputs)
	if (locale === "en") return en_backup_reset_done(inputs)
	if (locale === "ja") return ja_backup_reset_done(inputs)
	if (locale === "ko") return ko_backup_reset_done(inputs)
	if (locale === "fr") return fr_backup_reset_done(inputs)
	if (locale === "de") return de_backup_reset_done(inputs)
	if (locale === "es") return es_backup_reset_done(inputs)
	if (locale === "ru") return ru_backup_reset_done(inputs)
	if (locale === "pt") return pt_backup_reset_done(inputs)
	if (locale === "it") return it_backup_reset_done(inputs)
	return ar_backup_reset_done(inputs)
});