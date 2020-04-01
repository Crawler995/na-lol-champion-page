import React, { Component, createRef } from 'react';
import TWEEN from '@tweenjs/tween.js';

interface IClipSize {
  leftTop: number;
  rightTop: number;
  rightBottom: number;
  leftBottom: number;
}

interface IAnimation {
  duration: number;
  delay: number;
  timingFunction: typeof TWEEN.Easing.Quartic.InOut;
}

type IHoverAnimation = IAnimation;

interface ILineGrowHead {
  length: number;
  width: number;
}

type ILineGrowAnimation = IAnimation & {
  startDrawPointsNum: number;

  lineGrowHead: boolean;
  lineGrowHeadConfig: ILineGrowHead;
};

interface ClipRectProps {
  draw: boolean;

  bgColor: string;
  borderColor: string;
  borderWidth: number;
  clipSize: IClipSize;

  hoverAnimation: boolean;
  hoverAnimationConfig: IHoverAnimation;

  lineGrowAnimation: boolean;
  lineGrowAnimationConfig: ILineGrowAnimation;
}

interface ClipRectState {
  width: number;
  height: number;
}

const defaultClipSize: IClipSize = {
  leftTop: 0,
  rightTop: 20,
  rightBottom: 0,
  leftBottom: 0
};

const defaultHoverAnimationConfig: IHoverAnimation = {
  duration: 200,
  delay: 0,
  timingFunction: TWEEN.Easing.Cubic.InOut
};

const defaultLineGrowAnimationConfig: ILineGrowAnimation = {
  duration: 800,
  delay: 0,
  timingFunction: TWEEN.Easing.Quartic.In,

  startDrawPointsNum: 1,
  lineGrowHead: true,
  lineGrowHeadConfig: {
    width: 5,
    length: 0.1
  }
};

export const createClipRect = ({
  draw = false,

  bgColor = 'rgba(0, 0, 0, 0)',
  borderColor = 'rgba(255, 255, 255, 0.2)',
  borderWidth = 1,
  clipSize = defaultClipSize,

  hoverAnimation = true,
  hoverAnimationConfig = defaultHoverAnimationConfig,

  lineGrowAnimation = true,
  lineGrowAnimationConfig = defaultLineGrowAnimationConfig
}: Partial<ClipRectProps>) => (
  <ClipRect
    draw={draw}
    bgColor={bgColor}
    borderColor={borderColor}
    borderWidth={borderWidth}
    clipSize={clipSize}
    hoverAnimation={hoverAnimation}
    hoverAnimationConfig={hoverAnimationConfig}
    lineGrowAnimation={lineGrowAnimation}
    lineGrowAnimationConfig={lineGrowAnimationConfig}
  />
);

interface IPos {
  x: number;
  y: number;
}

interface IPointsInfo {
  totalBorderLength: number;
  stepsLength: number[];
}

export default class ClipRect extends Component<ClipRectProps, ClipRectState> {
  private dynamicClipSize: IClipSize;
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  private dpr = window.devicePixelRatio;
  private lineGrowPartLength: number = 0;

  private pointsInfo: IPointsInfo | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseEnterTween: TWEEN.Tween | null = null;
  private mouseLeaveTween: TWEEN.Tween | null = null;
  private lineGrowTween: TWEEN.Tween | null = null;
  private lineGrowTweenCompleted = false;

  constructor(props: ClipRectProps) {
    super(props);

    this.canvasRef = createRef<HTMLCanvasElement>();
    this.dynamicClipSize = this.props.clipSize!;

    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    this.initSize();

    this.pointsInfo = this.initPointsInfo();
    this.initCtx();
    this.initLineGrowTween();

    if (this.props.draw) {
      this.draw();
    }
  }

  componentDidUpdate() {
    this.initCtx();
  }

  initSize = () => {
    const { width, height } = this.canvasRef.current!.getBoundingClientRect();
    this.setState({ width, height });
  };

  initCtx = () => {
    this.ctx = this.canvasRef.current!.getContext('2d');
    if (!this.ctx) return;

    this.ctx.scale(this.dpr, this.dpr);

    const { bgColor, borderColor, borderWidth } = this.props;
    this.ctx.fillStyle = bgColor;
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = borderWidth;
  };

  initPointsInfo = () => {
    return this.getPointsInfo(this.getClipRectPoints());
  };

  initLineGrowTween = () => {
    const { lineGrowAnimationConfig } = this.props;

    this.lineGrowTween = new TWEEN.Tween({ obj: 0 })
      .to(
        { obj: 1 / lineGrowAnimationConfig.startDrawPointsNum! },
        lineGrowAnimationConfig.duration!
      )
      .delay(lineGrowAnimationConfig.delay)
      .easing(lineGrowAnimationConfig.timingFunction!)
      .onUpdate((cur: { obj: number }) => (this.lineGrowPartLength = cur.obj))
      .onComplete(() => (this.lineGrowTweenCompleted = true))
      .start();
  };

