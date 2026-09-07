/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ball_Open_PanelInputs */

const zh_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`打开翻译面板`)
};

const zh_tw2_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`開啟翻譯面板`)
};

const en_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open control panel`)
};

const ja_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`コントロールパネルを開く`)
};

const ko_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`컨트롤 패널 열기`)
};

const fr_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir le panneau de contrôle`)
};

const de_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bedienfeld öffnen`)
};

const es_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abrir panel de control`)
};

const ru_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Открыть панель управления`)
};

const pt_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abrir painel de controle`)
};

const it_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apri il pannello di controllo`)
};

const ar_ball_open_panel = /** @type {(inputs: Ball_Open_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح لوحة التحكم`)
};

/**
* | output |
* | --- |
* | "Open control panel" |
*
* @param {Ball_Open_PanelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const ball_open_panel = /** @type {((inputs?: Ball_Open_PanelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ball_Open_PanelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_ball_open_panel(inputs)
	if (locale === "zh-TW") return zh_tw2_ball_open_panel(inputs)
	if (locale === "en") return en_ball_open_panel(inputs)
	if (locale === "ja") return ja_ball_open_panel(inputs)
	if (locale === "ko") return ko_ball_open_panel(inputs)
	if (locale === "fr") return fr_ball_open_panel(inputs)
	if (locale === "de") return de_ball_open_panel(inputs)
	if (locale === "es") return es_ball_open_panel(inputs)
	if (locale === "ru") return ru_ball_open_panel(inputs)
	if (locale === "pt") return pt_ball_open_panel(inputs)
	if (locale === "it") return it_ball_open_panel(inputs)
	return ar_ball_open_panel(inputs)
});