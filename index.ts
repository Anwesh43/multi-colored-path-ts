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

    static drawCCNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const gap : number = h / colors.length
        const y : number = h - gap * i
        context.strokeStyle = colors[i]
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        DrawingUtil.drawColoredCurve(context, scale, y)
    }
}
