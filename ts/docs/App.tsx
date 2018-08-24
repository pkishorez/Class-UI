import { Button } from "classui/Components";
import { Anim } from "classui/Helper/Anim";
import { ClassUI } from "classui/index";
import { NavBar } from "classui/Navbar";
import _ = require("lodash");
import * as React from "react";

export class App extends React.Component {
	render() {
		return (
			<ClassUI theme="iiitfb" fullHeight>
				<NavBar>
					<Button
						onClick={() => {
							this.forceUpdate();
						}}
					>
						Button
					</Button>
				</NavBar>
				<h2>Test</h2>
				<div style={{ maxHeight: 100 }}>
					<Anim
						style={{
							maxWidth: 100,
							margin: "auto",
							backgroundColor: "white"
						}}
					>
						{_
							.shuffle([
								"Kishore",
								"User1",
								"User2",
								"User5",
								"User6"
							])
							.map(key => (
								<div
									style={{
										padding: 10,
										backgroundColor: "green",
										color: "white",
										margin: 10
									}}
									key={key}
								>
									{key}
								</div>
							))}
					</Anim>
				</div>
			</ClassUI>
		);
	}
}
