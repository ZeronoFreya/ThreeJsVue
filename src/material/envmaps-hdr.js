import {
    MeshStandardMaterial,
    UnsignedByteType,
    LinearToneMapping
} from "three";
// import EventHub from '../eventHub';
import { HDRCubeTextureLoader } from "../loaders/HDRCubeTextureLoader";
import { PMREMCubeUVPacker } from "../pmrem/PMREMCubeUVPacker";
import { PMREMGenerator } from "../pmrem/PMREMGenerator";

import { setMaterial } from "./setMaterial";

function genCubeUrls(prefix, postfix) {
    return [
        prefix + "px" + postfix,
        prefix + "nx" + postfix,
        prefix + "py" + postfix,
        prefix + "ny" + postfix,
        prefix + "pz" + postfix,
        prefix + "nz" + postfix
    ];
}
var material, lights;
var hdrCubeMap;

let hdrUrls = genCubeUrls("static/pisaHDR/", ".hdr");
new HDRCubeTextureLoader().load(UnsignedByteType, hdrUrls, function(
    _hdrCubeMap
) {
    hdrCubeMap = _hdrCubeMap;
});

function envmapsHdr(args) {
    const {
        objects = null,
        renderer = null,
        updateLights = null,
        effect = null
    } = { ...args };

    if (material === undefined && lights === undefined) {
        let hdrCubeRenderTarget;

        lights = [
            {
                type: "HemisphereLight",
                position: { x: 0, y: 1, z: 0 },
                skyColor: 0xaaaaff,
                groundColor: 0x806060,
                intensity: 0.02
            },
            {
                type: "DirectionalLight",
                position: { x: 1, y: 1, z: 1 },
                color: 0xffffff,
                intensity: 0.28
            }
        ];

        let pmremGenerator = new PMREMGenerator(hdrCubeMap);
        pmremGenerator.update(renderer);

        let pmremCubeUVPacker = new PMREMCubeUVPacker(pmremGenerator.cubeLods);
        pmremCubeUVPacker.update(renderer);

        hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

        hdrCubeMap.dispose();
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();

        material = new MeshStandardMaterial({
            // color: 0xebc795,
            color: 0xf8eaec,
            metalness: 0.0,
            roughness: 0.54,
            envMap: hdrCubeRenderTarget.texture
        });
    }
    if (renderer) {
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.toneMapping = LinearToneMapping;
        renderer.toneMappingExposure = 1.9;
    }
    if (updateLights) {
        updateLights(lights);
    }
    if (objects && material) {
        setMaterial(material, objects);
    }
}

export { envmapsHdr };
