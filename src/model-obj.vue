<script>
import { Mesh } from "three";
import { OBJLoader } from "./loaders/OBJLoader";
import { MTLLoader } from "./loaders/MTLLoader";
import { toIndexed } from "./util";
import mixin from "./model-mixin.vue";
import cameraPlugin from "./model-camera-plugin";
import material from "./model-material";
import controls from "./model-controls";

import EventHub from "./eventHub";


// import { advToon } from "../static/material/adv-toon.js";
// import { envmapsHdr } from "../static/material/envmaps-hdr.js";

export default {
    name: "model-obj",
    mixins: [mixin, controls, cameraPlugin, material],
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
    created() {},
    data() {
        return {
            objs: this.setObjs(),
            loader: new OBJLoader(),
            mtlLoader: new MTLLoader()
        };
    },
    computed: {},
    watch: {
        mtl() {
            this.load();
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
