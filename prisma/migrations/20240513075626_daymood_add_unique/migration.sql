/*
  Warnings:

  - A unique constraint covering the columns `[day,month,year]` on the table `DayMood` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DayMood_day_month_year_key" ON "DayMood"("day", "month", "year");
