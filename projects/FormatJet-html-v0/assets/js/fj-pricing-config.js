'use strict';

window.etapConfig = {
  currentEtap: 2,
  pricing: {
    pro: { monthly: 279, yearly: 204 },
    business: { monthly: 1049, yearly: 766 },
  },
  etaps: {
    1: [
      ['destek.rowFileSize', 'Dosya boyutu limiti', '50 MB', '1 GB', '5 GB'],
      ['destek.rowDaily', 'Günlük işlem sayısı', '10', 'Sınırsız', 'Sınırsız'],
      ['destek.rowOcr', 'OCR sayfa hakkı', '10 / ay', '100 / ay', '500 / ay'],
      ['destek.rowMedia', 'Video/ses dakika hakkı', '15 / ay', '90 / ay', '450 / ay'],
      ['destek.rowAiCredit', 'AI kredi', '5 / ay', '75 / ay', '375 / ay'],
      ['destek.rowBatch', 'Toplu dosya işleme', '—', '✓', '✓'],
      ['destek.rowQueue', 'Öncelikli işlem kuyruğu', '—', '✓', '✓'],
      ['destek.rowAds', 'Reklamsız deneyim', '—', '✓', '✓'],
      ['destek.rowApi', 'API erişimi', '—', '—', '✓'],
      ['destek.rowSupport', 'Destek', 'Topluluk', 'E-posta', 'Öncelikli'],
    ],
    2: [
      ['destek.rowFileSize', 'Dosya boyutu limiti', '50 MB', '2 GB', '10 GB'],
      ['destek.rowDaily', 'Günlük işlem sayısı', '10', 'Sınırsız', 'Sınırsız'],
      ['destek.rowOcr', 'OCR sayfa hakkı', '10 / ay', '200 / ay', '1.000 / ay'],
      ['destek.rowMedia', 'Video/ses dakika hakkı', '15 / ay', '180 / ay', '900 / ay'],
      ['destek.rowAiCredit', 'AI kredi', '5 / ay', '150 / ay', '750 / ay'],
      ['destek.rowBatch', 'Toplu dosya işleme', '—', '✓', '✓'],
      ['destek.rowQueue', 'Öncelikli işlem kuyruğu', '—', '✓', '✓'],
      ['destek.rowAds', 'Reklamsız deneyim', '—', '✓', '✓'],
      ['destek.rowApi', 'API erişimi', '—', '—', '✓'],
      ['destek.rowSupport', 'Destek', 'Topluluk', 'E-posta', 'Öncelikli'],
    ],
    3: [
      ['destek.rowFileSize', 'Dosya boyutu limiti', '75 MB', '4 GB', '20 GB'],
      ['destek.rowDaily', 'Günlük işlem sayısı', '15', 'Sınırsız', 'Sınırsız'],
      ['destek.rowOcr', 'OCR sayfa hakkı', '20 / ay', '400 / ay', '2.000 / ay'],
      ['destek.rowMedia', 'Video/ses dakika hakkı', '25 / ay', '360 / ay', '1.800 / ay'],
      ['destek.rowAiCredit', 'AI kredi', '10 / ay', '300 / ay', '1.500 / ay'],
      ['destek.rowBatch', 'Toplu dosya işleme', '✓', '✓', '✓'],
      ['destek.rowQueue', 'Öncelikli işlem kuyruğu', '—', '✓', '✓'],
      ['destek.rowAds', 'Reklamsız deneyim', '—', '✓', '✓'],
      ['destek.rowApi', 'API erişimi', '—', '—', '✓'],
      ['destek.rowSupport', 'Destek', 'Topluluk', 'E-posta', 'Öncelikli'],
    ],
    4: [
      ['destek.rowFileSize', 'Dosya boyutu limiti', '100 MB', '8 GB', '50 GB'],
      ['destek.rowDaily', 'Günlük işlem sayısı', '20', 'Sınırsız', 'Sınırsız'],
      ['destek.rowOcr', 'OCR sayfa hakkı', '30 / ay', '800 / ay', '4.000 / ay'],
      ['destek.rowMedia', 'Video/ses dakika hakkı', '40 / ay', '720 / ay', '3.600 / ay'],
      ['destek.rowAiCredit', 'AI kredi', '15 / ay', '600 / ay', '3.000 / ay'],
      ['destek.rowBatch', 'Toplu dosya işleme', '✓', '✓', '✓'],
      ['destek.rowQueue', 'Öncelikli işlem kuyruğu', '✓', '✓', '✓'],
      ['destek.rowAds', 'Reklamsız deneyim', '—', '✓', '✓'],
      ['destek.rowApi', 'API erişimi', '—', '✓', '✓'],
      ['destek.rowSupport', 'Destek', 'Topluluk', 'E-posta', 'Öncelikli'],
    ],
  },
};

window.jetCreditConfig = {
  packages: [
    { amount: 100, i18n: 'jetLimit.creditBasic', note: 'Başlangıç kredisi' },
    { amount: 250, i18n: 'jetLimit.creditPopular', note: 'En çok tercih edilen', popular: true },
    { amount: 500, i18n: 'jetLimit.creditValue', note: 'Avantajlı paket' },
    { amount: 1000, i18n: 'jetLimit.creditMax', note: 'Yoğun kullanım' },
  ],
};

window.fjPricing = {
  getCurrentEtap: function () {
    var stored = Number(localStorage.getItem('fj_current_etap'));
    if (stored && window.etapConfig.etaps[stored]) return stored;
    return window.etapConfig.currentEtap;
  },
  setCurrentEtap: function (etap) {
    localStorage.setItem('fj_current_etap', String(etap));
  },
};
