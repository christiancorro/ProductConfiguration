//TODO: refactoring
//TODO: scrivere il diario
//TODO: scrivere il report

// Scene
let scene, camera, renderer, controls;
let canvas = document.querySelector("#canvas");
let bgColor = new THREE.Color(0xF9F9F9);
let strat, materials;
let world = new THREE.Group();

// Camera
let fov = 60,
    aspectRatio = window.innerWidth / window.innerHeight,
    near = 0.01,
    far = 500;

// Loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new THREE.GLTFLoader();

let envMap = loadCubeMap("env_map");
envMap.minFilter = THREE.LinearMipMapLinearFilter;

let normalMapMetal, normalMapPlastic;

let irradianceMap = loadCubeMap("irradiance_map");

gltfLoader.load('models/stratocaster/stratocaster.gltf', function (gltf) {

    strat = gltf.scene.children[0];
    // strat.rotation.y = -Math.PI / 2;
    strat.rotation.z = -Math.PI / 2;
    // strat.rotation.x = 4 * (Math.PI / 180);
    strat.position.set(0, 0, 0);
    world.add(strat);

    Start();
    Update();
});

const DEFAULT_CAMERA_POSITION_X = 0,
    DEFAULT_CAMERA_POSITION_Y = 0,
    DEFAULT_CAMERA_POSITION_Z = 2.9;

// -----------------------------------------------
// START
// -----------------------------------------------

let clock;

let materialExtensions = {
    derivatives: true,
    shaderTextureLOD: true
};

let mats = [];
let cl, cl2, cl3;
let lightParameters, lightParameters2, lightParameters3, ambientLightParameters;

let uniformsPsychedelic = {
    "time": { value: 0 }
}

