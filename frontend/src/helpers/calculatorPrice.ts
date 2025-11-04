import { CleaningType } from "../pages/Main/components/Application/Application";

type CalcT = {
	oil: number;
	countCleaners: number;
	chemistry: number;
	salary: number;
	square: number;
	koefSquare: number;
	koefMarketing: number;
	koefMarge: number;
};

const calcData: Record<CleaningType, Omit<CalcT, "square">> = {
	exrpess: {
		oil: 600,
		chemistry: 300,
		salary: 1000,
		koefSquare: 20,
		koefMarketing: 1.3,
		koefMarge: 1.4,
		countCleaners: 1,
	},
	comfort: {
		oil: 600,
		chemistry: 500,
		salary: 1500,
		koefSquare: 25,
		koefMarketing: 1.25,
		koefMarge: 1.4,
		countCleaners: 2,
	},
	elite: {
		oil: 600,
		chemistry: 1000,
		salary: 3000,
		koefSquare: 50,
		koefMarketing: 1,
		koefMarge: 1.4,
		countCleaners: 3,
	},
};

export default function calculatorPrice(
	square: number,
	typeCleaning: CleaningType,
) {
	const type = calcData[typeCleaning];
	return Math.round(
		(type.oil + type.chemistry + (type.salary + square * type.koefSquare)) *
			type.koefMarge *
			type.koefMarketing,
	);
}
