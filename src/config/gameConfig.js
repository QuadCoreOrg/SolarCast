const GAME_CONFIG = {
  powerHub: {
    maxSlots: 9,
    initialUnlockedSlots: 1,
    initialInventory: [],
  },
  /** Simülasyon saatleri arası gerçek dünya gecikmesi; 24 saat × bu değer = bir oyun gününün süresi. */
  gameLoop: {
    msPerSimulatedHour: 1000,
    debugMsPerSimHourMin: 200,
    debugMsPerSimHourMax: 12000,
  },
}

export default GAME_CONFIG
