/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expert_DescInputs */

const zh_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自定义完整的提示词模板，例如添加翻译示例。使用自定义模板时，对应翻译模式不再附加风格指令。`)
};

const zh_tw2_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自訂完整的提示詞範本，例如加入翻譯範例。使用自訂範本時，對應的翻譯模式不再加入風格指令。`)
};

const en_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customize the full prompt templates, for example by adding translation examples. Custom templates replace the style instructions for the corresponding translation mode.`)
};

const ja_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳例を加えるなど、プロンプトテンプレート全体を編集できます。独自のテンプレートを使う翻訳モードには、スタイル指示が追加されません。`)
};

const ko_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 예시를 추가하는 등 프롬프트 템플릿 전체를 수정할 수 있습니다. 사용자 템플릿을 사용하는 번역 모드에는 문체 지시가 추가되지 않습니다.`)
};

const fr_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Personnalisez les modèles de prompt complets, par exemple en ajoutant des exemples de traduction. Les modèles personnalisés remplacent les consignes de style pour le mode de traduction concerné.`)
};

const de_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Passen Sie die vollständigen Prompt-Vorlagen an, etwa mit Übersetzungsbeispielen. Eigene Vorlagen ersetzen die Stilvorgaben für den jeweiligen Übersetzungsmodus.`)
};

const es_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Personaliza las plantillas completas del prompt, por ejemplo con ejemplos de traducción. Las plantillas personalizadas sustituyen las instrucciones de estilo del modo de traducción correspondiente.`)
};

const ru_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Настройте полные шаблоны промптов, например добавьте примеры перевода. Собственные шаблоны заменяют указания по стилю для соответствующего режима перевода.`)
};

const pt_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Personalize os templates completos do prompt, por exemplo, com exemplos de tradução. Os templates personalizados substituem as instruções de estilo do modo de tradução correspondente.`)
};

const it_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Personalizza i template completi del prompt, ad esempio aggiungendo esempi di traduzione. I template personalizzati sostituiscono le istruzioni di stile nella modalità di traduzione corrispondente.`)
};

const ar_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خصّص قوالب الموجّه كاملة، كأن تضيف أمثلة للترجمة. تحل القوالب المخصصة محل التوجيهات الأسلوبية في وضع الترجمة المعني.`)
};

/**
* | output |
* | --- |
* | "Customize the full prompt templates, for example by adding translation examples. Custom templates replace the style instructions for the corresponding transl..." |
*
* @param {Expert_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_desc = /** @type {((inputs?: Expert_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_desc(inputs)
	if (locale === "en") return en_expert_desc(inputs)
	if (locale === "ja") return ja_expert_desc(inputs)
	if (locale === "ko") return ko_expert_desc(inputs)
	if (locale === "fr") return fr_expert_desc(inputs)
	if (locale === "de") return de_expert_desc(inputs)
	if (locale === "es") return es_expert_desc(inputs)
	if (locale === "ru") return ru_expert_desc(inputs)
	if (locale === "pt") return pt_expert_desc(inputs)
	if (locale === "it") return it_expert_desc(inputs)
	return ar_expert_desc(inputs)
});