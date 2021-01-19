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

gltfLoader.load('models/stratocaster/stratocaster.gltf', function (gltf) {

    strat = gltf.scene.children[0];
    strat.rotation.y = -Math.PI / 10;
    strat.rotation.z = -Math.PI / 16;
    strat.position.set(0.2, 0, 0);
    world.add(strat);

    Start();
    Update();

});

const DEFAULT_CAMERA_POSITION_X = 0,
    DEFAULT_CAMERA_POSITION_Y = 0,
    DEFAULT_CAMERA_POSITION_Z = 4.2;

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



    let plastic_red = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    plastic_red.name = "Red plastic";

    let plastic_white = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    plastic_white.name = "White plastic";

    let plastic_black = new THREE.MeshBasicMaterial({ color: 0x000000 });
    plastic_black.name = "Black plastic";

    let material = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent

    });

    material.name = "Psychedelic";


    mats.push(plastic_red);
    mats.push(plastic_white);
    mats.push(plastic_black);
    mats.push(wireMaterial);
    mats.push(material);


    materials = {
        "body": {
            "defaultMaterial": material,
            "availableMaterials": [material, plastic_red, plastic_white, plastic_black]
        },
        "pickguard": {
            "defaultMaterial": plastic_white,
            "availableMaterials": [material, plastic_red, plastic_black, wireMaterial, plastic_white]
        },
        "frets": {
            "defaultMaterial": plastic_black,
            "availableMaterials": [plastic_red, plastic_white, plastic_black, material]
        },
        "fret-markers": {
            "defaultMaterial": plastic_white,
            "availableMaterials": [plastic_red, plastic_white, wireMaterial]
        },
        "metals": {
            "defaultMaterial": material,
            "availableMaterials": [plastic_red, wireMaterial, material]
        },
        "head": {
            "defaultMaterial": material,
            "availableMaterials": [material, plastic_red, wireMaterial]
        },
        "logo": {
            "defaultMaterial": plastic_black,
            "availableMaterials": [plastic_white, plastic_red, plastic_black, wireMaterial]
        },
        "neck": {
            "defaultMaterial": material,
            "availableMaterials": [material, plastic_red, wireMaterial]
        },
        "knobs-text": {
            "defaultMaterial": plastic_white,
            "availableMaterials": [material, plastic_red, wireMaterial, plastic_white]
        },
        "plastics": {
            "defaultMaterial": material,
            "availableMaterials": [material, plastic_red, wireMaterial]
        },
        "strings": {
            "defaultMaterial": plastic_white,
            "availableMaterials": [material, plastic_white, plastic_red, wireMaterial]
        }
    }


    // for (let i = 0; i < plastics.children.length; i++) {
    //     let c = plastics.children[i];

    //     c.material = material;
    // }

    let body = getGroup("root");
    setMaterial(body, material);
    setMaterial(getGroup("pickguard"), new THREE.LineDashedMaterial({ color: 0xFFF1F1 }));


    setMaterials();
    createGUI();


    // Lights
    addLight(0.3, -50, 100, 10);
    addLight(0.2, 0, 1, 2);
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
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 4;
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.2;
    // // controls.maxPolarAngle = Math.PI / 2;
    // // controls.minPolarAngle = Math.PI * 0.05;
    // controls.enableKeys = false;
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.1;

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

function addLight(intensity, ...pos) {
    const color = 0xFFFFFF;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
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
        console.log(c.name);
        console.log(materials[c.name].defaultMaterial.name);
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
