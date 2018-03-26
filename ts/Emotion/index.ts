import emotionStyled, {ThemedReactEmotionInterface, css} from 'react-emotion';
import { IThemeColors } from './theme';
export {Themes, IThemes, IThemeColors, PColors} from './theme';

import './reset';
export let styled = emotionStyled as ThemedReactEmotionInterface<IThemeColors>
export {cx, css} from 'react-emotion';

export interface IHoverable {
	active?: boolean
	disable?: boolean
}
export let Hoverable = (props?: IHoverable)=>css`
	cursor: pointer;
	&:hover {
		background-color: #DDDDDD;
	}
	${props && props.active?`
		&, &:hover {
			background-color: #DDDDDD;
		}`:undefined}
	${props && props.disable?`
		&, :hover{
			background-color: inherit;
			cursor: default;
			color: grey;
		}`:undefined}
`;