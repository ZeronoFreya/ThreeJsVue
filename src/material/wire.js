import { Color, FrontSide, MeshBasicMaterial } from "three";
import { setMaterial } from "./setMaterial";

var material;

function wire(args) {
    const { objects = null, renderer = null, updateLights = null, effect = null } = {
        ...args
    };

    if (material === undefined) {
        material = new MeshBasicMaterial({
            color: new Color(0x888888),
            side: FrontSide,
            wireframe: true
        });
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

export { wire };
