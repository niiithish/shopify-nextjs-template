import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

// Next/Image resolves relative src against window.location; happy-dom defaults to about:blank.
(
  window as unknown as Window & {
    happyDOM: { setURL: (url: string) => void };
  }
).happyDOM.setURL("http://localhost:3000/");

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}
