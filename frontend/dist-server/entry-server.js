var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a, _b;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import { QueryClientProvider, useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import React3, { Component, createContext, useState, useEffect, useCallback, useMemo, useContext } from "react";
import fastCompare from "react-fast-compare";
import invariant from "invariant";
import shallowEqual from "shallowequal";
import { useLocation, Link, useParams, useNavigate, Navigate, Routes, Route } from "react-router-dom";
var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
  return TAG_NAMES2;
})(TAG_NAMES || {});
var SEO_PRIORITY_TAGS = {
  link: { rel: ["amphtml", "canonical", "alternate"] },
  script: { type: ["application/ld+json"] },
  meta: {
    charset: "",
    name: ["generator", "robots", "description"],
    property: [
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site"
    ]
  }
};
var VALID_TAG_NAMES = Object.values(TAG_NAMES);
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
  (carry, [key, value]) => {
    carry[value] = key;
    return carry;
  },
  {}
);
var HELMET_ATTRIBUTE = "data-rh";
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate",
  PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
};
var getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];
    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }
  return null;
};
var getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(
    propsList,
    "title"
    /* TITLE */
  );
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join("");
  }
  if (innermostTemplate && innermostTitle) {
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }
  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
  return innermostTitle || innermostDefaultTitle || void 0;
};
var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
});
var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});
var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props[
  "base"
  /* BASE */
] !== "undefined").map((props) => props[
  "base"
  /* BASE */
]).reverse().reduce((innermostBaseTag, tag) => {
  if (!innermostBaseTag.length) {
    const keys = Object.keys(tag);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const lowerCaseAttributeKey = attributeKey.toLowerCase();
      if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
        return innermostBaseTag.concat(tag);
      }
    }
  }
  return innermostBaseTag;
}, []);
var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  const approvedSeenTags = {};
  return propsList.filter((props) => {
    if (Array.isArray(props[tagName])) {
      return true;
    }
    if (typeof props[tagName] !== "undefined") {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
      );
    }
    return false;
  }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
    const instanceSeenTags = {};
    instanceTags.filter((tag) => {
      let primaryAttributeKey;
      const keys2 = Object.keys(tag);
      for (let i = 0; i < keys2.length; i += 1) {
        const attributeKey = keys2[i];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
          primaryAttributeKey = lowerCaseAttributeKey;
        }
        if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" || attributeKey === "cssText" || attributeKey === "itemprop")) {
          primaryAttributeKey = attributeKey;
        }
      }
      if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
        return false;
      }
      const value = tag[primaryAttributeKey].toLowerCase();
      if (!approvedSeenTags[primaryAttributeKey]) {
        approvedSeenTags[primaryAttributeKey] = {};
      }
      if (!instanceSeenTags[primaryAttributeKey]) {
        instanceSeenTags[primaryAttributeKey] = {};
      }
      if (!approvedSeenTags[primaryAttributeKey][value]) {
        instanceSeenTags[primaryAttributeKey][value] = true;
        return true;
      }
      return false;
    }).reverse().forEach((tag) => approvedTags.push(tag));
    const keys = Object.keys(instanceSeenTags);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const tagUnion = {
        ...approvedSeenTags[attributeKey],
        ...instanceSeenTags[attributeKey]
      };
      approvedSeenTags[attributeKey] = tagUnion;
    }
    return approvedTags;
  }, []).reverse();
};
var getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
var reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList([
    "href"
    /* HREF */
  ], propsList),
  bodyAttributes: getAttributesFromPropsList("bodyAttributes", propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList("htmlAttributes", propsList),
  linkTags: getTagsFromPropsList(
    "link",
    [
      "rel",
      "href"
      /* HREF */
    ],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    "meta",
    [
      "name",
      "charset",
      "http-equiv",
      "property",
      "itemprop"
      /* ITEM_PROP */
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList("noscript", [
    "innerHTML"
    /* INNER_HTML */
  ], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    "script",
    [
      "src",
      "innerHTML"
      /* INNER_HTML */
    ],
    propsList
  ),
  styleTags: getTagsFromPropsList("style", [
    "cssText"
    /* CSS_TEXT */
  ], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
});
var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
var checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};
var prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] }
    );
  }
  return { default: elementsList, priority: [] };
};
var without = (obj, key) => {
  return {
    ...obj,
    [key]: void 0
  };
};
var SELF_CLOSING_TAGS = [
  "noscript",
  "script",
  "style"
  /* STYLE */
];
var encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
  const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
  return str ? `${str} ${attr}` : attr;
}, "");
var generateTitleAsString = (type, title, attributes, encode) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title);
  return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>`;
};
var generateTagsAsString = (type, tags, encode = true) => tags.reduce((str, t) => {
  const tag = t;
  const attributeHtml = Object.keys(tag).filter(
    (attribute) => !(attribute === "innerHTML" || attribute === "cssText")
  ).reduce((string, attribute) => {
    const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
    return string ? `${string} ${attr}` : attr;
  }, "");
  const tagContent = tag.innerHTML || tag.cssText || "";
  const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
  return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
}, "");
var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
  const mapped = REACT_TAG_MAP[key];
  obj[mapped || key] = attributes[key];
  return obj;
}, initProps);
var generateTitleAsReactComponent = (_type, title, attributes) => {
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);
  return [React3.createElement("title", props, title)];
};
var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i) => {
  const mappedTag = {
    key: i,
    [HELMET_ATTRIBUTE]: true
  };
  Object.keys(tag).forEach((attribute) => {
    const mapped = REACT_TAG_MAP[attribute];
    const mappedAttribute = mapped || attribute;
    if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
      const content = tag.innerHTML || tag.cssText;
      mappedTag.dangerouslySetInnerHTML = { __html: content };
    } else {
      mappedTag[mappedAttribute] = tag[attribute];
    }
  });
  return React3.createElement(type, mappedTag);
});
var getMethodsForTag = (type, tags, encode = true) => {
  switch (type) {
    case "title":
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode)
      };
    case "bodyAttributes":
    case "htmlAttributes":
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags)
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode)
      };
  }
};
var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent("meta", meta.priority),
      ...generateTagsAsReactComponent("link", link.priority),
      ...generateTagsAsReactComponent("script", script.priority)
    ],
    toString: () => (
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag("meta", meta.priority, encode)} ${getMethodsForTag(
        "link",
        link.priority,
        encode
      )} ${getMethodsForTag("script", script.priority, encode)}`
    )
  };
  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default
  };
};
var mapStateOnServer = (props) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = "",
    titleAttributes,
    prioritizeSeoTags
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => {
    },
    toString: () => ""
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag("base", baseTag, encode),
    bodyAttributes: getMethodsForTag("bodyAttributes", bodyAttributes, encode),
    htmlAttributes: getMethodsForTag("htmlAttributes", htmlAttributes, encode),
    link: getMethodsForTag("link", linkTags, encode),
    meta: getMethodsForTag("meta", metaTags, encode),
    noscript: getMethodsForTag("noscript", noscriptTags, encode),
    script: getMethodsForTag("script", scriptTags, encode),
    style: getMethodsForTag("style", styleTags, encode),
    title: getMethodsForTag("title", { title, titleAttributes }, encode)
  };
};
var server_default = mapStateOnServer;
var instances = [];
var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var HelmetData = class {
  constructor(context, canUseDOM) {
    __publicField(this, "instances", []);
    __publicField(this, "canUseDOM", isDocument);
    __publicField(this, "context");
    __publicField(this, "value", {
      setHelmet: (serverState) => {
        this.context.helmet = serverState;
      },
      helmetInstances: {
        get: () => this.canUseDOM ? instances : this.instances,
        add: (instance) => {
          (this.canUseDOM ? instances : this.instances).push(instance);
        },
        remove: (instance) => {
          const index = (this.canUseDOM ? instances : this.instances).indexOf(instance);
          (this.canUseDOM ? instances : this.instances).splice(index, 1);
        }
      }
    });
    this.context = context;
    this.canUseDOM = canUseDOM || false;
    if (!canUseDOM) {
      context.helmet = server_default({
        baseTag: [],
        bodyAttributes: {},
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: "",
        titleAttributes: {}
      });
    }
  }
};
var defaultValue = {};
var Context = React3.createContext(defaultValue);
var HelmetProvider = (_a = class extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "helmetData");
    this.helmetData = new HelmetData(this.props.context || {}, _a.canUseDOM);
  }
  render() {
    return /* @__PURE__ */ React3.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
  }
}, __publicField(_a, "canUseDOM", isDocument), _a);
var updateTags = (type, tags) => {
  const headElement = document.head || document.querySelector(
    "head"
    /* HEAD */
  );
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;
  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === "innerHTML") {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === "cssText") {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText;
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText));
            }
          } else {
            const attr = attribute;
            const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
            newElement.setAttribute(attribute, value);
          }
        }
      }
      newElement.setAttribute(HELMET_ATTRIBUTE, "true");
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      })) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }
  oldTags.forEach((tag) => {
    var _a2;
    return (_a2 = tag.parentNode) == null ? void 0 : _a2.removeChild(tag);
  });
  newTags.forEach((tag) => headElement.appendChild(tag));
  return {
    oldTags,
    newTags
  };
};
var updateAttributes = (tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];
  if (!elementTag) {
    return;
  }
  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);
  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || "";
    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }
    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }
    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }
  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }
  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
  }
};
var updateTitle = (title, attributes) => {
  if (typeof title !== "undefined" && document.title !== title) {
    document.title = flattenArray(title);
  }
  updateAttributes("title", attributes);
};
var commitTagChanges = (newState, cb) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes
  } = newState;
  updateAttributes("body", bodyAttributes);
  updateAttributes("html", htmlAttributes);
  updateTitle(title, titleAttributes);
  const tagUpdates = {
    baseTag: updateTags("base", baseTag),
    linkTags: updateTags("link", linkTags),
    metaTags: updateTags("meta", metaTags),
    noscriptTags: updateTags("noscript", noscriptTags),
    scriptTags: updateTags("script", scriptTags),
    styleTags: updateTags("style", styleTags)
  };
  const addedTags = {};
  const removedTags = {};
  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];
    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });
  if (cb) {
    cb();
  }
  onChangeClientState(newState, addedTags, removedTags);
};
var _helmetCallback = null;
var handleStateChangeOnClient = (newState) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }
  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};
