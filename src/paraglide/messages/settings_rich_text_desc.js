/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rich_Text_DescInputs */

const zh_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`译文保留原文的链接、加粗、行内代码等样式。个别引擎会被样式标记干扰、译文生硬时，可关闭此项换取更自然的纯文本译文。`)
};

const zh_tw2_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`譯文保留原文的連結、粗體、行內程式碼等樣式。個別引擎會被樣式標記干擾、譯文生硬時，可關閉此項換取更自然的純文字譯文。`)
};

const en_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translations keep the original's links, bold and inline code. If format markers confuse an engine and the translation reads stilted, turn this off for cleaner plain-text output.`)
};

const ja_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`リンク・太字・インラインコードなどの書式を訳文に引き継ぎます。書式マーカーが翻訳エンジンの妨げになり訳文が不自然な場合は、オフにするとプレーンテキストでより自然に翻訳されます。`)
};

const ko_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`링크, 굵게, 인라인 코드 등 원문 서식을 번역문에 유지합니다. 서식 마커 때문에 번역이 어색해지는 엔진이 있다면 끄고 일반 텍스트로 더 자연스럽게 번역하세요.`)
};

const fr_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les traductions conservent les liens, le gras et le code en ligne de l'original. Si les marqueurs de format perturbent un moteur et rendent la traduction maladroite, désactivez cette option pour un texte brut plus naturel.`)
};

const de_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzungen übernehmen Links, Fettdruck und Inline-Code des Originals. Falls Formatmarker eine Engine stören und die Übersetzung hölzern wirkt, schalten Sie dies für natürlicheren reinen Text aus.`)
};

const es_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Las traducciones conservan los enlaces, negritas y código en línea del original. Si los marcadores de formato confunden a un motor y la traducción resulta forzada, desactívalo para obtener texto plano más natural.`)
};

const ru_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод сохраняет ссылки, полужирный шрифт и встроенный код оригинала. Если маркеры форматирования мешают движку и перевод звучит неестественно, отключите эту опцию — получите более естественный простой текст.`)
};

const pt_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`As traduções preservam links, negrito e código embutido do original. Se os marcadores de formato confundirem um mecanismo e a tradução soar travada, desative para obter texto simples mais natural.`)
};

const it_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le traduzioni conservano link, grassetto e codice inline dell'originale. Se i marcatori di formato disturbano un motore e la traduzione risulta rigida, disattivalo per un testo semplice più naturale.`)
};

const ar_settings_rich_text_desc = /** @type {(inputs: Settings_Rich_Text_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحتفظ الترجمة بروابط النص الأصلي وخطه الغامق والشيفرة المضمّنة. إذا أربكت علامات التنسيق أحد المحركات وبدت الترجمة متكلفة، أوقف هذا الخيار للحصول على نص عادي أكثر سلاسة.`)
};

/**
* | output |
* | --- |
* | "Translations keep the original's links, bold and inline code. If format markers confuse an engine and the translation reads stilted, turn this off for cleane..." |
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