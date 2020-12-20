# MyCMS-Commons

MyCMS is a library for developing CMS-applications.
It's the software-stack behind the new portal-version [www.michas-ausflugstipps.de](https://www.michas-ausflugstipps.de/). 

For more information take a look at documentation:
- [changelog](docs/CHANGELOG.md) 
- [credits for used libraries](docs/CREDITS.md)

MyCMS-Commons contains the commons services+utils for clients+servers.

Some amazing features:
- common utils+services as geolocation, http-backends, name+file+string-utils...
- object-detection generic and abstract services, models, processors 
- faceting, facets-cache to improve performance of sql-datastores
- actions with form and sql as rating, managing (keyword, playlist, join), objects-detection
- CommonDoc as base-entity for datamanagement CRUD, search usable in client and server 
     - model, interfaces, predefined implemnetation as (image, video, navigation...), validators, forms, services, dtos...
     - datastore (sql, solr, inmemory...)
- PageDoc model as implementation of CommonDoc for pages with content and navigation
