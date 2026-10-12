import { createStore } from "vuex";
import { authentication } from './authentication.module';
import { centers } from './centers.module';
import { resourceModule } from './resource.module';
import { userService, serviceService, collaboratorService } from '../services';

const store = createStore({
  modules: {
    authentication,
    centers,
    users: resourceModule(userService, 'Client'),
    services: resourceModule(serviceService, 'Service'),
    collaborators: resourceModule(collaboratorService, 'Employee'),
  },
});

export default store;
