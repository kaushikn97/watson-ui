"use client";

import { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import Table from "react-bootstrap/Table";

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

function CharactersTable({ data, players }) {
  if (!data) return null;
  return (
    <Table>
      <tbody>
        {CHARACTERS.map((character) => (
          <tr key={character}>
            <td>{character}</td>
            {players.map((player) => (
              <td key={character + player}>{data[player][character]}</td>
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
              <td key={weapon + player}>{data[player][weapon]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function LogTable(data) {
  console.log(data.data);
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
export default function GamePage({ params: { id } }) {
  const [players, setPlayers] = useState([]);
  const [suggester, setSuggester] = useState("");
  const [character, setCharacter] = useState("");
  const [room, setRoom] = useState("");
  const [weapon, setWeapon] = useState("");
  const [responder, setResponder] = useState("");
  const [revealedCard, setRevealedCard] = useState("");
  const [tableData, setTableData] = useState({});
  const [log, setLog] = useState([]);
  const sessionId = id;
  useEffect(() => {
    fetch("http://localhost:8080/" + sessionId + "/playerList", {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((list) => {
        setPlayers(list);
        console.log(list);
      });
    fetch("http://localhost:8080/" + sessionId + "/sourceOfTruth", {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTableData(data);
        console.log(data);
      });
  }, [sessionId, log]);

  const selector = (setter, obj) => {
    setter(obj.value);
  };

  const handleSubmit = () => {
    fetch("http://localhost:8080/" + sessionId + "/addLogEntry", {
      method: "POST",
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
        console.log(list);
      });
  };

  return (
    <main>
      <section>
        <Dropdown
          options={players}
          onChange={(obj) => selector(setSuggester, obj)}
          value={suggester}
          placeholder="Select player asking question"
        />
        <Dropdown
          options={CHARACTERS}
          onChange={(obj) => selector(setCharacter, obj)}
          value={character}
          placeholder="Select character"
        />
        <Dropdown
          options={ROOMS}
          onChange={(obj) => selector(setRoom, obj)}
          value={room}
          placeholder="Select room"
        />
        <Dropdown
          options={WEAPONS}
          onChange={(obj) => selector(setWeapon, obj)}
          value={weapon}
          placeholder="Select weapon"
        />
        <Dropdown
          options={["", ...players]}
          onChange={(obj) => selector(setResponder, obj)}
          value={responder}
          placeholder="Select responder"
        />
        <Dropdown
          options={["", ...CHARACTERS, ...ROOMS, ...WEAPONS]}
          onChange={(obj) => selector(setRevealedCard, obj)}
          value={revealedCard}
          placeholder="Select revealed card"
        />
        <button onClick={handleSubmit}>Submit</button>
      </section>

      <section>
        <CharactersTable data={tableData.characterMap} players={players} />
        <RoomsTable data={tableData.roomMap} players={players} />
        <WeaponsTable data={tableData.weaponMap} players={players} />
      </section>

      <section>
        <LogTable data={log} />
      </section>
    </main>
  );
}
