type CollectionReference = {
	path: string;
	id: string;
}

function parseCollectionReference(refValue: string): CollectionReference {
	const pathRegex = /Ref\(Collection\("(.+)"\), "(.+)"\)/;
	const match = pathRegex.exec(refValue);
	if (!match) {
		throw new Error(`Invalid user reference: ${refValue}`);
	}
	const [, collectionPath, documentId] = match;
	const path = `${collectionPath}/${documentId}`;
	return { path, id: documentId };
}

export { parseCollectionReference };