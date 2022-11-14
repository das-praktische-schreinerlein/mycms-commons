export class ObjectUtils {
    public static mapValueToObjects(fieldValues: any, fieldName: string): {}[]  {
        const objects: {}[] = [];
        if (fieldValues !== undefined) {
            if (Array.isArray(fieldValues)) {
                fieldValues.forEach(fieldValue => {
                    const doc = {};
                    doc[fieldName] = fieldValue;
                    objects.push(doc);
                });
            } else {
                const doc = {};
                doc[fieldName] = fieldValues;
                objects.push(doc);
            }
        }

        return objects;
    }

    public static explodeValueToObjects(srcValue: string, objectSeparator: string, fieldSeparator: string,
                                        valueSeparator: string, unique = true): {}[] {
        let objectsSrcs = srcValue.split(objectSeparator);
        if (unique) {
            objectsSrcs = ObjectUtils.uniqueArray(objectsSrcs);
        }

        const objects: {}[] = [];
        for (let i = 0; i < objectsSrcs.length; i++) {
            if (objectsSrcs[i] === undefined || objectsSrcs[i] === null || objectsSrcs[i] === 'null' || objectsSrcs[i] === '') {
                continue;
            }

            const valuePairs = objectsSrcs[i].split(fieldSeparator);
            const detailDoc = {};
            for (let j = 0; j < valuePairs.length; j++) {
                const value = valuePairs[j].split(valueSeparator);
                detailDoc[value[0]] = value[1];
            }
            objects.push(detailDoc);
        }

        return objects;
    }

    public static mergePropertyValues(detailDocs: {}[], property: string, joiner: string, unique = true): string {
        let merged = [];
        detailDocs.forEach(doc => {
            if (doc[property] !== undefined && doc[property] !== null) {
                merged.push(doc[property]);
            }
        });

        if (unique) {
            merged = ObjectUtils.uniqueArray(merged);
        }

        return merged.join(joiner);
    }

    public static uniqueArray(arr: any[]): any[] {
        const keys = {}
        const result = [];

        for (let i = 0, length = arr.length; i < length; ++i){
            if (!keys.hasOwnProperty(arr[i])) {
                result.push(arr[i]);
                keys[arr[i]] = 1;
            }
        }

        return result;
    }

}
