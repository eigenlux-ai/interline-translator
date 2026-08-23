/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_ResetInputs */

const zh_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`恢复默认设置`)
};

const zh_tw2_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`還原預設值`)
};

const en_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restore defaults`)
};

const ja_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`既定に戻す`)
};

const ko_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본값 복원`)
};

const fr_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rétablir les valeurs par défaut`)
};

const de_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Standard wiederherstellen`)
};

const es_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restablecer los valores predeterminados`)
};

const ru_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сбросить к стандартным`)
};

const pt_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Repor as predefinições`)
};

const it_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ripristina i valori predefiniti`)
};

const ar_backup_reset = /** @type {(inputs: Backup_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استعادة الإعدادات الافتراضية`)
};

/**
* | output |
* | --- |
* | "Restore defaults" |
*
* @param {Backup_ResetInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_reset = /** @type {((inputs?: Backup_ResetInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_ResetInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_reset(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_reset(inputs)
	if (locale === "en") return en_backup_reset(inputs)
	if (locale === "ja") return ja_backup_reset(inputs)
	if (locale === "ko") return ko_backup_reset(inputs)
	if (locale === "fr") return fr_backup_reset(inputs)
	if (locale === "de") return de_backup_reset(inputs)
	if (locale === "es") return es_backup_reset(inputs)
	if (locale === "ru") return ru_backup_reset(inputs)
	if (locale === "pt") return pt_backup_reset(inputs)
	if (locale === "it") return it_backup_reset(inputs)
	return ar_backup_reset(inputs)
});