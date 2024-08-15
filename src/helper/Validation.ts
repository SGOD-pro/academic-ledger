export function validAdmissionNo(value: string):boolean {
	const regex = /^CA-\d{2}\/\d{2}-\d+$/;
	return regex.test(value);
}