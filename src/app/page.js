'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CHARACTERS, WEAPONS, ROOMS } from '@/constants';
import Multiselect from 'multiselect-react-dropdown';

export default function Home() {
	const router = useRouter();
	const [sessionId, setSessionId] = useState(() => {
		return localStorage.sessionId || '';
	});
	const [userName, setUserName] = useState('');
	const [players, setPlayers] = useState([]);
	const [playerName, setPlayerName] = useState('');
	const [characterCards, setCharacterCards] = useState([]);
	const [weaponCards, setWeaponCards] = useState([]);
	const [roomCards, setRoomCards] = useState([]);
	const [selectedCards, setSelectedCards] = useState([]);
	const handlePlayerAdd = () => {
		setPlayers((prevList) => [...prevList, playerName]);
		setPlayerName('');
	};

	const handleRemovePlayer = (name) => {
		setPlayers((prevList) => prevList.filter((_name) => _name !== name));
	};

	const handleCreateSession = async () => {
		// make api call and redirect;
		fetch('http://localhost:8080/createSession', {
			method: 'POST',
			body: JSON.stringify({
				mainPlayer: userName,
				players: [userName, ...players],
			}),
		})
			.then((resp) => resp.json())
			.then((data) => {
				const sessionId = data.sessionId;
				localStorage.sessionId = sessionId;
				fetch(`http://localhost:8080/${sessionId}/addCards`, {
					method: 'POST',
					body: JSON.stringify({
						revealedCharacters: characterCards,
						revealedRooms: roomCards,
						revealedWeapons: weaponCards,
					}),
				})
					.then((resp) => resp.json())
					.then((data) => {
						router.push(`/${sessionId}`);
					});
			});
	};

	const addCardToList = (type, cards) => {
		switch (type) {
			case 'CHARACTERS':
				setCharacterCards(cards);
				break;
			case 'ROOMS':
				setRoomCards(cards);
				break;
			case 'WEAPONS':
				setWeaponCards(cards);
				break;
			default:
				break;
		}
	};

	const handlePlayerNameInput = (e) => {
		if (e.key === 'Enter') handlePlayerAdd();
	};

	return (
		<main className="w-full max-w-xl p-3 mt-10">
			<div className="flex flex-col items-center gap-4">
				<p className="text-2xl font-bold">Join current session</p>
				<input
					value={sessionId}
					onChange={(e) => setSessionId(e.target.value)}
					placeholder="Enter session ID here"
					className="w-full p-2 bg-transparent border rounded-lg border-border focus:outline-none"
				/>
				<button
					onClick={() => router.push(`/${sessionId}`)}
					className="px-6 py-3 rounded-lg bg-primary-active disabled:bg-primary-inactive w-max"
					disabled={!sessionId}
				>
					Join session
				</button>
			</div>
			<div className="relative w-full h-0 my-20 text-center border-t border-border">
				<div className="relative px-2 mx-auto -top-3 bg-bg w-min">
					OR
				</div>
			</div>
			<div className="flex flex-col items-center w-full gap-4 pb-20">
				<p className="text-2xl font-bold">Create a new session</p>
				<div className="w-full">
					<label className="self-start">Your name</label>
					<input
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						placeholder="Enter your name here"
						className="w-full p-2 bg-transparent border rounded-lg border-border focus:outline-none"
					/>
				</div>
				<div className="w-full">
					<p className="">Players:</p>
					<div className="flex flex-wrap gap-2 my-2">
						{players.map((name) => (
							<button
								key={name}
								className="flex justify-between gap-2 px-2 py-px my-1 rounded bg-white/10"
								onClick={() => handleRemovePlayer(name)}
							>
								<span>{name}</span>
								<span>&#10005;</span>
							</button>
						))}
					</div>
					<div className="flex w-full gap-2">
						<input
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
							onKeyDown={handlePlayerNameInput}
							placeholder="Enter player name"
							className="flex-1 p-2 bg-transparent border rounded-lg border-border focus:outline-none"
						/>
						<button
							onClick={handlePlayerAdd}
							className="px-6 py-3 rounded-lg bg-secondary-active disabled:bg-secondary-inactive w-max"
							disabled={!playerName}
						>
							Add player
						</button>
					</div>
				</div>
				<div className="w-full">
					<p>Select your cards:</p>
					<div className="flex flex-col w-full gap-2 mt-4 justify-evenly">
						<Multiselect
							options={CHARACTERS}
							value={characterCards}
							avoidHighlightFirstOption
							placeholder="Select character cards"
							isObject={false}
							onSelect={(val) => addCardToList('CHARACTERS', val)}
							onRemove={(val) => addCardToList('CHARACTERS', val)}
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
						<Multiselect
							options={WEAPONS}
							value={weaponCards}
							avoidHighlightFirstOption
							placeholder="Select weapon cards"
							isObject={false}
							onSelect={(val) => addCardToList('WEAPONS', val)}
							onRemove={(val) => addCardToList('WEAPONS', val)}
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
						<Multiselect
							options={ROOMS}
							value={roomCards}
							avoidHighlightFirstOption
							placeholder="Select room cards"
							isObject={false}
							onSelect={(val) => addCardToList('ROOMS', val)}
							onRemove={(val) => addCardToList('ROOMS', val)}
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
				</div>
				<button
					onClick={handleCreateSession}
					className="px-6 py-3 rounded-lg bg-primary-active disabled:bg-primary-inactive w-max"
					disabled={!userName || !players?.length}
				>
					Start session
				</button>
			</div>
		</main>
	);
}
