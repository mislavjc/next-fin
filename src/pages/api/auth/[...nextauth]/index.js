import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Email({
      server: process.env.SMTP_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  database: process.env.DB_CONN_STR,
});
