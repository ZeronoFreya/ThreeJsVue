import {
	GLNode
} from "./GLNode";

/**
 * @author sunag / http://www.sunag.com.br/
 */

const RawNode = function ( value ) {

	GLNode.call( this, 'v4' );

	this.value = value;

};

RawNode.prototype = Object.create( GLNode.prototype );
RawNode.prototype.constructor = RawNode;
RawNode.prototype.nodeType = "Raw";

RawNode.prototype.generate = function ( builder ) {

	var material = builder.material;

	var data = this.value.parseAndBuildCode( builder, this.type );

	var code = data.code + '\n';

	if ( builder.shader == 'vertex' ) {

		code += 'gl_Position = ' + data.result + ';';

	} else {

		code += 'gl_FragColor = ' + data.result + ';';

	}

	return code;

};

RawNode.prototype.toJSON = function ( meta ) {

	var data = this.getJSONNode( meta );

	if ( ! data ) {

		data = this.createJSONNode( meta );

		data.value = this.value.toJSON( meta ).uuid;

	}

	return data;

};
export {
	RawNode
};