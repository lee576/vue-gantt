import {
  bindDragEvents,
  bindDropEvents,
  bindGestureEvents,
  bindPointerEvents,
  bindResizeEvents
} from "@/utils";
import {
  DraggableOptions,
  DropzoneOptions,
  GesturableOptions,
  Interactable,
  InteractStatic,
  ResizableOptions,
  Target
} from "@interactjs/types";
import Vue, { CreateElement, PropType, VNode } from "vue";

const InteractInstance = "InteractInstance" as const;

export default function getInteractComponent(interact: InteractStatic) {
  return Vue.extend({
    name: "Interact",

    props: {
      draggable: { type: Boolean, required: false },
      dragOption: {
        type: Object as PropType<DraggableOptions>,
        default: () => ({} as DraggableOptions)
      },
      resizable: { type: Boolean, required: false },
      resizeOption: {
        type: Object as PropType<ResizableOptions>,
        default: () => ({} as ResizableOptions)
      },
      droppable: { type: Boolean, required: false },
      dropOption: {
        type: Object as PropType<DropzoneOptions>,
        default: () => ({} as DropzoneOptions)
      },
      gesturable: { type: Boolean, required: false },
      gestureOption: {
        type: Object as PropType<GesturableOptions>,
        default: () => ({} as GesturableOptions)
      },
      tag: {
        type: String,
        default: "div"
      }
    },

    data: () => ({
      [InteractInstance]: null as Interactable | null
    }),

    computed: {
      interactInstance: {
        cache: false,
        set(interact: Interactable) {
          this[InteractInstance] = interact;
        },
        get(): Interactable | null {
          return this[InteractInstance];
        }
      }
    },

    watch: {
      draggable() {
        this.reset();
      },
      resizable() {
        this.reset();
      },
      gesturable() {
        this.reset();
      },
      droppable() {
        this.reset();
      }
    },

    mounted() {
      this.init();
    },

    destroyed() {
      this.destroy();
    },

    methods: {
      init() {
        if (!this.interactInstance) this.initInteract();
        if (this.draggable) this.initDrag();
        if (this.resizable) this.initResize();
        if (this.droppable) this.initDrop();
        if (this.gesturable) this.initGesture();
      },
      initInteract() {
        this.interactInstance = interact(this.$el as Target);
        bindPointerEvents(this.interactInstance, this.$emit.bind(this));
        this.$emit("ready", this.interactInstance);
      },
      initDrag() {
        this.interactInstance?.draggable(this.dragOption);
        bindDragEvents(
          this.interactInstance as Interactable,
          this.$emit.bind(this)
        );
      },
      initResize() {
        this.interactInstance?.resizable(this.resizeOption);
        bindResizeEvents(
          this.interactInstance as Interactable,
          this.$emit.bind(this)
        );
      },
      initDrop() {
        this.interactInstance?.dropzone(this.dropOption);
        bindDropEvents(
          this.interactInstance as Interactable,
          this.$emit.bind(this)
        );
      },
      initGesture() {
        this.interactInstance?.gesturable(this.gestureOption);
        bindGestureEvents(
          this.interactInstance as Interactable,
          this.$emit.bind(this)
        );
      },
      reset() {
        this.destroy();
        this.init();
      },
      destroy() {
        this.interactInstance?.unset();
        this.interactInstance = null;
      }
    },

    render(createElement: CreateElement): VNode {
      return createElement(
        this.tag,
        { staticClass: "interact" },
        this.$slots.default
      );
    }
  });
}
