import { motorService } from '../services/motorService';
import { lucesService } from '../services/lucesService';

//Composables
import { useCoche } from './useCoche.js'
import { useLuces } from './useLuces.js'
import { useUsuario } from './useUsuario.js'
import { useMotor } from './useMotor.js'

export function useApi() { // accedemos a los composables de cada store 
    const coche = useCoche()
    const luces = useLuces()
    const usuario = useUsuario()
    const motor = useMotor()

    //Desestructuracion de los metodos del service
    const { encenderMotorAPI } = motorService();
    const { luzAltaEncenderAPI, luzAltaApagarAPI, LuzInteriorApagarAPI, LuzInteriorEncenderAPI,
        luzBajaApagarAPI, luzBajaEncenderAPI, reflectorApagarAPI, reflectorEncenderAPI,
        balizasEncenderAPI, balizasApagarAPI } = lucesService();

    // devolvemos las propiedades y funciones que queremos exponer 
    return {
        // coche 
        cinturonesDeSeguridad: coche.cinturonesDeSeguridad,
        puertas: coche.puertas,
        velocimetro: coche.velocimetro,
        odometro: coche.odometro,
        abrocharCinturones: coche.abrocharCinturones,
        abrirPuertas: coche.abrirPuertas,
        cerrarPuertas: coche.cerrarPuertas,
        acelerar: coche.acelerar,
        frenar: coche.frenar,
        resetearVelocimetro: coche.resetearVelocimetro,
        resetearOdometro: coche.resetearOdometro,
        mostrarEstadoDeCoche: coche.mostrarEstadoDeCoche,

        // luces
        lucesDeGiro: luces.lucesDeGiro,
        balizas: luces.balizas,
        lucesAltasYBajas: luces.lucesAltasYBajas,
        activarLucesDeGiro: luces.activarLucesDeGiro,
        desactivarLucesDeGiro: luces.desactivarLucesDeGiro,
        activarBalizas: luces.activarBalizas,
        desactivarBalizas: luces.desactivarBalizas,
        cambiarLucesAltasYBajas: luces.cambiarLucesAltasYBajas,
        apagarTodasLasLuces: luces.apagarTodasLasLuces,
        activarLuzInterior: luces.activarLuzInterior,
        desactivarLuzInterior: luces.desactivarLuzInterior,
        activarReflector: luces.activarReflector,
        desactivarReflector: luces.desactivarReflector,
        mostrarEstadoDeLuces: luces.mostrarEstadoDeLuces,
        //Services Luces
        luzAltaEncender: async function () {
            return await luzAltaEncenderAPI();
        },
        luzAltaApagar: async function () {
            return await luzAltaApagarAPI();
        },
        luzBajaEncender: async function () {
            return await luzBajaEncenderAPI();
        },
        luzBajaApagar: async function () {
            return await luzBajaApagarAPI();
        },
        LuzInteriorEncender: async function () {
            return await LuzInteriorEncenderAPI()
        },
        LuzInteriorApagar: async function () {
            return await LuzInteriorApagarAPI()
        },
        reflectorEncender: async function () {
            return await reflectorEncenderAPI()
        },
        reflectorApagar: async function () {
            return await reflectorApagarAPI()
        },
        balizasEncender: async function () {
            return await balizasEncenderAPI()
        },
        balizasApagar: async function () {
            return await balizasApagarAPI()
        },

        // usuario
        usuarioActual: usuario.usuarioActual,
        usuarios: usuario.usuarios,
        invitados: usuario.invitados,
        registrarUsuario: usuario.registrarUsuario,
        loguearUsuario: usuario.loguearUsuario,
        desloguearUsuario: usuario.desloguearUsuario,
        agregarInvitado: usuario.agregarInvitado,
        eliminarInvitado: usuario.eliminarInvitado,
        mostrarEstadoDeUsuario: usuario.mostrarEstadoDeUsuario,
        mostrarListaDeUsuarios: usuario.mostrarListaDeUsuarios,
        mostrarListaDeInvitados: usuario.mostrarListaDeInvitados,

        // motor
        encendido: motor.encendido,
        cargaBateria: motor.cargaBateria,
        autonomiaBateria: motor.autonomiaBateria,
        toggleEncendido: motor.toggleEncendido,
        cargarBateria: motor.cargarBateria,
        consumirBateria: motor.consumirBateria,
        resetearBateria: motor.resetearBateria,
        mostrarEstadoDeBateria: motor.mostrarEstadoDeBateria,

        // Añadir este método al objeto que se devuelve
        enviarInformacionYEncenderMotor: async function () {
            // Obtener los datos que se quieren enviar al backend
            let datos = {
                cinturonesDeSeguridad: this.cinturonesDeSeguridad,
                puertas: this.puertas,
                velocimetro: this.velocimetro,
                odometro: this.odometro,
                lucesDeGiro: this.lucesDeGiro,
                balizas: this.balizas,
                lucesAltasYBajas: this.lucesAltasYBajas,
                usuarioActual: this.usuarioActual,
                invitados: this.invitados,
                encendido: this.encendido,
                cargaBateria: this.cargaBateria,
                autonomiaBateria: this.autonomiaBateria
            };
            // Llamar al método del service que envía los datos al backend
            // y devolver la respuesta
            return encenderMotorAPI(datos);
        }
    }
}