import { api } from "../config/index";

export const lucesService = () => {
    const luzAltaEncenderAPI = async (url) => {
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=/LuzAlta/Prender`,
        //   datos
        // );
        const resp = {
            status: 200,
            message: 'Datos enviados correctamente - luzAltaEncenderAPI'
        };
        return resp;
    };

    const luzAltaApagarAPI = async (url) => {
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=/LuzAlta/Apagar`,
        //   datos
        // );
        const resp = {
            status: 200,
            message: 'Datos enviados correctamente - luzAltaApagarAPI'
        };
        return resp;
    };

    const luzBajaEncenderAPI = async (url) => {
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=/LuzBaja/Prender`,
        //   datos
        // );
        const resp = {
            status: 200,
            message: 'Datos enviados correctamente - luzBajaEncenderAPI'
        };
        return resp;
    };

    const luzBajaApagarAPI = async (url) => {
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=/LuzBaja/Apagar`,
        //   datos
        // );
        const resp = {
            status: 200,
            message: 'Datos enviados correctamente - luzBajaApagarAPI'
        };
        return resp;
    };

    const LuzInteriorEncenderAPI = async (url) => {
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=/LuzInterior/Prender`,
        //   datos
        // );
        const resp = {
            status: 200,
            message: 'Datos enviados correctamente - LuzInteriorEncenderAPI'
        };
        return resp;
    };

    const LuzInteriorApagarAPI = async (url) => {
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=/LuzInterior/Apagar`,
        //   datos
        // );
        const resp = {
            status: 200,
            message: 'Datos enviados correctamente - LuzInteriorApagarAPI'
        };
        return resp;
    };

    const reflectorEncenderAPI = async (url) => {
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=/ReflectorLed/Prender`,
        //   datos
        // );
        const resp = {
            status: 200,
            message: 'Datos enviados correctamente - reflectorEncenderAPI'
        };
        return resp;
    };

    const reflectorApagarAPI = async (url) => {
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=/ReflectorLed/Apagar`,
        //   datos
        // );
        const resp = {
            status: 200,
            message: 'Datos enviados correctamente - reflectorApagarAPI'
        };
        return resp;
    };

    const balizasEncenderAPI = async (url) => {
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=/Baliza/Prender`,
        //   datos
        // );
        const resp = {
            status: 200,
            message: 'Datos enviados correctamente - reflectorEncenderAPI'
        };
        return resp;
    };

    const balizasApagarAPI = async (url) => {
        console.log('enviando datos al back')
        // const resp = await api.post(
        //   `http://localhost:5166/api/Event/Publish?source=/Baliza/Apagar`,
        //   datos
        // );
        const resp = {
            status: 200,
            message: 'Datos enviados correctamente - reflectorApagarAPI'
        };
        return resp;
    };

    // const luzGiroPrenderAPI = async (url) => {
    //     console.log('enviando datos al back')
    //     // const resp = await api.post(
    //     //   `http://localhost:5166/api/Event/Publish?source=/Baliza/Apagar`,
    //     //   datos
    //     // );
    //     const resp = {
    //         status: 200,
    //         message: 'Datos enviados correctamente - reflectorApagarAPI'
    //     };
    //     return resp;
    // };

    // const luzGiroApagarAPI = async (url) => {
    //     console.log('enviando datos al back')
    //     // const resp = await api.post(
    //     //   `http://localhost:5166/api/Event/Publish?source=/Baliza/Apagar`,
    //     //   datos
    //     // );
    //     const resp = {
    //         status: 200,
    //         message: 'Datos enviados correctamente - reflectorApagarAPI'
    //     };
    //     return resp;
    // };

    return {
        luzAltaEncenderAPI,
        luzAltaApagarAPI,
        luzBajaEncenderAPI,
        luzBajaApagarAPI,
        LuzInteriorEncenderAPI,
        LuzInteriorApagarAPI,
        reflectorEncenderAPI,
        reflectorApagarAPI,
        balizasEncenderAPI,
        balizasApagarAPI
    }
};
