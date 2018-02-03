
interface latlng {
	lat:number,
	lng:number
}

interface point2D {
	x:number,
	z:number
}

interface step2D {
	distance:number,
	stepnumber:number,
	xgap:number,
	zgap:number,
	x:number,
	z:number,
}

interface point3D {
	x:number,
	z:number,
	y:number
}

interface step3D {
	distance:number,
	stepnumber:number,
	xgap:number,
	zgap:number,
	ygap:number,
	x:number,
	z:number,
	y:number,
}

// WAZANA PLAYER CAN SWITCH BETWEEN TWO MAPS, currentMap STORE WHICH ONE IS SEEN BY THE PLAYER
var currentMap = 'mapG1';

class meshClass {
  materials:any;
  material:string;
  mesh:any;
  type:string;
  mapkey:string;
  shadow:boolean;
  present: boolean;
  color:string;
  scaleSize:number;
  rotation:number;
  rotationheight:number;
  bone:any;
  highlighter:any;
  // TODO USE NEW GLOW EFFECT : https://doc.babylonjs.com/how_to/glow_layer

  addTo (mapkey:string) {
    if (currentMap == mapkey) {
      if (this.shadow) this.addShadow();
      this.mesh.isVisible = true;
    }
    this.mapkey = mapkey;
    // if (this.options.animation) this.animationStart();
    this.present = true;
    return this;
  }

  remove () {
    this.mesh.isVisible = false;
    if (this.shadow) this.removeShadow();
    // if (this.options.animation) this.animationStop();
    this.present = false;
    return this;
  }

  show () {
    this.mesh.isVisible = true;
    return this;
  }

  hide () {
    this.mesh.isVisible = false;
    return this;
  }

  addShadow  () {
    shadowGenerator.getShadowMap().renderList.push(this.mesh);
    // waterMaterial.refractionTexture.renderList.push(this.mesh);
    return this;
  }

  removeShadow  () {
    shadowGenerator.getShadowMap().renderList.splice(shadowGenerator.getShadowMap().renderList.indexOf(this.mesh), 1);
    // waterMaterial.refractionTexture.renderList.splice(waterMaterial.refractionTexture.renderList.indexOf(this.mesh), 1);
    return this;
  }

  setParent (parentMesh:any) {
    this.mesh.parent = parentMesh;
    return this;
  }

  getGround () {
    return this.heightAt(mapGrounds[this.mapkey], this.mesh.position.x, this.mesh.position.z);
  }

  setPosGround (pos:point3D) {
    let height = this.heightAt(mapGrounds[this.mapkey], pos.x, pos.z);
    if (height < 0.5) height = 0.5; // DON4T WANT THE MESH TO GO BELOW WATER
    if (pos.y) height += pos.y;
    this.mesh.position = new BABYLON.Vector3(pos.x, height, pos.z);
    return this;
  }

  setHeight (height:number) {
    let realheight = (height)? height : 0.5;
    this.mesh.position.y = Math.max(this.heightAt(mapGrounds[this.mapkey], this.mesh.position.x, this.mesh.position.z)+realheight, 0.5);
  }

  heightAt(ground:any, x:number, z:number) {
    // FIXME getHeightAtCoordinates not working
    // let height = mapGrounds[this.mapkey].getHeightAtCoordinates(pos.x, pos.z);
    let maxHeight = 12;
    let ray = new BABYLON.Ray(new BABYLON.Vector3(x, maxHeight, z),	new BABYLON.Vector3(0, -1, 0), 2*maxHeight);
    let res = ground.intersects(ray, true);
    if (res.pickedPoint) return res.pickedPoint.y;
    else return 0;
  }

  setPosAxis (pos:point3D) {
    for (let axe in pos) {
      if (pos.hasOwnProperty(axe)) {
        this.mesh.position[axe] = pos[axe];
      }
    }
    return this;
  }

  addPosAxis (pos:point3D) {
    for (let axe in pos) {
      if (pos.hasOwnProperty(axe)) {
        this.mesh.position[axe] += pos[axe];
      }
    }
    return this;
  }

  setAngleAxis (angles:point3D) {
    for (let axe in angles) {
      if (angles.hasOwnProperty(axe)) {
        this.mesh.rotation[axe] = angles[axe];
      }
    }
    return this;
  }

  addAngleAxis (angles:point3D) {
    for (let axe in angles) {
      if (angles.hasOwnProperty(axe)) {
        this.mesh.rotation[axe] += angles[axe];
      }
    }
    return this;
  }

  highlight (color:string) {
    color = (color)? color : this.color;
    if (!this.highlighter) this.highlighter = new BABYLON.HighlightLayer("hl", scene);
    this.highlighter.addMesh(this.mesh, this.color);
  }

  setMaterial (material:string) {
    this.material = material;
    this.mesh.material = this.materials[material];
    return this;
  }

  setOpacity (op:number) {
    this.mesh.visibility = op;
    return this;
  }

  addOpacity (op:number) {
    this.mesh.visibility += op;
    if (this.mesh.visibility > 1) this.setOpacity(1);
    if (this.mesh.visibility < 0) this.setOpacity(0);
    return this;
  }

  scale (scale:number) {
    this.scaleSize = scale;
    this.mesh.scaling = {x:scale, y:scale, z:scale};
    return this;
  }

