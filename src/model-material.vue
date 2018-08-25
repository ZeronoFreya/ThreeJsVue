<script>
import { Vector3 } from "three";
import { wire } from "./material/wire";

export default {
    data() {
        return {
            funMap: new Map()
        };
    },
    computed: {
        rateApparentHorizon() {
            return this.$store.state.rateApparentHorizon;
        }
    },
    watch: {
        rateApparentHorizon() {
            this.setRateApparentHorizon();
        }
    },
    created: function() {
        this.funMap.set("wire", this.front);
    },
    methods: {
        front(distance) {
            return {
                lookat: new Vector3(0, this.apparentHorizon, 0),
                pos: new Vector3(0, this.apparentHorizon, distance),
                up: new Vector3(0, 1, 0)
            };
        }
    }
};
</script>