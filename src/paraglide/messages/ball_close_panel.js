/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ball_Close_PanelInputs */

const zh_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`关闭面板`)
};

const zh_tw2_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`關閉面板`)
};

const en_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close panel`)
};

const ja_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`パネルを閉じる`)
};

const ko_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`패널 닫기`)
};

const fr_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fermer le panneau`)
};

const de_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Panel schließen`)
};

const es_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cerrar el panel`)
};

const ru_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Закрыть панель`)
};

const pt_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fechar o painel`)
};

const it_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chiudi il pannello`)
};

const ar_ball_close_panel = /** @type {(inputs: Ball_Close_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق اللوحة`)
};

/**
* | output |
* | --- |
* | "Close panel" |
*
* @param {Ball_Close_PanelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const ball_close_panel = /** @type {((inputs?: Ball_Close_PanelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ball_Close_PanelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_ball_close_panel(inputs)
	if (locale === "zh-TW") return zh_tw2_ball_close_panel(inputs)
	if (locale === "en") return en_ball_close_panel(inputs)
	if (locale === "ja") return ja_ball_close_panel(inputs)
	if (locale === "ko") return ko_ball_close_panel(inputs)
	if (locale === "fr") return fr_ball_close_panel(inputs)
	if (locale === "de") return de_ball_close_panel(inputs)
	if (locale === "es") return es_ball_close_panel(inputs)
	if (locale === "ru") return ru_ball_close_panel(inputs)
	if (locale === "pt") return pt_ball_close_panel(inputs)
	if (locale === "it") return it_ball_close_panel(inputs)
	return ar_ball_close_panel(inputs)
});