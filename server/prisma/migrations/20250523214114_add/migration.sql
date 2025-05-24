-- AlterTable
CREATE SEQUENCE unit_unitnumber_seq;
ALTER TABLE "Unit" ALTER COLUMN "unitNumber" SET DEFAULT nextval('unit_unitnumber_seq');
ALTER SEQUENCE unit_unitnumber_seq OWNED BY "Unit"."unitNumber";
