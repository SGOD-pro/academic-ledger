export function toArray(data: any) {
	const arr: any[] = [];
	console.log("re-rendering to array");
	
	for (const key in data) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			const element = data[key];
			arr.push(element);
		}
	}
	return arr;
}
export function arrayDifference(oldArray: any[], newArray: any[]): { decrease: any[], increase: any[] } {
    const array1Set = new Set(oldArray);
    const array2Set = new Set(newArray);

    const decrease = oldArray.filter(element => !array2Set.has(element));
    const increase = newArray.filter(element => !array1Set.has(element));

    return { decrease, increase };
}