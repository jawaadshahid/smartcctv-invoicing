var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  dev: () => dev,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest,
  mailer: () => mailer
});
var import_node_stream = require("node:stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_nodemailer = __toESM(require("nodemailer")), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), mailer = import_nodemailer.default, ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return (0, import_isbot.default)(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 50,
          columnNumber: 7
        },
        this
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new import_node_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 99,
          columnNumber: 7
        },
        this
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new import_node_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  SITE_TITLE: () => SITE_TITLE,
  UserContext: () => UserContext,
  default: () => App,
  links: () => links,
  loader: () => loader
});

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-CHCQH3YM.css";

// app/root.tsx
var import_node3 = require("@remix-run/node"), import_react3 = require("@remix-run/react"), import_react4 = require("react");

// app/utils/session.tsx
var import_node2 = require("@remix-run/node"), sessionSecret = "sessionYsecret";
if (!sessionSecret)
  throw new Error("SESSION_SECRET must be set");
var storage = (0, import_node2.createCookieSessionStorage)({
  cookie: {
    name: "user_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: !1,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: !0
  }
});
async function createUserSession(userId, redirectTo) {
  let session = await storage.getSession();
  return session.set("userId", userId), (0, import_node2.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}
function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}
async function getUserId(request) {
  let userId = (await getUserSession(request)).get("userId");
  return !userId || typeof userId != "number" ? null : userId;
}
async function logout(request) {
  let session = await getUserSession(request);
  return (0, import_node2.redirect)("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}

// app/utils/db.tsx
var import_client = require("@prisma/client"), db;
typeof window > "u" && (global.db || (global.db = new import_client.PrismaClient()), db = global.db);
var getUserByEmail = (email) => db.users.findFirst({
  where: { email }
}), getUserById = (id) => db.users.findFirst({
  where: { id }
}), deleteUserById = (id) => db.users.delete({
  where: { id }
}), deleteProductById = (product_id) => db.products.delete({
  where: { product_id }
}), deleteCustomerById = (customer_id) => db.customers.delete({
  where: { customer_id }
}), createCustomer = (name, tel, email, address) => db.customers.create({
  data: {
    name,
    tel,
    email,
    address
  }
}), createProduct = (brand, newbrand, type, newtype, model, newmodel, price) => {
  let isBrandSelected = brand && parseInt(brand) > 0, isTypeSelected = type && parseInt(type) > 0, isModelSelected = model && parseInt(model) > 0, newProduct = {
    brand: isBrandSelected ? { connect: { brand_id: parseInt(brand) } } : { create: { brand_name: newbrand } },
    type: isTypeSelected ? { connect: { type_id: parseInt(type) } } : { create: { type_name: newtype } },
    model: isModelSelected ? { connect: { model_id: parseInt(model) } } : { create: { model_name: newmodel } },
    price: Number(price)
  };
  return db.products.create({ data: newProduct });
};

// app/components/NavBar.tsx
var import_react2 = require("react");
var import_jsx_dev_runtime2 = require("react/jsx-dev-runtime"), NavBar = () => {
  let user = (0, import_react2.useContext)(UserContext);
  return user ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "navbar bg-base-100", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "navbar-start", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "dropdown", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("label", { tabIndex: 0, className: "btn btn-ghost btn-circle", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-5 w-5",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M4 6h16M4 12h16M4 18h7"
            },
            void 0,
            !1,
            {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 19,
              columnNumber: 15
            },
            this
          )
        },
        void 0,
        !1,
        {
          fileName: "app/components/NavBar.tsx",
          lineNumber: 12,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/components/NavBar.tsx",
        lineNumber: 11,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
        "ul",
        {
          tabIndex: 0,
          className: "prose prose-li:pl-0 prose-a:no-underline menu dropdown-content mt-2 p-2 shadow bg-base-300 rounded-box z-[1]",
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: "/", children: "Home" }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 32,
              columnNumber: 15
            }, this) }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 31,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: user.isAdmin ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: "/users", children: "Users" }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 36,
              columnNumber: 17
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: `/users/${user.id}`, children: "My details" }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 38,
              columnNumber: 17
            }, this) }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 34,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: "/quotes", children: "Quotes" }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 42,
              columnNumber: 15
            }, this) }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 41,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: "/customers", children: "Customers" }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 45,
              columnNumber: 15
            }, this) }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 44,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: "/products", children: "Products" }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 48,
              columnNumber: 15
            }, this) }, void 0, !1, {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 47,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        !0,
        {
          fileName: "app/components/NavBar.tsx",
          lineNumber: 27,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/components/NavBar.tsx",
      lineNumber: 10,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/components/NavBar.tsx",
      lineNumber: 9,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "navbar-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
      "img",
      {
        className: "h-10 w-auto mx-4",
        src: "https://smartcctvuk.co.uk/img/logo-small.png",
        alt: ""
      },
      void 0,
      !1,
      {
        fileName: "app/components/NavBar.tsx",
        lineNumber: 54,
        columnNumber: 9
      },
      this
    ) }, void 0, !1, {
      fileName: "app/components/NavBar.tsx",
      lineNumber: 53,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "navbar-end", children: user ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { className: "hidden md:block", children: [
        "Hi, ",
        user.firstName
      ] }, void 0, !0, {
        fileName: "app/components/NavBar.tsx",
        lineNumber: 85,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
        "button",
        {
          className: "btn btn-ghost btn-circle tooltip tooltip-left",
          "data-tip": "logout",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: "/logout", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
            "svg",
            {
              className: "w-6 h-6 mx-auto",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                },
                void 0,
                !1,
                {
                  fileName: "app/components/NavBar.tsx",
                  lineNumber: 98,
                  columnNumber: 19
                },
                this
              )
            },
            void 0,
            !1,
            {
              fileName: "app/components/NavBar.tsx",
              lineNumber: 91,
              columnNumber: 17
            },
            this
          ) }, void 0, !1, {
            fileName: "app/components/NavBar.tsx",
            lineNumber: 90,
            columnNumber: 15
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/components/NavBar.tsx",
          lineNumber: 86,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/components/NavBar.tsx",
      lineNumber: 84,
      columnNumber: 11
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
      "button",
      {
        className: "btn btn-ghost btn-circle tooltip tooltip-left",
        "data-tip": "login",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: "/login", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
          "svg",
          {
            className: "w-6 h-6 mx-auto",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              },
              void 0,
              !1,
              {
                fileName: "app/components/NavBar.tsx",
                lineNumber: 74,
                columnNumber: 17
              },
              this
            )
          },
          void 0,
          !1,
          {
            fileName: "app/components/NavBar.tsx",
            lineNumber: 67,
            columnNumber: 15
          },
          this
        ) }, void 0, !1, {
          fileName: "app/components/NavBar.tsx",
          lineNumber: 66,
          columnNumber: 13
        }, this)
      },
      void 0,
      !1,
      {
        fileName: "app/components/NavBar.tsx",
        lineNumber: 62,
        columnNumber: 11
      },
      this
    ) }, void 0, !1, {
      fileName: "app/components/NavBar.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/NavBar.tsx",
    lineNumber: 8,
    columnNumber: 5
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "navbar bg-base-100" }, void 0, !1, {
    fileName: "app/components/NavBar.tsx",
    lineNumber: 6,
    columnNumber: 21
  }, this);
}, NavBar_default = NavBar;

