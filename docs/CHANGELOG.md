# Changelog of MyCMS
 
# Versions
 
## Planned
- none

### new features
- none

### improvements
- none

### bug fixes
- none 
 
### breaking changes
- none


## 4.4.0
- bumped version up to be in sync with mycms-frontend-commons

### new features
- none

### improvements
- none

### bug fixes
- none 
 
### breaking changes
- none


## 4.3.0
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


## 4.2.0
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


## 4.1.0
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


## 4.0.0
- bumped version up to be in sync with mycms

### new features
- none
 
### improvements
- none

### bug fixes
- none 
 
### breaking changes
- commons: set subtype for CommonDocRecords to not required


## 3.0.0
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


## 2.0.0
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


## 1.0.0
- initial version based on mytourbook-1.5.0

### new features
- none
 
### improvements
- initial version: everything is a improvement
 
### bug fixes
- initial version: none
 
### breaking changes
- initial version: none
