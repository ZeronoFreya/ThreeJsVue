import { FloatNode } from "../nodes/inputs/FloatNode";
import { LightNode } from "../nodes/accessors/LightNode";
import { ColorNode } from "../nodes/inputs/ColorNode";
import { LuminanceNode } from "../nodes/utils/LuminanceNode";
import { OperatorNode } from "../nodes/math/OperatorNode";
import { Math1Node } from "../nodes/math/Math1Node";
import { Math2Node } from "../nodes/math/Math2Node";
import { Math3Node } from "../nodes/math/Math3Node";
import { PositionNode } from "../nodes/accessors/PositionNode";
import { NormalNode } from "../nodes/accessors/NormalNode";
import { PhongNodeMaterial } from "../nodes/materials/PhongNodeMaterial";

import { setMaterial } from "./setMaterial";
var material;

function advToon(args) {
    const { objects = null, renderer = null, updateLights = null, effect = null } = { ...args };
    if (material === undefined) {
        let count = new FloatNode(2.8);

        // let count = new FloatNode(0.2);
        let sceneDirectLight = new LightNode();
        let color = new ColorNode(0xf8eaec);
        // let color = new ColorNode(0xebc795);
        // let color = new ColorNode(0xCC9F62);
        let lineColor = new ColorNode(0x2b1c17);
        let lineSize = new FloatNode(0.12);
        let lineInner = new FloatNode(0.02);
        // CEL
        let lightLuminance = new LuminanceNode(sceneDirectLight);
        let preCelLight = new OperatorNode(
            lightLuminance,
            count,
            OperatorNode.MUL
        );
        let celLight = new Math1Node(preCelLight, Math1Node.CEIL);
        let posCelLight = new OperatorNode(celLight, count, OperatorNode.DIV);
        // LINE
        let posDirection = new Math1Node(
            new PositionNode(PositionNode.VIEW),
            Math1Node.NORMALIZE
        );
        let norDirection = new Math1Node(
            new NormalNode(NormalNode.VIEW),
            Math1Node.NORMALIZE
        );
        let viewZ = new Math2Node(posDirection, norDirection, Math2Node.DOT);
        let lineOutside = new Math1Node(viewZ, Math1Node.ABS);
        let line = new OperatorNode(
            lineOutside,
            new FloatNode(1),
            OperatorNode.DIV
        );
        let lineScaled = new Math3Node(
            line,
            lineSize,
            lineInner,
            Math3Node.SMOOTHSTEP
        );
        let innerContour = new Math1Node(
            new Math1Node(lineScaled, Math1Node.SAT),
            Math1Node.INVERT
        );

        // APPLY
        let mtl = new PhongNodeMaterial();
        mtl.color = color;
        mtl.light = posCelLight;
        mtl.shininess = new FloatNode(0.02);
        mtl.environment = lineColor;
        mtl.environmentAlpha = innerContour;

        material = mtl.build();
    }

    if (renderer) {
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.toneMappingExposure = 1.4;
    }
    if (updateLights) {
        updateLights();
    }
    if (objects && material) {
        setMaterial(material, objects);
    }
}
export { advToon };
