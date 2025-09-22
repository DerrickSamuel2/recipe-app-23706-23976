#!/bin/bash
cd /home/kavia/workspace/code-generation/recipe-app-23706-23976/WebFrontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

