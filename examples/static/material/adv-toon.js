import { FloatNode } from "../../../src/nodes/inputs/FloatNode";
import { LightNode } from "../../../src/nodes/accessors/LightNode";
import { ColorNode } from "../../../src/nodes/inputs/ColorNode";
import { LuminanceNode } from "../../../src/nodes/utils/LuminanceNode";
import { OperatorNode } from "../../../src/nodes/math/OperatorNode";
import { Math1Node } from "../../../src/nodes/math/Math1Node";
import { Math2Node } from "../../../src/nodes/math/Math2Node";
import { Math3Node } from "../../../src/nodes/math/Math3Node";
import { PositionNode } from "../../../src/nodes/accessors/PositionNode";
import { NormalNode } from "../../../src/nodes/accessors/NormalNode";
import { PhongNodeMaterial } from "../../../src/nodes/materials/PhongNodeMaterial";


export function advToon() {
    let count = new FloatNode(2);
    
    // let count = new FloatNode(0.2);
    let sceneDirectLight = new LightNode();
    // let color = new ColorNode(0xf8eaec);
    let color = new ColorNode(0xfbf2e3);
    let lineColor = new ColorNode(0xc88a88);
    let lineSize = new FloatNode(0.1);
    let lineInner = new FloatNode(0);
    // CEL
    let lightLuminance = new LuminanceNode(sceneDirectLight);
    let preCelLight = new OperatorNode(lightLuminance, count, OperatorNode.MUL);
    let celLight = new Math1Node(preCelLight, Math1Node.CEIL);
    let posCelLight = new OperatorNode(celLight, count, OperatorNode.DIV);
    // LINE
    let posDirection = new Math1Node(new PositionNode(PositionNode.VIEW), Math1Node.NORMALIZE);
    let norDirection = new Math1Node(new NormalNode(NormalNode.VIEW), Math1Node.NORMALIZE);
    let viewZ = new Math2Node(posDirection, norDirection, Math2Node.DOT);
    let lineOutside = new Math1Node(viewZ, Math1Node.ABS);
    let line = new OperatorNode(lineOutside, new FloatNode(1), OperatorNode.DIV);
    let lineScaled = new Math3Node(line, lineSize, lineInner, Math3Node.SMOOTHSTEP);
    let innerContour = new Math1Node(new Math1Node(lineScaled, Math1Node.SAT), Math1Node.INVERT);

    // APPLY
    let mtl = new PhongNodeMaterial();
    mtl.color = color;
    mtl.light = posCelLight;
    mtl.shininess = new FloatNode(0);
    mtl.environment = lineColor;
    mtl.environmentAlpha = innerContour;
    return mtl.build();
}