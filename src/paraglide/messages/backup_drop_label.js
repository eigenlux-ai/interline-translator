/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Drop_LabelInputs */

const zh_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`点击选择或拖入 JSON 备份文件`)
};

const zh_tw2_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`點選或拖入 JSON 備份檔案`)
};

const en_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a JSON backup or drop it here`)
};

const ja_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JSON バックアップを選択するか、ここにドロップ`)
};

const ko_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JSON 백업 파일을 선택하거나 여기에 놓으세요`)
};

const fr_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez une sauvegarde JSON ou déposez-la ici`)
};

const de_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JSON-Sicherung auswählen oder hier ablegen`)
};

const es_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Elige una copia de seguridad JSON o arrástrala aquí`)
};

const ru_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выберите резервную копию JSON или перетащите её сюда`)
};

const pt_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escolha um backup JSON ou arraste-o até aqui`)
};

const it_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scegli un backup JSON o trascinalo qui`)
};

const ar_backup_drop_label = /** @type {(inputs: Backup_Drop_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر نسخة احتياطية بصيغة JSON أو اسحبها إلى هنا`)
};

/**
* | output |
* | --- |
* | "Choose a JSON backup or drop it here" |
*
* @param {Backup_Drop_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_drop_label = /** @type {((inputs?: Backup_Drop_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Drop_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_drop_label(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_drop_label(inputs)
	if (locale === "en") return en_backup_drop_label(inputs)
	if (locale === "ja") return ja_backup_drop_label(inputs)
	if (locale === "ko") return ko_backup_drop_label(inputs)
	if (locale === "fr") return fr_backup_drop_label(inputs)
	if (locale === "de") return de_backup_drop_label(inputs)
	if (locale === "es") return es_backup_drop_label(inputs)
	if (locale === "ru") return ru_backup_drop_label(inputs)
	if (locale === "pt") return pt_backup_drop_label(inputs)
	if (locale === "it") return it_backup_drop_label(inputs)
	return ar_backup_drop_label(inputs)
});