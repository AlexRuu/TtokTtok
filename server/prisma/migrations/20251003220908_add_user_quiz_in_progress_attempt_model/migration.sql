-- AlterTable
ALTER TABLE "public"."QuizQuestion" ADD COLUMN     "userQuizInProgressId" TEXT;

-- CreateTable
CREATE TABLE "public"."UserQuizInProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "UserQuizInProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."QuizQuestion" ADD CONSTRAINT "QuizQuestion_userQuizInProgressId_fkey" FOREIGN KEY ("userQuizInProgressId") REFERENCES "public"."UserQuizInProgress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserQuizInProgress" ADD CONSTRAINT "UserQuizInProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
