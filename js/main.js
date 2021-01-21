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
    // strat.rotation.y = -Math.PI / 12;    
    strat.rotation.z = -Math.PI / 6;
    // strat.rotation.x = Math.PI / 32;
    strat.position.set(0, 0, 0);
    world.add(strat);

    Start();
    Update();

});

const DEFAULT_CAMERA_POSITION_X = 0,
    DEFAULT_CAMERA_POSITION_Y = 0,
    DEFAULT_CAMERA_POSITION_Z = 4;

// -----------------------------------------------
// START
// -----------------------------------------------

let clock;

let uniforms = {
    "time": { value: 1.0 }
};


let mats = [];

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

    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1.2;
    // this.renderer.toneMappingWhitePoint = 1.0;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // document.body.appendChild(renderer.domElement);

    camera.position.set(DEFAULT_CAMERA_POSITION_X, DEFAULT_CAMERA_POSITION_Y, DEFAULT_CAMERA_POSITION_Z);
    camera.lookAt(new THREE.Vector3(0, 0.4, 0));

    params = {

    };


    let planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 32, 32);
    let wireMaterial = new THREE.MeshBasicMaterial({ color: 0xbababa, wireframe: true });
    wireMaterial.name = "Wired"

    plane = new THREE.Mesh(planeGeometry, wireMaterial);
    plane.position.set(0, -0.1, 0);
    plane.rotation.x = Math.PI / 2;


    // world.add(plane);
    scene.add(world);
    scene.background = envMap;
    scene.environment = envMap;


    let plastic_red = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    plastic_red.name = "Red plastic";

    let plastic_black = new THREE.MeshBasicMaterial({ color: 0x000000 });
    plastic_black.name = "Black plastic";

    let materialPsychedelic = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertex_psychedelic').textContent,
        fragmentShader: document.getElementById('fragment_psychedelic').textContent

    });
    materialPsychedelic.name = "Psychedelic";

    //TODO: capire quali normali mandare

    // let normalMap = loadTexture("../textures/materials/wood/wood_normal.jpg");
    let diffuseMap = loadTexture("../textures/materials/wood/wood_col.jpg");
    let roughnessMap = loadTexture("../textures/materials/wood/wood_rough.jpg");
    let roughnessMapPlastic = loadTexture("../textures/materials/plastic/Plastic006_1K_Roughness.jpg");
    let roughnessMapMetal = loadTexture("../textures/materials/metal/Metal032_1K_Roughness.jpg");
    let normalMap = loadTexture("../textures/materials/wood/wood_normal.jpg");
    let normalMapMetal = loadTexture("../textures/materials/metal/Metal032_1K_Normal.jpg");
    let normalMapPlastic = loadTexture("../textures/materials/plastic/Plastic006_1K_Normal.jpg");

    // let diffuseMapBronzo = loadTexture("../textures/materials/wood/wood_spec.jpg");
    // let specularMapBronzo = loadTexture("../.jpg");
    // let roughnessMapBronzo = loadTexture("textures/materials/bronzo_rgh.jpg");

    let materialExtensions = {
        derivatives: true,
        shaderTextureLOD: true // set to use shader texture LOD
    };

    let cspecgold = {
        red: 1.022,
        green: 0.782,
        blue: 0.344
    };


    let cdiffpl = {
        red: 1,
        green: 1,
        blue: 1
    };


    let uniforms_glossy = {
        cspec: { type: "v3", value: new THREE.Vector3(0.8, 0.8, 0.8) },
        normalMap: { type: "t", value: normalMap },
        normalScale: { type: "v2", value: new THREE.Vector2(1, 1) },
        envMap: { type: "t", value: envMap },
        roughness: { type: "f", value: 0.5 },
    };


    let glossy = new THREE.ShaderMaterial({
        uniforms: uniforms_glossy,
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs_metal').textContent,
        extensions: materialExtensions

    });


    //parametri di illuminazione
    var lightParameters = {
        red: 1.0,
        green: 1.0,
        blue: 0.8,
        intensity: 1,
    };
    var lightParameters2 = {
        red: 1,
        green: 1.0,
        blue: 0.8,
        intensity: 0.4,
    };
    var lightParameters3 = {
        red: 1.0,
        green: 1.0,
        blue: 1.0,
        intensity: 0.2,
    };

    let cl = new THREE.Vector3(
        lightParameters.red * lightParameters.intensity,
        lightParameters.green * lightParameters.intensity,
        lightParameters.blue * lightParameters.intensity
    );
    let cl2 = new THREE.Vector3(
        lightParameters2.red * lightParameters2.intensity,
        lightParameters2.green * lightParameters2.intensity,
        lightParameters2.blue * lightParameters2.intensity
    );
    let cl3 = new THREE.Vector3(
        lightParameters3.red * lightParameters3.intensity,
        lightParameters3.green * lightParameters3.intensity,
        lightParameters3.blue * lightParameters3.intensity
    );

    var ambientLightParameters = {
        red: 0.2,
        green: 0.2,
        blue: 0.15,
        intensity: 0.1,
    };


    let unifrom_wood = {
        diffuseMap: { type: "t", value: diffuseMap },
        roughnessMap: { type: "t", value: roughnessMap },
        cspec: { type: "v3", value: new THREE.Vector3(0.04, 0.04, 0.04) },
        cdiff: { type: "v3", value: new THREE.Vector3(0.5, 0.5, 0.5) },

        normalMap: { type: "t", value: normalMap },
        normalScale: { type: "v2", value: new THREE.Vector2(1, 1) },

        irradianceMap: { type: "t", value: irradianceMap },

        textureRepeat: { type: "v2", value: new THREE.Vector2(1, 1) },

        envMap: { type: "t", value: envMap },

        pointLightPosition: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition2: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition3: { type: "v3", value: new THREE.Vector3() },
        ambientLight: { type: "v3", value: new THREE.Vector3() },

        clight: { type: 'v3', value: cl },
        clight2: { type: 'v3', value: cl2 },
        clight3: { type: 'v3', value: cl3 }
    };

    let wood = new THREE.ShaderMaterial({
        uniforms: unifrom_wood,
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs_texture').textContent,
        extensions: materialExtensions
    });


    unifrom_wood.clight.value = new THREE.Vector3(
        lightParameters.red * lightParameters.intensity,
        lightParameters.green * lightParameters.intensity,
        lightParameters.blue * lightParameters.intensity);

    unifrom_wood.ambientLight.value = new THREE.Vector3(
        ambientLightParameters.red * ambientLightParameters.intensity,
        ambientLightParameters.green * ambientLightParameters.intensity,
        ambientLightParameters.blue * ambientLightParameters.intensity);

    //prima luce leggermente gialla da interno
    lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(lightParameters.red, lightParameters.green, lightParameters.blue) }));
    lightMesh.position.set(23, -5, 30);

    scene.add(lightMesh);

    //seconda luce non casta om bra per non creare confusione dato che arriva dalla stessa direzione della prima
    lightMesh2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(lightParameters2.red, lightParameters2.green, lightParameters2.blue) }));
    lightMesh2.position.set(-30, -10, -40);

    scene.add(lightMesh2);

    //terza luce proveniente dall'esterno, bianca come luce solare
    lightMesh3 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(lightParameters3.red, lightParameters3.green, lightParameters3.blue) }));
    lightMesh3.position.set(40, -10, -30);
    scene.add(lightMesh3);

    unifrom_wood.pointLightPosition.value = new THREE.Vector3(lightMesh.position.x,
        lightMesh.position.y,
        lightMesh.position.z);

    unifrom_wood.pointLightPosition2.value = new THREE.Vector3(lightMesh2.position.x,
        lightMesh.position.y,
        lightMesh.position.z);

    unifrom_wood.pointLightPosition3.value = new THREE.Vector3(lightMesh3.position.x,
        lightMesh.position.y,
        lightMesh.position.z);



    let uniformsMetal = {
        cspec: { type: "v3", value: new THREE.Vector3(0.8, 0.8, 0.8) },
        roughness: { type: "f", value: 0 },

        normalMap: { type: "t", value: normalMapMetal },
        normalScale: { type: "v2", value: new THREE.Vector2(0.1, 0.1) },

        envMap: { type: "t", value: envMap },

        pointLightPosition: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition2: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition3: { type: "v3", value: new THREE.Vector3() },

        clight: { type: 'v3', value: cl },
        clight2: { type: 'v3', value: cl2 },
        clight3: { type: 'v3', value: cl3 }
    };

    uniformsMetal.cspec.value = new THREE.Vector3(
        cspecgold.red,
        cspecgold.green,
        cspecgold.blue
    );

    let metal = new THREE.ShaderMaterial({
        uniforms: uniformsMetal,
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs_metal').textContent,
        extensions: materialExtensions
    });

    let uniformsPlastic = {
        roughnessMap: { type: "t", value: roughnessMapPlastic },
        cspec: { type: "v3", value: new THREE.Vector3(0.04, 0.04, 0.04) },

        cdiff: { type: "v3", value: new THREE.Vector3(0.5, 0.5, 0.5) },

        normalMap: { type: "t", value: normalMapPlastic },
        normalScale: { type: "v2", value: new THREE.Vector2(0.1, 0.1) },

        irradianceMap: { type: "t", value: irradianceMap },
        envMap: { type: "t", value: envMap },

        pointLightPosition: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition2: { type: "v3", value: new THREE.Vector3() },
        pointLightPosition3: { type: "v3", value: new THREE.Vector3() },

        ambientLight: { type: "v3", value: new THREE.Vector3() },


        clight: { type: 'v3', value: cl },
        clight2: { type: 'v3', value: cl2 },
        clight3: { type: 'v3', value: cl3 }
    };

    uniformsPlastic.cdiff.value = new THREE.Vector3(
        cdiffpl.red,
        cdiffpl.green,
        cdiffpl.blue
    );

    uniformsPlastic.ambientLight.value = new THREE.Vector3(
        ambientLightParameters.red * ambientLightParameters.intensity,
        ambientLightParameters.green * ambientLightParameters.intensity,
        ambientLightParameters.blue * ambientLightParameters.intensity);

    uniformsPlastic.pointLightPosition.value = new THREE.Vector3(lightMesh.position.x,
        lightMesh.position.y,
        lightMesh.position.z);

    uniformsPlastic.pointLightPosition2.value = new THREE.Vector3(lightMesh2.position.x,
        lightMesh.position.y,
        lightMesh.position.z);

    uniformsPlastic.pointLightPosition3.value = new THREE.Vector3(lightMesh3.position.x,
        lightMesh.position.y,
        lightMesh.position.z);



    let white_plastic = new THREE.ShaderMaterial({
        uniforms: uniformsPlastic,
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs_plastic').textContent,
        extensions: materialExtensions
    });

    white_plastic.name = "White plastic";

    wood.name = "Wood";
    metal.name = "Metal";


    mats.push(plastic_red);
    mats.push(glossy);
    mats.push(white_plastic);
    mats.push(plastic_black);
    mats.push(wireMaterial);
    mats.push(wood);
    mats.push(metal);
    mats.push(materialPsychedelic);


    materials = {
        "body": {
            "defaultMaterial": wood,
            "availableMaterials": [metal, wood, materialPsychedelic, plastic_red, white_plastic, plastic_black, wireMaterial]
        },
        "pickguard": {
            "defaultMaterial": white_plastic,
            "availableMaterials": [metal, wood, materialPsychedelic, plastic_red, plastic_black, wireMaterial, white_plastic]
        },
        "frets": {
            "defaultMaterial": metal,
            "availableMaterials": [metal, wood, plastic_red, white_plastic, plastic_black, materialPsychedelic, wireMaterial]
        },
        "fret-markers": {
            "defaultMaterial": white_plastic,
            "availableMaterials": [metal, wood, plastic_red, white_plastic, plastic_black, wireMaterial]
        },
        "metals": {
            "defaultMaterial": metal,
            "availableMaterials": [metal, wood, white_plastic, plastic_red, plastic_black, wireMaterial, materialPsychedelic]
        },
        "head": {
            "defaultMaterial": metal,
            "availableMaterials": [wood, materialPsychedelic, plastic_black, plastic_red, wireMaterial]
        },
        "logo": {
            "defaultMaterial": plastic_black,
            "availableMaterials": [metal, wood, white_plastic, plastic_red, plastic_black, wireMaterial]
        },
        "neck": {
            "defaultMaterial": metal,
            "availableMaterials": [metal, wood, materialPsychedelic, plastic_red, plastic_black, wireMaterial]
        },
        "knobs-text": {
            "defaultMaterial": white_plastic,
            "availableMaterials": [wood, materialPsychedelic, plastic_red, wireMaterial, white_plastic, plastic_black]
        },
        "plastics": {
            "defaultMaterial": white_plastic,
            "availableMaterials": [metal, materialPsychedelic, white_plastic, plastic_red, plastic_black, wireMaterial]
        },
        "strings": {
            "defaultMaterial": metal,
            "availableMaterials": [metal, materialPsychedelic, white_plastic, plastic_red, wireMaterial]
        }
    }


    // for (let i = 0; i < plastics.children.length; i++) {
    //     let c = plastics.children[i];

    //     c.material = material;
    // }

    let body = getGroup("root");
    setMaterial(body, materialPsychedelic);
    setMaterial(getGroup("pickguard"), new THREE.LineDashedMaterial({ color: 0xFFF1F1 }));


    setMaterials();
    createGUI();


    // Lights
    // addLight(0.3, -50, 100, 10);
    // addLight(0.2, 0, 1, 2);
    // addLight(0.5, -1, 1, -2);
    // addLight(10, 10, 2);

    ambientLight = new THREE.AmbientLight(0xffffff, params.ambientLightIntensity); // white light
    scene.add(ambientLight);

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

    gltfExporter.parse(world, function (result) {
        if (result instanceof ArrayBuffer) {
            saveArrayBuffer(result, 'sculpture-' + date.getTime() + '.glb');

        } else {
            let output = JSON.stringify(result, null, 2);
            //console.log(output);
            saveString(output, 'sculpture-' + date.getTime() + '.gltf');
        }
    }, options);
}

