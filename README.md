# WebHost #

## Description ##

A simple static web server, powered by Node.js and Express. WebHost is developed to be used as the skeleton of more complex web applications.

WebHost is expected to run behind a reverse proxy (e.g. HAProxy).

## Requirements ##

* Node.js (`>=8.11.0`).

## Installation ##

0. `npm install --production`.

## Usage ##

The configuration file `config.json` controls the following:

* `rootDirectory`: Root directory of the static files. Default is `web`.
* `errorPage`: Path of the HTML file to be sent when requested file cannot be found (i.e. [HTTP 404](http://en.wikipedia.org/wiki/HTTP_404)). Default is `web/404.html`.
* `accessLog`: Path of access log. Default is `logs/access.log`.
* `port`: HTTP server listening port. Default is `8080`.

To start WebHost:

    node index.js

On OpenBSD, the script `start.sh` can be used to start WebHost in background:

    sh start.sh

## License ##

[The BSD 3-Clause License](http://opensource.org/licenses/BSD-3-Clause)
