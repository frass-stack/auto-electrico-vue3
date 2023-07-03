import { api } from "../config/index";

export const cocheService = () => {
    const abrirPuertasAPI = async (datos) => {
        // console.log(datos);
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   'http://localhost:5166/api/Event/Publish?source=/Puertas/Abrir',
        //   datos
        // );
        const resp = {
          status: 200,
          message: 'Datos enviados correctamente'
        };
        return resp;
    };

    const cerrarPuertasAPI = async (datos) => {
        // console.log(datos);
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   'http://localhost:5166/api/Event/Publish?source=/Puertas/Cerrar',
        //   datos
        // );
        const resp = {
          status: 200,
          message: 'Datos enviados correctamente'
        };
        return resp;
    };

    return {
        abrirPuertasAPI,
        cerrarPuertasAPI,
    }
};
