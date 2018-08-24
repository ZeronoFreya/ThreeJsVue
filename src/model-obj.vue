<script>
import { OBJLoader } from "./loaders/OBJLoader";
import { MTLLoader } from "./loaders/MTLLoader";
import { toIndexed } from "./util";
import mixin from "./model-mixin.vue";
import cameraPlugin from "./model-camera-plugin";
import controls from "./model-controls";

import EventHub from "./eventHub";

export default {
    name: "model-obj",
    mixins: [mixin, controls, cameraPlugin],
    props: {
        src: {
            type: Object,
            default() {
                return {};
            }
        },
        smoothing: {
            type: Boolean,
            default: false
        },
        mtlPath: {
            type: String
        },
        mtl: {
            type: String
        }
    },
    created() {
        // EventHub.$on("setmaterial", (mtl, lights = null) => {
        //     this.setMaterial(mtl);
        //     this.updateLights(lights);
        //     // EventHub.$emit("loading");
        //     this.$store.commit('toggleLoading');
            
        // });
        // EventHub.$on("setapparenthorizon", hl => {
        //     this.setApparentHorizon(hl);
        // });
    },
    data() {
        return {
            objs: this.setObjs(),
            loader: new OBJLoader(),
            mtlLoader: new MTLLoader()
        };
    },
    computed: {
        material() {
            return this.$store.state.material;
        },
        rendererOpt() {
            return this.$store.state.rendererOpt;
        },
    },
    watch: {
        mtl() {
            this.load();
        },
        material(){
            this.setMaterial(this.material);
            // this.updateLights(null);
            // this.$store.commit('toggleLoading');
        },
        rendererOpt(){
            this.updateRendererOpt();
            // this.render();
        }
    },
    methods: {
        process(object) {
            if (this.smoothing) {
                object.traverse(child => {
                    if (child.geometry) {
                        child.geometry = toIndexed(child.geometry);
                        child.geometry.computeVertexNormals();
                    }
                });
            }
        },
        updateRendererOpt(){
            for (const key in this.rendererOpt) {
                if (this.rendererOpt.hasOwnProperty(key)) {
                    this.renderer[key] = this.rendererOpt[key];
                }
            }
        },
        buildOver() {
            EventHub.renderer = this.renderer;
            EventHub.camera = this.camera;
            EventHub.controls = this.controls;
            // this.controls.switchControls(EventHub.controltype);
        },
        load() {
            if (this.objs.length == 0) return;

            // if (this.object) {
            //   this.wrapper.remove(this.object);
            // }

            const onLoad = object => {
                if (this.process) {
                    this.process(object);
                }

                this.addObject(object);
            };

            const onProgress = xhr => {
                this.$emit("on-progress", xhr);
            };

            const onError = err => {
                this.$emit("on-error", err);
            };

            if (this.mtl) {
                let mtlPath = this.mtlPath;
                let mtlSrc = this.mtl;

                if (!this.mtlPath) {
                    const result = /^(.*\/)([^/]*)$/.exec(this.mtl);

                    if (result) {
                        mtlPath = result[1];
                        mtlSrc = result[2];
                    }
                }

                if (mtlPath) {
                    this.mtlLoader.setPath(mtlPath);
                }

                this.mtlLoader.load(
                    mtlSrc,
                    materials => {
                        materials.preload();

                        this.loader.setMaterials(materials);

                        this.loader.load(this.src, onLoad, onProgress, onError);
                    },
                    () => {},
                    onError
                );
            } else {
                for (let i = 0, il = this.objs.length; i < il; i++) {
                    this.loadStart();
                    this.loader.load(
                        this.objs[i].obj,
                        onLoad,
                        onProgress,
                        onError
                    );
                }
            }
        }
    }
};
</script>
