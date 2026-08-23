/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Reset_ConfirmInputs */

const zh_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`确认恢复默认`)
};

const zh_tw2_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`確認還原預設值`)
};

const en_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yes, restore defaults`)
};

const ja_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`既定に戻す`)
};

const ko_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본값 복원하기`)
};

const fr_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Oui, rétablir les valeurs par défaut`)
};

const de_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ja, Standard wiederherstellen`)
};

const es_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sí, restablecer`)
};

const ru_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Да, сбросить`)
};

const pt_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sim, repor as predefinições`)
};

const it_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sì, ripristina i valori predefiniti`)
};

const ar_backup_reset_confirm = /** @type {(inputs: Backup_Reset_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نعم، استعادة الافتراضي`)
};

/**
* | output |
* | --- |
* | "Yes, restore defaults" |
*
* @param {Backup_Reset_ConfirmInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_reset_confirm = /** @type {((inputs?: Backup_Reset_ConfirmInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Reset_ConfirmInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_reset_confirm(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_reset_confirm(inputs)
	if (locale === "en") return en_backup_reset_confirm(inputs)
	if (locale === "ja") return ja_backup_reset_confirm(inputs)
	if (locale === "ko") return ko_backup_reset_confirm(inputs)
	if (locale === "fr") return fr_backup_reset_confirm(inputs)
	if (locale === "de") return de_backup_reset_confirm(inputs)
	if (locale === "es") return es_backup_reset_confirm(inputs)
	if (locale === "ru") return ru_backup_reset_confirm(inputs)
	if (locale === "pt") return pt_backup_reset_confirm(inputs)
	if (locale === "it") return it_backup_reset_confirm(inputs)
	return ar_backup_reset_confirm(inputs)
});