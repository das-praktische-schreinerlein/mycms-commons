import {utils} from 'js-data';
import {CommonDocDataService} from './cdoc-data.service';
import {CommonDocSearchResult} from '../model/container/cdoc-searchresult';
import {CommonDocSearchForm} from '../model/forms/cdoc-searchform';
import {CommonDocRecord} from '../model/records/cdoc-entity-record';
import {CommonDocPlaylistService} from './cdoc-playlist.service';

export interface CommonDocPlaylistExporterConfig {
    maxAllowed: number;
}

export class CommonDocPlaylistExporter <R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> {
    public constructor(protected dataService: D, protected playlistGenerator: CommonDocPlaylistService<R>) {

    }

    public exportPlaylist(playlistExportConfig: CommonDocPlaylistExporterConfig, searchForm: F): Promise<string> {
        const me = this;
        searchForm.perPage = 100;
        searchForm.pageNum = 1;
        const cDocPlaylistChunks = [this.playlistGenerator.generateM3uHeader()];

        const createNextPlaylist = function(): Promise<any> {
            return me.dataService.search(searchForm).then(
                function searchDone(searchResult: S) {
                    if (playlistExportConfig.maxAllowed < searchResult.recordCount) {
                        console.error('to much records');
                        throw new Error('records to export as playlist exceeds maximum allowed '
                            + searchResult.recordCount + '>' + playlistExportConfig.maxAllowed);
                    }

                    const playlistEntries = [];
                    for (const doc of searchResult.currentRecords) {
                        playlistEntries.push(me.playlistGenerator.generateM3uEntryForRecord('', doc));
                    }

                    searchForm.pageNum++;
                    cDocPlaylistChunks.push(playlistEntries.join('\n'));
                    if (searchForm.pageNum < (searchResult.recordCount / searchForm.perPage + 1)) {
                        return createNextPlaylist();
                    } else {
                        return utils.resolve(cDocPlaylistChunks.join('\n'));
                    }
                }
            ).catch(function searchError(error) {
                console.error('error thrown: ', error);
                return utils.reject(error);
            });
        };

        return createNextPlaylist();
    }
}
