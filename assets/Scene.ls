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
        "r": 0.8759689922480621,
        "g": 0.8759689922480621,
        "b": 0.8759689922480621
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
          "orthographicVerticalSize": 5.119,
          "nearPlane": 0.3,
          "farPlane": 1000,
          "clearFlag": 1,
          "clearColor": {
            "_$type": "Color",
            "r": 0.3921,
            "g": 0.5843,
            "b": 0.9294
          },
          "_$comp": [
            {
              "_$type": "d2c646ee-92ed-45ce-857b-6b03e3a9c5a9",
              "scriptPath": "../src/ctrl/CameraController1.ts",
              "startTarget": {
                "_$ref": "ei6xsdzp"
              }
            }
          ]
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
              "shadowMode": 2,
              "strength": 1,
              "angle": 0.526,
              "maxBounces": 1024
            }
          ]
        },
        {
          "_$id": "jz9t2xsz",
          "_$type": "Sprite3D",
          "name": "地面",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": -0.2582730926120753,
              "y": 0.598199398770323,
              "z": -4.192818154667514
            }
          },
          "_$child": [
            {
              "_$id": "2vs4sygg",
              "_$type": "Sprite3D",
              "name": "floor2",
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0.3060738444328308,
                  "y": -0.8933857679367065,
                  "z": 1.1767396926879883
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": -0.184375953715605,
                  "w": 0.9828557919102177
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 1,
                  "y": 0.1699988958315518,
                  "z": 4.759986045872846
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
                  "x": 0.3060738444328308,
                  "y": -0.6841387748718262,
                  "z": -0.7792453765869141
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 1,
                  "y": 0.169998899102211,
                  "z": 5.559985637664795
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
                  "x": 0.21898388862609863,
                  "y": 0.9560603499412537,
                  "z": 3.2901763916015625
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
                      "y": -0.6683905124664307,
                      "z": 1.3186545977844806
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
                      "y": -0.2369145154953003,
                      "z": 2.732066853281235
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
                      "y": -0.45689213275909424,
                      "z": 2.0501123314063845
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
                      "y": -0.04520010948181152,
                      "z": 3.4996510056965406
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
                      "y": 0.17477750778198242,
                      "z": 4.201133325091764
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
                      "y": 0.6062536239624023,
                      "z": 5.585232381250098
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
                      "y": 0.38627588748931885,
                      "z": 4.911203861604265
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
                  "_$id": "iqt3m61v",
                  "_$type": "Sprite3D",
                  "name": "1_1",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": 0.08299852907657623,
                      "y": 0.8108509823298071,
                      "z": 6.334581043444461
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
                  "_$id": "6xf3eww9",
                  "_$type": "Sprite3D",
                  "name": "2_1",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": 0.08299852907657623,
                      "y": 1.0308285399889563,
                      "z": 7.06904527159769
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
                  "_$id": "0rx9nost",
                  "_$type": "Sprite3D",
                  "name": "4_1",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": 0.08299852907657623,
                      "y": 1.4623045369600867,
                      "z": 8.482457484923192
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
                  "_$id": "gdh10yln",
                  "_$type": "Sprite3D",
                  "name": "3_1",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": 0.08299852907657623,
                      "y": 1.2423269196962927,
                      "z": 7.800502862654514
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
                  "_$id": "owkh23s4",
                  "_$type": "Sprite3D",
                  "name": "5_1",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": 0.08299852907657623,
                      "y": 1.6540189429735754,
                      "z": 9.250041570387669
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
                  "_$id": "fdcjy98y",
                  "_$type": "Sprite3D",
                  "name": "6_1",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": 0.08299852907657623,
                      "y": 1.8739965602373694,
                      "z": 9.951523866377656
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
                  "_$id": "x3vji8ti",
                  "_$type": "Sprite3D",
                  "name": "8_1",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": 0.08299852907657623,
                      "y": 2.3054726764177893,
                      "z": 11.33562287303048
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
                  "_$id": "mpe27z4m",
                  "_$type": "Sprite3D",
                  "name": "7_1",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": 0.08299852907657623,
                      "y": 2.085494939944706,
                      "z": 10.661594476424035
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
        },
        {
          "_$id": "ei6xsdzp",
          "_$type": "Sprite3D",
          "name": "人物",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "z": -5.458611442227972
            }
          },
          "_$comp": [
            {
              "_$type": "CharacterController",
              "collisionGroup": 1,
              "canCollideWith": -1,
              "centerOffset": {
                "_$type": "Vector3",
                "y": 0.994
              },
              "stepHeight": 0.52
            },
            {
              "_$type": "Animator",
              "controller": {
                "_$uuid": "09b24967-de80-4b2a-8599-92dbfa487f32",
                "_$type": "AnimationController"
              },
              "controllerLayers": [
                {
                  "_$type": "AnimatorControllerLayer",
                  "name": "Base Layer",
                  "states": [
                    {
                      "_$type": "AnimatorState",
                      "name": "run",
                      "clipStart": 0,
                      "clip": {
                        "_$uuid": "2359ffd3-f79f-4751-b43b-3fca7b0ce778",
                        "_$type": "AnimationClip"
                      },
                      "soloTransitions": []
                    },
                    {
                      "_$type": "AnimatorState",
                      "name": "walk",
                      "clipStart": 0,
                      "clip": {
                        "_$uuid": "2359ffd3-f79f-4751-b43b-3fca7b0ce778",
                        "_$type": "AnimationClip"
                      },
                      "soloTransitions": []
                    },
                    {
                      "_$type": "AnimatorState",
                      "name": "idle",
                      "clipStart": 0,
                      "clip": {
                        "_$uuid": "6405bc37-7d29-4c59-94b6-1d61095270ff",
                        "_$type": "AnimationClip"
                      },
                      "soloTransitions": []
                    }
                  ],
                  "defaultStateName": "idle"
                }
              ]
            }
          ],
          "_$child": [
            {
              "_$id": "4v08fmbw",
              "_$prefab": "4abb090f-b674-4519-ab91-33f1c53d54a4",
              "name": "人物模型",
              "active": true,
              "layer": 0,
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "y": -0.0032129972241818905,
                  "z": 0.004902362823486328
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
                  },
                  "enabled": true
                },
                {
                  "_$type": "4670af2c-a27a-4892-bf7a-b953ed36bbce",
                  "scriptPath": "../src/PersonScript2.ts",
                  "leftBlendWeight": 1,
                  "rightBlendWeight": 1
                },
                {
                  "_$type": "IK_Comp",
                  "enabled": false,
                  "chainDatas": [
                    {
                      "_$type": "IK_ChainData",
                      "name": "right",
                      "end": {
                        "_$ref": "xmll4e7t"
                      },
                      "root": {
                        "_$ref": [
                          "4v08fmbw",
                          "#164"
                        ]
                      },
                      "bones": [
                        {
                          "_$type": "BoneData",
                          "data": {
                            "_$ref": "xmll4e7t"
                          }
                        },
                        {
                          "_$type": "BoneData",
                          "data": {
                            "_$ref": [
                              "4v08fmbw",
                              "#166"
                            ]
                          }
                        },
                        {
                          "_$type": "BoneData",
                          "data": {
                            "_$ref": [
                              "4v08fmbw",
                              "#165"
                            ]
                          }
                        },
                        {
                          "_$type": "BoneData",
                          "data": {
                            "_$ref": [
                              "4v08fmbw",
                              "#164"
                            ]
                          }
                        }
                      ],
                      "alignTarget": "y",
                      "enablePoleTarget": true,
                      "PoleTarget": {
                        "_$ref": "e2qn3b99"
                      },
                      "blendWeight": 0,
                      "smoothBlendWeight": true
                    },
                    {
                      "_$type": "IK_ChainData",
                      "name": "left",
                      "end": {
                        "_$ref": "syks84p4"
                      },
                      "root": {
                        "_$ref": [
                          "4v08fmbw",
                          "#169"
                        ]
                      },
                      "bones": [
                        {
                          "_$type": "BoneData",
                          "data": {
                            "_$ref": "syks84p4"
                          }
                        },
                        {
                          "_$type": "BoneData",
                          "data": {
                            "_$ref": [
                              "4v08fmbw",
                              "#171"
                            ]
                          }
                        },
                        {
                          "_$type": "BoneData",
                          "data": {
                            "_$ref": [
                              "4v08fmbw",
                              "#170"
                            ]
                          }
                        },
                        {
                          "_$type": "BoneData",
                          "data": {
                            "_$ref": [
                              "4v08fmbw",
                              "#169"
                            ]
                          }
                        }
                      ],
                      "alignTarget": "y",
                      "enablePoleTarget": true,
                      "PoleTarget": {
                        "_$ref": "c2sng9uy"
                      },
                      "smoothBlendWeight": true
                    }
                  ],
                  "solverIteration": 43,
                  "dirSolverIteration": 25,
                  "dampingFactor": 0.911
                },
                {
                  "_$type": "45a75369-e319-4c4f-b08d-30558b0d1093",
                  "scriptPath": "../src/IK/IK_Comp.ts",
                  "chainDatas": [
                    {
                      "_$type": "732f4274-ac43-492f-89c6-d519a49e8564",
                      "name": "left",
                      "end": {
                        "_$ref": "syks84p4"
                      },
                      "root": null,
                      "bones": null,
                      "fixedEnd": false,
                      "alignTarget": "y",
                      "target": {
                        "_$ref": "1y9vhbpb"
                      },
                      "enablePoleTarget": true,
                      "PoleTarget": {
                        "_$ref": "c2sng9uy"
                      },
                      "jointCount": 4
                    },
                    {
                      "_$type": "732f4274-ac43-492f-89c6-d519a49e8564",
                      "name": "right",
                      "end": {
                        "_$ref": "xmll4e7t"
                      },
                      "root": null,
                      "bones": null,
                      "fixedEnd": false,
                      "alignTarget": "y",
                      "target": null,
                      "enablePoleTarget": true,
                      "PoleTarget": {
                        "_$ref": "e2qn3b99"
                      },
                      "jointCount": 4,
                      "enable": false
                    }
                  ],
                  "solverIteration": 71,
                  "dirSolverIteration": 10,
                  "dampingFactor": 0.972,
                  "showGizmos": true,
                  "recordIkFrames": false,
                  "frameRecordDepth": 240,
                  "frameReplayOffset": 0,
                  "显示约束": true,
                  "显约束轴": true,
                  "RunInEditor": false,
                  "useAnimLayer": false,
                  "showBone": false,
                  "pickBone": true,
                  "pickHideBone": false,
                  "hideBone": false,
                  "enableControl": false,
                  "controlWithConstraint": false,
                  "showAxis": false,
                  "axisLength": 0.3,
                  "poseName": "zhan"
                },
                {
                  "_$type": "038181e4-80c7-46a9-a3f5-7c080ae802f9",
                  "scriptPath": "../src/IK/IK_DebugSystem.ts",
                  "ui": {
                    "_$ref": "d2rn23d7"
                  }
                },
                {
                  "_$type": "c14be900-64b4-4aed-b5c0-9b0a58d5d922",
                  "scriptPath": "../src/IK/BoneConstraints.ts",
                  "constraints": [
                    {
                      "_$type": "cfe1d96e-589c-429c-8a34-550da5bd5dbf",
                      "enable": false,
                      "bone": {
                        "_$ref": [
                          "4v08fmbw",
                          "#169"
                        ]
                      },
                      "type": "swingtwist",
                      "space": null,
                      "constraintBone": true,
                      "xmax": 32.795,
                      "ymax": 29.745
                    }
                  ]
                }
              ],
              "_$child": [
                {
                  "_$id": "xmll4e7t",
                  "_$parent": "#166",
                  "_$type": "Sprite3D",
                  "name": "RightFoot",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": -0.0007242350839078426,
                      "y": 6.148427486419678,
                      "z": -7.520066261291504
                    },
                    "localRotation": {
                      "_$type": "Quaternion",
                      "x": 1.1031211924775005e-7,
                      "y": 0.42910345498326163,
                      "z": 0.9032553486812579,
                      "w": -3.392605339074951e-7
                    },
                    "localScale": {
                      "_$type": "Vector3",
                      "x": 1.0000000000002545,
                      "y": 1.000000001016511,
                      "z": 1.000000001016265
                    }
                  }
                },
                {
                  "_$id": "syks84p4",
                  "_$parent": "#171",
                  "_$type": "Sprite3D",
                  "name": "LeftFoot",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": 0.0005338710616342723,
                      "y": 6.147222995758057,
                      "z": -2.9689865112304688
                    },
                    "localRotation": {
                      "_$type": "Quaternion",
                      "x": 1.1478161521986398e-7,
                      "y": 0.4291034152758748,
                      "z": 0.9032553675447773,
                      "w": -3.4125293130607997e-7
                    },
                    "localScale": {
                      "_$type": "Vector3",
                      "x": 1.0000000000002591,
                      "y": 1.000000076325851,
                      "z": 1.000000076325599
                    }
                  }
                },
                {
                  "_$id": "c2sng9uy",
                  "_$index": 3,
                  "_$type": "Sprite3D",
                  "name": "LeftPole",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": 0.10026916861534119,
                      "y": 0.5322197079658508,
                      "z": 0.5742688179016113
                    },
                    "localScale": {
                      "_$type": "Vector3",
                      "x": 0.10000000149011612,
                      "y": 0.10000000149011612,
                      "z": 0.10000000149011612
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
                  "_$id": "e2qn3b99",
                  "_$type": "Sprite3D",
                  "name": "RightPole",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": -0.0638076514005661,
                      "y": 0.520304799079895,
                      "z": 0.6289610862731934
                    },
                    "localScale": {
                      "_$type": "Vector3",
                      "x": 0.10000000149011612,
                      "y": 0.10000000149011612,
                      "z": 0.10000000149011612
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
            }
          ]
        },
        {
          "_$id": "1y9vhbpb",
          "_$type": "Sprite3D",
          "name": "Cube",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 0.1089830317998998,
              "y": 0.16280312001033692,
              "z": -5.06105970224397
            },
            "localScale": {
              "_$type": "Vector3",
              "x": 0.1,
              "y": 0.1,
              "z": 0.1
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
      "_$id": "dxcodwki",
      "_$type": "CheckBox",
      "name": "CheckBox",
      "x": 38,
      "y": 30,
      "width": 160,
      "height": 64,
      "selected": true,
      "skin": "res://f0c051af-cf42-4abc-82e4-59f42ac888ee",
      "label": "开启IK",
      "labelSize": 30,
      "labelBold": true,
      "labelVAlign": "middle",
      "_$comp": [
        {
          "_$type": "8ccd2009-5fad-4d07-ae65-fe3912fa114a",
          "scriptPath": "../src/UI.ts",
          "ikNode": {
            "_$ref": "4v08fmbw"
          }
        }
      ]
    },
    {
      "_$id": "d2rn23d7",
      "_$type": "Sprite",
      "name": "Sprite",
      "x": 417,
      "y": 29,
      "width": 783,
      "height": 100
    },
    {
      "_$id": "a59e4zhu",
      "_$var": true,
      "_$type": "Sprite",
      "name": "btns",
      "x": 197,
      "y": 153,
      "width": 100,
      "height": 100,
      "_$comp": [
        {
          "_$type": "59da6065-1dec-4006-9fa0-5fd1ad937bb1",
          "scriptPath": "../src/IK/IK_RecUI.ts",
          "ikComp": {
            "_$ref": "4v08fmbw",
            "_$type": "45a75369-e319-4c4f-b08d-30558b0d1093"
          }
        }
      ],
      "_$child": [
        {
          "_$id": "y0g2j71c",
          "_$var": true,
          "_$type": "Button",
          "name": "startrec",
          "x": 137,
          "y": 25,
          "width": 120,
          "height": 40,
          "skin": "res://d4cfd6a8-0d0a-475b-ac93-d85eaa646936",
          "label": "记录",
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelStrokeColor": "#ac5e5e"
        },
        {
          "_$id": "s2q2dc4y",
          "_$var": true,
          "_$type": "Button",
          "name": "play",
          "x": 268,
          "y": 25,
          "width": 120,
          "height": 40,
          "skin": "res://d4cfd6a8-0d0a-475b-ac93-d85eaa646936",
          "label": "回放",
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelStrokeColor": "#ac5e5e"
        },
        {
          "_$id": "ozeydpn8",
          "_$var": true,
          "_$type": "Button",
          "name": "stop",
          "x": 399,
          "y": 25,
          "width": 120,
          "height": 40,
          "skin": "res://d4cfd6a8-0d0a-475b-ac93-d85eaa646936",
          "label": "停止",
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelStrokeColor": "#ac5e5e"
        },
        {
          "_$id": "5n08zkd0",
          "_$var": true,
          "_$type": "Button",
          "name": "prev",
          "x": 530,
          "y": 25,
          "width": 120,
          "height": 40,
          "skin": "res://d4cfd6a8-0d0a-475b-ac93-d85eaa646936",
          "label": "上一帧",
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelStrokeColor": "#ac5e5e"
        },
        {
          "_$id": "vq4pgm52",
          "_$var": true,
          "_$type": "Button",
          "name": "next",
          "x": 661,
          "y": 25,
          "width": 120,
          "height": 40,
          "skin": "res://d4cfd6a8-0d0a-475b-ac93-d85eaa646936",
          "label": "下一帧",
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelStrokeColor": "#ac5e5e"
        }
      ]
    }
  ]
}