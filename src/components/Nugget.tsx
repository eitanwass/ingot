import type {FC} from 'react'
import {DragSourceMonitor, useDrag, useDrop, XYCoord} from 'react-dnd'
import {ItemTypes} from "./ItemTypes";
import {useMemo, useRef} from "react";
import {DragItemType, NuggetType} from '../types';

type NuggetProps = {
	id: any;
	switchNuggets: (draggedPosition: XYCoord, thisPosition: XYCoord) => void
} & NuggetType;

export const Nugget: FC<NuggetProps> = ({id, content, rect, switchNuggets}) => {
	const ref = useRef<HTMLDivElement>(null);

	const [{isDragging}, drag] = useDrag({
		type: ItemTypes.NUGGET,
		item: () => ({
			text: content,
			ref: ref.current,
			itemActualSize: [ref.current?.clientWidth || 0, ref.current?.clientHeight || 0],
			position: {x: rect.x, y: rect.y}
		}) as DragItemType,
		collect: (monitor: DragSourceMonitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const [, drop] = useDrop(() => ({
		accept: ItemTypes.NUGGET,
		hover: (item: DragItemType, monitor) => {
			if (!ref.current)
				return;

			// Don't replace item with itself
			if (rect.x === item.position.x && rect.y === item.position.y)
				return;

			switchNuggets(item.position, {x: rect.x, y: rect.y} as XYCoord);
		},
		drop: (item, monitor) => console.debug(monitor.getItem().text)
	}));

	const opacity = useMemo(() => isDragging ? 0 : 1, [isDragging]);

	drop(drag(ref));

	return (
		<div ref={ref}
				 id={id}
				 style={{
					 gridColumn: rect.x + 1,
					 gridRow: rect.y + 1,
					 width: `${rect.width}em`,
					 height: `${rect.height}em`,
					 cursor: 'move',
					 border: "black 1px solid",
					 opacity
				 }}>
			{content}
		</div>
	)
}
