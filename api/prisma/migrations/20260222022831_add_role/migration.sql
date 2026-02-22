-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLUMBER', 'ADMIN');

-- AlterTable
ALTER TABLE "Plumber" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PLUMBER';
