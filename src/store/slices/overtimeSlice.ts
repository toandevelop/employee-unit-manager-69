
import { StateCreator } from 'zustand';
import { 
  OvertimeTypeState, 
  OvertimeTypeActions, 
  createOvertimeTypeActions 
} from './overtime/overtimeTypeActions';
import { 
  OvertimeState, 
  OvertimeActions, 
  createOvertimeActions 
} from './overtime/overtimeActions';
import { initialOvertimeTypes, initialOvertimes } from '@/data/overtimeData';

export interface OvertimeSliceState extends OvertimeTypeState, OvertimeState {}
export interface OvertimeSliceActions extends OvertimeTypeActions, OvertimeActions {}
export type OvertimeSlice = OvertimeSliceState & OvertimeSliceActions;

export const createOvertimeSlice: StateCreator<OvertimeSlice> = (set) => ({
  // Initial state
  overtimeTypes: initialOvertimeTypes,
  overtimes: initialOvertimes,
  
  // Combine actions
  ...createOvertimeTypeActions(set),
  ...createOvertimeActions(set)
});
