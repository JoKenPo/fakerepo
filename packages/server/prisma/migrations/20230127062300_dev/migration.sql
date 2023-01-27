-- CreateTable
CREATE TABLE "permissoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "id_permissao" TEXT NOT NULL,
    "url_foto" TEXT NOT NULL,
    "id_cliente" TEXT NOT NULL,
    CONSTRAINT "usuarios_id_permissao_fkey" FOREIGN KEY ("id_permissao") REFERENCES "permissoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "usuarios_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
