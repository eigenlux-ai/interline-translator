/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Empty_HintInputs */

const zh_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新建术语集、导入 CSV/TSV/JSON 文件，或选择下方英译简中预设。`)
};

const zh_tw2_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新增術語集、匯入 CSV/TSV/JSON 檔案，或選擇下方英譯簡中預設。`)
};

const en_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create a glossary, import a CSV/TSV/JSON file, or choose an English-to-Simplified-Chinese preset below.`)
};

const ja_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語集を作成するか、CSV/TSV/JSON を読み込むか、下の英語から簡体字中国語へのプリセットを選んでください。`)
};

const ko_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어집을 만들거나 CSV/TSV/JSON 파일을 가져오세요. 아래 영어→중국어 간체 용어집을 선택할 수도 있습니다.`)
};

const fr_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créez un glossaire, importez un fichier CSV/TSV/JSON ou choisissez ci-dessous un glossaire anglais–chinois simplifié.`)
};

const de_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Erstellen Sie ein Glossar, importieren Sie eine CSV/TSV/JSON-Datei oder wählen Sie unten eine Vorlage für Englisch–Chinesisch (vereinfacht).`)
};

const es_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Crea un glosario, importa un archivo CSV/TSV/JSON o elige uno de los glosarios de inglés a chino simplificado.`)
};

const ru_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Создайте глоссарий, импортируйте CSV/TSV/JSON или выберите ниже готовый набор для перевода с английского на упрощённый китайский.`)
};

const pt_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Crie um glossário, importe um arquivo CSV/TSV/JSON ou escolha abaixo um glossário de inglês para chinês simplificado.`)
};

const it_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Crea un glossario, importa un file CSV/TSV/JSON o scegli un glossario dall’inglese al cinese semplificato qui sotto.`)
};

const ar_glossary_empty_hint = /** @type {(inputs: Glossary_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أنشئ مسردًا أو استورد ملف CSV/TSV/JSON، أو اختر أدناه مسردًا للترجمة من الإنجليزية إلى الصينية المبسطة.`)
};

/**
* | output |
* | --- |
* | "Create a glossary, import a CSV/TSV/JSON file, or choose an English-to-Simplified-Chinese preset below." |
*
* @param {Glossary_Empty_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_empty_hint = /** @type {((inputs?: Glossary_Empty_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Empty_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_empty_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_empty_hint(inputs)
	if (locale === "en") return en_glossary_empty_hint(inputs)
	if (locale === "ja") return ja_glossary_empty_hint(inputs)
	if (locale === "ko") return ko_glossary_empty_hint(inputs)
	if (locale === "fr") return fr_glossary_empty_hint(inputs)
	if (locale === "de") return de_glossary_empty_hint(inputs)
	if (locale === "es") return es_glossary_empty_hint(inputs)
	if (locale === "ru") return ru_glossary_empty_hint(inputs)
	if (locale === "pt") return pt_glossary_empty_hint(inputs)
	if (locale === "it") return it_glossary_empty_hint(inputs)
	return ar_glossary_empty_hint(inputs)
});