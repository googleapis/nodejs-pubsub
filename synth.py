import synthtool as s
import synthtool.gcp as gcp
import logging
import subprocess

logging.basicConfig(level=logging.DEBUG)

gapic = gcp.GAPICGenerator()
common_templates = gcp.CommonTemplates()

# tasks has two product names, and a poorly named artman yaml
version = 'v1'
library = gapic.node_library(
    'pubsub', version, config_path="/google/pubsub/artman_pubsub.yaml")

# skip index, protos, package.json, and README.md
s.copy(
    library,
    excludes=['package.json', 'README.md', 'src/index.js'])

templates = common_templates.node_library(source_location='build/src')
s.copy(templates)

# https://github.com/googleapis/gapic-generator/issues/2127
s.replace("src/v1/subscriber_client.js",
          "  }\n\s*/\*\*\n\s+\* The DNS address for this API service.",
          "\n    // note: editing generated code\n"
          "    this.waitForReady = function(deadline, callback) {\n"
          "      return subscriberStub.then(\n"
          "        stub => stub.waitForReady(deadline, callback),\n"
          "        callback\n"
          "      );\n"
          "    };\n"
          "    this.getSubscriberStub = function() {\n"
          "      return subscriberStub;\n"
          "    };\n"
          "\g<0>")

# Update path discovery due to build/ dir and TypeScript conversion.
s.replace("src/v1/publisher_client.js", "../../package.json", "../../../package.json")
s.replace("src/v1/subscriber_client.js", "../../package.json", "../../../package.json")

# [START fix-dead-link]
s.replace('src/**/doc/google/protobuf/doc_timestamp.js',
        'https:\/\/cloud\.google\.com[\s\*]*http:\/\/(.*)[\s\*]*\)',
        r"https://\1)")

s.replace('src/**/doc/google/protobuf/doc_timestamp.js',
        'toISOString\]',
        'toISOString)')
# [END fix-dead-link]


# Node.js specific cleanup
subprocess.run(['npm', 'install'])
subprocess.run(['npm', 'run', 'fix'])
