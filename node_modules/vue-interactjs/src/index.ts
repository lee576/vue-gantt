import getInteractComponent from "@/interact";
import interact from "interactjs";
import { PluginObject, VueConstructor } from "vue";

declare global {
  interface Window {
    Vue: VueConstructor;
  }
}

const version = "__VERSION__";

const install = (Vue: VueConstructor): void => {
  const InteractComponent = getInteractComponent(interact);

  Vue.component("Interact", InteractComponent);
};

const plugin: PluginObject<VueConstructor> = {
  install,
  version
};
export default plugin;

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(plugin);
}
