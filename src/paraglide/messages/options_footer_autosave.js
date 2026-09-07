/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Footer_AutosaveInputs */

const zh_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`更改自动保存`)
};

const zh_tw2_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`變更自動儲存`)
};

const en_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changes save automatically`)
};

const ja_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`変更は自動で保存されます`)
};

const ko_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`변경 사항은 자동으로 저장됩니다`)
};

const fr_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les modifications sont enregistrées automatiquement`)
};

const de_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Änderungen werden automatisch gespeichert`)
};

const es_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Los cambios se guardan automáticamente`)
};

const ru_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Изменения сохраняются автоматически`)
};

const pt_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`As alterações são salvas automaticamente`)
};

const it_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le modifiche vengono salvate automaticamente`)
};

const ar_options_footer_autosave = /** @type {(inputs: Options_Footer_AutosaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُحفَظ التغييرات تلقائيًا`)
};

/**
* | output |
* | --- |
* | "Changes save automatically" |
*
* @param {Options_Footer_AutosaveInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_footer_autosave = /** @type {((inputs?: Options_Footer_AutosaveInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Footer_AutosaveInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_footer_autosave(inputs)
	if (locale === "zh-TW") return zh_tw2_options_footer_autosave(inputs)
	if (locale === "en") return en_options_footer_autosave(inputs)
	if (locale === "ja") return ja_options_footer_autosave(inputs)
	if (locale === "ko") return ko_options_footer_autosave(inputs)
	if (locale === "fr") return fr_options_footer_autosave(inputs)
	if (locale === "de") return de_options_footer_autosave(inputs)
	if (locale === "es") return es_options_footer_autosave(inputs)
	if (locale === "ru") return ru_options_footer_autosave(inputs)
	if (locale === "pt") return pt_options_footer_autosave(inputs)
	if (locale === "it") return it_options_footer_autosave(inputs)
	return ar_options_footer_autosave(inputs)
});