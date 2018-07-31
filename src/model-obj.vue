<script>
import { OBJLoader } from './loaders/OBJLoader'
import { MTLLoader } from './loaders/MTLLoader'
import { toIndexed } from './util'
import mixin from './model-mixin.vue'

import * as THREE from 'three'
import { getSize, getCenter } from './util'

export default {
    name: 'model-obj',
    mixins: [ mixin ],
    props: {
        lights: {
            type: Array,
            default() {
                return [
                    {
                        type: 'HemisphereLight',
                        position: { x: 0, y: 1, z: 0 },
                        skyColor: 0xaaaaff,
                        groundColor: 0x806060,
                        intensity: 0.2
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: 1, y: 1, z: 1 },
                        color: 0xffffff,
                        intensity: 0.8
                    }
                ]
            }
        },
        src:{
            type: Array,
            default(){
                return []
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
    data() {
        return {
            modelsCount: 0,
            loader: new OBJLoader(),
            mtlLoader: new MTLLoader()
        }
    },
    watch: {
        mtl() {
            this.load();
        }
    },
    methods: {
        process( object ) {
            if ( this.smoothing ) {
                object.traverse( child => {
                    if ( child.geometry ) {
                        child.geometry = toIndexed( child.geometry );
                        child.geometry.computeVertexNormals();
                    }
                } )
            }
        },
        load() {

            if ( this.src.length == 0 ) return;

            if ( this.object ) {
                this.wrapper.remove( this.object );
            }

            const onLoad = object => {

                if ( this.process ) {
                    this.process( object );
                }

                this.addObject( object );

                this.modelsCount -= 1;

                if ( this.modelsCount == 0 ){
                    this.$emit( 'on-load' );
                }
            }

            const onProgress = xhr => {

                this.$emit( 'on-progress', xhr );

            }

            const onError = err => {

                this.$emit( 'on-error', err );

            }

            if ( this.mtl ) {

                let mtlPath = this.mtlPath;
                let mtlSrc = this.mtl;

                if ( !this.mtlPath ) {

                    const result = /^(.*\/)([^/]*)$/.exec( this.mtl );

                    if ( result ) {
                        mtlPath = result[ 1 ];
                        mtlSrc = result[ 2 ];
                    }

                }

                if ( mtlPath ) {
                    this.mtlLoader.setPath( mtlPath )
                }

                this.mtlLoader.load( mtlSrc, materials => {

                    materials.preload();

                    this.loader.setMaterials( materials );

                    this.loader.load( this.src, onLoad, onProgress, onError );

                }, () => {}, onError );

            } else {
                for (let i = 0, il = this.src.objs.length; i < il; i++) {
                    this.modelsCount += 1;
                    this.loader.load( this.src.objs[i].obj, onLoad, onProgress, onError );
                }
            }

        }
    }
}
</script>
