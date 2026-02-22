/**
 * Script de création du premier compte Admin
 *
 * Usage :
 *   npx ts-node src/scripts/create-admin.ts admin@plombiers.bj motdepasse123 "Nom Admin"
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const [email, password, name] = process.argv.slice(2);

  if (!email || !password || !name) {
    console.error(
      'Usage: npx ts-node src/scripts/create-admin.ts <email> <password> <name>',
    );
    process.exit(1);
  }

  const existing = await prisma.plumber.findUnique({ where: { email } });
  if (existing) {
    // Si le compte existe déjà, on le passe juste en ADMIN
    const updated = await prisma.plumber.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log(
      `✅ Compte existant promu Admin : ${updated.name} (${updated.email})`,
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.plumber.create({
    data: {
      name,
      email,
      phone: '00000000',
      city: 'Cotonou',
      password: hashedPassword,
      verified: true,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin créé avec succès !`);
  console.log(`   Nom   : ${admin.name}`);
  console.log(`   Email : ${admin.email}`);
  console.log(`   Rôle  : ${admin.role}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
