# School Zone Notifications App

## Prevent speeding tickets.
Get notified when you're driving too fast near a school zone.

### Summary

This is an (unpublished and unlisted) React-Native mobile application that builds for both, ios, and android targets.
The backend is FastAPI Python and is being served by Nginx. The geo-spatial database used here is Neo4j with the [Neo4j-spatial-index](https://neo4j-contrib.github.io/spatial/) plugin.


### Build

- Install the node_modules in [SchoolZone]('./SchoolZone')
	```sh
		cd SchoolZone
		npm install
	```
- Setup the pre-build assets and native requirements per target by running `expo prebuild`.
- To start the development server: `expo start`
- Install the "Expo Go" app from one of the app stores.
- Scan the QR Code on the dev console to access the app.


### Distribute

- Costs :money_with_wings: :money_with_wings: :money_with_wings: to ship on App Store or Google Play Store. :sob:

### Data
The [LRS School Zone dataset](https://data.winnipeg.ca/City-Planning/LRS-School-Speed-Limits/k56t-9dvi) is made available through the [Winnipeg Open Data Portal](https://data.winnipeg.ca).

### License
GNU General Public License v3.0

