import * as THREE from 'three';
/**
 * @author sunag / http://www.sunag.com.br/
 */

const NodePass = function() {

	THREE.ShaderPass.call( this );

	this.textureID = 'renderTexture';

	this.fragment = new THREE.RawNode( new THREE.ScreenNode() );

	this.node = new THREE.NodeMaterial();
	this.node.fragment = this.fragment;

	this.build();

};

NodePass.prototype = Object.create( THREE.ShaderPass.prototype );
NodePass.prototype.constructor = NodePass;

THREE.NodeMaterial.addShortcuts( NodePass.prototype, 'fragment', [ 'value' ] );

NodePass.prototype.build = function() {

	this.node.build();

	this.uniforms = this.node.uniforms;
	this.material = this.node;

};

export {
	NodePass
};