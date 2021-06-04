import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { SphereBufferGeometry } from 'three'


// Loading
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/textures/texture.jpg')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusKnotGeometry( 10, 3, 300, 20 );
const geometry = new SphereBufferGeometry(.75, 64, 64)

// Materials

const material = new THREE.MeshStandardMaterial()
// const material = new THREE.MeshBasicMaterial()
// material.wireframe = true
material.metalness = .7
material.roughness = .2
material.normalMap = normalTexture
material.color = new THREE.Color(0x292929)

// Mesh
const sphere = new THREE.Mesh(geometry,material)

scene.add(sphere)

// Lights
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 1
pointLight.position.y = 1
pointLight.position.z = 1
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xff0000, 1)
pointLight2.position.set(1.99, 1.13,0.53)
pointLight2.intensity = 10
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0x96ff, 1)
pointLight3.position.set(-1.14,-1.36,-0.04)
pointLight3.intensity = 10
scene.add(pointLight3)

const redLight = gui.addFolder('Red light')
redLight.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
redLight.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
redLight.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)
redLight.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

const blueLight = gui.addFolder('Blue light')
blueLight.add(pointLight3.position, 'x').min(-6).max(6).step(0.01)
blueLight.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
blueLight.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)
blueLight.add(pointLight3, 'intensity').min(0).max(10).step(0.01)

const light3Color = {
    color: 0xff0000
}

blueLight.addColor(light3Color, 'color')
    .onChange(() => {
        pointLight3.color.set(light3Color.color)
    })

const pointLight2Helper = new THREE.PointLightHelper(pointLight2, .5)
const pointLight3Helper = new THREE.PointLightHelper(pointLight3, .5)
scene.add(pointLight2Helper, pointLight3Helper)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(1000, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowX = window.innerWidth / 2
const windowY = window.innerHeight / 2

const onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - windowX) 
    mouseY = (event.clientY - windowY)
}

const updateSphere = (event) => {
    sphere.position.y = window.scrollY * 0.001
    const scaleAmount = window.scrollY * .0005
    const scaleValue = 1 + scaleAmount
    sphere.scale.x = scaleValue
    sphere.scale.y = scaleValue
    sphere.scale.z = scaleValue
}

document.addEventListener('mousemove', onDocumentMouseMove)
document.addEventListener('scroll', updateSphere)

const clock = new THREE.Clock()

const tick = () => {

    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .05 * (targetY - sphere.rotation.x)
    sphere.position.z += -.05 * (targetY - sphere.rotation.x)
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()