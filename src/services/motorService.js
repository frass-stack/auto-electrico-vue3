import { api } from "../config/index";

export const motorService = () => {
    const encenderMotorAPI = async (datos) => {
        // console.log(datos);
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=${'/Vehiculo/Encender'}`,
        //   datos
        // );
        const resp = {
          status: 200,
          message: 'Datos enviados correctamente'
        };
        return resp;
    };

    return {
        encenderMotorAPI,
    }
};