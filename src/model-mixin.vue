<template>
    <div style="width: 100%; height: 100%; margin: 0; border: 0; padding: 0;">
        <canvas v-if="suportWebGL" ref="canvas" style="width: 100%; height: 100%;"></canvas>
        <div v-else>
            <slot>
                Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>'
            </slot>
        </div>
    </div>
</template>

<script>
import {
    Object3D,
    Vector3,
    Color,
    Scene,
    BoxHelper,
    PolarGridHelper,
    Raycaster,
    WebGLRenderer,
    PerspectiveCamera,
    AmbientLight,
    PointLight,
    HemisphereLight,
    DirectionalLight,
    Mesh
} from "three";
import { getSize, getCenter } from "./util";
// import { OrbitControls } from './controls/OrbitControls'
// import { TrackballControls } from "./controls/TrackballControls.js";
import { pathJoin } from "./base";

const suportWebGL = (() => {
    try {
        var canvas = document.createElement("canvas");
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl"))
        );
    } catch (e) {
        return false;
    }
})();

export default {
    props: {
        src: {
            type: Array
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        position: {
            type: Object,
            default() {
                return { x: 0, y: 0, z: 0 };
            }
        },
        rotation: {
            type: Object,
            default() {
                return { x: 0, y: 0, z: 0 };
            }
        },
        scale: {
            type: Object,
            default() {
                return { x: 1, y: 1, z: 1 };
            }
        },
        lights: {
            type: Array,
            default() {
                return [
                    {
                        type: "HemisphereLight",
                        position: { x: 0, y: 1, z: 0 },
                        skyColor: 0xaaaaff,
                        groundColor: 0x806060,
                        intensity: 0.2
                    },
                    {
                        type: "DirectionalLight",
                        position: { x: 1, y: 1, z: 1 },
                        color: 0xffffff,
                        intensity: 0.8
                    }
                ];
            }
        },
        cameraPosition: {
            type: Object,
            default() {
                return new Vector3(0, 0, 0);
            }
        },
        cameraUp: {
            type: Object,
            default() {
                return new Vector3(0, 1, 0);
            }
        },
        cameraLookAt: {
            type: Object,
            default() {
                return new Vector3(0, 0, 0);
            }
        },
        backgroundColor: {
            default: 0xffffff
        },
        backgroundAlpha: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            // 场景
            suportWebGL,
            scene: new Scene(),
            renderer: null,
            rect: {
                top: this.offsetTop,
                left: this.offsetLeft,
                width: this.width,
                height: this.height
            },
            // 摄像机
            vertFOV: 45,
            aspectRatio: 1,
            camera: new PerspectiveCamera(
                this.vertFOV,
                this.aspectRatio,
                0.01,
                8000
            ),
            raycaster: new Raycaster(),
            // 模型
            asyncModelsCount: 0,
            isLoaded: false,
            allObjects: [],
            targetObjs: {
                objs: null,
                size: null,
                distance: 0
            },
            wrapper: new Object3D(),
            // 灯光
            allLights: [],
            // clock: typeof performance === "undefined" ? Date : performance,
            reqId: null // requestAnimationFrame id
        };
    },
    computed: {},
    mounted() {
        // if (this.width === undefined || this.height === undefined) {
        //     this.rect = {
        //         width: this.$el.offsetWidth,
        //         height: this.$el.offsetHeight
        //     };
        // }
        // this.aspectRatio = this.rect.width / this.rect.height;

        

        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: this.$refs.canvas
        });
        this.renderer.shadowMap.enabled = true;

        this.scene.add(this.wrapper);


        
        

        this.setRect();

        this.load();

        this.updateRenderer();
        this.updateCamera();
        this.updateLights(this.lights);

        window.addEventListener("resize", this.onResize, false);

        this.buildOver();
    },
    beforeDestroy() {
        cancelAnimationFrame(this.reqId);

        window.removeEventListener("resize", this.onResize, false);
    },
    watch: {
        src() {
            this.load();
        },
        rotation: {
            deep: true,
            handler(val) {
                if (!this.object) return;
                this.object.rotation.set(val.x, val.y, val.z);
            }
        },
        position: {
            deep: true,
            handler(val) {
                if (!this.object) return;
                this.object.position.set(val.x, val.y, val.z);
            }
        },
        scale: {
            deep: true,
            handler(val) {
                if (!this.object) return;
                this.object.scale.set(val.x, val.y, val.z);
            }
        },
        size: {
            deep: true,
            handler(val) {
                this.updateCamera();
                this.updateRenderer();
                this.render();
            }
        },
        backgroundAlpha() {
            this.updateRenderer();
        },
        backgroundColor() {
            this.updateRenderer();
        }
    },
    methods: {
        setRect() {
            const box = this.$el.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            const d = this.$el.ownerDocument.documentElement;

            this.rect = {
                left: box.left + window.pageXOffset - d.clientLeft,
                top: box.top + window.pageYOffset - d.clientTop,
                width: this.$el.offsetWidth,
                height: this.$el.offsetHeight
            };
            this.aspectRatio = this.rect.width / this.rect.height;
            this.updateRenderer();
            this.updateCamera();
            this.render();
        },
        onResize() {
            if (
                this.$el.offsetWidth !== this.rect.width ||
                this.$el.offsetHeight !== this.rect.height
            ) {
                this.$nextTick(() => {
                    this.setRect();
                });
            }
        },
        updateModel() {
            const object = this.object;

            if (!object) return;

            const position = this.position;
            const rotation = this.rotation;
            const scale = this.scale;

            object.position.set(position.x, position.y, position.z);
            object.rotation.set(rotation.x, rotation.y, rotation.z);
            object.scale.set(scale.x, scale.y, scale.z);
        },
        updateRenderer() {
            const renderer = this.renderer;

            renderer.setSize(this.rect.width, this.rect.height);
            renderer.setPixelRatio(window.devicePixelRatio || 1);
            renderer.setClearColor(new Color(this.backgroundColor).getHex());
            renderer.setClearAlpha(this.backgroundAlpha);
        },
        updateCamera() {
            // if (this.isLoaded) {
            this.camera.aspect = this.aspectRatio;
            this.camera.updateProjectionMatrix();
            // }
        },
        updateLights(_light) {
            _light = _light ? _light : this.lights;

            this.scene.remove.apply(this.scene, this.allLights);

            this.allLights = [];

            _light.forEach(item => {
                if (!item.type) return;

                const type = item.type.toLowerCase();

                let light = null;

                if (type === "ambient" || type === "ambientlight") {
                    const color = item.color || 0x404040;
                    const intensity = item.intensity || 1;

                    light = new AmbientLight(color, intensity);
                } else if (type === "point" || type === "pointlight") {
                    const color = item.color || 0xffffff;
                    const intensity = item.intensity || 1;
                    const distance = item.distance || 0;
                    const decay = item.decay || 1;

                    light = new PointLight(color, intensity, distance, decay);

                    if (item.position) {
                        light.position.copy(item.position);
                    }
                } else if (
                    type === "directional" ||
                    type === "directionallight"
                ) {
                    const color = item.color || 0xffffff;
                    const intensity = item.intensity || 1;

                    light = new DirectionalLight(color, intensity);

                    if (item.position) {
                        light.position.copy(item.position);
                    }

                    if (item.target) {
                        light.target.copy(item.target);
                    }
                } else if (
                    type === "hemisphere" ||
                    type === "hemispherelight"
                ) {
                    const skyColor = item.skyColor || 0xffffff;
                    const groundColor = item.groundColor || 0xffffff;
                    const intensity = item.intensity || 1;

                    light = new HemisphereLight(
                        skyColor,
                        groundColor,
                        intensity
                    );

                    if (item.position) {
                        light.position.copy(item.position);
                    }
                }

                this.allLights.push(light);
                this.scene.add(light);
            });
        },
        load() {
            if (this.src.length == 0) return;

            if (this.object) {
                this.wrapper.remove(this.object);
            }

            for (let i = 0, il = this.src.length; i < il; i++) {
                this.modelsCount += 1;
                this.loader.load(
                    this.src[i].model,
                    (...args) => {
                        const object = this.getObject(...args);

                        if (this.process) {
                            this.process(object);
                        }

                        this.addObject(object);

                        if (this.modelsCount == 0) {
                            this.$emit("on-load");
                        }
                    },
                    xhr => {
                        this.$emit("on-progress", xhr);
                    },
                    err => {
                        this.$emit("on-error", err);
                    }
                );
            }
        },
        loadStart() {
            this.asyncModelsCount += 1;
        },
        loadEnd() {
            this.asyncModelsCount -= 1;
            if (this.asyncModelsCount == 0) {
                this.allLoaded();
            }
        },
        allLoaded() {
            this.isLoaded = true;
            const center = getCenter(this.wrapper);
            const y = center.y;
            // correction position
            this.wrapper.position.copy(center.negate());
            this.scene.add( new BoxHelper( this.wrapper ) );

            // this.updateCamera();
            const dis = this.distance(this.wrapper);
            // let y = -center.y;
            const x = Math.sqrt((Math.pow(dis, 2) - Math.pow(y, 2)) / 2);
            const camera = {
                lookat: new Vector3(),
                pos: new Vector3(x, y, x),
                up: new Vector3(0, 1, 0)
            };

            const polarGridHelper = new PolarGridHelper( dis, 3, 2, 64, 0xffffff, 0xffffff );
            polarGridHelper.position.y = 0;
            polarGridHelper.position.x = 0;
            this.scene.add( polarGridHelper );


            this.updateViewPoint(camera);
            // this.toFront()
            // this.updateModel()

            this.asyncModelsCount = 0;

            this.$emit("on-load");

            // this.animate();
            this.render();
        },
        getObject(object) {
            return object;
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
        addObject(object) {
            this.object = object;
            this.allObjects.push(object);
            this.wrapper.add(object);

            this.loadEnd();
        },
        updateViewPoint(camera) {
            this.camera.position.copy(camera.pos);
            this.camera.up.copy(camera.up);
            this.camera.lookAt(camera.lookat);
            this.render();
        },
        setMaterial(mtl, objects = this.allObjects) {
            let object;
            for (let i = 0, il = objects.length; i < il; i++) {
                object = objects[i];
                object.traverse(function(child) {
                    if (child instanceof Mesh) {
                        if (child.material) child.material.dispose();
                        child.material = mtl;
                    }
                });
            }
            this.render();
        },
        setObjs() {
            let objs = [];
            let obj,
                mtl = "";
            for (let i = 0, il = this.src.objs.length; i < il; i++) {
                obj = this.src.objs[i];
                mtl = "";
                if (typeof obj == Object) {
                    obj = obj.obj;
                    mtl = obj.mtl || "";
                }
                objs.push({
                    obj: pathJoin(this.src.base, obj),
                    mtl: mtl
                });
            }
            return objs;
        },

        buildOver() {},
        animate() {
            this.reqId = requestAnimationFrame(this.animate);
            this.render();
        },
        render() {
            // this.controls.update();

            this.renderer.render(this.scene, this.camera);
        }
    }
};
</script>
