/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Section_DescInputs */

const zh_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`为术语指定译法。只有在原文中匹配到的条目才会加入 AI 提示词，未使用的条目不增加 token 用量。每个术语集可限定适用网站，匹配方式与网站规则相同。`)
};

const zh_tw2_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`為術語指定譯法。只有在原文中比對到的項目才會加入 AI 提示詞，未使用的項目不增加 token 用量。每個術語集可限定適用網站，比對方式與網站規則相同。`)
};

const en_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Specify preferred translations for terms. Only entries matching the source text are added to AI prompts; unused entries add no tokens. You can limit each set to specific sites using the same patterns as site rules.`)
};

const ja_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語の訳し方を指定します。原文に一致する項目だけを AI プロンプトに追加するため、使われない項目はトークンを消費しません。サイトルールと同じ指定方法で、用語集の適用先を限定できます。`)
};

const ko_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어별 번역어를 지정합니다. 원문과 일치하는 항목만 AI 프롬프트에 추가하므로 사용하지 않는 항목은 토큰을 소비하지 않습니다. 사이트 규칙과 같은 방식으로 용어집의 적용 사이트를 제한할 수 있습니다.`)
};

const fr_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Définissez la traduction souhaitée pour vos termes. Seules les entrées correspondant au texte source sont ajoutées aux prompts IA ; les autres ne consomment aucun token. Chaque glossaire peut être limité à certains sites, selon les mêmes motifs que les règles de site.`)
};

const de_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Legen Sie bevorzugte Übersetzungen für Begriffe fest. Nur Einträge, die zum Ausgangstext passen, werden dem KI-Prompt hinzugefügt; ungenutzte Einträge verbrauchen keine Tokens. Jedes Glossar lässt sich mit denselben Mustern wie die Website-Regeln auf bestimmte Websites beschränken.`)
};

const es_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Define cómo traducir cada término. Solo se añaden al prompt de IA las entradas que coinciden con el texto original; las demás no consumen tokens. Puedes limitar cada glosario a ciertos sitios con los mismos patrones que las reglas de sitios.`)
};

const ru_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Задайте предпочтительный перевод терминов. В ИИ-промпт добавляются только записи, совпавшие с исходным текстом; остальные не расходуют токены. Каждый набор можно ограничить отдельными сайтами по тем же шаблонам, что и правила сайтов.`)
};

const pt_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Defina como traduzir cada termo. Só as entradas que correspondem ao texto original são adicionadas ao prompt de IA; as demais não consomem tokens. Você pode limitar cada glossário a determinados sites com os mesmos padrões das regras de sites.`)
};

const it_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Specifica come tradurre i termini. Solo le voci che corrispondono al testo originale vengono aggiunte al prompt di IA; quelle inutilizzate non consumano token. Puoi limitare ogni glossario a determinati siti con gli stessi pattern delle regole dei siti.`)
};

const ar_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حدّد الترجمات المفضلة للمصطلحات. لا تُضاف إلى موجّه الذكاء الاصطناعي إلا المدخلات المطابقة للنص الأصلي؛ أما غير المستخدمة فلا تستهلك توكنات. يمكنك قصر كل مجموعة على مواقع محددة باستخدام أنماط قواعد المواقع نفسها.`)
};

/**
* | output |
* | --- |
* | "Specify preferred translations for terms. Only entries matching the source text are added to AI prompts; unused entries add no tokens. You can limit each set..." |
*
* @param {Glossary_Section_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_section_desc = /** @type {((inputs?: Glossary_Section_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Section_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_section_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_section_desc(inputs)
	if (locale === "en") return en_glossary_section_desc(inputs)
	if (locale === "ja") return ja_glossary_section_desc(inputs)
	if (locale === "ko") return ko_glossary_section_desc(inputs)
	if (locale === "fr") return fr_glossary_section_desc(inputs)
	if (locale === "de") return de_glossary_section_desc(inputs)
	if (locale === "es") return es_glossary_section_desc(inputs)
	if (locale === "ru") return ru_glossary_section_desc(inputs)
	if (locale === "pt") return pt_glossary_section_desc(inputs)
	if (locale === "it") return it_glossary_section_desc(inputs)
	return ar_glossary_section_desc(inputs)
});