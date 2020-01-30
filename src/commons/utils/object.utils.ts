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
                                        valueSeparator: string): {}[] {
        const objectsSrcs = srcValue.split(objectSeparator);
        const objects: {}[] = [];
        for (let i = 0; i < objectsSrcs.length; i++) {
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

    public static mergePropertyValues(detailDocs: {}[], property: string, joiner: string): string {
        const merged = [];
        detailDocs.forEach(doc => {
            if (doc[property] !== undefined && doc[property] !== null) {
                merged.push(doc[property]);
            }
        });

        return merged.join(joiner);
    }

}
