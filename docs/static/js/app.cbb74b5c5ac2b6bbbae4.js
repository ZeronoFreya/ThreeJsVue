webpackJsonp([1],{

/***/ "ODmg":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./node_modules/_vue@2.5.16@vue/dist/vue.runtime.esm.js
var vue_runtime_esm = __webpack_require__("i8gr");

// EXTERNAL MODULE: ./node_modules/_three@0.88.0@three/build/three.module.js
var three_module = __webpack_require__("Lsr5");

// CONCATENATED MODULE: ./src/loaders/OBJLoader.js


// https://github.com/mrdoob/three.js/blob/dev/examples/js/loaders/OBJLoader.js
/**
 * @author mrdoob / http://mrdoob.com/
 */

// o object_name | g group_name
var object_pattern = /^[og]\s*(.+)?/;
// mtllib file_reference
var material_library_pattern = /^mtllib /;
// usemtl material_name
var material_use_pattern = /^usemtl /;

function ParserState() {

    var state = {
        objects: [],
        object: {},

        vertices: [],
        normals: [],
        colors: [],
        uvs: [],

        materialLibraries: [],

        startObject: function startObject(name, fromDeclaration) {

            // If the current object (initial from reset) is not from a g/o declaration in the parsed
            // file. We need to use it for the first parsed g/o to keep things in sync.
            if (this.object && this.object.fromDeclaration === false) {

                this.object.name = name;
                this.object.fromDeclaration = fromDeclaration !== false;
                return;
            }

            var previousMaterial = this.object && typeof this.object.currentMaterial === 'function' ? this.object.currentMaterial() : undefined;

            if (this.object && typeof this.object._finalize === 'function') {

                this.object._finalize(true);
            }

            this.object = {
                name: name || '',
                fromDeclaration: fromDeclaration !== false,

                geometry: {
                    vertices: [],
                    normals: [],
                    colors: [],
                    uvs: []
                },
                materials: [],
                smooth: true,

                startMaterial: function startMaterial(name, libraries) {

                    var previous = this._finalize(false);

                    // New usemtl declaration overwrites an inherited material, except if faces were declared
                    // after the material, then it must be preserved for proper MultiMaterial continuation.
                    if (previous && (previous.inherited || previous.groupCount <= 0)) {

                        this.materials.splice(previous.index, 1);
                    }

                    var material = {
                        index: this.materials.length,
                        name: name || '',
                        mtllib: Array.isArray(libraries) && libraries.length > 0 ? libraries[libraries.length - 1] : '',
                        smooth: previous !== undefined ? previous.smooth : this.smooth,
                        groupStart: previous !== undefined ? previous.groupEnd : 0,
                        groupEnd: -1,
                        groupCount: -1,
                        inherited: false,

                        clone: function clone(index) {

                            var cloned = {
                                index: typeof index === 'number' ? index : this.index,
                                name: this.name,
                                mtllib: this.mtllib,
                                smooth: this.smooth,
                                groupStart: 0,
                                groupEnd: -1,
                                groupCount: -1,
                                inherited: false
                            };
                            cloned.clone = this.clone.bind(cloned);
                            return cloned;
                        }
                    };

                    this.materials.push(material);

                    return material;
                },

                currentMaterial: function currentMaterial() {

                    if (this.materials.length > 0) {

                        return this.materials[this.materials.length - 1];
                    }

                    return undefined;
                },

                _finalize: function _finalize(end) {

                    var lastMultiMaterial = this.currentMaterial();
                    if (lastMultiMaterial && lastMultiMaterial.groupEnd === -1) {

                        lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
                        lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
                        lastMultiMaterial.inherited = false;
                    }

                    // Ignore objects tail materials if no face declarations followed them before a new o/g started.
                    if (end && this.materials.length > 1) {

                        for (var mi = this.materials.length - 1; mi >= 0; mi--) {

                            if (this.materials[mi].groupCount <= 0) {

                                this.materials.splice(mi, 1);
                            }
                        }
                    }

                    // Guarantee at least one empty material, this makes the creation later more straight forward.
                    if (end && this.materials.length === 0) {

                        this.materials.push({
                            name: '',
                            smooth: this.smooth
                        });
                    }

                    return lastMultiMaterial;
                }
            };

            // Inherit previous objects material.
            // Spec tells us that a declared material must be set to all objects until a new material is declared.
            // If a usemtl declaration is encountered while this new object is being parsed, it will
            // overwrite the inherited material. Exception being that there was already face declarations
            // to the inherited material, then it will be preserved for proper MultiMaterial continuation.

            if (previousMaterial && previousMaterial.name && typeof previousMaterial.clone === 'function') {

                var declared = previousMaterial.clone(0);
                declared.inherited = true;
                this.object.materials.push(declared);
            }

            this.objects.push(this.object);
        },

        finalize: function finalize() {

            if (this.object && typeof this.object._finalize === 'function') {

                this.object._finalize(true);
            }
        },

        parseVertexIndex: function parseVertexIndex(value, len) {

            var index = parseInt(value, 10);
            return (index >= 0 ? index - 1 : index + len / 3) * 3;
        },

        parseNormalIndex: function parseNormalIndex(value, len) {

            var index = parseInt(value, 10);
            return (index >= 0 ? index - 1 : index + len / 3) * 3;
        },

        parseUVIndex: function parseUVIndex(value, len) {

            var index = parseInt(value, 10);
            return (index >= 0 ? index - 1 : index + len / 2) * 2;
        },

        addVertex: function addVertex(a, b, c) {

            var src = this.vertices;
            var dst = this.object.geometry.vertices;

            dst.push(src[a + 0], src[a + 1], src[a + 2]);
            dst.push(src[b + 0], src[b + 1], src[b + 2]);
            dst.push(src[c + 0], src[c + 1], src[c + 2]);
        },

        addVertexLine: function addVertexLine(a) {

            var src = this.vertices;
            var dst = this.object.geometry.vertices;

            dst.push(src[a + 0], src[a + 1], src[a + 2]);
        },

        addNormal: function addNormal(a, b, c) {

            var src = this.normals;
            var dst = this.object.geometry.normals;

            dst.push(src[a + 0], src[a + 1], src[a + 2]);
            dst.push(src[b + 0], src[b + 1], src[b + 2]);
            dst.push(src[c + 0], src[c + 1], src[c + 2]);
        },

        addColor: function addColor(a, b, c) {

            var src = this.colors;
            var dst = this.object.geometry.colors;

            dst.push(src[a + 0], src[a + 1], src[a + 2]);
            dst.push(src[b + 0], src[b + 1], src[b + 2]);
            dst.push(src[c + 0], src[c + 1], src[c + 2]);
        },

        addUV: function addUV(a, b, c) {

            var src = this.uvs;
            var dst = this.object.geometry.uvs;

            dst.push(src[a + 0], src[a + 1]);
            dst.push(src[b + 0], src[b + 1]);
            dst.push(src[c + 0], src[c + 1]);
        },

        addUVLine: function addUVLine(a) {

            var src = this.uvs;
            var dst = this.object.geometry.uvs;

            dst.push(src[a + 0], src[a + 1]);
        },

        addFace: function addFace(a, b, c, ua, ub, uc, na, nb, nc) {

            var vLen = this.vertices.length;

            var ia = this.parseVertexIndex(a, vLen);
            var ib = this.parseVertexIndex(b, vLen);
            var ic = this.parseVertexIndex(c, vLen);

            this.addVertex(ia, ib, ic);

            if (ua !== undefined) {

                var uvLen = this.uvs.length;

                ia = this.parseUVIndex(ua, uvLen);
                ib = this.parseUVIndex(ub, uvLen);
                ic = this.parseUVIndex(uc, uvLen);

                this.addUV(ia, ib, ic);
            }

            if (na !== undefined) {

                // Normals are many times the same. If so, skip function call and parseInt.
                var nLen = this.normals.length;
                ia = this.parseNormalIndex(na, nLen);

                ib = na === nb ? ia : this.parseNormalIndex(nb, nLen);
                ic = na === nc ? ia : this.parseNormalIndex(nc, nLen);

                this.addNormal(ia, ib, ic);
            }

            if (this.colors.length > 0) {

                this.addColor(ia, ib, ic);
            }
        },

        addLineGeometry: function addLineGeometry(vertices, uvs) {

            this.object.geometry.type = 'Line';

            var vLen = this.vertices.length;
            var uvLen = this.uvs.length;

            for (var vi = 0, l = vertices.length; vi < l; vi++) {

                this.addVertexLine(this.parseVertexIndex(vertices[vi], vLen));
            }

            for (var uvi = 0, l = uvs.length; uvi < l; uvi++) {

                this.addUVLine(this.parseUVIndex(uvs[uvi], uvLen));
            }
        }

    };

    state.startObject('', false);

    return state;
}

//

function OBJLoader(manager) {

    this.manager = manager !== undefined ? manager : three_module["g" /* DefaultLoadingManager */];

    this.materials = null;
}

OBJLoader.prototype = {

    constructor: OBJLoader,

    load: function load(url, onLoad, onProgress, onError) {

        var scope = this;

        var loader = new three_module["j" /* FileLoader */](scope.manager);
        loader.setPath(this.path);
        loader.load(url, function (text) {

            onLoad(scope.parse(text));
        }, onProgress, onError);
    },

    setPath: function setPath(value) {

        this.path = value;
    },

    setMaterials: function setMaterials(materials) {

        this.materials = materials;

        return this;
    },

    parse: function parse(text) {

        console.time('OBJLoader');

        var state = new ParserState();

        if (text.indexOf('\r\n') !== -1) {

            // This is faster than String.split with regex that splits on both
            text = text.replace(/\r\n/g, '\n');
        }

        if (text.indexOf('\\\n') !== -1) {

            // join lines separated by a line continuation character (\)
            text = text.replace(/\\\n/g, '');
        }

        var lines = text.split('\n');
        var line = '',
            lineFirstChar = '';
        var lineLength = 0;
        var result = [];

        // Faster to just trim left side of the line. Use if available.
        var trimLeft = typeof ''.trimLeft === 'function';

        for (var i = 0, l = lines.length; i < l; i++) {

            line = lines[i];

            line = trimLeft ? line.trimLeft() : line.trim();

            lineLength = line.length;

            if (lineLength === 0) continue;

            lineFirstChar = line.charAt(0);

            // @todo invoke passed in handler if any
            if (lineFirstChar === '#') continue;

            if (lineFirstChar === 'v') {

                var data = line.split(/\s+/);

                switch (data[0]) {

                    case 'v':
                        state.vertices.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
                        if (data.length === 8) {

                            state.colors.push(parseFloat(data[4]), parseFloat(data[5]), parseFloat(data[6]));
                        }
                        break;
                    case 'vn':
                        state.normals.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
                        break;
                    case 'vt':
                        state.uvs.push(parseFloat(data[1]), parseFloat(data[2]));
                        break;

                }
            } else if (lineFirstChar === 'f') {

                var lineData = line.substr(1).trim();
                var vertexData = lineData.split(/\s+/);
                var faceVertices = [];

                // Parse the face vertex data into an easy to work with format

                for (var j = 0, jl = vertexData.length; j < jl; j++) {

                    var vertex = vertexData[j];

                    if (vertex.length > 0) {

                        var vertexParts = vertex.split('/');
                        faceVertices.push(vertexParts);
                    }
                }

                // Draw an edge between the first vertex and all subsequent vertices to form an n-gon

                var v1 = faceVertices[0];

                for (var j = 1, jl = faceVertices.length - 1; j < jl; j++) {

                    var v2 = faceVertices[j];
                    var v3 = faceVertices[j + 1];

                    state.addFace(v1[0], v2[0], v3[0], v1[1], v2[1], v3[1], v1[2], v2[2], v3[2]);
                }
            } else if (lineFirstChar === 'l') {

                var lineParts = line.substring(1).trim().split(' ');
                var lineVertices = [],
                    lineUVs = [];

                if (line.indexOf('/') === -1) {

                    lineVertices = lineParts;
                } else {

                    for (var li = 0, llen = lineParts.length; li < llen; li++) {

                        var parts = lineParts[li].split('/');

                        if (parts[0] !== '') lineVertices.push(parts[0]);
                        if (parts[1] !== '') lineUVs.push(parts[1]);
                    }
                }
                state.addLineGeometry(lineVertices, lineUVs);
            } else if ((result = object_pattern.exec(line)) !== null) {

                // o object_name
                // or
                // g group_name

                // WORKAROUND: https://bugs.chromium.org/p/v8/issues/detail?id=2869
                // var name = result[ 0 ].substr( 1 ).trim();
                var name = (' ' + result[0].substr(1).trim()).substr(1);

                state.startObject(name);
            } else if (material_use_pattern.test(line)) {

                // material

                state.object.startMaterial(line.substring(7).trim(), state.materialLibraries);
            } else if (material_library_pattern.test(line)) {

                // mtl file

                state.materialLibraries.push(line.substring(7).trim());
            } else if (lineFirstChar === 's') {

                result = line.split(' ');

                // smooth shading

                // @todo Handle files that have varying smooth values for a set of faces inside one geometry,
                // but does not define a usemtl for each face set.
                // This should be detected and a dummy material created (later MultiMaterial and geometry groups).
                // This requires some care to not create extra material on each smooth value for "normal" obj files.
                // where explicit usemtl defines geometry groups.
                // Example asset: examples/models/obj/cerberus/Cerberus.obj

                /*
                 * http://paulbourke.net/dataformats/obj/
                 * or
                 * http://www.cs.utah.edu/~boulos/cs3505/obj_spec.pdf
                 *
                 * From chapter "Grouping" Syntax explanation "s group_number":
                 * "group_number is the smoothing group number. To turn off smoothing groups, use a value of 0 or off.
                 * Polygonal elements use group numbers to put elements in different smoothing groups. For free-form
                 * surfaces, smoothing groups are either turned on or off; there is no difference between values greater
                 * than 0."
                 */
                if (result.length > 1) {

                    var value = result[1].trim().toLowerCase();
                    state.object.smooth = value !== '0' && value !== 'off';
                } else {

                    // ZBrush can produce "s" lines #11707
                    state.object.smooth = true;
                }
                var material = state.object.currentMaterial();
                if (material) material.smooth = state.object.smooth;
            } else {

                // Handle null terminated files without exception
                if (line === '\0') continue;

                throw new Error('OBJLoader: Unexpected line: "' + line + '"');
            }
        }

        state.finalize();

        var container = new three_module["m" /* Group */]();
        container.materialLibraries = [].concat(state.materialLibraries);

        for (var i = 0, l = state.objects.length; i < l; i++) {

            var object = state.objects[i];
            var geometry = object.geometry;
            var materials = object.materials;
            var isLine = geometry.type === 'Line';

            // Skip o/g line declarations that did not follow with any faces
            if (geometry.vertices.length === 0) continue;

            var buffergeometry = new three_module["d" /* BufferGeometry */]();

            buffergeometry.addAttribute('position', new three_module["k" /* Float32BufferAttribute */](geometry.vertices, 3));

            if (geometry.normals.length > 0) {

                buffergeometry.addAttribute('normal', new three_module["k" /* Float32BufferAttribute */](geometry.normals, 3));
            } else {

                buffergeometry.computeVertexNormals();
            }

            if (geometry.colors.length > 0) {

                buffergeometry.addAttribute('color', new three_module["k" /* Float32BufferAttribute */](geometry.colors, 3));
            }

            if (geometry.uvs.length > 0) {

                buffergeometry.addAttribute('uv', new three_module["k" /* Float32BufferAttribute */](geometry.uvs, 2));
            }

            // Create materials

            var createdMaterials = [];

            for (var mi = 0, miLen = materials.length; mi < miLen; mi++) {

                var sourceMaterial = materials[mi];
                var material = undefined;

                if (this.materials !== null) {

                    material = this.materials.create(sourceMaterial.name);

                    // mtl etc. loaders probably can't create line materials correctly, copy properties to a line material.
                    if (isLine && material && !(material instanceof three_module["o" /* LineBasicMaterial */])) {

                        var materialLine = new three_module["o" /* LineBasicMaterial */]();
                        materialLine.copy(material);
                        material = materialLine;
                    }
                }

                if (!material) {

                    material = !isLine ? new three_module["t" /* MeshPhongMaterial */]() : new three_module["o" /* LineBasicMaterial */]();
                    material.name = sourceMaterial.name;
                }

                material.flatShading = !sourceMaterial.smooth;

                createdMaterials.push(material);
            }

            // Create mesh

            var mesh;

            if (createdMaterials.length > 1) {

                for (var mi = 0, miLen = materials.length; mi < miLen; mi++) {

                    var sourceMaterial = materials[mi];
                    buffergeometry.addGroup(sourceMaterial.groupStart, sourceMaterial.groupCount, mi);
                }

                mesh = !isLine ? new three_module["s" /* Mesh */](buffergeometry, createdMaterials) : new three_module["p" /* LineSegments */](buffergeometry, createdMaterials);
            } else {

                mesh = !isLine ? new three_module["s" /* Mesh */](buffergeometry, createdMaterials[0]) : new three_module["p" /* LineSegments */](buffergeometry, createdMaterials[0]);
            }

            mesh.name = object.name;

            container.add(mesh);
        }

        console.timeEnd('OBJLoader');

        return container;
    }

};


// CONCATENATED MODULE: ./src/loaders/DDSLoader.js


// https://github.com/mrdoob/three.js/blob/dev/examples/js/loaders/OBJLoader.js

var DDSLoader = function DDSLoader() {

    this._parser = DDSLoader.parse;
};

DDSLoader.prototype = Object.create(three_module["f" /* CompressedTextureLoader */].prototype);
DDSLoader.prototype.constructor = DDSLoader;

DDSLoader.parse = function (buffer, loadMipmaps) {

    var dds = { mipmaps: [], width: 0, height: 0, format: null, mipmapCount: 1 };

    // Adapted from @toji's DDS utils
    // https://github.com/toji/webgl-texture-utils/blob/master/texture-util/dds.js

    // All values and structures referenced from:
    // http://msdn.microsoft.com/en-us/library/bb943991.aspx/

    var DDS_MAGIC = 0x20534444;

    var DDSD_CAPS = 0x1,
        DDSD_HEIGHT = 0x2,
        DDSD_WIDTH = 0x4,
        DDSD_PITCH = 0x8,
        DDSD_PIXELFORMAT = 0x1000,
        DDSD_MIPMAPCOUNT = 0x20000,
        DDSD_LINEARSIZE = 0x80000,
        DDSD_DEPTH = 0x800000;

    var DDSCAPS_COMPLEX = 0x8,
        DDSCAPS_MIPMAP = 0x400000,
        DDSCAPS_TEXTURE = 0x1000;

    var DDSCAPS2_CUBEMAP = 0x200,
        DDSCAPS2_CUBEMAP_POSITIVEX = 0x400,
        DDSCAPS2_CUBEMAP_NEGATIVEX = 0x800,
        DDSCAPS2_CUBEMAP_POSITIVEY = 0x1000,
        DDSCAPS2_CUBEMAP_NEGATIVEY = 0x2000,
        DDSCAPS2_CUBEMAP_POSITIVEZ = 0x4000,
        DDSCAPS2_CUBEMAP_NEGATIVEZ = 0x8000,
        DDSCAPS2_VOLUME = 0x200000;

    var DDPF_ALPHAPIXELS = 0x1,
        DDPF_ALPHA = 0x2,
        DDPF_FOURCC = 0x4,
        DDPF_RGB = 0x40,
        DDPF_YUV = 0x200,
        DDPF_LUMINANCE = 0x20000;

    function fourCCToInt32(value) {

        return value.charCodeAt(0) + (value.charCodeAt(1) << 8) + (value.charCodeAt(2) << 16) + (value.charCodeAt(3) << 24);
    }

    function int32ToFourCC(value) {

        return String.fromCharCode(value & 0xff, value >> 8 & 0xff, value >> 16 & 0xff, value >> 24 & 0xff);
    }

    function loadARGBMip(buffer, dataOffset, width, height) {

        var dataLength = width * height * 4;
        var srcBuffer = new Uint8Array(buffer, dataOffset, dataLength);
        var byteArray = new Uint8Array(dataLength);
        var dst = 0;
        var src = 0;
        for (var y = 0; y < height; y++) {

            for (var x = 0; x < width; x++) {

                var b = srcBuffer[src];src++;
                var g = srcBuffer[src];src++;
                var r = srcBuffer[src];src++;
                var a = srcBuffer[src];src++;
                byteArray[dst] = r;dst++; // r
                byteArray[dst] = g;dst++; // g
                byteArray[dst] = b;dst++; // b
                byteArray[dst] = a;dst++; // a
            }
        }
        return byteArray;
    }

    var FOURCC_DXT1 = fourCCToInt32('DXT1');
    var FOURCC_DXT3 = fourCCToInt32('DXT3');
    var FOURCC_DXT5 = fourCCToInt32('DXT5');
    var FOURCC_ETC1 = fourCCToInt32('ETC1');

    var headerLengthInt = 31; // The header length in 32 bit ints

    // Offsets into the header array

    var off_magic = 0;

    var off_size = 1;
    var off_flags = 2;
    var off_height = 3;
    var off_width = 4;

    var off_mipmapCount = 7;

    var off_pfFlags = 20;
    var off_pfFourCC = 21;
    var off_RGBBitCount = 22;
    var off_RBitMask = 23;
    var off_GBitMask = 24;
    var off_BBitMask = 25;
    var off_ABitMask = 26;

    var off_caps = 27;
    var off_caps2 = 28;
    var off_caps3 = 29;
    var off_caps4 = 30;

    // Parse header

    var header = new Int32Array(buffer, 0, headerLengthInt);

    if (header[off_magic] !== DDS_MAGIC) {

        console.error('DDSLoader.parse: Invalid magic number in DDS header.');
        return dds;
    }

    if (!header[off_pfFlags] & DDPF_FOURCC) {

        console.error('DDSLoader.parse: Unsupported format, must contain a FourCC code.');
        return dds;
    }

    var blockBytes;

    var fourCC = header[off_pfFourCC];

    var isRGBAUncompressed = false;

    switch (fourCC) {

        case FOURCC_DXT1:

            blockBytes = 8;
            dds.format = three_module["D" /* RGB_S3TC_DXT1_Format */];
            break;

        case FOURCC_DXT3:

            blockBytes = 16;
            dds.format = three_module["A" /* RGBA_S3TC_DXT3_Format */];
            break;

        case FOURCC_DXT5:

            blockBytes = 16;
            dds.format = three_module["B" /* RGBA_S3TC_DXT5_Format */];
            break;

        case FOURCC_ETC1:

            blockBytes = 8;
            dds.format = three_module["C" /* RGB_ETC1_Format */];
            break;

        default:

            if (header[off_RGBBitCount] === 32 && header[off_RBitMask] & 0xff0000 && header[off_GBitMask] & 0xff00 && header[off_BBitMask] & 0xff && header[off_ABitMask] & 0xff000000) {

                isRGBAUncompressed = true;
                blockBytes = 64;
                dds.format = three_module["z" /* RGBAFormat */];
            } else {

                console.error('DDSLoader.parse: Unsupported FourCC code ', int32ToFourCC(fourCC));
                return dds;
            }
    }

    dds.mipmapCount = 1;

    if (header[off_flags] & DDSD_MIPMAPCOUNT && loadMipmaps !== false) {

        dds.mipmapCount = Math.max(1, header[off_mipmapCount]);
    }

    var caps2 = header[off_caps2];
    dds.isCubemap = !!(caps2 & DDSCAPS2_CUBEMAP);
    if (dds.isCubemap && (!(caps2 & DDSCAPS2_CUBEMAP_POSITIVEX) || !(caps2 & DDSCAPS2_CUBEMAP_NEGATIVEX) || !(caps2 & DDSCAPS2_CUBEMAP_POSITIVEY) || !(caps2 & DDSCAPS2_CUBEMAP_NEGATIVEY) || !(caps2 & DDSCAPS2_CUBEMAP_POSITIVEZ) || !(caps2 & DDSCAPS2_CUBEMAP_NEGATIVEZ))) {

        console.error('DDSLoader.parse: Incomplete cubemap faces');
        return dds;
    }

    dds.width = header[off_width];
    dds.height = header[off_height];

    var dataOffset = header[off_size] + 4;

    // Extract mipmaps buffers

    var faces = dds.isCubemap ? 6 : 1;

    for (var face = 0; face < faces; face++) {

        var width = dds.width;
        var height = dds.height;

        for (var i = 0; i < dds.mipmapCount; i++) {

            if (isRGBAUncompressed) {

                var byteArray = loadARGBMip(buffer, dataOffset, width, height);
                var dataLength = byteArray.length;
            } else {

                var dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes;
                var byteArray = new Uint8Array(buffer, dataOffset, dataLength);
            }

            var mipmap = { 'data': byteArray, 'width': width, 'height': height };
            dds.mipmaps.push(mipmap);

            dataOffset += dataLength;

            width = Math.max(width >> 1, 1);
            height = Math.max(height >> 1, 1);
        }
    }

    return dds;
};


// CONCATENATED MODULE: ./src/loaders/MTLLoader.js



// https://github.com/mrdoob/three.js/blob/dev/examples/js/loaders/MTLLoader.js

var LoaderHandlers = three_module["q" /* Loader */].Handlers;
LoaderHandlers.add(/\.dds$/i, new DDSLoader());

var MTLLoader_MTLLoader = function MTLLoader(manager) {

    this.manager = manager !== undefined ? manager : three_module["g" /* DefaultLoadingManager */];
};

MTLLoader_MTLLoader.prototype = {

    constructor: MTLLoader_MTLLoader,

    /**
     * Loads and parses a MTL asset from a URL.
     *
     * @param {String} url - URL to the MTL file.
     * @param {Function} [onLoad] - Callback invoked with the loaded object.
     * @param {Function} [onProgress] - Callback for download progress.
     * @param {Function} [onError] - Callback for download errors.
     *
     * @see setPath setTexturePath
     *
     * @note In order for relative texture references to resolve correctly
     * you must call setPath and/or setTexturePath explicitly prior to load.
     */
    load: function load(url, onLoad, onProgress, onError) {

        var scope = this;

        var loader = new three_module["j" /* FileLoader */](this.manager);
        loader.setPath(this.path);
        loader.load(url, function (text) {

            onLoad(scope.parse(text));
        }, onProgress, onError);
    },

    /**
     * Set base path for resolving references.
     * If set this path will be prepended to each loaded and found reference.
     *
     * @see setTexturePath
     * @param {String} path
     *
     * @example
     *     mtlLoader.setPath( 'assets/obj/' );
     *     mtlLoader.load( 'my.mtl', ... );
     */
    setPath: function setPath(path) {

        this.path = path;
    },

    /**
     * Set base path for resolving texture references.
     * If set this path will be prepended found texture reference.
     * If not set and setPath is, it will be used as texture base path.
     *
     * @see setPath
     * @param {String} path
     *
     * @example
     *     mtlLoader.setPath( 'assets/obj/' );
     *     mtlLoader.setTexturePath( 'assets/textures/' );
     *     mtlLoader.load( 'my.mtl', ... );
     */
    setTexturePath: function setTexturePath(path) {

        this.texturePath = path;
    },

    setBaseUrl: function setBaseUrl(path) {

        console.warn('MTLLoader: .setBaseUrl() is deprecated. Use .setTexturePath( path ) for texture path or .setPath( path ) for general base path instead.');

        this.setTexturePath(path);
    },

    setCrossOrigin: function setCrossOrigin(value) {

        this.crossOrigin = value;
    },

    setMaterialOptions: function setMaterialOptions(value) {

        this.materialOptions = value;
    },

    /**
     * Parses a MTL file.
     *
     * @param {String} text - Content of MTL file
     * @return {MTLLoader.MaterialCreator}
     *
     * @see setPath setTexturePath
     *
     * @note In order for relative texture references to resolve correctly
     * you must call setPath and/or setTexturePath explicitly prior to parse.
     */
    parse: function parse(text) {

        var lines = text.split('\n');
        var info = {};
        var delimiter_pattern = /\s+/;
        var materialsInfo = {};

        for (var i = 0; i < lines.length; i++) {

            var line = lines[i];
            line = line.trim();

            if (line.length === 0 || line.charAt(0) === '#') {

                // Blank line or comment ignore
                continue;
            }

            var pos = line.indexOf(' ');

            var key = pos >= 0 ? line.substring(0, pos) : line;
            key = key.toLowerCase();

            var value = pos >= 0 ? line.substring(pos + 1) : '';
            value = value.trim();

            if (key === 'newmtl') {

                // New material

                info = { name: value };
                materialsInfo[value] = info;
            } else if (info) {

                if (key === 'ka' || key === 'kd' || key === 'ks') {

                    var ss = value.split(delimiter_pattern, 3);
                    info[key] = [parseFloat(ss[0]), parseFloat(ss[1]), parseFloat(ss[2])];
                } else {

                    info[key] = value;
                }
            }
        }

        var materialCreator = new MTLLoader_MTLLoader.MaterialCreator(this.texturePath || this.path, this.materialOptions);
        materialCreator.setCrossOrigin(this.crossOrigin);
        materialCreator.setManager(this.manager);
        materialCreator.setMaterials(materialsInfo);
        return materialCreator;
    }

};

/**
 * Create a new THREE-MTLLoader.MaterialCreator
 * @param baseUrl - Url relative to which textures are loaded
 * @param options - Set of options on how to construct the materials
 *                  side: Which side to apply the material
 *                        THREE.FrontSide (default), THREE.BackSide, THREE.DoubleSide
 *                  wrap: What type of wrapping to apply for textures
 *                        THREE.RepeatWrapping (default), THREE.ClampToEdgeWrapping, THREE.MirroredRepeatWrapping
 *                  normalizeRGB: RGBs need to be normalized to 0-1 from 0-255
 *                                Default: false, assumed to be already normalized
 *                  ignoreZeroRGBs: Ignore values of RGBs (Ka,Kd,Ks) that are all 0's
 *                                  Default: false
 * @constructor
 */

MTLLoader_MTLLoader.MaterialCreator = function (baseUrl, options) {

    this.baseUrl = baseUrl || '';
    this.options = options;
    this.materialsInfo = {};
    this.materials = {};
    this.materialsArray = [];
    this.nameLookup = {};

    this.side = this.options && this.options.side ? this.options.side : three_module["l" /* FrontSide */];
    this.wrap = this.options && this.options.wrap ? this.options.wrap : three_module["F" /* RepeatWrapping */];
};

MTLLoader_MTLLoader.MaterialCreator.prototype = {

    constructor: MTLLoader_MTLLoader.MaterialCreator,

    crossOrigin: 'Anonymous',

    setCrossOrigin: function setCrossOrigin(value) {

        this.crossOrigin = value;
    },

    setManager: function setManager(value) {

        this.manager = value;
    },

    setMaterials: function setMaterials(materialsInfo) {

        this.materialsInfo = this.convert(materialsInfo);
        this.materials = {};
        this.materialsArray = [];
        this.nameLookup = {};
    },

    convert: function convert(materialsInfo) {

        if (!this.options) return materialsInfo;

        var converted = {};

        for (var mn in materialsInfo) {

            // Convert materials info into normalized form based on options

            var mat = materialsInfo[mn];

            var covmat = {};

            converted[mn] = covmat;

            for (var prop in mat) {

                var save = true;
                var value = mat[prop];
                var lprop = prop.toLowerCase();

                switch (lprop) {

                    case 'kd':
                    case 'ka':
                    case 'ks':

                        // Diffuse color (color under white light) using RGB values

                        if (this.options && this.options.normalizeRGB) {

                            value = [value[0] / 255, value[1] / 255, value[2] / 255];
                        }

                        if (this.options && this.options.ignoreZeroRGBs) {

                            if (value[0] === 0 && value[1] === 0 && value[2] === 0) {

                                // ignore

                                save = false;
                            }
                        }

                        break;

                    default:

                        break;

                }

                if (save) {

                    covmat[lprop] = value;
                }
            }
        }

        return converted;
    },

    preload: function preload() {

        for (var mn in this.materialsInfo) {

            this.create(mn);
        }
    },

    getIndex: function getIndex(materialName) {

        return this.nameLookup[materialName];
    },

    getAsArray: function getAsArray() {

        var index = 0;

        for (var mn in this.materialsInfo) {

            this.materialsArray[index] = this.create(mn);
            this.nameLookup[mn] = index;
            index++;
        }

        return this.materialsArray;
    },

    create: function create(materialName) {

        if (this.materials[materialName] === undefined) {

            this.createMaterial_(materialName);
        }

        return this.materials[materialName];
    },

    createMaterial_: function createMaterial_(materialName) {

        // Create material

        var scope = this;
        var mat = this.materialsInfo[materialName];
        var params = {

            name: materialName,
            side: this.side

        };

        function resolveURL(baseUrl, url) {

            if (typeof url !== 'string' || url === '') {
                return '';
            }

            // Absolute URL
            if (/^https?:\/\//i.test(url)) return url;

            return baseUrl + url;
        }

        function setMapForType(mapType, value) {

            if (params[mapType]) return; // Keep the first encountered texture

            var texParams = scope.getTextureParams(value, params);
            var map = scope.loadTexture(resolveURL(scope.baseUrl, texParams.url));

            map.repeat.copy(texParams.scale);
            map.offset.copy(texParams.offset);

            map.wrapS = scope.wrap;
            map.wrapT = scope.wrap;

            params[mapType] = map;
        }

        for (var prop in mat) {

            var value = mat[prop];
            var n;

            if (value === '') continue;

            switch (prop.toLowerCase()) {

                // Ns is material specular exponent

                case 'kd':

                    // Diffuse color (color under white light) using RGB values

                    params.color = new three_module["e" /* Color */]().fromArray(value);

                    break;

                case 'ks':

                    // Specular color (color when light is reflected from shiny surface) using RGB values
                    params.specular = new three_module["e" /* Color */]().fromArray(value);

                    break;

                case 'map_kd':

                    // Diffuse texture map

                    setMapForType('map', value);

                    break;

                case 'map_ks':

                    // Specular map

                    setMapForType('specularMap', value);

                    break;

                case 'norm':

                    setMapForType('normalMap', value);

                    break;

                case 'map_bump':
                case 'bump':

                    // Bump texture map

                    setMapForType('bumpMap', value);

                    break;

                case 'ns':

                    // The specular exponent (defines the focus of the specular highlight)
                    // A high exponent results in a tight, concentrated highlight. Ns values normally range from 0 to 1000.

                    params.shininess = parseFloat(value);

                    break;

                case 'd':
                    n = parseFloat(value);

                    if (n < 1) {

                        params.opacity = n;
                        params.transparent = true;
                    }

                    break;

                case 'tr':
                    n = parseFloat(value);

                    if (n > 0) {

                        params.opacity = 1 - n;
                        params.transparent = true;
                    }

                    break;

                default:
                    break;

            }
        }

        this.materials[materialName] = new three_module["t" /* MeshPhongMaterial */](params);
        return this.materials[materialName];
    },

    getTextureParams: function getTextureParams(value, matParams) {

        var texParams = {

            scale: new three_module["J" /* Vector2 */](1, 1),
            offset: new three_module["J" /* Vector2 */](0, 0)

        };

        var items = value.split(/\s+/);
        var pos;

        pos = items.indexOf('-bm');

        if (pos >= 0) {

            matParams.bumpScale = parseFloat(items[pos + 1]);
            items.splice(pos, 2);
        }

        pos = items.indexOf('-s');

        if (pos >= 0) {

            texParams.scale.set(parseFloat(items[pos + 1]), parseFloat(items[pos + 2]));
            items.splice(pos, 4); // we expect 3 parameters here!
        }

        pos = items.indexOf('-o');

        if (pos >= 0) {

            texParams.offset.set(parseFloat(items[pos + 1]), parseFloat(items[pos + 2]));
            items.splice(pos, 4); // we expect 3 parameters here!
        }

        texParams.url = items.join(' ').trim();
        return texParams;
    },

    loadTexture: function loadTexture(url, mapping, onLoad, onProgress, onError) {

        var texture;
        var loader = LoaderHandlers.get(url);
        var manager = this.manager !== undefined ? this.manager : three_module["g" /* DefaultLoadingManager */];

        if (loader === null) {

            loader = new three_module["I" /* TextureLoader */](manager);
        }

        if (loader.setCrossOrigin) loader.setCrossOrigin(this.crossOrigin);
        texture = loader.load(url, onLoad, onProgress, onError);

        if (mapping !== undefined) texture.mapping = mapping;

        return texture;
    }

};


// CONCATENATED MODULE: ./src/util.js


var box = new three_module["b" /* Box3 */]();

function getSize(object) {

    box.setFromObject(object);

    return box.getSize();
}

function getCenter(object) {

    box.setFromObject(object);

    return box.getCenter();
}

function lightsDiff(lights, oldLights) {}

function toIndexed(bufferGeometry) {

    var rawPositions = bufferGeometry.getAttribute('position').array;

    var rawUvs = void 0;
    var hasUV = bufferGeometry.getAttribute('uv') !== undefined;
    if (hasUV) rawUvs = bufferGeometry.getAttribute('uv').array;

    var rawNormals = void 0;
    var hasNormal = bufferGeometry.getAttribute('normal') !== undefined;
    if (hasNormal) rawNormals = bufferGeometry.getAttribute('normal').array;

    var indices = [];
    var vertices = [];
    var normals = [];
    var uvs = [];

    var face = void 0,
        faceNormalss = void 0,
        faceUvs = void 0,
        tmpIndices = void 0;

    var v0 = new three_module["K" /* Vector3 */]();
    var v1 = new three_module["K" /* Vector3 */]();
    var v2 = new three_module["K" /* Vector3 */]();

    var n0 = new three_module["K" /* Vector3 */]();
    var n1 = new three_module["K" /* Vector3 */]();
    var n2 = new three_module["K" /* Vector3 */]();

    var uv0 = new three_module["J" /* Vector2 */]();
    var uv1 = new three_module["J" /* Vector2 */]();
    var uv2 = new three_module["J" /* Vector2 */]();

    for (var i = 0; i < rawPositions.length; i += 9) {

        v0.x = rawPositions[i];
        v0.y = rawPositions[i + 1];
        v0.z = rawPositions[i + 2];

        v1.x = rawPositions[i + 3];
        v1.y = rawPositions[i + 4];
        v1.z = rawPositions[i + 5];

        v2.x = rawPositions[i + 6];
        v2.y = rawPositions[i + 7];
        v2.z = rawPositions[i + 8];

        face = [v0, v1, v2];

        if (hasNormal) {

            n0.x = rawNormals[i];
            n0.y = rawNormals[i + 1];
            n0.z = rawNormals[i + 2];

            n1.x = rawNormals[i + 3];
            n1.y = rawNormals[i + 4];
            n1.z = rawNormals[i + 5];

            n2.x = rawNormals[i + 6];
            n2.y = rawNormals[i + 7];
            n2.z = rawNormals[i + 8];

            faceNormalss = [n0, n1, n2];
        }

        if (hasUV) {

            uv0.x = rawUvs[i];
            uv0.y = rawUvs[i + 1];

            uv1.x = rawUvs[i + 2];
            uv1.y = rawUvs[i + 3];

            uv2.x = rawUvs[i + 4];
            uv2.y = rawUvs[i + 5];

            faceUvs = [uv0, uv1, uv2];
        }

        tmpIndices = [];

        face.forEach(function (v, i) {

            var id = exists(v, vertices);
            if (id === -1) {

                id = vertices.length;
                vertices.push(v.clone());

                if (hasNormal) normals.push(faceNormalss[i].clone());
                if (hasUV) uvs.push(faceUvs[i].clone());
            }
            tmpIndices.push(id);
        });

        indices.push(tmpIndices[0], tmpIndices[1], tmpIndices[2]);
    }

    var positionBuffer = new Float32Array(vertices.length * 3);

    var normalBuffer = void 0,
        uvBuffer = void 0;

    if (hasNormal) normalBuffer = new Float32Array(vertices.length * 3);
    if (hasUV) uvBuffer = new Float32Array(vertices.length * 2);

    var i2 = 0;
    var i3 = 0;
    for (var _i = 0; _i < vertices.length; _i++) {

        i3 = _i * 3;

        positionBuffer[i3] = vertices[_i].x;
        positionBuffer[i3 + 1] = vertices[_i].y;
        positionBuffer[i3 + 2] = vertices[_i].z;

        if (hasNormal) {

            normalBuffer[i3] = normals[_i].x;
            normalBuffer[i3 + 1] = normals[_i].y;
            normalBuffer[i3 + 2] = normals[_i].z;
        }

        if (hasUV) {

            i2 = _i * 2;
            uvBuffer[i2] = uvs[_i].x;
            uvBuffer[i2 + 1] = uvs[_i].y;
        }
    }

    bufferGeometry.addAttribute('position', new three_module["c" /* BufferAttribute */](positionBuffer, 3));
    if (hasNormal) bufferGeometry.addAttribute('normal', new three_module["c" /* BufferAttribute */](normalBuffer, 3));
    if (hasUV) bufferGeometry.addAttribute('uv', new three_module["c" /* BufferAttribute */](uvBuffer, 2));
    bufferGeometry.setIndex(new three_module["c" /* BufferAttribute */](new Uint32Array(indices), 1));
    return bufferGeometry;

    function exists(v, vertices) {
        for (var _i2 = 0; _i2 < vertices.length; _i2++) {
            if (v.equals(vertices[_i2])) return _i2;
        }
        return -1;
    }
}


// CONCATENATED MODULE: ./src/controls/OrbitControls.js


// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js

var OrbitControls_OrbitControls = function OrbitControls(object, domElement) {

    this.object = object;

    this.domElement = domElement !== undefined ? domElement : document;

    // Set to false to disable this control
    this.enabled = true;

    // "target" sets the location of focus, where the object orbits around
    this.target = new three_module["K" /* Vector3 */]();

    // How far you can dolly in and out ( PerspectiveCamera only )
    this.minDistance = 0;
    this.maxDistance = Infinity;

    // How far you can zoom in and out ( OrthographicCamera only )
    this.minZoom = 0;
    this.maxZoom = Infinity;

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    this.minAzimuthAngle = -Infinity; // radians
    this.maxAzimuthAngle = Infinity; // radians

    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    this.enableDamping = false;
    this.dampingFactor = 0.25;

    // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
    // Set to false to disable zooming
    this.enableZoom = true;
    this.zoomSpeed = 1.0;

    // Set to false to disable rotating
    this.enableRotate = true;
    this.rotateSpeed = 1.0;

    // Set to false to disable panning
    this.enablePan = true;
    this.keyPanSpeed = 7.0; // pixels moved per arrow key push

    // Set to true to automatically rotate around the target
    // If auto-rotate is enabled, you must call controls.update() in your animation loop
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

    // Set to false to disable use of the keys
    this.enableKeys = true;

    // The four arrow keys
    this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

    // Mouse buttons
    this.mouseButtons = { ORBIT: three_module["r" /* MOUSE */].LEFT, ZOOM: three_module["r" /* MOUSE */].MIDDLE, PAN: three_module["r" /* MOUSE */].RIGHT };

    // for reset
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;

    //
    // public methods
    //

    this.getPolarAngle = function () {

        return spherical.phi;
    };

    this.getAzimuthalAngle = function () {

        return spherical.theta;
    };

    this.saveState = function () {

        scope.target0.copy(scope.target);
        scope.position0.copy(scope.object.position);
        scope.zoom0 = scope.object.zoom;
    };

    this.reset = function () {

        scope.target.copy(scope.target0);
        scope.object.position.copy(scope.position0);
        scope.object.zoom = scope.zoom0;

        scope.object.updateProjectionMatrix();
        scope.dispatchEvent(changeEvent);

        scope.update();

        state = STATE.NONE;
    };

    // this method is exposed, but perhaps it would be better if we can make it private...
    this.update = function () {

        var offset = new three_module["K" /* Vector3 */]();

        // so camera.up is the orbit axis
        var quat = new three_module["y" /* Quaternion */]().setFromUnitVectors(object.up, new three_module["K" /* Vector3 */](0, 1, 0));
        var quatInverse = quat.clone().inverse();

        var lastPosition = new three_module["K" /* Vector3 */]();
        var lastQuaternion = new three_module["y" /* Quaternion */]();

        return function update() {

            var position = scope.object.position;

            offset.copy(position).sub(scope.target);

            // rotate offset to "y-axis-is-up" space
            offset.applyQuaternion(quat);

            // angle from z-axis around y-axis
            spherical.setFromVector3(offset);

            if (scope.autoRotate && state === STATE.NONE) {

                rotateLeft(getAutoRotationAngle());
            }

            spherical.theta += sphericalDelta.theta;
            spherical.phi += sphericalDelta.phi;

            // restrict theta to be between desired limits
            spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));

            // restrict phi to be between desired limits
            spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));

            spherical.makeSafe();

            spherical.radius *= scale;

            // restrict radius to be between desired limits
            spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));

            // move target to panned location
            scope.target.add(panOffset);

            offset.setFromSpherical(spherical);

            // rotate offset back to "camera-up-vector-is-up" space
            offset.applyQuaternion(quatInverse);

            position.copy(scope.target).add(offset);

            scope.object.lookAt(scope.target);

            if (scope.enableDamping === true) {

                sphericalDelta.theta *= 1 - scope.dampingFactor;
                sphericalDelta.phi *= 1 - scope.dampingFactor;
            } else {

                sphericalDelta.set(0, 0, 0);
            }

            scale = 1;
            panOffset.set(0, 0, 0);

            // update condition is:
            // min(camera displacement, camera rotation in radians)^2 > EPS
            // using small-angle approximation cos(x/2) = 1 - x^2 / 8

            if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {

                scope.dispatchEvent(changeEvent);

                lastPosition.copy(scope.object.position);
                lastQuaternion.copy(scope.object.quaternion);
                zoomChanged = false;

                return true;
            }

            return false;
        };
    }();

    this.dispose = function () {

        scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
        scope.domElement.removeEventListener('mousedown', onMouseDown, false);
        scope.domElement.removeEventListener('wheel', onMouseWheel, false);

        scope.domElement.removeEventListener('touchstart', onTouchStart, false);
        scope.domElement.removeEventListener('touchend', onTouchEnd, false);
        scope.domElement.removeEventListener('touchmove', onTouchMove, false);

        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);

        window.removeEventListener('keydown', onKeyDown, false);

        // scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
    };

    //
    // internals
    //

    var scope = this;

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start' };
    var endEvent = { type: 'end' };

    var STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };

    var state = STATE.NONE;

    var EPS = 0.000001;

    // current position in spherical coordinates
    var spherical = new three_module["H" /* Spherical */]();
    var sphericalDelta = new three_module["H" /* Spherical */]();

    var scale = 1;
    var panOffset = new three_module["K" /* Vector3 */]();
    var zoomChanged = false;

    var rotateStart = new three_module["J" /* Vector2 */]();
    var rotateEnd = new three_module["J" /* Vector2 */]();
    var rotateDelta = new three_module["J" /* Vector2 */]();

    var panStart = new three_module["J" /* Vector2 */]();
    var panEnd = new three_module["J" /* Vector2 */]();
    var panDelta = new three_module["J" /* Vector2 */]();

    var dollyStart = new three_module["J" /* Vector2 */]();
    var dollyEnd = new three_module["J" /* Vector2 */]();
    var dollyDelta = new three_module["J" /* Vector2 */]();

    function getAutoRotationAngle() {

        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
    }

    function getZoomScale() {

        return Math.pow(0.95, scope.zoomSpeed);
    }

    function rotateLeft(angle) {

        sphericalDelta.theta -= angle;
    }

    function rotateUp(angle) {

        sphericalDelta.phi -= angle;
    }

    var panLeft = function () {

        var v = new three_module["K" /* Vector3 */]();

        return function panLeft(distance, objectMatrix) {

            v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
            v.multiplyScalar(-distance);

            panOffset.add(v);
        };
    }();

    var panUp = function () {

        var v = new three_module["K" /* Vector3 */]();

        return function panUp(distance, objectMatrix) {

            v.setFromMatrixColumn(objectMatrix, 1); // get Y column of objectMatrix
            v.multiplyScalar(distance);

            panOffset.add(v);
        };
    }();

    // deltaX and deltaY are in pixels; right and down are positive
    var pan = function () {

        var offset = new three_module["K" /* Vector3 */]();

        return function pan(deltaX, deltaY) {

            var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

            if (scope.object instanceof three_module["w" /* PerspectiveCamera */]) {

                // perspective
                var position = scope.object.position;
                offset.copy(position).sub(scope.target);
                var targetDistance = offset.length();

                // half of the fov is center to top of screen
                targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180.0);

                // we actually don't use screenWidth, since perspective camera is fixed to screen height
                panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
                panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
            } else if (scope.object instanceof three_module["v" /* OrthographicCamera */]) {

                // orthographic
                panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
                panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
            } else {

                // camera neither orthographic nor perspective
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                scope.enablePan = false;
            }
        };
    }();

    function dollyIn(dollyScale) {

        if (scope.object instanceof three_module["w" /* PerspectiveCamera */]) {

            scale /= dollyScale;
        } else if (scope.object instanceof three_module["v" /* OrthographicCamera */]) {

            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;
        } else {

            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;
        }
    }

    function dollyOut(dollyScale) {

        if (scope.object instanceof three_module["w" /* PerspectiveCamera */]) {

            scale *= dollyScale;
        } else if (scope.object instanceof three_module["v" /* OrthographicCamera */]) {

            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;
        } else {

            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;
        }
    }

    //
    // event callbacks - update the object state
    //

    function handleMouseDownRotate(event) {

        // console.log( 'handleMouseDownRotate' );

        rotateStart.set(event.clientX, event.clientY);
    }

    function handleMouseDownDolly(event) {

        // console.log( 'handleMouseDownDolly' );

        dollyStart.set(event.clientX, event.clientY);
    }

    function handleMouseDownPan(event) {

        // console.log( 'handleMouseDownPan' );

        panStart.set(event.clientX, event.clientY);
    }

    function handleMouseMoveRotate(event) {

        // console.log( 'handleMouseMoveRotate' );

        rotateEnd.set(event.clientX, event.clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart);

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        // rotating across whole screen goes 360 degrees around
        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

        // rotating up and down along whole screen attempts to go 360, but limited to 180
        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

        rotateStart.copy(rotateEnd);

        scope.update();
    }

    function handleMouseMoveDolly(event) {

        // console.log( 'handleMouseMoveDolly' );

        dollyEnd.set(event.clientX, event.clientY);

        dollyDelta.subVectors(dollyEnd, dollyStart);

        if (dollyDelta.y > 0) {

            dollyIn(getZoomScale());
        } else if (dollyDelta.y < 0) {

            dollyOut(getZoomScale());
        }

        dollyStart.copy(dollyEnd);

        scope.update();
    }

    function handleMouseMovePan(event) {

        // console.log( 'handleMouseMovePan' );

        panEnd.set(event.clientX, event.clientY);

        panDelta.subVectors(panEnd, panStart);

        pan(panDelta.x, panDelta.y);

        panStart.copy(panEnd);

        scope.update();
    }

    function handleMouseUp(event) {

        // console.log( 'handleMouseUp' );

    }

    function handleMouseWheel(event) {

        // console.log( 'handleMouseWheel' );

        if (event.deltaY < 0) {

            dollyOut(getZoomScale());
        } else if (event.deltaY > 0) {

            dollyIn(getZoomScale());
        }

        scope.update();
    }

    function handleKeyDown(event) {

        // console.log( 'handleKeyDown' );

        switch (event.keyCode) {

            case scope.keys.UP:
                pan(0, scope.keyPanSpeed);
                scope.update();
                break;

            case scope.keys.BOTTOM:
                pan(0, -scope.keyPanSpeed);
                scope.update();
                break;

            case scope.keys.LEFT:
                pan(scope.keyPanSpeed, 0);
                scope.update();
                break;

            case scope.keys.RIGHT:
                pan(-scope.keyPanSpeed, 0);
                scope.update();
                break;

        }
    }

    function handleTouchStartRotate(event) {

        // console.log( 'handleTouchStartRotate' );

        rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
    }

    function handleTouchStartDolly(event) {

        // console.log( 'handleTouchStartDolly' );

        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;

        var distance = Math.sqrt(dx * dx + dy * dy);

        dollyStart.set(0, distance);
    }

    function handleTouchStartPan(event) {

        // console.log( 'handleTouchStartPan' );

        panStart.set(event.touches[0].pageX, event.touches[0].pageY);
    }

    function handleTouchMoveRotate(event) {

        // console.log( 'handleTouchMoveRotate' );

        rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        rotateDelta.subVectors(rotateEnd, rotateStart);

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        // rotating across whole screen goes 360 degrees around
        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

        // rotating up and down along whole screen attempts to go 360, but limited to 180
        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

        rotateStart.copy(rotateEnd);

        scope.update();
    }

    function handleTouchMoveDolly(event) {

        // console.log( 'handleTouchMoveDolly' );

        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;

        var distance = Math.sqrt(dx * dx + dy * dy);

        dollyEnd.set(0, distance);

        dollyDelta.subVectors(dollyEnd, dollyStart);

        if (dollyDelta.y > 0) {

            dollyOut(getZoomScale());
        } else if (dollyDelta.y < 0) {

            dollyIn(getZoomScale());
        }

        dollyStart.copy(dollyEnd);

        scope.update();
    }

    function handleTouchMovePan(event) {

        // console.log( 'handleTouchMovePan' );

        panEnd.set(event.touches[0].pageX, event.touches[0].pageY);

        panDelta.subVectors(panEnd, panStart);

        pan(panDelta.x, panDelta.y);

        panStart.copy(panEnd);

        scope.update();
    }

    function handleTouchEnd(event) {}

    // console.log( 'handleTouchEnd' );

    //
    // event handlers - FSM: listen for events and reset state
    //

    function onMouseDown(event) {

        if (scope.enabled === false) return;

        event.preventDefault();

        switch (event.button) {

            case scope.mouseButtons.ORBIT:

                if (scope.enableRotate === false) return;

                handleMouseDownRotate(event);

                state = STATE.ROTATE;

                break;

            case scope.mouseButtons.ZOOM:

                if (scope.enableZoom === false) return;

                handleMouseDownDolly(event);

                state = STATE.DOLLY;

                break;

            case scope.mouseButtons.PAN:

                if (scope.enablePan === false) return;

                handleMouseDownPan(event);

                state = STATE.PAN;

                break;

        }

        if (state !== STATE.NONE) {

            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('mouseup', onMouseUp, false);

            scope.dispatchEvent(startEvent);
        }
    }

    function onMouseMove(event) {

        if (scope.enabled === false) return;

        event.preventDefault();

        switch (state) {

            case STATE.ROTATE:

                if (scope.enableRotate === false) return;

                handleMouseMoveRotate(event);

                break;

            case STATE.DOLLY:

                if (scope.enableZoom === false) return;

                handleMouseMoveDolly(event);

                break;

            case STATE.PAN:

                if (scope.enablePan === false) return;

                handleMouseMovePan(event);

                break;

        }
    }

    function onMouseUp(event) {

        if (scope.enabled === false) return;

        handleMouseUp(event);

        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);

        scope.dispatchEvent(endEvent);

        state = STATE.NONE;
    }

    function onMouseWheel(event) {

        if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE && state !== STATE.ROTATE) return;

        event.preventDefault();
        event.stopPropagation();

        handleMouseWheel(event);

        scope.dispatchEvent(startEvent); // not sure why these are here...
        scope.dispatchEvent(endEvent);
    }

    function onKeyDown(event) {

        if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) return;

        handleKeyDown(event);
    }

    function onTouchStart(event) {

        if (scope.enabled === false) return;

        switch (event.touches.length) {

            case 1:
                // one-fingered touch: rotate

                if (scope.enableRotate === false) return;

                handleTouchStartRotate(event);

                state = STATE.TOUCH_ROTATE;

                break;

            case 2:
                // two-fingered touch: dolly

                if (scope.enableZoom === false) return;

                handleTouchStartDolly(event);

                state = STATE.TOUCH_DOLLY;

                break;

            case 3:
                // three-fingered touch: pan

                if (scope.enablePan === false) return;

                handleTouchStartPan(event);

                state = STATE.TOUCH_PAN;

                break;

            default:

                state = STATE.NONE;

        }

        if (state !== STATE.NONE) {

            scope.dispatchEvent(startEvent);
        }
    }

    function onTouchMove(event) {

        if (scope.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {

            case 1:
                // one-fingered touch: rotate

                if (scope.enableRotate === false) return;
                if (state !== STATE.TOUCH_ROTATE) return; // is this needed?...

                handleTouchMoveRotate(event);

                break;

            case 2:
                // two-fingered touch: dolly

                if (scope.enableZoom === false) return;
                if (state !== STATE.TOUCH_DOLLY) return; // is this needed?...

                handleTouchMoveDolly(event);

                break;

            case 3:
                // three-fingered touch: pan

                if (scope.enablePan === false) return;
                if (state !== STATE.TOUCH_PAN) return; // is this needed?...

                handleTouchMovePan(event);

                break;

            default:

                state = STATE.NONE;

        }
    }

    function onTouchEnd(event) {

        if (scope.enabled === false) return;

        handleTouchEnd(event);

        scope.dispatchEvent(endEvent);

        state = STATE.NONE;
    }

    function onContextMenu(event) {

        event.preventDefault();
    }

    //

    scope.domElement.addEventListener('contextmenu', onContextMenu, false);

    scope.domElement.addEventListener('mousedown', onMouseDown, false);
    scope.domElement.addEventListener('wheel', onMouseWheel, false);

    scope.domElement.addEventListener('touchstart', onTouchStart, false);
    scope.domElement.addEventListener('touchend', onTouchEnd, false);
    scope.domElement.addEventListener('touchmove', onTouchMove, false);

    window.addEventListener('keydown', onKeyDown, false);

    // force an update at start

    this.update();
};

