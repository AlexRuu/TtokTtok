-- AlterTable
ALTER TABLE "ForgotPasswordToken" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;
