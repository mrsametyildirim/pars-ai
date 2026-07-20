'use strict';

/* ══════════════════════════════════════════════════════════
   FormatJet i18n v2 — 5 dil: TR · EN · ES · DE · FR
   layout.js'in ürettiği [data-i18n] öğelerini çevirir.
══════════════════════════════════════════════════════════ */

(function () {
  const T = {
    tr: {
      'nav-pdf': 'PDF', 'nav-belge': 'Belge', 'nav-gorsel': 'Görsel', 'nav-video': 'Video', 'nav-ses': 'Ses',
      'nav-all-tools': 'Tüm Araçlar',
      'btn-support': 'Destek Ol', 'btn-about': 'Bizi Tanı', 'btn-login': 'Giriş Yap',
      'more-langs': 'Diğer diller — yakında',
      'hero-title': 'Dosyan hazır.', 'hero-title-accent': 'Formatını değiştirelim.',
      'hero-sub': 'PDF, belge, görsel, video ve ses dosyalarını hızlı, güvenli ve kolayca dönüştür.',
      'search-placeholder': 'Ne yapmak istiyorsun?',
      'popular-label': 'Popüler Araçlar',
      'feature-fast': 'Hızlı Dönüşüm', 'feature-fast-desc': 'Dosyalarını en hızlı şekilde dönüştürürüz.',
      'feature-safe': 'Güvenli ve Gizli', 'feature-safe-desc': 'Dosyaların güvende. Kimse erişemez, sadece sen görürsün.',
      'feature-cloud': 'Bulut Tabanlı', 'feature-cloud-desc': 'Yükleme yap, dönüştür ve hemen indir.',
      'feature-device': 'Tüm Cihazlarda', 'feature-device-desc': 'İstediğin cihazdan, istediğin zaman kullan.',
      'cta-request-title': 'İhtiyacın olan araç burada yok mu?',
      'cta-request-sub': 'Önerini gönder, geliştirme listemize ekleyelim.',
      'btn-request-tool': 'Yeni Araç Talep Et',
      'cta-support-title': 'Ücretsiz araçları birlikte büyütelim',
      'cta-support-sub': 'Desteğin, ücretsiz limitleri herkes için yükseltir.',
      'footer-tagline': 'Dosyalarını hızlı, güvenli ve kolayca dönüştür.',
      'footer-trust': 'Dosyalar işlemden sonra otomatik silinir.',
      'footer-tools': 'Araçlar', 'footer-about': 'Hakkımızda', 'footer-contact': 'İletişim',
      'footer-legal': 'Yasal', 'footer-privacy': 'Gizlilik Politikası', 'footer-terms': 'Kullanım Koşulları',
      'footer-cookies': 'Çerez Politikası', 'footer-rights': 'Tüm hakları saklıdır.', 'footer-theme': 'Görünüm',
      'search-empty': 'Araç bulunamadı.',
      'cat-search-placeholder': 'Araç ara...',
      _tools: {
        pdfMerge: 'PDF Birleştir', pdfCompress: 'PDF Sıkıştır', wordToPdf: "Word'den PDF",
        imgCompress: 'Görsel Sıkıştır', videoCompress: 'Video Sıkıştır', removeBg: 'Arka Plan Kaldır',
        pdfSplit: 'PDF Böl', heicToJpg: "HEIC'den JPG", videoToMp3: "Video'dan MP3",
        pdfToWord: "PDF'den Word", ocr: 'OCR ile Metin Çıkar', imgToPdf: "JPG'den PDF",
        audioCut: 'Ses Kesici', excelToPdf: "Excel'den PDF", webpToJpg: "WebP'den JPG",
      },
      _toolDescs: {
        pdfMerge: 'Birden fazla PDF dosyasını tek dosyada birleştir.',
        pdfCompress: 'PDF dosyasının boyutunu küçült, kalitesini koru.',
        wordToPdf: 'Word belgelerini PDF formatına dönüştür.',
        imgCompress: 'JPG, PNG ve WebP dosyalarını boyut kaybetmeden küçült.',
        videoCompress: 'Video dosyalarını kalite kaybı olmadan küçült.',
        removeBg: 'Görsel arka planını otomatik olarak kaldır, şeffaf yap.',
        pdfSplit: "PDF'yi sayfa sayfa veya aralık aralık böl.",
        heicToJpg: 'iPhone fotoğraflarını JPG formatına dönüştür.',
        videoToMp3: 'Video dosyasından ses parçasını MP3 olarak çıkar.',
        pdfToWord: 'PDF dosyalarını düzenlenebilir Word belgelerine çevir.',
        ocr: 'PDF ve görsellerden metni otomatik olarak çıkar.',
        imgToPdf: 'JPG, PNG ve WebP dosyalarını PDF formatına dönüştür.',
        audioCut: 'Ses dosyalarını istediğin yerden kes ve kırp.',
        excelToPdf: 'Excel tablolarını PDF formatına dönüştür.',
        webpToJpg: 'WebP görsellerini JPG veya PNG formatına dönüştür.',
      },
      'jetLimit.title': 'Jet Limitini Artır',
      'jetLimit.sub': 'İhtiyacın kadar kredi al; OCR, video/ses ve AI araçlarında anında kullan.',
      'jetLimit.noteTitle': 'Jet kredisi bir kerelik satın alımdır',
      'jetLimit.noteDesc': 'Abonelik değildir, süresi dolmaz ve iade edilemez. Satın aldığınız kredi, hesabınızda kalıcı olarak saklanır ve ihtiyacınız kadar kullanabilirsiniz.',
      'jetLimit.featOcrTitle': 'OCR sayfa hakkı',
      'jetLimit.featOcrDesc': 'Taranmış belge ve görsellerden metin çıkarımı için ek sayfa kredisi.',
      'jetLimit.featMediaTitle': 'Video/ses dakika hakkı',
      'jetLimit.featMediaDesc': 'Dönüştürme, altyazı ve transkript işlemleri için ek dakika kredisi.',
      'jetLimit.featAiTitle': 'AI kredi',
      'jetLimit.featAiDesc': 'Akıllı özetleme, yeniden yazma ve otomasyon araçlarında kullanılır.',
      'jetLimit.purchaseTitle': 'Diğer tutar',
      'jetLimit.customLabel': 'Özel tutar (₺)',
      'jetLimit.cta': 'Jet Kredisi Satın Al',
      'pro.title': 'Planını Seç',
      'pro.sub': 'Tüm temel araçlar sonsuza dek ücretsiz. Pro ile limitleri kaldır.',
      'pro.jetNoteTitle': 'Jet kredisi bir kerelik satın alımdır',
      'pro.jetNoteDesc': 'Abonelik değildir, süresi dolmaz ve iade edilemez. Satın aldığınız kredi, hesabınızda kalıcı olarak saklanır ve ihtiyacınız kadar kullanabilirsiniz.',
      'pro.freeName': 'Ücretsiz',
      'pro.freeDesc': 'Günlük kullanım için temel araçlar.',
      'pro.proName': 'Pro',
      'pro.proDesc': 'Herkesin ilk seçimi. Ücretsiz limitleri kaldır.',
      'pro.businessName': 'Business',
      'pro.businessDesc': 'Takım ve kurumsal kullanım için.',
      'pro.supportMiniTitle': 'FormatJet'in büyümesine destek ol',
      'pro.supportMiniDesc': 'Bağışınla topluluk hedeflerine daha hızlı ulaşalım, limitler herkes için büyüsün.',
      'pro.supportMiniBtn': 'Destek Ol',
      'pro.jetMiniTitle': 'Jet kredisiyle yapabileceklerini genişlet',
      'pro.jetMiniDesc': 'Bir kerelik satın alım, süresi dolmaz, iade edilmez. Hesabında saklanır, ihtiyacın kadar kullan.',
      'pro.jetMiniBtn': 'Jet Kredisi Al',
    },
    en: {
      'nav-pdf': 'PDF', 'nav-belge': 'Document', 'nav-gorsel': 'Image', 'nav-video': 'Video', 'nav-ses': 'Audio',
      'nav-all-tools': 'All Tools',
      'btn-support': 'Support Us', 'btn-about': 'About Us', 'btn-login': 'Sign In',
      'more-langs': 'More languages — coming soon',
      'hero-title': 'Your file is ready.', 'hero-title-accent': "Let's change its format.",
      'hero-sub': 'Convert PDF, document, image, video and audio files quickly, securely and easily.',
      'search-placeholder': 'What do you want to do?',
      'popular-label': 'Popular Tools',
      'feature-fast': 'Fast Conversion', 'feature-fast-desc': 'We convert your files as fast as possible.',
      'feature-safe': 'Secure & Private', 'feature-safe-desc': 'Your files are safe. No one can access them but you.',
      'feature-cloud': 'Cloud Based', 'feature-cloud-desc': 'Upload, convert and download instantly.',
      'feature-device': 'On Every Device', 'feature-device-desc': 'Use it anytime, from any device.',
      'cta-request-title': "Can't find the tool you need?",
      'cta-request-sub': 'Send your suggestion and we will add it to our roadmap.',
      'btn-request-tool': 'Request New Tool',
      'cta-support-title': "Let's grow free tools together",
      'cta-support-sub': 'Your support raises free limits for everyone.',
      'footer-tagline': 'Convert your files quickly, securely and easily.',
      'footer-trust': 'Files are deleted automatically after processing.',
      'footer-tools': 'Tools', 'footer-about': 'About Us', 'footer-contact': 'Contact',
      'footer-legal': 'Legal', 'footer-privacy': 'Privacy Policy', 'footer-terms': 'Terms of Service',
      'footer-cookies': 'Cookie Policy', 'footer-rights': 'All rights reserved.', 'footer-theme': 'Theme',
      'search-empty': 'No tools found.',
      'cat-search-placeholder': 'Search tools...',
      _tools: {
        pdfMerge: 'Merge PDF', pdfCompress: 'Compress PDF', wordToPdf: 'Word to PDF',
        imgCompress: 'Compress Image', videoCompress: 'Compress Video', removeBg: 'Remove Background',
        pdfSplit: 'Split PDF', heicToJpg: 'HEIC to JPG', videoToMp3: 'Video to MP3',
        pdfToWord: 'PDF to Word', ocr: 'OCR Text Extract', imgToPdf: 'JPG to PDF',
        audioCut: 'Audio Cutter', excelToPdf: 'Excel to PDF', webpToJpg: 'WebP to JPG',
      },
      _toolDescs: {
        pdfMerge: 'Combine multiple PDF files into one.',
        pdfCompress: 'Reduce PDF file size while keeping quality.',
        wordToPdf: 'Convert Word documents to PDF format.',
        imgCompress: 'Shrink JPG, PNG and WebP files without losing quality.',
        videoCompress: 'Reduce video file size without quality loss.',
        removeBg: 'Automatically remove image backgrounds, make them transparent.',
        pdfSplit: 'Split a PDF page by page or by range.',
        heicToJpg: 'Convert iPhone photos to JPG format.',
        videoToMp3: 'Extract the audio track from a video as MP3.',
        pdfToWord: 'Turn PDF files into editable Word documents.',
        ocr: 'Automatically extract text from PDFs and images.',
        imgToPdf: 'Convert JPG, PNG and WebP files to PDF format.',
        audioCut: 'Cut and trim audio files exactly where you want.',
        excelToPdf: 'Convert Excel spreadsheets to PDF format.',
        webpToJpg: 'Convert WebP images to JPG or PNG format.',
      },
    },
    es: {
      'nav-pdf': 'PDF', 'nav-belge': 'Documento', 'nav-gorsel': 'Imagen', 'nav-video': 'Vídeo', 'nav-ses': 'Audio',
      'nav-all-tools': 'Herramientas',
      'btn-support': 'Apóyanos', 'btn-about': 'Nosotros', 'btn-login': 'Iniciar Sesión',
      'more-langs': 'Más idiomas — próximamente',
      'hero-title': 'Tu archivo está listo.', 'hero-title-accent': 'Cambiemos su formato.',
      'hero-sub': 'Convierte archivos PDF, documentos, imágenes, vídeo y audio de forma rápida y segura.',
      'search-placeholder': '¿Qué quieres hacer?',
      'popular-label': 'Herramientas Populares',
      'feature-fast': 'Conversión Rápida', 'feature-fast-desc': 'Convertimos tus archivos lo más rápido posible.',
      'feature-safe': 'Seguro y Privado', 'feature-safe-desc': 'Tus archivos están seguros. Solo tú puedes verlos.',
      'feature-cloud': 'En la Nube', 'feature-cloud-desc': 'Sube, convierte y descarga al instante.',
      'feature-device': 'En Todos los Dispositivos', 'feature-device-desc': 'Úsalo cuando quieras, desde cualquier dispositivo.',
      'cta-request-title': '¿No encuentras la herramienta que necesitas?',
      'cta-request-sub': 'Envía tu sugerencia y la añadiremos a nuestra lista.',
      'btn-request-tool': 'Solicitar Herramienta',
      'cta-support-title': 'Hagamos crecer las herramientas gratuitas',
      'cta-support-sub': 'Tu apoyo aumenta los límites gratuitos para todos.',
      'footer-tagline': 'Convierte tus archivos de forma rápida y segura.',
      'footer-trust': 'Los archivos se eliminan automáticamente tras el procesamiento.',
      'footer-tools': 'Herramientas', 'footer-about': 'Nosotros', 'footer-contact': 'Contacto',
      'footer-legal': 'Legal', 'footer-privacy': 'Política de Privacidad', 'footer-terms': 'Términos de Uso',
      'footer-cookies': 'Política de Cookies', 'footer-rights': 'Todos los derechos reservados.', 'footer-theme': 'Tema',
      'search-empty': 'No se encontraron herramientas.',
      'cat-search-placeholder': 'Buscar herramientas...',
      _tools: {
        pdfMerge: 'Unir PDF', pdfCompress: 'Comprimir PDF', wordToPdf: 'Word a PDF',
        imgCompress: 'Comprimir Imagen', videoCompress: 'Comprimir Vídeo', removeBg: 'Quitar Fondo',
        pdfSplit: 'Dividir PDF', heicToJpg: 'HEIC a JPG', videoToMp3: 'Vídeo a MP3',
        pdfToWord: 'PDF a Word', ocr: 'OCR Extraer Texto', imgToPdf: 'JPG a PDF',
        audioCut: 'Cortar Audio', excelToPdf: 'Excel a PDF', webpToJpg: 'WebP a JPG',
      },
      _toolDescs: {
        pdfMerge: 'Combina varios archivos PDF en uno solo.',
        pdfCompress: 'Reduce el tamaño del PDF manteniendo la calidad.',
        wordToPdf: 'Convierte documentos Word a formato PDF.',
        imgCompress: 'Reduce archivos JPG, PNG y WebP sin perder calidad.',
        videoCompress: 'Reduce el tamaño del vídeo sin perder calidad.',
        removeBg: 'Elimina el fondo de la imagen automáticamente, hazlo transparente.',
        pdfSplit: 'Divide un PDF página a página o por rangos.',
        heicToJpg: 'Convierte fotos de iPhone a formato JPG.',
        videoToMp3: 'Extrae la pista de audio de un vídeo como MP3.',
        pdfToWord: 'Convierte archivos PDF en documentos Word editables.',
        ocr: 'Extrae texto de PDF e imágenes automáticamente.',
        imgToPdf: 'Convierte archivos JPG, PNG y WebP a formato PDF.',
        audioCut: 'Corta y recorta archivos de audio donde quieras.',
        excelToPdf: 'Convierte hojas de cálculo Excel a formato PDF.',
        webpToJpg: 'Convierte imágenes WebP a formato JPG o PNG.',
      },
    },
    de: {
      'nav-pdf': 'PDF', 'nav-belge': 'Dokument', 'nav-gorsel': 'Bild', 'nav-video': 'Video', 'nav-ses': 'Audio',
      'nav-all-tools': 'Alle Tools',
      'btn-support': 'Unterstützen', 'btn-about': 'Über Uns', 'btn-login': 'Anmelden',
      'more-langs': 'Weitere Sprachen — bald verfügbar',
      'hero-title': 'Deine Datei ist bereit.', 'hero-title-accent': 'Ändern wir ihr Format.',
      'hero-sub': 'Konvertiere PDF-, Dokument-, Bild-, Video- und Audiodateien schnell und sicher.',
      'search-placeholder': 'Was möchtest du tun?',
      'popular-label': 'Beliebte Tools',
      'feature-fast': 'Schnelle Konvertierung', 'feature-fast-desc': 'Wir konvertieren deine Dateien so schnell wie möglich.',
      'feature-safe': 'Sicher & Privat', 'feature-safe-desc': 'Deine Dateien sind sicher. Nur du kannst sie sehen.',
      'feature-cloud': 'Cloud-Basiert', 'feature-cloud-desc': 'Hochladen, konvertieren und sofort herunterladen.',
      'feature-device': 'Auf Allen Geräten', 'feature-device-desc': 'Nutze es jederzeit, von jedem Gerät.',
      'cta-request-title': 'Fehlt dir ein Tool?',
      'cta-request-sub': 'Sende deinen Vorschlag und wir nehmen ihn in unsere Liste auf.',
      'btn-request-tool': 'Neues Tool Anfragen',
      'cta-support-title': 'Lass uns kostenlose Tools gemeinsam ausbauen',
      'cta-support-sub': 'Deine Unterstützung erhöht die kostenlosen Limits für alle.',
      'footer-tagline': 'Konvertiere deine Dateien schnell und sicher.',
      'footer-trust': 'Dateien werden nach der Verarbeitung automatisch gelöscht.',
      'footer-tools': 'Tools', 'footer-about': 'Über Uns', 'footer-contact': 'Kontakt',
      'footer-legal': 'Rechtliches', 'footer-privacy': 'Datenschutz', 'footer-terms': 'Nutzungsbedingungen',
      'footer-cookies': 'Cookie-Richtlinie', 'footer-rights': 'Alle Rechte vorbehalten.', 'footer-theme': 'Design',
      'search-empty': 'Keine Tools gefunden.',
      'cat-search-placeholder': 'Tools suchen...',
      _tools: {
        pdfMerge: 'PDF Zusammenfügen', pdfCompress: 'PDF Komprimieren', wordToPdf: 'Word zu PDF',
        imgCompress: 'Bild Komprimieren', videoCompress: 'Video Komprimieren', removeBg: 'Hintergrund Entfernen',
        pdfSplit: 'PDF Teilen', heicToJpg: 'HEIC zu JPG', videoToMp3: 'Video zu MP3',
        pdfToWord: 'PDF zu Word', ocr: 'OCR Texterkennung', imgToPdf: 'JPG zu PDF',
        audioCut: 'Audio Schneiden', excelToPdf: 'Excel zu PDF', webpToJpg: 'WebP zu JPG',
      },
      _toolDescs: {
        pdfMerge: 'Füge mehrere PDF-Dateien zu einer zusammen.',
        pdfCompress: 'Verkleinere PDF-Dateien bei gleicher Qualität.',
        wordToPdf: 'Konvertiere Word-Dokumente ins PDF-Format.',
        imgCompress: 'Verkleinere JPG-, PNG- und WebP-Dateien ohne Qualitätsverlust.',
        videoCompress: 'Verkleinere Videodateien ohne Qualitätsverlust.',
        removeBg: 'Entferne Bildhintergründe automatisch, mach sie transparent.',
        pdfSplit: 'Teile ein PDF seitenweise oder nach Bereichen.',
        heicToJpg: 'Konvertiere iPhone-Fotos ins JPG-Format.',
        videoToMp3: 'Extrahiere die Tonspur eines Videos als MP3.',
        pdfToWord: 'Wandle PDF-Dateien in bearbeitbare Word-Dokumente um.',
        ocr: 'Extrahiere Text aus PDFs und Bildern automatisch.',
        imgToPdf: 'Konvertiere JPG-, PNG- und WebP-Dateien ins PDF-Format.',
        audioCut: 'Schneide Audiodateien genau dort, wo du willst.',
        excelToPdf: 'Konvertiere Excel-Tabellen ins PDF-Format.',
        webpToJpg: 'Konvertiere WebP-Bilder ins JPG- oder PNG-Format.',
      },
    },
    fr: {
      'nav-pdf': 'PDF', 'nav-belge': 'Document', 'nav-gorsel': 'Image', 'nav-video': 'Vidéo', 'nav-ses': 'Audio',
      'nav-all-tools': 'Tous les Outils',
      'btn-support': 'Soutenez-nous', 'btn-about': 'À Propos', 'btn-login': 'Connexion',
      'more-langs': 'Plus de langues — bientôt',
      'hero-title': 'Votre fichier est prêt.', 'hero-title-accent': 'Changeons son format.',
      'hero-sub': 'Convertissez vos fichiers PDF, documents, images, vidéo et audio rapidement et en toute sécurité.',
      'search-placeholder': 'Que voulez-vous faire ?',
      'popular-label': 'Outils Populaires',
      'feature-fast': 'Conversion Rapide', 'feature-fast-desc': 'Nous convertissons vos fichiers le plus vite possible.',
      'feature-safe': 'Sûr et Privé', 'feature-safe-desc': 'Vos fichiers sont en sécurité. Vous seul pouvez les voir.',
      'feature-cloud': 'Basé sur le Cloud', 'feature-cloud-desc': 'Téléversez, convertissez et téléchargez instantanément.',
      'feature-device': 'Sur Tous les Appareils', 'feature-device-desc': "Utilisez-le à tout moment, depuis n'importe quel appareil.",
      'cta-request-title': "L'outil dont vous avez besoin n'est pas là ?",
      'cta-request-sub': "Envoyez votre suggestion et nous l'ajouterons à notre liste.",
      'btn-request-tool': 'Demander un Outil',
      'cta-support-title': 'Développons ensemble les outils gratuits',
      'cta-support-sub': 'Votre soutien augmente les limites gratuites pour tous.',
      'footer-tagline': 'Convertissez vos fichiers rapidement et en toute sécurité.',
      'footer-trust': 'Les fichiers sont supprimés automatiquement après traitement.',
      'footer-tools': 'Outils', 'footer-about': 'À Propos', 'footer-contact': 'Contact',
      'footer-legal': 'Mentions Légales', 'footer-privacy': 'Politique de Confidentialité', 'footer-terms': "Conditions d'Utilisation",
      'footer-cookies': 'Politique de Cookies', 'footer-rights': 'Tous droits réservés.', 'footer-theme': 'Thème',
      'search-empty': 'Aucun outil trouvé.',
      'cat-search-placeholder': 'Rechercher des outils...',
      _tools: {
        pdfMerge: 'Fusionner PDF', pdfCompress: 'Compresser PDF', wordToPdf: 'Word en PDF',
        imgCompress: 'Compresser Image', videoCompress: 'Compresser Vidéo', removeBg: 'Supprimer le Fond',
        pdfSplit: 'Diviser PDF', heicToJpg: 'HEIC en JPG', videoToMp3: 'Vidéo en MP3',
        pdfToWord: 'PDF en Word', ocr: 'OCR Extraire Texte', imgToPdf: 'JPG en PDF',
        audioCut: 'Couper Audio', excelToPdf: 'Excel en PDF', webpToJpg: 'WebP en JPG',
      },
      _toolDescs: {
        pdfMerge: 'Combinez plusieurs fichiers PDF en un seul.',
        pdfCompress: 'Réduisez la taille du PDF en gardant la qualité.',
        wordToPdf: 'Convertissez des documents Word au format PDF.',
        imgCompress: 'Réduisez vos fichiers JPG, PNG et WebP sans perte de qualité.',
        videoCompress: 'Réduisez la taille de vos vidéos sans perte de qualité.',
        removeBg: "Supprimez automatiquement l'arrière-plan, rendez-le transparent.",
        pdfSplit: 'Divisez un PDF page par page ou par plages.',
        heicToJpg: 'Convertissez vos photos iPhone au format JPG.',
        videoToMp3: "Extrayez la piste audio d'une vidéo en MP3.",
        pdfToWord: 'Transformez vos PDF en documents Word modifiables.',
        ocr: 'Extrayez automatiquement le texte des PDF et des images.',
        imgToPdf: 'Convertissez vos fichiers JPG, PNG et WebP au format PDF.',
        audioCut: 'Coupez et rognez vos fichiers audio où vous voulez.',
        excelToPdf: 'Convertissez vos tableaux Excel au format PDF.',
        webpToJpg: 'Convertissez vos images WebP au format JPG ou PNG.',
      },
    },
  };

  /* ── Sayfa içi ek anahtarlar (kategori + araç sayfası UI) ── */
  const EXTRA = {
    tr: {
      'cat-pdf-title': 'PDF Araçları', 'cat-belge-title': 'Belge Araçları', 'cat-gorsel-title': 'Görsel Araçları',
      'cat-video-title': 'Video Araçları', 'cat-ses-title': 'Ses Araçları', 'tools-title': 'Tüm Araçlar',
      'tools-sub': '70+ ücretsiz dosya aracı. Kayıt gerekmez.',
      'tool-drop-title': 'Dosyaları buraya sürükle veya tıkla',
      'tool-btn-process': 'Dönüştür', 'tool-btn-reset': 'Yeni Dosya',
      'tool-how': 'Nasıl çalışır?',
      'tool-s1': 'Dosyanı Seç', 'tool-s1d': 'Sürükle-bırak veya tıklayarak dosyanı yükle.',
      'tool-s2': 'Tarayıcıda İşlenir', 'tool-s2d': 'Dosyan sunucuya gitmez; işlem cihazında, tarayıcı içinde yapılır.',
      'tool-s3': 'Anında İndir', 'tool-s3d': 'Sonuç dosyan hazır olur olmaz otomatik indirilir.',
      'tool-pro': "Pro'ya geç →",
      'cat-pdf-sub': 'PDF dosyalarını birleştir, böl, sıkıştır, dönüştür. Tüm araçlar ücretsiz.',
      'cat-belge-sub': 'Word, Excel, PPT ve diğer belge formatlarını dönüştür. Tüm araçlar ücretsiz.',
      'cat-gorsel-sub': 'Görselleri sıkıştır, dönüştür, boyutlandır ve düzenle. Tüm araçlar ücretsiz.',
      'cat-video-sub': 'Video dosyalarını sıkıştır, dönüştür, kırp ve düzenle. Tüm araçlar ücretsiz.',
      'cat-ses-sub': 'Ses dosyalarını kes, dönüştür, birleştir ve düzenle. Tüm araçlar ücretsiz.',
      'tools-tab-all': 'Tümü',
      'tool-limit': 'Ücretsiz: 50 MB/dosya · Üyelere 200 MB',
      'tool-multi': ' · Çoklu seçim',
      'tool-engine': ' · İlk kullanımda motor yüklenir (~31 MB)',
      'contact-title': 'İletişim',
      'contact-sub': 'Sorularınız, önerileriniz veya araç talepleriniz için buradan ulaşabilirsiniz.',
      'contact-name': 'Adınız', 'contact-name-ph': 'Adınız Soyadınız',
      'contact-email': 'E-posta',
      'contact-subject': 'Konu', 'contact-subject-ph': 'Konu seçin',
      'contact-subject-1': 'Teknik Sorun', 'contact-subject-2': 'Yeni Araç Talebi',
      'contact-subject-3': 'Gizlilik / KVKK', 'contact-subject-4': 'İş Birliği', 'contact-subject-5': 'Diğer',
      'contact-message': 'Mesajınız', 'contact-message-ph': 'Mesajınızı buraya yazın...',
      'contact-send': 'Gönder',
      'contact-success': 'Mesajınız alındı. En geç 24 saat içinde yanıt veririz.',
      'contact-info-email': 'Destek e-postası', 'contact-info-response': 'Yanıt süresi',
      'contact-info-request': 'Yeni Araç Talebi',
      'contact-info-request-desc': 'Eksik gördüğünüz aracı önerin, değerlendirelim.',
      'contact-info-address': 'Adres',
      'contact-faq-title': 'Sık sorulan sorular',
      'contact-faq-q1': 'Dosyalarım güvende mi?', 'contact-faq-a1': 'Evet. İşlem sonrası 1 saat içinde otomatik silinir.',
      'contact-faq-q2': 'Kayıt olmadan kullanabilir miyim?', 'contact-faq-a2': 'Evet. Tüm temel araçlar kayıtsız çalışır.',
      'contact-faq-q3': 'Dosya boyutu limiti var mı?', 'contact-faq-a3': 'Üyesiz kullanımda 50 MB, üyeler için 200 MB.',
      'odeme-title': 'Sana uygun planı seç',
      'odeme-sub': 'Tüm temel araçlar sonsuza dek ücretsiz. Pro ile limitleri kaldır.',
      'billing-monthly': 'Aylık', 'billing-yearly': 'Yıllık', 'billing-save': '%25 indirim',
      'plan-free-name': 'Ücretsiz', 'plan-pro-name': 'Pro', 'plan-business-name': 'Business',
      'plan-popular': 'En Popüler',
      'plan-free-desc': 'Günlük kullanım için temel araçlar.',
      'plan-pro-desc': 'Sık kullananlar için sınırsız güç.',
      'plan-business-desc': 'Ekipler ve yoğun kullanım için.',
      'plan-free-btn': 'Ücretsiz Kullan', 'plan-pro-btn': "Pro'ya Geç", 'plan-business-btn': "Business'a Geç",
      'plan-feat-1': '70+ araca erişim', 'plan-feat-2': '50 MB dosya limiti',
      'plan-feat-3': 'Günde 10 işlem', 'plan-feat-4': 'Dosyalar 1 saat sonra silinir',
      'plan-feat-5': 'Sınırsız işlem', 'plan-feat-6': '2 GB dosya limiti',
      'plan-feat-7': 'Öncelikli işlem kuyruğu', 'plan-feat-8': 'Toplu dosya işleme',
      'plan-feat-9': 'Reklamsız deneyim', 'plan-feat-10': "Pro'daki her şey",
      'plan-feat-11': '5 kullanıcı', 'plan-feat-12': '10 GB dosya limiti',
      'plan-feat-13': 'API erişimi', 'plan-feat-14': 'Öncelikli destek',
      'odeme-checkout-title': 'Ödeme Bilgileri',
      'odeme-method-card': 'Kredi / Banka Kartı', 'odeme-method-transfer': 'Havale / EFT',
      'odeme-card-name': 'Kart Üzerindeki İsim', 'odeme-card-number': 'Kart Numarası', 'odeme-card-expiry': 'Son Kullanma',
      'odeme-pay-btn': 'Ödemeyi Tamamla',
      'odeme-sandbox': 'Test modu: Bu ödeme ekranı sandbox modundadır; karttan gerçek tahsilat yapılmaz. Test kartı: 4242 4242 4242 4242',
      'odeme-transfer-btn': 'Havale Bildirimi Gönder',
      'odeme-summary-title': 'Sipariş Özeti',
      'odeme-sum-plan': 'Plan', 'odeme-sum-period': 'Dönem', 'odeme-sum-vat': 'KDV (%20)', 'odeme-sum-total': 'Toplam',
      'auth-login-title': 'Hesabına giriş yap',
      'auth-login-sub': 'Hoş geldin. Devam etmek için giriş yap.',
      'auth-google-login': 'Gmail ile Giriş Yap',
      'auth-or': 'veya', 'auth-or-email': 'veya e-posta ile',
      'auth-email': 'E-posta adresi', 'auth-password': 'Şifre',
      'auth-forgot': 'Şifremi Unuttum', 'auth-login-btn': 'Giriş Yap',
      'auth-no-account': 'Hesabın yok mu?', 'auth-register-link': 'Kayıt Ol',
      'auth-brand-login': 'Dosyalarını güvenle yönet',
      'auth-feat-1': '70+ ücretsiz araç, kayıt gerekmez',
      'auth-feat-2': 'Dosyalar işlemden sonra otomatik silinir',
      'auth-feat-3': 'Telefon, tablet ve masaüstünde çalışır',
      'auth-feat-4': 'Üye olanlara daha yüksek dosya limiti',
      'auth-register-title': 'Hesap oluştur',
      'auth-register-sub': 'Ücretsiz, hızlı, güvenli. Kredi kartı gerekmez.',
      'auth-google-register': 'Gmail ile Kayıt Ol',
      'auth-fullname': 'Ad Soyad', 'auth-fullname-ph': 'Adınız Soyadınız',
      'auth-password-min-ph': 'En az 8 karakter',
      'auth-register-btn': 'Hesap Oluştur',
      'auth-hint': 'E-posta adresinize doğrulama bağlantısı gönderilecektir.',
      'auth-have-account': 'Zaten hesabın var mı?', 'auth-login-link': 'Giriş Yap',
      'auth-brand-register': 'Ücretsiz hesap aç, limitleri yükselt',
      'auth-reg-feat-1': 'Kayıtsız kullanıcıya göre 3× daha yüksek limit',
      'auth-reg-feat-2': 'İşlem geçmişine erişim',
      'auth-reg-feat-3': 'Toplu dosya işleme (çoklu yükleme)',
      'acc-title': 'Hesabım',
      'acc-tab-info': 'Hesap Bilgilerim', 'acc-tab-pay': 'Ödeme Bilgilerim',
      'acc-tab-usage': 'Kullanım Geçmişim', 'acc-tab-tickets': 'Taleplerim', 'acc-tab-status': 'Hesap Durumu',
      'acc-card-profile': 'Profil',
      'acc-field-name': 'Ad Soyad', 'acc-field-email': 'E-posta', 'acc-field-created': 'Üyelik tarihi',
      'acc-btn-edit': 'Bilgileri Düzenle', 'acc-btn-password': 'Şifre Değiştir',
      'acc-btn-signout': 'Çıkış Yap', 'acc-btn-delete': 'Hesabı Sil', 'acc-btn-save': 'Kaydet',
      'acc-card-plan': 'Mevcut Plan',
      'acc-field-plan': 'Mevcut plan', 'acc-field-renew': 'Bir sonraki yenileme', 'acc-field-method': 'Kayıtlı ödeme yöntemi',
      'acc-btn-upgrade': "Pro'ya Geç →", 'acc-btn-pro': "Pro'ya Geç",
      'acc-card-payhist': 'Ödeme Geçmişi ve Faturalar',
      'acc-th-date': 'Tarih', 'acc-th-amount': 'Tutar', 'acc-th-method': 'Yöntem', 'acc-th-status': 'Durum', 'acc-th-tool': 'Araç',
      'acc-pay-empty': 'Ödeme kaydın bulunmuyor.',
      'acc-card-usage': 'Son 5 İşlem',
      'acc-usage-empty': 'Henüz araç kullanımın yok.', 'acc-usage-link': 'Araçları keşfet →',
      'acc-ticket-hint': 'Sorunun devam ediyorsa', 'acc-ticket-hint-link': 'yeni talep oluştur',
      'acc-ticket-empty': 'Henüz talebin yok.', 'acc-ticket-empty-link': 'İletişim formundan yaz →',
      'acc-field-limit': 'Dosya limiti', 'acc-quota-label': 'Bugünkü işlem kullanımı',
      'acc-coffee-title': 'Dosyaların beklemesin',
      'acc-coffee-desc': '1 kahve parasına 1 ay Pro: sınırsız işlem, 2 GB dosya limiti, öncelikli kuyruk.',
    },
    en: {
      'cat-pdf-title': 'PDF Tools', 'cat-belge-title': 'Document Tools', 'cat-gorsel-title': 'Image Tools',
      'cat-video-title': 'Video Tools', 'cat-ses-title': 'Audio Tools', 'tools-title': 'All Tools',
      'tools-sub': '70+ free file tools. No sign-up required.',
      'tool-drop-title': 'Drag files here or click',
      'tool-btn-process': 'Convert', 'tool-btn-reset': 'New File',
      'tool-how': 'How it works',
      'tool-s1': 'Pick Your File', 'tool-s1d': 'Drag & drop or click to upload your file.',
      'tool-s2': 'Processed in Browser', 'tool-s2d': 'Your file never leaves your device; everything runs in the browser.',
      'tool-s3': 'Instant Download', 'tool-s3d': 'The result downloads automatically as soon as it is ready.',
      'tool-pro': 'Go Pro →',
      'cat-pdf-sub': 'Merge, split, compress and convert PDF files. All tools are free.',
      'cat-belge-sub': 'Convert Word, Excel, PPT and other document formats. All tools are free.',
      'cat-gorsel-sub': 'Compress, convert, resize and edit images. All tools are free.',
      'cat-video-sub': 'Compress, convert, trim and edit video files. All tools are free.',
      'cat-ses-sub': 'Cut, convert, merge and edit audio files. All tools are free.',
      'tools-tab-all': 'All',
      'tool-limit': 'Free: 50 MB/file · Members 200 MB',
      'tool-multi': ' · Multiple selection',
      'tool-engine': ' · Engine loads on first use (~31 MB)',
      'contact-title': 'Contact',
      'contact-sub': 'Reach us here for questions, suggestions or tool requests.',
      'contact-name': 'Your Name', 'contact-name-ph': 'Your full name',
      'contact-email': 'Email',
      'contact-subject': 'Subject', 'contact-subject-ph': 'Select a subject',
      'contact-subject-1': 'Technical Issue', 'contact-subject-2': 'New Tool Request',
      'contact-subject-3': 'Privacy / GDPR', 'contact-subject-4': 'Partnership', 'contact-subject-5': 'Other',
      'contact-message': 'Your Message', 'contact-message-ph': 'Write your message here...',
      'contact-send': 'Send',
      'contact-success': 'Your message has been received. We reply within 24 hours.',
      'contact-info-email': 'Support email', 'contact-info-response': 'Response time',
      'contact-info-request': 'New Tool Request',
      'contact-info-request-desc': 'Suggest a missing tool and we will consider it.',
      'contact-info-address': 'Address',
      'contact-faq-title': 'Frequently asked questions',
      'contact-faq-q1': 'Are my files safe?', 'contact-faq-a1': 'Yes. They are deleted automatically within 1 hour after processing.',
      'contact-faq-q2': 'Can I use it without signing up?', 'contact-faq-a2': 'Yes. All core tools work without an account.',
      'contact-faq-q3': 'Is there a file size limit?', 'contact-faq-a3': '50 MB without an account, 200 MB for members.',
      'odeme-title': 'Pick the plan that fits you',
      'odeme-sub': 'All core tools are free forever. Remove the limits with Pro.',
      'billing-monthly': 'Monthly', 'billing-yearly': 'Yearly', 'billing-save': '25% off',
      'plan-free-name': 'Free', 'plan-pro-name': 'Pro', 'plan-business-name': 'Business',
      'plan-popular': 'Most Popular',
      'plan-free-desc': 'Core tools for everyday use.',
      'plan-pro-desc': 'Unlimited power for frequent users.',
      'plan-business-desc': 'For teams and heavy usage.',
      'plan-free-btn': 'Use for Free', 'plan-pro-btn': 'Go Pro', 'plan-business-btn': 'Go Business',
      'plan-feat-1': 'Access to 70+ tools', 'plan-feat-2': '50 MB file limit',
      'plan-feat-3': '10 operations per day', 'plan-feat-4': 'Files deleted after 1 hour',
      'plan-feat-5': 'Unlimited operations', 'plan-feat-6': '2 GB file limit',
      'plan-feat-7': 'Priority processing queue', 'plan-feat-8': 'Batch file processing',
      'plan-feat-9': 'Ad-free experience', 'plan-feat-10': 'Everything in Pro',
      'plan-feat-11': '5 users', 'plan-feat-12': '10 GB file limit',
      'plan-feat-13': 'API access', 'plan-feat-14': 'Priority support',
      'odeme-checkout-title': 'Payment Details',
      'odeme-method-card': 'Credit / Debit Card', 'odeme-method-transfer': 'Bank Transfer',
      'odeme-card-name': 'Name on Card', 'odeme-card-number': 'Card Number', 'odeme-card-expiry': 'Expiry Date',
      'odeme-pay-btn': 'Complete Payment',
      'odeme-sandbox': 'Test mode: This checkout runs in sandbox mode; your card will not be charged. Test card: 4242 4242 4242 4242',
      'odeme-transfer-btn': 'Send Transfer Notice',
      'odeme-summary-title': 'Order Summary',
      'odeme-sum-plan': 'Plan', 'odeme-sum-period': 'Billing Period', 'odeme-sum-vat': 'VAT (20%)', 'odeme-sum-total': 'Total',
      'auth-login-title': 'Sign in to your account',
      'auth-login-sub': 'Welcome back. Sign in to continue.',
      'auth-google-login': 'Sign in with Gmail',
      'auth-or': 'or', 'auth-or-email': 'or with email',
      'auth-email': 'Email address', 'auth-password': 'Password',
      'auth-forgot': 'Forgot Password', 'auth-login-btn': 'Sign In',
      'auth-no-account': "Don't have an account?", 'auth-register-link': 'Sign Up',
      'auth-brand-login': 'Manage your files with confidence',
      'auth-feat-1': '70+ free tools, no sign-up required',
      'auth-feat-2': 'Files are deleted automatically after processing',
      'auth-feat-3': 'Works on phone, tablet and desktop',
      'auth-feat-4': 'Higher file limits for members',
      'auth-register-title': 'Create an account',
      'auth-register-sub': 'Free, fast, secure. No credit card required.',
      'auth-google-register': 'Sign up with Gmail',
      'auth-fullname': 'Full Name', 'auth-fullname-ph': 'Your full name',
      'auth-password-min-ph': 'At least 8 characters',
      'auth-register-btn': 'Create Account',
      'auth-hint': 'A verification link will be sent to your email address.',
      'auth-have-account': 'Already have an account?', 'auth-login-link': 'Sign In',
      'auth-brand-register': 'Open a free account, raise the limits',
      'auth-reg-feat-1': '3× higher limits than guest users',
      'auth-reg-feat-2': 'Access to your processing history',
      'auth-reg-feat-3': 'Batch file processing (multi-upload)',
      'acc-title': 'My Account',
      'acc-tab-info': 'Account Details', 'acc-tab-pay': 'Billing Details',
      'acc-tab-usage': 'Usage History', 'acc-tab-tickets': 'My Requests', 'acc-tab-status': 'Account Status',
      'acc-card-profile': 'Profile',
      'acc-field-name': 'Full Name', 'acc-field-email': 'Email', 'acc-field-created': 'Member since',
      'acc-btn-edit': 'Edit Details', 'acc-btn-password': 'Change Password',
      'acc-btn-signout': 'Sign Out', 'acc-btn-delete': 'Delete Account', 'acc-btn-save': 'Save',
      'acc-card-plan': 'Current Plan',
      'acc-field-plan': 'Current plan', 'acc-field-renew': 'Next renewal', 'acc-field-method': 'Saved payment method',
      'acc-btn-upgrade': 'Go Pro →', 'acc-btn-pro': 'Go Pro',
      'acc-card-payhist': 'Payment History & Invoices',
      'acc-th-date': 'Date', 'acc-th-amount': 'Amount', 'acc-th-method': 'Method', 'acc-th-status': 'Status', 'acc-th-tool': 'Tool',
      'acc-pay-empty': 'No payment records yet.',
      'acc-card-usage': 'Last 5 Operations',
      'acc-usage-empty': "You haven't used any tools yet.", 'acc-usage-link': 'Explore tools →',
      'acc-ticket-hint': 'If your issue continues,', 'acc-ticket-hint-link': 'create a new request',
      'acc-ticket-empty': 'No requests yet.', 'acc-ticket-empty-link': 'Write via the contact form →',
      'acc-field-limit': 'File limit', 'acc-quota-label': "Today's usage",
      'acc-coffee-title': "Don't keep your files waiting",
      'acc-coffee-desc': '1 month of Pro for the price of a coffee: unlimited operations, 2 GB file limit, priority queue.',
    },
    es: {
      'cat-pdf-title': 'Herramientas PDF', 'cat-belge-title': 'Herramientas de Documentos', 'cat-gorsel-title': 'Herramientas de Imagen',
      'cat-video-title': 'Herramientas de Vídeo', 'cat-ses-title': 'Herramientas de Audio', 'tools-title': 'Todas las Herramientas',
      'tools-sub': 'Más de 70 herramientas gratuitas. Sin registro.',
      'tool-drop-title': 'Arrastra archivos aquí o haz clic',
      'tool-btn-process': 'Convertir', 'tool-btn-reset': 'Nuevo Archivo',
      'tool-how': '¿Cómo funciona?',
      'tool-s1': 'Elige tu Archivo', 'tool-s1d': 'Arrastra y suelta o haz clic para subir tu archivo.',
      'tool-s2': 'Procesado en el Navegador', 'tool-s2d': 'Tu archivo no sale de tu dispositivo; todo ocurre en el navegador.',
      'tool-s3': 'Descarga Instantánea', 'tool-s3d': 'El resultado se descarga automáticamente en cuanto está listo.',
      'tool-pro': 'Hazte Pro →',
      'cat-pdf-sub': 'Une, divide, comprime y convierte archivos PDF. Todas las herramientas son gratis.',
      'cat-belge-sub': 'Convierte Word, Excel, PPT y otros formatos de documento. Todas las herramientas son gratis.',
      'cat-gorsel-sub': 'Comprime, convierte, redimensiona y edita imágenes. Todas las herramientas son gratis.',
      'cat-video-sub': 'Comprime, convierte, recorta y edita archivos de vídeo. Todas las herramientas son gratis.',
      'cat-ses-sub': 'Corta, convierte, une y edita archivos de audio. Todas las herramientas son gratis.',
      'tools-tab-all': 'Todo',
      'tool-limit': 'Gratis: 50 MB/archivo · Miembros 200 MB',
      'tool-multi': ' · Selección múltiple',
      'tool-engine': ' · El motor se carga en el primer uso (~31 MB)',
      'contact-title': 'Contacto',
      'contact-sub': 'Escríbenos aquí para preguntas, sugerencias o solicitudes de herramientas.',
      'contact-name': 'Tu Nombre', 'contact-name-ph': 'Nombre y apellidos',
      'contact-email': 'Correo',
      'contact-subject': 'Asunto', 'contact-subject-ph': 'Elige un asunto',
      'contact-subject-1': 'Problema Técnico', 'contact-subject-2': 'Solicitud de Herramienta',
      'contact-subject-3': 'Privacidad / RGPD', 'contact-subject-4': 'Colaboración', 'contact-subject-5': 'Otro',
      'contact-message': 'Tu Mensaje', 'contact-message-ph': 'Escribe tu mensaje aquí...',
      'contact-send': 'Enviar',
      'contact-success': 'Hemos recibido tu mensaje. Respondemos en un máximo de 24 horas.',
      'contact-info-email': 'Correo de soporte', 'contact-info-response': 'Tiempo de respuesta',
      'contact-info-request': 'Solicitud de Herramienta',
      'contact-info-request-desc': 'Sugiere la herramienta que echas en falta y la evaluaremos.',
      'contact-info-address': 'Dirección',
      'contact-faq-title': 'Preguntas frecuentes',
      'contact-faq-q1': '¿Mis archivos están seguros?', 'contact-faq-a1': 'Sí. Se eliminan automáticamente 1 hora después del procesamiento.',
      'contact-faq-q2': '¿Puedo usarlo sin registrarme?', 'contact-faq-a2': 'Sí. Todas las herramientas básicas funcionan sin cuenta.',
      'contact-faq-q3': '¿Hay límite de tamaño de archivo?', 'contact-faq-a3': '50 MB sin cuenta, 200 MB para miembros.',
      'odeme-title': 'Elige el plan adecuado para ti',
      'odeme-sub': 'Todas las herramientas básicas son gratis para siempre. Elimina los límites con Pro.',
      'billing-monthly': 'Mensual', 'billing-yearly': 'Anual', 'billing-save': '25% dto.',
      'plan-free-name': 'Gratis', 'plan-pro-name': 'Pro', 'plan-business-name': 'Business',
      'plan-popular': 'Más Popular',
      'plan-free-desc': 'Herramientas básicas para el día a día.',
      'plan-pro-desc': 'Potencia sin límites para usuarios frecuentes.',
      'plan-business-desc': 'Para equipos y uso intensivo.',
      'plan-free-btn': 'Usar Gratis', 'plan-pro-btn': 'Pasar a Pro', 'plan-business-btn': 'Pasar a Business',
      'plan-feat-1': 'Acceso a más de 70 herramientas', 'plan-feat-2': 'Límite de 50 MB por archivo',
      'plan-feat-3': '10 operaciones al día', 'plan-feat-4': 'Los archivos se eliminan tras 1 hora',
      'plan-feat-5': 'Operaciones ilimitadas', 'plan-feat-6': 'Límite de 2 GB por archivo',
      'plan-feat-7': 'Cola de procesamiento prioritaria', 'plan-feat-8': 'Procesamiento por lotes',
      'plan-feat-9': 'Experiencia sin anuncios', 'plan-feat-10': 'Todo lo de Pro',
      'plan-feat-11': '5 usuarios', 'plan-feat-12': 'Límite de 10 GB por archivo',
      'plan-feat-13': 'Acceso a la API', 'plan-feat-14': 'Soporte prioritario',
      'odeme-checkout-title': 'Datos de Pago',
      'odeme-method-card': 'Tarjeta de Crédito / Débito', 'odeme-method-transfer': 'Transferencia Bancaria',
      'odeme-card-name': 'Nombre en la Tarjeta', 'odeme-card-number': 'Número de Tarjeta', 'odeme-card-expiry': 'Caducidad',
      'odeme-pay-btn': 'Completar el Pago',
      'odeme-sandbox': 'Modo de prueba: esta pantalla de pago funciona en sandbox; no se realizará ningún cargo real. Tarjeta de prueba: 4242 4242 4242 4242',
      'odeme-transfer-btn': 'Enviar Aviso de Transferencia',
      'odeme-summary-title': 'Resumen del Pedido',
      'odeme-sum-plan': 'Plan', 'odeme-sum-period': 'Periodo', 'odeme-sum-vat': 'IVA (20%)', 'odeme-sum-total': 'Total',
      'auth-login-title': 'Inicia sesión en tu cuenta',
      'auth-login-sub': 'Bienvenido de nuevo. Inicia sesión para continuar.',
      'auth-google-login': 'Iniciar sesión con Gmail',
      'auth-or': 'o', 'auth-or-email': 'o con correo',
      'auth-email': 'Correo electrónico', 'auth-password': 'Contraseña',
      'auth-forgot': 'Olvidé mi Contraseña', 'auth-login-btn': 'Iniciar Sesión',
      'auth-no-account': '¿No tienes cuenta?', 'auth-register-link': 'Regístrate',
      'auth-brand-login': 'Gestiona tus archivos con confianza',
      'auth-feat-1': 'Más de 70 herramientas gratis, sin registro',
      'auth-feat-2': 'Los archivos se eliminan automáticamente tras el procesamiento',
      'auth-feat-3': 'Funciona en móvil, tablet y escritorio',
      'auth-feat-4': 'Límites más altos para miembros',
      'auth-register-title': 'Crea una cuenta',
      'auth-register-sub': 'Gratis, rápido, seguro. Sin tarjeta de crédito.',
      'auth-google-register': 'Registrarse con Gmail',
      'auth-fullname': 'Nombre Completo', 'auth-fullname-ph': 'Nombre y apellidos',
      'auth-password-min-ph': 'Mínimo 8 caracteres',
      'auth-register-btn': 'Crear Cuenta',
      'auth-hint': 'Enviaremos un enlace de verificación a tu correo.',
      'auth-have-account': '¿Ya tienes cuenta?', 'auth-login-link': 'Iniciar Sesión',
      'auth-brand-register': 'Abre una cuenta gratis y sube los límites',
      'auth-reg-feat-1': 'Límites 3× más altos que los usuarios sin cuenta',
      'auth-reg-feat-2': 'Acceso a tu historial de operaciones',
      'auth-reg-feat-3': 'Procesamiento por lotes (subida múltiple)',
      'acc-title': 'Mi Cuenta',
      'acc-tab-info': 'Datos de la Cuenta', 'acc-tab-pay': 'Datos de Pago',
      'acc-tab-usage': 'Historial de Uso', 'acc-tab-tickets': 'Mis Solicitudes', 'acc-tab-status': 'Estado de la Cuenta',
      'acc-card-profile': 'Perfil',
      'acc-field-name': 'Nombre Completo', 'acc-field-email': 'Correo', 'acc-field-created': 'Miembro desde',
      'acc-btn-edit': 'Editar Datos', 'acc-btn-password': 'Cambiar Contraseña',
      'acc-btn-signout': 'Cerrar Sesión', 'acc-btn-delete': 'Eliminar Cuenta', 'acc-btn-save': 'Guardar',
      'acc-card-plan': 'Plan Actual',
      'acc-field-plan': 'Plan actual', 'acc-field-renew': 'Próxima renovación', 'acc-field-method': 'Método de pago guardado',
      'acc-btn-upgrade': 'Pasar a Pro →', 'acc-btn-pro': 'Pasar a Pro',
      'acc-card-payhist': 'Historial de Pagos y Facturas',
      'acc-th-date': 'Fecha', 'acc-th-amount': 'Importe', 'acc-th-method': 'Método', 'acc-th-status': 'Estado', 'acc-th-tool': 'Herramienta',
      'acc-pay-empty': 'No tienes pagos registrados.',
      'acc-card-usage': 'Últimas 5 Operaciones',
      'acc-usage-empty': 'Aún no has usado ninguna herramienta.', 'acc-usage-link': 'Explorar herramientas →',
      'acc-ticket-hint': 'Si tu problema continúa,', 'acc-ticket-hint-link': 'crea una nueva solicitud',
      'acc-ticket-empty': 'Aún no tienes solicitudes.', 'acc-ticket-empty-link': 'Escríbenos desde el formulario →',
      'acc-field-limit': 'Límite de archivo', 'acc-quota-label': 'Uso de hoy',
      'acc-coffee-title': 'Que tus archivos no esperen',
      'acc-coffee-desc': '1 mes de Pro por el precio de un café: operaciones ilimitadas, límite de 2 GB, cola prioritaria.',
    },
    de: {
      'cat-pdf-title': 'PDF-Tools', 'cat-belge-title': 'Dokument-Tools', 'cat-gorsel-title': 'Bild-Tools',
      'cat-video-title': 'Video-Tools', 'cat-ses-title': 'Audio-Tools', 'tools-title': 'Alle Tools',
      'tools-sub': 'Über 70 kostenlose Datei-Tools. Keine Anmeldung nötig.',
      'tool-drop-title': 'Dateien hierher ziehen oder klicken',
      'tool-btn-process': 'Konvertieren', 'tool-btn-reset': 'Neue Datei',
      'tool-how': 'So funktioniert es',
      'tool-s1': 'Datei Auswählen', 'tool-s1d': 'Ziehe deine Datei hierher oder klicke zum Hochladen.',
      'tool-s2': 'Im Browser Verarbeitet', 'tool-s2d': 'Deine Datei verlässt dein Gerät nicht; alles läuft im Browser.',
      'tool-s3': 'Sofort-Download', 'tool-s3d': 'Das Ergebnis wird automatisch heruntergeladen, sobald es fertig ist.',
      'tool-pro': 'Pro Werden →',
      'cat-pdf-sub': 'PDF-Dateien zusammenfügen, teilen, komprimieren, konvertieren. Alle Tools sind kostenlos.',
      'cat-belge-sub': 'Word, Excel, PPT und andere Dokumentformate konvertieren. Alle Tools sind kostenlos.',
      'cat-gorsel-sub': 'Bilder komprimieren, konvertieren, skalieren und bearbeiten. Alle Tools sind kostenlos.',
      'cat-video-sub': 'Videodateien komprimieren, konvertieren, zuschneiden und bearbeiten. Alle Tools sind kostenlos.',
      'cat-ses-sub': 'Audiodateien schneiden, konvertieren, zusammenfügen und bearbeiten. Alle Tools sind kostenlos.',
      'tools-tab-all': 'Alle',
      'tool-limit': 'Kostenlos: 50 MB/Datei · Mitglieder 200 MB',
      'tool-multi': ' · Mehrfachauswahl',
      'tool-engine': ' · Engine lädt bei erster Nutzung (~31 MB)',
      'contact-title': 'Kontakt',
      'contact-sub': 'Erreiche uns hier bei Fragen, Vorschlägen oder Tool-Anfragen.',
      'contact-name': 'Dein Name', 'contact-name-ph': 'Vor- und Nachname',
      'contact-email': 'E-Mail',
      'contact-subject': 'Betreff', 'contact-subject-ph': 'Betreff wählen',
      'contact-subject-1': 'Technisches Problem', 'contact-subject-2': 'Neue Tool-Anfrage',
      'contact-subject-3': 'Datenschutz / DSGVO', 'contact-subject-4': 'Zusammenarbeit', 'contact-subject-5': 'Sonstiges',
      'contact-message': 'Deine Nachricht', 'contact-message-ph': 'Schreibe deine Nachricht hier...',
      'contact-send': 'Senden',
      'contact-success': 'Deine Nachricht ist angekommen. Wir antworten innerhalb von 24 Stunden.',
      'contact-info-email': 'Support-E-Mail', 'contact-info-response': 'Antwortzeit',
      'contact-info-request': 'Neue Tool-Anfrage',
      'contact-info-request-desc': 'Schlage ein fehlendes Tool vor, wir prüfen es.',
      'contact-info-address': 'Adresse',
      'contact-faq-title': 'Häufige Fragen',
      'contact-faq-q1': 'Sind meine Dateien sicher?', 'contact-faq-a1': 'Ja. Sie werden 1 Stunde nach der Verarbeitung automatisch gelöscht.',
      'contact-faq-q2': 'Kann ich es ohne Registrierung nutzen?', 'contact-faq-a2': 'Ja. Alle Basis-Tools funktionieren ohne Konto.',
      'contact-faq-q3': 'Gibt es ein Dateigrößen-Limit?', 'contact-faq-a3': '50 MB ohne Konto, 200 MB für Mitglieder.',
      'odeme-title': 'Wähle den passenden Plan',
      'odeme-sub': 'Alle Basis-Tools sind für immer kostenlos. Mit Pro fallen die Limits weg.',
      'billing-monthly': 'Monatlich', 'billing-yearly': 'Jährlich', 'billing-save': '25% Rabatt',
      'plan-free-name': 'Kostenlos', 'plan-pro-name': 'Pro', 'plan-business-name': 'Business',
      'plan-popular': 'Am Beliebtesten',
      'plan-free-desc': 'Basis-Tools für den Alltag.',
      'plan-pro-desc': 'Unbegrenzte Power für Vielnutzer.',
      'plan-business-desc': 'Für Teams und intensive Nutzung.',
      'plan-free-btn': 'Kostenlos Nutzen', 'plan-pro-btn': 'Pro Werden', 'plan-business-btn': 'Business Werden',
      'plan-feat-1': 'Zugriff auf über 70 Tools', 'plan-feat-2': '50 MB Datei-Limit',
      'plan-feat-3': '10 Vorgänge pro Tag', 'plan-feat-4': 'Dateien werden nach 1 Stunde gelöscht',
      'plan-feat-5': 'Unbegrenzte Vorgänge', 'plan-feat-6': '2 GB Datei-Limit',
      'plan-feat-7': 'Priorisierte Warteschlange', 'plan-feat-8': 'Stapelverarbeitung',
      'plan-feat-9': 'Werbefreie Nutzung', 'plan-feat-10': 'Alles aus Pro',
      'plan-feat-11': '5 Nutzer', 'plan-feat-12': '10 GB Datei-Limit',
      'plan-feat-13': 'API-Zugriff', 'plan-feat-14': 'Priorisierter Support',
      'odeme-checkout-title': 'Zahlungsdaten',
      'odeme-method-card': 'Kredit- / Bankkarte', 'odeme-method-transfer': 'Überweisung',
      'odeme-card-name': 'Name auf der Karte', 'odeme-card-number': 'Kartennummer', 'odeme-card-expiry': 'Gültig bis',
      'odeme-pay-btn': 'Zahlung Abschließen',
      'odeme-sandbox': 'Testmodus: Diese Zahlungsseite läuft im Sandbox-Modus; deine Karte wird nicht belastet. Testkarte: 4242 4242 4242 4242',
      'odeme-transfer-btn': 'Überweisungshinweis Senden',
      'odeme-summary-title': 'Bestellübersicht',
      'odeme-sum-plan': 'Plan', 'odeme-sum-period': 'Zeitraum', 'odeme-sum-vat': 'MwSt. (20%)', 'odeme-sum-total': 'Gesamt',
      'auth-login-title': 'In dein Konto einloggen',
      'auth-login-sub': 'Willkommen zurück. Melde dich an, um fortzufahren.',
      'auth-google-login': 'Mit Gmail Anmelden',
      'auth-or': 'oder', 'auth-or-email': 'oder per E-Mail',
      'auth-email': 'E-Mail-Adresse', 'auth-password': 'Passwort',
      'auth-forgot': 'Passwort Vergessen', 'auth-login-btn': 'Anmelden',
      'auth-no-account': 'Noch kein Konto?', 'auth-register-link': 'Registrieren',
      'auth-brand-login': 'Verwalte deine Dateien sicher',
      'auth-feat-1': 'Über 70 kostenlose Tools, keine Anmeldung nötig',
      'auth-feat-2': 'Dateien werden nach der Verarbeitung automatisch gelöscht',
      'auth-feat-3': 'Funktioniert auf Handy, Tablet und Desktop',
      'auth-feat-4': 'Höhere Datei-Limits für Mitglieder',
      'auth-register-title': 'Konto erstellen',
      'auth-register-sub': 'Kostenlos, schnell, sicher. Keine Kreditkarte nötig.',
      'auth-google-register': 'Mit Gmail Registrieren',
      'auth-fullname': 'Vor- und Nachname', 'auth-fullname-ph': 'Vor- und Nachname',
      'auth-password-min-ph': 'Mindestens 8 Zeichen',
      'auth-register-btn': 'Konto Erstellen',
      'auth-hint': 'Du erhältst einen Bestätigungslink per E-Mail.',
      'auth-have-account': 'Schon ein Konto?', 'auth-login-link': 'Anmelden',
      'auth-brand-register': 'Kostenloses Konto eröffnen, Limits erhöhen',
      'auth-reg-feat-1': '3× höhere Limits als Gastnutzer',
      'auth-reg-feat-2': 'Zugriff auf deinen Verlauf',
      'auth-reg-feat-3': 'Stapelverarbeitung (Mehrfach-Upload)',
      'acc-title': 'Mein Konto',
      'acc-tab-info': 'Kontodaten', 'acc-tab-pay': 'Zahlungsdaten',
      'acc-tab-usage': 'Nutzungsverlauf', 'acc-tab-tickets': 'Meine Anfragen', 'acc-tab-status': 'Kontostatus',
      'acc-card-profile': 'Profil',
      'acc-field-name': 'Vor- und Nachname', 'acc-field-email': 'E-Mail', 'acc-field-created': 'Mitglied seit',
      'acc-btn-edit': 'Daten Bearbeiten', 'acc-btn-password': 'Passwort Ändern',
      'acc-btn-signout': 'Abmelden', 'acc-btn-delete': 'Konto Löschen', 'acc-btn-save': 'Speichern',
      'acc-card-plan': 'Aktueller Plan',
      'acc-field-plan': 'Aktueller Plan', 'acc-field-renew': 'Nächste Verlängerung', 'acc-field-method': 'Hinterlegte Zahlungsmethode',
      'acc-btn-upgrade': 'Pro Werden →', 'acc-btn-pro': 'Pro Werden',
      'acc-card-payhist': 'Zahlungsverlauf & Rechnungen',
      'acc-th-date': 'Datum', 'acc-th-amount': 'Betrag', 'acc-th-method': 'Methode', 'acc-th-status': 'Status', 'acc-th-tool': 'Tool',
      'acc-pay-empty': 'Keine Zahlungen vorhanden.',
      'acc-card-usage': 'Letzte 5 Vorgänge',
      'acc-usage-empty': 'Du hast noch kein Tool genutzt.', 'acc-usage-link': 'Tools entdecken →',
      'acc-ticket-hint': 'Besteht dein Problem weiterhin,', 'acc-ticket-hint-link': 'erstelle eine neue Anfrage',
      'acc-ticket-empty': 'Noch keine Anfragen.', 'acc-ticket-empty-link': 'Über das Kontaktformular schreiben →',
      'acc-field-limit': 'Datei-Limit', 'acc-quota-label': 'Heutige Nutzung',
      'acc-coffee-title': 'Lass deine Dateien nicht warten',
      'acc-coffee-desc': '1 Monat Pro zum Preis eines Kaffees: unbegrenzte Vorgänge, 2 GB Datei-Limit, priorisierte Warteschlange.',
    },
    fr: {
      'cat-pdf-title': 'Outils PDF', 'cat-belge-title': 'Outils Documents', 'cat-gorsel-title': "Outils d'Image",
      'cat-video-title': 'Outils Vidéo', 'cat-ses-title': 'Outils Audio', 'tools-title': 'Tous les Outils',
      'tools-sub': 'Plus de 70 outils gratuits. Sans inscription.',
      'tool-drop-title': 'Glissez vos fichiers ici ou cliquez',
      'tool-btn-process': 'Convertir', 'tool-btn-reset': 'Nouveau Fichier',
      'tool-how': 'Comment ça marche ?',
      'tool-s1': 'Choisissez le Fichier', 'tool-s1d': 'Glissez-déposez ou cliquez pour téléverser votre fichier.',
      'tool-s2': 'Traité dans le Navigateur', 'tool-s2d': 'Votre fichier ne quitte pas votre appareil ; tout se passe dans le navigateur.',
      'tool-s3': 'Téléchargement Immédiat', 'tool-s3d': 'Le résultat se télécharge automatiquement dès qu\'il est prêt.',
      'tool-pro': 'Passer Pro →',
      'cat-pdf-sub': 'Fusionnez, divisez, compressez et convertissez des PDF. Tous les outils sont gratuits.',
      'cat-belge-sub': 'Convertissez Word, Excel, PPT et d’autres formats de documents. Tous les outils sont gratuits.',
      'cat-gorsel-sub': 'Compressez, convertissez, redimensionnez et modifiez des images. Tous les outils sont gratuits.',
      'cat-video-sub': 'Compressez, convertissez, découpez et modifiez des vidéos. Tous les outils sont gratuits.',
      'cat-ses-sub': 'Coupez, convertissez, fusionnez et modifiez des fichiers audio. Tous les outils sont gratuits.',
      'tools-tab-all': 'Tous',
      'tool-limit': 'Gratuit : 50 Mo/fichier · Membres 200 Mo',
      'tool-multi': ' · Sélection multiple',
      'tool-engine': ' · Le moteur se charge à la première utilisation (~31 Mo)',
      'contact-title': 'Contact',
      'contact-sub': 'Contactez-nous ici pour vos questions, suggestions ou demandes d’outils.',
      'contact-name': 'Votre nom', 'contact-name-ph': 'Nom et prénom',
      'contact-email': 'E-mail',
      'contact-subject': 'Objet', 'contact-subject-ph': 'Choisissez un objet',
      'contact-subject-1': 'Problème technique', 'contact-subject-2': 'Demande d’un nouvel outil',
      'contact-subject-3': 'Confidentialité / RGPD', 'contact-subject-4': 'Partenariat', 'contact-subject-5': 'Autre',
      'contact-message': 'Votre message', 'contact-message-ph': 'Écrivez votre message ici...',
      'contact-send': 'Envoyer',
      'contact-success': 'Votre message a été reçu. Nous répondons sous 24 heures.',
      'contact-info-email': 'E-mail du support', 'contact-info-response': 'Délai de réponse',
      'contact-info-request': 'Demande d’un nouvel outil',
      'contact-info-request-desc': 'Proposez l’outil manquant et nous l’étudierons.',
      'contact-info-address': 'Adresse',
      'contact-faq-title': 'Questions fréquentes',
      'contact-faq-q1': 'Mes fichiers sont-ils en sécurité ?', 'contact-faq-a1': 'Oui. Ils sont supprimés automatiquement dans l’heure suivant le traitement.',
      'contact-faq-q2': 'Puis-je utiliser le service sans inscription ?', 'contact-faq-a2': 'Oui. Tous les outils essentiels fonctionnent sans compte.',
      'contact-faq-q3': 'Existe-t-il une limite de taille ?', 'contact-faq-a3': '50 Mo sans compte, 200 Mo pour les membres.',
      'odeme-title': 'Choisissez le forfait qui vous convient',
      'odeme-sub': 'Tous les outils essentiels restent gratuits. Supprimez les limites avec Pro.',
      'billing-monthly': 'Mensuel', 'billing-yearly': 'Annuel', 'billing-save': '25 % de réduction',
      'plan-free-name': 'Gratuit', 'plan-pro-name': 'Pro', 'plan-business-name': 'Business',
      'plan-popular': 'Le plus populaire',
      'plan-free-desc': 'Les outils essentiels au quotidien.',
      'plan-pro-desc': 'Une puissance illimitée pour les usages fréquents.',
      'plan-business-desc': 'Pour les équipes et les usages intensifs.',
      'plan-free-btn': 'Utiliser gratuitement', 'plan-pro-btn': 'Passer à Pro', 'plan-business-btn': 'Passer à Business',
      'plan-feat-1': 'Accès à plus de 70 outils', 'plan-feat-2': 'Limite de 50 Mo par fichier',
      'plan-feat-3': '10 opérations par jour', 'plan-feat-4': 'Fichiers supprimés après 1 heure',
      'plan-feat-5': 'Opérations illimitées', 'plan-feat-6': 'Limite de 2 Go par fichier',
      'plan-feat-7': 'File de traitement prioritaire', 'plan-feat-8': 'Traitement par lot',
      'plan-feat-9': 'Expérience sans publicité', 'plan-feat-10': 'Tout ce qui est inclus dans Pro',
      'plan-feat-11': '5 utilisateurs', 'plan-feat-12': 'Limite de 10 Go par fichier',
      'plan-feat-13': 'Accès API', 'plan-feat-14': 'Support prioritaire',
      'odeme-checkout-title': 'Informations de paiement',
      'odeme-method-card': 'Carte bancaire', 'odeme-method-transfer': 'Virement bancaire',
      'odeme-card-name': 'Nom sur la carte', 'odeme-card-number': 'Numéro de carte', 'odeme-card-expiry': 'Expiration',
      'odeme-pay-btn': 'Finaliser le paiement',
      'odeme-sandbox': 'Mode test : ce paiement fonctionne en environnement de test ; aucun débit réel ne sera effectué. Carte test : 4242 4242 4242 4242',
      'odeme-transfer-btn': 'Envoyer l’avis de virement',
      'odeme-summary-title': 'Récapitulatif de commande',
      'odeme-sum-plan': 'Forfait', 'odeme-sum-period': 'Période', 'odeme-sum-vat': 'TVA (20 %)', 'odeme-sum-total': 'Total',
      'auth-login-title': 'Connectez-vous à votre compte',
      'auth-login-sub': 'Bon retour. Connectez-vous pour continuer.',
      'auth-google-login': 'Se connecter avec Gmail',
      'auth-or': 'ou', 'auth-or-email': 'ou avec un e-mail',
      'auth-email': 'Adresse e-mail', 'auth-password': 'Mot de passe',
      'auth-forgot': 'Mot de passe oublié', 'auth-login-btn': 'Se connecter',
      'auth-no-account': 'Vous n’avez pas de compte ?', 'auth-register-link': 'S’inscrire',
      'auth-brand-login': 'Gérez vos fichiers en toute confiance',
      'auth-feat-1': 'Plus de 70 outils gratuits, sans inscription',
      'auth-feat-2': 'Les fichiers sont supprimés automatiquement après traitement',
      'auth-feat-3': 'Fonctionne sur téléphone, tablette et ordinateur',
      'auth-feat-4': 'Limites de fichiers supérieures pour les membres',
      'auth-register-title': 'Créer un compte',
      'auth-register-sub': 'Gratuit, rapide et sûr. Aucune carte bancaire requise.',
      'auth-google-register': 'S’inscrire avec Gmail',
      'auth-fullname': 'Nom et prénom', 'auth-fullname-ph': 'Votre nom complet',
      'auth-password-min-ph': 'Au moins 8 caractères',
      'auth-register-btn': 'Créer le compte',
      'auth-hint': 'Un lien de vérification sera envoyé à votre adresse e-mail.',
      'auth-have-account': 'Vous avez déjà un compte ?', 'auth-login-link': 'Se connecter',
      'auth-brand-register': 'Créez un compte gratuit et augmentez les limites',
      'auth-reg-feat-1': 'Limites 3× supérieures à celles d’un visiteur',
      'auth-reg-feat-2': 'Accès à l’historique des traitements',
      'auth-reg-feat-3': 'Traitement par lot (envoi multiple)',
      'acc-title': 'Mon compte',
      'acc-tab-info': 'Informations du compte', 'acc-tab-pay': 'Informations de paiement',
      'acc-tab-usage': 'Historique d’utilisation', 'acc-tab-tickets': 'Mes demandes', 'acc-tab-status': 'État du compte',
      'acc-card-profile': 'Profil',
      'acc-field-name': 'Nom et prénom', 'acc-field-email': 'E-mail', 'acc-field-created': 'Membre depuis',
      'acc-btn-edit': 'Modifier les informations', 'acc-btn-password': 'Changer le mot de passe',
      'acc-btn-signout': 'Se déconnecter', 'acc-btn-delete': 'Supprimer le compte', 'acc-btn-save': 'Enregistrer',
      'acc-card-plan': 'Forfait actuel',
      'acc-field-plan': 'Forfait actuel', 'acc-field-renew': 'Prochain renouvellement', 'acc-field-method': 'Moyen de paiement enregistré',
      'acc-btn-upgrade': 'Passer à Pro →', 'acc-btn-pro': 'Passer à Pro',
      'acc-card-payhist': 'Historique des paiements et factures',
      'acc-th-date': 'Date', 'acc-th-amount': 'Montant', 'acc-th-method': 'Moyen', 'acc-th-status': 'Statut', 'acc-th-tool': 'Outil',
      'acc-pay-empty': 'Aucun paiement enregistré.',
      'acc-card-usage': '5 dernières opérations',
      'acc-usage-empty': 'Vous n’avez encore utilisé aucun outil.', 'acc-usage-link': 'Découvrir les outils →',
      'acc-ticket-hint': 'Si le problème persiste,', 'acc-ticket-hint-link': 'créer une nouvelle demande',
      'acc-ticket-empty': 'Aucune demande pour le moment.', 'acc-ticket-empty-link': 'Écrire via le formulaire de contact →',
      'acc-field-limit': 'Limite de fichier', 'acc-quota-label': 'Utilisation du jour',
      'acc-coffee-title': 'Ne faites pas attendre vos fichiers',
      'acc-coffee-desc': '1 mois de Pro pour le prix d’un café : opérations illimitées, limite de 2 Go et file prioritaire.',
    },
  };
  Object.entries(EXTRA).forEach(([l, d]) => Object.assign(T[l], d));

  /* ── Araç adı çevirici (kelime + kalıp tabanlı) ──
     TR araç adlarını EN/ES/DE/FR'ye çevirir. data-tool-name işaretli
     öğelerde kullanılır; eşleşme yoksa TR ad korunur. */
  const W = { /* kelime: [en, es, de, fr] */
    'PDF': ['PDF','PDF','PDF','PDF'], 'Görsel': ['Image','Imagen','Bild','Image'],
    'Video': ['Video','Vídeo','Video','Vidéo'], 'Ses': ['Audio','Audio','Audio','Audio'],
    'Belge': ['Document','Documento','Dokument','Document'], 'Word': ['Word','Word','Word','Word'],
    'Excel': ['Excel','Excel','Excel','Excel'],
  };
  const V = { /* eylem: [en, es, de, fr] — fiil önce (DE: sonda) */
    'Birleştir': ['Merge','Unir','Zusammenfügen','Fusionner'],
    'Sıkıştır': ['Compress','Comprimir','Komprimieren','Compresser'],
    'Böl': ['Split','Dividir','Teilen','Diviser'],
    'Döndür': ['Rotate','Rotar','Drehen','Pivoter'],
    'Kes': ['Trim','Recortar','Schneiden','Couper'],
    'Kırp': ['Crop','Recortar','Zuschneiden','Rogner'],
    'Boyutlandır': ['Resize','Redimensionar','Skalieren','Redimensionner'],
    'Kilitle': ['Protect','Proteger','Schützen','Protéger'],
    'Filigran': ['Watermark','Marca de Agua','Wasserzeichen','Filigrane'],
    'Dönüştür': ['Convert','Convertir','Konvertieren','Convertir'],
    'Keskinleştir': ['Sharpen','Enfocar','Schärfen','Accentuer'],
    'Güçlendir': ['Boost','Amplificar','Verstärken','Amplifier'],
    'Normalize': ['Normalize','Normalizar','Normalisieren','Normaliser'],
    'Kesici': ['Cutter','Cortador','Schneider','Découpeur'],
  };
  const PHRASES = { /* düzensiz tam adlar */
    'Sayfaları Düzenle': ['Organize Pages','Organizar Páginas','Seiten Ordnen','Organiser les Pages'],
    'PDF Koruma Kaldır': ['Unlock PDF','Desbloquear PDF','PDF Entsperren','Déverrouiller PDF'],
    'OCR ile Metin Çıkar': ['OCR Text Extract','OCR Extraer Texto','OCR Texterkennung','OCR Extraire Texte'],
    'Arka Plan Kaldır': ['Remove Background','Quitar Fondo','Hintergrund Entfernen','Supprimer le Fond'],
    'Renk Ayarla': ['Adjust Colors','Ajustar Colores','Farben Anpassen','Régler les Couleurs'],
    'Görselden PDF': ['Image to PDF','Imagen a PDF','Bild zu PDF','Image en PDF'],
    'Hızlandır / Yavaşlat': ['Speed Up / Slow Down','Acelerar / Ralentizar','Beschleunigen / Verlangsamen','Accélérer / Ralentir'],
    'Karelere Böl': ['Extract Frames','Extraer Fotogramas','Frames Extrahieren','Extraire les Images'],
    'Videodan Sesi Kaldır': ['Remove Audio from Video','Quitar Audio del Vídeo','Ton aus Video Entfernen','Supprimer l\'Audio'],
    'Altyazı Ekle': ['Add Subtitles','Añadir Subtítulos','Untertitel Hinzufügen','Ajouter des Sous-titres'],
    'Gürültü Kaldır': ['Remove Noise','Quitar Ruido','Rauschen Entfernen','Supprimer le Bruit'],
    'Ses Hızı Değiştir': ['Change Audio Speed','Cambiar Velocidad','Audio-Tempo Ändern','Changer la Vitesse'],
    'Metinden Sese (TTS)': ['Text to Speech (TTS)','Texto a Voz (TTS)','Text zu Sprache (TTS)','Texte en Parole (TTS)'],
    'Sesten Metne (STT)': ['Speech to Text (STT)','Voz a Texto (STT)','Sprache zu Text (STT)','Parole en Texte (STT)'],
    'Filigran Ekle': ['Add Watermark','Añadir Marca de Agua','Wasserzeichen Hinzufügen','Ajouter un Filigrane'],
  };
  const LI = { en: 0, es: 1, de: 2, fr: 3 };
  const CONV = { /* "A'dan B'ye" kalıbı */
    en: (a, b) => a + ' to ' + b, es: (a, b) => a + ' a ' + b,
    de: (a, b) => a + ' zu ' + b, fr: (a, b) => a + ' en ' + b,
  };

  function fjToolName(tr, lang) {
    if (lang === 'tr' || LI[lang] === undefined) return tr;
    const i = LI[lang];
    if (PHRASES[tr]) return PHRASES[tr][i];
    /* Dönüşüm kalıbı: X'den Y / X'ten Y'ye / X'dan Y */
    const m = tr.match(/^(.+?)'[dt][ae]n\s+(.+?)(?:'[yn]?[ae])?$/);
    if (m) {
      const from = W[m[1]] ? W[m[1]][i] : m[1];
      const to = W[m[2]] ? W[m[2]][i] : m[2];
      return CONV[lang](from, to);
    }
    /* [nesne] [eylem] kalıbı */
    const parts = tr.split(' ');
    if (parts.length === 2 && V[parts[1]]) {
      const noun = W[parts[0]] ? W[parts[0]][i] : parts[0];
      const verb = V[parts[1]][i];
      return lang === 'de' ? noun + ' ' + verb : verb + ' ' + noun;
    }
    return tr;
  }
  window.fjToolName = fjToolName;

  const LANG_NAMES = { tr: 'Türkçe', en: 'English', es: 'Español', de: 'Deutsch', fr: 'Français' };
  const AUTO_INDEX = { en: 0, es: 1, de: 2, fr: 3 };
  const AUTO_CATALOG = {
    'Ana Sayfa': ['Home','Inicio','Startseite','Accueil'],
    'Dosyalar güvende': ['Files are secure','Archivos seguros','Dateien sind sicher','Fichiers sécurisés'],
    'Tarayıcıda işlenir': ['Processed in your browser','Procesado en el navegador','Im Browser verarbeitet','Traité dans le navigateur'],
    'Kayıt gerekmez': ['No sign-up required','Sin registro','Keine Anmeldung nötig','Sans inscription'],
    'Araç ara': ['Search tools','Buscar herramientas','Tools suchen','Rechercher des outils'],
    'Araçlar': ['Tools','Herramientas','Tools','Outils'],
    'Hesabım': ['My Account','Mi Cuenta','Mein Konto','Mon Compte'],
    'Ücretsiz:': ['Free:','Gratis:','Kostenlos:','Gratuit :'],
    '/dosya · Üyelere': ['/file · Members','/archivo · Miembros','/Datei · Mitglieder','/fichier · Membres'],
    'Çoklu seçim': ['Multiple selection','Selección múltiple','Mehrfachauswahl','Sélection multiple'],
    'GÖRSEL': ['IMAGE','IMAGEN','BILD','IMAGE'],
    'BELGE': ['DOCUMENT','DOCUMENTO','DOKUMENT','DOCUMENT'],
    'VIDEO': ['VIDEO','VÍDEO','VIDEO','VIDÉO'],
    'SES': ['AUDIO','AUDIO','AUDIO','AUDIO'],
    'İlk kullanımda motor yüklenir (~31 MB)': ['Engine loads on first use (~31 MB)','El motor se carga la primera vez (~31 MB)','Engine lädt bei der ersten Nutzung (~31 MB)','Le moteur se charge à la première utilisation (~31 Mo)'],
    'Dosya Seç': ['Choose File','Elegir archivo','Datei wählen','Choisir un fichier'],
    'Dosyayı buraya bırak': ['Drop the file here','Suelta el archivo aquí','Datei hier ablegen','Déposez le fichier ici'],
    'Açık temaya geç': ['Switch to light theme','Cambiar al tema claro','Zum hellen Design wechseln','Passer au thème clair'],
    'Koyu temaya geç': ['Switch to dark theme','Cambiar al tema oscuro','Zum dunklen Design wechseln','Passer au thème sombre'],
    'Menüyü aç': ['Open menu','Abrir menú','Menü öffnen','Ouvrir le menu'],
    'Dil seç': ['Choose language','Elegir idioma','Sprache wählen','Choisir la langue'],
    'FormatJet hazırlanıyor': ['Preparing FormatJet','Preparando FormatJet','FormatJet wird vorbereitet','Préparation de FormatJet'],
    'Bir sorun oluştu': ['Something went wrong','Algo salió mal','Etwas ist schiefgelaufen','Un problème est survenu'],
    'İşlem tamamlandı': ['Operation completed','Operación completada','Vorgang abgeschlossen','Opération terminée'],
    'Vazgeç': ['Cancel','Cancelar','Abbrechen','Annuler'],
    'Onayla': ['Confirm','Confirmar','Bestätigen','Confirmer'],
    'Bu işlemi onayla': ['Confirm this action','Confirma esta acción','Diesen Vorgang bestätigen','Confirmer cette action'],
    'Devam etmek istediğine emin misin?': ['Are you sure you want to continue?','¿Seguro que quieres continuar?','Möchtest du wirklich fortfahren?','Voulez-vous vraiment continuer ?'],
    'Dönüştürme başarısız': ['Conversion failed','La conversión falló','Konvertierung fehlgeschlagen','Échec de la conversion'],
    'Yüklenemedi:': ['Could not load:','No se pudo cargar:','Laden fehlgeschlagen:','Chargement impossible :'],
    'Metin tanınıyor:': ['Recognizing text:','Reconociendo texto:','Text wird erkannt:','Reconnaissance du texte :'],
    'Dönüştürme aşamaları': ['Conversion stages','Etapas de conversión','Konvertierungsschritte','Étapes de conversion'],
    'İşleniyor:': ['Processing:','Procesando:','Verarbeitung:','Traitement :'],
    'işleniyor...': ['processing...','procesando...','wird verarbeitet...','traitement...'],
    'İşlem öncesi': ['Before processing','Antes del procesamiento','Vor der Verarbeitung','Avant traitement'],
    'İşlem sonrası': ['After processing','Después del procesamiento','Nach der Verarbeitung','Après traitement'],
    'Önce ve sonra karşılaştırması': ['Before and after comparison','Comparación antes y después','Vorher-Nachher-Vergleich','Comparaison avant/après'],
    'FFmpeg çekirdeği yükleniyor (~31 MB, tek seferlik)...': ['Loading FFmpeg engine (~31 MB, one time)...','Cargando el motor FFmpeg (~31 MB, una vez)...','FFmpeg-Engine wird geladen (~31 MB, einmalig)...','Chargement du moteur FFmpeg (~31 Mo, une fois)...'],
    'AI modeli yükleniyor (ilk kullanımda ~40 MB indirilir)...': ['Loading AI model (~40 MB on first use)...','Cargando el modelo de IA (~40 MB la primera vez)...','KI-Modell wird geladen (~40 MB beim ersten Mal)...','Chargement du modèle IA (~40 Mo à la première utilisation)...'],
    'OCR modeli hazırlanıyor...': ['Preparing OCR model...','Preparando el modelo OCR...','OCR-Modell wird vorbereitet...','Préparation du modèle OCR...'],
    'Şifreli bağlantı': ['Encrypted connection','Conexión cifrada','Verschlüsselte Verbindung','Connexion chiffrée'],
    'Gizli işlem': ['Private processing','Procesamiento privado','Private Verarbeitung','Traitement privé'],
    'Güvenli oturum': ['Secure session','Sesión segura','Sichere Sitzung','Session sécurisée'],
    'Otomatik silme': ['Automatic deletion','Eliminación automática','Automatische Löschung','Suppression automatique'],
    'Henüz girilmedi': ['Not entered yet','Aún no introducida','Noch nicht eingegeben','Pas encore saisi'],
    'Zayıf': ['Weak','Débil','Schwach','Faible'],
    'Güçlü': ['Strong','Fuerte','Stark','Fort'],
    'Çok güçlü': ['Very strong','Muy fuerte','Sehr stark','Très fort'],
    'Doğrulama Kodunu Gir': ['Enter Verification Code','Introduce el código','Bestätigungscode eingeben','Saisir le code de vérification'],
    'Mesaj hazırlığı': ['Message readiness','Preparación del mensaje','Nachricht vorbereiten','Préparation du message'],
    '4 kısa adım': ['4 quick steps','4 pasos rápidos','4 kurze Schritte','4 étapes rapides'],
    'Başlamaya hazır': ['Ready to start','Listo para empezar','Startbereit','Prêt à commencer'],
    'İyi başladın': ['Good start','Buen comienzo','Guter Anfang','Bon début'],
    'Neredeyse hazır': ['Almost ready','Casi listo','Fast fertig','Presque prêt'],
    'Göndermeye hazır': ['Ready to send','Listo para enviar','Bereit zum Senden','Prêt à envoyer'],
    'alan tamamlandı': ['fields completed','campos completados','Felder ausgefüllt','champs remplis'],
    'Eşleşen araç bulunamadı.': ['No matching tools found.','No se encontraron herramientas.','Keine passenden Tools gefunden.','Aucun outil correspondant.'],
    '↑ ↓ seç · Enter aç': ['↑ ↓ select · Enter to open','↑ ↓ elegir · Enter para abrir','↑ ↓ wählen · Enter öffnet','↑ ↓ choisir · Entrée pour ouvrir'],
    'Günlük kullanım': ['Daily usage','Uso diario','Tägliche Nutzung','Utilisation quotidienne'],
    'Veriler hazırlanıyor': ['Preparing data','Preparando datos','Daten werden vorbereitet','Préparation des données'],
    'Aktif dosya limiti': ['Active file limit','Límite de archivo activo','Aktives Dateilimit','Limite de fichier active'],
    'Plan bilgisi hazırlanıyor': ['Preparing plan details','Preparando el plan','Plandaten werden vorbereitet','Préparation du forfait'],
    'Kart Sahibi': ['Cardholder','Titular','Karteninhaber','Titulaire'],
    'AD SOYAD': ['FULL NAME','NOMBRE COMPLETO','VOLLSTÄNDIGER NAME','NOM COMPLET'],
    'AA/YY': ['MM/YY','MM/AA','MM/JJ','MM/AA'],
    'Şifreni mi unuttun?': ['Forgot your password?','¿Olvidaste tu contraseña?','Passwort vergessen?','Mot de passe oublié ?'],
    'Sorun değil.': ['No problem.','No hay problema.','Kein Problem.','Pas de problème.'],
    'E-posta adresine sıfırlama bağlantısı göndeririz': ['We will email you a reset link','Te enviaremos un enlace por correo','Wir senden dir einen Link per E-Mail','Nous vous enverrons un lien par e-mail'],
    'Bağlantı 1 saat geçerlidir': ['The link is valid for 1 hour','El enlace es válido 1 hora','Der Link ist 1 Stunde gültig','Le lien est valable 1 heure'],
    'Hesap bilgilerin güvende kalır': ['Your account stays secure','Tu cuenta permanece segura','Dein Konto bleibt sicher','Votre compte reste sécurisé'],
    'Şifreni sıfırla': ['Reset your password','Restablece tu contraseña','Passwort zurücksetzen','Réinitialiser le mot de passe'],
    'Kayıtlı e-posta adresini gir, sıfırlama bağlantısı gönderelim.': ['Enter your registered email and we will send a reset link.','Introduce tu correo registrado y te enviaremos un enlace.','Gib deine registrierte E-Mail ein; wir senden dir einen Link.','Saisissez votre e-mail enregistré pour recevoir un lien.'],
    'Sıfırlama Bağlantısı Gönder': ['Send Reset Link','Enviar enlace','Link senden','Envoyer le lien'],
    'Şifreni hatırladın mı?': ['Remembered your password?','¿Recordaste tu contraseña?','Passwort wieder eingefallen?','Vous vous souvenez du mot de passe ?'],
    'Yeni şifreni belirle': ['Set your new password','Define tu nueva contraseña','Neues Passwort festlegen','Définir votre nouveau mot de passe'],
    'En az 8 karakter kullan': ['Use at least 8 characters','Usa al menos 8 caracteres','Mindestens 8 Zeichen verwenden','Utilisez au moins 8 caractères'],
    'Harf, rakam ve sembol karışımı öneririz': ['Use a mix of letters, numbers and symbols','Combina letras, números y símbolos','Buchstaben, Zahlen und Symbole kombinieren','Mélangez lettres, chiffres et symboles'],
    'Yeni şifre': ['New password','Nueva contraseña','Neues Passwort','Nouveau mot de passe'],
    'Hesabın için yeni bir şifre belirle.': ['Set a new password for your account.','Define una nueva contraseña para tu cuenta.','Lege ein neues Passwort für dein Konto fest.','Définissez un nouveau mot de passe pour votre compte.'],
    'Yeni şifre (tekrar)': ['Repeat new password','Repite la contraseña','Neues Passwort wiederholen','Répéter le mot de passe'],
    'Şifreyi Güncelle': ['Update Password','Actualizar contraseña','Passwort aktualisieren','Mettre à jour le mot de passe'],
    'Giriş sayfasına dön': ['Back to sign in','Volver al inicio de sesión','Zur Anmeldung','Retour à la connexion'],
    'Hesabın için son güvenlik adımı': ['The final security step for your account','El último paso de seguridad','Der letzte Sicherheitsschritt','La dernière étape de sécurité'],
    '6 haneli, tek kullanımlık güvenlik kodu': ['A 6-digit, one-time security code','Código de seguridad de 6 dígitos','Einmaliger 6-stelliger Sicherheitscode','Code de sécurité à 6 chiffres'],
    'Kod yalnızca e-posta adresine gönderilir': ['The code is sent only to your email','El código solo se envía a tu correo','Der Code wird nur per E-Mail gesendet','Le code est envoyé uniquement par e-mail'],
    'Güvenli ve hızlı hesap doğrulaması': ['Secure and fast account verification','Verificación segura y rápida','Sichere und schnelle Bestätigung','Vérification rapide et sécurisée'],
    'Doğrulama sonrası doğrudan hesabına geçiş': ['Go straight to your account after verification','Acceso directo tras verificar','Nach der Bestätigung direkt zum Konto','Accès direct au compte après vérification'],
    'Doğrulama kodunu gir': ['Enter the verification code','Introduce el código','Bestätigungscode eingeben','Saisissez le code'],
    'Kod gelmedi mi?': ['Did not receive the code?','¿No recibiste el código?','Code nicht erhalten?','Code non reçu ?'],
    'Tekrar gönder (': ['Resend (','Reenviar (','Erneut senden (','Renvoyer ('],
    'Hesabın doğrulandı. Yönlendiriliyorsun…': ['Account verified. Redirecting…','Cuenta verificada. Redirigiendo…','Konto bestätigt. Weiterleitung…','Compte vérifié. Redirection…'],
    'Kodu Doğrula': ['Verify Code','Verificar código','Code bestätigen','Vérifier le code'],
    'Farklı bir adres mi kullandın?': ['Used a different address?','¿Usaste otro correo?','Andere Adresse verwendet?','Une autre adresse ?'],
    'Yeniden kayıt ol': ['Sign up again','Registrarse de nuevo','Erneut registrieren','Se réinscrire'],
    'Herkes için ücretsiz dosya araçları': ['Free file tools for everyone','Herramientas gratuitas para todos','Kostenlose Datei-Tools für alle','Outils de fichiers gratuits pour tous'],
    'Misyonumuz': ['Our Mission','Nuestra misión','Unsere Mission','Notre mission'],
    'Değerlerimiz': ['Our Values','Nuestros valores','Unsere Werte','Nos valeurs'],
    'Gizlilik': ['Privacy','Privacidad','Datenschutz','Confidentialité'],
    'Hız': ['Speed','Velocidad','Geschwindigkeit','Rapidité'],
    'Basitlik': ['Simplicity','Simplicidad','Einfachheit','Simplicité'],
    'Erişilebilirlik': ['Accessibility','Accesibilidad','Zugänglichkeit','Accessibilité'],
    'Sormak istediğiniz bir şey mi var?': ['Have a question?','¿Tienes alguna pregunta?','Noch Fragen?','Une question ?'],
    'İletişime Geç': ['Contact Us','Contactar','Kontakt aufnehmen','Nous contacter'],
    'Aylık aktif kullanıcı': ['Monthly active users','Usuarios activos mensuales','Monatlich aktive Nutzer','Utilisateurs actifs mensuels'],
    'Ücretsiz araç': ['Free tools','Herramientas gratuitas','Kostenlose Tools','Outils gratuits'],
    'Ülkeden kullanıcı': ['Countries represented','Países representados','Länder vertreten','Pays représentés'],
    'Çalışma süresi': ['Uptime','Disponibilidad','Verfügbarkeit','Disponibilité'],
    'Sık Sorulan Sorular': ['Frequently Asked Questions','Preguntas frecuentes','Häufig gestellte Fragen','Questions fréquentes'],
    'Güvenlik ve Gizlilik': ['Security & Privacy','Seguridad y privacidad','Sicherheit & Datenschutz','Sécurité et confidentialité'],
    'Kullanım ve Limitler': ['Usage & Limits','Uso y límites','Nutzung & Limits','Utilisation et limites'],
    'Planlar ve Ödeme': ['Plans & Billing','Planes y pago','Tarife & Zahlung','Forfaits et paiement'],
    'Sorun Giderme': ['Troubleshooting','Solución de problemas','Fehlerbehebung','Dépannage'],
    'Son güncelleme: 1 Temmuz 2026': ['Last updated: July 1, 2026','Última actualización: 1 de julio de 2026','Letzte Aktualisierung: 1. Juli 2026','Dernière mise à jour : 1 juillet 2026'],
    'İçindekiler': ['Contents','Contenido','Inhalt','Sommaire'],
    'İletişim Formu': ['Contact Form','Formulario de contacto','Kontaktformular','Formulaire de contact'],
    'E-posta:': ['Email:','Correo:','E-Mail:','E-mail :'],
    'Web formu:': ['Web form:','Formulario web:','Webformular:','Formulaire web :']
  };
  Object.assign(AUTO_CATALOG, {
    'Araç ara: PDF, görsel, video...': ['Search tools: PDF, image, video...','Buscar: PDF, imagen, vídeo...','Tools suchen: PDF, Bild, Video...','Rechercher : PDF, image, vidéo...'],
    'Araç bulunamadı': ['No tools found','No se encontraron herramientas','Keine Tools gefunden','Aucun outil trouvé'],
    'Farklı bir arama terimi deneyin.': ['Try a different search term.','Prueba otra búsqueda.','Versuche einen anderen Suchbegriff.','Essayez un autre terme.'],
    '/ay': ['/month','/mes','/Monat','/mois'],
    '24 saat içinde': ['Within 24 hours','En 24 horas','Innerhalb von 24 Stunden','Sous 24 heures'],
    'Test modu:': ['Test mode:','Modo de prueba:','Testmodus:','Mode test :'],
    'Açıklama alanına e-posta adresinizi yazın. Ödemeniz onaylandığında planınız aktive edilir.': ['Enter your email in the description field. Your plan is activated after payment approval.','Escribe tu correo en el concepto. Tu plan se activará al aprobar el pago.','E-Mail im Verwendungszweck angeben. Der Tarif wird nach Zahlungsbestätigung aktiviert.','Indiquez votre e-mail dans le libellé. Le forfait sera activé après validation.'],
    'Ödeme başarılı!': ['Payment successful!','¡Pago realizado!','Zahlung erfolgreich!','Paiement réussi !'],
    'Pro planın aktive edildi. İyi kullanımlar!': ['Your Pro plan is active. Enjoy!','Tu plan Pro está activo. ¡Disfrútalo!','Dein Pro-Tarif ist aktiv. Viel Freude!','Votre forfait Pro est actif. Bonne utilisation !'],
    'Hesabıma Git': ['Go to My Account','Ir a mi cuenta','Zu meinem Konto','Accéder à mon compte'],
    'Kullanım Koşulları': ['Terms of Service','Términos de uso','Nutzungsbedingungen','Conditions d’utilisation'],
    'Gizlilik Politikası': ['Privacy Policy','Política de privacidad','Datenschutzerklärung','Politique de confidentialité'],
    've': ['and','y','und','et'],
    "'nı okudum, kabul ediyorum.": ['I have read and accept them.','Los he leído y acepto.','Ich habe sie gelesen und akzeptiere sie.','Je les ai lues et je les accepte.'],
    'E-postanı doğrula': ['Verify your email','Verifica tu correo','E-Mail bestätigen','Vérifiez votre e-mail'],
    'adresine doğrulama bağlantısı gönderdik.': ['We sent a verification link to this address.','Enviamos un enlace de verificación a esta dirección.','Wir haben einen Bestätigungslink an diese Adresse gesendet.','Nous avons envoyé un lien de vérification à cette adresse.'],
    'Bağlantıya tıkladıktan sonra giriş yapabilirsin.': ['You can sign in after clicking the link.','Podrás iniciar sesión al pulsar el enlace.','Nach dem Klick auf den Link kannst du dich anmelden.','Vous pourrez vous connecter après avoir cliqué sur le lien.'],
    'Giriş sayfasına dön →': ['Back to sign in →','Volver al inicio →','Zur Anmeldung →','Retour à la connexion →'],
    '← Kayıt sayfasına dön': ['← Back to sign up','← Volver al registro','← Zur Registrierung','← Retour à l’inscription'],
    'adresine gönderilen 6 haneli kodu yaz.': ['Enter the 6-digit code sent to this address.','Introduce el código de 6 dígitos enviado a esta dirección.','Gib den 6-stelligen Code ein, der an diese Adresse gesendet wurde.','Saisissez le code à 6 chiffres envoyé à cette adresse.'],
    'sn)': ['sec)','s)','Sek.)','s)'],
    'Sorunun devam ediyorsa': ['If the issue continues,','Si el problema continúa,','Wenn das Problem weiter besteht,','Si le problème persiste,'],
    'Plan': ['Plan','Plan','Tarif','Forfait'],
    'Durum': ['Status','Estado','Status','Statut'],
    'Araç': ['Tool','Herramienta','Tool','Outil'],
    'Kart Numarası': ['Card Number','Número de tarjeta','Kartennummer','Numéro de carte'],
    'Son Kullanma': ['Expiry','Caducidad','Ablaufdatum','Expiration'],
    'FormatJet Teknoloji A.Ş.': ['FormatJet Technology Inc.','FormatJet Tecnología S.A.','FormatJet Technologie AG','FormatJet Technologie S.A.'],
    'Dosya seç': ['Choose file','Elegir archivo','Datei wählen','Choisir le fichier'],
    'Ayarla': ['Adjust','Ajustar','Einstellen','Régler'],
    'İndir': ['Download','Descargar','Herunterladen','Télécharger'],
    'Tümünü ZIP Olarak İndir': ['Download all as ZIP','Descargar todo como ZIP','Alles als ZIP herunterladen','Tout télécharger en ZIP'],
    'Dosya analiz ediliyor': ['Analyzing file','Analizando archivo','Datei wird analysiert','Analyse du fichier'],
    'Format dönüştürülüyor': ['Converting format','Convirtiendo formato','Format wird konvertiert','Conversion du format'],
    'Çıktı optimize ediliyor': ['Optimizing output','Optimizando resultado','Ausgabe wird optimiert','Optimisation du résultat'],
    'İndirme hazırlanıyor': ['Preparing download','Preparando descarga','Download wird vorbereitet','Préparation du téléchargement'],
    'Evet. FormatJet araçlarının büyük bölümü dosyanı sunucuya hiç göndermez — dönüştürme işlemi tamamen tarayıcının içinde, kendi cihazında yapılır. Sunucu tarafında işlenen istisnai durumlarda dosyalar 1 saat içinde kalıcı olarak silinir.': ['Yes. Most FormatJet tools never send your file to a server; conversion happens entirely in your browser. In exceptional server-side cases, files are permanently deleted within one hour.','Sí. La mayoría de herramientas no envían el archivo al servidor; todo ocurre en tu navegador. En casos excepcionales de servidor, se elimina en una hora.','Ja. Die meisten Tools senden Dateien nie an einen Server; alles läuft im Browser. In Ausnahmefällen werden serverseitig verarbeitete Dateien binnen einer Stunde gelöscht.','Oui. La plupart des outils n’envoient jamais le fichier au serveur ; tout se passe dans le navigateur. Dans les rares cas côté serveur, il est supprimé sous une heure.'],
    'Yönetici Paneli': ['Admin Panel','Panel de administración','Admin-Bereich','Administration'],
    'Toplam kullanıcı': ['Total users','Usuarios totales','Nutzer gesamt','Utilisateurs'],
    'Toplam işlem': ['Total operations','Operaciones totales','Vorgänge gesamt','Opérations'],
    'İletişim mesajı': ['Contact messages','Mensajes de contacto','Kontaktnachrichten','Messages de contact'],
    'Araç Talebi': ['Tool requests','Solicitudes de herramientas','Tool-Anfragen','Demandes d’outils'],
    'Toplam gelir': ['Total revenue','Ingresos totales','Gesamtumsatz','Revenu total'],
    'Mesajlar': ['Messages','Mensajes','Nachrichten','Messages'],
    'Araç Talepleri': ['Tool Requests','Solicitudes','Tool-Anfragen','Demandes d’outils'],
    'Kullanıcılar': ['Users','Usuarios','Nutzer','Utilisateurs'],
    'Popüler Araçlar': ['Popular Tools','Herramientas populares','Beliebte Tools','Outils populaires'],
    'Site Düzenleme': ['Site Editor','Editor del sitio','Website bearbeiten','Édition du site'],
    'Gönderen': ['Sender','Remitente','Absender','Expéditeur'],
    'Konu': ['Subject','Asunto','Betreff','Objet'],
    'Mesaj': ['Message','Mensaje','Nachricht','Message'],
    'Tarih': ['Date','Fecha','Datum','Date'],
    'Henüz mesaj yok.': ['No messages yet.','Aún no hay mensajes.','Noch keine Nachrichten.','Aucun message.'],
    'Arşiv (': ['Archive (','Archivo (','Archiv (','Archives ('],
    'İşlem': ['Operation','Operación','Vorgang','Opération'],
    'Detay': ['Details','Detalles','Details','Détails'],
    'Henüz araç talebi yok.': ['No tool requests yet.','Aún no hay solicitudes.','Noch keine Tool-Anfragen.','Aucune demande d’outil.'],
    'Rol': ['Role','Rol','Rolle','Rôle'],
    'Kayıt': ['Joined','Registro','Registriert','Inscription'],
    'Segment': ['Segment','Segmento','Segment','Segment'],
    'Genel': ['All','General','Alle','Tous'],
    'Ücretli': ['Paid','De pago','Bezahlt','Payant'],
    'Excel İndir': ['Download Excel','Descargar Excel','Excel herunterladen','Télécharger Excel'],
    'Henüz kullanım verisi yok.': ['No usage data yet.','Aún no hay datos de uso.','Noch keine Nutzungsdaten.','Aucune donnée d’utilisation.'],
    'Dil Bazlı İlk 3': ['Top 3 by Language','Top 3 por idioma','Top 3 nach Sprache','Top 3 par langue'],
    'Dil': ['Language','Idioma','Sprache','Langue'],
    'Sıra': ['Rank','Posición','Rang','Rang'],
    'Adet': ['Count','Cantidad','Anzahl','Nombre'],
    'Marka Görselleri': ['Brand Assets','Recursos de marca','Markenbilder','Éléments de marque'],
    'Yüklediğin görsel anında tüm sitede geçerli olur.': ['Uploaded images are applied across the site instantly.','Las imágenes se aplican al sitio al instante.','Hochgeladene Bilder gelten sofort auf der ganzen Website.','Les images sont appliquées immédiatement à tout le site.'],
    'Logo (açık zemin)': ['Logo (light background)','Logo (fondo claro)','Logo (heller Hintergrund)','Logo (fond clair)'],
    'Logo yazısı (açık)': ['Logo text (light)','Texto del logo (claro)','Logo-Schrift (hell)','Texte du logo (clair)'],
    'Logo (koyu zemin)': ['Logo (dark background)','Logo (fondo oscuro)','Logo (dunkler Hintergrund)','Logo (fond sombre)'],
    'Logo yazısı (koyu)': ['Logo text (dark)','Texto del logo (oscuro)','Logo-Schrift (dunkel)','Texte du logo (sombre)'],
    'Favicon (açık tema)': ['Favicon (light theme)','Favicon (tema claro)','Favicon (hell)','Favicon (thème clair)'],
    'Favicon (koyu tema)': ['Favicon (dark theme)','Favicon (tema oscuro)','Favicon (dunkel)','Favicon (thème sombre)'],
    'İletişim Bilgileri': ['Contact Details','Datos de contacto','Kontaktdaten','Coordonnées'],
    'Değişiklikler iletişim sayfası ve tüm sistemde otomatik güncellenir.': ['Changes update the contact page and the entire system automatically.','Los cambios actualizan automáticamente el contacto y todo el sistema.','Änderungen aktualisieren Kontaktseite und System automatisch.','Les modifications mettent à jour automatiquement le contact et le système.'],
    'Adres (opsiyonel)': ['Address (optional)','Dirección (opcional)','Adresse (optional)','Adresse (facultative)'],
    'Header Menüsü': ['Header Menu','Menú de cabecera','Header-Menü','Menu d’en-tête'],
    'Menü sıralaması — sürükleyip bırak:': ['Menu order — drag and drop:','Orden del menú — arrastra y suelta:','Menüreihenfolge — ziehen und ablegen:','Ordre du menu — glisser-déposer :'],
    'Menü ve buton adlarını değiştir; boş bırakılan varsayılanda kalır.': ['Edit menu and button labels; blank fields keep their defaults.','Edita los nombres; los campos vacíos conservan el valor predeterminado.','Menü- und Buttontexte ändern; leere Felder behalten den Standard.','Modifiez les libellés ; les champs vides gardent la valeur par défaut.'],
    'Dil sıralaması — sürükleyip bırakarak değiştir (panelde bu sırayla görünür):': ['Language order — drag and drop (shown in this order):','Orden de idiomas — arrastra y suelta:','Sprachreihenfolge — ziehen und ablegen:','Ordre des langues — glisser-déposer :'],
    'Anasayfa Metinleri': ['Homepage Copy','Textos de inicio','Startseitentexte','Textes de l’accueil'],
    'Başlık 1': ['Title 1','Título 1','Titel 1','Titre 1'],
    'Başlık 2 (mavi)': ['Title 2 (blue)','Título 2 (azul)','Titel 2 (blau)','Titre 2 (bleu)'],
    'Alt metin': ['Subtitle','Subtítulo','Untertitel','Sous-titre'],
    'Footer Menüsü': ['Footer Menu','Menú del pie','Footer-Menü','Menu du pied de page'],
    'Sütun sıralaması — sürükleyip bırak:': ['Column order — drag and drop:','Orden de columnas — arrastra:','Spaltenreihenfolge — ziehen:','Ordre des colonnes — glisser :'],
    'Slogan': ['Tagline','Eslogan','Slogan','Slogan'],
    'Güven metni': ['Trust message','Texto de confianza','Vertrauenstext','Message de confiance'],
    'CTA — araç talebi başlığı': ['CTA — tool-request title','CTA — solicitud de herramienta','CTA — Tool-Anfrage','CTA — demande d’outil'],
    'CTA — destek başlığı': ['CTA — support title','CTA — título de soporte','CTA — Supporttitel','CTA — titre du support'],
    'Plan Fiyatları ve Yetkileri': ['Plan Pricing & Permissions','Precios y permisos','Tarifpreise & Rechte','Tarifs et autorisations'],
    'Fiyatlar ₺/ay. Ekstra özellik alanları her satıra bir özellik olacak şekilde yazılır.': ['Prices are ₺/month. Enter one extra feature per line.','Precios en ₺/mes. Escribe una función extra por línea.','Preise in ₺/Monat. Eine Zusatzfunktion pro Zeile.','Prix en ₺/mois. Une fonction supplémentaire par ligne.'],
    'Pro aylık': ['Pro monthly','Pro mensual','Pro monatlich','Pro mensuel'],
    'Pro yıllık (aylık karşılığı)': ['Pro yearly (monthly equivalent)','Pro anual (equivalente mensual)','Pro jährlich (Monatswert)','Pro annuel (équivalent mensuel)'],
    'Pro dosya limiti': ['Pro file limit','Límite Pro','Pro-Dateilimit','Limite Pro'],
    'Pro araç erişimi': ['Pro tool access','Acceso Pro','Pro-Toolzugriff','Accès Pro'],
    'Pro ekstra özellikler': ['Pro extra features','Funciones Pro extra','Pro-Zusatzfunktionen','Fonctions Pro supplémentaires'],
    'Business aylık': ['Business monthly','Business mensual','Business monatlich','Business mensuel'],
    'Business yıllık (aylık karşılığı)': ['Business yearly (monthly equivalent)','Business anual (equivalente mensual)','Business jährlich (Monatswert)','Business annuel (équivalent mensuel)'],
    'Business dosya limiti': ['Business file limit','Límite Business','Business-Dateilimit','Limite Business'],
    'Business araç erişimi': ['Business tool access','Acceso Business','Business-Toolzugriff','Accès Business'],
    'Business ekstra özellikler': ['Business extra features','Funciones Business extra','Business-Zusatzfunktionen','Fonctions Business supplémentaires'],
    'Ücretsiz Plan': ['Free Plan','Plan gratuito','Kostenloser Tarif','Forfait gratuit'],
    'Araç erişimi (adet)': ['Tool access (count)','Acceso a herramientas','Toolzugriff (Anzahl)','Accès aux outils'],
    'Günlük işlem': ['Daily operations','Operaciones diarias','Tägliche Vorgänge','Opérations quotidiennes'],
    'Ücretsiz ekstra özellikler': ['Free extra features','Funciones gratuitas extra','Kostenlose Zusatzfunktionen','Fonctions gratuites supplémentaires'],
    'Değişiklikleri Kaydet': ['Save Changes','Guardar cambios','Änderungen speichern','Enregistrer les modifications'],
    '✓ Kaydedildi — site anında güncellendi.': ['✓ Saved — the site updated instantly.','✓ Guardado — el sitio se actualizó al instante.','✓ Gespeichert — die Website wurde sofort aktualisiert.','✓ Enregistré — le site a été mis à jour.'],
    'Yetkisiz erişim': ['Unauthorized access','Acceso no autorizado','Unbefugter Zugriff','Accès non autorisé'],
    'Bu sayfayı görüntülemek için yönetici hesabıyla giriş yapmalısın.': ['Sign in with an administrator account to view this page.','Inicia sesión como administrador para ver esta página.','Mit einem Administratorkonto anmelden, um diese Seite zu sehen.','Connectez-vous avec un compte administrateur pour voir cette page.'],
    'Giriş Yap →': ['Sign In →','Iniciar sesión →','Anmelden →','Se connecter →'],
    'Açı': ['Angle','Ángulo','Winkel','Angle'],
    '90° sağa': ['90° right','90° derecha','90° rechts','90° à droite'],
    'Güçlü bir parola girin': ['Enter a strong password','Introduce una contraseña segura','Starkes Passwort eingeben','Saisissez un mot de passe fort'],
    'PDF parolası': ['PDF password','Contraseña del PDF','PDF-Passwort','Mot de passe PDF'],
    'Türkçe': ['Turkish','Turco','Türkisch','Turc'],
    'İngilizce': ['English','Inglés','Englisch','Anglais'],
    'Fransızca': ['French','Francés','Französisch','Français'],
    'İspanyolca': ['Spanish','Español','Spanisch','Espagnol'],
    'Genişlik (px)': ['Width (px)','Ancho (px)','Breite (px)','Largeur (px)'],
    'Yükseklik (px)': ['Height (px)','Alto (px)','Höhe (px)','Hauteur (px)'],
    'boş = orantılı': ['blank = proportional','vacío = proporcional','leer = proportional','vide = proportionnel'],
    'X başlangıç': ['Start X','Inicio X','Start X','Début X'],
    'Y başlangıç': ['Start Y','Inicio Y','Start Y','Début Y'],
    'Sağ alt': ['Bottom right','Abajo derecha','Unten rechts','En bas à droite'],
    'Orta (çapraz)': ['Center (diagonal)','Centro (diagonal)','Mitte (diagonal)','Centre (diagonal)'],
    'Sol üst': ['Top left','Arriba izquierda','Oben links','En haut à gauche'],
    'Parlaklık': ['Brightness','Brillo','Helligkeit','Luminosité'],
    'Kontrast': ['Contrast','Contraste','Kontrast','Contraste'],
    'Doygunluk': ['Saturation','Saturación','Sättigung','Saturation'],
    'Şiddet': ['Strength','Intensidad','Stärke','Intensité'],
    'Çıktı genişliği (px)': ['Output width (px)','Ancho de salida (px)','Ausgabebreite (px)','Largeur de sortie (px)'],
    'Görsel kalitesi': ['Image quality','Calidad de imagen','Bildqualität','Qualité d’image'],
    'Yüksek (daha büyük)': ['High (larger)','Alta (más grande)','Hoch (größer)','Élevée (plus grand)'],
    'Orta (önerilen)': ['Medium (recommended)','Media (recomendada)','Mittel (empfohlen)','Moyenne (recommandée)'],
    'Düşük (en küçük)': ['Low (smallest)','Baja (más pequeño)','Niedrig (kleinste)','Faible (plus petit)'],
    'Bit hızı': ['Bitrate','Tasa de bits','Bitrate','Débit'],
    'Başlangıç': ['Start','Inicio','Start','Début'],
    'Bitiş': ['End','Fin','Ende','Fin'],
    'Yön': ['Direction','Dirección','Richtung','Direction'],
    'Hız': ['Speed','Velocidad','Geschwindigkeit','Vitesse'],
    '0.5× (yavaş)': ['0.5× (slow)','0.5× (lento)','0,5× (langsam)','0,5× (lent)'],
    '2× (hızlı)': ['2× (fast)','2× (rápido)','2× (schnell)','2× (rapide)'],
    'Genişlik': ['Width','Ancho','Breite','Largeur'],
    'Yükseklik': ['Height','Alto','Höhe','Hauteur'],
    'Kazanç': ['Gain','Ganancia','Verstärkung','Gain'],
    'Konuşmaya başla, metin burada belirecek...': ['Start speaking; text will appear here...','Empieza a hablar; el texto aparecerá aquí...','Sprich los; der Text erscheint hier...','Commencez à parler ; le texte apparaîtra ici...'],
    'yeni': ['new','nuevo','neu','nouveau'],
    'Son 7 gün:': ['Last 7 days:','Últimos 7 días:','Letzte 7 Tage:','7 derniers jours :'],
    'Hesabı tamamen kaldır': ['Delete account permanently','Eliminar cuenta definitivamente','Konto endgültig löschen','Supprimer définitivement le compte'],
    'Karmaşık yazılımlara gerek kalmadan, tarayıcınızdan her dosya işlemini saniyeler içinde tamamlayın. İndirme yok. Kayıt zorunluluğu yok. Ücret yok.': ['Complete every file task in seconds from your browser, without complex software. No download. No required account. No fee.','Completa cualquier tarea en segundos desde el navegador, sin software complejo. Sin descargas, registro obligatorio ni coste.','Erledige jede Dateiaufgabe in Sekunden im Browser – ohne komplizierte Software, Download, Pflichtkonto oder Kosten.','Réalisez chaque opération en quelques secondes dans le navigateur, sans logiciel complexe, téléchargement, compte obligatoire ni frais.'],
    'FormatJet, karmaşık masaüstü yazılımlarına ihtiyaç duymadan dosyalarını kolayca yönetmek isteyen herkes için tasarlandı. PDF birleştirmek için Acrobat aboneliğine, videoyu dönüştürmek için ayrı bir uygulama indirmeye artık gerek yok.': ['FormatJet is built for anyone who wants to manage files without complex desktop software. You no longer need an Acrobat subscription to merge PDFs or a separate app to convert video.','FormatJet está pensado para gestionar archivos sin programas de escritorio complejos. Ya no necesitas Acrobat para unir PDF ni otra aplicación para convertir vídeo.','FormatJet ist für alle gedacht, die Dateien ohne komplizierte Desktop-Software verwalten möchten. Für PDF-Zusammenführung oder Videokonvertierung sind keine separaten Abos oder Apps nötig.','FormatJet s’adresse à tous ceux qui veulent gérer leurs fichiers sans logiciel complexe. Plus besoin d’un abonnement Acrobat ni d’une application séparée pour convertir une vidéo.'],
    'Öğrenciden küçük işletme sahibine, tasarımcıdan serbest çalışana kadar herkesin kullanabileceği, hızlı ve güvenilir araçlar sunmak istiyoruz. Ücretsiz. Her zaman.': ['We want to offer fast, reliable tools for everyone—from students and small businesses to designers and freelancers. Free. Always.','Queremos ofrecer herramientas rápidas y fiables para todos: estudiantes, pequeños negocios, diseñadores y autónomos. Gratis. Siempre.','Wir bieten schnelle, zuverlässige Tools für alle – von Studierenden und kleinen Unternehmen bis zu Designern und Freelancern. Kostenlos. Immer.','Nous voulons offrir des outils rapides et fiables à tous : étudiants, petites entreprises, designers et indépendants. Gratuits. Toujours.'],
    'Dosyalarınız işlem sonrası otomatik silinir': ['Your files are deleted automatically after processing','Tus archivos se eliminan automáticamente tras el proceso','Dateien werden nach der Verarbeitung automatisch gelöscht','Vos fichiers sont supprimés automatiquement après traitement'],
    "150'den fazla ülkede erişilebilir": ['Available in more than 150 countries','Disponible en más de 150 países','In mehr als 150 Ländern verfügbar','Disponible dans plus de 150 pays'],
    'Ortalama işlem süresi 3 saniyenin altında': ['Average processing time under 3 seconds','Tiempo medio inferior a 3 segundos','Durchschnittlich unter 3 Sekunden','Temps moyen inférieur à 3 secondes'],
    'Dosyalarınız yalnızca sizin. Hiçbir çalışanımız dosya içeriklerinizi göremez. İşlem bitince sistem siler.': ['Your files are yours alone. Employees cannot view their contents, and the system deletes them when processing ends.','Tus archivos son solo tuyos. Nadie del equipo puede verlos y el sistema los elimina al terminar.','Ihre Dateien gehören nur Ihnen. Mitarbeiter können Inhalte nicht sehen; nach der Verarbeitung löscht das System sie.','Vos fichiers restent les vôtres. Aucun employé ne peut les voir et le système les supprime après traitement.'],
    'Saniyeler içinde tamamlanan işlemler. Dünyanın herhangi bir yerine CDN üzerinden ulaşım.': ['Operations finish in seconds, delivered worldwide through a CDN.','Procesos en segundos y acceso mundial mediante CDN.','Vorgänge in Sekunden, weltweit über ein CDN erreichbar.','Opérations en quelques secondes, accessibles partout via CDN.'],
    'Teknik bilgi gerektirmeyen arayüz. Dosyayı sürükle, işlemi seç, indir. Bu kadar.': ['An interface that needs no technical knowledge. Drag the file, choose the task, download. That is all.','Una interfaz sin conocimientos técnicos: arrastra, elige la tarea y descarga.','Eine Oberfläche ohne Fachwissen: Datei ziehen, Vorgang wählen, herunterladen.','Une interface sans compétence technique : glissez, choisissez, téléchargez.'],
    'Gelir seviyesinden bağımsız, herkesin ücretsiz kullanabileceği araçlar. Çünkü teknoloji herkese eşit erişilmeli.': ['Free tools for everyone, regardless of income, because technology should be equally accessible.','Herramientas gratuitas para todos, sin importar sus ingresos, porque la tecnología debe ser accesible por igual.','Kostenlose Tools unabhängig vom Einkommen, denn Technologie sollte allen gleich zugänglich sein.','Des outils gratuits pour tous, quel que soit le revenu, car la technologie doit être accessible à égalité.'],
    'Araç talebi, geri bildirim veya teknik destek için iletişim sayfamızı ziyaret edin.': ['Visit our contact page for tool requests, feedback or technical support.','Visita la página de contacto para solicitar herramientas, enviar comentarios o pedir soporte.','Besuchen Sie unsere Kontaktseite für Tool-Wünsche, Feedback oder technischen Support.','Consultez notre page de contact pour une demande d’outil, un avis ou une aide technique.'],
    'Aradığın cevabı bulamazsan': ['If you cannot find the answer','Si no encuentras la respuesta','Wenn du keine Antwort findest','Si vous ne trouvez pas la réponse'],
    'bize yaz': ['write to us','escríbenos','schreib uns','écrivez-nous'],
    'Verilerim üçüncü taraflarla paylaşılıyor mu?': ['Is my data shared with third parties?','¿Se comparten mis datos con terceros?','Werden meine Daten an Dritte weitergegeben?','Mes données sont-elles partagées ?'],
    'Dosya boyutu limiti nedir?': ['What is the file-size limit?','¿Cuál es el límite de tamaño?','Wie groß ist das Dateilimit?','Quelle est la limite de taille ?'],
    'Video araçları neden ilk açılışta yavaş?': ['Why are video tools slower the first time?','¿Por qué tardan más la primera vez?','Warum sind Video-Tools beim ersten Start langsamer?','Pourquoi les outils vidéo sont-ils plus lents au premier lancement ?'],
    'Pro planı neler sunuyor?': ['What does the Pro plan include?','¿Qué incluye el plan Pro?','Was bietet der Pro-Tarif?','Que comprend le forfait Pro ?'],
    'İstediğim zaman iptal edebilir miyim?': ['Can I cancel at any time?','¿Puedo cancelar cuando quiera?','Kann ich jederzeit kündigen?','Puis-je annuler à tout moment ?'],
    'Aradığım araç listede yok, ne yapabilirim?': ['The tool I need is missing—what can I do?','No encuentro la herramienta que necesito. ¿Qué hago?','Mein gewünschtes Tool fehlt – was kann ich tun?','L’outil recherché manque : que faire ?'],
    'Bir hata ile karşılaştım, nasıl bildiririm?': ['How do I report an error?','¿Cómo informo de un error?','Wie melde ich einen Fehler?','Comment signaler une erreur ?'],
    'Evet. Tüm temel araçlar kayıt gerektirmeden çalışır. Üye olursan daha yüksek dosya limitleri ve işlem geçmişine erişim kazanırsın.': ['Yes. All core tools work without an account. Members receive higher limits and processing history.','Sí. Todas las herramientas básicas funcionan sin cuenta. Los miembros obtienen límites mayores e historial.','Ja. Alle Basis-Tools funktionieren ohne Konto. Mitglieder erhalten höhere Limits und einen Verlauf.','Oui. Tous les outils essentiels fonctionnent sans compte. Les membres bénéficient de limites supérieures et d’un historique.'],
    'Üyesiz kullanımda 50 MB, ücretsiz üyelikte 200 MB, Pro planında 2 GB, Business planında 10 GB.': ['50 MB as a guest, 200 MB with a free account, 2 GB on Pro and 10 GB on Business.','50 MB sin cuenta, 200 MB con cuenta gratuita, 2 GB en Pro y 10 GB en Business.','50 MB als Gast, 200 MB mit kostenlosem Konto, 2 GB bei Pro und 10 GB bei Business.','50 Mo sans compte, 200 Mo avec un compte gratuit, 2 Go en Pro et 10 Go en Business.'],
    'Sınırsız işlem, 2 GB dosya limiti, öncelikli işlem kuyruğu, toplu dosya işleme ve reklamsız deneyim. Detaylar için': ['Unlimited operations, a 2 GB file limit, priority queue, batch processing and an ad-free experience. For details, see','Operaciones ilimitadas, límite de 2 GB, cola prioritaria, lotes y experiencia sin anuncios. Más detalles en','Unbegrenzte Vorgänge, 2-GB-Limit, Prioritätswarteschlange, Stapelverarbeitung und werbefreie Nutzung. Details unter','Opérations illimitées, limite de 2 Go, file prioritaire, traitement par lot et sans publicité. Détails sur'],
    'Evet. Aboneliğini dilediğin an iptal edebilirsin; dönem sonuna kadar Pro özelliklerini kullanmaya devam edersin.': ['Yes. Cancel whenever you like and keep Pro features until the end of the billing period.','Sí. Cancela cuando quieras y conserva Pro hasta el final del periodo.','Ja. Jederzeit kündbar; Pro bleibt bis zum Ende des Abrechnungszeitraums aktiv.','Oui. Annulez à tout moment et gardez Pro jusqu’à la fin de la période.']
  });
  const AUTO_NODE_SOURCES = new WeakMap();
  let autoObserverPaused = false;
  const LEGAL_COPY = {
    'gizlilik': {
      en: { title: 'Privacy Policy', sections: [
        ['Data We Collect','We take your privacy seriously. We automatically record limited technical data such as an anonymized IP address, browser and operating-system details, referral URL, the tool used and processing time. For registered members we also process name, email address and an encrypted password. For uploaded files, only metadata such as name, size and format is used; file contents are not read or retained.'],
        ['How We Use Data','We use data to provide file conversion, secure the platform, prevent spam, measure and improve service quality, solve technical issues and meet legal obligations. Your data is never sold or rented to third parties for advertising.'],
        ['File Security','Files are transferred over encrypted HTTPS/TLS connections and kept only for the time needed to process them. They are permanently deleted from our systems no later than one hour after processing. File contents cannot be viewed by employees; processing is automated.'],
        ['Service Providers','We may use contracted cloud infrastructure, CDN, anonymous analytics and payment providers. They receive only the data required for their role and operate under GDPR and KVKK data-processing obligations.'],
        ['Your Rights','Under KVKK and GDPR, you may request access, correction, deletion, restriction, portability or object to processing. Submit requests through our Contact Form.'],
        ['Cookies','We use essential and optional cookies. You can manage them in your browser and find details in our Cookie Policy.'],
        ['Changes','Material changes are announced by email and the last-updated date on this page is revised. Continued use of the service means you accept the current policy.']
      ]},
      es: { title: 'Política de Privacidad', sections: [
        ['Datos que recopilamos','Nos tomamos tu privacidad en serio. Registramos datos técnicos limitados, como IP anonimizada, navegador, sistema operativo, URL de referencia, herramienta utilizada y tiempo de proceso. Para miembros también tratamos nombre, correo y contraseña cifrada. De los archivos solo usamos metadatos como nombre, tamaño y formato; no leemos ni conservamos su contenido.'],
        ['Cómo usamos los datos','Usamos los datos para prestar la conversión, proteger la plataforma, evitar spam, mejorar la calidad, resolver incidencias y cumplir obligaciones legales. Nunca vendemos ni alquilamos tus datos con fines publicitarios.'],
        ['Seguridad de los archivos','Los archivos se transfieren mediante HTTPS/TLS y solo se conservan durante el proceso. Se eliminan permanentemente como máximo una hora después. El procesamiento es automático y los empleados no pueden ver el contenido.'],
        ['Proveedores','Podemos utilizar proveedores contratados de nube, CDN, analítica anónima y pagos. Solo reciben los datos necesarios y están sujetos a GDPR y KVKK.'],
        ['Tus derechos','Puedes solicitar acceso, rectificación, supresión, limitación, portabilidad u oponerte al tratamiento. Envía tu solicitud mediante el Formulario de contacto.'],
        ['Cookies','Usamos cookies esenciales y opcionales. Puedes gestionarlas en el navegador y consultar la Política de Cookies.'],
        ['Cambios','Los cambios importantes se comunican por correo y actualizan la fecha de esta página. El uso continuado implica aceptar la política vigente.']
      ]},
      de: { title: 'Datenschutzerklärung', sections: [
        ['Erhobene Daten','Wir nehmen Datenschutz ernst. Automatisch erfassen wir nur begrenzte technische Daten wie anonymisierte IP-Adresse, Browser, Betriebssystem, Referrer, verwendetes Tool und Verarbeitungszeit. Bei Mitgliedern verarbeiten wir zusätzlich Name, E-Mail und verschlüsseltes Passwort. Von Dateien nutzen wir nur Metadaten wie Name, Größe und Format; Inhalte werden weder gelesen noch gespeichert.'],
        ['Verwendung','Die Daten dienen der Dateiverarbeitung, Plattformsicherheit, Spam-Abwehr, Qualitätsverbesserung, Fehlerbehebung und gesetzlichen Pflichten. Daten werden niemals zu Werbezwecken verkauft oder vermietet.'],
        ['Dateisicherheit','Dateien werden verschlüsselt über HTTPS/TLS übertragen und nur während der Verarbeitung vorübergehend gehalten. Spätestens nach einer Stunde werden sie dauerhaft gelöscht. Mitarbeiter können Inhalte nicht einsehen.'],
        ['Dienstleister','Wir können vertraglich gebundene Cloud-, CDN-, anonyme Analyse- und Zahlungsanbieter einsetzen. Sie erhalten nur notwendige Daten und unterliegen DSGVO- und KVKK-Pflichten.'],
        ['Ihre Rechte','Sie können Auskunft, Berichtigung, Löschung, Einschränkung, Übertragbarkeit oder Widerspruch verlangen. Nutzen Sie dafür das Kontaktformular.'],
        ['Cookies','Wir verwenden notwendige und optionale Cookies. Verwaltung ist im Browser möglich; Details stehen in der Cookie-Richtlinie.'],
        ['Änderungen','Wesentliche Änderungen werden per E-Mail angekündigt und das Aktualisierungsdatum wird angepasst. Die weitere Nutzung gilt als Zustimmung zur aktuellen Fassung.']
      ]},
      fr: { title: 'Politique de Confidentialité', sections: [
        ['Données collectées','Nous prenons votre vie privée au sérieux. Nous enregistrons uniquement des données techniques limitées : adresse IP anonymisée, navigateur, système, URL de référence, outil utilisé et durée du traitement. Pour les membres, nous traitons aussi le nom, l’e-mail et le mot de passe chiffré. Seules les métadonnées des fichiers sont utilisées ; leur contenu n’est ni lu ni conservé.'],
        ['Utilisation','Les données servent à fournir la conversion, sécuriser la plateforme, prévenir le spam, améliorer la qualité, résoudre les incidents et respecter la loi. Elles ne sont jamais vendues ni louées à des fins publicitaires.'],
        ['Sécurité des fichiers','Les fichiers transitent via HTTPS/TLS et sont conservés uniquement pendant le traitement. Ils sont supprimés définitivement au plus tard une heure après. Le traitement est automatique et les employés ne voient pas le contenu.'],
        ['Prestataires','Nous pouvons recourir à des prestataires contractuels de cloud, CDN, statistiques anonymes et paiement. Ils ne reçoivent que les données nécessaires et respectent le RGPD et la KVKK.'],
        ['Vos droits','Vous pouvez demander accès, rectification, suppression, limitation, portabilité ou opposition. Utilisez le Formulaire de contact.'],
        ['Cookies','Nous utilisons des cookies essentiels et facultatifs. Vous pouvez les gérer dans le navigateur et consulter la Politique de Cookies.'],
        ['Modifications','Les changements importants sont annoncés par e-mail et la date de mise à jour est révisée. La poursuite de l’utilisation vaut acceptation de la version actuelle.']
      ]}
    },
    'kullanim-kosullari': {
      en: { title: 'Terms of Service', sections: [
        ['Acceptance','By accessing or using FormatJet, you agree to these Terms. If you do not agree, do not use the platform. Users under 18 must use it with a parent or legal guardian.'],
        ['Service Description','FormatJet provides online tools for converting, compressing and editing PDF, document, image, video and audio files. Most services are free; some premium features require payment. Continuous or uninterrupted access is not guaranteed during maintenance, updates or technical incidents.'],
        ['Usage Rules','You must not process copyrighted content without permission, upload illegal, harmful, obscene or malicious files, disrupt the platform, exceed limits with bots or scripts, or attempt unauthorized access. Violations may lead to suspension and legal action.'],
        ['Intellectual Property','The platform design, code, logo, content and trademarks belong to FormatJet. Rights to files you upload remain yours; FormatJet claims no right to use them beyond processing.'],
        ['Limitation of Liability','The service is provided as is. FormatJet is not liable for data loss, file corruption or incorrect output arising during conversion. Back up critical files before processing.'],
        ['Termination','FormatJet may suspend or close accounts that breach these Terms. You may request account deletion at any time through support.'],
        ['Governing Law','These Terms are governed by Turkish law. Disputes are first addressed through negotiation; Istanbul courts and enforcement offices have jurisdiction. GDPR complaints may also be submitted to the relevant EU data-protection authority.']
      ]},
      es: { title: 'Términos de Uso', sections: [
        ['Aceptación','Al acceder o usar FormatJet aceptas estos Términos. Si no estás de acuerdo, no uses la plataforma. Los menores de 18 años deben utilizarla con un representante legal.'],
        ['Descripción del servicio','FormatJet ofrece herramientas para convertir, comprimir y editar PDF, documentos, imágenes, vídeo y audio. La mayoría son gratuitas; algunas funciones premium son de pago. No se garantiza acceso continuo durante mantenimiento o incidencias.'],
        ['Normas de uso','No puedes procesar contenido protegido sin permiso, subir material ilegal, dañino, obsceno o malicioso, interrumpir la plataforma, superar límites con bots ni intentar accesos no autorizados. Las infracciones pueden causar suspensión y acciones legales.'],
        ['Propiedad intelectual','El diseño, código, logotipo, contenido y marcas pertenecen a FormatJet. Los derechos de los archivos subidos siguen siendo tuyos; solo se usan para procesarlos.'],
        ['Limitación de responsabilidad','El servicio se ofrece tal cual. FormatJet no responde por pérdida, corrupción o resultados incorrectos. Haz copias de seguridad de archivos críticos.'],
        ['Terminación','FormatJet puede suspender cuentas que incumplan los Términos. Puedes pedir la eliminación de tu cuenta mediante soporte.'],
        ['Ley aplicable','Rige la legislación turca. Se intentará negociar primero; son competentes los tribunales de Estambul. Las reclamaciones GDPR también pueden dirigirse a la autoridad europea correspondiente.']
      ]},
      de: { title: 'Nutzungsbedingungen', sections: [
        ['Zustimmung','Mit dem Zugriff auf FormatJet stimmen Sie diesen Bedingungen zu. Andernfalls dürfen Sie die Plattform nicht nutzen. Minderjährige benötigen die Zustimmung eines gesetzlichen Vertreters.'],
        ['Dienstbeschreibung','FormatJet bietet Online-Tools zum Konvertieren, Komprimieren und Bearbeiten von PDFs, Dokumenten, Bildern, Videos und Audio. Die meisten Dienste sind kostenlos; Premium-Funktionen können kostenpflichtig sein. Unterbrechungsfreier Zugang wird nicht garantiert.'],
        ['Nutzungsregeln','Untersagt sind unerlaubte urheberrechtlich geschützte Inhalte, illegale, schädliche oder bösartige Dateien, Störungen der Plattform, Limitumgehung per Bot sowie unbefugte Zugriffsversuche. Verstöße können Sperren und rechtliche Schritte auslösen.'],
        ['Geistiges Eigentum','Design, Code, Logo, Inhalte und Marken gehören FormatJet. Rechte an hochgeladenen Dateien bleiben bei Ihnen; FormatJet nutzt sie ausschließlich zur Verarbeitung.'],
        ['Haftungsbegrenzung','Der Dienst wird wie besehen angeboten. FormatJet haftet nicht für Datenverlust, beschädigte Dateien oder fehlerhafte Ausgaben. Sichern Sie wichtige Dateien vorher.'],
        ['Kündigung','Bei Verstößen kann FormatJet Konten sperren oder schließen. Eine Kontolöschung kann jederzeit beim Support beantragt werden.'],
        ['Anwendbares Recht','Es gilt türkisches Recht. Streitigkeiten werden zunächst verhandelt; zuständig sind die Gerichte in Istanbul. DSGVO-Beschwerden können auch an die zuständige EU-Aufsichtsbehörde gerichtet werden.']
      ]},
      fr: { title: 'Conditions d’Utilisation', sections: [
        ['Acceptation','En accédant à FormatJet, vous acceptez ces Conditions. Sinon, n’utilisez pas la plateforme. Les moins de 18 ans doivent l’utiliser avec un représentant légal.'],
        ['Description du service','FormatJet propose des outils en ligne pour convertir, compresser et modifier PDF, documents, images, vidéos et audio. La plupart sont gratuits ; certaines fonctions premium sont payantes. Un accès continu n’est pas garanti pendant la maintenance ou les incidents.'],
        ['Règles d’utilisation','Il est interdit de traiter sans autorisation des contenus protégés, d’envoyer des fichiers illégaux, nuisibles ou malveillants, de perturber la plateforme, de contourner les limites par robot ou de tenter un accès non autorisé.'],
        ['Propriété intellectuelle','Le design, le code, le logo, le contenu et les marques appartiennent à FormatJet. Vous conservez les droits sur vos fichiers ; ils ne sont utilisés que pour leur traitement.'],
        ['Limitation de responsabilité','Le service est fourni en l’état. FormatJet n’est pas responsable d’une perte, corruption ou sortie incorrecte. Sauvegardez les fichiers importants avant traitement.'],
        ['Résiliation','FormatJet peut suspendre les comptes qui enfreignent ces Conditions. Vous pouvez demander la suppression de votre compte au support.'],
        ['Droit applicable','Le droit turc s’applique. Les différends sont d’abord négociés ; les tribunaux d’Istanbul sont compétents. Les plaintes RGPD peuvent aussi être déposées auprès de l’autorité européenne concernée.']
      ]}
    },
    'cerez': {
      en: { title: 'Cookie Policy', sections: [
        ['What Is a Cookie?','Cookies are small text files stored by websites in your browser. They remember preferences, sessions and usage statistics and do not contain the files you process. Session cookies expire when the browser closes; persistent cookies remain for a defined period.'],
        ['Cookies We Use','FormatJet uses the minimum number of cookies needed for service quality: fj_session for sign-in status, fj_theme and fj_lang for interface preferences, and anonymous analytics identifiers where consent is given.'],
        ['Essential Cookies','Essential cookies provide authentication, security and language or theme preferences. Blocking them in your browser may prevent parts of the platform from working correctly.'],
        ['Analytics Cookies','With your consent, anonymous analytics help us understand which tools are used and improve performance. They do not contain file content or directly identifying data.'],
        ['Managing Cookies','You can allow, block or delete cookies in your browser settings. You may withdraw optional-cookie consent at any time. Previously stored cookies may need to be deleted in the browser.'],
        ['Third-Party Cookies','Payment or infrastructure providers may set strictly necessary cookies under their own policies. FormatJet does not use third-party advertising cookies.']
      ]},
      es: { title: 'Política de Cookies', sections: [
        ['¿Qué es una cookie?','Las cookies son pequeños archivos de texto que el sitio guarda en el navegador para recordar preferencias, sesiones y estadísticas. No contienen los archivos que procesas. Las cookies de sesión caducan al cerrar el navegador y las persistentes duran un periodo definido.'],
        ['Cookies que usamos','FormatJet usa el mínimo necesario: fj_session para el inicio de sesión, fj_theme y fj_lang para preferencias, e identificadores de analítica anónima cuando das tu consentimiento.'],
        ['Cookies esenciales','Permiten autenticación, seguridad e idioma o tema. Bloquearlas puede impedir que algunas partes de la plataforma funcionen correctamente.'],
        ['Cookies analíticas','Con tu consentimiento, la analítica anónima nos ayuda a conocer las herramientas usadas y mejorar el rendimiento. No incluye contenido de archivos ni datos identificativos directos.'],
        ['Gestión','Puedes permitir, bloquear o borrar cookies en el navegador y retirar el consentimiento opcional en cualquier momento. Quizá debas borrar las ya guardadas.'],
        ['Cookies de terceros','Los proveedores de pago o infraestructura pueden usar cookies estrictamente necesarias según sus políticas. FormatJet no usa cookies publicitarias de terceros.']
      ]},
      de: { title: 'Cookie-Richtlinie', sections: [
        ['Was sind Cookies?','Cookies sind kleine Textdateien im Browser. Sie speichern Einstellungen, Sitzungen und Nutzungsstatistiken, jedoch keine verarbeiteten Dateien. Sitzungscookies enden beim Schließen des Browsers; dauerhafte Cookies gelten für einen festgelegten Zeitraum.'],
        ['Verwendete Cookies','FormatJet nutzt nur das Nötigste: fj_session für den Anmeldestatus, fj_theme und fj_lang für Oberflächeneinstellungen sowie mit Einwilligung anonyme Analysekennungen.'],
        ['Notwendige Cookies','Sie ermöglichen Anmeldung, Sicherheit sowie Sprach- und Designwahl. Werden sie blockiert, funktionieren Teile der Plattform möglicherweise nicht korrekt.'],
        ['Analyse-Cookies','Mit Einwilligung helfen anonyme Statistiken, genutzte Tools zu verstehen und die Leistung zu verbessern. Sie enthalten keine Dateiinhalte oder direkt identifizierende Daten.'],
        ['Cookie-Verwaltung','Cookies können im Browser erlaubt, blockiert oder gelöscht werden. Eine Einwilligung für optionale Cookies kann jederzeit widerrufen werden.'],
        ['Drittanbieter','Zahlungs- oder Infrastrukturanbieter können unbedingt notwendige Cookies nach eigenen Richtlinien setzen. FormatJet verwendet keine Werbe-Cookies Dritter.']
      ]},
      fr: { title: 'Politique de Cookies', sections: [
        ['Qu’est-ce qu’un cookie ?','Les cookies sont de petits fichiers texte enregistrés dans le navigateur pour mémoriser préférences, sessions et statistiques. Ils ne contiennent pas les fichiers traités. Les cookies de session expirent à la fermeture ; les persistants ont une durée définie.'],
        ['Cookies utilisés','FormatJet utilise le minimum nécessaire : fj_session pour la connexion, fj_theme et fj_lang pour les préférences, ainsi que des identifiants statistiques anonymes avec votre consentement.'],
        ['Cookies essentiels','Ils assurent l’authentification, la sécurité, la langue et le thème. Les bloquer peut empêcher certaines fonctions de marcher correctement.'],
        ['Cookies analytiques','Avec votre accord, des statistiques anonymes nous aident à comprendre les outils utilisés et améliorer les performances. Elles n’incluent ni contenu de fichier ni donnée directement identifiante.'],
        ['Gestion','Vous pouvez autoriser, bloquer ou supprimer les cookies dans le navigateur et retirer votre consentement aux cookies facultatifs à tout moment.'],
        ['Cookies tiers','Les prestataires de paiement ou d’infrastructure peuvent déposer des cookies strictement nécessaires selon leurs politiques. FormatJet n’utilise pas de cookies publicitaires tiers.']
      ]}
    },
    'kvkk': {
      en: { title: 'KVKK Privacy Notice', sections: [
        ['Data Controller','Under Turkish Personal Data Protection Law No. 6698, FormatJet Teknoloji A.Ş. is the data controller. FormatJet is an online platform for converting PDF, document, image, video and audio files.'],
        ['Personal Data Processed','For all users we may process IP and connection metadata, browser, operating system, language, tool and duration, file metadata, session and cookie identifiers. For members we additionally process name, email, encrypted authentication data, account dates, history and preferences. File contents are not read, stored or shared and are deleted within one hour.'],
        ['Purposes','Data is processed to provide conversion, prevent abuse, improve quality, meet legal duties, manage member accounts and provide technical support.'],
        ['Legal Basis','Processing relies on performance of a contract, legitimate interests in platform security, explicit consent for optional analytics or marketing, and legal obligations under KVKK Articles 5 and 6.'],
        ['Retention','Uploaded files: at most one hour. Logs: 90 days. Member data: while the account is active and up to 30 days after deletion. Support requests: two years after resolution.'],
        ['Transfers','Necessary data may be transferred only to security-committed cloud and CDN providers. Transfers are protected under KVKK Articles 8 and 9 and GDPR. Data is not sold or shared for commercial purposes.'],
        ['Your Rights','Under KVKK Article 11 you may ask whether data is processed, request information, learn the purpose and recipients, correct or delete data, object to automated outcomes and claim compensation for damage.'],
        ['Contact','To exercise your rights, email destek@formatjet.com or use the Contact Form. Requests are answered within 30 days and identity verification may be required.']
      ]},
      es: { title: 'Aviso de Privacidad KVKK', sections: [
        ['Responsable','Conforme a la Ley turca n.º 6698, FormatJet Teknoloji A.Ş. es el responsable del tratamiento. FormatJet permite convertir PDF, documentos, imágenes, vídeo y audio en línea.'],
        ['Datos tratados','Podemos tratar IP y metadatos de conexión, navegador, sistema, idioma, herramienta, duración, metadatos del archivo, sesión y cookies. Para miembros también nombre, correo, autenticación cifrada, fechas, historial y preferencias. El contenido de los archivos no se lee, guarda ni comparte y se elimina en una hora.'],
        ['Finalidades','Prestación de la conversión, prevención de abusos, mejora de calidad, obligaciones legales, gestión de cuentas y soporte técnico.'],
        ['Base jurídica','Ejecución del contrato, interés legítimo en la seguridad, consentimiento para analítica o marketing opcional y obligaciones legales según los artículos 5 y 6 de KVKK.'],
        ['Conservación','Archivos: máximo una hora. Registros: 90 días. Cuenta: mientras esté activa y hasta 30 días tras borrarla. Soporte: dos años después de resolverlo.'],
        ['Transferencias','Los datos necesarios solo pueden transferirse a proveedores seguros de nube y CDN, bajo KVKK y GDPR. No se venden ni comparten con fines comerciales.'],
        ['Tus derechos','Puedes saber si tratamos tus datos, solicitar información, conocer finalidad y destinatarios, corregir o borrar, oponerte a decisiones automáticas y reclamar daños.'],
        ['Contacto','Escribe a destek@formatjet.com o usa el Formulario de contacto. Respondemos en 30 días y puede ser necesaria verificación de identidad.']
      ]},
      de: { title: 'KVKK-Datenschutzhinweis', sections: [
        ['Verantwortlicher','Nach dem türkischen Datenschutzgesetz Nr. 6698 ist FormatJet Teknoloji A.Ş. der Verantwortliche. FormatJet ist eine Online-Plattform zur Konvertierung von PDF-, Dokument-, Bild-, Video- und Audiodateien.'],
        ['Verarbeitete Daten','Verarbeitet werden können IP- und Verbindungsmetadaten, Browser, System, Sprache, Tool, Dauer, Dateimetadaten sowie Sitzung und Cookies. Bei Mitgliedern zusätzlich Name, E-Mail, verschlüsselte Anmeldung, Kontodaten, Verlauf und Einstellungen. Dateiinhalte werden nicht gelesen, gespeichert oder geteilt und binnen einer Stunde gelöscht.'],
        ['Zwecke','Bereitstellung der Konvertierung, Missbrauchsschutz, Qualitätsverbesserung, gesetzliche Pflichten, Kontoverwaltung und technischer Support.'],
        ['Rechtsgrundlage','Vertragserfüllung, berechtigtes Sicherheitsinteresse, Einwilligung für optionale Analyse oder Marketing und gesetzliche Pflichten gemäß KVKK Artikel 5 und 6.'],
        ['Speicherung','Dateien: höchstens eine Stunde. Logs: 90 Tage. Kontodaten: während der Aktivität und bis 30 Tage nach Löschung. Support: zwei Jahre nach Abschluss.'],
        ['Übermittlung','Notwendige Daten gehen nur an verpflichtete Cloud- und CDN-Anbieter unter KVKK und DSGVO. Sie werden nicht verkauft oder kommerziell geteilt.'],
        ['Ihre Rechte','Sie können Verarbeitung und Auskunft erfragen, Zweck und Empfänger erfahren, berichtigen oder löschen lassen, automatisierten Ergebnissen widersprechen und Schadensersatz verlangen.'],
        ['Kontakt','Schreiben Sie an destek@formatjet.com oder nutzen Sie das Kontaktformular. Antworten erfolgen binnen 30 Tagen; eine Identitätsprüfung kann nötig sein.']
      ]},
      fr: { title: 'Notice de Confidentialité KVKK', sections: [
        ['Responsable','Selon la loi turque n° 6698, FormatJet Teknoloji A.Ş. est responsable du traitement. FormatJet permet de convertir en ligne PDF, documents, images, vidéos et audio.'],
        ['Données traitées','Nous pouvons traiter IP et connexion, navigateur, système, langue, outil, durée, métadonnées du fichier, session et cookies. Pour les membres : nom, e-mail, authentification chiffrée, dates, historique et préférences. Le contenu des fichiers n’est ni lu, ni stocké, ni partagé et est supprimé sous une heure.'],
        ['Finalités','Fournir la conversion, prévenir les abus, améliorer la qualité, respecter la loi, gérer les comptes et assurer le support technique.'],
        ['Base juridique','Exécution du contrat, intérêt légitime de sécurité, consentement pour les analyses ou le marketing facultatifs et obligations légales selon les articles 5 et 6 de la KVKK.'],
        ['Conservation','Fichiers : une heure maximum. Journaux : 90 jours. Compte : pendant son activité et jusqu’à 30 jours après suppression. Support : deux ans après résolution.'],
        ['Transferts','Les données nécessaires vont uniquement à des prestataires cloud et CDN engagés sur la sécurité, sous KVKK et RGPD. Elles ne sont ni vendues ni partagées commercialement.'],
        ['Vos droits','Vous pouvez demander si vos données sont traitées, obtenir des informations, connaître finalité et destinataires, corriger ou supprimer, contester un résultat automatisé et demander réparation.'],
        ['Contact','Écrivez à destek@formatjet.com ou utilisez le Formulaire de contact. Réponse sous 30 jours ; une vérification d’identité peut être requise.']
      ]}
    }
  };
  let originalLegal = null;

  function translateLegalPage(lang) {
    const slug = location.pathname.split('/').pop().replace(/\.html?$/i, '');
    const pageCopy = LEGAL_COPY[slug];
    const article = document.querySelector('.page-main.page-content');
    const toc = document.querySelector('.page-toc-list');
    const title = document.querySelector('.page-title');
    if (!pageCopy || !article || !toc || !title) return;
    if (!originalLegal) originalLegal = { article: article.innerHTML, toc: toc.innerHTML, title: title.textContent };
    if (lang === 'tr') {
      article.innerHTML = originalLegal.article;
      toc.innerHTML = originalLegal.toc;
      title.textContent = originalLegal.title;
      return;
    }
    const copy = pageCopy[lang];
    if (!copy) return;
    title.textContent = copy.title;
    article.innerHTML = copy.sections.map((section, index) => '<h2 id="section-' + (index + 1) + '">' + (index + 1) + '. ' + section[0] + '</h2><p>' + section[1] + '</p>').join('');
    toc.innerHTML = copy.sections.map((section, index) => '<li><a href="#section-' + (index + 1) + '">' + (index + 1) + '. ' + section[0] + '</a></li>').join('');
  }

  function autoValue(source, lang) {
    if (!source || lang === 'tr') return source;
    const key = Object.keys(T.tr).find(k => typeof T.tr[k] === 'string' && T.tr[k] === source);
    if (key && T[lang] && T[lang][key]) return T[lang][key];
    const descKey = Object.keys(T.tr._toolDescs || {}).find(k => T.tr._toolDescs[k] === source);
    if (descKey && T[lang] && T[lang]._toolDescs && T[lang]._toolDescs[descKey]) return T[lang]._toolDescs[descKey];
    const row = AUTO_CATALOG[source];
    if (row && AUTO_INDEX[lang] !== undefined) return row[AUTO_INDEX[lang]];
    const prefixPatterns = ['Son 7 gün:','İşleniyor:','Yüklenemedi:','Metin tanınıyor:'];
    for (const prefix of prefixPatterns) {
      if (source.startsWith(prefix)) return autoValue(prefix, lang) + source.slice(prefix.length);
    }
    if (source.endsWith(' yeni')) return source.slice(0, -5) + ' ' + autoValue('yeni', lang);
    if (source.includes(' · ')) return source.split(' · ').map(part => autoValue(part, lang)).join(' · ');
    return source;
  }

  function translateTextNode(node, lang) {
    if (!node || !node.nodeValue || !node.parentElement) return;
    if (node.parentElement.closest('script,style,noscript,textarea,[data-i18n],[data-tool-name]')) return;
    const raw = node.nodeValue;
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (!AUTO_NODE_SOURCES.has(node)) AUTO_NODE_SOURCES.set(node, trimmed);
    const source = AUTO_NODE_SOURCES.get(node);
    const translated = autoValue(source, lang);
    if (translated === source && lang !== 'tr') return;
    const lead = raw.match(/^\s*/)[0];
    const tail = raw.match(/\s*$/)[0];
    node.nodeValue = lead + translated + tail;
  }

  function translateAutomatic(root, lang) {
    const scope = root && root.nodeType === 1 ? root : document.body;
    if (!scope) return;
    autoObserverPaused = true;
    const keyed = [];
    if (scope.matches && scope.matches('[data-i18n]')) keyed.push(scope);
    scope.querySelectorAll('[data-i18n]').forEach(el => keyed.push(el));
    keyed.forEach(el => {
      const value = T[lang] && T[lang][el.dataset.i18n];
      if (value) el.textContent = value;
    });
    const toolNames = [];
    if (scope.matches && scope.matches('[data-tool-name]')) toolNames.push(scope);
    scope.querySelectorAll('[data-tool-name]').forEach(el => toolNames.push(el));
    toolNames.forEach(el => {
      if (!el.dataset.tr) el.dataset.tr = el.textContent.trim();
      el.textContent = fjToolName(el.dataset.tr, lang);
    });
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => translateTextNode(node, lang));
    scope.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el => {
      if (!el.dataset.fjPlaceholderSource) el.dataset.fjPlaceholderSource = el.getAttribute('placeholder') || '';
      el.setAttribute('placeholder', autoValue(el.dataset.fjPlaceholderSource, lang));
    });
    scope.querySelectorAll('[aria-label]').forEach(el => {
      if (!el.dataset.fjAriaSource) el.dataset.fjAriaSource = el.getAttribute('aria-label') || '';
      el.setAttribute('aria-label', autoValue(el.dataset.fjAriaSource, lang));
    });
    autoObserverPaused = false;
  }

  function translateToolDetails(lang) {
    document.querySelectorAll('.tool-page-desc').forEach(el => {
      if (!el.dataset.fjTrDesc) el.dataset.fjTrDesc = el.textContent.trim();
      if (lang === 'tr') { el.textContent = el.dataset.fjTrDesc; return; }
      const nameEl = el.closest('.tool-header')?.querySelector('[data-tool-name]');
      const name = nameEl ? nameEl.textContent.trim() : '';
      const templates = {
        en: `Use ${name} quickly and securely, directly in your browser.`,
        es: `Usa ${name} de forma rápida y segura, directamente en tu navegador.`,
        de: `${name} schnell und sicher direkt im Browser nutzen.`,
        fr: `Utilisez ${name} rapidement et en toute sécurité, directement dans votre navigateur.`
      };
      el.textContent = templates[lang] || el.dataset.fjTrDesc;
    });
    const title = document.querySelector('.tool-page-title,[data-i18n="cat-pdf-title"],[data-i18n="cat-belge-title"],[data-i18n="cat-gorsel-title"],[data-i18n="cat-video-title"],[data-i18n="cat-ses-title"],[data-i18n="tools-title"],.page-title,.pricing-title,.account-title,.login-title,.login-form-title,.admin-title');
    if (title && title.textContent.trim()) document.title = title.textContent.trim() + ' — FormatJet';
  }

  function applyLanguage(lang) {
    if (!T[lang]) lang = 'tr';
    const dict = T[lang];
    document.documentElement.lang = lang;
    localStorage.setItem('fj-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = dict[el.dataset.i18n];
      if (v) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const v = dict[el.dataset.i18nPlaceholder];
      if (v) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-tool]').forEach(el => {
      const v = dict._tools && dict._tools[el.dataset.i18nTool];
      if (v) el.textContent = v;
    });

    /* Araç adları: orijinal TR adı data-tr'de sakla, oradan çevir */
    document.querySelectorAll('[data-tool-name]').forEach(el => {
      if (!el.dataset.tr) el.dataset.tr = el.textContent.trim();
      el.textContent = fjToolName(el.dataset.tr, lang);
    });

    document.querySelectorAll('.btn-lang-text').forEach(el => { el.textContent = lang.toUpperCase(); });
    document.querySelectorAll('.btn-lang-footer-text').forEach(el => { el.textContent = LANG_NAMES[lang]; });
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    translateLegalPage(lang);
    translateAutomatic(document.body, lang);
    translateToolDetails(lang);
    window.dispatchEvent(new CustomEvent('fj:languagechange', { detail: { lang } }));
  }

  const UI_STATE = {
    tr: {
      'ui.steps.aria': 'Dönüştürme adımları', 'ui.step.file': 'Dosya seç', 'ui.step.settings': 'Ayarla', 'ui.step.convert': 'Dönüştür', 'ui.step.download': 'İndir',
      'ui.processing.start': 'Dosya hazırlanıyor', 'ui.processing.note': 'İşlem cihazında güvenli biçimde çalışıyor. Bu pencereyi kapatma.', 'ui.processing.aria': 'Dönüştürme aşamaları',
      'ui.stage.analysis': 'Analiz', 'ui.stage.conversion': 'Dönüştürme', 'ui.stage.optimization': 'Optimizasyon', 'ui.stage.completion': 'Tamamlama',
      'ui.stage.analyzing': 'Dosya analiz ediliyor', 'ui.stage.converting': 'Format dönüştürülüyor', 'ui.stage.optimizing': 'Çıktı optimize ediliyor', 'ui.stage.downloading': 'İndirme hazırlanıyor',
      'ui.error.heading': 'Bu dosya kullanılamıyor', 'ui.error.dismiss': 'Tamam', 'ui.error.unsupported': 'Dosya türü desteklenmiyor',
      'ui.error.unsupportedMessage': '“{name}” bu araçla kullanılamaz. Kabul edilen türler: {formats}.', 'ui.error.size': 'Dosya boyutu sınırı aşıldı',
      'ui.error.sizeMessage': '“{name}” {limit} MB sınırından büyük. Daha küçük bir dosya seç.', 'ui.error.single': 'Tek dosya seçmelisin',
      'ui.error.singleMessage': 'Bu araç her işlemde yalnızca bir dosya kabul ediyor. İlk dosya seçildi.',
      'ui.drop.active': 'Dosyayı buraya bırak', 'ui.drop.check': 'Bıraktığında tür ve boyut otomatik kontrol edilir',
      'ui.queue.title': 'Yükleme kuyruğu', 'ui.queue.hint': 'Dosyaları sürükleyerek sıralayabilirsin', 'ui.queue.one': '1 dosya hazır', 'ui.queue.many': '{count} dosya sırada',
      'ui.file.ready': 'Hazır', 'ui.file.uploaded': 'Yüklendi', 'ui.file.remove': '{name} dosyasını kaldır', 'ui.file.removed': '{name} kuyruktan çıkarıldı.', 'ui.file.removedTitle': 'Dosya kaldırıldı',
      'ui.status.processing': 'İşleniyor...', 'ui.status.preparing': 'Hazırlanıyor...',
      'ui.success.one': 'Dosyan hazır!', 'ui.success.many': '{count} dosya hazır!', 'ui.success.note': 'Dönüştürme başarıyla tamamlandı. Dosyanı şimdi indirebilirsin.',
      'ui.success.download': 'İndir', 'ui.success.downloadAll': 'Tümünü ZIP Olarak İndir', 'ui.success.preparing': 'Hazırlanıyor...', 'ui.success.toast': 'Dosyan indirilmeye hazır.', 'ui.success.toastTitle': 'Dönüştürme tamamlandı',
      'ui.contact.title': 'Mesaj hazırlığı', 'ui.contact.steps': '4 kısa adım', 'ui.contact.empty': 'Başlamaya hazır', 'ui.contact.started': 'İyi başladın', 'ui.contact.almost': 'Neredeyse hazır', 'ui.contact.ready': 'Göndermeye hazır', 'ui.contact.completed': '{done} / {total} alan tamamlandı',
      'ui.contact.required': 'Lütfen tüm alanları doldurun.', 'ui.contact.sending': 'Gönderiliyor...', 'ui.contact.send': 'Gönder', 'ui.contact.failed': 'Gönderilemedi: {message}'
    },
    en: {
      'ui.steps.aria': 'Conversion steps', 'ui.step.file': 'Choose file', 'ui.step.settings': 'Adjust', 'ui.step.convert': 'Convert', 'ui.step.download': 'Download',
      'ui.processing.start': 'Preparing your file', 'ui.processing.note': 'Processing runs securely on your device. Keep this window open.', 'ui.processing.aria': 'Conversion stages',
      'ui.stage.analysis': 'Analysis', 'ui.stage.conversion': 'Conversion', 'ui.stage.optimization': 'Optimization', 'ui.stage.completion': 'Completion',
      'ui.stage.analyzing': 'Analyzing file', 'ui.stage.converting': 'Converting format', 'ui.stage.optimizing': 'Optimizing output', 'ui.stage.downloading': 'Preparing download',
      'ui.error.heading': 'This file cannot be used', 'ui.error.dismiss': 'Got it', 'ui.error.unsupported': 'File type not supported',
      'ui.error.unsupportedMessage': '“{name}” cannot be used with this tool. Accepted types: {formats}.', 'ui.error.size': 'File size limit exceeded',
      'ui.error.sizeMessage': '“{name}” exceeds the {limit} MB limit. Choose a smaller file.', 'ui.error.single': 'Choose one file',
      'ui.error.singleMessage': 'This tool accepts only one file per operation. The first file was selected.',
      'ui.drop.active': 'Drop your file here', 'ui.drop.check': 'Type and size are checked automatically when you drop it',
      'ui.queue.title': 'Upload queue', 'ui.queue.hint': 'Drag files to reorder them', 'ui.queue.one': '1 file ready', 'ui.queue.many': '{count} files queued',
      'ui.file.ready': 'Ready', 'ui.file.uploaded': 'Uploaded', 'ui.file.remove': 'Remove {name}', 'ui.file.removed': '{name} was removed from the queue.', 'ui.file.removedTitle': 'File removed',
      'ui.status.processing': 'Processing...', 'ui.status.preparing': 'Preparing...',
      'ui.success.one': 'Your file is ready!', 'ui.success.many': '{count} files are ready!', 'ui.success.note': 'Conversion completed successfully. Your download is ready.',
      'ui.success.download': 'Download', 'ui.success.downloadAll': 'Download All as ZIP', 'ui.success.preparing': 'Preparing...', 'ui.success.toast': 'Your file is ready to download.', 'ui.success.toastTitle': 'Conversion complete',
      'ui.contact.title': 'Message readiness', 'ui.contact.steps': '4 quick steps', 'ui.contact.empty': 'Ready to start', 'ui.contact.started': 'Good start', 'ui.contact.almost': 'Almost ready', 'ui.contact.ready': 'Ready to send', 'ui.contact.completed': '{done} / {total} fields completed',
      'ui.contact.required': 'Please complete all fields.', 'ui.contact.sending': 'Sending...', 'ui.contact.send': 'Send', 'ui.contact.failed': 'Could not send: {message}'
    },
    es: {
      'ui.steps.aria': 'Pasos de conversión', 'ui.step.file': 'Elegir archivo', 'ui.step.settings': 'Ajustar', 'ui.step.convert': 'Convertir', 'ui.step.download': 'Descargar',
      'ui.processing.start': 'Preparando tu archivo', 'ui.processing.note': 'El proceso se ejecuta de forma segura en tu dispositivo. Mantén esta ventana abierta.', 'ui.processing.aria': 'Etapas de conversión',
      'ui.stage.analysis': 'Análisis', 'ui.stage.conversion': 'Conversión', 'ui.stage.optimization': 'Optimización', 'ui.stage.completion': 'Finalización',
      'ui.stage.analyzing': 'Analizando archivo', 'ui.stage.converting': 'Convirtiendo formato', 'ui.stage.optimizing': 'Optimizando resultado', 'ui.stage.downloading': 'Preparando descarga',
      'ui.error.heading': 'Este archivo no se puede usar', 'ui.error.dismiss': 'Entendido', 'ui.error.unsupported': 'Tipo de archivo no compatible',
      'ui.error.unsupportedMessage': '“{name}” no se puede usar con esta herramienta. Tipos aceptados: {formats}.', 'ui.error.size': 'Se superó el límite de tamaño',
      'ui.error.sizeMessage': '“{name}” supera el límite de {limit} MB. Elige un archivo más pequeño.', 'ui.error.single': 'Elige un archivo', 'ui.error.singleMessage': 'Esta herramienta acepta un solo archivo por operación. Se seleccionó el primero.',
      'ui.drop.active': 'Suelta el archivo aquí', 'ui.drop.check': 'El tipo y el tamaño se comprueban automáticamente', 'ui.queue.title': 'Cola de carga', 'ui.queue.hint': 'Arrastra los archivos para ordenarlos', 'ui.queue.one': '1 archivo listo', 'ui.queue.many': '{count} archivos en cola',
      'ui.file.ready': 'Listo', 'ui.file.uploaded': 'Cargado', 'ui.file.remove': 'Quitar {name}', 'ui.file.removed': '{name} se eliminó de la cola.', 'ui.file.removedTitle': 'Archivo eliminado',
      'ui.status.processing': 'Procesando...', 'ui.status.preparing': 'Preparando...', 'ui.success.one': '¡Tu archivo está listo!', 'ui.success.many': '¡{count} archivos están listos!', 'ui.success.note': 'La conversión terminó correctamente. Ya puedes descargar.',
      'ui.success.download': 'Descargar', 'ui.success.downloadAll': 'Descargar todo en ZIP', 'ui.success.preparing': 'Preparando...', 'ui.success.toast': 'Tu archivo está listo para descargar.', 'ui.success.toastTitle': 'Conversión completada',
      'ui.contact.title': 'Preparación del mensaje', 'ui.contact.steps': '4 pasos rápidos', 'ui.contact.empty': 'Listo para empezar', 'ui.contact.started': 'Buen comienzo', 'ui.contact.almost': 'Casi listo', 'ui.contact.ready': 'Listo para enviar', 'ui.contact.completed': '{done} / {total} campos completados',
      'ui.contact.required': 'Completa todos los campos.', 'ui.contact.sending': 'Enviando...', 'ui.contact.send': 'Enviar', 'ui.contact.failed': 'No se pudo enviar: {message}'
    },
    de: {
      'ui.steps.aria': 'Konvertierungsschritte', 'ui.step.file': 'Datei wählen', 'ui.step.settings': 'Anpassen', 'ui.step.convert': 'Konvertieren', 'ui.step.download': 'Herunterladen',
      'ui.processing.start': 'Datei wird vorbereitet', 'ui.processing.note': 'Die Verarbeitung läuft sicher auf deinem Gerät. Lass dieses Fenster geöffnet.', 'ui.processing.aria': 'Konvertierungsphasen',
      'ui.stage.analysis': 'Analyse', 'ui.stage.conversion': 'Konvertierung', 'ui.stage.optimization': 'Optimierung', 'ui.stage.completion': 'Abschluss', 'ui.stage.analyzing': 'Datei wird analysiert', 'ui.stage.converting': 'Format wird konvertiert', 'ui.stage.optimizing': 'Ausgabe wird optimiert', 'ui.stage.downloading': 'Download wird vorbereitet',
      'ui.error.heading': 'Diese Datei kann nicht verwendet werden', 'ui.error.dismiss': 'Verstanden', 'ui.error.unsupported': 'Dateityp nicht unterstützt', 'ui.error.unsupportedMessage': '„{name}“ kann mit diesem Tool nicht verwendet werden. Erlaubte Typen: {formats}.',
      'ui.error.size': 'Dateigrößenlimit überschritten', 'ui.error.sizeMessage': '„{name}“ überschreitet das Limit von {limit} MB. Wähle eine kleinere Datei.', 'ui.error.single': 'Eine Datei auswählen', 'ui.error.singleMessage': 'Dieses Tool akzeptiert nur eine Datei pro Vorgang. Die erste Datei wurde ausgewählt.',
      'ui.drop.active': 'Datei hier ablegen', 'ui.drop.check': 'Typ und Größe werden beim Ablegen automatisch geprüft', 'ui.queue.title': 'Upload-Warteschlange', 'ui.queue.hint': 'Dateien zum Sortieren ziehen', 'ui.queue.one': '1 Datei bereit', 'ui.queue.many': '{count} Dateien in der Warteschlange',
      'ui.file.ready': 'Bereit', 'ui.file.uploaded': 'Hochgeladen', 'ui.file.remove': '{name} entfernen', 'ui.file.removed': '{name} wurde aus der Warteschlange entfernt.', 'ui.file.removedTitle': 'Datei entfernt',
      'ui.status.processing': 'Wird verarbeitet...', 'ui.status.preparing': 'Wird vorbereitet...', 'ui.success.one': 'Deine Datei ist bereit!', 'ui.success.many': '{count} Dateien sind bereit!', 'ui.success.note': 'Die Konvertierung wurde erfolgreich abgeschlossen. Der Download ist bereit.',
      'ui.success.download': 'Herunterladen', 'ui.success.downloadAll': 'Alle als ZIP herunterladen', 'ui.success.preparing': 'Wird vorbereitet...', 'ui.success.toast': 'Deine Datei steht zum Download bereit.', 'ui.success.toastTitle': 'Konvertierung abgeschlossen',
      'ui.contact.title': 'Nachricht vorbereiten', 'ui.contact.steps': '4 kurze Schritte', 'ui.contact.empty': 'Startbereit', 'ui.contact.started': 'Guter Anfang', 'ui.contact.almost': 'Fast fertig', 'ui.contact.ready': 'Bereit zum Senden', 'ui.contact.completed': '{done} / {total} Felder ausgefüllt',
      'ui.contact.required': 'Bitte alle Felder ausfüllen.', 'ui.contact.sending': 'Wird gesendet...', 'ui.contact.send': 'Senden', 'ui.contact.failed': 'Senden fehlgeschlagen: {message}'
    },
    fr: {
      'ui.steps.aria': 'Étapes de conversion', 'ui.step.file': 'Choisir un fichier', 'ui.step.settings': 'Régler', 'ui.step.convert': 'Convertir', 'ui.step.download': 'Télécharger',
      'ui.processing.start': 'Préparation du fichier', 'ui.processing.note': 'Le traitement s’exécute en toute sécurité sur votre appareil. Gardez cette fenêtre ouverte.', 'ui.processing.aria': 'Phases de conversion',
      'ui.stage.analysis': 'Analyse', 'ui.stage.conversion': 'Conversion', 'ui.stage.optimization': 'Optimisation', 'ui.stage.completion': 'Finalisation', 'ui.stage.analyzing': 'Analyse du fichier', 'ui.stage.converting': 'Conversion du format', 'ui.stage.optimizing': 'Optimisation du résultat', 'ui.stage.downloading': 'Préparation du téléchargement',
      'ui.error.heading': 'Ce fichier ne peut pas être utilisé', 'ui.error.dismiss': 'Compris', 'ui.error.unsupported': 'Type de fichier non pris en charge', 'ui.error.unsupportedMessage': '« {name} » ne peut pas être utilisé avec cet outil. Types acceptés : {formats}.',
      'ui.error.size': 'Limite de taille dépassée', 'ui.error.sizeMessage': '« {name} » dépasse la limite de {limit} Mo. Choisissez un fichier plus petit.', 'ui.error.single': 'Choisissez un seul fichier', 'ui.error.singleMessage': 'Cet outil n’accepte qu’un fichier par opération. Le premier fichier a été sélectionné.',
      'ui.drop.active': 'Déposez le fichier ici', 'ui.drop.check': 'Le type et la taille sont vérifiés automatiquement', 'ui.queue.title': 'File d’envoi', 'ui.queue.hint': 'Faites glisser les fichiers pour les réordonner', 'ui.queue.one': '1 fichier prêt', 'ui.queue.many': '{count} fichiers en attente',
      'ui.file.ready': 'Prêt', 'ui.file.uploaded': 'Envoyé', 'ui.file.remove': 'Retirer {name}', 'ui.file.removed': '{name} a été retiré de la file.', 'ui.file.removedTitle': 'Fichier retiré',
      'ui.status.processing': 'Traitement...', 'ui.status.preparing': 'Préparation...', 'ui.success.one': 'Votre fichier est prêt !', 'ui.success.many': '{count} fichiers sont prêts !', 'ui.success.note': 'La conversion est terminée. Votre téléchargement est prêt.',
      'ui.success.download': 'Télécharger', 'ui.success.downloadAll': 'Tout télécharger en ZIP', 'ui.success.preparing': 'Préparation...', 'ui.success.toast': 'Votre fichier est prêt à être téléchargé.', 'ui.success.toastTitle': 'Conversion terminée',
      'ui.contact.title': 'Préparation du message', 'ui.contact.steps': '4 étapes rapides', 'ui.contact.empty': 'Prêt à commencer', 'ui.contact.started': 'Bon début', 'ui.contact.almost': 'Presque prêt', 'ui.contact.ready': 'Prêt à envoyer', 'ui.contact.completed': '{done} / {total} champs remplis',
      'ui.contact.required': 'Veuillez remplir tous les champs.', 'ui.contact.sending': 'Envoi...', 'ui.contact.send': 'Envoyer', 'ui.contact.failed': 'Envoi impossible : {message}'
    }
  };

  window.fjApplyLanguage = applyLanguage;
  window.fjT = function (key, fallback) {
    const lang = localStorage.getItem('fj-lang') || 'tr';
    const direct = (UI_STATE[lang] && UI_STATE[lang][key]) || (UI_STATE.tr && UI_STATE.tr[key]) || (T[lang] && T[lang][key]) || T.tr[key];
    if (direct) return direct;
    const source = fallback || key;
    return autoValue(source, lang);
  };
  window.fjTF = function (key, fallback, values) {
    let value = window.fjT(key, fallback);
    Object.entries(values || {}).forEach(([name, replacement]) => { value = value.replaceAll('{' + name + '}', String(replacement)); });
    return value;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('langPanel');
    const btnLang = document.getElementById('btnLang');
    const btnLangFooter = document.getElementById('btnLangFooter');

    function togglePanel(e) {
      if (!panel) return;
      e.stopPropagation();
      panel.hidden = !panel.hidden;
      if (!panel.hidden && e.currentTarget === btnLangFooter) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    if (btnLang) btnLang.addEventListener('click', togglePanel);
    if (btnLangFooter) btnLangFooter.addEventListener('click', togglePanel);
    document.addEventListener('click', (e) => {
      if (panel && !panel.hidden && !e.target.closest('.lang-wrapper')) panel.hidden = true;
    });

    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        applyLanguage(btn.dataset.lang);
        if (panel) panel.hidden = true;
      });
    });

    applyLanguage(localStorage.getItem('fj-lang') || 'tr');

    const observer = new MutationObserver(records => {
      if (autoObserverPaused) return;
      const lang = localStorage.getItem('fj-lang') || 'tr';
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === 1) translateAutomatic(node, lang);
        else if (node.nodeType === 3) translateTextNode(node, lang);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
