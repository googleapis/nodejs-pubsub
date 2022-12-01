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
import os
from synthtool import shell
from synthtool.log import logger

# Testing workaround for babel cwd issue.
old_path = os.getcwd()
os.chdir("/synthtool")
logger.debug("Run typeless sample bot [manual]")
shell.run(["npm i typeless-sample-bot@1.1.0"])
os.chdir(old_path)

shell.run(
    [
        "/synthtool/node_modules/.bin/typeless-sample-bot",
        "--outputpath",
        "samples",
        "--targets",
        "samples",
        "--recursive",
    ],
    check=False,
    hide_output=False,
)

# Still some bugs being worked out on this.
#node.typeless_samples_hermetic()

node.owlbot_main(templates_excludes=[
    'src/index.ts',
    '.github/PULL_REQUEST_TEMPLATE.md',
    '.github/release-please.yml'
])
