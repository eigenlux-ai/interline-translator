/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Style_DescInputs */

const zh_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`选择译文在页面中的显示样式。默认融入原页面，点击下方预览即可应用。`)
};

const zh_tw2_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`選擇譯文在頁面上的顯示樣式。預設融入原頁面，點選下方預覽即可套用。`)
};

const en_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose how translations look on the page. By default, they match the page. Select a preview to apply it.`)
};

const ja_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文の見た目を選びます。既定ではページの外観になじむ表示になります。プレビューを選ぶと適用されます。`)
};

const ko_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역문의 모양을 선택합니다. 기본적으로 페이지의 모양에 맞춰 표시하며, 아래 미리보기를 선택하면 적용됩니다.`)
};

const fr_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez l’apparence du texte traduit. Par défaut, elle s’accorde à celle de la page. Sélectionnez un aperçu pour l’appliquer.`)
};

const de_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wählen Sie, wie Übersetzungen aussehen. Standardmäßig passen sie sich der Seite an. Klicken Sie auf eine Vorschau, um sie anzuwenden.`)
};

const es_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Elige cómo se muestran las traducciones. De forma predeterminada, se adaptan a la página. Selecciona una vista previa para aplicarla.`)
};

const ru_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выберите, как будет выглядеть перевод. По умолчанию он вписывается в оформление страницы. Нажмите на образец, чтобы применить его.`)
};

const pt_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escolha como as traduções aparecem. Por padrão, elas se adaptam à página. Selecione uma prévia para aplicar.`)
};

const it_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scegli come visualizzare le traduzioni. Per impostazione predefinita, si adattano alla pagina. Seleziona un’anteprima per applicarla.`)
};

const ar_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر طريقة عرض الترجمة. تطابق مظهر الصفحة افتراضيًا. انقر على معاينة لتطبيقها.`)
};

/**
* | output |
* | --- |
* | "Choose how translations look on the page. By default, they match the page. Select a preview to apply it." |
*
* @param {Settings_Style_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_style_desc = /** @type {((inputs?: Settings_Style_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Style_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_style_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_style_desc(inputs)
	if (locale === "en") return en_settings_style_desc(inputs)
	if (locale === "ja") return ja_settings_style_desc(inputs)
	if (locale === "ko") return ko_settings_style_desc(inputs)
	if (locale === "fr") return fr_settings_style_desc(inputs)
	if (locale === "de") return de_settings_style_desc(inputs)
	if (locale === "es") return es_settings_style_desc(inputs)
	if (locale === "ru") return ru_settings_style_desc(inputs)
	if (locale === "pt") return pt_settings_style_desc(inputs)
	if (locale === "it") return it_settings_style_desc(inputs)
	return ar_settings_style_desc(inputs)
});