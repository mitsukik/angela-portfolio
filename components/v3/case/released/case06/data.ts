export const CASE06_SOURCE = {
  "number": "06",
  "theme": "dark",
  "format": "case",
  "title": {
    "zh": "時尚購物 App 與管理後台",
    "en": "Fashion Commerce App & CMS"
  },
  "zhTitleLines": [
    "時尚購物 App",
    "與管理後台"
  ],
  "zhTitleWrap": {
    "時尚購物 App": [
      "時尚購物 ",
      "App"
    ]
  },
  "eyebrow": {
    "zh": "00 — 專案總覽",
    "en": "00 — PROJECT OVERVIEW"
  },
  "headline": {
    "zh": [
      "一個購物平台，",
      "前台購物與後台營運一起設計。"
    ],
    "en": [
      "One commerce platform,",
      "with shopping and operations designed together."
    ]
  },
  "intro": {
    "zh": "在短期開發時程內，將品牌購物、會員服務與營運管理需求，轉換成可操作的 App 原型與後台介面設計。我負責 App 與 CMS 的 UI/UX 規劃、原型設計與基礎前端。",
    "en": "Within a short development timeline, I turned the brand’s shopping, membership and operations requirements into a clickable app prototype and CMS interface design. I was responsible for UI/UX planning, prototyping and basic front-end for both the app and the CMS."
  },
  "prototype": {
    "href": "/legacy-prototypes/case06/prototype.dc.html",
    "label": {
      "zh": "操作互動原型 ↗",
      "en": "Try the interactive prototype ↗"
    },
    "note": {
      "zh": "此為作品集重新建構的互動示範，使用示意資料；並非正式上線的 App，亦未連接實際的購物、付款或會員系統。",
      "en": "This interactive demo was recreated for the portfolio using sample data. It is not the live production app and is not connected to real shopping, payment or membership systems."
    }
  },
  "client": {
    "label": {
      "zh": "客戶背景｜運動時尚服飾品牌",
      "en": "Client Background | Sports Fashion Apparel Brand"
    },
    "text": {
      "zh": "LUDOVIK 規劃自有購物 App：消費者在 App 中探索商品、購物並使用會員服務；營運人員則在後台管理商品、活動、訂單與會員。",
      "en": "LUDOVIK planned its own shopping app: shoppers explore products, buy and use member services in the app, while staff manage products, campaigns, orders and members in a CMS."
    }
  },
  "disclosure": null,
  "metadata": {
    "zh": [
      {
        "label": "角色",
        "value": "UI/UX Front-end Designer"
      },
      {
        "label": "時程",
        "value": "2020 · 約 1 個月"
      },
      {
        "label": "範疇",
        "value": "Shopping App · Membership · Checkout · CMS"
      },
      {
        "label": "團隊",
        "value": "PM / SA · UI/UX Front-end Designer · Back-end · QA"
      },
      {
        "label": "平台",
        "value": "Mobile · Web Admin"
      },
      {
        "label": "狀態",
        "value": "已上線"
      }
    ],
    "en": [
      {
        "label": "Role",
        "value": "UI/UX Front-end Designer"
      },
      {
        "label": "Timeline",
        "value": "2020 · About 1 month"
      },
      {
        "label": "Scope",
        "value": "Shopping App · Membership · Checkout · CMS"
      },
      {
        "label": "Team",
        "value": "PM / SA · UI/UX Front-end Designer · Back-end · QA"
      },
      {
        "label": "Platform",
        "value": "Mobile · Web Admin"
      },
      {
        "label": "Status",
        "value": "Live"
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
        "zh": "一個購物平台，​兩種不同的​使用需求",
        "en": "One commerce platform, two very different sets of needs"
      },
      "body": {
        "zh": [
          "客戶希望透過 App 整合商品探索、購物與會員服務，同時讓營運人員有效管理商品、活動與訂單。挑戰是在有限時間內，釐清前後台的核心流程，讓不同角色的需求能夠一起被設計與確認。"
        ],
        "en": [
          "The client wanted one app for product discovery, shopping and member services, while staff needed to manage products, campaigns and orders efficiently. The challenge was to pin down the core flows on both sides within a limited timeline, so the needs of different roles could be designed and confirmed together."
        ]
      },
      "slot": {
        "id": "consumer-entry",
        "aspect": "wide",
        "note": {
          "zh": "消費者 App 入口",
          "en": "Consumer app entry"
        }
      },
      "points": {
        "zh": [
          "商業需求｜購物與營運要接在一起：消費者在 App 瀏覽與下單，商品、活動與訂單則由後台維護。",
          "兩種使用情境｜消費者要快速找到商品並完成購買；營運人員要查詢、編輯大量資料並更新訂單狀態。",
          "時程限制｜約一個月內，前後台的核心流程必須先對齊，才能交給開發。"
        ],
        "en": [
          "Business need｜Shopping and operations had to connect: shoppers browse and order in the app, while products, campaigns and orders are maintained in the CMS.",
          "Two kinds of use｜Shoppers need to find a product and check out quickly; staff need to search and edit many records and update order status.",
          "Delivery constraint｜With about a month, the core flows on both sides had to be aligned before development could start."
        ]
      }
    },
    {
      "label": {
        "zh": "02 — My Role & Approach",
        "en": "02 — MY ROLE & APPROACH"
      },
      "heading": {
        "zh": "先釐清流程，​再用原型​對齊需求",
        "en": "Clarify the flows first, then align on a prototype"
      },
      "body": {
        "zh": [
          "我負責 App 與 CMS 的 UI/UX 規劃、原型設計與基礎前端，與 PM／SA、後端及 QA 協作。我從需求規格中的資訊架構與關鍵任務著手，先釐清前後台流程，再用可點擊原型讓團隊對齊需求。"
        ],
        "en": [
          "I was responsible for UI/UX planning, prototyping and basic front-end for the app and CMS, working with the PM/SA, back-end developer and QA. Starting from the information architecture and key tasks in the requirements specification, I clarified the flows on both sides first, then used a clickable prototype to align the team on requirements."
        ]
      },
      "points": {
        "zh": [
          "從規格拆出關鍵任務｜消費者：找商品、完成購買、查看訂單；營運人員：管理商品、處理訂單。",
          "前後台一起整理｜同一批商品與訂單，在 App 與 CMS 兩端各需要哪些欄位與狀態。",
          "用可點擊原型對齊｜以 HTML 原型串起主要頁面，讓 PM 與客戶直接操作、討論並確認介面需求。"
        ],
        "en": [
          "Key tasks from the spec｜Shoppers: find a product, buy it, check the order. Staff: manage products, process orders.",
          "App and CMS together｜For the same products and orders, which fields and states each side needs.",
          "Align on a clickable prototype｜An HTML prototype linked the main pages so the PM and client could use it, discuss it and confirm requirements."
        ]
      }
    },
    {
      "label": {
        "zh": "03 — App × CMS Flow",
        "en": "03 — APP × CMS FLOW"
      },
      "heading": {
        "zh": "從商品探索，​到訂單管理",
        "en": "From product discovery to order management"
      },
      "body": {
        "zh": [
          "前台的每一個購物步驟，都依賴後台維護的商品與訂單資料。這張圖標出兩端交會的四個位置，也是設計時需要一起確認的地方。"
        ],
        "en": [
          "Every shopping step in the app depends on product and order data maintained in the CMS. The diagram marks the four places where the two sides meet — the points the design had to confirm on both sides."
        ]
      },
      "slot": {
        "id": "app-cms-flow",
        "aspect": "wide",
        "note": {
          "zh": "App × CMS 跨系統流程圖",
          "en": "App × CMS cross-system flow"
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
            "zh": "讓商品​更容易被找到",
            "en": "Making products easier to find"
          },
          "body": {
            "zh": [
              "規格中的首頁同時包含主題推薦、活動、商品列表與多組導覽；若全部平鋪，使用者很難判斷從哪裡開始。我把入口整理成三組：首頁負責探索與推薦，功能選單負責商品分類與品牌內容，快速選單集中收藏、購物車與會員功能。分類再依 TOPS、BOTTOM、JACKETS 展開，讓使用者能快速進入對應任務。"
            ],
            "en": [
              "The specified home page combined themed recommendations, campaigns, product lists and several navigation bars; laid out flat, it would be hard to know where to start. I grouped the entry points into three: Home for discovery and recommendations, a feature menu for product categories and brand content, and a quick menu for favourites, cart and member functions. Categories then open into TOPS, BOTTOM and JACKETS, so people can get straight to the task they came for."
            ]
          },
          "slot": {
            "id": "discovery",
            "aspect": "wide",
            "note": {
              "zh": "功能架構＋分類列表",
              "en": "Feature architecture + category list"
            }
          },
          "layout": "below",
          "rationale": {
            "constraint": {
              "zh": "首頁功能多、入口分散",
              "en": "A busy home page with scattered entry points"
            },
            "decision": {
              "zh": "整理成首頁、功能選單、快速選單三組入口",
              "en": "Three entry groups: Home, feature menu, quick menu"
            },
            "value": {
              "zh": "依任務直接進入：探索、找分類，或購物與會員",
              "en": "Straight to the task: explore, browse a category, or shop and manage membership"
            }
          }
        },
        {
          "title": {
            "zh": "先打通​核心購物流程",
            "en": "Getting the core purchase flow working first"
          },
          "body": {
            "zh": [
              "時程短、功能多，我沒有一次完成所有功能，而是先把最核心的購買路徑做通，並以可點擊原型串起主要頁面，讓團隊逐步確認每一步需要的資訊與頁面轉換。"
            ],
            "en": [
              "With little time and a broad scope, I didn’t try to cover every feature at once. I made the core purchase path work first and linked its main pages in a clickable prototype, so the team could check, step by step, what each screen needs and how the pages connect."
            ]
          },
          "slot": {
            "id": "prototype-flow",
            "aspect": "wide",
            "note": {
              "zh": "購物流程步驟",
              "en": "Purchase flow steps"
            }
          },
          "layout": "below",
          "rationale": {
            "constraint": {
              "zh": "時程短，功能範圍大",
              "en": "A short timeline and a broad scope"
            },
            "decision": {
              "zh": "優先串起選購、購物袋、登入、配送付款與確認訂單",
              "en": "Prioritise select → bag → sign in → delivery & payment → confirm"
            },
            "value": {
              "zh": "主要操作與頁面轉換能先被確認",
              "en": "The main actions and page transitions were confirmed early"
            }
          }
        },
        {
          "title": {
            "zh": "前台與後台，​使用一致的​商品及訂單資訊",
            "en": "One consistent set of product and order data for app and CMS"
          },
          "body": {
            "zh": [
              "消費者在 App 看到的商品與訂單狀態，都來自營運人員在後台維護的資料。我把兩端的欄位與狀態對應起來，並使用同一組名稱，協助團隊確認哪個後台操作會影響哪個前台畫面。"
            ],
            "en": [
              "The products and order status shoppers see in the app come from data staff maintain in the CMS. I mapped fields and states across both sides and kept the same names, so the team could confirm which CMS action affects which app screen."
            ]
          },
          "slot": {
            "id": "consumer-cms",
            "aspect": "wide",
            "note": {
              "zh": "App 與 CMS 對照：商品、訂單",
              "en": "App vs CMS: products, orders"
            }
          },
          "layout": "below",
          "rationale": {
            "constraint": {
              "zh": "同一份資料，兩種角色在兩端操作",
              "en": "The same data, two roles on two platforms"
            },
            "decision": {
              "zh": "對應商品欄位與訂單狀態，兩端使用同一組名稱",
              "en": "Map product fields and order states, with the same names on both sides"
            },
            "value": {
              "zh": "團隊能確認消費者操作與後台作業的關係",
              "en": "The team could see how shopper actions and staff tasks connect"
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
        "zh": "從可確認的原型，​到可交付的​雙端設計",
        "en": "From a prototype to confirm, to a two-sided design to deliver"
      },
      "body": {
        "zh": [
          "實際交付：App 與 CMS 的介面設計、可點擊的 HTML 原型，以及基礎前端頁面。App 與管理後台已正式上線使用。"
        ],
        "en": [
          "Delivered: the app and CMS interface design, a clickable HTML prototype and basic front-end pages. The app and CMS are live."
        ]
      },
      "pointsStyle": "outcome",
      "points": {
        "zh": [
          "前台與後台一起設計｜交付：App 與 CMS 介面，兩端欄位與狀態相互對應。作用：確認前台操作與後台作業的關係。｜回應挑戰 01 · 商業需求",
          "依角色區分操作方式｜交付：App 三組入口與分類標籤；CMS 篩選、列表與狀態欄。作用：兩種使用者各有對應任務的路徑。｜回應挑戰 02 · 兩種使用情境",
          "核心流程先可操作｜交付：核心購物流程的可點擊 HTML 原型與基礎前端頁面。作用：開發前就能操作與討論主要流程。｜回應挑戰 03 · 時程限制"
        ],
        "en": [
          "App and CMS designed together｜Delivered: both interfaces, with fields and states mapped across them. Enabled: confirming how app actions and staff tasks relate.｜Answers challenge 01 · Business need",
          "Different tools for each role｜Delivered: entry groups and category tabs in the app; filters, lists and status columns in the CMS. Enabled: a path that fits each user’s tasks.｜Answers challenge 02 · Two kinds of use",
          "The core flow usable early｜Delivered: a clickable HTML prototype of the core purchase flow, plus basic front-end pages. Enabled: using and discussing the main flow before development.｜Answers challenge 03 · Delivery constraint"
        ]
      }
    }
  ]
} as const;

