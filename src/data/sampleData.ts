
import { SOP, Kategori, ChatMessage } from '@/types/sop';

export const kategoris: Kategori[] = [
  { id: '1', nama: 'SDM & Organisasi', warna: 'bg-blue-500', icon: '👥' },
  { id: '2', nama: 'Keuangan & Audit', warna: 'bg-green-500', icon: '💰' },
  { id: '3', nama: 'IT & Keamanan', warna: 'bg-purple-500', icon: '🔒' },
  { id: '4', nama: 'Produksi & Operasional', warna: 'bg-orange-500', icon: '⚙️' },
  { id: '5', nama: 'Umum & Administrasi', warna: 'bg-gray-500', icon: '📋' },
];

export const sops: SOP[] = [
  {
    id: '1',
    judul: 'SOP Rekrutmen HR v3',
    kategori: 'SDM & Organisasi',
    departemen: 'HR',
    tag: ['#Rekrutmen', '#HR'],
    versi: 'v3.0',
    diunggah_oleh: 'Indira Kamila',
    tanggal: '2025-07-10',
    ringkasan: 'Proses seleksi dan onboarding karyawan baru untuk seluruh unit HR. Mencakup tahapan dari posting lowongan hingga orientasi karyawan.',
    file: 'sop_rekrutmen_hr_v3.pdf',
    riwayat_versi: [
      { versi: 'v1.0', diunggah_oleh: 'Indira Kamila', tanggal: '2025-06-01', perubahan: 'Upload awal', file: 'sop_rekrutmen_hr_v1.pdf' },
      { versi: 'v2.0', diunggah_oleh: 'Indira Kamila', tanggal: '2025-06-15', perubahan: 'Penambahan checklist interview', file: 'sop_rekrutmen_hr_v2.pdf' },
      { versi: 'v3.0', diunggah_oleh: 'Indira Kamila', tanggal: '2025-07-10', perubahan: 'Revisi alur background check', file: 'sop_rekrutmen_hr_v3.pdf' }
    ]
  },
  {
    id: '2',
    judul: 'SOP Penggajian Bulanan v2.2',
    kategori: 'Keuangan & Audit',
    departemen: 'Keuangan',
    tag: ['#Payroll', '#Keuangan'],
    versi: 'v2.2',
    diunggah_oleh: 'David Effendi',
    tanggal: '2025-07-05',
    ringkasan: 'Menjelaskan waktu pembayaran, struktur gaji, dan laporan pajak bulanan. Termasuk proses perhitungan lembur dan tunjangan.',
    file: 'sop_penggajian_bulanan_v2_2.pdf',
    riwayat_versi: [
      { versi: 'v1.0', diunggah_oleh: 'David Effendi', tanggal: '2025-05-01', perubahan: 'Upload awal', file: 'sop_penggajian_v1.pdf' },
      { versi: 'v2.0', diunggah_oleh: 'David Effendi', tanggal: '2025-06-10', perubahan: 'Penambahan formula lembur', file: 'sop_penggajian_v2.pdf' },
      { versi: 'v2.2', diunggah_oleh: 'David Effendi', tanggal: '2025-07-05', perubahan: 'Update perhitungan pajak 2025', file: 'sop_penggajian_bulanan_v2_2.pdf' }
    ]
  },
  {
    id: '3',
    judul: 'SOP Pengajuan Lembur v2.0',
    kategori: 'SDM & Organisasi',
    departemen: 'HR',
    tag: ['#Lembur', '#Formulir'],
    versi: 'v2.0',
    diunggah_oleh: 'Indira Kamila',
    tanggal: '2025-06-28',
    ringkasan: 'Formulir pengajuan lembur harus disetujui atasan & HR sebelum dilakukan. Maksimal 4 jam per hari dengan persetujuan khusus.',
    file: 'sop_lembur_v2.pdf'
  },
  {
    id: '4',
    judul: 'SOP Keamanan IT v1.5',
    kategori: 'IT & Keamanan',
    departemen: 'IT',
    tag: ['#Keamanan', '#Password', '#Akses'],
    versi: 'v1.5',
    diunggah_oleh: 'Indira Kamila',
    tanggal: '2025-07-15',
    ringkasan: 'Panduan keamanan akses sistem, pengelolaan password, dan protokol backup data perusahaan.',
    file: 'sop_keamanan_it_v1_5.pdf'
  },
  {
    id: '5',
    judul: 'SOP Audit Internal v3.1',
    kategori: 'Keuangan & Audit',
    departemen: 'Keuangan',
    tag: ['#Audit', '#Laporan'],
    versi: 'v3.1',
    diunggah_oleh: 'David Effendi',
    tanggal: '2025-07-20',
    ringkasan: 'Prosedur audit internal bulanan dan triwulanan, termasuk checklist dan format laporan audit.',
    file: 'sop_audit_internal_v3_1.pdf'
  }
];

export const chatMessages: ChatMessage[] = [
  {
    id: '1',
    pesan: 'SOP lembur karyawan gimana?',
    jawaban: 'Ditemukan: SOP Pengajuan Lembur v2.0. Ringkasan: Formulir pengajuan lembur harus disetujui atasan & HR sebelum dilakukan. Maksimal 4 jam per hari.',
    timestamp: '2025-07-22 10:30',
    sop_terkait: '3'
  },
  {
    id: '2',
    pesan: 'Bagaimana proses rekrutmen karyawan baru?',
    jawaban: 'Ditemukan: SOP Rekrutmen HR v3. Mencakup tahapan dari posting lowongan, seleksi berkas, interview, background check hingga orientasi karyawan.',
    timestamp: '2025-07-22 11:15',
    sop_terkait: '1'
  }
];
