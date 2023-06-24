'use client';

import { useState, useEffect } from 'react';
import Dropdown from 'react-dropdown';
import { CHARACTERS, WEAPONS, ROOMS } from '@/constants';
import { useRouter } from 'next/navigation';

function CharactersTable({ data, players }) {
	if (!data) return null;
	return (
		<>
			{CHARACTERS.map((character, idx) => (
				<tr key={character}>
					<th
						className="sticky left-0 p-1 text-right bg-bg"
						scope="row"
					>
						{character}
					</th>
					{players.map((player) => (
						<td
							key={character + player}
							className={`p-1 text-center ${
								idx % 2
									? 'odd:bg-[#222] even:bg-[#111]'
									: 'even:bg-[#222] odd:bg-[#111]'
							}`}
						>
							{data[player][character]}
						</td>
					))}
				</tr>
			))}
		</>
	);
}
function RoomsTable({ data, players }) {
	if (!data) return null;
	return (
		<>
			{ROOMS.map((room, idx) => (
				<tr key={room}>
					<th
						className="sticky left-0 p-1 text-right bg-bg"
						scope="row"
					>
						{room}
					</th>
					{players.map((player) => (
						<td
							key={room + player}
							className={`p-1 text-center ${
								idx % 2
									? 'odd:bg-[#222] even:bg-[#111]'
									: 'even:bg-[#222] odd:bg-[#111]'
							}`}
						>
							{data[player][room]}
						</td>
					))}
				</tr>
			))}
		</>
	);
}
function WeaponsTable({ data, players }) {
	if (!data) return null;
	return (
		<>
			{WEAPONS.map((weapon, idx) => (
				<tr key={weapon} className="">
					<th
						className="sticky left-0 p-1 text-right bg-bg"
						scope="row"
					>
						{weapon}
					</th>
					{players.map((player) => (
						<td
							key={weapon + player}
							className={`p-1 text-center ${
								idx % 2
									? 'odd:bg-[#222] even:bg-[#111]'
									: 'even:bg-[#222] odd:bg-[#111]'
							}`}
						>
							{data[player][weapon]}
						</td>
					))}
				</tr>
			))}
		</>
	);
}

