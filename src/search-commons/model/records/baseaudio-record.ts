import {
    BaseMediaRecord,
    BaseMediaRecordFactory,
    BaseMediaRecordType,
    BaseMediaRecordValidator
} from "./basemedia-record";

export interface BaseAudioRecordType extends BaseMediaRecordType {
}

export class BaseAudioRecord extends BaseMediaRecord implements BaseAudioRecordType {

    getMediaId(): string {
        return 'notimplemented';
    }
    toString() {
        return 'BaseAudioRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    }
}

export class BaseAudioRecordFactory {
    static getSanitizedValues(values: {}): any {
        return BaseMediaRecordFactory.getSanitizedValues(values);
    }

    static getSanitizedValuesFromObj(doc: BaseAudioRecord): any {
        return BaseMediaRecordFactory.getSanitizedValuesFromObj(doc);
    }
}

export class BaseAudioRecordValidator extends BaseMediaRecordValidator {
    public static instance = new BaseAudioRecordValidator();
}