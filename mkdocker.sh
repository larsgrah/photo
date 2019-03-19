#!/bin/bash

rm -rf dist/
parcel build index.html

docker build . -t photo
docker tag photo registry.kloud.software/admin/photo-lars
docker push registry.kloud.software/admin/photo-lars
