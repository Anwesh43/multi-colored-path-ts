const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.01
const delay : number = 20
const colors : Array<string> = ["#1A237E", "#9C27B0", "#f44336", "#4CAF50", "#FFEB3B"]
const backColor : string = "#BDBDBD"
const strokeFactor : number = 90

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class ScaleUtil {

    static cosify(scale : number) : number {
        return Math.cos(scale * Math.PI)
    }
}

class DrawingUtil {

    static drawColoredCurve(context : CanvasRenderingContext2D, scale : number, maxH : number) {
        context.beginPath()
        for (var i = 0; i <= scale; i+= scGap) {
            const x : number = w * i
            const y : number = maxH * ScaleUtil.cosify(scale)
            if (i == 0) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
    }

    static drawMCCNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const gap : number = h / colors.length
        const y : number = h - gap * i
        context.strokeStyle = colors[i]
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        DrawingUtil.drawColoredCurve(context, scale, y)
    }
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += this.dir * scGap
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {

    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class MCCNode {

    next : MCCNode
    prev : MCCNode
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.addNeighbor()
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawMCCNode(context, this.i, this.state.scale)
        if (this.prev) {
            this.prev.draw(context)
        }
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : MCCNode {
        var curr : MCCNode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class MultiColoredCurve {

    curr : MCCNode = new MCCNode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.curr.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}
