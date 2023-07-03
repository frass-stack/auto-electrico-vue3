import { api } from "../config/index";

export const apiService = () => {
    const addValuesAPI = async (datos) => {
        console.log(datos);
        console.log('enviando datos al back')
        // Usar axios para enviar los datos al backend
        const resp = await api.post(
          `http://localhost:5166/api/Event/Publish?source=${'/Vehiculo/Encender'}`,
          datos
        );
        return resp; // Devolver la respuesta del backend
        // const resp = {
        //   status: 200,
        //   message: 'Datos enviados correctamente'
        // };
        // return resp; // Devolver el objeto simulado
    };

    return {
        addValuesAPI,
    }
};
