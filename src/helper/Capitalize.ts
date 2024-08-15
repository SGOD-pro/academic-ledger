export function capitalizeWords(str: string | null) {
	if (str !== null) {
		str=str.toLowerCase();
		let words = str.split(" ");

		for (let i = 0; i < words.length; i++) {
			words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
		}

		return words.join(" ");
	}
    return ""
}
