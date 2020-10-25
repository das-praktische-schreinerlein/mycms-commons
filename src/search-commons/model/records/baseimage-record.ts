import {
    BaseMediaRecord,
    BaseMediaRecordFactory,
    BaseMediaRecordType,
    BaseMediaRecordValidator
} from './basemedia-record';

export interface BaseImageRecordType extends BaseMediaRecordType {
}

export class BaseImageRecord extends BaseMediaRecord implements BaseImageRecordType {
    getMediaId(): string {
        return 'notimplemented';
    }
    toString() {
        return 'BaseImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    }
}

export class BaseImageRecordFactory extends BaseMediaRecordFactory {
    public static instance = new BaseImageRecordFactory();

    static createSanitized(values: {}): BaseImageRecord {
        const sanitizedValues = BaseImageRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseImageRecord(sanitizedValues);
    }

    static cloneSanitized(doc: BaseImageRecord): BaseImageRecord {
        const sanitizedValues = BaseImageRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseImageRecord(sanitizedValues);
    }
}

export class BaseImageRecordValidator extends BaseMediaRecordValidator {
    public static instance = new BaseImageRecordValidator();
}
