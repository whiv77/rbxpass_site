-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "short_code" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "gamepass_id" TEXT NOT NULL,
    "gamepass_url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Code" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "used_at" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_short_code_key" ON "Order"("short_code");

-- CreateIndex
CREATE INDEX "Order_code_idx" ON "Order"("code");

-- CreateIndex
CREATE INDEX "Order_short_code_idx" ON "Order"("short_code");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Code_code_key" ON "Code"("code");