function Start() {

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(bgColor, far / 3, far * 2);

    camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    // renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(bgColor);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 0.1;
    // this.renderer.toneMappingWhitePoint = 1.0;
    // renderer.outputEncoding = THREE.sRGBEncoding;

    camera.position.set(DEFAULT_CAMERA_POSITION_X, DEFAULT_CAMERA_POSITION_Y, DEFAULT_CAMERA_POSITION_Z);
    camera.lookAt(new THREE.Vector3(0, 0.4, 0));

    let planeGeometry = new THREE.PlaneBufferGeometry(8, 6, 2, 2);
    let wireMaterial = new THREE.MeshBasicMaterial({ color: 0x999999, wireframe: true });
    plane = new THREE.Mesh(planeGeometry, wireMaterial);
    plane.position.set(0, -2, 0);
    plane.rotation.x = Math.PI / 2;


    // world.add(plane);
    scene.add(world);
    // scene.background = envMap;
    scene.environment = envMap;

    let materialPsychedelic = new THREE.ShaderMaterial({
        uniforms: uniformsPsychedelic,
        vertexShader: document.getElementById('vertex_psychedelic').textContent,
        fragmentShader: document.getElementById('fragment_psychedelic').textContent

    });
    materialPsychedelic.name = "Psychedelic";

    let cspec_gold = {
        red: 1.022,
        green: 0.782,
        blue: 0.344
    };

    let cspec_copper = {
        red: 0.955,
        green: 0.638,
        blue: 0.538
    };

    let cspec_silver = {
        red: 0.972,
        green: 0.960,
        blue: 0.915
    };

    let cspec_nickel = {
        red: 0.660,
        green: 0.609,
        blue: 0.526
    };

    let cdiff_plastic_white = {
        red: 0.9,
        green: 0.9,
        blue: 0.9
    };

    let cdiff_plastic_black = {
        red: 0,
        green: 0,
        blue: 0
    };

    let cdiff_plastic_red = {
        red: 0.6,
        green: 0,
        blue: 0.03
    };

    let cdiff_plastic_blue = {
        red: 0,
        green: 0.1,
        blue: 0.6
    };

    let cdiff_plastic_green = {
        red: 0.09020,
        green: 0.73137,
        blue: 0.14314
    };

    let cdiff_plastic_old_white = {
        red: 1,
        green: 1,
        blue: 0.8
    };

    // lights params
    lightParameters = {
        red: 1.0,
        green: 1.0,
        blue: 0.9,
        intensity: 1.3,
    };
    lightParameters2 = {
        red: 0.5,
        green: 0.5,
        blue: 0.5,
        intensity: 0.3,
    };
    lightParameters3 = {
        red: 1.0,
        green: 1.0,
        blue: 0.9,
        intensity: 1.3,
    };

    cl = new THREE.Vector3(
        lightParameters.red * lightParameters.intensity,
        lightParameters.green * lightParameters.intensity,
        lightParameters.blue * lightParameters.intensity
    );
    cl2 = new THREE.Vector3(
        lightParameters2.red * lightParameters2.intensity,
        lightParameters2.green * lightParameters2.intensity,
        lightParameters2.blue * lightParameters2.intensity
    );
    cl3 = new THREE.Vector3(
        lightParameters3.red * lightParameters3.intensity,
        lightParameters3.green * lightParameters3.intensity,
        lightParameters3.blue * lightParameters3.intensity
    );

    ambientLightParameters = {
        red: 0.2,
        green: 0.2,
        blue: 0.15,
        intensity: 0.1,
    };

    lightMesh = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(lightParameters.red, lightParameters.green, lightParameters.blue) }));
    lightMesh.position.set(0, 80, 80);

    // scene.add(lightMesh);

    lightMesh2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(lightParameters2.red, lightParameters2.green, lightParameters2.blue) }));
    lightMesh2.position.set(-30, 1, -40);

    // scene.add(lightMesh2);

    lightMesh3 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(lightParameters3.red, lightParameters3.green, lightParameters3.blue) }));
    lightMesh3.position.set(40, 10, -30);
    // scene.add(lightMesh3);

    normalMapMetal = loadTexture("textures/materials/metal/normal.jpg");
    normalMapPlastic = loadTexture("textures/materials/plastic/normal.jpg");

    let ash2 = createMaterialTexture("Ash 2", 0.6, 2);
    let ash = createMaterialTexture("Ash", 2, 2);
    let old_ash = createMaterialTexture("Old ash", 3, 2);
    let alder = createMaterialTexture("Alder", 3, 2);
    let old_alder = createMaterialTexture("Old alder", 4, 1);

    let fabric_blue = createMaterialTexture("Blue fabric", 1, 3);
    let fabric_red = createMaterialTexture("Red fabric", 0.4, 3);
    let fabric_black = createMaterialTexture("Black fabric", 2, 4);

    let leather_white = createMaterialTexture("White leather", 2, 2);
    let leather_red = createMaterialTexture("Red leather", 2, 2);
    let leather_black = createMaterialTexture("Black leather", 2, 4);


    let silver = createMaterialMetal("Silver", cspec_silver, 0.25, 0.7);
    let nickel = createMaterialMetal("Nickel", cspec_nickel, 0.3, 1.3);
    let copper = createMaterialMetal("Copper", cspec_copper, 0.3, 0.6);
    let gold = createMaterialMetal("Gold", cspec_gold, 0.33, 0.4);

    let plastic_white = createMaterialPlastic("White plastic", cdiff_plastic_white, 0.55, 2);
    let plastic_red = createMaterialPlastic("Red plastic", cdiff_plastic_red, 0.55, 1);
    let plastic_black = createMaterialPlastic("Black plastic", cdiff_plastic_black, 0.55, 1);
    let plastic_green = createMaterialPlastic("Green plastic", cdiff_plastic_green, 0.55, 1);
    let plastic_blue = createMaterialPlastic("Blue plastic", cdiff_plastic_blue, 0.55, 1);
    let plastic_old_white = createMaterialPlastic("Old plastic", cdiff_plastic_old_white, 0.7, 4);

    let rock_green = createMaterialTexture("Green rock", 10, 2);

    mats.push(materialPsychedelic);


    materials = {
        "head": {
            "defaultMaterial": ash,
            "availableMaterials": [
                ash,
                ash2,
                old_ash,
                alder,
                old_alder,
                gold,
                silver,
                copper,
                nickel,
                plastic_black,
                plastic_red,
                rock_green,
                materialPsychedelic]
        },
        "logo": {
            "defaultMaterial": gold,
            "availableMaterials": [
                plastic_old_white,
                plastic_white,
                plastic_black,
                plastic_red,
                plastic_green,
                plastic_blue,
                gold,
                silver,
                copper,
                nickel,
                rock_green,
                materialPsychedelic]
        },
        "neck": {
            "defaultMaterial": alder,
            "availableMaterials": [
                ash,
                ash2,
                old_ash,
                alder,
                old_alder,
                gold,
                silver,
                copper,
                nickel,
                rock_green,
                materialPsychedelic]
        },
        "strings": {
            "defaultMaterial": nickel,
            "availableMaterials": [
                gold,
                silver,
                copper,
                nickel,
                materialPsychedelic]
        },
        "frets": {
            "defaultMaterial": gold,
            "availableMaterials": [
                plastic_old_white,
                plastic_white,
                plastic_black,
                plastic_red,
                plastic_green,
                plastic_blue,
                gold,
                silver,
                copper,
                nickel,
                ash,
                ash2,
                old_ash,
                alder,
                old_alder,
                rock_green,
                materialPsychedelic]
        },
        "fret-markers": {
            "defaultMaterial": plastic_old_white,
            "availableMaterials": [
                plastic_old_white,
                plastic_white,
                plastic_black,
                plastic_red,
                plastic_green,
                plastic_blue,
                gold,
                silver,
                copper,
                nickel,
                ash,
                ash2,
                old_ash,
                rock_green,
                materialPsychedelic]
        },
        "body": {
            "defaultMaterial": ash,
            "availableMaterials": [
                ash,
                ash2,
                old_ash,
                alder,
                old_alder,
                gold,
                silver,
                copper,
                nickel,
                plastic_old_white,
                plastic_white,
                plastic_black,
                plastic_red,
                plastic_green,
                plastic_blue,
                rock_green,
                materialPsychedelic]
        },
        "pickguard": {
            "defaultMaterial": gold,
            "availableMaterials": [
                plastic_old_white,
                plastic_white,
                plastic_black,
                plastic_red,
                plastic_green,
                plastic_blue,
                fabric_black,
                fabric_blue,
                fabric_red,
                leather_white,
                leather_red,
                leather_black,
                ash,
                ash2,
                old_ash,
                alder,
                old_alder,
                gold,
                silver,
                copper,
                nickel,
                rock_green,
                materialPsychedelic]
        },
        "metals": {
            "defaultMaterial": gold,
            "availableMaterials": [
                gold,
                silver,
                copper,
                nickel,
                plastic_white,
                plastic_red,
                plastic_black,
                materialPsychedelic]
        },
        "plastics": {
            "defaultMaterial": plastic_old_white,
            "availableMaterials": [
                plastic_old_white,
                plastic_white,
                plastic_black,
                plastic_red,
                plastic_green,
                plastic_blue,
                gold,
                silver,
                copper,
                nickel,
                rock_green,
                materialPsychedelic]
        },
        "knobs-text": {
            "defaultMaterial": nickel,
            "availableMaterials": [
                plastic_old_white,
                plastic_white,
                plastic_black,
                plastic_red,
                plastic_green,
                plastic_blue,
                gold,
                silver,
                copper,
                nickel,
                rock_green,
                materialPsychedelic]
        }
    }

    // Stats
    stats = new Stats();
    stats.domElement.classList.add("stats");
    document.body.appendChild(stats.domElement);

    // Controls
    // controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.rotateSpeed = 4;
    controls.minDistance = 0.1;
    controls.maxDistance = 6;
    controls.enableDamping = true;
    // controls.enablePan = false;
    controls.dampingFactor = 0.2;
    // controls.maxPolarAngle = Math.PI / 2;
    // controls.minPolarAngle = Math.PI * 0.05;
    controls.enableKeys = true;

    // Now, please, go
    setMaterials();
    createGUI();
    pageLoaded();
}

