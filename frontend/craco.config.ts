import path from "path";

const config = {
	webpack: {
		alias: {
			"@colors": path.resolve(__dirname, "src/public/colors.scss"),
		},
	},
};

export default config;
