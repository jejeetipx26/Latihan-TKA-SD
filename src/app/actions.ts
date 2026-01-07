'use server';

import { PrismaClient } from '@prisma/client';

// Setup Prisma Client agar tidak error saat hot-reload
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// --- 1. LOGIN USER ---
export async function loginUser(name: string, email: string) {
    try {
        // Cari user berdasarkan email
        let user = await prisma.user.findUnique({
            where: { email: email },
        });

        // Jika belum ada, buat user baru (Default: SISWA)
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    role: 'SISWA',
                },
            });
        }

        // Jika Guru ingin login, pastikan role di database sudah diubah jadi 'GURU' lewat Prisma Studio
        return { success: true, user: user };
    } catch (error) {
        console.error("Login Error:", error);
        return { success: false, error: "Gagal login" };
    }
}

// --- 2. SIMPAN NILAI ---
export async function submitScore(data: { name: string; email: string; grade: string; subject: string; score: number }) {
    try {
        await prisma.result.create({
            data: {
                name: data.name,
                email: data.email,
                grade: data.grade,
                subject: data.subject,
                score: data.score,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Gagal simpan nilai:", error);
        return { success: false };
    }
}

// --- 3. AMBIL DATA NILAI (UNTUK GURU) ---
export async function getScores() {
    try {
        const results = await prisma.result.findMany({
            orderBy: { createdAt: 'desc' }, // Urutkan dari yang terbaru
        });
        return results;
    } catch (error) {
        console.error("Gagal ambil data:", error);
        return [];
    }
}