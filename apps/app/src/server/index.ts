import jwt from 'jsonwebtoken';
import { router } from './trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from "cors";
import { userRouter } from './routers/userRouter';
import { emailRouter } from './routers/emailRouter';
import { serverRouter } from './routers/serverRouter';
import { channelRouter } from './routers/channelRouter';
// export const secret = 'Se3rEt';

// using trpc
export const appRouter = router({
    user: userRouter,
    email: emailRouter,
    server: serverRouter,
    channel:channelRouter
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    router: appRouter,
    middleware: cors(),
    createContext(opts) {
        let authHeader = opts.req.headers["authorization"];

        console.log('first');

        if (authHeader) {
            const token = authHeader.split(' ')[1];
    
            return new Promise((resolve) => {
              jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
                  if (user) {
                      resolve({userId: user.email as string});
                  } else {
                      resolve({});
                  }
              });
          })
    
        }

        return {};
    }
});
   
server.listen(3000);