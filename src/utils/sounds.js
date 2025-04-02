// Sonidos del vehículo
const hornSound = new Audio('/sounds/automobile-horn-153260.mp3')
const engineStartSound = new Audio('/sounds/car-starting-and-accelerating-7110.mp3')
const engineIdleSound = new Audio('/sounds/car-engine-revving-94831.mp3')
const engineAccelerateSound = new Audio('/sounds/engine-accelerate.mp3')
const engineDecelerateSound = new Audio('/sounds/engine-decelerate.mp3')

// Configuración de los sonidos
hornSound.volume = 0.5
engineStartSound.volume = 0.3
engineIdleSound.volume = 0.2
engineAccelerateSound.volume = 0.3
engineDecelerateSound.volume = 0.3

// Estado del motor
let engineSoundInterval = null
let currentRPM = 0
let lastRPM = 0

export const playHorn = () => {
  hornSound.currentTime = 0
  hornSound.play()
}

export const startEngineSound = () => {
  // Detener cualquier sonido previo
  stopEngineSound()
  
  // Reproducir sonido de arranque
  engineStartSound.currentTime = 0
  engineStartSound.play()
  
  // Cuando termine el arranque, iniciar el sonido de ralentí
  engineStartSound.onended = () => {
    engineIdleSound.loop = true
    engineIdleSound.currentTime = 0
    engineIdleSound.play()
  }
}

export const stopEngineSound = () => {
  // Detener todos los sonidos
  engineStartSound.pause()
  engineStartSound.currentTime = 0
  
  engineIdleSound.pause()
  engineIdleSound.currentTime = 0
  
  engineAccelerateSound.pause()
  engineAccelerateSound.currentTime = 0
  
  engineDecelerateSound.pause()
  engineDecelerateSound.currentTime = 0
}

export const updateEngineSound = (rpm) => {
  if (rpm === currentRPM) return
  
  lastRPM = currentRPM
  currentRPM = rpm
  
  // Determinar si estamos acelerando o desacelerando
  const isAccelerating = currentRPM > lastRPM
  
  if (rpm > 2000) {
    // Motor acelerando/desacelerando a altas RPM
    engineIdleSound.pause()
    
    if (isAccelerating) {
      engineDecelerateSound.pause()
      engineAccelerateSound.currentTime = 0
      engineAccelerateSound.play()
    } else {
      engineAccelerateSound.pause()
      engineDecelerateSound.currentTime = 0
      engineDecelerateSound.play()
    }
    
    // Ajustar el pitch según las RPM
    const pitch = 1 + (rpm - 2000) / 4000
    if (isAccelerating) {
      engineAccelerateSound.playbackRate = pitch
    } else {
      engineDecelerateSound.playbackRate = pitch
    }
  } else {
    // Motor en ralentí
    engineAccelerateSound.pause()
    engineDecelerateSound.pause()
    
    if (!engineIdleSound.paused) return
    
    engineIdleSound.currentTime = 0
    engineIdleSound.play()
  }
} 