function saveString(text, filename) {
    save(new Blob([text], { type: 'text/plain' }), filename);
}
function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
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

    uniforms["time"].value += delta * 5;
    uniforms["time"].value = clock.elapsedTime;


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

function getMaterialByName(name) { // TODO: DA SISTEMARE!
    return mats.find(obj => obj.name === name);
}

function getGroup(name) {
    return scene.getObjectByName(name);
}

function createGUI() {
    let sidebar = $('#sidebar ul');
    for (let i = 0; i < strat.children.length; i++) {
        let c = strat.children[i];
        let HTMLGroup = '<li class="group">'
            + '<div class="group-button">'
            + '<span class="group-label">' + c.name + '</span> <span class="group-set-material-label">' + c.material.name + '</span>'
            + '</div>'
            + '<div class="material-panel">';
        for (let j = 0; j < materials[c.name].availableMaterials.length; j++) {
            let m = materials[c.name].availableMaterials[j];
            HTMLGroup += '<div class="material ' + ((c.material.name === m.name) ? "set" : "") + '">'
                + '<div class="material-preview"><img src="images/material-previews/' + m.name + '.png" alt = "' + m.name + '" >'
                + '</div>'
                + ' <span class="material-label">' + m.name + '</span>'
                + '</div>';
        }

        HTMLGroup += '</div>'
            + '</li>';
        sidebar.append(HTMLGroup);
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
