-- Add custom styling of ClassUI to your webapp using the following template.


@import './main';

@mixin customStyling() {
	.body {

	}
}

@include classui_theme("flat") {
	@include customStyling();
};