import { Config } from "bili";

const config: Config = {
  input: "src/community/index.ts",
  output: {
    format: ["umd", "umd-min", "esm"],
    moduleName: "ADCommunityNotations",
    sourceMap: false,
    fileName: (context, defaultFileName) => {
      switch (context.format) {
        case "umd":
          return context.minify
            ? "ad-notations.community.min.js"
            : "ad-notations.community.umd.js";
        case "esm":
          return "ad-notations.community.esm.js";
        default:
          return defaultFileName;
      }
    }
  }
};

export default config;
