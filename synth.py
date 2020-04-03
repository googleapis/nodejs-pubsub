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
        'package-name': f'@google-cloud/pubsub',
        'main-service': f'pubsub',
        'bundle-request': f'google/pubsub/{version}/pubsub_gapic.yaml',
        'template': f'typescript_gapic'
    },
    proto_path=f'/google/pubsub/{version}',
    extra_proto_files=['google/iam/v1/']
)

# skip index, protos, package.json, and README.md
s.copy(
    library,
    excludes=['package.json', 'README.md', 'src/index.ts'])

templates = common_templates.node_library(source_location='build/src')
s.copy(templates)

# fix tslint issue due to mismatch gts version with gapic-generator-typescript
# it should be removed once pubsub upgrade gts 2.0.0
clients = ['publisher', 'subscriber']
for client_name in clients:
    client_file = f'src/v1/{client_name}_client.ts'

    s.replace(client_file,
              '\/\/ Determine the client header string.',
              'this._iamClient = new IamClient(opts); \n // Determine the client header string.')

    # fix tslint issue due to mismatch gts version with gapic-generator-typescript
    # it should be removed once pubsub upgrade gts 2.0.0
    s.replace(client_file, '\/\*\ eslint\-disable\ \@typescript\-eslint\/no\-explicit\-any\ \*/',
              '// tslint:disable-next-line no-any')
    with open('helperMethods.ts.tmpl', 'r') as helper_file:
        content = helper_file.read()
    s.replace(client_file, '^}', content)

# Node.js specific cleanup
subprocess.run(['npm', 'install'])
subprocess.run(['npm', 'run', 'fix'])
subprocess.run(['npx', 'compileProtos', 'src'])