OrbitControls_OrbitControls.prototype = Object.create(three_module["i" /* EventDispatcher */].prototype);
OrbitControls_OrbitControls.prototype.constructor = OrbitControls_OrbitControls;


// CONCATENATED MODULE: ./node_modules/_babel-loader@7.1.5@babel-loader/lib!./node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=script&index=0!./src/model-mixin.vue
//
//
//
//
//
//
//
//
//
//
//






var suportWebGL = function () {

    try {
        var canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}();

/* harmony default export */ var model_mixin = ({
    props: {
        src: {
            type: String
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        position: {
            type: Object,
            default: function _default() {
                return { x: 0, y: 0, z: 0 };
            }
        },
        rotation: {
            type: Object,
            default: function _default() {
                return { x: 0, y: 0, z: 0 };
            }
        },
        scale: {
            type: Object,
            default: function _default() {
                return { x: 1, y: 1, z: 1 };
            }
        },
        lights: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        cameraPosition: {
            type: Object
        },
        cameraRotation: {
            type: Object
        },
        cameraUp: {
            type: Object
        },
        cameraLookAt: {
            type: Object
        },
        backgroundColor: {
            default: 0xffffff
        },
        backgroundAlpha: {
            type: Number,
            default: 1
        },
        controllable: {
            type: Boolean,
            default: true
        }
    },
    data: function data() {
        return {
            suportWebGL: suportWebGL,
            size: {
                width: this.width,
                height: this.height
            },
            object: null,
            raycaster: new three_module["E" /* Raycaster */](),
            mouse: new three_module["J" /* Vector2 */](),
            camera: new three_module["w" /* PerspectiveCamera */](45, 1, 0.01, 100000),
            scene: new three_module["G" /* Scene */](),
            wrapper: new three_module["u" /* Object3D */](),
            renderer: null,
            controls: null,
            allLights: [],
            clock: typeof performance === 'undefined' ? Date : performance,
            reqId: null // requestAnimationFrame id
        };
    },

    computed: {
        hasListener: function hasListener() {

            // 判断是否有鼠标事件监听，用于减少不必要的拾取判断
            var events = this._events;
            var result = {};

            ['on-mousemove', 'on-mouseup', 'on-mousedown', 'on-click'].forEach(function (name) {
                result[name] = !!events[name] && events[name].length > 0;
            });

            return result;
        }
    },
    mounted: function mounted() {

        if (this.width === undefined || this.height === undefined) {
            this.size = {
                width: this.$el.offsetWidth,
                height: this.$el.offsetHeight
            };
        }

        this.renderer = new three_module["L" /* WebGLRenderer */]({ antialias: true, alpha: true, canvas: this.$refs.canvas });
        this.renderer.shadowMap.enabled = true;

        this.scene.add(this.wrapper);

        this.load();
        this.update();

        this.$el.addEventListener('mousedown', this.onMouseDown, false);
        this.$el.addEventListener('mousemove', this.onMouseMove, false);
        this.$el.addEventListener('mouseup', this.onMouseUp, false);
        this.$el.addEventListener('click', this.onClick, false);

        window.addEventListener('resize', this.onResize, false);

        this.animate();
    },
    beforeDestroy: function beforeDestroy() {

        cancelAnimationFrame(this.reqId);

        this.$el.removeEventListener('mousedown', this.onMouseDown, false);
        this.$el.removeEventListener('mousemove', this.onMouseMove, false);
        this.$el.removeEventListener('mouseup', this.onMouseUp, false);
        this.$el.removeEventListener('click', this.onClick, false);

        window.removeEventListener('resize', this.onResize, false);
    },

    watch: {
        src: function src() {
            this.load();
        },

        rotation: {
            deep: true,
            handler: function handler(val) {
                if (!this.object) return;
                this.object.rotation.set(val.x, val.y, val.z);
            }
        },
        position: {
            deep: true,
            handler: function handler(val) {
                if (!this.object) return;
                this.object.position.set(val.x, val.y, val.z);
            }
        },
        scale: {
            deep: true,
            handler: function handler(val) {
                if (!this.object) return;
                this.object.scale.set(val.x, val.y, val.z);
            }
        },
        lights: {
            deep: true,
            handler: function handler(val, oldVal) {
                this.updateLights();
            }
        },
        size: {
            deep: true,
            handler: function handler(val) {
                this.updateCamera();
                this.updateRenderer();
            }
        },
        controllable: function controllable() {
            this.updateControls();
        },
        backgroundAlpha: function backgroundAlpha() {
            this.updateRenderer();
        },
        backgroundColor: function backgroundColor() {
            this.updateRenderer();
        }
    },
    methods: {
        onResize: function onResize() {
            var _this = this;

            if (this.width === undefined || this.height === undefined) {

                this.$nextTick(function () {
                    _this.size = {
                        width: _this.$el.offsetWidth,
                        height: _this.$el.offsetHeight
                    };
                });
            }
        },
        onMouseDown: function onMouseDown(event) {

            if (!this.hasListener['on-mousedown']) return;

            var intersected = this.pick(event.clientX, event.clientY);
            this.$emit('on-mousedown', intersected);
        },
        onMouseMove: function onMouseMove(event) {

            if (!this.hasListener['on-mousemove']) return;

            var intersected = this.pick(event.clientX, event.clientY);
            this.$emit('on-mousemove', intersected);
        },
        onMouseUp: function onMouseUp(event) {

            if (!this.hasListener['on-mouseup']) return;

            var intersected = this.pick(event.clientX, event.clientY);
            this.$emit('on-mouseup', intersected);
        },
        onClick: function onClick(event) {

            if (!this.hasListener['on-click']) return;

            var intersected = this.pick(event.clientX, event.clientY);
            this.$emit('on-click', intersected);
        },
        pick: function pick(x, y) {

            if (!this.object) return;

            var rect = this.$el.getBoundingClientRect();

            x -= rect.left;
            y -= rect.top;

            this.mouse.x = x / this.size.width * 2 - 1;
            this.mouse.y = -(y / this.size.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            var intersects = this.raycaster.intersectObject(this.object, true);

            return (intersects && intersects.length) > 0 ? intersects[0] : null;
        },
        update: function update() {

            this.updateRenderer();
            this.updateCamera();
            this.updateLights();
            this.updateControls();
        },
        updateModel: function updateModel() {

            var object = this.object;

            if (!object) return;

            var position = this.position;
            var rotation = this.rotation;
            var scale = this.scale;

            object.position.set(position.x, position.y, position.z);
            object.rotation.set(rotation.x, rotation.y, rotation.z);
            object.scale.set(scale.x, scale.y, scale.z);
        },
        updateRenderer: function updateRenderer() {

            var renderer = this.renderer;

            renderer.setSize(this.size.width, this.size.height);
            renderer.setPixelRatio(window.devicePixelRatio || 1);
            renderer.setClearColor(new three_module["e" /* Color */](this.backgroundColor).getHex());
            renderer.setClearAlpha(this.backgroundAlpha);
        },
        updateCamera: function updateCamera() {

            var camera = this.camera;
            var object = this.object;

            camera.aspect = this.size.width / this.size.height;
            camera.updateProjectionMatrix();

            if (!this.cameraLookAt && !this.cameraPosition && !this.cameraRotation && !this.cameraUp) {

                if (!object) return;

                var distance = getSize(object).length();

                camera.position.set(0, 0, 0);
                camera.position.z = distance;
                camera.lookAt(new three_module["K" /* Vector3 */]());
            } else {

                camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
                camera.rotation.set(this.cameraRotation.x, this.cameraRotation.y, this.cameraRotation.z);
                camera.up.set(this.cameraUp.x, this.cameraUp.y, this.cameraUp.z);

                camera.lookAt(new three_module["K" /* Vector3 */](this.cameraLookAt.x, this.cameraLookAt.y, this.cameraLookAt.z));
            }
        },
        updateLights: function updateLights() {
            var _this2 = this;

            this.scene.remove.apply(this.scene, this.allLights);

            this.allLights = [];

            this.lights.forEach(function (item) {

                if (!item.type) return;

                var type = item.type.toLowerCase();

                var light = null;

                if (type === 'ambient' || type === 'ambientlight') {

                    var color = item.color || 0x404040;
                    var intensity = item.intensity || 1;

                    light = new three_module["a" /* AmbientLight */](color, intensity);
                } else if (type === 'point' || type === 'pointlight') {

                    var _color = item.color || 0xffffff;
                    var _intensity = item.intensity || 1;
                    var distance = item.distance || 0;
                    var decay = item.decay || 1;

                    light = new three_module["x" /* PointLight */](_color, _intensity, distance, decay);

                    if (item.position) {
                        light.position.copy(item.position);
                    }
                } else if (type === 'directional' || type === 'directionallight') {

                    var _color2 = item.color || 0xffffff;
                    var _intensity2 = item.intensity || 1;

                    light = new three_module["h" /* DirectionalLight */](_color2, _intensity2);

                    if (item.position) {
                        light.position.copy(item.position);
                    }

                    if (item.target) {
                        light.target.copy(item.target);
                    }
                } else if (type === 'hemisphere' || type === 'hemispherelight') {

                    var skyColor = item.skyColor || 0xffffff;
                    var groundColor = item.groundColor || 0xffffff;
                    var _intensity3 = item.intensity || 1;

                    light = new three_module["n" /* HemisphereLight */](skyColor, groundColor, _intensity3);

                    if (item.position) {
                        light.position.copy(item.position);
                    }
                }

                _this2.allLights.push(light);
                _this2.scene.add(light);
            });
        },
        updateControls: function updateControls() {

            if (this.controllable && this.controls) return;

            if (this.controllable) {

                if (this.controls) return;

                this.controls = new OrbitControls_OrbitControls(this.camera, this.$el);
                this.controls.type = 'orbit';
            } else {

                if (this.controls) {

                    this.controls.dispose();
                    this.controls = null;
                }
            }
        },
        load: function load() {
            var _this3 = this;

            if (!this.src) return;

            if (this.object) {

                this.wrapper.remove(this.object);
            }

            this.loader.load(this.src, function () {

                var object = _this3.getObject.apply(_this3, arguments);

                if (_this3.process) {
                    _this3.process(object);
                }

                _this3.addObject(object);

                _this3.$emit('on-load');
            }, function (xhr) {

                _this3.$emit('on-progress', xhr);
            }, function (err) {

                _this3.$emit('on-error', err);
            });
        },
        getObject: function getObject(object) {

            return object;
        },
        addObject: function addObject(object) {

            var center = getCenter(object);

            // correction position
            this.wrapper.position.copy(center.negate());

            this.object = object;
            this.wrapper.add(object);

            this.updateCamera();
            this.updateModel();
        },
        animate: function animate() {
            this.reqId = requestAnimationFrame(this.animate);
            this.render();
        },
        render: function render() {

            this.renderer.render(this.scene, this.camera);
        }
    }
});
// CONCATENATED MODULE: ./node_modules/_vue-loader@13.7.2@vue-loader/lib/template-compiler?{"id":"data-v-0da609ea","hasScoped":false,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=template&index=0!./src/model-mixin.vue
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"width":"100%","height":"100%","margin":"0","border":"0","padding":"0"}},[(_vm.suportWebGL)?_c('canvas',{ref:"canvas",staticStyle:{"width":"100%","height":"100%"}}):_c('div',[_vm._t("default",[_vm._v("\n            Your browser does not seem to support "),_c('a',{staticStyle:{"color":"#000"},attrs:{"href":"http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation"}},[_vm._v("WebGL")]),_vm._v("."),_c('br'),_vm._v("'\n        ")])],2)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ var selectortype_template_index_0_src_model_mixin = (esExports);
// CONCATENATED MODULE: ./src/model-mixin.vue
var normalizeComponent = __webpack_require__("vSla")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  model_mixin,
  selectortype_template_index_0_src_model_mixin,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ var src_model_mixin = (Component.exports);

// CONCATENATED MODULE: ./node_modules/_babel-loader@7.1.5@babel-loader/lib!./node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=script&index=0!./src/model-obj.vue









/* harmony default export */ var model_obj = ({
    name: 'model-obj',
    mixins: [src_model_mixin],
    props: {
        lights: {
            type: Array,
            default: function _default() {
                return [{
                    type: 'HemisphereLight',
                    position: { x: 0, y: 1, z: 0 },
                    skyColor: 0xaaaaff,
                    groundColor: 0x806060,
                    intensity: 0.2
                }, {
                    type: 'DirectionalLight',
                    position: { x: 1, y: 1, z: 1 },
                    color: 0xffffff,
                    intensity: 0.8
                }];
            }
        },
        smoothing: {
            type: Boolean,
            default: false
        },
        mtlPath: {
            type: String
        },
        mtl: {
            type: String
        }
    },
    data: function data() {
        return {
            loader: new OBJLoader(),
            mtlLoader: new MTLLoader_MTLLoader()
        };
    },

    watch: {
        mtl: function mtl() {
            this.load();
        }
    },
    methods: {
        process: function process(object) {
            if (this.smoothing) {
                object.traverse(function (child) {
                    if (child.geometry) {
                        child.geometry = toIndexed(child.geometry);
                        child.geometry.computeVertexNormals();
                    }
                });
            }
        },
        load: function load() {
            var _this = this;

            if (!this.src) return;

            if (this.object) {
                this.wrapper.remove(this.object);
            }

            var onLoad = function onLoad(object) {

                if (_this.process) {
                    _this.process(object);
                }

                _this.addObject(object);

                _this.$emit('on-load');
            };

            var onProgress = function onProgress(xhr) {

                _this.$emit('on-progress', xhr);
            };

            var onError = function onError(err) {

                _this.$emit('on-error', err);
            };

            if (this.mtl) {

                var mtlPath = this.mtlPath;
                var mtlSrc = this.mtl;

                if (!this.mtlPath) {

                    var result = /^(.*\/)([^/]*)$/.exec(this.mtl);

                    if (result) {
                        mtlPath = result[1];
                        mtlSrc = result[2];
                    }
                }

                if (mtlPath) {
                    this.mtlLoader.setPath(mtlPath);
                }

                this.mtlLoader.load(mtlSrc, function (materials) {

                    materials.preload();

                    _this.loader.setMaterials(materials);

                    _this.loader.load(_this.src, onLoad, onProgress, onError);
                }, function () {}, onError);
            } else {

                this.loader.load(this.src, onLoad, onProgress, onError);
            }
        }
    }
});
// CONCATENATED MODULE: ./src/model-obj.vue
var model_obj_normalizeComponent = __webpack_require__("vSla")
/* script */


/* template */
var __vue_template__ = null
/* template functional */
var model_obj___vue_template_functional__ = false
/* styles */
var model_obj___vue_styles__ = null
/* scopeId */
var model_obj___vue_scopeId__ = null
/* moduleIdentifier (server only) */
var model_obj___vue_module_identifier__ = null
var model_obj_Component = model_obj_normalizeComponent(
  model_obj,
  __vue_template__,
  model_obj___vue_template_functional__,
  model_obj___vue_styles__,
  model_obj___vue_scopeId__,
  model_obj___vue_module_identifier__
)

/* harmony default export */ var src_model_obj = (model_obj_Component.exports);

// CONCATENATED MODULE: ./node_modules/_babel-loader@7.1.5@babel-loader/lib!./node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=script&index=0!./examples/App.vue
//
//
//

// import { ModelObj } from 'vue-3d-model'


/* harmony default export */ var App = ({
    components: { ModelObj: src_model_obj }
});
// CONCATENATED MODULE: ./node_modules/_vue-loader@13.7.2@vue-loader/lib/template-compiler?{"id":"data-v-68df1a9d","hasScoped":false,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=template&index=0!./examples/App.vue
var App_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('model-obj',{attrs:{"src":"static/models/obj/tree.obj"}})}
var App_staticRenderFns = []
var App_esExports = { render: App_render, staticRenderFns: App_staticRenderFns }
/* harmony default export */ var selectortype_template_index_0_examples_App = (App_esExports);
// CONCATENATED MODULE: ./examples/App.vue
var App_normalizeComponent = __webpack_require__("vSla")
/* script */


/* template */

/* template functional */
var App___vue_template_functional__ = false
/* styles */
var App___vue_styles__ = null
/* scopeId */
var App___vue_scopeId__ = null
/* moduleIdentifier (server only) */
var App___vue_module_identifier__ = null
var App_Component = App_normalizeComponent(
  App,
  selectortype_template_index_0_examples_App,
  App___vue_template_functional__,
  App___vue_styles__,
  App___vue_scopeId__,
  App___vue_module_identifier__
)

/* harmony default export */ var examples_App = (App_Component.exports);

// CONCATENATED MODULE: ./examples/index.js


// import router from './router'

new vue_runtime_esm["a" /* default */]( {
    el: '#app',
    // router,
    render: h => h( examples_App )
} )


/***/ })

},["ODmg"]);
//# sourceMappingURL=app.cbb74b5c5ac2b6bbbae4.js.map