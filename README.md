
# SWIPE-GAME

**SWIPE-GAME** is just a simple game that uses HTML, CSS and vanilla javascript by detecting the `mouseDown` , `touchstart` , `mouseup` , and `touchend` event lists.
**Demo Game** --- [HERE](https://swipe-game.netlify.app/)

## Features

This **SWIPE-GAME** provides a simple way of setting up a modern web development environment. Here is a list of the current features:

-  [**GULP 4**](https://gulpjs.com/) Automate and enhance your workflow.
-  [**ES2015 Babel**](https://babeljs.io/) transpiler that allows you writing JS Code in ES2015/ES6 style.
-  [**Sass**](http://sass-lang.com/): CSS pre-processor with [**gulp-autoprefixer**](https://www.npmjs.com/package/gulp-autoprefixer).
-  [**Browsersync**](https://browsersync.io/) with Live reload.
- **Minifies** and **optimize** your javascript.

  
  

## Requirements
This should be installed on your computer in order to get up and running:

-  [**Node.js**](https://nodejs.org/en/) Required node version is >= `10.0`
-  **npm** Version `6.0.*`

> If you've previously installed gulp globally, run `npm rm --global` gulp before following these instructions.

## Usage
As a prerequisite it's assumed you have `npm` or `yarn` installed.

1.  **Clone Repo**
	Make sure you have a **SWIPE-GAME** clone repository.
	```
	https://github.com/Alphabet-Team/swipe-game.git
	```

2.  **Gulp Setup**
	you just execute this script `npm install --global gulp-cli`, and make sure your Gulp CLI is currently in the version `2.0.*`

3.  **Install dependencies**
	```
	npm install
	```
	> if you have done the syntax above before, there is no need to do a step 3 process. but if you are not sure then just do it for check updated.

4.  **Serve or deploy**
	When we start the `serve` process, the task runner below has `env`  **development** and automatically `watch` the changes you make to the code.
	```
	yarn serve
	```
	or
	```
	npm run serve
	```
5. **Deployment**
	
	```
	yarn build
	```
	or
	```
	npm run build
	```
	
