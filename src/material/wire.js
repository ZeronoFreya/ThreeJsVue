import { Color, FrontSide, MeshBasicMaterial } from "three";

function wire() {
    let mtl = new MeshBasicMaterial({
        color: new Color(0x888888),
        side: FrontSide,
        wireframe: true
    });
}

export { wire };
