import React, { Component, createRef } from 'react';
import TWEEN from '@tweenjs/tween.js';
import { RecursivePartial, deepMergeProps, debounce } from '../utils';

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

const defaultProps: ClipRectProps = {
  draw: true,

  bgColor: 'rgba(0, 0, 0, 0)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  borderWidth: 1,
  clipSize: {
    leftTop: 0,
    rightTop: 20,
    rightBottom: 0,
    leftBottom: 0
  },

  hoverAnimation: true,
  hoverAnimationConfig: {
    duration: 200,
    delay: 0,
    timingFunction: TWEEN.Easing.Cubic.InOut
  },

  lineGrowAnimation: true,
  lineGrowAnimationConfig: {
    duration: 800,
    delay: 0,
    timingFunction: TWEEN.Easing.Quartic.In,

    startDrawPointsNum: 1,
    lineGrowHead: true,
    lineGrowHeadConfig: {
      width: 5,
      length: 0.1
    }
  }
};

export const createClipRect = (props: RecursivePartial<ClipRectProps>) => {
  const mergedProps = deepMergeProps(defaultProps, props);
  return <ClipRect {...mergedProps} />;
};

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

  private points: IPos[] | null = null;
  private pointsInfo: IPointsInfo | null = null;
  private lineGrowPartLength: number = 0;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseEnterTween: TWEEN.Tween | null = null;
  private mouseLeaveTween: TWEEN.Tween | null = null;
  private lineGrowTween: TWEEN.Tween | null = null;
  private lineGrowTweenCompleted = false;
  private requestAnimationFrameFlag: number = 0;
  private shouldStopAnimation = false;
  private isFirstDrawWithoutAnimation = true;
  private pointsInfoCache = new Array<{
    totalLength: number;
    excludeLastLength: number;
    pointIndexBeforeEndPoint: number;
    startAndMiddlePoints: IPos[];
  }>();

  constructor(props: ClipRectProps) {
    super(props);

    this.canvasRef = createRef<HTMLCanvasElement>();
    this.dynamicClipSize = this.props.clipSize;

    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    this.initSize();
    this.initCtx();
    this.initLineGrowTween();
    this.points = this.getClipRectPoints();
    this.pointsInfo = this.initPointsInfo();

    if (this.props.draw) {
      this.requestAnimationFrameFlag = window.requestAnimationFrame(this.draw);
    }

    if (this.props.hoverAnimation) {
      this.reduceClipSizeWhenMouseHover();
      this.recoverClipSizeWhenMouseLeave();
    }

    window.addEventListener('resize', this.sizeChangeHandler);
  }

  componentDidUpdate() {
    this.initSize();
    this.initCtx();
    this.points = this.getClipRectPoints();
    this.pointsInfo = this.initPointsInfo();
    this.draw();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.requestAnimationFrameFlag);
    window.removeEventListener('mouseenter', this.mouseEnterHandler);
    window.removeEventListener('mouseleave', this.mouseLeaveHandler);
    window.removeEventListener('resize', this.sizeChangeHandler);
  }

  initSize = () => {
    if (!this.canvasRef.current) return;
    const { width, height } = this.canvasRef.current!.getBoundingClientRect();
    if (width !== this.state.width && height !== this.state.height) {
      this.setState({ width, height });
    }
  };

  sizeChangeHandler = debounce(() => {
    console.log('resize');
    this.initSize();
    this.points = this.getClipRectPoints();
    this.pointsInfo = this.initPointsInfo();
    this.draw();
  }, 500);

  initCtx = () => {
    const curCtx = this.canvasRef.current?.getContext('2d');
    if (!curCtx) return;

    this.ctx = curCtx;
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
      .to({ obj: 1 / lineGrowAnimationConfig.startDrawPointsNum }, lineGrowAnimationConfig.duration)
      .delay(lineGrowAnimationConfig.delay)
      .easing(lineGrowAnimationConfig.timingFunction)
      .onUpdate((cur: { obj: number }) => (this.lineGrowPartLength = cur.obj))
      .onComplete(() => {
        this.lineGrowTweenCompleted = true;
      })
      .start();
  };

  draw = () => {
    if (!this.ctx) return;
    const { lineGrowAnimation } = this.props;
    const { width, height } = this.state;
    this.ctx.clearRect(0, 0, width, height);

    if (lineGrowAnimation && !this.lineGrowTweenCompleted) {
      this.drawWithLineGrowAnimation();
    } else {
      this.drawWithoutLineGrowAnimation();
    }

    TWEEN.update();

    if (!this.shouldStopAnimation) {
      this.requestAnimationFrameFlag = window.requestAnimationFrame(this.draw);
    }
  };

  drawWithoutLineGrowAnimation = () => {
    const points = this.getClipRectPoints();
    this.drawLineThroughPoints(points);

    if (this.lineGrowTweenCompleted && this.isFirstDrawWithoutAnimation) {
      this.isFirstDrawWithoutAnimation = false;
      this.shouldStopAnimation = true;
    }
  };

  drawWithLineGrowAnimation = () => {
    const { lineGrowAnimationConfig } = this.props;

    const num = lineGrowAnimationConfig.startDrawPointsNum!;
    for (let i = 0; i < num; i++) {
      this.drawLineByStartPointAndLength(i / num, this.lineGrowPartLength);
    }

    if (!lineGrowAnimationConfig.lineGrowHead) return;

    this.drawLineGrowHead();
  };

  drawLineGrowHead = () => {
    const { lineGrowAnimationConfig, borderWidth } = this.props;
    this.ctx!.lineWidth = lineGrowAnimationConfig.lineGrowHeadConfig.width;
    const num = lineGrowAnimationConfig.startDrawPointsNum!;

    const lineGrowHeadOriginalLength = lineGrowAnimationConfig.lineGrowHeadConfig!.length!;

    for (let i = 0; i < num; i++) {
      const lineGrowHeadStart = i / num + this.lineGrowPartLength;
      const lineGrowHeadLength = lineGrowHeadOriginalLength;
      this.ctx!.globalAlpha =
        this.lineGrowPartLength + lineGrowHeadLength > 1 / num
          ? (lineGrowHeadLength - (this.lineGrowPartLength + lineGrowHeadLength - 1 / num)) /
            lineGrowHeadLength
          : 1;
      this.drawLineByStartPointAndLength(lineGrowHeadStart, lineGrowHeadLength, false);
    }
    this.ctx!.lineWidth = borderWidth;
    this.ctx!.globalAlpha = 1;
  };

  drawLineByStartPointAndLength = (start: number, length: number, useCache = true) => {
    const points = this.points!;
    const pointsInfo = this.pointsInfo!;
    const index = Math.round(start * this.props.lineGrowAnimationConfig.startDrawPointsNum);
    const cache = this.pointsInfoCache[index];
    if (useCache && cache) {
      const originalStartAndMiddlePoints = cache.startAndMiddlePoints;
      const restLength = length - cache.excludeLastLength;
      let endPoint;

      // two conditions

      // start and middle points are the same, end point is in the same line
      // we can only compute the end point

      // middle points should push one other point, end point is in another line
      // we should update the middle points and compute the end point
      const realRestLength = restLength * pointsInfo.totalBorderLength;
      if (realRestLength <= pointsInfo.stepsLength[cache.pointIndexBeforeEndPoint]) {
        endPoint = this.getPointPosByBehindKnownPointAndRestLength(
          cache.pointIndexBeforeEndPoint,
          realRestLength
        );

        this.pointsInfoCache[index] = {
          ...cache,
          totalLength: length
        };
      } else {
        const nextPointIndex = (cache.pointIndexBeforeEndPoint + 1) % points.length;
        originalStartAndMiddlePoints.push(points[nextPointIndex]);
        const finalRestLength =
          realRestLength - pointsInfo.stepsLength[cache.pointIndexBeforeEndPoint];
        endPoint = this.getPointPosByBehindKnownPointAndRestLength(nextPointIndex, finalRestLength);

        this.pointsInfoCache[index] = {
          ...cache,
          totalLength: length,
          excludeLastLength: length - finalRestLength / pointsInfo.totalBorderLength,
          pointIndexBeforeEndPoint: nextPointIndex,
          startAndMiddlePoints: originalStartAndMiddlePoints
        };
      }

      const pointsThroughLine = [...originalStartAndMiddlePoints, endPoint];
      this.drawLineThroughPoints(pointsThroughLine, false);

      return;
    }

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
    const lastPointIndex = middlePointsIndex[middlePointsIndex.length - 1] ?? startBehindPointIndex;
    const finalRestLength =
      middlePointsIndex[middlePointsIndex.length - 1] !== undefined
        ? restLength
        : restLength + this.getDistance(startPoint, points[startBehindPointIndex]);
    const endPoint = getEndPoint(lastPointIndex, finalRestLength);

    if (useCache) {
      this.pointsInfoCache[index] = {
        totalLength: length,
        excludeLastLength: length - finalRestLength / pointsInfo.totalBorderLength,
        pointIndexBeforeEndPoint: lastPointIndex,
        startAndMiddlePoints: [startPoint, ...middlePoints]
      };
    }

    this.drawLineThroughPoints([startPoint, ...middlePoints, endPoint], false);
  };

  getPointPosByBehindKnownPointAndRestLength = (beforePointIndex: number, restLength: number) => {
    const { width, height } = this.state;
    const { clipSize } = this.props;
    const point: IPos = { x: 0, y: 0 };
    const restLengthWithFactor = Math.sin(Math.PI / 4) * restLength;

    switch (beforePointIndex) {
      case 0:
        point.x = restLengthWithFactor;
        point.y = clipSize.leftTop - restLengthWithFactor;
        break;

      case 1:
        point.x = clipSize.leftTop + restLength;
        point.y = 0;
        break;

      case 2:
        point.x = width - clipSize.rightTop + restLengthWithFactor;
        point.y = restLengthWithFactor;
        break;

      case 3:
        point.x = width;
        point.y = clipSize.rightTop + restLength;
        break;

      case 4:
        point.x = width - restLengthWithFactor;
        point.y = height - clipSize.rightBottom + restLengthWithFactor;
        break;

      case 5:
        point.x = width - clipSize.rightBottom - restLength;
        point.y = height;
        break;

      case 6:
        point.x = clipSize.leftBottom - restLengthWithFactor;
        point.y = height - restLengthWithFactor;
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

    this.canvasRef.current.addEventListener('mouseenter', this.mouseEnterHandler);
  };

  mouseEnterHandler = () => {
    if (this.mouseLeaveTween?.isPlaying) this.mouseLeaveTween.pause();

    window.requestAnimationFrame(this.draw);
    this.shouldStopAnimation = false;

    const to: IClipSize = {
      leftTop: 0,
      rightTop: 0,
      rightBottom: 0,
      leftBottom: 0
    };
    const { hoverAnimationConfig } = this.props;

    this.mouseEnterTween = new TWEEN.Tween({ ...this.dynamicClipSize })
      .to(to, hoverAnimationConfig.duration)
      .easing(hoverAnimationConfig.timingFunction)
      .onUpdate(curClipSize => (this.dynamicClipSize = curClipSize))
      .start();
  };

  recoverClipSizeWhenMouseLeave = () => {
    if (!this.canvasRef.current) return;

    this.canvasRef.current.addEventListener('mouseleave', this.mouseLeaveHandler);
  };

  mouseLeaveHandler = () => {
    if (this.mouseEnterTween?.isPlaying) this.mouseEnterTween.pause();

    const { clipSize, hoverAnimationConfig } = this.props;

    this.mouseLeaveTween = new TWEEN.Tween({ ...this.dynamicClipSize })
      .to(clipSize, hoverAnimationConfig.duration)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(curClipSize => (this.dynamicClipSize = curClipSize))
      .onComplete(() => (this.shouldStopAnimation = true))
      .start();
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
