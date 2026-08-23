/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Editor_Title_EditInputs */

const zh_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`编辑风格`)
};

const zh_tw2_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`編輯風格`)
};

const en_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit style`)
};

const ja_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`スタイルを編集`)
};

const ko_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`스타일 편집`)
};

const fr_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier le style`)
};

const de_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stil bearbeiten`)
};

const es_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Editar estilo`)
};

const ru_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Изменить стиль`)
};

const pt_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Editar estilo`)
};

const it_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifica stile`)
};

const ar_styles_editor_title_edit = /** @type {(inputs: Styles_Editor_Title_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحرير النمط`)
};

/**
* | output |
* | --- |
* | "Edit style" |
*
* @param {Styles_Editor_Title_EditInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_editor_title_edit = /** @type {((inputs?: Styles_Editor_Title_EditInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Editor_Title_EditInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_editor_title_edit(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_editor_title_edit(inputs)
	if (locale === "en") return en_styles_editor_title_edit(inputs)
	if (locale === "ja") return ja_styles_editor_title_edit(inputs)
	if (locale === "ko") return ko_styles_editor_title_edit(inputs)
	if (locale === "fr") return fr_styles_editor_title_edit(inputs)
	if (locale === "de") return de_styles_editor_title_edit(inputs)
	if (locale === "es") return es_styles_editor_title_edit(inputs)
	if (locale === "ru") return ru_styles_editor_title_edit(inputs)
	if (locale === "pt") return pt_styles_editor_title_edit(inputs)
	if (locale === "it") return it_styles_editor_title_edit(inputs)
	return ar_styles_editor_title_edit(inputs)
});