// import untested service for code-coverage
import {StringUtils} from "./commons/utils/string.utils";
import {CommonSqlKeywordAdapter} from "./action-commons/actions/common-sql-keyword.adapter";
import {CommonSqlObjectDetectionAdapter} from "./action-commons/actions/common-sql-object-detection.adapter";
import {CommonSqlPlaylistAdapter} from "./action-commons/actions/common-sql-playlist.adapter";
import {CommonSqlRateAdapter} from "./action-commons/actions/common-sql-rate.adapter";

for (const a in [
    StringUtils,
    CommonSqlKeywordAdapter,
    CommonSqlObjectDetectionAdapter,
    CommonSqlPlaylistAdapter,
    CommonSqlRateAdapter
]) {
    console.log('import unused modules for codecoverage');
}

describe('Dummy-Test', () => {
    it('should be true', () => {
        expect(true).toBeTruthy();
    });
});
