// // src/app/state/selectors/skill.selectors.ts
// import { createSelector } from '@ngrx/store';
// import { SkillState } from '../reducers/skill.reducer';

// export interface AppState {
//   skill: SkillState;
// }

// export const selectSkillState = (state: AppState) => state.skill;

// export const getSelectedSkills = createSelector(
//   (state: { skill: SkillState }) => state.skill,
//   (state: SkillState) => state.selectedSkills
// );