#!/bin/sh
#
# Script for controlling WebHost. Tested on OpenBSD 6.3 only.
# Author: Alex Tsang <alextsang@live.com>
# License: BSD-3-Clause

set -u
IFS='\n\t'

baseDirectory="$(cd "$(dirname "${0}")"; pwd)"
webhostScript="${0}"
action="${1:-usage}"

cd "${baseDirectory}"

usage() {
  echo "${webhostScript} <start | stop | restart | status>"
}

getPid() {
  pgrep -f "node ${baseDirectory}/index.js"
}

startApp() {
  result="$(getPid)"
  if [ ! -z "${result}" ]; then
    echo "WebHost is already running (PID: ${result})."
    exit 1
  fi
  export NODE_ENV='production'
  date -u '+%Y-%m-%dT%H:%M:%SZ Starting WebHost.' >> nohup.out
  nohup node "${baseDirectory}"/index.js &
}

stopApp() {
  result="$(getPid)"
  if [ ! -z "${result}" ]; then
    date -u '+%Y-%m-%dT%H:%M:%SZ Stopping WebHost.' >> nohup.out
    kill "${result}"
  fi
}

restartApp() {
  stopApp
  startApp
}

status() {
  result="$(getPid)"
  if [ ! -z "${result}" ]; then
    echo "Active, PID is ${result}."
  else
    echo "Inactive."
  fi
}

case "${action}" in
  start)
    startApp
    ;;
  stop)
    stopApp
    ;;
  restart)
    restartApp
    ;;
  status)
    status
    ;;
  *)
    usage
    ;;
esac
