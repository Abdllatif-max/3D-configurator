import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Import GLTFLoader

// Scene Information
const BACKGROUND_COLOR = 0xffffff;
const LIGHT_INTENSITY = 1;
const LIGHT_DISTANCE = 100;

// Camera Information
const CAMERA_LOOK_AT = { x: 0, y: 1, z: 0 };
const CAMERA_POSITION = { x: -0.07, y: 3.741, z: 4.473 };

// Model Information
const MODEL_URL = 'assets/models/SousMaillot.gltf';
const MODEL_SETUP = { x: 0, y: -2, z: 0, scale: 1, };

let model;

// Variables to store the state of the mouse
let isMouseDown = false;
let mouseDownPosition = null;


document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('app');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(BACKGROUND_COLOR, 1);
    const controls = new OrbitControls(camera, renderer.domElement);

    // Adding Lights
    const lights = createLights(scene, LIGHT_INTENSITY, LIGHT_DISTANCE);

    // ...

    function init(){
        whenInitializationStart();

        // Setup camera
        seutp_camera(new THREE.Vector3(CAMERA_LOOK_AT.x, CAMERA_LOOK_AT.y, CAMERA_LOOK_AT.z), CAMERA_POSITION);

        // Add grids helpers
        addGridsHelpers();

        // load the model
        loadModel(MODEL_URL);


        // ...


        whenInitializationComplet();
    }


    /* START FUNCTIONS HELPERS */
    function createLights(scene, intensity, distance) {
        // Direction vector multiplier to position lights based on the 'distance'
        const d = distance;
    
        // Front light
        const lightFront = new THREE.DirectionalLight(0xffffff, intensity);
        lightFront.position.set(0, 0, d);
        lightFront.target.position.set(0, 0, 0);
        scene.add(lightFront);
        scene.add(lightFront.target);
    
        // Back light
        const lightBack = new THREE.DirectionalLight(0xffffff, intensity);
        lightBack.position.set(0, 0, -d);
        lightBack.target.position.set(0, 0, 0);
        scene.add(lightBack);
        scene.add(lightBack.target);
    
        // Right light
        const lightRight = new THREE.DirectionalLight(0xffffff, intensity);
        lightRight.position.set(d, 0, 0);
        lightRight.target.position.set(0, 0, 0);
        scene.add(lightRight);
        scene.add(lightRight.target);
    
        // Left light
        const lightLeft = new THREE.DirectionalLight(0xffffff, intensity);
        lightLeft.position.set(-d, 0, 0);
        lightLeft.target.position.set(0, 0, 0);
        scene.add(lightLeft);
        scene.add(lightLeft.target);
    
        // Top light
        const lightTop = new THREE.DirectionalLight(0xffffff, intensity);
        lightTop.position.set(0, d, 0);
        lightTop.target.position.set(0, 0, 0);
        scene.add(lightTop);
        scene.add(lightTop.target);
    
        // Bottom light
        const lightBottom = new THREE.DirectionalLight(0xffffff, intensity);
        lightBottom.position.set(0, -d, 0);
        lightBottom.target.position.set(0, 0, 0);
        scene.add(lightBottom);
        scene.add(lightBottom.target);
    
        return { lightFront, lightBack, lightRight, lightLeft, lightTop, lightBottom };
    }
    
    function showErrorDialog(title, description) {
        // Create the main modal container
        const dialog = document.createElement("div");
        dialog.style.position = "fixed";
        dialog.style.left = "0";
        dialog.style.top = "0";
        dialog.style.width = "100%";
        dialog.style.height = "100%";
        dialog.style.backgroundColor = "rgba(0,0,0,0.5)";
        dialog.style.display = "flex";
        dialog.style.justifyContent = "center";
        dialog.style.alignItems = "center";
        dialog.style.zIndex = "1000";
    
        // Create the modal content box
        const content = document.createElement("div");
        content.style.background = "#fff";
        content.style.padding = "20px";
        content.style.borderRadius = "5px";
        content.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        content.style.minWidth = "300px";
        content.style.maxWidth = "600px";
        content.style.textAlign = "center";
    
        // Create the title element
        const errorTitle = document.createElement("h2");
        errorTitle.textContent = title;
        errorTitle.style.marginTop = "0";
    
        // Create the description element
        const errorDescription = document.createElement("p");
        errorDescription.textContent = description;
    
        // Create the close button
        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.style.padding = "10px 20px";
        closeButton.style.marginTop = "20px";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = function() {
            document.body.removeChild(dialog);
        };
    
        // Append elements to content box
        content.appendChild(errorTitle);
        content.appendChild(errorDescription);
        content.appendChild(closeButton);
    
        // Append content box to modal container
        dialog.appendChild(content);
    
        // Add the modal container to the body
        document.body.appendChild(dialog);
    }    
    function addGridsHelpers(){
        const gridHelper = new THREE.GridHelper(50, 50);
        scene.add(gridHelper);
        const axesHelper = new THREE.AxesHelper(50);
        scene.add(axesHelper);
    }
    function seutp_camera(lookAt, position){
        camera.position.set(position.x, position.y, position.z);
        camera.lookAt(lookAt);
    }
    function loadModel(url) {
        whenModelLoadStart();
        const loader = new GLTFLoader();
        loader.load(url, function (gltf) {
            model = gltf.scene;
            model.position.set(MODEL_SETUP.x, MODEL_SETUP.y, MODEL_SETUP.z);
            model.scale.setScalar(MODEL_SETUP.scale);
            scene.add(model);
            onModelLoadSuccess(url, gltf);
        }, undefined, function (error) {
            onModelLoadFailed();
        });
    }
    function createSphereAtPoint(position) {
        const radius = 0.05; // Radius of the sphere
        const color = 0x000000; // Color of the sphere
    
        // Create sphere geometry
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        
        // Create material for the sphere
        const material = new THREE.MeshBasicMaterial({ color: color });
        
        // Create a new mesh with the geometry and material
        const sphere = new THREE.Mesh(geometry, material);
        
        // Set position of the sphere
        sphere.position.copy(position);
        
        // Add the sphere to the scene
        scene.add(sphere);
        
        return sphere;
    }
    function changeObjectColor(objectName, color) {
        let objectFound = false;
        model.traverse(function (child) {
            if (child.isMesh && child.name === objectName) {
                child.material.color.set(color);
                objectFound = true;
            }
        });
        if (! objectFound) {
            displayError('OBJECT NOT FOUND', 'Error: Object with name "' + objectName + '" not found in the model.');
        }
    }
    function captureAndDisplayImage() {
        try {
            // Render the scene with the current camera settings
            renderer.render(scene, camera);
    
            // Get the image data URL from the renderer's canvas
            const imgDataUrl = renderer.domElement.toDataURL();
    
            // Open a new tab and create an HTML structure that embeds the image
            const newTab = window.open();
            newTab.document.open();
            newTab.document.write('<html><head><title>Captured Image</title></head><body>');
            newTab.document.write('<img src="' + imgDataUrl + '" alt="Captured Image"/>');
            newTab.document.write('</body></html>');
            newTab.document.close();
        } catch (error) {
            displayError('FAILED TO TAKE PICTURE', 'An error occurred while capturing the image: ' + error.message);
        }
    }
    function findMeshAtPositionPoint(position, camera_position) {
        // Calculate the direction vector from the camera position to the position point.
        var rayDirection = new THREE.Vector3().subVectors(position, camera_position).normalize();
    
        // The origin for the raycaster is the camera position.
        var rayOrigin = camera_position.clone();
    
        // Create a new Raycaster starting from the origin, going in the calculated direction.
        var raycaster = new THREE.Raycaster(rayOrigin, rayDirection);
    
        // Perform the raycast to find intersecting objects.
        var intersects = raycaster.intersectObjects(scene.children, true);
    
        // Loop through the intersected objects to find a mesh.
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object instanceof THREE.Mesh) {
                return intersects[i].object; // Return the first intersected mesh.
            }
        }
    
        return null; // Return null if no mesh is intersected.
    }

    function calculateDecalCorners(mesh, position, orientation, width, height, depth) {
        // Convert Euler orientation to a quaternion
        const quaternion = new THREE.Quaternion().setFromEuler(orientation);
    
        // Define corners in the local space of the decal centered at the origin
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const depthOffset = depth / 2;  // Center depth of the decal if needed
        const corners = [
            new THREE.Vector3(-halfWidth, halfHeight, depthOffset),   // Top-left
            new THREE.Vector3(halfWidth, halfHeight, depthOffset),    // Top-right
            new THREE.Vector3(-halfWidth, -halfHeight, depthOffset),  // Bottom-left
            new THREE.Vector3(halfWidth, -halfHeight, depthOffset)    // Bottom-right
        ];
    
        // Transform corners to world space using the orientation quaternion and adding the position
        const worldCorners = corners.map(corner => corner.applyQuaternion(quaternion).add(position));
    
        // Raycasting to validate each corner against the mesh
        const raycaster = new THREE.Raycaster();
        const validCorners = [];
        worldCorners.forEach(corner => {
            raycaster.set(corner, new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion));
            const intersects = raycaster.intersectObject(mesh, true);
            if (intersects.length > 0) {
                validCorners.push(intersects[0].point);
            }
        });
    
        // If not all corners have valid intersections, return null
        if (validCorners.length !== corners.length) {
            return null;
        }
    
        return validCorners;
    }

    function applyTextureToSurface(mesh, texture, position, camera_position, width, height, rotation, opacity, depth) {
        if (! mesh || ! mesh.isMesh) {
            onErrorOccured('Failed To Apply Texture', 'Invalid mesh provided to applyTextureOnModel function');
            return;
        }
    
        texture.flipY = false;
        // Create decal material from texture
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: true,
            opacity: opacity,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -10,
        });
    
        // Create a quaternion to hold the orientation of the decal
        const quaternion = new THREE.Quaternion();
    
        // Use the lookAt function to orient the quaternion towards the camera
        quaternion.setFromRotationMatrix(
            new THREE.Matrix4().lookAt(
                position,  // position of the decal
                camera_position, // A virtual camera based on the position vector
                new THREE.Vector3(0, -1, 0)  // Up vector
            )
        );
    
        // Convert the quaternion to Euler rotation
        const orientation = new THREE.Euler().setFromQuaternion(quaternion);
    
        // Apply additional rotation about the Z-axis (front-facing axis after lookAt)
        orientation.z -= THREE.MathUtils.degToRad(rotation);  // Add your desired rotation angle
    
        // Create size vector from given width and height
        const size = new THREE.Vector3(width, height, depth);  // choose a depth value


        // PROCESS PROJECTION
        const corners = calculateDecalCorners(mesh, position, orientation, width, height, depth);
        if (corners !== null){
            createSphereAtPoint(corners[0]);
            createSphereAtPoint(corners[1]);
            createSphereAtPoint(corners[2]);
            createSphereAtPoint(corners[3]);

            // Create and add the decal mesh to the scene
            const decal = new THREE.Mesh(new DecalGeometry(mesh, position, orientation, size), material);
            scene.add(decal);

            // Updating Decal
            // decal.rotation(-130);


            return decal;
        } else {
            console.log('INTERSECTION IS NOT POSSIBLE FOR THESE PARAMETERS');
            alert('We cannot determine corners for this projection parameter');
        }

        return null;
    }

    // Modify Width and Height
    function updateDecalSize(decal, newWidth, newHeight) {
        decal.scale.x = newWidth / decal.scale.x; // Relative scaling
        decal.scale.y = newHeight / decal.scale.y;
    }

    function updateDecalAppearance(decal, newOpacity) {
        if (decal.material) {
            decal.material.opacity = newOpacity;
            decal.material.needsUpdate = true;
        }
    }

    
    // Not verified yet.
    function toCanvasPosition(position, camera, canvas) {
        // Create a vector from the 3D position
        var vector = new THREE.Vector3(position.x, position.y, position.z);
    
        // Project the vector using the camera's projection matrix
        vector.project(camera);
    
        // Convert the normalized device coordinate (NDC) space to canvas space
        const canvasRect = canvas.getBoundingClientRect();
        const x = Math.round((vector.x + 1) * canvas.clientWidth / 2 + canvasRect.left);
        const y = Math.round((-vector.y + 1) * canvas.clientHeight / 2 + canvasRect.top);
    
        return { x, y };
    }

    /* START MOUSE CLICK LISTENER */
    // Handle mouse down event
    function onMouseDown(event) {
        // Store that the mouse is currently being held down
        isMouseDown = true;

        // Record the mouse position when the button is pressed down
        mouseDownPosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    // Handle mouse up event
    function onMouseUp(event) {
        // Check if the mouse was previously held down
        if (isMouseDown) {
            // Calculate the difference in position from when the mouse was pressed down to when it was released
            const dx = event.clientX - mouseDownPosition.x;
            const dy = event.clientY - mouseDownPosition.y;
            const distanceSquared = dx * dx + dy * dy;

            // If the mouse has hardly moved, consider it a click
            const CLICK_THRESHOLD_SQ = 5 * 5; // 5 pixel tolerance, squared for comparison
            if (distanceSquared < CLICK_THRESHOLD_SQ) {
                onClick(event); // Call your existing onClick function
            }

            // Reset the state
            isMouseDown = false;
            mouseDownPosition = null;
        }
    }
    // Attach event listeners to the window or canvas as appropriate
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    // Determine position in 3D space when clicking
    function onClick(event) {
        const raycaster = new THREE.Raycaster();
    
        // Get the mouse coordinates relative to the canvas
        const canvasRect = canvas.getBoundingClientRect();
        const canvasX = event.clientX - canvasRect.left;
        const canvasY = event.clientY - canvasRect.top;
    
        // Calculate normalized device coordinates
        const mouseNDC = new THREE.Vector2(
            (canvasX / canvas.clientWidth) * 2 - 1,
            -(canvasY / canvas.clientHeight) * 2 + 1
        );
    
        // Update the raycaster with NDC coordinates
        raycaster.setFromCamera(mouseNDC, camera);
    
        // Get an array of all children of the model, assuming model is a THREE.Group or similar
        const modelIntersects = raycaster.intersectObjects(model.children, true);
    
        if (modelIntersects.length > 0) {
            // Handle interactions with the main model.
            const closestIntersection = modelIntersects[0];
            const clickedPosition = closestIntersection.point;
            const clickedNormal = closestIntersection.face.normal;
    
            handleUserClick(clickedPosition, clickedNormal, closestIntersection.object);
        }
    }    
    /* START MOUSE CLICK LISTENER */
    /* END FUNCTIONS HELPERS */


    


    /* START HOOKS LISTENERS */
    function onErrorOccured(title, description){
        console.error(title + ': ' + description);
        showErrorDialog(title, description);
        // ...
    }
    function whenInitializationStart(){
        console.log('initialization starts');
        // ...
    }
    function whenInitializationComplet(){
        console.log('initialization complate');
        // ...
    }
    function whenModelLoadStart(){
        console.log('Start loading ...');
        // ...
    }
    function onModelLoadSuccess(url, gltf){
        console.log('Model Loaded successfully');

        // ...
    }
    function onModelLoadFailed(error){
        console.error('An error happened while loading the model:', error);
        // ...
    }
    function handleUserClick(position, normal, mesh){
        // .. Handle clicks on the model
        /**
         * position: The position vector3 of on the model
         * normal: The normal vector3 of the surface model at the position
         * mesh: the mesh the user clicked on
         */
    
        console.log('CAMERA POSITION ', camera.position);
        console.log('POSITION ', position);


        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            'assets/images/test.png',
            function(texture) {
                // Apply the texture as a decal to the clicked position
                applyTextureToSurface(mesh, texture, position, camera.position, 0.5, 0.3, +30, 1, 1);
            },
            undefined, // No progress callback
            function(error) {
                console.error('An error occurred while loading the texture:', error);
            }
        );

        
    
        // Position setup
        // createSphereAtPoint(position, camera.position);

        // captureAndDisplayImage(); // TEST IMAGE TAKING
    }
    /* END HOOKS LISTENERS */


    init();

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});

