-- CreateTable
CREATE TABLE "Mood" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Mood_name_key" ON "Mood"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Mood_color_key" ON "Mood"("color");
