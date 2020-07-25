import synthtool as s
import synthtool.gcp as gcp
import synthtool.languages.node as node
import logging
import json
import os

logging.basicConfig(level=logging.DEBUG)

gapic = gcp.GAPICBazel()
common_templates = gcp.CommonTemplates()

# tasks has two product names, and a poorly named artman yaml
version = 'v1'
library = gapic.node_library('pubsub', version, proto_path=f'google/pubsub/{version}')

# skip index, protos, package.json, and README.md
s.copy(
    library,
    excludes=['package.json', 'README.md', 'src/index.ts'])

templates = common_templates.node_library(source_location='build/src')
s.copy(templates)

node.postprocess_gapic_library()
