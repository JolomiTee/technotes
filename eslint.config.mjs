import config from "eslint-config-standard";

export default [
	{
		rules: {
			"no-unused-vars": "error",
			"no-undef": "error",
		},
	},
	...[].concat(config),
];
