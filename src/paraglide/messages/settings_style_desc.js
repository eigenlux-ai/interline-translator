/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Style_DescInputs */

const zh_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`译文在原文旁的标记方式,默认完全融入。下方是真实效果,点选即用。`)
};

const zh_tw2_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`譯文在原文旁的標記方式,預設完全融入。下方是實際效果,點選即用。`)
};

const en_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How the translation is marked beside the original — it blends in by default. The swatches below are live; click to apply.`)
};

const ja_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原文のそばで訳文をどう示すか。既定では完全になじみます。下は実際の表示で、選ぶとすぐ反映されます。`)
};

const ko_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`원문 옆에 번역을 표시하는 방식. 기본값은 완전히 스며듭니다. 아래는 실제 모습이며, 고르면 바로 적용됩니다.`)
};

const fr_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La façon de marquer la traduction à côté de l'original — elle se fond par défaut. Les exemples ci-dessous sont réels ; cliquez pour appliquer.`)
};

const de_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wie die Übersetzung neben dem Original markiert wird — standardmäßig fügt sie sich ein. Die Muster unten sind live; zum Anwenden anklicken.`)
};

const es_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cómo se marca la traducción junto al original: se funde por defecto. Los ejemplos de abajo son reales; haz clic para aplicar.`)
};

const ru_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Как перевод отмечается рядом с оригиналом — по умолчанию он сливается. Образцы ниже живые; нажмите, чтобы применить.`)
};

const pt_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Como a tradução é marcada ao lado do original — funde-se por padrão. Os exemplos abaixo são reais; clique para aplicar.`)
};

const it_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Come la traduzione viene segnata accanto all'originale — per impostazione predefinita si fonde. Gli esempi qui sotto sono reali; fai clic per applicare.`)
};

const ar_settings_style_desc = /** @type {(inputs: Settings_Style_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كيف تُعلَّم الترجمة بجانب الأصل — تندمج افتراضيًا. النماذج أدناه حيّة؛ انقر للتطبيق.`)
};

/**
* | output |
* | --- |
* | "How the translation is marked beside the original — it blends in by default. The swatches below are live; click to apply." |
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