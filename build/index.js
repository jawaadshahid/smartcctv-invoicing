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
var import_node_stream = require("node:stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_nodemailer = __toESM(require("nodemailer")), import_jsx_runtime = require("react/jsx-runtime"), mailer = import_nodemailer.default, ABORT_DELAY = 5e3;
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
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
var tailwind_default = "/build/_assets/tailwind-RZKXON3G.css";

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
    secure: !0,
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
typeof window > "u" && (db = new import_client.PrismaClient());
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
var import_jsx_runtime2 = require("react/jsx-runtime"), NavBar = () => {
  let user = (0, import_react2.useContext)(UserContext);
  return user ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "navbar bg-base-100", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "navbar-start", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dropdown", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { tabIndex: 0, className: "btn btn-ghost btn-circle", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-5 w-5",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M4 6h16M4 12h16M4 18h7"
            }
          )
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "ul",
        {
          tabIndex: 0,
          className: "prose prose-li:pl-0 prose-a:no-underline menu dropdown-content mt-2 p-2 shadow bg-base-300 rounded-box z-[1]",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: "/", children: "Home" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: user.isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: "/users", children: "Users" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: `/users/${user.id}`, children: "My details" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: "/quotes", children: "Quotes" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: "/customers", children: "Customers" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: "/products", children: "Products" }) })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "navbar-center", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "img",
      {
        className: "h-10 w-auto mx-4",
        src: "https://smartcctvuk.co.uk/img/logo-small.png",
        alt: ""
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "navbar-end", children: user ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "hidden md:block", children: [
        "Hi, ",
        user.firstName
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          className: "btn btn-ghost btn-circle tooltip tooltip-left",
          "data-tip": "logout",
          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: "/logout", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "svg",
            {
              className: "w-6 h-6 mx-auto",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                }
              )
            }
          ) })
        }
      )
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        className: "btn btn-ghost btn-circle tooltip tooltip-left",
        "data-tip": "login",
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: "/login", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "svg",
          {
            className: "w-6 h-6 mx-auto",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              }
            )
          }
        ) })
      }
    ) })
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "navbar bg-base-100" });
}, NavBar_default = NavBar;

// app/root.tsx
var import_jsx_runtime3 = require("react/jsx-runtime"), SITE_TITLE = "Smart CCTV admin", UserContext = (0, import_react4.createContext)(null), loader = async ({ request }) => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("meta", { name: "robots", content: "noindex, nofollow" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.Meta, {}),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.Links, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("body", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(UserContext.Provider, { value: user, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(NavBar_default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.Outlet, {})
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.ScrollRestoration, {}),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.Scripts, {}),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.LiveReload, {})
    ] })
  ] });
}

// app/routes/quotes.$quoteid.generatedquote.tsx
var quotes_quoteid_generatedquote_exports = {};
__export(quotes_quoteid_generatedquote_exports, {
  loader: () => loader2
});
var import_node4 = require("@remix-run/node");

// app/components/QuotePDFDoc.tsx
var import_renderer = require("@react-pdf/renderer");
var import_jsx_runtime4 = require("react/jsx-runtime"), getQuoteBuffer = async (quoteid) => {
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
  let stream = await (0, import_renderer.renderToStream)(/* @__PURE__ */ (0, import_jsx_runtime4.jsx)(QuotePDFDoc, { quote }));
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
  ), grandTotal += labour, /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Document, { title: `Smart CCTV quote #${quote_id}, for ${name}`, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.Page, { size: "A4", style: styles.page, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: styles.header, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        import_renderer.Image,
        {
          src: "https://smartcctvuk.co.uk/img/logo-small.png",
          style: styles.logo
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: { marginRight: 20 }, children: date.toDateString() })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: { margin: "15 20" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: styles.customerRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: styles.customerField, children: "Name:" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: styles.customerValue, children: name })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: styles.customerRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: styles.customerField, children: "Address:" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: styles.customerValue, children: address })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: styles.customerRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: styles.customerField, children: "Tel:" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: styles.customerValue, children: tel })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: styles.customerRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: styles.customerField, children: "Email:" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: styles.customerValue, children: email })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: styles.table, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: [styles.tableRow, { borderTop: 0 }], children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            import_renderer.View,
            {
              style: [
                styles.tableCell,
                { textAlign: "left", width: "55%", borderLeftWidth: 0 }
              ],
              children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { children: "Product" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { children: "Quantity" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { children: "Unit price" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { children: "Total price" }) })
        ] }),
        quoted_products && quoted_products.map(
          ({ invprod_id, name: name2, quantity, price }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: styles.tableRow, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              import_renderer.View,
              {
                style: [
                  styles.tableCell,
                  { textAlign: "left", width: "55%", borderLeftWidth: 0 }
                ],
                children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { children: name2 })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.Text, { children: [
              "\xA3",
              quantity,
              ".00"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.Text, { children: [
              "\xA3",
              price,
              ".00"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.View, { style: styles.tableCell, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.Text, { children: [
              "\xA3",
              price * quantity,
              ".00"
            ] }) })
          ] }, invprod_id)
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: styles.endRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: styles.endField, children: "Labour:" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.Text, { style: styles.endValue, children: [
          "\xA3",
          labour,
          ".00"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.View, { style: styles.endRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_renderer.Text, { style: styles.endField, children: "Grand total:" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_renderer.Text, { style: styles.endValue, children: [
          "\xA3",
          grandTotal,
          ".00"
        ] })
      ] })
    ] })
  ] }) });
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

// app/components/Modal.tsx
var import_classnames = __toESM(require("classnames")), import_jsx_runtime5 = require("react/jsx-runtime"), Modal = ({ children, open }) => {
  let modalClass = (0, import_classnames.default)({
    "modal modal-bottom sm:modal-middle": !0,
    "modal-open": open,
    hidden: !open
  });
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: modalClass, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "modal-box prose", children }) });
}, Modal_default = Modal;

