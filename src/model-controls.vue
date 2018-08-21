<script>
import { Vector2 } from "three";
// import { getSize, getCenter } from "./util";
import { TrackballControls } from "./controls/TrackballControls";

export default {
    props: {
        controllable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            // 控制器
            controls: null,
            // 鼠标
            mouse: new Vector2()
        };
    },
    computed: {
        ctrlType() {
            return this.$store.state.control;
        },
        hasListener() {
            // 判断是否有鼠标事件监听，用于减少不必要的拾取判断
            const events = this._events;
            const result = {};

            ["on-mousemove", "on-mouseup", "on-mousedown", "on-click"].forEach(
                name => {
                    result[name] = !!events[name] && events[name].length > 0;
                }
            );

            return result;
        }
    },
    watch: {
        ctrlType() {
            this.updateCtrlType();
        },
        controllable() {
            this.updateControls();
        }
    },
    methods: {
        updateControls() {
            if (this.controllable && this.controls) return;

            if (this.controllable) {
                if (this.controls) return;

                this.controls = new TrackballControls(this.camera, this.$el);

                this.updateCtrlType();
            } else {
                if (this.controls) {
                    this.controls.dispose();
                    this.controls = null;
                }
            }
        },
        updateCtrlType() {
            this.controls.switchControls(this.ctrlType);
        },
        onMouseDown(event) {
            if (!this.hasListener["on-mousedown"]) return;

            const intersected = this.pick(event.clientX, event.clientY);
            this.$emit("on-mousedown", intersected);
        },
        onMouseMove(event) {
            if (!this.hasListener["on-mousemove"]) return;

            const intersected = this.pick(event.clientX, event.clientY);
            this.$emit("on-mousemove", intersected);
        },
        onMouseUp(event) {
            if (!this.hasListener["on-mouseup"]) return;

            const intersected = this.pick(event.clientX, event.clientY);
            this.$emit("on-mouseup", intersected);
        },
        onClick(event) {
            if (!this.hasListener["on-click"]) return;

            const intersected = this.pick(event.clientX, event.clientY);
            this.$emit("on-click", intersected);
        },
        pick(x, y) {
            if (!this.object) return;

            const rect = this.$el.getBoundingClientRect();

            x -= rect.left;
            y -= rect.top;

            this.mouse.x = x / this.size.width * 2 - 1;
            this.mouse.y = -(y / this.size.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            const intersects = this.raycaster.intersectObject(
                this.object,
                true
            );

            return (intersects && intersects.length) > 0 ? intersects[0] : null;
        }
    },
    mounted() {
        // this.$el.addEventListener("contextmenu", this.contextmenu, false);
        // this.$el.addEventListener("mousedown", this.onMouseDown, false);
        // this.$el.addEventListener("mousemove", this.onMouseMove, false);
        // this.$el.addEventListener("mouseup", this.onMouseUp, false);
        // this.$el.addEventListener("click", this.onClick, false);
    },
    beforeDestroy() {
        // this.$el.removeEventListener("contextmenu", this.contextmenu, false);
        // this.$el.removeEventListener("mousedown", this.onMouseDown, false);
        // this.$el.removeEventListener("mousemove", this.onMouseMove, false);
        // this.$el.removeEventListener("mouseup", this.onMouseUp, false);
        // this.$el.removeEventListener("click", this.onClick, false);
    }
};
</script>