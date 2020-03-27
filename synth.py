import synthtool as s
import synthtool.gcp as gcp
import logging
import subprocess
import json
import os

logging.basicConfig(level=logging.DEBUG)

AUTOSYNTH_MULTIPLE_COMMITS = True

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

# Remove unneeded protos in proto_list.json
# In micro-generators, we do have default multiple common protos set as dependencies.
# But if the proto is also specified in protoc command (used to generating client libraries),
# protoc command will fail becasue of the repetition and force us to remove the duplicate protos reference
list_jsons = ['src/v1/publisher_proto_list.json',
              'src/v1/subscriber_proto_list.json']
remove_proto_keywords = ['/google/api', '/google/protobuf', '/google/type']
for list_json in list_jsons:
    with open(list_json, 'r') as f:
        items = json.load(f)
        content = [item for item in items if all(
            [(x not in item) for x in remove_proto_keywords])]
        new_file = json.dumps(content, indent=2) + '\n'
    with open(list_json, 'w') as f:
        f.write(new_file)

# surgery in client.ts file
clients = ['publisher', 'subscriber']
for client_name in clients:
    client_file = f'src/v1/{client_name}_client.ts'
    s.replace(client_file,
              f'import \* as gapicConfig from \'\.\/{client_name}_client_config\.json\';',
              f'import * as gapicConfig from \'./%s_client_config.json\';\nimport {{IamClient}} from \'../helper\';' % client_name,
              )

    s.replace(client_file,
              'private \_terminated = false;',
              'private _terminated = false; \n private _iamClient: IamClient;')

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
