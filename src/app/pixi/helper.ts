export function subscribe(obj) {
  obj.interactive = true
  obj.on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove)
}

export function addShadow(obj) {
  const gr = new PIXI.Graphics()
  gr.beginFill(0x0, 1)
  // yes , I know bunny size, I'm sorry for this hack
  const scale = 1.1
  gr.drawRect(-25 / 2 * scale, -36 / 2 * scale, 25 * scale, 36 * scale)
  gr.endFill()
  obj.addChild(gr)
}

export function onDragStart(event) {
  if (!this.dragging) {
    this.data = event.data
    this.oldGroup = this.parentGroup
    // this.parentGroup = dragGroup;
    this.dragging = true

    this.scale.x *= 1.1
    this.scale.y *= 1.1
    this.dragPoint = event.data.getLocalPosition(this.parent)
    this.dragPoint.x -= this.x
    this.dragPoint.y -= this.y
  }
}

export function onDragEnd() {

  if (this.dragging) {
    this.dragging = false
    this.parentGroup = this.oldGroup
    this.scale.x /= 1.1
    this.scale.y /= 1.1
    // set the interaction data to null
    this.data = null
  }
}

export function onDragMove(e) {

  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent)
    this.x = newPosition.x - this.dragPoint.x
    this.y = newPosition.y - this.dragPoint.y
  }
}
