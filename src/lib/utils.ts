export function shortenfilename(file: string) {
	const parts = file.split('/');
	const idx = parts.findIndex((p) => p == 'src');
	if (idx == -1) {
		return file;
	}
	return parts.slice(idx + 1, parts.length).join('/');
}

export function shortenfilenamekeepmodule(file: string) {
	const parts = file.split('/');
	const idx = parts.findIndex((p) => p == 'src');
	if (idx < 1) {
		return file;
	}
	return parts.slice(idx - 1, parts.length).join('/');
}


export async function loaddocument(documents, docid: string, documentroot: string) {
	const url = `${documentroot}/${docid}.json`;
	const request = await fetch(url);
	const document = request.json();
	documents[docid] = await document;
	return document;
}