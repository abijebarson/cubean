import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

function getVertexColors(geometry, isColored) {
    const count = geometry.attributes.position.count;
    const normals = geometry.attributes.normal.array;
    const colors = [];

    const black = new THREE.Color(0x111111);
    const greyFace = new THREE.Color(0x888888);
    const threshold = 0.98; 

    const faceColors = {
        right:  new THREE.Color(0xff3b30), // Red (+x)
        left:   new THREE.Color(0xff9500), // Orange (-x)
        top:    new THREE.Color(0xffcc00), // Yellow (+y)
        bottom: new THREE.Color(0xffffff), // White (-y)
        front:  new THREE.Color(0x4cd964), // Green (+z)
        back:   new THREE.Color(0x007aff)  // Blue (-z)
    };

    for (let i = 0; i < count; i++) {
        const nx = normals[i * 3];
        const ny = normals[i * 3 + 1];
        const nz = normals[i * 3 + 2];

        let color = black; // Default Edge Color

        // Determine if this vertex is on a flat face
        let faceColor = null;
        if (nx > threshold) faceColor = faceColors.right;
        else if (nx < -threshold) faceColor = faceColors.left;
        else if (ny > threshold) faceColor = faceColors.top;
        else if (ny < -threshold) faceColor = faceColors.bottom;
        else if (nz > threshold) faceColor = faceColors.front;
        else if (nz < -threshold) faceColor = faceColors.back;

        if (faceColor) {
            // If isColored is true, use the colorful face. 
            // If false, use the grey face.
            color = isColored ? faceColor : greyFace;
        }

        colors.push(color.r, color.g, color.b);
    }
    return new THREE.Float32BufferAttribute(colors, 3);
}

export function makeCube() {
    const geometry = new RoundedBoxGeometry(1, 1, 1, 8, 0.15);
    
    // Generate initial colorful state
    geometry.setAttribute('color', getVertexColors(geometry, true));

    const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.3,
        metalness: 0.1
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Attach a custom method to the mesh to easily toggle state later
    mesh.userData.isColored = true;
    mesh.toggleColor = function(active) {
        this.userData.isColored = active;
        const newColors = getVertexColors(this.geometry, active);
        this.geometry.setAttribute('color', newColors);
    };

    return mesh;
}