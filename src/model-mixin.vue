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
} from 'three'
import { getSize, getCenter } from './util'
// import { OrbitControls } from './controls/OrbitControls'
import { TrackballControls } from './controls/TrackballControls.js'
import { pathJoin } from "./base";

const suportWebGL = ( () => {

    try {
        var canvas = document.createElement( 'canvas' );
        return !!( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
    } catch ( e ) {
        return false;
    }

} )();

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
                return { x: 0, y: 0, z: 0 }
            }
        },
        rotation: {
            type: Object,
            default() {
                return { x: 0, y: 0, z: 0 }
            }
        },
        scale: {
            type: Object,
            default() {
                return { x: 1, y: 1, z: 1 }
            }
        },
        lights: {
            type: Array,
            default() {
                return [{
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
                }];
            }
        },
        cameraPosition: {
            type: Object
        },
        cameraRotation: {
            type: Object
        },
        cameraUp: {
            type: Object
        },
        cameraLookAt: {
            type: Object
        },
        backgroundColor: {
            default: 0xffffff
        },
        backgroundAlpha: {
            type: Number,
            default: 1
        },
        controllable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            suportWebGL,
            size: {
                width: this.width,
                height: this.height
            },
            targetObjs:{
                objs:null,
                size:null,
                distance:0
            },
            apparentHorizon : 0, // 视平线
            hl:0, // 计算视平线所需百分比
            vertFOV : 45,
            aspectRatio: 1,
            objectsCount: 0,
            isLoaded:false,
            allObjects: [],
            raycaster: new Raycaster(),
            mouse: new Vector2(),
            camera: new PerspectiveCamera( this.vertFOV, this.aspectRatio, 0.01, 8000 ),
            scene: new Scene(),
            wrapper: new Object3D(),
            renderer: null,
            controls: null,
            allLights: [],
            clock: typeof performance === 'undefined' ? Date : performance,
            reqId: null    // requestAnimationFrame id
        }
    },
    computed: {
        hasListener() {

            // 判断是否有鼠标事件监听，用于减少不必要的拾取判断
            const events = this._events;
            const result = {};

            [ 'on-mousemove', 'on-mouseup', 'on-mousedown', 'on-click' ].forEach( name => {
                result[ name ] = !!events[ name ] && events[ name ].length > 0;
            } )

            return result;
        }
    },
    mounted() {

        if ( this.width === undefined || this.height === undefined ) {
            this.size = {
                width: this.$el.offsetWidth,
                height: this.$el.offsetHeight
            }
        }
        this.aspectRatio = this.size.width / this.size.height;

        this.renderer = new WebGLRenderer( { antialias: true, alpha: true, canvas: this.$refs.canvas } )
        this.renderer.shadowMap.enabled = true;

        this.scene.add( this.wrapper )

        this.load();
        this.update();

        this.$el.addEventListener( 'mousedown', this.onMouseDown, false );
        this.$el.addEventListener( 'mousemove', this.onMouseMove, false );
        this.$el.addEventListener( 'mouseup', this.onMouseUp, false );
        this.$el.addEventListener( 'click', this.onClick, false );

        window.addEventListener( 'resize', this.onResize, false );

        this.buildOver();

        
    },
    beforeDestroy() {

        cancelAnimationFrame( this.reqId );

        this.$el.removeEventListener( 'mousedown', this.onMouseDown, false );
        this.$el.removeEventListener( 'mousemove', this.onMouseMove, false );
        this.$el.removeEventListener( 'mouseup', this.onMouseUp, false );
        this.$el.removeEventListener( 'click', this.onClick, false );

        window.removeEventListener( 'resize', this.onResize, false );
    },
    watch: {
        src() {
            this.load();
        },
        rotation: {
            deep: true,
            handler( val ) {
                if ( !this.object ) return;
                this.object.rotation.set( val.x, val.y, val.z );
            }
        },
        position: {
            deep: true,
            handler( val ) {
                if ( !this.object ) return;
                this.object.position.set( val.x, val.y, val.z );
            }
        },
        scale: {
            deep: true,
            handler( val ) {
                if ( !this.object ) return;
                this.object.scale.set( val.x, val.y, val.z );
            }
        },
        size: {
            deep: true,
            handler( val ) {
                this.updateCamera();
                this.updateRenderer();
            }
        },
        controllable() {
            this.updateControls();
        },
        backgroundAlpha() {
            this.updateRenderer();
        },
        backgroundColor() {
            this.updateRenderer();
        }
    },
    methods: {
        onResize() {
            if ( this.$el.offsetWidth !== this.size.width ||
                 this.$el.offsetHeight !== this.size.height ) {
                this.$nextTick( () => {
                    this.size = {
                        width: this.$el.offsetWidth,
                        height: this.$el.offsetHeight
                    }
                    this.aspectRatio = this.size.width / this.size.height;
                } )
            }
        },
        onMouseDown( event ) {

            if ( !this.hasListener[ 'on-mousedown' ] ) return;

            const intersected = this.pick( event.clientX, event.clientY );
            this.$emit( 'on-mousedown', intersected );

        },
        onMouseMove( event ) {

            if ( !this.hasListener[ 'on-mousemove' ] ) return;

            const intersected = this.pick( event.clientX, event.clientY );
            this.$emit( 'on-mousemove', intersected );

        },
        onMouseUp( event ) {

            if ( !this.hasListener[ 'on-mouseup' ] ) return;

            const intersected = this.pick( event.clientX, event.clientY );
            this.$emit( 'on-mouseup', intersected );

        },
        onClick( event ) {

            if ( !this.hasListener[ 'on-click' ] ) return;

            const intersected = this.pick( event.clientX, event.clientY );
            this.$emit( 'on-click', intersected );

        },
        pick( x, y ) {

            if ( !this.object ) return;

            const rect = this.$el.getBoundingClientRect();

            x -= rect.left;
            y -= rect.top;

            this.mouse.x = ( x / this.size.width ) * 2 - 1;
            this.mouse.y = -( y / this.size.height ) * 2 + 1;

            this.raycaster.setFromCamera( this.mouse, this.camera );

            const intersects = this.raycaster.intersectObject( this.object, true );

            return ( intersects && intersects.length ) > 0 ? intersects[ 0 ] : null;

        },
        update() {            
            this.updateRenderer();
            this.updateCamera();
            this.updateLights(this.lights);
            this.updateControls();

        },
        updateModel() {

            const object = this.object;

            if ( !object ) return;

            const position = this.position;
            const rotation = this.rotation;
            const scale = this.scale;

            object.position.set( position.x, position.y, position.z );
            object.rotation.set( rotation.x, rotation.y, rotation.z );
            object.scale.set( scale.x, scale.y, scale.z );

        },
        updateRenderer() {

            const renderer = this.renderer;

            renderer.setSize( this.size.width, this.size.height );
            renderer.setPixelRatio( window.devicePixelRatio || 1 );
            renderer.setClearColor( new Color( this.backgroundColor ).getHex() );
            renderer.setClearAlpha( this.backgroundAlpha );
        },
        updateCamera() {
            if (this.isLoaded) {
                this.camera.aspect = this.aspectRatio;
                this.camera.updateProjectionMatrix();
            }
        },
        updateLights(_light ) {
            _light = _light ? _light : this.lights;
            
            this.scene.remove.apply( this.scene, this.allLights );

            this.allLights = [];

            _light.forEach( item => {

                if ( !item.type ) return;

                const type = item.type.toLowerCase();

                let light = null;

                if ( type === 'ambient' || type === 'ambientlight' ) {

                    const color = item.color || 0x404040;
                    const intensity = item.intensity || 1;

                    light = new AmbientLight( color, intensity );

                } else if ( type === 'point' || type === 'pointlight' ) {

                    const color = item.color || 0xffffff;
                    const intensity = item.intensity || 1;
                    const distance = item.distance || 0;
                    const decay = item.decay || 1;

                    light = new PointLight( color, intensity, distance, decay );

                    if ( item.position ) {
                        light.position.copy( item.position );
                    }

                } else if ( type === 'directional' || type === 'directionallight' ) {

                    const color = item.color || 0xffffff;
                    const intensity = item.intensity || 1;

                    light = new DirectionalLight( color, intensity );

                    if ( item.position ) {
                        light.position.copy( item.position );
                    }

                    if ( item.target ) {
                        light.target.copy( item.target );
                    }

                } else if ( type === 'hemisphere' || type === 'hemispherelight' ) {

                    const skyColor = item.skyColor || 0xffffff;
                    const groundColor = item.groundColor || 0xffffff;
                    const intensity = item.intensity || 1;

                    light = new HemisphereLight( skyColor, groundColor, intensity );

                    if ( item.position ) {
                        light.position.copy( item.position );
                    }

                }

                this.allLights.push( light );
                this.scene.add( light );

            } )

        },
        updateControls() {

            if ( this.controllable && this.controls ) return;

            if ( this.controllable ) {

                if ( this.controls ) return;

                // this.controls = new OrbitControls( this.camera, this.$el );
                // this.controls.type = 'orbit';
                this.controls = new TrackballControls( this.camera, this.$el );
                this.controls.type = 'trackball';
                this.controls.rotateY = true;

            } else {

                if ( this.controls ) {

                    this.controls.dispose();
                    this.controls = null;

                }

            }

        },
        load() {

            if ( this.src.length == 0 ) return;

            if ( this.object ) {

                this.wrapper.remove( this.object );

            }

            for (let i = 0, il = this.src.length; i < il; i++) {
                    this.modelsCount += 1;
                    this.loader.load( this.src[i].model, ( ...args ) => {

                        const object = this.getObject( ...args )

                        if ( this.process ) {
                            this.process( object );
                        }

                        this.addObject( object )

                        if ( this.modelsCount == 0 ){
                            this.$emit( 'on-load' );
                        }

                    }, xhr => {

                        this.$emit( 'on-progress', xhr );

                    }, err => {

                        this.$emit( 'on-error', err );

                    } );
                }
            

        },
        loadStart(){
            this.objectsCount += 1
        },
        loadEnd(){
            this.objectsCount -= 1
            if (this.objectsCount == 0) {
                this.allLoaded();
            }
        },
        allLoaded(){
            this.isLoaded = true;
            const center = getCenter( this.wrapper )
            // correction position
            this.wrapper.position.copy( center.negate() )

            this.updateCamera()
            this.toFront()
            // this.updateModel()

            this.objectsCount = 0;

            this.$emit("on-load");

            this.animate();
        },
        getObject( object ) {

            return object

        },
        addObject( object ) {
            this.object = object
            this.allObjects.push(object)
            this.wrapper.add( object )

            this.loadEnd()          
        },
        setMaterial(mtl, objects=this.allObjects){
            let object;
            for (let i = 0, il = objects.length; i < il; i++) {
                object = objects[i];
                object.traverse( function ( child ) {
                    if ( child instanceof Mesh ) {
                        if (child.material) child.material.dispose();
                        child.material = mtl;
                    }
                } );
            }      
        },
        setObjs() {
            let objs = [];
            let obj, mtl = '';
            for (let i = 0, il = this.src.objs.length; i < il; i++) {
                obj = this.src.objs[i];
                mtl = '';
                if (typeof obj == Object){
                    obj = obj.obj;
                    mtl = obj.mtl || "";
                }
                objs.push({
                    obj: pathJoin(this.src.base, obj),
                    mtl: mtl
                })
            }
        return objs;
        },
        setApparentHorizon(hl){
            this.hl = hl;
            const size = this.targetObjs.size;
            if (size) {
                this.apparentHorizon = this.hl*(size.length()/2);

                this.updateViewPoint(
                    [0,this.apparentHorizon,this.targetObjs.distance]
                );
            }
        },
        resetViewPoint(){
            this.camera.position.set( 
                this.cameraPosition.x, 
                this.cameraPosition.y, 
                this.cameraPosition.z )
            this.camera.rotation.set( 
                this.cameraRotation.x, 
                this.cameraRotation.y, 
                this.cameraRotation.z )
            this.camera.up.set( 
                this.cameraUp.x, 
                this.cameraUp.y, 
                this.cameraUp.z )

            this.camera.lookAt( new Vector3( 
                this.cameraLookAt.x, 
                this.cameraLookAt.y, 
                this.cameraLookAt.z ) )
        },
        updateViewPoint(pos=null, up=null, eye=null){
            pos = pos || [0,this.apparentHorizon,this.targetObjs.distance];
            up = up || [0,1,0];
            eye = eye || [0,this.apparentHorizon,0];
            this.camera.position.set( pos[0], pos[1], pos[2] );
            this.camera.up.set( up[0], up[1], up[2] );
            this.camera.lookAt( eye[0], eye[1], eye[2] );
            if (this.controls) {
                this.controls.target.set( eye[0], eye[1], eye[2] );
            }
        },
        distance(target){
            
            if (this.targetObjs.objs === target) {
                this.apparentHorizon = this.hl*(this.targetObjs.size.y/2);
                return this.targetObjs.distance;
            }
            const size = getSize( target );
            
            let len = this.aspectRatio < (size.x/size.y) ? size.x/2 : size.y/2;
            
            let dis = len/Math.tan(this.vertFOV/2*Math.PI/180)+size.z/2;
            
            this.targetObjs.objs = target;
            this.targetObjs.size = size;
            this.targetObjs.distance = dis;
            this.apparentHorizon = this.hl*(size.y/2);
            return dis;
            // const distance = getSize( this.wrapper ).length();
        },
        toFront(target=null){
            const distance = this.distance(target || this.wrapper);
            this.updateViewPoint(
                [0, this.apparentHorizon, distance]
            );
        },
        toRight(target=null){
            const distance = this.distance(target || this.wrapper);
            this.updateViewPoint(
                [-distance, this.apparentHorizon, 0]
            );
        },
        toTop(target=null){
            const distance = this.distance(target || this.wrapper);
            this.updateViewPoint(
                [0, distance, 0],
                [0,0,-1]
            );
        },
        toBack(){
            let pos = this.camera.position;
            let x = pos.x, y = pos.y, z = pos.z;
            if (x == 0 && z == 0){
                y *= -1;
            }else{
                x *= -1;
                z *= -1;
            }
            this.camera.position.set(x, y, z);
            this.camera.lookAt( 0,this.apparentHorizon,0 );
        },
        buildOver(){},
        animate() {
            this.reqId = requestAnimationFrame( this.animate );
            this.render();
        },
        render() {
            this.controls.update();
            
            this.renderer.render( this.scene, this.camera )

        }
    }
}

</script>
