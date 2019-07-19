# Basic requirements

## xcode

1.  Install xcode from app store
1.  Open xcode and agree to license and finish the installation

## Install node.js and npm with [nvm](https://github.com/creationix/nvm)

1.  `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`
1.  `nvm install node`
1.  `nvm alias default node`

## Global packages

1.  `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
1.  `npm install -g create-react-app`
1.  `brew install watchman`

# Install, compile, and run

* `npm install` then
* `npm start` - for development mode, or
* `npm run build` then `npm run prod-server` for production mode