// app/components/ShareQuoteForm.tsx
var import_react5 = require("@remix-run/react");

// app/utils/styleClasses.ts
var contentBodyClass = "prose md:max-w-screen-xl md:mx-auto p-6", formClass = "bg-base-300 px-4 py-2 rounded-lg", inputClass = "input input-bordered w-full", selectClass = "select select-bordered w-full", resTRClass = "flex flex-col md:table-row", resTDClass = "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";

// app/components/ShareQuoteForm.tsx
var import_jsx_runtime6 = require("react/jsx-runtime"), ShareQuoteForm = ({
  quoteid,
  navigation,
  customer,
  user,
  onCancel,
  formErrors
}) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_react5.Form, { replace: !0, method: "post", className: formClass, children: [
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("input", { type: "hidden", value: quoteid, name: "quoteid", id: "quoteid" }),
  /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("fieldset", { disabled: navigation.state === "submitting", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "form-control", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: "label cursor-pointer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "label-text", children: [
        customer.name,
        " (",
        customer.email,
        ")"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "input",
        {
          type: "checkbox",
          className: "checkbox",
          name: "customerEmail",
          id: "customerEmail",
          value: customer.email
        }
      )
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "form-control", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: "label cursor-pointer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "label-text", children: [
        user.firstName,
        " (",
        user.email,
        ")"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "input",
        {
          type: "checkbox",
          className: "checkbox",
          name: "userEmail",
          id: "userEmail",
          value: user.email
        }
      )
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "form-control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "label-text", children: "Other(s)" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "input",
        {
          type: "text",
          name: "otherEmails",
          id: "otherEmails",
          placeholder: "john@example.com,jill@example.com,etc",
          className: inputClass
        }
      ),
      (formErrors == null ? void 0 : formErrors.msg) && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "label-text-alt text-error", children: formErrors.msg }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex justify-end mt-4 mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "button",
        {
          className: "btn",
          type: "submit",
          name: "_action",
          value: "share_quote",
          children: navigation.state === "submitting" ? "Submitting..." : "Submit"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "button",
        {
          className: "btn ml-3",
          onClick: (e) => {
            e.preventDefault(), onCancel();
          },
          children: "Cancel"
        }
      )
    ] })
  ] })
] }), ShareQuoteForm_default = ShareQuoteForm;

