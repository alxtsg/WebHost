#!/bin/sh
#
# Script for running WebHost in background.
# Author: Alex Tsang <alextsang@live.com>
# License: BSD-3-Clause

set -e
set -u
IFS='\n\t'

SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd)"

cd "${SCRIPT_DIR}"

export NODE_ENV='production'
date -u '+%Y-%m-%dT%H:%M:%SZ' >> nohup.out
nohup node "${SCRIPT_DIR}"/index.js &
