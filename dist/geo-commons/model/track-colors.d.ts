import { Circular } from '../../commons/utils/hierarchy.utils';
export declare class TrackColors extends Circular {
    constructor(arr: string[], startIndex?: number);
}
export declare class DefaultTrackColors extends TrackColors {
    protected static colors: string[];
    constructor(startIndex?: number);
}