// app/utils/mailer.ts
async function sendEmail(to, attachmentBuffer) {
  let transporter = mailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "1" || !1,
    // secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }), isSMTPConnected;
  try {
    isSMTPConnected = await transporter.verify();
  } catch (error) {
    return error.code === "ETIMEDOUT" ? { error: "error: reeting never received!" } : { error: "unable to verify mail server connection!" };
  }
  return isSMTPConnected ? transporter.sendMail({
    from: "noreply@smartcctvuk.co.uk",
    to,
    subject: "Your Smart CCTV UK Quote",
    html: `<p>Please find your quotation attached.</p>
    <p>For further enquiries please contact us at <a href="mailto:info@smartcctvuk.co.uk">info@smartcctvuk.co.uk</a>, or call us on 01212710480 or 07486320798</p>
    <p>Kind regards,<br>Smart CCTV UK<br><a href="https://www.smartcctvuk.co.uk">https://www.smartcctvuk.co.uk</a></p>`,
    attachments: [
      {
        filename: "quote.pdf",
        content: attachmentBuffer
      }
    ]
  }) : { error: "unable to verify mail server connection!" };
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
var import_jsx_runtime7 = require("react/jsx-runtime"), meta = () => [{ title: `${SITE_TITLE} - View quote ` }], loader3 = async ({ request, params }) => {
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
      return mailResponse.error ? { shareActionErrors: { msg: mailResponse.error } } : mailResponse.accepted && mailResponse.accepted.length > 0 ? { shareActionErrors: { msg: "mail sent!" } } : {
        shareActionErrors: {
          msg: "something went wrong (vague, I know, but I haven't handled this error)"
        }
      };
  }
  return {};
}
var prettifyDateString = (dateString) => new Date(dateString).toDateString();
function QuoteId() {
  let user = (0, import_react7.useContext)(UserContext), { quote } = (0, import_react6.useLoaderData)(), { createdAt, labour, customer, quoted_products } = quote, navigation = (0, import_react6.useNavigation)(), data = (0, import_react6.useActionData)(), [grandTotal, setGrandTotal] = (0, import_react7.useState)(0), [showShareModal, setShowShareModal] = (0, import_react7.useState)(!1);
  return (0, import_react7.useEffect)(() => {
    setGrandTotal(() => {
      let subTotals = 0;
      return quoted_products.forEach(
        ({ price, quantity }) => subTotals += price * quantity
      ), subTotals + labour;
    });
  }, [labour, quoted_products]), /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h2", { children: "Quote" }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { children: [
      "Created on: ",
      prettifyDateString(createdAt)
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { children: "Customer" }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { children: [
      "Name: ",
      customer.name
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { children: [
      "Address: ",
      customer.address
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { children: [
      "Tel: ",
      customer.tel
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { children: [
      "Email: ",
      customer.email
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { children: "Products" }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("table", { className: "table", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("tr", { className: "hidden md:table-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("th", { children: "Name" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("th", { children: "Quantity" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("th", { className: "text-right", children: "Unit Price (\xA3)" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("th", { className: "text-right", children: "Subtotal (\xA3)" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("tbody", { children: [
        quoted_products && quoted_products.map(
          ({ invprod_id, name, quantity, price }) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("tr", { className: resTRClass, children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("td", { "data-label": "Name", className: resTDClass, children: name }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("td", { "data-label": "Quantity", className: resTDClass, children: quantity }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              "td",
              {
                "data-label": "Unit Price (\xA3)",
                className: `${resTDClass} md:text-right`,
                children: price
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              "td",
              {
                "data-label": "Subtotal (\xA3)",
                className: `${resTDClass} md:text-right`,
                children: price * quantity
              }
            )
          ] }, invprod_id)
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("tr", { className: resTRClass, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("td", { colSpan: 3, className: "hidden md:table-cell" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("td", { className: "md:text-right", children: [
            "Labour cost (\xA3): ",
            labour
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("tr", { className: resTRClass, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("td", { colSpan: 3, className: "hidden md:table-cell" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("td", { className: "md:text-right", children: [
            "Total cost (\xA3): ",
            grandTotal
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex justify-end mt-4 gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "a",
        {
          href: `/quotes/${quote.quote_id}/generatedquote`,
          target: "_blank",
          className: "btn",
          rel: "noreferrer",
          children: "Generate"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "button",
        {
          className: "btn",
          onClick: () => {
            setShowShareModal(!0);
          },
          children: "Share"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("a", { href: "/quotes", className: "btn", children: "Back" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Modal_default, { open: showShareModal, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "mb-4", children: "Share with:" }),
      showShareModal && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
        }
      )
    ] })
  ] });
}

// app/routes/users.register.tsx
var users_register_exports = {};
__export(users_register_exports, {
  action: () => action2,
  default: () => Register,
  meta: () => meta2
});
var import_node6 = require("@remix-run/node"), import_react8 = require("@remix-run/react"), import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsx_runtime8 = require("react/jsx-runtime"), meta2 = () => [{ title: `${SITE_TITLE} - Register` }];
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
  let navigation = (0, import_react8.useNavigation)(), data = (0, import_react8.useActionData)();
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "grid place-items-center", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react8.Form, { method: "post", className: formClass, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("fieldset", { disabled: navigation.state === "submitting", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("label", { className: "label", htmlFor: "firstname", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "label-text", children: "First name" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          className: inputClass,
          id: "firstname",
          name: "firstname",
          type: "text",
          placeholder: "First name"
        }
      ),
      data && data.formErrors && data.formErrors.fname && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.fname })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("label", { className: "label", htmlFor: "lastname", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "label-text", children: "Last name" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          className: inputClass,
          id: "lastname",
          name: "lastname",
          type: "text",
          placeholder: "Last name"
        }
      ),
      data && data.formErrors && data.formErrors.lname && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.lname })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("label", { className: "label", htmlFor: "email", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "label-text", children: "Email" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          className: inputClass,
          id: "email",
          name: "email",
          type: "text",
          placeholder: "Email"
        }
      ),
      data && data.formErrors && data.formErrors.email && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.email })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("label", { className: "label", htmlFor: "password", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "label-text", children: "Password" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          className: inputClass,
          id: "password",
          name: "password",
          type: "password",
          placeholder: "******************"
        }
      ),
      data && data.formErrors && data.formErrors.password && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.password })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "mt-6 mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { className: "btn", type: "submit", children: navigation.state === "submitting" ? "Submitting..." : "Submit" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("a", { href: "/login", className: "btn ml-3", children: "Cancel" })
    ] })
  ] }) }) }) });
}

// app/routes/quotes._index.tsx
var quotes_index_exports = {};
__export(quotes_index_exports, {
  default: () => QuotesIndex,
  loader: () => loader4,
  meta: () => meta3
});
var import_node7 = require("@remix-run/node"), import_react9 = require("@remix-run/react");
var import_jsx_runtime9 = require("react/jsx-runtime"), meta3 = () => [{ title: `${SITE_TITLE} - Quotes` }], loader4 = async ({ request }) => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
    quotes && quotes.length ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("table", { className: "table static", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { className: "hidden md:table-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { children: "ID" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { children: "Date" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { children: "Customer" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { children: "Amount (\xA3)" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("tbody", { children: quotes && quotes.map(
        ({
          quote_id,
          createdAt,
          customer,
          quoted_products,
          labour
        }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { className: resTRClass, children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { "data-label": "ID", className: resTDClass, children: quote_id }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { "data-label": "Date", className: resTDClass, children: prettifyDateString2(createdAt) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { "data-label": "Customer", className: resTDClass, children: customer.name }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { "data-label": "Amount (\xA3)", className: resTDClass, children: quoted_products.reduce(
            (partialSum, qp) => partialSum + qp.price * qp.quantity,
            0
          ) + labour }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { "data-label": "Actions", className: resTDClass, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "btn-group", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "a",
              {
                href: `quotes/${quote_id}`,
                className: "btn",
                children: "View"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { className: "btn", children: "Delete" })
          ] }) })
        ] }, quote_id)
      ) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: "No quotes found..." }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("a", { href: "/quotes/create", className: "btn", children: "Add new quote +" }) })
  ] });
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
var import_jsx_runtime10 = require("react/jsx-runtime"), CreateCustomerForm = ({
  navigation,
  formErrors,
  onCancel,
  actionName
}) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_react10.Form, { replace: !0, method: "post", className: formClass, children: [
  formErrors && formErrors.info && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "label-text-alt text-error", children: formErrors.info }) }),
  /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("fieldset", { disabled: navigation.state === "submitting", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { className: "label", htmlFor: "name", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "label-text", children: "Name" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "input",
        {
          className: inputClass,
          id: "name",
          name: "name",
          type: "text",
          placeholder: "John Smith"
        }
      ),
      formErrors && formErrors.name && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "label-text-alt text-error", children: formErrors.name }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { className: "label", htmlFor: "tel", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "label-text", children: "Tel" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "input",
        {
          className: inputClass,
          id: "tel",
          name: "tel",
          type: "text",
          placeholder: "07123456789"
        }
      ),
      formErrors && formErrors.tel && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "label-text-alt text-error", children: formErrors.tel }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { className: "label", htmlFor: "email", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "label-text", children: "Email" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "input",
        {
          className: inputClass,
          id: "email",
          name: "email",
          type: "text",
          placeholder: "john@example.com"
        }
      ),
      formErrors && formErrors.email && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "label-text-alt text-error", children: formErrors.email }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { className: "label", htmlFor: "address", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "label-text", children: "Address" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "textarea",
        {
          className: "textarea textarea-bordered w-full block bg-base-200",
          id: "address",
          name: "address",
          placeholder: "123 somewhere st, somehwere, S03 3EW"
        }
      ),
      formErrors && formErrors.address && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "label-text-alt text-error", children: formErrors.address }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex justify-end mt-4 mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "button",
        {
          className: "btn",
          type: "submit",
          name: "_action",
          value: actionName,
          children: navigation.state === "submitting" ? "Submitting..." : "Submit"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "button",
        {
          className: "btn ml-4",
          onClick: (e) => {
            e.preventDefault(), onCancel();
          },
          children: "Cancel"
        }
      )
    ] })
  ] })
] }), CreateCustomerForm_default = CreateCustomerForm;

