/*
  Warnings:

  - The `postType` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "postType",
ADD COLUMN     "postType" TEXT NOT NULL DEFAULT 'text';

-- DropEnum
DROP TYPE "PostType";
