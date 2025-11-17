import { CleaningType } from "../pages/Main/components/Application/Application";

type CalcT = {
	oil: number;
	countCleaners: number;
	chemistry: number;
	salary: number;
	square: number;
	koefSquare: number;
	koefSalary: number;
	koefMarketing: number;
	koefMarge: number;
};

const calcData: Record<CleaningType, Omit<CalcT, "square">> = {
	express: {
		oil: 1000,
		chemistry: 500,
		salary: 1000,
		koefSalary: 20,
		koefMarketing: 1.25,
		koefMarge: 1.4,
		countCleaners: 1,
		koefSquare: 60,
	},
	comfort: {
		oil: 1000,
		chemistry: 1000,
		salary: 1500,
		koefSalary: 100,
		koefMarketing: 1.25,
		koefMarge: 1.4,
		countCleaners: 2,
		koefSquare: 30,
	},
	elite: {
		oil: 1000,
		chemistry: 2000,
		salary: 3000,
		koefSalary: 120,
		koefMarketing: 1.25,
		koefMarge: 1.4,
		countCleaners: 3,
		koefSquare: 20,
	},
};

export default function calculatorPrice(
	square: number,
	typeCleaning: CleaningType,
) {
	const type = calcData[typeCleaning];
	const salary =
		type.salary * Math.ceil(square / type.koefSquare) +
		type.koefSalary * square;
	const costYourself =
		(salary + type.chemistry + type.oil) * type.koefMarketing;
	return Math.round(costYourself * type.koefMarge);
}
