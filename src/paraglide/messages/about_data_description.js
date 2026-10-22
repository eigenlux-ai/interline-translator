/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} About_Data_DescriptionInputs */

const zh_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`本扩展未内置第三方词典或语料库。语言检测使用 Chrome 内置的 LanguageDetector 模型，由浏览器管理。翻译结果由所选服务提供，适用该服务的条款。导入的术语表由用户自行提供。`)
};

const zh_tw2_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`本擴充功能未內建第三方詞典或語料庫。語言偵測使用 Chrome 內建的 LanguageDetector 模型，由瀏覽器管理。翻譯結果由所選服務提供，適用該服務的條款。匯入的術語表由使用者自行提供。`)
};

const en_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No third-party dictionaries or corpora are bundled. Language detection uses Chrome’s built-in LanguageDetector model, managed by the browser. Translation results come from your selected provider and are subject to that provider’s terms. Imported glossaries are supplied by you.`)
};

const ja_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`第三者の辞書やコーパスは同梱していません。言語検出には、ブラウザーが管理する Chrome 組み込みの LanguageDetector モデルを使用します。翻訳結果は選択したサービスから提供され、そのサービスの利用規約が適用されます。インポートした用語集はユーザーが提供するものです。`)
};

const ko_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`타사 사전이나 말뭉치는 포함되어 있지 않습니다. 언어 감지에는 브라우저가 관리하는 Chrome 내장 LanguageDetector 모델을 사용합니다. 번역 결과는 선택한 서비스에서 제공하며 해당 서비스의 약관이 적용됩니다. 가져온 용어집은 사용자가 제공한 것입니다.`)
};

const fr_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun dictionnaire ni corpus tiers n’est inclus. La détection de langue utilise le modèle LanguageDetector intégré à Chrome, géré par le navigateur. Les traductions proviennent du service choisi et sont soumises à ses conditions. Les glossaires importés sont fournis par vous.`)
};

const de_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Es werden keine Wörterbücher oder Korpora Dritter mitgeliefert. Die Spracherkennung nutzt das in Chrome integrierte LanguageDetector-Modell, das vom Browser verwaltet wird. Übersetzungen stammen vom gewählten Anbieter und unterliegen dessen Bedingungen. Importierte Glossare werden von Ihnen bereitgestellt.`)
};

const es_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No se incluyen diccionarios ni corpus de terceros. La detección de idiomas utiliza el modelo LanguageDetector integrado en Chrome, administrado por el navegador. Las traducciones proceden del proveedor seleccionado y están sujetas a sus condiciones. Los glosarios importados los proporciona usted.`)
};

const ru_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сторонние словари и корпуса текстов не включены. Для определения языка используется встроенная в Chrome модель LanguageDetector, управляемая браузером. Переводы предоставляются выбранным сервисом и регулируются его условиями. Импортируемые глоссарии предоставляете вы.`)
};

const pt_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Não são incluídos dicionários ou corpora de terceiros. A deteção de idiomas utiliza o modelo LanguageDetector integrado no Chrome, gerido pelo navegador. As traduções são fornecidas pelo serviço selecionado e estão sujeitas aos seus termos. Os glossários importados são fornecidos por si.`)
};

const it_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non sono inclusi dizionari o corpora di terze parti. Il rilevamento della lingua utilizza il modello LanguageDetector integrato in Chrome, gestito dal browser. Le traduzioni provengono dal servizio selezionato e sono soggette alle sue condizioni. I glossari importati sono forniti dall’utente.`)
};

const ar_about_data_description = /** @type {(inputs: About_Data_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يتضمن الامتداد قواميس أو مجموعات نصوص تابعة لجهات خارجية. يستخدم اكتشاف اللغة نموذج LanguageDetector المدمج في Chrome، والذي يديره المتصفح. تأتي الترجمات من مزود الخدمة المحدد وتخضع لشروطه. أنت من يوفر المسارد المستوردة.`)
};

/**
* | output |
* | --- |
* | "No third-party dictionaries or corpora are bundled. Language detection uses Chrome’s built-in LanguageDetector model, managed by the browser. Translation res..." |
*
* @param {About_Data_DescriptionInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const about_data_description = /** @type {((inputs?: About_Data_DescriptionInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<About_Data_DescriptionInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_about_data_description(inputs)
	if (locale === "zh-TW") return zh_tw2_about_data_description(inputs)
	if (locale === "en") return en_about_data_description(inputs)
	if (locale === "ja") return ja_about_data_description(inputs)
	if (locale === "ko") return ko_about_data_description(inputs)
	if (locale === "fr") return fr_about_data_description(inputs)
	if (locale === "de") return de_about_data_description(inputs)
	if (locale === "es") return es_about_data_description(inputs)
	if (locale === "ru") return ru_about_data_description(inputs)
	if (locale === "pt") return pt_about_data_description(inputs)
	if (locale === "it") return it_about_data_description(inputs)
	return ar_about_data_description(inputs)
});