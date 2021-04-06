-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordChangedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "_user-follow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_user-follow_AB_unique" ON "_user-follow"("A", "B");

-- CreateIndex
CREATE INDEX "_user-follow_B_index" ON "_user-follow"("B");

-- AddForeignKey
ALTER TABLE "_user-follow" ADD FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user-follow" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
