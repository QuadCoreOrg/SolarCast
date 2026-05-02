const RESEARCH_UPGRADES = {
  panel: [
    {
      key: 'temperedThermalGlass',
      name: 'Temperli Termal Cam',
      requiredLevel: 3,
      benefit: 'Panel dayanıklılığı artar, üretim verimi yükselir.',
    },
    {
      key: 'enrichedWafer',
      name: 'Zenginleştirilmiş Wafer',
      requiredLevel: 5,
      benefit: 'Yüksek saflıkta wafer ile panel çıktısı belirgin artar.',
    },
  ],
  battery: [
    {
      key: 'processedCobalt',
      name: 'İşlenmiş Kobalt',
      requiredLevel: 3,
      benefit: 'Batarya çevrim stabilitesi ve kapasite kullanım oranı artar.',
    },
    {
      key: 'superconductivePolymer',
      name: 'Süperiletken Polimer',
      requiredLevel: 5,
      benefit: 'Kayıp enerji azalır, depolama verimi üst seviyeye çıkar.',
    },
  ],
}

export default RESEARCH_UPGRADES
