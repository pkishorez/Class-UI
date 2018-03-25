import { styled, css } from "classui/Emotion";

export interface IThemeColors {
	color: string
	colorDark: string
	colorDarker: string

	colorLight: string

	contrast: string

	[id: string]: any
}

export interface IThemes {
	fb: IThemeColors,
	flat: IThemeColors,
	green: IThemeColors
};

export let Themes: IThemes = {
	fb: {
		color: "#3b5998",
		contrast: "white",
		colorDark: "#355088",
		colorDarker: "#2f4779",
		colorLight: "#4e69a2"
	},
	flat: {
		color: "#27a15a",
		contrast: "white",
		colorDark: "#289254",
		colorDarker: "#217a45",
		colorLight: "#27AE60"
	},
	green: {
		color: "#198719",
		contrast: "white",
		colorDark: "#167916",
		colorDarker: "#146c14",
		colorLight: "#2f932f",
	}
};

export let CColors = {
	error: "#ff1744",
	success: "green"
}

export interface IPColors {
	success: string
	error: string
	sunflower: string
	carrot: string
	grey: string
}
export let PColors: IPColors = {
	success: "#27AE60",
	error: "#E74C3C",
	sunflower: "#F1C404",
	carrot: "#E67E22",
	grey: "#95A5A6"
}