function createMaterialMetal(name, cspec, roughness, normalScale) {
    let normalMap = normalMapMetal;

    let uniforms = {
        cspec: { type: "v3", value: new THREE.Vector3(0.8, 0.8, 0.8) },
        roughness: { type: "f", value: roughness },
        normalMap: { type: "t", value: normalMap },
        normalScale: { type: "v2", value: new THREE.Vector2(normalScale, normalScale) },
        envMap: { type: "t", value: envMap },

        pointLightPosition: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition2: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition3: { type: "v3", value: new THREE.Vector3() },
        clight: { type: 'v3', value: cl },
        clight2: { type: 'v3', value: cl2 },
        clight3: { type: 'v3', value: cl3 }
    };

    uniforms.cspec.value = new THREE.Vector3(
        cspec.red,
        cspec.green,
        cspec.blue
    );

    uniforms.pointLightPosition.value = new THREE.Vector3(
        lightMesh.position.x,
        lightMesh.position.y,
        lightMesh.position.z);

    uniforms.pointLightPosition2.value = new THREE.Vector3(
        lightMesh2.position.x,
        lightMesh2.position.y,
        lightMesh2.position.z);

    uniforms.pointLightPosition3.value = new THREE.Vector3(
        lightMesh3.position.x,
        lightMesh3.position.y,
        lightMesh3.position.z);

    let metal = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs_metal').textContent,
        extensions: materialExtensions
    });

    metal.name = name;

    mats.push(metal);

    return metal;
}