// app/root.tsx
var import_jsx_dev_runtime3 = require("react/jsx-dev-runtime"), SITE_TITLE = "Smart CCTV admin", UserContext = (0, import_react4.createContext)(null), loader = async ({ request }) => {
  let uid = await getUserId(request);
  if (!uid)
    return {};
  try {
    let user = await getUserById(uid);
    return (0, import_node3.json)({ user });
  } catch (err) {
    return console.error(err), {};
  }
}, links = () => [
  { rel: "stylesheet", href: tailwind_default }
];
function App() {
  let { user } = (0, import_react3.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("meta", { charSet: "utf-8" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 42,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 43,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("meta", { name: "robots", content: "noindex, nofollow" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 44,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react3.Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 45,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react3.Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 46,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("body", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(UserContext.Provider, { value: user, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(NavBar_default, {}, void 0, !1, {
          fileName: "app/root.tsx",
          lineNumber: 50,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react3.Outlet, {}, void 0, !1, {
          fileName: "app/root.tsx",
          lineNumber: 51,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 49,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react3.ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 53,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react3.Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 54,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react3.LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 55,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 48,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 40,
    columnNumber: 5
  }, this);
}

// app/routes/quotes.$quoteid.generatedquote.tsx
var quotes_quoteid_generatedquote_exports = {};
__export(quotes_quoteid_generatedquote_exports, {
  loader: () => loader2
});
var import_node4 = require("@remix-run/node");

// app/components/QuotePDFDoc.tsx
var import_renderer = require("@react-pdf/renderer");
var import_jsx_dev_runtime4 = require("react/jsx-dev-runtime"), getQuoteBuffer = async (quoteid) => {
  if (!quoteid)
    return Promise.reject({ error: "quote id is not defined" });
  let id = quoteid, quote;
  try {
    quote = await db.quotes.findUnique({
      where: {
        quote_id: parseInt(id)
      },
      include: {
        customer: !0,
        quoted_products: !0
      }
    });
  } catch (error) {
    Promise.reject({ error });
  }
  let stream = await (0, import_renderer.renderToStream)(/* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(QuotePDFDoc, { quote }, void 0, !1, {
    fileName: "app/components/QuotePDFDoc.tsx",
    lineNumber: 40,
    columnNumber: 37
  }, this));
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on("data", (data) => {
      buffers.push(data);
    }), stream.on("end", () => {
      resolve(Buffer.concat(buffers));
    }), stream.on("error", reject);
  });
}, styles = import_renderer.StyleSheet.create({
  page: {
    fontSize: 12
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#000000",
    borderBottomWidth: 1
  },
  logo: {
    width: 200
  },
  customerRow: {
    flexDirection: "row",
    marginBottom: 12
  },
  customerField: {
    width: 200
  },
  customerValue: {},
  table: {
    marginTop: 5,
    borderWidth: 1
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1
  },
  tableCell: {
    padding: "5 10",
    width: "15%",
    textAlign: "right",
    borderLeftWidth: 1
  },
  endRow: {
    flexDirection: "row"
  },
  endField: {
    padding: "5 10",
    width: "85%",
    textAlign: "right"
  },
  endValue: {
    padding: "5 10",
    width: "15%",
    textAlign: "right",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1
  }
}), QuotePDFDoc = ({ quote }) => {
  let { quote_id, createdAt, customer, labour, quoted_products } = quote, { name, tel, email, address } = customer, date = new Date(createdAt), grandTotal = 0;
  return quoted_products.forEach(
    ({ price, quantity }) => grandTotal += price * quantity
  ), grandTotal += labour, /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Document, { title: `Smart CCTV quote #${quote_id}, for ${name}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Page, { size: "A4", style: styles.page, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.header, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
        import_renderer.Image,
        {
          src: "https://smartcctvuk.co.uk/img/logo-small.png",
          style: styles.logo
        },
        void 0,
        !1,
        {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 123,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: { marginRight: 20 }, children: date.toDateString() }, void 0, !1, {
        fileName: "app/components/QuotePDFDoc.tsx",
        lineNumber: 127,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/QuotePDFDoc.tsx",
      lineNumber: 122,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: { margin: "15 20" }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.customerRow, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.customerField, children: "Name:" }, void 0, !1, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 131,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.customerValue, children: name }, void 0, !1, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 132,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/QuotePDFDoc.tsx",
        lineNumber: 130,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.customerRow, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.customerField, children: "Address:" }, void 0, !1, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 135,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.customerValue, children: address }, void 0, !1, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 136,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/QuotePDFDoc.tsx",
        lineNumber: 134,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.customerRow, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.customerField, children: "Tel:" }, void 0, !1, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 139,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.customerValue, children: tel }, void 0, !1, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 140,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/QuotePDFDoc.tsx",
        lineNumber: 138,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.customerRow, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.customerField, children: "Email:" }, void 0, !1, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 143,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.customerValue, children: email }, void 0, !1, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 144,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/QuotePDFDoc.tsx",
        lineNumber: 142,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.table, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: [styles.tableRow, { borderTop: 0 }], children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
            import_renderer.View,
            {
              style: [
                styles.tableCell,
                { textAlign: "left", width: "55%", borderLeftWidth: 0 }
              ],
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { children: "Product" }, void 0, !1, {
                fileName: "app/components/QuotePDFDoc.tsx",
                lineNumber: 154,
                columnNumber: 17
              }, this)
            },
            void 0,
            !1,
            {
              fileName: "app/components/QuotePDFDoc.tsx",
              lineNumber: 148,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { children: "Quantity" }, void 0, !1, {
            fileName: "app/components/QuotePDFDoc.tsx",
            lineNumber: 157,
            columnNumber: 17
          }, this) }, void 0, !1, {
            fileName: "app/components/QuotePDFDoc.tsx",
            lineNumber: 156,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { children: "Unit price" }, void 0, !1, {
            fileName: "app/components/QuotePDFDoc.tsx",
            lineNumber: 160,
            columnNumber: 17
          }, this) }, void 0, !1, {
            fileName: "app/components/QuotePDFDoc.tsx",
            lineNumber: 159,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { children: "Total price" }, void 0, !1, {
            fileName: "app/components/QuotePDFDoc.tsx",
            lineNumber: 163,
            columnNumber: 17
          }, this) }, void 0, !1, {
            fileName: "app/components/QuotePDFDoc.tsx",
            lineNumber: 162,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 147,
          columnNumber: 13
        }, this),
        quoted_products && quoted_products.map(
          ({ invprod_id, name: name2, quantity, price }) => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.tableRow, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
              import_renderer.View,
              {
                style: [
                  styles.tableCell,
                  { textAlign: "left", width: "55%", borderLeftWidth: 0 }
                ],
                children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { children: name2 }, void 0, !1, {
                  fileName: "app/components/QuotePDFDoc.tsx",
                  lineNumber: 176,
                  columnNumber: 23
                }, this)
              },
              void 0,
              !1,
              {
                fileName: "app/components/QuotePDFDoc.tsx",
                lineNumber: 170,
                columnNumber: 21
              },
              this
            ),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { children: [
              "\xA3",
              quantity,
              ".00"
            ] }, void 0, !0, {
              fileName: "app/components/QuotePDFDoc.tsx",
              lineNumber: 179,
              columnNumber: 23
            }, this) }, void 0, !1, {
              fileName: "app/components/QuotePDFDoc.tsx",
              lineNumber: 178,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { children: [
              "\xA3",
              price,
              ".00"
            ] }, void 0, !0, {
              fileName: "app/components/QuotePDFDoc.tsx",
              lineNumber: 182,
              columnNumber: 23
            }, this) }, void 0, !1, {
              fileName: "app/components/QuotePDFDoc.tsx",
              lineNumber: 181,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { children: [
              "\xA3",
              price * quantity,
              ".00"
            ] }, void 0, !0, {
              fileName: "app/components/QuotePDFDoc.tsx",
              lineNumber: 185,
              columnNumber: 23
            }, this) }, void 0, !1, {
              fileName: "app/components/QuotePDFDoc.tsx",
              lineNumber: 184,
              columnNumber: 21
            }, this)
          ] }, invprod_id, !0, {
            fileName: "app/components/QuotePDFDoc.tsx",
            lineNumber: 169,
            columnNumber: 19
          }, this)
        )
      ] }, void 0, !0, {
        fileName: "app/components/QuotePDFDoc.tsx",
        lineNumber: 146,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.endRow, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.endField, children: "Labour:" }, void 0, !1, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 192,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.endValue, children: [
          "\xA3",
          labour,
          ".00"
        ] }, void 0, !0, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 193,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/QuotePDFDoc.tsx",
        lineNumber: 191,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.View, { style: styles.endRow, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.endField, children: "Grand total:" }, void 0, !1, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 196,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_renderer.Text, { style: styles.endValue, children: [
          "\xA3",
          grandTotal,
          ".00"
        ] }, void 0, !0, {
          fileName: "app/components/QuotePDFDoc.tsx",
          lineNumber: 197,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/QuotePDFDoc.tsx",
        lineNumber: 195,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/QuotePDFDoc.tsx",
      lineNumber: 129,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/QuotePDFDoc.tsx",
    lineNumber: 121,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/components/QuotePDFDoc.tsx",
    lineNumber: 120,
    columnNumber: 5
  }, this);
};

// app/routes/quotes.$quoteid.generatedquote.tsx
var loader2 = async ({ request, params }) => {
  if (!await getUserId(request))
    return (0, import_node4.redirect)("/login");
  let { quoteid } = params, body = await getQuoteBuffer(quoteid), headers = new Headers({ "Content-Type": "application/pdf" });
  return new Response(body, { status: 200, headers });
};

// app/routes/quotes.$quoteid.tsx
var quotes_quoteid_exports = {};
__export(quotes_quoteid_exports, {
  action: () => action,
  default: () => QuoteId,
  loader: () => loader3,
  meta: () => meta
});
var import_node5 = require("@remix-run/node"), import_react6 = require("@remix-run/react"), import_react7 = require("react");

// app/components/FormAnchorBtn.tsx
var import_classnames = __toESM(require("classnames")), import_jsx_dev_runtime5 = require("react/jsx-dev-runtime"), FormAnchorButton = ({ isSubmitting, className, ...props }) => {
  let btnClass = (0, import_classnames.default)({
    btn: !0,
    "btn-disabled": isSubmitting,
    ...className && { [`${className}`]: !0 }
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("a", { className: btnClass, ...props }, void 0, !1, {
    fileName: "app/components/FormAnchorBtn.tsx",
    lineNumber: 15,
    columnNumber: 5
  }, this);
}, FormAnchorBtn_default = FormAnchorButton;

// app/components/FormBtn.tsx
var import_classnames2 = __toESM(require("classnames")), import_jsx_dev_runtime6 = require("react/jsx-dev-runtime"), FormBtn = ({ isSubmitting, className, disabled, ...props }) => {
  let btnClass = (0, import_classnames2.default)({
    btn: !0,
    loading: isSubmitting && props.type === "submit",
    ...className && { [`${className}`]: !0 }
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("button", { className: btnClass, disabled: disabled || isSubmitting, ...props }, void 0, !1, {
    fileName: "app/components/FormBtn.tsx",
    lineNumber: 15,
    columnNumber: 5
  }, this);
}, FormBtn_default = FormBtn;

// app/components/Modal.tsx
var import_classnames3 = __toESM(require("classnames")), import_jsx_dev_runtime7 = require("react/jsx-dev-runtime"), Modal = ({ children, open }) => {
  let modalClass = (0, import_classnames3.default)({
    "modal modal-bottom sm:modal-middle": !0,
    "modal-open": open,
    hidden: !open
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: modalClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: "modal-box prose", children }, void 0, !1, {
    fileName: "app/components/Modal.tsx",
    lineNumber: 16,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/components/Modal.tsx",
    lineNumber: 15,
    columnNumber: 5
  }, this);
}, Modal_default = Modal;

// app/components/ShareQuoteForm.tsx
var import_react5 = require("@remix-run/react");

// app/utils/styleClasses.ts
var contentBodyClass = "prose md:max-w-screen-xl md:mx-auto p-6", formClass = "bg-base-300 px-4 py-2 rounded-lg", inputClass = "input input-bordered w-full", selectClass = "select select-bordered w-full", resTRClass = "flex flex-col md:table-row", resTDClass = "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";

// app/components/ShareQuoteForm.tsx
var import_jsx_dev_runtime8 = require("react/jsx-dev-runtime"), ShareQuoteForm = ({
  quoteid,
  navigation,
  customer,
  user,
  onCancel,
  formErrors
}) => {
  let isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(import_react5.Form, { replace: !0, method: "post", className: formClass, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("input", { type: "hidden", value: quoteid, name: "quoteid", id: "quoteid" }, void 0, !1, {
      fileName: "app/components/ShareQuoteForm.tsx",
      lineNumber: 25,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("fieldset", { disabled: isSubmitting, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "form-control", children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("label", { className: "label cursor-pointer", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("span", { className: "label-text", children: [
          customer.name,
          " (",
          customer.email,
          ")"
        ] }, void 0, !0, {
          fileName: "app/components/ShareQuoteForm.tsx",
          lineNumber: 29,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
          "input",
          {
            type: "checkbox",
            className: "checkbox",
            name: "customerEmail",
            id: "customerEmail",
            value: customer.email
          },
          void 0,
          !1,
          {
            fileName: "app/components/ShareQuoteForm.tsx",
            lineNumber: 32,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/components/ShareQuoteForm.tsx",
        lineNumber: 28,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/components/ShareQuoteForm.tsx",
        lineNumber: 27,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "form-control", children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("label", { className: "label cursor-pointer", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("span", { className: "label-text", children: [
          user.firstName,
          " (",
          user.email,
          ")"
        ] }, void 0, !0, {
          fileName: "app/components/ShareQuoteForm.tsx",
          lineNumber: 43,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
          "input",
          {
            type: "checkbox",
            className: "checkbox",
            name: "userEmail",
            id: "userEmail",
            value: user.email
          },
          void 0,
          !1,
          {
            fileName: "app/components/ShareQuoteForm.tsx",
            lineNumber: 46,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/components/ShareQuoteForm.tsx",
        lineNumber: 42,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/components/ShareQuoteForm.tsx",
        lineNumber: 41,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "form-control", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("span", { className: "label-text", children: "Other(s)" }, void 0, !1, {
          fileName: "app/components/ShareQuoteForm.tsx",
          lineNumber: 57,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/components/ShareQuoteForm.tsx",
          lineNumber: 56,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
          "input",
          {
            type: "text",
            name: "otherEmails",
            id: "otherEmails",
            placeholder: "john@example.com,jill@example.com,etc",
            className: inputClass
          },
          void 0,
          !1,
          {
            fileName: "app/components/ShareQuoteForm.tsx",
            lineNumber: 59,
            columnNumber: 11
          },
          this
        ),
        (formErrors == null ? void 0 : formErrors.msg) && /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("span", { className: "label-text-alt text-error", children: formErrors.msg }, void 0, !1, {
          fileName: "app/components/ShareQuoteForm.tsx",
          lineNumber: 68,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/components/ShareQuoteForm.tsx",
          lineNumber: 67,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/ShareQuoteForm.tsx",
        lineNumber: 55,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "flex justify-end mt-4 mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
          FormBtn_default,
          {
            type: "submit",
            name: "_action",
            value: "share_quote",
            isSubmitting,
            children: "Submit"
          },
          void 0,
          !1,
          {
            fileName: "app/components/ShareQuoteForm.tsx",
            lineNumber: 75,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
          FormBtn_default,
          {
            className: "ml-4",
            isSubmitting,
            onClick: (e) => {
              e.preventDefault(), onCancel();
            },
            children: "Cancel"
          },
          void 0,
          !1,
          {
            fileName: "app/components/ShareQuoteForm.tsx",
            lineNumber: 83,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/components/ShareQuoteForm.tsx",
        lineNumber: 74,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/ShareQuoteForm.tsx",
      lineNumber: 26,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/ShareQuoteForm.tsx",
    lineNumber: 24,
    columnNumber: 5
  }, this);
}, ShareQuoteForm_default = ShareQuoteForm;

// app/utils/mailer.ts
async function sendEmail(to, attachmentBuffer) {
  return mailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: !1,
    // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }).sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Smart CCTV Quote",
    html: "Hi. Please find your quotation attached",
    attachments: [{
      filename: "quote.pdf",
      content: attachmentBuffer
    }]
  });
}

// app/utils/validations.tsx
var validateTel = (tel) => {
  if (tel) {
    if (!/^[0][1-9]\d{9}$|^[1-9]\d{9}$/.test(tel))
      return "Invalid tel, needs to be a 11 digit number!";
  } else
    return "Tel is Required!";
}, validateName = (name) => {
  if (name) {
    if (!/^[a-z A-Z]+$/.test(name))
      return "Invalid name!";
  } else
    return "Name is Required!";
}, validateFname = (firstname) => {
  if (firstname) {
    if (!/^[a-zA-Z]+$/.test(firstname))
      return "Invalid First name!";
  } else
    return "First name is Required!";
}, validateLname = (lastname) => {
  if (lastname) {
    if (!/^[a-zA-Z]+$/.test(lastname))
      return "Invalid Last name!";
  } else
    return "Last name is Required!";
}, validateEmail = (email) => {
  if (email) {
    if (!/\S+@\S+\.\S+/.test(email))
      return "Invalid emaill!";
  } else
    return "Email is Required!";
}, validatePassword = (password) => {
  if (password) {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    ))
      return "Weak password! A strong password should contain atleast 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.";
  } else
    return "Password is Required!";
}, validateCustomerData = ({ name, tel, email, address }) => {
  let errors = {};
  return errors.name = validateName(`${name}`), errors.tel = validateTel(`${tel}`), errors.email = validateEmail(`${email}`), address || (errors.address = "address is required!"), errors;
}, validateProductData = ({
  brand,
  newbrand,
  type,
  newtype,
  model,
  newmodel,
  price
}) => {
  let errors = {}, isBrandSelected = brand && parseInt(`${brand}`) > 0, isTypeSelected = type && parseInt(`${type}`) > 0, isModelSelected = model && parseInt(`${model}`) > 0;
  return !isBrandSelected && !newbrand && (errors.brand = "a brand must be selected or defined"), !isTypeSelected && !newtype && (errors.type = "a type must be selected or defined"), !isModelSelected && !newmodel && (errors.model = "a model must be selected or defined"), (!price || parseInt(price) <= 0) && (errors.price = "a valid price must be defined"), errors;
};

// app/routes/quotes.$quoteid.tsx
var import_jsx_dev_runtime9 = require("react/jsx-dev-runtime"), meta = () => [{ title: `${SITE_TITLE} - View quote ` }], loader3 = async ({ request, params }) => {
  if (!await getUserId(request))
    return (0, import_node5.redirect)("/login");
  let { quoteid } = params, id = quoteid;
  try {
    let quote = await db.quotes.findUnique({
      where: {
        quote_id: parseInt(id)
      },
      include: {
        customer: !0,
        quoted_products: !0
      }
    });
    return (0, import_node5.json)({ quote });
  } catch (err) {
    return console.error(err), {};
  }
};
async function action({ request }) {
  let formData = await request.formData(), { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "share_quote":
      let { quoteid, customerEmail, userEmail, otherEmails } = values, shareActionErrors = {};
      if (!customerEmail && !userEmail && !otherEmails && (shareActionErrors.msg = "One option has to be selected or defined!"), Object.values(shareActionErrors).some(Boolean))
        return { shareActionErrors };
      let othEmails = otherEmails ? String(otherEmails).split(",").map((othEmail) => {
        let trimmed = othEmail.trim();
        return shareActionErrors.msg = validateEmail(trimmed), trimmed;
      }) : [];
      if (Object.values(shareActionErrors).some(Boolean))
        return { shareActionErrors };
      let allEmails = [...othEmails];
      customerEmail && allEmails.push(String(customerEmail)), userEmail && allEmails.push(String(userEmail));
      let pdfBuffer = await getQuoteBuffer(quoteid), mailResponse = await sendEmail(allEmails, pdfBuffer);
      return mailResponse.error ? { shareActionErrors: { msg: mailResponse.error } } : (console.log("message sent:", mailer.getTestMessageUrl(mailResponse)), mailResponse.accepted && mailResponse.accepted.length > 0 ? { shareActionErrors: { msg: "mail sent!" } } : {
        shareActionErrors: {
          msg: "something went wrong (vague, I know, but I haven't handled this error)"
        }
      });
  }
  return {};
}
var prettifyDateString = (dateString) => new Date(dateString).toDateString();
function QuoteId() {
  let user = (0, import_react7.useContext)(UserContext), { quote } = (0, import_react6.useLoaderData)(), { createdAt, labour, customer, quoted_products } = quote, navigation = (0, import_react6.useNavigation)(), data = (0, import_react6.useActionData)(), isSubmitting = navigation.state === "submitting", [grandTotal, setGrandTotal] = (0, import_react7.useState)(0), [showShareModal, setShowShareModal] = (0, import_react7.useState)(!1);
  return (0, import_react7.useEffect)(() => {
    setGrandTotal(() => {
      let subTotals = 0;
      return quoted_products.forEach(
        ({ price, quantity }) => subTotals += price * quantity
      ), subTotals + labour;
    });
  }, [labour, quoted_products]), /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("h2", { children: "Quote" }, void 0, !1, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 133,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("p", { children: [
      "Created on: ",
      prettifyDateString(createdAt)
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 134,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("h3", { children: "Customer" }, void 0, !1, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 135,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("p", { children: [
      "Name: ",
      customer.name
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 136,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("p", { children: [
      "Address: ",
      customer.address
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 137,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("p", { children: [
      "Tel: ",
      customer.tel
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 138,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("p", { children: [
      "Email: ",
      customer.email
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 139,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("h3", { children: "Products" }, void 0, !1, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 140,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("table", { className: "table", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("tr", { className: "hidden md:table-row", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("th", { children: "Name" }, void 0, !1, {
          fileName: "app/routes/quotes.$quoteid.tsx",
          lineNumber: 144,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("th", { children: "Quantity" }, void 0, !1, {
          fileName: "app/routes/quotes.$quoteid.tsx",
          lineNumber: 145,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("th", { className: "text-right", children: "Unit Price (\xA3)" }, void 0, !1, {
          fileName: "app/routes/quotes.$quoteid.tsx",
          lineNumber: 146,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("th", { className: "text-right", children: "Subtotal (\xA3)" }, void 0, !1, {
          fileName: "app/routes/quotes.$quoteid.tsx",
          lineNumber: 147,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/quotes.$quoteid.tsx",
        lineNumber: 143,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/routes/quotes.$quoteid.tsx",
        lineNumber: 142,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("tbody", { children: [
        quoted_products && quoted_products.map(
          ({ invprod_id, name, quantity, price }) => /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("tr", { className: resTRClass, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("td", { "data-label": "Name", className: resTDClass, children: name }, void 0, !1, {
              fileName: "app/routes/quotes.$quoteid.tsx",
              lineNumber: 156,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("td", { "data-label": "Quantity", className: resTDClass, children: quantity }, void 0, !1, {
              fileName: "app/routes/quotes.$quoteid.tsx",
              lineNumber: 159,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(
              "td",
              {
                "data-label": "Unit Price (\xA3)",
                className: `${resTDClass} md:text-right`,
                children: price
              },
              void 0,
              !1,
              {
                fileName: "app/routes/quotes.$quoteid.tsx",
                lineNumber: 162,
                columnNumber: 21
              },
              this
            ),
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(
              "td",
              {
                "data-label": "Subtotal (\xA3)",
                className: `${resTDClass} md:text-right`,
                children: price * quantity
              },
              void 0,
              !1,
              {
                fileName: "app/routes/quotes.$quoteid.tsx",
                lineNumber: 168,
                columnNumber: 21
              },
              this
            )
          ] }, invprod_id, !0, {
            fileName: "app/routes/quotes.$quoteid.tsx",
            lineNumber: 155,
            columnNumber: 19
          }, this)
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("tr", { className: resTRClass, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("td", { colSpan: 3, className: "hidden md:table-cell" }, void 0, !1, {
            fileName: "app/routes/quotes.$quoteid.tsx",
            lineNumber: 179,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("td", { className: "md:text-right", children: [
            "Labour cost (\xA3): ",
            labour
          ] }, void 0, !0, {
            fileName: "app/routes/quotes.$quoteid.tsx",
            lineNumber: 180,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/quotes.$quoteid.tsx",
          lineNumber: 178,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("tr", { className: resTRClass, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("td", { colSpan: 3, className: "hidden md:table-cell" }, void 0, !1, {
            fileName: "app/routes/quotes.$quoteid.tsx",
            lineNumber: 183,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("td", { className: "md:text-right", children: [
            "Total cost (\xA3): ",
            grandTotal
          ] }, void 0, !0, {
            fileName: "app/routes/quotes.$quoteid.tsx",
            lineNumber: 184,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/quotes.$quoteid.tsx",
          lineNumber: 182,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/quotes.$quoteid.tsx",
        lineNumber: 150,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 141,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "flex justify-end mt-4 gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(
        FormAnchorBtn_default,
        {
          href: `/quotes/${quote.quote_id}/generatedquote`,
          target: "_blank",
          rel: "noreferrer",
          isSubmitting,
          children: "Generate"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/quotes.$quoteid.tsx",
          lineNumber: 189,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(
        FormBtn_default,
        {
          isSubmitting,
          onClick: () => {
            setShowShareModal(!0);
          },
          children: "Share"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/quotes.$quoteid.tsx",
          lineNumber: 197,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(FormAnchorBtn_default, { href: "/quotes", isSubmitting, children: "Back" }, void 0, !1, {
        fileName: "app/routes/quotes.$quoteid.tsx",
        lineNumber: 205,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 188,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Modal_default, { open: showShareModal, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("h3", { className: "mb-4", children: "Share with:" }, void 0, !1, {
        fileName: "app/routes/quotes.$quoteid.tsx",
        lineNumber: 210,
        columnNumber: 9
      }, this),
      showShareModal && /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(
        ShareQuoteForm_default,
        {
          quoteid: quote.quote_id,
          customer,
          user,
          navigation,
          formErrors: data == null ? void 0 : data.shareActionErrors,
          onCancel: () => {
            setShowShareModal(!1), data && (data.shareActionErrors = {});
          }
        },
        void 0,
        !1,
        {
          fileName: "app/routes/quotes.$quoteid.tsx",
          lineNumber: 212,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.$quoteid.tsx",
      lineNumber: 209,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/quotes.$quoteid.tsx",
    lineNumber: 132,
    columnNumber: 5
  }, this);
}

// app/routes/users.register.tsx
var users_register_exports = {};
__export(users_register_exports, {
  action: () => action2,
  default: () => Register,
  meta: () => meta2
});
var import_node6 = require("@remix-run/node"), import_react8 = require("@remix-run/react"), import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsx_dev_runtime10 = require("react/jsx-dev-runtime"), meta2 = () => [{ title: `${SITE_TITLE} - Register` }];
async function action2({ request }) {
  let formData = await request.formData(), fname = formData.get("firstname"), lname = formData.get("lastname"), email = formData.get("email"), rpassword = formData.get("password"), formErrors = {
    fname: validateFname(fname),
    lname: validateLname(lname),
    email: validateEmail(email),
    password: validatePassword(rpassword)
  };
  if (Object.values(formErrors).some(Boolean))
    return { formErrors };
  let password = await import_bcryptjs.default.hash(rpassword, 10), isFirst = (await db.users.findMany()).length === 0;
  try {
    return await db.users.create({
      data: {
        firstName: fname,
        lastName: lname,
        email,
        password,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        isAdmin: isFirst ? 1 : 0,
        isApproved: isFirst ? 1 : 0
      }
    }), (0, import_node6.redirect)("/login");
  } catch (err) {
    if (err.code === "P2002")
      return formErrors.email = "email already registered!", { formErrors };
    console.error(err);
  }
}
function Register() {
  let navigation = (0, import_react8.useNavigation)(), data = (0, import_react8.useActionData)(), isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "grid place-items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_react8.Form, { method: "post", className: formClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("fieldset", { disabled: isSubmitting, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("label", { className: "label", htmlFor: "firstname", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("span", { className: "label-text", children: "First name" }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 81,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 80,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
        "input",
        {
          className: inputClass,
          id: "firstname",
          name: "firstname",
          type: "text",
          placeholder: "First name"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.register.tsx",
          lineNumber: 83,
          columnNumber: 15
        },
        this
      ),
      data && data.formErrors && data.formErrors.fname && /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.fname }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 91,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/users.register.tsx",
      lineNumber: 79,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("label", { className: "label", htmlFor: "lastname", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("span", { className: "label-text", children: "Last name" }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 98,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 97,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
        "input",
        {
          className: inputClass,
          id: "lastname",
          name: "lastname",
          type: "text",
          placeholder: "Last name"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.register.tsx",
          lineNumber: 100,
          columnNumber: 15
        },
        this
      ),
      data && data.formErrors && data.formErrors.lname && /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.lname }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 108,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/users.register.tsx",
      lineNumber: 96,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("label", { className: "label", htmlFor: "email", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("span", { className: "label-text", children: "Email" }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 115,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 114,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
        "input",
        {
          className: inputClass,
          id: "email",
          name: "email",
          type: "text",
          placeholder: "Email"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.register.tsx",
          lineNumber: 117,
          columnNumber: 15
        },
        this
      ),
      data && data.formErrors && data.formErrors.email && /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.email }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 125,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/users.register.tsx",
      lineNumber: 113,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("label", { className: "label", htmlFor: "password", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("span", { className: "label-text", children: "Password" }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 132,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 131,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
        "input",
        {
          className: inputClass,
          id: "password",
          name: "password",
          type: "password",
          placeholder: "******************"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.register.tsx",
          lineNumber: 134,
          columnNumber: 15
        },
        this
      ),
      data && data.formErrors && data.formErrors.password && /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.password }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 142,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/users.register.tsx",
      lineNumber: 130,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "mt-6 mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(FormBtn_default, { type: "submit", isSubmitting, children: "Submit" }, void 0, !1, {
        fileName: "app/routes/users.register.tsx",
        lineNumber: 148,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
        FormAnchorBtn_default,
        {
          href: "/login",
          className: "ml-3",
          isSubmitting,
          children: "Cancel"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.register.tsx",
          lineNumber: 151,
          columnNumber: 15
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/users.register.tsx",
      lineNumber: 147,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/users.register.tsx",
    lineNumber: 78,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/routes/users.register.tsx",
    lineNumber: 77,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/users.register.tsx",
    lineNumber: 76,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/users.register.tsx",
    lineNumber: 75,
    columnNumber: 5
  }, this);
}

// app/routes/quotes._index.tsx
var quotes_index_exports = {};
__export(quotes_index_exports, {
  default: () => QuotesIndex,
  loader: () => loader4,
  meta: () => meta3
});
var import_node7 = require("@remix-run/node"), import_react9 = require("@remix-run/react");
var import_jsx_dev_runtime11 = require("react/jsx-dev-runtime"), meta3 = () => [{ title: `${SITE_TITLE} - Quotes` }], loader4 = async ({ request }) => {
  if (!await getUserId(request))
    return (0, import_node7.redirect)("/login");
  try {
    let quotes = await db.quotes.findMany({
      include: {
        customer: !0,
        quoted_products: !0
      }
    });
    return (0, import_node7.json)({ quotes });
  } catch (err) {
    return console.error(err), {};
  }
}, prettifyDateString2 = (dateString) => new Date(dateString).toDateString();
function QuotesIndex() {
  let { quotes } = (0, import_react9.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(import_jsx_dev_runtime11.Fragment, { children: [
    quotes && quotes.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("table", { className: "table static", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("tr", { className: "hidden md:table-row", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("th", { children: "ID" }, void 0, !1, {
          fileName: "app/routes/quotes._index.tsx",
          lineNumber: 56,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("th", { children: "Date" }, void 0, !1, {
          fileName: "app/routes/quotes._index.tsx",
          lineNumber: 57,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("th", { children: "Customer" }, void 0, !1, {
          fileName: "app/routes/quotes._index.tsx",
          lineNumber: 58,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("th", { children: "Amount (\xA3)" }, void 0, !1, {
          fileName: "app/routes/quotes._index.tsx",
          lineNumber: 59,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("th", { children: "Actions" }, void 0, !1, {
          fileName: "app/routes/quotes._index.tsx",
          lineNumber: 60,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/quotes._index.tsx",
        lineNumber: 55,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/quotes._index.tsx",
        lineNumber: 54,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("tbody", { children: quotes && quotes.map(
        ({
          quote_id,
          createdAt,
          customer,
          quoted_products,
          labour
        }) => /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("tr", { className: resTRClass, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("td", { "data-label": "ID", className: resTDClass, children: quote_id }, void 0, !1, {
            fileName: "app/routes/quotes._index.tsx",
            lineNumber: 75,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("td", { "data-label": "Date", className: resTDClass, children: prettifyDateString2(createdAt) }, void 0, !1, {
            fileName: "app/routes/quotes._index.tsx",
            lineNumber: 78,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("td", { "data-label": "Customer", className: resTDClass, children: customer.name }, void 0, !1, {
            fileName: "app/routes/quotes._index.tsx",
            lineNumber: 81,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("td", { "data-label": "Amount (\xA3)", className: resTDClass, children: quoted_products.reduce(
            (partialSum, qp) => partialSum + qp.price * qp.quantity,
            0
          ) + labour }, void 0, !1, {
            fileName: "app/routes/quotes._index.tsx",
            lineNumber: 84,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("td", { "data-label": "Actions", className: resTDClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "btn-group", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(FormAnchorBtn_default, { href: `quotes/${quote_id}`, children: "View" }, void 0, !1, {
              fileName: "app/routes/quotes._index.tsx",
              lineNumber: 93,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(FormBtn_default, { children: "Delete" }, void 0, !1, {
              fileName: "app/routes/quotes._index.tsx",
              lineNumber: 96,
              columnNumber: 27
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/quotes._index.tsx",
            lineNumber: 92,
            columnNumber: 25
          }, this) }, void 0, !1, {
            fileName: "app/routes/quotes._index.tsx",
            lineNumber: 91,
            columnNumber: 23
          }, this)
        ] }, quote_id, !0, {
          fileName: "app/routes/quotes._index.tsx",
          lineNumber: 74,
          columnNumber: 21
        }, this)
      ) }, void 0, !1, {
        fileName: "app/routes/quotes._index.tsx",
        lineNumber: 63,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/quotes._index.tsx",
      lineNumber: 53,
      columnNumber: 9
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("p", { children: "No quotes found..." }, void 0, !1, {
      fileName: "app/routes/quotes._index.tsx",
      lineNumber: 106,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(FormAnchorBtn_default, { href: "/quotes/create", children: "Add new quote +" }, void 0, !1, {
      fileName: "app/routes/quotes._index.tsx",
      lineNumber: 109,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/quotes._index.tsx",
      lineNumber: 108,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/quotes._index.tsx",
    lineNumber: 51,
    columnNumber: 5
  }, this);
}

// app/routes/quotes.create.tsx
var quotes_create_exports = {};
__export(quotes_create_exports, {
  action: () => action3,
  default: () => QuotesCreate,
  loader: () => loader5,
  meta: () => meta4
});
var import_node8 = require("@remix-run/node"), import_react14 = require("@remix-run/react"), import_react15 = require("react");

// app/components/CreateCustomerForm.tsx
var import_react10 = require("@remix-run/react");
var import_jsx_dev_runtime12 = require("react/jsx-dev-runtime"), CreateCustomerForm = ({
  navigation,
  formErrors,
  onCancel,
  actionName
}) => {
  let isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(import_react10.Form, { replace: !0, method: "post", className: formClass, children: [
    formErrors && formErrors.info && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "label-text-alt text-error", children: formErrors.info }, void 0, !1, {
      fileName: "app/components/CreateCustomerForm.tsx",
      lineNumber: 22,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/components/CreateCustomerForm.tsx",
      lineNumber: 21,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("fieldset", { disabled: isSubmitting, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: "label", htmlFor: "name", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "label-text", children: "Name" }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 28,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 27,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(
          "input",
          {
            className: inputClass,
            id: "name",
            name: "name",
            type: "text",
            placeholder: "John Smith"
          },
          void 0,
          !1,
          {
            fileName: "app/components/CreateCustomerForm.tsx",
            lineNumber: 30,
            columnNumber: 11
          },
          this
        ),
        formErrors && formErrors.name && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "label-text-alt text-error", children: formErrors.name }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 39,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 38,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/CreateCustomerForm.tsx",
        lineNumber: 26,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: "label", htmlFor: "tel", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "label-text", children: "Tel" }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 47,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 46,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(
          "input",
          {
            className: inputClass,
            id: "tel",
            name: "tel",
            type: "text",
            placeholder: "07123456789"
          },
          void 0,
          !1,
          {
            fileName: "app/components/CreateCustomerForm.tsx",
            lineNumber: 49,
            columnNumber: 11
          },
          this
        ),
        formErrors && formErrors.tel && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "label-text-alt text-error", children: formErrors.tel }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 58,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 57,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/CreateCustomerForm.tsx",
        lineNumber: 45,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: "label", htmlFor: "email", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "label-text", children: "Email" }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 66,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 65,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(
          "input",
          {
            className: inputClass,
            id: "email",
            name: "email",
            type: "text",
            placeholder: "john@example.com"
          },
          void 0,
          !1,
          {
            fileName: "app/components/CreateCustomerForm.tsx",
            lineNumber: 68,
            columnNumber: 11
          },
          this
        ),
        formErrors && formErrors.email && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "label-text-alt text-error", children: formErrors.email }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 77,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 76,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/CreateCustomerForm.tsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: "label", htmlFor: "address", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "label-text", children: "Address" }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 85,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 84,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(
          "textarea",
          {
            className: "textarea textarea-bordered w-full block bg-base-200",
            id: "address",
            name: "address",
            placeholder: "123 somewhere st, somehwere, S03 3EW"
          },
          void 0,
          !1,
          {
            fileName: "app/components/CreateCustomerForm.tsx",
            lineNumber: 87,
            columnNumber: 11
          },
          this
        ),
        formErrors && formErrors.address && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "label-text-alt text-error", children: formErrors.address }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 95,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/components/CreateCustomerForm.tsx",
          lineNumber: 94,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/CreateCustomerForm.tsx",
        lineNumber: 83,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex justify-end mt-4 mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(
          FormBtn_default,
          {
            type: "submit",
            name: "_action",
            value: actionName,
            isSubmitting,
            children: "Submit"
          },
          void 0,
          !1,
          {
            fileName: "app/components/CreateCustomerForm.tsx",
            lineNumber: 102,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(
          FormBtn_default,
          {
            className: "ml-4",
            isSubmitting,
            onClick: (e) => {
              e.preventDefault(), onCancel();
            },
            children: "Cancel"
          },
          void 0,
          !1,
          {
            fileName: "app/components/CreateCustomerForm.tsx",
            lineNumber: 110,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/components/CreateCustomerForm.tsx",
        lineNumber: 101,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/CreateCustomerForm.tsx",
      lineNumber: 25,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/CreateCustomerForm.tsx",
    lineNumber: 19,
    columnNumber: 5
  }, this);
}, CreateCustomerForm_default = CreateCustomerForm;

// app/components/CreateProductForm.tsx
var import_react11 = require("@remix-run/react"), import_classnames4 = __toESM(require("classnames")), import_react12 = require("react");
var import_jsx_dev_runtime13 = require("react/jsx-dev-runtime"), TaxonomyField = ({
  taxoName,
  taxoItems,
  inputError
}) => {
  let hasItems = (taxoItems == null ? void 0 : taxoItems.length) > 0, [isNewTaxoItem, setIsNewTaxoItem] = (0, import_react12.useState)(!hasItems), [taxoSelectValue, setTaxoSelectValue] = (0, import_react12.useState)(""), taxoInputClass = (0, import_classnames4.default)({
    [inputClass]: !0,
    "mt-2": isNewTaxoItem,
    hidden: !isNewTaxoItem
  });
  return (0, import_react12.useEffect)(() => {
    setIsNewTaxoItem(taxoSelectValue === "-1");
  }, [taxoSelectValue]), /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "mb-2", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
      "label",
      {
        className: "label",
        htmlFor: isNewTaxoItem ? `new${taxoName}` : taxoName,
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { className: "label-text", children: [
          "Product ",
          taxoName
        ] }, void 0, !0, {
          fileName: "app/components/CreateProductForm.tsx",
          lineNumber: 42,
          columnNumber: 9
        }, this)
      },
      void 0,
      !1,
      {
        fileName: "app/components/CreateProductForm.tsx",
        lineNumber: 38,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
      "select",
      {
        className: selectClass,
        name: taxoName,
        id: taxoName,
        value: taxoSelectValue,
        onChange: (e) => {
          setTaxoSelectValue(e.target.value);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("option", { disabled: !0, value: "", children: [
            "Select a ",
            taxoName,
            "..."
          ] }, void 0, !0, {
            fileName: "app/components/CreateProductForm.tsx",
            lineNumber: 53,
            columnNumber: 9
          }, this),
          hasItems && taxoItems.map((taxoItem) => /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
            "option",
            {
              value: taxoItem[`${taxoName}_id`],
              children: taxoItem[`${taxoName}_name`]
            },
            taxoItem[`${taxoName}_id`],
            !1,
            {
              fileName: "app/components/CreateProductForm.tsx",
              lineNumber: 59,
              columnNumber: 15
            },
            this
          )),
          /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("option", { value: "-1", children: [
            "Add new ",
            taxoName,
            " +"
          ] }, void 0, !0, {
            fileName: "app/components/CreateProductForm.tsx",
            lineNumber: 67,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/components/CreateProductForm.tsx",
        lineNumber: 44,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
      "input",
      {
        disabled: !isNewTaxoItem,
        className: taxoInputClass,
        id: `new${taxoName}`,
        name: `new${taxoName}`,
        type: "text",
        placeholder: `Defined new ${taxoName} here...`
      },
      void 0,
      !1,
      {
        fileName: "app/components/CreateProductForm.tsx",
        lineNumber: 69,
        columnNumber: 7
      },
      this
    ),
    inputError && inputError[taxoName] && /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { className: "label-text-alt text-error", children: inputError[taxoName] }, void 0, !1, {
      fileName: "app/components/CreateProductForm.tsx",
      lineNumber: 79,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/components/CreateProductForm.tsx",
      lineNumber: 78,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/CreateProductForm.tsx",
    lineNumber: 37,
    columnNumber: 5
  }, this);
}, CreateProductForm = ({
  selectData,
  navigation,
  formErrors,
  onCancel,
  actionName
}) => {
  let { brands, models, types } = selectData, isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(import_react11.Form, { replace: !0, method: "post", className: formClass, children: [
    formErrors && formErrors.info && /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { className: "label-text-alt text-error", children: formErrors.info }, void 0, !1, {
      fileName: "app/components/CreateProductForm.tsx",
      lineNumber: 111,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/components/CreateProductForm.tsx",
      lineNumber: 110,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("fieldset", { disabled: isSubmitting, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
        TaxonomyField,
        {
          taxoName: "brand",
          taxoItems: brands,
          inputError: formErrors
        },
        void 0,
        !1,
        {
          fileName: "app/components/CreateProductForm.tsx",
          lineNumber: 116,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
        TaxonomyField,
        {
          taxoName: "type",
          taxoItems: types,
          inputError: formErrors
        },
        void 0,
        !1,
        {
          fileName: "app/components/CreateProductForm.tsx",
          lineNumber: 121,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
        TaxonomyField,
        {
          taxoName: "model",
          taxoItems: models,
          inputError: formErrors
        },
        void 0,
        !1,
        {
          fileName: "app/components/CreateProductForm.tsx",
          lineNumber: 126,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("label", { className: "label", htmlFor: "price", children: /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { className: "label-text", children: "Product price (\xA3)" }, void 0, !1, {
          fileName: "app/components/CreateProductForm.tsx",
          lineNumber: 133,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/components/CreateProductForm.tsx",
          lineNumber: 132,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
          "input",
          {
            className: inputClass,
            id: "price",
            name: "price",
            type: "number",
            placeholder: "10.00"
          },
          void 0,
          !1,
          {
            fileName: "app/components/CreateProductForm.tsx",
            lineNumber: 135,
            columnNumber: 11
          },
          this
        ),
        formErrors && formErrors.price && /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { className: "label-text-alt text-error", children: formErrors.price }, void 0, !1, {
          fileName: "app/components/CreateProductForm.tsx",
          lineNumber: 144,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/components/CreateProductForm.tsx",
          lineNumber: 143,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/CreateProductForm.tsx",
        lineNumber: 131,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "flex justify-end mt-4 mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
          FormBtn_default,
          {
            type: "submit",
            name: "_action",
            value: actionName,
            isSubmitting,
            children: "Submit"
          },
          void 0,
          !1,
          {
            fileName: "app/components/CreateProductForm.tsx",
            lineNumber: 151,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
          FormBtn_default,
          {
            className: "ml-4",
            isSubmitting,
            onClick: (e) => {
              e.preventDefault(), onCancel();
            },
            children: "Cancel"
          },
          void 0,
          !1,
          {
            fileName: "app/components/CreateProductForm.tsx",
            lineNumber: 159,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/components/CreateProductForm.tsx",
        lineNumber: 150,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/CreateProductForm.tsx",
      lineNumber: 115,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/CreateProductForm.tsx",
    lineNumber: 108,
    columnNumber: 5
  }, this);
}, CreateProductForm_default = CreateProductForm;

// app/components/QuoteProductRow.tsx
var import_react13 = require("react");
var import_jsx_dev_runtime14 = require("react/jsx-dev-runtime"), QuoteProductRow = ({
  rowId,
  products,
  productSelectValues,
  dispatchPSV
}) => {
  let [qty, setQty] = (0, import_react13.useState)(1), [unitPrice, setUnitPrice] = (0, import_react13.useState)(0), [subtotal, setSubtotal] = (0, import_react13.useState)(0), [productSelectValue, setProductSelectValue] = (0, import_react13.useState)("");
  (0, import_react13.useEffect)(() => {
    setSubtotal(Number(unitPrice * qty));
  }, [qty, unitPrice]), (0, import_react13.useEffect)(() => {
    let currPSV = productSelectValues.find((p) => p.row_id === rowId);
    currPSV && (setProductSelectValue(currPSV.product_id), setQty(currPSV.qty), setUnitPrice(currPSV.price));
  }, [productSelectValues, rowId]);
  let handleSelect = (row_id, product_id) => {
    let selectedProd = products.find(
      (product) => parseInt(product_id) === product.product_id
    );
    dispatchPSV({
      type: "update",
      row_id,
      product_id,
      qty: 1,
      price: selectedProd ? selectedProd.price : 0
    });
  }, handleQtyInput = (row_id, qty2) => {
    dispatchPSV({ type: "update", row_id, qty: qty2 });
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("tr", { className: resTRClass, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(
      "td",
      {
        colSpan: productSelectValue ? 1 : 4,
        "data-label": "Product",
        className: resTDClass,
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(
          "select",
          {
            className: selectClass,
            name: `p_${rowId}_id`,
            id: `p_${rowId}_id`,
            value: productSelectValue,
            onChange: (e) => {
              handleSelect(rowId, e.target.value);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("option", { disabled: !0, value: "", children: "Select a product..." }, void 0, !1, {
                fileName: "app/components/QuoteProductRow.tsx",
                lineNumber: 72,
                columnNumber: 11
              }, this),
              products.map(({ product_id, brand_name, type_name, model_name }) => /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("option", { value: product_id, children: [
                brand_name,
                " - ",
                type_name,
                " - ",
                model_name
              ] }, product_id, !0, {
                fileName: "app/components/QuoteProductRow.tsx",
                lineNumber: 77,
                columnNumber: 15
              }, this)),
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("option", { value: "-1", children: "Add new product +" }, void 0, !1, {
                fileName: "app/components/QuoteProductRow.tsx",
                lineNumber: 82,
                columnNumber: 11
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/components/QuoteProductRow.tsx",
            lineNumber: 63,
            columnNumber: 9
          },
          this
        )
      },
      void 0,
      !1,
      {
        fileName: "app/components/QuoteProductRow.tsx",
        lineNumber: 58,
        columnNumber: 7
      },
      this
    ),
    productSelectValue && /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(import_jsx_dev_runtime14.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("td", { "data-label": "Quantity", className: resTDClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(
        "input",
        {
          className: inputClass,
          name: `p_${rowId}_qty`,
          id: `p_${rowId}_qty`,
          type: "number",
          min: "1",
          value: qty,
          onChange: (e) => {
            handleQtyInput(rowId, parseInt(e.target.value));
          }
        },
        void 0,
        !1,
        {
          fileName: "app/components/QuoteProductRow.tsx",
          lineNumber: 88,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/components/QuoteProductRow.tsx",
        lineNumber: 87,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("td", { "data-label": "Unit (\xA3)", className: `${resTDClass} md:text-right`, children: unitPrice || " - " }, void 0, !1, {
        fileName: "app/components/QuoteProductRow.tsx",
        lineNumber: 100,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(
        "td",
        {
          "data-label": "Subtotal (\xA3)",
          className: `${resTDClass} md:text-right`,
          children: subtotal || " - "
        },
        void 0,
        !1,
        {
          fileName: "app/components/QuoteProductRow.tsx",
          lineNumber: 103,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/components/QuoteProductRow.tsx",
      lineNumber: 86,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/QuoteProductRow.tsx",
    lineNumber: 57,
    columnNumber: 5
  }, this);
}, QuoteProductRow_default = QuoteProductRow;

// app/routes/quotes.create.tsx
var import_jsx_dev_runtime15 = require("react/jsx-dev-runtime"), meta4 = () => [{ title: `${SITE_TITLE} - Create quote` }], loader5 = async ({ request }) => {
  if (!await getUserId(request))
    return (0, import_node8.redirect)("/login");
  try {
    let [brands, types, models, customers, products] = await Promise.all([
      db.product_brands.findMany(),
      db.product_types.findMany(),
      db.product_models.findMany(),
      db.customers.findMany(),
      db.products.findMany()
    ]);
    return (0, import_node8.json)({ brands, types, models, customers, products });
  } catch (err) {
    return console.error(err), {};
  }
};
async function action3({ request }) {
  let formData = await request.formData(), { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "create_customer":
      let { name, tel, email, address } = values, customerActionErrors = validateCustomerData(values);
      if (Object.values(customerActionErrors).some(Boolean))
        return { customerActionErrors };
      try {
        return { createdCustomer: await createCustomer(
          `${name}`,
          `${tel}`,
          `${email}`,
          `${address}`
        ) };
      } catch (error) {
        return console.log({ error }), customerActionErrors.info = "There was a problem creating the customer...", { customerActionErrors };
      }
    case "create_product":
      let { brand, newbrand, type, newtype, model, newmodel, price } = values, productActionErrors = validateProductData(values);
      if (Object.values(productActionErrors).some(Boolean))
        return { productActionErrors };
      try {
        return { createdProduct: await createProduct(
          `${brand}`,
          `${newbrand}`,
          `${type}`,
          `${newtype}`,
          `${model}`,
          `${newmodel}`,
          `${price}`
        ) };
      } catch (error) {
        return console.log({ error }), productActionErrors.info = "There was a problem creating the product...", { productActionErrors };
      }
    case "create_quote":
      let { customer, labour, prodcount, ...productValues } = values, quoteActionErrors = {};
      if (customer || (quoteActionErrors.customer = "you must select or define a customer!"), Object.keys(productValues).length === 0 && (quoteActionErrors.product = "you must select or define at least one product!"), Object.values(quoteActionErrors).some(Boolean))
        return { quoteActionErrors };
      let prodPromiseCollection = [];
      [...Array(parseInt(`${prodcount}`))].forEach((e, i) => {
        let product_id = parseInt(productValues[`p_${i + 1}_id`]);
        if (!product_id)
          return !0;
        prodPromiseCollection.push(
          db.products.findUnique({
            where: { product_id },
            include: {
              brand: !0,
              model: !0,
              type: !0
            }
          })
        );
      });
      let retrievedSelectedProds = [];
      try {
        retrievedSelectedProds = await Promise.all(prodPromiseCollection);
      } catch (error) {
        return console.log({ error }), quoteActionErrors.info = "there was a problem saving the quote, please try again later", { quoteActionErrors };
      }
      let quotedProducts = retrievedSelectedProds.map((product, i) => {
        let { brand_name, model_name, type_name, price: price2 } = product, quantity = parseInt(productValues[`p_${i + 1}_qty`]);
        return {
          name: `${brand_name} - ${type_name} - ${model_name}`,
          quantity,
          price: price2
        };
      }), newQuote = {
        customer: {
          connect: {
            customer_id: parseInt(`${customer}`)
          }
        },
        quoted_products: {
          createMany: {
            data: quotedProducts
          }
        },
        labour: Number(`${labour}`)
      };
      try {
        return await db.quotes.create({ data: newQuote }), (0, import_node8.redirect)("/quotes");
      } catch (error) {
        return console.log({ error }), quoteActionErrors.info = "there was a problem saving the quote, please try again later", { quoteActionErrors };
      }
  }
  return {};
}
function QuotesCreate() {
  var _a, _b, _c;
  let navigation = (0, import_react14.useNavigation)(), {
    customers,
    products,
    brands,
    types,
    models
  } = (0, import_react14.useLoaderData)(), data = (0, import_react14.useActionData)(), isSubmitting = navigation.state === "submitting", [isNewCustomer, setIsNewCustomer] = (0, import_react15.useState)(!1), [customerSelectValue, setCustomerSelectValue] = (0, import_react15.useState)(""), [productCount, setProductCount] = (0, import_react15.useState)(1), [labour, setLabour] = (0, import_react15.useState)(0), [grandtotal, setGrandtotal] = (0, import_react15.useState)(0), [newProductRow, setNewProductRow] = (0, import_react15.useState)(0), [isNewProduct, setIsNewProduct] = (0, import_react15.useState)(!1), [productSelectValues, dispatchPSV] = (0, import_react15.useReducer)(
    (state, action9) => {
      let { type, ...values } = action9;
      switch (type) {
        case "update":
          return values.product_id === "-1" ? (setNewProductRow(values.row_id), setIsNewProduct(!0)) : (setNewProductRow(0), setIsNewProduct(!1)), state.map((psv) => psv.row_id === values.row_id ? { ...psv, ...values } : { ...psv });
        case "add":
          return Boolean(
            state.find((psv) => psv.row_id === values.row_id)
          ) ? state : [...state, { ...values }];
        case "remove":
          return state.filter((psv) => psv.row_id !== values.row_id);
        default:
          return state;
      }
    },
    [{ row_id: "1", product_id: "", qty: 1, price: 0 }]
  );
  return (0, import_react15.useEffect)(() => {
    setGrandtotal(
      productSelectValues.reduce(
        (partialSum, a) => partialSum + a.price * a.qty,
        0
      ) + labour
    );
  }, [productSelectValues, labour]), (0, import_react15.useEffect)(() => {
    setIsNewCustomer(customerSelectValue === "-1");
  }, [customerSelectValue]), (0, import_react15.useEffect)(() => {
    data && (data.createdCustomer && setCustomerSelectValue(`${data.createdCustomer.customer_id}`), data.createdProduct && dispatchPSV({
      type: "update",
      row_id: newProductRow,
      product_id: `${data.createdProduct.product_id}`
    }));
  }, [data, newProductRow]), /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("h2", { className: "mb-4 text-center", children: "Create a new quote" }, void 0, !1, {
      fileName: "app/routes/quotes.create.tsx",
      lineNumber: 277,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(import_react14.Form, { method: "post", className: formClass, children: [
      ((_a = data == null ? void 0 : data.quoteActionErrors) == null ? void 0 : _a.info) && /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("span", { className: "label-text-alt text-error", children: data.quoteActionErrors.info }, void 0, !1, {
        fileName: "app/routes/quotes.create.tsx",
        lineNumber: 281,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/quotes.create.tsx",
        lineNumber: 280,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
        "input",
        {
          type: "hidden",
          name: "prodcount",
          id: "prodcount",
          value: productCount
        },
        void 0,
        !1,
        {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 286,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("fieldset", { disabled: isSubmitting, children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("label", { className: "label", htmlFor: "customer", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("span", { className: "label-text", children: "Customer" }, void 0, !1, {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 295,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 294,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
          "select",
          {
            className: selectClass,
            name: "customer",
            id: "customer",
            value: customerSelectValue,
            onChange: (e) => {
              setCustomerSelectValue(e.target.value);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("option", { disabled: !0, value: "", children: "Select a customer..." }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 306,
                columnNumber: 15
              }, this),
              customers.map(
                ({ customer_id, name, tel, email, address }) => /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("option", { value: customer_id, children: [
                  name,
                  " - ",
                  tel,
                  " - ",
                  email,
                  " - ",
                  address
                ] }, customer_id, !0, {
                  fileName: "app/routes/quotes.create.tsx",
                  lineNumber: 312,
                  columnNumber: 21
                }, this)
              ),
              /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("option", { value: "-1", children: "Add new customer +" }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 318,
                columnNumber: 15
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/quotes.create.tsx",
            lineNumber: 297,
            columnNumber: 13
          },
          this
        ),
        ((_b = data == null ? void 0 : data.quoteActionErrors) == null ? void 0 : _b.customer) && /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("span", { className: "label-text-alt text-error", children: data.quoteActionErrors.customer }, void 0, !1, {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 322,
          columnNumber: 17
        }, this) }, void 0, !1, {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 321,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/quotes.create.tsx",
        lineNumber: 293,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/routes/quotes.create.tsx",
        lineNumber: 292,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("fieldset", { disabled: isSubmitting, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("span", { className: "label-text", children: "Products" }, void 0, !1, {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 331,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 330,
          columnNumber: 11
        }, this),
        ((_c = data == null ? void 0 : data.quoteActionErrors) == null ? void 0 : _c.product) && /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("span", { className: "label-text-alt text-error", children: data.quoteActionErrors.product }, void 0, !1, {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 335,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 334,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("table", { className: "table", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("tr", { className: "hidden md:table-row", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("th", { children: "Product" }, void 0, !1, {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 343,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("th", { className: "w-[100px]", children: "Quantity" }, void 0, !1, {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 344,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("th", { className: "text-right w-[150px]", children: "Unit (\xA3)" }, void 0, !1, {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 345,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("th", { className: "text-right w-[150px]", children: "Subtotal (\xA3)" }, void 0, !1, {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 346,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/quotes.create.tsx",
            lineNumber: 342,
            columnNumber: 15
          }, this) }, void 0, !1, {
            fileName: "app/routes/quotes.create.tsx",
            lineNumber: 341,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("tbody", { children: [
            [...Array(productCount)].map((e, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
              QuoteProductRow_default,
              {
                rowId: `${i + 1}`,
                products,
                productSelectValues,
                dispatchPSV
              },
              i,
              !1,
              {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 351,
                columnNumber: 17
              },
              this
            )),
            /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("tr", { className: resTRClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("td", { colSpan: 4, children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "flex md:justify-end btn-group", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
                FormBtn_default,
                {
                  disabled: productCount === 1,
                  isSubmitting,
                  onClick: (e) => {
                    e.preventDefault(), setProductCount((pCount) => (dispatchPSV({
                      type: "remove",
                      row_id: `${pCount}`
                    }), pCount - 1));
                  },
                  children: "-"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/quotes.create.tsx",
                  lineNumber: 362,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
                FormBtn_default,
                {
                  isSubmitting,
                  onClick: (e) => {
                    e.preventDefault(), setProductCount((pCount) => (dispatchPSV({
                      type: "add",
                      row_id: `${pCount + 1}`,
                      product_id: "",
                      qty: 1,
                      price: 0
                    }), pCount + 1));
                  },
                  children: "+"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/quotes.create.tsx",
                  lineNumber: 378,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, !0, {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 361,
              columnNumber: 19
            }, this) }, void 0, !1, {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 360,
              columnNumber: 17
            }, this) }, void 0, !1, {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 359,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("tr", { className: resTRClass, children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("td", { colSpan: 2, className: "hidden md:table-cell" }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 400,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("td", { className: "flex md:table-cell", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("label", { className: "label md:justify-end", htmlFor: "labour", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("span", { className: "label-text", children: "Labour cost (\xA3):" }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 403,
                columnNumber: 21
              }, this) }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 402,
                columnNumber: 19
              }, this) }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 401,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("td", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
                "input",
                {
                  type: "number",
                  min: "0",
                  name: "labour",
                  id: "labour",
                  value: labour,
                  className: `${inputClass} md:text-right`,
                  onChange: (e) => {
                    setLabour(parseInt(e.target.value));
                  }
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/quotes.create.tsx",
                  lineNumber: 407,
                  columnNumber: 19
                },
                this
              ) }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 406,
                columnNumber: 17
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 399,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("tr", { className: resTRClass, children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("td", { colSpan: 2, className: "hidden md:table-cell" }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 421,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("td", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("label", { className: "label md:justify-end", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("span", { className: "label-text", children: "Total cost (\xA3):" }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 424,
                columnNumber: 21
              }, this) }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 423,
                columnNumber: 19
              }, this) }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 422,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("td", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("label", { className: "label md:justify-end", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("span", { className: "label-text", children: grandtotal }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 429,
                columnNumber: 21
              }, this) }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 428,
                columnNumber: 19
              }, this) }, void 0, !1, {
                fileName: "app/routes/quotes.create.tsx",
                lineNumber: 427,
                columnNumber: 17
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 420,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/quotes.create.tsx",
            lineNumber: 349,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 340,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "flex md:justify-end mt-4 mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
            FormBtn_default,
            {
              type: "submit",
              name: "_action",
              value: "create_quote",
              isSubmitting,
              children: "Submit"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 436,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
            FormAnchorBtn_default,
            {
              className: "ml-4",
              href: "/quotes",
              isSubmitting,
              children: "Cancel"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/quotes.create.tsx",
              lineNumber: 444,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 435,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/quotes.create.tsx",
        lineNumber: 329,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.create.tsx",
      lineNumber: 278,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Modal_default, { open: isNewCustomer, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("h3", { className: "mb-4", children: "Create new customer" }, void 0, !1, {
        fileName: "app/routes/quotes.create.tsx",
        lineNumber: 455,
        columnNumber: 9
      }, this),
      isNewCustomer && /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
        CreateCustomerForm_default,
        {
          actionName: "create_customer",
          navigation,
          formErrors: data == null ? void 0 : data.customerActionErrors,
          onCancel: () => {
            setCustomerSelectValue(""), data && (data.customerActionErrors = {});
          }
        },
        void 0,
        !1,
        {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 457,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.create.tsx",
      lineNumber: 454,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Modal_default, { open: isNewProduct, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("h3", { className: "mb-4", children: "Create new product" }, void 0, !1, {
        fileName: "app/routes/quotes.create.tsx",
        lineNumber: 469,
        columnNumber: 9
      }, this),
      isNewProduct && /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
        CreateProductForm_default,
        {
          actionName: "create_product",
          selectData: { brands, types, models },
          navigation,
          formErrors: data == null ? void 0 : data.productActionErrors,
          onCancel: () => {
            dispatchPSV({
              type: "update",
              row_id: newProductRow,
              product_id: ""
            }), data && (data.productActionErrors = {});
          }
        },
        void 0,
        !1,
        {
          fileName: "app/routes/quotes.create.tsx",
          lineNumber: 471,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/quotes.create.tsx",
      lineNumber: 468,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/quotes.create.tsx",
    lineNumber: 276,
    columnNumber: 5
  }, this);
}

// app/routes/users.$userid.tsx
var users_userid_exports = {};
__export(users_userid_exports, {
  action: () => action4,
  default: () => UserId,
  loader: () => loader6,
  meta: () => meta5
});
var import_node9 = require("@remix-run/node"), import_react16 = require("@remix-run/react"), import_bcryptjs2 = __toESM(require("bcryptjs")), import_react17 = require("react");
var import_jsx_dev_runtime16 = require("react/jsx-dev-runtime"), meta5 = () => [{ title: `${SITE_TITLE} - Change user details` }], loader6 = async ({ request }) => await getUserId(request) ? {} : (0, import_node9.redirect)("/login");
async function action4({ request, params }) {
  let formData = await request.formData(), fname = formData.get("firstname"), lname = formData.get("lastname"), email = formData.get("email"), ropassword = formData.get("opassword"), rnpassword = formData.get("npassword"), formErrors = {
    fname: validateFname(fname),
    lname: validateLname(lname),
    email: validateEmail(email),
    opassword: validatePassword(ropassword),
    npassword: void 0
  };
  if (Object.values(formErrors).some(Boolean))
    return { formErrors };
  let user = await getUserByEmail(email);
  if (user ? await import_bcryptjs2.default.compare(
    ropassword,
    `${user.password}`
  ) || (formErrors.opassword = "Invalid password!") : formErrors.opassword = "user not found, unable to verify password!", Object.values(formErrors).some(Boolean))
    return { formErrors };
  let newpassword;
  if (rnpassword && rnpassword.length) {
    if (formErrors.npassword = validatePassword(rnpassword), Object.values(formErrors).some(Boolean))
      return { formErrors };
    newpassword = await import_bcryptjs2.default.hash(rnpassword, 10);
  }
  let { userid } = params, id = userid;
  if (await db.users.update({
    where: {
      id: parseInt(id)
    },
    data: {
      firstName: fname,
      lastName: lname,
      email,
      ...newpassword && { password: newpassword },
      updatedAt: /* @__PURE__ */ new Date()
    }
  }))
    return (0, import_node9.redirect)("/users");
  console.log("err:", "failed to update the user");
}
function UserId() {
  let user = (0, import_react17.useContext)(UserContext), navigation = (0, import_react16.useNavigation)(), data = (0, import_react16.useActionData)(), isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "grid place-items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_react16.Form, { method: "post", className: "bg-base-300 px-4 py-2 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("fieldset", { disabled: isSubmitting, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("label", { className: "label", htmlFor: "firstname", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "label-text", children: "First name" }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 115,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 114,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
        "input",
        {
          className: "input input-bordered w-full max-w-xs",
          id: "firstname",
          name: "firstname",
          type: "text",
          placeholder: user.firstName
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.$userid.tsx",
          lineNumber: 117,
          columnNumber: 15
        },
        this
      ),
      data && data.formErrors && data.formErrors.fname && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.fname }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 125,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/users.$userid.tsx",
      lineNumber: 113,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("label", { className: "label", htmlFor: "lastname", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "label-text", children: "Last name" }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 132,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 131,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
        "input",
        {
          className: "input input-bordered w-full max-w-xs",
          id: "lastname",
          name: "lastname",
          type: "text",
          placeholder: user.lastName
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.$userid.tsx",
          lineNumber: 134,
          columnNumber: 15
        },
        this
      ),
      data && data.formErrors && data.formErrors.lname && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.lname }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 142,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/users.$userid.tsx",
      lineNumber: 130,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("label", { className: "label", htmlFor: "email", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "label-text", children: "Email" }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 149,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 148,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("input", { type: "hidden", name: "email", value: user.email }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 151,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
        "input",
        {
          className: "input input-bordered w-full max-w-xs",
          type: "text",
          placeholder: user.email,
          disabled: !0
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.$userid.tsx",
          lineNumber: 152,
          columnNumber: 15
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/users.$userid.tsx",
      lineNumber: 147,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("label", { className: "label", htmlFor: "opassword", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "label-text", children: "Original password" }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 161,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 160,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
        "input",
        {
          className: "input input-bordered w-full max-w-xs",
          id: "opassword",
          name: "opassword",
          type: "password",
          placeholder: "******************"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.$userid.tsx",
          lineNumber: 163,
          columnNumber: 15
        },
        this
      ),
      data && data.formErrors && data.formErrors.opassword && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.opassword }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 171,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/users.$userid.tsx",
      lineNumber: 159,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("label", { className: "label", htmlFor: "npassword", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "label-text", children: "New password" }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 178,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 177,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
        "input",
        {
          className: "input input-bordered w-full max-w-xs",
          id: "npassword",
          name: "npassword",
          type: "password",
          placeholder: "******************"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.$userid.tsx",
          lineNumber: 180,
          columnNumber: 15
        },
        this
      ),
      data && data.formErrors && data.formErrors.npassword && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.npassword }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 188,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/users.$userid.tsx",
      lineNumber: 176,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "mt-6 mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(FormBtn_default, { type: "submit", isSubmitting, children: "Submit" }, void 0, !1, {
        fileName: "app/routes/users.$userid.tsx",
        lineNumber: 194,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
        FormAnchorBtn_default,
        {
          href: "/users",
          className: "ml-3",
          isSubmitting,
          children: "Cancel"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/users.$userid.tsx",
          lineNumber: 197,
          columnNumber: 15
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/users.$userid.tsx",
      lineNumber: 193,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/users.$userid.tsx",
    lineNumber: 112,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/routes/users.$userid.tsx",
    lineNumber: 111,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/users.$userid.tsx",
    lineNumber: 110,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/users.$userid.tsx",
    lineNumber: 109,
    columnNumber: 5
  }, this);
}

// app/routes/users._index.tsx
var users_index_exports = {};
__export(users_index_exports, {
  action: () => action5,
  default: () => UsersIndex,
  loader: () => loader7,
  meta: () => meta6
});
var import_node10 = require("@remix-run/node"), import_react18 = require("@remix-run/react"), import_react19 = require("react");
var import_jsx_dev_runtime17 = require("react/jsx-dev-runtime"), meta6 = () => [{ title: `${SITE_TITLE} - Users` }], loader7 = async ({ request }) => {
  let uid = await getUserId(request);
  if (!uid)
    return (0, import_node10.redirect)("/login");
  let user = await getUserById(uid);
  if (!(user != null && user.isAdmin))
    return (0, import_node10.redirect)(`/users/${uid}`);
  try {
    let users = {};
    return users = await db.users.findMany(), (0, import_node10.json)({ users });
  } catch (err) {
    return console.error(err), {};
  }
};
async function action5({ request }) {
  let formData = await request.formData(), deleteUserId = formData.get("uid"), approvedUserId = formData.get("approvedUserId");
  if (deleteUserId)
    try {
      return await deleteUserById(parseInt(deleteUserId)), (0, import_node10.redirect)("/users");
    } catch (err) {
      return console.error(err), {};
    }
  if (approvedUserId)
    try {
      return await db.users.update({
        where: { id: parseInt(approvedUserId) },
        data: { isApproved: 1 }
      }), (0, import_node10.redirect)("/users");
    } catch (err) {
      return console.error(err), {};
    }
}
function UsersIndex() {
  let { users } = (0, import_react18.useLoaderData)(), isSubmitting = (0, import_react18.useNavigation)().state === "submitting", [deletedUserID, setDeletedUserId] = (0, import_react19.useState)(0), [modelOpen, setModalOpen] = (0, import_react19.useState)(!1), user = (0, import_react19.useContext)(UserContext);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(import_jsx_dev_runtime17.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("table", { className: "table static", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("tr", { className: "hidden md:table-row", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("th", { children: "ID" }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 72,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("th", { children: "First Name" }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 73,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("th", { children: "Last Name" }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 74,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("th", { children: "Email" }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 75,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("th", { children: "Approved" }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 76,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("th", { children: "Actions" }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 77,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/users._index.tsx",
        lineNumber: 71,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/routes/users._index.tsx",
        lineNumber: 70,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("tbody", { children: users && users.map((loopedUser) => /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("tr", { className: resTRClass, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("td", { "data-label": "ID", className: resTDClass, children: loopedUser.id }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 85,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("td", { "data-label": "First Name", className: resTDClass, children: loopedUser.firstName }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 88,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("td", { "data-label": "Last Name", className: resTDClass, children: loopedUser.lastName }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 91,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("td", { "data-label": "Email", className: resTDClass, children: loopedUser.email }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 94,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("td", { "data-label": "Approved", className: resTDClass, children: loopedUser.isApproved ? "Approved" : /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(import_react18.Form, { method: "post", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
            "input",
            {
              type: "hidden",
              name: "approvedUserId",
              value: loopedUser.id
            },
            void 0,
            !1,
            {
              fileName: "app/routes/users._index.tsx",
              lineNumber: 102,
              columnNumber: 25
            },
            this
          ),
          /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(FormBtn_default, { type: "submit", isSubmitting, children: "Approve" }, void 0, !1, {
            fileName: "app/routes/users._index.tsx",
            lineNumber: 107,
            columnNumber: 25
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 101,
          columnNumber: 23
        }, this) }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 97,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("td", { "data-label": "Actions", className: resTDClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "btn-group", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
            FormAnchorBtn_default,
            {
              href: `users/${loopedUser.id}`,
              isSubmitting,
              children: "EDIT"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/users._index.tsx",
              lineNumber: 115,
              columnNumber: 23
            },
            this
          ),
          /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
            FormBtn_default,
            {
              disabled: user.id === loopedUser.id,
              isSubmitting,
              onClick: () => {
                setDeletedUserId(loopedUser.id), setModalOpen(!0);
              },
              children: "DELETE"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/users._index.tsx",
              lineNumber: 121,
              columnNumber: 23
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 114,
          columnNumber: 21
        }, this) }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 113,
          columnNumber: 19
        }, this)
      ] }, loopedUser.id, !0, {
        fileName: "app/routes/users._index.tsx",
        lineNumber: 84,
        columnNumber: 17
      }, this)) }, void 0, !1, {
        fileName: "app/routes/users._index.tsx",
        lineNumber: 80,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/users._index.tsx",
      lineNumber: 69,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(Modal_default, { open: modelOpen, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("p", { className: "py-4", children: "Are you sure you want to delete this user?" }, void 0, !1, {
        fileName: "app/routes/users._index.tsx",
        lineNumber: 139,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "modal-action", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
          import_react18.Form,
          {
            method: "post",
            onSubmit: () => {
              setModalOpen(!1);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("input", { type: "hidden", name: "uid", value: deletedUserID }, void 0, !1, {
                fileName: "app/routes/users._index.tsx",
                lineNumber: 147,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(FormBtn_default, { type: "submit", isSubmitting: !0, children: "Confirm" }, void 0, !1, {
                fileName: "app/routes/users._index.tsx",
                lineNumber: 148,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/users._index.tsx",
            lineNumber: 141,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(FormBtn_default, { isSubmitting: !0, onClick: () => setModalOpen(!1), children: "Close" }, void 0, !1, {
          fileName: "app/routes/users._index.tsx",
          lineNumber: 152,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/users._index.tsx",
        lineNumber: 140,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/users._index.tsx",
      lineNumber: 138,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/users._index.tsx",
    lineNumber: 68,
    columnNumber: 5
  }, this);
}

// app/routes/customers.tsx
var customers_exports = {};
__export(customers_exports, {
  action: () => action6,
  default: () => Customers,
  loader: () => loader8,
  meta: () => meta7
});
var import_node11 = require("@remix-run/node"), import_react20 = require("@remix-run/react"), import_react21 = require("react");
var import_jsx_dev_runtime18 = require("react/jsx-dev-runtime"), meta7 = () => [{ title: `${SITE_TITLE} - Customers` }], loader8 = async ({ request }) => {
  if (!await getUserId(request))
    return (0, import_node11.redirect)("/login");
  try {
    let customers = await db.customers.findMany();
    return (0, import_node11.json)({ customers });
  } catch (err) {
    return console.error(err), {};
  }
};
async function action6({ request }) {
  let formData = await request.formData(), { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "delete":
      let { customer_id } = values, deleteActionsErrors = {};
      try {
        return await deleteCustomerById(parseInt(`${customer_id}`)), { customerDeleted: !0 };
      } catch (err) {
        return console.error(err), deleteActionsErrors.info = `There was a problem deleting customer with id: ${customer_id}`, { deleteActionsErrors };
      }
    case "create":
      let { name, tel, email, address } = values, createActionErrors = validateCustomerData(values);
      if (Object.values(createActionErrors).some(Boolean))
        return { createActionErrors };
      try {
        return await createCustomer(`${name}`, `${tel}`, `${email}`, `${address}`), { customerCreated: !0 };
      } catch (err) {
        return console.log(err), createActionErrors.info = "There was a problem creating the customer...", { createActionErrors };
      }
  }
  return {};
}
function Customers() {
  let { customers } = (0, import_react20.useLoaderData)(), data = (0, import_react20.useActionData)(), navigation = (0, import_react20.useNavigation)(), isSubmitting = navigation.state === "submitting", [deletedCustomerID, setDeletedCustomerID] = (0, import_react21.useState)(0), [deleteModelOpen, setDeleteModalOpen] = (0, import_react21.useState)(!1), [createModalOpen, setCreateModalOpen] = (0, import_react21.useState)(!1);
  return (0, import_react21.useEffect)(() => {
    data && (data.customerCreated && setCreateModalOpen(!1), data.customerDeleted && setDeleteModalOpen(!1));
  }, [data]), /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: contentBodyClass, children: [
    customers && customers.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("table", { className: "table static", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("tr", { className: "hidden md:table-row", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("th", { children: "ID" }, void 0, !1, {
          fileName: "app/routes/customers.tsx",
          lineNumber: 92,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("th", { children: "Name" }, void 0, !1, {
          fileName: "app/routes/customers.tsx",
          lineNumber: 93,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("th", { children: "Tel" }, void 0, !1, {
          fileName: "app/routes/customers.tsx",
          lineNumber: 94,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("th", { children: "Email" }, void 0, !1, {
          fileName: "app/routes/customers.tsx",
          lineNumber: 95,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("th", { children: "Address" }, void 0, !1, {
          fileName: "app/routes/customers.tsx",
          lineNumber: 96,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("th", { className: "md:text-right", children: "Actions" }, void 0, !1, {
          fileName: "app/routes/customers.tsx",
          lineNumber: 97,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/customers.tsx",
        lineNumber: 91,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/customers.tsx",
        lineNumber: 90,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("tbody", { children: customers && customers.map(
        ({ customer_id, name, tel, email, address }) => /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("tr", { className: resTRClass, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("td", { "data-label": "ID", className: resTDClass, children: customer_id }, void 0, !1, {
            fileName: "app/routes/customers.tsx",
            lineNumber: 106,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("td", { "data-label": "Name", className: resTDClass, children: name }, void 0, !1, {
            fileName: "app/routes/customers.tsx",
            lineNumber: 109,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("td", { "data-label": "Tel", className: resTDClass, children: tel }, void 0, !1, {
            fileName: "app/routes/customers.tsx",
            lineNumber: 112,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("td", { "data-label": "Email", className: resTDClass, children: email }, void 0, !1, {
            fileName: "app/routes/customers.tsx",
            lineNumber: 115,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("td", { "data-label": "Address", className: resTDClass, children: address }, void 0, !1, {
            fileName: "app/routes/customers.tsx",
            lineNumber: 118,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
            "td",
            {
              "data-label": "Actions",
              className: `${resTDClass} md:text-right`,
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
                FormBtn_default,
                {
                  isSubmitting,
                  onClick: () => {
                    setDeletedCustomerID(customer_id), setDeleteModalOpen(!0);
                  },
                  children: "DELETE"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/customers.tsx",
                  lineNumber: 125,
                  columnNumber: 25
                },
                this
              )
            },
            void 0,
            !1,
            {
              fileName: "app/routes/customers.tsx",
              lineNumber: 121,
              columnNumber: 23
            },
            this
          )
        ] }, customer_id, !0, {
          fileName: "app/routes/customers.tsx",
          lineNumber: 105,
          columnNumber: 21
        }, this)
      ) }, void 0, !1, {
        fileName: "app/routes/customers.tsx",
        lineNumber: 100,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/customers.tsx",
      lineNumber: 89,
      columnNumber: 9
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("p", { className: "text-center", children: "No customers found..." }, void 0, !1, {
      fileName: "app/routes/customers.tsx",
      lineNumber: 142,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
      FormBtn_default,
      {
        isSubmitting,
        onClick: () => {
          setCreateModalOpen(!0);
        },
        children: "Add new customer +"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/customers.tsx",
        lineNumber: 145,
        columnNumber: 9
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/customers.tsx",
      lineNumber: 144,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(Modal_default, { open: createModalOpen, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("h3", { className: "mb-4", children: "Create new customer" }, void 0, !1, {
        fileName: "app/routes/customers.tsx",
        lineNumber: 155,
        columnNumber: 9
      }, this),
      createModalOpen && /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
        CreateCustomerForm_default,
        {
          actionName: "create",
          navigation,
          formErrors: data == null ? void 0 : data.createActionErrors,
          onCancel: () => {
            setCreateModalOpen(!1), data && (data.createActionErrors = {});
          }
        },
        void 0,
        !1,
        {
          fileName: "app/routes/customers.tsx",
          lineNumber: 157,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/customers.tsx",
      lineNumber: 154,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(Modal_default, { open: deleteModelOpen, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("p", { className: "py-4", children: "Are you sure you want to delete this customer?" }, void 0, !1, {
        fileName: "app/routes/customers.tsx",
        lineNumber: 169,
        columnNumber: 9
      }, this),
      data && data.deleteActionsErrors && /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("p", { className: "text-error mt-1 text-xs", children: data.deleteActionsErrors.info }, void 0, !1, {
        fileName: "app/routes/customers.tsx",
        lineNumber: 171,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: "modal-action", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(import_react20.Form, { replace: !0, method: "post", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("input", { type: "hidden", name: "customer_id", value: deletedCustomerID }, void 0, !1, {
            fileName: "app/routes/customers.tsx",
            lineNumber: 177,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
            FormBtn_default,
            {
              type: "submit",
              name: "_action",
              value: "delete",
              isSubmitting,
              children: "Confirm"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/customers.tsx",
              lineNumber: 178,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/customers.tsx",
          lineNumber: 176,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
          FormBtn_default,
          {
            className: "ml-4",
            isSubmitting,
            onClick: () => setDeleteModalOpen(!1),
            children: "Cancel"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/customers.tsx",
            lineNumber: 187,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/customers.tsx",
        lineNumber: 175,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/customers.tsx",
      lineNumber: 168,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/customers.tsx",
    lineNumber: 87,
    columnNumber: 5
  }, this);
}

// app/routes/products.tsx
var products_exports = {};
__export(products_exports, {
  action: () => action7,
  default: () => Products,
  loader: () => loader9,
  meta: () => meta8
});
var import_node12 = require("@remix-run/node"), import_react22 = require("@remix-run/react"), import_react23 = require("react");
var import_jsx_dev_runtime19 = require("react/jsx-dev-runtime"), meta8 = () => [{ title: `${SITE_TITLE} - Products` }], loader9 = async ({ request }) => {
  if (!await getUserId(request))
    return (0, import_node12.redirect)("/login");
  try {
    let [brands, types, models, products] = await Promise.all([
      db.product_brands.findMany(),
      db.product_types.findMany(),
      db.product_models.findMany(),
      db.products.findMany({
        include: {
          brand: !0,
          type: !0,
          model: !0
        }
      })
    ]);
    return (0, import_node12.json)({ brands, types, models, products });
  } catch (err) {
    return console.error(err), {};
  }
};
async function action7({ request }) {
  let formData = await request.formData(), { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "delete":
      let { product_id } = values, deleteActionsErrors = {};
      try {
        return await deleteProductById(parseInt(`${product_id}`)), { productDeleted: !0 };
      } catch (err) {
        return console.error(err), deleteActionsErrors.info = `There was a problem deleting product with id: ${product_id}`, { deleteActionsErrors };
      }
    case "create":
      let { brand, newbrand, type, newtype, model, newmodel, price } = values, createActionErrors = validateProductData(values);
      if (Object.values(createActionErrors).some(Boolean))
        return { createActionErrors };
      try {
        return await createProduct(
          `${brand}`,
          `${newbrand}`,
          `${type}`,
          `${newtype}`,
          `${model}`,
          `${newmodel}`,
          `${price}`
        ), { productCreated: !0 };
      } catch (err) {
        return console.log(err), createActionErrors.info = "There was a problem creating the product...", { createActionErrors };
      }
  }
}
function Products() {
  let {
    products,
    brands,
    types,
    models
  } = (0, import_react22.useLoaderData)(), data = (0, import_react22.useActionData)(), navigation = (0, import_react22.useNavigation)(), isSubmitting = navigation.state === "submitting", [deletedProductID, setDeletedProductID] = (0, import_react23.useState)(0), [deleteModelOpen, setDeleteModalOpen] = (0, import_react23.useState)(!1), [createModalOpen, setCreateModalOpen] = (0, import_react23.useState)(!1);
  return (0, import_react23.useEffect)(() => {
    data && (data.productCreated && setCreateModalOpen(!1), data.productDeleted && setDeleteModalOpen(!1));
  }, [data]), (0, import_react23.useEffect)(() => {
    data && (data.productCreated && setCreateModalOpen(!1), data.productDeleted && setDeleteModalOpen(!1));
  }, [data]), /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("div", { className: contentBodyClass, children: [
    products && products.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("table", { className: "table static", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("tr", { className: "hidden md:table-row", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("th", { children: "ID" }, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 135,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("th", { children: "Brand" }, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 136,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("th", { children: "Type" }, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 137,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("th", { children: "Model" }, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 138,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("th", { children: "Price" }, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 139,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("th", { className: "md:text-right", children: "Actions" }, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 140,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/products.tsx",
        lineNumber: 134,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/products.tsx",
        lineNumber: 133,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("tbody", { children: products && products.map((loopedProducts) => /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("tr", { className: resTRClass, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("td", { "data-label": "ID", className: resTDClass, children: loopedProducts.product_id }, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 148,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("td", { "data-label": "Brand", className: resTDClass, children: loopedProducts.brand.brand_name }, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 151,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("td", { "data-label": "Type", className: resTDClass, children: loopedProducts.type.type_name }, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 154,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("td", { "data-label": "Model", className: resTDClass, children: loopedProducts.model.model_name }, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 157,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("td", { "data-label": "Price", className: resTDClass, children: [
          "\xA3",
          loopedProducts.price
        ] }, void 0, !0, {
          fileName: "app/routes/products.tsx",
          lineNumber: 160,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)(
          "td",
          {
            "data-label": "Actions",
            className: `${resTDClass} md:text-right`,
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)(
              FormBtn_default,
              {
                isSubmitting,
                onClick: () => {
                  setDeletedProductID(loopedProducts.product_id), setDeleteModalOpen(!0);
                },
                children: "DELETE"
              },
              void 0,
              !1,
              {
                fileName: "app/routes/products.tsx",
                lineNumber: 167,
                columnNumber: 23
              },
              this
            )
          },
          void 0,
          !1,
          {
            fileName: "app/routes/products.tsx",
            lineNumber: 163,
            columnNumber: 21
          },
          this
        )
      ] }, loopedProducts.product_id, !0, {
        fileName: "app/routes/products.tsx",
        lineNumber: 147,
        columnNumber: 19
      }, this)) }, void 0, !1, {
        fileName: "app/routes/products.tsx",
        lineNumber: 143,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/products.tsx",
      lineNumber: 132,
      columnNumber: 9
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("p", { className: "text-center", children: "No products found..." }, void 0, !1, {
      fileName: "app/routes/products.tsx",
      lineNumber: 183,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)(
      FormBtn_default,
      {
        isSubmitting,
        onClick: () => {
          setCreateModalOpen(!0);
        },
        children: "Add new product +"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/products.tsx",
        lineNumber: 186,
        columnNumber: 9
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/products.tsx",
      lineNumber: 185,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)(Modal_default, { open: createModalOpen, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("h3", { className: "mb-4", children: "Create new product" }, void 0, !1, {
        fileName: "app/routes/products.tsx",
        lineNumber: 196,
        columnNumber: 9
      }, this),
      createModalOpen && /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)(
        CreateProductForm_default,
        {
          actionName: "create",
          selectData: {
            brands,
            types,
            models
          },
          navigation,
          formErrors: data == null ? void 0 : data.createActionErrors,
          onCancel: () => {
            setCreateModalOpen(!1), data && (data.createActionErrors = {});
          }
        },
        void 0,
        !1,
        {
          fileName: "app/routes/products.tsx",
          lineNumber: 198,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/products.tsx",
      lineNumber: 195,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)(Modal_default, { open: deleteModelOpen, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("p", { className: "py-4", children: [
        "Are you sure you want to delete this product?",
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("br", {}, void 0, !1, {
          fileName: "app/routes/products.tsx",
          lineNumber: 217,
          columnNumber: 11
        }, this),
        "NOTE: this doesn't delete the associated brand, model and type"
      ] }, void 0, !0, {
        fileName: "app/routes/products.tsx",
        lineNumber: 215,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("div", { className: "modal-action", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)(import_react22.Form, { replace: !0, method: "post", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)("input", { type: "hidden", name: "product_id", value: deletedProductID }, void 0, !1, {
            fileName: "app/routes/products.tsx",
            lineNumber: 222,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)(
            FormBtn_default,
            {
              type: "submit",
              name: "_action",
              value: "delete",
              isSubmitting,
              children: "Confirm"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/products.tsx",
              lineNumber: 223,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/products.tsx",
          lineNumber: 221,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime19.jsxDEV)(
          FormBtn_default,
          {
            isSubmitting,
            onClick: () => setDeleteModalOpen(!1),
            children: "Cancel"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/products.tsx",
            lineNumber: 232,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/products.tsx",
        lineNumber: 220,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/products.tsx",
      lineNumber: 214,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/products.tsx",
    lineNumber: 130,
    columnNumber: 5
  }, this);
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => IndexRoute,
  loader: () => loader10,
  meta: () => meta9
});
var import_node13 = require("@remix-run/node");
var import_jsx_dev_runtime20 = require("react/jsx-dev-runtime"), meta9 = () => [{ title: SITE_TITLE }], loader10 = async ({ request }) => await getUserId(request) ? {} : (0, import_node13.redirect)("/login");
function IndexRoute() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime20.jsxDEV)("div", { className: contentBodyClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime20.jsxDEV)("p", { children: "Welcome to Smart CCTV admin" }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 23,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 22,
    columnNumber: 5
  }, this);
}

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  loader: () => loader11
});
var loader11 = async ({ request }) => logout(request);

// app/routes/quotes.tsx
var quotes_exports = {};
__export(quotes_exports, {
  default: () => Quotes
});
var import_react_router = require("react-router");
var import_jsx_dev_runtime21 = require("react/jsx-dev-runtime");
function Quotes() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime21.jsxDEV)("div", { className: contentBodyClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime21.jsxDEV)(import_react_router.Outlet, {}, void 0, !1, {
    fileName: "app/routes/quotes.tsx",
    lineNumber: 7,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/quotes.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, this);
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action8,
  default: () => Login,
  meta: () => meta10
});
var import_node14 = require("@remix-run/node"), import_react24 = require("@remix-run/react"), import_bcryptjs3 = __toESM(require("bcryptjs"));
var import_jsx_dev_runtime22 = require("react/jsx-dev-runtime"), meta10 = () => [{ title: `${SITE_TITLE} - Login` }];
async function action8({ request }) {
  let body = await request.formData(), email = body.get("email"), password = body.get("password");
  var mess = "";
  let user = await getUserByEmail(email);
  if (user && user.isApproved)
    if (!await import_bcryptjs3.default.compare(
      password,
      `${user.password}`
    ))
      mess = "Invalid password!";
    else
      return await createUserSession(user.id, "/");
  else
    mess = "User not found";
  return (0, import_node14.json)({ message: mess });
}
function Login() {
  let navigation = (0, import_react24.useNavigation)(), data = (0, import_react24.useActionData)(), isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("div", { className: "grid place-items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)(import_react24.Form, { method: "post", className: formClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("fieldset", { disabled: isSubmitting, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("label", { className: "label", htmlFor: "email", children: /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("span", { className: "label-text", children: "Email" }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 49,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 48,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)(
        "input",
        {
          className: inputClass,
          name: "email",
          id: "email",
          type: "text",
          placeholder: "john@example.com"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/login.tsx",
          lineNumber: 51,
          columnNumber: 15
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/login.tsx",
      lineNumber: 47,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("label", { className: "label", htmlFor: "password", children: /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("span", { className: "label-text", children: "Password" }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 61,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 60,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)(
        "input",
        {
          className: inputClass,
          name: "password",
          id: "password",
          type: "password",
          placeholder: "******************"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/login.tsx",
          lineNumber: 63,
          columnNumber: 15
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/login.tsx",
      lineNumber: 59,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("div", { className: "mt-6 mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)(FormBtn_default, { type: "submit", isSubmitting, children: "Log In" }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 72,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)(FormAnchorBtn_default, { className: "ml-4", href: "/users/register", children: "Register" }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 75,
        columnNumber: 15
      }, this),
      data && data.message && /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("span", { className: "label-text-alt text-error", children: data.message }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 80,
        columnNumber: 19
      }, this) }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 79,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/login.tsx",
      lineNumber: 71,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/login.tsx",
    lineNumber: 46,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 45,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 44,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 43,
    columnNumber: 5
  }, this);
}

// app/routes/users.tsx
var users_exports = {};
__export(users_exports, {
  default: () => Users
});
var import_react_router2 = require("react-router");
var import_jsx_dev_runtime23 = require("react/jsx-dev-runtime");
function Users() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime23.jsxDEV)("div", { className: contentBodyClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime23.jsxDEV)(import_react_router2.Outlet, {}, void 0, !1, {
    fileName: "app/routes/users.tsx",
    lineNumber: 7,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/users.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-4UM2EQFA.js", imports: ["/build/_shared/chunk-OAPPX4FA.js", "/build/_shared/chunk-WEAPBHQG.js", "/build/_shared/chunk-FKB2SGI5.js", "/build/_shared/chunk-2QJY4JOV.js", "/build/_shared/chunk-BQ232ZJA.js", "/build/_shared/chunk-TH3LK4B7.js", "/build/_shared/chunk-JR22VO6P.js", "/build/_shared/chunk-CJ4MY3PQ.js", "/build/_shared/chunk-PZDJHGND.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-QGDVQGT3.js", imports: ["/build/_shared/chunk-EWGQC7VD.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-BBVYZMW4.js", imports: ["/build/_shared/chunk-YSKQXYUK.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/customers": { id: "routes/customers", parentId: "root", path: "customers", index: void 0, caseSensitive: void 0, module: "/build/routes/customers-64K75FYE.js", imports: ["/build/_shared/chunk-PFQU7YSQ.js", "/build/_shared/chunk-HXJWSP2T.js", "/build/_shared/chunk-YSKQXYUK.js", "/build/_shared/chunk-MKXCJEVK.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-3IAIF2LQ.js", imports: ["/build/_shared/chunk-YSKQXYUK.js", "/build/_shared/chunk-MT6OIOVU.js", "/build/_shared/chunk-5I2QP7L3.js", "/build/_shared/chunk-MKXCJEVK.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-5GTPI7EF.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/products": { id: "routes/products", parentId: "root", path: "products", index: void 0, caseSensitive: void 0, module: "/build/routes/products-UYPGPCS7.js", imports: ["/build/_shared/chunk-QOHE33S7.js", "/build/_shared/chunk-HXJWSP2T.js", "/build/_shared/chunk-YSKQXYUK.js", "/build/_shared/chunk-MKXCJEVK.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/quotes": { id: "routes/quotes", parentId: "root", path: "quotes", index: void 0, caseSensitive: void 0, module: "/build/routes/quotes-NCKKACDD.js", imports: ["/build/_shared/chunk-YSKQXYUK.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/quotes.$quoteid": { id: "routes/quotes.$quoteid", parentId: "routes/quotes", path: ":quoteid", index: void 0, caseSensitive: void 0, module: "/build/routes/quotes.$quoteid-SQWXF75V.js", imports: ["/build/_shared/chunk-HXJWSP2T.js", "/build/_shared/chunk-5I2QP7L3.js", "/build/_shared/chunk-MKXCJEVK.js", "/build/_shared/chunk-EWGQC7VD.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/quotes.$quoteid.generatedquote": { id: "routes/quotes.$quoteid.generatedquote", parentId: "routes/quotes.$quoteid", path: "generatedquote", index: void 0, caseSensitive: void 0, module: "/build/routes/quotes.$quoteid.generatedquote-PGCXKCXU.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/quotes._index": { id: "routes/quotes._index", parentId: "routes/quotes", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/quotes._index-OMN4OL5U.js", imports: ["/build/_shared/chunk-5I2QP7L3.js", "/build/_shared/chunk-MKXCJEVK.js", "/build/_shared/chunk-EWGQC7VD.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/quotes.create": { id: "routes/quotes.create", parentId: "routes/quotes", path: "create", index: void 0, caseSensitive: void 0, module: "/build/routes/quotes.create-MD6CGSUC.js", imports: ["/build/_shared/chunk-PFQU7YSQ.js", "/build/_shared/chunk-QOHE33S7.js", "/build/_shared/chunk-HXJWSP2T.js", "/build/_shared/chunk-5I2QP7L3.js", "/build/_shared/chunk-MKXCJEVK.js", "/build/_shared/chunk-EWGQC7VD.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/users": { id: "routes/users", parentId: "root", path: "users", index: void 0, caseSensitive: void 0, module: "/build/routes/users-7XHE2JWS.js", imports: ["/build/_shared/chunk-YSKQXYUK.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/users.$userid": { id: "routes/users.$userid", parentId: "routes/users", path: ":userid", index: void 0, caseSensitive: void 0, module: "/build/routes/users.$userid-ZZWNCYYQ.js", imports: ["/build/_shared/chunk-MT6OIOVU.js", "/build/_shared/chunk-5I2QP7L3.js", "/build/_shared/chunk-MKXCJEVK.js", "/build/_shared/chunk-EWGQC7VD.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/users._index": { id: "routes/users._index", parentId: "routes/users", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/users._index-ZBJ6TCNA.js", imports: ["/build/_shared/chunk-HXJWSP2T.js", "/build/_shared/chunk-5I2QP7L3.js", "/build/_shared/chunk-MKXCJEVK.js", "/build/_shared/chunk-EWGQC7VD.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/users.register": { id: "routes/users.register", parentId: "routes/users", path: "register", index: void 0, caseSensitive: void 0, module: "/build/routes/users.register-PVQZSGKM.js", imports: ["/build/_shared/chunk-MT6OIOVU.js", "/build/_shared/chunk-5I2QP7L3.js", "/build/_shared/chunk-MKXCJEVK.js", "/build/_shared/chunk-EWGQC7VD.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, version: "ca40e20f", hmr: { runtime: "/build/_shared/chunk-TH3LK4B7.js", timestamp: 1690558199123 }, url: "/build/manifest-CA40E20F.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", future = { v2_dev: !0, unstable_postcss: !1, unstable_tailwind: !1, v2_errorBoundary: !0, v2_headers: !0, v2_meta: !0, v2_normalizeFormMethod: !0, v2_routeConvention: !0 }, publicPath = "/build/", entry = { module: entry_server_exports }, dev = { port: 3001 }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/quotes.$quoteid.generatedquote": {
    id: "routes/quotes.$quoteid.generatedquote",
    parentId: "routes/quotes.$quoteid",
    path: "generatedquote",
    index: void 0,
    caseSensitive: void 0,
    module: quotes_quoteid_generatedquote_exports
  },
  "routes/quotes.$quoteid": {
    id: "routes/quotes.$quoteid",
    parentId: "routes/quotes",
    path: ":quoteid",
    index: void 0,
    caseSensitive: void 0,
    module: quotes_quoteid_exports
  },
  "routes/users.register": {
    id: "routes/users.register",
    parentId: "routes/users",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: users_register_exports
  },
  "routes/quotes._index": {
    id: "routes/quotes._index",
    parentId: "routes/quotes",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: quotes_index_exports
  },
  "routes/quotes.create": {
    id: "routes/quotes.create",
    parentId: "routes/quotes",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    module: quotes_create_exports
  },
  "routes/users.$userid": {
    id: "routes/users.$userid",
    parentId: "routes/users",
    path: ":userid",
    index: void 0,
    caseSensitive: void 0,
    module: users_userid_exports
  },
  "routes/users._index": {
    id: "routes/users._index",
    parentId: "routes/users",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: users_index_exports
  },
  "routes/customers": {
    id: "routes/customers",
    parentId: "root",
    path: "customers",
    index: void 0,
    caseSensitive: void 0,
    module: customers_exports
  },
  "routes/products": {
    id: "routes/products",
    parentId: "root",
    path: "products",
    index: void 0,
    caseSensitive: void 0,
    module: products_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/quotes": {
    id: "routes/quotes",
    parentId: "root",
    path: "quotes",
    index: void 0,
    caseSensitive: void 0,
    module: quotes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/users": {
    id: "routes/users",
    parentId: "root",
    path: "users",
    index: void 0,
    caseSensitive: void 0,
    module: users_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  dev,
  entry,
  future,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
