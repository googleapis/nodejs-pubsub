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

from synthtool.languages import node
from synthtool import shell
from synthtool.log import logger

# Generate JS samples from TS.
# node.typeless_samples_hermetic()

# We need to run this before the main owlbot processing, to make
# sure quickstart.js gets gts fixed before the README is generated.
# This needs to be worked out more properly, this is temporary.
logger.debug("Run typeless sample bot")
node.install()
shell.run(["npm", "run", "typeless"])

# node.fix()


# Main OwlBot processing.
node.owlbot_main(templates_excludes=[
    'src/index.ts',
    '.github/PULL_REQUEST_TEMPLATE.md',
    '.github/release-please.yml',
    '.github/header-checker-lint.yaml',
    '.eslintignore'
])
