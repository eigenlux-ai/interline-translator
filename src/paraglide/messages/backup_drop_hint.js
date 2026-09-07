/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Drop_HintInputs */

const zh_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`支持从旧版本或其他设备导出的 interline-config.json。`)
};

const zh_tw2_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`支援從舊版本或其他裝置匯出的 interline-config.json。`)
};

const en_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supports interline-config.json backups from older versions or other devices.`)
};

const ja_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`旧バージョンや別の端末から書き出した interline-config.json に対応しています。`)
};

const ko_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이전 버전이나 다른 기기에서 내보낸 interline-config.json을 지원합니다.`)
};

const fr_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accepte les fichiers interline-config.json exportés depuis une ancienne version ou un autre appareil.`)
};

const de_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unterstützt interline-config.json aus älteren Versionen oder von anderen Geräten.`)
};

const es_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compatible con archivos interline-config.json de versiones anteriores u otros dispositivos.`)
};

const ru_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Поддерживаются файлы interline-config.json из прежних версий и с других устройств.`)
};

const pt_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aceita arquivos interline-config.json exportados de versões anteriores ou outros dispositivos.`)
};

const it_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supporta i file interline-config.json esportati da versioni precedenti o altri dispositivi.`)
};

const ar_backup_drop_hint = /** @type {(inputs: Backup_Drop_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يدعم ملفات interline-config.json المصدّرة من إصدارات سابقة أو أجهزة أخرى.`)
};

/**
* | output |
* | --- |
* | "Supports interline-config.json backups from older versions or other devices." |
*
* @param {Backup_Drop_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_drop_hint = /** @type {((inputs?: Backup_Drop_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Drop_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_drop_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_drop_hint(inputs)
	if (locale === "en") return en_backup_drop_hint(inputs)
	if (locale === "ja") return ja_backup_drop_hint(inputs)
	if (locale === "ko") return ko_backup_drop_hint(inputs)
	if (locale === "fr") return fr_backup_drop_hint(inputs)
	if (locale === "de") return de_backup_drop_hint(inputs)
	if (locale === "es") return es_backup_drop_hint(inputs)
	if (locale === "ru") return ru_backup_drop_hint(inputs)
	if (locale === "pt") return pt_backup_drop_hint(inputs)
	if (locale === "it") return it_backup_drop_hint(inputs)
	return ar_backup_drop_hint(inputs)
});