  scaleAxis (axis:point3D) {
    for (let axe in axis) {
      if (axis.hasOwnProperty(axe)) {
        if (axe == 'x') this.mesh.scaling.x = axis.x;
        if (axe == 'z') this.mesh.scaling.z = axis.z;
        if (axe == 'y') this.mesh.scaling.y = axis.y;
      }
    }
    return this;
  }

  // USED FOR LINES
  setPath (point1:point3D, point2:point3D) {
    this.mesh.position = point1;
    if (point2) {
      this.mesh.scaling.x = point2.x - point1.x;
      this.mesh.scaling.z = point2.z - point1.z;
      this.mesh.scaling.y = point2.y - point1.y;
    }
    return this;
  }

  setAngle (angle:number) {
    if (this.type == 'tour') {
      let amount = this.rotation - angle;
      this.bone.rotate(BABYLON.Axis.Y, amount);
    } else {
      this.mesh.rotation.y = angle;
    }
    this.rotation = angle;
  }

  // TODO spin weapon toward target in height
  setHeightAngle (angle:number) {
    if (this.type == 'tour') {
      let amount = this.rotationheight - angle;
      this.bone.rotate(BABYLON.Axis.X, angle);
    } else {
      this.mesh.rotation.x = angle;
    }
    this.rotationheight = angle;
  }

  renameEvent = {
    click:'OnPickTrigger',
    dbclick:'OnDoublePickTrigger',
    rightclick:'OnRightPickTrigger',
    leftclick:'OnLeftPickTrigger',
    mousedown:'OnPickDownTrigger',
    mouseenter:'OnPointerOverTrigger',
    mouseout:'OnPointerOutTrigger',
  };
  on (event:string, funct:Function) {
    if (this.mesh.actionManager == undefined) this.mesh.actionManager = new BABYLON.ActionManager(scene);
    let babylonevent = this.renameEvent[event];
    this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager[babylonevent], () => {
      funct();
    }));
  }

  fadeOver () {
    if (this.mesh.actionManager == undefined) this.mesh.actionManager = new BABYLON.ActionManager(scene);
    this.mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, this.mesh, 'scaling', new BABYLON.Vector3(this.scaleSize*1.1, this.scaleSize*1.1, this.scaleSize*1.1), 50));
    this.mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, this.mesh, 'scaling', new BABYLON.Vector3(this.scaleSize, this.scaleSize, this.scaleSize), 50));
  }

  destroy () {
    scene.meshes.splice(scene.meshes.indexOf(this.mesh), 1);
  }
}

// WAZANA TOOLS USE TOOL
class tool extends meshClass {
  standardmethod = {sphere:'instance', shield:'instance', spherebullet:'instance', switchdisc:'clone', line:'clone', select:'clone', box:'instance', plane:'instance'};
  shadow = false;

  constructor (mesh:string, player:any, method?:string, key?:string) {
    super();
    this.materials = player.materials;
    let meshmethod = (method === undefined)? this.standardmethod[mesh] : method;
    let meshkey = (key === undefined)? '' : key;
    if (meshmethod == 'instance') this.mesh = player.meshes[mesh].createInstance(meshkey);
    else this.mesh = player.meshes[mesh].clone(meshkey);

    this.type = 'tool';
    scene.meshes.push(this.mesh);
    this.mesh.isVisible = false;
    this.mesh.position = new BABYLON.Vector3(0, 0, 0);

    this.material = mesh;
    //  sun.excludedMeshes.push(this.mesh);
    return this;
  }
}

// WAZANA BUILDINGS AND UNITS USE SHAPE
class shape extends meshClass {
  shadow = true;
  animation:any;
  scene:any;

  constructor  (shape:any, materials:any) {
    super();
    this.mapkey = shape.mapkey;
    this.mesh = meshesContainer[shape.clas][shape.selector].clone(shape.key);
    this.mesh.isVisible = false;
    this.type = shape.type;
    this.materials = materials;
    this.material = 'color';

    if (skeletonsContainer[shape.clas][shape.selector]) {
      this.mesh.skeleton = skeletonsContainer[shape.clas][shape.selector].clone();
      this.bone = this.mesh.skeleton.bones[1];
    }

    if (shape.angle0) {
      this.rotation = shape.angle0;
      this.mesh.rotation.y = shape.angle0;
    }
    this.rotationheight = 0;
    // this.mesh.checkCollisions = true;
    if (this.type == 'building') this.mesh.receiveShadows = true;
    // if (options.animation) this.animationStart();
    return this;
  }

  animationStart  (once:boolean) {
    if (!this.mesh.skeleton) return;
    if (!this.animation) {
      if (once) {
        this.animation = this.scene.beginAnimation(this.mesh.skeleton, 0, 61, false, 1);
      } else {
        this.animation = this.scene.beginAnimation(this.mesh.skeleton, 0, 61, true, 1);
      }
      // TODO add easing animation
      // TODO add producer animation
      // console.log(this.mesh.skeleton);
      // let anim = this.mesh.skeleton._animatables[1].animations[0];
      // let easingFunction = new BABYLON.BackEase(100);
      // easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
      // // Adding the easing function to the animation
      // anim.setEasingFunction(easingFunction);
    } else {
      this.animation.restart();
    }
    return this;
  }

  animationStop  () {
    if (this.animation) this.animation.pause();
    return this;
  }
}
