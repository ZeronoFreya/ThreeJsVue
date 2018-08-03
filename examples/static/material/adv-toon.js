import {
    PhongNodeMaterial
} from 'three'

import {
    FloatNode
} from "../../../src/nodes/inputs/FloatNode";

export function advToon() {
    let count = new FloatNode(2.8);
    let sceneDirectLight = new THREE.LightNode();
    let color = new THREE.ColorNode(0xf8eaec);
    let lineColor = new THREE.ColorNode(0x6b0602);
    let lineSize = new FloatNode(0);
    let lineInner = new FloatNode(0);
    // CEL
    let lightLuminance = new THREE.LuminanceNode(sceneDirectLight);
    let preCelLight = new THREE.OperatorNode(lightLuminance, count, THREE.OperatorNode.MUL);
    let celLight = new THREE.Math1Node(preCelLight, THREE.Math1Node.CEIL);
    let posCelLight = new THREE.OperatorNode(celLight, count, THREE.OperatorNode.DIV);
    // LINE
    let posDirection = new THREE.Math1Node(new THREE.PositionNode(THREE.PositionNode.VIEW), THREE.Math1Node.NORMALIZE);
    let norDirection = new THREE.Math1Node(new THREE.NormalNode(THREE.NormalNode.VIEW), THREE.Math1Node.NORMALIZE);
    let viewZ = new THREE.Math2Node(posDirection, norDirection, THREE.Math2Node.DOT);
    let lineOutside = new THREE.Math1Node(viewZ, THREE.Math1Node.ABS);
    let line = new THREE.OperatorNode(lineOutside, new FloatNode(1), THREE.OperatorNode.DIV);
    let lineScaled = new THREE.Math3Node(line, lineSize, lineInner, THREE.Math3Node.SMOOTHSTEP);
    let innerContour = new THREE.Math1Node(new THREE.Math1Node(lineScaled, THREE.Math1Node.SAT), THREE.Math1Node.INVERT);

    // APPLY
    let mtl = new THREE.PhongNodeMaterial();
    mtl.color = color;
    mtl.light = posCelLight;
    mtl.shininess = new FloatNode(0);
    mtl.environment = lineColor;
    mtl.environmentAlpha = innerContour;
    return mtl.build();
}