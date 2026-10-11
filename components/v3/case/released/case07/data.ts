export const CASE07_SOURCE = {
  "number": "07",
  "theme": "dark",
  "format": "case",
  "title": {
    "zh": "智慧書包 IoT App",
    "en": "Smart School Bag IoT App"
  },
  "zhTitleLines": [
    "智慧書包 IoT App"
  ],
  "zhTitleWrap": {
    "智慧書包 IoT App": [
      "智慧書包 ",
      "IoT App"
    ]
  },
  "enTitleLines": [
    "Smart School Bag",
    "IoT App"
  ],
  "eyebrow": {
    "zh": "00 — 專案總覽",
    "en": "00 — PROJECT OVERVIEW"
  },
  "headline": {
    "zh": [
      "把 IoT 定位資訊，",
      "轉成家長能快速理解與採取行動的安全體驗。"
    ],
    "en": [
      "Turning IoT location data",
      "into a safety experience parents can read and act on."
    ]
  },
  "intro": {
    "zh": "智慧書包是一款給家長使用的 IoT App，讓家長查看孩子書包的位置、移動紀錄與連線狀態，並設定安全範圍。我負責家長端 App 的 UI/UX 設計：資訊架構、主要流程、介面與互動狀態。",
    "en": "A parent app for a smart school bag: parents check where their child’s bag is, review where it has been and whether it’s connected, and set safe zones. I designed the parent app’s UI/UX — its information architecture, core flows, interface and interaction states."
  },
  "metadata": {
    "zh": [
      {
        "label": "角色",
        "value": "UI/UX Designer"
      },
      {
        "label": "時程",
        "value": "2022"
      },
      {
        "label": "範疇",
        "value": "Map · History · Report Settings · Safe Zone · Device Management"
      },
      {
        "label": "團隊",
        "value": "Backend Engineer · PM · UI/UX Designer"
      },
      {
        "label": "平台",
        "value": "Mobile App"
      }
    ],
    "en": [
      {
        "label": "Role",
        "value": "UI/UX Designer"
      },
      {
        "label": "Timeline",
        "value": "2022"
      },
      {
        "label": "Scope",
        "value": "Map · History · Report Settings · Safe Zone · Device Management"
      },
      {
        "label": "Team",
        "value": "Backend Engineer · PM · UI/UX Designer"
      },
      {
        "label": "Platform",
        "value": "Mobile App"
      }
    ]
  },
  "prototype": {
    "href": "/legacy-prototypes/case07/prototype.dc.html",
    "label": {
      "zh": "操作互動原型 ↗",
      "en": "Try the interactive prototype ↗"
    },
    "note": {
      "zh": "此為作品集重新建構的互動示範，使用示意資料；並非 2022 年的正式 App，亦未連接實際裝置或定位服務。",
      "en": "This interactive demo was recreated for the portfolio using sample data. It is not the original 2022 production app and is not connected to real devices or location services."
    }
  },
  "disclosure": {
    "label": {
      "zh": "原始專案與作品集重建",
      "en": "ORIGINAL PROJECT VS. RECONSTRUCTION"
    },
    "text": {
      "zh": "原始專案為 2022 年的家長端 App 設計。本頁的畫面、操作錄影與互動原型，是 2026 年依原始專案重新製作的作品集示範，使用示意資料；以下的設計決策以重建畫面說明，並非 2022 年的原始交付檔。",
      "en": "The original parent-app design dates from 2022. The screens, recordings and interactive prototype on this page were rebuilt in 2026 for this portfolio, using mock data. The design decisions below are illustrated with these reconstructed screens, not original 2022 deliverables."
    }
  },
  "sections": [
    {
      "label": {
        "zh": "01 — The Challenge",
        "en": "01 — THE CHALLENGE"
      },
      "heading": {
        "zh": "資料看得到，​卻不容易判斷​孩子現在的狀況",
        "en": "The data was visible — what it meant wasn’t"
      },
      "body": {
        "zh": [
          "放學時間，家長打開 App 想確認孩子到了安親班沒有。地圖上有一個點，但那是現在的位置，還是幾小時前最後回報的位置？書包離線、離開安全範圍，或只是還在路上，看起來可能都差不多。",
          "這些是我從需求與畫面整理出的設計問題，而不是使用者研究的結果：位置、連線、紀錄與提醒都在，家長卻得自己判斷它們代表什麼。「顯示資料」和「讓人看懂現在發生什麼」是兩件事。"
        ],
        "en": [
          "At pick-up time, a parent opens the app to check whether their child has reached after-school care. There’s a dot on the map — but is that where the bag is now, or its last report hours ago? An offline bag, a bag outside its safe zone and a bag still on its way can look much the same.",
          "These are design problems I identified from the requirements and screens, not findings from user research: location, connection, history and alerts were all there, yet parents had to work out what they meant. Showing data and helping people understand what’s happening are different jobs."
        ]
      },
      "slot": {
        "id": "app-overview",
        "aspect": "wide",
        "note": {
          "zh": "三個問題對應三個畫面",
          "en": "Three questions, three screens"
        }
      }
    },
    {
      "label": {
        "zh": "02 — My Role & Approach",
        "en": "02 — MY ROLE & APPROACH"
      },
      "heading": {
        "zh": "從家長的判斷需求，​重新整理資訊​與操作流程",
        "en": "Reorganizing information and flows around how parents decide"
      },
      "body": {
        "zh": [
          "我擔任 UI/UX Designer，與 PM 及後端工程師協作，負責家長端 App 的資訊架構、主要操作流程、介面設計與互動狀態。我依家長的判斷順序把功能分成三層，作為導覽與資訊層級的依據："
        ],
        "en": [
          "As the UI/UX Designer, working with the PM and back-end engineer, I was responsible for the parent app’s information architecture, core flows, interface design and interaction states. I grouped the features into three layers, in the order parents judge a situation, and used them to shape navigation and hierarchy:"
        ]
      },
      "points": {
        "zh": [
          "看現在｜首頁以地圖與書包列表，呈現目前位置、連線與安全範圍狀態。",
          "回顧過去｜時間軸把移動紀錄整理成時間、地點與事件。",
          "採取行動｜電子圍籬、回報頻率與書包管理，集中在每個書包的詳情頁。"
        ],
        "en": [
          "See the present｜The home map and bag list show current location, connection and safe-zone status.",
          "Review the past｜The timeline turns movement records into time, place and events.",
          "Take action｜Safe zones, report frequency and device management sit on each bag’s detail page."
        ]
      }
    },
    {
      "label": {
        "zh": "03 — App Structure & User Flow",
        "en": "03 — APP STRUCTURE & USER FLOW"
      },
      "heading": {
        "zh": "從查看狀態，​到理解情況​並採取行動",
        "en": "From checking status to understanding and taking action"
      },
      "body": {
        "zh": [
          "App 以三個分頁組織：書包、通知與個人。主要任務集中在書包分頁；「主要互動狀態」說明書包離線與編輯電子圍籬時的回應。"
        ],
        "en": [
          "The app is organized around three tabs: Bags, Alerts and Profile. Most tasks live under Bags; the key interaction states show how the app responds when a bag is offline and when a safe zone is edited."
        ]
      },
      "slot": {
        "id": "user-flow",
        "aspect": "wide",
        "note": {
          "zh": "App 結構與使用流程圖",
          "en": "App structure and user flow diagram"
        }
      }
    },
    {
      "label": {
        "zh": "04 — Key Design Decisions",
        "en": "04 — KEY DESIGN DECISIONS"
      },
      "heading": {
        "zh": "關鍵設計決策",
        "en": "Key design decisions"
      },
      "body": {
        "zh": [],
        "en": []
      },
      "decisions": [
        {
          "title": {
            "zh": "先看現在，​再回顧過去",
            "en": "See the present first, then the past"
          },
          "body": {
            "zh": [
              "家長最先想知道的是「現在」；如果位置、紀錄與設定同等重要，畫面就會失焦。因此首頁先呈現地圖與每個書包的目前狀態，選取書包時地圖直接移過去。需要時再進入時間軸，每一段以時間、地點與停留或移動整理，事件標在發生的那一段。"
            ],
            "en": [
              "Parents want “now” first; give location, history and settings equal weight and the screen loses focus. So the home screen leads with the map and each bag’s current status, and selecting a bag moves the map to it. The timeline is one step away, with each segment organized by time, place and stay or movement, and events attached where they happened."
            ]
          },
          "slot": {
            "id": "decision-now-history",
            "aspect": "wide",
            "note": {
              "zh": "首頁與時間軸錄影",
              "en": "Home and timeline recordings"
            }
          },
          "layout": "below"
        },
        {
          "title": {
            "zh": "讓安全區域設定​容易理解與修改",
            "en": "Safe zones that are easy to read and change"
          },
          "body": {
            "zh": [
              "電子圍籬同時牽涉地點、時段、星期與範圍，拆成多個設定頁時，家長很難確認規則是否正確。列表把每一組整理成地點、時段、星期與範圍並附開關，停用的會淡化；編輯時四項都在同一頁，範圍在地圖上即時變化。沒選星期就無法儲存，新增第四組時會提示已達上限；未儲存就離開會先確認。"
            ],
            "en": [
              "A safe zone combines a place, a time range, weekdays and a radius; split across screens, it’s hard to check a rule is right. The list shows each zone as place, time, days and radius with its own switch, dimming inactive ones; the editor keeps all four on one screen and redraws the radius on the map as it changes. A zone can’t be saved without at least one day, adding a fourth explains the three-zone limit, and leaving with unsaved changes asks first."
            ]
          },
          "slot": {
            "id": "decision-safety",
            "aspect": "wide",
            "note": {
              "zh": "電子圍籬列表、編輯與儲存錄影",
              "en": "Safe-zone list, editing and saving recordings"
            }
          },
          "layout": "below"
        },
        {
          "title": {
            "zh": "異常狀態​也需要明確回饋",
            "en": "Unusual states need clear feedback too"
          },
          "body": {
            "zh": [
              "書包離線、重新整理失敗、某天沒有紀錄時，畫面若沒有說明，家長只能猜。離線的書包會說明地圖上是幾小時前最後回報的位置，並提示可能原因；重新整理仍無法連線時提示稍後再試；沒有紀錄的日子顯示空狀態與原因；儲存、刪除與改名都有完成提示。"
            ],
            "en": [
              "An offline bag, a failed refresh or a day without records leaves parents guessing if the screen says nothing. An offline bag explains that the map shows its last report and when, with likely causes; a refresh that still can’t connect says to try again later; a day without records shows an empty state and the reason; and saving, deleting or renaming all confirm what happened."
            ]
          },
          "slot": {
            "id": "decision-states",
            "aspect": "wide",
            "note": {
              "zh": "離線、失敗與空狀態",
              "en": "Offline, failure and empty states"
            }
          },
          "layout": "below"
        }
      ]
    },
    {
      "label": {
        "zh": "05 — Outcome",
        "en": "05 — OUTCOME"
      },
      "heading": {
        "zh": "從「看得到資料」，​整理成「知道下一步」",
        "en": "From seeing the data to knowing the next step"
      },
      "body": {
        "zh": [
          "以下是可以在重建原型中檢視的設計成果，而不是量化的可用性改善。"
        ],
        "en": [
          "These are design results you can inspect in the reconstructed prototype, not measured usability gains."
        ]
      },
      "points": {
        "zh": [
          "更清楚的資訊層級｜目前位置、裝置狀態、提醒與歷史紀錄，各自有明確的層級與位置。",
          "更完整的狀態處理｜離線、失敗、空狀態與確認，都有對應的介面回應。",
          "更容易理解的核心任務｜時間軸、電子圍籬與書包管理，都有清楚的入口與操作路徑。"
        ],
        "en": [
          "Clearer information hierarchy｜Current location, device status, alerts and history each have a distinct level and place.",
          "More complete state handling｜Offline, failed, empty and confirmation states each get an appropriate response.",
          "Core tasks that are easier to follow｜The timeline, safe zones and device management each have a clear entry point and path."
        ]
      }
    }
  ]
} as const;

