#!/bin/sh
#
# Script for controlling WebHost.
# Author: Alex TSANG <alextsang@live.com>
# License: BSD-3-Clause

set -e
set -u
IFS="$(printf '\n\t')"

baseDirectory="$(cd "$(dirname "${0}")"; pwd)"
controlScript="${0}"
pidFile="${baseDirectory}/webhost.pid"
action="${1:-usage}"

cd "${baseDirectory}"

usage() {
  echo "${controlScript} <start | stop | restart | status>"
}

getPid() {
  if [ ! -r "${pidFile}" ]; then
    echo ""
    return
  fi
  cat "${pidFile}"
}

startApp() {
  pid="$(getPid)"
  if [ -n "${pid}" ]; then
    echo "WebHost is already running (PID: ${pid})."
    exit 0
  fi

  export NODE_ENV='production'
  date -u '+%Y-%m-%dT%H:%M:%SZ Starting WebHost.' >> nohup.out
  nohup node "${baseDirectory}/index.js" &
  pid="${!}"
  echo "${pid}" > "${pidFile}"
  date -u '+%Y-%m-%dT%H:%M:%SZ Started WebHost.' >> nohup.out
}

stopApp() {
  pid="$(getPid)"
  if [ -z "${pid}" ]; then
    echo 'WebHost is not running.'
    exit 0
  fi

  date -u '+%Y-%m-%dT%H:%M:%SZ Stopping WebHost.' >> nohup.out
  kill "${pid}"
  rm "${pidFile}"
  date -u '+%Y-%m-%dT%H:%M:%SZ Stopped WebHost.' >> nohup.out
}

restartApp() {
  stopApp
  startApp
}

status() {
  pid="$(getPid)"
  if [ -n "${pid}" ]; then
    echo "WebHost is running (PID: ${pid})."
  else
    echo 'WebHost is not running.'
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
