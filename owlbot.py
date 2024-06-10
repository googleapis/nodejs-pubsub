# Copyright 2021 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import synthtool.languages.node as node

# This code snippet can be used to manually update the typeless bot
# to a different version than OwlBot has baked in, but this shouldn't
# be needed once it's settled down.
import os
from synthtool import shell
from synthtool.log import logger
old_path = os.getcwd()
os.chdir("/synthtool")
logger.debug("Update typeless sample bot [1.3.0]")
shell.run(["npm", "i", "@google-cloud/typeless-sample-bot@1.3.0"])
os.chdir(old_path)

node.typeless_samples_hermetic()

# We need to run this before the main owlbot processing, to make
# sure quickstart.js gets gts fixed before the README is generated.
# This needs to be worked out more properly, this is temporary.
logger.debug("Copy eslint config")
shell.run(
    ["cp", "-r", f"/synthtool/node_modules", "."],
    check=True,
)
logger.debug("Running fix...")
shell.run(
    ["npm", "run", "fix"],
    check=False,
)

node.owlbot_main(templates_excludes=[
    'src/index.ts',
    '.github/PULL_REQUEST_TEMPLATE.md',
    '.github/release-please.yml'
])
