#!/bin/bash
echo "__________prisma scripts___________"
yarn prisma generate
yarn prisma migrate dev
echo "__________start all___________"
yarn start:all
echo "___________end__________"
