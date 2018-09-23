import {
    BaseMediaRecord,
    BaseMediaRecordFactory,
    BaseMediaRecordType,
    BaseMediaRecordValidator
} from "./basemedia-record";

export interface BaseVideoRecordType extends BaseMediaRecordType {
    toString(): string;
}

export class BaseVideoRecord extends BaseMediaRecord implements BaseVideoRecordType {
    toString() {
        return 'BaseVideoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    }
}

export class BaseVideoRecordFactory {
    static getSanitizedValues(values: {}): any {
        return BaseMediaRecordFactory.getSanitizedValues(values);
    }

    static getSanitizedValuesFromObj(doc: BaseVideoRecord): any {
        return BaseMediaRecordFactory.getSanitizedValuesFromObj(doc);
    }
}

export class BaseVideoRecordValidator extends BaseMediaRecordValidator {
    public static instance = new BaseVideoRecordValidator();
}