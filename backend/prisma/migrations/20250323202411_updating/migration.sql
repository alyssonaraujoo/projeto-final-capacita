/*
  Warnings:

  - You are about to drop the column `amount` on the `Gasto` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Gasto` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Gasto` table. All the data in the column will be lost.
  - Added the required column `descricao` to the `Gasto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `Gasto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gasto" DROP COLUMN "amount",
DROP COLUMN "createdAt",
DROP COLUMN "description",
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "valor" DOUBLE PRECISION NOT NULL;
