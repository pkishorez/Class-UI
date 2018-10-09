import emotionStyled, { CreateStyled, css } from "react-emotion";
import { IThemeColors } from "./theme";
export {
	Themes,
	IThemes,
	IThemeColors,
	PColors,
	IPColors
} from "./theme";

export let styled = emotionStyled as any; // CreateStyled<IThemeColors>;

export { cx, css } from "react-emotion";

export interface IHoverable {
	active?: boolean;
	disable?: boolean;
}
export let Hoverable = (props?: IHoverable) => css`
	cursor: pointer;
	&:hover {
		background-color: #dddddd;
	}
	${props && props.active
		? `
		&, &:hover {
			background-color: #DDDDDD;
		}`
		: undefined} ${props && props.disable
		? `
		&, :hover{
			background-color: inherit;
			cursor: default;
			color: grey;
		}`
		: undefined};
`;
