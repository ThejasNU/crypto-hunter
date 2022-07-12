module.exports = {
	corePlugins: {
		preflight: false,
	},
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				gold: "#FFD700",
			},
			fontFamily: {
				mont: "Montserrat",
			},
		},
	},
	plugins: [],
};
