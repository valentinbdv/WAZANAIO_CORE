
interface position {
	x:number,
	y:number,
}

interface size {
  width:number,
	height:number,
}

interface style {
	left?:number,
	top?:number,
  width?:number,
	height?:number,
	float?:string, // Replace textHorizontalAlignment
	alpha?:number,
	color?:string,
	fontFamily?:string,
	fontSize?:number,
	cornerRadius?:number
	thickness?:number,
	background?:string,
}
// OTHER STYLES NOT USED YET:
// paddingTop
// paddingBottom
// paddingLeft
// paddingRight
// textVerticalAlignment
// lineSpacing
// textWrapping
// resizeToFit
// focusedBackground
// autoStretchWidth
// maxWidth
// margin

class ui {
	node:any;
	style:any = {};
	text:string;
	container:any;
	texture:any;
	size:size;
	position:position;

  // header (text, control, style) => {
  //   let header = BABYLON.GUI.Control.AddHeader(button, text, "400px", { isHorizontal: true, controlFirst: true });
  //   header.text = text;
  //   control.addControl(header);
  //   if (style) this.setStyle(header, style);
  //   return header;
  // }
  //
  // image (url, control, style) => {
  //   let image = new BABYLON.GUI.Image("", url);
  //   control.addControl(image);
  //   if (style) this.setStyle(image, style);
  //   return image;
  // }

  setNode (text:string, style:style) {
    this.node = new BABYLON.GUI.TextBlock();
    this.text = text;
    this.node.text = text;

		if (style.width != undefined) this.node.width = style.width;
    if (style.float == 'right') this.node.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
		else if (style.float == 'left' || style.float == undefined) this.node.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  }

  createContainer (style:any) {
    this.container = new BABYLON.GUI.Rectangle("");
    this.texture.addControl(this.container);
		this.container.thickness = 0;
    this.setStyle(style);
  }

  setText (text:string) {
		// if (text == undefined) return console.log(this.icon);
    text = text.toString();
    this.node.text = text;
    this.node.color = this.style.color;
    this.text = text;
    this.show();
    return this;
  }

  hide () {
    this.container.isVisible = false;
    return this;
  }

  show () {
    this.container.isVisible = true;
    return this;
  }

  setStyle (style:any, el?:any) {
    let rel = (el)? el : this.container;
    for (let key in style) {
      if (style.hasOwnProperty(key)) {
        this.style[key] = style[key];
        rel[key] = style[key];
      }
    }
		if (style.color && this.text) this.setText(this.text);
    return this;
  }

	setColor (color:string) {
		this.container.color = color;
		this.style.color = color;
		if (this.text) this.setText(this.text);
		return this;
	}

	setOpacity (op:number) {
		this.container.alpha = op;
		this.style.alpha = op;
		return this;
	}

	addOpacity (op:number) {
		this.container.alpha += op;
		this.style.alpha += op;
		if (this.container.alpha > 1) this.setOpacity(1);
		if (this.container.alpha < 0) this.setOpacity(0);
		return this;
	}

  setSize (size:size) {
    let newsize = (size)? size : this.size;
    this.size = newsize;
    this.container.height = (newsize.height+4)+'px';
  }

  setPosition (pos?:position) {
    let newpos = (pos)? pos : this.position;
    this.position = newpos;
    this.container.left = pos.x+'px';
    this.container.top = pos.y+'px';
    return this;
  }

	renameEvent = {
    click:'onPointerUpObservable',
    mousedown:'onPointerDownObservable',
    mouseenter:'onPointerEnterObservable',
    mouseout:'onPointerOutObservable',
  }
  on (event, funct) {
    let nodeevent = this.renameEvent[event];
    this.node[nodeevent].add(() => {
      funct();
    });
  }

  remove () {
    this.texture.removeControl(this.container);
  }
}

class ui_text extends ui {
  constructor(texture:any, text:string, pos:position, style:style) {
		super();
		this.texture = texture;
		style.fontFamily = 'wznfont';
		this.setNode(text, style);
		this.createContainer(style);
		if (style.width == undefined) this.container.width = '100%';
		this.setSize({height:style.fontSize, width:0});
		this.setPosition(pos);
		this.container.addControl(this.node);
		return this;
	}
}

