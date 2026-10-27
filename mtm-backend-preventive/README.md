# MTM Maintenance - Backend Preventive (CMMS)

Layanan pemeliharaan terencana (*Computerized Maintenance Management System*) untuk **PT Menara Terus Makmur (Astra Otoparts Group)**.

## Ruang Lingkup Layanan
1. **Autentikasi & Otorisasi Pengguna**: Login dengan NPK / Username, verifikasi JWT.
2. **Corrective Maintenance (CM)**:
   - Tiket perbaikan mesin breakdown, target MTTR, tindakan perbaikan (*action taken*).
   - **Otomatisasi Tiket dari Predictive**: Dilengkapi webhook `/api/internal/alert-wo` yang secara otomatis membuat Work Order prioritas tinggi saat Backend Predictive (Repo 2) mendeteksi getaran ISO atau suhu di zona bahaya.
3. **Preventive Maintenance (PM)**:
   - Kalender jadwal pemeliharaan berkala 52 minggu (*Weekly, Monthly, Quarterly, Yearly*).
   - Check sheet SOP inspeksi mesin Jingduan Forging Press 630T.
4. **Total Productive Maintenance (TPM)**:
   - Papan Kanban pemeliharaan mandiri oleh operator (*Autonomous Maintenance*).
5. **Manajemen Suku Cadang (Spare Parts)**:
   - Monitoring stok kritis, lokasi rak, dan kalkulasi batas usia pakai komponen (*Lifetime Running Hours*).

## Port & Endpoints (Port 4002)
- `POST /api/auth/login`: Autentikasi NPK & penerbitan token JWT
- `GET /api/cm-tickets` & `POST /api/cm-tickets`: Manajemen tiket perbaikan
- `GET /api/pm-schedules` & `PUT /api/pm-schedules/:id/complete`: Jadwal kalender PM
- `GET /api/tpm-tasks` & `PUT /api/tpm-tasks/:id/check`: Pengecekan mandiri TPM
- `GET /api/spare-parts` & `PUT /api/spare-parts/:id/stock`: Stok suku cadang
- `POST /api/internal/alert-wo`: Webhook penerima alert anomali dari Backend Predictive

## Menjalankan Layanan
```bash
# 1. Install dependencies
npm install

# 2. Setup database schema
npx prisma generate
npx prisma migrate dev --name init_preventive

# 3. Jalankan server dev
npm run start:dev
```

## Cara Push ke Git Repo Baru Anda
```bash
git init
git add .
git commit -m "feat: initial commit mtm backend preventive cmms with auto work order webhook"
git branch -M main
git remote add origin <URL_REPO_PREVENTIVE_ANDA>
git push -u origin main
```
