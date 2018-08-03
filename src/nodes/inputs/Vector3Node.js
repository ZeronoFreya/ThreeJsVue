import {
	Vector3
} from 'three';
import {
	InputNode
} from "../InputNode";
import {
	NodeMaterial
} from "../NodeMaterial";

/**
 * @author sunag / http://www.sunag.com.br/
 */

const Vector3Node = function( x, y, z ) {

	InputNode.call( this, 'v3' );

	this.type = 'v3';
	this.value = new Vector3( x, y, z );

};

Vector3Node.prototype = Object.create( InputNode.prototype );
Vector3Node.prototype.constructor = Vector3Node;

NodeMaterial.addShortcuts( Vector3Node.prototype, 'value', [ 'x', 'y', 'z' ] );

export {
	Vector3Node
};