var client_default = handleStateChangeOnClient;
var HelmetDispatcher = class extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "rendered", false);
  }
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.emitChange();
  }
  componentWillUnmount() {
    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }
  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance) => {
        const props = { ...instance.props };
        delete props.context;
        return props;
      })
    );
    if (HelmetProvider.canUseDOM) {
      client_default(state);
    } else if (server_default) {
      serverState = server_default(state);
    }
    setHelmet(serverState);
  }
  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }
  render() {
    this.init();
    return null;
  }
};
var Helmet = (_b = class extends Component {
  shouldComponentUpdate(nextProps) {
    return !fastCompare(without(this.props, "helmetData"), without(nextProps, "helmetData"));
  }
  mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
      return null;
    }
    switch (child.type) {
      case "script":
      case "noscript":
        return {
          innerHTML: nestedChildren
        };
      case "style":
        return {
          cssText: nestedChildren
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }
  flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...arrayTypeChildren[child.type] || [],
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren)
        }
      ]
    };
  }
  mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
    switch (child.type) {
      case "title":
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps }
        };
      case "body":
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps }
        };
      case "html":
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps }
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps }
        };
    }
  }
  mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = { ...newProps };
    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName]
      };
    });
    return newFlattenedProps;
  }
  warnOnInvalidChildren(child, nestedChildren) {
    invariant(
      VALID_TAG_NAMES.some((name) => child.type === name),
      typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
        ", "
      )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
    );
    invariant(
      !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );
    return true;
  }
  mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};
    React3.Children.forEach(children, (child) => {
      if (!child || !child.props) {
        return;
      }
      const { children: nestedChildren, ...childProps } = child.props;
      const newChildProps = Object.keys(childProps).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});
      let { type } = child;
      if (typeof type === "symbol") {
        type = type.toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }
      switch (type) {
        case "Symbol(react.fragment)":
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;
        case "link":
        case "meta":
        case "noscript":
        case "script":
        case "style":
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;
        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });
    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }
  render() {
    const { children, ...props } = this.props;
    let newProps = { ...props };
    let { helmetData } = props;
    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }
    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }
    return helmetData ? /* @__PURE__ */ React3.createElement(HelmetDispatcher, { ...newProps, context: helmetData.value }) : /* @__PURE__ */ React3.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ React3.createElement(HelmetDispatcher, { ...newProps, context }));
  }
}, __publicField(_b, "defaultProps", {
  defer: true,
  encodeSpecialCharacters: true,
  prioritizeSeoTags: false
}), _b);
const STORAGE_KEY = "toikhana.lang";
const ru = {
  "lang.ru": "Рус",
  "lang.kk": "Қаз",
  "nav.home": "Главная",
  "nav.blog": "Блог",
  "nav.add": "Разместить тойхану",
  "nav.about": "О проекте",
  "nav.contacts": "Контакты",
  "nav.login": "Войти",
  "nav.register": "Регистрация",
  "nav.account": "Кабинет",
  "nav.logout": "Выйти",
  "nav.allCities": "Все города",
  "nav.menu": "Меню",
  "header.subtitle": "Каталог тойхан Казахстана",
  "hero.title": "Найдите тойхану мечты по всему Казахстану",
  "hero.subtitle": "Сравнивайте банкетные залы по городу, вместимости и цене. Оставьте заявку или свяжитесь с владельцем — бесплатно.",
  "hero.cta.add": "Разместить тойхану",
  "hero.cta.how": "Как это работает",
  "hero.selectCity": "Выберите город",
  "hero.feature.search": "Быстрый поиск",
  "hero.feature.fast": "Заявка за 1 минуту",
  "hero.feature.call": "Звонок / WhatsApp",
  "hero.feature.cities": "городов",
  "trust.cities": "Городов в базе",
  "trust.toikhanas": "Тойхан в каталоге",
  "trust.featured": "Топ-объектов",
  "how.eyebrow": "Как это работает",
  "how.title": "3 шага до зала",
  "how.step1": "Выберите город и формат тоя",
  "how.step2": "Сравните залы по фото, вместимости и цене",
  "how.step3": "Позвоните или оставьте заявку владельцу",
  "owner.eyebrow": "Для владельцев",
  "owner.title": "Разместите свою тойхану бесплатно",
  "owner.text": "Получайте заявки из каталога, показывайте фото и увеличивайте бронирования. Для старта достаточно оставить контакты и данные о зале.",
  "owner.button": "Подать заявку",
  "faq.eyebrow": "Вопросы",
  "faq.title": "Частые вопросы",
  "faq.q1": "Как забронировать зал?",
  "faq.a1": "Выберите зал, свяжитесь с владельцем и оставьте заявку через форму.",
  "faq.q2": "Это бесплатно?",
  "faq.a2": "Для гостей да. Для владельцев есть отдельная заявка на размещение.",
  "faq.q3": "Есть ли фото?",
  "faq.a3": "Да, в карточках и на странице зала.",
  "faq.q4": "Можно ли искать по вместимости?",
  "faq.a4": "Да, это основной фильтр каталога.",
  "faq.q5": "В каких городах вы работаете?",
  "faq.a5": "По всем крупным городам Казахстана — от Астаны и Алматы до областных центров.",
  "cities.eyebrow": "Города",
  "cities.title": "Начните с города",
  "cities.search": "Поиск города…",
  "cities.unit": "тойхана",
  "cities.notFound": "Город не найден",
  "cities.notFoundText": "Попробуйте изменить запрос.",
  "featured.eyebrow": "Топ",
  "featured.title": "Выбор редакции",
  "featured.how": "Как выбираем",
  "types.eyebrow": "Форматы",
  "types.title": "Для какого тоя?",
  "seo.eyebrow": "О каталоге",
  "seo.body": "toikhana.kz помогает быстро найти тойханы и банкетные залы по всем городам Казахстана: Астана, Алматы, Шымкент, Караганда, Актобе, Атырау и другие. Фильтруйте по вместимости, цене и типу торжества — свадьба, день рождения, корпоратив или сватовство.",
  "footer.tagline": "Каталог тойхан Казахстана. Ищите залы по городу, вместимости и цене, сравнивайте и оставляйте заявки.",
  "footer.nav": "Навигация",
  "footer.cities": "Города",
  "footer.contact": "Связь",
  "footer.rights": "все города Казахстана",
  "filter.capacity": "Вместимость (гостей)",
  "filter.capacityPlaceholder": "Например 200",
  "filter.type": "Тип тоя",
  "filter.anyType": "Любой тип",
  "type.svadba": "Свадьба",
  "type.kudalyk": "Сватовство",
  "type.birthday": "День рождения",
  "type.corporate": "Корпоратив",
  "catalog.eyebrow": "Каталог",
  "catalog.count": "вариантов",
  "card.guests": "гостей",
  "card.from": "от",
  "card.photoSoon": "Фото скоро появится",
  "card.top": "Топ",
  "card.empty": "Ничего не найдено",
  "card.emptyText": "Попробуйте другой город или фильтр.",
  "similar.title": "Похожие тойханы",
  "contact.call": "Позвонить",
  "booking.title": "Оставить заявку",
  "booking.name": "Ваше имя",
  "booking.phone": "Телефон",
  "booking.guests": "Количество гостей",
  "booking.comment": "Комментарий",
  "booking.submit": "Отправить заявку",
  "booking.done": "Заявка отправлена! Владелец свяжется с вами.",
  "auth.login.title": "Вход в аккаунт",
  "auth.login.subtitle": "Войдите по email и паролю.",
  "auth.login.email": "Email",
  "auth.login.password": "Пароль",
  "auth.login.submit": "Войти",
  "auth.login.error": "Не удалось войти. Проверьте email и пароль.",
  "auth.login.noAccount": "Нет аккаунта?",
  "auth.login.registerLink": "Зарегистрироваться",
  "auth.register.title": "Создать аккаунт",
  "auth.register.subtitle": "Зарегистрируйтесь, чтобы сохранять залы и быстрее оставлять заявки.",
  "auth.register.name": "Имя",
  "auth.register.email": "Email",
  "auth.register.phone": "Телефон",
  "auth.register.password": "Пароль (минимум 6 символов)",
  "auth.register.submit": "Зарегистрироваться",
  "auth.register.haveAccount": "Уже есть аккаунт?",
  "auth.register.loginLink": "Войти",
  "auth.register.error": "Не удалось зарегистрироваться. Возможно, email уже занят.",
  "auth.register.success": "Аккаунт создан. Добро пожаловать!",
  "auth.account.title": "Личный кабинет",
  "auth.account.hello": "Здравствуйте",
  "auth.account.email": "Email",
  "auth.account.phone": "Телефон",
  "auth.account.logout": "Выйти",
  "owner.page.eyebrow": "Для владельцев",
  "owner.page.title": "Заявка на подключение тойханы",
  "owner.page.text": "Оставьте контакты — и мы вернёмся с предложением по размещению вашего зала в каталоге.",
  "owner.page.formTitle": "Заявка на размещение",
  "owner.page.formDesc": "Это не кабинет администратора. Это рабочая форма для новых владельцев тойхан.",
  "owner.page.success": "Заявка отправлена. Мы свяжемся с вами.",
  "ownerForm.name": "Ваше имя",
  "ownerForm.selectCity": "Выберите город",
  "ownerForm.hallName": "Название зала",
  "ownerForm.phone": "Телефон",
  "ownerForm.whatsapp": "WhatsApp",
  "ownerForm.message": "Коротко расскажите о зале или задаче",
  "ownerForm.submit": "Отправить заявку",
  "about.eyebrow": "О проекте",
  "about.title": "Каталог тойхан для Казахстана",
  "about.text": "Мы делаем понятный каталог залов для тоя: быстрый поиск, карточки с фото, фильтры, заявки и отдельный поток для владельцев.",
  "contacts.eyebrow": "Контакты",
  "contacts.title": "Свяжитесь с нами",
  "blog.eyebrow": "Блог",
  "blog.title": "Полезное об организации тоя",
  "blog.intro": "Советы по выбору тойханы, ценам и подготовке к свадьбе, дню рождения и другим торжествам в Казахстане.",
  "blog.read": "Читать →",
  "blog.empty": "Статей пока нет",
  "blog.emptyText": "Загляните позже — мы готовим полезные материалы.",
  "blog.notFound": "Статья не найдена",
  "blog.notFoundText": "Возможно, ссылка устарела.",
  "blog.back": "← Назад в блог",
  "blog.all": "← Все статьи",
  "city.titlePrefix": "Тойхана",
  "city.titleAll": "Тойханалар",
  "city.empty": "Залов пока нет",
  "city.emptyText": "Попробуйте другой город или другой фильтр.",
  "toikhana.descTitle": "Описание",
  "toikhana.typesTitle": "Типы тоя"
};
const kk = {
  "lang.ru": "Рус",
  "lang.kk": "Қаз",
  "nav.home": "Басты бет",
  "nav.blog": "Блог",
  "nav.add": "Тойхана қосу",
  "nav.about": "Жоба туралы",
  "nav.contacts": "Байланыс",
  "nav.login": "Кіру",
  "nav.register": "Тіркелу",
  "nav.account": "Кабинет",
  "nav.logout": "Шығу",
  "nav.allCities": "Барлық қалалар",
  "nav.menu": "Мәзір",
  "header.subtitle": "Қазақстан тойханаларының каталогы",
  "hero.title": "Қазақстан бойынша арман тойхананы табыңыз",
  "hero.subtitle": "Банкет залдарын қала, сыйымдылық және баға бойынша салыстырыңыз. Өтінім қалдырыңыз немесе иесімен тікелей байланысыңыз — тегін.",
  "hero.cta.add": "Тойхана қосу",
  "hero.cta.how": "Қалай жұмыс істейді",
  "hero.selectCity": "Қаланы таңдаңыз",
  "hero.feature.search": "Жылдам іздеу",
  "hero.feature.fast": "1 минутта өтінім",
  "hero.feature.call": "Қоңырау / WhatsApp",
  "hero.feature.cities": "қала",
  "trust.cities": "Базадағы қалалар",
  "trust.toikhanas": "Каталогтағы тойханалар",
  "trust.featured": "Үздік нысандар",
  "how.eyebrow": "Қалай жұмыс істейді",
  "how.title": "Залға дейін 3 қадам",
  "how.step1": "Қала мен той форматын таңдаңыз",
  "how.step2": "Залдарды фото, сыйымдылық және баға бойынша салыстырыңыз",
  "how.step3": "Қоңырау шалыңыз немесе иесіне өтінім қалдырыңыз",
  "owner.eyebrow": "Иелерге",
  "owner.title": "Өз тойханаңызды тегін орналастырыңыз",
  "owner.text": "Каталогтан өтінімдер алыңыз, фото көрсетіңіз және брондауды арттырыңыз. Бастау үшін байланыс пен зал туралы мәлімет жеткілікті.",
  "owner.button": "Өтінім беру",
  "faq.eyebrow": "Сұрақтар",
  "faq.title": "Жиі қойылатын сұрақтар",
  "faq.q1": "Залды қалай брондауға болады?",
  "faq.a1": "Залды таңдаңыз, иесімен байланысып, форма арқылы өтінім қалдырыңыз.",
  "faq.q2": "Бұл тегін бе?",
  "faq.a2": "Қонақтар үшін иә. Иелер үшін бөлек орналастыру өтінімі бар.",
  "faq.q3": "Фото бар ма?",
  "faq.a3": "Иә, карточкаларда және зал бетінде.",
  "faq.q4": "Сыйымдылық бойынша іздеуге бола ма?",
  "faq.a4": "Иә, бұл каталогтың негізгі сүзгісі.",
  "faq.q5": "Қай қалаларда жұмыс істейсіздер?",
  "faq.a5": "Қазақстанның барлық ірі қалаларында — Астана мен Алматыдан облыс орталықтарына дейін.",
  "cities.eyebrow": "Қалалар",
  "cities.title": "Қаладан бастаңыз",
  "cities.search": "Қала іздеу…",
  "cities.unit": "тойхана",
  "cities.notFound": "Қала табылмады",
  "cities.notFoundText": "Сұранысты өзгертіп көріңіз.",
  "featured.eyebrow": "Үздік",
  "featured.title": "Редакция таңдауы",
  "featured.how": "Қалай таңдаймыз",
  "types.eyebrow": "Форматтар",
  "types.title": "Қандай тойға?",
  "seo.eyebrow": "Каталог туралы",
  "seo.body": "toikhana.kz Қазақстанның барлық қалалары бойынша тойханалар мен банкет залдарын жылдам табуға көмектеседі: Астана, Алматы, Шымкент, Қарағанды, Ақтөбе, Атырау және басқалары. Сыйымдылық, баға және той түрі бойынша сүзіңіз — үйлену тойы, туған күн, корпоратив немесе құдалық.",
  "footer.tagline": "Қазақстан тойханаларының каталогы. Залдарды қала, сыйымдылық және баға бойынша іздеп, салыстырып, өтінім қалдырыңыз.",
  "footer.nav": "Навигация",
  "footer.cities": "Қалалар",
  "footer.contact": "Байланыс",
  "footer.rights": "Қазақстанның барлық қалалары",
  "filter.capacity": "Сыйымдылық (қонақ)",
  "filter.capacityPlaceholder": "Мысалы 200",
  "filter.type": "Той түрі",
  "filter.anyType": "Кез келген түрі",
  "type.svadba": "Үйлену тойы",
  "type.kudalyk": "Құдалық",
  "type.birthday": "Туған күн",
  "type.corporate": "Корпоратив",
  "catalog.eyebrow": "Каталог",
  "catalog.count": "нұсқа",
  "card.guests": "қонақ",
  "card.from": "бастап",
  "card.photoSoon": "Фото жақында",
  "card.top": "Үздік",
  "card.empty": "Ештеңе табылмады",
  "card.emptyText": "Басқа қаланы немесе сүзгіні таңдап көріңіз.",
  "similar.title": "Ұқсас тойханалар",
  "contact.call": "Қоңырау шалу",
  "booking.title": "Өтінім қалдыру",
  "booking.name": "Атыңыз",
  "booking.phone": "Телефон",
  "booking.guests": "Қонақ саны",
  "booking.comment": "Түсініктеме",
  "booking.submit": "Өтінім жіберу",
  "booking.done": "Өтінім жіберілді! Иесі сізбен байланысады.",
  "auth.login.title": "Аккаунтқа кіру",
  "auth.login.subtitle": "Email пен құпиясөз арқылы кіріңіз.",
  "auth.login.email": "Email",
  "auth.login.password": "Құпиясөз",
  "auth.login.submit": "Кіру",
  "auth.login.error": "Кіру сәтсіз. Email мен құпиясөзді тексеріңіз.",
  "auth.login.noAccount": "Аккаунт жоқ па?",
  "auth.login.registerLink": "Тіркелу",
  "auth.register.title": "Аккаунт құру",
  "auth.register.subtitle": "Залдарды сақтау және өтінімдерді жылдам қалдыру үшін тіркеліңіз.",
  "auth.register.name": "Аты-жөні",
  "auth.register.email": "Email",
  "auth.register.phone": "Телефон",
  "auth.register.password": "Құпиясөз (кемінде 6 таңба)",
  "auth.register.submit": "Тіркелу",
  "auth.register.haveAccount": "Аккаунт бар ма?",
  "auth.register.loginLink": "Кіру",
  "auth.register.error": "Тіркелу сәтсіз. Бұл email бұрыннан тіркелген болуы мүмкін.",
  "auth.register.success": "Аккаунт құрылды. Қош келдіңіз!",
  "auth.account.title": "Жеке кабинет",
  "auth.account.hello": "Сәлеметсіз бе",
  "auth.account.email": "Email",
  "auth.account.phone": "Телефон",
  "auth.account.logout": "Шығу",
  "owner.page.eyebrow": "Иелерге",
  "owner.page.title": "Тойхананы қосуға өтінім",
  "owner.page.text": "Байланысыңызды қалдырыңыз — біз залыңызды каталогқа орналастыру бойынша ұсыныспен қайта байланысамыз.",
  "owner.page.formTitle": "Орналастыруға өтінім",
  "owner.page.formDesc": "Бұл әкімші кабинеті емес. Бұл жаңа тойхана иелеріне арналған жұмыс формасы.",
  "owner.page.success": "Өтінім жіберілді. Біз сізбен байланысамыз.",
  "ownerForm.name": "Атыңыз",
  "ownerForm.selectCity": "Қаланы таңдаңыз",
  "ownerForm.hallName": "Зал атауы",
  "ownerForm.phone": "Телефон",
  "ownerForm.whatsapp": "WhatsApp",
  "ownerForm.message": "Зал немесе тапсырма туралы қысқаша жазыңыз",
  "ownerForm.submit": "Өтінім жіберу",
  "about.eyebrow": "Жоба туралы",
  "about.title": "Қазақстанға арналған тойханалар каталогы",
  "about.text": "Біз той залдарының түсінікті каталогын жасаймыз: жылдам іздеу, фотосы бар карточкалар, сүзгілер, өтінімдер және иелерге арналған бөлек ағын.",
  "contacts.eyebrow": "Байланыс",
  "contacts.title": "Бізбен байланысыңыз",
  "blog.eyebrow": "Блог",
  "blog.title": "Той ұйымдастыру туралы пайдалы",
  "blog.intro": "Тойхана таңдау, бағалар және үйлену тойына, туған күнге және басқа да салтанаттарға дайындық бойынша кеңестер.",
  "blog.read": "Оқу →",
  "blog.empty": "Әзірге мақалалар жоқ",
  "blog.emptyText": "Кейінірек қараңыз — біз пайдалы материалдар дайындап жатырмыз.",
  "blog.notFound": "Мақала табылмады",
  "blog.notFoundText": "Мүмкін, сілтеме ескірген.",
  "blog.back": "← Блогқа оралу",
  "blog.all": "← Барлық мақалалар",
  "city.titlePrefix": "Тойхана",
  "city.titleAll": "Тойханалар",
  "city.empty": "Әзірге залдар жоқ",
  "city.emptyText": "Басқа қаланы немесе сүзгіні таңдап көріңіз.",
  "toikhana.descTitle": "Сипаттама",
  "toikhana.typesTitle": "Той түрлері"
};
const DICTS = { ru, kk };
const I18nContext = createContext(null);
function readInitialLang() {
  if (typeof window === "undefined") return "ru";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "kk" ? "kk" : "ru";
}
function I18nProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);
  const setLang = useCallback((next) => setLangState(next), []);
  const value = useMemo(() => {
    const table = DICTS[lang];
    return {
      lang,
      setLang,
      t: (key) => table[key] ?? DICTS.ru[key] ?? key,
      loc: (ruValue, kkValue) => lang === "kk" ? kkValue || ruValue || "" : ruValue || kkValue || ""
    };
  }, [lang, setLang]);
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value, children });
}
function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
const API_BASE = "";
async function request(path, init) {
  const headers = {
    "Content-Type": "application/json",
    ...(init == null ? void 0 : init.headers) ?? {},
    ...getUserAuthHeader(),
    ...getAdminAuthHeader()
  };
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? `Request failed: ${response.status}`);
  }
  return response.json();
}
function getAdminAuthHeader() {
  const auth = localStorage.getItem("toikhana.adminAuth");
  return auth ? { Authorization: `Basic ${auth}` } : {};
}
function setAdminAuth(username, password) {
  localStorage.setItem("toikhana.adminAuth", btoa(`${username}:${password}`));
}
function clearAdminAuth() {
  localStorage.removeItem("toikhana.adminAuth");
}
const TOKEN_KEY = "toikhana.token";
function getUserAuthHeader() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function setUserToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
function clearUserToken() {
  localStorage.removeItem(TOKEN_KEY);
}
function registerUser(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
function loginUser(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
function getCities() {
  return request("/api/cities");
}
function getCity(slug) {
  return request(`/api/cities/${slug}`);
}
function getFeaturedToikhanas() {
  return request("/api/toikhanas/featured");
}
function getToikhanas(params) {
  const qs = new URLSearchParams();
  if (params.city) qs.set("city", params.city);
  if (params.type) qs.set("type", params.type);
  if (typeof params.capacity === "number") qs.set("capacity", String(params.capacity));
  return request(`/api/toikhanas${qs.toString() ? `?${qs}` : ""}`);
}
function getToikhana(slug) {
  return request(`/api/toikhanas/${slug}`);
}
function getSimilarToikhanas(slug) {
  return request(`/api/toikhanas/${slug}/similar`);
}
function getBlogPosts() {
  return request("/api/blog");
}
function getBlogPost(slug) {
  return request(`/api/blog/${slug}`);
}
function submitBooking(payload) {
  return request("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
function submitOwnerApplication(payload) {
  return request("/api/owner-applications", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
function adminLogin(username, password) {
  setAdminAuth(username, password);
  return request("/api/admin/toikhanas");
}
function getAdminToikhanas() {
  return request("/api/admin/toikhanas");
}
function getAdminBookings() {
  return request("/api/admin/bookings");
}
function getAdminOwnerApplications() {
  return request("/api/admin/owner-applications");
}
function createAdminToikhana(payload) {
  return request("/api/admin/toikhanas", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
function uploadAdminToikhanaPhoto(id, file, isMain, sortOrder) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("isMain", String(isMain));
  if (typeof sortOrder === "number") {
    formData.append("sortOrder", String(sortOrder));
  }
  return fetch(`${API_BASE}/api/admin/toikhanas/${id}/photos`, {
    method: "POST",
    body: formData,
    headers: {
      ...getAdminAuthHeader()
    }
  }).then(async (response) => {
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error ?? `Request failed: ${response.status}`);
    }
    return response.json();
  });
}
function updateOwnerApplicationStatus(id, status) {
  return request(`/api/admin/owner-applications/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status })
  });
}
const USER_KEY = "toikhana.user";
const AuthContext = createContext(null);
function readStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw || !getStoredToken()) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const persist = useCallback((res) => {
    setUserToken(res.token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    setUser(res.user);
  }, []);
  const login = useCallback(
    async (email, password) => {
      persist(await loginUser({ email, password }));
    },
    [persist]
  );
  const register = useCallback(
    async (payload) => {
      persist(await registerUser(payload));
    },
    [persist]
  );
  const logout = useCallback(() => {
    clearUserToken();
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);
  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout }),
    [user, login, register, logout]
  );
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
function Providers({
  children,
  queryClient,
  helmetContext
}) {
  return /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(I18nProvider, { children: /* @__PURE__ */ jsx(AuthProvider, { children }) }) }) });
}
function BrandMark({
  className,
  primary = "#15463F",
  cross = "#C8A45A"
}) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 48 58", className, fill: "none", role: "img", "aria-label": "toikhana.kz", children: [
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M11 55 V27 C11 15 16.5 7 24 7 C31.5 7 37 15 37 27 V55",
        stroke: primary,
        strokeWidth: "2.6",
        strokeLinecap: "round"
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M27.5 8.4 C31 7 34 8.8 33.6 12.4",
        stroke: primary,
        strokeWidth: "2.2",
        strokeLinecap: "round"
      }
    ),
    /* @__PURE__ */ jsx("circle", { cx: "24", cy: "34", r: "11", stroke: primary, strokeWidth: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M16.2 26.2 L31.8 41.8 M31.8 26.2 L16.2 41.8", stroke: cross, strokeWidth: "3.1", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M24 24.6 C25.7 26 25.7 28.6 24 30 C22.3 28.6 22.3 26 24 24.6 Z", fill: primary }),
    /* @__PURE__ */ jsx("path", { d: "M24 38 C25.7 39.4 25.7 42 24 43.4 C22.3 42 22.3 39.4 24 38 Z", fill: primary }),
    /* @__PURE__ */ jsx("path", { d: "M15.2 34 C16.6 32.3 19.2 32.3 20.6 34 C19.2 35.7 16.6 35.7 15.2 34 Z", fill: primary }),
    /* @__PURE__ */ jsx("path", { d: "M27.4 34 C28.8 32.3 31.4 32.3 32.8 34 C31.4 35.7 28.8 35.7 27.4 34 Z", fill: primary })
  ] });
}
function Logo({
  className,
  tone = "color",
  withWordmark = true
}) {
  const light = tone === "light";
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-2.5 ${className ?? ""}`, children: [
    /* @__PURE__ */ jsx(
      BrandMark,
      {
        className: "h-9 w-auto shrink-0",
        primary: light ? "#FFFFFF" : "#15463F",
        cross: "#C8A45A"
      }
    ),
    withWordmark ? /* @__PURE__ */ jsxs("span", { className: "text-xl font-extrabold tracking-tight", children: [
      /* @__PURE__ */ jsx("span", { className: light ? "text-white" : "text-primary", children: "toikhana" }),
      /* @__PURE__ */ jsx("span", { className: "text-accent", children: ".kz" })
    ] }) : null
  ] });
}
const SITE_NAME = "toikhana.kz";
const SITE_ORIGIN = "https://toikhana.kz";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80";
function siteOrigin() {
  var _a2;
  if (typeof window !== "undefined" && ((_a2 = window.location) == null ? void 0 : _a2.origin)) {
    return window.location.origin;
  }
  return SITE_ORIGIN;
}
function canonicalUrl(path) {
  const origin = siteOrigin();
  if (!path) {
    return typeof window !== "undefined" ? `${origin}${window.location.pathname}` : origin;
  }
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
function Seo({ title, description, path, image, type = "website", jsonLd, noindex }) {
  const url = canonicalUrl(path);
  const img = image ?? DEFAULT_IMAGE;
  const desc = description ?? "Каталог тойхан и банкетных залов по всем городам Казахстана. Фото, цены, вместимость и заявки онлайн.";
  const blocks = jsonLd ? Array.isArray(jsonLd) ? jsonLd : [jsonLd] : [];
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("html", { lang: "ru" }),
    /* @__PURE__ */ jsx("title", { children: title }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: desc }),
    noindex ? /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex,nofollow" }) : /* @__PURE__ */ jsx("meta", { name: "robots", content: "index,follow" }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: url }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: SITE_NAME }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: title }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: desc }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: url }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: img }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "ru_RU" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: title }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: desc }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: img }),
    blocks.map((block, index) => /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(block) }, index))
  ] });
}
function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteOrigin(),
    description: "Каталог тойхан и банкетных залов Казахстана.",
    areaServed: "KZ"
  };
}
function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path)
    }))
  };
}
const NAV_KEYS = [
  { to: "/", key: "nav.home" },
  { to: "/blog", key: "nav.blog" },
  { to: "/add-toikhana", key: "nav.add" },
  { to: "/about", key: "nav.about" },
  { to: "/contacts", key: "nav.contacts" }
];
function formatPrice(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "";
  return value.toLocaleString("ru-RU").replace(/,/g, " ");
}
function topCities(cities, limit = 8) {
  return [...cities].sort((a, b) => b.toikhanaCount - a.toikhanaCount).slice(0, limit);
}
function LanguageSwitcher({ className }) {
  const { lang, setLang, t } = useI18n();
  const options = ["ru", "kk"];
  return /* @__PURE__ */ jsx("div", { className: `inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-xs font-semibold ${className ?? ""}`, children: options.map((option) => /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: () => setLang(option),
      className: `rounded-full px-3 py-1.5 transition ${lang === option ? "bg-primary text-white" : "text-slate-500 hover:text-primary"}`,
      children: t(`lang.${option}`)
    },
    option
  )) });
}
function SiteHeader({ cities }) {
  var _a2;
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t, loc } = useI18n();
  const { isAuthenticated, user, logout } = useAuth();
  const strip = useMemo(() => topCities(cities), [cities]);
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-50 border-b border-white/60 bg-white/90 backdrop-blur", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2.5", onClick: () => setOpen(false), "aria-label": "toikhana.kz", children: [
        /* @__PURE__ */ jsx(Logo, { withWordmark: false, className: "shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-lg font-extrabold leading-none tracking-tight", children: [
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "toikhana" }),
            /* @__PURE__ */ jsx("span", { className: "text-accent", children: ".kz" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: t("header.subtitle") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-5 lg:flex", children: [
        NAV_KEYS.filter((link) => link.to !== "/").map((link) => /* @__PURE__ */ jsx(
          Link,
          {
            to: link.to,
            className: `text-sm transition hover:text-primary ${location.pathname === link.to ? "font-semibold text-primary" : "text-slate-600"}`,
            children: t(link.key)
          },
          link.to
        )),
        /* @__PURE__ */ jsx(LanguageSwitcher, {}),
        isAuthenticated ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/account",
              className: "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark",
              children: ((_a2 = user == null ? void 0 : user.name) == null ? void 0 : _a2.split(" ")[0]) || t("nav.account")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: logout,
              className: "text-sm text-slate-500 transition hover:text-primary",
              children: t("nav.logout")
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-sm font-semibold text-slate-600 transition hover:text-primary", children: t("nav.login") }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/register",
              className: "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark",
              children: t("nav.register")
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 lg:hidden", children: [
        /* @__PURE__ */ jsx(LanguageSwitcher, {}),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            "aria-label": t("nav.menu"),
            "aria-expanded": open,
            onClick: () => setOpen((value) => !value),
            className: "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-primary",
            children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("nav.menu") }),
              open ? /* @__PURE__ */ jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) : /* @__PURE__ */ jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M3 6h18M3 12h18M3 18h18" }) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 bg-background/70", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-sm md:px-8", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "whitespace-nowrap rounded-full bg-white px-4 py-2 font-medium shadow-sm", children: t("nav.allCities") }),
      strip.map((city) => /* @__PURE__ */ jsx(
        Link,
        {
          to: `/${city.slug}`,
          className: "whitespace-nowrap rounded-full bg-white px-4 py-2 shadow-sm transition hover:text-primary",
          children: loc(city.nameRu, city.nameKk)
        },
        city.id
      ))
    ] }) }),
    open ? /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 bg-white lg:hidden", children: /* @__PURE__ */ jsxs("nav", { className: "mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3", children: [
      NAV_KEYS.map((link) => /* @__PURE__ */ jsx(
        Link,
        {
          to: link.to,
          onClick: () => setOpen(false),
          className: "rounded-2xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50",
          children: t(link.key)
        },
        link.to
      )),
      isAuthenticated ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/account",
            onClick: () => setOpen(false),
            className: "mt-1 rounded-2xl bg-primary px-4 py-3 text-center text-base font-semibold text-white",
            children: t("nav.account")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              logout();
              setOpen(false);
            },
            className: "rounded-2xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50",
            children: t("nav.logout")
          }
        )
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/login",
            onClick: () => setOpen(false),
            className: "mt-1 rounded-2xl border border-primary px-4 py-3 text-center text-base font-semibold text-primary",
            children: t("nav.login")
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/register",
            onClick: () => setOpen(false),
            className: "rounded-2xl bg-primary px-4 py-3 text-center text-base font-semibold text-white",
            children: t("nav.register")
          }
        )
      ] })
    ] }) }) : null
  ] });
}
function SiteFooter({ cities }) {
  const { t, loc } = useI18n();
  const footerCities = useMemo(() => topCities(cities, 10), [cities]);
  return /* @__PURE__ */ jsxs("footer", { className: "mt-16 border-t border-slate-200 bg-primary text-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Logo, { tone: "light" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-6 text-white/75", children: t("footer.tagline") })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-3 font-semibold", children: t("footer.nav") }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-white/75", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/blog", className: "hover:text-accent", children: t("nav.blog") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", className: "hover:text-accent", children: t("nav.about") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/contacts", className: "hover:text-accent", children: t("nav.contacts") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/add-toikhana", className: "hover:text-accent", children: t("nav.add") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/register", className: "hover:text-accent", children: t("nav.register") }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-3 font-semibold", children: t("footer.cities") }),
        /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/75", children: footerCities.map((city) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: `/${city.slug}`, className: "hover:text-accent", children: loc(city.nameRu, city.nameKk) }) }, city.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-3 font-semibold", children: t("footer.contact") }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-white/75", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "mailto:hello@toikhana.kz", className: "hover:text-accent", children: "hello@toikhana.kz" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "https://wa.me/77000000000", target: "_blank", rel: "noreferrer", className: "hover:text-accent", children: "WhatsApp" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "https://instagram.com", target: "_blank", rel: "noreferrer", className: "hover:text-accent", children: "Instagram" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 py-5 text-xs text-white/50 md:px-8", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " toikhana.kz — ",
      t("footer.rights")
    ] }) })
  ] });
}
function Hero({
  cities,
  selectedCity,
  onCityChange
}) {
  const { t, loc } = useI18n();
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-white shadow-soft md:px-10 md:py-16", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-25 [background:radial-gradient(circle_at_top_right,_#C8A45A_0,_transparent_38%),radial-gradient(circle_at_bottom_left,_#E3CC97_0,_transparent_26%)]" }),
    /* @__PURE__ */ jsxs("div", { className: "relative grid gap-8 md:grid-cols-[1.25fr_0.75fr] md:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.35em] text-accent", children: "toikhana.kz" }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-4xl leading-tight md:text-6xl", children: t("hero.title") }),
        /* @__PURE__ */ jsx("p", { className: "max-w-2xl text-base text-white/80 md:text-lg", children: t("hero.subtitle") }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/add-toikhana", className: "rounded-full bg-accent px-5 py-3 font-semibold text-primary transition hover:brightness-105", children: t("hero.cta.add") }),
          /* @__PURE__ */ jsx(Link, { to: "/about", className: "rounded-full border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10", children: t("hero.cta.how") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-white/10 p-5 backdrop-blur", children: [
        /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm text-white/75", htmlFor: "hero-city", children: t("hero.selectCity") }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "hero-city",
            className: "w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-primary outline-none focus:ring-2 focus:ring-accent",
            value: selectedCity ?? "",
            onChange: (event) => onCityChange(event.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: t("nav.allCities") }),
              [...cities].sort((a, b) => a.nameRu.localeCompare(b.nameRu, "ru")).map((city) => /* @__PURE__ */ jsx("option", { value: city.slug, children: loc(city.nameRu, city.nameKk) }, city.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3 text-sm text-white/80", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-white/10 p-4", children: t("hero.feature.search") }),
          /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-white/10 p-4", children: t("hero.feature.fast") }),
          /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-white/10 p-4", children: t("hero.feature.call") }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/10 p-4", children: [
            cities.length,
            "+ ",
            t("hero.feature.cities")
          ] })
        ] })
      ] })
    ] })
  ] });
}
function TrustStats({
  cities,
  toikhanasCount,
  featuredCount
}) {
  const { t } = useI18n();
  const stats = [
    { label: t("trust.cities"), value: String(cities.length) },
    { label: t("trust.toikhanas"), value: String(toikhanasCount) },
    { label: t("trust.featured"), value: String(featuredCount) }
  ];
  return /* @__PURE__ */ jsx("section", { className: "grid gap-4 sm:grid-cols-3", children: stats.map((stat) => /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-500", children: stat.label }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 font-serif text-4xl", children: stat.value })
  ] }, stat.label)) });
}
function HowItWorks() {
  const { t } = useI18n();
  const steps = [t("how.step1"), t("how.step2"), t("how.step3")];
  return /* @__PURE__ */ jsxs("section", { className: "space-y-5 rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("how.eyebrow") }),
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: t("how.title") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-3", children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-background p-5", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white", children: index + 1 }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-6 text-slate-700", children: step })
    ] }, step)) })
  ] });
}
function OwnerCTA() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsxs("section", { className: "grid gap-6 rounded-[2rem] bg-accent px-6 py-8 text-primary md:grid-cols-[1.2fr_0.8fr] md:px-10", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em]", children: t("owner.eyebrow") }),
      /* @__PURE__ */ jsx("h2", { className: "mt-3 font-serif text-3xl md:text-4xl", children: t("owner.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl text-sm leading-7 text-primary/80", children: t("owner.text") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-end md:justify-end", children: /* @__PURE__ */ jsx(Link, { to: "/add-toikhana", className: "rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:brightness-110", children: t("owner.button") }) })
  ] });
}
function FAQ() {
  const { t } = useI18n();
  const faqs = [
    [t("faq.q1"), t("faq.a1")],
    [t("faq.q2"), t("faq.a2")],
    [t("faq.q3"), t("faq.a3")],
    [t("faq.q4"), t("faq.a4")],
    [t("faq.q5"), t("faq.a5")]
  ];
  return /* @__PURE__ */ jsxs("section", { className: "space-y-5 rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("faq.eyebrow") }),
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: t("faq.title") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: faqs.map(([question, answer]) => /* @__PURE__ */ jsxs("details", { className: "group rounded-2xl bg-background p-4", children: [
      /* @__PURE__ */ jsxs("summary", { className: "flex cursor-pointer items-center justify-between font-medium", children: [
        question,
        /* @__PURE__ */ jsx("span", { className: "ml-3 text-slate-400 transition group-open:rotate-45", children: "+" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-6 text-slate-600", children: answer })
    ] }, question)) })
  ] });
}
function CityCards({ cities }) {
  const { t, loc } = useI18n();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const sorted = [...cities].sort((a, b) => b.toikhanaCount - a.toikhanaCount || a.nameRu.localeCompare(b.nameRu, "ru"));
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((city) => city.nameRu.toLowerCase().includes(q) || city.nameKk.toLowerCase().includes(q));
  }, [cities, query]);
  return /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("cities.eyebrow") }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: t("cities.title") })
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: query,
          onChange: (event) => setQuery(event.target.value),
          placeholder: t("cities.search"),
          className: "w-full max-w-xs rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-accent"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: filtered.map((city) => /* @__PURE__ */ jsx(
      Link,
      {
        to: `/${city.slug}`,
        className: "group rounded-[1.5rem] bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lg",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: loc(city.nameRu, city.nameKk) }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-slate-500", children: [
              city.toikhanaCount,
              " ",
              t("cities.unit")
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-primary", children: city.toikhanaCount })
        ] })
      },
      city.id
    )) }),
    !filtered.length ? /* @__PURE__ */ jsx(EmptyState, { title: t("cities.notFound"), text: t("cities.notFoundText") }) : null
  ] });
}
function FeaturedToikhanas({ items }) {
  const { t } = useI18n();
  return /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("featured.eyebrow") }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: t("featured.title") })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/about", className: "text-sm font-medium text-primary hover:underline", children: t("featured.how") })
    ] }),
    /* @__PURE__ */ jsx(ToikhanaGrid, { items: items.slice(0, 6) })
  ] });
}
function ToyTypes({ toyTypes }) {
  const { t, loc } = useI18n();
  return /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("types.eyebrow") }),
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: t("types.title") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: toyTypes.map((toyType) => /* @__PURE__ */ jsx("span", { className: "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm", children: loc(toyType.nameRu, toyType.nameKk) }, toyType.id)) })
  ] });
}
function SEOText() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsxs("section", { className: "rounded-[1.75rem] bg-primary px-6 py-8 text-white", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-accent", children: t("seo.eyebrow") }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-4xl text-sm leading-7 text-white/80 md:text-base", children: t("seo.body") })
  ] });
}
function PageHeader({ title, count }) {
  const { t } = useI18n();
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("catalog.eyebrow") }),
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-4xl", children: title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold text-primary", children: [
      count,
      " ",
      t("catalog.count")
    ] })
  ] });
}
function FilterPanel({
  capacity,
  onCapacityChange,
  type,
  onTypeChange
}) {
  const { t } = useI18n();
  const types = [
    { slug: "", label: t("filter.anyType") },
    { slug: "svadba", label: t("type.svadba") },
    { slug: "kudalyk", label: t("type.kudalyk") },
    { slug: "birthday", label: t("type.birthday") },
    { slug: "corporate", label: t("type.corporate") }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4 rounded-[1.75rem] bg-card p-5 shadow-soft md:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("label", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-600", children: t("filter.capacity") }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent",
          value: capacity,
          onChange: (event) => onCapacityChange(event.target.value),
          placeholder: t("filter.capacityPlaceholder"),
          inputMode: "numeric"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-600", children: t("filter.type") }),
      /* @__PURE__ */ jsx(
        "select",
        {
          className: "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-accent",
          value: type,
          onChange: (event) => onTypeChange(event.target.value),
          children: types.map((item) => /* @__PURE__ */ jsx("option", { value: item.slug, children: item.label }, item.slug))
        }
      )
    ] })
  ] });
}
function ToikhanaGrid({ items }) {
  const { t } = useI18n();
  if (!items.length) {
    return /* @__PURE__ */ jsx(EmptyState, { title: t("card.empty"), text: t("card.emptyText") });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-3", children: items.map((item) => /* @__PURE__ */ jsx(ToikhanaCardItem, { item }, item.id)) });
}
function ToikhanaCardItem({ item }) {
  const { t } = useI18n();
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: `/toikhana/${item.slug}`,
      className: "group overflow-hidden rounded-[1.75rem] bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lg",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-[4/3] w-full bg-slate-100", children: [
          item.mainPhotoUrl ? /* @__PURE__ */ jsx(
            "img",
            {
              src: item.mainPhotoUrl,
              alt: `${item.name} — ${t("cities.unit")} ${item.cityName}`,
              loading: "lazy",
              className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400", children: t("card.photoSoon") }),
          item.featured ? /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary shadow", children: t("card.top") }) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: item.name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: item.cityName })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "line-clamp-1 text-sm text-slate-600", children: item.address }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-sm text-slate-700", children: [
            item.capacityMin || item.capacityMax ? /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-slate-100 px-3 py-1", children: [
              item.capacityMin ?? 0,
              "–",
              item.capacityMax ?? 0,
              " ",
              t("card.guests")
            ] }) : null,
            item.priceMin ? /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-slate-100 px-3 py-1", children: [
              t("card.from"),
              " ",
              formatPrice(item.priceMin),
              " ₸"
            ] }) : null
          ] })
        ] })
      ]
    }
  );
}
function PhotoGallery({ photos }) {
  const main = photos[0];
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-[2fr_1fr]", children: [
    /* @__PURE__ */ jsx("div", { className: "aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-slate-100 md:aspect-auto", children: main ? /* @__PURE__ */ jsx("img", { src: main.url, alt: "", className: "h-full w-full object-cover" }) : null }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-1", children: photos.slice(1, 3).map((photo) => /* @__PURE__ */ jsx("div", { className: "aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100 md:aspect-auto", children: /* @__PURE__ */ jsx("img", { src: photo.url, alt: "", loading: "lazy", className: "h-full w-full object-cover" }) }, photo.id)) })
  ] });
}
function ToikhanaInfo({ item }) {
  const { t } = useI18n();
  return /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: item.name }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-slate-500", children: item.address }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-sm", children: item.cityName }),
      item.capacityMin || item.capacityMax ? /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-sm", children: [
        item.capacityMin ?? 0,
        "–",
        item.capacityMax ?? 0,
        " ",
        t("card.guests")
      ] }) : null,
      item.priceMin ? /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-sm", children: [
        t("card.from"),
        " ",
        formatPrice(item.priceMin),
        " ₸"
      ] }) : null
    ] })
  ] });
}
function Description({ title, body }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 whitespace-pre-line text-sm leading-7 text-slate-600", children: body })
  ] });
}
function ToyTypeBadges({ toyTypes }) {
  const { loc } = useI18n();
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: toyTypes.map((toyType) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-accent/20 px-3 py-1 text-sm", children: loc(toyType.nameRu, toyType.nameKk) }, toyType.id)) });
}
function ContactButtons({ phone, whatsapp }) {
  const { t } = useI18n();
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
    phone ? /* @__PURE__ */ jsx("a", { className: "rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110", href: `tel:${phone}`, children: t("contact.call") }) : null,
    whatsapp ? /* @__PURE__ */ jsx(
      "a",
      {
        className: "rounded-full border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white",
        href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
        target: "_blank",
        rel: "noreferrer",
        children: "WhatsApp"
      }
    ) : null
  ] });
}
function MobileContactBar({ phone, whatsapp }) {
  const { t } = useI18n();
  if (!phone && !whatsapp) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl gap-3", children: [
    phone ? /* @__PURE__ */ jsx("a", { href: `tel:${phone}`, className: "flex-1 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white", children: t("contact.call") }) : null,
    whatsapp ? /* @__PURE__ */ jsx(
      "a",
      {
        href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
        target: "_blank",
        rel: "noreferrer",
        className: "flex-1 rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white",
        children: "WhatsApp"
      }
    ) : null
  ] }) });
}
function SimilarToikhanas({ items }) {
  const { t } = useI18n();
  if (!items.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: t("similar.title") }),
    /* @__PURE__ */ jsx(ToikhanaGrid, { items: items.slice(0, 3) })
  ] });
}
function BookingForm({
  toikhanaId,
  onSubmit
}) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await onSubmit({
      toikhanaId: toikhanaId ?? Number(data.get("toikhanaId")),
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      eventDate: String(data.get("eventDate") ?? ""),
      guestsCount: Number(data.get("guestsCount") ?? 0),
      message: String(data.get("message") ?? "")
    });
    form.reset();
    setDone(true);
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft lg:sticky lg:top-28", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: t("booking.title") }),
    /* @__PURE__ */ jsx("input", { name: "toikhanaId", type: "hidden", value: toikhanaId ?? "", readOnly: true }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx("input", { name: "name", required: true, placeholder: t("booking.name"), className: "rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" }),
      /* @__PURE__ */ jsx("input", { name: "phone", required: true, placeholder: t("booking.phone"), className: "rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" }),
      /* @__PURE__ */ jsx("input", { name: "eventDate", required: true, type: "date", className: "rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" }),
      /* @__PURE__ */ jsx("input", { name: "guestsCount", required: true, type: "number", placeholder: t("booking.guests"), className: "rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" })
    ] }),
    /* @__PURE__ */ jsx("textarea", { name: "message", rows: 4, placeholder: t("booking.comment"), className: "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" }),
    /* @__PURE__ */ jsx("button", { className: "w-full rounded-full bg-accent px-5 py-3 font-semibold text-primary transition hover:brightness-105", type: "submit", children: t("booking.submit") }),
    done ? /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-700", children: t("booking.done") }) : null
  ] });
}
function LoginForm({
  onSubmit
}) {
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await onSubmit(String(data.get("username") ?? ""), String(data.get("password") ?? ""));
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: "Войти в админку" }),
    /* @__PURE__ */ jsx("input", { name: "username", placeholder: "Username", className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsx("input", { name: "password", type: "password", placeholder: "Password", className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsx("button", { className: "rounded-full bg-primary px-5 py-3 font-semibold text-white", type: "submit", children: "Войти" })
  ] });
}
function ToikhanaForm({
  onSubmit
}) {
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const toyTypeIds = String(data.get("toyTypeIds") ?? "").split(",").map((value) => value.trim()).filter(Boolean).map((value) => Number(value));
    await onSubmit({
      cityId: Number(data.get("cityId") ?? 0),
      name: String(data.get("name") ?? ""),
      slug: String(data.get("slug") ?? ""),
      descriptionKk: String(data.get("descriptionKk") ?? ""),
      descriptionRu: String(data.get("descriptionRu") ?? ""),
      address: String(data.get("address") ?? ""),
      phone: String(data.get("phone") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      capacityMin: parseOptionalNumber(data.get("capacityMin")),
      capacityMax: parseOptionalNumber(data.get("capacityMax")),
      priceMin: parseOptionalNumber(data.get("priceMin")),
      priceMax: parseOptionalNumber(data.get("priceMax")),
      active: data.get("active") === "on",
      featured: data.get("featured") === "on",
      toyTypeIds
    });
    form.reset();
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: "Добавить тойхану" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx("input", { name: "cityId", type: "number", required: true, placeholder: "City ID", className: "rounded-2xl border border-slate-200 px-4 py-3" }),
      /* @__PURE__ */ jsx("input", { name: "name", required: true, placeholder: "Название", className: "rounded-2xl border border-slate-200 px-4 py-3" }),
      /* @__PURE__ */ jsx("input", { name: "slug", required: true, placeholder: "Slug", className: "rounded-2xl border border-slate-200 px-4 py-3" }),
      /* @__PURE__ */ jsx("input", { name: "address", placeholder: "Адрес", className: "rounded-2xl border border-slate-200 px-4 py-3" }),
      /* @__PURE__ */ jsx("input", { name: "phone", placeholder: "Телефон", className: "rounded-2xl border border-slate-200 px-4 py-3" }),
      /* @__PURE__ */ jsx("input", { name: "whatsapp", placeholder: "WhatsApp", className: "rounded-2xl border border-slate-200 px-4 py-3" }),
      /* @__PURE__ */ jsx("input", { name: "capacityMin", type: "number", placeholder: "Мин. вместимость", className: "rounded-2xl border border-slate-200 px-4 py-3" }),
      /* @__PURE__ */ jsx("input", { name: "capacityMax", type: "number", placeholder: "Макс. вместимость", className: "rounded-2xl border border-slate-200 px-4 py-3" }),
      /* @__PURE__ */ jsx("input", { name: "priceMin", type: "number", placeholder: "Цена от", className: "rounded-2xl border border-slate-200 px-4 py-3" }),
      /* @__PURE__ */ jsx("input", { name: "priceMax", type: "number", placeholder: "Цена до", className: "rounded-2xl border border-slate-200 px-4 py-3" }),
      /* @__PURE__ */ jsx("input", { name: "toyTypeIds", placeholder: "ID типов тоя через запятую", className: "rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" })
    ] }),
    /* @__PURE__ */ jsx("textarea", { name: "descriptionKk", rows: 3, placeholder: "Описание KK", className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsx("textarea", { name: "descriptionRu", rows: 3, placeholder: "Описание RU", className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("input", { name: "active", type: "checkbox", defaultChecked: true }),
        " Активна"
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("input", { name: "featured", type: "checkbox" }),
        " В топе"
      ] })
    ] }),
    /* @__PURE__ */ jsx("button", { className: "rounded-full bg-primary px-5 py-3 font-semibold text-white", type: "submit", children: "Сохранить" })
  ] });
}
function PhotoUpload({
  onSubmit
}) {
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");
    if (!(file instanceof File)) return;
    await onSubmit({
      toikhanaId: Number(data.get("toikhanaId") ?? 0),
      file,
      isMain: data.get("isMain") === "on",
      sortOrder: data.get("sortOrder") ? Number(data.get("sortOrder")) : void 0
    });
    form.reset();
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: "Загрузка фото" }),
    /* @__PURE__ */ jsx("input", { name: "toikhanaId", type: "number", required: true, placeholder: "Toikhana ID", className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsx("input", { name: "file", type: "file", accept: "image/*", required: true, className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsx("input", { name: "sortOrder", type: "number", placeholder: "Порядок", className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsx("input", { name: "isMain", type: "checkbox" }),
      " Главное фото"
    ] }),
    /* @__PURE__ */ jsx("button", { className: "rounded-full bg-accent px-5 py-3 font-semibold text-primary", type: "submit", children: "Загрузить" })
  ] });
}
function BookingList({ bookings }) {
  return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: bookings.map((booking, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-card p-4 shadow-soft", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsx("strong", { children: booking.name }),
      /* @__PURE__ */ jsx("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-xs", children: booking.status ?? "new" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: booking.phone }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: booking.eventDate })
  ] }, booking.id ?? index)) });
}
function EmptyState({ title, text }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-500", children: text })
  ] });
}
function parseOptionalNumber(value) {
  if (value === null || value === "") return void 0;
  return Number(value);
}
function AdminPage() {
  var _a2;
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("toikhana.adminAuth")));
  const citiesQuery = useQuery({ queryKey: ["admin", "cities"], queryFn: getCities, enabled: loggedIn });
  const toikhanasQuery = useQuery({ queryKey: ["admin", "toikhanas"], queryFn: getAdminToikhanas, enabled: loggedIn });
  const bookingsQuery = useQuery({ queryKey: ["admin", "bookings"], queryFn: getAdminBookings, enabled: loggedIn });
  const ownerApplicationsQuery = useQuery({
    queryKey: ["admin", "owner-applications"],
    queryFn: getAdminOwnerApplications,
    enabled: loggedIn
  });
  const loginMutation = useMutation({
    mutationFn: ({ username, password }) => adminLogin(username, password),
    onSuccess: () => setLoggedIn(true)
  });
  const createMutation = useMutation({
    mutationFn: createAdminToikhana,
    onSuccess: () => {
      toikhanasQuery.refetch();
      citiesQuery.refetch();
    }
  });
  const uploadMutation = useMutation({
    mutationFn: ({
      toikhanaId,
      file,
      isMain,
      sortOrder
    }) => uploadAdminToikhanaPhoto(toikhanaId, file, isMain, sortOrder),
    onSuccess: () => toikhanasQuery.refetch()
  });
  const ownerStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOwnerApplicationStatus(id, status),
    onSuccess: () => ownerApplicationsQuery.refetch()
  });
  return /* @__PURE__ */ jsxs("main", { className: "space-y-8 p-4 md:p-8", children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx("title", { children: "Admin | toikhana.kz" }) }),
    !loggedIn ? /* @__PURE__ */ jsx(
      LoginForm,
      {
        onSubmit: async (username, password) => {
          await loginMutation.mutateAsync({ username, password });
        }
      }
    ) : /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "rounded-full bg-slate-200 px-4 py-2 text-sm",
          onClick: () => {
            clearAdminAuth();
            setLoggedIn(false);
          },
          children: "Выйти"
        }
      ),
      /* @__PURE__ */ jsxs("section", { className: "grid gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: "Тойханы" }),
          /* @__PURE__ */ jsx(
            ToikhanaForm,
            {
              onSubmit: async (payload) => {
                await createMutation.mutateAsync(payload);
              }
            }
          ),
          /* @__PURE__ */ jsx(
            PhotoUpload,
            {
              onSubmit: async ({ toikhanaId, file, isMain, sortOrder }) => {
                await uploadMutation.mutateAsync({ toikhanaId, file, isMain, sortOrder });
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: "Cities" }),
            /* @__PURE__ */ jsx("pre", { className: "overflow-auto text-xs", children: JSON.stringify(citiesQuery.data ?? [], null, 2) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rounded-[1.75rem] bg-card p-6 shadow-soft", children: /* @__PURE__ */ jsx("pre", { className: "overflow-auto text-xs", children: JSON.stringify(toikhanasQuery.data ?? [], null, 2) }) }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: "Заявки владельцев" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-4", children: [
              (ownerApplicationsQuery.data ?? []).map((application) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-100 p-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "font-semibold", children: application.name }),
                    /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-500", children: [
                      application.city,
                      application.hallName ? ` · ${application.hallName}` : ""
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600", children: application.status })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm text-slate-600", children: [
                  /* @__PURE__ */ jsx("div", { children: application.phone }),
                  application.whatsapp ? /* @__PURE__ */ jsx("div", { children: application.whatsapp }) : null,
                  application.message ? /* @__PURE__ */ jsx("div", { className: "mt-2 whitespace-pre-line", children: application.message }) : null
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: ["reviewed", "contacted", "approved", "rejected"].map((status) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]",
                    onClick: () => ownerStatusMutation.mutate({ id: application.id ?? 0, status }),
                    children: status
                  },
                  status
                )) })
              ] }, application.id)),
              !((_a2 = ownerApplicationsQuery.data) == null ? void 0 : _a2.length) ? /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Пока нет заявок владельцев." }) : null
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: "Заявки гостей" }),
          /* @__PURE__ */ jsx(BookingList, { bookings: bookingsQuery.data ?? [] })
        ] })
      ] })
    ] })
  ] });
}
function CityPage() {
  var _a2, _b2, _c, _d, _e, _f;
  const { t, loc } = useI18n();
  const { citySlug = "" } = useParams();
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState("");
  const cityQuery = useQuery({ queryKey: ["city", citySlug], queryFn: () => getCity(citySlug), enabled: Boolean(citySlug) });
  const itemsQuery = useQuery({
    queryKey: ["toikhanas", citySlug, capacity, type],
    queryFn: () => getToikhanas({ city: citySlug, capacity: capacity ? Number(capacity) : void 0, type: type || void 0 })
  });
  const localCityName = cityQuery.data ? loc(cityQuery.data.nameRu, cityQuery.data.nameKk) : void 0;
  const title = useMemo(
    () => localCityName ? `${t("city.titlePrefix")} ${localCityName}` : t("city.titleAll"),
    [localCityName, t]
  );
  const cityName = (_a2 = cityQuery.data) == null ? void 0 : _a2.nameRu;
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl space-y-8 p-4 md:p-8", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: cityName ? `Тойхана ${cityName} — ${((_b2 = cityQuery.data) == null ? void 0 : _b2.toikhanaCount) ?? 0} залов | toikhana.kz` : "Тойхана | toikhana.kz",
        description: cityName ? `Тойханы и банкетные залы в городе ${cityName}. ${((_c = cityQuery.data) == null ? void 0 : _c.toikhanaCount) ?? 0} объектов: фото, цены, вместимость и заявки онлайн.` : "Каталог тойхан по городам Казахстана.",
        path: citySlug ? `/${citySlug}` : "/",
        jsonLd: breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: cityName ?? "Город", path: citySlug ? `/${citySlug}` : "/" }
        ])
      }
    ),
    /* @__PURE__ */ jsx(PageHeader, { title, count: ((_d = itemsQuery.data) == null ? void 0 : _d.count) ?? 0 }),
    /* @__PURE__ */ jsx(FilterPanel, { capacity, onCapacityChange: setCapacity, type, onTypeChange: setType }),
    ((_f = (_e = itemsQuery.data) == null ? void 0 : _e.items) == null ? void 0 : _f.length) ? /* @__PURE__ */ jsx(ToikhanaGrid, { items: itemsQuery.data.items }) : /* @__PURE__ */ jsx(EmptyState, { title: t("city.empty"), text: t("city.emptyText") })
  ] });
}
function HomePage() {
  var _a2, _b2, _c;
  const navigate = useNavigate();
  const citiesQuery = useQuery({ queryKey: ["cities"], queryFn: getCities });
  const featuredQuery = useQuery({ queryKey: ["featured"], queryFn: getFeaturedToikhanas });
  const toyTypes = useMemo(
    () => [
      { id: 1, nameRu: "Свадьба", nameKk: "Үйлену тойы", slug: "svadba" },
      { id: 2, nameRu: "День рождения", nameKk: "Туған күн", slug: "birthday" },
      { id: 3, nameRu: "Корпоратив", nameKk: "Корпоратив", slug: "corporate" }
    ],
    []
  );
  const toikhanasCount = ((_a2 = citiesQuery.data) == null ? void 0 : _a2.reduce((sum, city) => sum + city.toikhanaCount, 0)) ?? 0;
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl space-y-12 px-4 py-6 md:px-8 md:py-10", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Тойхана — банкетные залы по всему Казахстану | toikhana.kz",
        description: "Каталог тойхан Казахстана: Астана, Алматы, Шымкент и все областные центры. Сравнивайте залы по цене и вместимости, оставляйте заявки онлайн.",
        path: "/",
        jsonLd: organizationJsonLd()
      }
    ),
    /* @__PURE__ */ jsx(
      Hero,
      {
        cities: citiesQuery.data ?? [],
        selectedCity: "",
        onCityChange: (slug) => {
          navigate(slug ? `/city/${slug}` : "/");
        }
      }
    ),
    /* @__PURE__ */ jsx(
      TrustStats,
      {
        cities: citiesQuery.data ?? [],
        toikhanasCount,
        featuredCount: ((_b2 = featuredQuery.data) == null ? void 0 : _b2.filter((item) => item.featured).length) ?? 0
      }
    ),
    /* @__PURE__ */ jsx(HowItWorks, {}),
    /* @__PURE__ */ jsx(OwnerCTA, {}),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(CityCards, { cities: citiesQuery.data ?? [] }),
      ((_c = featuredQuery.data) == null ? void 0 : _c.length) ? /* @__PURE__ */ jsx(FeaturedToikhanas, { items: featuredQuery.data ?? [] }) : /* @__PURE__ */ jsx(EmptyState, { title: "Залы загружаются", text: "Если API отвечает медленно, секция появится после загрузки данных." }),
      /* @__PURE__ */ jsx(ToyTypes, { toyTypes }),
      /* @__PURE__ */ jsx(FAQ, {}),
      /* @__PURE__ */ jsxs("section", { className: "flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: "Блог" }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: "Советы по организации тоя" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-xl text-sm leading-6 text-slate-600", children: "Как выбрать тойхану, сколько стоит свадьба и чек-листы для торжеств." })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/blog", className: "rounded-full bg-primary px-6 py-3 font-semibold text-white", children: "Читать блог" })
      ] }),
      /* @__PURE__ */ jsx(SEOText, {})
    ] })
  ] });
}
function ToikhanaPage() {
  var _a2, _b2, _c, _d;
  const { t, loc } = useI18n();
  const { slug = "" } = useParams();
  const queryClient = useQueryClient();
  const itemQuery = useQuery({ queryKey: ["toikhana", slug], queryFn: () => getToikhana(slug), enabled: Boolean(slug) });
  const similarQuery = useQuery({ queryKey: ["similar", slug], queryFn: () => getSimilarToikhanas(slug), enabled: Boolean(slug) });
  const bookingMutation = useMutation({ mutationFn: submitBooking, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }) });
  const item = itemQuery.data;
  const placeJsonLd = item ? {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: item.name,
    description: item.descriptionRu,
    url: canonicalUrl(`/toikhana/${item.slug}`),
    image: (_b2 = (_a2 = item.photos) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.url,
    telephone: item.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: item.address,
      addressLocality: item.cityName,
      addressCountry: "KZ"
    }
  } : null;
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl space-y-8 p-4 pb-24 md:p-8 md:pb-8", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: item ? `${item.name} — тойхана в городе ${item.cityName} | toikhana.kz` : "Тойхана | toikhana.kz",
        description: item ? item.descriptionRu ?? `${item.name} — банкетный зал в городе ${item.cityName}. Вместимость, цены, фото и заявки онлайн.` : "Информация о тойхане.",
        path: item ? `/toikhana/${item.slug}` : void 0,
        image: (_d = (_c = item == null ? void 0 : item.photos) == null ? void 0 : _c[0]) == null ? void 0 : _d.url,
        jsonLd: item && placeJsonLd ? [
          placeJsonLd,
          breadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: item.cityName ?? "Город", path: `/${item.citySlug}` },
            { name: item.name, path: `/toikhana/${item.slug}` }
          ])
        ] : void 0
      }
    ),
    item ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PhotoGallery, { photos: item.photos }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.2fr_0.8fr]", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(ToikhanaInfo, { item }),
          /* @__PURE__ */ jsx(Description, { title: t("toikhana.descTitle"), body: loc(item.descriptionRu, item.descriptionKk) }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: t("toikhana.typesTitle") }),
            /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(ToyTypeBadges, { toyTypes: item.toyTypes }) })
          ] }),
          /* @__PURE__ */ jsx(ContactButtons, { phone: item.phone, whatsapp: item.whatsapp })
        ] }),
        /* @__PURE__ */ jsx(
          BookingForm,
          {
            toikhanaId: item.id,
            onSubmit: async (payload) => {
              await bookingMutation.mutateAsync(payload);
            }
          }
        )
      ] }),
      similarQuery.data ? /* @__PURE__ */ jsx(SimilarToikhanas, { items: similarQuery.data }) : null,
      /* @__PURE__ */ jsx(MobileContactBar, { phone: item.phone, whatsapp: item.whatsapp })
    ] }) : null
  ] });
}
function AboutPage() {
  var _a2, _b2;
  const { t } = useI18n();
  const citiesQuery = useQuery({ queryKey: ["about", "cities"], queryFn: getCities });
  const featuredQuery = useQuery({ queryKey: ["about", "featured"], queryFn: getFeaturedToikhanas });
  const toikhanasCount = ((_a2 = citiesQuery.data) == null ? void 0 : _a2.reduce((sum, city) => sum + city.toikhanaCount, 0)) ?? 0;
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl space-y-8 px-4 py-6 md:px-8 md:py-10", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "О проекте | toikhana.kz",
        description: "toikhana.kz — каталог тойхан и банкетных залов по всем городам Казахстана. Узнайте, как мы помогаем выбрать зал.",
        path: "/about"
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] bg-white p-8 shadow-soft", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("about.eyebrow") }),
      /* @__PURE__ */ jsx("h1", { className: "mt-3 font-serif text-4xl", children: t("about.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-3xl text-sm leading-7 text-slate-600", children: t("about.text") })
    ] }),
    /* @__PURE__ */ jsx(
      TrustStats,
      {
        cities: citiesQuery.data ?? [],
        toikhanasCount,
        featuredCount: ((_b2 = featuredQuery.data) == null ? void 0 : _b2.filter((item) => item.featured).length) ?? 0
      }
    ),
    /* @__PURE__ */ jsx(HowItWorks, {}),
    /* @__PURE__ */ jsx(OwnerCTA, {})
  ] });
}
function ContactsPage() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-4xl space-y-8 px-4 py-6 md:px-8 md:py-10", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Контакты | toikhana.kz",
        description: "Свяжитесь с toikhana.kz: email, WhatsApp. Каталог тойхан по всему Казахстану.",
        path: "/contacts"
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] bg-white p-8 shadow-soft", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("contacts.eyebrow") }),
      /* @__PURE__ */ jsx("h1", { className: "mt-3 font-serif text-4xl", children: t("contacts.title") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("a", { className: "rounded-2xl bg-background p-5", href: "mailto:hello@toikhana.kz", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-500", children: "Email" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 font-semibold", children: "hello@toikhana.kz" })
        ] }),
        /* @__PURE__ */ jsxs("a", { className: "rounded-2xl bg-background p-5", href: "https://wa.me/77000000000", target: "_blank", rel: "noreferrer", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-500", children: "WhatsApp" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 font-semibold", children: "+7 (700) 000-00-00" })
        ] })
      ] })
    ] })
  ] });
}
function OwnerApplicationForm({
  cities,
  onSubmit,
  submitLabel,
  title,
  description
}) {
  const { t, loc } = useI18n();
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await onSubmit({
      name: String(data.get("name") ?? ""),
      city: String(data.get("city") ?? ""),
      phone: String(data.get("phone") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      hallName: String(data.get("hallName") ?? ""),
      message: String(data.get("message") ?? "")
    });
    form.reset();
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl", children: title ?? t("owner.page.formTitle") }),
      description ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-6 text-slate-600", children: description }) : null
    ] }),
    /* @__PURE__ */ jsx("input", { name: "name", required: true, placeholder: t("ownerForm.name"), className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsxs("select", { name: "city", required: true, defaultValue: "", className: "w-full rounded-2xl border border-slate-200 px-4 py-3", children: [
      /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: t("ownerForm.selectCity") }),
      cities.map((city) => /* @__PURE__ */ jsx("option", { value: city.nameRu, children: loc(city.nameRu, city.nameKk) }, city.id))
    ] }),
    /* @__PURE__ */ jsx("input", { name: "hallName", placeholder: t("ownerForm.hallName"), className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsx("input", { name: "phone", required: true, placeholder: t("ownerForm.phone"), className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsx("input", { name: "whatsapp", placeholder: t("ownerForm.whatsapp"), className: "w-full rounded-2xl border border-slate-200 px-4 py-3" }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        name: "message",
        rows: 4,
        placeholder: t("ownerForm.message"),
        className: "w-full rounded-2xl border border-slate-200 px-4 py-3"
      }
    ),
    /* @__PURE__ */ jsx("button", { type: "submit", className: "rounded-full bg-primary px-5 py-3 font-semibold text-white", children: submitLabel ?? t("ownerForm.submit") })
  ] });
}
function AddToikhanaPage() {
  const { t } = useI18n();
  const citiesQuery = useQuery({ queryKey: ["owner-applications", "cities"], queryFn: getCities });
  const mutation = useMutation({ mutationFn: submitOwnerApplication });
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-4xl space-y-8 px-4 py-6 md:px-8 md:py-10", children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsxs("title", { children: [
      t("nav.add"),
      " | toikhana.kz"
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] bg-white p-8 shadow-soft", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("owner.page.eyebrow") }),
      /* @__PURE__ */ jsx("h1", { className: "mt-3 font-serif text-4xl", children: t("owner.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-3xl text-sm leading-7 text-slate-600", children: t("owner.page.text") })
    ] }),
    /* @__PURE__ */ jsx(
      OwnerApplicationForm,
      {
        cities: citiesQuery.data ?? [],
        title: t("owner.page.formTitle"),
        description: t("owner.page.formDesc"),
        submitLabel: t("ownerForm.submit"),
        onSubmit: async (payload) => {
          await mutation.mutateAsync(payload);
        }
      }
    ),
    mutation.isSuccess ? /* @__PURE__ */ jsx("div", { className: "rounded-[1.75rem] bg-emerald-50 p-6 text-emerald-900", children: t("owner.page.success") }) : null
  ] });
}
function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError(false);
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      await login(String(data.get("email") ?? ""), String(data.get("password") ?? ""));
      navigate("/account");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-md px-4 py-10 md:px-8 md:py-16", children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsxs("title", { children: [
      t("auth.login.title"),
      " | toikhana.kz"
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-[2rem] bg-card p-8 shadow-soft", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl", children: t("auth.login.title") }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-500", children: t("auth.login.subtitle") })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block space-y-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-600", children: t("auth.login.email") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            name: "email",
            type: "email",
            required: true,
            autoComplete: "email",
            className: "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block space-y-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-600", children: t("auth.login.password") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            name: "password",
            type: "password",
            required: true,
            autoComplete: "current-password",
            className: "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full rounded-full bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60",
          children: t("auth.login.submit")
        }
      ),
      error ? /* @__PURE__ */ jsx("p", { className: "rounded-2xl bg-red-50 p-3 text-sm text-red-800", children: t("auth.login.error") }) : null,
      /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-slate-500", children: [
        t("auth.login.noAccount"),
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/register", className: "font-semibold text-primary hover:underline", children: t("auth.login.registerLink") })
      ] })
    ] })
  ] });
}
function RegisterPage() {
  const { register } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError(false);
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      await register({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        password: String(data.get("password") ?? "")
      });
      navigate("/account");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-md px-4 py-10 md:px-8 md:py-16", children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsxs("title", { children: [
      t("auth.register.title"),
      " | toikhana.kz"
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-[2rem] bg-card p-8 shadow-soft", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl", children: t("auth.register.title") }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-500", children: t("auth.register.subtitle") })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block space-y-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-600", children: t("auth.register.name") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            name: "name",
            required: true,
            autoComplete: "name",
            className: "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block space-y-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-600", children: t("auth.register.email") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            name: "email",
            type: "email",
            required: true,
            autoComplete: "email",
            className: "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block space-y-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-600", children: t("auth.register.phone") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            name: "phone",
            type: "tel",
            autoComplete: "tel",
            placeholder: "+7 700 000 00 00",
            className: "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block space-y-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-600", children: t("auth.register.password") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            name: "password",
            type: "password",
            required: true,
            minLength: 6,
            autoComplete: "new-password",
            className: "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full rounded-full bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60",
          children: t("auth.register.submit")
        }
      ),
      error ? /* @__PURE__ */ jsx("p", { className: "rounded-2xl bg-red-50 p-3 text-sm text-red-800", children: t("auth.register.error") }) : null,
      /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-slate-500", children: [
        t("auth.register.haveAccount"),
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "font-semibold text-primary hover:underline", children: t("auth.register.loginLink") })
      ] })
    ] })
  ] });
}
function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  if (!isAuthenticated || !user) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", replace: true });
  }
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-2xl px-4 py-10 md:px-8 md:py-16", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxs("title", { children: [
        t("auth.account.title"),
        " | toikhana.kz"
      ] }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] bg-card p-8 shadow-soft", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("auth.account.title") }),
      /* @__PURE__ */ jsxs("h1", { className: "mt-2 font-serif text-3xl", children: [
        t("auth.account.hello"),
        ", ",
        user.name,
        "!"
      ] }),
      /* @__PURE__ */ jsxs("dl", { className: "mt-6 grid gap-3 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-2xl bg-background px-4 py-3", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-slate-500", children: t("auth.account.email") }),
          /* @__PURE__ */ jsx("dd", { className: "font-medium", children: user.email })
        ] }),
        user.phone ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-2xl bg-background px-4 py-3", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-slate-500", children: t("auth.account.phone") }),
          /* @__PURE__ */ jsx("dd", { className: "font-medium", children: user.phone })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            logout();
            navigate("/");
          },
          className: "mt-6 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white",
          children: t("auth.account.logout")
        }
      )
    ] })
  ] });
}
function formatDate$1(value, locale) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}
function BlogPage() {
  const { t, lang } = useI18n();
  const dateLocale = lang === "kk" ? "kk-KZ" : "ru-RU";
  const postsQuery = useQuery({ queryKey: ["blog"], queryFn: getBlogPosts });
  const posts = postsQuery.data ?? [];
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl space-y-8 px-4 py-6 md:px-8 md:py-10", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Блог о тойханах и организации тоя | toikhana.kz",
        description: "Статьи о выборе тойханы, ценах на свадьбу, организации торжеств в Казахстане. Советы и чек-листы.",
        path: "/blog",
        jsonLd: breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Блог", path: "/blog" }
        ])
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] bg-white p-8 shadow-soft", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: t("blog.eyebrow") }),
      /* @__PURE__ */ jsx("h1", { className: "mt-3 font-serif text-4xl", children: t("blog.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-3xl text-sm leading-7 text-slate-600", children: t("blog.intro") })
    ] }),
    posts.length ? /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: posts.map((post) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/blog/${post.slug}`,
        className: "group overflow-hidden rounded-[1.75rem] bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lg",
        children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-[16/9] w-full bg-slate-100", children: post.coverUrl ? /* @__PURE__ */ jsx(
            "img",
            {
              src: post.coverUrl,
              alt: post.title,
              loading: "lazy",
              className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
            }
          ) : null }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-6", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: formatDate$1(post.publishedAt, dateLocale) }),
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl leading-snug", children: post.title }),
            post.excerpt ? /* @__PURE__ */ jsx("p", { className: "text-sm leading-6 text-slate-600", children: post.excerpt }) : null,
            /* @__PURE__ */ jsx("span", { className: "inline-block pt-1 text-sm font-medium text-primary group-hover:underline", children: t("blog.read") })
          ] })
        ]
      },
      post.id
    )) }) : /* @__PURE__ */ jsx(EmptyState, { title: t("blog.empty"), text: t("blog.emptyText") })
  ] });
}
function formatDate(value, locale) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}
function BlogPostPage() {
  const { t, lang } = useI18n();
  const dateLocale = lang === "kk" ? "kk-KZ" : "ru-RU";
  const { slug = "" } = useParams();
  const postQuery = useQuery({ queryKey: ["blog", slug], queryFn: () => getBlogPost(slug), enabled: Boolean(slug) });
  const post = postQuery.data;
  if (postQuery.isError) {
    return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-3xl px-4 py-10 md:px-8", children: [
      /* @__PURE__ */ jsx(Seo, { title: "Статья не найдена | toikhana.kz", path: `/blog/${slug}`, noindex: true }),
      /* @__PURE__ */ jsx(EmptyState, { title: t("blog.notFound"), text: t("blog.notFoundText") }),
      /* @__PURE__ */ jsx(Link, { to: "/blog", className: "mt-6 inline-block text-sm font-medium text-primary hover:underline", children: t("blog.back") })
    ] });
  }
  if (!post) {
    return /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-3xl px-4 py-10 md:px-8" });
  }
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverUrl,
    datePublished: post.publishedAt,
    mainEntityOfPage: canonicalUrl(`/blog/${post.slug}`),
    author: { "@type": "Organization", name: "toikhana.kz" },
    publisher: { "@type": "Organization", name: "toikhana.kz" }
  };
  return /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-8 md:py-10", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${post.title} | toikhana.kz`,
        description: post.excerpt,
        path: `/blog/${post.slug}`,
        image: post.coverUrl,
        type: "article",
        jsonLd: [
          articleJsonLd,
          breadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: "Блог", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` }
          ])
        ]
      }
    ),
    /* @__PURE__ */ jsx(Link, { to: "/blog", className: "inline-block text-sm font-medium text-primary hover:underline", children: t("blog.all") }),
    /* @__PURE__ */ jsxs("article", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("header", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: formatDate(post.publishedAt, dateLocale) }),
        /* @__PURE__ */ jsx("h1", { className: "font-serif text-4xl leading-tight", children: post.title }),
        post.excerpt ? /* @__PURE__ */ jsx("p", { className: "text-lg leading-7 text-slate-600", children: post.excerpt }) : null
      ] }),
      post.coverUrl ? /* @__PURE__ */ jsx("div", { className: "aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-slate-100", children: /* @__PURE__ */ jsx("img", { src: post.coverUrl, alt: post.title, className: "h-full w-full object-cover" }) }) : null,
      /* @__PURE__ */ jsx("div", { className: "whitespace-pre-line text-base leading-8 text-slate-700", children: post.body })
    ] })
  ] });
}
function App() {
  const citiesQuery = useQuery({ queryKey: ["shell", "cities"], queryFn: getCities });
  const cities = citiesQuery.data ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(SiteHeader, { cities }),
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(HomePage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/admin", element: /* @__PURE__ */ jsx(AdminPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/toikhana/:slug", element: /* @__PURE__ */ jsx(ToikhanaPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/city/:citySlug", element: /* @__PURE__ */ jsx(CityPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/:citySlug", element: /* @__PURE__ */ jsx(CityPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(AboutPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/contacts", element: /* @__PURE__ */ jsx(ContactsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/add-toikhana", element: /* @__PURE__ */ jsx(AddToikhanaPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/register", element: /* @__PURE__ */ jsx(RegisterPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/account", element: /* @__PURE__ */ jsx(AccountPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/blog", element: /* @__PURE__ */ jsx(BlogPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/blog/:slug", element: /* @__PURE__ */ jsx(BlogPostPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, { cities })
  ] });
}
function render(url) {
  const helmetContext = {};
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, enabled: false } }
  });
  const html = renderToString(
    /* @__PURE__ */ jsx(Providers, { queryClient, helmetContext, children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) }) })
  );
  return { html, helmetContext };
}
export {
  render
};
