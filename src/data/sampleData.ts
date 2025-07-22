
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
    ringkasan: `SOP ini mengatur seluruh proses rekrutmen dari tahap perencanaan hingga onboarding karyawan baru di lingkungan PAC.

**Tujuan:** Memastikan proses rekrutmen yang terstruktur, transparan, dan efisien untuk mendapatkan kandidat terbaik.

**Ruang Lingkup:** Berlaku untuk seluruh divisi yang membutuhkan penambahan karyawan.

**Langkah-langkah:**
1. Analisis kebutuhan SDM oleh line manager
2. Pembuatan job description dan posting lowongan
3. Screening CV dan tes administrasi
4. Interview tahap 1 (HR) dan tahap 2 (User)
5. Background check dan verifikasi dokumen
6. Negosiasi salary dan penerbitan offering letter
7. Proses onboarding dan orientasi

**PIC:** HR Recruiter, Line Manager, dan HR Generalist.

**Batas Waktu:** Maksimal 30 hari kerja dari posting hingga kandidat bergabung.

**Catatan Tambahan:** Proses dapat dipercepat untuk posisi urgent dengan approval khusus dari Head of HR.`,
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
    ringkasan: `SOP ini mengatur seluruh proses penggajian bulanan untuk memastikan akurasi pembayaran dan kepatuhan terhadap regulasi perpajakan.

**Tujuan:** Memastikan proses payroll yang akurat, tepat waktu, dan sesuai dengan ketentuan perpajakan yang berlaku.

**Ruang Lingkup:** Berlaku untuk seluruh karyawan tetap, kontrak, dan freelancer PAC.

**Langkah-langkah:**
1. Pengumpulan data kehadiran dari sistem absensi
2. Kalkulasi gaji pokok, tunjangan, dan overtime
3. Perhitungan potongan (BPJS, pajak, cicilan)
4. Review dan approval oleh Finance Manager
5. Transfer gaji melalui sistem perbankan
6. Distribusi slip gaji digital
7. Pelaporan pajak PPh 21 ke DJP

**PIC:** Payroll Specialist, Finance Manager, dan Tax Officer.

**Batas Waktu:** Gaji harus ditransfer maksimal tanggal 25 setiap bulan.

**Catatan Tambahan:** Untuk karyawan baru atau resign, perhitungan dilakukan pro-rata sesuai hari kerja efektif.`,
    file: 'sop_penggajian_bulanan_v2_2.pdf',
    riwayat_versi: [
      { versi: 'v1.0', diunggah_oleh: 'David Effendi', tanggal: '2025-05-01', perubahan: 'Upload awal', file: 'sop_penggajian_v1.pdf' },
      { versi: 'v2.0', diunggah_oleh: 'David Effendi', tanggal: '2025-06-10', perubahan: 'Penambahan formula lembur', file: 'sop_penggajian_v2.pdf' },
      { versi: 'v2.2', diunggah_oleh: 'David Effendi', tanggal: '2025-07-05', perubahan: 'Update perhitungan pajak 2025', file: 'sop_penggajian_bulanan_v2_2.pdf' }
    ]
  },
  {
    id: 'sop-3',
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
    id: 'sop-4',
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
    id: 'sop-5',
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
    sop_terkait: 'sop-3'
  },
  {
    id: '2',
    pesan: 'Bagaimana proses rekrutmen karyawan baru?',
    jawaban: 'Ditemukan: SOP Rekrutmen HR v3. Mencakup tahapan dari posting lowongan, seleksi berkas, interview, background check hingga orientasi karyawan.',
    timestamp: '2025-07-22 11:15',
    sop_terkait: 'sop-1'
  }
];
