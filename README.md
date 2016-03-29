# WebHost #

## Description ##

A simple static web server, powered by Express and Node.js.

## Requirements ##

* Node.js (`>=0.10.35`).
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
    * `ciphers`: Ciphers to use or exclude. Note that Node.js 0.10.x do not support ECDH ciphers.
    * `port`: The port to listen for incoming HTTPS request.
* `port`: The port to listen for incoming HTTP request.

## Examples ##

Assuming you just want to have a HTTP web server running:

* Set `rootDirectory` to `"web"` (default value) or path to directory where Node.js has read permission.
* Set `errorPage` to `"web/404.html"` (default value) or path to the error page.
* Set `tls` to `null` (default value).
* Set `port` to `8080` (default value) or another port isn't currently used by another program.

## Known issues ##

* (None)

## TODO ##

* Cache error page.
* Compression support.
* Expose more TLS options.

## License ##

[The BSD 3-Clause License](http://opensource.org/licenses/BSD-3-Clause)
