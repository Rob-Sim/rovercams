const canvasCont = document.getElementById("canvasCont")

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05352d);
const camera = new THREE.PerspectiveCamera( 75, canvasCont.clientWidth / canvasCont.clientHeight, 0.1, 30 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasCont.clientWidth, canvasCont.clientHeight);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize(){
    camera.aspect = canvasCont.clientWidth / canvasCont.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasCont.clientWidth, canvasCont.clientHeight);
}

canvasCont.appendChild( renderer.domElement );

const light = new THREE.DirectionalLight(0xffffff, .8)
light.position.y = 10
light.position.x = 2
scene.add(light)
light.castShadow = true

var hemiLight = new THREE.HemisphereLight( 0x999999, 0x9F6D32, .8 );
scene.add( hemiLight );

var ambLight = new THREE.AmbientLight(0xffffff, 0.05)
scene.add(ambLight)

function modelLoad(rover = "curiosity"){
    //Opportunity and spirit have the same model
    if(rover == "Opportunity"){ rover = "Spirit"}
    if(scene.getObjectByName("roverMod")){scene.remove(scene.getObjectByName("roverMod"))}

    const loader = new THREE.GLTFLoader();
    loader.load(("models/" + rover + '.glb'), 
        function(gltf){
            gltf.scene.name = "roverMod"
            gltf.scene.position.y -= 1
	        scene.add(gltf.scene);
        }, undefined,
        function (error) {
	        console.error(error);
        }
    );
}

var geometry = new THREE.CircleGeometry( 5, 32 );
var material = new THREE.MeshStandardMaterial( { 
    color: 0x998747,
    metalness: .5,
    roughness: .5,
    wireframe: true
} );

var floor = new THREE.Mesh( geometry, material );
floor.position.y -= 1
floor.rotation.x -= Math.PI / 2
scene.add( floor ); 



const controls = new THREE.OrbitControls( camera, renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( -2, 0, 3 );
controls.update();

function animate() {
	requestAnimationFrame( animate );
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}
animate()