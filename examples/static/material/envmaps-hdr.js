import {
    MeshStandardMaterial,
    UnsignedByteType,
    LinearToneMapping
} from "three";
import EventHub from '../../../src/eventHub';
import {
    HDRCubeTextureLoader
} from "../../../src/loaders/HDRCubeTextureLoader";
import {
    PMREMCubeUVPacker
} from "../../../src/pmrem/PMREMCubeUVPacker";
import {
    PMREMGenerator
} from "../../../src/pmrem/PMREMGenerator";

function genCubeUrls(prefix, postfix) {
    return [
        prefix + 'px' + postfix, prefix + 'nx' + postfix,
        prefix + 'py' + postfix, prefix + 'ny' + postfix,
        prefix + 'pz' + postfix, prefix + 'nz' + postfix
    ];
};
export function envmapsHdr() {
    let hdrUrls = genCubeUrls('static/pisaHDR/', '.hdr');
    let hdrCubeRenderTarget;

    let renderer = EventHub.renderer;

    let lights = [{
            type: "HemisphereLight",
            position: {
                x: 0,
                y: 1,
                z: 0
            },
            skyColor: 0xaaaaff,
            groundColor: 0x806060,
            intensity: 0.02
        },
        {
            type: "DirectionalLight",
            position: {
                x: 1,
                y: 1,
                z: 1
            },
            color: 0xffffff,
            intensity: 0.28
        }
    ];
    
    new HDRCubeTextureLoader().load(UnsignedByteType, hdrUrls, function (hdrCubeMap) {

        let pmremGenerator = new PMREMGenerator(hdrCubeMap);
        pmremGenerator.update(renderer);

        let pmremCubeUVPacker = new PMREMCubeUVPacker(pmremGenerator.cubeLods);
        pmremCubeUVPacker.update(renderer);

        hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
        
        hdrCubeMap.dispose();
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();

        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.toneMapping = LinearToneMapping;
        renderer.toneMappingExposure = 1.9;

        let mtl = new MeshStandardMaterial({
            color: 0xebc795,
            metalness: 0.0,
            roughness: 0.54,
            envMap: hdrCubeRenderTarget.texture
        });
        EventHub.$emit('setmaterial', mtl, lights);
        // EventHub.$emit('updatelights', lights);

    });
}