  draw = () => {
    if (!this.ctx) return;
    const { lineGrowAnimation } = this.props;
    const { width, height } = this.state;
    this.ctx.clearRect(0, 0, width, height);

    if (lineGrowAnimation) {
      this.drawWithLineGrowAnimation();
    } else {
      this.drawWithoutLineGrowAnimation();
    }

    TWEEN.update();

    window.requestAnimationFrame(this.draw);
  };

  drawWithoutLineGrowAnimation = () => {
    const points = this.getClipRectPoints();
    this.drawLineThroughPoints(points);
  };

  drawWithLineGrowAnimation = () => {
    const { width, height } = this.state;
    const { lineGrowAnimationConfig, borderWidth } = this.props;
    if (this.lineGrowTweenCompleted) {
      this.ctx!.clearRect(0, 0, width, height);
      this.drawWithoutLineGrowAnimation();
      return;
    }

    const num = lineGrowAnimationConfig.startDrawPointsNum!;
    for (let i = 0; i < num; i++) {
      this.drawLineByStartPointAndLength(i / num, this.lineGrowPartLength);
      this.ctx!.lineWidth = lineGrowAnimationConfig.lineGrowHeadConfig.width;
      const lineGrowHeadOriginalLength = lineGrowAnimationConfig.lineGrowHeadConfig!.length!;
      const lineGrowHeadStart = i / num + this.lineGrowPartLength;
      const lineGrowHeadLength = lineGrowHeadOriginalLength;
      this.ctx!.globalAlpha =
        this.lineGrowPartLength + lineGrowHeadLength > 1 / num
          ? (lineGrowHeadLength - (this.lineGrowPartLength + lineGrowHeadLength - 1 / num)) /
            lineGrowHeadLength
          : 1;
      this.drawLineByStartPointAndLength(lineGrowHeadStart, lineGrowHeadLength);
      this.ctx!.lineWidth = borderWidth;
      this.ctx!.globalAlpha = 1;
    }
    // drawLineByStartPointAndLength(0.9, 0.12);
  };

  drawLineByStartPointAndLength = (start: number, length: number, alpha = 1) => {
    const points = this.getClipRectPoints();
    const pointsInfo = this.initPointsInfo();

    const getStartPoint = (start: number) => {
      const startLength = start * pointsInfo.totalBorderLength;
      let sum = 0;
      let i;
      for (i = 0; i < pointsInfo.stepsLength.length; i++) {
        sum += pointsInfo.stepsLength[i];
        if (sum > startLength) {
          sum -= pointsInfo.stepsLength[i];
          break;
        }
      }

      const startBehindPointIndex = i;
      const restLength = startLength - sum;
      const startPoint = this.getPointPosByBehindKnownPointAndRestLength(
        startBehindPointIndex,
        restLength
      );

      return {
        startPoint,
        startBehindPointIndex
      };
    };

    const getMiddlePointsIndex = (
      startPoint: IPos,
      startBehindPointIndex: number,
      length: number
    ) => {
      const middlePointsIndex: number[] = [];
      let partTotalLength = length * pointsInfo.totalBorderLength;

      const distanceFromNextPoint = this.getDistance(
        startPoint,
        points[(startBehindPointIndex + 1) % points.length]
      );
      if (distanceFromNextPoint >= partTotalLength) {
        return {
          middlePointsIndex,
          restLength: partTotalLength
        };
      }

      partTotalLength -= distanceFromNextPoint;
      for (
        let index = (startBehindPointIndex + 1) % pointsInfo.stepsLength.length;
        ;
        index = (index + 1) % pointsInfo.stepsLength.length
      ) {
        partTotalLength -= pointsInfo.stepsLength[index];
        middlePointsIndex.push(index);
        if (partTotalLength <= 0) {
          partTotalLength += pointsInfo.stepsLength[index];
          break;
        }
      }

      return {
        middlePointsIndex,
        restLength: partTotalLength
      };
    };

    const getEndPoint = (lastPointIndex: number, restLength: number) => {
      return this.getPointPosByBehindKnownPointAndRestLength(lastPointIndex, restLength);
    };

    const { startPoint, startBehindPointIndex } = getStartPoint(start);
    const { middlePointsIndex, restLength } = getMiddlePointsIndex(
      startPoint,
      startBehindPointIndex,
      length
    );
    const middlePoints = middlePointsIndex.map(index => points[index]);
    const endPoint = getEndPoint(
      middlePointsIndex[middlePointsIndex.length - 1] ?? startBehindPointIndex,
      middlePointsIndex[middlePointsIndex.length - 1] !== undefined
        ? restLength
        : restLength + this.getDistance(startPoint, points[startBehindPointIndex])
    );
    // console.log(restLength)
    // console.log(startPoint, middlePoints, endPoint);
    this.drawLineThroughPoints([startPoint, ...middlePoints, endPoint], false, alpha);
  };

