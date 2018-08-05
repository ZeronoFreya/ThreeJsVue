import {
    ShaderMaterial,
    Color,
    FrontSide,
    AdditiveBlending,
    Vector3
} from "three";
const vertexShader = `varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const fragmentShader = `uniform vec3 light;
varying vec3 vNormal;
uniform vec3 color;
void main()
{
    float diffuse = dot(normalize(light), vNormal);
    float dir = length(vNormal * vec3(0.0, 0.0, 1.0));
    if (false && dir < 0.34) {
        dir = 0.0;
        gl_FragColor = vec4(dir, dir, dir, 1.0);
    }
    else {
        if (diffuse > 0.98) {
            diffuse = 1.0;
        }
        else if (diffuse > 0.2) {
            diffuse = 0.6;
        }
        else {
            diffuse = 0.26;
        }
        gl_FragColor = vec4( color* diffuse, 1.0);
    }
}`
export function advToon(){
    return new ShaderMaterial({
        uniforms: {
            light: {
                type: 'v3',
                value: new Vector3(1, 2, 1)
            },
            color: { // 方块的基础色
                type: 'v3', // 指定变量类型为三维向量
                value: new Color('#fef9f9')
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: FrontSide,
        blending: AdditiveBlending
    });
}