export function transformDataToList(data: Object): Array<string> {
	let arr: string[] = [];
	for (let val in data) {
		arr.push(val);
	}
	return arr.sort();
}
