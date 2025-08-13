
export interface User {
  nama: string;
  peran: 'Admin' | 'Karyawan';
  id: string;
}

export interface SOP {
  id: string;
  judul: string;
  kategori: string;
  departemen: string;
  tag: string[];
  versi: string;
  diunggah_oleh: string;
  tanggal: string;
  ringkasan: string;
  file: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  riwayat_versi?: SOPVersion[];
}

export interface SOPVersion {
  versi: string;
  diunggah_oleh: string;
  tanggal: string;
  perubahan: string;
  file: string;
}

export interface Kategori {
  id: string;
  nama: string;
  warna: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  pesan: string;
  jawaban: string;
  timestamp: string;
  sop_terkait?: string;
}
