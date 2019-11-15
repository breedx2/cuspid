#!/bin/bash

# Example deploy script for use with roquet (https://github.com/breedx2/roquet)
# 
# It's real dumb!

set -e

PORT=8080
INSTDIR=/home/www/
REPO="https://github.com/breedx2/cuspid.git"
APP=cuspid

# Try and make the install dir if it doesn't yet exist
if [ ! -d ${INSTDIR} ] ; then
	echo "Creating ${INSTDIR}"
	mkdir -p "${INSTDIR}"
fi

cd "${INSTDIR}"

# If exists, git pull, otherwise new clone

if [ -d "${APP}" ] ; then
	echo "Refreshing repo."
	cd "${APP}"
	git pull
else
	echo "cloning a super fresh repo"
	git clone "${REPO}"
	cd "${APP}"
fi

npm install

# Find the pid of the process listening on our port.
PID=$(netstat -anp | grep ${PORT} | grep LISTEN | awk '{print $7}' | sed -e "s/\/.*//")
echo "existing pid = ${PID}"

if [ "" == "${PID}" ] ; then
	echo "Not currently running, starting fresh."
	npm run start &
else
	echo "Just killing existing process."
	kill ${PID}
	# and now we hope you've set up supervisord to restart it ...
fi