// app/components/CreateProductForm.tsx
var import_react11 = require("@remix-run/react"), import_classnames2 = __toESM(require("classnames")), import_react12 = require("react");
var import_jsx_runtime11 = require("react/jsx-runtime"), TaxonomyField = ({
  taxoName,
  taxoItems,
  inputError
}) => {
  let hasItems = taxoItems.length > 0, [isNewTaxoItem, setIsNewTaxoItem] = (0, import_react12.useState)(!hasItems), [taxoSelectValue, setTaxoSelectValue] = (0, import_react12.useState)(""), taxoInputClass = (0, import_classnames2.default)({
    [inputClass]: !0,
    "mt-2": isNewTaxoItem,
    hidden: !isNewTaxoItem
  });
  return (0, import_react12.useEffect)(() => {
    setIsNewTaxoItem(taxoSelectValue === "-1");
  }, [taxoSelectValue]), /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "mb-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "label",
      {
        className: "label",
        htmlFor: isNewTaxoItem ? `new${taxoName}` : taxoName,
        children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: "label-text", children: [
          "Product ",
          taxoName
        ] })
      }
    ),
    hasItems && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("option", { disabled: !0, value: "", children: [
            "Select a ",
            taxoName,
            "..."
          ] }),
          taxoItems.map((taxoItem) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "option",
            {
              value: taxoItem[`${taxoName}_id`],
              children: taxoItem[`${taxoName}_name`]
            },
            taxoItem[`${taxoName}_id`]
          )),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("option", { value: "-1", children: [
            "Add new ",
            taxoName,
            " +"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "input",
      {
        disabled: !isNewTaxoItem,
        className: taxoInputClass,
        id: `new${taxoName}`,
        name: `new${taxoName}`,
        type: "text",
        placeholder: `Defined new ${taxoName} here...`
      }
    ),
    inputError && inputError[taxoName] && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "label-text-alt text-error", children: inputError[taxoName] }) })
  ] });
}, CreateProductForm = ({
  selectData,
  navigation,
  formErrors,
  onCancel,
  actionName
}) => {
  let { brands, models, types } = selectData;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_react11.Form, { replace: !0, method: "post", className: formClass, children: [
    formErrors && formErrors.info && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "label-text-alt text-error", children: formErrors.info }) }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("fieldset", { disabled: navigation.state === "submitting", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        TaxonomyField,
        {
          taxoName: "brand",
          taxoItems: brands,
          inputError: formErrors
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        TaxonomyField,
        {
          taxoName: "type",
          taxoItems: types,
          inputError: formErrors
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        TaxonomyField,
        {
          taxoName: "model",
          taxoItems: models,
          inputError: formErrors
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { className: "label", htmlFor: "price", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "label-text", children: "Product price (\xA3)" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "input",
          {
            className: inputClass,
            id: "price",
            name: "price",
            type: "number",
            placeholder: "10.00"
          }
        ),
        formErrors && formErrors.price && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "label-text-alt text-error", children: formErrors.price }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex justify-end mt-4 mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "button",
          {
            className: "btn",
            type: "submit",
            name: "_action",
            value: actionName,
            children: navigation.state === "submitting" ? "Submitting..." : "Submit"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "button",
          {
            className: "btn ml-3",
            onClick: (e) => {
              e.preventDefault(), onCancel();
            },
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] });
}, CreateProductForm_default = CreateProductForm;

// app/components/QuoteProductRow.tsx
var import_react13 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime"), QuoteProductRow = ({
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
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("tr", { className: resTRClass, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "td",
      {
        colSpan: productSelectValue ? 1 : 4,
        "data-label": "Product",
        className: resTDClass,
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
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
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("option", { disabled: !0, value: "", children: "Select a product..." }),
              products.map(({ product_id, brand_name, type_name, model_name }) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("option", { value: product_id, children: [
                brand_name,
                " - ",
                type_name,
                " - ",
                model_name
              ] }, product_id)),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("option", { value: "-1", children: "Add new product +" })
            ]
          }
        )
      }
    ),
    productSelectValue && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { "data-label": "Quantity", className: resTDClass, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
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
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { "data-label": "Unit (\xA3)", className: `${resTDClass} md:text-right`, children: unitPrice || " - " }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "td",
        {
          "data-label": "Subtotal (\xA3)",
          className: `${resTDClass} md:text-right`,
          children: subtotal || " - "
        }
      )
    ] })
  ] });
}, QuoteProductRow_default = QuoteProductRow;

