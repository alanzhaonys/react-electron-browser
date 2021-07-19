![Screenshot](/screenshot1.jpeg?raw=true "Screenshot 1")

Tutorials:

Electron and React
- https://www.codementor.io/randyfindley/how-to-build-an-electron-app-using-create-react-app-and-electron-builder-ss1k0sfer
- https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/

Customize create-react-app:
- https://auth0.com/blog/how-to-configure-create-react-app/

Version
- Node v14 is required

How to use this project?
- Fork and clone
- Edit app info in package.json
- Edit port # in package.json
- Edit app info public/manifest.json
- Edit title in public/index.html
- Update src/images/logo.svg and splash screen design in public/index.html

Prerequisites
- Run `yarn install`

To start development in Electron
- Run `yarn dev`

To start development in browser. This is not possible if you're use modules like `fs` and `mysql`
- Run `yarn start`

To build
- Run `yarn build`

To test
- Run `yarn test`

To generate coverage report
- Run `yarn cover`

To package
- Run `yarn package`

Hosting
On Apache:
You need to add Web.config to redirect all 404 to index.html, see public/.htaccess

On IIS:
You need to add Web.config to redirect all 404 to index.html, see public/Web.config

On S3:
You need to point 404 to index.html for routes to work
https://stackoverflow.com/questions/51218979/react-router-doesnt-work-in-aws-s3-bucket
