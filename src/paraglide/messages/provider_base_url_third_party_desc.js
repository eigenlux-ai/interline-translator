/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Base_Url_Third_Party_DescInputs */

const zh_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`示例地址属于第三方服务（Moonshot），并非官方端点；留空时请求将发往官方端点 https://api.anthropic.com/v1。`)
};

const zh_tw2_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`範例為第三方服務（Moonshot）的端點，並非官方端點；留空時請求會發往官方端點 https://api.anthropic.com/v1。`)
};

const en_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The example is a third-party service (Moonshot), not the official endpoint. Left blank, requests go to the official endpoint https://api.anthropic.com/v1.`)
};

const ja_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`例として示しているのはサードパーティサービス（Moonshot）のエンドポイントで、公式のものではありません。空欄の場合、リクエストは公式エンドポイント https://api.anthropic.com/v1 に送信されます。`)
};

const ko_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`예시는 타사 서비스(Moonshot)의 엔드포인트이며 공식 엔드포인트가 아닙니다. 비워 두면 공식 엔드포인트 https://api.anthropic.com/v1로 요청합니다.`)
};

const fr_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'exemple est un service tiers (Moonshot), et non le point de terminaison officiel. Si le champ est vide, les requêtes sont envoyées au point de terminaison officiel https://api.anthropic.com/v1.`)
};

const de_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Das Beispiel ist ein Drittanbieter-Dienst (Moonshot), nicht der offizielle Endpunkt. Bleibt das Feld leer, gehen Anfragen an den offiziellen Endpunkt https://api.anthropic.com/v1.`)
};

const es_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El ejemplo es un servicio de terceros (Moonshot), no el endpoint oficial. Si lo dejas vacío, las solicitudes se envían al endpoint oficial https://api.anthropic.com/v1.`)
};

const ru_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`В примере указан адрес стороннего сервиса (Moonshot), а не официальный. Если оставить поле пустым, запросы будут отправляться на официальный адрес https://api.anthropic.com/v1.`)
};

const pt_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`O exemplo é um serviço de terceiros (Moonshot), não o endpoint oficial. Se o campo ficar em branco, as solicitações vão para o endpoint oficial https://api.anthropic.com/v1.`)
};

const it_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'esempio è un servizio di terze parti (Moonshot), non l'endpoint ufficiale. Se lasci il campo vuoto, le richieste vengono inviate all'endpoint ufficiale https://api.anthropic.com/v1.`)
};

const ar_provider_base_url_third_party_desc = /** @type {(inputs: Provider_Base_Url_Third_Party_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المثال لخدمة طرف ثالث (Moonshot) وليس نقطة النهاية الرسمية. إذا تُرك الحقل فارغًا، تُرسَل الطلبات إلى نقطة النهاية الرسمية https://api.anthropic.com/v1.`)
};

/**
* | output |
* | --- |
* | "The example is a third-party service (Moonshot), not the official endpoint. Left blank, requests go to the official endpoint https://api.anthropic.com/v1." |
*
* @param {Provider_Base_Url_Third_Party_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_base_url_third_party_desc = /** @type {((inputs?: Provider_Base_Url_Third_Party_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Base_Url_Third_Party_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_base_url_third_party_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_base_url_third_party_desc(inputs)
	if (locale === "en") return en_provider_base_url_third_party_desc(inputs)
	if (locale === "ja") return ja_provider_base_url_third_party_desc(inputs)
	if (locale === "ko") return ko_provider_base_url_third_party_desc(inputs)
	if (locale === "fr") return fr_provider_base_url_third_party_desc(inputs)
	if (locale === "de") return de_provider_base_url_third_party_desc(inputs)
	if (locale === "es") return es_provider_base_url_third_party_desc(inputs)
	if (locale === "ru") return ru_provider_base_url_third_party_desc(inputs)
	if (locale === "pt") return pt_provider_base_url_third_party_desc(inputs)
	if (locale === "it") return it_provider_base_url_third_party_desc(inputs)
	return ar_provider_base_url_third_party_desc(inputs)
});