  getPointPosByBehindKnownPointAndRestLength = (beforePointIndex: number, restLength: number) => {
    const { width, height } = this.state;
    const { clipSize } = this.props;
    const point: IPos = { x: 0, y: 0 };
    const factor = Math.sin(Math.PI / 4);

    switch (beforePointIndex) {
      case 0:
        point.x = restLength * factor;
        point.y = clipSize.leftTop - restLength * factor;
        break;

      case 1:
        point.x = clipSize.leftTop + restLength;
        point.y = 0;
        break;

      case 2:
        point.x = width - clipSize.rightTop + restLength * factor;
        point.y = restLength * factor;
        break;

      case 3:
        point.x = width;
        point.y = clipSize.rightTop + restLength;
        break;

      case 4:
        point.x = width - restLength * factor;
        point.y = height - clipSize.rightBottom + restLength * factor;
        break;

      case 5:
        point.x = width - clipSize.rightBottom - restLength;
        point.y = height;
        break;

      case 6:
        point.x = clipSize.leftBottom - restLength * factor;
        point.y = height - restLength * factor;
        break;

      case 7:
        point.x = 0;
        point.y = height - clipSize.leftBottom - restLength;
        break;

      default:
        break;
    }
    return point;
  };

  drawLineThroughPoints = (points: IPos[], closePath = true, alpha = 1) => {
    if (!this.ctx) return;
    const { width, height } = this.state;
    const { borderWidth } = this.props;
    points = points.map(point => {
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      const factor = borderWidth / 2 + 0.5;

      const x = point.x + (point.x < halfWidth ? factor : -factor);
      const y = point.y + (point.y < halfHeight ? factor : -factor);

      return { x, y };
    });

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    points.forEach(point => {
      if (!this.ctx) return;
      this.ctx.lineTo(point.x, point.y);
    });

    if (closePath) this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
  };

  getDistance = (pointA: IPos, pointB: IPos) => {
    const x = pointA.x - pointB.x;
    const y = pointA.y - pointB.y;
    return Math.sqrt(x * x + y * y);
  };

  getPointsInfo = (points: IPos[]): IPointsInfo => {
    const res: IPointsInfo = {
      totalBorderLength: 0,
      stepsLength: []
    };

    for (let i = 0; i < points.length; i++) {
      const now = points[i];
      const next = points[(i + 1) % points.length];
      const distance = this.getDistance(now, next);
      res.stepsLength.push(distance);
      res.totalBorderLength += distance;
    }

    return res;
  };

  getClipRectPoints = () => {
    const { width, height } = this.state;
    const points = [];
    const { leftTop, leftBottom, rightBottom, rightTop } = this.dynamicClipSize;

    points.push({ x: 0, y: leftTop });
    points.push({ x: leftTop, y: 0 });

    points.push({ x: width - rightTop, y: 0 });
    points.push({ x: width, y: rightTop });

    points.push({ x: width, y: height - rightBottom });
    points.push({ x: width - rightBottom, y: height });

    points.push({ x: leftBottom, y: height });
    points.push({ x: 0, y: height - leftBottom });

    return points;
  };

  reduceClipSizeWhenMouseHover = () => {
    if (!this.canvasRef.current) return;
    if (this.mouseLeaveTween?.isPlaying) this.mouseLeaveTween.pause();

    const to: IClipSize = {
      leftTop: 0,
      rightTop: 0,
      rightBottom: 0,
      leftBottom: 0
    };
    const { hoverAnimationConfig } = this.props;

    this.canvasRef.current.addEventListener('mouseenter', () => {
      this.mouseEnterTween = new TWEEN.Tween({ ...this.dynamicClipSize })
        .to(to, hoverAnimationConfig.duration!)
        .easing(hoverAnimationConfig.timingFunction!)
        .onUpdate(curClipSize => (this.dynamicClipSize = curClipSize))
        .start();
    });
  };

  recoverClipSizeWhenMouseLeave = () => {
    if (!this.canvasRef.current) return;
    if (this.mouseEnterTween?.isPlaying) this.mouseEnterTween.pause();
    const { clipSize, hoverAnimationConfig } = this.props;
    this.canvasRef.current.addEventListener('mouseleave', () => {
      this.mouseLeaveTween = new TWEEN.Tween({ ...this.dynamicClipSize })
        .to(clipSize, hoverAnimationConfig.duration as number)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(curClipSize => (this.dynamicClipSize = curClipSize))
        .start();
    });
  };

  render() {
    const { width, height } = this.state;
    return (
      <canvas
        ref={this.canvasRef}
        width={width * this.dpr}
        height={height * this.dpr}
        style={{
          position: 'relative',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    );
  }
}
