const fs = require('fs');
const path = require('path');

const schemaBase = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;

const modelsDir = path.join(__dirname, '..', 'prisma', 'models');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

const modelFiles = fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.prisma'))
  .sort();

const models = modelFiles.map(file => {
  const content = fs.readFileSync(path.join(modelsDir, file), 'utf8');
  return content;
}).join('\n\n');

const fullSchema = schemaBase + '\n' + models;

fs.writeFileSync(schemaPath, fullSchema, 'utf8');