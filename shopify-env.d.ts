/// <reference types="@shopify/app-bridge-types" />

import type {
  SAppNavAttributes,
  SAppNavLinkAttributes,
} from "@shopify/app-bridge-types";

declare global {
  interface Window {
    shopify?: {
      idToken: () => Promise<string>;
    };
  }

  namespace JSX {
    interface IntrinsicElements {
      "s-app-nav": SAppNavAttributes;
      "s-link": SAppNavLinkAttributes;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "s-app-nav": SAppNavAttributes;
      "s-link": SAppNavLinkAttributes;
    }
  }
}
