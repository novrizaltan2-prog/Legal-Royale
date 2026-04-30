// ============================================================
// characters.js — Data karakter & dialog Legal Royale
// ============================================================

const CHARACTERS = {
  hakim: {
    id: 'hakim',
    name: 'Hakim Ketua',
    role: 'Hakim',
    icon: '⚖️',
    color: '#D4AF37',
    desc: 'Memimpin jalannya persidangan, memberikan putusan berdasarkan hukum dan keadilan.',
    // Path audio: file ada di assets/audio/hakim/
    // Format: ['webm','mp3','ogg'] — urutan prioritas
    audio: {
      intro:   { file: 'audio/hakim/hakim_intro',   formats: ['webm','mp3','ogg'] },
      sumpah:  { file: 'audio/hakim/hakim_sumpah',  formats: ['webm','mp3','ogg'] },
      tanya:   { file: 'audio/hakim/hakim_tanya',   formats: ['webm','mp3','ogg'] },
      putusan: { file: 'audio/hakim/hakim_putusan', formats: ['webm','mp3','ogg'] },
    }
  },
  jaksa: {
    id: 'jaksa',
    name: 'Jaksa Penuntut',
    role: 'Jaksa',
    icon: '👨‍⚖️',
    color: '#E94560',
    desc: 'Mewakili negara dalam penuntutan pidana terhadap terdakwa.',
    audio: {
      intro:    { file: 'audio/jaksa/jaksa_intro',    formats: ['webm','mp3','ogg'] },
      tuntutan: { file: 'audio/jaksa/jaksa_tuntutan', formats: ['webm','mp3','ogg'] },
      tanya:    { file: 'audio/jaksa/jaksa_tanya',    formats: ['webm','mp3','ogg'] },
    }
  },
  saksi: {
    id: 'saksi',
    name: 'Saksi',
    role: 'Saksi',
    icon: '🧑',
    color: '#3498DB',
    desc: 'Memberikan keterangan mengenai peristiwa yang disaksikannya secara langsung.',
    audio: {
      intro:     { file: 'audio/saksi/saksi_intro',     formats: ['webm','mp3','ogg'] },
      keterangan:{ file: 'audio/saksi/saksi_keterangan',formats: ['webm','mp3','ogg'] },
    }
  },
  terdakwa: {
    id: 'terdakwa',
    name: 'Terdakwa',
    role: 'Terdakwa',
    icon: '😰',
    color: '#95A5A6',
    desc: 'Seseorang yang didakwa melakukan tindak pidana dan menjalani proses persidangan.',
    audio: {
      intro:  { file: 'audio/terdakwa/terdakwa_intro',  formats: ['webm','mp3','ogg'] },
      pledoi: { file: 'audio/terdakwa/terdakwa_pledoi', formats: ['webm','mp3','ogg'] },
    }
  },
  advokat: {
    id: 'advokat',
    name: 'Advokat / Pengacara',
    role: 'Advokat',
    icon: '👩‍⚖️',
    color: '#9B59B6',
    desc: 'Memberikan pembelaan hukum dan mendampingi klien selama proses persidangan.',
    audio: {
      intro:    { file: 'audio/advokat/advokat_intro',    formats: ['webm','mp3','ogg'] },
      pledoi:   { file: 'audio/advokat/advokat_pledoi',   formats: ['webm','mp3','ogg'] },
      sanggahan:{ file: 'audio/advokat/advokat_sanggahan',formats: ['webm','mp3','ogg'] },
    }
  },
  panitera: {
    id: 'panitera',
    name: 'Panitera',
    role: 'Panitera',
    icon: '📋',
    color: '#1ABC9C',
    desc: 'Mencatat jalannya persidangan dan membantu administrasi pengadilan.',
    audio: {
      intro: { file: 'audio/panitera/panitera_intro', formats: ['webm','mp3','ogg'] },
      baca:  { file: 'audio/panitera/panitera_baca',  formats: ['webm','mp3','ogg'] },
    }
  },
  pelapor: {
    id: 'pelapor',
    name: 'Pelapor',
    role: 'Pelapor',
    icon: '📢',
    color: '#E67E22',
    desc: 'Orang yang melaporkan dugaan tindak pidana kepada aparat penegak hukum.',
    audio: {
      intro:    { file: 'audio/pelapor/pelapor_intro',    formats: ['webm','mp3','ogg'] },
      laporan:  { file: 'audio/pelapor/pelapor_laporan',  formats: ['webm','mp3','ogg'] },
    }
  },
  penggugat: {
    id: 'penggugat',
    name: 'Penggugat',
    role: 'Penggugat',
    icon: '🙋',
    color: '#2ECC71',
    desc: 'Pihak yang mengajukan gugatan perdata di pengadilan.',
    audio: {
      intro:   { file: 'audio/penggugat/penggugat_intro',   formats: ['webm','mp3','ogg'] },
      gugatan: { file: 'audio/penggugat/penggugat_gugatan', formats: ['webm','mp3','ogg'] },
    }
  },
  tergugat: {
    id: 'tergugat',
    name: 'Tergugat',
    role: 'Tergugat',
    icon: '😮',
    color: '#E74C3C',
    desc: 'Pihak yang digugat dalam perkara perdata di pengadilan.',
    audio: {
      intro:    { file: 'audio/tergugat/tergugat_intro',    formats: ['webm','mp3','ogg'] },
      jawaban:  { file: 'audio/tergugat/tergugat_jawaban',  formats: ['webm','mp3','ogg'] },
    }
  }
};

