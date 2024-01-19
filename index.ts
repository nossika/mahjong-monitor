import * as inquirer from 'inquirer';
import { autoGenerateHu } from './auto-gen-hu';
import { startOnePlayerGame } from './one-player-game';


(async () => {
  const { mode } = await inquirer.prompt([{
    type: 'list',
    message: 'select game mode',
    name: 'mode',
    choices: [
      { name: 'one player game', value: 'one-player-game' },
      { name: 'auto generate hu', value: 'auto-gen-hu' },
    ], 
  }]);

  switch (mode) {
    case 'one-player-game': {
      await startOnePlayerGame();
      break;
    }
    case 'auto-gen-hu': {
      await autoGenerateHu();
      break;
    }
  }
})();


