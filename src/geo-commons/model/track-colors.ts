import {Circular} from '../../commons/utils/hierarchy.utils';

export class TrackColors extends Circular {
    constructor(arr: string[], startIndex?: number) {
        super(arr, startIndex);
    }
}

export class DefaultTrackColors extends TrackColors {
    protected static colors = ['blue', 'green', 'red', 'yellow', 'darkgreen'];

    constructor(startIndex?: number) {
        super(DefaultTrackColors.colors, startIndex);
    }
}

