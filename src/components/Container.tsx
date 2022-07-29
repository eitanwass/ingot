import type {FC} from 'react'
import {useCallback, useRef, useState} from 'react'

import _ from "lodash";

import {Nugget} from './Nugget'
import {useDrop} from "react-dnd";
import {ItemTypes} from "./ItemTypes";
import {DragItemType, NuggetType} from "../types";

export const Container: FC = () => {
	const ref = useRef<HTMLDivElement>(null);

	const [nuggets, setNuggets] = useState<NuggetType[]>([
		{
			content: 'Write a cool JS library',
			rect: {
				x: 0,
				y: 0,
				width: 5,
				height: 5
			}
		},
		{
			content: 'Make it generic enough',
			rect: {
				x: 0,
				y: 1,
				width: 5,
				height: 5
			}
		},
		{
			content: 'Write README',
			rect: {
				x: 0,
				y: 2,
				width: 5,
				height: 5
			}
		},
		{
			content: 'Create some examples',
			rect: {
				x: 1,
				y: 0,
				width: 5,
				height: 5
			}
		},
		{
			content: '???',
			rect: {
				x: 2,
				y: 0,
				width: 5,
				height: 5
			}
		},
		{
			content: 'PROFIT',
			rect: {
				x: 1,
				y: 1,
				width: 5,
				height: 5
			}
		},
	]);

	const getGridSize = () =>
		ref.current ? parseFloat(getComputedStyle(ref.current as HTMLDivElement).fontSize) : -1;

	const [, drop] = useDrop(() => ({
		accept: ItemTypes.NUGGET,
		hover: (item: DragItemType, monitor) => {
			// console.debug(item);
			// console.debug(getGridSize());
			// console.debug(`item gridSize is: ${item.itemActualSize[0] / getGridSize()}`);
			// console.debug(monitor.getClientOffset());
		}
	}));

	const renderNugget = useCallback(
		(nugget: NuggetType, index: number) => {
			return (
				<Nugget
					key={index}
					id={index}
					switchNuggets={(source, target) => {
						console.debug(`${source.x}, ${source.y} <-> ${target.x}, ${target.y}`);
						setNuggets((nuggets) =>
							_.map(nuggets, (nugget) => ({
								content: nugget.content,
								rect: {
									...nugget.rect,
									...(
										(nugget.rect.x === source.x && nugget.rect.y === source.y) ?
										{ x: target.x, y: target.y} : (
											(nugget.rect.x === target.x && nugget.rect.y === target.y) ?
											{x: source.x, y: source.y} : {}
										)
									)
								}
							}))
						);
					}}
					{...nugget}
				/>
			)
		},
		[],
	)

	drop(ref);

	return (
		<>
			<div ref={ref} style={{
				width: 400,
				display: "grid",
				gridTemplateColumns: `repeat(${_.maxBy(nuggets, "rect.x")?.rect.x || 0}, max-content)`,
				gridTemplateRows: `repeat(${_.maxBy(nuggets, "rect.y")?.rect.y || 0}, max-content)`,
				columnGap: "2px",
				rowGap: "2px",
			}}>
				{nuggets.map((nugget, index) => renderNugget(nugget, index))}
			</div>
		</>
	)
}