function createMaterialPlastic(name, cdiff, roughness, normalScale) {

    let normalMap = normalMapPlastic;

    let uniforms = {
        cspec: { type: "v3", value: new THREE.Vector3(0.04, 0.04, 0.04) },
        cdiff: { type: "v3", value: new THREE.Vector3(0.5, 0.5, 0.5) },
        normalMap: { type: "t", value: normalMap },
        normalScale: { type: "v2", value: new THREE.Vector2(normalScale, normalScale) },
        irradianceMap: { type: "t", value: irradianceMap },
        envMap: { type: "t", value: envMap },
        roughness: { type: "f", value: roughness },

        pointLightPosition: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition2: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition3: { type: "v3", value: new THREE.Vector3() },
        ambientLight: { type: "v3", value: new THREE.Vector3() },
        clight: { type: 'v3', value: cl },
        clight2: { type: 'v3', value: cl2 },
        clight3: { type: 'v3', value: cl3 }
    };

    uniforms.cdiff.value = new THREE.Vector3(
        cdiff.red,
        cdiff.green,
        cdiff.blue
    );

    uniforms.ambientLight.value = new THREE.Vector3(
        ambientLightParameters.red * ambientLightParameters.intensity,
        ambientLightParameters.green * ambientLightParameters.intensity,
        ambientLightParameters.blue * ambientLightParameters.intensity);

    uniforms.pointLightPosition.value = new THREE.Vector3(lightMesh.position.x,
        lightMesh.position.y,
        lightMesh.position.z);

    uniforms.pointLightPosition2.value = new THREE.Vector3(lightMesh2.position.x,
        lightMesh.position.y,
        lightMesh.position.z);

    uniforms.pointLightPosition3.value = new THREE.Vector3(lightMesh3.position.x,
        lightMesh.position.y,
        lightMesh.position.z);


    let plastic = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs_plastic').textContent,
        extensions: materialExtensions
    });

    plastic.name = name;

    mats.push(plastic);

    return plastic;
}

function createMaterialTexture(name, normalScale, textureRepeat) {

    let diffuseMap = loadTexture("textures/materials/" + name + "/diffuse.jpg");
    let roughnessMap = loadTexture("textures/materials/" + name + "/roughness.jpg");
    let normalMap = loadTexture("textures/materials/" + name + "/normal.jpg");


    let uniforms = {
        diffuseMap: { type: "t", value: diffuseMap },
        roughnessMap: { type: "t", value: roughnessMap },
        normalMap: { type: "t", value: normalMap },
        normalScale: { type: "v2", value: new THREE.Vector2(normalScale, normalScale) },
        irradianceMap: { type: "t", value: irradianceMap },
        textureRepeat: { type: "v2", value: new THREE.Vector2(textureRepeat, textureRepeat) },

        pointLightPosition: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition2: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition3: { type: "v3", value: new THREE.Vector3() },
        ambientLight: { type: "v3", value: new THREE.Vector3() },
        clight: { type: 'v3', value: cl },
        clight2: { type: 'v3', value: cl2 },
        clight3: { type: 'v3', value: cl3 }
    };

    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs_texture').textContent,
        extensions: materialExtensions
    });

    uniforms.pointLightPosition.value = new THREE.Vector3(lightMesh.position.x,
        lightMesh.position.y,
        lightMesh.position.z);

    uniforms.pointLightPosition2.value = new THREE.Vector3(lightMesh2.position.x,
        lightMesh.position.y,
        lightMesh.position.z);

    uniforms.pointLightPosition3.value = new THREE.Vector3(lightMesh3.position.x,
        lightMesh.position.y,
        lightMesh.position.z);

    uniforms.clight.value = new THREE.Vector3(
        lightParameters.red * lightParameters.intensity,
        lightParameters.green * lightParameters.intensity,
        lightParameters.blue * lightParameters.intensity);

    uniforms.ambientLight.value = new THREE.Vector3(
        ambientLightParameters.red * ambientLightParameters.intensity,
        ambientLightParameters.green * ambientLightParameters.intensity,
        ambientLightParameters.blue * ambientLightParameters.intensity);

    material.name = name;

    mats.push(material);

    return material;
}


