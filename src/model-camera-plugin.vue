<script>
import { Vector3 } from "three";

export default {
    data() {
        return {
            apparentHorizon: 0, // 视平线
            hl: 0, // 计算视平线所需百分比
            // funMap: new Map()
        };
    },
    computed: {
        facedPlane() {
            return this.$store.state.facedPlane;
        },
        rateApparentHorizon() {
            return this.$store.state.rateApparentHorizon;
        }
    },
    watch: {
        facedPlane() {
            if (this.facedPlane) {
                this.threeView();
            }
        },
        rateApparentHorizon() {
            this.setRateApparentHorizon();
        }
    },
    created: function() {
        if (this.funMap === undefined) {
            this.funMap = new Map();
        }
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
            return {
                lookat: new Vector3(0, this.apparentHorizon, 0),
                pos: new Vector3(0, this.apparentHorizon, distance),
                up: new Vector3(0, 1, 0)
            };
        },
        top(distance) {
            return {
                lookat: new Vector3(0, this.apparentHorizon, 0),
                pos: new Vector3(0, distance, 0),
                up: new Vector3(0, 0, -1)
            };
        },
        right(distance) {
            return {
                lookat: new Vector3(0, this.apparentHorizon, 0),
                pos: new Vector3(-distance, this.apparentHorizon, 0),
                up: new Vector3(0, 1, 0)
            };
        },
        back() {
            let { x, y, z } = this.camera.position;
            if (x == 0 && z == 0) {
                y *= -1;
            } else {
                x *= -1;
                z *= -1;
            }
            return {
                lookat: new Vector3(0, this.apparentHorizon, 0),
                pos: new Vector3(x, y, z),
                up: new Vector3(0, 1, 0)
            };
        },
        threeView(target = this.wrapper) {
            let facedPlane = this.funMap.get(this.facedPlane);
            if (facedPlane === undefined) {
                return;
            }
            let distance = this.distance(target);
            let camera = facedPlane(distance);
            this.updateViewPoint(camera);
            this.render();
            this.$store.commit('setFacedPlane');
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