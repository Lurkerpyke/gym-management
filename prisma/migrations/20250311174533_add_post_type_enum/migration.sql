/*
  Warnings:

  - The `postType` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('text', 'image', 'video');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "postType",
ADD COLUMN     "postType" "PostType" NOT NULL DEFAULT 'text';
