# WebHost #

## Description ##

A simple static web server, powered by Express and Node.js.

## Requirements ##

* Node.js (`>=4.3.0`).
* express (`>=4.13.4`).

## Installation ##

0. `npm install`.
1. `node index.js`.

## Usage ##

The configuration file `config.json` controls the following:

* `rootDirectory`: Root directory of the static files.
* `errorPage`: Path to the HTML file to be sent when requested file cannot be found (i.e. [HTTP 404](http://en.wikipedia.org/wiki/HTTP_404)).
* `tls`: TLS options for HTTPS support. Set to `null` if HTTPS support is not needed.
    * `cert`: Path to public server certificate file.
    * `key`: Path to private server key file.
    * `ciphers`: Ciphers to use or exclude.
    * `dhParam`: Path to DH parameters file.
    * `port`: HTTPS server listening port.
* `port`: HTTP server listening port.

## Examples ##

Assuming you just want to have a HTTP web server running:

* Set `rootDirectory` to `"web"` (default value) or path to directory where Node.js has read permission.
* Set `errorPage` to `"web/404.html"` (default value) or path to the error page.
* Set `tls` to `null` (default value).
* Set `port` to `8080` (default value) or another port isn't currently used by another program.

## Known issues ##

* (None)

## TODO ##

* Access log.

## License ##

[The BSD 3-Clause License](http://opensource.org/licenses/BSD-3-Clause)
