/*
  Warnings:

  - The primary key for the `DayMood` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DayMood` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DayMood" (
    "moodId" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    PRIMARY KEY ("day", "month", "year"),
    CONSTRAINT "DayMood_moodId_fkey" FOREIGN KEY ("moodId") REFERENCES "Mood" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DayMood" ("day", "month", "moodId", "year") SELECT "day", "month", "moodId", "year" FROM "DayMood";
DROP TABLE "DayMood";
ALTER TABLE "new_DayMood" RENAME TO "DayMood";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
