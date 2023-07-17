import { useState } from 'react';
import { useForm} from 'react-hook-form';

import { Button, FormControl, FormLabel, Select, Stack, MenuItem,  TextField } from '@mui/material';

import { roomTypes } from '../data/room_types';


function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

function getEncounterFound(threat: number): string { 
  const roll = rollDie(6) + rollDie(6) + rollDie(6);
  if (roll <= 3) {
    return "Minion or Civilian actually willing to help the hero."
  }
  if (roll <= 5) {
    return "Unusual foe; roll on a Bestiary chapter encounter table."
  }
  if (roll <= 8) {
    const subRoll: number = rollDie(4) + threat;
    return `${subRoll} hit dice worth of foes numbering several Minions or Civilians and possibly an Elite.`
  }
    if (roll <= 12) {
      const subRoll: number = rollDie(4) + rollDie(4) + threat;
      return `${subRoll} hit dice worth of Minions and Elites.`
    }
    if (roll <= 15) {
      const subRoll = rollDie(6) + threat;
      const guardRoll = rollDie(2);
      let guard = "";
      if (guardRoll == 2) {
        guard =`, with ${threat} hit dice worth of guard beasts.`
      }
      return `${subRoll+threat} hit dice worth of Minions and Elites${guard}.`
    }
    if (roll <= 17) {
      const subRoll = rollDie(4) + rollDie(4);
      return `${subRoll} hit dice of Minions plus ${threat * 2} hit dice worth of Elites, Mages, or Boss enemies.`
    }
    const guardRoll = rollDie(2);
    const subRoll = rollDie(4) + rollDie(4) + rollDie(4);
    let guard = "";
    if (guardRoll == 2) {
        guard =`, with a guard of ${subRoll} hit dice worth of Minions, Elites, and Mages.`
    }
    return `A Boss with ${threat + 3} hit dice${guard}.`
}

export default function DungeonExplore() {
  const [room, setRoom] = useState('');
  const [roomRoll, setRoomRoll] = useState(0);
  const [encounter, setEncounter] = useState('');
  const [wanderingMonster, setWanderingMonster] = useState('');
  const [frequencyCounter, setFrequencyCounter] = useState(0);
  const [treasure, setTreasure] = useState('');
  const [hazard, setHazard] = useState('');
  const [feature, setFeature] = useState('');


  type DungeonFormInputs = {
    dungeonType: string
    monsterFrequency: string
    threat: string
  }
  const { getValues,  register  } = useForm<DungeonFormInputs>();

  const monsterFrequency: number = parseInt(getValues('monsterFrequency'));

  function getRoomType(roomRoll: number, dungeonType: string): string {
    const room = roomTypes.find(room => room.id == dungeonType)
    // eslint-disable-next-line
    return room?.rolls[roomRoll.toString() as keyof typeof roomTypes]

  }
  const rollDice = () => {
    setRoomRoll(rollDie(20));
    const encounterRoll = rollDie(10);
    const treasureRoll = rollDie(10);
    const hazardRoll = rollDie(10);
    const featureRoll = rollDie(10);

    let treasureModifier = 0;
    let hazardModifier = 0;
    let featureModifier = 0;

    const roomType = getRoomType(roomRoll, getValues('dungeonType'))

    setRoom(`You enter a room. ${roomType}`);

    if (encounterRoll >= 8) {
      const encounterFound = getEncounterFound(parseInt(getValues('threat')));
      setEncounter('You encounter a monster! ' + encounterFound);
      treasureModifier = 3;

    }
    else {
      setEncounter('');
    }

    if (treasureRoll + treasureModifier >= 10) {
      setTreasure('You find some treasure!');
    }
    else if (treasureRoll + treasureModifier >= 8) {
      setTreasure('You find some treasure, but it is hidden!');
    }
    else {
      setTreasure('');
    }

    if (encounter == '' && treasure != '') {
        hazardModifier = 3;
    }
    if (hazardRoll + hazardModifier >= 10) {
      setHazard('You encounter a hazard!');
    }
    else {
      setHazard('');
    }

    if (encounter == '' && treasure == '' && hazard == '') {
        featureModifier = 1;
    }
    if (featureRoll + featureModifier >= 9) {
      setFeature('You encounter a feature!');
    }
    else {
      setFeature('');
    }

    


    setFrequencyCounter(frequencyCounter + 1);
    if (monsterFrequency > 0 && monsterFrequency - frequencyCounter == 0) {
      if (rollDie(6) == 1) {
        setWanderingMonster('You encounter a wandering monster!');
      }
      setFrequencyCounter(0);
    }
    else {
      setWanderingMonster('');
    }
    if (monsterFrequency == 0) {
      setFrequencyCounter(0);
    }
  }


  return (
    <>
      <form>
      <Stack  spacing={2}>
        <FormControl>
          <FormLabel id="threat-label">Threat</FormLabel>
          <TextField {...register("threat")} type="number" id="threat" defaultValue={1}/>
        </FormControl>
        <FormControl>
          <FormLabel id="wandering-monster-frequency-label">Wandering Monster Frequency</FormLabel>
          <Select
          {...register("monsterFrequency")} 
    id="wandering-monster-frequency"
    labelId="wandering-monster-frequency-label"
          defaultValue={0}>
            <MenuItem value={0}>None</MenuItem>
            <MenuItem value={1}>Frequent (check every room)</MenuItem>
            <MenuItem value={3}>Uncommon (every 3 rooms)</MenuItem>
            <MenuItem value={6}>Rare (every 6 rooms)</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel id="dungeon-type-label">Dungeon Type</FormLabel>
          <Select id="dungeon-type" labelId="dungeon-type-label" 
          {...register("dungeonType")}
          defaultValue="cavern"
>
            <MenuItem value="cavern">Cavern</MenuItem>
            <MenuItem value="habitation">Habitation</MenuItem>
            <MenuItem value="fortress">Fortress</MenuItem>
            <MenuItem value="temple">Temple</MenuItem>
            <MenuItem value="academy">Academy</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      </form>
      <Button onClick={rollDice}>New Room contents</Button>
      {room && <p>{room}</p>}
      {encounter && <p>{encounter}</p>}
      {treasure && <p>{treasure}</p>}
      {hazard && <p>{hazard}</p>}
      {feature && <p>{feature}</p>}
      {wanderingMonster && <p>{wanderingMonster}</p>}
      {monsterFrequency > 0 && <p>{monsterFrequency - frequencyCounter} rooms until next frequency roll</p>}
    </>
  );
}

