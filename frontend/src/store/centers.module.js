import { centerService } from '../services';
import { resourceModule } from './resource.module';

const base = resourceModule(centerService, 'Center');

// Centers also hold the currently selected center (filter in the top bar)
export const centers = {
  ...base,
  state: () => ({ ...base.state(), current: null }),
  mutations: {
    ...base.mutations,
    setCurrent(state, center) { state.current = center; },
  },
};
