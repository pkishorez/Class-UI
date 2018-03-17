import * as React from 'react';
import {ClassUI, NavBar, NavbarRemain} from '../ts/index';
import {Button, Div, Dropdown as DD} from '../ts/Components/index';
import {addDecorator} from '@storybook/react';

addDecorator(story=>{
	return <ClassUI fullHeight EnableRouting style={{
		display: "flex",
		flexDirection: "column"
	}}>
		<NavBar logo="Class-UI">
			<NavbarRemain />
			<DD.Dropdown push="left" button="Theme">
				{
					(d: any)=>{
						return ["fb", "flat", "offline", "gcolor"].map(c=>
							<DD.DItem key={c} onClick={()=>{
								ClassUI.setTheme(c as any);
								d();
							}}>{c.toUpperCase()}</DD.DItem>
						)
					}
				}
			</DD.Dropdown>
		</NavBar>
		<Div style={{
			flexGrow: 1,
			display: 'flex',
			justifyContent: "center",
			alignItems: "flex-start"
		}}>
			<Div card="2" style={{
				backgroundColor: "white",
				padding: 10,
				width: "100%",
				maxWidth: 800
			}}>
				{story()}
			</Div>
		</Div>
	</ClassUI>
})
