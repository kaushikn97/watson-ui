'use client';

import { useState, useEffect } from 'react';
import Dropdown from 'react-dropdown';
import Table from 'react-bootstrap/Table';
import { CHARACTERS, WEAPONS, ROOMS } from '@/constants';
import Multiselect from 'multiselect-react-dropdown';

function CharactersTable({ data, players }) {
	if (!data) return null;
	return (
		<Table>
			<tbody>
				{CHARACTERS.map((character) => (
					<tr key={character}>
						<td>{character}</td>
						{players.map((player) => (
							<td key={character + player}>
								{data[player][character]}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</Table>
	);
}
function RoomsTable({ data, players }) {
	if (!data) return null;
	return (
		<Table>
			<tbody>
				{ROOMS.map((room) => (
					<tr key={room}>
						<td>{room}</td>
						{players.map((player) => (
							<td key={room + player}>{data[player][room]}</td>
						))}
					</tr>
				))}
			</tbody>
		</Table>
	);
}
function WeaponsTable({ data, players }) {
	if (!data) return null;
	return (
		<Table>
			<tbody>
				{WEAPONS.map((weapon) => (
					<tr key={weapon}>
						<td>{weapon}</td>
						{players.map((player) => (
							<td key={weapon + player}>
								{data[player][weapon]}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</Table>
	);
}

function LogTable(data) {
	// console.log(data.data);
	if (!data) return null;
	return (
		<Table>
			<tbody>
				{data.data.map((logEntry) => (
					<tr key={logEntry.id}>
						<td>{logEntry.suggester}</td>
						<td>{logEntry.suggestion.character}</td>
						<td>{logEntry.suggestion.room}</td>
						<td>{logEntry.suggestion.weapon}</td>
						<td>{logEntry.responder}</td>
						<td>{logEntry.revealedCard}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
export default function GamePage({ params: { id: sessionId } }) {
	const [dialogOpen, setDialogOpen] = useState(true);
	const [players, setPlayers] = useState([]);
	const [suggester, setSuggester] = useState('');
	const [character, setCharacter] = useState('');
	const [room, setRoom] = useState('');
	const [weapon, setWeapon] = useState('');
	const [responder, setResponder] = useState('');
	const [responders, setResponders] = useState([]);
	const [revealedCard, setRevealedCard] = useState('');
	const [tableData, setTableData] = useState({});
	const [log, setLog] = useState([]);
	useEffect(() => {
		fetch('http://localhost:8080/' + sessionId + '/playerList', {
			method: 'GET',
		})
			.then((resp) => resp.json())
			.then((list) => {
				setPlayers(list);
				// console.log(list);
			});
		fetch('http://localhost:8080/' + sessionId + '/sourceOfTruth', {
			method: 'GET',
		})
			.then((resp) => resp.json())
			.then((data) => {
				setTableData(data);
				// console.log(data);
			});
	}, [sessionId, log]);

	const selector = (setter, obj) => {
		setter(obj.value);
	};
	console.log('responders:', responders);

	const handleSubmit = () => {
		fetch('http://localhost:8080/' + sessionId + '/addLogEntry', {
			method: 'POST',
			body: JSON.stringify({
				logEntry: {
					suggester,
					suggestion: {
						character,
						room,
						weapon,
					},
					responder,
					revealedCard,
				},
			}),
		})
			.then((resp) => resp.json())
			.then((list) => {
				setLog(list);
				// console.log(list);
			});
	};

	return (
		<main>
			<dialog
				open={dialogOpen}
				className="w-full py-0 text-white bg-transparent"
			>
				<section className="relative p-4 flex flex-col mx-auto items-center gap-4 max-w-2xl bg-[#222]/10 backdrop-blur-lg rounded-lg border border-[#fff]/50">
					<button
						className="absolute top-2 right-4"
						onClick={() => setDialogOpen(false)}
					>
						&#10005;
					</button>
					<div className="">
						<Dropdown
							options={players}
							onChange={(obj) => selector(setSuggester, obj)}
							value={suggester}
							placeholder="Select player asking question"
							className="relative w-full px-2 border rounded-md border-border"
							placeholderClassName="text-[#aaa]"
							menuClassName="absolute top-7 bg-[#222] w-full border border-border rounded-md left-0 z-10 divide-y divide-[#aaa] [&>*]:px-2 py-1"
						/>
					</div>
					<div className="flex flex-col items-center w-full gap-4 justify-evenly md:flex-row">
						<div className="w-max">
							<Dropdown
								options={CHARACTERS}
								onChange={(obj) => selector(setCharacter, obj)}
								value={character}
								placeholder="Select character"
								className="relative w-full px-2 border rounded-md border-border"
								placeholderClassName="text-[#aaa]"
								menuClassName="absolute top-7 bg-[#222] w-full border border-border rounded-md left-0 z-10 divide-y divide-[#aaa] [&>*]:px-2 py-1"
							/>
						</div>
						<div className="w-max">
							<Dropdown
								options={ROOMS}
								onChange={(obj) => selector(setRoom, obj)}
								value={room}
								placeholder="Select room"
								className="relative w-full px-2 border rounded-md border-border"
								placeholderClassName="text-[#aaa]"
								menuClassName="absolute top-7 bg-[#222] w-full border border-border rounded-md left-0 z-10 divide-y divide-[#aaa] [&>*]:px-2 py-1"
							/>
						</div>
						<div className="w-max">
							<Dropdown
								options={WEAPONS}
								onChange={(obj) => selector(setWeapon, obj)}
								value={weapon}
								placeholder="Select weapon"
								className="relative w-full px-2 border rounded-md border-border"
								placeholderClassName="text-[#aaa]"
								menuClassName="absolute top-7 bg-[#222] w-full border border-border rounded-md left-0 z-10 divide-y divide-[#aaa] [&>*]:px-2 py-1"
							/>
						</div>
					</div>
					<div className="">
						<Multiselect
							options={players}
							avoidHighlightFirstOption
							selectedValues={responders}
							placeholder="Select responder"
							isObject={false}
							onSelect={(val) => setResponders(val)}
							onRemove={(val) => setResponders(val)}
							style={{
								chips: {
									backgroundColor: '#222',
									border: '1px solid white',
								},
								optionContainer: {
									backgroundColor: '#111',
								},
								option: {
									color: 'white',
								},
							}}
						/>
					</div>
					<div className="">
						<Dropdown
							options={[...CHARACTERS, ...ROOMS, ...WEAPONS]}
							onChange={(obj) => selector(setRevealedCard, obj)}
							value={revealedCard}
							placeholder="Select revealed card"
							className="relative w-full px-2 border rounded-md border-border"
							placeholderClassName="text-[#aaa]"
							menuClassName="absolute top-7 bg-[#222] w-full border border-border rounded-md left-0 z-10 divide-y divide-[#aaa] [&>*]:px-2 py-1"
						/>
					</div>
					<button
						onClick={handleSubmit}
						className="px-4 py-1 bg-white rounded-lg text-bg"
					>
						Submit
					</button>
				</section>
			</dialog>
			<button onClick={() => setDialogOpen(true)}>Enter data</button>

			<section className="flex flex-col gap-10">
				<CharactersTable
					data={tableData.characterMap}
					players={players}
				/>
				<RoomsTable data={tableData.roomMap} players={players} />
				<WeaponsTable data={tableData.weaponMap} players={players} />
			</section>

			<section>
				<LogTable data={log} />
			</section>
		</main>
	);
}
