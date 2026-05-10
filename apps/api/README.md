- How to run backend api

-- 1.move to app/api

`cd app/api`


-- 2.run database migrations

`npx prisma migrate dev --name init`


-- 3.generate client

`npx prisma generate`

*optional* If want to sync without migrations run, 
`npx prisma db push`


-- 4.run api service

`pnpm dev`