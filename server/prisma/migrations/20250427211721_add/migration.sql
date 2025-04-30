-- AlterTable
ALTER TABLE "ForgotPasswordToken" ADD COLUMN     "usedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "usedAt" TIMESTAMP(3);
