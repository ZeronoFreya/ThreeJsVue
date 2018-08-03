import {
	Color
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

const ColorNode = function (color) {

	InputNode.call(this, 'c');

	this.value = new Color(color || 0);

};

ColorNode.prototype = Object.create(InputNode.prototype);
ColorNode.prototype.constructor = ColorNode;

NodeMaterial.addShortcuts(ColorNode.prototype, 'value', ['r', 'g', 'b']);

export { ColorNode };