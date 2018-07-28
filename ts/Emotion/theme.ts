import { css, styled } from "classui/Emotion";

export interface IThemeColors {
	color: string;
	colorDark: string;
	colorDarker: string;
	colorLight: string;
	contrast: string;
	[id: string]: any;
}

export interface IThemes {
	fb: IThemeColors;
	flat: IThemeColors;
	green: IThemeColors;
	offline: IThemeColors;
	pink: IThemeColors;
	iiitfb: IThemeColors;
}

export let Themes: IThemes = {
	fb: {
		color: "#3b5998",
		colorDark: "#355088",
		colorDarker: "#2f4779",
		colorLight: "#4e69a2",
		contrast: "white"
	},
	flat: {
		color: "#27a15a",
		colorDark: "#289254",
		colorDarker: "#217a45",
		colorLight: "#27AE60",
		contrast: "white"
	},
	green: {
		color: "#198719",
		colorDark: "#167916",
		colorDarker: "#146c14",
		colorLight: "#2f932f",
		contrast: "white"
	},
	offline: {
		color: "#424242",
		colorDark: "#1e1e1e",
		colorDarker: "#000000",
		colorLight: "#4e4e4e",
		contrast: "white"
	},
	pink: {
		color: "#fc3468",
		colorDark: "#ff084a",
		colorDarker: "#f50041",
		colorLight: "#ff6289",
		contrast: "white"
	},
	iiitfb: {
		color: "#009688",
		colorDark: "#00897B",
		colorDarker: "#00796B",
		colorLight: "#26A69A",
		contrast: "white"
	}
};

export interface ICColors {
	error: string;
	success: string;
}
export let CColors: ICColors = {
	error: "#ff1744",
	success: "green"
};

export interface IPColors {
	success: string;
	error: string;
	sunflower: string;
	carrot: string;
	grey: string;
}
export let PColors: IPColors = {
	carrot: "#E67E22",
	error: "#E74C3C",
	grey: "#95A5A6",
	success: "#27AE60",
	sunflower: "#F1C404"
};
