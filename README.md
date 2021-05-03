# WebHost #

## Description ##

A simple web server. WebHost is being used as the skeleton of more complex web
applications.

WebHost is expected to run behind a reverse proxy (e.g. HAProxy).

## Requirements ##

* Node.js (`>=12`).

## Installation ##

0. `npm clean-install --production`.

## Configuration ##

Make a copy of `.env.template` and name the new file as `.env`. The `.env` file
controls the following:

* `ROOT_DIRECTORY`: The root directory of files to be served by the web server.
                    The path is relative to the installation directory.
* `PORT`: The port that the server will listen on.
* `ERROR_PAGE`: The HTML file to be presented for HTTP 404 Not Found error. The
                path is relative to `ROOT_DIRECTORY`.
* `ACCESS_LOG`: Path of access log. The path is relative to the installation
                directory.

## Usage ##

Run:

```
node index.js
```

On OpenBSD, the script `control.sh` can be used to control WebHost.

Start WebHost:

```
sh control.sh start
```

Stop WebHost:

```
sh control.sh stop
```

Restart WebHost:

```
sh control.sh restart
```

Query WebHost running status:

```
sh control.sh status
```

## Build ##

Before building, install dependencies and remove the old build:

```
npm clean-install
npm run clean
```

To build the project for release, run:

```
npm run build-release
```

The `dist` directory contains files ready for release.

To build the project for testing, run:

```
npm run build-test
```

The `dist` directory contains files ready for testing.

## Testing ##

Build the project for testing, navigate to the `dist` directory and run:

```
npm clean-install
npm run test
```

## License ##

[The BSD 3-Clause License](http://opensource.org/licenses/BSD-3-Clause)
