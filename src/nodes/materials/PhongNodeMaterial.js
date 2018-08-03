import {
	PhongNode
} from "./PhongNode";
import {
	NodeMaterial
} from "../NodeMaterial";


/**
 * @author sunag / http://www.sunag.com.br/
 */

const PhongNodeMaterial = function() {

	this.node = new PhongNode();

	NodeMaterial.call( this, this.node, this.node );

};

PhongNodeMaterial.prototype = Object.create( NodeMaterial.prototype );
PhongNodeMaterial.prototype.constructor = PhongNodeMaterial;

NodeMaterial.addShortcuts( PhongNodeMaterial.prototype, 'node',
[ 'color', 'alpha', 'specular', 'shininess', 'normal', 'normalScale', 'emissive', 'ambient', 'light', 'shadow', 'ao', 'environment', 'environmentAlpha', 'transform' ] );

export {
	PhongNodeMaterial
};