function exportGLTF() {
    let gltfExporter = new THREE.GLTFExporter();

    let options = {
        trs: false,
        onlyVisible: false,
        truncateDrawRange: true,
        binary: false,
        forcePowerOfTwoTextures: false,
        maxTextureSize: 4096
    };

    gltfExporter.parse(scene, function (result) {
        if (result instanceof ArrayBuffer) {
            saveArrayBuffer(result, 'dreamcaster-' + date.getTime() + '.glb');

        } else {
            let output = JSON.stringify(result, null, 2);
            //console.log(output);
            saveString(output, 'dreamcaster-' + date.getTime() + '.gltf');
        }
    }, options);
}

function saveString(text, filename) {
    save(new Blob([text], { type: 'text/plain' }), filename);
}

function save(blob, filename) {
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}


// function setMaterial(mesh, material) {
//     mesh.material = material;
//     for (let i = 0; i < mesh.children.length; i++) {
//         mesh.children[i].material = material;
//     }
// }

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

//Set position increments
let dx = 0.1;
let dy = 0.01;
let dz = 0.01;
let zoomAlpha = 0;
let zoomIn = true;
let zoomInTarget = 10;

function Update() {

    // strat.rotation.y -= 0.005;
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    // Initial camera animation
    camera.updateProjectionMatrix();

    // if (zoomIn) {
    //     camera.position.x += dx;
    //     camera.position.y += dy;
    //     zoomAlpha += dz;
    //     camera.position.z = THREE.Math.lerp(1, zoomInTarget, THREE.Math.smoothstep(zoomAlpha, 1, 0));
    //     camera.updateProjectionMatrix();
    // }

    // if (zoomIn && camera.position.z >= zoomInTarget) {
    //     zoomIn = false;
    // }

    const delta = clock.getDelta();

    uniformsPsychedelic["time"].value += delta * 5;
    uniformsPsychedelic["time"].value = clock.elapsedTime;


    requestAnimationFrame(Update);
    controls.update();
    stats.update();
    Render();
}

function Render() {
    renderer.render(scene, camera);
}


// -----------------------------------------------
// Aux functions
// -----------------------------------------------

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function applyRecursive(group, func) {
    group.children.forEach((child) => {
        if (child) {
            applyRecursive(child, func);
            func(child);
        }
    });
}

function setMaterials() {
    for (let i = 0; i < strat.children.length; i++) {
        let c = strat.children[i];
        // console.log(c.name);
        // console.log(materials[c.name].defaultMaterial.name);
        setMaterial(c, materials[c.name].defaultMaterial);
    }
}

function setMaterial(group, material) {
    group.material = material;
    applyRecursive(group, (child) => { child.material = material });
}

function getMaterialByName(name) {
    return mats.find(obj => obj.name === name);
}

function getGroup(name) {
    return scene.getObjectByName(name);
}

function createGUI() {
    let sidebar = $('#sidebar ul');
    let keys = Object.keys(materials);
    for (let i = 0; i < keys.length; i++) {
        let group = getGroup(keys[i]);
        let html_group = '<li class="group">'
            + '<div class="group-button">'
            + '<span class="group-label">' + group.name + '</span> <span class="group-set-material-label">' + group.material.name + '</span>'
            + '</div>'
            + '<div class="material-panel">';
        for (let j = 0; j < materials[group.name].availableMaterials.length; j++) {
            let m = materials[group.name].availableMaterials[j];
            html_group += '<div class="material ' + ((group.material.name === m.name) ? "set" : "") + '">'
                + '<div class="material-preview"><img src="images/material-previews/' + m.name + '.jpg" alt = "' + m.name + '" >'
                + '</div>'
                + ' <span class="material-label">' + m.name + '</span>'
                + '</div>';
        }

        html_group += '</div>'
            + '</li>';
        sidebar.append(html_group);
        igniteGUI();
    }
}

function loadCubeMap(path) {
    // load cube map for background
    var loader = new THREE.CubeTextureLoader();
    loader.setPath('textures/cubemaps/' + path + "/");

    var textureCube = loader.load([
        'px.jpg', 'nx.jpg',
        'py.jpg', 'ny.jpg',
        'pz.jpg', 'nz.jpg'
    ]);
    return textureCube;
}

function loadTexture(file) {
    var texture = new THREE.TextureLoader().load(file, function (texture) {
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.needsUpdate = true;
    })
    return texture;
}

function pageLoaded() {
    $(".loading_page").addClass("loaded");
}
