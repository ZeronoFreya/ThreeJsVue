<script>
import { Vector3 } from "three";


export default {
    data() {
        return {
            apparentHorizon: 0, // 视平线
            hl: 0, // 计算视平线所需百分比
            funMap: new Map()
        };
    },
    computed: {
        viewPoint() {
            return this.$store.state.viewPoint;
        },
        rateApparentHorizon() {
            return this.$store.state.rateApparentHorizon;
        }
    },
    watch: {
        viewPoint() {
            this.updateViewPoint();
        },
        rateApparentHorizon() {
            this.setRateApparentHorizon();
        }
    },
    created: function() {
        this.funMap.set("front", this.front);
        this.funMap.set("right", this.right);
        this.funMap.set("top", this.top);
        this.funMap.set("back", this.back);
    },
    methods: {
        setRateApparentHorizon() {
            const size = this.targetObjs.size;
            if (size) {
                this.apparentHorizon =
                    this.rateApparentHorizon * (size.length() / 2);
                this.updateViewPoint();
            }
        },
        front(distance) {
            let up = new Vector3(0, 1, 0);
            let eye = new Vector3(0, this.apparentHorizon, 0);
            let pos = new Vector3(0, this.apparentHorizon, distance);
            return [up, pos, eye];
        },
        top(distance) {
            let up = new Vector3(0, 0, -1);
            let eye = new Vector3(0, this.apparentHorizon, 0);
            let pos = new Vector3(0, distance, 0);
            return [up, pos, eye];
        },
        right(distance) {
            let up = new Vector3(0, 1, 0);
            let eye = new Vector3(0, this.apparentHorizon, 0);
            let pos = new Vector3(-distance, this.apparentHorizon, 0);
            return [up, pos, eye];
        },
        back() {
            let up = new Vector3(0, 1, 0);
            let eye = new Vector3(0, this.apparentHorizon, 0);
            let { x, y, z } = this.camera.position;
            if (x == 0 && z == 0) {
                y *= -1;
            } else {
                x *= -1;
                z *= -1;
            }
            let pos = new Vector3(x, y, z);
            return [up, pos, eye];
        },
        updateViewPoint(target = this.wrapper) {
            let viewPoint = this.funMap.get(this.viewPoint);
            if (viewPoint === undefined) {
                return;
            }
            let distance = this.distance(target);
            let [up, pos, eye] = viewPoint(distance);
            this.camera.position.copy(pos);
            this.camera.up.copy(up);
            this.camera.lookAt(eye);
            // if (this.controls) {
            //     this.controls.target.copy(eye);
            // }
        },
        resetViewPoint() {
            this.camera.position.set(
                this.cameraPosition.x,
                this.cameraPosition.y,
                this.cameraPosition.z
            );
            this.camera.rotation.set(
                this.cameraRotation.x,
                this.cameraRotation.y,
                this.cameraRotation.z
            );
            this.camera.up.set(
                this.cameraUp.x,
                this.cameraUp.y,
                this.cameraUp.z
            );

            this.camera.lookAt(
                new Vector3(
                    this.cameraLookAt.x,
                    this.cameraLookAt.y,
                    this.cameraLookAt.z
                )
            );
        }
    }
};
</script>