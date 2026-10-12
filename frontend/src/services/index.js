import { resource } from './resource';

export * from './auth.service';
export const userService = resource('users');
export const centerService = resource('centers');
export const serviceService = resource('services');
export const collaboratorService = resource('collaborator');
