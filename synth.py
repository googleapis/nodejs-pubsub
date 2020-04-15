import synthtool as s
import synthtool.gcp as gcp
import logging
import subprocess
import json
import os

logging.basicConfig(level=logging.DEBUG)

gapic = gcp.GAPICMicrogenerator()
common_templates = gcp.CommonTemplates()

# tasks has two product names, and a poorly named artman yaml
version = 'v1'
library = gapic.typescript_library(
    'pubsub',
    version,
    generator_args={
        'grpc-service-config': f'google/pubsub/{version}/pubsub_grpc_service_config.json',
        'package-name': '@google-cloud/pubsub',
        'main-service': 'pubsub',
        'bundle-config': f'google/pubsub/{version}/pubsub_gapic.yaml',
        'template': 'typescript_gapic',
        'iam-service': 'true'
    },
    proto_path=f'/google/pubsub/{version}',
    extra_proto_files=['google/cloud/common_resources.proto']
)

# skip index, protos, package.json, and README.md
s.copy(
    library,
    excludes=['package.json', 'README.md', 'src/index.ts'])

templates = common_templates.node_library(source_location='build/src')
s.copy(templates)

# Node.js specific cleanup
subprocess.run(['npm', 'install'])
subprocess.run(['npm', 'run', 'fix'])
subprocess.run(['npx', 'compileProtos', 'src'])
