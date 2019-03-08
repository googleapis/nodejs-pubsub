#!/bin/bash

# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -eo pipefail

cd $(dirname $0)/..

npm install

npm run docs

# Publish documentation with docuploader.
python3.6 -m pip install gcp-docuploader

python3.6 -m docuploader create-metadata \
			--name pubsub \
			--version 0.27.0 \
			--language node \
			--distribution-name @google-cloud/pubsub \
			--product-page https://cloud.google.com/pubsub/docs/ \
			--github-repository https://github.com/googleapis/nodejs-pubsub \
			--issue-tracker https://github.com/googleapis/nodejs-pubsub/issues
			docs/docs.metadata 

python3.6 -m docuploader upload docs