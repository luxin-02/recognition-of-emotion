

let list = [
  {
    "children": [
      {
        "id": 0,
        "type": "menu",
        "pid": 0,
        "title": "后台首页",
        "route": "/index/home",
        "icon": "/static/backend/icons/p.png",
        "icon_over": "/static/backend/icons/p_white.png",
        "children": []
      },
      {
        "id": "12",
        "type": "menu",
        "pid": "0",
        "title": "Demo",
        "route": "/index/demo",
        "icon": "/static/backend/icons/backups.png",
        "icon_over": "/static/backend/icons/backups_white.png",
        "sort": "0",
        "check": "1",
        "children": [],
      },
    ]
  },
  {
    "group_id": "1",
    "group_name": "资料管理",
    "children": [
      {
        "id": "5",
        "type": "menu",
        "pid": "0",
        "title": "视频管理",
        "route": "/index/video",
        "icon": "",
        "icon_over": "",
        "sort": "0",
        "children": [
          {
            "id": "113",
            "type": "module",
            "pid": "5",
            "title": "新增分类",
            "route": "/index/video/addclass",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "114",
            "type": "module",
            "pid": "5",
            "title": "删除分类",
            "route": "/index/video/delclass",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "115",
            "type": "module",
            "pid": "5",
            "title": "新增",
            "route": "/index/video/add",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "116",
            "type": "module",
            "pid": "5",
            "title": "修改",
            "route": "/index/video/edit",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "117",
            "type": "module",
            "pid": "5",
            "title": "删除",
            "route": "/index/video/del",
            "icon": "",
            "icon_over": ""
          }
        ]
      },
      {
        "id": "4",
        "type": "menu",
        "pid": "0",
        "title": "音乐管理",
        "route": "/index/music",
        "icon": "",
        "icon_over": "",
        "sort": "0",
        "children": [
          {
            "id": "123",
            "type": "module",
            "pid": "4",
            "title": "新增分类",
            "route": "/index/music/addclass",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "124",
            "type": "module",
            "pid": "4",
            "title": "删除分类",
            "route": "/index/music/delclass",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "125",
            "type": "module",
            "pid": "4",
            "title": "新增",
            "route": "/index/music/add",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "126",
            "type": "module",
            "pid": "4",
            "title": "修改",
            "route": "/index/music/edit",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "127",
            "type": "module",
            "pid": "4",
            "title": "删除",
            "route": "/index/music/del",
            "icon": "",
            "icon_over": ""
          }
        ]
      },
      {
        "id": "1",
        "type": "menu",
        "pid": "0",
        "title": "文章管理",
        "route": "/index/article",
        "icon": "",
        "icon_over": "",
        "sort": "0",
        "children": [
          {
            "id": "19",
            "type": "module",
            "pid": "0",
            "title": "文章模块",
            "route": "#",
            "icon": null,
            "icon_over": null,
            "children": [
              {
                "id": "13",
                "type": "module",
                "pid": "19",
                "title": "在前端展示",
                "route": "#",
                "icon": null,
                "icon_over": null,
                "children": []
              },
              {
                "id": "14",
                "type": "module",
                "pid": "19",
                "title": "后台管理",
                "route": "#",
                "icon": null,
                "icon_over": null,
                "children": [
                  {
                    "id": "15",
                    "type": "module",
                    "pid": "14",
                    "title": "添加文章",
                    "route": "backendarticlemanager/add",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "16",
                    "type": "module",
                    "pid": "14",
                    "title": "删除文章",
                    "route": "backendarticlemanager/del",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "17",
                    "type": "module",
                    "pid": "14",
                    "title": "更改显示状态",
                    "route": "backendarticlemanager/changestatus",
                    "icon": null,
                    "icon_over": null
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "2",
        "type": "menu",
        "pid": "0",
        "title": "测评管理",
        "route": "/index/evaluation",
        "icon": "",
        "icon_over": "",
        "sort": "0"
      },
      {
        "id": "3",
        "type": "menu",
        "pid": "0",
        "title": "认知管理",
        "route": "/index/cognition",
        "icon": "",
        "icon_over": "",
        "sort": "0",
        "children": [
          {
            "id": "118",
            "type": "module",
            "pid": "3",
            "title": "新增分类",
            "route": "/index/cognition/addclass",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "119",
            "type": "module",
            "pid": "3",
            "title": "删除分类",
            "route": "/index/cognition/delclass",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "120",
            "type": "module",
            "pid": "3",
            "title": "新增",
            "route": "/index/cognition/add",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "121",
            "type": "module",
            "pid": "3",
            "title": "修改",
            "route": "/index/cognition/edit",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "122",
            "type": "module",
            "pid": "3",
            "title": "删除",
            "route": "/index/cognition/del",
            "icon": "",
            "icon_over": ""
          }
        ]
      },
      {
        "id": "107",
        "type": "menu",
        "pid": "0",
        "title": "训练管理",
        "route": "/index/training",
        "icon": "",
        "icon_over": "",
        "sort": "0",
        "children": [
          {
            "id": "108",
            "type": "module",
            "pid": "107",
            "title": "新增分类",
            "route": "/index/training/addclass",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "109",
            "type": "module",
            "pid": "107",
            "title": "删除分类",
            "route": "/index/training/delclass",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "110",
            "type": "module",
            "pid": "107",
            "title": "新增",
            "route": "/index/training/add",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "111",
            "type": "module",
            "pid": "107",
            "title": "修改",
            "route": "/index/training/edit",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "112",
            "type": "module",
            "pid": "107",
            "title": "删除",
            "route": "/index/training/del",
            "icon": "",
            "icon_over": ""
          },
          {
            "id": "144",
            "type": "module",
            "pid": "107",
            "title": "删除所有报告",
            "route": "/index/training/alldelreport",
            "icon": "",
            "icon_over": ""
          }
        ]
      },
    ]
  },
  {
    "group_id": "2",
    "group_name": "用户管理",
    "children": [
      {
        "id": "8",
        "type": "menu",
        "pid": "0",
        "title": "用户管理",
        "route": "/index/users",
        "icon": "/static/backend/icons/users.png",
        "icon_over": "/static/backend/icons/users_white.png",
        "sort": "0",
        "children": [
          {
            "id": "44",
            "type": "module",
            "pid": "0",
            "title": "用户管理(仅后台)",
            "route": "#",
            "icon": null,
            "icon_over": null,
            "children": [
              {
                "id": "45",
                "type": "module",
                "pid": "44",
                "title": "普通用户列表",
                "route": "normaluserlist",
                "icon": null,
                "icon_over": null,
                "children": [
                  {
                    "id": "46",
                    "type": "module",
                    "pid": "45",
                    "title": "新增用户",
                    "route": "normaluserlist/add",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "47",
                    "type": "module",
                    "pid": "45",
                    "title": "导入用户",
                    "route": "normaluserlist/import",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "48",
                    "type": "module",
                    "pid": "45",
                    "title": "编辑用户",
                    "route": "normaluserlist/edit",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "49",
                    "type": "module",
                    "pid": "45",
                    "title": "删除用户",
                    "route": "normaluserlist/del",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "50",
                    "type": "module",
                    "pid": "45",
                    "title": "处理申述权限",
                    "route": "normaluserlist/appeal",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "51",
                    "type": "module",
                    "pid": "45",
                    "title": "重置密码权限",
                    "route": "normaluserlist/resetpwd",
                    "icon": null,
                    "icon_over": null
                  }
                ]
              },
              {
                "id": "52",
                "type": "module",
                "pid": "44",
                "title": "管理员列表",
                "route": "adminlist",
                "icon": null,
                "icon_over": null,
                "children": [
                  {
                    "id": "53",
                    "type": "module",
                    "pid": "52",
                    "title": "新增管理员",
                    "route": "adminlist/add",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "54",
                    "type": "module",
                    "pid": "52",
                    "title": "修改管理员",
                    "route": "adminlist/edit",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "55",
                    "type": "module",
                    "pid": "52",
                    "title": "删除管理员",
                    "route": "adminlist/del",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "56",
                    "type": "module",
                    "pid": "52",
                    "title": "移除管理权限",
                    "route": "adminlist/remove",
                    "icon": null,
                    "icon_over": null
                  }
                ]
              },
              {
                "id": "57",
                "type": "module",
                "pid": "44",
                "title": "咨询师列表",
                "route": "consultantlist",
                "icon": null,
                "icon_over": null,
                "children": [
                  {
                    "id": "58",
                    "type": "module",
                    "pid": "57",
                    "title": "新增咨询师",
                    "route": "consultantlist/add",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "59",
                    "type": "module",
                    "pid": "57",
                    "title": "修改咨询师",
                    "route": "consultantlist/edit",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "60",
                    "type": "module",
                    "pid": "57",
                    "title": "删除咨询师",
                    "route": "consultantlist/del",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "61",
                    "type": "module",
                    "pid": "57",
                    "title": "咨询师排班",
                    "route": "consultantlist/scheduling",
                    "icon": null,
                    "icon_over": null
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "7",
        "type": "menu",
        "pid": "0",
        "title": "角色管理",
        "route": "/index/roleManage",
        "icon": "/static/backend/icons/roles.png",
        "icon_over": "/static/backend/icons/roles_white.png",
        "sort": "0",
        "children": [
          {
            "id": "62",
            "type": "module",
            "pid": "0",
            "title": "角色管理(仅后台)",
            "route": "#",
            "icon": null,
            "icon_over": null,
            "children": [
              {
                "id": "63",
                "type": "module",
                "pid": "62",
                "title": "修改角色权限",
                "route": "role/edit",
                "icon": null,
                "icon_over": null,
                "children": []
              }
            ]
          }
        ]
      },
      {
        "id": "6",
        "type": "menu",
        "pid": "0",
        "title": "部门/班级设定",
        "route": "/index/classManage",
        "icon": "/static/backend/icons/class.png",
        "icon_over": "/static/backend/icons/class_white.png",
        "sort": "0",
        "children": [
          {
            "id": "18",
            "type": "module",
            "pid": "0",
            "title": "部门/班级设定(仅后台)",
            "route": "#",
            "icon": null,
            "icon_over": null,
            "children": [
              {
                "id": "20",
                "type": "module",
                "pid": "18",
                "title": "新增下级部门",
                "route": "deptoradmin/add",
                "icon": null,
                "icon_over": null,
                "children": []
              },
              {
                "id": "21",
                "type": "module",
                "pid": "18",
                "title": "编辑部门信息",
                "route": "deptoradmin/edit",
                "icon": null,
                "icon_over": null,
                "children": []
              },
              {
                "id": "22",
                "type": "module",
                "pid": "18",
                "title": "删除部门",
                "route": "deptoradmin/del",
                "icon": null,
                "icon_over": null,
                "children": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "group_id": "3",
    "group_name": "其他功能",
    "children": [
      {
        "id": "64",
        "type": "menu",
        "pid": "0",
        "title": "单位设置/数据同步",
        "route": "/index/softwareSettings",
        "icon": "/static/backend/icons/backups.png",
        "icon_over": "/static/backend/icons/backups_white.png",
        "sort": "2",
        "children": [
          {
            "id": "9",
            "type": "module",
            "pid": "64",
            "title": "数据同步",
            "route": "/index/dataSynchronous",
            "icon": "/static/backend/icons/datasynchronous.png",
            "icon_over": "/static/backend/icons/datasynchronous_white.png"
          },
          {
            "id": "10",
            "type": "module",
            "pid": "64",
            "title": "单位设置",
            "route": "/index/unitSettings",
            "icon": "/static/backend/icons/unitsettings.png",
            "icon_over": "/static/backend/icons/unitsettings_white.png"
          }
        ]
      },
      {
        "id": "65",
        "type": "menu",
        "pid": "0",
        "title": "高级选项设置",
        "route": "/index/advancedOptions",
        "icon": "/static/backend/icons/backups.png",
        "icon_over": "/static/backend/icons/backups_white.png",
        "sort": "1"
      },
      {
        "id": "11",
        "type": "menu",
        "pid": "0",
        "title": "回收站",
        "route": "/index/recycleBin",
        "icon": "/static/backend/icons/recyclebin.png",
        "icon_over": "/static/backend/icons/recyclebin_white.png",
        "sort": "0",
        "children": [
          {
            "id": "28",
            "type": "module",
            "pid": "23",
            "title": "回收站",
            "route": "#",
            "icon": null,
            "icon_over": null,
            "children": [
              {
                "id": "29",
                "type": "module",
                "pid": "28",
                "title": "成绩回收站",
                "route": "recyclebin/scores",
                "icon": null,
                "icon_over": null,
                "children": [
                  {
                    "id": "30",
                    "type": "module",
                    "pid": "29",
                    "title": "重新还原",
                    "route": "scorerecyclebin/store",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "31",
                    "type": "module",
                    "pid": "29",
                    "title": "彻底删除",
                    "route": "scorerecyclebin/del",
                    "icon": null,
                    "icon_over": null
                  }
                ]
              },
              {
                "id": "32",
                "type": "module",
                "pid": "28",
                "title": "用户回收站",
                "route": "recyclebin/users",
                "icon": null,
                "icon_over": null,
                "children": [
                  {
                    "id": "33",
                    "type": "module",
                    "pid": "32",
                    "title": "重新还原",
                    "route": "userrecyclebin/store",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "34",
                    "type": "module",
                    "pid": "32",
                    "title": "彻底删除",
                    "route": "userrecyclebin/del",
                    "icon": null,
                    "icon_over": null
                  }
                ]
              },
              {
                "id": "35",
                "type": "module",
                "pid": "28",
                "title": "题库回收站",
                "route": "recyclebin/question_bank",
                "icon": null,
                "icon_over": null,
                "children": [
                  {
                    "id": "37",
                    "type": "module",
                    "pid": "35",
                    "title": "彻底删除",
                    "route": "questionbankrecyclebin/del",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "36",
                    "type": "module",
                    "pid": "35",
                    "title": "重新还原",
                    "route": "questionbankrecyclebin/store",
                    "icon": null,
                    "icon_over": null
                  }
                ]
              },
              {
                "id": "141",
                "type": "module",
                "pid": "28",
                "title": "题库回收站",
                "route": "recyclebin/gamerecyclebin",
                "icon": null,
                "icon_over": null,
                "children": [
                  {
                    "id": "142",
                    "type": "module",
                    "pid": "141",
                    "title": "彻底删除",
                    "route": "gamerecyclebin/del",
                    "icon": null,
                    "icon_over": null
                  },
                  {
                    "id": "143",
                    "type": "module",
                    "pid": "141",
                    "title": "还原",
                    "route": "gamerecyclebin/restore",
                    "icon": null,
                    "icon_over": null
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "12",
        "type": "menu",
        "pid": "0",
        "title": "系统备份",
        "route": "/index/backups",
        "icon": "/static/backend/icons/backups.png",
        "icon_over": "/static/backend/icons/backups_white.png",
        "sort": "0",
        "children": [
          {
            "id": "38",
            "type": "module",
            "pid": "23",
            "title": "系统备份",
            "route": "#",
            "icon": null,
            "icon_over": null,
            "children": [
              {
                "id": "39",
                "type": "module",
                "pid": "38",
                "title": "新建备份",
                "route": "systembackup/addbackup",
                "icon": null,
                "icon_over": null,
                "children": []
              },
              {
                "id": "40",
                "type": "module",
                "pid": "38",
                "title": "还原备份",
                "route": "systembackup/restorebackup",
                "icon": null,
                "icon_over": null,
                "children": []
              },
              {
                "id": "41",
                "type": "module",
                "pid": "38",
                "title": "导入备份",
                "route": "systembackup/importbackup",
                "icon": null,
                "icon_over": null,
                "children": []
              },
              {
                "id": "42",
                "type": "module",
                "pid": "38",
                "title": "下载备份",
                "route": "systembackup/downbackup",
                "icon": null,
                "icon_over": null,
                "children": []
              },
              {
                "id": "43",
                "type": "module",
                "pid": "38",
                "title": "删除备份",
                "route": "systembackup/delbackup",
                "icon": null,
                "icon_over": null,
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
]



export default list
