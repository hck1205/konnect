-- AlterTable
ALTER TABLE "question_tags" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "question_tags_questionId_position_idx" ON "question_tags"("questionId", "position");
