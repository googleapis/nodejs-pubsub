{
  "nested": {
    "google": {
      "nested": {
        "iam": {
          "nested": {
            "v1": {
              "options": {
                "cc_enable_arenas": true,
                "csharp_namespace": "Google.Cloud.Iam.V1",
                "go_package": "google.golang.org/genproto/googleapis/iam/v1;iam",
                "java_multiple_files": true,
                "java_outer_classname": "IamPolicyProto",
                "java_package": "com.google.iam.v1",
                "php_namespace": "Google\\Cloud\\Iam\\V1"
              },
              "nested": {
                "Policy": {
                  "fields": {
                    "version": {
                      "type": "int32",
                      "id": 1
                    },
                    "bindings": {
                      "rule": "repeated",
                      "type": "Binding",
                      "id": 4
                    },
                    "etag": {
                      "type": "bytes",
                      "id": 3
                    }
                  }
                },
                "Binding": {
                  "fields": {
                    "role": {
                      "type": "string",
                      "id": 1
                    },
                    "members": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 2
                    },
                    "condition": {
                      "type": "google.type.Expr",
                      "id": 3
                    }
                  }
                },
                "PolicyDelta": {
                  "fields": {
                    "bindingDeltas": {
                      "rule": "repeated",
                      "type": "BindingDelta",
                      "id": 1
                    },
                    "auditConfigDeltas": {
                      "rule": "repeated",
                      "type": "AuditConfigDelta",
                      "id": 2
                    }
                  }
                },
                "BindingDelta": {
                  "fields": {
                    "action": {
                      "type": "Action",
                      "id": 1
                    },
                    "role": {
                      "type": "string",
                      "id": 2
                    },
                    "member": {
                      "type": "string",
                      "id": 3
                    },
                    "condition": {
                      "type": "google.type.Expr",
                      "id": 4
                    }
                  },
                  "nested": {
                    "Action": {
                      "values": {
                        "ACTION_UNSPECIFIED": 0,
                        "ADD": 1,
                        "REMOVE": 2
                      }
                    }
                  }
                },
                "AuditConfigDelta": {
                  "fields": {
                    "action": {
                      "type": "Action",
                      "id": 1
                    },
                    "service": {
                      "type": "string",
                      "id": 2
                    },
                    "exemptedMember": {
                      "type": "string",
                      "id": 3
                    },
                    "logType": {
                      "type": "string",
                      "id": 4
                    }
                  },
                  "nested": {
                    "Action": {
                      "values": {
                        "ACTION_UNSPECIFIED": 0,
                        "ADD": 1,
                        "REMOVE": 2
                      }
                    }
                  }
                },
                "GetPolicyOptions": {
                  "fields": {
                    "requestedPolicyVersion": {
                      "type": "int32",
                      "id": 1
                    }
                  }
                },
                "IAMPolicy": {
                  "options": {
                    "(google.api.default_host)": "iam-meta-api.googleapis.com"
                  },
                  "methods": {
                    "SetIamPolicy": {
                      "requestType": "SetIamPolicyRequest",
                      "responseType": "Policy",
                      "options": {
                        "(google.api.http).post": "/v1/{resource=**}:setIamPolicy",
                        "(google.api.http).body": "*"
                      }
                    },
                    "GetIamPolicy": {
                      "requestType": "GetIamPolicyRequest",
                      "responseType": "Policy",
                      "options": {
                        "(google.api.http).post": "/v1/{resource=**}:getIamPolicy",
                        "(google.api.http).body": "*"
                      }
                    },
                    "TestIamPermissions": {
                      "requestType": "TestIamPermissionsRequest",
                      "responseType": "TestIamPermissionsResponse",
                      "options": {
                        "(google.api.http).post": "/v1/{resource=**}:testIamPermissions",
                        "(google.api.http).body": "*"
                      }
                    }
                  }
                },
                "SetIamPolicyRequest": {
                  "fields": {
                    "resource": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "*"
                      }
                    },
                    "policy": {
                      "type": "Policy",
                      "id": 2,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    }
                  }
                },
                "GetIamPolicyRequest": {
                  "fields": {
                    "resource": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "*"
                      }
                    },
                    "options": {
                      "type": "GetPolicyOptions",
                      "id": 2
                    }
                  }
                },
                "TestIamPermissionsRequest": {
                  "fields": {
                    "resource": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "*"
                      }
                    },
                    "permissions": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 2,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    }
                  }
                },
                "TestIamPermissionsResponse": {
                  "fields": {
                    "permissions": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 1
                    }
                  }
                }
              }
            }
          }
        },
        "type": {
          "options": {
            "go_package": "google.golang.org/genproto/googleapis/type/expr;expr",
            "java_multiple_files": true,
            "java_outer_classname": "ExprProto",
            "java_package": "com.google.type",
            "objc_class_prefix": "GTP"
          },
          "nested": {
            "Expr": {
              "fields": {
                "expression": {
                  "type": "string",
                  "id": 1
                },
                "title": {
                  "type": "string",
                  "id": 2
                },
                "description": {
                  "type": "string",
                  "id": 3
                },
                "location": {
                  "type": "string",
                  "id": 4
                }
              }
            }
          }
        },
        "api": {
          "options": {
            "go_package": "google.golang.org/genproto/googleapis/api/annotations;annotations",
            "java_multiple_files": true,
            "java_outer_classname": "ResourceProto",
            "java_package": "com.google.api",
            "objc_class_prefix": "GAPI",
            "cc_enable_arenas": true
          },
          "nested": {
            "http": {
              "type": "HttpRule",
              "id": 72295728,
              "extend": "google.protobuf.MethodOptions"
            },
            "Http": {
              "fields": {
                "rules": {
                  "rule": "repeated",
                  "type": "HttpRule",
                  "id": 1
                },
                "fullyDecodeReservedExpansion": {
                  "type": "bool",
                  "id": 2
                }
              }
            },
            "HttpRule": {
              "oneofs": {
                "pattern": {
                  "oneof": [
                    "get",
                    "put",
                    "post",
                    "delete",
                    "patch",
                    "custom"
                  ]
                }
              },
              "fields": {
                "selector": {
                  "type": "string",
                  "id": 1
                },
                "get": {
                  "type": "string",
                  "id": 2
                },
                "put": {
                  "type": "string",
                  "id": 3
                },
                "post": {
                  "type": "string",
                  "id": 4
                },
                "delete": {
                  "type": "string",
                  "id": 5
                },
                "patch": {
                  "type": "string",
                  "id": 6
                },
                "custom": {
                  "type": "CustomHttpPattern",
                  "id": 8
                },
                "body": {
                  "type": "string",
                  "id": 7
                },
                "responseBody": {
                  "type": "string",
                  "id": 12
                },
                "additionalBindings": {
                  "rule": "repeated",
                  "type": "HttpRule",
                  "id": 11
                }
              }
            },
            "CustomHttpPattern": {
              "fields": {
                "kind": {
                  "type": "string",
                  "id": 1
                },
                "path": {
                  "type": "string",
                  "id": 2
                }
              }
            },
            "methodSignature": {
              "rule": "repeated",
              "type": "string",
              "id": 1051,
              "extend": "google.protobuf.MethodOptions"
            },
            "defaultHost": {
              "type": "string",
              "id": 1049,
              "extend": "google.protobuf.ServiceOptions"
            },
            "oauthScopes": {
              "type": "string",
              "id": 1050,
              "extend": "google.protobuf.ServiceOptions"
            },
            "fieldBehavior": {
              "rule": "repeated",
              "type": "google.api.FieldBehavior",
              "id": 1052,
              "extend": "google.protobuf.FieldOptions"
            },
            "FieldBehavior": {
              "values": {
                "FIELD_BEHAVIOR_UNSPECIFIED": 0,
                "OPTIONAL": 1,
                "REQUIRED": 2,
                "OUTPUT_ONLY": 3,
                "INPUT_ONLY": 4,
                "IMMUTABLE": 5
              }
            },
            "resourceReference": {
              "type": "google.api.ResourceReference",
              "id": 1055,
              "extend": "google.protobuf.FieldOptions"
            },
            "resourceDefinition": {
              "rule": "repeated",
              "type": "google.api.ResourceDescriptor",
              "id": 1053,
              "extend": "google.protobuf.FileOptions"
            },
            "resource": {
              "type": "google.api.ResourceDescriptor",
              "id": 1053,
              "extend": "google.protobuf.MessageOptions"
            },
            "ResourceDescriptor": {
              "fields": {
                "type": {
                  "type": "string",
                  "id": 1
                },
                "pattern": {
                  "rule": "repeated",
                  "type": "string",
                  "id": 2
                },
                "nameField": {
                  "type": "string",
                  "id": 3
                },
                "history": {
                  "type": "History",
                  "id": 4
                },
                "plural": {
                  "type": "string",
                  "id": 5
                },
                "singular": {
                  "type": "string",
                  "id": 6
                }
              },
              "nested": {
                "History": {
                  "values": {
                    "HISTORY_UNSPECIFIED": 0,
                    "ORIGINALLY_SINGLE_PATTERN": 1,
                    "FUTURE_MULTI_PATTERN": 2
                  }
                }
              }
            },
            "ResourceReference": {
              "fields": {
                "type": {
                  "type": "string",
                  "id": 1
                },
                "childType": {
                  "type": "string",
                  "id": 2
                }
              }
            }
          }
        },
        "protobuf": {
          "options": {
            "go_package": "github.com/golang/protobuf/protoc-gen-go/descriptor;descriptor",
            "java_package": "com.google.protobuf",
            "java_outer_classname": "DescriptorProtos",
            "csharp_namespace": "Google.Protobuf.Reflection",
            "objc_class_prefix": "GPB",
            "cc_enable_arenas": true,
            "optimize_for": "SPEED"
          },
          "nested": {
            "FileDescriptorSet": {
              "fields": {
                "file": {
                  "rule": "repeated",
                  "type": "FileDescriptorProto",
                  "id": 1
                }
              }
            },
            "FileDescriptorProto": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "package": {
                  "type": "string",
                  "id": 2
                },
                "dependency": {
                  "rule": "repeated",
                  "type": "string",
                  "id": 3
                },
                "publicDependency": {
                  "rule": "repeated",
                  "type": "int32",
                  "id": 10,
                  "options": {
                    "packed": false
                  }
                },
                "weakDependency": {
                  "rule": "repeated",
                  "type": "int32",
                  "id": 11,
                  "options": {
                    "packed": false
                  }
                },
                "messageType": {
                  "rule": "repeated",
                  "type": "DescriptorProto",
                  "id": 4
                },
                "enumType": {
                  "rule": "repeated",
                  "type": "EnumDescriptorProto",
                  "id": 5
                },
                "service": {
                  "rule": "repeated",
                  "type": "ServiceDescriptorProto",
                  "id": 6
                },
                "extension": {
                  "rule": "repeated",
                  "type": "FieldDescriptorProto",
                  "id": 7
                },
                "options": {
                  "type": "FileOptions",
                  "id": 8
                },
                "sourceCodeInfo": {
                  "type": "SourceCodeInfo",
                  "id": 9
                },
                "syntax": {
                  "type": "string",
                  "id": 12
                }
              }
            },
            "DescriptorProto": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "field": {
                  "rule": "repeated",
                  "type": "FieldDescriptorProto",
                  "id": 2
                },
                "extension": {
                  "rule": "repeated",
                  "type": "FieldDescriptorProto",
                  "id": 6
                },
                "nestedType": {
                  "rule": "repeated",
                  "type": "DescriptorProto",
                  "id": 3
                },
                "enumType": {
                  "rule": "repeated",
                  "type": "EnumDescriptorProto",
                  "id": 4
                },
                "extensionRange": {
                  "rule": "repeated",
                  "type": "ExtensionRange",
                  "id": 5
                },
                "oneofDecl": {
                  "rule": "repeated",
                  "type": "OneofDescriptorProto",
                  "id": 8
                },
                "options": {
                  "type": "MessageOptions",
                  "id": 7
                },
                "reservedRange": {
                  "rule": "repeated",
                  "type": "ReservedRange",
                  "id": 9
                },
                "reservedName": {
                  "rule": "repeated",
                  "type": "string",
                  "id": 10
                }
              },
              "nested": {
                "ExtensionRange": {
                  "fields": {
                    "start": {
                      "type": "int32",
                      "id": 1
                    },
                    "end": {
                      "type": "int32",
                      "id": 2
                    },
                    "options": {
                      "type": "ExtensionRangeOptions",
                      "id": 3
                    }
                  }
                },
                "ReservedRange": {
                  "fields": {
                    "start": {
                      "type": "int32",
                      "id": 1
                    },
                    "end": {
                      "type": "int32",
                      "id": 2
                    }
                  }
                }
              }
            },
            "ExtensionRangeOptions": {
              "fields": {
                "uninterpretedOption": {
                  "rule": "repeated",
                  "type": "UninterpretedOption",
                  "id": 999
                }
              },
              "extensions": [
                [
                  1000,
                  536870911
                ]
              ]
            },
            "FieldDescriptorProto": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "number": {
                  "type": "int32",
                  "id": 3
                },
                "label": {
                  "type": "Label",
                  "id": 4
                },
                "type": {
                  "type": "Type",
                  "id": 5
                },
                "typeName": {
                  "type": "string",
                  "id": 6
                },
                "extendee": {
                  "type": "string",
                  "id": 2
                },
                "defaultValue": {
                  "type": "string",
                  "id": 7
                },
                "oneofIndex": {
                  "type": "int32",
                  "id": 9
                },
                "jsonName": {
                  "type": "string",
                  "id": 10
                },
                "options": {
                  "type": "FieldOptions",
                  "id": 8
                }
              },
              "nested": {
                "Type": {
                  "values": {
                    "TYPE_DOUBLE": 1,
                    "TYPE_FLOAT": 2,
                    "TYPE_INT64": 3,
                    "TYPE_UINT64": 4,
                    "TYPE_INT32": 5,
                    "TYPE_FIXED64": 6,
                    "TYPE_FIXED32": 7,
                    "TYPE_BOOL": 8,
                    "TYPE_STRING": 9,
                    "TYPE_GROUP": 10,
                    "TYPE_MESSAGE": 11,
                    "TYPE_BYTES": 12,
                    "TYPE_UINT32": 13,
                    "TYPE_ENUM": 14,
                    "TYPE_SFIXED32": 15,
                    "TYPE_SFIXED64": 16,
                    "TYPE_SINT32": 17,
                    "TYPE_SINT64": 18
                  }
                },
                "Label": {
                  "values": {
                    "LABEL_OPTIONAL": 1,
                    "LABEL_REQUIRED": 2,
                    "LABEL_REPEATED": 3
                  }
                }
              }
            },
            "OneofDescriptorProto": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "options": {
                  "type": "OneofOptions",
                  "id": 2
                }
              }
            },
            "EnumDescriptorProto": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "value": {
                  "rule": "repeated",
                  "type": "EnumValueDescriptorProto",
                  "id": 2
                },
                "options": {
                  "type": "EnumOptions",
                  "id": 3
                },
                "reservedRange": {
                  "rule": "repeated",
                  "type": "EnumReservedRange",
                  "id": 4
                },
                "reservedName": {
                  "rule": "repeated",
                  "type": "string",
                  "id": 5
                }
              },
              "nested": {
                "EnumReservedRange": {
                  "fields": {
                    "start": {
                      "type": "int32",
                      "id": 1
                    },
                    "end": {
                      "type": "int32",
                      "id": 2
                    }
                  }
                }
              }
            },
            "EnumValueDescriptorProto": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "number": {
                  "type": "int32",
                  "id": 2
                },
                "options": {
                  "type": "EnumValueOptions",
                  "id": 3
                }
              }
            },
            "ServiceDescriptorProto": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "method": {
                  "rule": "repeated",
                  "type": "MethodDescriptorProto",
                  "id": 2
                },
                "options": {
                  "type": "ServiceOptions",
                  "id": 3
                }
              }
            },
            "MethodDescriptorProto": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "inputType": {
                  "type": "string",
                  "id": 2
                },
                "outputType": {
                  "type": "string",
                  "id": 3
                },
                "options": {
                  "type": "MethodOptions",
                  "id": 4
                },
                "clientStreaming": {
                  "type": "bool",
                  "id": 5,
                  "options": {
                    "default": false
                  }
                },
                "serverStreaming": {
                  "type": "bool",
                  "id": 6,
                  "options": {
                    "default": false
                  }
                }
              }
            },
            "FileOptions": {
              "fields": {
                "javaPackage": {
                  "type": "string",
                  "id": 1
                },
                "javaOuterClassname": {
                  "type": "string",
                  "id": 8
                },
                "javaMultipleFiles": {
                  "type": "bool",
                  "id": 10,
                  "options": {
                    "default": false
                  }
                },
                "javaGenerateEqualsAndHash": {
                  "type": "bool",
                  "id": 20,
                  "options": {
                    "deprecated": true
                  }
                },
                "javaStringCheckUtf8": {
                  "type": "bool",
                  "id": 27,
                  "options": {
                    "default": false
                  }
                },
                "optimizeFor": {
                  "type": "OptimizeMode",
                  "id": 9,
                  "options": {
                    "default": "SPEED"
                  }
                },
                "goPackage": {
                  "type": "string",
                  "id": 11
                },
                "ccGenericServices": {
                  "type": "bool",
                  "id": 16,
                  "options": {
                    "default": false
                  }
                },
                "javaGenericServices": {
                  "type": "bool",
                  "id": 17,
                  "options": {
                    "default": false
                  }
                },
                "pyGenericServices": {
                  "type": "bool",
                  "id": 18,
                  "options": {
                    "default": false
                  }
                },
                "phpGenericServices": {
                  "type": "bool",
                  "id": 42,
                  "options": {
                    "default": false
                  }
                },
                "deprecated": {
                  "type": "bool",
                  "id": 23,
                  "options": {
                    "default": false
                  }
                },
                "ccEnableArenas": {
                  "type": "bool",
                  "id": 31,
                  "options": {
                    "default": false
                  }
                },
                "objcClassPrefix": {
                  "type": "string",
                  "id": 36
                },
                "csharpNamespace": {
                  "type": "string",
                  "id": 37
                },
                "swiftPrefix": {
                  "type": "string",
                  "id": 39
                },
                "phpClassPrefix": {
                  "type": "string",
                  "id": 40
                },
                "phpNamespace": {
                  "type": "string",
                  "id": 41
                },
                "phpMetadataNamespace": {
                  "type": "string",
                  "id": 44
                },
                "rubyPackage": {
                  "type": "string",
                  "id": 45
                },
                "uninterpretedOption": {
                  "rule": "repeated",
                  "type": "UninterpretedOption",
                  "id": 999
                }
              },
              "extensions": [
                [
                  1000,
                  536870911
                ]
              ],
              "reserved": [
                [
                  38,
                  38
                ]
              ],
              "nested": {
                "OptimizeMode": {
                  "values": {
                    "SPEED": 1,
                    "CODE_SIZE": 2,
                    "LITE_RUNTIME": 3
                  }
                }
              }
            },
            "MessageOptions": {
              "fields": {
                "messageSetWireFormat": {
                  "type": "bool",
                  "id": 1,
                  "options": {
                    "default": false
                  }
                },
                "noStandardDescriptorAccessor": {
                  "type": "bool",
                  "id": 2,
                  "options": {
                    "default": false
                  }
                },
                "deprecated": {
                  "type": "bool",
                  "id": 3,
                  "options": {
                    "default": false
                  }
                },
                "mapEntry": {
                  "type": "bool",
                  "id": 7
                },
                "uninterpretedOption": {
                  "rule": "repeated",
                  "type": "UninterpretedOption",
                  "id": 999
                }
              },
              "extensions": [
                [
                  1000,
                  536870911
                ]
              ],
              "reserved": [
                [
                  8,
                  8
                ],
                [
                  9,
                  9
                ]
              ]
            },
            "FieldOptions": {
              "fields": {
                "ctype": {
                  "type": "CType",
                  "id": 1,
                  "options": {
                    "default": "STRING"
                  }
                },
                "packed": {
                  "type": "bool",
                  "id": 2
                },
                "jstype": {
                  "type": "JSType",
                  "id": 6,
                  "options": {
                    "default": "JS_NORMAL"
                  }
                },
                "lazy": {
                  "type": "bool",
                  "id": 5,
                  "options": {
                    "default": false
                  }
                },
                "deprecated": {
                  "type": "bool",
                  "id": 3,
                  "options": {
                    "default": false
                  }
                },
                "weak": {
                  "type": "bool",
                  "id": 10,
                  "options": {
                    "default": false
                  }
                },
                "uninterpretedOption": {
                  "rule": "repeated",
                  "type": "UninterpretedOption",
                  "id": 999
                }
              },
              "extensions": [
                [
                  1000,
                  536870911
                ]
              ],
              "reserved": [
                [
                  4,
                  4
                ]
              ],
              "nested": {
                "CType": {
                  "values": {
                    "STRING": 0,
                    "CORD": 1,
                    "STRING_PIECE": 2
                  }
                },
                "JSType": {
                  "values": {
                    "JS_NORMAL": 0,
                    "JS_STRING": 1,
                    "JS_NUMBER": 2
                  }
                }
              }
            },
            "OneofOptions": {
              "fields": {
                "uninterpretedOption": {
                  "rule": "repeated",
                  "type": "UninterpretedOption",
                  "id": 999
                }
              },
              "extensions": [
                [
                  1000,
                  536870911
                ]
              ]
            },
            "EnumOptions": {
              "fields": {
                "allowAlias": {
                  "type": "bool",
                  "id": 2
                },
                "deprecated": {
                  "type": "bool",
                  "id": 3,
                  "options": {
                    "default": false
                  }
                },
                "uninterpretedOption": {
                  "rule": "repeated",
                  "type": "UninterpretedOption",
                  "id": 999
                }
              },
              "extensions": [
                [
                  1000,
                  536870911
                ]
              ],
              "reserved": [
                [
                  5,
                  5
                ]
              ]
            },
            "EnumValueOptions": {
              "fields": {
                "deprecated": {
                  "type": "bool",
                  "id": 1,
                  "options": {
                    "default": false
                  }
                },
                "uninterpretedOption": {
                  "rule": "repeated",
                  "type": "UninterpretedOption",
                  "id": 999
                }
              },
              "extensions": [
                [
                  1000,
                  536870911
                ]
              ]
            },
            "ServiceOptions": {
              "fields": {
                "deprecated": {
                  "type": "bool",
                  "id": 33,
                  "options": {
                    "default": false
                  }
                },
                "uninterpretedOption": {
                  "rule": "repeated",
                  "type": "UninterpretedOption",
                  "id": 999
                }
              },
              "extensions": [
                [
                  1000,
                  536870911
                ]
              ]
            },
            "MethodOptions": {
              "fields": {
                "deprecated": {
                  "type": "bool",
                  "id": 33,
                  "options": {
                    "default": false
                  }
                },
                "idempotencyLevel": {
                  "type": "IdempotencyLevel",
                  "id": 34,
                  "options": {
                    "default": "IDEMPOTENCY_UNKNOWN"
                  }
                },
                "uninterpretedOption": {
                  "rule": "repeated",
                  "type": "UninterpretedOption",
                  "id": 999
                }
              },
              "extensions": [
                [
                  1000,
                  536870911
                ]
              ],
              "nested": {
                "IdempotencyLevel": {
                  "values": {
                    "IDEMPOTENCY_UNKNOWN": 0,
                    "NO_SIDE_EFFECTS": 1,
                    "IDEMPOTENT": 2
                  }
                }
              }
            },
            "UninterpretedOption": {
              "fields": {
                "name": {
                  "rule": "repeated",
                  "type": "NamePart",
                  "id": 2
                },
                "identifierValue": {
                  "type": "string",
                  "id": 3
                },
                "positiveIntValue": {
                  "type": "uint64",
                  "id": 4
                },
                "negativeIntValue": {
                  "type": "int64",
                  "id": 5
                },
                "doubleValue": {
                  "type": "double",
                  "id": 6
                },
                "stringValue": {
                  "type": "bytes",
                  "id": 7
                },
                "aggregateValue": {
                  "type": "string",
                  "id": 8
                }
              },
              "nested": {
                "NamePart": {
                  "fields": {
                    "namePart": {
                      "rule": "required",
                      "type": "string",
                      "id": 1
                    },
                    "isExtension": {
                      "rule": "required",
                      "type": "bool",
                      "id": 2
                    }
                  }
                }
              }
            },
            "SourceCodeInfo": {
              "fields": {
                "location": {
                  "rule": "repeated",
                  "type": "Location",
                  "id": 1
                }
              },
              "nested": {
                "Location": {
                  "fields": {
                    "path": {
                      "rule": "repeated",
                      "type": "int32",
                      "id": 1
                    },
                    "span": {
                      "rule": "repeated",
                      "type": "int32",
                      "id": 2
                    },
                    "leadingComments": {
                      "type": "string",
                      "id": 3
                    },
                    "trailingComments": {
                      "type": "string",
                      "id": 4
                    },
                    "leadingDetachedComments": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 6
                    }
                  }
                }
              }
            },
            "GeneratedCodeInfo": {
              "fields": {
                "annotation": {
                  "rule": "repeated",
                  "type": "Annotation",
                  "id": 1
                }
              },
              "nested": {
                "Annotation": {
                  "fields": {
                    "path": {
                      "rule": "repeated",
                      "type": "int32",
                      "id": 1
                    },
                    "sourceFile": {
                      "type": "string",
                      "id": 2
                    },
                    "begin": {
                      "type": "int32",
                      "id": 3
                    },
                    "end": {
                      "type": "int32",
                      "id": 4
                    }
                  }
                }
              }
            },
            "Duration": {
              "fields": {
                "seconds": {
                  "type": "int64",
                  "id": 1
                },
                "nanos": {
                  "type": "int32",
                  "id": 2
                }
              }
            },
            "Empty": {
              "fields": {}
            },
            "FieldMask": {
              "fields": {
                "paths": {
                  "rule": "repeated",
                  "type": "string",
                  "id": 1
                }
              }
            },
            "Timestamp": {
              "fields": {
                "seconds": {
                  "type": "int64",
                  "id": 1
                },
                "nanos": {
                  "type": "int32",
                  "id": 2
                }
              }
            }
          }
        },
        "pubsub": {
          "nested": {
            "v1": {
              "options": {
                "cc_enable_arenas": true,
                "csharp_namespace": "Google.Cloud.PubSub.V1",
                "go_package": "google.golang.org/genproto/googleapis/pubsub/v1;pubsub",
                "java_multiple_files": true,
                "java_outer_classname": "PubsubProto",
                "java_package": "com.google.pubsub.v1",
                "php_namespace": "Google\\Cloud\\PubSub\\V1",
                "ruby_package": "Google::Cloud::PubSub::V1"
              },
              "nested": {
                "Publisher": {
                  "options": {
                    "(google.api.default_host)": "pubsub.googleapis.com",
                    "(google.api.oauth_scopes)": "https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/pubsub"
                  },
                  "methods": {
                    "CreateTopic": {
                      "requestType": "Topic",
                      "responseType": "Topic",
                      "options": {
                        "(google.api.http).put": "/v1/{name=projects/*/topics/*}",
                        "(google.api.http).body": "*",
                        "(google.api.method_signature)": "name"
                      }
                    },
                    "UpdateTopic": {
                      "requestType": "UpdateTopicRequest",
                      "responseType": "Topic",
                      "options": {
                        "(google.api.http).patch": "/v1/{topic.name=projects/*/topics/*}",
                        "(google.api.http).body": "*"
                      }
                    },
                    "Publish": {
                      "requestType": "PublishRequest",
                      "responseType": "PublishResponse",
                      "options": {
                        "(google.api.http).post": "/v1/{topic=projects/*/topics/*}:publish",
                        "(google.api.http).body": "*",
                        "(google.api.method_signature)": "topic,messages"
                      }
                    },
                    "GetTopic": {
                      "requestType": "GetTopicRequest",
                      "responseType": "Topic",
                      "options": {
                        "(google.api.http).get": "/v1/{topic=projects/*/topics/*}",
                        "(google.api.method_signature)": "topic"
                      }
                    },
                    "ListTopics": {
                      "requestType": "ListTopicsRequest",
                      "responseType": "ListTopicsResponse",
                      "options": {
                        "(google.api.http).get": "/v1/{project=projects/*}/topics",
                        "(google.api.method_signature)": "project"
                      }
                    },
                    "ListTopicSubscriptions": {
                      "requestType": "ListTopicSubscriptionsRequest",
                      "responseType": "ListTopicSubscriptionsResponse",
                      "options": {
                        "(google.api.http).get": "/v1/{topic=projects/*/topics/*}/subscriptions",
                        "(google.api.method_signature)": "topic"
                      }
                    },
                    "ListTopicSnapshots": {
                      "requestType": "ListTopicSnapshotsRequest",
                      "responseType": "ListTopicSnapshotsResponse",
                      "options": {
                        "(google.api.http).get": "/v1/{topic=projects/*/topics/*}/snapshots",
                        "(google.api.method_signature)": "topic"
                      }
                    },
                    "DeleteTopic": {
                      "requestType": "DeleteTopicRequest",
                      "responseType": "google.protobuf.Empty",
                      "options": {
                        "(google.api.http).delete": "/v1/{topic=projects/*/topics/*}",
                        "(google.api.method_signature)": "topic"
                      }
                    }
                  }
                },
                "MessageStoragePolicy": {
                  "fields": {
                    "allowedPersistenceRegions": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 1
                    }
                  }
                },
                "Topic": {
                  "options": {
                    "(google.api.resource).type": "pubsub.googleapis.com/Topic",
                    "(google.api.resource).pattern": "_deleted-topic_"
                  },
                  "fields": {
                    "name": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    },
                    "labels": {
                      "keyType": "string",
                      "type": "string",
                      "id": 2
                    },
                    "messageStoragePolicy": {
                      "type": "MessageStoragePolicy",
                      "id": 3
                    },
                    "kmsKeyName": {
                      "type": "string",
                      "id": 5
                    }
                  }
                },
                "PubsubMessage": {
                  "fields": {
                    "data": {
                      "type": "bytes",
                      "id": 1
                    },
                    "attributes": {
                      "keyType": "string",
                      "type": "string",
                      "id": 2
                    },
                    "messageId": {
                      "type": "string",
                      "id": 3
                    },
                    "publishTime": {
                      "type": "google.protobuf.Timestamp",
                      "id": 4
                    },
                    "orderingKey": {
                      "type": "string",
                      "id": 5
                    }
                  }
                },
                "GetTopicRequest": {
                  "fields": {
                    "topic": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Topic"
                      }
                    }
                  }
                },
                "UpdateTopicRequest": {
                  "fields": {
                    "topic": {
                      "type": "Topic",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    },
                    "updateMask": {
                      "type": "google.protobuf.FieldMask",
                      "id": 2,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    }
                  }
                },
                "PublishRequest": {
                  "fields": {
                    "topic": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Topic"
                      }
                    },
                    "messages": {
                      "rule": "repeated",
                      "type": "PubsubMessage",
                      "id": 2,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    }
                  }
                },
                "PublishResponse": {
                  "fields": {
                    "messageIds": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 1
                    }
                  }
                },
                "ListTopicsRequest": {
                  "fields": {
                    "project": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "cloudresourcemanager.googleapis.com/Project"
                      }
                    },
                    "pageSize": {
                      "type": "int32",
                      "id": 2
                    },
                    "pageToken": {
                      "type": "string",
                      "id": 3
                    }
                  }
                },
                "ListTopicsResponse": {
                  "fields": {
                    "topics": {
                      "rule": "repeated",
                      "type": "Topic",
                      "id": 1
                    },
                    "nextPageToken": {
                      "type": "string",
                      "id": 2
                    }
                  }
                },
                "ListTopicSubscriptionsRequest": {
                  "fields": {
                    "topic": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Topic"
                      }
                    },
                    "pageSize": {
                      "type": "int32",
                      "id": 2
                    },
                    "pageToken": {
                      "type": "string",
                      "id": 3
                    }
                  }
                },
                "ListTopicSubscriptionsResponse": {
                  "fields": {
                    "subscriptions": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Subscription"
                      }
                    },
                    "nextPageToken": {
                      "type": "string",
                      "id": 2
                    }
                  }
                },
                "ListTopicSnapshotsRequest": {
                  "fields": {
                    "topic": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Topic"
                      }
                    },
                    "pageSize": {
                      "type": "int32",
                      "id": 2
                    },
                    "pageToken": {
                      "type": "string",
                      "id": 3
                    }
                  }
                },
                "ListTopicSnapshotsResponse": {
                  "fields": {
                    "snapshots": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 1
                    },
                    "nextPageToken": {
                      "type": "string",
                      "id": 2
                    }
                  }
                },
                "DeleteTopicRequest": {
                  "fields": {
                    "topic": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Topic"
                      }
                    }
                  }
                },
                "Subscriber": {
                  "options": {
                    "(google.api.default_host)": "pubsub.googleapis.com",
                    "(google.api.oauth_scopes)": "https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/pubsub"
                  },
                  "methods": {
                    "CreateSubscription": {
                      "requestType": "Subscription",
                      "responseType": "Subscription",
                      "options": {
                        "(google.api.http).put": "/v1/{name=projects/*/subscriptions/*}",
                        "(google.api.http).body": "*",
                        "(google.api.method_signature)": "name,topic,push_config,ack_deadline_seconds"
                      }
                    },
                    "GetSubscription": {
                      "requestType": "GetSubscriptionRequest",
                      "responseType": "Subscription",
                      "options": {
                        "(google.api.http).get": "/v1/{subscription=projects/*/subscriptions/*}",
                        "(google.api.method_signature)": "subscription"
                      }
                    },
                    "UpdateSubscription": {
                      "requestType": "UpdateSubscriptionRequest",
                      "responseType": "Subscription",
                      "options": {
                        "(google.api.http).patch": "/v1/{subscription.name=projects/*/subscriptions/*}",
                        "(google.api.http).body": "*"
                      }
                    },
                    "ListSubscriptions": {
                      "requestType": "ListSubscriptionsRequest",
                      "responseType": "ListSubscriptionsResponse",
                      "options": {
                        "(google.api.http).get": "/v1/{project=projects/*}/subscriptions",
                        "(google.api.method_signature)": "project"
                      }
                    },
                    "DeleteSubscription": {
                      "requestType": "DeleteSubscriptionRequest",
                      "responseType": "google.protobuf.Empty",
                      "options": {
                        "(google.api.http).delete": "/v1/{subscription=projects/*/subscriptions/*}",
                        "(google.api.method_signature)": "subscription"
                      }
                    },
                    "ModifyAckDeadline": {
                      "requestType": "ModifyAckDeadlineRequest",
                      "responseType": "google.protobuf.Empty",
                      "options": {
                        "(google.api.http).post": "/v1/{subscription=projects/*/subscriptions/*}:modifyAckDeadline",
                        "(google.api.http).body": "*",
                        "(google.api.method_signature)": "subscription,ack_ids,ack_deadline_seconds"
                      }
                    },
                    "Acknowledge": {
                      "requestType": "AcknowledgeRequest",
                      "responseType": "google.protobuf.Empty",
                      "options": {
                        "(google.api.http).post": "/v1/{subscription=projects/*/subscriptions/*}:acknowledge",
                        "(google.api.http).body": "*",
                        "(google.api.method_signature)": "subscription,ack_ids"
                      }
                    },
                    "Pull": {
                      "requestType": "PullRequest",
                      "responseType": "PullResponse",
                      "options": {
                        "(google.api.http).post": "/v1/{subscription=projects/*/subscriptions/*}:pull",
                        "(google.api.http).body": "*",
                        "(google.api.method_signature)": "subscription,return_immediately,max_messages"
                      }
                    },
                    "StreamingPull": {
                      "requestType": "StreamingPullRequest",
                      "requestStream": true,
                      "responseType": "StreamingPullResponse",
                      "responseStream": true
                    },
                    "ModifyPushConfig": {
                      "requestType": "ModifyPushConfigRequest",
                      "responseType": "google.protobuf.Empty",
                      "options": {
                        "(google.api.http).post": "/v1/{subscription=projects/*/subscriptions/*}:modifyPushConfig",
                        "(google.api.http).body": "*",
                        "(google.api.method_signature)": "subscription,push_config"
                      }
                    },
                    "GetSnapshot": {
                      "requestType": "GetSnapshotRequest",
                      "responseType": "Snapshot",
                      "options": {
                        "(google.api.http).get": "/v1/{snapshot=projects/*/snapshots/*}",
                        "(google.api.method_signature)": "snapshot"
                      }
                    },
                    "ListSnapshots": {
                      "requestType": "ListSnapshotsRequest",
                      "responseType": "ListSnapshotsResponse",
                      "options": {
                        "(google.api.http).get": "/v1/{project=projects/*}/snapshots",
                        "(google.api.method_signature)": "project"
                      }
                    },
                    "CreateSnapshot": {
                      "requestType": "CreateSnapshotRequest",
                      "responseType": "Snapshot",
                      "options": {
                        "(google.api.http).put": "/v1/{name=projects/*/snapshots/*}",
                        "(google.api.http).body": "*",
                        "(google.api.method_signature)": "name,subscription"
                      }
                    },
                    "UpdateSnapshot": {
                      "requestType": "UpdateSnapshotRequest",
                      "responseType": "Snapshot",
                      "options": {
                        "(google.api.http).patch": "/v1/{snapshot.name=projects/*/snapshots/*}",
                        "(google.api.http).body": "*"
                      }
                    },
                    "DeleteSnapshot": {
                      "requestType": "DeleteSnapshotRequest",
                      "responseType": "google.protobuf.Empty",
                      "options": {
                        "(google.api.http).delete": "/v1/{snapshot=projects/*/snapshots/*}",
                        "(google.api.method_signature)": "snapshot"
                      }
                    },
                    "Seek": {
                      "requestType": "SeekRequest",
                      "responseType": "SeekResponse",
                      "options": {
                        "(google.api.http).post": "/v1/{subscription=projects/*/subscriptions/*}:seek",
                        "(google.api.http).body": "*"
                      }
                    }
                  }
                },
                "Subscription": {
                  "options": {
                    "(google.api.resource).type": "pubsub.googleapis.com/Subscription",
                    "(google.api.resource).pattern": "projects/{project}/subscriptions/{subscription}"
                  },
                  "fields": {
                    "name": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    },
                    "topic": {
                      "type": "string",
                      "id": 2,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Topic"
                      }
                    },
                    "pushConfig": {
                      "type": "PushConfig",
                      "id": 4
                    },
                    "ackDeadlineSeconds": {
                      "type": "int32",
                      "id": 5
                    },
                    "retainAckedMessages": {
                      "type": "bool",
                      "id": 7
                    },
                    "messageRetentionDuration": {
                      "type": "google.protobuf.Duration",
                      "id": 8
                    },
                    "labels": {
                      "keyType": "string",
                      "type": "string",
                      "id": 9
                    },
                    "enableMessageOrdering": {
                      "type": "bool",
                      "id": 10
                    },
                    "expirationPolicy": {
                      "type": "ExpirationPolicy",
                      "id": 11
                    },
                    "filter": {
                      "type": "string",
                      "id": 12
                    },
                    "deadLetterPolicy": {
                      "type": "DeadLetterPolicy",
                      "id": 13
                    },
                    "retryPolicy": {
                      "type": "RetryPolicy",
                      "id": 14
                    }
                  }
                },
                "RetryPolicy": {
                  "fields": {
                    "minimumBackoff": {
                      "type": "google.protobuf.Duration",
                      "id": 1
                    },
                    "maximumBackoff": {
                      "type": "google.protobuf.Duration",
                      "id": 2
                    }
                  }
                },
                "DeadLetterPolicy": {
                  "fields": {
                    "deadLetterTopic": {
                      "type": "string",
                      "id": 1
                    },
                    "maxDeliveryAttempts": {
                      "type": "int32",
                      "id": 2
                    }
                  }
                },
                "ExpirationPolicy": {
                  "fields": {
                    "ttl": {
                      "type": "google.protobuf.Duration",
                      "id": 1
                    }
                  }
                },
                "PushConfig": {
                  "oneofs": {
                    "authenticationMethod": {
                      "oneof": [
                        "oidcToken"
                      ]
                    }
                  },
                  "fields": {
                    "pushEndpoint": {
                      "type": "string",
                      "id": 1
                    },
                    "attributes": {
                      "keyType": "string",
                      "type": "string",
                      "id": 2
                    },
                    "oidcToken": {
                      "type": "OidcToken",
                      "id": 3
                    }
                  },
                  "nested": {
                    "OidcToken": {
                      "fields": {
                        "serviceAccountEmail": {
                          "type": "string",
                          "id": 1
                        },
                        "audience": {
                          "type": "string",
                          "id": 2
                        }
                      }
                    }
                  }
                },
                "ReceivedMessage": {
                  "fields": {
                    "ackId": {
                      "type": "string",
                      "id": 1
                    },
                    "message": {
                      "type": "PubsubMessage",
                      "id": 2
                    },
                    "deliveryAttempt": {
                      "type": "int32",
                      "id": 3
                    }
                  }
                },
                "GetSubscriptionRequest": {
                  "fields": {
                    "subscription": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Subscription"
                      }
                    }
                  }
                },
                "UpdateSubscriptionRequest": {
                  "fields": {
                    "subscription": {
                      "type": "Subscription",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    },
                    "updateMask": {
                      "type": "google.protobuf.FieldMask",
                      "id": 2,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    }
                  }
                },
                "ListSubscriptionsRequest": {
                  "fields": {
                    "project": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "cloudresourcemanager.googleapis.com/Project"
                      }
                    },
                    "pageSize": {
                      "type": "int32",
                      "id": 2
                    },
                    "pageToken": {
                      "type": "string",
                      "id": 3
                    }
                  }
                },
                "ListSubscriptionsResponse": {
                  "fields": {
                    "subscriptions": {
                      "rule": "repeated",
                      "type": "Subscription",
                      "id": 1
                    },
                    "nextPageToken": {
                      "type": "string",
                      "id": 2
                    }
                  }
                },
                "DeleteSubscriptionRequest": {
                  "fields": {
                    "subscription": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Subscription"
                      }
                    }
                  }
                },
                "ModifyPushConfigRequest": {
                  "fields": {
                    "subscription": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Subscription"
                      }
                    },
                    "pushConfig": {
                      "type": "PushConfig",
                      "id": 2,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    }
                  }
                },
                "PullRequest": {
                  "fields": {
                    "subscription": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Subscription"
                      }
                    },
                    "returnImmediately": {
                      "type": "bool",
                      "id": 2,
                      "options": {
                        "deprecated": true,
                        "(google.api.field_behavior)": "OPTIONAL"
                      }
                    },
                    "maxMessages": {
                      "type": "int32",
                      "id": 3,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    }
                  }
                },
                "PullResponse": {
                  "fields": {
                    "receivedMessages": {
                      "rule": "repeated",
                      "type": "ReceivedMessage",
                      "id": 1
                    }
                  }
                },
                "ModifyAckDeadlineRequest": {
                  "fields": {
                    "subscription": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Subscription"
                      }
                    },
                    "ackIds": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 4,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    },
                    "ackDeadlineSeconds": {
                      "type": "int32",
                      "id": 3,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    }
                  }
                },
                "AcknowledgeRequest": {
                  "fields": {
                    "subscription": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Subscription"
                      }
                    },
                    "ackIds": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 2,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    }
                  }
                },
                "StreamingPullRequest": {
                  "fields": {
                    "subscription": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Subscription"
                      }
                    },
                    "ackIds": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 2
                    },
                    "modifyDeadlineSeconds": {
                      "rule": "repeated",
                      "type": "int32",
                      "id": 3
                    },
                    "modifyDeadlineAckIds": {
                      "rule": "repeated",
                      "type": "string",
                      "id": 4
                    },
                    "streamAckDeadlineSeconds": {
                      "type": "int32",
                      "id": 5,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    },
                    "clientId": {
                      "type": "string",
                      "id": 6
                    }
                  }
                },
                "StreamingPullResponse": {
                  "fields": {
                    "receivedMessages": {
                      "rule": "repeated",
                      "type": "ReceivedMessage",
                      "id": 1
                    }
                  }
                },
                "CreateSnapshotRequest": {
                  "fields": {
                    "name": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Snapshot"
                      }
                    },
                    "subscription": {
                      "type": "string",
                      "id": 2,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Subscription"
                      }
                    },
                    "labels": {
                      "keyType": "string",
                      "type": "string",
                      "id": 3
                    }
                  }
                },
                "UpdateSnapshotRequest": {
                  "fields": {
                    "snapshot": {
                      "type": "Snapshot",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    },
                    "updateMask": {
                      "type": "google.protobuf.FieldMask",
                      "id": 2,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED"
                      }
                    }
                  }
                },
                "Snapshot": {
                  "options": {
                    "(google.api.resource).type": "pubsub.googleapis.com/Snapshot",
                    "(google.api.resource).pattern": "projects/{project}/snapshots/{snapshot}"
                  },
                  "fields": {
                    "name": {
                      "type": "string",
                      "id": 1
                    },
                    "topic": {
                      "type": "string",
                      "id": 2,
                      "options": {
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Topic"
                      }
                    },
                    "expireTime": {
                      "type": "google.protobuf.Timestamp",
                      "id": 3
                    },
                    "labels": {
                      "keyType": "string",
                      "type": "string",
                      "id": 4
                    }
                  }
                },
                "GetSnapshotRequest": {
                  "fields": {
                    "snapshot": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Snapshot"
                      }
                    }
                  }
                },
                "ListSnapshotsRequest": {
                  "fields": {
                    "project": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "cloudresourcemanager.googleapis.com/Project"
                      }
                    },
                    "pageSize": {
                      "type": "int32",
                      "id": 2
                    },
                    "pageToken": {
                      "type": "string",
                      "id": 3
                    }
                  }
                },
                "ListSnapshotsResponse": {
                  "fields": {
                    "snapshots": {
                      "rule": "repeated",
                      "type": "Snapshot",
                      "id": 1
                    },
                    "nextPageToken": {
                      "type": "string",
                      "id": 2
                    }
                  }
                },
                "DeleteSnapshotRequest": {
                  "fields": {
                    "snapshot": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Snapshot"
                      }
                    }
                  }
                },
                "SeekRequest": {
                  "oneofs": {
                    "target": {
                      "oneof": [
                        "time",
                        "snapshot"
                      ]
                    }
                  },
                  "fields": {
                    "subscription": {
                      "type": "string",
                      "id": 1,
                      "options": {
                        "(google.api.field_behavior)": "REQUIRED",
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Subscription"
                      }
                    },
                    "time": {
                      "type": "google.protobuf.Timestamp",
                      "id": 2
                    },
                    "snapshot": {
                      "type": "string",
                      "id": 3,
                      "options": {
                        "(google.api.resource_reference).type": "pubsub.googleapis.com/Snapshot"
                      }
                    }
                  }
                },
                "SeekResponse": {
                  "fields": {}
                }
              }
            }
          }
        }
      }
    }
  }
}
