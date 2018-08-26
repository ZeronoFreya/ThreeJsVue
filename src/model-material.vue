<script>
import { Vector3 } from "three";
import { wire } from "./material/wire";
import { advToon } from "./material/adv-toon";
import { envmapsHdr } from "./material/envmaps-hdr";

export default {
    data() {
        return {};
    },
    computed: {
        rme() {
            return this.$store.state.rme;
        }
    },
    watch: {
        rme() {
            this.setRME();
        }
    },
    created: function() {
        if (this.funMap === undefined) {
            this.funMap = new Map();
        }
        this.funMap.set("wire", wire);
        this.funMap.set("advToon", advToon);
        this.funMap.set("envmapsHdr", envmapsHdr);
    },
    methods: {
        setRME() {
            this.$store.commit("toggleLoading", true);
            this.funMap.get(this.rme)({
                objects: this.allObjects,
                renderer: this.renderer,
                updateLights: this.updateLights
            });
            this.render();
            this.$store.commit("toggleLoading", false);
        }
    }
};
</script>