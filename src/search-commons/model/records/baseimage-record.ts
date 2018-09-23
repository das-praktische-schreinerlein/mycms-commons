import {
    BaseMediaRecord,
    BaseMediaRecordFactory,
    BaseMediaRecordType,
    BaseMediaRecordValidator
} from "./basemedia-record";

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

export class BaseImageRecordFactory {
    static getSanitizedValues(values: {}): any {
        return BaseMediaRecordFactory.getSanitizedValues(values);
    }

    static getSanitizedValuesFromObj(doc: BaseImageRecord): any {
        return BaseMediaRecordFactory.getSanitizedValuesFromObj(doc);
    }
}

export class BaseImageRecordValidator extends BaseMediaRecordValidator {
    public static instance = new BaseImageRecordValidator();
}