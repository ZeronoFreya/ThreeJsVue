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
        contextmenu(event) {
            event.preventDefault();
        },
        onMouseDown(event) {
            event.preventDefault();
            event.stopPropagation();

            this.controls.mousedown(event);

            this.$el.addEventListener("mousemove", this.onMouseMove, false);
            this.$el.addEventListener("mouseup", this.onMouseUp, false);

            this.$el.setCapture();
        },
        onMouseMove(event) {
            event.preventDefault();
            event.stopPropagation();

            this.controls.mousemove(event);
            const camera = this.controls.getCamera();
            return this.updateViewPoint(camera);
        },
        onMouseUp(event) {
            event.preventDefault();
            event.stopPropagation();

            this.controls.mouseup(event);

            this.$el.removeEventListener("mousemove", this.onMouseMove, false);
            this.$el.removeEventListener("mouseup", this.onMouseUp, false);

            this.$el.releaseCapture();

        },
        mousewheel(event) {
            event.preventDefault();
            event.stopPropagation();
            this.controls.mousewheel(event);
            const camera = this.controls.getCamera();
            return this.updateViewPoint(camera)
        },
        touchstart(event) {
            event.preventDefault();
            event.stopPropagation();

            this.controls.touchstart(event);
            
        },
        touchmove(event) {
            event.preventDefault();
            event.stopPropagation();

            this.controls.touchmove(event);
            const camera = this.controls.getCamera();
            return this.updateViewPoint(camera);
        },
        touchend(event) {
            event.preventDefault();
            event.stopPropagation();
            this.controls.touchend(event);
            
        }
    },
    mounted() {
        this.updateControls();

        this.$el.addEventListener("contextmenu", this.contextmenu, false);
        
        this.$el.addEventListener("mousedown", this.onMouseDown, false);
        
        this.$el.addEventListener("wheel", this.mousewheel, false);

        this.$el.addEventListener("touchstart", this.touchstart, false);
        this.$el.addEventListener("touchend", this.touchend, false);
        this.$el.addEventListener("touchmove", this.touchmove, false);
    },
    beforeDestroy() {
        this.$el.removeEventListener("contextmenu", this.contextmenu, false);
        
        this.$el.removeEventListener("mousedown", this.onMouseDown, false);
        this.$el.removeEventListener("mousemove", this.onMouseMove, false);
        this.$el.removeEventListener("mouseup", this.onMouseUp, false);
        
        this.$el.removeEventListener("wheel", this.mousewheel, false);
        
        this.$el.removeEventListener("touchstart", this.touchstart, false);
        this.$el.removeEventListener("touchend", this.touchend, false);
        this.$el.removeEventListener("touchmove", this.touchmove, false);
    }
};
</script>