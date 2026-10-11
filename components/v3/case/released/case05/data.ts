export const CASE05_SOURCE = {
  "number": "05",
  "theme": "dark",
  "format": "case",
  "title": {
    "zh": "烘焙生產與營運系統",
    "en": "Bakery Production & Operations System"
  },
  "zhTitleLines": [
    "烘焙生產與營運系統"
  ],
  "zhTitleWrap": {
    "烘焙生產與營運系統": [
      "烘焙生產",
      "與營運系統"
    ]
  },
  "eyebrow": {
    "zh": "00 — 專案總覽",
    "en": "00 — PROJECT OVERVIEW"
  },
  "headline": {
    "zh": [
      "把白板與人工紀錄，",
      "整合成從規劃到生產的數位系統。"
    ],
    "en": [
      "Turning a whiteboard and manual records",
      "into one system from planning to production."
    ]
  },
  "intro": {
    "zh": "將原本依賴白板與人工紀錄的生產流程，整合為跨管理後台、生產站台與大型生產看板的數位營運系統，串起營運規劃、生產紀錄與配出貨資訊。",
    "en": "A production process that relied on a whiteboard and manual records became a digital operations system across the admin backend, production stations and a large production dashboard — connecting operational planning, production records and distribution."
  },
  "client": {
    "label": {
      "zh": "客戶背景｜台灣日式吐司烘焙品牌",
      "en": "Client Background | Taiwanese Japanese-Style Bakery Brand"
    },
    "text": {
      "zh": "一家經營多間門市的日式吐司烘焙品牌，需要協調中央生產、各店需求與每日配出貨作業。",
      "en": "A multi-store bakery brand coordinating central production, store-level demand, and daily distribution."
    }
  },
  "metadata": {
    "zh": [
      {
        "label": "角色",
        "value": "UI/UX Front-end Designer"
      },
      {
        "label": "時程",
        "value": "2023"
      },
      {
        "label": "範疇",
        "value": "營運規劃 · 生產排程與配置 · 生產站台 · 大型生產看板 · 配⁠出⁠貨"
      },
      {
        "label": "團隊",
        "value": "PM · UI/UX Front-end Designer · Back-end"
      },
      {
        "label": "平台",
        "value": "大型生產看板 · Tablet · Responsive Web"
      },
      {
        "label": "狀態",
        "value": "正式導入"
      }
    ],
    "en": [
      {
        "label": "Role",
        "value": "UI/UX Front-end Designer"
      },
      {
        "label": "Timeline",
        "value": "2023"
      },
      {
        "label": "Scope",
        "value": "Operations Planning · Scheduling & Configuration · Production Stations · Large Production Dashboard · Distribution"
      },
      {
        "label": "Team",
        "value": "PM · UI/UX Front-end Designer · Back-end"
      },
      {
        "label": "Platform",
        "value": "Large Production Dashboard · Tablet · Responsive Web"
      },
      {
        "label": "Status",
        "value": "In Production"
      }
    ]
  },
  "sections": [
    {
      "label": {
        "zh": "01 — The Challenge",
        "en": "01 — THE CHALLENGE"
      },
      "heading": {
        "zh": "從白板到數位，​不代表​全部重新開始",
        "en": "Moving from whiteboard to digital without starting from zero"
      },
      "body": {
        "zh": [
          "客戶多年來以手寫白板與人工紀錄管理生產。數位化的難處不只是把白板換成螢幕：營運目標、排程、各區生產、包裝與出貨分散在不同環節，現場也早已有一套熟悉的閱讀方式。"
        ],
        "en": [
          "For years the client ran production on a handwritten whiteboard and manual records. Going digital wasn’t just swapping the board for a screen: operating goals, scheduling, production in each area, packaging and shipping sat in separate steps, and the floor already had a familiar way of reading the board."
        ]
      },
      "slot": {
        "id": "hero-production-board",
        "aspect": "wide",
        "note": {
          "zh": "大型生產看板",
          "en": "Large Production Dashboard"
        }
      },
      "points": {
        "zh": [
          "資訊分散｜營運目標、排程、生產與出貨資訊分散在不同環節，難以一次掌握全局。",
          "角色與環境不同｜管理端在辦公室規劃與調整；各生產區的人員需要在現場快速查看、輸入與回報。",
          "保留熟悉的工作方式｜現場習慣白板的閱讀方式，數位化不能無故增加操作負擔。"
        ],
        "en": [
          "Fragmented information｜Goals, scheduling, production and shipping lived in separate steps, so the whole picture was hard to see.",
          "Different roles and environments｜Managers plan and adjust from the office; staff in each production area need to check, enter and report quickly on the floor.",
          "Familiar ways of working｜The floor was used to reading the whiteboard, so going digital couldn’t add work without a reason."
        ]
      }
    },
    {
      "label": {
        "zh": "02 — My Role & Approach",
        "en": "02 — MY ROLE & APPROACH"
      },
      "heading": {
        "zh": "保留現場的​閱讀習慣，​再重新設計​資訊層級",
        "en": "Keeping the floor’s reading habits, then redesigning the hierarchy"
      },
      "body": {
        "zh": [
          "我擔任 UI/UX Front-end Designer，與 PM 及後端工程師協作，負責大型生產看板、生產站台與管理後台的 UI/UX 與互動設計、響應式介面，以及基礎前端。",
          "我從規格記錄的生產流程出發，依角色與裝置拆分資訊需求，再依觀看距離、操作頻率與工作任務調整資訊層級。"
        ],
        "en": [
          "As the UI/UX Front-end Designer, working with the PM and back-end developer, I handled UI/UX and interaction design, responsive interfaces and basic front-end for the large production dashboard, production stations and admin backend.",
          "Starting from the production workflow documented in the specification, I separated information needs by role and device, then set the hierarchy by viewing distance, frequency of use and task."
        ]
      },
      "points": {
        "zh": [
          "理解既有流程｜先釐清每個生產環節的人，當下需要看什麼、輸入什麼。",
          "依角色與裝置區分｜看板、觸控站台與管理後台，各自採用不同的資訊密度與互動。",
          "保留熟悉結構｜延續可辨識的白板資訊結構，再加入更清楚的層級與狀態。"
        ],
        "en": [
          "Understand the documented workflow｜Clarify what people at each production step need to see and enter at that moment.",
          "Separate by role and device｜The dashboard, touch stations and admin backend each get their own density and interaction.",
          "Keep familiar structures｜Retain the recognizable whiteboard structure, adding clearer hierarchy and states."
        ]
      }
    },
    {
      "label": {
        "zh": "03 — System Flow",
        "en": "03 — SYSTEM FLOW"
      },
      "heading": {
        "zh": "從營運決策，​一路連到現場生產",
        "en": "From operating decisions to the production floor"
      },
      "body": {
        "zh": [
          "系統把營運規劃、現場生產與配出貨串成一條連續的資料流：前一步的結果，成為下一步的依據。大型生產看板同步呈現生產進度；LINE 通知則在目標、配置或排程未完成時提醒相關人員。"
        ],
        "en": [
          "The system links planning, production and distribution into one continuous data flow, where the result of each step becomes the basis for the next. The large production dashboard mirrors production progress alongside it, and LINE notifications prompt the right people when targets, allocation or scheduling are incomplete."
        ]
      },
      "slot": {
        "id": "system-flow",
        "aspect": "wide",
        "note": {
          "zh": "營運流程圖（中／英、桌機／手機）",
          "en": "Operational flow diagram (ZH/EN, desktop/mobile)"
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
      "rationaleStyle": "lead",
      "decisions": [
        {
          "title": {
            "zh": "保留白板的​整體視野，​再建立資訊層級",
            "en": "Keep the whiteboard’s overview, then add hierarchy"
          },
          "body": {
            "zh": [
              "現場習慣一眼看完整面白板，若把資訊拆成多頁，反而要重新學怎麼找。看板保留整體版面，依攪拌、分割、整形、發酵、出爐分段，開始與結束時間成對呈現，超出標準的數值以紅點標示。現場不必改變閱讀習慣，就能更快找到需要注意的批次。"
            ],
            "en": [
              "Staff were used to reading the whole whiteboard at a glance; splitting it across pages would mean relearning where to look. The dashboard keeps the overall layout, groups columns by mixing, dividing, shaping, proofing and baking, pairs start and end times, and marks out-of-standard values in red. Staff keep their reading habit and find the batches that need attention faster."
            ]
          },
          "slot": {
            "id": "board-hierarchy",
            "aspect": "wide",
            "note": {
              "zh": "大型生產看板：分段與例外",
              "en": "Dashboard: stages and exceptions"
            }
          },
          "layout": "below",
          "rationale": {
            "constraint": {
              "zh": "現場習慣一眼看完整面白板",
              "en": "Staff read the whole whiteboard at a glance"
            },
            "decision": {
              "zh": "保留整體版面，用製程分段、成對時間與紅點建立層級",
              "en": "Keep the full layout; add stage groups, paired times and red markers"
            },
            "value": {
              "zh": "不必改變閱讀習慣，就能更快找到需要注意的批次",
              "en": "Same reading habit, faster to spot batches that need attention"
            }
          }
        },
        {
          "title": {
            "zh": "同一份資訊，​依觀看距離​與任務調整",
            "en": "The same information, adjusted to viewing distance and task"
          },
          "body": {
            "zh": [
              "同一批生產資料，在三種情境的用途不同。大型生產看板供遠距掌握進度，只呈現重要的狀態與時間，以高對比與清楚層級閱讀；觸控站台依各生產區的工作情境配置，以任務為主的按鈕與對話框輸入資料；管理後台負責排程、配置與設定，資訊密度最高，並以響應式版面在手機上查看生產數量與排程列表。"
            ],
            "en": [
              "The same production data serves three contexts. The large production dashboard is read from a distance for progress, showing only key states and times with high contrast and clear hierarchy. Touch-based production stations were adapted to the workflows of different production areas, with task-focused controls and dialogs for data entry. The admin backend handles scheduling, configuration and settings at the highest density, with a responsive layout for checking quantities and the batch list on a phone."
            ]
          },
          "slot": {
            "id": "three-contexts",
            "aspect": "wide",
            "note": {
              "zh": "看板／站台／後台",
              "en": "Dashboard / station / admin"
            }
          },
          "layout": "below",
          "rationale": {
            "constraint": {
              "zh": "同一份資料，觀看距離與任務不同",
              "en": "Same data, different distances and tasks"
            },
            "decision": {
              "zh": "看板、觸控站台與管理後台，各自調整資訊密度與互動",
              "en": "Tune density and interaction for the dashboard, touch stations and backend"
            },
            "value": {
              "zh": "每個情境只呈現當下需要的資訊",
              "en": "Each context shows only what's needed right now"
            }
          }
        },
        {
          "title": {
            "zh": "用狀態與防呆​降低操作錯誤",
            "en": "States and safeguards to prevent mistakes"
          },
          "body": {
            "zh": [
              "排程與配置每天由不同人修改。我參與設計 Phase 2 的狀態與防呆：生產配置行事曆以顏色區分未確認（橘）、已確認（藍）、生產中（綠），已生產完成的日期以「檢視」呈現、只能查看；已過去的出貨紀錄與年度營運目標同樣只能檢視、不能修改；切換產品前若尚未儲存，系統會先提醒。使用者能清楚分辨哪些資料還能修改，以及下一步該做什麼。"
            ],
            "en": [
              "Different people edit the schedule and configuration every day. I designed the Phase 2 states and safeguards with the team: the production configuration calendar color-codes Unconfirmed (orange), Confirmed (blue) and In production (green), while completed days show as View and are view-only. Past shipping records and past annual targets are likewise view-only, and switching products with unsaved changes prompts a save first. Users can tell what they can still change, and what to do next."
            ]
          },
          "slot": {
            "id": "states-safeguards",
            "aspect": "wide",
            "note": {
              "zh": "行事曆狀態＋唯讀與未儲存提醒",
              "en": "Calendar states + view-only and unsaved reminders"
            }
          },
          "layout": "below",
          "rationale": {
            "constraint": {
              "zh": "排程與配置每天由不同人修改",
              "en": "Different people edit schedules and setup every day"
            },
            "decision": {
              "zh": "狀態色、唯讀規則與未儲存提醒",
              "en": "State colours, read-only rules and unsaved-change reminders"
            },
            "value": {
              "zh": "清楚知道哪些資料還能修改、下一步該做什麼",
              "en": "Clear what can still change, and what to do next"
            }
          }
        }
      ]
    },
    {
      "label": {
        "zh": "05 — Outcome",
        "en": "05 — OUTCOME"
      },
      "heading": {
        "zh": "從白板流程，​到正式使用的​數位生產系統",
        "en": "From whiteboard workflow to a production system in use"
      },
      "body": {
        "zh": [
          "兩個階段的系統都已正式導入使用。原本集中在白板與人工紀錄的資訊，成為從規劃、生產到配出貨都連在一起的數位流程。"
        ],
        "en": [
          "Both phases were officially deployed and are in production use. Information that had lived on a whiteboard and in manual records became one digital flow connecting planning, production and distribution."
        ]
      },
      "pointsStyle": "outcome-strong",
      "points": {
        "zh": [
          "串連的生產流程｜營運目標、生產配置、站台紀錄、包裝與出貨，在同一套系統中彼此串接。｜回應挑戰 01 · 資訊分散",
          "共享的營運視野｜規劃與生產資訊，可由相關角色在不同裝置上查看。｜回應挑戰 02 · 角色與環境不同",
          "更清楚的狀態與追蹤｜看板、狀態、防呆與 LINE 通知，協助掌握進度並跟進未完成的工作。｜回應挑戰 03 · 保留熟悉的工作方式"
        ],
        "en": [
          "A connected production workflow｜Operating goals, production configuration, station records, packaging and shipping connect in one system.｜Answers challenge 01 · Fragmented information",
          "Shared operational visibility｜Planning and production information is available to the relevant roles across devices.｜Answers challenge 02 · Different roles and environments",
          "Clearer status and follow-up｜The dashboard, states, safeguards and LINE notifications support progress tracking and follow-up on unfinished work.｜Answers challenge 03 · Familiar ways of working"
        ]
      }
    }
  ]
} as const;