// ============================================================
// Script dialog — data percakapan per sesi
// Setiap dialog memiliki: karakter, teks, audio key
// ============================================================
const COURT_SESSIONS = {
  kasus_korupsi: {
    title: 'Kasus Korupsi Pengadaan',
    number: 'No. 123/Pid.Sus/2024/PN.Jkt',
    dialogs: [
      {
        charId: 'panitera',
        audioKey: 'baca',
        text: 'Hadirin, sidang Pengadilan Negeri Jakarta Pusat akan segera dimulai. Harap tenang.',
        session: 'Pembukaan'
      },
      {
        charId: 'hakim',
        audioKey: 'intro',
        text: 'Sidang perkara Nomor 123/Pid.Sus/2024/PN.Jkt dinyatakan dibuka dan terbuka untuk umum.',
        session: 'Pembukaan'
      },
      {
        charId: 'hakim',
        audioKey: 'sumpah',
        text: 'Saudara terdakwa, apakah Anda dalam keadaan sehat dan siap mengikuti persidangan hari ini?',
        session: 'Identitas'
      },
      {
        charId: 'terdakwa',
        audioKey: 'intro',
        text: 'Ya, Yang Mulia. Saya sehat dan siap mengikuti persidangan.',
        session: 'Identitas'
      },
      {
        charId: 'jaksa',
        audioKey: 'intro',
        text: 'Yang Mulia, Jaksa Penuntut Umum siap membacakan surat dakwaan terhadap terdakwa.',
        session: 'Dakwaan'
      },
      {
        charId: 'jaksa',
        audioKey: 'tuntutan',
        text: 'Terdakwa didakwa telah melakukan tindak pidana korupsi dalam pengadaan barang dan jasa senilai Rp 5 miliar.',
        session: 'Dakwaan'
      },
      {
        charId: 'advokat',
        audioKey: 'sanggahan',
        text: 'Yang Mulia, kami keberatan atas dakwaan tersebut. Klien kami tidak terbukti melakukan perbuatan yang didakwakan.',
        session: 'Pembelaan'
      },
      {
        charId: 'saksi',
        audioKey: 'keterangan',
        text: 'Saya melihat langsung penandatanganan dokumen palsu tersebut. Itu bukan tanda tangan terdakwa.',
        session: 'Pembuktian'
      },
      {
        charId: 'hakim',
        audioKey: 'tanya',
        text: 'Baik. Berdasarkan fakta persidangan, majelis hakim akan bermusyawarah untuk menentukan putusan.',
        session: 'Putusan'
      },
      {
        charId: 'hakim',
        audioKey: 'putusan',
        text: 'Majelis hakim memutuskan: terdakwa TIDAK TERBUKTI secara sah dan meyakinkan. Terdakwa dibebaskan dari segala dakwaan.',
        session: 'Putusan'
      }
    ]
  },
  kasus_perdata: {
    title: 'Sengketa Tanah Perdata',
    number: 'No. 456/Pdt.G/2024/PN.Sby',
    dialogs: [
      {
        charId: 'panitera',
        audioKey: 'intro',
        text: 'Sidang perkara perdata sengketa tanah akan segera dimulai.',
        session: 'Pembukaan'
      },
      {
        charId: 'hakim',
        audioKey: 'intro',
        text: 'Sidang perkara perdata Nomor 456/Pdt.G/2024 dinyatakan dibuka.',
        session: 'Pembukaan'
      },
      {
        charId: 'penggugat',
        audioKey: 'gugatan',
        text: 'Yang Mulia, kami mengajukan gugatan karena tanah seluas 500 m² milik kami diklaim oleh pihak tergugat secara tidak sah.',
        session: 'Gugatan'
      },
      {
        charId: 'tergugat',
        audioKey: 'jawaban',
        text: 'Yang Mulia, kami memiliki sertifikat hak milik yang sah atas tanah tersebut. Gugatan penggugat tidak berdasar.',
        session: 'Jawaban'
      },
      {
        charId: 'hakim',
        audioKey: 'putusan',
        text: 'Majelis hakim menyatakan bahwa hak atas tanah tersebut sah milik penggugat berdasarkan bukti-bukti yang diajukan.',
        session: 'Putusan'
      }
    ]
  }
};

