# WebHost #

## Description ##

A simple web server. WebHost is being used as the skeleton of more complex web
applications.

WebHost is expected to run behind a reverse proxy (e.g. HAProxy).

## Requirements ##

* Node.js (`>=16`).

## Build ##

Run:

```
npm clean-install
npm run clean
npm run build-release
```

The `dist` directory contains files ready for deployment.

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

## Run ##

```
# Installation of dependencies is required for fresh deployment only.
npm clean-install --omit=dev

npm run start
```

On OpenBSD, the script `control.sh` can be used to control the application.

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

## Test ##

Run:

```
npm clean-install
npm run clean
npm run build-test

cd dist
npm clean-install
npm run test
```

All test cases should pass, and the report should look similar to the following:

```
  Dummy API
    ✔ the API is a teapot

  Health API
    ✔ can get health status

  Configurations module
    ✔ can load configurations

  Web server
    ✔ can serve static files
    ✔ can serve customized 404 page


  5 passing (52ms)
```

## License ##

[The BSD 3-Clause License](http://opensource.org/licenses/BSD-3-Clause)
