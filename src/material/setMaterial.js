import {
    Mesh
} from "three";

function setMaterial(mtl, objects) {
    let object;
    for (let i = 0, il = objects.length; i < il; i++) {
        object = objects[i];
        object.traverse(function (child) {
            if (child instanceof Mesh) {
                if (child.material) child.material.dispose();
                child.material = mtl;
            }
        });
    }
}
export {
    setMaterial
};