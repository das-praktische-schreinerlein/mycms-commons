export abstract class BeanUtils {
    public static getAttributeValue(object: any, attribute: string): any {
        if (object === undefined || object === null || attribute === undefined) {
            return undefined;
        }
        if (object[attribute] !== undefined) {
            return object[attribute];
        }
        if (typeof object['get'] === 'function' && object.get(attribute) !== undefined) {
            return object.get(attribute);
        }

        return object[attribute];
    }

    public static getValue(record: any, property: string): any {
        if (record === undefined) {
            return undefined;
        }

        if (record[property] !== undefined) {
            return record[property];
        }

        const hierarchy = property.split('.');
        let context = record;
        let arrayRegexp = /([a-zA-Z]+)(\[(\d)\])+/; // matches:  item[0]
        let arrayMatch = null;
        let key, idx, arrayKey, arrayValue, value, propName;
        for (let i = 0; i < hierarchy.length; i++) {
            if (context === undefined) {
                return undefined;
            }

            key = hierarchy[i];
            arrayMatch = arrayRegexp.exec(key);
            if (arrayMatch !== null) {
                // check for array
                idx = arrayMatch[3];
                arrayKey = arrayMatch[1];

                arrayValue = BeanUtils.getAttributeValue(context, arrayKey);
                if (!Array.isArray(arrayValue)) {
                    return undefined;
                }
                if (!arrayValue.length > idx) {
                    return undefined;
                }

                context = arrayValue[idx];
            } else {
                context = BeanUtils.getAttributeValue(context, key);
            }

            propName = hierarchy.slice(i + 1, hierarchy.length).join('.');
            value = BeanUtils.getAttributeValue(context, propName);
            if (value) {
                return value;
            }
        }

        return context;
    }

    public static jsonStringify(object: any, whiteList ?: string[], blackList ?: string[], removeBuffersGreaterThan ?: number): string {
        if (!object) {
            return undefined;
        }

        return JSON.stringify(object, (key, value) => {
            if (value === null || value === undefined) {
                return undefined;
            }

            if (whiteList && whiteList.length > 0 && !whiteList.includes(key)) {
                return undefined;
            }

            if (blackList && blackList.length > 0 && blackList.includes(key)) {
                return undefined;
            }

            if (removeBuffersGreaterThan !== undefined && removeBuffersGreaterThan > -1 &&
                (
                    (value['type'] === 'Buffer' && value['data'] && value['data'].length > removeBuffersGreaterThan) ||
                    (Buffer.isBuffer(value) && value.length > removeBuffersGreaterThan)
                )) {
                return undefined;
            }

            if ((typeof value === 'string' || value instanceof String)) {
                value = value.trim();
            }

            return value;
        });
    }

}