function LogTable({ logs }) {
	return (
		<table className="mx-auto">
			<thead>
				<tr>
					{[
						'Suggester',
						'Character',
						'Room',
						'Weapon',
						'Responder',
						'Revealed card',
					].map((val) => (
						<th key={val} className="p-1 border border-border">
							{val}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{logs.map((logEntry) => (
					<tr key={logEntry.id}>
						<td className="p-1 border border-border">
							{logEntry.suggester}
						</td>
						<td className="p-1 border border-border">
							{logEntry.suggestion.character}
						</td>
						<td className="p-1 border border-border">
							{logEntry.suggestion.room}
						</td>
						<td className="p-1 border border-border">
							{logEntry.suggestion.weapon}
						</td>
						<td className="p-1 border border-border">
							{logEntry.responder}
						</td>
						<td className="p-1 border border-border">
							{logEntry.revealedCard}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
export default function GamePage({ params: { id: sessionId } }) {
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [players, setPlayers] = useState([]);
	const [suggester, setSuggester] = useState('');
	const [character, setCharacter] = useState('');
	const [room, setRoom] = useState('');
	const [weapon, setWeapon] = useState('');
	const [responder, setResponder] = useState('');
	const [revealedCard, setRevealedCard] = useState('');
	const [tableData, setTableData] = useState({});
	const [log, setLog] = useState([]);

	useEffect(() => {
		fetch(`http://localhost:8080/${sessionId}/playerList`, {
			method: 'GET',
		})
			.then((resp) => resp.json())
			.then((list) => {
				if (list?.length) {
					setPlayers(list);
				} else {
					throw new Error('old session');
				}
			})
			.catch(() => {
				localStorage.removeItem('sessionId');
				router.push('/');
			});
		fetch(`http://localhost:8080/${sessionId}/logs`)
			.then((res) => res.json())
			.then((list) => {
				if (list?.length) {
					setLog(list);
				}
			});
	}, [sessionId, router]);

	useEffect(() => {
		fetch(`http://localhost:8080/${sessionId}/sourceOfTruth`)
			.then((resp) => resp.json())
			.then((data) => {
				setTableData(data);
			});
	}, [sessionId, log]);

	const handleSubmit = () => {
		fetch(`http://localhost:8080/${sessionId}/addLogEntry`, {
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
				setDialogOpen(false);
			});
	};

	return (
		<main className="w-full overflow-auto">
			<dialog
				open={dialogOpen}
				className="z-30 w-full h-full py-0 mt-10 text-white bg-transparent"
			>
				<section className="relative p-4 flex flex-col m-auto items-center gap-4 max-w-2xl bg-[#222]/80 backdrop-blur-lg rounded-lg border border-[#fff]/50">
					<button
						className="self-end"
						onClick={() => setDialogOpen(false)}
					>
						&#10005;
					</button>
					<div className="w-full">
						<Dropdown
							options={players}
							onChange={({ value }) => setSuggester(value)}
							value={suggester}
							placeholder="Select player asking question"
							className="relative w-full px-2 border rounded-md border-border"
							placeholderClassName="text-[#aaa]"
							menuClassName="absolute top-7 bg-[#222] w-full border border-border rounded-md left-0 z-10 divide-y divide-[#aaa] [&>*]:px-2 py-1"
						/>
					</div>
					<div className="w-full">
						<Dropdown
							options={CHARACTERS}
							onChange={({ value }) => setCharacter(value)}
							value={character}
							placeholder="Select character"
							className="relative w-full px-2 border rounded-md border-border"
							placeholderClassName="text-[#aaa]"
							menuClassName="absolute top-7 bg-[#222] w-full border border-border rounded-md left-0 z-10 divide-y divide-[#aaa] [&>*]:px-2 py-1"
						/>
					</div>
					<div className="w-full">
						<Dropdown
							options={ROOMS}
							onChange={({ value }) => setRoom(value)}
							value={room}
							placeholder="Select room"
							className="relative w-full px-2 border rounded-md border-border"
							placeholderClassName="text-[#aaa]"
							menuClassName="absolute top-7 bg-[#222] w-full border border-border rounded-md left-0 z-10 divide-y divide-[#aaa] [&>*]:px-2 py-1"
						/>
					</div>
					<div className="w-full">
						<Dropdown
							options={WEAPONS}
							onChange={({ value }) => setWeapon(value)}
							value={weapon}
							placeholder="Select weapon"
							className="relative w-full px-2 border rounded-md border-border"
							placeholderClassName="text-[#aaa]"
							menuClassName="absolute top-7 bg-[#222] w-full border border-border rounded-md left-0 z-10 divide-y divide-[#aaa] [&>*]:px-2 py-1"
						/>
					</div>
					<div className="w-full">
						<Dropdown
							options={players}
							onChange={({ value }) => setResponder(value)}
							value={responder}
							placeholder="Select responder"
							className="relative w-full px-2 border rounded-md border-border"
							placeholderClassName="text-[#aaa]"
							menuClassName="absolute top-7 bg-[#222] w-full border border-border rounded-md left-0 z-10 divide-y divide-[#aaa] [&>*]:px-2 py-1"
						/>
					</div>
					<div className="w-full">
						<Dropdown
							options={[...CHARACTERS, ...ROOMS, ...WEAPONS]}
							onChange={({ value }) => setRevealedCard(value)}
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
			<div className="flex justify-center mt-10">
				<button
					onClick={() => setDialogOpen(true)}
					className="px-4 py-1 bg-white rounded-lg text-bg"
				>
					Enter data
				</button>
			</div>
			<table className="relative mx-auto mt-10">
				<thead className="sticky top-0">
					<tr className="bg-bg">
						<th className="bg-bg"></th>
						{players.map((player) => (
							<th key={player} className="px-3 py-1 bg-bg">
								{player}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="">
					<tr className="">
						<th
							className="sticky top-[31px] px-1 pt-4 pb-1 bg-bg"
							colSpan={players?.length + 1}
						>
							Characters
						</th>
					</tr>
					<CharactersTable
						data={tableData.characterMap}
						players={players}
					/>
					<tr className="">
						<th
							className="sticky top-[31px] px-1 pt-4 pb-1 bg-bg"
							colSpan={players?.length + 1}
						>
							Rooms
						</th>
					</tr>
					<RoomsTable data={tableData.roomMap} players={players} />
					<tr className="">
						<th
							className="sticky top-[31px] px-1 pt-4 pb-1 bg-bg"
							colSpan={players?.length + 1}
						>
							Weapons
						</th>
					</tr>
					<WeaponsTable
						data={tableData.weaponMap}
						players={players}
					/>
				</tbody>
			</table>
			<section className="mx-auto mt-10">
				<LogTable logs={log} />
			</section>
		</main>
	);
}
