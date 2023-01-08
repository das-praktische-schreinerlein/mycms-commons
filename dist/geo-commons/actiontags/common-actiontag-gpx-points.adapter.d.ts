import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { AbstractBackendGeoService } from '../backend/abstract-backend-geo.service';
export interface GpxSavePointsActionTagForm extends ActionTagForm {
    payload: {};
}
export declare class CommonActiontagGpxSavePointsAdapter {
    private readonly backendGeoService;
    constructor(backendGeoService: AbstractBackendGeoService);
    executeActionTagGpxPointToDatabase(table: string, id: number, actionTagForm: GpxSavePointsActionTagForm): Promise<any>;
}
