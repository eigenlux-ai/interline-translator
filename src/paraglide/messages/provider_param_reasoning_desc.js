/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Param_Reasoning_DescInputs */

const zh_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`各家的写法不同,而 Gemini 根本没有关闭档 —— 选「关闭」只会降到它的最低档。模型不认自家参数时会在验证这一步报错。`)
};

const zh_tw2_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`深度思考的參數名稱各家不同,而 Gemini 根本沒有關閉這一檔——選「關閉」只會降到它最低的思考強度。模型不接受自家的寫法時,按驗證連線就會失敗。`)
};

const en_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vendors spell extended thinking differently, and Gemini has no off switch at all — there, Off buys its lowest level instead. A model that refuses its family parameter fails at Validate.`)
};

const ja_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`拡張思考のパラメーター名はプロバイダーごとに異なり、Gemini にはオフ自体がありません。オフを選んでも思考が最小レベルに下がるだけです。同系列のパラメーターを受け付けないモデルは、接続を検証した時点でエラーになります。`)
};

const ko_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`확장 사고 파라미터 이름은 제공자마다 다르고, Gemini에는 끄기 자체가 없어서 끄기를 골라도 가장 낮은 수준으로 내려갈 뿐입니다. 같은 계열의 파라미터를 받지 않는 모델은 연결 검증 단계에서 오류가 납니다.`)
};

const fr_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chaque fournisseur nomme la réflexion étendue à sa manière, et Gemini n'a aucun réglage pour la désactiver : « Désactivé » y descend seulement au niveau le plus bas. Un modèle qui n'accepte pas le paramètre de sa famille échoue au moment de valider la connexion.`)
};

const de_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jeder Anbieter benennt erweitertes Denken anders, und Gemini hat gar keinen Aus-Schalter — dort senkt „Aus“ nur auf die niedrigste Stufe. Ein Modell, das den Parameter seiner Familie nicht akzeptiert, scheitert beim Prüfen der Verbindung.`)
};

const es_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cada proveedor nombra el pensamiento extendido a su manera y Gemini ni siquiera tiene un interruptor para apagarlo: allí «Desactivado» solo baja al nivel más bajo. Un modelo que no acepta el parámetro de su familia falla al validar la conexión.`)
};

const ru_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Расширенное мышление у каждого провайдера называется по-своему, а у Gemini его вообще нельзя отключить: «Выключено» лишь опускает его на минимальный уровень. Модель, которая не принимает параметр своего семейства, не пройдёт проверку соединения.`)
};

const pt_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cada fornecedor dá um nome diferente ao pensamento estendido e o Gemini nem sequer tem forma de o desativar: aí, «Desativado» apenas baixa para o nível mínimo. Um modelo que não aceita o parâmetro da sua família falha ao validar a ligação.`)
};

const it_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ogni provider chiama il pensiero esteso in modo diverso e Gemini non ha proprio un interruttore per spegnerlo: lì «Disattivo» scende soltanto al livello minimo. Un modello che non accetta il parametro della sua famiglia fallisce al momento di verificare la connessione.`)
};

const ar_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يسمّي كل مزوّد التفكير الموسّع باسم مختلف، ولا يملك Gemini خيار الإيقاف أصلًا — اختيار «إيقاف» فيه ينزل بالتفكير إلى أدنى مستوى فقط. والنموذج الذي لا يقبل معامل عائلته يفشل عند التحقق من الاتصال.`)
};

/**
* | output |
* | --- |
* | "Vendors spell extended thinking differently, and Gemini has no off switch at all — there, Off buys its lowest level instead. A model that refuses its family ..." |
*
* @param {Provider_Param_Reasoning_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_param_reasoning_desc = /** @type {((inputs?: Provider_Param_Reasoning_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Param_Reasoning_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_param_reasoning_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_param_reasoning_desc(inputs)
	if (locale === "en") return en_provider_param_reasoning_desc(inputs)
	if (locale === "ja") return ja_provider_param_reasoning_desc(inputs)
	if (locale === "ko") return ko_provider_param_reasoning_desc(inputs)
	if (locale === "fr") return fr_provider_param_reasoning_desc(inputs)
	if (locale === "de") return de_provider_param_reasoning_desc(inputs)
	if (locale === "es") return es_provider_param_reasoning_desc(inputs)
	if (locale === "ru") return ru_provider_param_reasoning_desc(inputs)
	if (locale === "pt") return pt_provider_param_reasoning_desc(inputs)
	if (locale === "it") return it_provider_param_reasoning_desc(inputs)
	return ar_provider_param_reasoning_desc(inputs)
});