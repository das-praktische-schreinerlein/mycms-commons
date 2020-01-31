import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { CommonSqlObjectDetectionAdapter } from '../actions/common-sql-object-detection.adapter';
export interface ObjectsActionTagForm extends ActionTagForm {
    payload: {
        detector: string;
        objectkey: string;
        precision: number;
        set: boolean;
    };
}
export interface ObjectsStateActionTagForm extends ActionTagForm {
    state: string;
}
export interface ObjectsKeyActionTagForm extends ActionTagForm {
    action: string;
    detector: string;
    objectcategory: string;
    objectkey: string;
    objectname: string;
    state: string;
}
export declare class CommonSqlActionTagObjectDetectionAdapter {
    private readonly keywordValidationRule;
    private readonly precisionValidationRule;
    private readonly commonSqlObjectDetectionAdapter;
    constructor(commonSqlObjectDetectionAdapter: CommonSqlObjectDetectionAdapter);
    executeActionTagObjects(table: string, id: number, actionTagForm: ObjectsActionTagForm, opts: any): Promise<any>;
    executeActionTagObjectsState(table: string, id: number, actionTagForm: ObjectsStateActionTagForm, opts: any): Promise<any>;
    executeActionTagObjectsKey(table: string, id: number, actionTagForm: ObjectsKeyActionTagForm, opts: any): Promise<any>;
}
