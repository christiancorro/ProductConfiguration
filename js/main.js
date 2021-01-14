// Scene
let scene, camera, renderer, controls;
let bgColor = new THREE.Color(0xFCF1E8);
let strat;
let world = new THREE.Group();

// Camera
let fov = 60,
    aspectRatio = window.innerWidth / window.innerHeight,
    near = 0.1,
    far = 500;

// Loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new THREE.GLTFLoader();

gltfLoader.load('models/stratocaster/stratocaster.gltf', function (gltf) {

    strat = gltf.scene;
    strat.rotation.y = Math.PI / 10;
    strat.position.set(0, 0, 0);
    world.add(strat);

    Start();
    Update();

});

const DEFAULT_CAMERA_POSITION_X = 0,
    DEFAULT_CAMERA_POSITION_Y = 0.3,
    DEFAULT_CAMERA_POSITION_Z = 4;

// -----------------------------------------------
// START
// -----------------------------------------------

let clock;

let uniforms = {
    "time": { value: 1.0 }
};

let materials;

function Start() {

    // createGUI();

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(bgColor, far / 3, far * 2);

    camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(bgColor);
    document.body.appendChild(renderer.domElement);

    camera.position.set(DEFAULT_CAMERA_POSITION_X, DEFAULT_CAMERA_POSITION_Y, DEFAULT_CAMERA_POSITION_Z);
    camera.lookAt(new THREE.Vector3(0, 0.4, 0));

    params = {

    };


    let planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 32, 32);
    let wireMaterial = new THREE.MeshBasicMaterial({ color: 0xbababa, wireframe: true });


    plane = new THREE.Mesh(planeGeometry, wireMaterial);
    plane.position.set(0, -0.1, 0);
    plane.rotation.x = Math.PI / 2;


    // world.add(plane);
    scene.add(world);


    let plastics = scene.getObjectByName("body");
    let matte = new THREE.MeshBasicMaterial({ color: 0x0000FF });

    materials = {
        "gruppo1": [matte, wireMaterial]
    }

    const material = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent

    });


    plastics.material = material;
    for (let i = 0; i < plastics.children.length; i++) {
        let c = plastics.children[i];

        c.material = material;
    }

    // Lights
    addLight(0.3, -50, 100, 10);
    addLight(0.2, 0, 1, 2);
    // addLight(0.5, -1, 1, -2);
    // addLight(10, 10, 2);

    ambientLight = new THREE.AmbientLight(0xffffff, params.ambientLightIntensity); // white light
    scene.add(ambientLight);

    // Stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    // Axes
    // let axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);


    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    // controls.maxPolarAngle = Math.PI / 2;
    // controls.minPolarAngle = Math.PI * 0.05;
    controls.enableKeys = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

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

function setMaterial(mesh, material) {
    mesh.material = material;
    for (let i = 0; i < mesh.children.length; i++) {
        mesh.children[i].material = material;
    }
}

//Set position increments
let dx = 0.1;
let dy = 0.01;
let dz = 0.01;
let zoomAlpha = 0;
let zoomIn = true;
let zoomInTarget = 10;

function Update() {

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

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
