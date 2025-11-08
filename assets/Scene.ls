{
  "_$ver": 1,
  "_$id": "77s5x18u",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "width": 1334,
  "height": 750,
  "_$child": [
    {
      "_$id": "n9gjxcltvl",
      "_$type": "Scene3D",
      "name": "Scene3D",
      "skyRenderer": {
        "meshType": "dome",
        "material": {
          "_$uuid": "793cffc6-730a-4756-a658-efe98c230292",
          "_$type": "Material"
        }
      },
      "ambientColor": {
        "_$type": "Color",
        "r": 0.424308,
        "g": 0.4578516,
        "b": 0.5294118
      },
      "_reflectionsIblSamples": 1024,
      "fogStart": 0,
      "fogEnd": 300,
      "fogColor": {
        "_$type": "Color",
        "r": 0.5,
        "g": 0.5,
        "b": 0.5
      },
      "_$child": [
        {
          "_$id": "6jx8h8bvc6",
          "_$type": "Camera",
          "name": "Main Camera",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": -5.248912788107809,
              "y": 1.726381006187014,
              "z": -1.1604959557002474
            },
            "localRotation": {
              "_$type": "Quaternion",
              "x": 0.01137012795389451,
              "y": 0.7242754124543297,
              "z": 0.011946819474717117,
              "w": -0.6893135140187383
            }
          },
          "orthographic": true,
          "orthographicVerticalSize": 5.119,
          "nearPlane": 0.3,
          "farPlane": 1000,
          "clearFlag": 1,
          "clearColor": {
            "_$type": "Color",
            "r": 0.3921,
            "g": 0.5843,
            "b": 0.9294
          }
        },
        {
          "_$id": "6ni3p096l5",
          "_$type": "LightSprite",
          "name": "Direction Light",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 5,
              "y": 5,
              "z": 5
            },
            "localRotation": {
              "_$type": "Quaternion",
              "x": -0.40821789367673483,
              "y": 0.23456971600980447,
              "z": 0.109381654946615,
              "w": 0.875426098065593
            }
          },
          "_$comp": [
            {
              "_$type": "DirectionLightCom",
              "color": {
                "_$type": "Color",
                "r": 0.6,
                "g": 0.6,
                "b": 0.6
              },
              "strength": 1,
              "angle": 0.526,
              "maxBounces": 1024
            }
          ]
        },
        {
          "_$id": "q71t19h9",
          "_$prefab": "6717f8fc-afc5-4551-b67b-fa4684ea2ba7",
          "name": "Swagger Walk",
          "active": true,
          "layer": 0,
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 0.25946001529976487,
              "z": -4.5366563585327
            },
            "localRotation": {
              "_$type": "Quaternion"
            },
            "localScale": {
              "_$type": "Vector3",
              "x": 1,
              "y": 1,
              "z": 1
            }
          },
          "_$comp": [
            {
              "_$override": "Animator",
              "controller": {
                "_$uuid": "0fb5fc95-d8e8-4e50-ac12-b6ac01804621",
                "_$type": "AnimationController"
              }
            },
            {
              "_$type": "11188e86-7135-4043-a96c-35d2a114a236",
              "scriptPath": "../src/PersonScript.ts",
              "leftBlendWeight": 1,
              "rightBlendWeight": 1
            },
            {
              "_$type": "CharacterController",
              "collisionGroup": 1,
              "canCollideWith": -1,
              "centerOffset": {
                "_$type": "Vector3",
                "y": 1.114
              },
              "stepHeight": 0.5
            },
            {
              "_$type": "IK_Comp",
              "chainDatas": [
                {
                  "_$type": "IK_ChainData",
                  "name": "right",
                  "end": {
                    "_$ref": "9g20tf4y"
                  },
                  "root": {
                    "_$ref": [
                      "q71t19h9",
                      "#171"
                    ]
                  },
                  "bones": [
                    {
                      "_$type": "BoneData",
                      "data": {
                        "_$ref": "9g20tf4y"
                      }
                    },
                    {
                      "_$type": "BoneData",
                      "data": {
                        "_$ref": [
                          "q71t19h9",
                          "#173"
                        ]
                      }
                    },
                    {
                      "_$type": "BoneData",
                      "data": {
                        "_$ref": [
                          "q71t19h9",
                          "#172"
                        ]
                      }
                    },
                    {
                      "_$type": "BoneData",
                      "data": {
                        "_$ref": [
                          "q71t19h9",
                          "#171"
                        ]
                      }
                    }
                  ],
                  "alignTarget": "y",
                  "PoleTarget": {
                    "_$ref": "2qtjymif"
                  },
                  "enable": true
                },
                {
                  "_$type": "IK_ChainData",
                  "name": "left",
                  "end": {
                    "_$ref": "qygln5jw"
                  },
                  "root": {
                    "_$ref": [
                      "q71t19h9",
                      "#166"
                    ]
                  },
                  "bones": [
                    {
                      "_$type": "BoneData",
                      "data": {
                        "_$ref": "qygln5jw"
                      },
                      "disabled": true
                    },
                    {
                      "_$type": "BoneData",
                      "data": {
                        "_$ref": [
                          "q71t19h9",
                          "#168"
                        ]
                      }
                    },
                    {
                      "_$type": "BoneData",
                      "data": {
                        "_$ref": [
                          "q71t19h9",
                          "#167"
                        ]
                      }
                    },
                    {
                      "_$type": "BoneData",
                      "data": {
                        "_$ref": [
                          "q71t19h9",
                          "#166"
                        ]
                      }
                    }
                  ],
                  "alignTarget": "y",
                  "PoleTarget": {
                    "_$ref": "nq0xj1d9"
                  },
                  "enable": true
                }
              ],
              "solverIteration": 50,
              "dirSolverIteration": 10,
              "dampingFactor": 0.623
            }
          ],
          "_$child": [
            {
              "_$id": "qygln5jw",
              "_$parent": "#168",
              "_$index": 1,
              "_$type": "Sprite3D",
              "name": "leftFoot",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0.757008040397114,
                  "y": -2.6030451614389563,
                  "z": -8.963996711556831
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": -0.03482062877449593,
                  "y": 0.4424612791293753,
                  "z": 0.8933492814106836,
                  "w": 0.07030363920851632
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 0.9999999475353194,
                  "y": 0.9999999818741641,
                  "z": 0.9999999928251148
                }
              }
            },
            {
              "_$id": "nq0xj1d9",
              "_$parent": "#168",
              "_$type": "Sprite3D",
              "name": "Cube",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": -4.709479938806616,
                  "y": 27.005448811142514,
                  "z": 56.982255271701035
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": -0.034820629710955106,
                  "y": 0.4424612791197317,
                  "z": 0.8933492812865458,
                  "w": 0.07030364038281317
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 1.000000025350391,
                  "y": 1.0000000037361478,
                  "z": 1.0000000010692345
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "lightmapScaleOffset": {
                    "_$type": "Vector4"
                  },
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                }
              ]
            },
            {
              "_$id": "9g20tf4y",
              "_$parent": "#173",
              "_$index": 1,
              "_$type": "Sprite3D",
              "name": "rightFoot",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": -1.5880326898426773,
                  "y": 2.5030035908879427,
                  "z": -10.74503919493452
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": -0.03461310881831596,
                  "y": -0.44057832542946773,
                  "z": -0.8942909830047724,
                  "w": 0.07025887542549672
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 1.0000000322353697,
                  "y": 0.9999999555329984,
                  "z": 1.0000000273396632
                }
              }
            },
            {
              "_$id": "2qtjymif",
              "_$parent": "#173",
              "_$type": "Sprite3D",
              "name": "Cube",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 4.10977406157693,
                  "y": 27.991086828858215,
                  "z": 54.31381550409236
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": -0.03461310750581424,
                  "y": -0.4405783261007697,
                  "z": -0.8942909829154931,
                  "w": 0.07025887299890297
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 0.9999999930082336,
                  "y": 0.9999999702309076,
                  "z": 0.999999985820422
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "lightmapScaleOffset": {
                    "_$type": "Vector4"
                  },
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "_$id": "2vs4sygg",
          "_$type": "Sprite3D",
          "name": "floor2",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 0.04780074581503868,
              "y": -0.29518633051438686,
              "z": -3.0160785554209433
            },
            "localRotation": {
              "_$type": "Quaternion",
              "x": -0.18437594967456314,
              "w": 0.982855792668285
            },
            "localScale": {
              "_$type": "Vector3",
              "x": 1,
              "y": 0.169998899102211,
              "z": 4.7599862
            }
          },
          "_$comp": [
            {
              "_$type": "MeshFilter",
              "sharedMesh": {
                "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                "_$type": "Mesh"
              }
            },
            {
              "_$type": "MeshRenderer",
              "lightmapScaleOffset": {
                "_$type": "Vector4"
              },
              "sharedMaterials": [
                {
                  "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                  "_$type": "Material"
                }
              ]
            },
            {
              "_$type": "PhysicsCollider",
              "colliderShape": {
                "_$type": "BoxColliderShape"
              },
              "collisionGroup": 1,
              "canCollideWith": -1
            }
          ]
        },
        {
          "_$id": "8ztmlek6",
          "_$type": "Sprite3D",
          "name": "floor",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 0.047800746776647,
              "y": -0.08593934851643148,
              "z": -4.9720635
            },
            "localScale": {
              "_$type": "Vector3",
              "x": 1,
              "y": 0.1699989,
              "z": 5.5599858
            }
          },
          "_$comp": [
            {
              "_$type": "MeshFilter",
              "sharedMesh": {
                "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                "_$type": "Mesh"
              }
            },
            {
              "_$type": "MeshRenderer",
              "lightmapScaleOffset": {
                "_$type": "Vector4"
              },
              "sharedMaterials": [
                {
                  "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                  "_$type": "Material"
                }
              ]
            },
            {
              "_$type": "PhysicsCollider",
              "colliderShape": {
                "_$type": "BoxColliderShape"
              },
              "collisionGroup": 1,
              "canCollideWith": -1
            }
          ]
        },
        {
          "_$id": "voqy0hzz",
          "_$type": "Sprite3D",
          "name": "台阶",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": -0.0392891974142713,
              "y": 1.5542597917399101,
              "z": -0.9026419063153942
            }
          },
          "_$child": [
            {
              "_$id": "n68lpvbe",
              "_$type": "Sprite3D",
              "name": "1",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0.08299853022784087,
                  "y": -0.8883680624422681,
                  "z": 0.5841904114497403
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 0.8699997,
                  "y": 0.2199987,
                  "z": 1.1999988
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "lightmapScaleOffset": {
                    "_$type": "Vector4"
                  },
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                },
                {
                  "_$type": "PhysicsCollider",
                  "colliderShape": {
                    "_$type": "BoxColliderShape"
                  },
                  "collisionGroup": 1,
                  "canCollideWith": -1
                }
              ]
            },
            {
              "_$id": "tofxtrom",
              "_$type": "Sprite3D",
              "name": "2",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0.08299852907657623,
                  "y": -0.6683904931944726,
                  "z": 1.3403181388038774
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 0.8699997,
                  "y": 0.2199987,
                  "z": 1.1999988
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "lightmapScaleOffset": {
                    "_$type": "Vector4"
                  },
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                },
                {
                  "_$type": "PhysicsCollider",
                  "colliderShape": {
                    "_$type": "BoxColliderShape"
                  },
                  "collisionGroup": 1,
                  "canCollideWith": -1
                }
              ]
            },
            {
              "_$id": "m0afozck",
              "_$type": "Sprite3D",
              "name": "4",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0.08299852907657623,
                  "y": -0.23691454643051646,
                  "z": 2.9723661431916577
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 0.8699997,
                  "y": 0.2199987,
                  "z": 1.1999988
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "lightmapScaleOffset": {
                    "_$type": "Vector4"
                  },
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                },
                {
                  "_$type": "PhysicsCollider",
                  "colliderShape": {
                    "_$type": "BoxColliderShape"
                  },
                  "collisionGroup": 1,
                  "canCollideWith": -1
                }
              ]
            },
            {
              "_$id": "637rjmty",
              "_$type": "Sprite3D",
              "name": "3",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0.08299852907657623,
                  "y": -0.45689210408966563,
                  "z": 2.2790893354694104
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 0.8699997,
                  "y": 0.2199987,
                  "z": 1.1999988
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "lightmapScaleOffset": {
                    "_$type": "Vector4"
                  },
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                },
                {
                  "_$type": "PhysicsCollider",
                  "colliderShape": {
                    "_$type": "BoxColliderShape"
                  },
                  "collisionGroup": 1,
                  "canCollideWith": -1
                }
              ]
            },
            {
              "_$id": "meg6xkmp",
              "_$type": "Sprite3D",
              "name": "5",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0.08299852907657623,
                  "y": -0.04520009973621075,
                  "z": 3.9161425190022943
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 0.8699997,
                  "y": 0.2199987,
                  "z": 1.1999988
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "lightmapScaleOffset": {
                    "_$type": "Vector4"
                  },
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                },
                {
                  "_$type": "PhysicsCollider",
                  "colliderShape": {
                    "_$type": "BoxColliderShape"
                  },
                  "collisionGroup": 1,
                  "canCollideWith": -1
                }
              ]
            },
            {
              "_$id": "lvb492h7",
              "_$type": "Sprite3D",
              "name": "6",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0.08299852907657623,
                  "y": 0.1747775175275832,
                  "z": 4.672269876485204
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 0.8699997,
                  "y": 0.2199987,
                  "z": 1.1999988
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "lightmapScaleOffset": {
                    "_$type": "Vector4"
                  },
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                },
                {
                  "_$type": "PhysicsCollider",
                  "colliderShape": {
                    "_$type": "BoxColliderShape"
                  },
                  "collisionGroup": 1,
                  "canCollideWith": -1
                }
              ]
            },
            {
              "_$id": "fcyn2ma7",
              "_$type": "Sprite3D",
              "name": "8",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0.08299852907657623,
                  "y": 0.6062535144987136,
                  "z": 6.304318006520605
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 0.8699997,
                  "y": 0.2199987,
                  "z": 1.1999988
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "lightmapScaleOffset": {
                    "_$type": "Vector4"
                  },
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                },
                {
                  "_$type": "PhysicsCollider",
                  "colliderShape": {
                    "_$type": "BoxColliderShape"
                  },
                  "collisionGroup": 1,
                  "canCollideWith": -1
                }
              ]
            },
            {
              "_$id": "ujrzxnf5",
              "_$type": "Sprite3D",
              "name": "7",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0.08299852907657623,
                  "y": 0.3862758972349196,
                  "z": 5.611041124348974
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 0.8699997,
                  "y": 0.2199987,
                  "z": 1.1999988
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "lightmapScaleOffset": {
                    "_$type": "Vector4"
                  },
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                },
                {
                  "_$type": "PhysicsCollider",
                  "colliderShape": {
                    "_$type": "BoxColliderShape"
                  },
                  "collisionGroup": 1,
                  "canCollideWith": -1
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}