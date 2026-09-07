/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rich_Text_DescInputs */

const zh_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`在译文中保留链接、加粗和行内代码。若格式标记影响翻译质量，可关闭此项，改用纯文本译文。`)
};

const zh_tw2_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`在譯文中保留連結、粗體與行內程式碼。若格式標記影響翻譯品質，可關閉此項，改用純文字譯文。`)
};

const en_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Keep links, bold text, and inline code in translations. If formatting affects translation quality, turn this off to use plain text.`)
};

const ja_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文にリンク、太字、インラインコードを引き継ぎます。書式が翻訳の質に影響する場合は、オフにしてプレーンテキストで翻訳できます。`)
};

const ko_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역문에 링크, 굵은 글씨, 인라인 코드를 유지합니다. 서식이 번역 품질에 영향을 주면 이 옵션을 끄고 일반 텍스트로 번역하세요.`)
};

const fr_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conserve les liens, le gras et le code en ligne dans la traduction. Si la mise en forme nuit à la qualité du texte, désactivez cette option pour traduire en texte brut.`)
};

const de_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Behält Links, Fettdruck und Inline-Code in der Übersetzung bei. Falls die Formatierung die Übersetzungsqualität beeinträchtigt, deaktivieren Sie diese Option für reinen Text.`)
};

const es_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conserva los enlaces, la negrita y el código en línea en las traducciones. Si el formato afecta a la calidad, desactiva esta opción para traducir como texto sin formato.`)
};

const ru_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сохраняет ссылки, полужирное начертание и встроенный код в переводе. Если форматирование влияет на качество, отключите эту опцию для перевода обычным текстом.`)
};

const pt_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mantém links, negrito e código em linha nas traduções. Se a formatação afetar a qualidade, desative esta opção para traduzir como texto simples.`)
};

const it_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mantiene link, grassetto e codice inline nelle traduzioni. Se la formattazione influisce sulla qualità, disattiva questa opzione per tradurre in testo semplice.`)
};

const ar_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يحافظ على الروابط والخط العريض والشيفرة المضمّنة في الترجمة. إذا أثّر التنسيق في جودة الترجمة، أوقف هذا الخيار للترجمة كنص عادي.`)
};

/**
* | output |
* | --- |
* | "Keep links, bold text, and inline code in translations. If formatting affects translation quality, turn this off to use plain text." |
*
* @param {Settings_Rich_Text_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_rich_text_desc = /** @type {((inputs?: Settings_Rich_Text_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rich_Text_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_rich_text_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_rich_text_desc(inputs)
	if (locale === "en") return en_settings_rich_text_desc(inputs)
	if (locale === "ja") return ja_settings_rich_text_desc(inputs)
	if (locale === "ko") return ko_settings_rich_text_desc(inputs)
	if (locale === "fr") return fr_settings_rich_text_desc(inputs)
	if (locale === "de") return de_settings_rich_text_desc(inputs)
	if (locale === "es") return es_settings_rich_text_desc(inputs)
	if (locale === "ru") return ru_settings_rich_text_desc(inputs)
	if (locale === "pt") return pt_settings_rich_text_desc(inputs)
	if (locale === "it") return it_settings_rich_text_desc(inputs)
	return ar_settings_rich_text_desc(inputs)
});