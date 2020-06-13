#!/bin/sh
#
# Script for controlling WebHost. Tested on OpenBSD 6.5 only.
# Author: Alex TSANG <alextsang@live.com>
# License: BSD-3-Clause

set -u
IFS="$(printf '\n\t')"

baseDirectory="$(cd "$(dirname "${0}")"; pwd)"
webhostScript="${0}"
pidFile="${baseDirectory}/webhost.pid"
action="${1:-usage}"

cd "${baseDirectory}"

usage() {
  echo "${webhostScript} <start | stop | restart | status>"
}

getPid() {
  if [ ! -r "${pidFile}" ]; then
    echo ""
    return
  fi
  content=$(cat "${pidFile}")
  if [ -n "$(ps -p "${content}" -o pid=)" ]; then
    echo "${content}"
  else
    echo ""
  fi
}

startApp() {
  result="$(getPid)"
  if [ -n "${result}" ]; then
    echo "WebHost is already running (PID: ${result})."
    exit 1
  fi
  export NODE_ENV='production'
  date -u '+%Y-%m-%dT%H:%M:%SZ Starting WebHost.' >> nohup.out
  nohup node "${baseDirectory}"/index.js &
}

stopApp() {
  result="$(getPid)"
  if [ -n "${result}" ]; then
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
  if [ -n "${result}" ]; then
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
