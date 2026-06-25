-- CreateEnum
CREATE TYPE "Facing" AS ENUM ('NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST');

-- CreateEnum
CREATE TYPE "ConstructionStatus" AS ENUM ('READY_TO_MOVE', 'UNDER_CONSTRUCTION');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('NEW', 'RESALE');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "constructionStatus" "ConstructionStatus",
ADD COLUMN     "facing" "Facing",
ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "hasBoundaryWall" BOOLEAN,
ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "openSides" INTEGER,
ADD COLUMN     "roadWidthFeet" INTEGER,
ADD COLUMN     "transactionType" "TransactionType";
