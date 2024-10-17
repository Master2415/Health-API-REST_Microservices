import { database } from './connection';

async function registerMicroservice(microservice){
    try {
        await database.create(microservice);
      } catch (error) {
        console.error('Error al agregar microservicio a la base de datos:', error);
      }
}

export default {
    registerMicroservice
};
