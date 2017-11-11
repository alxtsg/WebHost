# WebHost #

## Description ##

A simple static web server, powered by Node.js and Express.

## Requirements ##

* Node.js (`>=6.10.1`).

## Installation ##

0. `npm install --production`.

## Usage ##

The configuration file `config.json` controls the following:

* `rootDirectory`: Root directory of the static files. Default is `web`.
* `errorPage`: Path of the HTML file to be sent when requested file cannot be found (i.e. [HTTP 404](http://en.wikipedia.org/wiki/HTTP_404)). Default is `web/404.html`.
* `tls`: TLS options for HTTPS.
    * `cert`: Path of server certificate file. Default is `certificates/server.crt`.
    * `key`: Path of server private key. Default is `certificates/server.key`.
    * `ciphers`: Ciphers to use or exclude. The default ciphers are taken from [Mozilla's Server Side TLS Guidelines](https://wiki.mozilla.org/Security/Server_Side_TLS).
    * `ecdhCurve`: The curve used for ECDH key agreement. Default is `secp384r1`.
    * `secureProtocol`: The SSL method to use. Default is `TLSv1_2_method`, which means only TLS 1.2 is accepted.
    * `port`: HTTPS server listening port. Default is `8443`.

To start WebHost:

    node index.js

## Examples ##

Assume using a self-signed TLS certificate for HTTPS connections, first generate the private key:

    openssl ecparam -genkey -name secp384r1 -out server.key

Then generate the certificate file:

    openssl req -new -x509 -days 365 -key server.key -out server.crt

Note that the self-signed certificate generated above will expire in 365 days.

(Free, trusted certificates can be obtained from [Let's Encrypt](https://letsencrypt.org/).)

Put the generated private key and certificate file under the `certificates` directory.

## License ##

[The BSD 3-Clause License](http://opensource.org/licenses/BSD-3-Clause)