class ui_back extends ui {
  constructor(texture:any, pos:position, style:style) {
		super();
		this.texture = texture;
		this.createContainer(style);
		this.setPosition(pos);
		return this;
	}
}

class ui_icon extends ui {
	icon = true;
  constructor(texture:any, icon:string, pos:position, style:style) {
		super();
		style.fontFamily = 'wznicon';
		this.texture = texture;
		let text = (icon != '')? this.icontochar[icon] : '';
		if (text == undefined) console.log(icon);
		this.setNode(text, style);
		this.createContainer(style);
		if (style.width == undefined) this.container.width = '100%';
		this.setSize({height:style.fontSize, width:0});
		this.setPosition(pos);
		this.container.addControl(this.node);
		return this;
	}

  icontochar = {
    wazanaLogo:'a',
    damage:'b',
    energy:'c',
    entity:'d',
    matter:'e',
		progress:'f',
		slice1:'A',
		slice2:'B',
		slicebis1:'C',
    slicebis2:'D',
    rate:'g',
    scope:'h',
    speed:'i',
    arrowbottomleft:'j',
    arrowbottomright:'k',
    arrowtopleft:'l',
    arrowtopright:'m',
    grade1:'n',
    grade2:'o',
    grade3:'p',
    grade4:'q',
    grade5:'r',
    grade6:'s',
    grade7:'t',
    grade8:'u',
    grade9:'v',
    grade10:'w',
    map:'x',
    mousecursor:'y',
    mousepointer:'z',
    mouseselect:'1',
    mousetarget:'2',
    close:'4',
    cure:'5',
    health:'5',
    fastbuilt:'6',
    fastmove:'7',
    fasttime:'8',
    hole:'9',
    invisible:'(',
    shield:')',
    slowtime:'-',
    strong:'_',
    teleport:'=',
  };

  setIcon (icon:string) {
    let text = this.icontochar[icon];
		if (text == undefined) return console.log(icon);
    this.setText(text);
    return this;
  }
}

class ui_bar extends ui {
	bar:any = {};

  constructor(texture:any, pos:position, style:style) {
		super();
		this.texture = texture;
    this.createContainer(style);
    this.setPosition(pos);
    return this;
	}

  createBar (name:string, style:style) {
    let bar = new BABYLON.GUI.Rectangle("");
		this.bar[name] = bar;
		this.bar[name].thickness = 0;
    if (style.float == 'left') this.bar[name].left = '-50%';
		else if (style.float == 'right') this.bar[name].left = '50%';
    this.container.addControl(bar);
    this.setStyle(style, bar);
    return this;
  }

  setSize (size:size) {
    this.container.height = size.height+'px';
    this.container.width = size.width+'px';
    return this;
  }

  setValue (name:string, value:number) {
    this.bar[name].width = (value*2)+'%';
    return this;
  }
}

class GuiTexture {
	texture:any;
	nodes:Array<any>
  constructor (plane:any, size:size, event:boolean) {
		this.texture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane, size.width*100, size.height*100, event);
		this.texture.renderingGroupId = 1;
		this.nodes = [];
    return this;
  }

	addText (text:string, pos:position, style:style) {
		let textNode = new ui_text(this.texture, text, pos, style);
		this.nodes.push(textNode)
		return textNode;
	}

	addIcon (icon:string, pos:position, style:style) {
		let iconNode = new ui_icon(this.texture, icon, pos, style);
		this.nodes.push(iconNode)
		return iconNode;
	}

	addBack (pos:position, style:style) {
		let back = new ui_back(this.texture, pos, style);
		this.nodes.push(back)
		return back;
	}

	addBar (pos:position, style:style) {
		let bar = new ui_bar(this.texture, pos, style);
		return bar;
	}

	hideAll () {
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].hide();
		}
	}

	showAll () {
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].show();
		}
	}

	initAll () {
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].setText('').hide();
		}
	}

	removeAll () {
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].remove();
		}
	}

	setColorAll (color) {
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].setColor(color);
		}
	}

}
