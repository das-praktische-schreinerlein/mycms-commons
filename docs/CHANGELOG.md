# Changelog of MyCMS
 
# Versions

## 6.0.0
- bumped up deps
- moved ValidationRules to commons
- introduced fully featured pdoc-services derived from cdoc
- moved track-colors to commons
- improved SqlAdapter with remapFulltextFilter
- improved BeanUtils with jsonStringify
- fixed global RegExp in StringUtils.createReplacementsFromConfigArray
- itemsjs: added spatial-search
- geoutils: added distance-calculation
- introduced fully featured markdown-support with extensions
- commons: fixed SqlQueryBuilder.extendTableConfig

### new features
- introduced fully featured pdoc-services derived from cdoc
- moved track-colors to commons
- itemsjs: added spatial-search
- geoutils: added distance-calculation
- introduced fully featured markdown-support with extensions
- frontend: make map-components generic

### improvements
- improved SqlAdapter with remapFulltextFilter
- improved BeanUtils with jsonStringify

### bug fixes
- fixed global RegExp in StringUtils.createReplacementsFromConfigArray
- DateUtils.formatToFileNameDate: fix format to YYYYMMDD
- StringUtils.generateTechnicalName: remove .+ from valid names (its used for filenames too)
- GeoUtils: prevent from setting empty string as altitude
- SearchCommon: improve usage of desc_txt, desc_md...
- commons: fixed SqlQueryBuilder.extendTableConfig
- fixed string-replace

### breaking changes
- bumped up deps
- moved ValidationRules to commons
- use StaticPagesDataService instead of PDocDataService


## 5.7.0 (2023-03-18)
- added mediameta-components
- improved geoUtils to createTrack+Route via commons parser and implemented for json too

### new features
- commons: added mediameta-components
- commons: improved geoUtils to createTrack+Route via commons parser and implemented for json too

### improvements
- none

### bug fixes
- none

### breaking changes
- none


## 5.6.0 (2023-01-19)
- improved itemsjs-adapter
- introduced itemjs-dataimporter
- added query-params to GenericSearchFormSearchFormConverter
- object/mapper-utils merge values to unique-values (default)
- fix remap of basejoins on import
- improved SearchParameterUtils to serialize forms
- synced functionality of sql-filter to solr, itemsjs
- fix invalid cache usage in datastore
- improved object-detection: add and use service-functions to create objects if not already defined
- object-utils ignore empty src on object-explode
- commons: extended fileutils to delete files and split json.files
- commons: add ProcessUtils
- commons: extend actiontag-blocked with visibility-value
- commons: moved common geo-functionality from frontend-commons to commons/geo-commons
- build: upgraded typescript
- commons: make export-naming configurable

### new features
- commons: introduced itemjs-dataimporter
- commons: extended fileutils to delete files and split json.files
- commons: add ProcessUtils
- commons: moved common geo-functionality from frontend-commons to commons/geo-commons

### improvements
- commons: improved itemsjs-adapter
- commons: added query-params to GenericSearchFormSearchFormConverter
- commons: improved SearchParameterUtils to serialize forms
- commons: synced functionality of sql-filter to solr, itemsjs
- commons: improved object-detection: add and use service-functions to create objects if not already defined
- commons: use serial promises on multisearch to prevent overload on database
- commons: extend actiontag-blocked with visibility-value
- build: upgraded typescript
- commons: make export-naming configurable

### bug fixes
- commons: object/mapper-utils merge values to unique-values (default)
- commons: fix remap of basejoins on import
- commons: fix invalid cache usage in datastore
- commons: object-utils ignore empty src on object-explode
- commons: use serial promises on multisearch to prevent overload on database

### breaking changes
- none


## 5.5.0 (2022-08-29)
- improved db-error messages
- improved symlink-handling for FileUtils
- added copy/move-dirs to FileUtils
- improved StringUtils
- fixed error-handling of FileUtils

### new features
- commons: - added copy/move-dirs to FileUtils
- commons: - improved StringUtils

### improvements
- commons: - improved symlink-handling for FileUtils

### bug fixes
- commons: - improved db-error messages
- commons: fixed error-handling of FileUtils

### breaking changes
- none


## 5.4.0 (2021-11-25)
- added support for ordering playlists 

### new features
- none

### improvements
- commons: added support for ordering playlists

### bug fixes
- none

### breaking changes
- none


## 5.3.0 (2021-05-13)
- added utils to generate passwords and override options in configfiles

### new features
- commons: added utils to generate passwords and override options in configfiles
- commons: added PasswordValidationRule

### improvements
- none

### bug fixes
- commons: fixed facetcache-sqlfile-executor

### breaking changes
- none


## 5.2.0 (2021-02-05)
- added support-utils for admin-server

