import {
  defaultTheme_default,
  identifier_default,
  init_defaultTheme,
  init_identifier
} from "./chunk-K5JLJVJ4.js";
import {
  useTheme_default
} from "./chunk-4JYJKUSB.js";
import {
  require_react
} from "./chunk-ZSN3XFJS.js";
import {
  __toESM
} from "./chunk-2GTGKKMZ.js";

// node_modules/@mui/material/styles/useTheme.js
var React = __toESM(require_react());
init_defaultTheme();
init_identifier();
function useTheme() {
  const theme = useTheme_default(defaultTheme_default);
  if (true) {
    React.useDebugValue(theme);
  }
  return theme[identifier_default] || theme;
}

export {
  useTheme
};
//# sourceMappingURL=chunk-KANA5P6A.js.map