// app/routes/quotes.create.tsx
var import_jsx_runtime13 = require("react/jsx-runtime"), meta4 = () => [{ title: `${SITE_TITLE} - Create quote` }], loader5 = async ({ request }) => {
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
  } = (0, import_react14.useLoaderData)(), data = (0, import_react14.useActionData)(), [isNewCustomer, setIsNewCustomer] = (0, import_react15.useState)(!1), [customerSelectValue, setCustomerSelectValue] = (0, import_react15.useState)(""), [productCount, setProductCount] = (0, import_react15.useState)(1), [labour, setLabour] = (0, import_react15.useState)(0), [grandtotal, setGrandtotal] = (0, import_react15.useState)(0), [newProductRow, setNewProductRow] = (0, import_react15.useState)(0), [isNewProduct, setIsNewProduct] = (0, import_react15.useState)(!1), [productSelectValues, dispatchPSV] = (0, import_react15.useReducer)(
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
  }, [data, newProductRow]), /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h2", { className: "mb-4 text-center", children: "Create a new quote" }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_react14.Form, { method: "post", className: formClass, children: [
      ((_a = data == null ? void 0 : data.quoteActionErrors) == null ? void 0 : _a.info) && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "label-text-alt text-error", children: data.quoteActionErrors.info }) }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        "input",
        {
          type: "hidden",
          name: "prodcount",
          id: "prodcount",
          value: productCount
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("fieldset", { disabled: navigation.state === "submitting", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { className: "label", htmlFor: "customer", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "label-text", children: "Customer" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
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
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { disabled: !0, value: "", children: "Select a customer..." }),
              customers.map(
                ({ customer_id, name, tel, email, address }) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("option", { value: customer_id, children: [
                  name,
                  " - ",
                  tel,
                  " - ",
                  email,
                  " - ",
                  address
                ] }, customer_id)
              ),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "-1", children: "Add new customer +" })
            ]
          }
        ),
        ((_b = data == null ? void 0 : data.quoteActionErrors) == null ? void 0 : _b.customer) && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "label-text-alt text-error", children: data.quoteActionErrors.customer }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("fieldset", { disabled: navigation.state === "submitting", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "label-text", children: "Products" }) }),
        ((_c = data == null ? void 0 : data.quoteActionErrors) == null ? void 0 : _c.product) && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "label-text-alt text-error", children: data.quoteActionErrors.product }) }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("table", { className: "table", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("tr", { className: "hidden md:table-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("th", { children: "Product" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("th", { className: "w-[100px]", children: "Quantity" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("th", { className: "text-right w-[150px]", children: "Unit (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("th", { className: "text-right w-[150px]", children: "Subtotal (\xA3)" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("tbody", { children: [
            [...Array(productCount)].map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              QuoteProductRow_default,
              {
                rowId: `${i + 1}`,
                products,
                productSelectValues,
                dispatchPSV
              },
              i
            )),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("tr", { className: resTRClass, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("td", { colSpan: 4, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex md:justify-end join", children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                "button",
                {
                  className: "btn join-item",
                  disabled: productCount === 1,
                  onClick: (e) => {
                    e.preventDefault(), setProductCount((pCount) => (dispatchPSV({
                      type: "remove",
                      row_id: `${pCount}`
                    }), pCount - 1));
                  },
                  children: "-"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                "button",
                {
                  className: "btn join-item",
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
                }
              )
            ] }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("tr", { className: resTRClass, children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("td", { colSpan: 2, className: "hidden md:table-cell" }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("td", { className: "flex md:table-cell", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { className: "label md:justify-end", htmlFor: "labour", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "label-text", children: "Labour cost (\xA3):" }) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
                }
              ) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("tr", { className: resTRClass, children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("td", { colSpan: 2, className: "hidden md:table-cell" }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { className: "label md:justify-end", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "label-text", children: "Total cost (\xA3):" }) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { className: "label md:justify-end", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "label-text", children: grandtotal }) }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex md:justify-end mt-4 mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "button",
            {
              className: "btn",
              type: "submit",
              name: "_action",
              value: "create_quote",
              children: navigation.state === "submitting" ? "Submitting..." : "Submit"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("a", { className: "btn ml-4", href: "/quotes", children: "Cancel" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Modal_default, { open: isNewCustomer, children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h3", { className: "mb-4", children: "Create new customer" }),
      isNewCustomer && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        CreateCustomerForm_default,
        {
          actionName: "create_customer",
          navigation,
          formErrors: data == null ? void 0 : data.customerActionErrors,
          onCancel: () => {
            setCustomerSelectValue(""), data && (data.customerActionErrors = {});
          }
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Modal_default, { open: isNewProduct, children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h3", { className: "mb-4", children: "Create new product" }),
      isNewProduct && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
        }
      )
    ] })
  ] });
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
var import_jsx_runtime14 = require("react/jsx-runtime"), meta5 = () => [{ title: `${SITE_TITLE} - Change user details` }], loader6 = async ({ request }) => await getUserId(request) ? {} : (0, import_node9.redirect)("/login");
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
  let user = (0, import_react17.useContext)(UserContext), navigation = (0, import_react16.useNavigation)(), data = (0, import_react16.useActionData)();
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "grid place-items-center", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_react16.Form, { method: "post", className: "bg-base-300 px-4 py-2 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("fieldset", { disabled: navigation.state === "submitting", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { className: "label", htmlFor: "firstname", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "label-text", children: "First name" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "input",
        {
          className: "input input-bordered w-full max-w-xs",
          id: "firstname",
          name: "firstname",
          type: "text",
          placeholder: user.firstName
        }
      ),
      data && data.formErrors && data.formErrors.fname && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.fname })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { className: "label", htmlFor: "lastname", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "label-text", children: "Last name" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "input",
        {
          className: "input input-bordered w-full max-w-xs",
          id: "lastname",
          name: "lastname",
          type: "text",
          placeholder: user.lastName
        }
      ),
      data && data.formErrors && data.formErrors.lname && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.lname })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { className: "label", htmlFor: "email", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "label-text", children: "Email" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { type: "hidden", name: "email", value: user.email }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "input",
        {
          className: "input input-bordered w-full max-w-xs",
          type: "text",
          placeholder: user.email,
          disabled: !0
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { className: "label", htmlFor: "opassword", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "label-text", children: "Original password" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "input",
        {
          className: "input input-bordered w-full max-w-xs",
          id: "opassword",
          name: "opassword",
          type: "password",
          placeholder: "******************"
        }
      ),
      data && data.formErrors && data.formErrors.opassword && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.opassword })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { className: "label", htmlFor: "npassword", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "label-text", children: "New password" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "input",
        {
          className: "input input-bordered w-full max-w-xs",
          id: "npassword",
          name: "npassword",
          type: "password",
          placeholder: "******************"
        }
      ),
      data && data.formErrors && data.formErrors.npassword && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "text-error mt-1 text-xs", children: data.formErrors.npassword })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "mt-6 mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("button", { className: "btn", type: "submit", children: navigation.state === "submitting" ? "Submitting..." : "Submit" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("a", { href: "/users", className: "btn ml-3", children: "Cancel" })
    ] })
  ] }) }) }) });
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
var import_jsx_runtime15 = require("react/jsx-runtime"), meta6 = () => [{ title: `${SITE_TITLE} - Users` }], loader7 = async ({ request }) => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(import_jsx_runtime15.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("table", { className: "table static", children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("tr", { className: "hidden md:table-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("th", { children: "ID" }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("th", { children: "First Name" }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("th", { children: "Last Name" }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("th", { children: "Email" }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("th", { children: "Approved" }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("th", { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("tbody", { children: users && users.map((loopedUser) => /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("tr", { className: resTRClass, children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("td", { "data-label": "ID", className: resTDClass, children: loopedUser.id }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("td", { "data-label": "First Name", className: resTDClass, children: loopedUser.firstName }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("td", { "data-label": "Last Name", className: resTDClass, children: loopedUser.lastName }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("td", { "data-label": "Email", className: resTDClass, children: loopedUser.email }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("td", { "data-label": "Approved", className: resTDClass, children: loopedUser.isApproved ? "Approved" : /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(import_react18.Form, { method: "post", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            "input",
            {
              type: "hidden",
              name: "approvedUserId",
              value: loopedUser.id
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("button", { type: "submit", className: "btn", children: "Approve" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("td", { "data-label": "Actions", className: resTDClass, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "btn-group", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            "a",
            {
              href: `users/${loopedUser.id}`,
              className: "btn",
              children: "EDIT"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            "button",
            {
              className: "btn",
              disabled: user.id === loopedUser.id,
              onClick: () => {
                setDeletedUserId(loopedUser.id), setModalOpen(!0);
              },
              children: "DELETE"
            }
          )
        ] }) })
      ] }, loopedUser.id)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(Modal_default, { open: modelOpen, children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "py-4", children: "Are you sure you want to delete this user?" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "modal-action", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
          import_react18.Form,
          {
            method: "post",
            onSubmit: () => {
              setModalOpen(!1);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("input", { type: "hidden", name: "uid", value: deletedUserID }),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                "button",
                {
                  className: "btn",
                  type: "submit",
                  disabled: isSubmitting,
                  children: isSubmitting ? "Confirming..." : "Confirm"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          "button",
          {
            className: "btn",
            disabled: isSubmitting,
            onClick: () => setModalOpen(!1),
            children: "Close"
          }
        )
      ] })
    ] })
  ] });
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
var import_jsx_runtime16 = require("react/jsx-runtime"), meta7 = () => [{ title: `${SITE_TITLE} - Customers` }], loader8 = async ({ request }) => {
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
  let { customers } = (0, import_react20.useLoaderData)(), data = (0, import_react20.useActionData)(), navigation = (0, import_react20.useNavigation)(), [deletedCustomerID, setDeletedCustomerID] = (0, import_react21.useState)(0), [deleteModelOpen, setDeleteModalOpen] = (0, import_react21.useState)(!1), [createModalOpen, setCreateModalOpen] = (0, import_react21.useState)(!1);
  return (0, import_react21.useEffect)(() => {
    data && (data.customerCreated && setCreateModalOpen(!1), data.customerDeleted && setDeleteModalOpen(!1));
  }, [data]), /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: contentBodyClass, children: [
    customers && customers.length ? /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("table", { className: "table static", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("tr", { className: "hidden md:table-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("th", { children: "ID" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("th", { children: "Name" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("th", { children: "Tel" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("th", { children: "Email" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("th", { children: "Address" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("th", { className: "md:text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("tbody", { children: customers && customers.map(
        ({ customer_id, name, tel, email, address }) => /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("tr", { className: resTRClass, children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("td", { "data-label": "ID", className: resTDClass, children: customer_id }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("td", { "data-label": "Name", className: resTDClass, children: name }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("td", { "data-label": "Tel", className: resTDClass, children: tel }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("td", { "data-label": "Email", className: resTDClass, children: email }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("td", { "data-label": "Address", className: resTDClass, children: address }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            "td",
            {
              "data-label": "Actions",
              className: `${resTDClass} md:text-right`,
              children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
                "button",
                {
                  className: "btn",
                  onClick: () => {
                    setDeletedCustomerID(customer_id), setDeleteModalOpen(!0);
                  },
                  children: "DELETE"
                }
              )
            }
          )
        ] }, customer_id)
      ) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "text-center", children: "No customers found..." }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "button",
      {
        className: "btn",
        onClick: () => {
          setCreateModalOpen(!0);
        },
        children: "Add new customer +"
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(Modal_default, { open: createModalOpen, children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("h3", { className: "mb-4", children: "Create new customer" }),
      createModalOpen && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        CreateCustomerForm_default,
        {
          actionName: "create",
          navigation,
          formErrors: data == null ? void 0 : data.createActionErrors,
          onCancel: () => {
            setCreateModalOpen(!1), data && (data.createActionErrors = {});
          }
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(Modal_default, { open: deleteModelOpen, children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "py-4", children: "Are you sure you want to delete this customer?" }),
      data && data.deleteActionsErrors && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "text-error mt-1 text-xs", children: data.deleteActionsErrors.info }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "modal-action", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_react20.Form, { replace: !0, method: "post", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("input", { type: "hidden", name: "customer_id", value: deletedCustomerID }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            "button",
            {
              className: "btn",
              type: "submit",
              name: "_action",
              value: "delete",
              disabled: navigation.state === "submitting",
              children: navigation.state === "submitting" ? "Confirming..." : "Confirm"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          "button",
          {
            className: "btn",
            disabled: navigation.state === "submitting",
            onClick: () => setDeleteModalOpen(!1),
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] });
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
var import_jsx_runtime17 = require("react/jsx-runtime"), meta8 = () => [{ title: `${SITE_TITLE} - Products` }], loader9 = async ({ request }) => {
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
  } = (0, import_react22.useLoaderData)(), data = (0, import_react22.useActionData)(), navigation = (0, import_react22.useNavigation)(), [deletedProductID, setDeletedProductID] = (0, import_react23.useState)(0), [deleteModelOpen, setDeleteModalOpen] = (0, import_react23.useState)(!1), [createModalOpen, setCreateModalOpen] = (0, import_react23.useState)(!1);
  return (0, import_react23.useEffect)(() => {
    data && (data.productCreated && setCreateModalOpen(!1), data.productDeleted && setDeleteModalOpen(!1));
  }, [data]), (0, import_react23.useEffect)(() => {
    data && (data.productCreated && setCreateModalOpen(!1), data.productDeleted && setDeleteModalOpen(!1));
  }, [data]), /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: contentBodyClass, children: [
    products && products.length ? /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("table", { className: "table static", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("tr", { className: "hidden md:table-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("th", { children: "ID" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("th", { children: "Brand" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("th", { children: "Type" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("th", { children: "Model" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("th", { children: "Price" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("th", { className: "md:text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("tbody", { children: products && products.map((loopedProducts) => /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("tr", { className: resTRClass, children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("td", { "data-label": "ID", className: resTDClass, children: loopedProducts.product_id }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("td", { "data-label": "Brand", className: resTDClass, children: loopedProducts.brand.brand_name }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("td", { "data-label": "Type", className: resTDClass, children: loopedProducts.type.type_name }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("td", { "data-label": "Model", className: resTDClass, children: loopedProducts.model.model_name }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("td", { "data-label": "Price", className: resTDClass, children: [
          "\xA3",
          loopedProducts.price
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          "td",
          {
            "data-label": "Actions",
            className: `${resTDClass} md:text-right`,
            children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
              "button",
              {
                className: "btn",
                onClick: () => {
                  setDeletedProductID(loopedProducts.product_id), setDeleteModalOpen(!0);
                },
                children: "DELETE"
              }
            )
          }
        )
      ] }, loopedProducts.product_id)) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "text-center", children: "No products found..." }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
      "button",
      {
        className: "btn",
        onClick: () => {
          setCreateModalOpen(!0);
        },
        children: "Add new product +"
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(Modal_default, { open: createModalOpen, children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("h3", { className: "mb-4", children: "Create new product" }),
      createModalOpen && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
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
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(Modal_default, { open: deleteModelOpen, children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("p", { className: "py-4", children: [
        "Are you sure you want to delete this product?",
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("br", {}),
        "NOTE: this doesn't delete the associated brand, model and type"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "modal-action", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_react22.Form, { replace: !0, method: "post", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("input", { type: "hidden", name: "product_id", value: deletedProductID }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            "button",
            {
              className: "btn",
              type: "submit",
              name: "_action",
              value: "delete",
              disabled: navigation.state === "submitting",
              children: navigation.state === "submitting" ? "Confirming..." : "Confirm"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          "button",
          {
            className: "btn",
            disabled: navigation.state === "submitting",
            onClick: () => setDeleteModalOpen(!1),
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => IndexRoute,
  loader: () => loader10,
  meta: () => meta9
});
var import_node13 = require("@remix-run/node");
var import_jsx_runtime18 = require("react/jsx-runtime"), meta9 = () => [{ title: SITE_TITLE }], loader10 = async ({ request }) => await getUserId(request) ? {} : (0, import_node13.redirect)("/login");
function IndexRoute() {
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: contentBodyClass, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { children: "Welcome to Smart CCTV admin" }) });
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
var import_jsx_runtime19 = require("react/jsx-runtime");
function Quotes() {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: contentBodyClass, children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_react_router.Outlet, {}) });
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action8,
  default: () => Login,
  meta: () => meta10
});
var import_node14 = require("@remix-run/node"), import_react24 = require("@remix-run/react"), import_bcryptjs3 = __toESM(require("bcryptjs"));
var import_jsx_runtime20 = require("react/jsx-runtime"), meta10 = () => [{ title: `${SITE_TITLE} - Login` }];
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
  let navigation = (0, import_react24.useNavigation)(), data = (0, import_react24.useActionData)();
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "grid place-items-center", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_react24.Form, { method: "post", className: formClass, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("fieldset", { disabled: navigation.state === "submitting", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("label", { className: "label", htmlFor: "email", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "label-text", children: "Email" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "input",
        {
          className: inputClass,
          name: "email",
          id: "email",
          type: "text",
          placeholder: "john@example.com"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("label", { className: "label", htmlFor: "password", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "label-text", children: "Password" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "input",
        {
          className: inputClass,
          name: "password",
          id: "password",
          type: "password",
          placeholder: "******************"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex justify-between items-center mt-6 mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("button", { className: "btn", type: "submit", children: navigation.state === "submitting" ? "Validating..." : "Log In" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "a",
        {
          href: "/users/register",
          className: "block link link-neutral-content",
          children: "Register"
        }
      ),
      data && data.message && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("label", { className: "label", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "label-text-alt text-error", children: data.message }) })
    ] })
  ] }) }) }) });
}

// app/routes/users.tsx
var users_exports = {};
__export(users_exports, {
  default: () => Users
});
var import_react_router2 = require("react-router");
var import_jsx_runtime21 = require("react/jsx-runtime");
function Users() {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: contentBodyClass, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_react_router2.Outlet, {}) });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-3HX66KA5.js", imports: ["/build/_shared/chunk-IHFEL2CD.js", "/build/_shared/chunk-XTGBAL5E.js", "/build/_shared/chunk-ADMCF34Z.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-OYJWHNJX.js", imports: ["/build/_shared/chunk-BRYEQANA.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-G3MNEDRJ.js", imports: ["/build/_shared/chunk-4P2AEKIR.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/customers": { id: "routes/customers", parentId: "root", path: "customers", index: void 0, caseSensitive: void 0, module: "/build/routes/customers-6O4UKSVV.js", imports: ["/build/_shared/chunk-XPUKSWXU.js", "/build/_shared/chunk-LWBMBOK4.js", "/build/_shared/chunk-4P2AEKIR.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-X423LJGD.js", imports: ["/build/_shared/chunk-4P2AEKIR.js", "/build/_shared/chunk-2UNAK4LT.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-76YZR4YI.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/products": { id: "routes/products", parentId: "root", path: "products", index: void 0, caseSensitive: void 0, module: "/build/routes/products-EME4T57X.js", imports: ["/build/_shared/chunk-7MZJJH37.js", "/build/_shared/chunk-LWBMBOK4.js", "/build/_shared/chunk-4P2AEKIR.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/quotes": { id: "routes/quotes", parentId: "root", path: "quotes", index: void 0, caseSensitive: void 0, module: "/build/routes/quotes-FZKCCOQC.js", imports: ["/build/_shared/chunk-4P2AEKIR.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/quotes.$quoteid": { id: "routes/quotes.$quoteid", parentId: "routes/quotes", path: ":quoteid", index: void 0, caseSensitive: void 0, module: "/build/routes/quotes.$quoteid-VSDN6EYP.js", imports: ["/build/_shared/chunk-LWBMBOK4.js", "/build/_shared/chunk-BRYEQANA.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/quotes.$quoteid.generatedquote": { id: "routes/quotes.$quoteid.generatedquote", parentId: "routes/quotes.$quoteid", path: "generatedquote", index: void 0, caseSensitive: void 0, module: "/build/routes/quotes.$quoteid.generatedquote-QPZYVFFW.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/quotes._index": { id: "routes/quotes._index", parentId: "routes/quotes", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/quotes._index-6SF54HG2.js", imports: ["/build/_shared/chunk-BRYEQANA.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/quotes.create": { id: "routes/quotes.create", parentId: "routes/quotes", path: "create", index: void 0, caseSensitive: void 0, module: "/build/routes/quotes.create-AM6QBLJD.js", imports: ["/build/_shared/chunk-XPUKSWXU.js", "/build/_shared/chunk-7MZJJH37.js", "/build/_shared/chunk-LWBMBOK4.js", "/build/_shared/chunk-BRYEQANA.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/users": { id: "routes/users", parentId: "root", path: "users", index: void 0, caseSensitive: void 0, module: "/build/routes/users-B3IO5O7O.js", imports: ["/build/_shared/chunk-4P2AEKIR.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/users.$userid": { id: "routes/users.$userid", parentId: "routes/users", path: ":userid", index: void 0, caseSensitive: void 0, module: "/build/routes/users.$userid-6DDVDV7O.js", imports: ["/build/_shared/chunk-2UNAK4LT.js", "/build/_shared/chunk-BRYEQANA.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/users._index": { id: "routes/users._index", parentId: "routes/users", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/users._index-CSETRNO7.js", imports: ["/build/_shared/chunk-LWBMBOK4.js", "/build/_shared/chunk-BRYEQANA.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/users.register": { id: "routes/users.register", parentId: "routes/users", path: "register", index: void 0, caseSensitive: void 0, module: "/build/routes/users.register-C3ASYYT6.js", imports: ["/build/_shared/chunk-2UNAK4LT.js", "/build/_shared/chunk-BRYEQANA.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, version: "2afe5c15", hmr: void 0, url: "/build/manifest-2AFE5C15.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", future = { v2_dev: !0, unstable_postcss: !1, unstable_tailwind: !1, v2_errorBoundary: !0, v2_headers: !0, v2_meta: !0, v2_normalizeFormMethod: !0, v2_routeConvention: !0 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
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
  entry,
  future,
  publicPath,
  routes
});
