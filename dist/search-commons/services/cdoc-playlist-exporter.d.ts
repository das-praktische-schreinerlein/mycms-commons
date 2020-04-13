import { CommonDocDataService } from './cdoc-data.service';
import { CommonDocSearchResult } from '../model/container/cdoc-searchresult';
import { CommonDocSearchForm } from '../model/forms/cdoc-searchform';
import { CommonDocRecord } from '../model/records/cdoc-entity-record';
import { CommonDocPlaylistService } from './cdoc-playlist.service';
export interface CommonDocPlaylistExporterConfig {
    maxAllowed: number;
}
export declare class CommonDocPlaylistExporter<R extends CommonDocRecord, F extends CommonDocSearchForm, S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> {
    protected dataService: D;
    protected playlistGenerator: CommonDocPlaylistService<R>;
    constructor(dataService: D, playlistGenerator: CommonDocPlaylistService<R>);
    exportPlaylist(playlistExportConfig: CommonDocPlaylistExporterConfig, searchForm: F): Promise<string>;
}
