/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Param_Reasoning_DescInputs */

const zh_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`实际效果取决于模型和服务商。对于 Gemini 及部分强制推理模型，选择“关闭”会降低推理强度或仍保留推理。修改后请验证连接。`)
};

const zh_tw2_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`實際效果取決於模型與服務商。對 Gemini 及部分強制推理模型而言，選擇「關閉」會降低推理強度或仍保留推理。修改後請驗證連線。`)
};

const en_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Behavior depends on the model and service. For Gemini and some models that require reasoning, Off reduces reasoning or leaves it enabled. Validate the connection after changing this setting.`)
};

const ja_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`動作はモデルとサービスによって異なります。Gemini や推論が必須の一部モデルでは、オフにしても推論が弱まるだけか、有効なままになります。変更後は接続を検証してください。`)
};

const ko_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`동작은 모델과 서비스에 따라 다릅니다. Gemini와 일부 추론 필수 모델은 끄기를 선택해도 추론 강도만 낮아지거나 추론이 유지됩니다. 변경 후 연결을 검증해 주세요.`)
};

const fr_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le comportement dépend du modèle et du service. Pour Gemini et certains modèles à raisonnement obligatoire, « Désactivé » réduit le raisonnement ou le laisse actif. Validez la connexion après toute modification.`)
};

const de_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Das Verhalten hängt von Modell und Dienst ab. Bei Gemini und einigen Modellen mit verpflichtendem Reasoning reduziert „Aus“ die Denkleistung oder lässt sie aktiv. Prüfen Sie die Verbindung nach Änderungen.`)
};

const es_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El comportamiento depende del modelo y del servicio. En Gemini y algunos modelos con razonamiento obligatorio, «Desactivado» reduce el razonamiento o lo mantiene activo. Valida la conexión después de cambiar esta opción.`)
};

const ru_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Поведение зависит от модели и сервиса. Для Gemini и некоторых моделей с обязательным рассуждением «Выключено» снижает его интенсивность или оставляет его включённым. После изменения проверьте соединение.`)
};

const pt_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`O comportamento depende do modelo e do serviço. No Gemini e em alguns modelos com raciocínio obrigatório, “Desativado” reduz o raciocínio ou o mantém ativo. Valide a conexão após alterar esta opção.`)
};

const it_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il comportamento dipende dal modello e dal servizio. Per Gemini e alcuni modelli con ragionamento obbligatorio, «Disattivo» riduce il ragionamento o lo lascia attivo. Verifica la connessione dopo ogni modifica.`)
};

const ar_provider_param_reasoning_desc = /** @type {(inputs: Provider_Param_Reasoning_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يعتمد السلوك على النموذج والخدمة. في Gemini وبعض النماذج التي تتطلب الاستدلال، يقلّل خيار «إيقاف» الاستدلال أو يبقيه مفعّلًا. تحقّق من الاتصال بعد تغيير هذا الإعداد.`)
};

/**
* | output |
* | --- |
* | "Behavior depends on the model and service. For Gemini and some models that require reasoning, Off reduces reasoning or leaves it enabled. Validate the connec..." |
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