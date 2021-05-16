import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";

export const Navbar = () => {
  const [session, loading] = useSession();

  return (
    <>
      <nav>
        <img src="/icons/logo.svg" alt="logo" width="40px" height="40px" />
        <Link href="/">Naslovnica</Link>
        <Link href="/setup">Aplikacija</Link>
        <div className="account">
          {session && !loading ? (
            <div>
              <Button variant="outlined" className="btn" onClick={signOut}>
                Sign out
              </Button>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          ) : (
            <Button variant="outlined" className="btn" onClick={signIn}>
              Sign in
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}
