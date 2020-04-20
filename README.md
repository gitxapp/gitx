<h1 align="center">
  <br>
  <a href="https://chrome.google.com/webstore/detail/gitx-private-notes-for-gi/mheimfkblidpjbpdinfcipgggfdkinoe"><img src="icons/icon128.png" alt="GitX" width="200"></a>

</h1>

<h4 align="center">Chrome extension for adding private comments in Github
</h4>

<div align="center">
  Built with ❤︎  
</div>

<p align="center">
  <img src="https://img.shields.io/github/commit-activity/m/gitxapp/gitx" alt="Commits-per-month">
  <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PR-Welcome"></a>
  <img src="https://img.shields.io/github/license/gitxapp/gitx" alt="License">
 
</p>

<p align="center">
	<a href="https://www.buymeacoffee.com/muhzi" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</p>

## Getting started

#### Clone the project

```sh
# clone it
git clone https://github.com/gitxapp/gitx.git
cd gitx
```

## Preliminary Steps

#### Create a new app in Github

- Create a new oauth app in github by going to https://github.com/settings/developers
- Set call back url as http://localhost:5000/api/v1/oauth/redirect

#### Setup environment variables for back end

Add `.env` file under the top level of the project.

Add the following details

```
DB_URI = 'mongodb://localhost/gitx'
GITHUB_CLIENT_ID = <GITHUB_APP_CLIENT_ID>
GITHUB_CLIENT_SECRET = <GITHUB_APP_CLIENT_SECRET>
JWT_KEY = <JWT_KEY>
REDIS_URL = 'redis://127.0.0.1:6379'
HEROKU_URL= <HEROKU_URL>
WELCOME_URL='https://gitxapp.com/welcome.html'

```

#### Setup environment variables for chrome extension

Add `constants.js` file under the `src` folder

Add the following details

```
export const VERSION = "v1";
export const INSTALL_URL = "https://gitxapp.com/connect.html";
export const UN_INSTALL_URL = "https://gitxapp.com/uninstall.html";
export const URL = "http://localhost:5000/api/";
export const REDIRECT_URL = "GITHUB_CALLBACK_URL";
export const APP_ID = "GITHUB_APP_CLIENT_ID";

```

## Running the project

#### Run the back end

```
# Install dependencies
yarn install
# Start the app
yarn server

```

#### Run chrome extension

```
# Make a build
yarn client
```

```
# Open chrome://extensions/ from your chrome browser and enable Developer mode
```

```
# Click on "Load unpacked" button and upload the build folder
```

## Feedback & Contributing

Feel free to send us feedback on [Twitter](https://twitter.com/GitXApp) or [file an issue](https://github.com/gitxapp/gitx/issues).

_Gitxapp_ &copy; 2019-2020 - Released under the MIT License.
