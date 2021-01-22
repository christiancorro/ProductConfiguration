//TODO: REFACTORING
//TODO: funzione per istanziazione dei materiali
//TODO: aggiungere alla gui funzione di prezzo e acquisto 
//TODO: aggiungere bloom (?) per la lode
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

let irradianceMap = loadCubeMap("irradiance_map");

gltfLoader.load('models/stratocaster/stratocaster.gltf', function (gltf) {

    strat = gltf.scene.children[0];
    // strat.rotation.y = -Math.PI / 2;
    strat.rotation.z = -Math.PI / 2;
    strat.rotation.x = 4 * (Math.PI / 180);
    strat.position.set(0, 0, 0);
    world.add(strat);

    Start();
    Update();

});

const DEFAULT_CAMERA_POSITION_X = 0,
    DEFAULT_CAMERA_POSITION_Y = 0,
    DEFAULT_CAMERA_POSITION_Z = 2.8;

// -----------------------------------------------
// START
// -----------------------------------------------

let clock;

let materialExtensions = {
    derivatives: true,
    shaderTextureLOD: true // set to use shader texture LOD
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
    renderer.toneMappingExposure = 1;
    // this.renderer.toneMappingWhitePoint = 1.0;
    // renderer.outputEncoding = THREE.sRGBEncoding;

    camera.position.set(DEFAULT_CAMERA_POSITION_X, DEFAULT_CAMERA_POSITION_Y, DEFAULT_CAMERA_POSITION_Z);
    camera.lookAt(new THREE.Vector3(0, 0.4, 0));

    let planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 32, 32);
    let wireMaterial = new THREE.MeshBasicMaterial({ color: 0x999999, wireframe: true });
    wireMaterial.name = "Wireframe";

    plane = new THREE.Mesh(planeGeometry, wireMaterial);
    plane.position.set(0, -0.1, 0);
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

    // let normalMap = loadTexture("textures/materials/wood/wood_normal.jpg");
    let diffuseMapWood = loadTexture("textures/materials/wood/wood_col.jpg");
    let roughnessMapWood = loadTexture("textures/materials/wood/wood_rough.jpg");
    let roughnessMapPlastic = loadTexture("textures/materials/plastic/Plastic006_1K_Roughness.jpg");
    let roughnessMapMetal = loadTexture("textures/materials/metal/Metal032_1K_Roughness.jpg");
    let normalMapWood = loadTexture("textures/materials/wood/wood_normal.jpg");
    let normalMapMetal = loadTexture("textures/materials/metal/Metal032_1K_Normal.jpg");
    let normalMapPlastic = loadTexture("textures/materials/plastic/Plastic006_1K_Normal.jpg");

    // let diffuseMapBronzo = loadTexture("textures/materials/wood/wood_spec.jpg");
    // let specularMapBronzo = loadTexture(".jpg");
    // let roughnessMapBronzo = loadTexture("textures/materials/bronzo_rgh.jpg");



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

    let cdiff_plastic_white = {
        red: 1,
        green: 1,
        blue: 1
    };

    let cdiff_plastic_black = {
        red: 0,
        green: 0,
        blue: 0
    };

    let cdiff_plastic_red = {
        red: 1,
        green: 0.001,
        blue: 0.001
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
        blue: 0.8,
        intensity: 1.2,
    };
    lightParameters2 = {
        red: 1,
        green: 1.0,
        blue: 0.9,
        intensity: 0.35,
    };
    lightParameters3 = {
        red: 1.0,
        green: 1.0,
        blue: 0.8,
        intensity: 1.6,
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

    //prima luce leggermente gialla da interno
    lightMesh = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(lightParameters.red, lightParameters.green, lightParameters.blue) }));
    lightMesh.position.set(33, 80, 80);

    // scene.add(lightMesh);

    //seconda luce non casta om bra per non creare confusione dato che arriva dalla stessa direzione della prima
    lightMesh2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(lightParameters2.red, lightParameters2.green, lightParameters2.blue) }));
    lightMesh2.position.set(-30, 1, -40);

    // scene.add(lightMesh2);

    //terza luce proveniente dall'esterno, bianca come luce solare
    lightMesh3 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(lightParameters3.red, lightParameters3.green, lightParameters3.blue) }));
    lightMesh3.position.set(40, 10, -30);
    // scene.add(lightMesh3);


    let wood = createMaterialTexture("Wood", diffuseMapWood, roughnessMapWood, normalMapWood, 1, 1);

    let silver = createMaterialMetal("Silver", cspec_silver, 0.1, normalMapMetal, 0.1);
    let copper = createMaterialMetal("Copper", cspec_copper, 0.1, normalMapMetal, 1);
    let gold = createMaterialMetal("Gold", cspec_gold, 0.1, normalMapMetal, 0.2);

    let plastic_white = createMaterialPlastic("White plastic", cdiff_plastic_white, 0.5, normalMapPlastic, 3);

    let plastic_red = createMaterialPlastic("Red plastic", cdiff_plastic_red, 0.5, normalMapPlastic, 4);

    let plastic_black = createMaterialPlastic("Black plastic", cdiff_plastic_black, 0.5, normalMapPlastic, 4);


    mats.push(plastic_red);
    mats.push(plastic_black);
    mats.push(wireMaterial);
    mats.push(materialPsychedelic);


    materials = {
        "head": {
            "defaultMaterial": gold,
            "availableMaterials": [wood, materialPsychedelic, plastic_black, plastic_red, wireMaterial]
        },
        "logo": {
            "defaultMaterial": plastic_black,
            "availableMaterials": [gold, wood, plastic_white, plastic_red, plastic_black, wireMaterial]
        },
        "neck": {
            "defaultMaterial": gold,
            "availableMaterials": [gold, wood, materialPsychedelic, plastic_red, plastic_black, wireMaterial]
        },
        "strings": {
            "defaultMaterial": gold,
            "availableMaterials": [gold, materialPsychedelic, plastic_white, plastic_red, wireMaterial]
        },
        "frets": {
            "defaultMaterial": gold,
            "availableMaterials": [gold, wood, plastic_red, plastic_white, plastic_black, materialPsychedelic, wireMaterial]
        },
        "fret-markers": {
            "defaultMaterial": plastic_white,
            "availableMaterials": [gold, wood, plastic_red, plastic_white, plastic_black, wireMaterial]
        },
        "body": {
            "defaultMaterial": wood,
            "availableMaterials": [wood, gold, silver, copper, materialPsychedelic, plastic_red, plastic_white, plastic_black, wireMaterial]
        },
        "pickguard": {
            "defaultMaterial": silver,
            "availableMaterials": [gold, silver, copper, wood, materialPsychedelic, plastic_red, plastic_black, wireMaterial, plastic_white]
        },
        "metals": {
            "defaultMaterial": gold,
            "availableMaterials": [gold, wood, plastic_white, plastic_red, plastic_black, wireMaterial, materialPsychedelic]
        },
        "plastics": {
            "defaultMaterial": plastic_white,
            "availableMaterials": [gold, materialPsychedelic, plastic_white, plastic_red, plastic_black, wireMaterial]
        },
        "knobs-text": {
            "defaultMaterial": plastic_white,
            "availableMaterials": [wood, materialPsychedelic, plastic_red, wireMaterial, plastic_white, plastic_black]
        }
    }


    // for (let i = 0; i < plastics.children.length; i++) {
    //     let c = plastics.children[i];

    //     c.material = material;
    // }

    setMaterials();
    createGUI();


    // Lights
    // addLight(0.3, -50, 100, 10);
    // addLight(0.2, 0, 1, 2);
    // addLight(0.5, -1, 1, -2);
    // addLight(10, 10, 2);


    // Stats
    stats = new Stats();
    stats.domElement.classList.add("stats");
    document.body.appendChild(stats.domElement);

    // Axes
    // let axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);


    // Controls
    // controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.rotateSpeed = 4;
    controls.minDistance = 0.1;
    controls.maxDistance = 5;
    controls.enableDamping = true;
    // controls.enablePan = false;
    controls.dampingFactor = 0.2;
    // controls.maxPolarAngle = Math.PI / 2;
    // controls.minPolarAngle = Math.PI * 0.05;
    controls.enableKeys = true;

    // Now, please, go

}

function createMaterialMetal(name, cspec, roughness, normalMap, normalScale) {
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

function createMaterialPlastic(name, cdiff, roughness, normalMap, normalScale) {

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

function createMaterialTexture(name, diffuseMap, roughnessMap, normalMap, normalScale, textureRepeat) {
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
                + '<div class="material-preview"><img src="images/material-previews/' + m.name + '.png" alt = "' + m.name + '" >'
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
        'px.png', 'nx.png',
        'py.png', 'ny.png',
        'pz.png', 'nz.png'
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
