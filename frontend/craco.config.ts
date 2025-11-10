import path from "path";

const config = {
	webpack: {
		alias: {
			"@colors": path.resolve(__dirname, "src/public/colors.scss"),
			"@fonts": path.resolve(__dirname, "src/public/font/font.scss"),
		},
	},
};

export default config;
