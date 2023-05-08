-- CreateTable
CREATE TABLE "product" (
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lineItem" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "lineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_platform_id_key" ON "product"("platform_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_platform_id_key" ON "order"("platform_id");

-- AddForeignKey
ALTER TABLE "lineItem" ADD CONSTRAINT "lineItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("platform_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineItem" ADD CONSTRAINT "lineItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("platform_id") ON DELETE RESTRICT ON UPDATE CASCADE;
