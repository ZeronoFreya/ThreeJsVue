import {
    Color,
    FrontSide,
    MeshBasicMaterial
} from 'three'
import EventHub from '../../../src/eventHub';

export function wire() {
    let mtl = new MeshBasicMaterial({
        color: new Color(0x888888),
        side: FrontSide,
        wireframe: true
    });
    EventHub.$emit('setmaterial', mtl);
}