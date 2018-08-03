import {
    Color,
    FrontSide,
    MeshBasicMaterial
} from 'three'

export function wire() {
    let opt = {
        color: new Color(0x888888),
        side: FrontSide,
        wireframe: true
    }
    return new MeshBasicMaterial(opt);
}