### new features
- commons: added database-service with to execute common sql
- commons: added admin-responses for admin-server+frontend

### improvements
- commons: extend pdoc-model with additional flags
- commons: added service-functions to string/date/file-utils

### bug fixes
- none
 
### breaking changes
- none


## 5.1.0 (2020-12-20)
- improved search-services

### new features
- backend: added File/Name-Utils
- common: added BaseMusicMediaDocRecordType
- common: added batchProcessSearchResult to search+data-service
- common: added CommonDocDocExportService

### improvements
- common: fixed imports
- common: implemented common GenericSqlAdapter.extractTable

### bug fixes
- backend: made CommonSqlActionTagAssignJoinAdapter sqlite-compatible
- backend: fixed CommonSqlRateAdapter 
 
### breaking changes
- none


## 5.0.0 (2020-08-26)
- upgraded all dev-dependencies to latest
- build: use peerDependencies
- added and improved new mapperutil/string-functions

### new features
- common: added base-types for relations
- common: added base-entities for ExtendedObjectProperties, Joins
- common: added actiontag assignjoin
- common: added functions for string-replacements

### improvements
- none

### bug fixes
- BaseEntityRecordValidator: fixed null-values of prefixes 
 
### breaking changes
- build: upgraded all dev-dependencies to latest
- build: use peerDependencies
- GenericAdapterResponseMapper: renamed mapDetailResponseDocuments -> mapDetailDataToAdapterDocument and added new mapDetailResponseDocuments 


## 4.5.0 (2020-07-11)
- improved error-messages
- improved filter of sqlQueryBuilder

### new features
- none

### improvements
- improved error-messages
- sqlQueryBuilder: support for "notnull" in "IN," NOTIN"...

### bug fixes
- none 
 
### breaking changes
- none


## 4.4.0 (2020-05-24)
- bumped version up to be in sync with mycms-frontend-commons

### new features
- none

### improvements
- none

### bug fixes
- none 
 
### breaking changes
- none


## 4.3.0 (2020-03-20)
- moved full implementation of facetcache to commons
- improved build-process
- moved full implementation of navigation-objects and objectutils to commons
- moved full implementation of actions and actiontags to commons

### new features
- common: moved full implementation of facetcache to commons
- development: improved build-process - activated tests+coverage
- common: moved full implementation of navigation-objects and objectutils to commons
- common: moved full implementation of actions and actiontags to commons

### improvements
- common: delete-flag for actionTagForms to handle deleting-tags
- common: use parameter-substitution for sql


### bug fixes
- common: added optional responsetype to GenericSearchHttpAdapter for export  
- common: disabled js-data-cache in generic-datastore because of objects with different loadDetailsProfiles loaded
- common: fixed replacement of parameters in generic-sql-adapter - replace global
- common: fixed solr-query-builder
 
### breaking changes
- none


## 4.2.0 (2019-09-07)
- added new type+features for managing object-detection image-objects
- added facetcache

### new features
- common: added new type+features for managing object-detection image-objects
- common: added facetcache

### improvements
- common: improved null-handling for sql-filter
- common: improved beanutils to get array-values too
- common: added flag for special facets to read only if explicitly named
- common: added debug-messages for sql

### bug fixes
- none
 
### breaking changes
- none

### known issues
- none


## 4.1.0 (2019-02-11)
- improved build-process
- added new functions to strings and math-utils

### new features
- frontend: added new functions to strings and math-utils

### improvements
- improved build-process: cross-platform rm/mkdir/copy/patch

### bug fixes
- none 
 
### breaking changes
- none


## 4.0.0 (2018-11-07)
- bumped version up to be in sync with mycms

### new features
- none
 
### improvements
- none

### bug fixes
- none 
 
### breaking changes
- commons: set subtype for CommonDocRecords to not required


## 3.0.0 (2018-10-10)
- improvements for album/action/playlist-functionality
- improvements on validation

### new features
- commons: added CommonDocPlaylistService, CommonDocPlaylistExporter
- commons: added export-functionality to dataservice
 
### improvements
- commons: added sortRecords and getAvailableSorts SearchService 
- commons: check profileConfigs, multiRecordTags on actiontags
- commons: improved validation

### bug fixes
- none 
 
### breaking changes
- commons: changed validation


## 2.0.0 (2018-09-13)
- improved dependencies
- improved utils

### new features
- added string-utils
 
### improvements
- bumped up and improved dependencies
- improved actiontag-utils
 
### bug fixes
- none
 
### breaking changes
- none


## 1.0.0 (2018-09-02)
- initial version based on mytourbook-1.5.0

### new features
- none
 
### improvements
- initial version: everything is a improvement
 
### bug fixes
- initial version: none
 
### breaking changes
- initial version: none
