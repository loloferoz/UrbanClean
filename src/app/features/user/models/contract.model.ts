export enum ContractCategory {
  DRIVER = 'driver',
  FOREMAN = 'foreman',
  PAWN = 'pawn',
}

export enum ContractTurn {
  MORNING = 'morning',
  EVENING = 'evening',
  NIGHT = 'night',
}

export interface Contract {
  id: number;
  start: Date | string | null;
  finish: Date | string | null;
  workingDay: number;
  contractTurn: ContractTurn | string;
  contractCategory: ContractCategory | string;
}

export const labelContractCategory = new Map<string, string>([
  [ContractCategory.DRIVER, $localize`:@@word.driver:Driver`],
  [ContractCategory.FOREMAN, $localize`:@@word.foreman:Foreman`],
  [ContractCategory.PAWN, $localize`:@@word.pawn:Pawn`],
]);

export const labelContractTurn = new Map<string, string>([
  [ContractTurn.EVENING, $localize`:@@word.evening:Evening`],
  [ContractTurn.MORNING, $localize`:@@word.morning:Morning`],
  [ContractTurn.NIGHT, $localize`:@@word.night:Night`],
]);
