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
              "x": -3.1079979729770635,
              "y": 1.5702457521923765,
              "z": -2.2851872
            },
            "localRotation": {
              "_$type": "Quaternion",
              "x": -0.06305498658839283,
              "y": -0.7014041884360588,
              "z": -0.0625373816130866,
              "w": 0.7072095227099751
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
          "_$id": "zrbv22z7",
          "_$type": "Sprite3D",
          "name": "walk",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "z": -5.039734553317191
            },
            "localScale": {
              "_$type": "Vector3",
              "x": 1,
              "y": 1.0000000287309947,
              "z": 1.0000000278260743
            }
          },
          "_$comp": [
            {
              "_$type": "CharacterController",
              "collisionGroup": 1,
              "canCollideWith": -1,
              "centerOffset": {
                "_$type": "Vector3",
                "y": 1.025
              }
            },
            {
              "_$type": "11188e86-7135-4043-a96c-35d2a114a236",
              "scriptPath": "../src/PersonScript.ts"
            },
            {
              "_$type": "IK_Comp",
              "chainDatas": [],
              "solverIteration": 10,
              "dirSolverIteration": 10,
              "dampingFactor": 0.1
            }
          ],
          "_$child": [
            {
              "_$id": "twrrdnke",
              "_$type": "Sprite3D",
              "name": "move",
              "_$child": [
                {
                  "_$id": "q71t19h9",
                  "_$prefab": "6717f8fc-afc5-4551-b67b-fa4684ea2ba7",
                  "name": "Swagger Walk",
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
                      "_$type": "IK_Comp",
                      "chainDatas": [
                        {
                          "_$type": "IK_ChainData",
                          "end": {
                            "_$ref": [
                              "q71t19h9",
                              "#174"
                            ]
                          },
                          "root": {
                            "_$ref": [
                              "q71t19h9",
                              "#173"
                            ]
                          },
                          "bones": [
                            {
                              "_$type": "BoneData",
                              "data": {
                                "_$ref": [
                                  "q71t19h9",
                                  "#174"
                                ]
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
                            }
                          ],
                          "enable": true
                        }
                      ],
                      "solverIteration": 10,
                      "dirSolverIteration": 10,
                      "dampingFactor": 0.1
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
              "y": 1.3868947,
              "z": 1.3094969
            },
            "localRotation": {
              "_$type": "Quaternion",
              "x": -0.18437594967456314,
              "w": 0.9828557926682853
            },
            "localScale": {
              "_$type": "Vector3",
              "x": 1,
              "y": 0.169998899102211,
              "z": 8.379987716674805
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
          "_$id": "nzdzysu5",
          "_$type": "Sprite3D",
          "name": "Cube",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 1.1662248432883473,
              "z": -3.5682410539489147
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
}