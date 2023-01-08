import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { AbstractBackendGeoService } from '../backend/abstract-backend-geo.service';
export interface GpxExportActionTagForm extends ActionTagForm {
    payload: {};
}
export declare class CommonActiontagGpxExportAdapter {
    private readonly backendGeoService;
    constructor(backendGeoService: AbstractBackendGeoService);
    executeActionTagExportGpx(table: string, id: number, actionTagForm: GpxExportActionTagForm): Promise<any>;
}
