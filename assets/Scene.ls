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
          "_$id": "uxi44cgt",
          "_$type": "Sprite3D",
          "name": "人物",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "z": -5.453709197709602
            }
          },
          "_$child": [
            {
              "_$id": "oymgm3k6",
              "_$type": "Sprite3D",
              "name": "人物移动",
              "_$comp": [
                {
                  "_$type": "Animator",
                  "controller": {
                    "_$uuid": "cc848054-1ddd-4cda-871f-67a8b3933fd9",
                    "_$type": "AnimationController"
                  },
                  "controllerLayers": [
                    {
                      "_$type": "AnimatorControllerLayer",
                      "name": "Base Layer",
                      "blendingMode": 1,
                      "states": [
                        {
                          "_$type": "AnimatorState",
                          "name": "run",
                          "clipStart": 0,
                          "clip": {
                            "_$uuid": "dc0f7131-dcfc-4c13-8de0-4cbf4ddeefe0",
                            "_$type": "AnimationClip"
                          },
                          "soloTransitions": []
                        },
                        {
                          "_$type": "AnimatorState",
                          "name": "idle",
                          "clipStart": 0,
                          "clip": {
                            "_$uuid": "578a799f-79af-494b-84a1-ec0d4925022d",
                            "_$type": "AnimationClip"
                          },
                          "soloTransitions": []
                        },
                        {
                          "_$type": "AnimatorState",
                          "name": "walk",
                          "clipStart": 0,
                          "clip": {
                            "_$uuid": "2e0da64e-592d-4fcd-b980-5c80d57ff061",
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
                      "_$type": "Vector3"
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
                      "_$type": "IK_Comp",
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
                          "enable": true
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
                      "_$id": "xmll4e7t",
                      "_$parent": "#166",
                      "_$type": "Sprite3D",
                      "name": "RightFoot",
                      "transform": {
                        "localPosition": {
                          "_$type": "Vector3",
                          "x": -0.00017772536162397046,
                          "y": 6.142579874639068,
                          "z": -7.521937560110246
                        },
                        "localRotation": {
                          "_$type": "Quaternion",
                          "x": -1.1031212070015947e-7,
                          "y": -0.4291034549832617,
                          "z": -0.9032553486812578,
                          "w": 3.392605328750297e-7
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
                          "x": -0.00000862990663108576,
                          "y": 6.143370347625762,
                          "z": -2.9722024974950045
                        },
                        "localRotation": {
                          "_$type": "Quaternion",
                          "x": -1.1478161741906856e-7,
                          "y": -0.42910341527587414,
                          "z": -0.9032553675447776,
                          "w": 3.412529361312977e-7
                        },
                        "localScale": {
                          "_$type": "Vector3",
                          "x": 1.0000000000002591,
                          "y": 1.0000000386711827,
                          "z": 1.0000000386709307
                        }
                      }
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
    }
  ]
}