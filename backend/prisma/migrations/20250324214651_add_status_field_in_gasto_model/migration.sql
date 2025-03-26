/*
  Warnings:

  - You are about to drop the column `status` on the `GastoCompartilhado` table. All the data in the column will be lost.
  - Added the required column `status` to the `Gasto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gasto" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GastoCompartilhado" DROP COLUMN "status";
