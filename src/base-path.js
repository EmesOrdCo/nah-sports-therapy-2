// The site uses root-absolute paths ("/pilates", "/images/...") but GitHub Pages
// serves it from a subfolder. These helpers translate between the two at runtime,
// so the content modules can keep writing plain absolute paths.

// "/nah-sports-therapy-2" in the Pages build, "" when served from a domain root.
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");

/** Strip the deploy base off a pathname so it can be matched against a route. */
export function routePath(pathname = window.location.pathname) {
  if (!BASE) return pathname;
  if (pathname === BASE) return "/";
  return pathname.startsWith(`${BASE}/`) ? pathname.slice(BASE.length) : pathname;
}

/** Prefix a root-absolute path with the deploy base. */
export function withBase(path) {
  if (!BASE || !path.startsWith("/") || path.startsWith("//")) return path;
  return path.startsWith(`${BASE}/`) ? path : `${BASE}${path}`;
}

const URL_ATTRIBUTES = ["href", "src", "data", "poster"];

// Only write when the value actually changes — a no-op setAttribute would
// retrigger the MutationObserver below and spin forever.
function setIfChanged(element, attribute, value) {
  if (value !== element.getAttribute(attribute)) {
    element.setAttribute(attribute, value);
  }
}

function rewriteElement(element) {
  if (!element.getAttribute) return;
  URL_ATTRIBUTES.forEach((attribute) => {
    const value = element.getAttribute(attribute);
    if (value) setIfChanged(element, attribute, withBase(value));
  });
  const srcset = element.getAttribute("srcset");
  if (srcset) {
    setIfChanged(
      element,
      "srcset",
      srcset
        .split(",")
        .map((candidate) => {
          const [url, ...descriptor] = candidate.trim().split(/\s+/);
          return [withBase(url), ...descriptor].join(" ");
        })
        .join(", "),
    );
  }
}

/** Rewrite every absolute URL inside `root` (and on `root` itself). */
export function applyBase(root) {
  if (!BASE || !root) return;
  if (root.nodeType === Node.ELEMENT_NODE) rewriteElement(root);
  root
    .querySelectorAll?.("[href], [src], [data], [poster], [srcset]")
    .forEach(rewriteElement);
}

/** Keep rewriting as the app injects markup after the initial render. */
export function observeBase() {
  if (!BASE) return;
  applyBase(document);
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") mutation.addedNodes.forEach(applyBase);
      else applyBase(mutation.target);
    });
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [...URL_ATTRIBUTES, "srcset"],
  });
}
