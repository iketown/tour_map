import type { LineString } from "@turf/turf";
import {
  lineString,
  lineDistance,
  midpoint,
  destination,
  bearing,
  lineArc,
  distance,
  projection,
  bezier,
} from "@turf/turf";

export const getMyArcRoute = (
  start: number[],
  finish: number[],
  curveSide: number = 1,
  centerSpot: number = 0.5
) => {
  const bear = bearing(start, finish);
  const straightLine = lineString([start, finish]);
  const halfWayPoint = midpoint(start, finish);
  const lineD = lineDistance(straightLine);
  const midP = destination(start, lineD * centerSpot, bear + curveSide * 20);
  let route = lineString([start, midP.geometry.coordinates, finish]);
  return bezier(route);
};
