//BounceForce Target Battle Arena for Sidequest's Banter
//https://bounceforce.glitch.me
//
//Created by Minty-Crisp (mintycrisp.com)
//Textures and Sound Effects by Kenny (Kenny.nl)
//Background Music by Silver Nimbus (https://prisonerofphantasy.itch.io/)

//
//Globals

//Game
let gameControlObject;
let gameStart = false;
let gameOver = false;
let levelStart = false;
let levelComplete = false;
let gameComplete = false;
let currentLevel = 0;
let gamePoints = 0;
let levelObjectives = 0;
let levelTargetTotalHealthPool = Math.floor(Math.random()*3+3);
let levelEnemyTotalHealthPool = Math.floor(Math.random()*4+4);
let pickUpHealthActive = false;
let pickUpBonusActive = false;
let pickUpPowerActive = false;
//Scene Text
let infoText = '';
let levelTextPrefix = 'Level ';
let levelText = '';
let objectivesTextPrefix = 'Targets ';
let objectivesText = '';
let pointsTextPrefix = 'Points ';
let pointsText = '';
let healthTextPrefix = 'Health ';
let healthText = '';
//Scene Text Elements
let infoTextId;
let levelTextId;
let pointsTextId;
let objectivesTextId;
let healthTextId;
let infoTextFloorId;
let levelTextFloorId;
let pointsTextFloorId;
let objectivesTextFloorId;
let healthTextFloorId;

//Audio inside components not working

//Audio
let backgroundAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/Town%20III.ogg?v=1677191968094');
backgroundAudio.volume = 0.5;
let playerHitAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/error_004.ogg?v=1677191994765');
playerHitAudio.volume = 0.5;
let otherHitAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/drop_004.ogg?v=1677192012865');
otherHitAudio.volume = 0.5;
let levelCompleteAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/jingles_STEEL10.ogg?v=1677192024743');
levelCompleteAudio.volume = 0.3;
let levelFailAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/jingles_STEEL07.ogg?v=1677192040536');
levelFailAudio.volume = 0.3;
let pickupAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/maximize_006.ogg?v=1677192055665');
pickupAudio.volume = 0.5;
let deathCubeSpawnAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/jingles_STEEL03.ogg?v=1677192068701');
deathCubeSpawnAudio.volume = 0.3;
let portalAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/minimize_006.ogg?v=1677194065756');
portalAudio.volume = 0.3;
let levelStartAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/jingles_STEEL02.ogg?v=1677194150464');
levelStartAudio.volume = 0.3;
let otherDeathAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/lowDown.ogg?v=1677194163766');
otherDeathAudio.volume = 0.3;
let shootAudio = new Audio('https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/drop_002.ogg?v=1677202520777');
shootAudio.volume = 0.5;

//Background Music Loop
function startBackgroundMusic(){
	let musicDelay = setTimeout(function () {
		backgroundAudio.play();
		let interval = setInterval(function () {
			backgroundAudio.play();
		}, 120000);
	}, 10000);
}

//Shuffle Array
function shuffle(array) {
	array.sort(() => Math.random() - 0.5);
}

//Shapes
//

//Sphere
let sphere = {primitive: 'sphere', radius: 1, phiStart: 0, phiLength: 360, phiStart: 0, phiLength: 360, thetaStart: 0, thetaLength: 360};

//Box
let box = {primitive: 'box', height: 1, width: 1, depth: 1, segmentsHeight: 1, segmentsWidth: 1, segmentsDepth: 1};

//Cone
let cone = {primitive: 'cone', openEnded: false, height: 2, radiusBottom: 1, radiusTop: 0.1, segmentsHeight: 18, segmentsRadial: 32, thetaStart: 0, thetaLength: 360};

//Cylinder
let cylinder = {primitive: 'cylinder', height: 2, openEnded: false, radius: 1, segmentsHeight: 18, segmentsRadial: 32, thetaStart: 0, thetaLength: 360};

//Torus
let torus = {primitive: 'torus', arc: 360, radius: 1, radiusTubular: 0.1, segmentsRadial: 36, segmentsTubular: 32};

//Shooter
//Circle
let circle = {primitive: 'circle', radius: 1, segments: 32,thetaStart: 0, thetaLength: 360};

//Every time ammo spawns, it has a new ID to be used in Force
//Ammo
let allAmmo = [];

//Player 0
let all0Ammo = [];
let all0Ammo0 = [];
let all0Ammo1 = [];
let all0Ammo2 = [];
let all0Ammo3 = [];
let all0Ammo4 = [];
let all0Ammo5 = [];
let current0AmmoType = 0;
let player0 = {
name:'player0',
id: 'tbd',
health: 10,
teleporting: false,
dmg: 1,
}

/*
Ammo & Toggles
Toggle 0 : Right Wrist - Cyan - Max 15
Ammo 0 - Box w/ no gravity and force - 5 Bounce Life

Toggle 1 : Right Elbow - Lime - Max 10
Ammo 1 - Sphere w/ gravity and force - 5 Bounce Life

Toggle 2 : Left Wrist - Yellow - Max 10
Ammo 2 - Tiny Sphere w/no gravity and force - 10 Bounce Life

Toggle 3 : Left Elbow - Magenta - Max 8
Ammo 3 - Cylinder w/ no gravity and no force - 5 Bounce Life

Toggle 4 : Left Shoulder - Red - Max 8
Ammo 4 - Torus Kinematic Shield

Toggle 5 : Right Shoulder - Grey - Max 4
Ammo 5 - Box Kinematic Platform
*/

let max0Ammo0 = 15;
let max0Ammo1 = 10;
let max0Ammo2 = 10;
let max0Ammo3 = 8;
let max0Ammo4 = 8;
let max0Ammo5 = 4;

//Prep Ammo
let ammo0Template = {
name:'ammo0',
type: 0,
id: 'tbd',
owner: 0,
shape: box,
material: {shader: 'flat', color: 'cyan', src: '#pattern33'},
scale: new THREE.Vector3(0.1,0.1,0.1),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: false},
forceVelocity: true, 
shootForce: 8, 
bounceType: 'impulse', 
wallBounce: 3, 
blockBounce: 2, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};
let ammo1Template = {
name:'ammo1',
type: 1,
id: 'tbd',
owner: 0,
shape: sphere,
material: {shader: 'flat', color: 'lime', src: '#pattern24', repeat: '2 2'},
scale: new THREE.Vector3(0.1,0.1,0.1),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: true, mass: 0.5},
forceVelocity: true, 
shootForce: 5, 
bounceType: 'impulse', 
wallBounce: 4, 
blockBounce: 3, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};
let ammo2Template = {
name:'ammo2',
type: 2,
id: 'tbd',
owner: 0,
shape: sphere,
material: {shader: 'flat', color: 'yellow', src: '#pattern72', repeat: '2 2'},
scale: new THREE.Vector3(0.05,0.05,0.05),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: false},
forceVelocity: true, 
shootForce: 15,
bounceType: 'impulse', 
wallBounce: 4, 
blockBounce: 3, 
currentBounces: 0, 
maxBounces: 10,
teleporting: false, 
};
let ammo3Template = {
name:'ammo3',
type: 3,
id: 'tbd',
owner: 0,
shape: cylinder,
material: {shader: 'flat', color: 'magenta', src: '#pattern80', repeat: '2 1'},
scale: new THREE.Vector3(0.25,0.25,0.25),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: false},
forceVelocity: false, 
shootForce: 0, 
bounceType: 'impulse', 
wallBounce: 5, 
blockBounce: 4, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};
let ammo4Template = {
name:'ammo4',
type: 4,
id: 'tbd',
owner: 0,
shape: torus,
material: {shader: 'flat', color: 'red', src: '#pattern76', repeat: '3 3'},
scale: new THREE.Vector3(0.15,0.15,0.15),
rotation: new THREE.Vector3(90,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: false, isKinematic: true},
forceVelocity: false, 
shootForce: 0, 
bounceType: 'impulse', 
wallBounce: 0, 
blockBounce: 0, 
currentBounces: 0, 
maxBounces: 0,
teleporting: false, 
};
let ammo5Template = {
name:'ammo5',
type: 5,
id: 'tbd',
owner: 0,
shape: box,
material: {shader: 'flat', color: 'grey', opacity: 1, src: '#pattern33', repeat: '0.5 0.5'},
scale: new THREE.Vector3(1,0.025,1),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: false, isKinematic: true},
forceVelocity: false, 
shootForce: 0, 
bounceType: 'impulse', 
wallBounce: 0, 
blockBounce: 0, 
currentBounces: 0, 
maxBounces: 0,
teleporting: false, 
};

//Ammo0
for(let a = 0; a < max0Ammo0; a++){
	let ammo0Config = {
	name:'ammo0',
	type: 0,
	id: 'tbd',
	owner: 0,
	shape: box,
	material: {shader: 'flat', color: 'cyan', src: '#pattern33'},
	scale: new THREE.Vector3(0.1,0.1,0.1),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: false},
	forceVelocity: true, 
	shootForce: 8, 
	bounceType: 'impulse', 
	wallBounce: 3, 
	blockBounce: 2, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammo0Config.name = 'ammo0' + a;
	all0Ammo0.push(ammo0Config);
}

//Ammo1
for(let a = 0; a < max0Ammo1; a++){
	let ammo1Config = {
	name:'ammo1',
	type: 1,
	id: 'tbd',
	owner: 0,
	shape: sphere,
	material: {shader: 'flat', color: 'lime', src: '#pattern24', repeat: '2 2'},
	scale: new THREE.Vector3(0.1,0.1,0.1),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: true, mass: 0.5},
	forceVelocity: true, 
	shootForce: 5, 
	bounceType: 'impulse', 
	wallBounce: 4, 
	blockBounce: 3, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammo1Config.name = 'ammo1' + a;
	all0Ammo1.push(ammo1Config);
}

//Ammo2
for(let a = 0; a < max0Ammo2; a++){
	let ammo2Config = {
	name:'ammo2',
	type: 2,
	id: 'tbd',
	owner: 0,
	shape: sphere,
	material: {shader: 'flat', color: 'yellow', src: '#pattern72', repeat: '2 2'},
	scale: new THREE.Vector3(0.05,0.05,0.05),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: false},
	forceVelocity: true, 
	shootForce: 15,
	bounceType: 'impulse', 
	wallBounce: 4, 
	blockBounce: 3, 
	currentBounces: 0, 
	maxBounces: 10,
	teleporting: false, 
	};
	ammo2Config.name = 'ammo2' + a;
	all0Ammo2.push(ammo2Config);
}

//Ammo3
for(let a = 0; a < max0Ammo3; a++){
	let ammo3Config = {
	name:'ammo3',
	type: 3,
	id: 'tbd',
	owner: 0,
	shape: cylinder,
	material: {shader: 'flat', color: 'magenta', src: '#pattern80', repeat: '2 1'},
	scale: new THREE.Vector3(0.25,0.25,0.25),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: false},
	forceVelocity: false, 
	shootForce: 0, 
	bounceType: 'impulse', 
	wallBounce: 5, 
	blockBounce: 4, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammo3Config.name = 'ammo3' + a;
	all0Ammo3.push(ammo3Config);
}

//Ammo4
for(let a = 0; a < max0Ammo4; a++){
	let ammo4Config = {
	name:'ammo4',
	type: 4,
	id: 'tbd',
	owner: 0,
	shape: torus,
	material: {shader: 'flat', color: 'red', src: '#pattern76', repeat: '3 3'},
	scale: new THREE.Vector3(0.15,0.15,0.15),
	rotation: new THREE.Vector3(90,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: false, isKinematic: true},
	forceVelocity: false, 
	shootForce: 0, 
	bounceType: 'impulse', 
	wallBounce: 0, 
	blockBounce: 0, 
	currentBounces: 0, 
	maxBounces: 0,
	teleporting: false, 
	};
	ammo4Config.name = 'ammo4' + a;
	all0Ammo4.push(ammo4Config);
}

//Ammo5
for(let a = 0; a < max0Ammo5; a++){
	let ammo5Config = {
	name:'ammo5',
	type: 5,
	id: 'tbd',
	owner: 0,
	shape: box,
	material: {shader: 'flat', color: 'grey', opacity: 1, src: '#pattern33', repeat: '0.5 0.5'},
	scale: new THREE.Vector3(1,0.025,1),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: false, isKinematic: true},
	forceVelocity: false, 
	shootForce: 0, 
	bounceType: 'impulse', 
	wallBounce: 0, 
	blockBounce: 0, 
	currentBounces: 0, 
	maxBounces: 0,
	teleporting: false, 
	};
	ammo5Config.name = 'ammo5' + a;
	all0Ammo5.push(ammo5Config);
}


//Import all of 0's Ammo into all0Ammo
for(let ammo in all0Ammo0){
	all0Ammo.push(all0Ammo0[ammo]);
}
for(let ammo in all0Ammo1){
	all0Ammo.push(all0Ammo1[ammo]);
}
for(let ammo in all0Ammo2){
	all0Ammo.push(all0Ammo2[ammo]);
}
for(let ammo in all0Ammo3){
	all0Ammo.push(all0Ammo3[ammo]);
}
for(let ammo in all0Ammo4){
	all0Ammo.push(all0Ammo4[ammo]);
}
for(let ammo in all0Ammo5){
	all0Ammo.push(all0Ammo5[ammo]);
}

//
//Enemies

let allEnemyAmmo = [];

//Enemy Z
let allZAmmo = [];
let maxZAmmo = 10;

let ammoZTemplate = {
name:'ammoz',
type: 'z',
id: 'tbd',
owner: 9,
shape: box,
material: {shader: 'flat', color: 'white', src: '#pattern62'},
scale: new THREE.Vector3(0.1,0.1,0.1),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: false},
forceVelocity: true, 
shootForce: 3, 
bounceType: 'impulse', 
wallBounce: 2, 
blockBounce: 1.5, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxZAmmo; a++){
	let ammoZConfig = {
	name:'ammoz',
	type: 'z',
	id: 'tbd',
	owner: 9,
	shape: box,
	material: {shader: 'flat', color: 'white', src: '#pattern62'},
	scale: new THREE.Vector3(0.1,0.1,0.1),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: false},
	forceVelocity: true, 
	shootForce: 3, 
	bounceType: 'impulse', 
	wallBounce: 2, 
	blockBounce: 1.5,
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoZConfig.name = 'ammoz' + a;
	allZAmmo.push(ammoZConfig);
}

//Import all of Z's Ammo into allEnemyAmmo
for(let ammo in allZAmmo){
	allEnemyAmmo.push(allZAmmo[ammo]);
}

//Enemy Y
let allYAmmo = [];
let maxYAmmo = 10;

let ammoYTemplate = {
name:'ammoy',
type: 'y',
id: 'tbd',
owner: 9,
shape: sphere,
material: {shader: 'flat', color: 'white', src: '#pattern61'},
scale: new THREE.Vector3(0.1,0.1,0.1),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: true, mass: 0.25},
forceVelocity: true, 
shootForce: 1, 
bounceType: 'impulse', 
wallBounce: 2, 
blockBounce: 1, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxYAmmo; a++){
	let ammoYConfig = {
	name:'ammoy',
	type: 'y',
	id: 'tbd',
	owner: 9,
	shape: sphere,
	material: {shader: 'flat', color: 'white', src: '#pattern61'},
	scale: new THREE.Vector3(0.1,0.1,0.1),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: true, mass: 0.25},
	forceVelocity: true, 
	shootForce: 1, 
	bounceType: 'impulse', 
	wallBounce: 2, 
	blockBounce: 1, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoYConfig.name = 'ammoy' + a;
	allYAmmo.push(ammoYConfig);
}

//Import all of Y's Ammo into allEnemyAmmo
for(let ammo in allYAmmo){
	allEnemyAmmo.push(allYAmmo[ammo]);
}


//Enemy X
let allXAmmo = [];
let maxXAmmo = 10;

let ammoXTemplate = {
name:'ammox',
type: 'x',
id: 'tbd',
owner: 9,
shape: sphere,
material: {shader: 'flat', color: 'grey'},
scale: new THREE.Vector3(0.1,0.1,0.1),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: true, mass: 0.75},
forceVelocity: true, 
shootForce: 2, 
bounceType: 'impulse', 
wallBounce: 3, 
blockBounce: 1.5, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxXAmmo; a++){
	let ammoXConfig = {
	name:'ammox',
	type: 'x',
	id: 'tbd',
	owner: 9,
	shape: sphere,
	material: {shader: 'flat', color: 'grey'},
	scale: new THREE.Vector3(0.1,0.1,0.1),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: true, mass: 0.75},
	forceVelocity: true, 
	shootForce: 2, 
	bounceType: 'impulse', 
	wallBounce: 3, 
	blockBounce: 1.5, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoXConfig.name = 'ammox' + a;
	allXAmmo.push(ammoXConfig);
}

//Import all of X's Ammo into allEnemyAmmo
for(let ammo in allXAmmo){
	allEnemyAmmo.push(allXAmmo[ammo]);
}

//Enemy W
let allWAmmo = [];
let maxWAmmo = 10;

let ammoWTemplate = {
name:'ammow',
type: 'w',
id: 'tbd',
owner: 9,
shape: torus,
material: {shader: 'flat', color: 'purple'},
scale: new THREE.Vector3(0.2,0.2,0.2),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: false},
forceVelocity: true, 
shootForce: 5, 
bounceType: 'impulse', 
wallBounce: 2.5, 
blockBounce: 1.25, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxWAmmo; a++){
	let ammoWConfig = {
	name:'ammow',
	type: 'w',
	id: 'tbd',
	owner: 9,
	shape: torus,
	material: {shader: 'flat', color: 'purple'},
	scale: new THREE.Vector3(0.2,0.2,0.2),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: false},
	forceVelocity: true, 
	shootForce: 5, 
	bounceType: 'impulse', 
	wallBounce: 2.5, 
	blockBounce: 1.25, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoWConfig.name = 'ammow' + a;
	allWAmmo.push(ammoWConfig);
}

//Import all of W's Ammo into allEnemyAmmo
for(let ammo in allWAmmo){
	allEnemyAmmo.push(allWAmmo[ammo]);
}

//Enemy V
let allVAmmo = [];
let maxVAmmo = 10;

let ammoVTemplate = {
name:'ammov',
type: 'v',
id: 'tbd',
owner: 9,
shape: cone,
material: {shader: 'flat', color: 'orange'},
scale: new THREE.Vector3(0.25,0.25,0.25),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: false},
forceVelocity: true, 
shootForce: 3, 
bounceType: 'impulse', 
wallBounce: 2, 
blockBounce: 1, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxVAmmo; a++){
	let ammoVConfig = {
	name:'ammov',
	type: 'v',
	id: 'tbd',
	owner: 9,
	shape: cone,
	material: {shader: 'flat', color: 'orange'},
	scale: new THREE.Vector3(0.25,0.25,0.25),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: false},
	forceVelocity: true, 
	shootForce: 3, 
	bounceType: 'impulse', 
	wallBounce: 2, 
	blockBounce: 1, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoVConfig.name = 'ammov' + a;
	allVAmmo.push(ammoVConfig);
}

//Import all of V's Ammo into allEnemyAmmo
for(let ammo in allVAmmo){
	allEnemyAmmo.push(allVAmmo[ammo]);
}

//Enemy U
let allUAmmo = [];
let maxUAmmo = 10;

let ammoUTemplate = {
name:'ammou',
type: 'u',
id: 'tbd',
owner: 9,
shape: sphere,
material: {shader: 'flat', color: 'yellow'},
scale: new THREE.Vector3(0.05,0.05,0.05),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: true, mass: 0.1},
forceVelocity: true, 
shootForce: 5, 
bounceType: 'impulse', 
wallBounce: 3, 
blockBounce: 2, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxUAmmo; a++){
	let ammoUConfig = {
	name:'ammou',
	type: 'u',
	id: 'tbd',
	owner: 9,
	shape: sphere,
	material: {shader: 'flat', color: 'yellow'},
	scale: new THREE.Vector3(0.05,0.05,0.05),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: true, mass: 0.1},
	forceVelocity: true, 
	shootForce: 5, 
	bounceType: 'impulse', 
	wallBounce: 3, 
	blockBounce: 2, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoUConfig.name = 'ammou' + a;
	allUAmmo.push(ammoUConfig);
}

//Import all of U's Ammo into allEnemyAmmo
for(let ammo in allUAmmo){
	allEnemyAmmo.push(allUAmmo[ammo]);
}

//Enemy T
let allTAmmo = [];
let maxTAmmo = 10;

let ammoTTemplate = {
name:'ammot',
type: 't',
id: 'tbd',
owner: 9,
shape: box,
material: {shader: 'flat', color: 'red'},
scale: new THREE.Vector3(0.5,0.5,0.5),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: false},
forceVelocity: true, 
shootForce: 1.5, 
bounceType: 'impulse', 
wallBounce: 4, 
blockBounce: 3, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxTAmmo; a++){
	let ammoTConfig = {
	name:'ammot',
	type: 't',
	id: 'tbd',
	owner: 9,
	shape: box,
	material: {shader: 'flat', color: 'red'},
	scale: new THREE.Vector3(0.5,0.5,0.5),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: false},
	forceVelocity: true, 
	shootForce: 1, 
	bounceType: 'impulse', 
	wallBounce: 4, 
	blockBounce: 3, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoTConfig.name = 'ammot' + a;
	allTAmmo.push(ammoTConfig);
}

//Import all of T's Ammo into allEnemyAmmo
for(let ammo in allTAmmo){
	allEnemyAmmo.push(allTAmmo[ammo]);
}

//Enemy S
let allSAmmo = [];
let maxSAmmo = 10;

let ammoSTemplate = {
name:'ammos',
type: 's',
id: 'tbd',
owner: 9,
shape: cone,
material: {shader: 'flat', color: 'olive'},
scale: new THREE.Vector3(0.1,0.3,0.1),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: true, mass: 1},
forceVelocity: true, 
shootForce: 1, 
bounceType: 'impulse', 
wallBounce: 4, 
blockBounce: 3, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxSAmmo; a++){
	let ammoSConfig = {
	name:'ammos',
	type: 's',
	id: 'tbd',
	owner: 9,
	shape: cone,
	material: {shader: 'flat', color: 'olive'},
	scale: new THREE.Vector3(0.1,0.3,0.1),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: true, mass: 1},
	forceVelocity: true, 
	shootForce: 1, 
	bounceType: 'impulse', 
	wallBounce: 4, 
	blockBounce: 3, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoSConfig.name = 'ammos' + a;
	allSAmmo.push(ammoSConfig);
}

//Import all of S's Ammo into allEnemyAmmo
for(let ammo in allSAmmo){
	allEnemyAmmo.push(allSAmmo[ammo]);
}

//Enemy R
let allRAmmo = [];
let maxRAmmo = 10;

let ammoRTemplate = {
name:'ammor',
type: 'r',
id: 'tbd',
owner: 9,
shape: cylinder,
material: {shader: 'flat', color: 'pink'},
scale: new THREE.Vector3(0.1,0.2,0.1),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: true, mass: 1},
forceVelocity: true, 
shootForce: 3, 
bounceType: 'impulse', 
wallBounce: 2, 
blockBounce: 1, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxRAmmo; a++){
	let ammoRConfig = {
	name:'ammor',
	type: 'r',
	id: 'tbd',
	owner: 9,
	shape: cylinder,
	material: {shader: 'flat', color: 'pink'},
	scale: new THREE.Vector3(0.1,0.2,0.1),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: true, mass: 1},
	forceVelocity: true, 
	shootForce: 3, 
	bounceType: 'impulse', 
	wallBounce: 2, 
	blockBounce: 1, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoRConfig.name = 'ammor' + a;
	allRAmmo.push(ammoRConfig);
}

//Import all of R's Ammo into allEnemyAmmo
for(let ammo in allRAmmo){
	allEnemyAmmo.push(allRAmmo[ammo]);
}

//Enemy Q
let allQAmmo = [];
let maxQAmmo = 10;

let ammoQTemplate = {
name:'ammoq',
type: 'q',
id: 'tbd',
owner: 9,
shape: torus,
material: {shader: 'flat', color: 'indigo'},
scale: new THREE.Vector3(0.3,0.3,0.1),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: true, mass: 0.5},
forceVelocity: true, 
shootForce: 2, 
bounceType: 'impulse', 
wallBounce: 3, 
blockBounce: 2, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxQAmmo; a++){
	let ammoQConfig = {
	name:'ammoq',
	type: 'q',
	id: 'tbd',
	owner: 9,
	shape: torus,
	material: {shader: 'flat', color: 'indigo'},
	scale: new THREE.Vector3(0.3,0.3,0.1),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: true, mass: 0.5},
	forceVelocity: true, 
	shootForce: 2, 
	bounceType: 'impulse', 
	wallBounce: 3, 
	blockBounce: 2, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoQConfig.name = 'ammoq' + a;
	allQAmmo.push(ammoQConfig);
}

//Import all of Q's Ammo into allEnemyAmmo
for(let ammo in allQAmmo){
	allEnemyAmmo.push(allQAmmo[ammo]);
}

//Enemy P
let allPAmmo = [];
let maxPAmmo = 10;

let ammoPTemplate = {
name:'ammop',
type: 'p',
id: 'tbd',
owner: 9,
shape: box,
material: {shader: 'flat', color: 'indigo'},
scale: new THREE.Vector3(0.2,0.8,0.2),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: true, mass: 0.75},
forceVelocity: true, 
shootForce: 1, 
bounceType: 'impulse', 
wallBounce: 4, 
blockBounce: 3, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxPAmmo; a++){
	let ammoPConfig = {
	name:'ammop',
	type: 'p',
	id: 'tbd',
	owner: 9,
	shape: box,
	material: {shader: 'flat', color: 'indigo'},
	scale: new THREE.Vector3(0.2,0.8,0.2),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: true, mass: 0.75},
	forceVelocity: true, 
	shootForce: 1, 
	bounceType: 'impulse', 
	wallBounce: 4, 
	blockBounce: 3, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoPConfig.name = 'ammop' + a;
	allPAmmo.push(ammoPConfig);
}

//Import all of P's Ammo into allEnemyAmmo
for(let ammo in allPAmmo){
	allEnemyAmmo.push(allPAmmo[ammo]);
}

//Enemy O
let allOAmmo = [];
let maxOAmmo = 10;

let ammoOTemplate = {
name:'ammoo',
type: 'o',
id: 'tbd',
owner: 9,
shape: sphere,
material: {shader: 'flat', color: 'violet'},
scale: new THREE.Vector3(0.5,0.5,0.5),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: true, mass: 0.1},
forceVelocity: true, 
shootForce: 3, 
bounceType: 'impulse', 
wallBounce: 3, 
blockBounce: 1.5, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxOAmmo; a++){
	let ammoOConfig = {
	name:'ammoo',
	type: 'o',
	id: 'tbd',
	owner: 9,
	shape: sphere,
	material: {shader: 'flat', color: 'violet'},
	scale: new THREE.Vector3(0.5,0.5,0.5),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: true, mass: 0.1},
	forceVelocity: true, 
	shootForce: 3, 
	bounceType: 'impulse', 
	wallBounce: 3, 
	blockBounce: 1.5, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoOConfig.name = 'ammoo' + a;
	allOAmmo.push(ammoOConfig);
}

//Import all of O's Ammo into allEnemyAmmo
for(let ammo in allOAmmo){
	allEnemyAmmo.push(allOAmmo[ammo]);
}

//Enemy N
let allNAmmo = [];
let maxNAmmo = 10;

let ammoNTemplate = {
name:'ammon',
type: 'n',
id: 'tbd',
owner: 9,
shape: box,
material: {shader: 'flat', color: 'black'},
scale: new THREE.Vector3(0.5,0.1,0.5),
rotation: new THREE.Vector3(0,0,0),
xDirection: 0, 
yDirection: 0, 
zDirection: 0,
rigidBodyProp: {useGravity: false},
forceVelocity: true, 
shootForce: 2, 
bounceType: 'impulse', 
wallBounce: 3, 
blockBounce: 2, 
currentBounces: 0, 
maxBounces: 5,
teleporting: false, 
};

for(let a = 0; a < maxNAmmo; a++){
	let ammoNConfig = {
	name:'ammon',
	type: 'n',
	id: 'tbd',
	owner: 9,
	shape: box,
	material: {shader: 'flat', color: 'black'},
	scale: new THREE.Vector3(0.5,0.1,0.5),
	rotation: new THREE.Vector3(0,0,0),
	xDirection: 0, 
	yDirection: 0, 
	zDirection: 0,
	rigidBodyProp: {useGravity: false},
	forceVelocity: true, 
	shootForce: 2, 
	bounceType: 'impulse', 
	wallBounce: 3, 
	blockBounce: 2, 
	currentBounces: 0, 
	maxBounces: 5,
	teleporting: false, 
	};
	ammoNConfig.name = 'ammon' + a;
	allNAmmo.push(ammoNConfig);
}

//Import all of N's Ammo into allEnemyAmmo
for(let ammo in allNAmmo){
	allEnemyAmmo.push(allNAmmo[ammo]);
}

//ALL

//Import every Ammo into allAmmo
//Player0 Ammo
for(let ammo in all0Ammo){
	allAmmo.push(all0Ammo[ammo]);
}
//Enemy Ammo
for(let ammo in allEnemyAmmo){
	allAmmo.push(allEnemyAmmo[ammo]);
}

//Remove all spawned Ammo
function removeSpanwedAllAmmo(scene){
	for(let ammo in allAmmo){
		if(document.getElementById(allAmmo[ammo].name)){
			scene.removeChild(document.getElementById(allAmmo[ammo].name));
		}
	}
}

//Target Spawning Locations
let targetLocations = [
new THREE.Vector3(-23,3,32),
new THREE.Vector3(-21,3,34),
new THREE.Vector3(-19,3,36),
new THREE.Vector3(-17,3,38),
new THREE.Vector3(-15,3,40),
new THREE.Vector3(-13,3,42),
new THREE.Vector3(-11,3,44),
new THREE.Vector3(-9,3,46),
new THREE.Vector3(-7,3,48),
new THREE.Vector3(23,3,32),
new THREE.Vector3(21,3,34),
new THREE.Vector3(19,3,36),
new THREE.Vector3(17,3,38),
new THREE.Vector3(15,3,40),
new THREE.Vector3(13,3,42),
new THREE.Vector3(11,3,44),
new THREE.Vector3(9,3,46),
new THREE.Vector3(7,3,48),
new THREE.Vector3(-23,3,78),
new THREE.Vector3(-21,3,76),
new THREE.Vector3(-19,3,74),
new THREE.Vector3(-17,3,72),
new THREE.Vector3(-15,3,70),
new THREE.Vector3(-13,3,68),
new THREE.Vector3(-11,3,66),
new THREE.Vector3(-9,3,64),
new THREE.Vector3(-7,3,62),
new THREE.Vector3(23,3,78),
new THREE.Vector3(21,3,76),
new THREE.Vector3(19,3,74),
new THREE.Vector3(17,3,72),
new THREE.Vector3(15,3,70),
new THREE.Vector3(13,3,68),
new THREE.Vector3(11,3,66),
new THREE.Vector3(9,3,64),
new THREE.Vector3(7,3,62),
new THREE.Vector3(-23,5,32),
new THREE.Vector3(-21,5,34),
new THREE.Vector3(-19,5,36),
new THREE.Vector3(-17,5,38),
new THREE.Vector3(-15,5,40),
new THREE.Vector3(-13,5,42),
new THREE.Vector3(-11,5,44),
new THREE.Vector3(-9,5,46),
new THREE.Vector3(-7,5,48),
new THREE.Vector3(23,5,32),
new THREE.Vector3(21,5,34),
new THREE.Vector3(19,5,36),
new THREE.Vector3(17,5,38),
new THREE.Vector3(15,5,40),
new THREE.Vector3(13,5,42),
new THREE.Vector3(11,5,44),
new THREE.Vector3(9,5,46),
new THREE.Vector3(7,5,48),
new THREE.Vector3(-23,5,78),
new THREE.Vector3(-21,5,76),
new THREE.Vector3(-19,5,74),
new THREE.Vector3(-17,5,72),
new THREE.Vector3(-15,5,70),
new THREE.Vector3(-13,5,68),
new THREE.Vector3(-11,5,66),
new THREE.Vector3(-9,5,64),
new THREE.Vector3(-7,5,62),
new THREE.Vector3(23,5,78),
new THREE.Vector3(21,5,76),
new THREE.Vector3(19,5,74),
new THREE.Vector3(17,5,72),
new THREE.Vector3(15,5,70),
new THREE.Vector3(13,5,68),
new THREE.Vector3(11,5,66),
new THREE.Vector3(9,5,64),
new THREE.Vector3(7,5,62),
new THREE.Vector3(-23,7,32),
new THREE.Vector3(-21,7,34),
new THREE.Vector3(-19,7,36),
new THREE.Vector3(-17,7,38),
new THREE.Vector3(-15,7,40),
new THREE.Vector3(-13,7,42),
new THREE.Vector3(-11,7,44),
new THREE.Vector3(-9,7,46),
new THREE.Vector3(-7,7,48),
new THREE.Vector3(23,7,32),
new THREE.Vector3(21,7,34),
new THREE.Vector3(19,7,36),
new THREE.Vector3(17,7,38),
new THREE.Vector3(15,7,40),
new THREE.Vector3(13,7,42),
new THREE.Vector3(11,7,44),
new THREE.Vector3(9,7,46),
new THREE.Vector3(7,7,48),
new THREE.Vector3(-23,7,78),
new THREE.Vector3(-21,7,76),
new THREE.Vector3(-19,7,74),
new THREE.Vector3(-17,7,72),
new THREE.Vector3(-15,7,70),
new THREE.Vector3(-13,7,68),
new THREE.Vector3(-11,7,66),
new THREE.Vector3(-9,7,64),
new THREE.Vector3(-7,7,62),
new THREE.Vector3(23,7,78),
new THREE.Vector3(21,7,76),
new THREE.Vector3(19,7,74),
new THREE.Vector3(17,7,72),
new THREE.Vector3(15,7,70),
new THREE.Vector3(13,7,68),
new THREE.Vector3(11,7,66),
new THREE.Vector3(9,7,64),
new THREE.Vector3(7,7,62),
new THREE.Vector3(-23,9,32),
new THREE.Vector3(-21,9,34),
new THREE.Vector3(-19,9,36),
new THREE.Vector3(-17,9,38),
new THREE.Vector3(-15,9,40),
new THREE.Vector3(-13,9,42),
new THREE.Vector3(-11,9,44),
new THREE.Vector3(-9,9,46),
new THREE.Vector3(-7,9,48),
new THREE.Vector3(23,9,32),
new THREE.Vector3(21,9,34),
new THREE.Vector3(19,9,36),
new THREE.Vector3(17,9,38),
new THREE.Vector3(15,9,40),
new THREE.Vector3(13,9,42),
new THREE.Vector3(11,9,44),
new THREE.Vector3(9,9,46),
new THREE.Vector3(7,9,48),
new THREE.Vector3(-23,9,78),
new THREE.Vector3(-21,9,76),
new THREE.Vector3(-19,9,74),
new THREE.Vector3(-17,9,72),
new THREE.Vector3(-15,9,70),
new THREE.Vector3(-13,9,68),
new THREE.Vector3(-11,9,66),
new THREE.Vector3(-9,9,64),
new THREE.Vector3(-7,9,62),
new THREE.Vector3(23,9,78),
new THREE.Vector3(21,9,76),
new THREE.Vector3(19,9,74),
new THREE.Vector3(17,9,72),
new THREE.Vector3(15,9,70),
new THREE.Vector3(13,9,68),
new THREE.Vector3(11,9,66),
new THREE.Vector3(9,9,64),
new THREE.Vector3(7,9,62),
new THREE.Vector3(-23,11,32),
new THREE.Vector3(-21,11,34),
new THREE.Vector3(-19,11,36),
new THREE.Vector3(-17,11,38),
new THREE.Vector3(-15,11,40),
new THREE.Vector3(-13,11,42),
new THREE.Vector3(-11,11,44),
new THREE.Vector3(-9,11,46),
new THREE.Vector3(-7,11,48),
new THREE.Vector3(23,11,32),
new THREE.Vector3(21,11,34),
new THREE.Vector3(19,11,36),
new THREE.Vector3(17,11,38),
new THREE.Vector3(15,11,40),
new THREE.Vector3(13,11,42),
new THREE.Vector3(11,11,44),
new THREE.Vector3(9,11,46),
new THREE.Vector3(7,11,48),
new THREE.Vector3(-23,11,78),
new THREE.Vector3(-21,11,76),
new THREE.Vector3(-19,11,74),
new THREE.Vector3(-17,11,72),
new THREE.Vector3(-15,11,70),
new THREE.Vector3(-13,11,68),
new THREE.Vector3(-11,11,66),
new THREE.Vector3(-9,11,64),
new THREE.Vector3(-7,11,62),
new THREE.Vector3(23,11,78),
new THREE.Vector3(21,11,76),
new THREE.Vector3(19,11,74),
new THREE.Vector3(17,11,72),
new THREE.Vector3(15,11,70),
new THREE.Vector3(13,11,68),
new THREE.Vector3(11,11,66),
new THREE.Vector3(9,11,64),
new THREE.Vector3(7,11,62),
new THREE.Vector3(-23,13,32),
new THREE.Vector3(-21,13,34),
new THREE.Vector3(-19,13,36),
new THREE.Vector3(-17,13,38),
new THREE.Vector3(-15,13,40),
new THREE.Vector3(-13,13,42),
new THREE.Vector3(-11,13,44),
new THREE.Vector3(-9,13,46),
new THREE.Vector3(-7,13,48),
new THREE.Vector3(23,13,32),
new THREE.Vector3(21,13,34),
new THREE.Vector3(19,13,36),
new THREE.Vector3(17,13,38),
new THREE.Vector3(15,13,40),
new THREE.Vector3(13,13,42),
new THREE.Vector3(11,13,44),
new THREE.Vector3(9,13,46),
new THREE.Vector3(7,13,48),
new THREE.Vector3(-23,13,78),
new THREE.Vector3(-21,13,76),
new THREE.Vector3(-19,13,74),
new THREE.Vector3(-17,13,72),
new THREE.Vector3(-15,13,70),
new THREE.Vector3(-13,13,68),
new THREE.Vector3(-11,13,66),
new THREE.Vector3(-9,13,64),
new THREE.Vector3(-7,13,62),
new THREE.Vector3(23,13,78),
new THREE.Vector3(21,13,76),
new THREE.Vector3(19,13,74),
new THREE.Vector3(17,13,72),
new THREE.Vector3(15,13,70),
new THREE.Vector3(13,13,68),
new THREE.Vector3(11,13,66),
new THREE.Vector3(9,13,64),
new THREE.Vector3(7,13,62),
new THREE.Vector3(-23,15,32),
new THREE.Vector3(-21,15,34),
new THREE.Vector3(-19,15,36),
new THREE.Vector3(-17,15,38),
new THREE.Vector3(-15,15,40),
new THREE.Vector3(-13,15,42),
new THREE.Vector3(-11,15,44),
new THREE.Vector3(-9,15,46),
new THREE.Vector3(-7,15,48),
new THREE.Vector3(23,15,32),
new THREE.Vector3(21,15,34),
new THREE.Vector3(19,15,36),
new THREE.Vector3(17,15,38),
new THREE.Vector3(15,15,40),
new THREE.Vector3(13,15,42),
new THREE.Vector3(11,15,44),
new THREE.Vector3(9,15,46),
new THREE.Vector3(7,15,48),
new THREE.Vector3(-23,15,78),
new THREE.Vector3(-21,15,76),
new THREE.Vector3(-19,15,74),
new THREE.Vector3(-17,15,72),
new THREE.Vector3(-15,15,70),
new THREE.Vector3(-13,15,68),
new THREE.Vector3(-11,15,66),
new THREE.Vector3(-9,15,64),
new THREE.Vector3(-7,15,62),
new THREE.Vector3(23,15,78),
new THREE.Vector3(21,15,76),
new THREE.Vector3(19,15,74),
new THREE.Vector3(17,15,72),
new THREE.Vector3(15,15,70),
new THREE.Vector3(13,15,68),
new THREE.Vector3(11,15,66),
new THREE.Vector3(9,15,64),
new THREE.Vector3(7,15,62),
new THREE.Vector3(-23,17,32),
new THREE.Vector3(-21,17,34),
new THREE.Vector3(-19,17,36),
new THREE.Vector3(-17,17,38),
new THREE.Vector3(-15,17,40),
new THREE.Vector3(-13,17,42),
new THREE.Vector3(-11,17,44),
new THREE.Vector3(-9,17,46),
new THREE.Vector3(-7,17,48),
new THREE.Vector3(23,17,32),
new THREE.Vector3(21,17,34),
new THREE.Vector3(19,17,36),
new THREE.Vector3(17,17,38),
new THREE.Vector3(15,17,40),
new THREE.Vector3(13,17,42),
new THREE.Vector3(11,17,44),
new THREE.Vector3(9,17,46),
new THREE.Vector3(7,17,48),
new THREE.Vector3(-23,17,78),
new THREE.Vector3(-21,17,76),
new THREE.Vector3(-19,17,74),
new THREE.Vector3(-17,17,72),
new THREE.Vector3(-15,17,70),
new THREE.Vector3(-13,17,68),
new THREE.Vector3(-11,17,66),
new THREE.Vector3(-9,17,64),
new THREE.Vector3(-7,17,62),
new THREE.Vector3(23,17,78),
new THREE.Vector3(21,17,76),
new THREE.Vector3(19,17,74),
new THREE.Vector3(17,17,72),
new THREE.Vector3(15,17,70),
new THREE.Vector3(13,17,68),
new THREE.Vector3(11,17,66),
new THREE.Vector3(9,17,64),
new THREE.Vector3(7,17,62),
new THREE.Vector3(-23,19,32),
new THREE.Vector3(-21,19,34),
new THREE.Vector3(-19,19,36),
new THREE.Vector3(-17,19,38),
new THREE.Vector3(-15,19,40),
new THREE.Vector3(-13,19,42),
new THREE.Vector3(-11,19,44),
new THREE.Vector3(-9,19,46),
new THREE.Vector3(-7,19,48),
new THREE.Vector3(23,19,32),
new THREE.Vector3(21,19,34),
new THREE.Vector3(19,19,36),
new THREE.Vector3(17,19,38),
new THREE.Vector3(15,19,40),
new THREE.Vector3(13,19,42),
new THREE.Vector3(11,19,44),
new THREE.Vector3(9,19,46),
new THREE.Vector3(7,19,48),
new THREE.Vector3(-23,19,78),
new THREE.Vector3(-21,19,76),
new THREE.Vector3(-19,19,74),
new THREE.Vector3(-17,19,72),
new THREE.Vector3(-15,19,70),
new THREE.Vector3(-13,19,68),
new THREE.Vector3(-11,19,66),
new THREE.Vector3(-9,19,64),
new THREE.Vector3(-7,19,62),
new THREE.Vector3(23,19,78),
new THREE.Vector3(21,19,76),
new THREE.Vector3(19,19,74),
new THREE.Vector3(17,19,72),
new THREE.Vector3(15,19,70),
new THREE.Vector3(13,19,68),
new THREE.Vector3(11,19,66),
new THREE.Vector3(9,19,64),
new THREE.Vector3(7,19,62),
new THREE.Vector3(-23,21,32),
new THREE.Vector3(-21,21,34),
new THREE.Vector3(-19,21,36),
new THREE.Vector3(-17,21,38),
new THREE.Vector3(-15,21,40),
new THREE.Vector3(-13,21,42),
new THREE.Vector3(-11,21,44),
new THREE.Vector3(-9,21,46),
new THREE.Vector3(-7,21,48),
new THREE.Vector3(23,21,32),
new THREE.Vector3(21,21,34),
new THREE.Vector3(19,21,36),
new THREE.Vector3(17,21,38),
new THREE.Vector3(15,21,40),
new THREE.Vector3(13,21,42),
new THREE.Vector3(11,21,44),
new THREE.Vector3(9,21,46),
new THREE.Vector3(7,21,48),
new THREE.Vector3(-23,21,78),
new THREE.Vector3(-21,21,76),
new THREE.Vector3(-19,21,74),
new THREE.Vector3(-17,21,72),
new THREE.Vector3(-15,21,70),
new THREE.Vector3(-13,21,68),
new THREE.Vector3(-11,21,66),
new THREE.Vector3(-9,21,64),
new THREE.Vector3(-7,21,62),
new THREE.Vector3(23,21,78),
new THREE.Vector3(21,21,76),
new THREE.Vector3(19,21,74),
new THREE.Vector3(17,21,72),
new THREE.Vector3(15,21,70),
new THREE.Vector3(13,21,68),
new THREE.Vector3(11,21,66),
new THREE.Vector3(9,21,64),
new THREE.Vector3(7,21,62),
new THREE.Vector3(-23,23,32),
new THREE.Vector3(-21,23,34),
new THREE.Vector3(-19,23,36),
new THREE.Vector3(-17,23,38),
new THREE.Vector3(-15,23,40),
new THREE.Vector3(-13,23,42),
new THREE.Vector3(-11,23,44),
new THREE.Vector3(-9,23,46),
new THREE.Vector3(-7,23,48),
new THREE.Vector3(23,23,32),
new THREE.Vector3(21,23,34),
new THREE.Vector3(19,23,36),
new THREE.Vector3(17,23,38),
new THREE.Vector3(15,23,40),
new THREE.Vector3(13,23,42),
new THREE.Vector3(11,23,44),
new THREE.Vector3(9,23,46),
new THREE.Vector3(7,23,48),
new THREE.Vector3(-23,23,78),
new THREE.Vector3(-21,23,76),
new THREE.Vector3(-19,23,74),
new THREE.Vector3(-17,23,72),
new THREE.Vector3(-15,23,70),
new THREE.Vector3(-13,23,68),
new THREE.Vector3(-11,23,66),
new THREE.Vector3(-9,23,64),
new THREE.Vector3(-7,23,62),
new THREE.Vector3(23,23,78),
new THREE.Vector3(21,23,76),
new THREE.Vector3(19,23,74),
new THREE.Vector3(17,23,72),
new THREE.Vector3(15,23,70),
new THREE.Vector3(13,23,68),
new THREE.Vector3(11,23,66),
new THREE.Vector3(9,23,64),
new THREE.Vector3(7,23,62),
new THREE.Vector3(-23,25,32),
new THREE.Vector3(-21,25,34),
new THREE.Vector3(-19,25,36),
new THREE.Vector3(-17,25,38),
new THREE.Vector3(-15,25,40),
new THREE.Vector3(-13,25,42),
new THREE.Vector3(-11,25,44),
new THREE.Vector3(-9,25,46),
new THREE.Vector3(-7,25,48),
new THREE.Vector3(23,25,32),
new THREE.Vector3(21,25,34),
new THREE.Vector3(19,25,36),
new THREE.Vector3(17,25,38),
new THREE.Vector3(15,25,40),
new THREE.Vector3(13,25,42),
new THREE.Vector3(11,25,44),
new THREE.Vector3(9,25,46),
new THREE.Vector3(7,25,48),
new THREE.Vector3(-23,25,78),
new THREE.Vector3(-21,25,76),
new THREE.Vector3(-19,25,74),
new THREE.Vector3(-17,25,72),
new THREE.Vector3(-15,25,70),
new THREE.Vector3(-13,25,68),
new THREE.Vector3(-11,25,66),
new THREE.Vector3(-9,25,64),
new THREE.Vector3(-7,25,62),
new THREE.Vector3(23,25,78),
new THREE.Vector3(21,25,76),
new THREE.Vector3(19,25,74),
new THREE.Vector3(17,25,72),
new THREE.Vector3(15,25,70),
new THREE.Vector3(13,25,68),
new THREE.Vector3(11,25,66),
new THREE.Vector3(9,25,64),
new THREE.Vector3(7,25,62),
new THREE.Vector3(-23,27,32),
new THREE.Vector3(-21,27,34),
new THREE.Vector3(-19,27,36),
new THREE.Vector3(-17,27,38),
new THREE.Vector3(-15,27,40),
new THREE.Vector3(-13,27,42),
new THREE.Vector3(-11,27,44),
new THREE.Vector3(-9,27,46),
new THREE.Vector3(-7,27,48),
new THREE.Vector3(23,27,32),
new THREE.Vector3(21,27,34),
new THREE.Vector3(19,27,36),
new THREE.Vector3(17,27,38),
new THREE.Vector3(15,27,40),
new THREE.Vector3(13,27,42),
new THREE.Vector3(11,27,44),
new THREE.Vector3(9,27,46),
new THREE.Vector3(7,27,48),
new THREE.Vector3(-23,27,78),
new THREE.Vector3(-21,27,76),
new THREE.Vector3(-19,27,74),
new THREE.Vector3(-17,27,72),
new THREE.Vector3(-15,27,70),
new THREE.Vector3(-13,27,68),
new THREE.Vector3(-11,27,66),
new THREE.Vector3(-9,27,64),
new THREE.Vector3(-7,27,62),
new THREE.Vector3(23,27,78),
new THREE.Vector3(21,27,76),
new THREE.Vector3(19,27,74),
new THREE.Vector3(17,27,72),
new THREE.Vector3(15,27,70),
new THREE.Vector3(13,27,68),
new THREE.Vector3(11,27,66),
new THREE.Vector3(9,27,64),
new THREE.Vector3(7,27,62),
new THREE.Vector3(-23,29,32),
new THREE.Vector3(-21,29,34),
new THREE.Vector3(-19,29,36),
new THREE.Vector3(-17,29,38),
new THREE.Vector3(-15,29,40),
new THREE.Vector3(-13,29,42),
new THREE.Vector3(-11,29,44),
new THREE.Vector3(-9,29,46),
new THREE.Vector3(-7,29,48),
new THREE.Vector3(23,29,32),
new THREE.Vector3(21,29,34),
new THREE.Vector3(19,29,36),
new THREE.Vector3(17,29,38),
new THREE.Vector3(15,29,40),
new THREE.Vector3(13,29,42),
new THREE.Vector3(11,29,44),
new THREE.Vector3(9,29,46),
new THREE.Vector3(7,29,48),
new THREE.Vector3(-23,29,78),
new THREE.Vector3(-21,29,76),
new THREE.Vector3(-19,29,74),
new THREE.Vector3(-17,29,72),
new THREE.Vector3(-15,29,70),
new THREE.Vector3(-13,29,68),
new THREE.Vector3(-11,29,66),
new THREE.Vector3(-9,29,64),
new THREE.Vector3(-7,29,62),
new THREE.Vector3(23,29,78),
new THREE.Vector3(21,29,76),
new THREE.Vector3(19,29,74),
new THREE.Vector3(17,29,72),
new THREE.Vector3(15,29,70),
new THREE.Vector3(13,29,68),
new THREE.Vector3(11,29,66),
new THREE.Vector3(9,29,64),
new THREE.Vector3(7,29,62),
];
//Enemy Spawning Locations
let enemyLocationsBackRight = [
new THREE.Vector3(-23,1,32),
new THREE.Vector3(-21,1,34),
new THREE.Vector3(-19,1,36),
new THREE.Vector3(-17,1,38),
new THREE.Vector3(-15,1,40),
new THREE.Vector3(-13,1,42),
new THREE.Vector3(-11,1,44),
new THREE.Vector3(-9,1,46),
new THREE.Vector3(-7,1,48),
];
let enemyLocationsBackLeft = [
new THREE.Vector3(23,1,32),
new THREE.Vector3(21,1,34),
new THREE.Vector3(19,1,36),
new THREE.Vector3(17,1,38),
new THREE.Vector3(15,1,40),
new THREE.Vector3(13,1,42),
new THREE.Vector3(11,1,44),
new THREE.Vector3(9,1,46),
new THREE.Vector3(7,1,48),
];
let enemyLocationsFrontRight = [
new THREE.Vector3(-23,1,78),
new THREE.Vector3(-21,1,76),
new THREE.Vector3(-19,1,74),
new THREE.Vector3(-17,1,72),
new THREE.Vector3(-15,1,70),
new THREE.Vector3(-13,1,68),
new THREE.Vector3(-11,1,66),
new THREE.Vector3(-9,1,64),
new THREE.Vector3(-7,1,62),
];
let enemyLocationsFrontLeft = [
new THREE.Vector3(23,1,78),
new THREE.Vector3(21,1,76),
new THREE.Vector3(19,1,74),
new THREE.Vector3(17,1,72),
new THREE.Vector3(15,1,70),
new THREE.Vector3(13,1,68),
new THREE.Vector3(11,1,66),
new THREE.Vector3(9,1,64),
new THREE.Vector3(7,1,62),
];
let enemyLocationsPlatforms = [
new THREE.Vector3(0,7,46),
new THREE.Vector3(0,15,48),
new THREE.Vector3(0,7,62),
new THREE.Vector3(0,22,62),
new THREE.Vector3(-20,7,55),
new THREE.Vector3(-22,15,38),
new THREE.Vector3(-22,15,47),
new THREE.Vector3(-22,15,63),
new THREE.Vector3(-22,15,72),
new THREE.Vector3(12.5,6.5,54.5),
new THREE.Vector3(0,15,80),
new THREE.Vector3(18,22,55),
new THREE.Vector3(0,1,55),
new THREE.Vector3(0,1,57),
new THREE.Vector3(0,1,59),
];
//Death Spawning Locations
let deathLocations = [
new THREE.Vector3(0,20,35),
new THREE.Vector3(0,20,45),
new THREE.Vector3(15,20,55),
new THREE.Vector3(-15,20,65),
new THREE.Vector3(-25,20,75),
];
//Power Up Locations
let powerLocations = [
new THREE.Vector3(0,7,46),
new THREE.Vector3(0,15,48),
new THREE.Vector3(0,7,62),
new THREE.Vector3(0,22,62),
new THREE.Vector3(-20,7,55),
new THREE.Vector3(-22,15,38),
new THREE.Vector3(-22,15,47),
new THREE.Vector3(-22,15,63),
new THREE.Vector3(-22,15,72),
new THREE.Vector3(12.5,6.5,54.5),
new THREE.Vector3(0,15,80),
new THREE.Vector3(18,22,55),
new THREE.Vector3(0,1,55),
new THREE.Vector3(0,1,57),
new THREE.Vector3(0,1,59),
];

//Legacy
let rigidBodyProp = {useGravity: true, mass: 0.5};
let shapeProp = sphere;
let shootForce = 4;
let wallBounce = 3;
let blockBounce = 2;
let bounceType = 'impulse';
let forceVelocity = true;
let shape = {primitive: 'sphere', radius: 1, phiStart: 0, phiLength: 360, phiStart: 0, phiLength: 360, thetaStart: 0, thetaLength: 360};
//Legacy
let directionBounce = 1;

//Spawn Ammo
AFRAME.registerComponent('spawn-ammo', {
	schema: {
		//shape: {type: 'string', default: 'sphere'},
		//ammoId: {type: 'string', default: 'id'},
		//type: {type: 'string', default: 'red'},
	},
    init: function() {
		const sceneEl = document.querySelector('a-scene');

		let currentlySpawning = false;
		let ammo0Spawn = 0;
		let ammo1Spawn = 0;
		let ammo2Spawn = 0;
		let ammo3Spawn = 0;
		let ammo4Spawn = 0;
		let ammo5Spawn = 0;

		//Calc Force Vector and Spawn Position
		function prepForceSpawnVector(){

			enableQuaternionPose();
			let rightHandRotation = window.userinputs.righthand.rotation;

			const q = new THREE.Quaternion(
			-rightHandRotation.x,
			-rightHandRotation.y,
			rightHandRotation.z,
			rightHandRotation.w
			);

			const v = new THREE.Vector3(0,1,0);
			v.applyQuaternion(q);

			const z = Math.atan2(2 * (q.x * q.y + q.z * q.w), 1 - 2 * (q.y * q.y + q.z * q.z));

			//ZXY
			const x = Math.atan2(2 * (q.x * q.w - q.y * q.z), 1 - 2 * (q.x * q.x + q.z * q.z));
			const y = Math.atan2(2 * (q.y * q.w - q.x * q.z), 1 - 2 * (q.y * q.y + q.z * q.z));

			// Adjust for wrist rotation
			const up = new THREE.Vector3(0, 1, 0);
			const right = new THREE.Vector3();
			right.crossVectors(up, v);
			const wristQuaternion = new THREE.Quaternion();
			wristQuaternion.setFromAxisAngle(right, -z * (Math.PI / 180));
			v.applyQuaternion(wristQuaternion);


			let spawnRotation = new THREE.Vector3(x,y,z);
			spawnRotation.x *= 57.29578;
			spawnRotation.y *= 57.29578;
			spawnRotation.z *= 57.29578;

			let vectorX = v.x*-1;
			let vectorY = v.y*-1;
			let vectorZ = v.z*-1;
			let forceVector = new THREE.Vector3(vectorX,vectorY,vectorZ);

			let rightHandPosition = window.userinputs.righthand.position;
			let posX = rightHandPosition.x + vectorX/2;
			let posY = rightHandPosition.y + vectorY/2;
			let posZ = rightHandPosition.z + vectorZ/2;
			let spawnPos = new THREE.Vector3(posX,posY,posZ);

			return [forceVector,spawnPos,spawnRotation];

		}

        this.el.addEventListener('click', ()=>{
			//prevent clicking until ammo has spawned and launched
			if(currentlySpawning){} else {
				currentlySpawning = true;

				//Calculate Force Vector
				let vectors = prepForceSpawnVector();
				let forceVector = vectors[0];
				let ammoPos = vectors[1];
				let handRotation = vectors[2];

				let ammo = document.createElement('a-entity');
				let htmlId;
				let ammoScale;
				let ammoRotation = new THREE.Vector3(0,0,0);
				ammoRotation.x += handRotation.x;
				ammoRotation.y += handRotation.y;
				ammoRotation.z += handRotation.z;
				let ammoMaterial;
				let ammoGeometry;
				let ammoRigidBody;
				let ammoShootForce;
				let ammoShootForceType;


				if(current0AmmoType === 0){
					htmlId = ammo0Template.name + ammo0Spawn;
					ammoScale = ammo0Template.scale;
					ammoRotation.x += ammo0Template.rotation.x;
					ammoRotation.y += ammo0Template.rotation.y;
					ammoRotation.z += ammo0Template.rotation.z;
					ammoMaterial = ammo0Template.material;
					ammoGeometry = ammo0Template.shape;
					ammoRigidBody = ammo0Template.rigidBodyProp;
					ammoShootForce = ammo0Template.shootForce;
					ammoShootForceType = ammo0Template.bounceType;
				} else if(current0AmmoType === 1){
					htmlId = ammo1Template.name + ammo1Spawn;
					ammoScale = ammo1Template.scale;
					ammoRotation.x += ammo1Template.rotation.x;
					ammoRotation.y += ammo1Template.rotation.y;
					ammoRotation.z += ammo1Template.rotation.z;
					ammoMaterial = ammo1Template.material;
					ammoGeometry = ammo1Template.shape;
					ammoRigidBody = ammo1Template.rigidBodyProp;
					ammoShootForce = ammo1Template.shootForce;
					ammoShootForceType = ammo1Template.bounceType;
				} else if(current0AmmoType === 2){
					htmlId = ammo2Template.name + ammo2Spawn;
					ammoScale = ammo2Template.scale;
					ammoRotation.x += ammo2Template.rotation.x;
					ammoRotation.y += ammo2Template.rotation.y;
					ammoRotation.z += ammo2Template.rotation.z;
					ammoMaterial = ammo2Template.material;
					ammoGeometry = ammo2Template.shape;
					ammoRigidBody = ammo2Template.rigidBodyProp;
					ammoShootForce = ammo2Template.shootForce;
					ammoShootForceType = ammo2Template.bounceType;
				} else if(current0AmmoType === 3){
					htmlId = ammo3Template.name + ammo3Spawn;
					ammoScale = ammo3Template.scale;
					ammoRotation.x += ammo3Template.rotation.x;
					ammoRotation.y += ammo3Template.rotation.y;
					ammoRotation.z += ammo3Template.rotation.z;
					ammoMaterial = ammo3Template.material;
					ammoGeometry = ammo3Template.shape;
					ammoRigidBody = ammo3Template.rigidBodyProp;
					ammoShootForce = ammo3Template.shootForce;
					ammoShootForceType = ammo3Template.bounceType;
				} else if(current0AmmoType === 4){
					htmlId = ammo4Template.name + ammo4Spawn;
					ammoScale = ammo4Template.scale;
					ammoRotation.x += ammo4Template.rotation.x;
					ammoRotation.y += ammo4Template.rotation.y;
					ammoRotation.z += ammo4Template.rotation.z;
					ammoMaterial = ammo4Template.material;
					ammoGeometry = ammo4Template.shape;
					ammoRigidBody = ammo4Template.rigidBodyProp;
					ammoShootForce = ammo4Template.shootForce;
					ammoShootForceType = ammo4Template.bounceType;
				} else if(current0AmmoType === 5){
					htmlId = ammo5Template.name + ammo5Spawn;
					ammoScale = ammo5Template.scale;
					ammoRotation = ammo5Template.rotation;
					ammoMaterial = ammo5Template.material;
					ammoGeometry = ammo5Template.shape;
					ammoRigidBody = ammo5Template.rigidBodyProp;
					ammoShootForce = ammo5Template.shootForce;
					ammoShootForceType = ammo5Template.bounceType;
				}

				if(document.getElementById(htmlId)){
					let oldAmmo = document.getElementById(htmlId);
					sceneEl.removeChild(oldAmmo);
				}
				ammo.setAttribute('id', htmlId);
				ammo.setAttribute('geometry', ammoGeometry);
				ammo.setAttribute('position', ammoPos);
				ammo.setAttribute('scale', ammoScale);
				ammo.setAttribute('rotation', ammoRotation);
				ammo.setAttribute('material', ammoMaterial);
				ammo.setAttribute('sq-rigidbody', ammoRigidBody);
				ammo.setAttribute('sq-collider',{});
				sceneEl.appendChild(ammo);

				/* Spawn Trigger Collider
				let htmlId2 = htmlId + 'trigger';
				let ammo2 = document.createElement('a-entity');
				let spawnScale2 = new THREE.Vector3(1.01,1.01,1.01);
				let spawnPos2 = new THREE.Vector3(0,0,0);
				let ammoMaterial2 = {shader: 'flat', opacity: '0'};
				ammo2.setAttribute('id', htmlId2);
				ammo2.setAttribute('geometry', shapeProp);
				ammo2.setAttribute('position', spawnPos2);
				ammo2.setAttribute('scale', spawnScale2);
				ammo2.setAttribute('material', ammoMaterial2);
				ammo2.setAttribute('sq-collider',{});
				ammo2.setAttribute('sq-triggercollider',{});
				ammo2.setAttribute('ammo-hit-ammo',{});
				ammo.appendChild(ammo2);
				*/

				//calc which all0Ammo array item holds the ammo type spawn num and update
				let ammoLocation;
				let spawnNum;
				if(current0AmmoType === 0){
					spawnNum = ammo0Spawn;
				} else if(current0AmmoType === 1){
					spawnNum = ammo1Spawn;
				} else if(current0AmmoType === 2){
					spawnNum = ammo2Spawn;
				} else if(current0AmmoType === 3){
					spawnNum = ammo3Spawn;
				} else if(current0AmmoType === 4){
					spawnNum = ammo4Spawn;
				} else if(current0AmmoType === 5){
					spawnNum = ammo5Spawn;
				}
				for(let a = 0; a < all0Ammo.length; a++){
					//if(all0Ammo[a].type === 0){
					if(all0Ammo[a].type === current0AmmoType){
						//if(all0Ammo[a].name === 'ammo0'+ammo0Spawn){
						if(all0Ammo[a].name === 'ammo'+current0AmmoType+spawnNum){
							ammoLocation = a;
						}
					}
				}

				//Update all0Ammo
				all0Ammo[ammoLocation].id = document.getElementById(htmlId).object3D.id;
				all0Ammo[ammoLocation].currentBounces = 0;
				all0Ammo[ammoLocation].teleporting = false;

				if(forceVelocity){
					all0Ammo[ammoLocation].xDirection = forceVector.x*all0Ammo[ammoLocation].shootForce;
					all0Ammo[ammoLocation].yDirection = forceVector.y*all0Ammo[ammoLocation].shootForce;
					all0Ammo[ammoLocation].zDirection = forceVector.z*all0Ammo[ammoLocation].shootForce;
				}else{
					all0Ammo[ammoLocation].xDirection = forceVector.x;
					all0Ammo[ammoLocation].yDirection = forceVector.y;
					all0Ammo[ammoLocation].zDirection = forceVector.z;
				}

				//Calc currently spawned
				if(current0AmmoType === 0){
					if(ammo0Spawn >= max0Ammo0-1){
						ammo0Spawn = 0;
					} else {
						ammo0Spawn++;
					}
				} else if(current0AmmoType === 1){
					if(ammo1Spawn >= max0Ammo1-1){
						ammo1Spawn = 0;
					} else {
						ammo1Spawn++;
					}
				} else if(current0AmmoType === 2){
					if(ammo2Spawn >= max0Ammo2-1){
						ammo2Spawn = 0;
					} else {
						ammo2Spawn++;
					}
				} else if(current0AmmoType === 3){
					if(ammo3Spawn >= max0Ammo3-1){
						ammo3Spawn = 0;
					} else {
						ammo3Spawn++;
					}
				} else if(current0AmmoType === 4){
					if(ammo4Spawn >= max0Ammo4-1){
						ammo4Spawn = 0;
					} else {
						ammo4Spawn++;
					}
				} else if(current0AmmoType === 5){
					if(ammo5Spawn >= max0Ammo5-1){
						ammo5Spawn = 0;
					} else {
						ammo5Spawn++;
					}
				}

				let forceTimeout = setTimeout(function () {
					shootAudio.play();
					if(forceVelocity){

						addForce({x: forceVector.x*all0Ammo[ammoLocation].shootForce, y: forceVector.y*all0Ammo[ammoLocation].shootForce, z: forceVector.z*all0Ammo[ammoLocation].shootForce}, all0Ammo[ammoLocation].bounceType, all0Ammo[ammoLocation].id);
					}
					clearTimeout(forceTimeout);
				}, 50);
				let forceTimeout2 = setTimeout(function () {
					currentlySpawning = false;
					clearTimeout(forceTimeout2);
				}, 100);
			}
        });
    },
});

//Enemy Spawn Ammo
AFRAME.registerComponent('enemy-spawn-ammo', {
	schema: {
		ammoType: {type: 'string', default: 'z'},
		rateOfFire: {type: 'number', default: 1000},
		fireDelay: {type: 'number', default: 0},
		startTrigger: {type: 'bool', default: false},
		directionFocus: {type: 'bool', default: false},
		forward: {type: 'bool', default: false},
		backward: {type: 'bool', default: false},
		left: {type: 'bool', default: false},
		right: {type: 'bool', default: false},
		up: {type: 'bool', default: false},
		down: {type: 'bool', default: false},
		rightForward: {type: 'bool', default: false},
		rightBackward: {type: 'bool', default: false},
		leftForward: {type: 'bool', default: false},
		leftBackward: {type: 'bool', default: false},
		random: {type: 'bool', default: false},
	},
    init: function() {
		const sceneEl = document.querySelector('a-scene');
		const object = this.el;
		const objectId = this.el.id;

		let currentlySpawning = false;
		let ammoSpawn = 0;
		let ammoType = this.data.ammoType;
		let rateOfFire = this.data.rateOfFire;
		let fireDelay = this.data.fireDelay;
		let startTrigger = this.data.startTrigger;

		let fireInterval;

		let directionFocus = this.data.directionFocus;
		let forward = this.data.forward;
		let backward = this.data.backward;
		let left = this.data.left;
		let right = this.data.right;
		let up = this.data.up;
		let down = this.data.down;
		let rightForward = this.data.rightForward;
		let rightBackward = this.data.rightBackward;
		let leftForward = this.data.leftForward;
		let leftBackward = this.data.leftBackward;
		let random = this.data.random;

		//All directions to choose from
		let directionLoop = [];
		//Current direction to shoot at
		let shootDirection;
		//Current array location for shoot direction at
		let dirNum = 0;

		function generateDirectionLoop(){
			if(random){
				//pick random direction every time
				shootDirection = 'random';
			} else {
				if(forward){
					if(directionFocus){
						//add only forward facing direction
						directionLoop.push('forward');
					} else {
						//add all forward facing directions
						directionLoop.push('upRightForward');
						directionLoop.push('upLeftForward');
						directionLoop.push('upForward');
						directionLoop.push('downRightForward');
						directionLoop.push('downLeftForward');
						directionLoop.push('downForward');
						directionLoop.push('rightForward');
						directionLoop.push('leftForward');
						directionLoop.push('forward');
					}
				} else if(backward){
					if(directionFocus){
						//add only forward facing direction
						directionLoop.push('backward');
					} else {
						//add all forward facing directions
						directionLoop.push('upRightBackward');
						directionLoop.push('upLeftBackward');
						directionLoop.push('upBackward');
						directionLoop.push('downRightBackward');
						directionLoop.push('downLeftBackward');
						directionLoop.push('downBackward');
						directionLoop.push('rightBackward');
						directionLoop.push('leftBackward');
						directionLoop.push('backward');
					}
				} else if(left){
					if(directionFocus){
						//add only forward facing direction
						directionLoop.push('left');
					} else {
						//add all forward facing directions
						directionLoop.push('upLeft');
						directionLoop.push('upLeftForward');
						directionLoop.push('upLeftBackward');
						directionLoop.push('downLeft');
						directionLoop.push('downLeftForward');
						directionLoop.push('downLeftBackward');
						directionLoop.push('left');
						directionLoop.push('leftForward');
						directionLoop.push('leftBackward');
					}
				} else if(right){
					if(directionFocus){
						//add only forward facing direction
						directionLoop.push('right');
					} else {
						//add all forward facing directions
						directionLoop.push('upRight');
						directionLoop.push('upRightForward');
						directionLoop.push('upRightBackward');
						directionLoop.push('downRight');
						directionLoop.push('downRightForward');
						directionLoop.push('downRightBackward');
						directionLoop.push('right');
						directionLoop.push('rightForward');
						directionLoop.push('rightBackward');
					}
				} else if(up){
					if(directionFocus){
						//add only forward facing direction
						directionLoop.push('up');
					} else {
						//add all forward facing directions
						directionLoop.push('up');
						directionLoop.push('upRight');
						directionLoop.push('upRightForward');
						directionLoop.push('upRightBackward');
						directionLoop.push('upLeft');
						directionLoop.push('upLeftForward');
						directionLoop.push('upLeftBackward');
						directionLoop.push('upForward');
						directionLoop.push('upBackward');
					}
				} else if(down){
					if(directionFocus){
						//add only forward facing direction
						directionLoop.push('down');
					} else {
						//add all forward facing directions
						directionLoop.push('down');
						directionLoop.push('downRight');
						directionLoop.push('downRightForward');
						directionLoop.push('downRightBackward');
						directionLoop.push('downLeft');
						directionLoop.push('downLeftForward');
						directionLoop.push('downLeftBackward');
						directionLoop.push('downForward');
						directionLoop.push('downBackward');
					}
				} else if(rightForward){
					if(directionFocus){
						//add only forward facing direction
						directionLoop.push('rightForward');
					} else {
						//add all forward facing directions
						directionLoop.push('upRightForward');
						directionLoop.push('downRightForward');
						directionLoop.push('rightForward');
					}
				} else if(rightBackward){
					if(directionFocus){
						//add only forward facing direction
						directionLoop.push('rightBackward');
					} else {
						//add all forward facing directions
						directionLoop.push('upRightBackward');
						directionLoop.push('downRightBackward');
						directionLoop.push('rightBackward');
					}
				} else if(leftForward){
					if(directionFocus){
						//add only forward facing direction
						directionLoop.push('leftForward');
					} else {
						//add all forward facing directions
						directionLoop.push('upLeftForward');
						directionLoop.push('downLeftForward');
						directionLoop.push('leftForward');
					}
				} else if(leftBackward){
					if(directionFocus){
						//add only forward facing direction
						directionLoop.push('leftBackward');
					} else {
						//add all forward facing directions
						directionLoop.push('upLeftBackward');
						directionLoop.push('downLeftBackward');
						directionLoop.push('leftBackward');
					}
				}
			}
		}
		generateDirectionLoop();

		//Shuffle Array
		function shuffle(array) {
			array.sort(() => Math.random() - 0.5);
		}

		if(random){}else{
			shuffle(directionLoop);
		}

		function shootVector(angle){

			let direction;
			if(angle === 'up'){
				//Up
				direction = new THREE.Vector3(0,1,0);
			} else if(angle === 'upRight'){
				//Up Right
				direction = new THREE.Vector3(1,1,0);
			} else if(angle === 'upRightForward'){
				//Up Right Forward
				direction = new THREE.Vector3(1,1,-1);
			} else if(angle === 'upRightBackward'){
				//Up Right Backward
				direction = new THREE.Vector3(1,1,1);
			} else if(angle === 'upLeft'){
				//Up Left
				direction = new THREE.Vector3(-1,1,0);
			} else if(angle === 'upLeftForward'){
				//Up Left Forward
				direction = new THREE.Vector3(-1,1,-1);
			} else if(angle === 'upLeftBackward'){
				//Up Left Backward
				direction = new THREE.Vector3(-1,1,1);
			} else if(angle === 'upForward'){
				//Up Forward
				direction = new THREE.Vector3(0,1,-1);
			} else if(angle === 'upBackward'){
				//Up Backward
				direction = new THREE.Vector3(0,1,1);
			} else if(angle === 'down'){
				//Down
				direction = new THREE.Vector3(0,-1,0);
			} else if(angle === 'downRight'){
				//Down Right
				direction = new THREE.Vector3(1,-1,0);
			} else if(angle === 'downRightForward'){
				//Down Right Forward
				direction = new THREE.Vector3(1,-1,-1);
			} else if(angle === 'downRightBackward'){
				//Down Right Backward
				direction = new THREE.Vector3(1,-1,1);
			} else if(angle === 'downLeft'){
				//Down Left
				direction = new THREE.Vector3(-1,-1,0);
			} else if(angle === 'downLeftForward'){
				//Down Left Forward
				direction = new THREE.Vector3(-1,-1,-1);
			} else if(angle === 'downLeftBackward'){
				//Down Left Backward
				direction = new THREE.Vector3(-1,-1,1);
			} else if(angle === 'downForward'){
				//Down Forward
				direction = new THREE.Vector3(0,-1,-1);
			} else if(angle === 'downBackward'){
				//Down Backward
				direction = new THREE.Vector3(0,-1,1);
			} else if(angle === 'right'){
				//Right
				direction = new THREE.Vector3(1,0,0);
			} else if(angle === 'rightForward'){
				//Right Forward
				direction = new THREE.Vector3(1,0,-1);
			} else if(angle === 'rightBackward'){
				//Right Backward
				direction = new THREE.Vector3(1,0,1);
			} else if(angle === 'left'){
				//Left
				direction = new THREE.Vector3(-1,0,0);
			} else if(angle === 'leftForward'){
				//Left Forward
				direction = new THREE.Vector3(-1,0,-1);
			} else if(angle === 'leftBackward'){
				//Left Backward
				direction = new THREE.Vector3(-1,0,1);
			} else if(angle === 'forward'){
				//Forward
				direction = new THREE.Vector3(0,0,-1);
			} else if(angle === 'backward'){
				//Backward
				direction = new THREE.Vector3(0,0,1);
			} else if(angle === 'random'){
				direction = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
			}

			return direction;
		}

		//Calc Force Vector and Spawn Position
		function prepForceSpawnVector(direction){

			let v = shootVector(direction);

			//Ensure even at 0 there is a slight offset
			if(v.x === 0){
				v.x += Math.random()*0.1-0.2;
			} else if(v.y === 0){
				v.y += Math.random()*0.1-0.2;
			} else if(v.z === 0){
				v.z += Math.random()*0.1-0.2;
			}

			//Slight Randomness off vector direction
			let vectorX = v.x += Math.random()*0.025-0.05;
			let vectorY = v.y += Math.random()*0.025-0.05;
			let vectorZ = v.z += Math.random()*0.025-0.05;
			let forceVector = new THREE.Vector3(vectorX,vectorY,vectorZ);

			let enemyPosition = object.object3D.position;

			//ensure that ammo spawn isn't within enemy, add additional distance
			let spawnXAdd = 0.5;
			let spawnYAdd = 0.5;
			let spawnZAdd = 0.5;
			if(enemyPosition.x < 0){
				spawnXAdd *= -1;
			}
			if(enemyPosition.y < 0){
				spawnYAdd *= -1;
			}
			if(enemyPosition.z < 0){
				spawnZAdd *= -1;
			}

			let posX = enemyPosition.x + vectorX + spawnXAdd;
			let posY = enemyPosition.y + vectorY + spawnYAdd;
			let posZ = enemyPosition.z + vectorZ + spawnZAdd;
			let spawnPos = new THREE.Vector3(posX,posY,posZ);

			return [forceVector,spawnPos];

		}

		//When to Start & Stop Firing Sequence
		//Delay - 0 -> 1000+
		//Player Body or Ammo Hit Trigger Collider
		//Large trigger colliders will splice with visible objects. Not ideal for covering large areas, maybe doorways though

		if(startTrigger){} else {
			let spawnTimeout = setTimeout(function () {
				object.emit('start',{});
				clearTimeout(spawnTimeout);
			}, fireDelay);
		}

		//Start Firing Sequence
		this.el.addEventListener('start', () => {
			fireInterval = setInterval(function() {
				object.emit('fire',{});
				//clearInterval(fireInterval);
			}, rateOfFire);
		});

		//Stop Firing Sequence
		this.el.addEventListener('stop', () => {
			clearInterval(fireInterval);
		});

        this.el.addEventListener('fire', ()=>{
			//prevent clicking until ammo has spawned and launched
			if(currentlySpawning){} else {
				currentlySpawning = true;

				//Pick a shoot direction
				if(random){}else{
					dirNum++;
					if(dirNum >= directionLoop.length-1){
						shuffle(directionLoop);
						dirNum = 0;
					}
					shootDirection = directionLoop[dirNum];
				}

				//Calculate Force Vector
				let vectors = prepForceSpawnVector(shootDirection);
				let forceVector = vectors[0];
				let ammoPos = vectors[1];
				//let handRotation = vectors[2];

				let ammo = document.createElement('a-entity');
				let htmlId;
				let ammoScale;
				let ammoRotation = new THREE.Vector3(0,0,0);
				let ammoMaterial;
				let ammoGeometry;
				let ammoRigidBody;
				let ammoShootForce;
				let ammoShootForceType;

				if(ammoType === 'z'){
					htmlId = ammoZTemplate.name + ammoSpawn;
					ammoScale = ammoZTemplate.scale;
					ammoRotation.x += ammoZTemplate.rotation.x;
					ammoRotation.y += ammoZTemplate.rotation.y;
					ammoRotation.z += ammoZTemplate.rotation.z;
					ammoMaterial = ammoZTemplate.material;
					ammoGeometry = ammoZTemplate.shape;
					ammoRigidBody = ammoZTemplate.rigidBodyProp;
					ammoShootForce = ammoZTemplate.shootForce;
					ammoShootForceType = ammoZTemplate.bounceType;
				} else if(ammoType === 'y'){
					htmlId = ammoYTemplate.name + ammoSpawn;
					ammoScale = ammoYTemplate.scale;
					ammoRotation.x += ammoYTemplate.rotation.x;
					ammoRotation.y += ammoYTemplate.rotation.y;
					ammoRotation.z += ammoYTemplate.rotation.z;
					ammoMaterial = ammoYTemplate.material;
					ammoGeometry = ammoYTemplate.shape;
					ammoRigidBody = ammoYTemplate.rigidBodyProp;
					ammoShootForce = ammoYTemplate.shootForce;
					ammoShootForceType = ammoYTemplate.bounceType;
				}

				if(document.getElementById(htmlId)){
					let oldAmmo = document.getElementById(htmlId);
					sceneEl.removeChild(oldAmmo);
				}
				ammo.setAttribute('id', htmlId);
				ammo.setAttribute('geometry', ammoGeometry);
				ammo.setAttribute('position', ammoPos);
				ammo.setAttribute('scale', ammoScale);
				ammo.setAttribute('rotation', ammoRotation);
				ammo.setAttribute('material', ammoMaterial);
				ammo.setAttribute('sq-rigidbody', ammoRigidBody);
				ammo.setAttribute('sq-collider',{});
				sceneEl.appendChild(ammo);

				//calc which allZAmmo array item holds the ammo type spawn num and update
				let ammoLocation;
				for(let a = 0; a < allEnemyAmmo.length; a++){
					if(allEnemyAmmo[a].type === ammoType){
						if(allEnemyAmmo[a].name === 'ammo'+ammoType+ammoSpawn){
							ammoLocation = a;
						}
					}
				}

				//Update allEnemyAmmo
				allEnemyAmmo[ammoLocation].id = document.getElementById(htmlId).object3D.id;
				allEnemyAmmo[ammoLocation].currentBounces = 0;
				allEnemyAmmo[ammoLocation].teleporting = false;

				if(forceVelocity){
					allEnemyAmmo[ammoLocation].xDirection = forceVector.x*allEnemyAmmo[ammoLocation].shootForce;
					allEnemyAmmo[ammoLocation].yDirection = forceVector.y*allEnemyAmmo[ammoLocation].shootForce;
					allEnemyAmmo[ammoLocation].zDirection = forceVector.z*allEnemyAmmo[ammoLocation].shootForce;
				}else{
					allEnemyAmmo[ammoLocation].xDirection = forceVector.x;
					allEnemyAmmo[ammoLocation].yDirection = forceVector.y;
					allEnemyAmmo[ammoLocation].zDirection = forceVector.z;
				}

				//Calc currently spawned
				if(ammoType === 'z'){
					if(ammoSpawn >= maxZAmmo-1){
						ammoSpawn = 0;
					} else {
						ammoSpawn++;
					}
				} else if(ammoType === 'y'){
					if(ammoSpawn >= maxYAmmo-1){
						ammoSpawn = 0;
					} else {
						ammoSpawn++;
					}
				}

				let forceTimeout = setTimeout(function () {
					if(forceVelocity){
						addForce({x: forceVector.x*allEnemyAmmo[ammoLocation].shootForce, y: forceVector.y*allEnemyAmmo[ammoLocation].shootForce, z: forceVector.z*allEnemyAmmo[ammoLocation].shootForce}, allEnemyAmmo[ammoLocation].bounceType, allEnemyAmmo[ammoLocation].id);
					}
					clearTimeout(forceTimeout);
				}, 50);
				let forceTimeout2 = setTimeout(function () {
					currentlySpawning = false;
					clearTimeout(forceTimeout2);
				}, 51);
			}
        });
    }
});

//Enemy Trigger Start
AFRAME.registerComponent('enemy-trigger-start', {
	schema: {
		id: {type: 'string', default: 'id'},
	},
    init: function() {
		const objectId = this.el.id;
		const enemyId = this.data.id;

		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
				document.getElementById(enemyId).emit('start',{});
			}
		});
    }
});

//Enemy Trigger Stop
AFRAME.registerComponent('enemy-trigger-stop', {
	schema: {
		id: {type: 'string', default: 'id'},
	},
    init: function() {
		const objectId = this.el.id;
		const enemyId = this.data.id;

		//
		//Event Listeners

		//Trigger Exit
		this.el.addEventListener('trigger-exit', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
				document.getElementById(enemyId).emit('stop',{});
			}
		});
    }
});

//Ammo Hit Ammo
AFRAME.registerComponent('ammo-hit-ammo', {
	schema: {
	},
    init: function() {
		const objectId = this.el.id;

		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}

			all0Ammo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){

//Can't access position of rigidbody objects, thus cannot add explosion force at location of impact

//Could do something like anim scale big to small fast to make them kind of bounce off each other

				}
			});


		});


    }
});

//Player Hitbox
AFRAME.registerComponent('player-hitbox', {
	schema: {
	},
    init: function() {
		const sceneEl = document.querySelector('a-scene');
		const objectId = this.el.id;
		const auxl = document.querySelector('a-scene').systems.auxl;
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer) {
				// This is the current player triggering
			}

			//listen for death cube hits
			for(let death in auxl.deathSpawned){
				//auxl.deathSpawned[death].obj.layer.all.child0.core.core.id
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === auxl.deathSpawned[death].obj.layer.all.child0.core.core.id){
					if(auxl[auxl.deathSpawned[death].obj.id].dead){} else {
						if(auxl[auxl.deathSpawned[death].obj.id].hit){}else{
							auxl[auxl.deathSpawned[death].obj.id].hit = true;
							player0.health-=4;
							playerHitAudio.play();
							//Health Scoreboard
							healthText = healthTextPrefix + player0.health;
							setText(healthTextId, healthText);
							setText(healthTextFloorId, healthText);
							if(player0.health <= 0){
								//Player Death
								gameControlObject.emit('level-fail');
							}
							let hitTimeout = setTimeout(function () {
								auxl[auxl.deathSpawned[death].obj.id].hit = false;
								clearTimeout(hitTimeout);
							}, 3000);
						}
					}
				}
			}

			allEnemyAmmo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){

					player0.health--;
					playerHitAudio.play();
					//Health Scoreboard
					healthText = healthTextPrefix + player0.health;
					setText(healthTextId, healthText);
					setText(healthTextFloorId, healthText);
					if(player0.health <= 0){
						//Player Death
						gameControlObject.emit('level-fail');
					}

					let despawnTimeout = setTimeout(function () {
						let oldAmmo = document.getElementById(ammo.name);
						sceneEl.removeChild(oldAmmo);
						clearTimeout(despawnTimeout);
					}, 50);

				}
			});
		});
    }
});

//Hit Target & Kill Ammo
AFRAME.registerComponent('targethit', {
init: function () {

	const sceneEl = document.querySelector('a-scene');

	const objectId = this.el.id;

	//Trigger Notifier
	const triggerDisplay = document.querySelector('#triggerDisplay');
	const testMaterial = {shader: "flat", color: "black"};
	function updateTriggerDisplayColor(color){
		testMaterial.color = color;
		triggerDisplay.setAttribute('material',testMaterial);
	}

	//
	//Event Listeners

	//Trigger Enter
	this.el.addEventListener('trigger-enter', () => {
		if(this.el.object3D.userData.isLocalPlayer ) {
			// This is the current player triggering
		}
		all0Ammo.forEach((ammo) => {
			if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
				updateTriggerDisplayColor('green');
				let despawnTimeout = setTimeout(function () {
					let oldAmmo = document.getElementById(ammo.name);
					sceneEl.removeChild(oldAmmo);
					clearTimeout(despawnTimeout);
				}, 100);
				let despawnTimeout2 = setTimeout(function () {
					updateTriggerDisplayColor('red');
					clearTimeout(despawnTimeout2);
				}, 1000);
			}
		});
	});
	/*
	//Trigger Exit
	this.el.addEventListener('trigger-exit', () => {
		if(this.el.object3D.userData.isLocalPlayer) {
			// This is the current player exiting
		}
		if(this.el.id === objectId && this.el.object3D.userData.other.id === "ammo0"){
			//do something on exit
			updateTriggerDisplayColor('red');
		}
	});*/
}
});

//Wall Bounce Left All
AFRAME.registerComponent('wall-bounce-left-all', {
    init: function() {
		const wall = this.el.id;
		const sceneEl = document.querySelector('a-scene');
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === wall &&  this.el.object3D.userData.other.id === ammo.name){
					ammo.xDirection = directionBounce*-1;
					addForce({x: ammo.wallBounce*-1, y: ammo.yDirection, z: ammo.zDirection}, ammo.bounceType, ammo.id);
					ammo.currentBounces++;
					if(ammo.currentBounces >= ammo.maxBounces){
						sceneEl.removeChild(document.getElementById(ammo.name))
					}

				}
			});
		});
    }
});

//Wall Bounce Right All
AFRAME.registerComponent('wall-bounce-right-all', {
    init: function() {
		const wall = this.el.id;
		const sceneEl = document.querySelector('a-scene');
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === wall &&  this.el.object3D.userData.other.id === ammo.name){
					ammo.xDirection = directionBounce;
					addForce({x: ammo.wallBounce, y: ammo.yDirection, z: ammo.zDirection}, ammo.bounceType, ammo.id);
					ammo.currentBounces++;
					if(ammo.currentBounces >= ammo.maxBounces){
						sceneEl.removeChild(document.getElementById(ammo.name))
					}
				}
			});
		});
    }
});

//Wall Bounce Up All
AFRAME.registerComponent('wall-bounce-up-all', {
	schema: {
		position: {type: 'string', default: 'center'},
	},
    init: function() {
		const wall = this.el.id;
		const sceneEl = document.querySelector('a-scene');
		let position = this.data.position;
		let direction;

		if(position === 'left'){
			direction = directionBounce/3;
		} else if (position === 'right'){
			direction = directionBounce/3*-1;
		} else {
			direction = 0;
		}

		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === wall && this.el.object3D.userData.other.id === ammo.name){
					if(ammo.zDirection > 0){
						if(position === 'left'){
							direction = directionBounce/3;
						} else if(position === 'right'){
							direction = directionBounce/3*-1;
						} else {
							direction = 0;
						}
					} else {
						if(position === 'left'){
							direction = directionBounce/3*-1;
						} else if(position === 'right'){
							direction = directionBounce/3;
						} else {
							direction = 0;
						}
					}
					ammo.yDirection = directionBounce;
					addForce({x: ammo.xDirection + direction, y: ammo.wallBounce, z: ammo.zDirection}, ammo.bounceType, ammo.id);
					ammo.currentBounces++;
					if(ammo.currentBounces >= ammo.maxBounces){
						sceneEl.removeChild(document.getElementById(ammo.name))
					}
				}
			});
		});
    }
});

//Wall Bounce Down All
AFRAME.registerComponent('wall-bounce-down-all', {
	schema: {
		position: {type: 'string', default: 'center'},
	},
    init: function() {
		const wall = this.el.id;
		const sceneEl = document.querySelector('a-scene');
		let position = this.data.position;
		let direction;

		if(position === 'left'){
			direction = directionBounce/3;
		} else if(position === 'right'){
			direction = directionBounce/3*-1;
		} else {
			direction = 0;
		}

		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === wall &&  this.el.object3D.userData.other.id === ammo.name){
					if(ammo.zDirection > 0){
						if(position === 'left'){
							direction = directionBounce/3;
						} else if(position === 'right'){
							direction = directionBounce/3*-1;
						} else {
							direction = 0;
						}
					} else {
						if(position === 'left'){
							direction = directionBounce/3*-1;
						} else if(position === 'right'){
							direction = directionBounce/3;
						} else {
							direction = 0;
						}
					}
					ammo.yDirection = directionBounce*-1;
					addForce({x: ammo.xDirection + direction, y: ammo.wallBounce*-1, z: ammo.zDirection}, ammo.bounceType, ammo.id);
					ammo.currentBounces++;
					if(ammo.currentBounces >= ammo.maxBounces){
						sceneEl.removeChild(document.getElementById(ammo.name))
					}
				}
			});
		});
    }
});

//Wall Bounce Back All
AFRAME.registerComponent('wall-bounce-back-all', {
    init: function() {
		const wall = this.el.id;
		const sceneEl = document.querySelector('a-scene');
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === wall &&  this.el.object3D.userData.other.id === ammo.name){
					//do something
					ammo.zDirection = directionBounce;
					addForce({x: 0, y: 0, z: ammo.wallBounce}, ammo.bounceType, ammo.id);
					ammo.currentBounces++;
					if(ammo.currentBounces >= ammo.maxBounces){
						sceneEl.removeChild(document.getElementById(ammo.name))
					}
				}
			});
		});
    }
});

//Wall Bounce Forward All
AFRAME.registerComponent('wall-bounce-forward-all', {
    init: function() {
		const wall = this.el.id;
		const sceneEl = document.querySelector('a-scene');
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === wall &&  this.el.object3D.userData.other.id === ammo.name){
					//do something
					ammo.zDirection = directionBounce*-1;
					addForce({x: 0, y: 0, z: ammo.wallBounce*-1}, ammo.bounceType, ammo.id);
					ammo.currentBounces++;
					if(ammo.currentBounces >= ammo.maxBounces){
						sceneEl.removeChild(document.getElementById(ammo.name))
					}
				}
			});
		});
    }
});

//Block Bounce X Left-Right All
AFRAME.registerComponent('block-bounce-x-all', {
	schema: {
		position: {type: 'string', default: 'right'},
	},
    init: function() {
		const objectId = this.el.id;
		const position = this.data.position;
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					if(ammo.xDirection < 0){
						ammo.xDirection = directionBounce;
						addForce({x: ammo.blockBounce, y: ammo.yDirection, z: ammo.zDirection}, ammo.bounceType, ammo.id);
					} else if(ammo.xDirection > 0){
						ammo.xDirection = directionBounce*-1;
						addForce({x: ammo.blockBounce*-1, y: ammo.yDirection, z: ammo.zDirection}, ammo.bounceType, ammo.id);
					} else {
						if(position === 'right'){
							ammo.xDirection = directionBounce;
							addForce({x: ammo.blockBounce, y: ammo.yDirection, z: ammo.zDirection}, ammo.bounceType, ammo.id);
						} else if(position === 'left'){
							ammo.xDirection = directionBounce*-1;
							addForce({x: ammo.blockBounce*-1, y: ammo.yDirection, z: ammo.zDirection}, ammo.bounceType, ammo.id);
						}
					}
					ammo.currentBounces++;
					if(ammo.currentBounces >= ammo.maxBounces){
						sceneEl.removeChild(document.getElementById(ammo.name))
					}
				}
			});
		});
    }
});

//Block Bounce Y Up-Down All
AFRAME.registerComponent('block-bounce-y-all', {
	schema: {
		position: {type: 'string', default: 'top'},
	},
    init: function() {
		const objectId = this.el.id;
		const position = this.data.position;
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					if(ammo.yDirection < 0){
						ammo.yDirection = directionBounce;
						addForce({x: ammo.xDirection, y: ammo.blockBounce, z: ammo.zDirection}, ammo.bounceType, ammo.id);
					} else if(ammo.yDirection > 0){
						ammo.yDirection = directionBounce*-1;
						addForce({x: ammo.xDirection, y: ammo.blockBounce*-1, z: ammo.zDirection}, ammo.bounceType, ammo.id);
					} else {
						if(position === 'top'){
							ammo.yDirection = directionBounce;
							addForce({x: ammo.xDirection, y: ammo.blockBounce, z: ammo.zDirection}, ammo.bounceType, ammo.id);
						} else if(position === 'bottom'){
							ammo.yDirection = directionBounce*-1;
							addForce({x: ammo.xDirection, y: ammo.blockBounce*-1, z: ammo.zDirection}, ammo.bounceType, ammo.id);
						}
					}
					ammo.currentBounces++;
					if(ammo.currentBounces >= ammo.maxBounces){
						sceneEl.removeChild(document.getElementById(ammo.name))
					}
				}
			});
		});
    }
});

//Block Bounce Z Forward-Backward All
AFRAME.registerComponent('block-bounce-z-all', {
	schema: {
		position: {type: 'string', default: 'forward'},
	},
    init: function() {
		const objectId = this.el.id;
		const position = this.data.position;
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}

			allAmmo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					if(ammo.zDirection < 0){
						ammo.zDirection = directionBounce;
						addForce({x: ammo.xDirection, y: ammo.yDirection, z: ammo.blockBounce}, ammo.bounceType, ammo.id);
					} else if(ammo.zDirection > 0){
						ammo.zDirection = directionBounce*-1;
						addForce({x: ammo.xDirection, y: ammo.yDirection, z: ammo.blockBounce*-1}, ammo.bounceType, ammo.id);
					} else {
						if(position === 'forward'){
							ammo.zDirection = directionBounce;
							addForce({x: ammo.xDirection, y: ammo.yDirection, z: ammo.blockBounce}, ammo.bounceType, ammo.id);
						} else if(position === 'backward'){
							ammo.zDirection = directionBounce*-1;
							addForce({x: ammo.xDirection, y: ammo.yDirection, z: ammo.blockBounce*-1}, ammo.bounceType, ammo.id);
						}
					}
					ammo.currentBounces++;
					if(ammo.currentBounces >= ammo.maxBounces){
						sceneEl.removeChild(document.getElementById(ammo.name))
					}
				}
			});
		});
    }
});

//Hit Block X Times, Change Color until Disappear
AFRAME.registerComponent('block-hits', {
schema: {
	hits: {type: 'number', default: 1},
	rigidBody: {type: 'string', default: 'blank'},
	isChild: {type: 'bool', default: false},
	objective: {type: 'bool', default: true},
},
init: function () {
	const sceneEl = document.querySelector('a-scene');

	const objectId = this.el.id;
	const self = this.el;
	let parent;
	let isChild = this.data.isChild;
	let objective = this.data.objective;
	let selfRigid;
	let removeExtra = false;
	if(this.data.rigidBody !== 'blank'){
		selfRigid = document.getElementById(this.data.rigidBody);
		removeExtra = true;
	}
	let currentLife = this.data.hits;

	const blockMaterial = {shader: "flat", color: "grey", opacity: 1, src: '#pattern46'};

	function setColor(color){
		blockMaterial.color = color;
		self.setAttribute('material',blockMaterial);
	}

	function updateLife(){
		currentLife -= player0.dmg;
		otherHitAudio.play();
		if(currentLife <= 0){
			otherDeathAudio.play();
			if(objective){
				levelObjectives--;
				gamePoints += (5 * currentLevel);
				pointsText = pointsTextPrefix + gamePoints;
				setText(pointsTextId, pointsText);
				setText(pointsTextFloorId, pointsText);
				objectivesText = objectivesTextPrefix + levelObjectives;
				setText(objectivesTextId, objectivesText);
				setText(objectivesTextFloorId, objectivesText);
				if(levelObjectives <= 0){
					//emit level-complete
					gameControlObject.emit('level-complete');
				}
			}
			if(isChild){
				//removing the child first removes and halts this
				//selfRigid.removeChild(self);
				sceneEl.removeChild(selfRigid);
			} else {
				if(removeExtra){
					self.removeChild(selfRigid);
				}
				sceneEl.removeChild(self);
			}
		} else if(currentLife === 1){
			setColor('red');
		} else if(currentLife === 2){
			setColor('orange');
		} else if(currentLife === 3){
			setColor('yellow');
		} else if(currentLife === 4){
			setColor('green');
		} else if(currentLife === 5){
			setColor('blue');
		} else if(currentLife === 6){
			setColor('indigo');
		} else if(currentLife === 7){
			setColor('violet');
		} else {
			setColor('grey');
		}
	}
	//Add a life to offset updateLife take away and set color
	currentLife++;
	updateLife();
	if(objective){
		levelObjectives++;
		//Objectives Scoreboard
		objectivesText = objectivesTextPrefix + levelObjectives;
		setText(objectivesTextId, objectivesText);
		setText(objectivesTextFloorId, objectivesText);
	}

	//
	//Event Listeners

	//Trigger Enter
	this.el.addEventListener('trigger-enter', () => {
		if(this.el.object3D.userData.isLocalPlayer ) {
			// This is the current player triggering
		}
		all0Ammo.forEach((ammo) => {
			if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
				let oldAmmo = document.getElementById(ammo.name);
				sceneEl.removeChild(oldAmmo);
				updateLife();
			}
		});
	});
}
});

//Death Hits
AFRAME.registerComponent('death-hits', {
schema: {
	objName: {type: 'string', default: 'death1'},
	hits: {type: 'number', default: 1},
	rigidBody: {type: 'string', default: 'blank'},
	isChild: {type: 'bool', default: false},
},
init: function () {
	const sceneEl = document.querySelector('a-scene');
	const auxl = document.querySelector('a-scene').systems.auxl;
	const objName = this.data.objName;
	const objectId = this.el.id;
	const self = this.el;
	let parent;
	let isChild = this.data.isChild;
	let selfRigid;
	let removeExtra = false;
	if(this.data.rigidBody !== 'blank'){
		selfRigid = document.getElementById(this.data.rigidBody);
		removeExtra = true;
	}
	let currentLife = this.data.hits;

	let blockMaterial = {shader: "flat", color: "grey", opacity: 1, src: '#pattern34'};

	function setColor(color){
		blockMaterial.color = color;
		self.setAttribute('material',blockMaterial);
	}

	function updateLife(){
		currentLife -= player0.dmg;
		otherHitAudio.play();
		if(currentLife <= 0){
			otherDeathAudio.play();
			blockMaterial.opacity = 0.25;
			setColor('black');
			auxl[objName].TempDeath();
			let tempDeathTimeout = setTimeout(function () {
				blockMaterial.opacity = 1;
				currentLife = 8;
				updateLife();
				clearTimeout(tempDeathTimeout);
			}, 15010);

		} else if(currentLife === 1){
			setColor('red');
		} else if(currentLife === 2){
			setColor('orange');
		} else if(currentLife === 3){
			setColor('yellow');
		} else if(currentLife === 4){
			setColor('green');
		} else if(currentLife === 5){
			setColor('blue');
		} else if(currentLife === 6){
			setColor('indigo');
		} else if(currentLife === 7){
			setColor('violet');
		} else {
			setColor('violet');
		}
	}
	//Add a life to offset updateLife take away and set color
	//currentLife++; start at 7
	updateLife();
	//
	//Event Listeners

	//Trigger Enter
	this.el.addEventListener('trigger-enter', () => {
		if(this.el.object3D.userData.isLocalPlayer ) {
			// This is the current player triggering
		}
		all0Ammo.forEach((ammo) => {
			if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
				let oldAmmo = document.getElementById(ammo.name);
				sceneEl.removeChild(oldAmmo);
				updateLife();
			}
		});
	});
}
});

//Hit Enemy X Times, Change Color until Disappear
AFRAME.registerComponent('enemy-hits', {
dependencies: ['auxl'],
schema: {
	objName: {type: 'string', default: 'enemy1All'},
	hits: {type: 'number', default: 1},
	rigidBody: {type: 'string', default: 'blank'},
	isChild: {type: 'bool', default: false},
	enemyName: {type: 'string', default: 'id'},
	enemyType: {type: 'string', default: 'z'},
},
init: function () {
	const sceneEl = document.querySelector('a-scene');
	const auxl = document.querySelector('a-scene').systems.auxl;
	const objName = this.data.objName;
	const objectId = this.el.id;
	const self = this.el;
	let parent;
	let isChild = this.data.isChild;
	let enemyType = this.data.enemyType;
	let enemyName = this.data.enemyName;
	let selfRigid;
	let removeExtra = false;
	if(this.data.rigidBody !== 'blank'){
		selfRigid = document.getElementById(this.data.rigidBody);
		removeExtra = true;
	}
	let currentLife = this.data.hits;

	const blockMaterial = {shader: "flat", color: "black", opacity: 1};
	function setColor(color){
		blockMaterial.color = color;
		self.setAttribute('material',blockMaterial);
	}

	function updateLife(){
		currentLife -= player0.dmg;
		otherHitAudio.play();
		if(currentLife <= 0){
			//Dead
			otherDeathAudio.play();
			gamePoints += (10 * currentLevel);
			pointsText = pointsTextPrefix + gamePoints;
			setText(pointsTextId, pointsText);
			setText(pointsTextFloorId, pointsText);
			let checkBonus = Math.floor(Math.random()*100);
			let spawnBonus = 25 + currentLevel;
			let checkOrder = Math.floor(Math.random()*100);
			if(checkBonus <= spawnBonus){
				if(checkOrder >= 0 && checkOrder < 33){
					if(pickUpHealthActive){
						auxl.powerHealth.Spawn();
					} else if(pickUpBonusActive){
						auxl.powerBonus.Spawn();
					} else if(pickUpPowerActive){
						auxl.powerDamage.Spawn();
					}
				} else if(checkOrder >= 34 && checkOrder < 77){
					if(pickUpPowerActive){
						auxl.powerDamage.Spawn();
					} else if(pickUpHealthActive){
						auxl.powerHealth.Spawn();
					} else if(pickUpBonusActive){
						auxl.powerBonus.Spawn();
					}
				} else if(checkOrder >= 77 && checkOrder <= 100){
					if(pickUpBonusActive){
						auxl.powerBonus.Spawn();
					} else if(pickUpPowerActive){
						auxl.powerDamage.Spawn();
					} else if(pickUpHealthActive){
						auxl.powerHealth.Spawn();
					}
				}
			}
			auxl[objName].Death();
		} else if(currentLife === 1){
			setColor('red');
		} else if(currentLife === 2){
			setColor('orange');
		} else if(currentLife === 3){
			setColor('yellow');
		} else if(currentLife === 4){
			setColor('green');
		} else if(currentLife === 5){
			setColor('blue');
		} else if(currentLife === 6){
			setColor('indigo');
		} else if(currentLife === 7){
			setColor('violet');
		} else {
			setColor('grey');
		}
	}
	//Add a life to offset updateLife take away and set color
	currentLife++;
	updateLife();

	//
	//Event Listeners

	//Trigger Enter
	this.el.addEventListener('trigger-enter', () => {
		if(this.el.object3D.userData.isLocalPlayer ) {
			// This is the current player triggering
		}
		all0Ammo.forEach((ammo) => {
			if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
				let oldAmmo = document.getElementById(ammo.name);
				sceneEl.removeChild(oldAmmo);
				updateLife();
			}
		});
	});
}
});

//Destroy Enemy Ammo
AFRAME.registerComponent('destory-enemy-ammo', {
	schema: {
	},
    init: function() {
		const sceneEl = document.querySelector('a-scene');
		const objectId = this.el.id;

		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer) {
				// This is the current player triggering
			}

			allEnemyAmmo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					//Destory Ammo
					let oldAmmo = document.getElementById(ammo.name);
					sceneEl.removeChild(oldAmmo);

				}
			});
		});
    }
});

//Passthrough Speed Up
AFRAME.registerComponent('speedup', {
    init: function() {
		const objectId = this.el.id;
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === objectId && this.el.object3D.userData.other.id === ammo.name){
				addForce({x: ammo.xDirection*2, y: ammo.yDirection*2, z: ammo.zDirection*2}, ammo.bounceType, ammo.id);
				}
			});
		});
    }
});

//Explode Force Ammo
AFRAME.registerComponent('explode-ammo', {
    init: function() {
		const object = this.el;
		const objectId = this.el.id;

		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === objectId && this.el.object3D.userData.other.id === ammo.name){
					addExplosionForce(400, object.object3D.position, 2, ammo.id)
					//Ammo will die on next bounce
					ammo.currentBounces = 100;
				}
			});
		});
    }
});

//Show Hidden
AFRAME.registerComponent('showhidden', {
    init: function() {
		const objectId = this.el.id;
		const self = this.el;

		const material1 = {shader: "flat", color: "#000001", opacity: 1};
		const material2 = {shader: "flat", color: "#000000", opacity: 0};
		function setMaterial(material){
			self.setAttribute('material',material);
		}
		let displayTimeout; 

		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			all0Ammo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					clearTimeout(displayTimeout);
					//self.emit('test',{});
					setMaterial(material1);
					displayTimeout = setTimeout(function () {
						setMaterial(material2);
						clearTimeout(displayTimeout);
					}, 10000);
				}
			});
		});
    }
});

//Omni Ammo Portal One Way
AFRAME.registerComponent('omni-ammo-portal-to', {
schema: {
	to: {type: 'string', default: 'id'},
},
    init: function() {
		const objectId = this.el.id;
		let connect = this.data.to;
		let exit;
		let exitPos = new THREE.Vector3(0,0,0);
		//Delay to let all Portals load before getting info
		let systemTimeout = setTimeout(function () {
			exit = document.getElementById(connect);
			exitPos.copy(exit.object3D.position);
		clearTimeout(systemTimeout);
		}, 1000);
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					exitPos.z += 0.001;
					movePosition(exitPos, ammo.id);
				}
			});
		});
    }
});

//Omni Ammo Portal Two Way
AFRAME.registerComponent('omni-ammo-portal', {
schema: {
	connect: {type: 'string', default: 'id'},
},
    init: function() {
		const objectId = this.el.id;
		let connect = this.data.connect;
		let exit;
		let exitPos = new THREE.Vector3(0,0,0);
		//Delay to let all Portals load before getting info
		let systemTimeout = setTimeout(function () {
			exit = document.getElementById(connect);
			exitPos.copy(exit.object3D.position);
		clearTimeout(systemTimeout);
		}, 1000);
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			allAmmo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					if(ammo.teleporting){}else{
						ammo.teleporting = true;
						exitPos.z += 0.001;
						movePosition(exitPos, ammo.id);
						let portalTimeout = setTimeout(function () {
							ammo.teleporting = false;
							clearTimeout(portalTimeout);
						}, 1000);
					}
				}
			});
		});
    }
});

//Player Portal Two Way
AFRAME.registerComponent('player-portal', {
schema: {
	connect: {type: 'string', default: 'id'},
	exitDirection: {type: 'string', default: 'backward'},
},
    init: function() {
		const objectId = this.el.id;
		let connect = this.data.connect;
		let exitDirection = this.data.exitDirection;
		let exit;
		let exitPos = new THREE.Vector3(0,0,0);
//Delay to let all Portals load before getting info
let systemTimeout = setTimeout(function () {
//Unity Position Conversion: x, y, -z
//Required when using Banter functions
	exit = document.getElementById(connect);
	exitPos.copy(exit.object3D.position);
	if(exitDirection === 'forward'){
		exitPos.z += 0.5;
	} else if(exitDirection === 'backward'){
		exitPos.z -= 0.5;
	} else if(exitDirection === 'right'){
		exitPos.x += 0.5;
	} else if(exitDirection === 'left'){
		exitPos.x -= 0.5;
	} else if(exitDirection === 'up'){
		exitPos.y += 0.5;
	} else if(exitDirection === 'down'){
		exitPos.y -= 0.5;
	}
	exitPos.z *= -1;
clearTimeout(systemTimeout);
}, 1000);

		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
				if(player0.teleporting){}else{
					player0.teleporting = true;
					if(exitDirection === 'forward'){
						exitPos.z += 0.001;
					} else if(exitDirection === 'backward'){
						exitPos.z -= 0.001;
					} else if(exitDirection === 'right'){
						exitPos.x += 0.001;
					} else if(exitDirection === 'left'){
						exitPos.x -= 0.001;
					} else if(exitDirection === 'up'){
						exitPos.y += 0.001;
					} else if(exitDirection === 'down'){
						exitPos.y -= 0.001;
					}
					movePlayer(exitPos);
					portalAudio.play();
					let portalTimeout = setTimeout(function () {
						player0.teleporting = false;
						clearTimeout(portalTimeout);
					}, 1000);
				}
			}

		});

    },
});

//Move on Hit - Loop back to Original Position
AFRAME.registerComponent('hit-move', {
schema: {
	object: {type: 'string', default: 'id'},
	direction: {type: 'string', default: 'back'},
	move: {type: 'number', default: 0.1},
	loop: {type: 'number', default: 1},
},
    init: function() {
		const objectId = this.el.id;
		let ogPosition = document.getElementById(this.data.object).object3D.position;
		let newPosition = new THREE.Vector3(0,0,0);
		newPosition.copy(ogPosition);
		const direction = this.data.direction;
		const move = this.data.move;
		let loop = this.data.loop;
		let currentLoop = 0;
		//forward
		//backward
		//up
		//down
		//left
		//right

		function positionToMove(){
			if(direction === 'back'){
				newPosition.z -= move;
			} else if(direction === 'forward'){
				newPosition.z += move;
			} else if(direction === 'up'){
				newPosition.y += move;
			} else if(direction === 'down'){
				newPosition.y -= move;
			} else if(direction === 'left'){
				newPosition.x -= move;
			} else if(direction === 'right'){
				newPosition.x += move;
			}
		}


		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			all0Ammo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					if(currentLoop < loop){
						currentLoop++;
						positionToMove();
						movePosition(newPosition, objectId);
					} else {
						currentLoop = 0;
						movePosition(ogPosition, objectId);
						newPosition.copy(ogPosition);
					}
				}
			});
		});
    }
});

//Ammo  Toggles

//Right Arm - Toggle 0/1/4
//Toggle 0 - Ammo 0
AFRAME.registerComponent('arm-toggle0', {
    init: function() {
		const objectId = this.el.id;
		const aimShooter = document.getElementById('aimShooter');
		let toggling = false;
		let enabledMaterial = {shader: 'flat', color: 'cyan', opacity: 0.1, side: 'double'};
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			if(this.el.id === objectId &&  this.el.object3D.userData.other.id === 'leftHandTrigger'){
				if(toggling){}else{
					toggling = true;
					//Ammo 0
					current0AmmoType = 0;
					aimShooter.setAttribute('material',enabledMaterial);
					let timeout = setTimeout(function () {
						toggling = false;
						clearTimeout(timeout);
					}, 1000);
				}
			}
		});
    }
});
//Toggle 1 - Ammo 1
AFRAME.registerComponent('arm-toggle1', {
    init: function() {
		const objectId = this.el.id;
		const aimShooter = document.getElementById('aimShooter');
		let toggling = false;
		let enabledMaterial = {shader: 'flat', color: 'lime', opacity: 0.1, side: 'double'};
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			if(this.el.id === objectId &&  this.el.object3D.userData.other.id === 'leftHandTrigger'){
				if(toggling){}else{
					toggling = true;
					//Ammo 1
					current0AmmoType = 1;
					aimShooter.setAttribute('material',enabledMaterial);
					let timeout = setTimeout(function () {
						toggling = false;
						clearTimeout(timeout);
					}, 1000);
				}
			}
		});
    }
});
//Toggle 4 - Ammo 4
AFRAME.registerComponent('arm-toggle4', {
    init: function() {
		const objectId = this.el.id;
		const aimShooter = document.getElementById('aimShooter');
		let toggling = false;
		let enabledMaterial = {shader: 'flat', color: 'red', opacity: 0.1, side: 'double'};
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			if(this.el.id === objectId &&  this.el.object3D.userData.other.id === 'rightHandTrigger'){
				if(toggling){}else{
					toggling = true;
					//Ammo 4
					current0AmmoType = 4;
					aimShooter.setAttribute('material',enabledMaterial);
					let timeout = setTimeout(function () {
						toggling = false;
						clearTimeout(timeout);
					}, 1000);
				}
			} else if(this.el.id === objectId &&  this.el.object3D.userData.other.id === 'leftHandTrigger'){
				if(toggling){}else{
					//Ammo 4
					toggling = true;
					current0AmmoType = 4;
					aimShooter.setAttribute('material',enabledMaterial);
					let timeout = setTimeout(function () {
						toggling = false;
						clearTimeout(timeout);
					}, 1000);
				}
			}
		});
    }
});

//Left Arm - Toggle 2/3/5
//Toggle 2 - Ammo 2
AFRAME.registerComponent('arm-toggle2', {
    init: function() {
		const objectId = this.el.id;
		const aimShooter = document.getElementById('aimShooter');
		let toggling = false;
		let enabledMaterial = {shader: 'flat', color: 'yellow', opacity: 0.1, side: 'double'};
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			if(this.el.id === objectId &&  this.el.object3D.userData.other.id === 'rightHandTrigger'){
				if(toggling){}else{
					toggling = true;
					//Ammo 2
					current0AmmoType = 2;
					aimShooter.setAttribute('material',enabledMaterial);
					let timeout = setTimeout(function () {
						toggling = false;
						clearTimeout(timeout);
					}, 1000);
				}
			}
		});
    }
});
//Toggle 3 - Ammo 3
AFRAME.registerComponent('arm-toggle3', {
    init: function() {
		const objectId = this.el.id;
		const aimShooter = document.getElementById('aimShooter');
		let toggling = false;
		let enabledMaterial = {shader: 'flat', color: 'magenta', opacity: 0.1, side: 'double'};
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			if(this.el.id === objectId &&  this.el.object3D.userData.other.id === 'rightHandTrigger'){
				if(toggling){}else{
					toggling = true;
					//Ammo 3
					current0AmmoType = 3;
					aimShooter.setAttribute('material',enabledMaterial);
					let timeout = setTimeout(function () {
						toggling = false;
						clearTimeout(timeout);
					}, 1000);
				}
			}
		});
    }
});
//Toggle 5 - Ammo 5
AFRAME.registerComponent('arm-toggle5', {
    init: function() {
		const objectId = this.el.id;
		const aimShooter = document.getElementById('aimShooter');
		let toggling = false;
		let enabledMaterial = {shader: 'flat', color: 'grey', opacity: 0.1, side: 'double'};
		//
		//Event Listeners

		//Trigger Enter
		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			if(this.el.id === objectId &&  this.el.object3D.userData.other.id === 'rightHandTrigger'){
				if(toggling){}else{
					toggling = true;
					//Ammo 5
					current0AmmoType = 5;
					aimShooter.setAttribute('material',enabledMaterial);
					let timeout = setTimeout(function () {
						toggling = false;
						clearTimeout(timeout);
					}, 1000);
				}
			} else if(this.el.id === objectId &&  this.el.object3D.userData.other.id === 'leftHandTrigger'){
				if(toggling){}else{
					toggling = true;
					//Ammo 5
					current0AmmoType = 5;
					aimShooter.setAttribute('material',enabledMaterial);
					let timeout = setTimeout(function () {
						toggling = false;
						clearTimeout(timeout);
					}, 1000);
				}
			}
		});
    }
});

//
//Attach to Player
AFRAME.registerComponent('self-attach', {
    schema: {
        position: {type: 'vec3'},
    },
    init: function () {
        //Do something when component first attached.
        //Thing To Attach
        this.attachee = document.getElementById(this.el.id);
        //Empty Pos Vec3
        this.offset = new THREE.Vector3();
		if(this.data.position){
			this.offset.copy(this.data.position);
		} else {
        	this.offset.copy(this.attachee.object3D.position);
		}
        this.newPosVec3 = new THREE.Vector3();

		//Delay Adding til Banter system loads
		this.ready = false;
		this.count = 0;
    },

    update: function () {
        //Do something when component's data is updated.
    },

    remove: function () {
        //Do something the component or its entity is detached.
    },

    tick: function (time, timeDelta) {
        //Do something on every scene tick or frame.

		//this.attached();

		if(this.ready){
        	this.attached();
		} else {
			this.count++;
			if(this.count >= 300){
				this.ready = true;
				//Prep Player Object
				
				//Debug
				//console.log('Load Body Attachment');
			}
		}

    },

    attached: function () {
        //attached
        //Clone current the entity this component is attached to's position
		//console.log(this.el.object3D.position);
        this.newPosVec3.copy(window.userinputs.head.position);

        //Offsets
        this.newPosVec3.x += this.offset.x;
        this.newPosVec3.y += this.offset.y;
        this.newPosVec3.z += this.offset.z;
        //Set position for UI at 3js level for speed!
        this.attachee.object3D.position.copy(this.newPosVec3);

    },
});

//Move to Node
AFRAME.registerComponent('movetonode', {
	dependencies: ['auxl'],
schema: {
	currentZone: {type: 'string', default: 'zone0'},
	to: {type: 'string', default: 'connect0'},
	playerPosX: {type: 'number', default: 0},
	playerPosY: {type: 'number', default: 0},
	playerPosZ: {type: 'number', default: 0},
},
    init: function () {
        //Do something when component first attached.
		//console.log('clickrun attached');
		const sceneEl = document.querySelector('a-scene');
		this.auxl = document.querySelector('a-scene').systems.auxl;
		const object = this.el;
		const objectId = this.el.id;
		let playerPosX = this.data.playerPosX;
		let playerPosY = this.data.playerPosY;
		let playerPosZ = this.data.playerPosZ;
		let playerPos = new THREE.Vector3(playerPosX, playerPosY, playerPosZ);

		const currentZone = this.data.currentZone;
		const to = this.data.to;

		this.el.addEventListener('trigger-enter', () => {
			if(this.el.object3D.userData.isLocalPlayer ) {
				// This is the current player triggering
			}
			all0Ammo.forEach((ammo) => {
				if(this.el.id === objectId && this.el.object3D.userData.other.id === ammo.name){
					//remove all ammo
					removeSpanwedAllAmmo(sceneEl)
					lockPlayer();
					this.auxl[currentZone].Move(to);
					movePlayer(playerPos);
					unlockPlayer();
				}
			});
		});

    },//End initialization Function
});

//Start|Restart Game
//GameControlObject
AFRAME.registerComponent('game-start', {
	dependencies: ['auxl'],
    init: function() {
		const sceneEl = document.querySelector('a-scene');
		const auxl = document.querySelector('a-scene').systems.auxl;
		gameControlObject = this.el;

		gameControlMaterial = {shader: 'flat', color: 'white', src: '#pattern16'}
		let gameControlPos = new THREE.Vector3(-4.5,1.25,25.5);
		let powerTimeout;

		function updateColor(color){
			gameControlMaterial.color = color;
			gameControlObject.setAttribute('material',gameControlMaterial)
		}

		function resetPos(){
			gameControlObject.setAttribute('position',gameControlPos);
		}

		startBackgroundMusic();

let systemTimeout = setTimeout(function () {
	infoTextId = document.getElementById('infoText').object3D.id;
	infoTextFloorId = document.getElementById('infoTextFloor').object3D.id;
	levelTextId = document.getElementById('levelText').object3D.id;
	levelTextFloorId = document.getElementById('levelTextFloor').object3D.id;
	pointsTextId = document.getElementById('pointsText').object3D.id;
	objectivesTextFloorId = document.getElementById('objectivesTextFloor').object3D.id;
	objectivesTextId = document.getElementById('objectivesText').object3D.id;
	pointsTextFloorId = document.getElementById('pointsTextFloor').object3D.id;
	healthTextId = document.getElementById('healthText').object3D.id;
	healthTextFloorId = document.getElementById('healthTextFloor').object3D.id;

	//Game Info
	//Game Info
	infoText = 'Game Ready';
	setText(infoTextId, infoText);
	setText(infoTextFloorId, infoText);
	//Level Scoreboard
	levelText = levelTextPrefix + currentLevel;
	setText(levelTextId, levelText);
	setText(levelTextFloorId, levelText);
	//Points Scoreboard
	pointsText = pointsTextPrefix + gamePoints;
	setText(pointsTextId, pointsText);
	setText(pointsTextFloorId, pointsText);
	//Objectives Scoreboard
	objectivesText = objectivesTextPrefix + levelObjectives;
	setText(objectivesTextId, objectivesText);
	setText(objectivesTextFloorId, objectivesText);
	//Health Scoreboard
	healthText = healthTextPrefix + player0.health;
	setText(healthTextId, healthText);
	setText(healthTextFloorId, healthText);
	clearTimeout(systemTimeout);
}, 1000);

        this.el.addEventListener('level-complete', ()=>{
			levelCompleteAudio.play();
			//Remove all enemies
			for(let enemy in auxl.enemySpawned){
				auxl[auxl.enemySpawned[enemy].obj.id].Despawn();
			}
			//Remove all death cubes
			for(let death in auxl.deathSpawned){
				auxl[auxl.deathSpawned[death].obj.id].Despawn();
			}
			clearTimeout(powerTimeout);
			removeSpanwedAllAmmo(sceneEl);
			levelComplete = true;
			levelStart = false;
			if(currentLevel === 50){
				gamePoints += 1000;
				gameComplete = true;
				//Game Info
				infoText = 'Game Complete! Congrats!';
				setText(infoTextId, infoText);
				setText(infoTextFloorId, infoText);
				//Points Scoreboard
				pointsText = pointsTextPrefix + gamePoints;
				setText(pointsTextId, pointsText);
				setText(pointsTextFloorId, pointsText);
			} else {
				gamePoints += (20 * currentLevel);
				//Game Info
				infoText = 'Level Complete';
				setText(infoTextId, infoText);
				setText(infoTextFloorId, infoText);
				//Points Scoreboard
				pointsText = pointsTextPrefix + gamePoints;
				setText(pointsTextId, pointsText);
				setText(pointsTextFloorId, pointsText);
			}
        });
        this.el.addEventListener('level-fail', ()=>{
			levelFailAudio.play();
			//Level Failure
			removeSpanwedAllAmmo(sceneEl);
			gameOver = true;
			levelStart = false;
			gameStart = false;
			currentLevel = 0;
			//Game Info
			infoText = 'Game Over';
			setText(infoTextId, infoText);
			setText(infoTextFloorId, infoText);
			updateColor('red');
			resetPos();
        });
        this.el.addEventListener('power-up', ()=>{
			//powered up
			player0.dmg = 2;
			infoText = '2x Damage';
			setText(infoTextId, infoText);
			setText(infoTextFloorId, infoText);
			powerTimeout = setTimeout(function () {
				player0.dmg = 1;
				infoText = 'Level Started';
				setText(infoTextId, infoText);
				setText(infoTextFloorId, infoText);
				clearTimeout(powerTimeout);
			}, 30000);
        });

        this.el.addEventListener('grab', ()=>{
            // Handle a user grab on the object. 
            // You can access this.el.object3D.userData.position and this.el.object3D.userData.rotation 
			updateColor('yellow');
        });
        this.el.addEventListener('drop', ()=>{
            // Handle a user drop on the object. 
            // You can access this.el.object3D.userData.position and this.el.object3D.userData.rotation
			//Start

			gameStart = true;
			levelStart = false;
			gameComplete = false;
			currentLevel = 0;
			player0.health = 10;
			gamePoints = 0;
			levelObjectives = 0;
			clearTimeout(powerTimeout)
			removeSpanwedAllAmmo(sceneEl);
			//Game Info
			infoText = 'Game Ready';
			setText(infoTextId, infoText);
			setText(infoTextFloorId, infoText);
			//Level Scoreboard
			levelText = levelTextPrefix + currentLevel;
			setText(levelTextId, levelText);
			setText(levelTextFloorId, levelText);
			//Points Scoreboard
			pointsText = pointsTextPrefix + gamePoints;
			setText(pointsTextId, pointsText);
			setText(pointsTextFloorId, pointsText);
			//Objectives Scoreboard
			objectivesText = objectivesTextPrefix + levelObjectives;
			setText(objectivesTextId, objectivesText);
			setText(objectivesTextFloorId, objectivesText);
			//Health Scoreboard
			healthText = healthTextPrefix + player0.health;
			setText(healthTextId, healthText);
			setText(healthTextFloorId, healthText);
			updateColor('green');
			if(levelStart || gameOver){
				auxl.zone0.Move('connect1');
				gameOver = false;
			}

			//Reset its position after delay
			let timeout = setTimeout(function () {
				resetPos();
				clearTimeout(timeout);
			}, 3000);
        });
    }
});

//Next Level
AFRAME.registerComponent('next-level', {
    init: function() {
		const sceneEl = document.querySelector('a-scene');
		this.auxl = document.querySelector('a-scene').systems.auxl;

        this.el.addEventListener('trigger-enter', ()=>{
            if(this.el.object3D.userData.isLocalPlayer) {
              // This is the current player triggering
				if(gameStart){
					if(gameComplete){} else {
						if(currentLevel === 0 || levelComplete){
							//Go to Next level
							levelComplete = false;
							levelStart = true;
							currentLevel++;
							if(currentLevel > 0 && currentLevel <= 10){
								player0.health += 1;
							} else if(currentLevel > 10 && currentLevel <= 20){
								player0.health += 2;
							} else if(currentLevel > 20 && currentLevel <= 30){
								player0.health += 3;
							} else if(currentLevel > 30 && currentLevel <= 40){
								player0.health += 4;
							} else if(currentLevel > 40 && currentLevel <= 50){
								player0.health += 5;
							}

							//Health Scoreboard
							healthText = healthTextPrefix + player0.health;
							setText(healthTextId, healthText);
							setText(healthTextFloorId, healthText);
							//Level Scoreboard
							levelText = levelTextPrefix + currentLevel;
							setText(levelTextId, levelText);
							setText(levelTextFloorId, levelText);
							removeSpanwedAllAmmo(sceneEl);
							//Shuffle Locations before spawning
							shuffle(targetLocations);
							shuffle(enemyLocationsBackRight);
							shuffle(enemyLocationsBackLeft);
							shuffle(enemyLocationsFrontRight);
							shuffle(enemyLocationsFrontLeft);
							shuffle(enemyLocationsPlatforms);
							shuffle(deathLocations);
							shuffle(powerLocations);
							//Get health pool for target/enemies
	levelTargetTotalHealthPool = Math.floor((Math.random()*6+1)* currentLevel);
	levelEnemyTotalHealthPool = Math.floor((Math.random()*4+4)* currentLevel);
							this.auxl.zone0.Move('connect0');
							//Game Info
							infoText = 'Level Started';
							setText(infoTextId, infoText);
							setText(infoTextFloorId, infoText);
							levelStartAudio.play();
						}
					}

				}
            }
        });
    }
});

//Pickups

//Health
AFRAME.registerComponent('health-pickup', {
    init: function() {
		const sceneEl = document.querySelector('a-scene');
		const object = this.el;
		const objectId = this.el.id;

		pickUpHealthActive = true;

		function healthPickup(){
			pickupAudio.play();
			player0.health += 5;
			//Health Scoreboard
			healthText = healthTextPrefix + player0.health;
			setText(healthTextId, healthText);
			setText(healthTextFloorId, healthText);
			pickUpHealthActive = false;
			sceneEl.removeChild(object);
		}

		//Player can shoot and walk through to activate
        this.el.addEventListener('trigger-enter', ()=>{
            if(this.el.object3D.userData.isLocalPlayer) {
				healthPickup();
            }
			all0Ammo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					healthPickup();
					let oldAmmo = document.getElementById(ammo.name);
					sceneEl.removeChild(oldAmmo);
				}
			});

        });
    }
});

//Bonus Points
AFRAME.registerComponent('bonus-pickup', {
    init: function() {
		const sceneEl = document.querySelector('a-scene');
		const object = this.el;
		const objectId = this.el.id;

		pickUpBonusActive = true;

		function bonusPickup(){
			pickupAudio.play();
			gamePoints += (25 * currentLevel);
			//Points Scoreboard
			pointsText = pointsTextPrefix + gamePoints;
			setText(pointsTextId, pointsText);
			setText(pointsTextFloorId, pointsText);
			pickUpBonusActive = false;
			sceneEl.removeChild(object);
		}

		//Player can shoot and walk through to activate
        this.el.addEventListener('trigger-enter', ()=>{
            if(this.el.object3D.userData.isLocalPlayer) {
				bonusPickup();
            }
			all0Ammo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					bonusPickup();
					let oldAmmo = document.getElementById(ammo.name);
					sceneEl.removeChild(oldAmmo);
				}
			});

        });
    }
});

//Power Up
AFRAME.registerComponent('power-pickup', {
    init: function() {
		const sceneEl = document.querySelector('a-scene');
		const object = this.el;
		const objectId = this.el.id;

		pickUpPowerActive = true;

		function powerPickup(){
			pickupAudio.play();
			//power up
			gameControlObject.emit('power-up');
			pickUpPowerActive = false;
			sceneEl.removeChild(object);
		}

		//Player can shoot and walk through to activate
        this.el.addEventListener('trigger-enter', ()=>{
            if(this.el.object3D.userData.isLocalPlayer) {
				powerPickup();
            }
			all0Ammo.forEach((ammo) => {
				if(this.el.id === objectId &&  this.el.object3D.userData.other.id === ammo.name){
					powerPickup();
					let oldAmmo = document.getElementById(ammo.name);
					sceneEl.removeChild(oldAmmo);
				}
			});

        });
    }
});

//
//A-Frame UX Library v0.1 Engine
//https://github.com/Minty-Crisp/AUXL
AFRAME.registerSystem('auxl', {
//schema: {
	//bar: {type: 'number'},
	//style: {type: 'string', default: 'random'}
//},

init: function () {

// System
/********************************************************************/
//

//Establish a-frame objects
const sceneEl = document.querySelector('a-scene');
const head = document.querySelector('head');
let aThis = this;

//Core, Layer & Aux currently spawned in scene.
this.spawned = {};
this.zoneSpawned = {};
this.nodeSpawned = {};
this.menuSpawned = {};
this.genSpawned = {};
this.npcSpawned = {};
this.targetSpawned = {};
this.enemySpawned = {};
this.powerSpawned = {};
this.deathSpawned = {};
this.carouselSpawned = {};
function clearSpawned(spawned){
	for(let spawn in spawned){
		//console.log(spawn);//name of ID
		//console.log(spawned[spawn]);//obj
		//console.log(aThis[spawn]);
		if(aThis[spawn]){
			if(aThis[spawn].type === 'core'){
				aThis[spawn].core.RemoveFromScene();
			} else if (aThis[spawn].type === 'layer'){
				aThis[spawn].layer.RemoveAllFromScene();
			} else if (spawned[spawn].type === 'gen'){
				aThis[spawn].DespawnAll();
			} else if (spawned[spawn].type === 'npc'){
				aThis[spawn].Despawn();
			} else if (spawned[spawn].type === 'carousel'){
				aThis[spawn].Remove();
			} else if (spawned[spawn].type === 'death'){
				aThis[spawn].Despawn();
			} else if (spawned[spawn].type === 'enemy'){
				aThis[spawn].Despawn();
			} else if (spawned[spawn].type === 'power'){
				aThis[spawn].Despawn();
			} else if (spawned[spawn].type === 'target'){
				aThis[spawn].Despawn();
			} else {
				if(aThis[spawn].RemoveFromScene){
					aThis[spawn].RemoveFromScene();
				} else if(aThis[spawn].RemoveAllFromScene){
					aThis[spawn].RemoveAllFromScene();
				}
			}
		} else {
			if (spawned[spawn].type === 'menu'){
				spawned[spawn].obj.MenuRemove();
			} else {
				console.log('Despawn not compatible');
				console.log(spawn);
				console.log(spawned[spawn]);
				console.log(document.getElementById(spawn));
			}
		}
		//console.log(spawned[spawn]);//Book & Page spawned from
		delete spawned[spawn];
	}
}
this.running = {};
this.timeouts = {};
this.intervals = {};
this.interactions = {};
this.events = {};
this.balls = {};

//
//Support
function toggleBool(bool){
	if(bool){
		bool = false;
	}else{
		bool = true;
	}
}

//
//Color Theory Generator
//Generate a color theory palette from a given color, color family or a random color
function colorTheoryGen(color, family){

//color accepts Hex values only at the moment, more options coming soon

//Colors Generated :
//Base
//Complementary
//Split-complementary
//Triadic
//Tetradic
//Analagous
//Monochrome - coming soon

let r;
let r0;
let g;
let g0;
let b;
let b0;
let base;
let baseRGB;
let familyCheck = false;
const colorFamily =['red','orange','yellow','lime','blue','cyan','magenta','maroon','olive','green','purple','teal','navy','silver','grey','black','white'];

//Support Functions
function HSLToRGB(h,s,l) {
	// Must be fractions of 1
	//s /= 100;
	//l /= 100;

	let c = (1 - Math.abs(2 * l - 1)) * s,
	  x = c * (1 - Math.abs((h / 60) % 2 - 1)),
	  m = l - c/2,
	  r = 0,
	  g = 0,
	  b = 0;

	if (0 <= h && h < 60) {
	r = c; g = x; b = 0;  
	} else if (60 <= h && h < 120) {
	r = x; g = c; b = 0;
	} else if (120 <= h && h < 180) {
	r = 0; g = c; b = x;
	} else if (180 <= h && h < 240) {
	r = 0; g = x; b = c;
	} else if (240 <= h && h < 300) {
	r = x; g = 0; b = c;
	} else if (300 <= h && h < 360) {
	r = c; g = 0; b = x;
	}
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return {r,g,b};
}
function RGBToHex(r,g,b) {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);

	if (r.length == 1)
	r = "0" + r;
	if (g.length == 1)
	g = "0" + g;
	if (b.length == 1)
	b = "0" + b;

	return "#" + r + g + b;
}
function hexToRGB(h) {
	let r = 0, g = 0, b = 0;

	// 3 digits
	if (h.length == 4) {
	r = "0x" + h[1] + h[1];
	g = "0x" + h[2] + h[2];
	b = "0x" + h[3] + h[3];

	// 6 digits
	} else if (h.length == 7) {
	r = "0x" + h[1] + h[2];
	g = "0x" + h[3] + h[4];
	b = "0x" + h[5] + h[6];
	}

	//return "rgb("+ +r + "," + +g + "," + +b + ")";
	return {r,g,b};
}
function randomColorFamily(){
	return colorFamily[Math.floor(Math.random()*(colorFamily.length-4))];
	//Ignore last 4 Black/White/Grey/Silver
}

//Check if color input is useable
if(color){
	if(color[0] === '#' && color.length === 4 || color[0] === '#' && color.length === 7){} else {
		color = false;
	}
}
//Check if family input is useable
if(family){
	for(let each in colorFamily){
		if(family === colorFamily[each]){
			familyCheck = true;
			break;
		}
	}
	if(familyCheck){} else {
		family = randomColorFamily();
	}
}

//Generate Color Values
if(color){
	//color is Hex
	base = color;
	baseRGB = hexToRGB(base);

	//convert Hex to RGB
	r = baseRGB.r;
	r0 = r/255;
	g = baseRGB.g;
	g0 = g/255;
	b = baseRGB.b;
	b0 = b/255;
} else {
	if(!family){
		family = randomColorFamily();
	}
	if(family === 'red'){
		r = Math.floor(Math.random()*55)+200;
		g = b = 0;
	} else if(family === 'orange'){
		r = Math.floor(Math.random()*105)+150;
		g = Math.floor(r*0.65);
		b = 0;
	} else if(family === 'yellow'){
		r = g = Math.floor(Math.random()*55)+200;
		b = 0;
	} else if(family === 'lime'){
		g = Math.floor(Math.random()*55)+200;
		r = b = 0;
	} else if(family === 'blue'){
		b = Math.floor(Math.random()*55)+200;
		r = g = 0;
	} else if(family === 'cyan'){
		g = b = Math.floor(Math.random()*55)+200;
		r = 0;
	} else if(family === 'magenta'){
		r = b = Math.floor(Math.random()*55)+200;
		g = 0;
	} else if(family === 'maroon'){
		r = Math.floor(Math.random()*28)+100;
		b = g = 0;
	} else if(family === 'olive'){
		r = g = Math.floor(Math.random()*28)+100;
		b = 0;
	} else if(family === 'green'){
		g = Math.floor(Math.random()*28)+100;
		r = b = 0;
	} else if(family === 'purple'){
		r = b = Math.floor(Math.random()*28)+100;
		g = 0;
	} else if(family === 'teal'){
		g = b = Math.floor(Math.random()*28)+100;
		r = 0;
	} else if(family === 'navy'){
		b = Math.floor(Math.random()*28)+100;
		r = g = 0;
	} else if(family === 'black'){
		r = g = b = Math.floor(Math.random()*42);
	} else if(family === 'white'){
		r = g = b = Math.floor(Math.random()*35)+220;
	} else if(family === 'silver'){
		r = g = b = Math.floor(Math.random()*42)+170;
	} else if(family === 'grey'){
		r = g = b = Math.floor(Math.random()*28)+100;
	}
	r0 = r/255;
	g0 = g/255;
	b0 = b/255;
	base = RGBToHex(r,g,b);
}

//Convert RGB to HSL for Color Theory support

//Luminosity
//Find max and min
let max = Math.max(r0, g0, b0);
let min = Math.min(r0, g0, b0);
let lum = (1 / 2) * (max + min);

//Hue
let hue;
if(max === r0){
	if(min === g0){
		//R > B > G
		hue = 60 * (6 * (b0-g0)/(r0-g0));
	} else {
		//R > G > B
		hue = 60 * ((g0-b0)/(r0-b0));
	}
} else if(max === g0){
	if(min === b0){
		//G > R > B
		hue = 60 * (2 - (r0-b0)/(g0-b0));
	} else {
		//G > B > R
		hue = 60 * (2 + (b0-r0)/(g0-r0));
	}
} else if(max === b0){
	if(min === r0){
		//B > G > R
		hue = 60 * (4 - (g0-r0)/(b0-r0));
	} else {
		//B > R > G
		hue = 60 * (4 + (r0-g0)/(b0-g0));
	}
}

//Saturation
let sat;
if(lum === 1){
sat = 0;
} else {
sat = ((max - min) / (1 - (lum*2 - 1)));
}

//Base HSL color... hue, sat, lum

//Complementary
let complRGB = HSLToRGB(Math.abs((hue + 180) - 360), sat, lum);
let compl = RGBToHex(complRGB.r, complRGB.g, complRGB.b);

//Split-complementary
let splitComplRGB = [
HSLToRGB(Math.abs((hue + 150) - 360), sat, lum),
HSLToRGB(Math.abs((hue + 210) - 360), sat, lum)
];
let splitCompl = [
RGBToHex(splitComplRGB[0].r, splitComplRGB[0].g, splitComplRGB[0].b),
RGBToHex(splitComplRGB[1].r, splitComplRGB[1].g, splitComplRGB[1].b)
];

//Triadic
let triadicRGB = [
HSLToRGB(Math.abs((hue + 120) - 360), sat, lum),
HSLToRGB(Math.abs((hue + 240) - 360), sat, lum)
];
let triadic = [
RGBToHex(triadicRGB[0].r, triadicRGB[0].g, triadicRGB[0].b),
RGBToHex(triadicRGB[1].r, triadicRGB[1].g, triadicRGB[1].b)
];

//Tetradic
let tetradicRGB = [
HSLToRGB(Math.abs((hue + 90) - 360), sat, lum),
HSLToRGB(Math.abs((hue + 180) - 360), sat, lum),
HSLToRGB(Math.abs((hue + 270) - 360), sat, lum)
];
let tetradic = [
RGBToHex(tetradicRGB[0].r, tetradicRGB[0].g, tetradicRGB[0].b),
RGBToHex(tetradicRGB[1].r, tetradicRGB[1].g, tetradicRGB[1].b),
RGBToHex(tetradicRGB[2].r, tetradicRGB[2].g, tetradicRGB[2].b)
];

//Analagous
let analogRGB = [
HSLToRGB(Math.abs((hue + 30) - 360), sat, lum),
HSLToRGB(Math.abs((hue + 60) - 360), sat, lum),
HSLToRGB(Math.abs((hue + 90) - 360), sat, lum)
];
let analog = [
RGBToHex(analogRGB[0].r, analogRGB[0].g, analogRGB[0].b),
RGBToHex(analogRGB[1].r, analogRGB[1].g, analogRGB[1].b),
RGBToHex(analogRGB[2].r, analogRGB[2].g, analogRGB[2].b)
];

//Monochrome (25-60% | 42%)
let mono = [];
const spread = 0.42;
let light = RGBToHex(r*(1+spread),g*(1+spread),b*(1+spread));
mono.push(light);
let dark = RGBToHex(r*(1-spread),g*(1-spread),b*(1-spread));
mono.push(dark);
//red_light = red_primary * (1 + scaling_factor)
//green_light = green_primary * (1 + scaling_factor)
//blue_light = blue_primary * (1 + scaling_factor)

//red_dark = red_primary * (1 - scaling_factor)
//green_dark = green_primary * (1 - scaling_factor)
//blue_dark = blue_primary * (1 - scaling_factor)

return {base, light, dark, compl, splitCompl, triadic, tetradic, analog};

}
/*
let newColor1 = colorTheoryGen();
let newColor1 = colorTheoryGen('#00d3d3');
let newColor1 = colorTheoryGen(false, 'red');
console.log(newColor1.base);
console.log(newColor1.compl);
console.log(newColor1.splitCompl[0]);
console.log(newColor1.splitCompl[1]);
console.log(newColor1.triadic[0]);
console.log(newColor1.triadic[1]);
console.log(newColor1.tetradic[0]);
console.log(newColor1.tetradic[1]);
console.log(newColor1.tetradic[2]);
console.log(newColor1.analog[0]);
console.log(newColor1.analog[1]);
console.log(newColor1.analog[2]);
*/

//Entity Core
const Core = (data) => {
	//Import Data
	let core = JSON.parse(JSON.stringify(data));
	core.el = {};
	core.parent = false;
	let details = false;

	const Generate = () => {

		//Need additional gates if sources are needed to prevent spawning until script is fully downloaded.
		//
		//Check for external sources and append
		if(core.sources){
			//{['look-at']:'https://unpkg.com/aframe-look-at-component@1.0.0/dist/aframe-look-at-component.min.js',}
			//{threeGradShader: 'https://unpkg.com/@tlaukkan/aframe-three-color-gradient-shader@0.0.1/index.js',}
			//External JS Import
			//Multi-Property Values
			let propertyKeys = Object.keys(core.sources);
			let propertyValues = Object.values(core.sources);
			for (let propKey in propertyKeys) {
				//create new script element
				let newScript = document.createElement('script');
				//add src addtribute of componentValues[key]
				newScript.setAttribute('src', propertyValues[propKey]);
				console.log(propertyValues[propKey]);
				//append to Head
				head.appendChild(newScript);
			}//Component properties
		}

		core.el = {};

		if(core.entity === 'preAdded'){
			core.el = document.getElementById(core.id);
			//return core.el;
		} else if(core.entity){
			core.el = document.createElement(core.entity);
		} else {
			core.el = document.createElement('a-entity');
		}
		//console.log('generating...');
		//console.log(core);

		//Sound
		if(this.audioEnabled){
			if(core.sound){core.el.setAttribute('sound', core.sound)};
		}

		//Text
		if(core.text){core.el.setAttribute('text', core.text)};
		//console.log(JSON.stringify(data.id.id));

		//core.el.setAttribute('id', core.id.id);
		core.el.setAttribute('id', core.id);
		//core.el.classList.add(classes);
		//core.el.setAttribute(mixins);
		if(core.geometry){
			core.el.setAttribute('geometry', core.geometry);
		}
		if(core.material){
			core.el.setAttribute('material', core.material);
		}
		if(core.position){
			core.el.setAttribute('position', core.position);
		}
		if(core.rotation){
			core.el.setAttribute('rotation', core.rotation);
		}
		if(core.scale){
			core.el.setAttribute('scale', core.scale);
		}

		//core.el.setAttribute('animation__default', data.animations.default);

		//Add all classes
		for (let key in core.classes) {
			core.el.classList.add(core.classes[key]);
		}
		//There are a list of animations, loop through and set each as the object's keyName
		let animationKeys = Object.keys(core.animations);
		let animationValues = Object.values(core.animations);
		for (let key in animationKeys) {
			if(key === 0){} else {
				core.el.setAttribute('animation__'+animationKeys[key], animationValues[key]);
			}
		}

		//Check for Component Settings
		if(core.components){
		let componentKeys = Object.keys(core.components);
		let componentValues = Object.values(core.components);
		for (let key in componentKeys) {
			if(key === 0){} else {
				core.el.setAttribute(componentKeys[key],componentValues[key])
			}
		}
		}//Core Componenets

		//console.log(core.el);
		//console.log('Entity Generated');
		return core.el;
	}

	const AddToScene = (parent, layer, other) => {
		let needParent = parent || false;
		let fromLayer = layer || false;
		Generate();
		if(core.entity === 'preAdded'){} else {
			if(needParent){
				core.parent = needParent;
				needParent.appendChild(core.el);
				//Need a specific unspawn object form to add to this.spawned
			}else{
				sceneEl.appendChild(core.el);
			}
			if(fromLayer || other){} else {
				//console.log('Add to scene tracker')
				//console.log(core)
				AddToSceneTracker();
			}
		}
		//console.log(core)
	}

	const RemoveFromScene = (parent, layer, other) => {
		//loop through and remove all core.components which removes all event listeners before clearing from scene
		let componentKeys = Object.keys(core.components);
		for (let key in componentKeys) {
			if(key === 0){} else {
				GetEl().removeAttribute(componentKeys[key])
			}
		}
		let needParent = parent || false;
		let fromLayer = layer || false;
		if(needParent){
			//console.log(core.el)
			needParent.removeChild(core.el);
		}else{
			//console.log(core)
			//console.log(core.el)
			sceneEl.removeChild(core.el);
		}
		if(core.entity === 'preAdded'){} else {
			if(fromLayer || other){} else {
				RemoveFromSceneTracker();
			}
		}
	}

	const AddToSceneTracker = () => {
		//Scene Tracking of Assets
		if(aThis.zoneSpawned[core.id]){} else {
			aThis.nodeSpawned[core.id] = {type: 'core', obj: core};
		}
	}

	const RemoveFromSceneTracker = () => {
		//Clear Tracking of Asset
		delete aThis.nodeSpawned[core.id];
	}

	const ChangeSelf = ({property,value}) => {
		//console.log(property);
		//console.log(value);
		GetEl().setAttribute(property, value);
	}

	const ChangeSelfArray = (...setAlt) => {
		//console.log(setAlt);

		for(let a = 0; a < setAlt.length; a++){
			//console.log(setAlt[a].property);
			//console.log(setAlt[a].value);
			GetEl().setAttribute(setAlt[a].property, setAlt[a].value);
		}
	}

	const Animate = (animProps) => {
		//let el = document.getElementById(core.el.id);
		let name = 'animation__' + animProps.name || 'animation__customAnim';
		let property = animProps.property;
		let from = animProps.from || false;
		let to = animProps.to || false;
		let dur = animProps.dur || false;
		let delay = animProps.delay || false;
		let loop = animProps.loop || false;
		let dir = animProps.dir || false;
		let easing = animProps.easing || false;
		let elasticity = animProps.elasticity || false;
		let autoplay = animProps.autoplay || false;
		let enabled = animProps.enabled || false;
		let startEvents = animProps.startEvents || false;
		let pauseEvents = animProps.pauseEvents || false;
		let resumeEvents = animProps.resumeEvents || false;

		let anim = {
			property: 'object3D.rotation.y',
			to: 360,
			dur: 1000,
			delay: 0,
			loop: 'false',
			dir: 'normal',
			easing:'easeInOutSine',
			elasticity: 400,
			autoplay: 'true',
			enabled: 'true',
		};

		if(property){anim.property = property};
		if(from){anim.from = from};
		if(to){anim.to = to};
		if(dur){anim.dur = dur};
		if(delay){anim.delay = delay};
		if(loop){anim.loop = loop};
		if(dir){anim.dir = dir};
		if(easing){anim.easing = easing};
		if(elasticity){anim.elasticity = elasticity};
		if(autoplay){anim.autoplay = autoplay};
		if(enabled){anim.enabled = enabled};
		if(startEvents){anim.startEvents = startEvents};
		if(pauseEvents){anim.pauseEvents = pauseEvents};
		if(resumeEvents){anim.resumeEvents = resumeEvents};


		//console.log(name);
		//console.log(anim);
		//console.log(GetEl());
		GetEl().setAttribute(name, anim);
	}

	const GetEl = () => {
		//return core.id;

		let aEl = document.getElementById(core.id);
		if(aEl){}else{
			console.log(core.id)
		}
		return aEl;
	}

	const EmitEvent = (eventName) => {
		GetEl().emit(eventName,{})
		//console.log(GetEl());
		//console.log(eventName);
	}

	const SetFlag = ({flag, value}) => {
		core[flag] = value;
		//console.log(flag);
		//console.log(core[flag]);
	}

	const GetFlag = (varName) => {
		//console.log(varName)
		//console.log(core[varName])
		return core[varName];
	}

	const ClickRun = (el) => {
		//console.log('Click');
		//console.log(el);
	}

	const FuseClickRun = (el) => {
		//console.log('Fuse Click');
		//console.log(el);
	}

	const CursorDownRun = (el) => {
		//console.log('Cursor Down');
		//console.log(el);
	}

	const CursorEnterRun = (el) => {
		//console.log('Cursor Enter');
		//console.log(el);
	}

	const CursorLeaveRun = (el) => {
		//console.log('Cursor Leave');
		//console.log(el);
	}

	const CursorUpRun = (el) => {
		//console.log('Cursor Up');
		//console.log(el);
	}

	const prepDetails = (text) => {
		core.isOpen = false;
		//Main Screen
		core.detailMain = Core(aThis.detailMainData);
		//Update Position
		core.detailMain.core.position.x = core.position.x + 0.1;
		core.detailMain.core.position.y = core.position.y + 0.75;
		core.detailMain.core.position.z = core.position.z + 0.25;
		//Import Display Text from Core or a detailObject
		if(text){
		core.detailMain.core.text.value = text;
		} else {
		core.detailMain.core.text.value = core.data;
		}
		//Close Button
		core.detailClose = Core(aThis.detailCloseData);
		//Detail Layer
		core.detailLayer = {
		parent: {core: core.detailMain}, 
		child0: {core: core.detailClose},
		}
		core.detailAll = Layer('detailAll',core.detailLayer);
		details = true;
	}

	function detailPrompt_open(){
	let elGenDelay = setTimeout(function () {
		core.detailMain.core.el.emit('open',{});
		core.detailClose.core.el.emit('open',{});
		core.isOpen = true;
		clearTimeout(elGenDelay);
	}, 25); //Delay
	}

	function detailPrompt_close(){
		core.detailMain.core.el.emit('close',{});
		core.detailClose.core.el.emit('close',{});
		let elDelDelay = setTimeout(function () {
			core.detailAll.RemoveAllFromScene();
			core.isOpen = false;
			clearTimeout(elDelDelay);
		}, 550); //Delay
	}

	function openClose(){
		//console.log('Running openClose');
		function closePrompt(){
			core.detailClose.core.el.removeEventListener('click',closePrompt);
			core.isOpen = detailPrompt_close();
		}
		if(core.isOpen){
			//console.log('Is Open');
			core.isOpen = detailPrompt_close();
			core.detailClose.core.el.removeEventListener('click',closePrompt);
		} else {
			//console.log('Is Closed');
			core.detailAll.AddAllToScene();
			core.isOpen = detailPrompt_open();
			core.detailClose.core.el.addEventListener('click', closePrompt);
		}
	}

	const EnableDetail = (text) => {
		//When core is added to scene...
		if(text){
			prepDetails(text);
		} else if(details){} else {
			prepDetails();
		}
		//Add Event Listener
		GetEl().addEventListener('click', openClose);
	}

	const DisableDetail = () => {
		//When core is removed from the scene...
		//Remove Event Listener
		GetEl().removeEventListener('click', openClose);
	}

	return {core, Generate, AddToScene, RemoveFromScene, ChangeSelf, ChangeSelfArray, Animate, GetEl, EmitEvent, SetFlag, GetFlag, ClickRun, FuseClickRun, CursorDownRun, CursorEnterRun, CursorLeaveRun, CursorUpRun, EnableDetail, DisableDetail};
}

//
//layered Core
const Layer = (id, all) => {

	let layer = {id, all};
	layer.children = {};
	layer.secondParents = [];
	layer.thirdParents = [];

	const AddAllToScene = (other) => {
		for(let each in all){
			if(each === 'parent'){
				all[each].core.AddToScene(false, true);
			} else {
				for(let a in all[each]){
					if(a === 'core'){
						layer.children[all[each].core.core.id] = {obj: all[each][a], parent: all.parent.core.core.el};
						//console.log(layer.children)
						all[each][a].AddToScene(all.parent.core.core.el, true);
					} else {
						if(a === 'parent'){
							layer.children[all[each][a].core.core.id] = {obj: all[each][a].core, parent: all.parent.core.core.el};
							layer.secondParents.push(all[each][a].core);
							//console.log(layer.children)
							all[each][a].core.AddToScene(all.parent.core.core.el, true);
						} else {
							for(let b in all[each][a]){
								if(b === 'core'){
									layer.children[all[each][a].core.core.id] = {obj: all[each][a][b], parent: all[each].parent.core.core.el};
									//console.log(layer.children)
									all[each][a][b].AddToScene(all[each].parent.core.core.el, true);
								} else {
									if(b === 'parent'){
										layer.children[all[each][a][b].core.core.id] = {obj: all[each][a][b].core, parent: all[each].parent.core.core.el};
										layer.thirdParents.push(all[each][a][b].core);
										//console.log(layer.children)
										all[each][a][b].core.AddToScene(all[each].parent.core.core.el, true);
									} else {
										for(let c in all[each][a][b]){
											if(c === 'parent'){
												console.log('Add support for more layers')
											} else {
												layer.children[all[each][a][b].core.core.id] = {obj: all[each][a][b][c], parent: all[each][a].parent.core.core.el};
												//console.log(layer.children)
												all[each][a][b][c].AddToScene(all[each][a].parent.core.core.el, true);
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		if(other){} else {
			AddToSceneTracker();
		}
	}

	function layerOrder(object) {
	let result = [[], [], [], []];
	function traverse(object, depth) {
		for (let key in object) {
			if (object.hasOwnProperty(key)) {
				if (key === 'core') {
					//console.log('Hit core');
					//console.log(object[key]);
					//console.log(result);
					result[depth].push(object[key]);
				} else if (key === "parent" && object[key].hasOwnProperty('core')) {
					//console.log('Hit a Parent');
					//console.log(object[key]);
					//console.log(result);
					result[depth].push(object[key].core);
				} else if (typeof object[key] === 'object') {
					//console.log('Hit End');
					//console.log(object[key]);
					//console.log(result);
					traverse(object[key], depth + 1);
				}
			}
		}
	}

	traverse(object, 0);
	return result;
	}
	let accessOrder = layerOrder(layer.all);

	const RemoveAllFromScene = (other) => {
		let removeOrder = layerOrder(layer.all).reverse();

		for(let layer of removeOrder){
			//console.log(layer);
			for(let each of layer){
				//console.log(each);
				if(each.core.parent){
					each.RemoveFromScene(each.core.parent);
				} else {
					each.RemoveFromScene();
				}
			}
		}
		RemoveFromSceneTracker();
	}

	const AddToSceneTracker = () => {
		if(aThis.zoneSpawned[layer.id]){} else {
    		aThis.nodeSpawned[layer.id] = {type: 'layer', obj: layer};
		}
    	//aThis.zoneSpawned[layer.id] = {type: 'layer', obj: this};
	}

	const RemoveFromSceneTracker = () => {
		delete aThis.nodeSpawned[layer.id];
		//delete aThis.zoneSpawned[layer.id];
	}

	const GetParentEl = () => {
		return layer.all.parent.core.GetEl();
	}

	const EmitEventParent = (eventName) => {
		all.parent.core.EmitEvent(eventName);
	}

	const ChangeParent = (property, value) => {
		all.parent.core.ChangeSelf(property, value);
	}

	const ChangeAll = (property, value) => {
		for(let section of accessOrder){
			//console.log(section);
			for(let each of section){
				//console.log(each);
				each.ChangeSelf(property, value);
			}
		}
	}

	const AnimateParent = (animProps) => {
		all.parent.core.Animate(animProps);
	}

	const AnimateAll = (animProps) => {
		for(let section of accessOrder){
			//console.log(section);
			for(let each of section){
				//console.log(each);
				each.Animate(animProps);
			}
		}
	}

	const GetChild = (childName) => {

		//return specific child to access their indv change/animate/remove funcs
		let result = [];
		function traverse(object, depth) {
			for (let key in object) {
				if (object.hasOwnProperty(key)) {
					if (key === 'core') {
						//console.log('Hit core');
						//console.log(object[key]);
						//console.log(result);
						//result[depth].push(object[key]);
						if(object[key].core.id === childName){
							//console.log('Child Hit!');
							//console.log(object[key].core.id);
							//console.log(object[key]);
							result.push(object[key]);
							return;
						}
					} else if (key === "parent" && object[key].hasOwnProperty('core')) {
						//console.log('Hit a Parent');
						//console.log(object[key].core);
						//console.log(result);
						//result[depth].push(object[key].core);
						if(object[key].core.core.id === childName){
							//console.log('Child Hit!');
							//console.log(object[key].core.core.id);
							//console.log(object[key].core);
							result.push(object[key].core);
							return;
						}
					} else if (typeof object[key] === 'object') {
						//console.log('Hit End');
						//console.log(object[key]);
						//console.log(result);
						traverse(object[key], depth + 1);
					}
				}
			}
		}

		traverse(layer.all, 0);
		if(result[0]){
			//console.log(result[0]);
			return result[0];
		} else {
			//console.log(result);
			console.log('Unable to find child');
		}
	}

	return {layer, AddAllToScene, RemoveAllFromScene, GetParentEl, EmitEventParent, ChangeParent, ChangeAll, AnimateParent, AnimateAll, GetChild};
}

//
//Scene Node ObjGen
//scenePlaceTownBuildingCastleLabrynthLevelAreaOfInterest
const SceneNode = (sceneData) => {
//Configure and Display Scene
let core = Object.assign({}, sceneData);

//let textBubble= Core(this.sceneTextData);
//let sceneText = SpeechSystem(textBubble);

	const IfElse = (objRef, condObj,{cond, ifTrue, ifFalse}) => {

		//Uses text for true, text and undefined for false
		//Test using bools only

		//ifTrue
		//ifFalse
		//for loop for above objects with key name as object and value key as method and that value the params
		//console.log(objRef)//this.obj name
		//console.log(condObj)//this.obj name used to check Condition from
		//console.log(cond)//cond name
		//console.log(ifTrue)
		//console.log(ifFalse)
		//console.log(aThis[condObj].GetFlag(cond))
		if(aThis[condObj].GetFlag(cond)) {
			//run ifTrue
			for(let a in ifTrue){
				//console.log(ifTrue);
				//console.log(a);
				//console.log(ifTrue[a]);
				for(let b in ifTrue[a]){
					AThisObjMethod(a,b,ifTrue[a][b]);
				}
			}
		} else {
			//run ifFalse
			for(let a in ifFalse){
				//console.log(ifFalse);
				//console.log(a);//this.object name should match objRef
				//console.log(ifFalse[a]);//method w/ params
				for(let b in ifFalse[a]){
					AThisObjMethod(a,b,ifFalse[a][b]);
				}
			}
		}

	}

	const SetFlag = (objRef, flagInfo) => {
		//console.log('Setting Flag')
		//console.log(objRef)
		//console.log(flagInfo)
		//access variables
		let flag = '';
		let value = '';
		let params = {};
		for(let a in flagInfo){
			//console.log(b);//flag, value
			if(a === 'flag'){
				flag = flagInfo[a];
			} else if (a === 'value'){
				value = flagInfo[a];
			}
		}
		params = {flag, value};
		//set this.obj.flag = value;
		//console.log(flag);
		//console.log(value);
		//console.log(params);
		//aThis[line][flag] = value;
		AThisObjMethod(objRef,'SetFlag',params);
	}

	const AddToTimeIntEvtTracker = ({name,type,id,method,params,event}) => {
		//console.log({name,type,id,method,params,event})
		let nameId = name+id;
		if(type === 'timeout'){
			aThis.running[nameId] = {type, name, id, nameId};
		} else if (type === 'interval'){
			aThis.running[nameId] = {type, name, id, nameId};
		} else if (type === 'interaction' || type === 'event'){
			//console.log({name,type,id,method,params,event})
			//console.log(nameId);
			aThis.running[nameId] = {type, name, id, nameId, method, params, event};
		}
		//console.log(aThis.running);
	}

	const RemoveFromTimeIntEvtTracker = (name) => {
		delete aThis.running[name];
	}

	const ClearSceneTimeIntEvt = () => {
		//console.log(aThis.running);
		for(let ran in aThis.running){
			//console.log(ran);//name of ID
			//console.log(aThis.running[ran]);//object
			if(aThis.running[ran].type === 'timeout'){
				//console.log('clearing timeout');
				//console.log(aThis.running[ran].nameId);
				//console.log(aThis.timeouts[aThis.running[ran].nameId]);
				//clearTimeout(aThis.running[ran].nameId);
				clearTimeout(aThis.timeouts[aThis.running[ran].nameId]);
				delete aThis.timeouts[aThis.running[ran].nameId];
			} else if (aThis.running[ran].type === 'interval'){
				//console.log('clearing interval');
				//console.log(aThis.running[ran].nameId);
				//console.log(aThis.intervals);
				clearInterval(aThis.intervals[aThis.running[ran].nameId]);
				delete aThis.intervals[aThis.running[ran].nameId];
			} else if (aThis.running[ran].type === 'interaction' || aThis.running[ran].type === 'event'){
				//Event
				//console.log('clearing interaction|event');
				//console.log(aThis.running[ran].name);
				//console.log(aThis.running[ran].event);
aThis[aThis.running[ran].name].GetEl().removeEventListener(aThis.running[ran].event, function(){
AThisObjMethod(aThis.running[ran].object,aThis.running[ran].method,aThis.running[ran].params);
});
			}
			RemoveFromTimeIntEvtTracker(ran);
		}
		//console.log(aThis.running);
		//console.log(aThis.timeouts);
		//console.log(aThis.intervals);
	}

	const ClearScene = () => {
		//Clear Core | Layer Scene Tracked Items
		//Run Exit section of current Node
		Exit();

		//console.log('Clearing Scene...')
		//console.log(aThis.nodeSpawned);
		//Clear Timeout, Intervals and Event Listeners first
		ClearSceneTimeIntEvt();
		clearSpawned(aThis.deathSpawned);
		clearSpawned(aThis.enemySpawned);
		clearSpawned(aThis.powerUpSpawned);
		clearSpawned(aThis.nodeSpawned);
		clearSpawned(aThis.genSpawned);

		//Not needed for Banter, Disable
		//clearSpawned(aThis.menuSpawned);
		//clearSpawned(aThis.npcSpawned);
		//clearSpawned(aThis.carouselSpawned);
		/*
		for(let spawn in aThis.nodeSpawned){
			//console.log(spawn);//name of ID
			//console.log(aThis[spawn]);

			if(aThis[spawn]){
				if(aThis[spawn].type === 'core'){
						aThis[spawn].core.RemoveFromScene();
				} else if (aThis[spawn].type === 'layer'){
						aThis[spawn].layer.RemoveAllFromScene();
				} else {
					if(aThis[spawn].RemoveFromScene){
						aThis[spawn].RemoveFromScene();
					} else if(aThis[spawn].RemoveAllFromScene){
						aThis[spawn].RemoveAllFromScene();
					}
				}
			} else if(document.getElementById(spawn)){
				//console.log(spawn);
				//console.log(document.getElementById(spawn));
			}

			//console.log(aThis.nodeSpawned[spawn]);//Book & Page spawned from
			delete aThis.nodeSpawned[spawn];
		}*/
		//Clear Timeout, Intervals and Event Listeners as well
		//ClearSceneTimeIntEvt();
	}

	const AThisObjMethod = (object, func, params) => {
		//console.log(object);
		//console.log(func);
		//console.log(params);
		//console.log(aThis[object]);
		aThis[object][func](params);
	}

	function readTimeline(time){
	//find a specific timeline/key name and load up that
	//core : page/data/object
	//time : name of section within a core's pageData
	//line : a single line set of instructions within time
	//
	for(let line in core[time]){
		if(time === 'delay'){
			//console.log('Delay Running...');
			for(let a in core[time][line]){
				//console.log(time);//delay
				//console.log(line);//time of delay
				//console.log(core[time][line]);//this.object w/ method and params
				//console.log(a);//this.object name
				//console.log(core[time][line][a]);//func w/ params
				for(let b in core[time][line][a]){
					//console.log(b);//func name
					//console.log(core[time][line][a][b]);//params
					if(b === 'IfElse'){
						//console.log('IfElse Timeout');
						for(let c in core[time][line][a][b]){
							//console.log(core[time][line][a][b][c]);//params
							AddToTimeIntEvtTracker({name: line, type: 'timeout', id: a});
							aThis.timeouts[line+a] = setTimeout(function () {
								//console.log('IfElse Timeout Hit');
								IfElse(a,c,core[time][line][a][b][c]);
								clearTimeout(aThis.timeouts[line+a]);
							}, line); //Delay
						}
					} else {
						//console.log('Normal Timeout');
						AddToTimeIntEvtTracker({name: line, type: 'timeout', id: a});
						aThis.timeouts[line+a] = setTimeout(function () {
							//console.log('Timeout Hit')
							AThisObjMethod(a,b,core[time][line][a][b]);
							clearTimeout(aThis.timeouts[line+a]);
						}, line); //Delay
					}
				}
			}
		} else if(time === 'interval'){
			//console.log('Interval Running...');
			for(let a in core[time][line]){
				//console.log(time);//interval
				//console.log(line);//time of interval
				//console.log(core[time][line]);//this.object w/ method and params
				//console.log(a);//run,loop,end
				//console.log(core[time][line][a]);//this.object name, func w/ params or params
				let ranTotal = 0;
				let loopTotal = core[time][line]['loop'];
				let endCond;
				if(core[time][line]['end']){
					endCond = core[time][line]['end'];
				}
				if(a === 'run'){
					for(let b in core[time][line][a]){
						for(let c in core[time][line][a][b]){
							//console.log(b);//this.obj name
							//console.log(core[time][line][a][b]);//method w/ params
							//console.log(c);//method
							//console.log(core[time][line][a][b][c]);//parms
							if(c === 'IfElse'){
								for(let d in core[time][line][a][b][c]){
									AddToTimeIntEvtTracker({name: line, type: 'interval', id: b});
									aThis.intervals[line+b] = setInterval(function() {
										//Interval Functions
										//Check for End Condition
										if(aThis[b].GetFlag(endCond) === 'true'){
											clearInterval(aThis.intervals[line+b]);
											RemoveFromTimeIntEvtTracker(line+b);
										}
										//console.log('IfElse Interval Hit')
										IfElse(b,d,core[time][line][a][b][c][d]);
										//Check and update Loop Total
										if(loopTotal === 'infinite'){} else {
											ranTotal++;
											if(ranTotal >= loopTotal){
												clearInterval(aThis.intervals[line+b]);
												RemoveFromTimeIntEvtTracker(line+b);
											}
										}
									}, line); //Interval
								}
							} else {
								//console.log('Normal Interval');
								let method = c;
								let params = core[time][line][a][b][c];
								AddToTimeIntEvtTracker({name: line, type: 'interval', id: b});
								aThis.intervals[line+b] = setInterval(function() {
									//Interval Functions
									//Check for End Condition
									if(aThis[b].GetFlag(endCond) === 'true'){
										clearInterval(aThis.intervals[line+b]);
										RemoveFromTimeIntEvtTracker(line+b);
									}
									AThisObjMethod(b,method,params);
									//Check and update Loop Total
									if(loopTotal === 'infinite'){} else {
										ranTotal++;
										if(ranTotal >= loopTotal){
											clearInterval(aThis.intervals[line+b]);
											RemoveFromTimeIntEvtTracker(line+b);
										}
									}
									//clearInterval(interval);
								}, line); //Interval
							}
						}
					}
				}
			}
		} else if(time === 'interaction'){
			//console.log('Interaction Added...');
			for(let a in core[time][line]){
				//console.log(time);//interaction
				//console.log(line);//type of interaction | click
				//console.log(core[time][line]);//this.object w/ method and params
				//console.log(a);//this.object name
				//console.log(core[time][line][a]);//func w/ params
				for(let b in core[time][line][a]){
					//console.log(b);//func name
					//console.log(core[time][line][a][b]);//params
					let object;
					let method;
					let params;
					if(b === 'IfElse'){
						//console.log('IfElse Interaction');
						for(let c in core[time][line][a][b]){
							//console.log(core[time][line][a][b]);//condObject w/params and iftrue/iffalse
							//console.log(core[time][line][a][b][c]);//cond, iftrue, ifflase
							//console.log(a)//this.object name
							//console.log(b)//ifelse
							//console.log(c)//condObj
							object = a;
							params = core[time][line][a][b][c];

							AddToTimeIntEvtTracker({name: object, type: 'interaction', id: a, method, params, event: line});
							aThis[object].GetEl().addEventListener(line, function(){
								IfElse(object,c,params);
								//AThisObjMethod(object,method,params);
							});
						}
					} else {
						//console.log('Normal Interaction');
						object = a;
						method = b;
						params = core[time][line][a][b];
						//aThis.interactions[object];
						//aThis.running[ran].name;
						AddToTimeIntEvtTracker({name: object, type: 'interaction', id: a, method, params, event: line});
						aThis[object].GetEl().addEventListener(line, function(){
							AThisObjMethod(object,method,params);
						});
					}
				}
				//aThis[line][a](core[time][line][a]);
			}
		} else if(time === 'event'){
			//console.log('Listening for Event...');
			for(let a in core[time][line]){
				//console.log(time);//event
				//console.log(line);//event name
				//console.log(core[time][line]);//this.object w/ method and params
				//console.log(a);//this.object name
				//console.log(core[time][line][a]);//func w/ params
				for(let b in core[time][line][a]){
					//console.log(b);//func name
					//console.log(core[time][line][a][b]);//params
					let object;
					let method;
					let params;
					if(b === 'IfElse'){
						//console.log('IfElse Event');
						for(let c in core[time][line][a][b]){
							//console.log(core[time][line][a][b]);//condObject w/params and iftrue/iffalse
							//console.log(core[time][line][a][b][c]);//cond, iftrue, ifflase
							//console.log(a)//this.object name
							//console.log(b)//ifelse
							//console.log(c)//condObj
							object = a;
							params = core[time][line][a][b][c];

							AddToTimeIntEvtTracker({name: object, type: 'event', id: a, method, params, event: line});
							aThis[object].GetEl().addEventListener(line, function(){
								IfElse(object,c,params);
								//AThisObjMethod(object,method,params);
							});
						}
					} else {
						//console.log('Normal Event');
						object = a;
						method = b;
						params = core[time][line][a][b];
						//aThis.interactions[object];
						//aThis.running[ran].name;
						AddToTimeIntEvtTracker({name: object, type: 'event', id: a, method, params, event: line});
						aThis[object].GetEl().addEventListener(line, function(){
							AThisObjMethod(object,method,params);
						});
					}


					/*
					let object = a;
					let method = b;
					let params = core[time][line][a][b];
					//console.log(line)
					//console.log(object)
					//console.log(method)
					//console.log(params)
					//aThis.interactions[object];
					//aThis.running[ran].name;
					AddToTimeIntEvtTracker({name: object, type: 'event', id: line, method, params, event: line});
					aThis[object].GetEl().addEventListener(line, function(){
						AThisObjMethod(object,method,params);
					});
					*/
				}
				//aThis[line][a](core[time][line][a]);
			}
		} else {
			//Reading non-special timeline, read normally
			for(let a in core[time][line]){
				if(time === 'start'){
					//console.log('Initializing an Object');
					//console.log(time);//start
					//console.log(line);//this.object name
					//console.log(core[time][line]);//func w/ params
					//console.log(a);//method name. can be universal like IfElse
					//console.log(core[time][line][a]);//params
					if(a === 'IfElse'){
						for(let b in core[time][line][a]){
							//console.log(b);
							//console.log(core[time][line][a][b]);
							IfElse(line,b,core[time][line][a][b]);
						}
					} else {
						AThisObjMethod(line,a,core[time][line][a]);
					}
				} else if(time === 'exit'){
					//console.log('Exiting Scene');
					//console.log(time);//exit
					//console.log(line);//this.object name
					//console.log(core[time][line]);//func w/ params
					//console.log(a);//method name. can be universal like IfElse
					//console.log(core[time][line][a]);//params
					if(a === 'IfElse'){
						for(let b in core[time][line][a]){
							//console.log(b);
							//console.log(core[time][line][a][b]);
							IfElse(line,b,core[time][line][a][b]);
						}
					} else {
						AThisObjMethod(line,a,core[time][line][a]);
					}
				} else if(time === 'zone'){
					if(a === 'IfElse'){
						console.log('IfElse shouldnt be used in Zone. Move to Other.');
						//IfElse(line,core[time][line][a]);
					} else {
						//Check if Zone element already exists
						//console.log('Adding Zone Element');
						//Add to Zone Tracker
						if(a === 'AddToScene'){
							if(aThis.zoneSpawned[aThis[line].core.id]){} else {
								AddToZoneTracker('core', aThis[line]);
								AThisObjMethod(line,a,core[time][line][a]);
							}
						} else if(a === 'AddAllToScene'){
							if(aThis.zoneSpawned[aThis[line].layer.id]){} else {
								AddToZoneTracker('layer', aThis[line]);
								AThisObjMethod(line,a,core[time][line][a]);
							}
						}
					}
				} else if(time === 'info') {
					//Data only
				} else {
					console.log('Hit Other Timeline, Please Investigate');
					//console.log('Executing Timeline...');
					//console.log(time);//timeline
					//console.log(line);//this.obj name
					//console.log(core[time][line]);//method and params
					//console.log(a);//method
					//console.log(core[time][line][a]);//parms
					//console.log(aThis);//this.object
					//console.log(aThis[line]);//this.object
					//aThis[line][a](core[time][line][a]);
					//AThisObjMethod(line,a,core[time][line][a]);
				}
			}
		}
	}
	return;
	}

	const Info = () => {
		readTimeline('info');
	}

	const Zone = () => {
		readTimeline('zone');
	}

	const AddToZoneTracker = (type, obj) => {
		if(type === 'core'){
    		aThis.zoneSpawned[obj.core.id] = {type, obj};
		} else if(type === 'layer'){
    		aThis.zoneSpawned[obj.layer.id] = {type, obj};
		}
		//console.log(aThis.zoneSpawned)
	}

	const RemoveFromZoneTracker = (type) => {
		delete aThis.zoneSpawned[type.id];
	}

	const Start = () => {
		readTimeline('start');
	}

	const Delay = () => {
		readTimeline('delay');
	}

	const Interval = () => {
		readTimeline('interval');
	}

	const Event = () => {
		readTimeline('event');
	}

	const Interaction = () => {
		readTimeline('interaction');
	}

	const Exit = () => {
		readTimeline('exit');
		if(core.info.sceneText){
			//sceneText.KillStop();
		}
	}

	const Map = () => {
		readTimeline('map');
	}

	const StartScene = () => {
		Start();
		Delay();
		Interval();
		Interaction();
		Event();
		//sceneTextDisplay();
	}

	const sceneTextDisplay = () => {
		if(core.info.sceneText){
			//sceneText.Start();
			//sceneText.DisplaySpeech({role: core.info.name,speech: '...'});
			let sceneTextTimeout = setTimeout(function () {
				//sceneText.DisplaySpeech({role: core.info.name,speech: core.info.description});
				clearTimeout(sceneTextTimeout);
			}, 1250); //Delay
		}
	}

	return {core, IfElse, SetFlag, ClearScene, AThisObjMethod, Info, Zone, Start, Delay, Interval, Event, Interaction, Exit, Map, StartScene}
}

//
//mapRegionDistrictTerritoryZoneSection
//Map Zone Gen & reader
const MapZone = (mapZoneData) => {
//Display Local Map and facilitate travel between Nodes
let core = {};
core.map = Object.assign({}, mapZoneData)
core.mapMenuData = false;
core.mapMenu;
core.nodes = {};
core.info;
core.currentNode;
core.zoneLoaded = false;
//core.nodes.nodeName.map = {connect0:{},connect1:{}};
//console.log('Running Map Zone...');
//console.log(mapZoneData);

//Map Movement Support
let timeout;
let timeout2;
let newNode;

	const ReadMapData = () => {
		for(let key in core.map){
			if(key === 'info'){
				core.info = core.map[key]
			} else {
				//console.log(key)//key - info, zone0Node0In1
				core.nodes[key] = aThis[key];
				//console.log(aThis[key])//this.nodeObj
				//console.log(core.map[key])//value - node connections
				for(let connect in core.map[key]){
					//console.log(core.map[key][connect]);//connect0, connect1
					for(let travel in core.map[key][connect]){
						//console.log(travel);//connect keys
						//console.log(core.map[key][connect][travel]);//connect values
						//inZone: true,
						//node: 'zone0Node0Out',
						//locked: true,
						//key: 'masterKey',
						//keepKey: true
					}
				}
			}
		}
	}
	//Prep for use on init
	ReadMapData();

	const StartScene = (nodeName) => {
		//core.currentNode = nodeName || Object.keys(core.nodes)[0];
		core.currentNode = nodeName || core.map.info.start;
		core.currentZone = core.info.id;
		if(core.zoneLoaded){} else {
			aThis[core.map.info.start].Zone();
			core.zoneLoaded = true;
		}
		aThis[core.currentNode].StartScene();
		//MoveMenuGen();
		//console.log('Scene Start');
		//console.log(core.currentNode);
	}

	const ClearScene = () => {
		aThis[core.currentNode].ClearScene();
	}

	const MoveMenuGen = () => {

		core.mapMenuData = {
			id: 'moveMenu',
			prompt: 'Move to...',
			options: {option0: '0'},
			actions: {action0: '0'},
			data: aThis.menuBaseData,
			cursorObj: core.currentZone,
			method: 'MenuMoveClick',
			pos: new THREE.Vector3(-1.5,1.5,-1),
		}
		//console.log(core.map);
		//console.log(core.map[core.currentNode]);
		let currNum = 0;
		let moveToNode;
		for(let connect in core.map[core.currentNode]){
			//console.log(connect);
			//core.map[core.currentNode][connect].inZone
			//core.map[core.currentNode][connect].node
			//core.map[core.currentNode][connect].travel
			//core.map[core.currentNode][connect].locked
			//core.map[core.currentNode][connect].key
			//core.map[core.currentNode][connect].keepKey

			//In Zone Node or Out of Zone Node
			if(core.nodes[core.map[core.currentNode][connect].node]){
				moveToNode = core.nodes[core.map[core.currentNode][connect].node];
			} else {
				moveToNode = aThis[core.map[core.currentNode][connect].node];
			}

			if(core.map[core.currentNode][connect].locked && !aThis.player.GetFlag(core.map[core.currentNode][connect].key)){
				core.mapMenuData.options['option'+currNum] = moveToNode.core.info.name + ' [Locked]';
			} else if(core.map[core.currentNode][connect].locked && aThis.player.GetFlag(core.map[core.currentNode][connect].key)){
				core.mapMenuData.options['option'+currNum] = moveToNode.core.info.name + ' [Unlocked]';
			} else {
				core.mapMenuData.options['option'+currNum] = moveToNode.core.info.name;
			}

			core.mapMenuData.actions['action'+currNum] = connect;
			//core.mapMenuData.actions['action'+currNum] = moveToNode.core.info.id;
			currNum++;

		}
		//core.map[core.currentNode][connect].inZone;
		//inZone
		//node
		//travel
		//locked
		//key
		//keepKey
		core.mapMenu = Menu(core.mapMenuData);
		core.mapMenu.MenuGen();
	}

	const MenuMoveClick = (el) => {
		let result = el.getAttribute('result');
		//console.log(result);//connect0
		Move(result);
	}

	const Move = (connect) => {

		newNode = core.map[core.currentNode][connect];
		//core.mapMenu.MenuRemove();
		ClearScene();
		//check if results name as a key exists in this zone
		if(core.nodes[newNode.node]){
			StartScene(newNode.node);
		} else {
			//switch zones / object control
			ClearZone();
			core.zoneLoaded = false;
			aThis[newNode.inZone].StartScene(newNode.node)
		}
		/*
		if(newNode.locked && !aThis.player.GetFlag(newNode.key)){
			//console.log('Needs key');
			clearTimeout(timeout2);
			//Testing
			//aThis.player.SetFlag({flag: newNode.key, value: true})
			//console.log('Key given');
		} else {
			if(newNode.locked && aThis.player.GetFlag(newNode.key) && !newNode.keepKey){
				aThis.player.SetFlag({flag: newNode.key, value: false})
				//console.log('Key taken');
			}
			//Timeout
			timeout = setTimeout(function () {

				clearTimeout(timeout);
			}, 425);
			//Instant, Shrink/Grow, Fade, Sphere, Blink
			//console.log(aThis.player)
			//console.log(aThis.player.layer)
			//console.log(aThis.player.layer.transition)
			//playerSpawnAnim();
		}*/
	}

	const ClearZone = () => {
	//Clear Core | Layer Scene Tracked Items
		//console.log('Clearing Scene...')
		//console.log(aThis.zoneSpawned);
		clearSpawned(aThis.zoneSpawned);
		/*
		for(let spawn in aThis.zoneSpawned){
			//console.log(spawn);//name of ID
			//console.log(aThis[spawn]);

			if(aThis[spawn]){
				if(aThis[spawn].type === 'core'){
						aThis[spawn].core.RemoveFromScene();
				} else if (aThis[spawn].type === 'layer'){
						aThis[spawn].layer.RemoveAllFromScene();
				} else {
					if(aThis[spawn].RemoveFromScene){
						aThis[spawn].RemoveFromScene();
					} else if(aThis[spawn].RemoveAllFromScene){
						aThis[spawn].RemoveAllFromScene();
					}
				}
			} else if(document.getElementById(spawn)){
				//console.log(spawn);
				//console.log(document.getElementById(spawn));
			}

			//console.log(aThis.zoneSpawned[spawn]);//Book & Page spawned from
			delete aThis.zoneSpawned[spawn];
		}*/
		//console.log(aThis.zoneSpawned);
	}

return {core, ReadMapData, StartScene, ClearScene, MoveMenuGen, MenuMoveClick, Move, ClearZone};
}

//
//Single Objs Gen Ring Spawn
const ObjsGenRing = (data) => {
	let gen = Object.assign({}, data);
	let ogData = Object.assign({}, data.objData);
	let objData = JSON.parse(JSON.stringify(data.objData));

	//gen.id
	//gen.objData
	//gen.total
	//gen.outerRingRadius
	//gen.innerRingRadius
	//gen.sameTypeRadius
	//gen.otherTypeRadius
	//gen.ranYPos
	//gen.yPosFlex
	//gen.ranScaleX
	//gen.ranScaleY
	//gen.ranScaleZ
	//gen.scaleFlex
	//gen.ranRotX
	//gen.ranRotY
	//gen.ranRotZ
	//gen.ranColor
	//gen.ranTexture

	let all = [];
	let posX;
	let posY;
	let posZ;
	let positionVec3;
	let scaleX;
	let scaleY;
	let scaleZ;
	let rotX;
	let rotY;
	let rotZ;
	let color;

	//Function to calculate distance between two points
	function distance(x1, z1, x2, z2) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2) * 1.0);
	}

	function randomPosition(radius, yPos){
		posX = Math.random() * (radius*2) - radius;
		posZ = Math.random() * (radius*2) - radius;
		return new THREE.Vector3(posX, yPos, posZ);
	}

	const genCores = () => {

		for(let a = 0; a < gen.total; a++){
			objData.id = ogData.id + a;

			//Color
			if(gen.ranColor){
				color = colorTheoryGen().base;
				objData.material.color = color;
				if(objData.material.emissive){
					objData.material.emissive = color;
				}
			}
			//Texture
			if(gen.ranTexture){
				objData.material.src = patterns[Math.floor(Math.random()*patterns.length)];
			}
			//Rotation
			rotX = objData.rotation.x;
			rotY = objData.rotation.y;
			rotZ = objData.rotation.z;
			if(gen.ranRotX){
				rotX += Math.random() * 360;
			}
			if(gen.ranRotY){
				rotY += Math.random() * 360;
			}
			if(gen.ranRotZ){
				rotZ += Math.random() * 360;
			}
			objData.rotation = new THREE.Vector3(rotX, rotY, rotZ);

			//Scale
			scaleX = gen.objData.scale.x;
			scaleY = gen.objData.scale.y;
			scaleZ = gen.objData.scale.z;
			if(gen.ranScaleX){
				scaleX += Math.random() * gen.scaleFlex;
			}
			if(gen.ranScaleY){
				scaleY += Math.random() * gen.scaleFlex;
			}
			if(gen.ranScaleZ){
				scaleZ += Math.random() * gen.scaleFlex;
			}
			objData.scale = new THREE.Vector3(scaleX, scaleY, scaleZ);

			//Scale adjustment needs affect gen.sameTypeRadius
			//Need to spawn equal amount in each quadrant?
			posY = gen.objData.position.y;
			if(gen.ranYPos){
				posY += Math.random() * gen.yPosFlex;
			}

			//Position
			positionVec3 = randomPosition(gen.outerRingRadius, posY);
			objData.position = positionVec3;

			//Max attempts to check for avoiding collision
			let checking = 42;
			checkAllData: while (checking > 0) {
				if(a === 0){
					if(distance(positionVec3.x,positionVec3.z,0,0) < gen.innerRingRadius) {
						positionVec3 = randomPosition(gen.outerRingRadius, posY);
						checking--;
						continue checkAllData;
					} else {
						objData.position = positionVec3;
					}
				}
				for(let z=0; z < all.length; z++) {
					//Check the distance, if too close, change and repeat
					if(distance(positionVec3.x, positionVec3.z, all[z].core.position.x, all[z].core.position.z) < gen.sameTypeRadius || distance(positionVec3.x,positionVec3.z,0,0) < gen.innerRingRadius) {
						positionVec3 = randomPosition(gen.outerRingRadius, posY);
						checking--;
						continue checkAllData;
					} else {
						objData.position = positionVec3;
					}
				}
				break;
			}

			//Add randomized Core to All
			all.push(Core(objData));
		}

	}

	const SpawnAll = () => {
		for(let a = 0; a < gen.total; a++){
			all[a].AddToScene(false, false, true);
		}
		AddToSceneTracker();
	}

	const DespawnAll = () => {
		for(let a = 0; a < gen.total; a++){
			all[a].RemoveFromScene();
		}
		RemoveFromSceneTracker();
	}

	const AddToSceneTracker = () => {
		//Scene Tracking of Assets
		if(aThis.zoneSpawned[gen.id]){} else {
			aThis.genSpawned[gen.id] = {type: 'gen', obj: gen};
		}
	}

	const RemoveFromSceneTracker = () => {
		//Clear Tracking of Asset
		delete aThis.genSpawned[gen.id];
	}

	return {all, genCores, SpawnAll, DespawnAll, AddToSceneTracker, RemoveFromSceneTracker};
}

//
//Scene Multi Asset Generator
const SceneAssetGen = (sceneData) =>{
	//let ogData = Object.assign({}, data.objData);
	//let objData = JSON.parse(JSON.stringify(data.objData));
	//sceneData.data
	//sceneData.id
//Add the ability to read an array of different objects for same size
//Need to better optimize each size's radius
	//sceneData.tiny
	//sceneData.small
	//sceneData.med
	//sceneData.large
	//sceneData.huge
	let scene = Object.assign({}, sceneData);
	scene.assets = {}
	scene.assets.tiny = [];
	scene.assets.small = [];
	scene.assets.med = [];
	scene.assets.large = [];
	scene.assets.huge = [];
	let sizes = ['tiny','small','med','large','huge'];
	scene.grid = [];
	scene.ring0 = [];
	scene.ring1 = [];
	scene.ring2 = [];
	scene.ring3 = [];
	scene.ring4 = [];
	scene.ring5 = [];
	/*
	scene.ring = {
		i0:0.25,
		o0:4,
		i1:1,
		o1:8,
		i2:2,
		o2:16,
		i3:4,
		o3:32,
		i4:8,
		o4:64,
		i5:16,
		o5:128,
	};*/
	scene.ring = {
		i0:0.5,
		o0:4,
		i1:3,
		o1:25,
		i2:5,
		o2:60,
		i3:6,
		o3:80,
		i4:8,
		o4:100,
		i5:18,
		o5:150,
	};
	//scene.size.data
	//scene.size.id
	//scene.size.type
	//scene.size.radius
	//scene.size.min
	//scene.size.max
	//scene.size.rings
	//scene.size.objs
	//scene.size.ranYPos
	//scene.size.yPosFlex
	//scene.size.ranScaleX
	//scene.size.ranScaleY
	//scene.size.ranScaleZ
	//scene.size.scaleFlex
	//scene.size.ranRotX
	//scene.size.ranRotY
	//scene.size.ranRotZ
	//scene.size.ranColor
	//scene.size.ranTexture
	//scene.size.ranAnim
//Ring 0 : 0-2 Radius - user spawn area - tiny/small
//Ring 1 : 2-4 Radius - immeadiately surrounding the spawn area - tiny/small/med
//Ring 2 : 4-8 Radius - a bit farther from spawn area - small/med/large
//Ring 3 : 8-12 Radius - medium distance from spawn - med/large
//Ring 4 : 12-20 Radius - far distance from spawn - large/huge
//Ring 5 : 20-40 Radius - super far distance from spawn - huge
//As grid creation creates a rectangle, could delete everything beyond 5

//Object Size Radius (meters)
//tiny - 0.1
//small - 0.25
//med - 1
//large - 2
//huge - 3

//On every loop through the grid creator, it will always use the center to spawn one, allow that one a parent, but do not use it for a spawning location

//Start with 1 mega mutating grid and add each size's recently added only on grid during generation
//Huge object grid spawn
//Import generated grid and spawn Large
//Import mutated grid and spawn Med
//Import mutated grid and spawn Small
//Import mutated grid and spawn Tiny
//console.log(scene.ring);
//Generate Distribution Points at Ring Radius'
let ring5 = [];
let ring4 = [];
let ring3 = [];
let ring2 = [];
let ring1 = [];
let ring0 = [];
let gridRing5 = discSampling('ring5',scene.ring.o5,scene.ring.i5);
//console.log(gridRing5);

let gridRing4 = discSampling('ring4',scene.ring.o4,scene.ring.i4,gridRing5);
//console.log(gridRing4);

let gridRing3 = discSampling('ring3',scene.ring.o3,scene.ring.i3,gridRing4);
//console.log(gridRing3);

let gridRing2 = discSampling('ring2',scene.ring.o2,scene.ring.i2,gridRing3);
//console.log(gridRing2);

let gridRing1 = discSampling('ring1',scene.ring.o1,scene.ring.i1,gridRing2);
//console.log(gridRing1);

let gridRing0 = discSampling('ring0',scene.ring.o0,scene.ring.i0,gridRing1);
//console.log(gridRing0);
//console.log(gridRing0.length);
let ring5Current = 0;
let ring4Current = 0;
let ring3Current = 0;
let ring2Current = 0;
let ring1Current = 0;
let ring0Current = 0;


//And check each for how close to center they are, if too close, remove
//Instead of offsetting here, which pushes all smaller ones super negative, offset them forward in the gridGeneration stage

//Offset all to center and remove center
for(let pos in ring5){
	ring5[pos][0] -= scene.ring.o5/2;
	ring5[pos][1] -= scene.ring.o5/2;
	if(ring5[pos][0] === 0 && ring5[pos][1] === 0){
		ring5[pos][0] = ring5[pos][1] = scene.ring.o5/2;
	}
}
for(let pos in ring4){
	ring4[pos][0] -= scene.ring.o4/2;
	ring4[pos][1] -= scene.ring.o4/2;
	if(ring4[pos][0] === 0 && ring4[pos][1] === 0){
		ring4[pos][0] = ring4[pos][1] = scene.ring.o4/2;
	}
}
for(let pos in ring3){
	ring3[pos][0] -= scene.ring.o3/2;
	ring3[pos][1] -= scene.ring.o3/2;
	if(ring3[pos][0] === 0 && ring3[pos][1] === 0){
		ring3[pos][0] = ring3[pos][1] = scene.ring.o3/2;
	}
}
for(let pos in ring2){
	ring2[pos][0] -= scene.ring.o2/2;
	ring2[pos][1] -= scene.ring.o2/2;
	if(ring2[pos][0] === 0 && ring2[pos][1] === 0){
		ring2[pos][0] = ring2[pos][1] = scene.ring.o2/2;
	}
}
for(let pos in ring1){
	ring1[pos][0] -= scene.ring.o1/2;
	ring1[pos][1] -= scene.ring.o1/2;
	if(ring1[pos][0] === 0 && ring1[pos][1] === 0){
		ring1[pos][0] = ring1[pos][1] = scene.ring.o1/2;
	}
}
for(let pos in ring0){
	ring0[pos][0] -= scene.ring.o0/2;
	ring0[pos][1] -= scene.ring.o0/2;
	if(ring0[pos][0] === 0 && ring0[pos][1] === 0){
		ring0[pos][0] = ring0[pos][1] = scene.ring.o0/2;
	}
}

//Shuffle Array
function shuffle(array) {
	array.sort(() => Math.random() - 0.5);
}

//Shuffle Each Array for better randomness
shuffle(ring5);
shuffle(ring4);
shuffle(ring3);
shuffle(ring2);
shuffle(ring1);
shuffle(ring0);
//console.log(ring5);
//console.log(ring4);
//console.log(ring3);
//console.log(ring2);
//console.log(ring1);
//console.log(ring0);

//
//Disc Sampling
function discSampling(ring, area, space, currentGrid){
//Generates grid starting from 0,0 in the + direction
//Could adjust to use - as well or just spawn and shift the entire spawned set based on provided grid. i.e. 10x10 grid, move everything -5,-5
//But need a center radius to be clear which would be within 5,5 here. Could create a sample automatically which is always blank which would be the very first sample always!

//Need different radius for different objects and all checked

//Generates grid starting from 0,0 in the + direction
//Could adjust to use - as well or just spawn and shift the entire spawned set based on provided grid. i.e. 10x10 grid, move everything -5,-5
//But need a center radius to be clear which would be within 5,5 here. Could create a sample automatically which is always blank which would be the very first sample always!
//console.log(ring);
//Need different radius for different objects and all checked
let grid;
let center;
if(currentGrid){
	center = currentGrid.center;
} else {
	center = false;
}
function* poissonDiscSampler(width, height, radius, center){
	//const k = 4; // maximum number of samples before rejection
	const k = 15// maximum number of samples before rejection
	const radius2 = radius * radius;
	//radius is of the generated area
	//radius2 is the minimum distance allowed between spawns
	const cellSize = radius * Math.SQRT1_2;
	//Math.SQRT1_2 is a constant square root of 0.5 which is ~0.707
	const gridWidth = Math.ceil(width / cellSize);
	const gridHeight = Math.ceil(height / cellSize);
	//const grid = new Array(gridWidth * gridHeight);
	//const queue = [];
	let queue = [];
	grid = new Array(gridWidth * gridHeight);
	if(currentGrid){
		for(let each in currentGrid){
			grid[each] = currentGrid[each];
			queue[each] = currentGrid[each];
		}
		//console.log(currentGrid);
		//console.log(grid);
	}
	//
	if(center){
		yield {add: sample(center, center, null)};
	} else {
		yield {add: sample(width / 2 , height / 2, null)};
	}


	//console.log(k);//4
	//console.log(radius2);//4
	//console.log(cellSize);//1.4
	//console.log(gridWidth);//8
	//console.log(gridHeight);//8
	//console.log(grid);//64slots = 8x8 grid
	//console.log(queue);
	//
	//Instead of letting it go to what it thinks is center, offset the starting position be center of the very first one
	//
	// Pick the first sample at center of width/height grid
	//console.log('Picking 1st Sample');


	// Pick a random existing sample from the queue.
	pick: while (queue.length) {
		//console.log('Picking...');
		//const i = Math.random() * queue.length | 0;
		const i = Math.trunc(Math.random() * queue.length);
		const parent = queue[i];
		const seed = Math.random();
		const epsilon = 0.0000001;
		//console.log(i);
		//console.log(parent);
		//console.log(seed);
		//console.log(epsilon);

		// Make a new candidate.
		//console.log('Make New Candidate');
		for (let j = 0; j < k; ++j) {
			const a = 2 * Math.PI * (seed + 1.0*j/k);
			//Depending on the amount of tries allowed
			//start from 0degrees and move radius to check
			//as the loop continues/fails, keep moving counter-clockwise in equal parts depending on the current attempt number out of max
			//checking each new direction if that space is available
			const r = radius + epsilon;
			const x = parent[0] + r * Math.cos(a);
			const y = parent[1] + r * Math.sin(a);
			//console.log('Candidate Loop...');
			//console.log(a);
			//console.log(r);
			//console.log(x);
			//console.log(y);

			// Accept candidates that are inside the allowed extent
			// and farther than 2 * radius to all existing samples.
			//area o0 4
			//space i0 0.5
			if (space <= x && x < area && space <= y && y < area && far(x, y)) {
				//console.log('Candidate Accepted');
				yield {add: sample(x, y), parent};
				//console.log('Pick Again');
				continue pick;
			}
			//console.log('Candidate Rejected');
		}

		// If none of k candidates were accepted, remove it from the queue.
		//console.log('Max Attempts Hit. Clear Parent');
		const r = queue.pop();
		if (i < queue.length) queue[i] = r;
			yield {remove: parent};
	}

	function far(x, y) {
		//const i = x / cellSize | 0;
		const i = Math.trunc(x / cellSize);
		//const j = y / cellSize | 0;
		const j = Math.trunc(y / cellSize);
		// | is bitwise OR operator
		//returns a 1 in each bit position for which the corresponding bits of either or both operands are 1s. 
		//const a = 5;        // 00000000000000000000000000000101
		//const b = 3;        // 00000000000000000000000000000011
		//console.log(a | b); // 00000000000000000000000000000111
		// Expected output: 7
		//Bitwise ORing any number x with 0 returns x converted to a 32-bit integer. Do not use | 0 to truncate numbers to integers; use Math.trunc() instead.
		const i0 = Math.max(i - 2, 0);
		const j0 = Math.max(j - 2, 0);
		const i1 = Math.min(i + 3, gridWidth);
		const j1 = Math.min(j + 3, gridHeight);
		//Only check surrounding squares of a 2x2 grid from candidate xy center

		//console.log('Checking Distance');
		//console.log(i);
		//console.log(j);
		//console.log(i0);
		//console.log(j0);
		//console.log(i1);
		//console.log(j1);

		//Loop through grid
		for (let j = j0; j < j1; ++j) {
			const o = j * gridWidth;
			for (let i = i0; i < i1; ++i) {
				const s = grid[o + i];
				//only does a check if something on the grid in that position exists
				if (s) {
					//get the difference in grid stored xy with the imported
					const dx = s[0] - x;
					const dy = s[1] - y;
					//pythagorean check for distance. Needs to be at least 2xRadius away from current check point
					if (dx * dx + dy * dy < radius2) return false;
				}
			}
		}
		return true;
	}

	//Sample
	function sample(x, y, parent) {
		//const s = grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = [x, y];
		const s = grid[gridWidth * (Math.trunc(y / cellSize)) + (Math.trunc(x / cellSize))] = [x, y];
		queue.push(s);
		//console.log('Sample Added!');
		//console.log(s);
		//console.log(queue);
		if(ring === 'ring5'){
			ring5.push(s);
			//console.log(ring5)
		} else if(ring === 'ring4'){
			ring4.push(s);
		} else if(ring === 'ring3'){
			ring3.push(s);
		} else if(ring === 'ring2'){
			ring2.push(s);
		} else if(ring === 'ring1'){
			ring1.push(s);
		} else if(ring === 'ring0'){
			ring0.push(s);
		}
		return s;
	}

}

	let gridSample = poissonDiscSampler(area,area,space,center);

	function next(){
		//next yielded spot and update done var
		gridSample.done = gridSample.next().done;
		if(gridSample.done){
			//console.log('All Done!');
			//console.log(grid)
			//console.log(grid.length)
		} else {
			//console.log('Running...');
			next();
		}
	}
	next();
	let goodGrid = [];
	for(let each in grid){
		if(grid[each]){
			goodGrid.push(grid[each]);
		}
	}

	//console.log(goodGrid);
	return goodGrid;
}

	const genCores = () => {

		//loop through each size
		for(let type in sizes){
			//sizes[type]//tiny,small,med,large,huge
			//let size = scene[sizes[type]];//scene.tiny object, scene.small object
			let size = Object.assign({}, scene[sizes[type]]);
			//console.log(size);
			//Inside of single data object of a Size
			//Tiny

			//using max amount dived by amount of objs provided, loop through that many for each of those obj

			//using obj data provided, randomize max amount of potential data objects to be spawned


			//loop through each different object provided
			for(let each in size.objs){
				let ogData = Object.assign({}, size.objs[each]);
				//console.log(ogData);
				let objData = JSON.parse(JSON.stringify(size.objs[each]));
				let posX;
				let posY;
				let posZ;
				let positionVec3;
				let scaleX;
				let scaleY;
				let scaleZ;
				let rotX;
				let rotY;
				let rotZ;
				let color;

//instanced-mesh="positioning: local"
//instanced-mesh-member="mesh:#instanceTest1"

				//Loop through an even amount for each obj based on max
				for(let a = 0; a < size.max/size.objs.length; a++){
					objData.id = ogData.id + a;
					/* Instanced Mesh struggles with GLTF layers
<script src="https://cdn.jsdelivr.net/gh/diarmidmackenzie/instanced-mesh@v0.5.0/src/instanced-mesh.min.js"></script>
					if(a === 0){
						objData.components['instanced-mesh'] = {positioning: 'world'};
					} else {
						//Remove gltf component and add instanced mesh
						delete objData.components['gltf-model'];
						objData.components['instanced-mesh-member'] = {mesh: '#'+ogData.id+0};
					}*/
					//Color
					if(size.ranColor){
						color = colorTheoryGen().base;
						objData.material.color = color;
						if(objData.material.emissive){
							objData.material.emissive = color;
						}
					}
					//Texture
					if(size.ranTexture){
						objData.material.src = patterns[Math.floor(Math.random()*patterns.length)];
					}
					//Rotation
					rotX = ogData.rotation.x;
					rotY = ogData.rotation.y;
					rotZ = ogData.rotation.z;
					if(size.ranRotX){
						rotX += Math.random() * 360;
					}
					if(size.ranRotY){
						rotY += Math.random() * 360;
					}
					if(size.ranRotZ){
						rotZ += Math.random() * 360;
					}
					objData.rotation = new THREE.Vector3(rotX, rotY, rotZ);

					//Scale
					scaleX = ogData.scale.x;
					scaleY = ogData.scale.y;
					scaleZ = ogData.scale.z;
					if(size.ranScaleX){
						scaleX += Math.random() * size.scaleFlex;
					}
					if(size.ranScaleY){
						scaleY += Math.random() * size.scaleFlex;
					}
					if(size.ranScaleZ){
						scaleZ += Math.random() * size.scaleFlex;
					}
					objData.scale = new THREE.Vector3(scaleX, scaleY, scaleZ);

					//Position
					posY = ogData.position.y;
					if(size.ranYPos){
						posY += Math.random() * size.yPosFlex;
					}
					if(size.rings === 0){
						if(ring0Current < ring0.length){
							posX = ring0[ring0Current][0];
							posZ = ring0[ring0Current][1];
							ring0Current++;
						} else {
							//Out of predefined positions, choose ran
							//console.log('Out of Ring 0 Pos');
							posX = (Math.random() * (scene.ring.o0*2) - scene.ring.o0) + scene.ring.i0;
							posZ = (Math.random() * (scene.ring.o0*2) - scene.ring.o0) + scene.ring.i0;
						}
					} else if(size.rings === 1){
						if(ring1Current < ring1.length){
							posX = ring1[ring1Current][0];
							posZ = ring1[ring1Current][1];
							ring1Current++;
						} else {
							//Out of predefined positions, choose ran
							//console.log('Out of Ring 1 Pos');
							posX = (Math.random() * (scene.ring.o1*2) - scene.ring.o1) + scene.ring.i1;
							posZ = (Math.random() * (scene.ring.o1*2) - scene.ring.o1) + scene.ring.i1;
						}
					} else if(size.rings === 2){
						if(ring2Current < ring2.length){
							posX = ring2[ring2Current][0];
							posZ = ring2[ring2Current][1];
							ring2Current++;
						} else {
							//Out of predefined positions, choose ran
							//console.log('Out of Ring 2 Pos');
							posX = (Math.random() * (scene.ring.o2*2) - scene.ring.o2) + scene.ring.i2;
							posZ = (Math.random() * (scene.ring.o2*2) - scene.ring.o2) + scene.ring.i2;
						}
					} else if(size.rings === 3){
						if(ring3Current < ring3.length){
							posX = ring3[ring3Current][0];
							posZ = ring3[ring3Current][1];
							ring3Current++;
						} else {
							//Out of predefined positions, choose ran
							//console.log('Out of Ring 3 Pos');
							posX = (Math.random() * (scene.ring.o3*2) - scene.ring.o3) + scene.ring.i3;
							posZ = (Math.random() * (scene.ring.o3*2) - scene.ring.o3) + scene.ring.i3;
						}
					} else if(size.rings === 4){
						if(ring4Current < ring4.length){
							posX = ring4[ring4Current][0];
							posZ = ring4[ring4Current][1];
							ring4Current++;
						} else {
							//Out of predefined positions, choose ran
							//console.log('Out of Ring 4 Pos');
							posX = (Math.random() * (scene.ring.o4*2) - scene.ring.o4) + scene.ring.i4;
							posZ = (Math.random() * (scene.ring.o4*2) - scene.ring.o4) + scene.ring.i4;
						}
					} else if(size.rings === 5){
						if(ring5Current < ring5.length){
							posX = ring5[ring5Current][0];
							posZ = ring5[ring5Current][1];
							ring5Current++;
						} else {
							//Out of predefined positions, choose ran
							//console.log('Out of Ring 5 Pos');
							posX = (Math.random() * (scene.ring.o5*2) - scene.ring.o5) + scene.ring.i5;
							posZ = (Math.random() * (scene.ring.o5*2) - scene.ring.o5) + scene.ring.i5;
						}
					} 



					objData.position = new THREE.Vector3(posX, posY, posZ);
					//console.log(objData.position);
					//Add randomized Core to All
					scene.assets[sizes[type]].push(Core(objData));
				}

			}
		}
	}
	genCores();
	const SpawnAll = () => {
		//console.log(scene.assets)
		//loop throusgh each size
		for(let type in sizes){
			//sizes[type]//tiny,small,med,large,huge
			//let size = scene[sizes[type]];//scene.tiny object, scene.small object
			let size = scene.assets[sizes[type]];
			//console.log(size);
			for(let each in size){
				size[each].AddToScene(false, false, true);
			}
			//AddToSceneTracker();
		}

	}

	const DespawnAll = () => {
		for(let type in sizes){
			//sizes[type]//tiny,small,med,large,huge
			//let size = scene[sizes[type]];//scene.tiny object, scene.small object
			let size = scene.assets[sizes[type]];
			//console.log(size);
			for(let each in size){
				size[each].RemoveFromScene();
			}
			//AddToSceneTracker();
		}
		//RemoveFromSceneTracker();
	}

	const AddToSceneTracker = () => {
		//Scene Tracking of Assets
		if(aThis.zoneSpawned[gen.id]){} else {
			aThis.genSpawned[gen.id] = {type: 'gen', obj: gen};
		}
	}

	const RemoveFromSceneTracker = () => {
		//Clear Tracking of Asset
		delete aThis.genSpawned[gen.id];
	}


	return {scene, SpawnAll, DespawnAll,}

}

/********************************************************************/

//
//Targets
const Target = (id, num, layer) => {

let target = Object.assign({}, layer);
target.id = id;
target.num = num;

	const Spawn = () => {
		//update data before spawning
		let newLocation = new THREE.Vector3(0,0,0);
		newLocation.copy(targetLocations[target.num]);
		target.layer.all.parent.core.core.position = newLocation;
		//Update Health before spawning
		let newHealth = 2;
		let healthAdjustment = Math.floor(Math.random()*4-2);
		newHealth = healthAdjustment + levelEnemyTotalHealthPool;
		if(newHealth < 1){
			newHealth = 1;
		}
		if(newHealth > 7){
			newHealth = 7;
		}
		target.layer.all.child0.core.core.components['block-hits'].hits = newHealth;
		target.AddAllToScene(true);
		AddToTargetSceneTracker();
	}


	const Despawn = () => {
		target.RemoveAllFromScene(true);
		RemoveFromTargetSceneTracker();
	}

	const Death = () => {
		Despawn();
		//Use this to add points or otherwise alter the gamestate
		//component currently handling points
	}

	const AddToTargetSceneTracker = () => {
    	aThis.targetSpawned[target.id] = {type: 'target', obj: target};
	}

	const RemoveFromTargetSceneTracker = () => {
		delete aThis.targetSpawned[target.id];
	}

	const SetFlag = ({flag, value}) => {
		target[flag] = value;
		//console.log(flag);
		//console.log(core[flag]);
	}

	const GetFlag = (varName) => {
		//console.log(varName)
		//console.log(core[varName])
		return target[varName];
	}

return {target, Spawn, Despawn, Death, SetFlag, GetFlag};
}

//
//Enemy
const Enemy = (id, num, layer) => {

let enemy = Object.assign({}, layer);
enemy.id = id;
enemy.ammoType = enemy.layer.all.parent.core.core.components['enemy-hits'].enemyType;
enemy.num = num;

	const Spawn = () => {
		let newLocation = new THREE.Vector3(0,0,0);
		let enemyWhere = Object.keys(aThis.enemySpawned).length;
		if(enemyWhere === 0){
			newLocation.copy(enemyLocationsPlatforms[enemy.num]);
		} else if(enemyWhere === 0){
			newLocation.copy(enemyLocationsBackRight[enemy.num]);
		} else if(enemyWhere === 0){
			newLocation.copy(enemyLocationsBackLeft[enemy.num]);
		} else if(enemyWhere === 0){
			newLocation.copy(enemyLocationsFrontRight[enemy.num]);
		} else if(enemyWhere === 0){
			newLocation.copy(enemyLocationsFrontLeft[enemy.num]);
		} else {
			newLocation.copy(enemyLocationsPlatforms[enemy.num]);
		}
		//Update Health before spawning
		let newHealth = 2;
		let healthAdjustment = Math.floor(Math.random()*4-2);
		newHealth = healthAdjustment + levelTargetTotalHealthPool;
		if(newHealth < 4){
			newHealth = 4;
		}
		if(newHealth > 8){
			newHealth = 8;
		}
		enemy.layer.all.parent.core.core.components['enemy-hits'].hits = newHealth;
		enemy.layer.all.parent.core.core.position = newLocation;
		enemy.AddAllToScene(true);
		AddToEnemySceneTracker();
	}

	function clearAmmo() {
	for(let ammo in allEnemyAmmo){
		if(allEnemyAmmo[ammo].type === enemy.ammoType){
			if(document.getElementById(allEnemyAmmo[ammo].name)){
				sceneEl.removeChild(document.getElementById(allEnemyAmmo[ammo].name));
			}
		}
	}
	} 

	const Despawn = () => {
		enemy.EmitEventParent('stop');
		clearAmmo();
		RemoveFromEnemySceneTracker();
		enemy.RemoveAllFromScene(true);
	}

	const DropBonus = () => {

//pickUpHealthActive
//aThis.pickUpHealth.AddToScene();
//pickUpBonusActive
//aThis.pickUpBonus.AddToScene();
//pickUpPowerActive
//aThis.pickUpPower.AddToScene();

	}

	const Death = () => {
		Despawn();
		//Use this to add points or otherwise alter the gamestate
		//component currently handling points
	}

	const AddToEnemySceneTracker = () => {
    	aThis.enemySpawned[enemy.id] = {type: 'enemy', obj: enemy};
	}

	const RemoveFromEnemySceneTracker = () => {
		delete aThis.enemySpawned[enemy.id];
	}

	const SetFlag = ({flag, value}) => {
		enemy[flag] = value;
		//console.log(flag);
		//console.log(core[flag]);
	}

	const GetFlag = (varName) => {
		//console.log(varName)
		//console.log(core[varName])
		return enemy[varName];
	}

return {enemy, Spawn, Despawn, Death, SetFlag, GetFlag};
}

//
//Death
const Death = (id, num, layer) => {

let death = Object.assign({}, layer);
death.id = id;
death.parentId = death.layer.all.parent.core.core.id;
//['sq-rigidbody']:{useGravity: false},
death.childId = death.layer.all.child0.core.core.id;
//['sq-triggercollider']:null,
death.parent;
death.objectId;
death.num = num;

death.xDirection = Math.random()*2-1;
death.yDirection = Math.random()*2-1;
death.zDirection = Math.random()*2-1;
death.shootForce = 1;
death.bounceType = 'impulse';
death.blockBounce = 1;

death.intervalTime = 7000;
let forceTimeout;
let tempDeathTimeout;
let forceInterval;

death.hit = false;
death.dead = false;

	const Spawn = () => {
		let newLocation = new THREE.Vector3(0,0,0);
		newLocation.copy(deathLocations[death.num]);
		death.layer.all.parent.core.core.position = newLocation;
		death.AddAllToScene(true);
		AddToDeathSceneTracker();
		death.parent = document.getElementById(death.parentId);
		death.objectId = document.getElementById(death.parentId).object3D.id;
		deathCubeSpawnAudio.play();
		//Add random force after init spawn
		forceTimeout = setTimeout(function () {
			AddForce();
			clearTimeout(forceTimeout);
		}, 1000);
		//Add random force on interval
		forceInterval = setInterval(function() {
			AddForce();
		}, death.intervalTime - currentLevel*10);
	}

	const Despawn = () => {
		death.RemoveAllFromScene(true);
		clearTimeout(forceTimeout);
		clearInterval(forceInterval);
		clearTimeout(tempDeathTimeout);
		RemoveFromDeathSceneTracker();
	}

	const TempDeath = () => {
		//Upon enough hits, death cube temporarily can't hurt the player
		death.dead = true;
		tempDeathTimeout = setTimeout(function () {
			death.dead = false;
			clearTimeout(tempDeathTimeout);
		}, 15000);
	}

	const AddForce = () => {
		//Random direction every time
		death.xDirection = Math.random()*2-1;
		death.yDirection = Math.random()*2-1;
		death.zDirection = Math.random()*2-1;
		addForce({x: death.xDirection*4, y: death.yDirection*4, z: death.zDirection*4}, death.bounceType, death.objectId);
	}

	const AddToDeathSceneTracker = () => {
    	aThis.deathSpawned[death.id] = {type: 'death', obj: death};
	}

	const RemoveFromDeathSceneTracker = () => {
		delete aThis.deathSpawned[death.id];
	}

	const SetFlag = ({flag, value}) => {
		death[flag] = value;
		//console.log(flag);
		//console.log(core[flag]);
	}

	const GetFlag = (varName) => {
		//console.log(varName)
		//console.log(core[varName])
		return death[varName];
	}

return {death, Spawn, Despawn, TempDeath, AddForce, SetFlag, GetFlag}
}

//
//Power Ups
const Power = (id, num, core) => {

let power = Object.assign({}, core);
power.id = id;
power.num = num;

	const Spawn = () => {
		//update data before spawning
		let newLocation = new THREE.Vector3(0,0,0);
		newLocation.copy(powerLocations[power.num]);
		power.core.position = newLocation;
		power.AddToScene(false,false,true);
		AddToPowerSceneTracker();
	}

	const Despawn = () => {
		power.RemoveFromScene(false,false,true);
		RemoveFromPowerSceneTracker();
	}

	const AddToPowerSceneTracker = () => {
    	aThis.powerSpawned[power.id] = {type: 'power', obj: power};
	}

	const RemoveFromPowerSceneTracker = () => {
		delete aThis.powerSpawned[power.id];
	}

	const SetFlag = ({flag, value}) => {
		power[flag] = value;
		//console.log(flag);
		//console.log(core[flag]);
	}

	const GetFlag = (varName) => {
		//console.log(varName)
		//console.log(core[varName])
		return power[varName];
	}

return {power, Spawn, Despawn, SetFlag, GetFlag};
}

// Library Data
/********************************************************************/
//

//Materials Library
//

//Do Not Use for Banter
const patterns = [];

//
//Animations Library

//360 Rotation
this.animSpinData = {
	name: 'animspin',
	property: 'object3D.rotation.y', 
	from: '0', 
	to: '360', 
	dur: 20000, 
	delay: 0, 
	loop: 'true', 
	dir: 'normal', 
	easing: 'linear', 
	elasticity: 400, 
	autoplay: true, 
	enabled: true
};

//
//Data Library

//
//Null Parent Template
this.nullParentData = {
data:'nullParent',
id:'nullParent',
sources:false,
text: false,
geometry: false,
material: false,
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['nullParent','a-ent'],
components: false,
};

//
//Menu Button Base Template
this.menuBaseData = {
data:'menu part',
id:'menuBaseTemp',
sources:false,
text: {value:'Hmmm...', wrapCount: 20, color: "#FFFFFF", font: "exo2bold", zOffset: 0.025, side: 'double', align: "center", baseline: 'center'},
geometry: {primitive: 'box', depth: 0.04, width: 0.4, height: 0.15},
material: {shader: "standard", color: "#c1664b", opacity: 1, metalness: 0.2, roughness: 0.8, emissive: "#c1664b", emissiveIntensity: 0.6},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations:{
click1:{property: 'scale', from: '1 1 1', to: '1.05 1.05 1.05', dur: 125, delay: 0, loop: '1', dir: 'alternate', easing: 'easeInOutElastic', elasticity: 400, autoplay: false, enabled: true, startEvents: 'click'},
click2:{property: 'material.emissiveIntensity', from: '0.6',to: '0.8', dur: 125, delay: 0, loop: '1', dir: 'alternate', easing: 'easeInOutElastic', elasticity: 400, autoplay: false, enabled: true, startEvents: 'click'},
},
mixins: false,
classes: ['clickable','a-ent'],
components: {
//['look-at']:'#camera',
['sq-collider']:null,
['sq-triggercollider']:null,
},
};

//
//Companion Hamburger Menu Dude Data
this.hamCompData = {
data:'HAM',
id:'hamComp',
sources: false,
text: {value:'Menu', width: 3, color: "#FFFFFF", align: "center", font: "exo2bold", zOffset: 0.135, side: 'double'},
geometry: {primitive: 'box', depth: 0.25, width: 0.25, height: 0.25},
material: {src: './assets/img/minty/4up.jpg', shader: "flat", color: "#FFFFFF", opacity: 1},
position: new THREE.Vector3(1,1,-0.25),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations:{bobbing:{property: 'object3D.position.y', from: 1.1, to: 1.4, dur: 7000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutSine', elasticity: 400, autoplay: true, enabled: true, pauseEvents: 'mouseenter', resumeEvents: 'mouseleave'}, weaving: {property: 'object3D.rotation.y', from: 280, to: 320, dur: 10000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutElastic', elasticity: 400, autoplay: true, enabled: false}, click: {property: 'scale', from: '1 1 1', to: '1.25 1.25 1.25', dur: 125, delay: 0, loop: '1', dir: 'alternate', easing: 'easeInOutElastic', elasticity: 400, autoplay: false, enabled: true, startEvents: 'click'}  },
mixins: false,
classes: ['clickable','a-ent'],
components: {
clickrun:{cursorObj: 'hamComp', method: 'Click', params: null}, 
fusingrun:{cursorObj: 'hamComp', method: 'FuseClickRun', params: null}, 
mousedownrun:{cursorObj: 'hamComp', method: 'CursorDownRun', params: null}, 
mouseenterrun:{cursorObj: 'hamComp', method: 'CursorEnterRun', params: null}, 
mouseleaverun:{cursorObj: 'hamComp', method: 'CursorLeaveRun', params: null}, 
mouseuprun:{cursorObj: 'hamComp', method: 'CursorUpRun', params: null},
eventrun:{event: 'testEventHit',cursorObj: 'hamComp', method: 'FuseClickRun', params: null}, 
['look-at']:'#camera', 
},
};

//
//Details & Prompt

//Detail Main View
this.detailMainData = {
data:'detail main',
id:'detailMain',
sources:false,
text: {value:'Details...', color: "#FFFFFF", align: "center", font: "exo2bold", zOffset: 0.065, side: 'double'},
geometry: {primitive: 'box', depth: 0.1, width: 1, height: 1},
material: {shader: "standard", color: "#4bb8c1", opacity: 1, metalness: 0.2, roughness: 0.8, emissive: "#4bb8c1", emissiveIntensity: 0.6},
position: new THREE.Vector3(0,1.5,-1.5),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0,0,0),
animations:{opening:{property: 'scale', from: '0.001 0.001 0.001', to: '1 1 1', dur: 500, delay: 50, loop: 'false', dir: 'linear', easing: 'easeInOutElastic', elasticity: 400, autoplay: true, enabled: true, startEvents: 'open'}, close: {property: 'scale', from: '1 1 1', to: '0.001 0.001 0.001', dur: 500, delay: 50, loop: false, dir: 'linear', easing: 'easeInOutElastic', elasticity: 400, autoplay: false, enabled: true, startEvents: 'close'}},
mixins: false,
classes: ['a-ent'],
components: {
detailprompt:{type: 'detail'},
['look-at']:'#camera',
},
};
//Detail Close Button
this.detailCloseData = {
data:'detail close',
id:'detailClose',
sources:false,
text: {value:'X', width: 3, color: "#FFFFFF", align: "center", font: "exo2bold", zOffset: 0.065, side: 'double'},
geometry: {primitive: 'box', depth: 0.1, width: 0.25, height: 0.25},
material: {shader: "standard", color: "#c14b4b", opacity: 1, metalness: 0.2, roughness: 0.8, emissive: "#c14b4b", emissiveIntensity: 0.6},
position: new THREE.Vector3(0.5,0.5,0.05),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0,0,0),
animations:{opening:{property: 'scale', from: '0.001 0.001 0.001', to: '1 1 1', dur: 500, delay: 50, loop: 'false', dir: 'linear', easing: 'easeInOutElastic', elasticity: 400, autoplay: true, enabled: true, startEvents: 'open'}, close: {property: 'scale', from: '1 1 1', to: '0.001 0.001 0.001', dur: 500, delay: 50, loop: false, dir: 'linear', easing: 'easeInOutElastic', elasticity: 400, autoplay: false, enabled: true, startEvents: 'close'}},
mixins: false,
classes: ['clickable','a-ent'],
components: {detailprompt:{type: 'detail'}},
};

//Sound Testing
this.soundTestingData = {
data:'Sound Testing',
id:'soundTesting',
sources: false,
sound: {src: './assets/audio/270341__littlerobotsoundfactory__pickup-04.wav', autoplay: false, loop: false, volume: 1, on: 'playSound'},
text: false,
geometry: false,
material: false,
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['sound','a-ent'],
components: false,
};

//Banter
/*
//Portal to Community Hub
//<a-link position="0 0 -4" title="Community Hub" 
//href="https://sq-community-hub.glitch.me" 
//image="https://logo.clearbit.com/sidequestvr.com"></a-link>

//Banter Protocol
//<a href="banter://sq-sdk-rpmtag.glitch.me">Click Me!</a>

//Banter Javascript Methods
//setText('idName', "New Text...");
//generateParametric(10, 10, (u, v) => {x: 0, y: 0, z: 0});
//movePlayer({x: 0, y: 0, z: 0});
//openPage("https://sidequestvr.github.io/Banter/");
//rayCast({x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 1}, 45);
//addForce({x: 0, y: 1000, z: 0}, 'force', 23)
//addExplosionForce(100, {x: 0, y: 0, z: 0}, 5, 23)
//addGlobalExplosionForce(100, {x: 0, y: 0, z: 0}, 5)
//movePosition({x: 0, y: 0, z: 0}, 'idName')
//moveRotation({x: 0, y: 0, z: 0}, 'idName')
//timeScale(1);
//gravity({x: 0, y: -9.8, z: 0})
//playerSpeed(true)
//lockPlayer();
//unlockPlayer();
//enableControllerExtras();
//setRefreshRate(90);
//updateGeometry('idName', {points: [{i: 0, p: {x: 0, y: 0, z: 0}}]});
*/
this.componentExamples = {
components: {
['sq-grabbable']: null,
['sq-rigidbody']:{mass: 0.1,drag: 0,angularDrag: 0.05,isKinematic: false,useGravity: true,toChild: false,centerOfMass: new THREE.Vector3(0,0,0),collisionDetextionMode: 'discrete',velocity: new THREE.Vector3(0,0,0),freePosX: false,freePosY: false,freePosZ: false,freeRotX: false,freeRotY: false,freeRotZ: false,},
['sq-climbable']: null,
['sq-slippery']: {friction: 0, recursive: false},
['sq-sticky']: {recursive: false},
['sq-interactable']: null,
['sq-raycaster']: {continuous: false, startEvents: 'click'},

['sq-collider']: {recursive: false},
['sq-invertedcollider']: null,
['sq-triggercollider']: null,
['sq-nonconvexcollider']: {recursive: false},
['sq-boxcollider']: {center: new THREE.Vector3(0,0,0), size: new THREE.Vector3(1,1,1)},
['sq-spherecollider']: {center: new THREE.Vector3(0,0,0), radius: 0.5},
['sq-capsulecollider']: {center: new THREE.Vector3(0,0,0), radius: 0.5, height: 1},

['sq-head']: {whoToShow: 'everyone'},
//['sq-head']: {whoToShow: 'onlyme'},
//['sq-head']: {whoToShow: 'everyoneelse'},
['sq-lefthand']: {whoToShow: 'everyone'},
['sq-righthand']: {whoToShow: 'everyone'},
['sq-cockpit']: {whoToShow: 'everyone'},
['sq-trackpose']: {type: 'head'},
//['sq-trackpose']: {type: 'lefthand'},
//['sq-trackpose']: {type: 'righthand'},
//['sq-trackpose']: {type: 'cockpit'},

['sq-questhome']: {url: 'https://cdn.sidequestvr.com/file/167567/canyon_environment.apk'},
['sq-streetview']: {panoId: 'EusXB0g8G1DOvaPV56X51g'},
['sq-particlesystem']: {duration: 0,startColor: '#FFFFFF',startDelay: 0,startDelayMultiplier: 1,startLifetime: 0,startLifetimeMultiplier: 1,startSize: 1,startSpeed: 1,startRotation: 1,simulationSpace: 'local',particleTexture: './assets/img/particles/particle.png',emitterVelocity: new THREE.Vector3(0,0,0),emitterVelocityMode: '',maxParticles: 10,flipRotation: false,scalingMode: '',loop: true,prewarm: false,},
['sq-destructable']: {randomSeed: 0,fractureType: 'shatter',numFracturePieces: 10,numInterations: 1,numGenerations: 1,evenlySizedPieces: false,forceThreshold: 10,forceRolloffRadius: 1,},
['sq-syncloop']: {interval: 0,eventName: 'startAnimation',remote: null,},
['sq-clickurl']: {url: 'https://sidequestvr.com/'},
['sq-billboard']: null,
['sq-refreshrate']: {rate: 72},
//['sq-hideavatars']: null, (a-scene ONLY)
//['sq-singleuser']: null, (a-scene ONLY)
//['sq-disableteleport']: null, (a-scene ONLY)
//['sq-hidedefaulttextures']: null, (a-scene ONLY)
//['sq-spawnpoint']: {position: new THREE.Vector3(0,0,0)}, (a-scene ONLY)
//['sq-maxoccupancy']: {number: 40}, (a-scene ONLY)
//['sq-clippingplane']: {near: 0.2, far: 2000}, (a-scene ONLY)
//['sq-assetbundle']: {android: '', desktop: ''}, (a-scene ONLY)
['sq-mirror']: null,
['sq-parametric']: {type: 'klein',slices: 10,stacks: 10,inverted: false,},
['sq-gravityfield']: {gravity: new THREE.Vector3(0,-9.8,0)},
['sq-timedilationfield']: {scale: 1},
['sq-speedfield']: null,
['sq-smoothposition']: null,
['sq-smoothrotation']: null,
['sq-collidergltf']: null,
['sq-climbablegltf']: null,
['sq-slipperygltf']: null,

},
};

//triggerItem
this.triggerItemData = {
data:'triggerItemData',
id:'triggerItem',
sources: false,
text: false,
geometry: {primitive: 'sphere', radius: 1},
material: {shader: "flat", color: 'white', opacity: 1},
position: new THREE.Vector3(0,20,-4),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
//['sq-interactable']:null,
//['sq-grabbable']: null,
['sq-collider']:null,
//['sq-rigidbody']:{mass: 0.5,drag: 0,angularDrag: 0.05,isKinematic: false,useGravity: true,toChild: false,centerOfMass: new THREE.Vector3(0,0,0),collisionDetextionMode: 'discrete',velocity: new THREE.Vector3(0,0,0),freePosX: false,freePosY: false,freePosZ: false,freeRotX: false,freeRotY: false,freeRotZ: false,},
['sq-rigidbody']:null,
['sq-triggercollider']:null,
['trigger-test']:null,
},
};

//
//Starting Area

//Environment
//

//Floor Bouncer
//floorBounceLeft
this.floorBounceLeftData = {
data:'floorBounceLeftData',
id:'floorBounceLeft',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(-27.5,0.001,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(45,0.15,120),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['wall-bounce-up-all']:{position: 'left'},
},
};
//floorBounceCenter
this.floorBounceCenterData = {
data:'floorBounceCenterData',
id:'floorBounceCenter',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0.001,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(10,0.15,120),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['wall-bounce-up-all']:{position: 'center'},
},
};
//floorBounceRight
this.floorBounceRightData = {
data:'floorBounceRightData',
id:'floorBounceRight',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(27.5,0.001,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(45,0.15,120),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['wall-bounce-up-all']:{position: 'right'},
},
};

//Ceiling Bouncer
//ceilingRigid
this.ceilingRigidData = {
data:'ceilingRigidData',
id:'ceilingRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'purple', opacity: 1},
position: new THREE.Vector3(0,40,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(99.9,0.9,119.9),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};
//ceilingBounceLeft
this.ceilingBounceLeftData = {
data:'ceilingBounceLeftData',
id:'ceilingBounceLeft',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(-27.5,40,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(45,1,120),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['wall-bounce-down-all']:{position: 'left'},
},
};
//ceilingBounceCenter
this.ceilingBounceCenterData = {
data:'ceilingBounceCenterData',
id:'ceilingBounceCenter',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,40,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(10,1,120),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['wall-bounce-down-all']:{position: 'center'},
},
};
//ceilingBounceRight
this.ceilingBounceRightData = {
data:'ceilingBounceRightData',
id:'ceilingBounceRight',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(27.5,40,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(45,1,120),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['wall-bounce-down-all']:{position: 'right'},
},
};

//Wall Right Bouncer
//wallRight
this.wallRightData = {
data:'wallRightData',
id:'wallRight',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'purple', opacity: 1},
position: new THREE.Vector3(50,20,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,40,120),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['wall-bounce-left-all']:null,
},
};
//wallRightRigid
this.wallRightRigidData = {
data:'wallRightRigidData',
id:'wallRightRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(50,20,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.9,39.9,119.9),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};

//Wall Left Bouncer
//wallLeft
this.wallLeftData = {
data:'wallLeftData',
id:'wallLeft',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'purple', opacity: 1},
position: new THREE.Vector3(-50,20,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,40,120),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['wall-bounce-right-all']:null,
},
};
//wallLeftRigid
this.wallLeftRigidData = {
data:'wallLeftRigidData',
id:'wallLeftRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(-50,20,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.9,39.9,119.9),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};

//Wall End Bouncer
//wallEnd
this.wallEndData = {
data:'wallEndData',
id:'wallEnd',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: '#5c0b5c', opacity: 1},
position: new THREE.Vector3(0,20,-75),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(100,40,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['wall-bounce-back-all']:null,
},
};
//wallEndRigid
this.wallEndRigidData = {
data:'wallEndRigidData',
id:'wallEndRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,20,-75),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(99.9,39.9,0.9),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};

//Wall Start Bouncer
//wallStart
this.wallStartData = {
data:'wallStartData',
id:'wallStart',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: '#5c0b5c', opacity: 1},
position: new THREE.Vector3(0,20,45),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(100,40,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['wall-bounce-forward-all']:null,
},
};
//wallStartRigid
this.wallStartRigidData = {
data:'wallStartRigidData',
id:'wallStartRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,20,45),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(99.9,39.9,0.9),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};

//Tunnel Block Bouncer
//tunnelWallRight
this.tunnelWallRightData = {
data:'tunnelWallRightData',
id:'tunnelWallRight',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'purple', opacity: 1},
position: new THREE.Vector3(5,2.5,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.1,5,40),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['block-bounce-x-all']:null,
},
};
//tunnelWallRightRigid
this.tunnelWallRightRigidData = {
data:'tunnelWallRightRigidData',
id:'tunnelWallRightRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(5,2.5,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.09,4.9,39.9),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};
//tunnelWallLeft
this.tunnelWallLeftData = {
data:'tunnelWallLeftData',
id:'tunnelWallLeft',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'purple', opacity: 1},
position: new THREE.Vector3(-5,2.5,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.1,5,40),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['block-bounce-x-all']:null,
},
};
//tunnelWallLeftRigid
this.tunnelWallLeftRigidData = {
data:'tunnelWallLeftRigidData',
id:'tunnelWallLeftRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(-5,2.5,-15),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.09,4.9,39.9),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};


//Explosive Bouncer
//explode
this.explodeData = {
data:'explodeData',
id:'explode',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'red', opacity: 1},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.5,0.5,0.5),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['explode-ammo']:null,
},
};
//explodeRigid
this.explodeRigidData = {
data:'explodeRigidData',
id:'explodeRigid',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};


//Target Goals
//

//targetEnd
this.targetEndData = {
data:'targetEndData',
id:'targetEnd',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'pink', opacity: 1},
position: new THREE.Vector3(0,2.5,-34.5),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(2,2,0.1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['targethit']:null,
},
};
//targetEndRigid
this.targetEndRigidData = {
data:'targetEndRigidData',
id:'targetEndRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};

//targetStart
this.targetStartData = {
data:'targetStartData',
id:'targetStart',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'pink', opacity: 1},
position: new THREE.Vector3(0,2.5,4.5),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(2,2,0.1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['targethit']:null,
},
};
//targetStartRigid
this.targetStartRigidData = {
data:'targetStartRigidData',
id:'targetStartRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};

//triggerDisplay
this.triggerDisplayData = {
data:'triggerDisplayData',
id:'triggerDisplay',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'black', opacity: 1},
position: new THREE.Vector3(2,0.5,-18),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: false,
};

//Cube Bouncer
//

//cubeBlockRigid
this.cubeBlockRigidData = {
data:'cubeBlockRigidData',
id:'cubeBlockRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'teal', opacity: 1},
position: new THREE.Vector3(4.5,7,45),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};
//cubeBlockTopTrigger
this.cubeBlockTopTriggerData = {
data:'cubeBlockTopTriggerData',
id:'cubeBlockTopTrigger',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0.5,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,0.1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['block-bounce-y-all']:{position: 'top'},
},
};
//cubeBlockBottomTrigger
this.cubeBlockBottomTriggerData = {
data:'cubeBlockBottomTriggerData',
id:'cubeBlockBottomTrigger',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,-0.5,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,0.1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['block-bounce-y-all']:{position: 'bottom'},
},
};
//cubeBlockLeftTrigger
this.cubeBlockLeftTriggerData = {
data:'cubeBlockLeftTriggerData',
id:'cubeBlockLeftTrigger',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(-0.5,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['block-bounce-x-all']:{position: 'left'},
},
};
//cubeBlockRightTrigger
this.cubeBlockRightTriggerData = {
data:'cubeBlockRightTriggerData',
id:'cubeBlockRightTrigger',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0.5,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['block-bounce-x-all']:{position: 'right'},
},
};
//cubeBlockForwardTrigger
this.cubeBlockForwardTriggerData = {
data:'cubeBlockForwardTriggerData',
id:'cubeBlockForwardTrigger',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0.5),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,0.1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['block-bounce-z-all']:{position: 'forward'},
},
};
//cubeBlockBackwardTrigger
this.cubeBlockBackwardTriggerData = {
data:'cubeBlockBackwardTriggerData',
id:'cubeBlockBackwardTrigger',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,-0.5),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,0.1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['block-bounce-z-all']:{position: 'backward'},
},
};


//Float Target
//

//floatTargetRigid
this.floatTargetRigidData = {
data:'floatTargetRigidData',
id:'floatTargetRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,4,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false},
},
};
//floatTarget
this.floatTargetData = {
data:'floatTargetData',
id:'floatTarget',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'teal', opacity: 1},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1.01,1.01,1.01),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
//['block-hits']:{hits: 8, rigidBody: 'float1TargetRigid', isChild: true},
},
};


//Still Targets
//

//block
this.blockData = {
data:'blockData',
id:'block',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'teal', opacity: 1},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
//['block-hits']:{hits: 1, rigidBody: 'block1Rigid'},
},
};
//blockRigid
this.blockRigidData = {
data:'blockRigidData',
id:'blockRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};


//Invisible Flat Bouncer
//

//invisible
this.invisibleData = {
data:'invisibleData',
id:'invisible',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(3.5,1.25,-3),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,0.1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['sq-showhidden']:null,
//['block-bounce-z-all']:null,
},
};
//invisibleRigid
this.invisibleRigidData = {
data:'invisibleRigidData',
id:'invisibleRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};


//Portals
//

//1 Way Ammo Omni Portal
//
//omniAmmo1WayPortalEnter
this.omniAmmo1WayPortalEnterData = {
data:'omniAmmo1WayPortalEnterData',
id:'omniAmmo1WayPortalEnter',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'white', opacity: 0.5},
position: new THREE.Vector3(-3,3,-6),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.75,0.75,0.75),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['omni-ammo-portal-to']:{to: 'omniAmmo1WayPortalExit'},
},
};
//omniAmmo1WayPortalExit
this.omniAmmo1WayPortalExitData = {
data:'omniAmmo1WayPortalExitData',
id:'omniAmmo1WayPortalExit',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'white', opacity: 0.25},
position: new THREE.Vector3(-3,3,-26),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.75,0.75,0.75),
animations: false,
mixins: false,
classes: ['a-ent'],
components: false,
};

//2 Way Ammo Omni Portal
//
//omniAmmo2WayPortal1
this.omniAmmo2WayPortal1Data = {
data:'omniAmmo2WayPortal1Data',
id:'omniAmmo2WayPortal1',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'white', opacity: 0.5},
position: new THREE.Vector3(4,0.5,-6),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.5,0.5,0.5),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['omni-ammo-portal']:{connect: 'omniAmmo2WayPortal2'},
},
};
//omniAmmo2WayPortal2
this.omniAmmo2WayPortal2Data = {
data:'omniAmmo2WayPortal2Data',
id:'omniAmmo2WayPortal2',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'white', opacity: 0.5},
position: new THREE.Vector3(4,2,-26),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.5,0.5,0.5),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['omni-ammo-portal']:{connect: 'omniAmmo2WayPortal1'},
},
};

//2 Way Player Omni Portal
//
//omniPlayer2WayPortal1
this.omniPlayer2WayPortal1Data = {
data:'omniPlayer2WayPortal1Data',
id:'omniPlayer2WayPortal1',
sources: false,
text: false,
geometry: {primitive: 'circle'},
material: {shader: "flat", color: 'white', opacity: 0.5, side: 'double'},
position: new THREE.Vector3(8,1.5,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['player-portal']:{connect: 'omniPlayer2WayPortal2', exitDirection: 'backward'},
},
};
//omniPlayer2WayPortal2
this.omniPlayer2WayPortal2Data = {
data:'omniPlayer2WayPortal2Data',
id:'omniPlayer2WayPortal2',
sources: false,
text: false,
geometry: {primitive: 'circle'},
material: {shader: "flat", color: 'white', opacity: 0.5, side: 'double'},
position: new THREE.Vector3(14,1.5,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['player-portal']:{connect: 'omniPlayer2WayPortal1', exitDirection: 'forward'},
},
};

//Grab Items
//

//Sheild
//sheildPaddle
this.sheildPaddleData = {
data:'sheildPaddleData',
id:'sheildPaddle',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: '#4b74c1', opacity: 1, src: '#pattern76'},
position: new THREE.Vector3(-12,1.25,31),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.5,0.5,0.1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-grabbable']:null,
['sq-rigidbody']:null,
},
};
//sheildPaddleTrigger
this.sheildPaddleTriggerData = {
data:'sheildPaddleTriggerData',
id:'sheildPaddleTrigger',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1.01,1.01,1.01),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-triggercollider']:null,
['destory-enemy-ammo']:null,
},
};
//sheildPaddleHandle
this.sheildPaddleHandleData = {
data:'sheildPaddleHandleData',
id:'sheildPaddleHandle',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: '#355289', opacity: 1, src: '#pattern76'},
position: new THREE.Vector3(0,0,0.85),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.2,0.75,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-grabbable']:null,
},
};

//Sword
//swordPaddle
this.swordPaddleData = {
data:'swordPaddleData',
id:'swordPaddle',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: '#c14b62', opacity: 1, src: '#pattern76'},
position: new THREE.Vector3(-12,1.25,31),
rotation: new THREE.Vector3(0,90,0),
scale: new THREE.Vector3(0.15,0.15,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-grabbable']:null,
['sq-rigidbody']:null,
},
};
//swordPaddleTrigger
this.swordPaddleTriggerData = {
data:'swordPaddleTriggerData',
id:'swordPaddleTrigger',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1.01,1.01,1.01),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-triggercollider']:null,
['destory-enemy-ammo']:null,
},
};

//Item Table
//itemTable
this.itemTableData = {
data:'itemTableData',
id:'itemTable',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: '#15a015', opacity: 1},
position: new THREE.Vector3(-12,1,31),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.75,0.1,1.5),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-rigidbody']:{useGravity: false, isKinematic: true},
},
};

//Particles
//

//particlesMelon
this.particlesMelonData = {
data:'particlesMelonData',
id:'particlesMelon',
sources: false,
text: false,
geometry: false,
material: false,
position: new THREE.Vector3(0,2.5,-31),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-particlesystem']:{
duration: 0,
startColor: 'pink',
startDelay: 0,
startDelayMultiplier: 1,
startLifetime: 0,
startLifetimeMultiplier: 1,
startSize: 0.42,
startSpeed: 1,
startRotation: 1,
simulationSpace: 'local',
emitterVelocity: new THREE.Vector3(0,0,0),
particleTexture: 'https://cdn.glitch.global/a0e5158b-1e9b-4106-802f-3462da3fea26/logo.png?v=1676059673797',
maxParticles: 6,
flipRotation: false,
loop: true,
prewarm: false,
},
},
};


//Mirror

//mirror
this.mirrorData = {
data:'mirrorData',
id:'mirror',
sources: false,
text: false,
geometry: false,
material: false,
position: new THREE.Vector3(5,2,1),
rotation: new THREE.Vector3(0,-90,0),
scale: new THREE.Vector3(4,4,4),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-mirror']:null,
},
};

//Speed Up
//

//speedUpTrigger
this.speedUpTriggerData = {
data:'speedUpTriggerData',
id:'speedUpTrigger',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0.6},
position: new THREE.Vector3(0,1.5,-3),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,0.1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['sq-speedup']:null,
},
};

//Move Object Triggers
//

//moveObjectTrigger
this.moveObjectTriggerData = {
data:'moveObjectTriggerData',
id:'moveObjectTrigger',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0.3},
position: new THREE.Vector3(2,1.5,-3),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,0.1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['hit-move']:{object: 'cubeBlock1Rigid', direction: 'up', move: 1, loop: 10},
},
};


//Power Ups
//

//pickUpHealth
this.pickUpHealthData = {
data:'pickUpHealthData',
id:'pickUpHealth',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'red', opacity: 0.75, src: '#pattern75', repeat: '3 3'},
position: new THREE.Vector3(0,0.5,44),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.5,0.5,0.5),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: -360, dur: 25000, delay: 0, loop: 'true', dir: 'normal', easing: 'linear', elasticity: 400, autoplay: true, enabled: true},
posy: {property: 'object3D.position.y', from: 0.75, to: 1.5, dur: 10000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutSine', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['health-pickup']:null,
},
};

//pickUpBonus
this.pickUpBonusData = {
data:'pickUpBonusData',
id:'pickUpBonus',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'blue', opacity: 0.75, src: '#pattern84', repeat: '3 3'},
position: new THREE.Vector3(0,0.5,46),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.5,0.5,0.5),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: -360, dur: 25000, delay: 0, loop: 'true', dir: 'normal', easing: 'linear', elasticity: 400, autoplay: true, enabled: true},
posy: {property: 'object3D.position.y', from: 0.75, to: 1.5, dur: 10000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutSine', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['bonus-pickup']:null,
},
};

//pickUpPower
this.pickUpPowerData = {
data:'pickUpPowerData',
id:'pickUpPower',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'green', opacity: 0.75, src: '#pattern76', repeat: '3 3'},
position: new THREE.Vector3(0,0.5,48),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.5,0.5,0.5),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: -360, dur: 25000, delay: 0, loop: 'true', dir: 'normal', easing: 'linear', elasticity: 400, autoplay: true, enabled: true},
posy: {property: 'object3D.position.y', from: 0.75, to: 1.5, dur: 10000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutSine', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['power-pickup']:null,
},
};

//Death Cube
//

//deathCubeRigid
this.deathCubeRigidData = {
data:'deathCubeRigidData',
id:'deathCubeRigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 1},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(3,3,3),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-rigidbody']:{useGravity: false},
},
};
//deathCube
this.deathCubeData = {
data:'deathCubeData',
id:'deathCube',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'teal', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1.01,1.01,1.01),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
//['death-hits']:{hits: 8, rigidBody: 'float1TargetRigid', isChild: true},
},
};


//Enemies
//
//enemy-spawn-ammo="ammoType: z; directionFocus: true; forward: true; backward: false; left: false; right: false; up: false; down: false; rightForward: false; rightBackward: false; leftForward: false; leftBackward: false; random: false;"
//pattern61
//pattern62
//pattern63
//pattern64
//pattern65
//pattern66

//enemy1
this.enemy1Data = {
data:'enemy1Data',
id:'enemy1',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern61'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.5,0.5,0.5),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy1All', enemyName: 'enemy1', enemyType: 'y', hits: 8, rigidBody: 'enemy1Rigid'},
['enemy-spawn-ammo']: {ammoType: 'y', rateOfFire: 1000, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy1Rigid
this.enemy1RigidData = {
data:'enemy1RigidData',
id:'enemy1Rigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy1 start/stop fire triggers

//enemy1TriggerStart
this.enemy1TriggerStartData = {
data:'enemy1TriggerStartData',
id:'enemy1TriggerStart',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0.1},
position: new THREE.Vector3(0,0.5,-2),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-trigger-start']:{id: 'enemy1'},
},
};
//enemy1TriggerStop
this.enemy1TriggerStopData = {
data:'enemy1TriggerStopData',
id:'enemy1TriggerStop',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0.1},
position: new THREE.Vector3(-2,0.5,-2),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-trigger-stop']:{id: 'enemy1'},
},
};

//enemy2
this.enemy2Data = {
data:'enemy2Data',
id:'enemy2',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.5,1.5,0.5),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy2All', enemyName: 'enemy2', enemyType: 'z', hits: 8, rigidBody: 'enemy2Rigid'},
['enemy-spawn-ammo']: {ammoType: 'z', rateOfFire: 500, fireDelay: 5000, directionFocus: false, backward: true, right: true},
},
};
//enemy2Rigid
this.enemy2RigidData = {
data:'enemy2RigidData',
id:'enemy2Rigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-boxcollider']:null,
},
};

//enemy3
this.enemy3Data = {
data:'enemy3Data',
id:'enemy3',
sources: false,
text: false,
geometry: {primitive: 'cone'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy3All', enemyName: 'enemy3', enemyType: 'v', hits: 8, rigidBody: 'enemy3Rigid'},
['enemy-spawn-ammo']: {ammoType: 'v', rateOfFire: 1500, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy3Rigid
this.enemy3RigidData = {
data:'enemy3RigidData',
id:'enemy3Rigid',
sources: false,
text: false,
geometry: {primitive: 'cone'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy4
this.enemy4Data = {
data:'enemy4Data',
id:'enemy4',
sources: false,
text: false,
geometry: {primitive: 'cylinder'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.5,1.5,0.5),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy4All', enemyName: 'enemy4', enemyType: 'r', hits: 8, rigidBody: 'enemy4Rigid'},
['enemy-spawn-ammo']: {ammoType: 'r', rateOfFire: 750, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy4Rigid
this.enemy4RigidData = {
data:'enemy4RigidData',
id:'enemy4Rigid',
sources: false,
text: false,
geometry: {primitive: 'cylinder'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy5
this.enemy5Data = {
data:'enemy5Data',
id:'enemy5',
sources: false,
text: false,
geometry: {primitive: 'torus'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy5All', enemyName: 'enemy5', enemyType: 'w', hits: 8, rigidBody: 'enemy5Rigid'},
['enemy-spawn-ammo']: {ammoType: 'w', rateOfFire: 2000, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy5Rigid
this.enemy5RigidData = {
data:'enemy5RigidData',
id:'enemy5Rigid',
sources: false,
text: false,
geometry: {primitive: 'torus'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy6
this.enemy6Data = {
data:'enemy6Data',
id:'enemy6',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,1,1),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy6All', enemyName: 'enemy6', enemyType: 't', hits: 8, rigidBody: 'enemy6Rigid'},
['enemy-spawn-ammo']: {ammoType: 't', rateOfFire: 2500, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy6Rigid
this.enemy6RigidData = {
data:'enemy6RigidData',
id:'enemy6Rigid',
sources: false,
text: false,
geometry: {primitive: 'box'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy7
this.enemy7Data = {
data:'enemy7Data',
id:'enemy7',
sources: false,
text: false,
geometry: {primitive: 'cone'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,180),
scale: new THREE.Vector3(0.5,2,0.5),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy7All', enemyName: 'enemy7', enemyType: 's', hits: 8, rigidBody: 'enemy7Rigid'},
['enemy-spawn-ammo']: {ammoType: 's', rateOfFire: 2000, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy7Rigid
this.enemy7RigidData = {
data:'enemy7RigidData',
id:'enemy7Rigid',
sources: false,
text: false,
geometry: {primitive: 'cone'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy8
this.enemy8Data = {
data:'enemy8Data',
id:'enemy8',
sources: false,
text: false,
geometry: {primitive: 'cylinder'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(1,0.5,1),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy8All', enemyName: 'enemy8', enemyType: 'x', hits: 8, rigidBody: 'enemy8Rigid'},
['enemy-spawn-ammo']: {ammoType: 'x', rateOfFire: 1500, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy8Rigid
this.enemy8RigidData = {
data:'enemy8RigidData',
id:'enemy8Rigid',
sources: false,
text: false,
geometry: {primitive: 'cylinder'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy9
this.enemy9Data = {
data:'enemy9Data',
id:'enemy9',
sources: false,
text: false,
geometry: {primitive: 'torus'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(90,0,0),
scale: new THREE.Vector3(1,1,1),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy9All', enemyName: 'enemy9', enemyType: 'q', hits: 8, rigidBody: 'enemy9Rigid'},
['enemy-spawn-ammo']: {ammoType: 'q', rateOfFire: 1250, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy9Rigid
this.enemy9RigidData = {
data:'enemy9RigidData',
id:'enemy9Rigid',
sources: false,
text: false,
geometry: {primitive: 'torus'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy10
this.enemy10Data = {
data:'enemy10Data',
id:'enemy10',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.4,0.8,0.4),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy10All', enemyName: 'enemy10', enemyType: 'o', hits: 8, rigidBody: 'enemy10Rigid'},
['enemy-spawn-ammo']: {ammoType: 'o', rateOfFire: 1000, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy10Rigid
this.enemy10RigidData = {
data:'enemy10RigidData',
id:'enemy10Rigid',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy11
this.enemy11Data = {
data:'enemy11Data',
id:'enemy11',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.75,0.5,0.75),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy11All', enemyName: 'enemy11', enemyType: 'u', hits: 8, rigidBody: 'enemy11Rigid'},
['enemy-spawn-ammo']: {ammoType: 'u', rateOfFire: 750, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy11Rigid
this.enemy11RigidData = {
data:'enemy11RigidData',
id:'enemy11Rigid',
sources: false,
text: false,
geometry: {primitive: 'sphere'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy12
this.enemy12Data = {
data:'enemy12Data',
id:'enemy12',
sources: false,
text: false,
geometry: {primitive: 'cube'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.75,0.5,0.75),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy12All', enemyName: 'enemy12', enemyType: 'n', hits: 8, rigidBody: 'enemy12Rigid'},
['enemy-spawn-ammo']: {ammoType: 'n', rateOfFire: 1500, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy12Rigid
this.enemy12RigidData = {
data:'enemy12RigidData',
id:'enemy12Rigid',
sources: false,
text: false,
geometry: {primitive: 'cube'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//enemy13
this.enemy13Data = {
data:'enemy13Data',
id:'enemy13',
sources: false,
text: false,
geometry: {primitive: 'cylinder'},
material: {shader: "flat", color: '#504343', opacity: 1, src: '#pattern62'},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(90,0,0),
scale: new THREE.Vector3(1,0.25,1),
animations: {
spiny: {property: 'object3D.rotation.y', from: 0, to: 180, dur: 5000, delay: 0, loop: 'true', dir: 'alternate', easing: 'easeInOutCubic', elasticity: 400, autoplay: true, enabled: true},
},
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
['sq-triggercollider']:null,
['enemy-hits']: {objName: 'enemy13All', enemyName: 'enemy13', enemyType: 'p', hits: 8, rigidBody: 'enemy13Rigid'},
['enemy-spawn-ammo']: {ammoType: 'p', rateOfFire: 1000, fireDelay: 0, startTrigger: false, random: true,},
},
};
//enemy13Rigid
this.enemy13RigidData = {
data:'enemy13RigidData',
id:'enemy13Rigid',
sources: false,
text: false,
geometry: {primitive: 'cylinder'},
material: {shader: "flat", color: 'white', opacity: 0},
position: new THREE.Vector3(0,0,0),
rotation: new THREE.Vector3(0,0,0),
scale: new THREE.Vector3(0.99,0.99,0.99),
animations: false,
mixins: false,
classes: ['a-ent'],
components: {
['sq-collider']:null,
},
};

//
//World Atlas Map & Node Data

//Starting Area
//
//Zone 0
this.zone0Data = {
info:{
id: 'zone0',
name: 'Zone0',
zoneNum: 0,
start: 'zone0Node0',
},
zone0Node0:{
connect0: {inZone: true, node: 'zone0Node1',},
},
zone0Node1:{
connect0: {inZone: true, node: 'zone0Node2',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node2:{
connect0: {inZone: true, node: 'zone0Node3',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node3:{
connect0: {inZone: true, node: 'zone0Node4',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node4:{
connect0: {inZone: true, node: 'zone0Node5',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node5:{
connect0: {inZone: true, node: 'zone0Node6',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node6:{
connect0: {inZone: true, node: 'zone0Node7',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node7:{
connect0: {inZone: true, node: 'zone0Node8',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node8:{
connect0: {inZone: true, node: 'zone0Node9',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node9:{
connect0: {inZone: true, node: 'zone0Node10',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node10:{
connect0: {inZone: true, node: 'zone0Node11',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node11:{
connect0: {inZone: true, node: 'zone0Node12',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node12:{
connect0: {inZone: true, node: 'zone0Node13',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node13:{
connect0: {inZone: true, node: 'zone0Node14',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node14:{
connect0: {inZone: true, node: 'zone0Node15',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node15:{
connect0: {inZone: true, node: 'zone0Node16',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node16:{
connect0: {inZone: true, node: 'zone0Node17',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node17:{
connect0: {inZone: true, node: 'zone0Node18',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node18:{
connect0: {inZone: true, node: 'zone0Node19',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node19:{
connect0: {inZone: true, node: 'zone0Node20',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node20:{
connect0: {inZone: true, node: 'zone0Node21',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node21:{
connect0: {inZone: true, node: 'zone0Node22',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node22:{
connect0: {inZone: true, node: 'zone0Node23',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node23:{
connect0: {inZone: true, node: 'zone0Node24',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node24:{
connect0: {inZone: true, node: 'zone0Node25',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node25:{
connect0: {inZone: true, node: 'zone0Node26',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node26:{
connect0: {inZone: true, node: 'zone0Node27',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node27:{
connect0: {inZone: true, node: 'zone0Node28',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node28:{
connect0: {inZone: true, node: 'zone0Node29',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node29:{
connect0: {inZone: true, node: 'zone0Node30',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node30:{
connect0: {inZone: true, node: 'zone0Node31',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node31:{
connect0: {inZone: true, node: 'zone0Node32',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node32:{
connect0: {inZone: true, node: 'zone0Node33',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node33:{
connect0: {inZone: true, node: 'zone0Node34',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node34:{
connect0: {inZone: true, node: 'zone0Node35',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node35:{
connect0: {inZone: true, node: 'zone0Node36',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node36:{
connect0: {inZone: true, node: 'zone0Node37',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node37:{
connect0: {inZone: true, node: 'zone0Node38',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node38:{
connect0: {inZone: true, node: 'zone0Node39',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node39:{
connect0: {inZone: true, node: 'zone0Node40',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node40:{
connect0: {inZone: true, node: 'zone0Node41',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node41:{
connect0: {inZone: true, node: 'zone0Node42',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node42:{
connect0: {inZone: true, node: 'zone0Node43',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node43:{
connect0: {inZone: true, node: 'zone0Node44',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node44:{
connect0: {inZone: true, node: 'zone0Node45',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node45:{
connect0: {inZone: true, node: 'zone0Node46',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node46:{
connect0: {inZone: true, node: 'zone0Node47',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node47:{
connect0: {inZone: true, node: 'zone0Node48',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node48:{
connect0: {inZone: true, node: 'zone0Node49',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node49:{
connect0: {inZone: true, node: 'zone0Node50',},
connect1: {inZone: true, node: 'zone0Node0',},
},
zone0Node50:{
connect0: {inZone: true, node: 'zone0Node51',},
connect1: {inZone: true, node: 'zone0Node0',},
},




};

//Level 0 - No Spawns
this.zone0Node0Data = {
info:{
id:'zone0Node0',
name: 'level0',
description: 'Level 0',
sceneText: false,
},
zone:{
},
start:{

},
delay:{

},
interval:{

},
event:{

},
interaction:{

},
exit:{

},
map:{
data: this.zone0Data.zone0Node0,
},
};
//Level 1
this.zone0Node1Data = {
info:{
id:'zone0Node1',
name: 'level1',
description: 'Level 1',
sceneText: false,},
zone:{},
start:{
target1:{Spawn:null},
},
delay:{
15000:{
death1:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node1,},
};
//Level 2
this.zone0Node2Data = {
info:{
id:'zone0Node2',
name: 'level2',
description: 'Level 2',
sceneText: false,},
zone:{},
start:{
target1:{Spawn:null},
target2:{Spawn:null},
enemy1All:{Spawn:null},
},
delay:{
16000:{
death1:{Spawn:null},
},
},
interval:{

},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node2,},
};
//Level 3
this.zone0Node3Data = {
info:{
id:'zone0Node3',
name: 'level3',
description: 'Level 3',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
enemy1All:{Spawn:null},
},
delay:{
10000:{
powerBonus:{Spawn:null},
},
17000:{
death1:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node3,},
};
//Level 4
this.zone0Node4Data = {
info:{
id:'zone0Node4',
name: 'level4',
description: 'Level 4',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
},
delay:{
18000:{
death1:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node4,},
};
//Level 5
this.zone0Node5Data = {
info:{
id:'zone0Node5',
name: 'level5',
description: 'Level 5',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
},
delay:{
10000:{
powerHealth:{Spawn:null},
},
19000:{
death1:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node5,},
};
//Level 6
this.zone0Node6Data = {
info:{
id:'zone0Node6',
name: 'level6',
description: 'Level 6',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
},
delay:{
20000:{
death1:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node6,},
};
//Level 7
this.zone0Node7Data = {
info:{
id:'zone0Node7',
name: 'level7',
description: 'Level 7',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
},
delay:{
10000:{
powerDamage:{Spawn:null},
},
21000:{
death1:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node7,},
};
//Level 8
this.zone0Node8Data = {
info:{
id:'zone0Node8',
name: 'level8',
description: 'Level 8',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
},
delay:{
11000:{
powerBonus:{Spawn:null},
},
22000:{
death1:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node8,},
};
//Level 9
this.zone0Node9Data = {
info:{
id:'zone0Node9',
name: 'level9',
description: 'Level 9',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
},
delay:{
23000:{
death1:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node9,},
};
//Level 10
this.zone0Node10Data = {
info:{
id:'zone0Node10',
name: 'level10',
description: 'Level 10',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
},
delay:{
11000:{
powerHealth:{Spawn:null},
},
24000:{
death1:{Spawn:null},
},
48000:{
death2:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node10,},
};
//Level 11
this.zone0Node11Data = {
info:{
id:'zone0Node11',
name: 'level11',
description: 'Level 11',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
},
delay:{
25000:{
death1:{Spawn:null},
},
49000:{
death2:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node11,},
};
//Level 12
this.zone0Node12Data = {
info:{
id:'zone0Node12',
name: 'level12',
description: 'Level 12',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
},
delay:{
11000:{
powerDamage:{Spawn:null},
},
26000:{
death1:{Spawn:null},
},
49000:{
death2:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node12,},
};
//Level 13
this.zone0Node13Data = {
info:{
id:'zone0Node13',
name: 'level13',
description: 'Level 13',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
},
delay:{
13000:{
powerBonus:{Spawn:null},
},
27000:{
death1:{Spawn:null},
},
50000:{
death2:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node13,},
};
//Level 14
this.zone0Node14Data = {
info:{
id:'zone0Node14',
name: 'level14',
description: 'Level 14',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
},
delay:{
28000:{
death1:{Spawn:null},
},
51000:{
death2:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node14,},
};
//Level 15
this.zone0Node15Data = {
info:{
id:'zone0Node15',
name: 'level15',
description: 'Level 15',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
},
delay:{
12000:{
powerHealth:{Spawn:null},
},
29000:{
death1:{Spawn:null},
},
52000:{
death2:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node15,},
};
//Level 16
this.zone0Node16Data = {
info:{
id:'zone0Node16',
name: 'level16',
description: 'Level 16',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
},
delay:{
30000:{
death1:{Spawn:null},
},
53000:{
death2:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node16,},
};
//Level 17
this.zone0Node17Data = {
info:{
id:'zone0Node17',
name: 'level17',
description: 'Level 17',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
},
delay:{
12000:{
powerDamage:{Spawn:null},
},
31000:{
death1:{Spawn:null},
},
54000:{
death2:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node17,},
};
//Level 18
this.zone0Node18Data = {
info:{
id:'zone0Node18',
name: 'level18',
description: 'Level 18',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
},
delay:{
14000:{
powerBonus:{Spawn:null},
},
32000:{
death1:{Spawn:null},
},
55000:{
death2:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node18,},
};
//Level 19
this.zone0Node19Data = {
info:{
id:'zone0Node19',
name: 'level19',
description: 'Level 19',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
},
delay:{
33000:{
death1:{Spawn:null},
},
56000:{
death2:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node19,},
};
//Level 20
this.zone0Node20Data = {
info:{
id:'zone0Node20',
name: 'level20',
description: 'Level 20',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
},
delay:{
13000:{
powerHealth:{Spawn:null},
},
34000:{
death1:{Spawn:null},
},
57000:{
death2:{Spawn:null},
},
81000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node20,},
};
//Level 21
this.zone0Node21Data = {
info:{
id:'zone0Node21',
name: 'level21',
description: 'Level 21',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
},
delay:{
35000:{
death1:{Spawn:null},
},
58000:{
death2:{Spawn:null},
},
82000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node21,},
};
//Level 22
this.zone0Node22Data = {
info:{
id:'zone0Node22',
name: 'level22',
description: 'Level 22',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
},
delay:{
13000:{
powerDamage:{Spawn:null},
},
36000:{
death1:{Spawn:null},
},
59000:{
death2:{Spawn:null},
},
83000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node22,},
};
//Level 23
this.zone0Node23Data = {
info:{
id:'zone0Node23',
name: 'level23',
description: 'Level 23',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
},
delay:{
15000:{
powerBonus:{Spawn:null},
},
37000:{
death1:{Spawn:null},
},
60000:{
death2:{Spawn:null},
},
84000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node23,},
};
//Level 24
this.zone0Node24Data = {
info:{
id:'zone0Node24',
name: 'level24',
description: 'Level 24',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
},
delay:{
38000:{
death1:{Spawn:null},
},
61000:{
death2:{Spawn:null},
},
85000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node24,},
};
//Level 25
this.zone0Node25Data = {
info:{
id:'zone0Node25',
name: 'level25',
description: 'Level 25',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
},
delay:{
14000:{
powerHealth:{Spawn:null},
},
39000:{
death1:{Spawn:null},
},
62000:{
death2:{Spawn:null},
},
86000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node25,},
};
//Level 26
this.zone0Node26Data = {
info:{
id:'zone0Node26',
name: 'level26',
description: 'Level 26',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
},
delay:{
40000:{
death1:{Spawn:null},
},
63000:{
death2:{Spawn:null},
},
87000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node26,},
};
//Level 27
this.zone0Node27Data = {
info:{
id:'zone0Node27',
name: 'level27',
description: 'Level 27',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
},
delay:{
14000:{
powerDamage:{Spawn:null},
},
41000:{
death1:{Spawn:null},
},
64000:{
death2:{Spawn:null},
},
88000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node27,},
};
//Level 28
this.zone0Node28Data = {
info:{
id:'zone0Node28',
name: 'level28',
description: 'Level 28',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
},
delay:{
15000:{
powerBonus:{Spawn:null},
},
42000:{
death1:{Spawn:null},
},
65000:{
death2:{Spawn:null},
},
89000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node28,},
};
//Level 29
this.zone0Node29Data = {
info:{
id:'zone0Node29',
name: 'level29',
description: 'Level 29',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
},
delay:{
43000:{
death1:{Spawn:null},
},
66000:{
death2:{Spawn:null},
},
90000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node29,},
};
//Level 30
this.zone0Node30Data = {
info:{
id:'zone0Node30',
name: 'level30',
description: 'Level 30',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
},
delay:{
15000:{
powerHealth:{Spawn:null},
},
44000:{
death1:{Spawn:null},
},
67000:{
death2:{Spawn:null},
},
91000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node30,},
};
//Level 31
this.zone0Node31Data = {
info:{
id:'zone0Node31',
name: 'level31',
description: 'Level 31',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
},
delay:{
45000:{
death1:{Spawn:null},
},
68000:{
death2:{Spawn:null},
},
92000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node31,},
};
//Level 32
this.zone0Node32Data = {
info:{
id:'zone0Node32',
name: 'level32',
description: 'Level 32',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
},
delay:{
15000:{
powerDamage:{Spawn:null},
},
46000:{
death1:{Spawn:null},
},
69000:{
death2:{Spawn:null},
},
93000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node32,},
};
//Level 33
this.zone0Node33Data = {
info:{
id:'zone0Node33',
name: 'level33',
description: 'Level 33',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
},
delay:{
16000:{
powerBonus:{Spawn:null},
},
47000:{
death1:{Spawn:null},
},
70000:{
death2:{Spawn:null},
},
94000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node33,},
};
//Level 34
this.zone0Node34Data = {
info:{
id:'zone0Node34',
name: 'level34',
description: 'Level 34',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
},
delay:{
48000:{
death1:{Spawn:null},
},
71000:{
death2:{Spawn:null},
},
95000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node34,},
};
//Level 35
this.zone0Node35Data = {
info:{
id:'zone0Node35',
name: 'level35',
description: 'Level 35',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
},
delay:{
16000:{
powerHealth:{Spawn:null},
},
49000:{
death1:{Spawn:null},
},
72000:{
death2:{Spawn:null},
},
96000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node35,},
};
//Level 36
this.zone0Node36Data = {
info:{
id:'zone0Node36',
name: 'level36',
description: 'Level 36',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
},
delay:{
50000:{
death1:{Spawn:null},
},
73000:{
death2:{Spawn:null},
},
97000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node36,},
};
//Level 37
this.zone0Node37Data = {
info:{
id:'zone0Node37',
name: 'level37',
description: 'Level 37',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
},
delay:{
16000:{
powerDamage:{Spawn:null},
},
51000:{
death1:{Spawn:null},
},
74000:{
death2:{Spawn:null},
},
98000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node37,},
};
//Level 38
this.zone0Node38Data = {
info:{
id:'zone0Node38',
name: 'level38',
description: 'Level 38',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
},
delay:{
17000:{
powerBonus:{Spawn:null},
},
52000:{
death1:{Spawn:null},
},
75000:{
death2:{Spawn:null},
},
99000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node38,},
};
//Level 39
this.zone0Node39Data = {
info:{
id:'zone0Node39',
name: 'level39',
description: 'Level 39',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
},
delay:{
53000:{
death1:{Spawn:null},
},
76000:{
death2:{Spawn:null},
},
100000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node39,},
};
//Level 40
this.zone0Node40Data = {
info:{
id:'zone0Node40',
name: 'level40',
description: 'Level 40',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
},
delay:{
17000:{
powerHealth:{Spawn:null},
},
54000:{
death1:{Spawn:null},
},
77000:{
death2:{Spawn:null},
},
101000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node40,},
};
//Level 41
this.zone0Node41Data = {
info:{
id:'zone0Node41',
name: 'level41',
description: 'Level 41',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
target41:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
enemy11All:{Spawn:null},
},
delay:{
55000:{
death1:{Spawn:null},
},
78000:{
death2:{Spawn:null},
},
102000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node41,},
};
//Level 42
this.zone0Node42Data = {
info:{
id:'zone0Node42',
name: 'level42',
description: 'Level 42',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
target41:{Spawn:null},
target42:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
enemy11All:{Spawn:null},
},
delay:{
18000:{
powerDamage:{Spawn:null},
},
56000:{
death1:{Spawn:null},
},
79000:{
death2:{Spawn:null},
},
103000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node42,},
};
//Level 43
this.zone0Node43Data = {
info:{
id:'zone0Node43',
name: 'level43',
description: 'Level 43',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
target41:{Spawn:null},
target42:{Spawn:null},
target43:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
enemy11All:{Spawn:null},
},
delay:{
18000:{
powerBonus:{Spawn:null},
},
57000:{
death1:{Spawn:null},
},
80000:{
death2:{Spawn:null},
},
104000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node43,},
};
//Level 44
this.zone0Node44Data = {
info:{
id:'zone0Node44',
name: 'level44',
description: 'Level 44',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
target41:{Spawn:null},
target42:{Spawn:null},
target43:{Spawn:null},
target44:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
enemy11All:{Spawn:null},
enemy12All:{Spawn:null},
},
delay:{
58000:{
death1:{Spawn:null},
},
81000:{
death2:{Spawn:null},
},
105000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node44,},
};
//Level 45
this.zone0Node45Data = {
info:{
id:'zone0Node45',
name: 'level45',
description: 'Level 45',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
target41:{Spawn:null},
target42:{Spawn:null},
target43:{Spawn:null},
target44:{Spawn:null},
target45:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
enemy11All:{Spawn:null},
enemy12All:{Spawn:null},
},
delay:{
18000:{
powerHealth:{Spawn:null},
},
59000:{
death1:{Spawn:null},
},
82000:{
death2:{Spawn:null},
},
106000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node45,},
};
//Level 46
this.zone0Node46Data = {
info:{
id:'zone0Node46',
name: 'level46',
description: 'Level 46',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
target41:{Spawn:null},
target42:{Spawn:null},
target43:{Spawn:null},
target44:{Spawn:null},
target45:{Spawn:null},
target46:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
enemy11All:{Spawn:null},
enemy12All:{Spawn:null},
},
delay:{
60000:{
death1:{Spawn:null},
},
83000:{
death2:{Spawn:null},
},
107000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node46,},
};
//Level 47
this.zone0Node47Data = {
info:{
id:'zone0Node47',
name: 'level47',
description: 'Level 47',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
target41:{Spawn:null},
target42:{Spawn:null},
target43:{Spawn:null},
target44:{Spawn:null},
target45:{Spawn:null},
target46:{Spawn:null},
target47:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
enemy11All:{Spawn:null},
enemy12All:{Spawn:null},
},
delay:{
19000:{
powerDamage:{Spawn:null},
},
61000:{
death1:{Spawn:null},
},
84000:{
death2:{Spawn:null},
},
108000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node47,},
};
//Level 48
this.zone0Node48Data = {
info:{
id:'zone0Node48',
name: 'level48',
description: 'Level 48',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
target41:{Spawn:null},
target42:{Spawn:null},
target43:{Spawn:null},
target44:{Spawn:null},
target45:{Spawn:null},
target46:{Spawn:null},
target47:{Spawn:null},
target48:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
enemy11All:{Spawn:null},
enemy12All:{Spawn:null},
enemy13All:{Spawn:null},
},
delay:{
10000:{
powerBonus:{Spawn:null},
},
62000:{
death1:{Spawn:null},
},
85000:{
death2:{Spawn:null},
},
109000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node48,},
};
//Level 49
this.zone0Node49Data = {
info:{
id:'zone0Node49',
name: 'level49',
description: 'Level 49',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
target41:{Spawn:null},
target42:{Spawn:null},
target43:{Spawn:null},
target44:{Spawn:null},
target45:{Spawn:null},
target46:{Spawn:null},
target47:{Spawn:null},
target48:{Spawn:null},
target49:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
enemy11All:{Spawn:null},
enemy12All:{Spawn:null},
enemy13All:{Spawn:null},
},
delay:{
63000:{
death1:{Spawn:null},
},
86000:{
death2:{Spawn:null},
},
110000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node49,},
};
//Level 50
this.zone0Node50Data = {
info:{
id:'zone0Node50',
name: 'level50',
description: 'Level 50',
sceneText: false,},
zone:{},
start:{
itemTable:{AddToScene:null},
swordLayer:{AddAllToScene:null},
sheildLayer:{AddAllToScene:null},
target1:{Spawn:null},
target2:{Spawn:null},
target3:{Spawn:null},
target4:{Spawn:null},
target5:{Spawn:null},
target6:{Spawn:null},
target7:{Spawn:null},
target8:{Spawn:null},
target9:{Spawn:null},
target10:{Spawn:null},
target11:{Spawn:null},
target12:{Spawn:null},
target13:{Spawn:null},
target14:{Spawn:null},
target15:{Spawn:null},
target16:{Spawn:null},
target17:{Spawn:null},
target18:{Spawn:null},
target19:{Spawn:null},
target20:{Spawn:null},
target21:{Spawn:null},
target22:{Spawn:null},
target23:{Spawn:null},
target24:{Spawn:null},
target25:{Spawn:null},
target26:{Spawn:null},
target27:{Spawn:null},
target28:{Spawn:null},
target29:{Spawn:null},
target30:{Spawn:null},
target31:{Spawn:null},
target32:{Spawn:null},
target33:{Spawn:null},
target34:{Spawn:null},
target35:{Spawn:null},
target36:{Spawn:null},
target37:{Spawn:null},
target38:{Spawn:null},
target39:{Spawn:null},
target40:{Spawn:null},
target41:{Spawn:null},
target42:{Spawn:null},
target43:{Spawn:null},
target44:{Spawn:null},
target45:{Spawn:null},
target46:{Spawn:null},
target47:{Spawn:null},
target48:{Spawn:null},
target49:{Spawn:null},
target50:{Spawn:null},
enemy1All:{Spawn:null},
enemy2All:{Spawn:null},
enemy3All:{Spawn:null},
enemy4All:{Spawn:null},
enemy5All:{Spawn:null},
enemy6All:{Spawn:null},
enemy7All:{Spawn:null},
enemy8All:{Spawn:null},
enemy9All:{Spawn:null},
enemy10All:{Spawn:null},
enemy11All:{Spawn:null},
enemy12All:{Spawn:null},
enemy13All:{Spawn:null},
},
delay:{
19000:{
powerHealth:{Spawn:null},
powerBonus:{Spawn:null},
powerDamage:{Spawn:null},
},
64000:{
death1:{Spawn:null},
},
87000:{
death2:{Spawn:null},
},
111000:{
death3:{Spawn:null},
},
},
interval:{},
event:{},
interaction:{},
exit:{},
map:{data: this.zone0Data.zone0Node50,},
};

// Core, Layer & Aux Library
/********************************************************************/
//
//Sound Testing
this.soundTesting = Core(this.soundTestingData);

//Trigger Testing
this.triggerItem = Core(this.triggerItemData);

//Starting Area

//Floor Bouncer
this.floorBounceLeft = Core(this.floorBounceLeftData);
this.floorBounceCenter = Core(this.floorBounceCenterData);
this.floorBounceRight = Core(this.floorBounceRightData);

//Ceiling Bouncer
this.ceilingRigid = Core(this.ceilingRigidData);
this.ceilingBounceLeft = Core(this.ceilingBounceLeftData);
this.ceilingBounceCenter = Core(this.ceilingBounceCenterData);
this.ceilingBounceRight = Core(this.ceilingBounceRightData);

//Walls Bouncer
this.wallRight = Core(this.wallRightData);
this.wallRightRigid = Core(this.wallRightRigidData);
this.wallLeft = Core(this.wallLeftData);
this.wallLeftRigid = Core(this.wallLeftRigidData);
this.wallEnd = Core(this.wallEndData);
this.wallEndRigid = Core(this.wallEndRigidData);
this.wallStart = Core(this.wallStartData);
this.wallStartRigid = Core(this.wallStartRigidData);

//Tunnel Bouncer
this.tunnelWallRight = Core(this.tunnelWallRightData);
this.tunnelWallRightRigid = Core(this.tunnelWallRightRigidData);
this.tunnelWallLeft = Core(this.tunnelWallLeftData);
this.tunnelWallLeftRigid = Core(this.tunnelWallLeftRigidData);

//Explosive Bouncer
this.explodeData.id = 'explode1';
this.explodeData.position = new THREE.Vector3(4,0.5,6);
this.explode1 = Core(this.explodeData);
this.explodeRigidData.id = 'explodeRigid1';
this.explodeRigid1 = Core(this.explodeRigidData);
this.explode1LayerData = {
	parent: {core: this.explode1},
	child0: {core: this.explodeRigid1},
}
this.explode1Layer = Layer('explode1Layer', this.explode1LayerData);


//Target Goals
//End
this.targetEnd = Core(this.targetEndData);
this.targetEndRigid = Core(this.targetEndRigidData);
this.targetEndLayerData = {
	parent: {core: this.targetEnd},
	child0: {core: this.targetEndRigid},
}
this.targetEndLayer = Layer('targetEndLayer', this.targetEndLayerData);
//Start
this.targetStart = Core(this.targetStartData);
this.targetStartRigid = Core(this.targetStartRigidData);
this.targetStartLayerData = {
	parent: {core: this.targetStart},
	child0: {core: this.targetStartRigid},
}
this.targetStartLayer = Layer('targetStartLayer', this.targetStartLayerData);
//Display
this.triggerDisplay = Core(this.triggerDisplayData);


//Cube Bouncer
this.cubeBlockRigidData.id = 'cubeBlock1Rigid';
this.cubeBlock1Rigid = Core(this.cubeBlockRigidData);
this.cubeBlockTopTriggerData.id = 'cubeBlock1TopTrigger';
this.cubeBlock1TopTrigger = Core(this.cubeBlockTopTriggerData);
this.cubeBlockBottomTriggerData.id = 'cubeBlock1BottomTrigger';
this.cubeBlock1BottomTrigger = Core(this.cubeBlockBottomTriggerData);
this.cubeBlockLeftTriggerData.id = 'cubeBlock1LeftTrigger';
this.cubeBlock1LeftTrigger = Core(this.cubeBlockLeftTriggerData);
this.cubeBlockRightTriggerData.id = 'cubeBlock1RightTrigger';
this.cubeBlock1RightTrigger = Core(this.cubeBlockRightTriggerData);
this.cubeBlockForwardTriggerData.id = 'cubeBlock1ForwardTrigger';
this.cubeBlock1ForwardTrigger = Core(this.cubeBlockForwardTriggerData);
this.cubeBlockBackwardTriggerData.id = 'cubeBlock1BackwardTrigger';
this.cubeBlock1BackwardTrigger = Core(this.cubeBlockBackwardTriggerData);
this.cubeBlock1LayerData = {
	parent: {core: this.cubeBlock1Rigid},
	child0: {core: this.cubeBlock1TopTrigger},
	child1: {core: this.cubeBlock1BottomTrigger},
	child2: {core: this.cubeBlock1LeftTrigger},
	child3: {core: this.cubeBlock1RightTrigger},
	child4: {core: this.cubeBlock1ForwardTrigger},
	child5: {core: this.cubeBlock1BackwardTrigger},
}
this.cubeBlock1Layer = Layer('cubeBlock1Layer', this.cubeBlock1LayerData);

//Move Object - Assigned to CubeBlock1Rigid
this.moveObjectTrigger = Core(this.moveObjectTriggerData);

//Power Ups
this.pickUpHealthCore = Core(this.pickUpHealthData);
this.powerHealth = Power('powerHealth', 1, this.pickUpHealthCore);

this.pickUpBonusCore = Core(this.pickUpBonusData);
this.powerBonus = Power('powerBonus', 2, this.pickUpBonusCore);

this.pickUpPowerCore = Core(this.pickUpPowerData);
this.powerDamage = Power('powerDamage', 3, this.pickUpPowerCore);


//Float Targets

//Float 1
this.floatTargetRigidData.id = 'float1TargetRigid';
this.float1TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float1Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float1TargetRigid', isChild: true};
this.float1Target = Core(this.floatTargetData);
this.float1TargetLayerData = {
	parent: {core: this.float1TargetRigid},
	child0: {core: this.float1Target},
}
this.float1TargetLayer = Layer('float1TargetLayer', this.float1TargetLayerData);
this.target1 = Target('target1', 1, this.float1TargetLayer);


//Float 2
this.floatTargetRigidData.id = 'float2TargetRigid';
this.float2TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float2Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float2TargetRigid', isChild: true};
this.float2Target = Core(this.floatTargetData);
this.float2TargetLayerData = {
	parent: {core: this.float2TargetRigid},
	child0: {core: this.float2Target},
}
this.float2TargetLayer = Layer('float2TargetLayer', this.float2TargetLayerData);
this.target2 = Target('target2', 2, this.float2TargetLayer);

//Float 3
this.floatTargetRigidData.id = 'float3TargetRigid';
this.float3TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float3Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float3TargetRigid', isChild: true};
this.float3Target = Core(this.floatTargetData);
this.float3TargetLayerData = {
	parent: {core: this.float3TargetRigid},
	child0: {core: this.float3Target},
}
this.float3TargetLayer = Layer('float3TargetLayer', this.float3TargetLayerData);
this.target3 = Target('target3', 3, this.float3TargetLayer);

//Float 4
this.floatTargetRigidData.id = 'float4TargetRigid';
this.float4TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float4Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float4TargetRigid', isChild: true};
this.float4Target = Core(this.floatTargetData);
this.float4TargetLayerData = {
	parent: {core: this.float4TargetRigid},
	child0: {core: this.float4Target},
}
this.float4TargetLayer = Layer('float4TargetLayer', this.float4TargetLayerData);
this.target4 = Target('target4', 4, this.float4TargetLayer);

//Float 5
this.floatTargetRigidData.id = 'float5TargetRigid';
this.float5TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float5Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float5TargetRigid', isChild: true};
this.float5Target = Core(this.floatTargetData);
this.float5TargetLayerData = {
	parent: {core: this.float5TargetRigid},
	child0: {core: this.float5Target},
}
this.float5TargetLayer = Layer('float5TargetLayer', this.float5TargetLayerData);
this.target5 = Target('target5', 5, this.float5TargetLayer);

//Float 6
this.floatTargetRigidData.id = 'float6TargetRigid';
this.float6TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float6Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float6TargetRigid', isChild: true};
this.float6Target = Core(this.floatTargetData);
this.float6TargetLayerData = {
	parent: {core: this.float6TargetRigid},
	child0: {core: this.float6Target},
}
this.float6TargetLayer = Layer('float6TargetLayer', this.float6TargetLayerData);
this.target6 = Target('target6', 6, this.float6TargetLayer);

//Float 7
this.floatTargetRigidData.id = 'float7TargetRigid';
this.float7TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float7Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float7TargetRigid', isChild: true};
this.float7Target = Core(this.floatTargetData);
this.float7TargetLayerData = {
	parent: {core: this.float7TargetRigid},
	child0: {core: this.float7Target},
}
this.float7TargetLayer = Layer('float7TargetLayer', this.float7TargetLayerData);
this.target7 = Target('target7', 7, this.float7TargetLayer);

//Float 8
this.floatTargetRigidData.id = 'float8TargetRigid';
this.float8TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float8Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float8TargetRigid', isChild: true};
this.float8Target = Core(this.floatTargetData);
this.float8TargetLayerData = {
	parent: {core: this.float8TargetRigid},
	child0: {core: this.float8Target},
}
this.float8TargetLayer = Layer('float8TargetLayer', this.float8TargetLayerData);
this.target8 = Target('target8', 8, this.float8TargetLayer);

//Float 9
this.floatTargetRigidData.id = 'float9TargetRigid';
this.float9TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float9Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float9TargetRigid', isChild: true};
this.float9Target = Core(this.floatTargetData);
this.float9TargetLayerData = {
	parent: {core: this.float9TargetRigid},
	child0: {core: this.float9Target},
}
this.float9TargetLayer = Layer('float9TargetLayer', this.float9TargetLayerData);
this.target9 = Target('target9', 9, this.float9TargetLayer);

//Float 10
this.floatTargetRigidData.id = 'float10TargetRigid';
this.float10TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float10Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float10TargetRigid', isChild: true};
this.float10Target = Core(this.floatTargetData);
this.float10TargetLayerData = {
	parent: {core: this.float10TargetRigid},
	child0: {core: this.float10Target},
}
this.float10TargetLayer = Layer('float10TargetLayer', this.float10TargetLayerData);
this.target10 = Target('target10', 10, this.float10TargetLayer);

//Float 11
this.floatTargetRigidData.id = 'float11TargetRigid';
this.float11TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float11Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float11TargetRigid', isChild: true};
this.float11Target = Core(this.floatTargetData);
this.float11TargetLayerData = {
	parent: {core: this.float11TargetRigid},
	child0: {core: this.float11Target},
}
this.float11TargetLayer = Layer('float11TargetLayer', this.float11TargetLayerData);
this.target11 = Target('target11', 11, this.float11TargetLayer);

//Float 12
this.floatTargetRigidData.id = 'float12TargetRigid';
this.float12TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float12Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float12TargetRigid', isChild: true};
this.float12Target = Core(this.floatTargetData);
this.float12TargetLayerData = {
	parent: {core: this.float12TargetRigid},
	child0: {core: this.float12Target},
}
this.float12TargetLayer = Layer('float12TargetLayer', this.float12TargetLayerData);
this.target12 = Target('target12', 12, this.float12TargetLayer);

//Float 13
this.floatTargetRigidData.id = 'float13TargetRigid';
this.float13TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float13Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float13TargetRigid', isChild: true};
this.float13Target = Core(this.floatTargetData);
this.float13TargetLayerData = {
	parent: {core: this.float13TargetRigid},
	child0: {core: this.float13Target},
}
this.float13TargetLayer = Layer('float13TargetLayer', this.float13TargetLayerData);
this.target13 = Target('target13', 13, this.float13TargetLayer);

//Float 14
this.floatTargetRigidData.id = 'float14TargetRigid';
this.float14TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float14Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float14TargetRigid', isChild: true};
this.float14Target = Core(this.floatTargetData);
this.float14TargetLayerData = {
	parent: {core: this.float14TargetRigid},
	child0: {core: this.float14Target},
}
this.float14TargetLayer = Layer('float14TargetLayer', this.float14TargetLayerData);
this.target14 = Target('target14', 14, this.float14TargetLayer);

//Float 15
this.floatTargetRigidData.id = 'float15TargetRigid';
this.float15TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float15Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float15TargetRigid', isChild: true};
this.float15Target = Core(this.floatTargetData);
this.float15TargetLayerData = {
	parent: {core: this.float15TargetRigid},
	child0: {core: this.float15Target},
}
this.float15TargetLayer = Layer('float15TargetLayer', this.float15TargetLayerData);
this.target15 = Target('target15', 15, this.float15TargetLayer);

//Float 16
this.floatTargetRigidData.id = 'float16TargetRigid';
this.float16TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float16Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float16TargetRigid', isChild: true};
this.float16Target = Core(this.floatTargetData);
this.float16TargetLayerData = {
	parent: {core: this.float16TargetRigid},
	child0: {core: this.float16Target},
}
this.float16TargetLayer = Layer('float16TargetLayer', this.float16TargetLayerData);
this.target16 = Target('target16', 16, this.float16TargetLayer);

//Float 17
this.floatTargetRigidData.id = 'float17TargetRigid';
this.float17TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float17Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float17TargetRigid', isChild: true};
this.float17Target = Core(this.floatTargetData);
this.float17TargetLayerData = {
	parent: {core: this.float17TargetRigid},
	child0: {core: this.float17Target},
}
this.float17TargetLayer = Layer('float17TargetLayer', this.float17TargetLayerData);
this.target17 = Target('target17', 17, this.float17TargetLayer);

//Float 18
this.floatTargetRigidData.id = 'float18TargetRigid';
this.float18TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float18Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float18TargetRigid', isChild: true};
this.float18Target = Core(this.floatTargetData);
this.float18TargetLayerData = {
	parent: {core: this.float18TargetRigid},
	child0: {core: this.float18Target},
}
this.float18TargetLayer = Layer('float18TargetLayer', this.float18TargetLayerData);
this.target18 = Target('target18', 18, this.float18TargetLayer);

//Float 19
this.floatTargetRigidData.id = 'float19TargetRigid';
this.float19TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float19Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float19TargetRigid', isChild: true};
this.float19Target = Core(this.floatTargetData);
this.float19TargetLayerData = {
	parent: {core: this.float19TargetRigid},
	child0: {core: this.float19Target},
}
this.float19TargetLayer = Layer('float19TargetLayer', this.float19TargetLayerData);
this.target19 = Target('target19', 19, this.float19TargetLayer);

//Float 20
this.floatTargetRigidData.id = 'float20TargetRigid';
this.float20TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float20Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float20TargetRigid', isChild: true};
this.float20Target = Core(this.floatTargetData);
this.float20TargetLayerData = {
	parent: {core: this.float20TargetRigid},
	child0: {core: this.float20Target},
}
this.float20TargetLayer = Layer('float20TargetLayer', this.float20TargetLayerData);
this.target20 = Target('target20', 20, this.float20TargetLayer);

//Float 21
this.floatTargetRigidData.id = 'float21TargetRigid';
this.float21TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float21Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float21TargetRigid', isChild: true};
this.float21Target = Core(this.floatTargetData);
this.float21TargetLayerData = {
	parent: {core: this.float21TargetRigid},
	child0: {core: this.float21Target},
}
this.float21TargetLayer = Layer('float21TargetLayer', this.float21TargetLayerData);
this.target21 = Target('target21', 21, this.float21TargetLayer);

//Float 22
this.floatTargetRigidData.id = 'float22TargetRigid';
this.float22TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float22Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float22TargetRigid', isChild: true};
this.float22Target = Core(this.floatTargetData);
this.float22TargetLayerData = {
	parent: {core: this.float22TargetRigid},
	child0: {core: this.float22Target},
}
this.float22TargetLayer = Layer('float22TargetLayer', this.float22TargetLayerData);
this.target22 = Target('target22', 22, this.float22TargetLayer);

//Float 23
this.floatTargetRigidData.id = 'float23TargetRigid';
this.float23TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float23Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float23TargetRigid', isChild: true};
this.float23Target = Core(this.floatTargetData);
this.float23TargetLayerData = {
	parent: {core: this.float23TargetRigid},
	child0: {core: this.float23Target},
}
this.float23TargetLayer = Layer('float23TargetLayer', this.float23TargetLayerData);
this.target23 = Target('target23', 23, this.float23TargetLayer);

//Float 24
this.floatTargetRigidData.id = 'float24TargetRigid';
this.float24TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float24Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float24TargetRigid', isChild: true};
this.float24Target = Core(this.floatTargetData);
this.float24TargetLayerData = {
	parent: {core: this.float24TargetRigid},
	child0: {core: this.float24Target},
}
this.float24TargetLayer = Layer('float24TargetLayer', this.float24TargetLayerData);
this.target24 = Target('target24', 24, this.float24TargetLayer);

//Float 25
this.floatTargetRigidData.id = 'float25TargetRigid';
this.float25TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float25Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float25TargetRigid', isChild: true};
this.float25Target = Core(this.floatTargetData);
this.float25TargetLayerData = {
	parent: {core: this.float25TargetRigid},
	child0: {core: this.float25Target},
}
this.float25TargetLayer = Layer('float25TargetLayer', this.float25TargetLayerData);
this.target25 = Target('target25', 25, this.float25TargetLayer);

//Float 26
this.floatTargetRigidData.id = 'float26TargetRigid';
this.float26TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float26Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float26TargetRigid', isChild: true};
this.float26Target = Core(this.floatTargetData);
this.float26TargetLayerData = {
	parent: {core: this.float26TargetRigid},
	child0: {core: this.float26Target},
}
this.float26TargetLayer = Layer('float26TargetLayer', this.float26TargetLayerData);
this.target26 = Target('target26', 26, this.float26TargetLayer);

//Float 27
this.floatTargetRigidData.id = 'float27TargetRigid';
this.float27TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float27Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float27TargetRigid', isChild: true};
this.float27Target = Core(this.floatTargetData);
this.float27TargetLayerData = {
	parent: {core: this.float27TargetRigid},
	child0: {core: this.float27Target},
}
this.float27TargetLayer = Layer('float27TargetLayer', this.float27TargetLayerData);
this.target27 = Target('target27', 27, this.float27TargetLayer);

//Float 28
this.floatTargetRigidData.id = 'float28TargetRigid';
this.float28TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float28Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float28TargetRigid', isChild: true};
this.float28Target = Core(this.floatTargetData);
this.float28TargetLayerData = {
	parent: {core: this.float28TargetRigid},
	child0: {core: this.float28Target},
}
this.float28TargetLayer = Layer('float28TargetLayer', this.float28TargetLayerData);
this.target28 = Target('target28', 28, this.float28TargetLayer);

//Float 29
this.floatTargetRigidData.id = 'float29TargetRigid';
this.float29TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float29Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float29TargetRigid', isChild: true};
this.float29Target = Core(this.floatTargetData);
this.float29TargetLayerData = {
	parent: {core: this.float29TargetRigid},
	child0: {core: this.float29Target},
}
this.float29TargetLayer = Layer('float29TargetLayer', this.float29TargetLayerData);
this.target29 = Target('target29', 29, this.float29TargetLayer);

//Float 30
this.floatTargetRigidData.id = 'float30TargetRigid';
this.float30TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float30Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float30TargetRigid', isChild: true};
this.float30Target = Core(this.floatTargetData);
this.float30TargetLayerData = {
	parent: {core: this.float30TargetRigid},
	child0: {core: this.float30Target},
}
this.float30TargetLayer = Layer('float30TargetLayer', this.float30TargetLayerData);
this.target30 = Target('target30', 30, this.float30TargetLayer);

//Float 31
this.floatTargetRigidData.id = 'float31TargetRigid';
this.float31TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float31Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float31TargetRigid', isChild: true};
this.float31Target = Core(this.floatTargetData);
this.float31TargetLayerData = {
	parent: {core: this.float31TargetRigid},
	child0: {core: this.float31Target},
}
this.float31TargetLayer = Layer('float31TargetLayer', this.float31TargetLayerData);
this.target31 = Target('target31', 31, this.float31TargetLayer);

//Float 32
this.floatTargetRigidData.id = 'float32TargetRigid';
this.float32TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float32Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float32TargetRigid', isChild: true};
this.float32Target = Core(this.floatTargetData);
this.float32TargetLayerData = {
	parent: {core: this.float32TargetRigid},
	child0: {core: this.float32Target},
}
this.float32TargetLayer = Layer('float32TargetLayer', this.float32TargetLayerData);
this.target32 = Target('target32', 32, this.float32TargetLayer);

//Float 33
this.floatTargetRigidData.id = 'float33TargetRigid';
this.float33TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float33Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float33TargetRigid', isChild: true};
this.float33Target = Core(this.floatTargetData);
this.float33TargetLayerData = {
	parent: {core: this.float33TargetRigid},
	child0: {core: this.float33Target},
}
this.float33TargetLayer = Layer('float33TargetLayer', this.float33TargetLayerData);
this.target33 = Target('target33', 33, this.float33TargetLayer);

//Float 34
this.floatTargetRigidData.id = 'float34TargetRigid';
this.float34TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float34Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float34TargetRigid', isChild: true};
this.float34Target = Core(this.floatTargetData);
this.float34TargetLayerData = {
	parent: {core: this.float34TargetRigid},
	child0: {core: this.float34Target},
}
this.float34TargetLayer = Layer('float34TargetLayer', this.float34TargetLayerData);
this.target34 = Target('target34', 34, this.float34TargetLayer);

//Float 35
this.floatTargetRigidData.id = 'float35TargetRigid';
this.float35TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float35Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float35TargetRigid', isChild: true};
this.float35Target = Core(this.floatTargetData);
this.float35TargetLayerData = {
	parent: {core: this.float35TargetRigid},
	child0: {core: this.float35Target},
}
this.float35TargetLayer = Layer('float35TargetLayer', this.float35TargetLayerData);
this.target35 = Target('target35', 35, this.float35TargetLayer);

//Float 36
this.floatTargetRigidData.id = 'float36TargetRigid';
this.float36TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float36Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float36TargetRigid', isChild: true};
this.float36Target = Core(this.floatTargetData);
this.float36TargetLayerData = {
	parent: {core: this.float36TargetRigid},
	child0: {core: this.float36Target},
}
this.float36TargetLayer = Layer('float36TargetLayer', this.float36TargetLayerData);
this.target36 = Target('target36', 36, this.float36TargetLayer);

//Float 37
this.floatTargetRigidData.id = 'float37TargetRigid';
this.float37TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float37Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float37TargetRigid', isChild: true};
this.float37Target = Core(this.floatTargetData);
this.float37TargetLayerData = {
	parent: {core: this.float37TargetRigid},
	child0: {core: this.float37Target},
}
this.float37TargetLayer = Layer('float37TargetLayer', this.float37TargetLayerData);
this.target37 = Target('target37', 37, this.float37TargetLayer);

//Float 38
this.floatTargetRigidData.id = 'float38TargetRigid';
this.float38TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float38Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float38TargetRigid', isChild: true};
this.float38Target = Core(this.floatTargetData);
this.float38TargetLayerData = {
	parent: {core: this.float38TargetRigid},
	child0: {core: this.float38Target},
}
this.float38TargetLayer = Layer('float38TargetLayer', this.float38TargetLayerData);
this.target38 = Target('target38', 38, this.float38TargetLayer);

//Float 39
this.floatTargetRigidData.id = 'float39TargetRigid';
this.float39TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float39Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float39TargetRigid', isChild: true};
this.float39Target = Core(this.floatTargetData);
this.float39TargetLayerData = {
	parent: {core: this.float39TargetRigid},
	child0: {core: this.float39Target},
}
this.float39TargetLayer = Layer('float39TargetLayer', this.float39TargetLayerData);
this.target39 = Target('target39', 39, this.float39TargetLayer);

//Float 40
this.floatTargetRigidData.id = 'float40TargetRigid';
this.float40TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float40Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float40TargetRigid', isChild: true};
this.float40Target = Core(this.floatTargetData);
this.float40TargetLayerData = {
	parent: {core: this.float40TargetRigid},
	child0: {core: this.float40Target},
}
this.float40TargetLayer = Layer('float40TargetLayer', this.float40TargetLayerData);
this.target40 = Target('target40', 40, this.float40TargetLayer);

//Float 41
this.floatTargetRigidData.id = 'float41TargetRigid';
this.float41TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float41Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float41TargetRigid', isChild: true};
this.float41Target = Core(this.floatTargetData);
this.float41TargetLayerData = {
	parent: {core: this.float41TargetRigid},
	child0: {core: this.float41Target},
}
this.float41TargetLayer = Layer('float41TargetLayer', this.float41TargetLayerData);
this.target41 = Target('target41', 41, this.float41TargetLayer);

//Float 42
this.floatTargetRigidData.id = 'float42TargetRigid';
this.float42TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float42Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float42TargetRigid', isChild: true};
this.float42Target = Core(this.floatTargetData);
this.float42TargetLayerData = {
	parent: {core: this.float42TargetRigid},
	child0: {core: this.float42Target},
}
this.float42TargetLayer = Layer('float42TargetLayer', this.float42TargetLayerData);
this.target42 = Target('target42', 42, this.float42TargetLayer);

//Float 43
this.floatTargetRigidData.id = 'float43TargetRigid';
this.float43TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float43Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float43TargetRigid', isChild: true};
this.float43Target = Core(this.floatTargetData);
this.float43TargetLayerData = {
	parent: {core: this.float43TargetRigid},
	child0: {core: this.float43Target},
}
this.float43TargetLayer = Layer('float43TargetLayer', this.float43TargetLayerData);
this.target43 = Target('target43', 43, this.float43TargetLayer);

//Float 44
this.floatTargetRigidData.id = 'float44TargetRigid';
this.float44TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float44Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float44TargetRigid', isChild: true};
this.float44Target = Core(this.floatTargetData);
this.float44TargetLayerData = {
	parent: {core: this.float44TargetRigid},
	child0: {core: this.float44Target},
}
this.float44TargetLayer = Layer('float44TargetLayer', this.float44TargetLayerData);
this.target44 = Target('target44', 44, this.float44TargetLayer);

//Float 45
this.floatTargetRigidData.id = 'float45TargetRigid';
this.float45TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float45Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float45TargetRigid', isChild: true};
this.float45Target = Core(this.floatTargetData);
this.float45TargetLayerData = {
	parent: {core: this.float45TargetRigid},
	child0: {core: this.float45Target},
}
this.float45TargetLayer = Layer('float45TargetLayer', this.float45TargetLayerData);
this.target45 = Target('target45', 45, this.float45TargetLayer);

//Float 46
this.floatTargetRigidData.id = 'float46TargetRigid';
this.float46TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float46Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float46TargetRigid', isChild: true};
this.float46Target = Core(this.floatTargetData);
this.float46TargetLayerData = {
	parent: {core: this.float46TargetRigid},
	child0: {core: this.float46Target},
}
this.float46TargetLayer = Layer('float46TargetLayer', this.float46TargetLayerData);
this.target46 = Target('target46', 46, this.float46TargetLayer);

//Float 47
this.floatTargetRigidData.id = 'float47TargetRigid';
this.float47TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float47Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float47TargetRigid', isChild: true};
this.float47Target = Core(this.floatTargetData);
this.float47TargetLayerData = {
	parent: {core: this.float47TargetRigid},
	child0: {core: this.float47Target},
}
this.float47TargetLayer = Layer('float47TargetLayer', this.float47TargetLayerData);
this.target47 = Target('target47', 47, this.float47TargetLayer);

//Float 48
this.floatTargetRigidData.id = 'float48TargetRigid';
this.float48TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float48Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float48TargetRigid', isChild: true};
this.float48Target = Core(this.floatTargetData);
this.float48TargetLayerData = {
	parent: {core: this.float48TargetRigid},
	child0: {core: this.float48Target},
}
this.float48TargetLayer = Layer('float48TargetLayer', this.float48TargetLayerData);
this.target48 = Target('target48', 48, this.float48TargetLayer);

//Float 49
this.floatTargetRigidData.id = 'float49TargetRigid';
this.float49TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float49Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float49TargetRigid', isChild: true};
this.float49Target = Core(this.floatTargetData);
this.float49TargetLayerData = {
	parent: {core: this.float49TargetRigid},
	child0: {core: this.float49Target},
}
this.float49TargetLayer = Layer('float49TargetLayer', this.float49TargetLayerData);
this.target49 = Target('target49', 49, this.float49TargetLayer);

//Float 50
this.floatTargetRigidData.id = 'float50TargetRigid';
this.float50TargetRigid = Core(this.floatTargetRigidData);
this.floatTargetData.id = 'float50Target';
this.floatTargetData.components['block-hits'] = {hits: 2, rigidBody: 'float50TargetRigid', isChild: true};
this.float50Target = Core(this.floatTargetData);
this.float50TargetLayerData = {
	parent: {core: this.float50TargetRigid},
	child0: {core: this.float50Target},
}
this.float50TargetLayer = Layer('float50TargetLayer', this.float50TargetLayerData);
this.target50 = Target('target50', 50, this.float50TargetLayer);


//Still Targets

//Still 1
this.blockData.id = 'still1';
this.blockData.position = new THREE.Vector3(0,1.25,-34);
this.blockData.components['block-hits'] = {hits: 2, rigidBody: 'still1Rigid'};
this.still1 = Core(this.blockData);
this.blockRigidData.id = 'still1Rigid';
this.still1Rigid = Core(this.blockRigidData);
this.still1LayerData = {
	parent: {core: this.still1},
	child0: {core: this.still1Rigid},
}
this.still1Layer = Layer('still1Layer', this.still1LayerData);

//Invisible Bouncers

//Invisible 1
this.invisibleData.id = 'invisible1';
this.invisibleData.position = new THREE.Vector3(3.5,1.25,-3);
this.invisibleData.scale = new THREE.Vector3(1,1,0.1);
this.invisibleData.components['block-bounce-z-all'] = null;
this.invisible1 = Core(this.invisibleData);
this.invisibleRigidData.id = 'invisible1';
this.invisible1Rigid = Core(this.invisibleRigidData);
this.invisible1LayerData = {
	parent: {core: this.invisible1},
	child0: {core: this.invisible1Rigid},
}
this.invisible1Layer = Layer('invisible1Layer', this.invisible1LayerData);


//Ammo Portals

//1 Way
this.omniAmmo1WayPortalEnter = Core(this.omniAmmo1WayPortalEnterData);
this.omniAmmo1WayPortalExit = Core(this.omniAmmo1WayPortalExitData);

//2 Way
this.omniAmmo2WayPortal1 = Core(this.omniAmmo2WayPortal1Data);
this.omniAmmo2WayPortal2 = Core(this.omniAmmo2WayPortal2Data);

//Player Portal
this.omniPlayer2WayPortal1 = Core(this.omniPlayer2WayPortal1Data);
this.omniPlayer2WayPortal2 = Core(this.omniPlayer2WayPortal2Data);

//Grab Items

//Sword
this.swordPaddle = Core(this.swordPaddleData);
this.swordPaddleTrigger = Core(this.swordPaddleTriggerData);
this.swordLayerData = {
	parent: {core: this.swordPaddle},
	child0: {core: this.swordPaddleTrigger},
}
this.swordLayer = Layer('swordLayer', this.swordLayerData);

//Shield
this.sheildPaddle = Core(this.sheildPaddleData);
this.sheildPaddleTrigger = Core(this.sheildPaddleTriggerData);
this.sheildPaddleHandle = Core(this.sheildPaddleHandleData);
this.sheildLayerData = {
	parent: {core: this.sheildPaddle},
	child0: {core: this.sheildPaddleTrigger},
	child1: {core: this.sheildPaddleHandle},
}
this.sheildLayer = Layer('sheildLayer', this.sheildLayerData);

//Item Table
this.itemTable = Core(this.itemTableData);

//Particles
this.particlesMelon = Core(this.particlesMelonData);

//Mirror
this.mirror = Core(this.mirrorData);

//Speed Up
this.speedUpTrigger = Core(this.speedUpTriggerData);


//Deaths

//Death 1
this.deathCubeRigidData.id = 'deathCube1Rigid';
this.deathCube1Rigid = Core(this.deathCubeRigidData);
this.deathCubeData.id = 'deathCube1';
this.deathCubeData.components['death-hits'] = {objName: 'death1', hits: 8, rigidBody: 'deathCube1Rigid', isChild: true};
this.deathCube1 = Core(this.deathCubeData);
this.deathCube1LayerData = {
	parent: {core: this.deathCube1Rigid},
	child0: {core: this.deathCube1},
}
this.deathCube1Layer = Layer('deathCube1Layer', this.deathCube1LayerData);
this.death1 = Death('death1', 1, this.deathCube1Layer);

//Death 2
this.deathCubeRigidData.id = 'deathCube2Rigid';
this.deathCube2Rigid = Core(this.deathCubeRigidData);
this.deathCubeData.id = 'deathCube2';
this.deathCubeData.components['death-hits'] = {objName: 'death2', hits: 8, rigidBody: 'deathCube2Rigid', isChild: true};
this.deathCube2 = Core(this.deathCubeData);
this.deathCube2LayerData = {
	parent: {core: this.deathCube2Rigid},
	child0: {core: this.deathCube2},
}
this.deathCube2Layer = Layer('deathCube2Layer', this.deathCube2LayerData);
this.death2 = Death('death2', 2, this.deathCube2Layer);

//Death 3
this.deathCubeRigidData.id = 'deathCube3Rigid';
this.deathCube3Rigid = Core(this.deathCubeRigidData);
this.deathCubeData.id = 'deathCube3';
this.deathCubeData.components['death-hits'] = {objName: 'death3', hits: 8, rigidBody: 'deathCube3Rigid', isChild: true};
this.deathCube3 = Core(this.deathCubeData);
this.deathCube3LayerData = {
	parent: {core: this.deathCube3Rigid},
	child0: {core: this.deathCube3},
}
this.deathCube3Layer = Layer('deathCube3Layer', this.deathCube3LayerData);
this.death3 = Death('death3', 3, this.deathCube3Layer);

//Enemies

//Enemy 1
this.enemy1 = Core(this.enemy1Data);
this.enemy1Rigid = Core(this.enemy1RigidData);
this.enemy1LayerData = {
	parent: {core: this.enemy1},
	child0: {core: this.enemy1Rigid},
}
this.enemy1Layer = Layer('enemy1Layer', this.enemy1LayerData);
//Enemy 1 Object
this.enemy1All = Enemy('enemy1All', 1, this.enemy1Layer);


//Enemy 2
this.enemy2 = Core(this.enemy2Data);
this.enemy2Rigid = Core(this.enemy2RigidData);
this.enemy2LayerData = {
	parent: {core: this.enemy2},
	child0: {core: this.enemy2Rigid},
}
this.enemy2Layer = Layer('enemy2Layer', this.enemy2LayerData);
//Enemy 2 Object
this.enemy2All = Enemy('enemy2All', 2, this.enemy2Layer);

//Enemy 3
this.enemy3 = Core(this.enemy3Data);
this.enemy3Rigid = Core(this.enemy3RigidData);
this.enemy3LayerData = {
	parent: {core: this.enemy3},
	child0: {core: this.enemy3Rigid},
}
this.enemy3Layer = Layer('enemy3Layer', this.enemy3LayerData);
//Enemy 3 Object
this.enemy3All = Enemy('enemy3All', 3, this.enemy3Layer);

//Enemy 4
this.enemy4 = Core(this.enemy4Data);
this.enemy4Rigid = Core(this.enemy4RigidData);
this.enemy4LayerData = {
	parent: {core: this.enemy4},
	child0: {core: this.enemy4Rigid},
}
this.enemy4Layer = Layer('enemy4Layer', this.enemy4LayerData);
//Enemy 4 Object
this.enemy4All = Enemy('enemy4All', 4, this.enemy4Layer);

//Enemy 5
this.enemy5 = Core(this.enemy5Data);
this.enemy5Rigid = Core(this.enemy5RigidData);
this.enemy5LayerData = {
	parent: {core: this.enemy5},
	child0: {core: this.enemy5Rigid},
}
this.enemy5Layer = Layer('enemy5Layer', this.enemy5LayerData);
//Enemy 5 Object
this.enemy5All = Enemy('enemy5All', 5, this.enemy5Layer);

//Enemy 6
this.enemy6 = Core(this.enemy6Data);
this.enemy6Rigid = Core(this.enemy6RigidData);
this.enemy6LayerData = {
	parent: {core: this.enemy6},
	child0: {core: this.enemy6Rigid},
}
this.enemy6Layer = Layer('enemy6Layer', this.enemy6LayerData);
//Enemy 6 Object
this.enemy6All = Enemy('enemy6All', 6, this.enemy6Layer);

//Enemy 7
this.enemy7 = Core(this.enemy7Data);
this.enemy7Rigid = Core(this.enemy7RigidData);
this.enemy7LayerData = {
	parent: {core: this.enemy7},
	child0: {core: this.enemy7Rigid},
}
this.enemy7Layer = Layer('enemy7Layer', this.enemy7LayerData);
//Enemy 6 Object
this.enemy7All = Enemy('enemy7All', 7, this.enemy7Layer);

//Enemy 8
this.enemy8 = Core(this.enemy8Data);
this.enemy8Rigid = Core(this.enemy8RigidData);
this.enemy8LayerData = {
	parent: {core: this.enemy8},
	child0: {core: this.enemy8Rigid},
}
this.enemy8Layer = Layer('enemy8Layer', this.enemy8LayerData);
//Enemy 8 Object
this.enemy8All = Enemy('enemy8All', 8, this.enemy8Layer);

//Enemy 9
this.enemy9 = Core(this.enemy9Data);
this.enemy9Rigid = Core(this.enemy9RigidData);
this.enemy9LayerData = {
	parent: {core: this.enemy9},
	child0: {core: this.enemy9Rigid},
}
this.enemy9Layer = Layer('enemy9Layer', this.enemy9LayerData);
//Enemy 9 Object
this.enemy9All = Enemy('enemy9All', 9, this.enemy9Layer);

//Enemy 10
this.enemy10 = Core(this.enemy10Data);
this.enemy10Rigid = Core(this.enemy10RigidData);
this.enemy10LayerData = {
	parent: {core: this.enemy10},
	child0: {core: this.enemy10Rigid},
}
this.enemy10Layer = Layer('enemy10Layer', this.enemy10LayerData);
//Enemy 10 Object
this.enemy10All = Enemy('enemy10All', 10, this.enemy10Layer);

//Enemy 11
this.enemy11 = Core(this.enemy11Data);
this.enemy11Rigid = Core(this.enemy11RigidData);
this.enemy11LayerData = {
	parent: {core: this.enemy11},
	child0: {core: this.enemy11Rigid},
}
this.enemy11Layer = Layer('enemy11Layer', this.enemy11LayerData);
//Enemy 11 Object
this.enemy11All = Enemy('enemy11All', 11, this.enemy11Layer);

//Enemy 12
this.enemy12 = Core(this.enemy12Data);
this.enemy12Rigid = Core(this.enemy12RigidData);
this.enemy12LayerData = {
	parent: {core: this.enemy12},
	child0: {core: this.enemy12Rigid},
}
this.enemy12Layer = Layer('enemy12Layer', this.enemy12LayerData);
//Enemy 12 Object
this.enemy12All = Enemy('enemy12All', 12, this.enemy12Layer);

//Enemy 13
this.enemy13 = Core(this.enemy13Data);
this.enemy13Rigid = Core(this.enemy13RigidData);
this.enemy13LayerData = {
	parent: {core: this.enemy13},
	child0: {core: this.enemy13Rigid},
}
this.enemy13Layer = Layer('enemy13Layer', this.enemy13LayerData);
//Enemy 13 Object
this.enemy13All = Enemy('enemy13All', 13, this.enemy13Layer);


//
//World Atlas & Map
//Define at end of Init to ensure all objects are ready

//Starting Area
//Zone 0
//
//Levels
this.zone0Node0 = SceneNode(this.zone0Node0Data);
this.zone0Node1 = SceneNode(this.zone0Node1Data);
this.zone0Node2 = SceneNode(this.zone0Node2Data);
this.zone0Node3 = SceneNode(this.zone0Node3Data);
this.zone0Node4 = SceneNode(this.zone0Node4Data);
this.zone0Node5 = SceneNode(this.zone0Node5Data);
this.zone0Node6 = SceneNode(this.zone0Node6Data);
this.zone0Node7 = SceneNode(this.zone0Node7Data);
this.zone0Node8 = SceneNode(this.zone0Node8Data);
this.zone0Node9 = SceneNode(this.zone0Node9Data);
this.zone0Node10 = SceneNode(this.zone0Node10Data);
this.zone0Node11 = SceneNode(this.zone0Node11Data);
this.zone0Node12 = SceneNode(this.zone0Node12Data);
this.zone0Node13 = SceneNode(this.zone0Node13Data);
this.zone0Node14 = SceneNode(this.zone0Node14Data);
this.zone0Node15 = SceneNode(this.zone0Node15Data);
this.zone0Node16 = SceneNode(this.zone0Node16Data);
this.zone0Node17 = SceneNode(this.zone0Node17Data);
this.zone0Node18 = SceneNode(this.zone0Node18Data);
this.zone0Node19 = SceneNode(this.zone0Node19Data);
this.zone0Node20 = SceneNode(this.zone0Node20Data);
this.zone0Node21 = SceneNode(this.zone0Node21Data);
this.zone0Node22 = SceneNode(this.zone0Node22Data);
this.zone0Node23 = SceneNode(this.zone0Node23Data);
this.zone0Node24 = SceneNode(this.zone0Node24Data);
this.zone0Node25 = SceneNode(this.zone0Node25Data);
this.zone0Node26 = SceneNode(this.zone0Node26Data);
this.zone0Node27 = SceneNode(this.zone0Node27Data);
this.zone0Node28 = SceneNode(this.zone0Node28Data);
this.zone0Node29 = SceneNode(this.zone0Node29Data);
this.zone0Node30 = SceneNode(this.zone0Node30Data);
this.zone0Node31 = SceneNode(this.zone0Node31Data);
this.zone0Node32 = SceneNode(this.zone0Node32Data);
this.zone0Node33 = SceneNode(this.zone0Node33Data);
this.zone0Node34 = SceneNode(this.zone0Node34Data);
this.zone0Node35 = SceneNode(this.zone0Node35Data);
this.zone0Node36 = SceneNode(this.zone0Node36Data);
this.zone0Node37 = SceneNode(this.zone0Node37Data);
this.zone0Node38 = SceneNode(this.zone0Node38Data);
this.zone0Node39 = SceneNode(this.zone0Node39Data);
this.zone0Node40 = SceneNode(this.zone0Node40Data);
this.zone0Node41 = SceneNode(this.zone0Node41Data);
this.zone0Node42 = SceneNode(this.zone0Node42Data);
this.zone0Node43 = SceneNode(this.zone0Node43Data);
this.zone0Node44 = SceneNode(this.zone0Node44Data);
this.zone0Node45 = SceneNode(this.zone0Node45Data);
this.zone0Node46 = SceneNode(this.zone0Node46Data);
this.zone0Node47 = SceneNode(this.zone0Node47Data);
this.zone0Node48 = SceneNode(this.zone0Node48Data);
this.zone0Node49 = SceneNode(this.zone0Node49Data);
this.zone0Node50 = SceneNode(this.zone0Node50Data);


//Map Zone 0
this.zone0 = MapZone(this.zone0Data);


//Init Level 0
this.zone0.StartScene();


},//Init


});//End of AUXL


//
//Click event listener for obj.Click(el) within auxl system
AFRAME.registerComponent('clickfunc', {
//el.setAttribute('clickfunc',{clickObj: 'auxlObj'})
//auxlObj is a string exact name for a this.auxlObj named object which has it's Click() func ran
	dependencies: ['auxl'],
    schema: {
        clickObj: {type: 'string', default: 'auxlObj'}
    },
    init: function () {
        //Do something when component first attached.
		this.auxl = document.querySelector('a-scene').systems.auxl;
    },//End initialization Function
	events: {
		click: function (evt) {
			//console.log('Clicked on ' + evt.target.id);
			//console.log(evt.target);
			//console.log(this.data.clickObj);//zone0?auxlObj
			this.auxl[this.data.clickObj].Click(evt.target);
		}
	}
});
//
AFRAME.registerComponent('clickrun', {
	dependencies: ['auxl'],
    schema: {
        cursorObj: {type: 'string', default: 'auxlObj'},
        method: {type: 'string', default: 'Click'},
        params: {type: 'string', default: 'null'}
    },
    init: function () {
        //Do something when component first attached.
		//console.log('clickrun attached');
		this.auxl = document.querySelector('a-scene').systems.auxl;
    },//End initialization Function
	events: {
		click: function (evt) {
			//console.log('Clicked on ' + evt.target.id);
			//console.log(evt.target);
			//console.log(this.data.cursorObj);
			//console.log(this.data.method);
			//console.log(this.data.params);
			if(this.auxl[this.data.cursorObj][this.data.method]){
				this.auxl[this.data.cursorObj][this.data.method](evt.target);
			}

		}
	}
});
//
AFRAME.registerComponent('fusingrun', {
	dependencies: ['auxl'],
    schema: {
        cursorObj: {type: 'string', default: 'auxlObj'},
        method: {type: 'string', default: 'methodName'},
        params: {type: 'string', default: 'null'}
    },
    init: function () {
        //Do something when component first attached.
		//console.log('clickrun attached');
		this.auxl = document.querySelector('a-scene').systems.auxl;
    },//End initialization Function
	events: {
		fusing: function (evt) {
			//console.log('Fused on ' + evt.target.id);
			//console.log(evt.target);
			//console.log(this.data.cursorObj);
			//console.log(this.data.method);
			//console.log(this.data.params);
			if(this.auxl[this.data.cursorObj][this.data.method]){
				this.auxl[this.data.cursorObj][this.data.method](evt.target);
			}

		}
	}
});
//
AFRAME.registerComponent('mousedownrun', {
	dependencies: ['auxl'],
    schema: {
        cursorObj: {type: 'string', default: 'auxlObj'},
        method: {type: 'string', default: 'methodName'},
        params: {type: 'string', default: 'null'}
    },
    init: function () {
        //Do something when component first attached.
		//console.log('clickrun attached');
		this.auxl = document.querySelector('a-scene').systems.auxl;
    },//End initialization Function
	events: {
		mousedown: function (evt) {
			//console.log('Cursor down on ' + evt.target.id);
			//console.log(evt.target);
			//console.log(this.data.cursorObj);
			//console.log(this.data.method);
			//console.log(this.data.params);
			if(this.auxl[this.data.cursorObj][this.data.method]){
				this.auxl[this.data.cursorObj][this.data.method](evt.target);
			}

		}
	}
});
//
AFRAME.registerComponent('mouseenterrun', {
	dependencies: ['auxl'],
    schema: {
        cursorObj: {type: 'string', default: 'auxlObj'},
        method: {type: 'string', default: 'methodName'},
        params: {type: 'string', default: 'null'}
    },
    init: function () {
        //Do something when component first attached.
		//console.log('clickrun attached');
		this.auxl = document.querySelector('a-scene').systems.auxl;
    },//End initialization Function
	events: {
		mouseenter: function (evt) {
			//console.log('Cursor entered on ' + evt.target.id);
			//console.log(evt.target);
			//console.log(this.data.cursorObj);
			//console.log(this.data.method);
			//console.log(this.data.params);
			if(this.auxl[this.data.cursorObj][this.data.method]){
				this.auxl[this.data.cursorObj][this.data.method](evt.target);
			}

		}
	}
});
//
AFRAME.registerComponent('mouseleaverun', {
	dependencies: ['auxl'],
    schema: {
        cursorObj: {type: 'string', default: 'auxlObj'},
        method: {type: 'string', default: 'methodName'},
        params: {type: 'string', default: 'null'}
    },
    init: function () {
        //Do something when component first attached.
		//console.log('clickrun attached');
		this.auxl = document.querySelector('a-scene').systems.auxl;
    },//End initialization Function
	events: {
		mouseleave: function (evt) {
			//console.log('Cursor left from ' + evt.target.id);
			//console.log(evt.target);
			//console.log(this.data.cursorObj);
			//console.log(this.data.method);
			//console.log(this.data.params);
			if(this.auxl[this.data.cursorObj][this.data.method]){
				this.auxl[this.data.cursorObj][this.data.method](evt.target);
			}

		}
	}
});
//
AFRAME.registerComponent('mouseuprun', {
	dependencies: ['auxl'],
    schema: {
        cursorObj: {type: 'string', default: 'auxlObj'},
        method: {type: 'string', default: 'methodName'},
        params: {type: 'string', default: 'null'}
    },
    init: function () {
        //Do something when component first attached.
		//console.log('clickrun attached');
		this.auxl = document.querySelector('a-scene').systems.auxl;
    },//End initialization Function
	events: {
		mouseup: function (evt) {
			//console.log('Cursor up from' + evt.target.id);
			//console.log(evt.target);
			//console.log(this.data.cursorObj);
			//console.log(this.data.method);
			//console.log(this.data.params);
			if(this.auxl[this.data.cursorObj][this.data.method]){
				this.auxl[this.data.cursorObj][this.data.method](evt.target);
			}

		}
	}
});

