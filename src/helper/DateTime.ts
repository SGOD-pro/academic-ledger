export function extractTime(dateString: string): string {
	const date = new Date(dateString);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
}
export function extractDate(dateString: string | Date): string {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth()).toString().padStart(2, "0");
	const year = date.getFullYear();
	if (!day||!month||!year) {
		return "NIL";
	}
	return `${day}-${month}-${year}`;
}
export function monthsDifference(
	date1: Date | string,
	date2: Date | string
): number {
	const startDate = new Date(date1 < date2 ? date1 : date2);
	const endDate = new Date(date1 < date2 ? date2 : date1);

	const startYear = startDate.getFullYear();
	const startMonth = startDate.getMonth();
	const startDay = startDate.getDate();
	const endYear = endDate.getFullYear();
	const endMonth = endDate.getMonth();
	const endDay = endDate.getDate();

	let yearDiff = endYear - startYear;
	let monthDiff = endMonth - startMonth;

	if (endDay < startDay) {
		monthDiff -= 1;
	}

	const totalMonths = yearDiff * 12 + monthDiff;

	return totalMonths<0?0:totalMonths;
}
const monthsArray: string[] = [
	"January",
	"Febuary",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export function getFeesMonthNames(dateObj: Date | string, numMonths: number) {
	const startDate = extractDate(dateObj);

	const dateParts = startDate.split("-");
	const day = parseInt(dateParts[0], 10);
	const month = parseInt(dateParts[1], 10) - 1;
	const year = parseInt(dateParts[2], 10);

	let currentMonth = month;
	let currentYear = year;
	const result = [];

	for (let i = 0; i < numMonths; i++) {
		result.push(monthsArray[currentMonth]);
		currentMonth++;
		if (currentMonth === 12) {
			currentMonth = 0;
			currentYear++;
		}
	}

	return result.join(", ");
}
export function getMonthName(dateObj: Date): string {
	const date = new Date(dateObj);
	const index = date.getMonth();
	return monthsArray[index];
}
export function getNextMonth(dateObj: Date): Date {
	const latestPaidMonth = new Date(dateObj);
	latestPaidMonth.setFullYear(latestPaidMonth.getFullYear());
	latestPaidMonth.setMonth(latestPaidMonth.getMonth() + 1);
	return latestPaidMonth;
}