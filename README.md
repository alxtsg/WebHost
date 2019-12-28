# WebHost #

## Description ##

A simple static web server, powered by Node.js and Express. WebHost is being
used as the skeleton of more complex web applications.

WebHost is expected to run behind a reverse proxy (e.g. HAProxy).

## Requirements ##

* Node.js (`>=10.16.3`).

## Installation ##

0. `npm install --production`.

## Configuration ##

Make a copy of `.env.template` and name the new file as `.env`. The `.env` file
controls the following:

* `ROOT_DIRECTORY`: The root directory of files to be served by the web server.
                    If the path is a relative path, it is relative to the
                    installation directory.
* `ERROR_PAGE`: Path of error page. If the path is a relative path, it is
                relative to the installation directory.
* `ACCESS_LOG`: Path of access log. If the path is a relative path, it is
                relative to the installation directory.
* `PORT`: The port that the server will listen on.

## Usage ##

Run `index.js` using Node.js:

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

## License ##

[The BSD 3-Clause License](http://opensource.org/licenses/BSD-3-Clause)
