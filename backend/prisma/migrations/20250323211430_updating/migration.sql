/*
  Warnings:

  - You are about to drop the column `amount` on the `GastoCompartilhado` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `GastoCompartilhado` table. All the data in the column will be lost.
  - Added the required column `valor` to the `GastoCompartilhado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GastoCompartilhado" DROP COLUMN "amount",
DROP COLUMN "createdAt",
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "valor" DOUBLE PRECISION NOT NULL;
