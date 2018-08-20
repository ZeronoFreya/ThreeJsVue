<script>
import {
    Object3D,
    Vector2,
    Vector3,
    Color,
    Scene,
    Raycaster,
    WebGLRenderer,
    PerspectiveCamera,
    AmbientLight,
    PointLight,
    HemisphereLight,
    DirectionalLight,
    MeshBasicMaterial,
    Mesh
} from "three";
import { getSize, getCenter } from "./util";

export default {
    data() {
        return {
            apparentHorizon: 0, // 视平线
            hl: 0 // 计算视平线所需百分比
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
    created: function() {},
    methods: {
        setRateApparentHorizon() {
            const size = this.targetObjs.size;
            if (size) {
                this.apparentHorizon =
                    this.rateApparentHorizon * (size.length() / 2);
                this.updateViewPoint();
            }
        },
        updateViewPoint(target = null) {
            let pos, distance;
            let up = new Vector3(0, 1, 0);
            let eye = new Vector3(0, this.apparentHorizon, 0);

            switch (this.viewPoint) {
                case "front":
                    distance = this.distance(target || this.wrapper);
                    pos = new Vector3(0, this.apparentHorizon, distance);
                    break;
                case "right":
                    distance = this.distance(target || this.wrapper);
                    pos = new Vector3(-distance, this.apparentHorizon, 0);
                    break;
                case "top":
                    distance = this.distance(target || this.wrapper);
                    pos = new Vector3(0, distance, 0);
                    up.set(0, 0, -1);
                    break;
                case "back":
                    let { x, y, z } = this.camera.position;
                    if (x == 0 && z == 0) {
                        y *= -1;
                    } else {
                        x *= -1;
                        z *= -1;
                    }
                    pos = new Vector3(x, y, z);
                    break;
                default:
                    break;
            }

            this.camera.position.copy(pos);
            this.camera.up.copy(up);
            this.camera.lookAt(eye);
            if (this.controls) {
                this.controls.target.copy(eye);
            }
        },
        distance(target) {
            if (this.targetObjs.objs === target) {
                this.apparentHorizon = this.hl * (this.targetObjs.size.y / 2);
                return this.targetObjs.distance;
            }
            const size = getSize(target);

            let len =
                this.aspectRatio < size.x / size.y ? size.x / 2 : size.y / 2;

            let dis =
                len / Math.tan(this.vertFOV / 2 * Math.PI / 180) + size.z / 2;

            this.targetObjs.objs = target;
            this.targetObjs.size = size;
            this.targetObjs.distance = dis;
            this.apparentHorizon = this.hl * (size.y / 2);
            return dis;
            // const distance = getSize( this.wrapper ).length();
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
        },
    }
};
</script>