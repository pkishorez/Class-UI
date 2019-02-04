import * as React from "react";

interface IImageGridProps {
	imageUrls: string[];
	prefix?: string;
}
export class ImageGrid extends React.Component<IImageGridProps> {
	render() {
		const { imageUrls, prefix = "" } = this.props;
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					flexWrap: "wrap",
					alignItems: "center"
				}}
			>
				{imageUrls.map((url, i) => (
					<div
						style={{
							border: "2px solid black",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexBasis: "50%",
							height: 200,
							overflow: "hidden",
							flexGrow: 1,
							textAlign: "center"
						}}
					>
						<img src={prefix + url} style={{ padding: 10, maxWidth: "100%", maxHeight: "100%" }} />
					</div>
				))}
			</div>
		);
	}
}
