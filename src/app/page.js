"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Select from "react-select";

const CHARACTERS = [
  "plum",
  "mustard",
  "orchid",
  "scarlett",
  "green",
  "peacock",
];
const ROOMS = [
  "kitchen",
  "dining",
  "hall",
  "conservatory",
  "study",
  "billiards",
  "library",
  "lounge",
];

const WEAPONS = ["rope", "pipe", "revolver", "dagger", "candlestick", "wrench"];

const AllOptions = [
  { value: "plum", label: "plum" },
  { value: "mustard", label: "mustard" },
  { value: "orchid", label: "orchid" },
  { value: "scarlett", label: "scarlett" },
  { value: "green", label: "green" },
  { value: "peacock", label: "peacock" },
  { value: "kitchen", label: "kitchen" },
  { value: "dining", label: "dining" },
  { value: "hall", label: "hall" },
  { value: "conservatory", label: "conservatory" },
  { value: "study", label: "study" },
  { value: "billiards", label: "billiards" },
  { value: "library", label: "library" },
  { value: "lounge", label: "lounge" },
  { value: "rope", label: "rope" },
  { value: "pipe", label: "pipe" },
  { value: "revolver", label: "revolver" },
  { value: "dagger", label: "dagger" },
  { value: "candlestick", label: "candlestick" },
  { value: "wrench", label: "wrench" },
];

export default function Home() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [userName, setUserName] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [characterCards, setCharacterCards] = useState([]);
  const [weaponCards, setWeaponCards] = useState([]);
  const [roomCards, setRoomCards] = useState([]);
  const handlePlayerAdd = () => {
    setPlayers((prevList) => [...prevList, playerName]);
    setPlayerName("");
  };

  const handleRemovePlayer = (name) => {
    setPlayers((prevList) => prevList.filter((_name) => _name !== name));
  };

  const handleCreateSession = async () => {
    // make api call and redirect;
    fetch("http://localhost:8080/createSession", {
      method: "POST",
      body: JSON.stringify({
        mainPlayer: userName,
        players: [userName, ...players],
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setSessionId(data.sessionId);
        fetch("http://localhost:8080/" + data.sessionId + "/addCards", {
          method: "POST",
          body: JSON.stringify({
            revealedCharacters: characterCards,
            revealedRooms: roomCards,
            revealedWeapons: weaponCards,
          }),
        })
          .then((resp) => resp.json())
          .then((data) => {
            router.push(`/${data.sessionId}`);
          });
      });
  };

  const handleCards = (input) => {
    setCharacterCards(() =>
      CHARACTERS.filter((i) => input.find((element) => element.value == i))
    );
    setRoomCards(() =>
      ROOMS.filter((i) => input.find((element) => element.value == i))
    );
    setWeaponCards(() =>
      WEAPONS.filter((i) => input.find((element) => element.value == i))
    );
  };

  return (
    <main>
      <input
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        placeholder="Enter session ID here"
      />
      <button onClick={() => router.push(`/${sessionId}`)}>Join session</button>
      <p>--OR--</p>
      <label>Your name</label>
      <input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter your name here"
      />
      {players.map((name) => (
        <div key={name}>
          <p>{name}</p>
          <button onClick={() => handleRemovePlayer(name)}>x</button>
        </div>
      ))}
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
      />
      <button onClick={handlePlayerAdd}>Add player</button>
      <Select
        closeMenuOnSelect={false}
        isMulti
        options={AllOptions}
        onChange={handleCards}
      ></Select>
      <button onClick={handleCreateSession}>Start session</button>
    </main>
  );
}