const GLOSSARY_DATA = [
  { term: 'Advokat', def: 'Orang yang berprofesi memberikan jasa hukum, baik di dalam maupun di luar pengadilan.' },
  { term: 'Dakwaan', def: 'Surat yang berisi uraian tindak pidana yang didakwakan kepada terdakwa.' },
  { term: 'Eksepsi', def: 'Keberatan yang diajukan terdakwa atau penasehat hukumnya atas dakwaan jaksa.' },
  { term: 'Gugatan', def: 'Tuntutan hak yang diajukan penggugat kepada pengadilan untuk diselesaikan.' },
  { term: 'Hakim', def: 'Pejabat yang melaksanakan kekuasaan kehakiman dan memutus perkara.' },
  { term: 'Inkracht', def: 'Putusan yang telah memperoleh kekuatan hukum tetap karena tidak ada upaya hukum lebih lanjut.' },
  { term: 'Jaksa', def: 'Pejabat fungsional yang bertindak sebagai penuntut umum dalam perkara pidana.' },
  { term: 'Kasasi', def: 'Upaya hukum ke Mahkamah Agung untuk membatalkan putusan pengadilan di bawahnya.' },
  { term: 'Mediasi', def: 'Proses penyelesaian sengketa dengan bantuan pihak ketiga yang netral.' },
  { term: 'Novum', def: 'Bukti baru yang ditemukan setelah putusan memperoleh kekuatan hukum tetap.' },
  { term: 'Panitera', def: 'Pejabat pengadilan yang membantu hakim dalam membuat berita acara persidangan.' },
  { term: 'Pledoi', def: 'Pembelaan terdakwa atau penasihat hukumnya terhadap tuntutan jaksa penuntut umum.' },
  { term: 'Replik', def: 'Jawaban penuntut umum atas pembelaan terdakwa.' },
  { term: 'Sidang', def: 'Persidangan di pengadilan yang dipimpin oleh hakim untuk memeriksa dan memutus perkara.' },
  { term: 'Terdakwa', def: 'Tersangka yang dituntut dan diperiksa di sidang pengadilan.' },
  { term: 'Tergugat', def: 'Pihak yang digugat dalam perkara perdata.' },
  { term: 'Vonis', def: 'Putusan hakim yang menentukan bersalah atau tidaknya terdakwa.' },
];

const TUTORIAL_STEPS = [
  { num: 1, title: 'Pilih Kasus', desc: 'Buka menu "Pilih Kasus" dan pilih salah satu kasus hukum yang tersedia.' },
  { num: 2, title: 'Buka Ruang Sidang', desc: 'Tekan "Ruang Sidang" untuk memulai simulasi persidangan dengan voice-over tiap karakter.' },
  { num: 3, title: 'Ikuti Dialog', desc: 'Tekan "Next ▶" untuk melanjutkan dialog. Audio diputar otomatis setiap giliran bicara.' },
  { num: 4, title: 'Pilih Karakter', desc: 'Ketuk chip karakter di panel bawah untuk mendengar voice-over karakter manapun secara langsung.' },
  { num: 5, title: 'Pelajari Hukum', desc: 'Buka Glosarium untuk memahami istilah hukum yang muncul dalam persidangan.' },
];