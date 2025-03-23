/*
  Warnings:

  - Added the required column `amount` to the `GastoCompartilhado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `GastoCompartilhado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GastoCompartilhado" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
