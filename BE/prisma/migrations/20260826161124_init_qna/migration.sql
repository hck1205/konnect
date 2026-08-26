-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'APPLE', 'LINKEDIN', 'KAKAO', 'NAVER');

-- CreateEnum
CREATE TYPE "Topic" AS ENUM ('VISA', 'LANGUAGE', 'EDUCATION', 'HOUSING', 'WORK', 'SOCIAL');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('OPEN', 'HIDDEN');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(36) NOT NULL,
    "nickname" VARCHAR(24) NOT NULL,
    "avatarUrl" VARCHAR(500),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_identities" (
    "id" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "providerId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" VARCHAR(36) NOT NULL,
    "authorId" VARCHAR(36) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "topic" "Topic" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'OPEN',
    "acceptedAnswerId" VARCHAR(36),
    "answerCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" VARCHAR(36) NOT NULL,
    "questionId" VARCHAR(36) NOT NULL,
    "authorId" VARCHAR(36) NOT NULL,
    "body" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" VARCHAR(36) NOT NULL,
    "namespace" VARCHAR(24),
    "value" VARCHAR(64) NOT NULL,
    "raw" VARCHAR(96) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_tags" (
    "questionId" VARCHAR(36) NOT NULL,
    "tagId" VARCHAR(36) NOT NULL,

    CONSTRAINT "question_tags_pkey" PRIMARY KEY ("questionId","tagId")
);

-- CreateIndex
CREATE INDEX "users_nickname_idx" ON "users"("nickname");

-- CreateIndex
CREATE INDEX "auth_identities_userId_idx" ON "auth_identities"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_identities_provider_providerId_key" ON "auth_identities"("provider", "providerId");

-- CreateIndex
CREATE INDEX "questions_status_id_idx" ON "questions"("status", "id" DESC);

-- CreateIndex
CREATE INDEX "questions_topic_status_id_idx" ON "questions"("topic", "status", "id" DESC);

-- CreateIndex
CREATE INDEX "questions_authorId_id_idx" ON "questions"("authorId", "id" DESC);

-- CreateIndex
CREATE INDEX "questions_status_answerCount_id_idx" ON "questions"("status", "answerCount", "id" DESC);

-- CreateIndex
CREATE INDEX "answers_questionId_id_idx" ON "answers"("questionId", "id");

-- CreateIndex
CREATE INDEX "answers_authorId_id_idx" ON "answers"("authorId", "id" DESC);

-- CreateIndex
CREATE INDEX "tags_namespace_value_idx" ON "tags"("namespace", "value");

-- CreateIndex
CREATE UNIQUE INDEX "tags_raw_key" ON "tags"("raw");

-- CreateIndex
CREATE INDEX "question_tags_tagId_questionId_idx" ON "question_tags"("tagId", "questionId");

-- AddForeignKey
ALTER TABLE "auth_identities" ADD CONSTRAINT "auth_identities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_tags" ADD CONSTRAINT "question_tags_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_tags" ADD CONSTRAINT "question_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
