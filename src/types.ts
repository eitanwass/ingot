import {XYCoord} from "react-dnd";

export type rect = {
	width: number;
	height: number;
} & XYCoord;

export type NuggetType = {
	content: string;
	rect: rect;
};

export type DragItemType = {
	text: string;
	ref: HTMLDivElement;
	itemActualSize: [number, number];
	position: XYCoord;
};
