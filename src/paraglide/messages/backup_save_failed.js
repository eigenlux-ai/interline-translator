/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ error: NonNullable<unknown> }} Backup_Save_FailedInputs */

const zh_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`设置保存失败：${i?.error}`)
};

const zh_tw2_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`設定儲存失敗：${i?.error}`)
};

const en_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Couldn't save settings: ${i?.error}`)
};

const ja_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`設定を保存できませんでした：${i?.error}`)
};

const ko_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`설정을 저장하지 못했습니다: ${i?.error}`)
};

const fr_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Impossible d’enregistrer les paramètres : ${i?.error}`)
};

const de_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Einstellungen konnten nicht gespeichert werden: ${i?.error}`)
};

const es_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No se pudo guardar la configuración: ${i?.error}`)
};

const ru_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Не удалось сохранить настройки: ${i?.error}`)
};

const pt_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Não foi possível salvar as configurações: ${i?.error}`)
};

const it_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Impossibile salvare le impostazioni: ${i?.error}`)
};

const ar_backup_save_failed = /** @type {(inputs: Backup_Save_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تعذّر حفظ الإعدادات: ${i?.error}`)
};

/**
* | output |
* | --- |
* | "Couldn't save settings: {error}" |
*
* @param {Backup_Save_FailedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_save_failed = /** @type {((inputs: Backup_Save_FailedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Save_FailedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_save_failed(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_save_failed(inputs)
	if (locale === "en") return en_backup_save_failed(inputs)
	if (locale === "ja") return ja_backup_save_failed(inputs)
	if (locale === "ko") return ko_backup_save_failed(inputs)
	if (locale === "fr") return fr_backup_save_failed(inputs)
	if (locale === "de") return de_backup_save_failed(inputs)
	if (locale === "es") return es_backup_save_failed(inputs)
	if (locale === "ru") return ru_backup_save_failed(inputs)
	if (locale === "pt") return pt_backup_save_failed(inputs)
	if (locale === "it") return it_backup_save_failed(inputs)
	return ar_backup_save_failed(inputs)
});