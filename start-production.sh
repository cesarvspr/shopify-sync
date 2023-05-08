#!/bin/sh
echo "======================================================"
echo "PRODUCTS SERVER"
echo "======================================================"
echo " NODE_ENV         : ${NODE_ENV}"
echo " APP_PORT         : ${APP_PORT}"
echo " LOG_LEVEL        : ${LOG_LEVEL:=info}"
echo " TZ               : ${TZ}"
echo " DOCKER_CONTAINER : ${DOCKER_CONTAINER}"
echo " user             : $(whoami)"
echo " pwd              : $(pwd)"
echo "======================================================"
echo " VERSION INFORMATION"
echo "======================================================"
echo " yarn version: $(yarn --version)"
echo " npm version : $(npm --version)"
echo " node version: $(node --version)"

# Stop the script on the first failure:
set -e

echo "======================================================"
echo " DB MIGRATION"
echo "======================================================"
echo " > Starting prisma migrations... "
set -x
yarn prisma migrate deploy
set +x

echo "======================================================"
echo " > Starting products api server... 🚀 "
set -x
yarn start
set +x

echo "======================================================"
echo " ⚠️ TERMINATED! ⚠️ "
echo "======================================================"
