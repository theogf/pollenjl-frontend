import type { IDocumentNode } from "$lib/documents/types";
import { getTitleAttrs } from "./viewers/types";
import type { IDocumentTitle } from "./viewers/types";

export type DocumentID = string;

export interface IDocumentLoader {
    load(documentID: DocumentID): Promise<IDocumentNode>;
    hasDocument(documentID: DocumentID): boolean;
    getTitle(documentID: DocumentID): IDocumentTitle;
    get(documentID: DocumentID): IDocumentNode;
}


export class HTTPDocumentLoader implements IDocumentLoader {

    cache: Record<DocumentID, IDocumentNode>[] = []; s
    basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    load(documentId: DocumentID): Promise<IDocumentNode> {
        if (documentId in this.cache) {
            const doc = this.cache[documentId];
            return Promise.resolve(doc)
        }
        else {
            const url = `${this.basePath}/${documentId}.json`
            return fetch(url).then(response => {
                if (!response.ok) {
                    return Promise.reject({ status: response.status, statusText: response.statusText });
                } else {
                    return response.json()
                }
            }).then(responseJson => {
                this.cache[documentId] = responseJson
                return (responseJson as IDocumentNode)
            }).catch(errorJson => {
                return Promise.reject(errorJson)
            })
        }
    }

    hasDocument(documentId: DocumentID) {
        return (documentId in this.cache)
    }

    get(documentId: DocumentID): IDocumentNode | null {
        return this.cache[documentId]
    }

    getTitle(documentId: DocumentID): IDocumentTitle {
        if (this.hasDocument(documentId) && documentId.startsWith('documents')) {
            const doc = this.get(documentId)
            if (doc.attributes.title != null) {
                return { kind: 'document', text: doc.attributes.title }
            }
        }
        return getTitleAttrs(documentId)
    }

}